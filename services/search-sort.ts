export const SEARCH_SORTS = [
  "popular",
  "rating",
  "posts",
  "name",
] as const;

export type SearchSort =
  (typeof SEARCH_SORTS)[number];

export function isSearchSort(
  value: string
): value is SearchSort {
  return SEARCH_SORTS.includes(
    value as SearchSort
  );
}

export function normalizeSearchSort(
  value: string | undefined
): SearchSort {
  if (!value) {
    return "popular";
  }

  return isSearchSort(value)
    ? value
    : "popular";
}
