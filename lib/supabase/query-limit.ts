export const DEFAULT_QUERY_LIMIT = 12;
export const MAXIMUM_QUERY_LIMIT = 100;

type NormalizeQueryLimitOptions = {
  defaultLimit?: number;
  maximumLimit?: number;
  minimumLimit?: number;
};

/**
 * Supabaseクエリへ渡す取得件数を、
 * 安全な整数へ正規化します。
 *
 * - NaNやInfinityはデフォルト値へ変換
 * - 小数は切り捨て
 * - 最小値と最大値の範囲内へ制限
 */
export function normalizeQueryLimit(
  limit: number | undefined,
  options: NormalizeQueryLimitOptions = {}
): number {
  const minimumLimit =
    normalizePositiveInteger(
      options.minimumLimit,
      1
    );

  const maximumLimit = Math.max(
    minimumLimit,
    normalizePositiveInteger(
      options.maximumLimit,
      MAXIMUM_QUERY_LIMIT
    )
  );

  const defaultLimit = clampLimit(
    normalizePositiveInteger(
      options.defaultLimit,
      DEFAULT_QUERY_LIMIT
    ),
    minimumLimit,
    maximumLimit
  );

  if (
    limit === undefined ||
    !Number.isFinite(limit)
  ) {
    return defaultLimit;
  }

  return clampLimit(
    Math.floor(limit),
    minimumLimit,
    maximumLimit
  );
}

/**
 * ページ番号からSupabaseのrange指定を作成します。
 *
 * pageは1から始まる値として扱います。
 *
 * 例：
 * page = 1、limit = 12
 * → from: 0、to: 11
 */
export function createQueryRange(
  page: number | undefined,
  limit: number | undefined,
  options: NormalizeQueryLimitOptions = {}
): {
  page: number;
  limit: number;
  from: number;
  to: number;
} {
  const normalizedLimit =
    normalizeQueryLimit(
      limit,
      options
    );

  const normalizedPage =
    normalizePage(page);

  const from =
    (normalizedPage - 1) *
    normalizedLimit;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    from,
    to:
      from +
      normalizedLimit -
      1,
  };
}

function normalizePage(
  page: number | undefined
): number {
  if (
    page === undefined ||
    !Number.isFinite(page)
  ) {
    return 1;
  }

  return Math.max(
    1,
    Math.floor(page)
  );
}

function normalizePositiveInteger(
  value: number | undefined,
  fallbackValue: number
): number {
  if (
    value === undefined ||
    !Number.isFinite(value)
  ) {
    return fallbackValue;
  }

  return Math.max(
    1,
    Math.floor(value)
  );
}

function clampLimit(
  value: number,
  minimumLimit: number,
  maximumLimit: number
): number {
  return Math.max(
    minimumLimit,
    Math.min(
      maximumLimit,
      value
    )
  );
}
