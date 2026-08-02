"use client";

import {
  type FormEvent,
  useId,
  useRef,
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

  const inputRef =
    useRef<HTMLInputElement>(null);

  const helpTextId = useId();
  const characterCountId = useId();
  const searchStatusId = useId();

  const currentQuery =
    searchParams.get("q") ?? "";

  const [query, setQuery] =
    useState(currentQuery);

  const [isPending, startTransition] =
    useTransition();

  const normalizedQuery =
    normalizeSearchQuery(query);

  const isNearCharacterLimit =
    query.length >=
    MAX_SEARCH_QUERY_LENGTH * 0.8;

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isPending) {
      return;
    }

    if (!normalizedQuery) {
      setQuery("");

      startTransition(() => {
        router.push("/search");
      });

      return;
    }

    setQuery(normalizedQuery);

    const params = new URLSearchParams();

    params.set(
      "q",
      normalizedQuery
    );

    startTransition(() => {
      router.push(
        `/search?${params.toString()}`
      );
    });
  };

  const handleClear = () => {
    if (isPending) {
      return;
    }

    setQuery("");

    startTransition(() => {
      router.push("/search");
    });

    window.requestAnimationFrame(() => {
      inputRef.current?.focus();
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      role="search"
      aria-label="TOTONO内を検索"
      aria-busy={isPending}
      className="space-y-3"
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
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              left-4
              top-1/2
              z-10
              size-[1.125rem]
              -translate-y-1/2
              text-muted-foreground
              transition-colors
              duration-200
              group-focus-within/input:text-foreground
              motion-reduce:transition-none
            "
            strokeWidth={1.8}
          />

          <Input
            ref={inputRef}
            type="search"
            name="q"
            value={query}
            onChange={(event) =>
              setQuery(
                event.target.value
              )
            }
            placeholder="施設名、地域名、サ活を検索"
            maxLength={
              MAX_SEARCH_QUERY_LENGTH
            }
            autoComplete="off"
            enterKeyHint="search"
            aria-label="サウナ施設やサ活を検索"
            aria-describedby={[
              helpTextId,
              characterCountId,
              isPending
                ? searchStatusId
                : null,
            ]
              .filter(Boolean)
              .join(" ")}
            className="
              h-13
              rounded-2xl
              border-border/60
              bg-background/75
              pl-11
              pr-14
              text-base
              shadow-sm
              transition
              duration-200
              placeholder:text-muted-foreground/70
              hover:border-foreground/15
              focus-visible:border-foreground/25
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              sm:h-14
              motion-reduce:transition-none
            "
          />

          {query.length > 0 ? (
            <button
              type="button"
              onClick={handleClear}
              disabled={isPending}
              aria-label="検索キーワードをクリア"
              className="
                absolute
                right-1.5
                top-1/2
                inline-flex
                size-11
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
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                disabled:cursor-not-allowed
                disabled:opacity-50
                motion-reduce:transition-none
              "
            >
              <X
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />
            </button>
          ) : null}
        </div>

        <Button
          type="submit"
          disabled={isPending}
          aria-label={
            isPending
              ? "検索結果を読み込んでいます"
              : normalizedQuery
                ? "検索を実行"
                : "検索条件をクリアして検索画面を表示"
          }
          aria-busy={isPending}
          className="
            h-13
            min-h-11
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
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
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
              aria-hidden="true"
              className="
                size-4
                animate-spin
                motion-reduce:animate-none
              "
              strokeWidth={1.8}
            />
          ) : (
            <Search
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
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
          id={helpTextId}
          className="
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          例：東京、渋谷、外気浴
        </p>

        <span
          id={characterCountId}
          className={`
            shrink-0
            text-xs
            tabular-nums
            transition-colors
            motion-reduce:transition-none
            ${
              isNearCharacterLimit
                ? "font-semibold text-error"
                : "text-muted-foreground"
            }
          `}
          aria-live="polite"
          aria-atomic="true"
        >
          <span aria-hidden="true">
            {query.length} /{" "}
            {MAX_SEARCH_QUERY_LENGTH}
          </span>

          <span className="sr-only">
            {MAX_SEARCH_QUERY_LENGTH}
            文字中
            {query.length}
            文字入力済み
          </span>
        </span>
      </div>

      <p
        id={searchStatusId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {isPending
          ? "検索結果を読み込んでいます。"
          : ""}
      </p>
    </form>
  );
}
