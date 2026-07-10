import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostInput, Post } from "@/types/post";

export async function createPost(
  supabase: SupabaseClient,
  input: CreatePostInput
) {
  const { error } = await supabase.from("posts").insert(input);

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

export async function getPostById(
  supabase: SupabaseClient,
  id: string
): Promise<Post | null> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: Partial<CreatePostInput>
) {
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
) {
  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message);
  }
}