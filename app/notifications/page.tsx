import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BellRing,
  Compass,
  Heart,
  LogIn,
  MessageCircle,
  Sparkles,
  UserPlus,
} from "lucide-react";

import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getNotificationsWithActors } from "@/services/notifications";
import type {
  NotificationType,
} from "@/types/notification";
import type { Profile } from "@/types/profile";

type NotificationWithActor = {
  notification: {
    id: string;
    recipientId: string;
    actorId: string;
    type: NotificationType;
    postId: string | null;
    isRead: boolean;
    createdAt: string;
  };
  actor: Profile | null;
};

type NotificationGroup = {
  key: string;
  title: string;
  description: string;
  notifications: NotificationWithActor[];
};

export default async function NotificationsPage() {
  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />

        <main
          className="
            relative
            min-h-screen
            overflow-hidden
            bg-muted/25
            px-4
            pb-28
            pt-28
            sm:px-6
            sm:pt-32
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-36
              top-16
              size-112
              rounded-full
              bg-secondary/15
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -left-40
              top-[34rem]
              size-96
              rounded-full
              bg-accent/10
              blur-3xl
            "
          />

          <section
            aria-labelledby="notifications-login-heading"
            className="
              relative
              mx-auto
              max-w-2xl
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            <div
              className="
                bg-linear-to-br
                from-secondary/25
                via-background
                to-accent/10
                px-6
                py-14
                text-center
                sm:px-10
                sm:py-16
              "
            >
              <div
                className="
                  mx-auto
                  flex
                  size-16
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border/50
                  bg-card/75
                  text-foreground
                  shadow-sm
                "
              >
                <Bell
                  className="size-6"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <p
                className="
                  mt-6
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-muted-foreground
                "
              >
                Connections
              </p>

              <h1
                id="notifications-login-heading"
                className="
                  mt-4
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-4xl
                "
              >
                新しいつながりを見る
              </h1>

              <p
                className="
                  mx-auto
                  mt-4
                  max-w-lg
                  text-sm
                  leading-7
                  text-muted-foreground
                  sm:text-base
                  sm:leading-8
                "
              >
                いいねやコメント、フォローなど、
                TOTONOで生まれた新しい出来事を確認できます。
              </p>

              <Link
                href="/login"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "xl",
                  }),
                  "mt-8"
                )}
              >
                <LogIn
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-start"
                />

                ログインする
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const notifications =
    (await getNotificationsWithActors(
      supabase,
      user.id
    )) as NotificationWithActor[];

  const unreadNotifications =
    notifications.filter(
      ({ notification }) =>
        !notification.isRead
    );

  const unreadIds =
    unreadNotifications.map(
      ({ notification }) =>
        notification.id
    );

  /*
   * 通知画面を開いた時点で、
   * 表示した未読通知を既読へ更新します。
   *
   * この画面では取得時点の状態を使うため、
   * 今回新しく確認した通知には
   * NEW表示が残ります。
   */
  if (unreadIds.length > 0) {
    const { error } = await supabase
      .from("notifications")
      .update({
        is_read: true,
      })
      .in("id", unreadIds)
      .eq(
        "recipient_id",
        user.id
      );

    if (error) {
      console.error(
        "通知の既読更新に失敗しました。",
        error
      );
    }
  }

  const groups =
    groupNotifications(
      notifications
    );

  return (
    <>
      <Header />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-muted/25
          pb-32
          pt-28
          sm:pb-28
          sm:pt-32
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-44
            top-16
            size-120
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-48
            top-[42rem]
            size-112
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-5xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <section
            aria-labelledby="notifications-heading"
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                size-80
                rounded-full
                bg-secondary/30
                blur-3xl
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-32
                left-20
                size-72
                rounded-full
                bg-accent/15
                blur-3xl
              "
            />

            <div
              className="
                relative
                bg-linear-to-br
                from-secondary/25
                via-background
                to-accent/10
                px-6
                py-10
                sm:px-8
                sm:py-12
                lg:px-10
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-8
                  sm:flex-row
                  sm:items-end
                  sm:justify-between
                "
              >
                <div className="max-w-2xl">
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-border/55
                      bg-card/70
                      px-3.5
                      py-2
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-muted-foreground
                      shadow-sm
                    "
                  >
                    <Bell
                      className="
                        size-3.5
                        text-foreground
                      "
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Connections
                  </div>

                  <h1
                    id="notifications-heading"
                    className="
                      mt-6
                      text-4xl
                      font-semibold
                      tracking-[-0.05em]
                      text-foreground
                      sm:text-5xl
                    "
                  >
                    通知
                  </h1>

                  <p
                    className="
                      mt-4
                      max-w-xl
                      text-sm
                      leading-7
                      text-muted-foreground
                      sm:text-base
                      sm:leading-8
                    "
                  >
                    サ活への共感やコメント、
                    新しいフォローをまとめて確認できます。
                  </p>
                </div>

                <NotificationSummary
                  totalCount={
                    notifications.length
                  }
                  unreadCount={
                    unreadNotifications.length
                  }
                />
              </div>
            </div>
          </section>

          {notifications.length === 0 ? (
            <EmptyNotifications />
          ) : (
            <div
              className="
                mt-12
                space-y-12
              "
            >
              {groups.map(
                (group) => (
                  <NotificationGroupSection
                    key={group.key}
                    group={group}
                  />
                )
              )}
            </div>
          )}

          <section
            aria-labelledby="notifications-next-heading"
            className="
              mt-12
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/80
              p-6
              shadow-sm
              backdrop-blur-md
              sm:p-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-muted-foreground
                  "
                >
                  Join the Conversation
                </p>

                <h2
                  id="notifications-next-heading"
                  className="
                    mt-3
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  新しいサ活に出会う
                </h2>

                <p
                  className="
                    mt-3
                    max-w-xl
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  Communityから、
                  ほかのユーザーの記録や
                  気になる施設を見つけてみましょう。
                </p>
              </div>

              <Link
                href="/community"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "lg",
                  }),
                  "w-full sm:w-auto"
                )}
              >
                <Compass
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-start"
                />

                Communityへ
              </Link>
            </div>
          </section>
        </div>
      </main>

      <AppMobileNavigation />
    </>
  );
}

type NotificationSummaryProps = {
  totalCount: number;
  unreadCount: number;
};

function NotificationSummary({
  totalCount,
  unreadCount,
}: NotificationSummaryProps) {
  return (
    <div
      className="
        flex
        w-full
        max-w-sm
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border/55
        bg-card/75
        shadow-sm
        sm:w-auto
      "
    >
      <div
        className="
          flex
          flex-1
          items-center
          gap-3
          border-r
          border-border/45
          px-4
          py-4
          sm:min-w-36
        "
      >
        <span
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-secondary/20
            text-foreground
          "
        >
          <Bell
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <div>
          <p
            className="
              text-[0.625rem]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-muted-foreground
            "
          >
            Total
          </p>

          <p
            className="
              mt-1
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
            "
          >
            {totalCount}
          </p>
        </div>
      </div>

      <div
        className="
          flex
          flex-1
          items-center
          gap-3
          px-4
          py-4
          sm:min-w-36
        "
      >
        <span
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-accent/20
            text-foreground
          "
        >
          <BellRing
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <div>
          <p
            className="
              text-[0.625rem]
              font-semibold
              uppercase
              tracking-[0.18em]
              text-muted-foreground
            "
          >
            New
          </p>

          <p
            className="
              mt-1
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
            "
          >
            {unreadCount}
          </p>
        </div>
      </div>
    </div>
  );
}

type NotificationGroupSectionProps = {
  group: NotificationGroup;
};

function NotificationGroupSection({
  group,
}: NotificationGroupSectionProps) {
  if (
    group.notifications.length === 0
  ) {
    return null;
  }

  return (
    <section
      aria-labelledby={`notification-group-${group.key}`}
    >
      <div
        className="
          flex
          flex-col
          gap-2
          border-b
          border-border/55
          pb-5
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Activity
          </p>

          <h2
            id={`notification-group-${group.key}`}
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-foreground
            "
          >
            {group.title}
          </h2>
        </div>

        <p
          className="
            text-sm
            text-muted-foreground
          "
        >
          {group.description}
        </p>
      </div>

      <div
        className="
          mt-6
          overflow-hidden
          rounded-[2rem]
          border
          border-border/55
          bg-card/85
          px-4
          shadow-sm
          backdrop-blur-md
          sm:px-6
        "
      >
        {group.notifications.map(
          (
            item,
            index
          ) => (
            <NotificationTimelineItem
              key={
                item.notification.id
              }
              item={item}
              isLast={
                index ===
                group.notifications
                  .length -
                  1
              }
            />
          )
        )}
      </div>
    </section>
  );
}

type NotificationTimelineItemProps = {
  item: NotificationWithActor;
  isLast: boolean;
};

function NotificationTimelineItem({
  item,
  isLast,
}: NotificationTimelineItemProps) {
  const {
    notification,
    actor,
  } = item;

  const actorName =
    actor?.username?.trim() ||
    "TOTONOユーザー";

  const notificationConfig =
    getNotificationConfig(
      notification.type
    );

  const NotificationIcon =
    notificationConfig.icon;

  const href =
    notification.type ===
      "follow" ||
    !notification.postId
      ? `/users/${notification.actorId}`
      : `/posts/${notification.postId}`;

  return (
    <div
      className="
        relative
        grid
        grid-cols-[2.75rem_minmax(0,1fr)]
        gap-4
        sm:grid-cols-[3.25rem_minmax(0,1fr)]
        sm:gap-5
      "
    >
      <div
        className="
          relative
          flex
          justify-center
        "
      >
        {!isLast ? (
          <span
            aria-hidden="true"
            className="
              absolute
              bottom-0
              top-14
              w-px
              bg-border/70
            "
          />
        ) : null}

        <span
          className={cn(
            `
              relative
              z-10
              mt-6
              flex
              size-10
              items-center
              justify-center
              rounded-full
              border
              shadow-sm
              sm:size-11
            `,
            notification.isRead
              ? `
                  border-border/60
                  bg-background
                  text-muted-foreground
                `
              : notificationConfig.iconClassName
          )}
        >
          <NotificationIcon
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>
      </div>

      <Link
        href={href}
        className={cn(
          `
            group
            relative
            flex
            min-w-0
            items-center
            gap-4
            border-b
            border-border/45
            py-6
            pr-1
            transition-colors
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
          `,
          !isLast &&
            "border-b",
          isLast &&
            "border-b-0"
        )}
      >
        <ProfileAvatar
          avatarUrl={
            actor?.avatar_url ??
            null
          }
          username={actorName}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <p
              className="
                min-w-0
                text-sm
                leading-6
                text-foreground
              "
            >
              <span className="font-semibold">
                {actorName}
              </span>

              <span className="text-foreground/75">
                {
                  notificationConfig.message
                }
              </span>
            </p>

            {!notification.isRead ? (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  bg-accent/20
                  px-2.5
                  py-1
                  text-[0.625rem]
                  font-semibold
                  uppercase
                  tracking-[0.14em]
                  text-foreground
                "
              >
                <span
                  aria-hidden="true"
                  className="
                    size-1.5
                    rounded-full
                    bg-accent
                  "
                />

                New
              </span>
            ) : null}
          </div>

          <p
            className="
              mt-1
              text-xs
              text-muted-foreground
            "
          >
            {formatNotificationDate(
              notification.createdAt
            )}
          </p>
        </div>

        <ArrowRight
          className="
            size-4
            shrink-0
            text-muted-foreground
            transition-transform
            duration-200
            group-hover:translate-x-1
            group-hover:text-foreground
          "
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </Link>
    </div>
  );
}

function EmptyNotifications() {
  return (
    <EmptyState
      className="mt-10"
      eyebrow="Quiet Lounge"
      icon={Bell}
      title="まだ通知はありません"
      description="サ活を投稿したり、Communityでほかのユーザーと交流すると、ここに新しい出来事が届きます。"
      action={{
        label: "Communityを見る",
        href: "/community",
        icon: Compass,
      }}
      secondaryAction={{
        label: "サ活を投稿する",
        href: "/posts/new",
        icon: Sparkles,
      }}
    />
  );
}

function getNotificationConfig(
  type: NotificationType
) {
  switch (type) {
    case "like":
      return {
        icon: Heart,
        message:
          "さんがあなたのサ活にいいねしました。",
        iconClassName:
          "border-error/20 bg-error/10 text-error",
      };

    case "comment":
      return {
        icon: MessageCircle,
        message:
          "さんがあなたのサ活にコメントしました。",
        iconClassName:
          "border-secondary/40 bg-secondary/20 text-foreground",
      };

    case "follow":
      return {
        icon: UserPlus,
        message:
          "さんがあなたをフォローしました。",
        iconClassName:
          "border-success/20 bg-success/10 text-success",
      };

    default:
      return {
        icon: Sparkles,
        message:
          "さんから新しい反応がありました。",
        iconClassName:
          "border-accent/30 bg-accent/15 text-foreground",
      };
  }
}

function groupNotifications(
  notifications: NotificationWithActor[]
): NotificationGroup[] {
  const today:
    NotificationWithActor[] = [];

  const yesterday:
    NotificationWithActor[] = [];

  const thisWeek:
    NotificationWithActor[] = [];

  const older:
    NotificationWithActor[] = [];

  const now = new Date();

  const todayStart =
    startOfDay(now);

  const yesterdayStart =
    new Date(todayStart);

  yesterdayStart.setDate(
    yesterdayStart.getDate() - 1
  );

  const weekStart =
    new Date(todayStart);

  weekStart.setDate(
    weekStart.getDate() - 7
  );

  for (const item of notifications) {
    const createdAt =
      new Date(
        item.notification.createdAt
      );

    if (
      createdAt >= todayStart
    ) {
      today.push(item);
      continue;
    }

    if (
      createdAt >= yesterdayStart
    ) {
      yesterday.push(item);
      continue;
    }

    if (
      createdAt >= weekStart
    ) {
      thisWeek.push(item);
      continue;
    }

    older.push(item);
  }

  return [
    {
      key: "today",
      title: "今日",
      description:
        `${today.length}件の出来事`,
      notifications: today,
    },
    {
      key: "yesterday",
      title: "昨日",
      description:
        `${yesterday.length}件の出来事`,
      notifications: yesterday,
    },
    {
      key: "this-week",
      title: "過去7日",
      description:
        `${thisWeek.length}件の出来事`,
      notifications: thisWeek,
    },
    {
      key: "older",
      title: "さらに過去",
      description:
        `${older.length}件の出来事`,
      notifications: older,
    },
  ];
}

function startOfDay(
  date: Date
): Date {
  const result =
    new Date(date);

  result.setHours(
    0,
    0,
    0,
    0
  );

  return result;
}

function formatNotificationDate(
  value: string
): string {
  const date = new Date(value);
  const now = new Date();

  const diffMilliseconds =
    now.getTime() -
    date.getTime();

  const diffMinutes =
    Math.floor(
      diffMilliseconds /
        (1000 * 60)
    );

  if (
    diffMinutes >= 0 &&
    diffMinutes < 1
  ) {
    return "たった今";
  }

  if (
    diffMinutes >= 1 &&
    diffMinutes < 60
  ) {
    return `${diffMinutes}分前`;
  }

  const diffHours =
    Math.floor(
      diffMinutes / 60
    );

  if (
    diffHours >= 1 &&
    diffHours < 24
  ) {
    return `${diffHours}時間前`;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }
  ).format(date);
}
