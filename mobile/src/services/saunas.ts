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
  has_cold_bath: boolean | null;
  has_outdoor_air_bath: boolean | null;
  has_rest_area: boolean | null;
  has_restaurant: boolean | null;
  has_parking: boolean | null;
  is_verified: boolean;
  created_at: string;
  updated_at: string;
  distance_km?: number;
};

export type NearbySearchLocation = {
  latitude: number;
  longitude: number;
  radiusKm: number;
};

export type FacilityPhotoAttribution = {
  publicUrl: string;
  sourceType: "self_shot" | "facility_provided" | "open_license";
  photographerName: string;
  sourceUrl: string | null;
  licenseName: string | null;
  licenseUrl: string | null;
  attributionText: string | null;
};

type FacilityPhotoAttributionRow = {
  public_url: unknown;
  source_type: unknown;
  photographer_name: unknown;
  source_url: unknown;
  license_name: unknown;
  license_url: unknown;
  attribution_text: unknown;
};

const SEARCH_LIMIT = 20;

export async function searchSaunas(
  supabase: SupabaseClient,
  keyword: string,
  prefecture?: string
): Promise<Sauna[]> {
  const trimmedKeyword =
    keyword.trim();
  const trimmedPrefecture =
    prefecture?.trim() ?? "";

  if (
    !trimmedKeyword &&
    !trimmedPrefecture
  ) {
    return [];
  }

  if (!trimmedKeyword) {
    const {
      data,
      error,
    } = await supabase
      .from("saunas")
      .select("*")
      .eq(
        "prefecture",
        trimmedPrefecture
      )
      .order("is_verified", {
        ascending: false,
      })
      .order("name", {
        ascending: true,
      })
      .limit(SEARCH_LIMIT);

    if (error) {
      throw new Error(
        `施設の検索に失敗しました: ${error.message}`
      );
    }

    return (data ?? []) as Sauna[];
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
        trimmedPrefecture ||
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

export async function searchNearbySaunas(
  supabase: SupabaseClient,
  keyword: string,
  location: NearbySearchLocation
): Promise<Sauna[]> {
  const {
    latitude,
    longitude,
    radiusKm,
  } = location;

  if (
    !Number.isFinite(latitude) ||
    latitude < -90 ||
    latitude > 90 ||
    !Number.isFinite(longitude) ||
    longitude < -180 ||
    longitude > 180 ||
    ![3, 10, 30].includes(radiusKm)
  ) {
    throw new Error(
      "現在地検索の条件が正しくありません。"
    );
  }

  const {
    data,
    error,
  } = await supabase.rpc(
    "search_saunas_nearby",
    {
      user_latitude: latitude,
      user_longitude: longitude,
      search_radius_km: radiusKm,
      search_keyword: keyword.trim(),
      search_features: [],
      result_limit: SEARCH_LIMIT,
    }
  );

  if (error) {
    throw new Error(
      `現在地周辺の施設検索に失敗しました: ${error.message}`
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

export async function getFacilityPhotoAttribution(
  supabase: SupabaseClient,
  saunaId: string
): Promise<FacilityPhotoAttribution | null> {
  const { data, error } = await supabase.rpc(
    "get_public_facility_photo_attribution",
    { target_sauna_id: saunaId }
  );

  if (error) {
    // マイグレーション反映前でも施設詳細は表示し続ける。
    console.warn(
      "施設写真のクレジットを取得できませんでした。",
      error.message
    );
    return null;
  }

  const row = (Array.isArray(data) ? data[0] : data) as
    | FacilityPhotoAttributionRow
    | null
    | undefined;

  if (
    !row ||
    typeof row.public_url !== "string" ||
    typeof row.photographer_name !== "string" ||
    !isFacilityPhotoSourceType(row.source_type)
  ) {
    return null;
  }

  return {
    publicUrl: row.public_url,
    sourceType: row.source_type,
    photographerName: row.photographer_name,
    sourceUrl: optionalString(row.source_url),
    licenseName: optionalString(row.license_name),
    licenseUrl: optionalString(row.license_url),
    attributionText: optionalString(row.attribution_text),
  };
}

function optionalString(value: unknown): string | null {
  return typeof value === "string" && value.trim() ? value : null;
}

function isFacilityPhotoSourceType(
  value: unknown
): value is FacilityPhotoAttribution["sourceType"] {
  return (
    value === "self_shot" ||
    value === "facility_provided" ||
    value === "open_license"
  );
}
