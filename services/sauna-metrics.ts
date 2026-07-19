import type { SupabaseClient } from "@supabase/supabase-js";

export type RatingDistribution = {
  1: number;
  2: number;
  3: number;
  4: number;
  5: number;
};

export type SaunaMetrics = {
  postCount: number;
  favoriteCount: number;
  averageRating: number | null;
  ratingCount: number;
  ratingDistribution: RatingDistribution;
};

export type SaunaMetricsBySaunaId = Record<
  string,
  SaunaMetrics
>;

type PostMetricRow = {
  sauna_id: string | null;
  rating: number | null;
};

type FavoriteMetricRow = {
  sauna_id: string | null;
};

type PostMetrics = {
  postCount: number;
  averageRating: number | null;
  ratingCount: number;
  ratingDistribution: RatingDistribution;
};

/**
 * 指定された複数施設について、
 * 次の指標を一括取得します。
 *
 * ・サ活件数
 * ・お気に入り人数
 * ・平均評価
 * ・評価件数
 * ・星1〜5の評価分布
 *
 * @param supabase Supabaseクライアント
 * @param saunaIds 集計対象の施設ID一覧
 * @returns 施設IDをキーにした指標情報
 */
export async function getSaunaMetricsBySaunaIds(
  supabase: SupabaseClient,
  saunaIds: string[]
): Promise<SaunaMetricsBySaunaId> {
  const uniqueSaunaIds = Array.from(
    new Set(
      saunaIds.filter(
        (saunaId): saunaId is string =>
          typeof saunaId === "string" &&
          saunaId.length > 0
      )
    )
  );

  if (uniqueSaunaIds.length === 0) {
    return {};
  }

  const [postMetrics, favoriteCounts] =
    await Promise.all([
      getPostMetricsBySaunaIds(
        supabase,
        uniqueSaunaIds
      ),
      getFavoriteCountsBySaunaIds(
        supabase,
        uniqueSaunaIds
      ),
    ]);

  return Object.fromEntries(
    uniqueSaunaIds.map((saunaId) => {
      const metric = postMetrics[saunaId];

      return [
        saunaId,
        {
          postCount: metric?.postCount ?? 0,
          favoriteCount:
            favoriteCounts[saunaId] ?? 0,
          averageRating:
            metric?.averageRating ?? null,
          ratingCount:
            metric?.ratingCount ?? 0,
          ratingDistribution:
            metric?.ratingDistribution ??
            createEmptyRatingDistribution(),
        },
      ];
    })
  );
}

/**
 * 指定された複数施設について、
 * 投稿数と評価情報を一括取得します。
 */
async function getPostMetricsBySaunaIds(
  supabase: SupabaseClient,
  saunaIds: string[]
): Promise<Record<string, PostMetrics>> {
  const { data, error } = await supabase
    .from("posts")
    .select("sauna_id, rating")
    .in("sauna_id", saunaIds);

  if (error) {
    throw new Error(
      `施設ごとのサ活情報取得に失敗しました: ${error.message}`
    );
  }

  const postCountBySaunaId: Record<
    string,
    number
  > = {};

  const ratingTotalBySaunaId: Record<
    string,
    number
  > = {};

  const ratingCountBySaunaId: Record<
    string,
    number
  > = {};

  const ratingDistributionBySaunaId: Record<
    string,
    RatingDistribution
  > = {};

  for (const row of (data ??
    []) as PostMetricRow[]) {
    if (
      typeof row.sauna_id !== "string" ||
      !row.sauna_id
    ) {
      continue;
    }

    const saunaId = row.sauna_id;

    postCountBySaunaId[saunaId] =
      (postCountBySaunaId[saunaId] ?? 0) + 1;

    const normalizedRating =
      normalizeRating(row.rating);

    if (normalizedRating === null) {
      continue;
    }

    ratingTotalBySaunaId[saunaId] =
      (ratingTotalBySaunaId[saunaId] ?? 0) +
      normalizedRating;

    ratingCountBySaunaId[saunaId] =
      (ratingCountBySaunaId[saunaId] ?? 0) + 1;

    const currentDistribution =
      ratingDistributionBySaunaId[saunaId] ??
      createEmptyRatingDistribution();

    currentDistribution[normalizedRating] += 1;

    ratingDistributionBySaunaId[saunaId] =
      currentDistribution;
  }

  return Object.fromEntries(
    saunaIds.map((saunaId) => {
      const ratingCount =
        ratingCountBySaunaId[saunaId] ?? 0;

      const ratingTotal =
        ratingTotalBySaunaId[saunaId] ?? 0;

      const averageRating =
        ratingCount > 0
          ? Number(
              (
                ratingTotal / ratingCount
              ).toFixed(1)
            )
          : null;

      return [
        saunaId,
        {
          postCount:
            postCountBySaunaId[saunaId] ?? 0,
          averageRating,
          ratingCount,
          ratingDistribution:
            ratingDistributionBySaunaId[
              saunaId
            ] ??
            createEmptyRatingDistribution(),
        },
      ];
    })
  );
}

/**
 * 指定された複数施設のお気に入り人数を取得します。
 */
async function getFavoriteCountsBySaunaIds(
  supabase: SupabaseClient,
  saunaIds: string[]
): Promise<Record<string, number>> {
  const { data, error } = await supabase
    .from("favorite_saunas")
    .select("sauna_id")
    .in("sauna_id", saunaIds);

  if (error) {
    throw new Error(
      `施設ごとのお気に入り人数取得に失敗しました: ${error.message}`
    );
  }

  const counts: Record<string, number> = {};

  for (const row of (data ??
    []) as FavoriteMetricRow[]) {
    if (
      typeof row.sauna_id !== "string" ||
      !row.sauna_id
    ) {
      continue;
    }

    counts[row.sauna_id] =
      (counts[row.sauna_id] ?? 0) + 1;
  }

  return counts;
}

/**
 * 空の評価分布を作成します。
 */
function createEmptyRatingDistribution(): RatingDistribution {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
}

/**
 * 投稿の評価値を1〜5の整数へ変換します。
 *
 * nullや範囲外の値は集計対象外にします。
 */
function normalizeRating(
  rating: number | null
): 1 | 2 | 3 | 4 | 5 | null {
  if (
    typeof rating !== "number" ||
    !Number.isFinite(rating)
  ) {
    return null;
  }

  const roundedRating = Math.round(rating);

  if (
    roundedRating < 1 ||
    roundedRating > 5
  ) {
    return null;
  }

  return roundedRating as 1 | 2 | 3 | 4 | 5;
}
