import type { SupabaseClient } from "@supabase/supabase-js";

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

export async function getFacilityPhotoAttribution(
  supabase: SupabaseClient,
  saunaId: string
): Promise<FacilityPhotoAttribution | null> {
  const { data, error } = await supabase.rpc(
    "get_public_facility_photo_attribution",
    { target_sauna_id: saunaId }
  );

  if (error) {
    // マイグレーション反映前でも施設詳細そのものは表示し続ける。
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
    !isSourceType(row.source_type)
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

function isSourceType(
  value: unknown
): value is FacilityPhotoAttribution["sourceType"] {
  return (
    value === "self_shot" ||
    value === "facility_provided" ||
    value === "open_license"
  );
}
