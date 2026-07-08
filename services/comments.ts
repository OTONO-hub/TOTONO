import { SupabaseClient } from "@supabase/supabase-js";
import { CreateCommentInput } from "@/types/comment";

export async function createComment(
  supabase: SupabaseClient,
  input: CreateCommentInput
) {
  const { error } = await supabase.from("comments").insert(input);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCommentsByPostId(
  supabase: SupabaseClient,
  postId: string
) {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}