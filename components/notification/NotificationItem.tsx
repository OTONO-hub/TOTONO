"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowUpRight,
  Heart,
  LoaderCircle,
  MessageCircle,
  UserPlus,
  type LucideIcon,
} from "lucide-react";
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

type NotificationAppearance = {
  message: string;
  label: string;
  Icon: LucideIcon;
  iconClassName: string;
};

function getNotificationAppearance(
  type: NotificationType
): NotificationAppearance {
  switch (type) {
    case "like":
      return {
        message: "あなたの投稿にいいねしました。",
        label: "いいね",
        Icon: Heart,
        iconClassName:
          "bg-error/10 text-error",
      };

    case "comment":
      return {
        message:
          "あなたの投稿にコメントしました。",
        label: "コメント",
        Icon: MessageCircle,
        iconClassName:
          "bg-secondary/20 text-foreground",
      };

    case "follow":
      return {
        message: "あなたをフォローしました。",
        label: "フォロー",
        Icon: UserPlus,
        iconClassName:
          "bg-success/10 text-success",
      };
  }
}

function formatNotificationDate(date: string) {
  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function NotificationItem({
  notification,
  actor,
  recipientId,
}: Props) {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [isRead, setIsRead] = useState(
    notification.isRead
  );

  const [loading, setLoading] =
    useState(false);

  const actorName =
    actor?.username || "ユーザー";

  const appearance =
    getNotificationAppearance(
      notification.type
    );

  const {
    message,
    label,
    Icon,
    iconClassName,
  } = appearance;

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
      aria-busy={loading}
      className={`
        group
        relative
        w-full
        overflow-hidden
        rounded-[1.5rem]
        border
        px-4
        py-4
        text-left
        shadow-sm
        transition
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        disabled:cursor-wait
        disabled:opacity-70
        motion-reduce:transition-none
        sm:px-5
        sm:py-5
        ${
          isRead
            ? `
              border-border/55
              bg-card/80
              hover:border-border
              hover:bg-card
            `
            : `
              border-primary/20
              bg-primary/[0.045]
              hover:border-primary/30
              hover:bg-primary/[0.065]
            `
        }
      `}
    >
      {!isRead && (
        <span
          aria-hidden="true"
          className="
            absolute
            inset-y-5
            left-0
            w-1
            rounded-r-full
            bg-primary
          "
        />
      )}

      <div
        className="
          flex
          items-start
          gap-3
          sm:gap-4
        "
      >
        <div className="relative shrink-0">
          <ProfileAvatar
            avatarUrl={
              actor?.avatar_url ?? null
            }
            username={
              actor?.username ?? null
            }
            size="md"
          />

          <span
            aria-label={`通知種別：${label}`}
            className={`
              absolute
              -bottom-1
              -right-1
              flex
              size-7
              items-center
              justify-center
              rounded-full
              border-2
              border-card
              shadow-sm
              ${iconClassName}
            `}
          >
            <Icon
              className="size-3.5"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>
        </div>

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-2
              gap-y-1
            "
          >
            <span
              className="
                text-sm
                font-semibold
                text-foreground
              "
            >
              @{actorName}
            </span>

            {!isRead && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-primary/10
                  px-2
                  py-0.5
                  text-[11px]
                  font-semibold
                  text-primary
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    size-1.5
                    rounded-full
                    bg-primary
                  "
                />

                未読
              </span>
            )}
          </div>

          <p
            className="
              mt-1.5
              break-words
              text-sm
              leading-6
              text-foreground/85
              sm:text-[15px]
            "
          >
            {message}
          </p>

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-x-3
              gap-y-1
              text-xs
              text-muted-foreground
            "
          >
            <span>{label}</span>

            <span aria-hidden="true">•</span>

            <time
              dateTime={
                notification.createdAt
              }
            >
              {formatNotificationDate(
                notification.createdAt
              )}
            </time>
          </div>
        </div>

        <span
          className="
            mt-1
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-border/55
            bg-background/60
            text-muted-foreground
            transition
            duration-200
            group-hover:border-foreground/15
            group-hover:bg-background
            group-hover:text-foreground
            motion-reduce:transition-none
          "
        >
          {loading ? (
            <LoaderCircle
              className="size-4 animate-spin"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : (
            <ArrowUpRight
              className="
                size-4
                transition-transform
                duration-200
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </span>
      </div>
    </button>
  );
}
