import type { Metadata } from "next";
import Link from "next/link";
import {
  CheckCircle2,
  Home,
  Search,
} from "lucide-react";

export const metadata: Metadata = {
  title: "アカウントを削除しました",
  description:
    "TOTONOのアカウント削除が完了しました。",
  robots: {
    index: false,
    follow: false,
  },
};

export default function AccountDeletedPage() {
  return (
    <div
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-5
        py-16
        sm:px-8
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-36
          -top-36
          size-96
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
          -bottom-36
          -right-28
          size-96
          rounded-full
          bg-accent/12
          blur-3xl
        "
      />

      <section
        aria-labelledby="account-deleted-title"
        aria-describedby="account-deleted-description"
        className="
          relative
          w-full
          max-w-lg
          overflow-hidden
          rounded-[2rem]
          border
          border-border/60
          bg-card/90
          p-7
          text-center
          shadow-xl
          shadow-black/5
          backdrop-blur-xl
          sm:rounded-[2.5rem]
          sm:p-10
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
            bg-success/10
            text-success
          "
        >
          <CheckCircle2
            aria-hidden="true"
            className="size-7"
            strokeWidth={1.8}
          />
        </div>

        <p
          className="
            mt-6
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
            text-muted-foreground
          "
        >
          Account deleted
        </p>

        <h1
          id="account-deleted-title"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.04em]
            text-foreground
            sm:text-3xl
          "
        >
          アカウントを削除しました
        </h1>

        <p
          id="account-deleted-description"
          className="
            mt-5
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
            sm:leading-8
          "
        >
          TOTONOをご利用いただき、ありがとうございました。
          アカウントと関連するデータの削除手続きが完了しました。
        </p>

        <div
          className="
            mt-6
            rounded-2xl
            border
            border-border/60
            bg-muted/35
            p-4
            text-left
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          ブラウザや配信環境のキャッシュによって、
          削除済みの情報が一時的に表示される場合があります。
          その場合は、ページを再読み込みしてください。
        </div>

        <div
          className="
            mt-8
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          <Link
            href="/"
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-full
              bg-primary
              px-6
              text-sm
              font-semibold
              text-primary-foreground
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          >
            <Home
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />

            ホームへ戻る
          </Link>

          <Link
            href="/search"
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border
              bg-background
              px-6
              text-sm
              font-semibold
              text-foreground
              transition
              hover:-translate-y-0.5
              hover:bg-muted
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          >
            <Search
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />

            施設を探す
          </Link>
        </div>

        <p
          className="
            mt-7
            text-xs
            leading-6
            text-muted-foreground
          "
        >
          再び利用する場合は、新しいアカウントを作成できます。
        </p>
      </section>
    </div>
  );
}
