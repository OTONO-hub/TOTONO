import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getProfilesByUserIds } from "@/services/profile";
import type { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";
import type { searchPosts } from "@/services/search";
import type { searchSaunas } from "@/services/saunas";
import type { CommentWithAuthor } from "@/types/comment";

import type { SaunaSortKey } from "./search-params";

/**
 * 既存サービスが受け取るSupabaseクライアント型を再利用します。
 *
 * ユーティリティ側でSupabaseパッケージを直接参照しないため、
 * プロジェクト内の既存型定義と確実に一致します。
 */
type SupabaseClient =
  Parameters<typeof getCommentsByPostIds>[0];

type SearchPost =
  Awaited<ReturnType<typeof searchPosts>>[number];

type SearchSauna =
  Awaited<ReturnType<typeof searchSaunas>>[number];

type SaunaMetrics =
  Awaited<
    ReturnType<typeof getSaunaMetricsBySaunaIds>
  >;

type SortSaunaSearchResultsInput = {
  saunas: SearchSauna[];
  saunaMetrics: SaunaMetrics;
  sort: SaunaSortKey;
};

/**
 * 施設検索結果を、選択中の並び順へ整えます。
 *
 * 元の配列は変更せず、並び替えた新しい配列を返します。
 */
export function sortSaunaSearchResults({
  saunas,
  saunaMetrics,
  sort,
}: SortSaunaSearchResultsInput): SearchSauna[] {
  return [...saunas].sort((a, b) => {
    const metricsA = saunaMetrics[a.id];
    const metricsB = saunaMetrics[b.id];

    if (sort === "distance") {
      const distanceDifference =
        getSortableDistance(a.distance_km) -
        getSortableDistance(b.distance_km);

      if (distanceDifference !== 0) {
        return distanceDifference;
      }
    }

    if (sort === "rating") {
      const averageRatingDifference =
        (metricsB?.averageRating ?? -1) -
        (metricsA?.averageRating ?? -1);

      if (averageRatingDifference !== 0) {
        return averageRatingDifference;
      }

      const ratingCountDifference =
        (metricsB?.ratingCount ?? 0) -
        (metricsA?.ratingCount ?? 0);

      if (ratingCountDifference !== 0) {
        return ratingCountDifference;
      }
    }

    if (sort === "popular") {
      const popularityDifference =
        calculatePopularityScore(metricsB) -
        calculatePopularityScore(metricsA);

      if (popularityDifference !== 0) {
        return popularityDifference;
      }
    }

    return a.name.localeCompare(b.name, "ja");
  });
}

type CreateSearchPostsWithMetaInput = {
  supabase: SupabaseClient;
  userId: string;
  posts: SearchPost[];
};

/**
 * 投稿カードに必要な情報を一括取得し、
 * 投稿ごとの表示データへまとめます。
 */
export async function createSearchPostsWithMeta({
  supabase,
  userId,
  posts,
}: CreateSearchPostsWithMetaInput) {
  if (posts.length === 0) {
    return [];
  }

  const postIds = posts.map((post) => post.id);

  /**
   * コメントとブックマークは互いに依存しないため、
   * 並行して取得します。
   */
  const [rawComments, bookmarkedPostIds] =
    await Promise.all([
      getCommentsByPostIds(supabase, postIds),
      getBookmarkedPostIds(
        supabase,
        userId,
        postIds,
      ),
    ]);

  /**
   * getCommentsByPostIdsの戻り値型がanyとして扱われる環境でも、
   * CommentWithAuthorが持つcomment型を明示して安全に扱います。
   */
  const comments =
    rawComments as CommentWithAuthor["comment"][];

  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds,
  );

  const userIds = [
    ...posts.map((post) => post.user_id),
    ...comments.map(
      (comment) => comment.user_id,
    ),
  ];

  const profiles = await getProfilesByUserIds(
    supabase,
    userIds,
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ]),
  );

  const commentsByPostId =
    createCommentsByPostId(
      comments,
      profilesByUserId,
    );

  /**
   * 各投稿のいいね数と、
   * ログインユーザーのいいね状態を並行取得します。
   */
  return Promise.all(
    posts.map(async (post) => {
      const [likeCount, liked] =
        await Promise.all([
          getLikeCount(supabase, post.id),
          isLiked(
            supabase,
            userId,
            post.id,
          ),
        ]);

      return {
        post,
        author:
          profilesByUserId.get(post.user_id) ??
          null,
        likeCount,
        liked,
        bookmarked:
          bookmarkedPostIdSet.has(post.id),
        comments:
          commentsByPostId.get(post.id) ?? [],
      };
    }),
  );
}

function getSortableDistance(
  distanceKm: number | null | undefined,
): number {
  return typeof distanceKm === "number" &&
    Number.isFinite(distanceKm)
    ? distanceKm
    : Number.POSITIVE_INFINITY;
}

function calculatePopularityScore(
  metrics: SaunaMetrics[string] | undefined,
): number {
  return (
    (metrics?.postCount ?? 0) * 3 +
    (metrics?.favoriteCount ?? 0) * 2 +
    (metrics?.ratingCount ?? 0)
  );
}

function createCommentsByPostId(
  comments: CommentWithAuthor["comment"][],
  profilesByUserId: Map<
    string,
    Awaited<
      ReturnType<typeof getProfilesByUserIds>
    >[number]
  >,
): Map<string, CommentWithAuthor[]> {
  const commentsByPostId =
    new Map<string, CommentWithAuthor[]>();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
      comment,
      author:
        profilesByUserId.get(comment.user_id) ??
        null,
    };

    const currentComments =
      commentsByPostId.get(comment.post_id) ??
      [];

    currentComments.push(commentWithAuthor);

    commentsByPostId.set(
      comment.post_id,
      currentComments,
    );
  }

  return commentsByPostId;
}
