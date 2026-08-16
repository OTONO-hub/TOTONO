import type {
  SupabaseClient,
} from "@supabase/supabase-js";

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

const SEARCH_LIMIT = 20;

export async function searchSaunas(
  supabase: SupabaseClient,
  keyword: string
): Promise<Sauna[]> {
  const trimmedKeyword =
    keyword.trim();

  if (!trimmedKeyword) {
    return [];
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "search_saunas_ranked",
    {
      search_keyword:
        trimmedKeyword,
      search_prefecture:
        null,
      result_limit:
        SEARCH_LIMIT,
    }
  );

  if (error) {
    throw new Error(
      `施設の検索に失敗しました: ${error.message}`
    );
  }

  return (data ?? []) as Sauna[];
}

export async function getSaunaById(
  supabase: SupabaseClient,
  saunaId: string
): Promise<Sauna | null> {
  const {
    data,
    error,
  } = await supabase
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
    .eq(
      "id",
      saunaId
    )
    .maybeSingle();

  if (error) {
    throw new Error(
      `施設情報の取得に失敗しました: ${error.message}`
    );
  }

  return data as Sauna | null;
}
