export const MAX_SEARCH_QUERY_LENGTH = 100;

export function normalizeSearchQuery(
  value: string | undefined
) {
  return (value ?? "")
    .trim()
    .replace(/\s+/g, " ")
    .slice(0, MAX_SEARCH_QUERY_LENGTH);
}
