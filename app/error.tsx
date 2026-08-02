"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  RefreshCw,
  Search,
} from "lucide-react";

type ErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function ErrorPage({
  error,
  reset,
}: ErrorPageProps) {
  useEffect(() => {
    console.error(
      "TOTONOで予期しないエラーが発生しました。",
      error
    );
  }, [error]);

  return (
    <main
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
          -left-32
          -top-32
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
          -bottom-36
          -right-28
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <section
        aria-labelledby="error-title"
        className="
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-[2rem]
          border border-border/60
          bg-card/90
          p-6
          text-center
          shadow-xl
          shadow-black/5
          backdrop-blur-xl
          sm:rounded-[2.5rem]
          sm:p-10
          lg:p-12
        "
      >
        <div
          className="
            mx-auto
            flex
            size-14
            items-center
            justify-center
            rounded-full
            bg-destructive/10
            text-destructive
          "
        >
          <AlertCircle
            className="size-6"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>

        <p
          className="
            mt-5
            text-xs
            font-semibold
            uppercase
            tracking-[0.25em]
            text-muted-foreground
          "
        >
          Something went wrong
        </p>

        <h1
          id="error-title"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.035em]
            text-foreground
            sm:text-3xl
          "
        >
          ホーム画面を表示できませんでした
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
          "
        >
          通信状況や一時的な問題により、情報の取得に失敗しました。
          しばらく待ってから、もう一度お試しください。
        </p>

        <div
          className="
            mt-8
            flex
            flex-col
            gap-3
            sm:flex-row
            sm:justify-center
          "
        >
          <button
            type="button"
            onClick={reset}
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
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              active:translate-y-0
            "
          >
            <RefreshCw
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            もう一度読み込む
          </button>

          <Link
            href="/search"
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-full
              border border-border
              bg-background/80
              px-6
              text-sm
              font-semibold
              text-foreground
              transition
              duration-200
              hover:-translate-y-0.5
              hover:bg-muted
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              active:translate-y-0
            "
          >
            <Search
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            施設を探す
          </Link>
        </div>

        <Link
          href="/"
          className="
            mt-6
            inline-flex
            min-h-10
            items-center
            justify-center
            gap-2
            rounded-full
            px-4
            text-sm
            font-medium
            text-muted-foreground
            transition
            hover:text-foreground
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
        >
          <ArrowLeft
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          ホームへ戻る
        </Link>

        {process.env.NODE_ENV ===
        "development" ? (
          <details
            className="
              mt-8
              rounded-2xl
              border border-border/60
              bg-muted/35
              p-4
              text-left
            "
          >
            <summary
              className="
                cursor-pointer
                text-sm
                font-medium
                text-muted-foreground
              "
            >
              開発用エラー情報
            </summary>

            <pre
              className="
                mt-3
                max-h-48
                overflow-auto
                whitespace-pre-wrap
                break-words
                text-xs
                leading-6
                text-destructive
              "
            >
              {error.message}

              {error.digest
                ? `\nDigest: ${error.digest}`
                : ""}
            </pre>
          </details>
        ) : null}
      </section>
    </main>
  );
}
