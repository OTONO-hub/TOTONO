"use client";

import {
  RotateCcw,
  Search,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

type Props = {
  query: string;
};

export function SearchEmptyState({
  query,
}: Props) {
  const params =
    useSearchParams();

  const area =
    params.get("area");

  const resetParams =
    new URLSearchParams();

  if (query) {
    resetParams.set("q", query);
  }

  if (area) {
    resetParams.set("area", area);
  }

  const resetUrl =
    resetParams.toString()
      ? `/search?${resetParams}`
      : "/search";

  return (
    <section
      className="
        mt-12
        rounded-[2rem]
        border
        border-border/60
        bg-card
        px-8
        py-16
        text-center
        shadow-sm
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
          bg-primary/5
        "
      >
        <Search
          className="size-7 text-primary/70"
          strokeWidth={1.8}
        />
      </div>

      <h2
        className="
          mt-8
          text-2xl
          font-semibold
          tracking-[-0.03em]
        "
      >
        検索結果が見つかりませんでした
      </h2>

      <p
        className="
          mx-auto
          mt-4
          max-w-xl
          text-sm
          leading-7
          text-muted-foreground
        "
      >
        「{query}」に一致する施設やサ活は、
        現在登録されていません。
      </p>

      <div
        className="
          mt-8
          space-y-2
          text-sm
          text-muted-foreground
        "
      >
        <p>
          ・施設名を短くして検索する
        </p>

        <p>
          ・地域名で検索する
        </p>

        <p>
          ・設備条件を解除する
        </p>
      </div>

      <Link
        href={resetUrl}
        scroll={false}
        className="
          mt-10
          inline-flex
          h-11
          items-center
          gap-2
          rounded-full
          border
          border-border
          px-6
          text-sm
          font-medium
          transition
          hover:-translate-y-0.5
          hover:shadow-md
        "
      >
        <RotateCcw
          className="size-4"
          strokeWidth={1.8}
        />

        条件をリセット
      </Link>
    </section>
  );
}
