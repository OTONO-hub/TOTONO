import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  Bell,
  CheckCheck,
  Heart,
  MessageCircle,
  RefreshCw,
  UserPlus,
  UserRound,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  getNotificationMessage,
  getNotificationsWithActors,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "../services/notifications";
import type {
  NotificationType,
  NotificationWithActor,
} from "../types/notification";

type NotificationsScreenProps = {
  currentUserId: string;
  onSelectPost: (
    postId: string
  ) => void;
  onSelectUser: (
    userId: string
  ) => void;
  onUnreadCountChange: (
    count: number
  ) => void;
};

function formatNotificationDate(
  createdAt: string
): string {
  const date =
    new Date(
      createdAt
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const elapsedMilliseconds =
    Date.now() -
    date.getTime();

  const elapsedMinutes =
    Math.max(
      0,
      Math.floor(
        elapsedMilliseconds /
          60000
      )
    );

  if (
    elapsedMinutes <
    1
  ) {
    return "たった今";
  }

  if (
    elapsedMinutes <
    60
  ) {
    return `${elapsedMinutes}分前`;
  }

  const elapsedHours =
    Math.floor(
      elapsedMinutes /
        60
    );

  if (
    elapsedHours <
    24
  ) {
    return `${elapsedHours}時間前`;
  }

  const elapsedDays =
    Math.floor(
      elapsedHours /
        24
    );

  if (
    elapsedDays <
    7
  ) {
    return `${elapsedDays}日前`;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone:
        "Asia/Tokyo",
      month:
        "short",
      day:
        "numeric",
    }
  ).format(
    date
  );
}

function getActorName(
  item: NotificationWithActor
): string {
  const username =
    item.actor
      ?.username
      ?.trim();

  return (
    username ||
    "TOTONOユーザー"
  );
}

function getNotificationIcon(
  type: NotificationType
): ReactNode {
  switch (type) {
    case "like":
      return (
        <Heart
          aria-hidden="true"
        />
      );

    case "comment":
      return (
        <MessageCircle
          aria-hidden="true"
        />
      );

    case "follow":
      return (
        <UserPlus
          aria-hidden="true"
        />
      );

    default:
      return (
        <Bell
          aria-hidden="true"
        />
      );
  }
}

function NotificationsLoading() {
  return (
    <div
      className="notifications-loading"
      role="status"
      aria-live="polite"
    >
      {[1, 2, 3, 4].map(
        (
          item
        ) => (
          <div
            key={
              item
            }
            className="notifications-loading-item"
          >
            <div />

            <span />
          </div>
        )
      )}

      <p>
        通知を読み込んでいます...
      </p>
    </div>
  );
}

function NotificationsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="notifications-error"
      role="alert"
    >
      <strong>
        通知を読み込めませんでした
      </strong>

      <p>
        {message}
      </p>

      <button
        type="button"
        onClick={
          onRetry
        }
      >
        <RefreshCw
          aria-hidden="true"
        />

        もう一度試す
      </button>
    </div>
  );
}

function NotificationsEmpty({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  return (
    <div className="notifications-empty">
      <div className="notifications-empty-icon">
        <Bell
          aria-hidden="true"
        />
      </div>

      <strong>
        まだ通知はありません
      </strong>

      <p>
        いいねやコメントなどの反応が、
        ここに表示されます。
      </p>

      <button
        type="button"
        onClick={
          onRefresh
        }
      >
        <RefreshCw
          aria-hidden="true"
        />

        更新する
      </button>
    </div>
  );
}

function NotificationItem({
  item,
  opening,
  onOpen,
}: {
  item: NotificationWithActor;
  opening: boolean;
  onOpen: (
    item: NotificationWithActor
  ) => void;
}) {
  const {
    notification,
    actor,
  } =
    item;

  const actorName =
    getActorName(
      item
    );

  const destinationLabel =
    notification.type ===
      "follow" ||
    !notification.postId
      ? `${actorName}のプロフィールを見る`
      : "投稿の詳細を見る";

  return (
    <button
      type="button"
      className={
        notification.isRead
          ? "notification-item"
          : "notification-item unread"
      }
      onClick={() => {
        onOpen(
          item
        );
      }}
      disabled={
        opening
      }
      aria-label={`${getNotificationMessage(
        notification,
        actorName
      )}。${destinationLabel}`}
    >
      <div className="notification-avatar">
        {actor?.avatarUrl ? (
          <img
            src={
              actor.avatarUrl
            }
            alt={`${actorName}のプロフィール画像`}
            loading="lazy"
          />
        ) : (
          <UserRound
            aria-hidden="true"
          />
        )}

        <span
          className={`notification-type-icon ${notification.type}`}
        >
          {getNotificationIcon(
            notification.type
          )}
        </span>
      </div>

      <div className="notification-content">
        <p>
          {getNotificationMessage(
            notification,
            actorName
          )}
        </p>

        <div className="notification-meta">
          <time
            dateTime={
              notification.createdAt
            }
          >
            {formatNotificationDate(
              notification.createdAt
            )}
          </time>

          <span>
            {opening
              ? "開いています..."
              : destinationLabel}
          </span>
        </div>
      </div>

      {!notification.isRead ? (
        <span
          className="notification-unread-dot"
          aria-label="未読"
        />
      ) : null}
    </button>
  );
}

export function NotificationsScreen({
  currentUserId,
  onSelectPost,
  onSelectUser,
  onUnreadCountChange,
}: NotificationsScreenProps) {
  const [
    notifications,
    setNotifications,
  ] =
    useState<
      NotificationWithActor[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  const [
    markingAll,
    setMarkingAll,
  ] =
    useState(
      false
    );

  const [
    openingNotificationId,
    setOpeningNotificationId,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    actionError,
    setActionError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    reloadKey,
    setReloadKey,
  ] =
    useState(
      0
    );

  const unreadCount =
    notifications.filter(
      (
        item
      ) =>
        !item.notification
          .isRead
    ).length;

  useEffect(() => {
    let cancelled =
      false;

    async function loadNotifications() {
      if (!supabase) {
        if (
          !cancelled
        ) {
          setError(
            "Supabaseの設定が見つかりません。"
          );

          setLoading(
            false
          );
        }

        return;
      }

      try {
        const nextNotifications =
          await getNotificationsWithActors(
            supabase,
            currentUserId
          );

        if (cancelled) {
          return;
        }

        const nextUnreadCount =
          nextNotifications.filter(
            (
              item
            ) =>
              !item.notification
                .isRead
          ).length;

        setNotifications(
          nextNotifications
        );

        onUnreadCountChange(
          nextUnreadCount
        );

        setError(
          null
        );
      } catch (
        loadError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "通知の取得中に問題が発生しました。"
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      }
    }

    void loadNotifications();

    return () => {
      cancelled =
        true;
    };
  }, [
    currentUserId,
    onUnreadCountChange,
    reloadKey,
  ]);

  function handleRefresh() {
    if (
      loading ||
      refreshing
    ) {
      return;
    }

    setRefreshing(
      true
    );

    setActionError(
      null
    );

    setReloadKey(
      (
        currentKey
      ) =>
        currentKey +
        1
    );
  }

  async function handleMarkAllAsRead() {
    if (
      !supabase ||
      markingAll ||
      unreadCount ===
        0
    ) {
      return;
    }

    setMarkingAll(
      true
    );

    setActionError(
      null
    );

    try {
      await markAllNotificationsAsRead(
        supabase,
        currentUserId
      );

      setNotifications(
        (
          currentNotifications
        ) =>
          currentNotifications.map(
            (
              item
            ) => ({
              ...item,

              notification: {
                ...item.notification,

                isRead:
                  true,
              },
            })
          )
      );

      onUnreadCountChange(
        0
      );
    } catch (
      markError
    ) {
      setActionError(
        markError instanceof
          Error
          ? markError.message
          : "通知を既読にできませんでした。"
      );
    } finally {
      setMarkingAll(
        false
      );
    }
  }

  async function handleOpenNotification(
    item: NotificationWithActor
  ) {
    if (
      !supabase ||
      openingNotificationId
    ) {
      return;
    }

    const {
      notification,
    } =
      item;

    setOpeningNotificationId(
      notification.id
    );

    setActionError(
      null
    );

    try {
      if (
        !notification.isRead
      ) {
        await markNotificationAsRead(
          supabase,
          notification.id,
          currentUserId
        );

        setNotifications(
          (
            currentNotifications
          ) =>
            currentNotifications.map(
              (
                currentItem
              ) =>
                currentItem
                  .notification
                  .id ===
                notification.id
                  ? {
                      ...currentItem,

                      notification: {
                        ...currentItem.notification,

                        isRead:
                          true,
                      },
                    }
                  : currentItem
            )
        );

        onUnreadCountChange(
          Math.max(
            0,
            unreadCount -
              1
          )
        );
      }

      if (
        notification.type ===
          "follow" ||
        !notification.postId
      ) {
        onSelectUser(
          notification.actorId
        );

        return;
      }

      onSelectPost(
        notification.postId
      );
    } catch (
      openError
    ) {
      setActionError(
        openError instanceof
          Error
          ? openError.message
          : "通知を開けませんでした。"
      );
    } finally {
      setOpeningNotificationId(
        null
      );
    }
  }

  if (loading) {
    return (
      <section className="notifications-screen">
        <NotificationsLoading />
      </section>
    );
  }

  if (error) {
    return (
      <section className="notifications-screen">
        <NotificationsError
          message={
            error
          }
          onRetry={() => {
            setLoading(
              true
            );

            setReloadKey(
              (
                currentKey
              ) =>
                currentKey +
                1
            );
          }}
        />
      </section>
    );
  }

  return (
    <section className="notifications-screen">
      <header className="notifications-header">
        <div>
          <p className="eyebrow">
            Notifications
          </p>

          <h1>
            お知らせ
          </h1>

          <p className="lead">
            あなたのサウナライフへの、
            新しい反応。
          </p>
        </div>

        <button
          type="button"
          className="notifications-refresh-button"
          onClick={
            handleRefresh
          }
          disabled={
            refreshing
          }
          aria-label="通知を更新"
        >
          <RefreshCw
            className={
              refreshing
                ? "spinning"
                : undefined
            }
            aria-hidden="true"
          />
        </button>
      </header>

      {notifications.length >
        0 &&
      unreadCount >
        0 ? (
        <button
          type="button"
          className="notifications-read-all"
          onClick={() => {
            void handleMarkAllAsRead();
          }}
          disabled={
            markingAll
          }
        >
          <CheckCheck
            aria-hidden="true"
          />

          {markingAll
            ? "既読にしています..."
            : `未読${unreadCount}件をすべて既読`}
        </button>
      ) : null}

      {actionError ? (
        <p
          className="notifications-action-error"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      {notifications.length ===
      0 ? (
        <NotificationsEmpty
          onRefresh={
            handleRefresh
          }
        />
      ) : (
        <div className="notifications-list">
          {notifications.map(
            (
              item
            ) => (
              <NotificationItem
                key={
                  item.notification.id
                }
                item={
                  item
                }
                opening={
                  openingNotificationId ===
                  item.notification.id
                }
                onOpen={(
                  selectedItem
                ) => {
                  void handleOpenNotification(
                    selectedItem
                  );
                }}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}
