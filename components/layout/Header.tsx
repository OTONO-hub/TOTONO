import Image from "next/image";
import Link from "next/link";
import {
  Bell,
  Bookmark,
  Heart,
  Home,
  Search,
  SquarePen,
  UserRound,
} from "lucide-react";

import { LogoutButton } from "@/components/auth/LogoutButton";
import { createClient } from "@/lib/supabase/server";
import { getUnreadNotificationCount } from "@/services/notifications";

type NavigationItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  mobileVisible?: boolean;
  tabletVisible?: boolean;
  badgeCount?: number;
};

export async function Header() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const unreadNotificationCount = user
    ? await getUnreadNotificationCount(
        supabase,
        user.id
      )
    : 0;

  return (
    <header
      className="
        sticky top-0 z-50
        w-full
        px-3 pt-3
        sm:px-5 sm:pt-4
        lg:px-6
      "
    >
      <div className="mx-auto max-w-6xl">
        <div
          className="
            relative
            flex min-h-[4.5rem]
            items-center justify-between
            gap-3
            overflow-hidden
            rounded-[1.75rem]
            border border-white/55
            bg-card/80
            px-3
            shadow-totono-floating
            backdrop-blur-2xl
            sm:px-4
            lg:min-h-20
            lg:px-5
          "
        >
          {/* ヘッダー内の柔らかい背景装飾 */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -left-16 -top-20
              size-44
              rounded-full
              bg-secondary/20
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -bottom-20 right-16
              size-40
              rounded-full
              bg-accent/10
              blur-3xl
            "
          />

          {/* ロゴ */}
          <Link
            href="/"
            aria-label="TOTONOトップページ"
            className="
              group relative z-10
              flex shrink-0
              items-center gap-2.5
              rounded-full
              py-1 pr-2
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-card
            "
          >
            <span
              className="
                relative block
                size-11 shrink-0
                overflow-hidden
                rounded-full
                bg-primary
                shadow-sm
                transition duration-300
                group-hover:-translate-y-0.5
                group-hover:shadow-md
                sm:size-12
              "
            >
              <Image
                src="/totono-logo.png"
                alt=""
                fill
                priority
                sizes="48px"
                className="
                  scale-[2.45]
                  object-cover
                  transition duration-500
                  group-hover:scale-[2.55]
                "
                style={{
                  objectPosition: "center 41%",
                }}
              />
            </span>

            <span className="hidden min-[390px]:block">
              <span
                className="
                  block text-sm
                  font-semibold
                  tracking-[0.2em]
                  text-foreground
                  sm:text-base
                "
              >
                TOTONO
              </span>

              <span
                className="
                  mt-0.5 hidden
                  text-[0.625rem]
                  font-medium
                  tracking-[0.12em]
                  text-muted-foreground
                  lg:block
                "
              >
                SAUNA COMMUNITY
              </span>
            </span>
          </Link>

          {user ? (
            <nav
              aria-label="メインナビゲーション"
              className="
                relative z-10
                flex min-w-0
                items-center
                gap-0.5
                sm:gap-1
              "
            >
              {/* PC用ナビゲーション */}
              <div
                className="
                  hidden items-center
                  rounded-full
                  border border-border/55
                  bg-background/45
                  p-1
                  lg:flex
                "
              >
                <NavigationItem
                  href="/"
                  label="ホーム"
                  icon={
                    <Home
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <NavigationItem
                  href="/search"
                  label="検索"
                  icon={
                    <Search
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <NavigationItem
                  href="/favorite-saunas"
                  label="お気に入り施設"
                  icon={
                    <Heart
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <NavigationItem
                  href="/bookmarks"
                  label="保存済み投稿"
                  icon={
                    <Bookmark
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <NavigationItem
                  href="/notifications"
                  label="通知"
                  badgeCount={unreadNotificationCount}
                  icon={
                    <Bell
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <NavigationItem
                  href="/profile"
                  label="プロフィール"
                  icon={
                    <UserRound
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />
              </div>

              {/* タブレット・スマートフォン用ナビゲーション */}
              <div className="flex items-center lg:hidden">
                <MobileNavigationItem
                  href="/search"
                  label="検索"
                  icon={
                    <Search
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <MobileNavigationItem
                  href="/favorite-saunas"
                  label="お気に入り施設"
                  icon={
                    <Heart
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <MobileNavigationItem
                  href="/notifications"
                  label="通知"
                  badgeCount={unreadNotificationCount}
                  icon={
                    <Bell
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />

                <div className="hidden sm:block">
                  <MobileNavigationItem
                    href="/bookmarks"
                    label="保存済み投稿"
                    icon={
                      <Bookmark
                        className="size-[1.125rem]"
                        strokeWidth={1.75}
                      />
                    }
                  />
                </div>

                <MobileNavigationItem
                  href="/profile"
                  label="プロフィール"
                  icon={
                    <UserRound
                      className="size-[1.125rem]"
                      strokeWidth={1.75}
                    />
                  }
                />
              </div>

              {/* 投稿ボタン */}
              <Link
                href="/posts/new"
                aria-label="サ活を投稿する"
                className="
                  group ml-1
                  inline-flex min-h-11
                  shrink-0
                  items-center justify-center
                  gap-2
                  rounded-full
                  bg-accent
                  px-3
                  text-sm font-semibold
                  text-accent-foreground
                  shadow-[0_6px_18px_rgb(253_208_0_/_20%)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_24px_rgb(253_208_0_/_28%)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-card
                  active:translate-y-0
                  sm:ml-2
                  sm:px-4
                  lg:min-h-12
                  lg:px-5
                "
              >
                <SquarePen
                  className="
                    size-4
                    transition-transform
                    duration-200
                    group-hover:rotate-[-4deg]
                  "
                  strokeWidth={1.8}
                />

                <span className="hidden sm:inline">
                  投稿する
                </span>
              </Link>

              <div className="ml-0.5 shrink-0 sm:ml-1">
                <LogoutButton />
              </div>
            </nav>
          ) : (
            <nav
              aria-label="認証ナビゲーション"
              className="
                relative z-10
                flex shrink-0
                items-center gap-1
                sm:gap-2
              "
            >
              <Link
                href="/login"
                className="
                  inline-flex min-h-11
                  items-center justify-center
                  rounded-full
                  px-3
                  text-sm font-medium
                  text-muted-foreground
                  transition
                  duration-200
                  hover:bg-background/60
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-card
                  sm:px-4
                "
              >
                ログイン
              </Link>

              <Link
                href="/register"
                className="
                  inline-flex min-h-11
                  items-center justify-center
                  rounded-full
                  bg-accent
                  px-4
                  text-sm font-semibold
                  text-accent-foreground
                  shadow-[0_6px_18px_rgb(253_208_0_/_20%)]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-[0_8px_24px_rgb(253_208_0_/_28%)]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-card
                  active:translate-y-0
                  sm:px-5
                "
              >
                新規登録
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  );
}

function NavigationItem({
  href,
  label,
  icon,
  badgeCount = 0,
}: NavigationItemProps) {
  return (
    <Link
      href={href}
      aria-label={
        badgeCount > 0
          ? `${label}、未読${badgeCount}件`
          : label
      }
      className="
        group relative
        inline-flex min-h-10
        items-center justify-center
        gap-2
        rounded-full
        px-3
        text-sm font-medium
        text-muted-foreground
        transition
        duration-200
        hover:bg-card
        hover:text-foreground
        hover:shadow-sm
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-1
        focus-visible:ring-offset-background
      "
    >
      <span
        className="
          transition-transform
          duration-200
          group-hover:-translate-y-0.5
        "
      >
        {icon}
      </span>

      <span>{label}</span>

      {badgeCount > 0 && (
        <NotificationBadge count={badgeCount} />
      )}
    </Link>
  );
}

type MobileNavigationItemProps = {
  href: string;
  label: string;
  icon: React.ReactNode;
  badgeCount?: number;
};

function MobileNavigationItem({
  href,
  label,
  icon,
  badgeCount = 0,
}: MobileNavigationItemProps) {
  return (
    <Link
      href={href}
      aria-label={
        badgeCount > 0
          ? `${label}、未読${badgeCount}件`
          : label
      }
      className="
        relative
        inline-flex size-10
        shrink-0
        items-center justify-center
        rounded-full
        text-muted-foreground
        transition
        duration-200
        hover:bg-background/70
        hover:text-foreground
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-card
      "
    >
      {icon}

      {badgeCount > 0 && (
        <NotificationBadge count={badgeCount} />
      )}
    </Link>
  );
}

type NotificationBadgeProps = {
  count: number;
};

function NotificationBadge({
  count,
}: NotificationBadgeProps) {
  return (
    <span
      className="
        absolute right-0 top-0
        flex min-w-[1.125rem]
        items-center justify-center
        rounded-full
        bg-destructive
        px-1
        text-[0.625rem]
        font-bold
        leading-[1.125rem]
        text-destructive-foreground
        ring-2 ring-card
      "
    >
      {count > 99 ? "99+" : count}
    </span>
  );
}
