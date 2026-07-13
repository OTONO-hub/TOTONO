"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { createClient } from "@/lib/supabase/client";
import { markNotificationAsRead } from "@/services/notifications";
import type {
  NotificationType,
  NotificationWithActor,
} from "@/types/notification";

type Props = NotificationWithActor & {
  recipientId: string;
};

function getNotificationMessage(
  type: NotificationType
) {
  switch (type) {
    case "like":
      return "あなたの投稿にいいねしました。";

    case "comment":
      return "あなたの投稿にコメントしました。";

    case "follow":
      return "あなたをフォローしました。";
  }
}

export function NotificationItem({
  notification,
  actor,
  recipientId,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [isRead, setIsRead] = useState(
    notification.isRead
  );

  const [loading, setLoading] = useState(false);

  const actorName = actor?.username || "ユーザー";

  const destination =
    notification.type === "follow"
      ? `/users/${notification.actorId}`
      : notification.postId
        ? `/posts/${notification.postId}`
        : `/users/${notification.actorId}`;

  const handleClick = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (!isRead) {
        await markNotificationAsRead(
          supabase,
          notification.id,
          recipientId
        );

        setIsRead(true);
      }

      router.push(destination);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "通知の処理に失敗しました。"
      );

      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className={`w-full rounded-xl border p-4 text-left shadow-sm transition hover:bg-muted/60 disabled:cursor-wait disabled:opacity-70 ${
        isRead
          ? "bg-card"
          : "border-primary/20 bg-primary/5"
      }`}
    >
      <div className="flex items-center gap-3">
        <ProfileAvatar
          avatarUrl={actor?.avatar_url ?? null}
          username={actor?.username ?? null}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <p className="wrap-break-word text-sm">
            <span className="font-semibold">
              @{actorName}
            </span>{" "}
            {getNotificationMessage(notification.type)}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(
              notification.createdAt
            ).toLocaleString("ja-JP")}
          </p>
        </div>

        {!isRead && (
          <span
            aria-label="未読"
            className="size-2 shrink-0 rounded-full bg-primary"
          />
        )}
      </div>
    </button>
  );
}