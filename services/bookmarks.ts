import type { SupabaseClient } from "@supabase/supabase-js";

export async function isBookmarked(
  supabase: SupabaseClient,
  userId: string,
  postId: string
) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function getBookmarkedPostIds(
  supabase: SupabaseClient,
  userId: string,
  postIds: string[]
) {
  if (postIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", userId)
    .in("post_id", postIds);

  if (error) {
    throw error;
  }

  return data.map((bookmark) => bookmark.post_id);
}

export async function getAllBookmarkedPostIds(
  supabase: SupabaseClient,
  userId: string
) {
  const { data, error } = await supabase
    .from("bookmarks")
    .select("post_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw error;
  }

  return data.map((bookmark) => bookmark.post_id);
}

export async function addBookmark(
  supabase: SupabaseClient,
  userId: string,
  postId: string
) {
  const { error } = await supabase.from("bookmarks").insert({
    user_id: userId,
    post_id: postId,
  });

  if (error) {
    throw error;
  }
}

export async function removeBookmark(
  supabase: SupabaseClient,
  userId: string,
  postId: string
) {
  const { error } = await supabase
    .from("bookmarks")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) {
    throw error;
  }
}