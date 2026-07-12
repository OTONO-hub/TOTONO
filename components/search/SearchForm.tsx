"use client";

import { FormEvent, useState } from "react";
import { Search, X } from "lucide-react";
import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const MAX_SEARCH_QUERY_LENGTH = 100;

export function SearchForm() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentQuery = searchParams.get("q") ?? "";
  const [query, setQuery] = useState(currentQuery);

  const handleSubmit = (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedQuery = query.trim();

    if (!trimmedQuery) {
      setQuery("");
      router.push("/search");
      return;
    }

    const params = new URLSearchParams();
    params.set("q", trimmedQuery);

    router.push(`/search?${params.toString()}`);
  };

  const handleClear = () => {
    setQuery("");
    router.push("/search");
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-2"
    >
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            aria-hidden="true"
          />

          <Input
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
            placeholder="サウナ名や投稿内容を検索"
            maxLength={MAX_SEARCH_QUERY_LENGTH}
            aria-label="サウナや投稿を検索"
            className="pl-9 pr-10"
          />

          {query && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="検索条件をクリア"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground transition hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>

        <Button
          type="submit"
          className="shrink-0"
        >
          <Search />
          <span className="hidden sm:inline">
            検索
          </span>
        </Button>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {query.length} / {MAX_SEARCH_QUERY_LENGTH}
        </span>
      </div>
    </form>
  );
}