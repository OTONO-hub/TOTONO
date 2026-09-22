export type RecentlyViewedSauna = {
  id: string;
  name: string;
  imageUrl: string | null;
  prefecture: string | null;
  city: string | null;
  averageRating: number | null;
  viewedAt: string;
};

export type SaveRecentlyViewedSaunaInput = Omit<
  RecentlyViewedSauna,
  "viewedAt"
>;

const STORAGE_KEY = "totono-recently-viewed-saunas";
const MAX_RECENTLY_VIEWED_SAUNAS = 6;

export function updateRecentlyViewedSaunas(
  current: RecentlyViewedSauna[],
  sauna: SaveRecentlyViewedSaunaInput,
  viewedAt = new Date().toISOString()
): RecentlyViewedSauna[] {
  return [
    { ...sauna, viewedAt },
    ...current.filter((item) => item.id !== sauna.id),
  ].slice(0, MAX_RECENTLY_VIEWED_SAUNAS);
}

export function getRecentlyViewedSaunas(): RecentlyViewedSauna[] {
  try {
    const storedValue = window.localStorage.getItem(STORAGE_KEY);
    if (!storedValue) return [];
    const parsed: unknown = JSON.parse(storedValue);
    return Array.isArray(parsed) ? parsed.filter(isRecentlyViewedSauna) : [];
  } catch {
    return [];
  }
}

export function saveRecentlyViewedSauna(
  sauna: SaveRecentlyViewedSaunaInput
): void {
  try {
    const next = updateRecentlyViewedSaunas(
      getRecentlyViewedSaunas(),
      sauna
    );
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  } catch {
    // 履歴の保存失敗で施設詳細の表示を止めません。
  }
}

export function clearRecentlyViewedSaunas(): void {
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // 履歴の削除失敗でSearch画面の利用を止めません。
  }
}

function isRecentlyViewedSauna(value: unknown): value is RecentlyViewedSauna {
  if (typeof value !== "object" || value === null) return false;
  const sauna = value as Record<string, unknown>;
  return (
    typeof sauna.id === "string" &&
    typeof sauna.name === "string" &&
    isNullableString(sauna.imageUrl) &&
    isNullableString(sauna.prefecture) &&
    isNullableString(sauna.city) &&
    isNullableNumber(sauna.averageRating) &&
    typeof sauna.viewedAt === "string"
  );
}

function isNullableString(value: unknown): value is string | null {
  return typeof value === "string" || value === null;
}

function isNullableNumber(value: unknown): value is number | null {
  return typeof value === "number" || value === null;
}
