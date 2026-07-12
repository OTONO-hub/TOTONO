import { SupabaseClient } from "@supabase/supabase-js";

import { Post } from "@/types/post";

const MAX_SEARCH_RESULTS = 50;

export async function searchPosts(
  supabase: SupabaseClient,
  query: string
): Promise<Post[]> {
  const normalizedQuery = query.trim();

  if (!normalizedQuery) {
    return [];
  }

  const escapedQuery = escapeSearchQuery(normalizedQuery);

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .or(
      `sauna_name.ilike.%${escapedQuery}%,comment.ilike.%${escapedQuery}%`
    )
    .order("created_at", { ascending: false })
    .limit(MAX_SEARCH_RESULTS);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

function escapeSearchQuery(query: string) {
  return query
    .replaceAll("\\", "\\\\")
    .replaceAll("%", "\\%")
    .replaceAll("_", "\\_")
    .replaceAll(",", "\\,")
    .replaceAll("(", "\\(")
    .replaceAll(")", "\\)");
}