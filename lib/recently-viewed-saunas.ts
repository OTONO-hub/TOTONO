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

const STORAGE_KEY =
  "totono-recently-viewed-saunas";

const MAX_RECENTLY_VIEWED_SAUNAS = 6;

/**
 * localStorageから最近見た施設を取得します。
 *
 * サーバー側ではlocalStorageを利用できないため、
 * ブラウザでのみ実行します。
 */
export function getRecentlyViewedSaunas(): RecentlyViewedSauna[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!storedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (!Array.isArray(parsedValue)) {
      return [];
    }

    return parsedValue.filter(
      isRecentlyViewedSauna
    );
  } catch {
    return [];
  }
}

/**
 * 閲覧した施設を履歴へ保存します。
 *
 * 同じ施設がすでに存在する場合は、
 * 古いデータを削除して先頭へ移動します。
 */
export function saveRecentlyViewedSauna(
  sauna: SaveRecentlyViewedSaunaInput
): void {
  if (typeof window === "undefined") {
    return;
  }

  const currentSaunas =
    getRecentlyViewedSaunas();

  const nextSaunas: RecentlyViewedSauna[] = [
    {
      ...sauna,
      viewedAt: new Date().toISOString(),
    },
    ...currentSaunas.filter(
      (currentSauna) =>
        currentSauna.id !== sauna.id
    ),
  ].slice(0, MAX_RECENTLY_VIEWED_SAUNAS);

  try {
    window.localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(nextSaunas)
    );
  } catch {
    /**
     * localStorageが無効な環境や
     * 保存容量を超えた場合でも、
     * 施設詳細ページの表示を止めません。
     */
  }
}

/**
 * 最近見た施設の履歴を削除します。
 */
export function clearRecentlyViewedSaunas(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    window.localStorage.removeItem(
      STORAGE_KEY
    );
  } catch {
    /**
     * 履歴削除に失敗しても
     * アプリ本体の動作には影響させません。
     */
  }
}

/**
 * localStorageから読み込んだ値が、
 * 最近見た施設の形式になっているか確認します。
 */
function isRecentlyViewedSauna(
  value: unknown
): value is RecentlyViewedSauna {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const sauna =
    value as Record<string, unknown>;

  return (
    typeof sauna.id === "string" &&
    typeof sauna.name === "string" &&
    isNullableString(sauna.imageUrl) &&
    isNullableString(sauna.prefecture) &&
    isNullableString(sauna.city) &&
    isNullableNumber(
      sauna.averageRating
    ) &&
    typeof sauna.viewedAt === "string"
  );
}

function isNullableString(
  value: unknown
): value is string | null {
  return (
    typeof value === "string" ||
    value === null
  );
}

function isNullableNumber(
  value: unknown
): value is number | null {
  return (
    typeof value === "number" ||
    value === null
  );
}
