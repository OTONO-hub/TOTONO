import type { SupabaseClient } from "@supabase/supabase-js";

import { getPostImagesByPostIds } from "@/services/post-images";
import {
  getPostsByUserId,
  getRecentPosts,
} from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import { getSaunaRecommendations } from "@/services/recommendations";
import type { DashboardData } from "@/types/dashboard";
import {
  createHomeHeroMessage,
  createHomeSummary,
  createTodayPickReason,
  selectAlternativeRecommendations,
  selectTodayPick,
} from "@/view-models/home";

const HOME_RECOMMENDATION_LIMIT = 4;
const HOME_POPULAR_SAUNA_LIMIT = 3;
const HOME_COMMUNITY_POST_LIMIT = 12;

export async function getHomeDashboardData(
  supabase: SupabaseClient,
  userId: string
): Promise<DashboardData> {
  /*
   * Homeで必要なデータを用途ごとに分け、
   * 互いに依存しないデータは並行して取得します。
   *
   * 自分の投稿：
   * サマリーとサウナライフ表示に使用します。
   *
   * Community投稿：
   * Homeへ表示する最新件数だけ取得します。
   *
   * おすすめ施設：
   * Today Pick・代替候補・人気施設に使用します。
   */
  const [
    myPosts,
    recentCommunityPosts,
    recommendationResult,
  ] = await Promise.all([
    getPostsByUserId(
      supabase,
      userId
    ),
    getRecentPosts(
      supabase,
      HOME_COMMUNITY_POST_LIMIT
    ),
    getSaunaRecommendations(
      supabase,
      userId,
      HOME_RECOMMENDATION_LIMIT
    ),
  ]);

  const {
    recommendedSaunas,
    popularSaunas,
    preferredPrefecture,
  } = recommendationResult;

  const communityPostIds =
    recentCommunityPosts.map(
      (post) => post.id
    );

  const communityUserIds = [
    ...new Set(
      recentCommunityPosts.map(
        (post) => post.user_id
      )
    ),
  ];

  /*
   * Community投稿者プロフィールと投稿画像は、
   * 互いに依存しないため並行して取得します。
   */
  const [
    profiles,
    postImagesByPostId,
  ] = await Promise.all([
    communityUserIds.length > 0
      ? getProfilesByUserIds(
          supabase,
          communityUserIds
        )
      : Promise.resolve([]),
    communityPostIds.length > 0
      ? getPostImagesByPostIds(
          supabase,
          communityPostIds
        )
      : Promise.resolve(
          new Map()
        ),
  ]);

  const profilesByUserId = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ])
  );

  /*
   * post_imagesへ移行済みの投稿では先頭画像を使用し、
   * 旧投稿ではposts.image_urlをフォールバックとして使用します。
   */
  const friendsActivityPosts =
    recentCommunityPosts.map(
      (post) => {
        const postImages =
          postImagesByPostId.get(
            post.id
          ) ?? [];

        const coverImageUrl =
          postImages[0]?.image_url ??
          post.image_url ??
          null;

        const imageCount =
          postImages.length > 0
            ? postImages.length
            : coverImageUrl
              ? 1
              : 0;

        return {
          ...post,
          image_url: coverImageUrl,
          image_count: imageCount,
          profile:
            profilesByUserId.get(
              post.user_id
            ) ?? null,
        };
      }
    );

  /*
   * ここから先は、取得データをHome表示用へ整形します。
   * 文言・サマリー計算・候補選択はViewModelへ集約しています。
   */
  const heroMessage =
    createHomeHeroMessage();

  const summary =
    createHomeSummary(myPosts);

  const todayPick =
    selectTodayPick(
      recommendedSaunas
    );

  const todayPickReason =
    createTodayPickReason({
      preferredPrefecture,
      recommendationReason:
        todayPick?.recommendation_reason,
      hasTodayPick:
        todayPick !== null,
    });

  const recommendations =
    selectAlternativeRecommendations(
      recommendedSaunas
    );

  /*
   * おすすめ施設と人気施設が重複しないようにし、
   * Homeに必要な件数だけ残します。
   */
  const recommendedSaunaIds =
    new Set(
      recommendedSaunas.map(
        (sauna) => sauna.id
      )
    );

  const uniquePopularSaunas =
    popularSaunas
      .filter(
        (sauna) =>
          !recommendedSaunaIds.has(
            sauna.id
          )
      )
      .slice(
        0,
        HOME_POPULAR_SAUNA_LIMIT
      );

  return {
    heroMessage,
    summary,
    todayPick,
    todayPickReason,
    recommendations,
    popularSaunas:
      uniquePopularSaunas,
    preferredPrefecture,
    myPosts,
    friendsActivityPosts,
  };
}
