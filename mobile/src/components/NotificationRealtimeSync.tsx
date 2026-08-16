import {
  useEffect,
} from "react";

import {
  supabase,
} from "../lib/supabase";
import {
  getUnreadNotificationCount,
} from "../services/notifications";

type NotificationRealtimeSyncProps = {
  userId: string;
  onUnreadCountChange: (
    count: number
  ) => void;
};

export function NotificationRealtimeSync({
  userId,
  onUnreadCountChange,
}: NotificationRealtimeSyncProps) {
  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    let requestNumber =
      0;

    async function refreshUnreadCount() {
      const currentRequestNumber =
        requestNumber +
        1;

      requestNumber =
        currentRequestNumber;

      try {
        const count =
          await getUnreadNotificationCount(
            client,
            userId
          );

        if (
          cancelled ||
          currentRequestNumber !==
            requestNumber
        ) {
          return;
        }

        onUnreadCountChange(
          count
        );
      } catch (
        notificationError
      ) {
        if (cancelled) {
          return;
        }

        console.error(
          "未読通知数の同期に失敗しました。",
          notificationError
        );
      }
    }

    void refreshUnreadCount();

    const channel =
      client
        .channel(
          `mobile-notifications-${userId}`
        )
        .on(
          "postgres_changes",
          {
            event:
              "*",

            schema:
              "public",

            table:
              "notifications",

            filter:
              `recipient_id=eq.${userId}`,
          },
          () => {
            void refreshUnreadCount();
          }
        )
        .subscribe();

    return () => {
      cancelled =
        true;

      void client.removeChannel(
        channel
      );
    };
  }, [
    onUnreadCountChange,
    userId,
  ]);

  return null;
}
