import Link from "next/link";

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

        <main className="mx-auto max-w-2xl p-6">
          <p className="text-muted-foreground">
            通知を見るにはログインしてください。
          </p>

          <Link
            href="/login"
            className="mt-4 inline-block font-medium text-primary"
          >
            ログインへ
          </Link>
        </main>
      </>
    );
  }

  const notifications =
    await getNotificationsWithActors(
      supabase,
      user.id
    );

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl space-y-6 bg-muted/40 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            通知
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            いいね、コメント、フォローの通知を確認できます。
          </p>
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              通知はまだありません。
            </p>
          </div>
        ) : (
          <section className="space-y-3">
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
          </section>
        )}
      </main>
    </>
  );
}