import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  getBlockedUserIds,
} from "./user-blocks";
import type {
  Notification,
  NotificationActor,
  NotificationType,
  NotificationWithActor,
} from "../types/notification";

type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  type:
    NotificationType;
  postId?:
    | string
    | null;
};

type NotificationRow = {
  id: string;
  recipient_id: string;
  actor_id: string;
  type:
    NotificationType;
  post_id:
    | string
    | null;
  is_read: boolean;
  created_at: string;
};

type ProfileRow = {
  id: string;
  username:
    | string
    | null;
  avatar_url:
    | string
    | null;
};

const NOTIFICATION_LIMIT =
  50;

function assertRequiredText(
  value: string,
  label: string
): string {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new Error(
      `${label}が指定されていません。`
    );
  }

  return normalizedValue;
}

function mapNotification(
  row: NotificationRow
): Notification {
  return {
    id:
      row.id,

    recipientId:
      row.recipient_id,

    actorId:
      row.actor_id,

    type:
      row.type,

    postId:
      row.post_id,

    isRead:
      row.is_read,

    createdAt:
      row.created_at,
  };
}

function createBlockedActorFilter(
  blockedUserIds:
    Set<string>
): string | null {
  if (
    blockedUserIds.size ===
    0
  ) {
    return null;
  }

  return `(${[
    ...blockedUserIds,
  ].join(",")})`;
}

export async function createNotification(
  supabase: SupabaseClient,
  input: CreateNotificationInput
): Promise<void> {
  const recipientId =
    assertRequiredText(
      input.recipientId,
      "通知先ユーザーID"
    );

  const actorId =
    assertRequiredText(
      input.actorId,
      "操作ユーザーID"
    );

  if (
    recipientId ===
    actorId
  ) {
    return;
  }

  const normalizedPostId =
    input.postId
      ?.trim() ||
    null;

  const {
    error,
  } =
    await supabase.rpc(
      "create_or_refresh_notification",
      {
        recipient_user_id:
          recipientId,

        actor_user_id:
          actorId,

        notification_type:
          input.type,

        notification_post_id:
          normalizedPostId,
      }
    );

  if (error) {
    throw new Error(
      `通知の作成に失敗しました: ${error.message}`
    );
  }
}

export async function getNotifications(
  supabase: SupabaseClient,
  recipientId: string
): Promise<
  Notification[]
> {
  const normalizedRecipientId =
    assertRequiredText(
      recipientId,
      "ユーザーID"
    );

  const blockedUserIds =
    await getBlockedUserIds(
      supabase,
      normalizedRecipientId
    );

  const blockedActorFilter =
    createBlockedActorFilter(
      blockedUserIds
    );

  let notificationsQuery =
    supabase
      .from(
        "notifications"
      )
      .select(
        `
          id,
          recipient_id,
          actor_id,
          type,
          post_id,
          is_read,
          created_at
        `
      )
      .eq(
        "recipient_id",
        normalizedRecipientId
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );

  if (
    blockedActorFilter
  ) {
    notificationsQuery =
      notificationsQuery.not(
        "actor_id",
        "in",
        blockedActorFilter
      );
  }

  const {
    data,
    error,
  } =
    await notificationsQuery
      .limit(
        NOTIFICATION_LIMIT
      )
      .returns<
        NotificationRow[]
      >();

  if (error) {
    throw new Error(
      `通知を取得できませんでした: ${error.message}`
    );
  }

  return (
    data ??
    []
  ).map(
    mapNotification
  );
}

export async function getNotificationsWithActors(
  supabase: SupabaseClient,
  recipientId: string
): Promise<
  NotificationWithActor[]
> {
  const notifications =
    await getNotifications(
      supabase,
      recipientId
    );

  if (
    notifications.length ===
    0
  ) {
    return [];
  }

  const actorIds = [
    ...new Set(
      notifications.map(
        (
          notification
        ) =>
          notification.actorId
      )
    ),
  ];

  const {
    data:
      profiles,
    error,
  } =
    await supabase
      .from(
        "profiles"
      )
      .select(
        `
          id,
          username,
          avatar_url
        `
      )
      .in(
        "id",
        actorIds
      )
      .returns<
        ProfileRow[]
      >();

  if (error) {
    throw new Error(
      `通知のユーザー情報を取得できませんでした: ${error.message}`
    );
  }

  const profileMap =
    new Map<
      string,
      NotificationActor
    >(
      (
        profiles ??
        []
      ).map(
        (
          profile
        ) => [
          profile.id,
          {
            id:
              profile.id,

            username:
              profile.username,

            avatarUrl:
              profile.avatar_url,
          },
        ]
      )
    );

  return notifications.map(
    (
      notification
    ): NotificationWithActor => ({
      notification,

      actor:
        profileMap.get(
          notification.actorId
        ) ??
        null,
    })
  );
}

export async function getUnreadNotificationCount(
  supabase: SupabaseClient,
  recipientId: string
): Promise<number> {
  const normalizedRecipientId =
    assertRequiredText(
      recipientId,
      "ユーザーID"
    );

  const blockedUserIds =
    await getBlockedUserIds(
      supabase,
      normalizedRecipientId
    );

  const blockedActorFilter =
    createBlockedActorFilter(
      blockedUserIds
    );

  let unreadCountQuery =
    supabase
      .from(
        "notifications"
      )
      .select(
        "*",
        {
          count:
            "exact",

          head:
            true,
        }
      )
      .eq(
        "recipient_id",
        normalizedRecipientId
      )
      .eq(
        "is_read",
        false
      );

  if (
    blockedActorFilter
  ) {
    unreadCountQuery =
      unreadCountQuery.not(
        "actor_id",
        "in",
        blockedActorFilter
      );
  }

  const {
    count,
    error,
  } =
    await unreadCountQuery;

  if (error) {
    throw new Error(
      `未読通知数を取得できませんでした: ${error.message}`
    );
  }

  return count ?? 0;
}

export async function markNotificationAsRead(
  supabase: SupabaseClient,
  notificationId: string,
  recipientId: string
): Promise<void> {
  const normalizedNotificationId =
    assertRequiredText(
      notificationId,
      "通知ID"
    );

  const normalizedRecipientId =
    assertRequiredText(
      recipientId,
      "ユーザーID"
    );

  const {
    error,
  } =
    await supabase
      .from(
        "notifications"
      )
      .update({
        is_read:
          true,
      })
      .eq(
        "id",
        normalizedNotificationId
      )
      .eq(
        "recipient_id",
        normalizedRecipientId
      );

  if (error) {
    throw new Error(
      `通知を既読にできませんでした: ${error.message}`
    );
  }
}

export async function markAllNotificationsAsRead(
  supabase: SupabaseClient,
  recipientId: string
): Promise<void> {
  const normalizedRecipientId =
    assertRequiredText(
      recipientId,
      "ユーザーID"
    );

  const {
    error,
  } =
    await supabase
      .from(
        "notifications"
      )
      .update({
        is_read:
          true,
      })
      .eq(
        "recipient_id",
        normalizedRecipientId
      )
      .eq(
        "is_read",
        false
      );

  if (error) {
    throw new Error(
      `通知を一括で既読にできませんでした: ${error.message}`
    );
  }
}

export function getNotificationMessage(
  notification:
    Notification,
  actorName: string
): string {
  switch (
    notification.type
  ) {
    case "like":
      return `${actorName}さんがあなたのサ活にいいねしました。`;

    case "comment":
      return `${actorName}さんがあなたのサ活にコメントしました。`;

    case "follow":
      return `${actorName}さんがあなたをフォローしました。`;

    default:
      return "新しい通知があります。";
  }
}
