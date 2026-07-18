import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  CreatePostInput,
  Post,
} from "@/types/post";

export async function createPost(
  supabase: SupabaseClient,
  input: CreatePostInput
): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .insert(input);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getPosts(
  supabase: SupabaseClient
): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPostsByIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Post[]> {
  if (postIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .in("id", postIds)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function getPostsBySaunaId(
  supabase: SupabaseClient,
  saunaId: string
): Promise<Post[]> {
  const trimmedSaunaId = saunaId.trim();

  if (!trimmedSaunaId) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("sauna_id", trimmedSaunaId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `施設の投稿取得に失敗しました: ${error.message}`
    );
  }

  return data ?? [];
}

export async function getPostById(
  supabase: SupabaseClient,
  id: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: Partial<CreatePostInput>
): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .update(input)
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}

export async function deletePost(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}