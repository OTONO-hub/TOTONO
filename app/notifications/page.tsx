import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Bell,
  BellRing,
  Compass,
  LogIn,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { NotificationItem } from "@/components/notification/NotificationItem";
import { createClient } from "@/lib/supabase/server";
import { getNotificationsWithActors } from "@/services/notifications";

export default async function NotificationsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />

        <NotificationsPageShell>
          <LoginRequiredState />
        </NotificationsPageShell>
      </>
    );
  }

  const notifications =
    await getNotificationsWithActors(
      supabase,
      user.id
    );

  const unreadCount = notifications.filter(
    ({ notification }) =>
      !notification.isRead
  ).length;

  return (
    <>
      <Header />

      <NotificationsPageShell>
        <NotificationsHero
          totalCount={notifications.length}
          unreadCount={unreadCount}
        />

        {notifications.length === 0 ? (
          <EmptyNotificationsState />
        ) : (
          <section
            aria-labelledby="notifications-list-heading"
            className="mt-12 sm:mt-16"
          >
            <div
              className="
                flex
                flex-col
                gap-4
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
                    tracking-[0.2em]
                    text-muted-foreground
                  "
                >
                  Recent Activity
                </p>

                <h2
                  id="notifications-list-heading"
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  最近の通知
                </h2>
              </div>

              <p
                className="
                  max-w-md
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                通知を選択すると、関連する投稿や
                ユーザーページへ移動します。
              </p>
            </div>

            <div
              className="
                mx-auto
                mt-8
                max-w-4xl
                space-y-3
                sm:mt-10
                sm:space-y-4
              "
            >
              {notifications.map(
                ({ notification, actor }) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                    actor={actor}
                    recipientId={user.id}
                  />
                )
              )}
            </div>
          </section>
        )}
      </NotificationsPageShell>
    </>
  );
}

type NotificationsPageShellProps = {
  children: ReactNode;
};

function NotificationsPageShell({
  children,
}: NotificationsPageShellProps) {
  return (
    <main
      className="
        relative
        isolate
        min-h-screen
        overflow-hidden
        bg-muted/25
        px-4
        pb-20
        pt-8
        sm:px-6
        sm:pb-24
        sm:pt-10
        lg:px-8
        lg:pt-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-44
          top-8
          -z-10
          size-96
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
          -left-44
          top-[35rem]
          -z-10
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-24
          right-[8%]
          -z-10
          size-72
          rounded-full
          bg-secondary/10
          blur-3xl
        "
      />

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {children}
      </div>
    </main>
  );
}

type NotificationsHeroProps = {
  totalCount: number;
  unreadCount: number;
};

function NotificationsHero({
  totalCount,
  unreadCount,
}: NotificationsHeroProps) {
  const hasUnreadNotifications =
    unreadCount > 0;

  return (
    <section
      aria-labelledby="notifications-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-10
        shadow-sm
        backdrop-blur-md
        sm:px-10
        sm:py-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          size-64
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-28
          left-[30%]
          size-60
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-8
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >
        <div className="max-w-2xl">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <BellRing
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              Your Activity
            </p>
          </div>

          <h1
            id="notifications-heading"
            className="
              mt-6
              text-3xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-4xl
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
            いいね、コメント、フォローなど、
            あなたのサ活に届いた反応を
            ここで静かに確認できます。
          </p>
        </div>

        <div
          className="
            grid
            w-full
            grid-cols-2
            gap-3
            sm:w-auto
            sm:min-w-[25rem]
          "
        >
          <NotificationMetric
            label="すべての通知"
            value={totalCount}
            icon={
              <Bell
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
          />

          <NotificationMetric
            label="未読"
            value={unreadCount}
            highlighted={
              hasUnreadNotifications
            }
            icon={
              hasUnreadNotifications ? (
                <Sparkles
                  className="size-4.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <Bell
                  className="size-4.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )
            }
          />
        </div>
      </div>
    </section>
  );
}

type NotificationMetricProps = {
  label: string;
  value: number;
  icon: ReactNode;
  highlighted?: boolean;
};

function NotificationMetric({
  label,
  value,
  icon,
  highlighted = false,
}: NotificationMetricProps) {
  return (
    <div
      className={`
        rounded-[1.5rem]
        border
        px-4
        py-4
        shadow-sm
        sm:px-5
        ${
          highlighted
            ? `
              border-primary/20
              bg-primary/[0.055]
            `
            : `
              border-border/55
              bg-background/65
            `
        }
      `}
      aria-label={`${label}は${value}件です`}
    >
      <div
        className="
          flex
          items-start
          justify-between
          gap-3
        "
      >
        <div>
          <p
            className="
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            {label}
          </p>

          <p
            className="
              mt-1
              text-2xl
              font-semibold
              tabular-nums
              tracking-[-0.03em]
              text-foreground
            "
          >
            {value}

            <span
              className="
                ml-1
                text-sm
                font-normal
                text-muted-foreground
              "
            >
              件
            </span>
          </p>
        </div>

        <span
          className={`
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-full
            ${
              highlighted
                ? "bg-primary text-primary-foreground"
                : "bg-muted text-foreground"
            }
          `}
        >
          {icon}
        </span>
      </div>
    </div>
  );
}

function EmptyNotificationsState() {
  return (
    <section
      aria-labelledby="empty-notifications-heading"
      className="
        relative
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-dashed
        border-border/70
        bg-card/70
        px-6
        py-14
        text-center
        sm:mt-12
        sm:px-10
        sm:py-16
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          size-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div className="relative z-10">
        <span
          className="
            mx-auto
            flex
            size-16
            items-center
            justify-center
            rounded-full
            border
            border-border/55
            bg-background/70
            text-muted-foreground
            shadow-sm
          "
        >
          <Bell
            className="size-6"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>

        <h2
          id="empty-notifications-heading"
          className="
            mt-6
            text-xl
            font-semibold
            tracking-[-0.025em]
            text-foreground
            sm:text-2xl
          "
        >
          通知はまだありません
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-lg
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
          "
        >
          投稿やフォローを通じて交流が生まれると、
          ここに新しい通知が届きます。
        </p>

        <div
          className="
            mt-8
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
          "
        >
          <Link
            href="/"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-foreground
              px-5
              py-2.5
              text-sm
              font-semibold
              text-background
              transition
              duration-200
              hover:-translate-y-0.5
              hover:opacity-90
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transform-none
              motion-reduce:transition-none
              sm:w-auto
            "
          >
            タイムラインを見る

            <ArrowRight
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/search"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border/70
              bg-background/65
              px-5
              py-2.5
              text-sm
              font-semibold
              text-foreground
              transition
              duration-200
              hover:border-foreground/20
              hover:bg-background
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transition-none
              sm:w-auto
            "
          >
            <Compass
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            サ活を探す
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoginRequiredState() {
  return (
    <section
      aria-labelledby="notifications-login-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-14
        text-center
        shadow-sm
        backdrop-blur-md
        sm:px-10
        sm:py-16
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          size-56
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div className="relative z-10">
        <span
          className="
            mx-auto
            flex
            size-16
            items-center
            justify-center
            rounded-full
            border
            border-border/55
            bg-background/70
            text-foreground
            shadow-sm
          "
        >
          <LogIn
            className="size-6"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>

        <p
          className="
            mt-5
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-muted-foreground
          "
        >
          Your Activity
        </p>

        <h1
          id="notifications-login-heading"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.03em]
            text-foreground
            sm:text-3xl
          "
        >
          ログインが必要です
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
          いいね、コメント、フォローの通知を
          確認するには、TOTONOへログインしてください。
        </p>

        <Link
          href="/login"
          className="
            mt-8
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-full
            bg-foreground
            px-6
            py-2.5
            text-sm
            font-semibold
            text-background
            transition
            duration-200
            hover:-translate-y-0.5
            hover:opacity-90
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          ログインへ

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}