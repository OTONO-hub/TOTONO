import type { ComponentProps } from "react";
import { Search } from "lucide-react";

import { PostSearchResults } from "@/components/search/PostSearchResults";
import { SaunaSearchResults } from "@/components/search/SaunaSearchResults";

type SaunaSearchResultsProps = ComponentProps<
  typeof SaunaSearchResults
>;

type PostSearchResultsProps = ComponentProps<
  typeof PostSearchResults
>;

type SearchResultsProps = {
  query: string;
  userId: string;
  saunas: SaunaSearchResultsProps["saunas"];
  saunaMetrics: SaunaSearchResultsProps["saunaMetrics"];
  posts: PostSearchResultsProps["posts"];
};

export function SearchResults({
  query,
  userId,
  saunas,
  saunaMetrics,
  posts,
}: SearchResultsProps) {
  const totalResultCount =
    saunas.length + posts.length;

  return (
    <div className="mt-12 sm:mt-14">
      <SearchResultSummary
        query={query}
        totalCount={totalResultCount}
        saunaCount={saunas.length}
        postCount={posts.length}
      />

      <div
        className="
          mt-14
          space-y-16
          sm:mt-16
          sm:space-y-20
        "
      >
        <SaunaSearchResults
          query={query}
          saunas={saunas}
          saunaMetrics={saunaMetrics}
        />

        <PostSearchResults
          query={query}
          userId={userId}
          posts={posts}
        />
      </div>
    </div>
  );
}

type SearchResultSummaryProps = {
  query: string;
  totalCount: number;
  saunaCount: number;
  postCount: number;
};

function SearchResultSummary({
  query,
  totalCount,
  saunaCount,
  postCount,
}: SearchResultSummaryProps) {
  return (
    <section
      aria-labelledby="search-result-summary-heading"
      className="
        overflow-hidden
        rounded-[1.75rem]
        border
        border-border/55
        bg-card/80
        px-5
        py-6
        shadow-sm
        backdrop-blur-md
        sm:px-7
        sm:py-7
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-muted-foreground
            "
          >
            <Search
              className="size-4 shrink-0"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Search Results
          </div>

          <h2
            id="search-result-summary-heading"
            className="
              mt-3
              break-words
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
              sm:text-2xl
            "
          >
            「{query}」の検索結果
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            関連するサウナ施設と、みんなのサ活を表示しています。
          </p>
        </div>

        <div
          className="
            flex
            shrink-0
            flex-wrap
            gap-2
          "
          aria-label={`検索結果は合計${totalCount}件です`}
        >
          <ResultCountBadge
            label="すべて"
            count={totalCount}
            emphasized
          />

          <ResultCountBadge
            label="施設"
            count={saunaCount}
          />

          <ResultCountBadge
            label="サ活"
            count={postCount}
          />
        </div>
      </div>
    </section>
  );
}

type ResultCountBadgeProps = {
  label: string;
  count: number;
  emphasized?: boolean;
};

function ResultCountBadge({
  label,
  count,
  emphasized = false,
}: ResultCountBadgeProps) {
  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3.5
        py-2
        text-xs
        ${
          emphasized
            ? `
              border-foreground/10
              bg-foreground
              text-background
            `
            : `
              border-border/60
              bg-background/65
              text-muted-foreground
            `
        }
      `}
    >
      <span>{label}</span>

      <strong
        className="
          font-semibold
          tabular-nums
        "
      >
        {count}
      </strong>
    </div>
  );
}
