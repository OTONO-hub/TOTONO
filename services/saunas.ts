import type { SupabaseClient } from "@supabase/supabase-js";

import { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";

export type Sauna = {
  id: string;
  name: string;
  normalized_name: string | null;
  address: string | null;
  prefecture: string | null;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  website_url: string | null;
  opening_hours: string | null;
  image_url: string | null;
  google_place_id: string | null;
  source: string | null;
  has_sauna_room: boolean;
  has_cold_bath: boolean;
  has_outdoor_air_bath: boolean;
  has_rest_area: boolean;
  has_restaurant: boolean;
  has_parking: boolean;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
};

export type PopularSauna = {
  id: string;
  name: string;
  prefecture: string | null;
  city: string | null;
  image_url: string | null;
  post_count: number;
  favorite_count: number;
  average_rating: number | null;
  rating_count: number;
  popularity_score: number;
};

const SAUNA_SEARCH_LIMIT = 10;
const DEFAULT_POPULAR_SAUNA_LIMIT = 3;
const MAX_POPULAR_SAUNA_LIMIT = 20;

/**
 * 総合ランキングを計算する前に、
 * 投稿数を基準として取得する候補施設数の倍率です。
 *
 * 例：
 * 表示件数が3件の場合は、
 * 最大15施設を総合ランキングの候補にします。
 */
const POPULAR_SAUNA_CANDIDATE_MULTIPLIER = 5;

/**
 * 総合ランキング候補として取得する
 * 最大施設数です。
 */
const MAX_POPULAR_SAUNA_CANDIDATES = 100;

/**
 * saunasテーブルから施設名を検索します。
 *
 * @param supabase Supabaseクライアント
 * @param keyword 検索文字列
 * @returns 検索結果の施設一覧
 */
export async function searchSaunas(
  supabase: SupabaseClient,
  keyword: string
): Promise<Sauna[]> {
  const trimmedKeyword = keyword.trim();

  if (!trimmedKeyword) {
    return [];
  }

  const { data, error } = await supabase
    .from("saunas")
    .select(
      `
        id,
        name,
        normalized_name,
        address,
        prefecture,
        city,
        postal_code,
        latitude,
        longitude,
        phone_number,
        website_url,
        opening_hours,
        image_url,
        google_place_id,
        source,
        has_sauna_room,
        has_cold_bath,
        has_outdoor_air_bath,
        has_rest_area,
        has_restaurant,
        has_parking,
        is_verified,
        created_at,
        updated_at
      `
    )
    .or(
      `name.ilike.%${trimmedKeyword}%,normalized_name.ilike.%${trimmedKeyword}%`
    )
    .order("is_verified", {
      ascending: false,
    })
    .order("name", {
      ascending: true,
    })
    .limit(SAUNA_SEARCH_LIMIT);

  if (error) {
    throw new Error(
      `施設の検索に失敗しました: ${error.message}`
    );
  }

  return data ?? [];
}

/**
 * IDを指定して施設情報を1件取得します。
 *
 * @param supabase Supabaseクライアント
 * @param saunaId 施設ID
 * @returns 施設情報
 */
export async function getSaunaById(
  supabase: SupabaseClient,
  saunaId: string
): Promise<Sauna | null> {
  const { data, error } = await supabase
    .from("saunas")
    .select(
      `
        id,
        name,
        normalized_name,
        address,
        prefecture,
        city,
        postal_code,
        latitude,
        longitude,
        phone_number,
        website_url,
        opening_hours,
        image_url,
        google_place_id,
        source,
        has_sauna_room,
        has_cold_bath,
        has_outdoor_air_bath,
        has_rest_area,
        has_restaurant,
        has_parking,
        is_verified,
        created_at,
        updated_at
      `
    )
    .eq("id", saunaId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `施設情報の取得に失敗しました: ${error.message}`
    );
  }

  return data;
}

/**
 * TOTONO内で注目されている施設を、
 * 総合人気ランキング形式で取得します。
 *
 * ランキングには次の指標を使用します。
 *
 * ・サ活投稿数
 * ・お気に入り人数
 * ・評価件数
 * ・平均評価
 *
 * 最初に投稿数をもとに候補施設を絞り込み、
 * その候補について詳細な指標を一括取得します。
 *
 * @param supabase Supabaseクライアント
 * @param limit 取得する施設数
 * @returns 総合人気スコアの高い施設一覧
 */
export async function getPopularSaunas(
  supabase: SupabaseClient,
  limit = DEFAULT_POPULAR_SAUNA_LIMIT
): Promise<PopularSauna[]> {
  const safeLimit = Math.min(
    Math.max(Math.floor(limit), 1),
    MAX_POPULAR_SAUNA_LIMIT
  );

  /*
   * 総合ランキングを計算する候補施設数です。
   *
   * 表示件数より多めの候補を取得することで、
   * 投稿数だけでなく、お気に入り数や評価も
   * ランキングへ反映できるようにします。
   */
  const candidateLimit = Math.min(
    Math.max(
      safeLimit *
        POPULAR_SAUNA_CANDIDATE_MULTIPLIER,
      safeLimit
    ),
    MAX_POPULAR_SAUNA_CANDIDATES
  );

  /*
   * まず、投稿と施設の紐付きを取得します。
   */
  const {
    data: postRows,
    error: postsError,
  } = await supabase
    .from("posts")
    .select("sauna_id")
    .not("sauna_id", "is", null);

  if (postsError) {
    throw new Error(
      `人気施設の投稿情報取得に失敗しました: ${postsError.message}`
    );
  }

  if (!postRows || postRows.length === 0) {
    return [];
  }

  /*
   * 施設ごとの投稿数を集計します。
   */
  const postCountBySaunaId = new Map<
    string,
    number
  >();

  for (const post of postRows) {
    if (
      typeof post.sauna_id !== "string" ||
      !post.sauna_id
    ) {
      continue;
    }

    const currentCount =
      postCountBySaunaId.get(post.sauna_id) ?? 0;

    postCountBySaunaId.set(
      post.sauna_id,
      currentCount + 1
    );
  }

  /*
   * 投稿数の多い施設を、
   * 総合ランキングの候補として選びます。
   */
  const candidateSaunaIds = Array.from(
    postCountBySaunaId.entries()
  )
    .sort((a, b) => {
      const countDifference = b[1] - a[1];

      if (countDifference !== 0) {
        return countDifference;
      }

      return a[0].localeCompare(b[0]);
    })
    .slice(0, candidateLimit)
    .map(([saunaId]) => saunaId);

  if (candidateSaunaIds.length === 0) {
    return [];
  }

  /*
   * 候補施設の基本情報と指標を並行して取得します。
   */
  const [
    {
      data: saunaRows,
      error: saunasError,
    },
    metricsBySaunaId,
  ] = await Promise.all([
    supabase
      .from("saunas")
      .select(
        `
          id,
          name,
          prefecture,
          city,
          image_url
        `
      )
      .in("id", candidateSaunaIds),
    getSaunaMetricsBySaunaIds(
      supabase,
      candidateSaunaIds
    ),
  ]);

  if (saunasError) {
    throw new Error(
      `人気施設の情報取得に失敗しました: ${saunasError.message}`
    );
  }

  /*
   * 施設情報と指標を統合し、
   * 総合人気スコアを計算します。
   */
  const popularSaunas = (saunaRows ?? []).map(
    (sauna): PopularSauna => {
      const metrics =
        metricsBySaunaId[sauna.id];

      const postCount =
        metrics?.postCount ??
        postCountBySaunaId.get(sauna.id) ??
        0;

      const favoriteCount =
        metrics?.favoriteCount ?? 0;

      const averageRating =
        metrics?.averageRating ?? null;

      const ratingCount =
        metrics?.ratingCount ?? 0;

      const popularityScore =
        calculatePopularityScore({
          postCount,
          favoriteCount,
          averageRating,
          ratingCount,
        });

      return {
        id: sauna.id,
        name: sauna.name,
        prefecture: sauna.prefecture,
        city: sauna.city,
        image_url: sauna.image_url,
        post_count: postCount,
        favorite_count: favoriteCount,
        average_rating: averageRating,
        rating_count: ratingCount,
        popularity_score: popularityScore,
      };
    }
  );

  /*
   * 総合人気スコアの高い順に並べます。
   *
   * スコアが同じ場合は、
   * お気に入り数、投稿数、施設IDの順で
   * 並び順を安定させます。
   */
  return popularSaunas
    .sort((a, b) => {
      const scoreDifference =
        b.popularity_score -
        a.popularity_score;

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      const favoriteDifference =
        b.favorite_count -
        a.favorite_count;

      if (favoriteDifference !== 0) {
        return favoriteDifference;
      }

      const postDifference =
        b.post_count - a.post_count;

      if (postDifference !== 0) {
        return postDifference;
      }

      return a.id.localeCompare(b.id);
    })
    .slice(0, safeLimit);
}

type PopularityScoreInput = {
  postCount: number;
  favoriteCount: number;
  averageRating: number | null;
  ratingCount: number;
};

/**
 * 人気施設ランキングで使用する
 * 総合人気スコアを計算します。
 *
 * 平均評価については、
 * 評価件数が5件に達するまでは
 * 影響を小さくします。
 */
function calculatePopularityScore({
  postCount,
  favoriteCount,
  averageRating,
  ratingCount,
}: PopularityScoreInput): number {
  const ratingReliability = Math.min(
    ratingCount / 5,
    1
  );

  const adjustedAverageRating =
    averageRating === null
      ? 0
      : averageRating * ratingReliability;

  const score =
    postCount * 3 +
    favoriteCount * 2 +
    ratingCount +
    adjustedAverageRating * 2;

  return Number(score.toFixed(2));
}
