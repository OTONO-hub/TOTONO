import type { SupabaseClient } from "@supabase/supabase-js";

import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getProfilesByUserIds } from "@/services/profile";
import { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";
import type { SearchSort } from "@/services/search-sort";
import { searchPosts } from "@/services/search";
import {
  searchSaunas,
  type Sauna,
  type SaunaFeature,
} from "@/services/saunas";
import type { CommentWithAuthor } from "@/types/comment";

type GetSearchPageDataParams = {
  supabase: SupabaseClient;
  userId: string;
  query: string;
  features?: SaunaFeature[];
  sort?: SearchSort;

  /*
   * 選択された都道府県名です。
   *
   * 例：
   * 東京都
   * 神奈川県
   */
  prefecture?: string;
};

export async function getSearchPageData({
  supabase,
  userId,
  query,
  features = [],
  sort = "popular",
  prefecture,
}: GetSearchPageDataParams) {
  /*
   * 投稿とサウナ施設を並行して検索します。
   *
   * 施設検索には、
   * 検索キーワード・設備条件・都道府県条件を
   * 渡します。
   */
  const [posts, saunas] = await Promise.all([
    searchPosts(supabase, query),

    searchSaunas(
      supabase,
      query,
      features,
      prefecture
    ),
  ]);

  /*
   * 検索された施設ごとの統計情報を取得します。
   *
   * 投稿数、お気に入り数、平均評価などが
   * saunaMetricsに含まれます。
   */
  const saunaMetrics =
    await getSaunaMetricsBySaunaIds(
      supabase,
      saunas.map((sauna) => sauna.id)
    );

  /*
   * 検索された投稿に紐づくコメントを取得します。
   */
  const comments =
    await getCommentsByPostIds(
      supabase,
      posts.map((post) => post.id)
    );

  /*
   * ログインユーザーが保存している投稿IDを取得します。
   */
  const bookmarkedPostIds =
    await getBookmarkedPostIds(
      supabase,
      userId,
      posts.map((post) => post.id)
    );

  /*
   * Setへ変換することで、
   * 投稿が保存済みかを効率よく判定できます。
   */
  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds
  );

  /*
   * 投稿者とコメント投稿者の
   * ユーザーIDをまとめます。
   */
  const userIds = [
    ...posts.map((post) => post.user_id),

    ...comments.map(
      (comment) => comment.user_id
    ),
  ];

  /*
   * 投稿やコメントに表示する
   * プロフィール情報を取得します。
   */
  const profiles =
    await getProfilesByUserIds(
      supabase,
      userIds
    );

  /*
   * ユーザーIDからプロフィールを
   * 取得できるMapを作成します。
   */
  const profilesByUserId = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ])
  );

  /*
   * コメントを投稿IDごとにまとめます。
   */
  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
      comment,

      author:
        profilesByUserId.get(
          comment.user_id
        ) ?? null,
    };

    const currentComments =
      commentsByPostId.get(
        comment.post_id
      ) ?? [];

    currentComments.push(
      commentWithAuthor
    );

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  /*
   * 投稿カードに必要な情報を作成します。
   *
   * ・投稿者
   * ・いいね数
   * ・ログインユーザーがいいね済みか
   * ・ブックマーク済みか
   * ・コメント一覧
   */
  const postsWithMeta =
    await Promise.all(
      posts.map(async (post) => ({
        post,

        author:
          profilesByUserId.get(
            post.user_id
          ) ?? null,

        likeCount:
          await getLikeCount(
            supabase,
            post.id
          ),

        liked:
          await isLiked(
            supabase,
            userId,
            post.id
          ),

        bookmarked:
          bookmarkedPostIdSet.has(
            post.id
          ),

        comments:
          commentsByPostId.get(
            post.id
          ) ?? [],
      }))
    );

  /*
   * 元のsaunas配列を直接変更しないよう、
   * コピーした配列を並び替えます。
   */
  const sortedSaunas = [...saunas];

  sortedSaunas.sort(
    (saunaA, saunaB) =>
      compareSaunas(
        saunaA,
        saunaB,
        saunaMetrics,
        sort
      )
  );

  return {
    saunas: sortedSaunas,
    saunaMetrics,
    postsWithMeta,
  };
}

/*
 * 指定された並び順に応じて、
 * 2つのサウナ施設を比較します。
 */
function compareSaunas(
  saunaA: Sauna,
  saunaB: Sauna,
  saunaMetrics: Awaited<
    ReturnType<
      typeof getSaunaMetricsBySaunaIds
    >
  >,
  sort: SearchSort
) {
  const metricsA =
    saunaMetrics[saunaA.id];

  const metricsB =
    saunaMetrics[saunaB.id];

  const postCountA =
    metricsA?.postCount ?? 0;

  const postCountB =
    metricsB?.postCount ?? 0;

  const favoriteCountA =
    metricsA?.favoriteCount ?? 0;

  const favoriteCountB =
    metricsB?.favoriteCount ?? 0;

  const averageRatingA =
    metricsA?.averageRating ?? 0;

  const averageRatingB =
    metricsB?.averageRating ?? 0;

  const ratingCountA =
    metricsA?.ratingCount ?? 0;

  const ratingCountB =
    metricsB?.ratingCount ?? 0;

  switch (sort) {
    /*
     * 平均評価の高い順です。
     *
     * 平均評価が同じ場合は、
     * 評価件数が多い施設を先にします。
     */
    case "rating": {
      const ratingDifference =
        averageRatingB -
        averageRatingA;

      if (ratingDifference !== 0) {
        return ratingDifference;
      }

      const ratingCountDifference =
        ratingCountB -
        ratingCountA;

      if (ratingCountDifference !== 0) {
        return ratingCountDifference;
      }

      return compareSaunaNames(
        saunaA,
        saunaB
      );
    }

    /*
     * 投稿数の多い順です。
     *
     * 投稿数が同じ場合は、
     * お気に入り数が多い施設を先にします。
     */
    case "posts": {
      const postCountDifference =
        postCountB -
        postCountA;

      if (postCountDifference !== 0) {
        return postCountDifference;
      }

      const favoriteCountDifference =
        favoriteCountB -
        favoriteCountA;

      if (
        favoriteCountDifference !== 0
      ) {
        return favoriteCountDifference;
      }

      return compareSaunaNames(
        saunaA,
        saunaB
      );
    }

    /*
     * 施設名の五十音・文字順です。
     */
    case "name":
      return compareSaunaNames(
        saunaA,
        saunaB
      );

    /*
     * 人気順です。
     *
     * 現在は、
     * お気に入り数＋投稿数を
     * 人気スコアとして使用します。
     */
    case "popular":
    default: {
      const popularityScoreA =
        favoriteCountA +
        postCountA;

      const popularityScoreB =
        favoriteCountB +
        postCountB;

      const popularityDifference =
        popularityScoreB -
        popularityScoreA;

      if (
        popularityDifference !== 0
      ) {
        return popularityDifference;
      }

      /*
       * 人気スコアが同じ場合は、
       * お気に入り数が多い施設を先にします。
       */
      const favoriteCountDifference =
        favoriteCountB -
        favoriteCountA;

      if (
        favoriteCountDifference !== 0
      ) {
        return favoriteCountDifference;
      }

      /*
       * お気に入り数も同じ場合は、
       * 投稿数が多い施設を先にします。
       */
      const postCountDifference =
        postCountB -
        postCountA;

      if (postCountDifference !== 0) {
        return postCountDifference;
      }

      return compareSaunaNames(
        saunaA,
        saunaB
      );
    }
  }
}

/*
 * 施設名を日本語環境で比較します。
 *
 * normalized_nameが登録されている場合は、
 * そちらを優先して利用します。
 */
function compareSaunaNames(
  saunaA: Sauna,
  saunaB: Sauna
) {
  const nameA =
    saunaA.normalized_name?.trim() ||
    saunaA.name;

  const nameB =
    saunaB.normalized_name?.trim() ||
    saunaB.name;

  return nameA.localeCompare(
    nameB,
    "ja"
  );
}