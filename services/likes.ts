import { SupabaseClient } from "@supabase/supabase-js";

export async function likePost(
  supabase: SupabaseClient,
  userId: string,
  postId: string
) {
  const { error } = await supabase.from("likes").insert({
    user_id: userId,
    post_id: postId,
  });

  if (error) throw new Error(error.message);
}

export async function unlikePost(
  supabase: SupabaseClient,
  userId: string,
  postId: string
) {
  const { error } = await supabase
    .from("likes")
    .delete()
    .eq("user_id", userId)
    .eq("post_id", postId);

  if (error) throw new Error(error.message);
}

export async function getLikeCount(
  supabase: SupabaseClient,
  postId: string
) {
  const { count, error } = await supabase
    .from("likes")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("post_id", postId);

  if (error) throw new Error(error.message);

  return count ?? 0;
}

export async function isLiked(
  supabase: SupabaseClient,
  userId: string,
  postId: string
) {
  const { data, error } = await supabase
    .from("likes")
    .select("id")
    .eq("user_id", userId)
    .eq("post_id", postId)
    .maybeSingle();

  if (error) throw new Error(error.message);

  return !!data;
}