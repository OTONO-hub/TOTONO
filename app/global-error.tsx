"use client";

import { useEffect } from "react";
import Link from "next/link";
import {
  AlertTriangle,
  ArrowLeft,
  RefreshCw,
  Search,
} from "lucide-react";

type GlobalErrorPageProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function GlobalErrorPage({
  error,
  reset,
}: GlobalErrorPageProps) {
  useEffect(() => {
    console.error(
      "TOTONOのルートレイアウトで予期しないエラーが発生しました。",
      error
    );
  }, [error]);

  return (
    <html lang="ja">
      <body>
        <main
          className="
            relative
            flex
            min-h-screen
            items-center
            justify-center
            overflow-hidden
            bg-[#f7f7f9]
            px-5
            py-16
            text-[#3e3a3a]
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
              bg-[#9fd9f6]/20
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
              bg-[#fdd000]/12
              blur-3xl
            "
          />

          <section
            role="alert"
            aria-live="assertive"
            aria-labelledby="global-error-title"
            aria-describedby="global-error-description"
            className="
              relative
              w-full
              max-w-2xl
              overflow-hidden
              rounded-[2rem]
              border
              border-black/10
              bg-white/90
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
                bg-[#e95884]/10
                text-[#e95884]
              "
            >
              <AlertTriangle
                aria-hidden="true"
                className="size-6"
                strokeWidth={1.8}
              />
            </div>

            <p
              className="
                mt-5
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-black/50
              "
            >
              System Interruption
            </p>

            <h1
              id="global-error-title"
              className="
                mt-3
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-[#3e3a3a]
                sm:text-3xl
              "
            >
              TOTONOを表示できませんでした
            </h1>

            <p
              id="global-error-description"
              className="
                mx-auto
                mt-4
                max-w-lg
                text-sm
                leading-7
                text-black/55
                sm:text-base
                sm:leading-8
              "
            >
              アプリ全体の読み込み中に一時的な問題が発生しました。
              通信状態を確認し、少し時間をおいてから
              もう一度お試しください。
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
                  bg-[#3e3a3a]
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  shadow-sm
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:opacity-90
                  hover:shadow-md
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3e3a3a]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white
                  active:translate-y-0
                  motion-reduce:transform-none
                  motion-reduce:transition-none
                "
              >
                <RefreshCw
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.8}
                />

                もう一度試す
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
                  border
                  border-black/10
                  bg-white/80
                  px-6
                  text-sm
                  font-semibold
                  text-[#3e3a3a]
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:bg-black/5
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3e3a3a]
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-white
                  active:translate-y-0
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
                text-black/55
                transition
                hover:text-[#3e3a3a]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3e3a3a]
                focus-visible:ring-offset-2
                focus-visible:ring-offset-white
                motion-reduce:transition-none
              "
            >
              <ArrowLeft
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />

              ホームへ戻る
            </Link>

            {process.env.NODE_ENV === "development" ? (
              <details
                className="
                  mt-8
                  rounded-2xl
                  border
                  border-black/10
                  bg-black/[0.03]
                  p-4
                  text-left
                "
              >
                <summary
                  className="
                    cursor-pointer
                    rounded-sm
                    text-sm
                    font-medium
                    text-black/55
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#3e3a3a]
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-white
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
                    text-[#e95884]
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
      </body>
    </html>
  );
}
