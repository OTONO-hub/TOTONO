/**
 * 現在地検索でユーザーが選択できる検索半径です。
 *
 * UIと「次の半径」の判定で同じ値を使うため、
 * 1つのファイルで管理します。
 */
export const CURRENT_LOCATION_RADIUS_OPTIONS = [
  3,
  5,
  10,
  20,
] as const;

/**
 * 現在地検索結果に含まれる距離の範囲です。
 */
export type SaunaDistanceRange = {
  nearestKm: number;
  farthestKm: number;
};

/**
 * 現在選択中の半径より、
 * 1段階広い検索半径を返します。
 *
 * すでに最大半径の場合はnullを返します。
 */
export function getNextLocationRadiusKm(
  currentRadiusKm: number,
): number | null {
  return (
    CURRENT_LOCATION_RADIUS_OPTIONS.find(
      (radiusOption) =>
        radiusOption > currentRadiusKm,
    ) ?? null
  );
}

/**
 * 現在地検索結果から、
 * 最寄り施設と最も遠い施設の距離を取得します。
 */
export function getSaunaDistanceRange(
  saunas: Array<{ distance_km?: number | null }>,
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
 * 距離を画面表示用の文字列へ整えます。
 *
 * 1km未満は小数第2位まで、
 * 1km以上は小数第1位まで表示します。
 */
export function formatDistanceKm(
  distanceKm: number,
): string {
  if (distanceKm < 1) {
    return distanceKm.toFixed(2);
  }

  return distanceKm.toFixed(1);
}
