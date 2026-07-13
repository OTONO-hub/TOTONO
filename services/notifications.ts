import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  Notification,
  NotificationType,
  NotificationWithActor,
} from "@/types/notification";
import type { Profile } from "@/types/profile";

type CreateNotificationInput = {
  recipientId: string;
  actorId: string;
  type: NotificationType;
  postId?: string | null;
};

type NotificationRow = {
  id: string;
  recipient_id: string;
  actor_id: string;
  type: NotificationType;
  post_id: string | null;
  is_read: boolean;
  created_at: string;
};

function mapNotification(
  notification: NotificationRow
): Notification {
  return {
    id: notification.id,
    recipientId: notification.recipient_id,
    actorId: notification.actor_id,
    type: notification.type,
    postId: notification.post_id,
    isRead: notification.is_read,
    createdAt: notification.created_at,
  };
}

export async function createNotification(
  supabase: SupabaseClient,
  input: CreateNotificationInput
) {
  if (input.recipientId === input.actorId) {
    return;
  }

  const { error } = await supabase
    .from("notifications")
    .insert({
      recipient_id: input.recipientId,
      actor_id: input.actorId,
      type: input.type,
      post_id: input.postId ?? null,
    });

  if (error) {
    throw new Error(error.message);
  }
}

export async function getNotifications(
  supabase: SupabaseClient,
  recipientId: string
): Promise<Notification[]> {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("recipient_id", recipientId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((notification) =>
    mapNotification(notification as NotificationRow)
  );
}

export async function getNotificationsWithActors(
  supabase: SupabaseClient,
  recipientId: string
): Promise<NotificationWithActor[]> {
  const notifications = await getNotifications(
    supabase,
    recipientId
  );

  if (notifications.length === 0) {
    return [];
  }

  const actorIds = [
    ...new Set(
      notifications.map(
        (notification) => notification.actorId
      )
    ),
  ];

  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", actorIds);

  if (error) {
    throw new Error(error.message);
  }

  const profileMap = new Map(
    ((profiles ?? []) as Profile[]).map((profile) => [
      profile.id,
      profile,
    ])
  );

  return notifications.map((notification) => ({
    notification,
    actor:
      profileMap.get(notification.actorId) ?? null,
  }));
}

export async function getUnreadNotificationCount(
  supabase: SupabaseClient,
  recipientId: string
) {
  const { count, error } = await supabase
    .from("notifications")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("recipient_id", recipientId)
    .eq("is_read", false);

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function markNotificationAsRead(
  supabase: SupabaseClient,
  notificationId: string,
  recipientId: string
) {
  const { error } = await supabase
    .from("notifications")
    .update({
      is_read: true,
    })
    .eq("id", notificationId)
    .eq("recipient_id", recipientId);

  if (error) {
    throw new Error(error.message);
  }
}