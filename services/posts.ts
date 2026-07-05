import { SupabaseClient } from "@supabase/supabase-js";
import { CreatePostInput } from "@/types/post";

export async function createPost(
  supabase: SupabaseClient,
  input: CreatePostInput
) {
  const { error } = await supabase.from("posts").insert(input);

  if (error) {
    throw new Error(error.message);
  }
}
export async function getPosts(supabase: SupabaseClient) {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
}