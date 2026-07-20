"use client";

import type { FormEvent } from "react";
import {
  useEffect,
  useState,
  useTransition,
} from "react";
import {
  LoaderCircle,
  Search,
  X,
} from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  MAX_SEARCH_QUERY_LENGTH,
  normalizeSearchQuery,
} from "@/lib/search-query";

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery =
    searchParams.get("q") ?? "";

  const [query, setQuery] =
    useState(currentQuery);

  const [isPending, startTransition] =
    useTransition();


  const normalizedQuery =
    normalizeSearchQuery(query);

  const isSearchDisabled =
    isPending || !normalizedQuery;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!normalizedQuery) {
      setQuery("");

      startTransition(() => {
        router.push("/search");
      });

      return;
    }

    setQuery(normalizedQuery);

    const params = new URLSearchParams();
    params.set("q", normalizedQuery);

    startTransition(() => {
      router.push(
        `/search?${params.toString()}`
      );
    });
  };

  const handleClear = () => {
    setQuery("");

    startTransition(() => {
      router.push("/search");
    });
  };

  const isNearCharacterLimit =
    query.length >=
    MAX_SEARCH_QUERY_LENGTH * 0.8;

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-3"
      role="search"
      aria-label="TOTONO内を検索"
    >
      <div
        className="
          flex
          flex-col
          gap-3
          sm:flex-row
        "
      >
        <div
          className="
            group/input
            relative
            min-w-0
            flex-1
          "
        >
          <Search
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              z-10
              size-4.5
              -translate-y-1/2
              text-muted-foreground
              transition-colors
              duration-200
              group-focus-within/input:text-foreground
            "
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <Input
            type="search"
            name="q"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="施設名、地域名、サ活を検索"
            maxLength={
              MAX_SEARCH_QUERY_LENGTH
            }
            autoComplete="off"
            enterKeyHint="search"
            aria-label="サウナ施設やサ活を検索"
            className="
              h-13
              rounded-2xl
              border-border/60
              bg-background/75
              pl-11
              pr-12
              text-base
              shadow-sm
              transition
              placeholder:text-muted-foreground/70
              hover:border-foreground/15
              focus-visible:border-foreground/25
              focus-visible:ring-2
              focus-visible:ring-ring/25
              sm:h-14
            "
          />

          {query.length > 0 && (
            <button
              type="button"
              onClick={handleClear}
              disabled={isPending}
              aria-label="検索キーワードをクリア"
              className="
                absolute
                right-2.5
                top-1/2
                flex
                size-8
                -translate-y-1/2
                items-center
                justify-center
                rounded-full
                text-muted-foreground
                transition
                duration-200
                hover:bg-muted
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                disabled:cursor-not-allowed
                disabled:opacity-50
                motion-reduce:transition-none
              "
            >
              <X
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </button>
          )}
        </div>

        <Button
          type="submit"
          disabled={isSearchDisabled}
          aria-label={
            isPending
              ? "検索結果を読み込んでいます"
              : "検索を実行"
          }
          className="
            h-13
            shrink-0
            gap-2
            rounded-2xl
            px-6
            text-sm
            font-semibold
            shadow-sm
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:shadow-md
            disabled:translate-y-0
            disabled:shadow-none
            sm:h-14
            sm:min-w-28
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          {isPending ? (
            <LoaderCircle
              className="
                size-4
                animate-spin
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : (
            <Search
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}

          <span>
            {isPending
              ? "検索中"
              : "検索"}
          </span>
        </Button>
      </div>

      <div
        className="
          flex
          min-h-5
          items-center
          justify-between
          gap-4
          px-1
        "
      >
        <p
          className="
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          例：東京、渋谷、外気浴
        </p>

        <span
          className={`
            shrink-0
            text-xs
            tabular-nums
            transition-colors
            ${
              isNearCharacterLimit
                ? "font-semibold text-error"
                : "text-muted-foreground"
            }
          `}
          aria-live="polite"
          aria-label={`${MAX_SEARCH_QUERY_LENGTH}文字中${query.length}文字入力済み`}
        >
          {query.length} /{" "}
          {MAX_SEARCH_QUERY_LENGTH}
        </span>
      </div>
    </form>
  );
}
