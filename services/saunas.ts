import type { SupabaseClient } from "@supabase/supabase-js";

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
};

const SAUNA_SEARCH_LIMIT = 10;
const DEFAULT_POPULAR_SAUNA_LIMIT = 3;
const MAX_POPULAR_SAUNA_LIMIT = 20;

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
        is_verified,
        created_at,
        updated_at
      `
    )
    .or(
      `name.ilike.%${trimmedKeyword}%,normalized_name.ilike.%${trimmedKeyword}%`
    )
    .order("is_verified", { ascending: false })
    .order("name", { ascending: true })
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
 * 投稿数の多い施設をランキング形式で取得します。
 *
 * 現在はpostsテーブルのsauna_idを取得し、
 * アプリケーション側で施設ごとの投稿数を集計しています。
 *
 * @param supabase Supabaseクライアント
 * @param limit 取得する施設数
 * @returns 投稿数の多い施設一覧
 */
export async function getPopularSaunas(
  supabase: SupabaseClient,
  limit = DEFAULT_POPULAR_SAUNA_LIMIT
): Promise<PopularSauna[]> {
  const safeLimit = Math.min(
    Math.max(Math.floor(limit), 1),
    MAX_POPULAR_SAUNA_LIMIT
  );

  const { data: postRows, error: postsError } =
    await supabase
      .from("posts")
      .select("sauna_id")
      .not("sauna_id", "is", null);

  if (postsError) {
    throw new Error(
      `人気施設の投稿数取得に失敗しました: ${postsError.message}`
    );
  }

  if (!postRows || postRows.length === 0) {
    return [];
  }

  const postCountBySaunaId = new Map<string, number>();

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

  const ranking = Array.from(
    postCountBySaunaId.entries()
  )
    .sort((a, b) => {
      const countDifference = b[1] - a[1];

      if (countDifference !== 0) {
        return countDifference;
      }

      return a[0].localeCompare(b[0]);
    })
    .slice(0, safeLimit);

  if (ranking.length === 0) {
    return [];
  }

  const rankedSaunaIds = ranking.map(
    ([saunaId]) => saunaId
  );

  const { data: saunaRows, error: saunasError } =
    await supabase
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
      .in("id", rankedSaunaIds);

  if (saunasError) {
    throw new Error(
      `人気施設の情報取得に失敗しました: ${saunasError.message}`
    );
  }

  const saunaById = new Map(
    (saunaRows ?? []).map((sauna) => [
      sauna.id,
      sauna,
    ])
  );

  return ranking.flatMap(
    ([saunaId, postCount]) => {
      const sauna = saunaById.get(saunaId);

      if (!sauna) {
        return [];
      }

      return [
        {
          id: sauna.id,
          name: sauna.name,
          prefecture: sauna.prefecture,
          city: sauna.city,
          image_url: sauna.image_url,
          post_count: postCount,
        },
      ];
    }
  );
}