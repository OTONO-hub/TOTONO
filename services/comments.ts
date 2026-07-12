import { SupabaseClient } from "@supabase/supabase-js";

import {
  Comment,
  CreateCommentInput,
} from "@/types/comment";

export async function createComment(
  supabase: SupabaseClient,
  input: CreateCommentInput
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .insert(input);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getCommentsByPostId(
  supabase: SupabaseClient,
  postId: string
): Promise<Comment[]> {
  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getCommentsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Comment[]> {
  const uniquePostIds = [...new Set(postIds)];

  if (uniquePostIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .in("post_id", uniquePostIds)
    .order("created_at", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}