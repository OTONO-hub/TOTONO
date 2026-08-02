import type { SupabaseClient } from "@supabase/supabase-js";

import { getFavoriteSaunas } from "@/services/favorite-saunas";
import {
  getPopularSaunas,
  getPopularSaunasByPrefecture,
  type PopularSauna,
} from "@/services/saunas";

const DEFAULT_RECOMMENDATION_LIMIT = 3;
const CANDIDATE_MULTIPLIER = 3;
const HIGH_RATING_THRESHOLD = 4.5;

export type RecommendedSauna =
  PopularSauna & {
    recommendation_reason?: string;
  };

export type SaunaRecommendationResult = {
  recommendedSaunas: RecommendedSauna[];
  popularSaunas: PopularSauna[];
  preferredPrefecture: string | null;
};

/**
 * お気に入り施設の都道府県を集計し、
 * 最も登録数が多い都道府県を返します。
 */
function getPreferredPrefecture(
  favoriteSaunas: Array<{
    prefecture: string | null;
  }>
): string | null {
  const prefectureCounts = new Map<
    string,
    number
  >();

  for (const sauna of favoriteSaunas) {
    const prefecture =
      sauna.prefecture?.trim();

    if (!prefecture) {
      continue;
    }

    prefectureCounts.set(
      prefecture,
      (prefectureCounts.get(prefecture) ?? 0) + 1
    );
  }

  return (
    [...prefectureCounts.entries()]
      .sort((a, b) => b[1] - a[1])[0]?.[0] ??
    null
  );
}

/**
 * 平均評価と評価件数から、
 * 高評価施設かどうかを判定します。
 */
function isHighlyRated(
  sauna: PopularSauna
): boolean {
  return (
    sauna.average_rating !== null &&
    sauna.average_rating >=
      HIGH_RATING_THRESHOLD &&
    sauna.rating_count > 0
  );
}

/**
 * おすすめ理由を生成します。
 */
function createRecommendationReason(
  sauna: PopularSauna,
  preferredPrefecture: string | null
): string {
  const isPreferredArea =
    preferredPrefecture !== null &&
    sauna.prefecture?.trim() ===
      preferredPrefecture;

  if (
    isPreferredArea &&
    isHighlyRated(sauna)
  ) {
    return `${preferredPrefecture}で人気の高評価施設`;
  }

  if (isPreferredArea) {
    return `${preferredPrefecture}で人気の施設`;
  }

  if (isHighlyRated(sauna)) {
    return "利用者評価の高い人気施設";
  }

  return "TOTONOで注目されている人気施設";
}

/**
 * ログインユーザー向けのおすすめ施設と、
 * 全国人気施設を取得します。
 *
 * 推薦条件:
 * 1. お気に入り済み施設を除外
 * 2. お気に入りが多い都道府県を優先
 * 3. 評価4.5以上の施設を優先
 * 4. 足りない場合は全国人気施設で補完
 */
export async function getSaunaRecommendations(
  supabase: SupabaseClient,
  userId: string,
  limit = DEFAULT_RECOMMENDATION_LIMIT
): Promise<SaunaRecommendationResult> {
  const safeLimit = Math.max(1, limit);
  const candidateLimit =
    safeLimit * CANDIDATE_MULTIPLIER;

  const [
    nationalPopularCandidates,
    favoriteSaunas,
  ] = await Promise.all([
    getPopularSaunas(
      supabase,
      candidateLimit
    ),
    getFavoriteSaunas(
      supabase,
      userId
    ),
  ]);

  const preferredPrefecture =
    getPreferredPrefecture(
      favoriteSaunas
    );

  const prefectureCandidates =
    preferredPrefecture
      ? await getPopularSaunasByPrefecture(
          supabase,
          preferredPrefecture,
          candidateLimit
        )
      : [];

  const favoriteSaunaIdSet = new Set(
    favoriteSaunas.map(
      (sauna) => sauna.id
    )
  );

  const recommendationCandidates = [
    ...prefectureCandidates,
    ...nationalPopularCandidates,
  ];

  const seenSaunaIds =
    new Set<string>();

  const uniqueCandidates =
    recommendationCandidates.filter(
      (sauna) => {
        if (
          favoriteSaunaIdSet.has(sauna.id) ||
          seenSaunaIds.has(sauna.id)
        ) {
          return false;
        }

        seenSaunaIds.add(sauna.id);
        return true;
      }
    );

  const highlyRatedCandidates =
    uniqueCandidates.filter(
      isHighlyRated
    );

  const otherCandidates =
    uniqueCandidates.filter(
      (sauna) => !isHighlyRated(sauna)
    );

  const recommendedSaunas = [
    ...highlyRatedCandidates,
    ...otherCandidates,
  ]
    .slice(0, safeLimit)
    .map((sauna) => ({
      ...sauna,
      recommendation_reason:
        createRecommendationReason(
          sauna,
          preferredPrefecture
        ),
    }));

  return {
    recommendedSaunas,
    popularSaunas:
      nationalPopularCandidates.slice(
        0,
        safeLimit
      ),
    preferredPrefecture,
  };
}
