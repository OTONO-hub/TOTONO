"use client";

import { AlertCircle, RefreshCw, Search } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";

type SearchErrorProps = {
  error: Error & {
    digest?: string;
  };
  reset: () => void;
};

export default function SearchError({
  error,
  reset,
}: SearchErrorProps) {
  useEffect(() => {
    console.error("Search page error:", error);
  }, [error]);

  return (
    <main
      className="
        flex
        min-h-screen
        items-center
        justify-center
        bg-[#e6e5ef]
        px-5
        py-24
        text-[#3e3a3a]
        sm:px-8
      "
    >
      <section
        className="
          relative
          w-full
          max-w-2xl
          overflow-hidden
          rounded-[2.5rem]
          border
          border-white/70
          bg-white/70
          px-6
          py-12
          text-center
          shadow-[0_30px_90px_rgba(62,58,58,0.12)]
          backdrop-blur-xl
          sm:px-12
          sm:py-16
        "
        aria-labelledby="search-error-title"
      >
        <div
          className="
            absolute
            -right-20
            -top-20
            size-52
            rounded-full
            bg-[#9fd9f6]/30
            blur-3xl
          "
          aria-hidden="true"
        />

        <div
          className="
            absolute
            -bottom-24
            -left-20
            size-56
            rounded-full
            bg-[#fdd000]/20
            blur-3xl
          "
          aria-hidden="true"
        />

        <div className="relative">
          <div
            className="
              mx-auto
              flex
              size-16
              items-center
              justify-center
              rounded-full
              bg-[#e95884]/10
              text-[#e95884]
              sm:size-20
            "
          >
            <AlertCircle
              className="size-7 sm:size-8"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <p
            className="
              mt-7
              text-xs
              font-semibold
              uppercase
              tracking-[0.28em]
              text-[#3e3a3a]/45
            "
          >
            Search Temporarily Unavailable
          </p>

          <h1
            id="search-error-title"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.03em]
              sm:text-4xl
            "
          >
            検索結果を取得できませんでした
          </h1>

          <p
            className="
              mx-auto
              mt-5
              max-w-lg
              text-sm
              leading-7
              text-[#3e3a3a]/65
              sm:text-base
              sm:leading-8
            "
          >
            一時的な通信エラーが発生した可能性があります。
            少し時間を置いてから、もう一度お試しください。
          </p>

          <div
            className="
              mt-9
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            "
          >
            <button
              type="button"
              onClick={reset}
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#3e3a3a]
                px-7
                text-sm
                font-semibold
                text-white
                transition
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#2f2b2b]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3e3a3a]
                focus-visible:ring-offset-4
                sm:w-auto
              "
            >
              <RefreshCw
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              もう一度試す
            </button>

            <Link
              href="/search"
              className="
                inline-flex
                min-h-12
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#3e3a3a]/15
                bg-white/70
                px-7
                text-sm
                font-semibold
                text-[#3e3a3a]
                transition
                duration-200
                hover:-translate-y-0.5
                hover:border-[#3e3a3a]/25
                hover:bg-white
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3e3a3a]
                focus-visible:ring-offset-4
                sm:w-auto
              "
            >
              <Search
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              検索トップへ戻る
            </Link>
          </div>

          <p
            className="
              mt-8
              text-xs
              leading-6
              text-[#3e3a3a]/40
            "
          >
            繰り返しエラーが発生する場合は、
            ページを再読み込みしてからお試しください。
          </p>
        </div>
      </section>
    </main>
  );
}
