"use client";

import {
  ArrowDownUp,
  ChevronDown,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useTransition } from "react";

import {
  normalizeSearchSort,
  type SearchSort as SearchSortValue,
} from "@/services/search-sort";

const SORT_OPTIONS: {
  value: SearchSortValue;
  label: string;
}[] = [
  {
    value: "popular",
    label: "人気順",
  },
  {
    value: "rating",
    label: "評価順",
  },
  {
    value: "posts",
    label: "投稿数順",
  },
  {
    value: "name",
    label: "施設名順",
  },
];

export function SearchSort() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  /*
   * URLに保存されているsortを取得します。
   *
   * sortが未指定または不正な値の場合は、
   * popularとして扱います。
   */
  const selectedSort =
    normalizeSearchSort(
      searchParams.get("sort") ??
        undefined
    );

  const handleSortChange = (
    nextSort: SearchSortValue
  ) => {
    const params = new URLSearchParams(
      searchParams.toString()
    );

    /*
     * 人気順は初期値なので、
     * URLを簡潔にするためsortを削除します。
     */
    if (nextSort === "popular") {
      params.delete("sort");
    } else {
      params.set("sort", nextSort);
    }

    /*
     * 並び順変更時は、
     * 検索条件や設備条件など、
     * 既存のURLパラメータを維持します。
     */
    const queryString =
      params.toString();

    const nextUrl = queryString
      ? `${pathname}?${queryString}`
      : pathname;

    startTransition(() => {
      router.replace(
        nextUrl,
        {
          scroll: false,
        }
      );
    });
  };

  return (
    <div
      className="
        w-full
        sm:w-auto
      "
    >
      <label
        htmlFor="search-sort"
        className="
          mb-2
          block
          text-xs
          font-semibold
          uppercase
          tracking-[0.16em]
          text-muted-foreground
        "
      >
        並び順
      </label>

      <div className="relative">
        <ArrowDownUp
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            left-4
            top-1/2
            z-10
            size-4
            -translate-y-1/2
            text-primary/55
          "
          strokeWidth={1.8}
        />

        <select
          id="search-sort"
          value={selectedSort}
          disabled={isPending}
          onChange={(event) => {
            handleSortChange(
              event.target
                .value as SearchSortValue
            );
          }}
          aria-label="検索結果の並び順"
          className="
            h-12
            w-full
            min-w-44
            appearance-none
            rounded-2xl
            border
            border-border/60
            bg-card/90
            py-2
            pl-11
            pr-11
            text-sm
            font-medium
            text-foreground
            shadow-sm
            outline-none
            transition
            duration-200
            hover:border-primary/25
            hover:bg-card
            focus:border-primary/35
            focus:ring-4
            focus:ring-primary/8
            disabled:cursor-wait
            disabled:opacity-60
            sm:w-auto
          "
        >
          {SORT_OPTIONS.map(
            (option) => (
              <option
                key={option.value}
                value={option.value}
              >
                {option.label}
              </option>
            )
          )}
        </select>

        <ChevronDown
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            right-4
            top-1/2
            size-4
            -translate-y-1/2
            text-primary/45
          "
          strokeWidth={1.8}
        />
      </div>

      <p
        className="
          mt-2
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        施設の表示順を変更できます
      </p>
    </div>
  );
}
