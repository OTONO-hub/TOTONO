import type {
  SaunaFeature,
  SaunaLocationSearch,
} from "@/services/saunas";

import type { SaunaDistanceRange } from "../components/CurrentLocationRadiusControls";

export type SaunaSortKey =
  | "distance"
  | "popular"
  | "rating";

/**
 * URLから受け取った設備条件を
 * SaunaFeatureの配列へ変換します。
 */
export function normalizeSaunaFeatures(
  featureParams: string | string[] | undefined,
): SaunaFeature[] {
  if (!featureParams) {
    return [];
  }

  const rawFeatures = Array.isArray(featureParams)
    ? featureParams
    : [featureParams];

  const allowedFeatures = new Set<SaunaFeature>([
    "sauna",
    "cold-bath",
    "outdoor",
    "rest-area",
    "restaurant",
    "parking",
  ]);

  return Array.from(
    new Set(
      rawFeatures.filter(
        (feature): feature is SaunaFeature =>
          allowedFeatures.has(
            feature as SaunaFeature,
          ),
      ),
    ),
  );
}

type CreateLocationSearchInput = {
  latitude?: string;
  longitude?: string;
  radius?: string;
  location?: string;
};

/**
 * URLの緯度・経度・検索半径を、
 * searchSaunasへ渡せる値へ変換します。
 */
export function createLocationSearch({
  latitude,
  longitude,
  radius,
  location,
}: CreateLocationSearchInput): SaunaLocationSearch | null {
  if (location !== "current") {
    return null;
  }

  if (!latitude || !longitude || !radius) {
    return null;
  }

  const parsedLatitude = Number(latitude);
  const parsedLongitude = Number(longitude);
  const parsedRadius = Number(radius);

  if (
    !Number.isFinite(parsedLatitude) ||
    !Number.isFinite(parsedLongitude) ||
    !Number.isFinite(parsedRadius)
  ) {
    return null;
  }

  if (
    parsedLatitude < -90 ||
    parsedLatitude > 90
  ) {
    return null;
  }

  if (
    parsedLongitude < -180 ||
    parsedLongitude > 180
  ) {
    return null;
  }

  const safeRadiusKm = Math.min(
    Math.max(Math.floor(parsedRadius), 1),
    100,
  );

  return {
    latitude: parsedLatitude,
    longitude: parsedLongitude,
    radiusKm: safeRadiusKm,
  };
}

type CreateSortSearchParamsInput = {
  query: string;
  selectedPrefecture: string;
  features: SaunaFeature[];
  latitude?: string;
  longitude?: string;
  radius?: string;
  location?: string;
};

/**
 * 並び替えリンクに引き継ぐ検索条件を作成します。
 */
export function createSortSearchParams({
  query,
  selectedPrefecture,
  features,
  latitude,
  longitude,
  radius,
  location,
}: CreateSortSearchParamsInput): URLSearchParams {
  const params = new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  if (selectedPrefecture) {
    params.set(
      "prefecture",
      selectedPrefecture,
    );
  }

  for (const feature of features) {
    params.append("features", feature);
  }

  if (location === "current") {
    params.set("location", "current");

    if (latitude) {
      params.set("lat", latitude);
    }

    if (longitude) {
      params.set("lng", longitude);
    }

    if (radius) {
      params.set("radius", radius);
    }
  }

  return params;
}

/**
 * 現在地検索結果から、
 * 最寄り施設と最も遠い施設の距離を取得します。
 */
export function getSaunaDistanceRange(
  saunas: Array<{
    distance_km?: number | null;
  }>,
): SaunaDistanceRange | null {
  const distances = saunas
    .map((sauna) => sauna.distance_km)
    .filter(
      (distance): distance is number =>
        typeof distance === "number" &&
        Number.isFinite(distance) &&
        distance >= 0,
    );

  if (distances.length === 0) {
    return null;
  }

  return {
    nearestKm: Math.min(...distances),
    farthestKm: Math.max(...distances),
  };
}

/**
 * URLから受け取った並び順を、
 * 使用可能な値へ変換します。
 */
export function normalizeSaunaSort(
  sort: string,
  isCurrentLocationSearch: boolean,
): SaunaSortKey {
  if (sort === "popular") {
    return "popular";
  }

  if (sort === "rating") {
    return "rating";
  }

  if (
    sort === "distance" &&
    isCurrentLocationSearch
  ) {
    return "distance";
  }

  return isCurrentLocationSearch
    ? "distance"
    : "popular";
}

type NoResultDescriptionInput = {
  query: string;
  isCurrentLocationSearch: boolean;
  selectedPrefecture: string;
};

/**
 * 検索条件に応じて、
 * 結果が0件だった場合の説明文を作ります。
 */
export function createNoResultDescription({
  query,
  isCurrentLocationSearch,
  selectedPrefecture,
}: NoResultDescriptionInput): string {
  if (isCurrentLocationSearch) {
    return "現在地周辺に条件と一致するサウナ施設が見つかりませんでした。検索半径を変更して、もう一度お試しください。";
  }

  if (query) {
    return `「${query}」に一致する施設やサ活はありませんでした。`;
  }

  if (selectedPrefecture) {
    return `${selectedPrefecture}に一致するサウナ施設は見つかりませんでした。`;
  }

  return "指定された条件に一致するサウナ施設は見つかりませんでした。";
}

type CreateEmptySaunaMessageInput = {
  query: string;
  isCurrentLocationSearch: boolean;
  radiusKm?: number;
};

/**
 * 施設検索だけが0件だった場合の
 * メッセージを作ります。
 */
export function createEmptySaunaMessage({
  query,
  isCurrentLocationSearch,
  radiusKm,
}: CreateEmptySaunaMessageInput): string {
  if (isCurrentLocationSearch) {
    return `現在地から${
      radiusKm ?? 10
    }km以内にサウナ施設が見つかりませんでした。`;
  }

  if (query) {
    return `「${query}」に一致するサウナ施設は見つかりませんでした。`;
  }

  return "条件に一致するサウナ施設は見つかりませんでした。";
}
