import Link from "next/link";
import {
  Bell,
  Bookmark,
  Search,
  SquarePen,
  UserRound,
} from "lucide-react";

import { createClient } from "@/lib/supabase/server";
import { getUnreadNotificationCount } from "@/services/notifications";

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
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold text-primary transition hover:opacity-80"
        >
          ♨️ TOTONO
        </Link>

        {user ? (
          <nav
            aria-label="メインナビゲーション"
            className="flex items-center gap-1 sm:gap-2"
          >
            <Link
              href="/"
              className="hidden rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground sm:inline-flex"
            >
              タイムライン
            </Link>

            <Link
              href="/search"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto sm:gap-2 sm:px-3"
              aria-label="検索"
            >
              <Search className="size-4" />

              <span className="hidden sm:inline">
                検索
              </span>
            </Link>

            <Link
              href="/notifications"
              className="relative inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto sm:gap-2 sm:px-3"
              aria-label={
                unreadNotificationCount > 0
                  ? `通知、未読${unreadNotificationCount}件`
                  : "通知"
              }
            >
              <Bell className="size-4" />

              <span className="hidden sm:inline">
                通知
              </span>

              {unreadNotificationCount > 0 && (
                <span className="absolute right-0.5 top-0.5 flex min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold leading-4 text-destructive-foreground sm:static sm:min-w-5 sm:leading-5">
                  {unreadNotificationCount > 99
                    ? "99+"
                    : unreadNotificationCount}
                </span>
              )}
            </Link>

            <Link
              href="/bookmarks"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto sm:gap-2 sm:px-3"
              aria-label="保存済み投稿"
            >
              <Bookmark className="size-4" />

              <span className="hidden sm:inline">
                保存済み
              </span>
            </Link>

            <Link
              href="/posts/new"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto sm:gap-2 sm:px-3"
              aria-label="投稿する"
            >
              <SquarePen className="size-4" />

              <span className="hidden sm:inline">
                投稿する
              </span>
            </Link>

            <Link
              href="/profile"
              className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground sm:w-auto sm:gap-2 sm:px-3"
              aria-label="プロフィール"
            >
              <UserRound className="size-4" />

              <span className="hidden sm:inline">
                プロフィール
              </span>
            </Link>
          </nav>
        ) : (
          <nav
            aria-label="認証ナビゲーション"
            className="flex items-center gap-2"
          >
            <Link
              href="/login"
              className="rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-foreground"
            >
              ログイン
            </Link>

            <Link
              href="/register"
              className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-3 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              新規登録
            </Link>
          </nav>
        )}
      </div>
    </header>
  );
}