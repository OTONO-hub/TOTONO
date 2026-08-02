import type { SupabaseClient } from "@supabase/supabase-js";

import { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";

/**
 * サウナ施設の基本情報です。
 */
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

  /**
   * 現在地から施設までの距離です。
   *
   * 現在地検索を行った場合だけ値が入ります。
   * 単位はkmです。
   */
  distance_km?: number | null;
};

/**
 * 施設検索で利用できる設備条件です。
 */
export type SaunaFeature =
  | "sauna"
  | "cold-bath"
  | "outdoor"
  | "rest-area"
  | "restaurant"
  | "parking";

/**
 * 現在地検索に使用する位置情報です。
 */
export type SaunaLocationSearch = {
  /**
   * 現在地の緯度です。
   */
  latitude: number;

  /**
   * 現在地の経度です。
   */
  longitude: number;

  /**
   * 検索半径です。
   *
   * 単位はkmです。
   */
  radiusKm: number;
};

/**
 * searchSaunasの追加オプションです。
 *
 * このオプションを省略した場合は、
 * 従来どおりの検索になります。
 */
export type SearchSaunasOptions = {
  location?: SaunaLocationSearch | null;

  /**
   * 最大取得件数です。
   *
   * 省略時は10件です。
   */
  resultLimit?: number;
};

/**
 * 人気施設ランキングの表示用データです。
 */
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

/**
 * 人気施設ランキングで使用する
 * 施設の基本情報です。
 */
type PopularSaunaBaseRow = {
  id: string;
  name: string;
  prefecture: string | null;
  city: string | null;
  image_url: string | null;
};

/**
 * postsテーブルから取得する
 * 投稿と施設の紐付き情報です。
 */
type PostSaunaRow = {
  sauna_id: string | null;
};

/**
 * 人気施設ランキング内部で使用する設定です。
 */
type PopularSaunaRankingOptions = {
  limit: number;
  prefecture?: string;
};

/**
 * 人気スコアの計算に使用する値です。
 */
type PopularityScoreInput = {
  postCount: number;
  favoriteCount: number;
  averageRating: number | null;
  ratingCount: number;
};

/**
 * 通常の施設検索で取得する件数です。
 */
const SAUNA_SEARCH_LIMIT = 10;

/**
 * 施設検索で許可する最大取得件数です。
 */
const MAX_SAUNA_SEARCH_LIMIT = 100;

/**
 * 現在地検索で許可する最小半径です。
 */
const MIN_SEARCH_RADIUS_KM = 1;

/**
 * 現在地検索で許可する最大半径です。
 */
const MAX_SEARCH_RADIUS_KM = 100;

/**
 * 人気ランキングの標準取得件数です。
 */
const DEFAULT_POPULAR_SAUNA_LIMIT = 3;

/**
 * 人気ランキングで許可する最大取得件数です。
 */
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
 * サウナ施設を検索します。
 *
 * 既存の第4引数prefectureを維持し、
 * 現在地検索用のoptionsを第5引数へ追加しています。
 *
 * 従来の呼び出し方：
 *
 * searchSaunas(
 *   supabase,
 *   keyword,
 *   features,
 *   prefecture
 * )
 *
 * 現在地検索を含む呼び出し方：
 *
 * searchSaunas(
 *   supabase,
 *   keyword,
 *   features,
 *   prefecture,
 *   {
 *     location: {
 *       latitude,
 *       longitude,
 *       radiusKm,
 *     },
 *   }
 * )
 *
 * @param supabase Supabaseクライアント
 * @param keyword 検索文字列
 * @param features 設備条件
 * @param prefecture 都道府県
 * @param options 現在地などの追加条件
 * @returns 検索結果の施設一覧
 */
export async function searchSaunas(
  supabase: SupabaseClient,
  keyword: string,
  features: SaunaFeature[] = [],
  prefecture?: string,
  options: SearchSaunasOptions = {}
): Promise<Sauna[]> {
  const trimmedKeyword = keyword.trim();

  const trimmedPrefecture =
    prefecture?.trim() ?? "";

  /**
   * URLなどから想定外の設備条件が渡されても
   * 安全に検索できるよう、許可された条件だけへ整えます。
   */
  const safeFeatures =
    normalizeSaunaFeatures(features);

  /**
   * 現在地情報を検証します。
   *
   * 値が不正な場合はnullになります。
   */
  const location = normalizeLocationSearch(
    options.location
  );

  /**
   * 現在地情報がある場合は、
   * PostGISのRPCを使用して距離検索を行います。
   */
  if (location) {
    const nearbySaunas =
      await searchNearbySaunas(
        supabase,
        trimmedKeyword,
        safeFeatures,
        location,
        options.resultLimit
      );

    /**
     * RPCに都道府県条件がない場合でも、
     * 既存の都道府県絞り込みを維持します。
     */
    if (trimmedPrefecture) {
      return nearbySaunas.filter(
        (sauna) =>
          sauna.prefecture ===
          trimmedPrefecture
      );
    }

    return nearbySaunas;
  }

  /**
   * キーワードと都道府県が両方空の場合は、
   * 検索を実行しません。
   *
   * 都道府県のみ選択されている場合は
   * 検索を実行できます。
   */
  if (
    !trimmedKeyword &&
    !trimmedPrefecture
  ) {
    return [];
  }

  return searchSaunasNormally(
    supabase,
    trimmedKeyword,
    safeFeatures,
    trimmedPrefecture,
    options.resultLimit
  );
}

/**
 * 現在地を使用しない通常の施設検索です。
 *
 * 施設名、都道府県、設備条件を
 * 組み合わせて検索できます。
 */
async function searchSaunasNormally(
  supabase: SupabaseClient,
  keyword: string,
  features: SaunaFeature[],
  prefecture: string,
  resultLimit?: number
): Promise<Sauna[]> {
  let query = supabase
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
    );

  /**
   * キーワードが入力されている場合だけ、
   * 施設名の部分一致検索を追加します。
   */
  if (keyword) {
    query = query.or(
      `name.ilike.%${keyword}%,normalized_name.ilike.%${keyword}%`
    );
  }

  /**
   * 都道府県が選択されている場合は、
   * 完全一致条件を追加します。
   */
  if (prefecture) {
    query = query.eq(
      "prefecture",
      prefecture
    );
  }

  /**
   * 選択された設備条件を追加します。
   */
  for (const feature of features) {
    switch (feature) {
      case "sauna":
        query = query.eq(
          "has_sauna_room",
          true
        );
        break;

      case "cold-bath":
        query = query.eq(
          "has_cold_bath",
          true
        );
        break;

      case "outdoor":
        query = query.eq(
          "has_outdoor_air_bath",
          true
        );
        break;

      case "rest-area":
        query = query.eq(
          "has_rest_area",
          true
        );
        break;

      case "restaurant":
        query = query.eq(
          "has_restaurant",
          true
        );
        break;

      case "parking":
        query = query.eq(
          "has_parking",
          true
        );
        break;
    }
  }

  const { data, error } = await query
    .order("is_verified", {
      ascending: false,
    })
    .order("name", {
      ascending: true,
    })
    .limit(
      normalizeSaunaSearchLimit(
        resultLimit ?? SAUNA_SEARCH_LIMIT
      )
    );

  if (error) {
    throw new Error(
      `施設の検索に失敗しました: ${error.message}`
    );
  }

  return (data ?? []) as Sauna[];
}

/**
 * 現在地から指定半径以内の施設を検索します。
 *
 * Supabase SQL Editorで作成した
 * search_saunas_nearby RPCを呼び出します。
 */
async function searchNearbySaunas(
  supabase: SupabaseClient,
  keyword: string,
  features: SaunaFeature[],
  location: SaunaLocationSearch,
  resultLimit?: number
): Promise<Sauna[]> {
  const { data, error } = await supabase.rpc(
    "search_saunas_nearby",
    {
      user_latitude: location.latitude,
      user_longitude: location.longitude,
      search_radius_km: location.radiusKm,
      search_keyword: keyword,
      search_features: features,
      result_limit: normalizeSaunaSearchLimit(
        resultLimit ?? SAUNA_SEARCH_LIMIT
      ),
    }
  );

  if (error) {
    throw new Error(
      `現在地周辺の施設検索に失敗しました: ${error.message}`
    );
  }

  return (data ?? []) as Sauna[];
}

/**
 * 設備条件を安全な値へ整えます。
 */
function normalizeSaunaFeatures(
  features: SaunaFeature[]
): SaunaFeature[] {
  const allowedFeatures =
    new Set<SaunaFeature>([
      "sauna",
      "cold-bath",
      "outdoor",
      "rest-area",
      "restaurant",
      "parking",
    ]);

  /**
   * Setを使用し、
   * 同じ設備条件の重複も取り除きます。
   */
  return Array.from(
    new Set(
      features.filter((feature) =>
        allowedFeatures.has(feature)
      )
    )
  );
}

/**
 * 現在地検索条件を検証します。
 *
 * 不正な値の場合はnullを返し、
 * 現在地検索を行わないようにします。
 */
function normalizeLocationSearch(
  location?: SaunaLocationSearch | null
): SaunaLocationSearch | null {
  if (!location) {
    return null;
  }

  const {
    latitude,
    longitude,
    radiusKm,
  } = location;

  /**
   * 数値として有効か確認します。
   */
  if (
    !Number.isFinite(latitude) ||
    !Number.isFinite(longitude) ||
    !Number.isFinite(radiusKm)
  ) {
    return null;
  }

  /**
   * 緯度は-90〜90の範囲です。
   */
  if (
    latitude < -90 ||
    latitude > 90
  ) {
    return null;
  }

  /**
   * 経度は-180〜180の範囲です。
   */
  if (
    longitude < -180 ||
    longitude > 180
  ) {
    return null;
  }

  /**
   * 検索半径を安全な範囲へ調整します。
   */
  const safeRadiusKm = Math.min(
    Math.max(
      radiusKm,
      MIN_SEARCH_RADIUS_KM
    ),
    MAX_SEARCH_RADIUS_KM
  );

  return {
    latitude,
    longitude,
    radiusKm: safeRadiusKm,
  };
}

/**
 * 施設検索の取得件数を
 * 1〜100件の範囲へ調整します。
 */
function normalizeSaunaSearchLimit(
  limit: number
): number {
  if (!Number.isFinite(limit)) {
    return SAUNA_SEARCH_LIMIT;
  }

  return Math.min(
    Math.max(Math.floor(limit), 1),
    MAX_SAUNA_SEARCH_LIMIT
  );
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

  return data as Sauna | null;
}

/**
 * TOTONO内で注目されている施設を、
 * 全国総合ランキング形式で取得します。
 *
 * @param supabase Supabaseクライアント
 * @param limit 取得する施設数
 * @returns 総合人気スコアの高い施設一覧
 */
export async function getPopularSaunas(
  supabase: SupabaseClient,
  limit = DEFAULT_POPULAR_SAUNA_LIMIT
): Promise<PopularSauna[]> {
  return getPopularSaunaRanking(supabase, {
    limit,
  });
}

/**
 * 指定された都道府県で注目されている施設を、
 * 総合人気ランキング形式で取得します。
 *
 * 全国ランキングと同じ人気スコアを使用します。
 *
 * @param supabase Supabaseクライアント
 * @param prefecture 都道府県名
 * @param limit 取得する施設数
 * @returns 都道府県内の人気施設一覧
 */
export async function getPopularSaunasByPrefecture(
  supabase: SupabaseClient,
  prefecture: string,
  limit = DEFAULT_POPULAR_SAUNA_LIMIT
): Promise<PopularSauna[]> {
  const trimmedPrefecture =
    prefecture.trim();

  if (!trimmedPrefecture) {
    return [];
  }

  return getPopularSaunaRanking(supabase, {
    limit,
    prefecture: trimmedPrefecture,
  });
}

/**
 * 全国または指定都道府県を対象に、
 * 人気施設ランキングを取得します。
 *
 * 処理の流れは次のとおりです。
 *
 * 1. 対象施設を決定
 * 2. 施設ごとの投稿数を集計
 * 3. 投稿数をもとに候補施設を選定
 * 4. 評価・お気に入り情報を一括取得
 * 5. 総合人気スコアを計算
 * 6. 人気順に並び替え
 */
async function getPopularSaunaRanking(
  supabase: SupabaseClient,
  options: PopularSaunaRankingOptions
): Promise<PopularSauna[]> {
  const safeLimit =
    normalizePopularSaunaLimit(
      options.limit
    );

  const candidateLimit =
    calculateCandidateLimit(safeLimit);

  const prefecture =
    options.prefecture?.trim() || null;

  /**
   * 都道府県が指定されている場合は、
   * 最初にその地域の施設を取得します。
   *
   * 全国ランキングの場合は、
   * 投稿情報から候補施設を決めた後に
   * 施設情報を取得します。
   */
  let prefectureSaunaRows:
    | PopularSaunaBaseRow[]
    | null = null;

  let targetSaunaIds:
    | string[]
    | null = null;

  if (prefecture) {
    const {
      data: saunaRows,
      error: saunasError,
    } = await supabase
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
      .eq("prefecture", prefecture);

    if (saunasError) {
      throw new Error(
        `都道府県別の施設情報取得に失敗しました: ${saunasError.message}`
      );
    }

    prefectureSaunaRows =
      (saunaRows ??
        []) as PopularSaunaBaseRow[];

    if (
      prefectureSaunaRows.length === 0
    ) {
      return [];
    }

    targetSaunaIds =
      prefectureSaunaRows.map(
        (sauna) => sauna.id
      );
  }

  /**
   * 投稿と施設の紐付きを取得します。
   *
   * 都道府県指定がある場合は、
   * 対象地域の施設に限定します。
   */
  let postsQuery = supabase
    .from("posts")
    .select("sauna_id")
    .not("sauna_id", "is", null);

  if (targetSaunaIds) {
    postsQuery = postsQuery.in(
      "sauna_id",
      targetSaunaIds
    );
  }

  const {
    data: postRows,
    error: postsError,
  } = await postsQuery;

  if (postsError) {
    throw new Error(
      `人気施設の投稿情報取得に失敗しました: ${postsError.message}`
    );
  }

  const typedPostRows =
    (postRows ?? []) as PostSaunaRow[];

  if (typedPostRows.length === 0) {
    return [];
  }

  /**
   * 施設ごとの投稿数を集計します。
   */
  const postCountBySaunaId =
    createPostCountBySaunaId(
      typedPostRows
    );

  /**
   * 投稿数の多い施設から、
   * 総合ランキングの候補を選びます。
   */
  const candidateSaunaIds =
    selectCandidateSaunaIds(
      postCountBySaunaId,
      candidateLimit
    );

  if (
    candidateSaunaIds.length === 0
  ) {
    return [];
  }

  /**
   * 都道府県指定時は、
   * すでに取得済みの施設一覧から
   * 候補施設だけを抽出します。
   *
   * 全国ランキング時は、
   * 候補施設の情報を新たに取得します。
   */
  let candidateSaunaRows:
    PopularSaunaBaseRow[];

  if (prefectureSaunaRows) {
    const candidateSaunaIdSet =
      new Set(candidateSaunaIds);

    candidateSaunaRows =
      prefectureSaunaRows.filter(
        (sauna) =>
          candidateSaunaIdSet.has(
            sauna.id
          )
      );
  } else {
    const {
      data: saunaRows,
      error: saunasError,
    } = await supabase
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
      .in("id", candidateSaunaIds);

    if (saunasError) {
      throw new Error(
        `人気施設の情報取得に失敗しました: ${saunasError.message}`
      );
    }

    candidateSaunaRows =
      (saunaRows ??
        []) as PopularSaunaBaseRow[];
  }

  if (
    candidateSaunaRows.length === 0
  ) {
    return [];
  }

  /**
   * 評価・投稿・お気に入りの指標を
   * 候補施設について一括取得します。
   */
  const metricsBySaunaId =
    await getSaunaMetricsBySaunaIds(
      supabase,
      candidateSaunaIds
    );

  /**
   * 施設情報と指標を統合し、
   * 総合人気スコアを計算します。
   */
  const popularSaunas =
    candidateSaunaRows.map(
      (sauna): PopularSauna => {
        const metrics =
          metricsBySaunaId[sauna.id];

        const postCount =
          metrics?.postCount ??
          postCountBySaunaId.get(
            sauna.id
          ) ??
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
          prefecture:
            sauna.prefecture,
          city: sauna.city,
          image_url: sauna.image_url,
          post_count: postCount,
          favorite_count:
            favoriteCount,
          average_rating:
            averageRating,
          rating_count: ratingCount,
          popularity_score:
            popularityScore,
        };
      }
    );

  return sortPopularSaunas(
    popularSaunas
  ).slice(0, safeLimit);
}

/**
 * 人気施設ランキングの取得件数を、
 * 許容範囲内へ調整します。
 */
function normalizePopularSaunaLimit(
  limit: number
): number {
  if (!Number.isFinite(limit)) {
    return DEFAULT_POPULAR_SAUNA_LIMIT;
  }

  return Math.min(
    Math.max(Math.floor(limit), 1),
    MAX_POPULAR_SAUNA_LIMIT
  );
}

/**
 * 総合ランキングを計算する
 * 候補施設数を決定します。
 */
function calculateCandidateLimit(
  limit: number
): number {
  return Math.min(
    Math.max(
      limit *
        POPULAR_SAUNA_CANDIDATE_MULTIPLIER,
      limit
    ),
    MAX_POPULAR_SAUNA_CANDIDATES
  );
}

/**
 * 投稿データから施設ごとの投稿数を集計します。
 */
function createPostCountBySaunaId(
  postRows: PostSaunaRow[]
): Map<string, number> {
  const postCountBySaunaId =
    new Map<string, number>();

  for (const post of postRows) {
    if (
      typeof post.sauna_id !==
        "string" ||
      !post.sauna_id
    ) {
      continue;
    }

    const currentCount =
      postCountBySaunaId.get(
        post.sauna_id
      ) ?? 0;

    postCountBySaunaId.set(
      post.sauna_id,
      currentCount + 1
    );
  }

  return postCountBySaunaId;
}

/**
 * 投稿数の多い施設から、
 * 総合ランキングの候補を選びます。
 */
function selectCandidateSaunaIds(
  postCountBySaunaId: Map<
    string,
    number
  >,
  candidateLimit: number
): string[] {
  return Array.from(
    postCountBySaunaId.entries()
  )
    .sort((a, b) => {
      const countDifference =
        b[1] - a[1];

      if (countDifference !== 0) {
        return countDifference;
      }

      return a[0].localeCompare(b[0]);
    })
    .slice(0, candidateLimit)
    .map(([saunaId]) => saunaId);
}

/**
 * 総合人気スコアの高い順へ並べ替えます。
 *
 * スコアが同じ場合は、
 * お気に入り数、投稿数、評価件数、
 * 施設IDの順で並び順を安定させます。
 */
function sortPopularSaunas(
  saunas: PopularSauna[]
): PopularSauna[] {
  return [...saunas].sort(
    (a, b) => {
      const scoreDifference =
        b.popularity_score -
        a.popularity_score;

      if (scoreDifference !== 0) {
        return scoreDifference;
      }

      const favoriteDifference =
        b.favorite_count -
        a.favorite_count;

      if (
        favoriteDifference !== 0
      ) {
        return favoriteDifference;
      }

      const postDifference =
        b.post_count - a.post_count;

      if (postDifference !== 0) {
        return postDifference;
      }

      const ratingDifference =
        b.rating_count -
        a.rating_count;

      if (ratingDifference !== 0) {
        return ratingDifference;
      }

      return a.id.localeCompare(b.id);
    }
  );
}

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
      : averageRating *
        ratingReliability;

  const score =
    postCount * 3 +
    favoriteCount * 2 +
    ratingCount +
    adjustedAverageRating * 2;

  return Number(score.toFixed(2));
}
