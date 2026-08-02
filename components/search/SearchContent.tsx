import type {
  ComponentProps,
} from "react";

import { PopularSaunaSection } from "@/components/search/PopularSaunaSection";
import { SearchFilterChips } from "@/components/search/SearchFilterChips";
import { SearchFilters } from "@/components/search/SearchFilters";
import { SearchMessage } from "@/components/search/SearchMessage";
import { SearchResults } from "@/components/search/SearchResults";
import { SearchSort } from "@/components/search/SearchSort";
import type { PopularSauna } from "@/services/saunas";

type SearchResultsProps =
  ComponentProps<
    typeof SearchResults
  >;

type SearchContentProps = {
  userId: string | null;
  query: string;

  saunas:
    SearchResultsProps["saunas"];

  saunaMetrics:
    SearchResultsProps["saunaMetrics"];

  posts:
    SearchResultsProps["posts"];

  popularSaunas: PopularSauna[];

  rankingArea: string | null;
};

export function SearchContent({
  userId,
  query,
  saunas,
  saunaMetrics,
  posts,
  popularSaunas,
  rankingArea,
}: SearchContentProps) {
  /*
   * 未ログインの場合は、
   * 検索結果の代わりに
   * ログイン案内を表示します。
   *
   * 人気ランキングは
   * 未ログインでも閲覧できます。
   */
  if (!userId) {
    return (
      <>
        <SearchMessage
          title="ログインが必要です"
          description="施設やサ活の検索結果を見るには、ログインしてください。"
        />

        <PopularSaunaSection
          saunas={popularSaunas}
          area={rankingArea}
        />
      </>
    );
  }

  /*
   * 検索キーワードが未入力の場合です。
   *
   * 設備フィルターを表示したうえで、
   * 検索入力を案内します。
   */
  if (!query) {
    return (
      <>
        <div
          className="
            mt-8
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="min-w-0 flex-1">
            <SearchFilters />
          </div>
        </div>

        {/*
         * 現在選択されている
         * エリアや設備条件を表示します。
         */}
        <SearchFilterChips />

        <SearchMessage
          title="検索キーワードを入力してください"
          description="施設名、地域名、投稿内容などから検索できます。"
        />

        <PopularSaunaSection
          saunas={popularSaunas}
          area={rankingArea}
        />
      </>
    );
  }

  const totalResultCount =
    saunas.length +
    posts.length;

  /*
   * 検索キーワードがある場合は、
   * 設備条件と並び順を
   * 横並びで表示します。
   */
  const searchControls = (
    <>
      <div
        className="
          mt-8
          flex
          flex-col
          gap-4
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div
          className="
            min-w-0
            flex-1
          "
        >
          <SearchFilters />
        </div>

        <div
          className="
            w-full
            shrink-0
            sm:w-auto
          "
        >
          <SearchSort />
        </div>
      </div>

      {/*
       * 選択中のエリア、設備条件、
       * 並び順をチップで表示します。
       */}
      <SearchFilterChips />
    </>
  );

  /*
   * 検索結果が0件の場合です。
   *
   * 条件変更のためのUIを残しながら、
   * 人気ランキングを表示します。
   */
  if (totalResultCount === 0) {
    return (
      <>
        {searchControls}

        <SearchMessage
          title="検索結果が見つかりませんでした"
          description={`「${query}」に一致する施設やサ活はありませんでした。検索キーワードや設備条件を変更してお試しください。`}
        />

        <PopularSaunaSection
          saunas={popularSaunas}
          area={rankingArea}
        />
      </>
    );
  }

  /*
   * 通常の検索結果表示です。
   */
  return (
    <>
      {searchControls}

      <SearchResults
        query={query}
        userId={userId}
        saunas={saunas}
        saunaMetrics={
          saunaMetrics
        }
        posts={posts}
      />

      <PopularSaunaSection
        saunas={popularSaunas}
        area={rankingArea}
      />
    </>
  );
}
