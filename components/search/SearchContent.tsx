import type { ComponentProps } from "react";

import { SearchMessage } from "@/components/search/SearchMessage";
import { SearchResults } from "@/components/search/SearchResults";

type SearchResultsProps = ComponentProps<
  typeof SearchResults
>;

type SearchContentProps = {
  userId: string | null;
  query: string;
  saunas: SearchResultsProps["saunas"];
  saunaMetrics: SearchResultsProps["saunaMetrics"];
  posts: SearchResultsProps["posts"];
};

export function SearchContent({
  userId,
  query,
  saunas,
  saunaMetrics,
  posts,
}: SearchContentProps) {
  if (!userId) {
    return (
      <SearchMessage
        title="ログインが必要です"
        description="施設やサ活の検索結果を見るには、ログインしてください。"
      />
    );
  }

  if (!query) {
    return (
      <SearchMessage
        title="検索キーワードを入力してください"
        description="施設名、地域名、投稿内容などから検索できます。"
      />
    );
  }

  const totalResultCount =
    saunas.length + posts.length;

  if (totalResultCount === 0) {
    return (
      <SearchMessage
        title="検索結果が見つかりませんでした"
        description={`「${query}」に一致する施設やサ活はありませんでした。`}
      />
    );
  }

  return (
    <SearchResults
      query={query}
      userId={userId}
      saunas={saunas}
      saunaMetrics={saunaMetrics}
      posts={posts}
    />
  );
}
