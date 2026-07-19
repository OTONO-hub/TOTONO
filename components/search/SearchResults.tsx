import type { ComponentProps } from "react";

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
  return (
    <div
      className="
        mt-12
        space-y-16
        sm:mt-14
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
  );
}
