import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  CreatePostInput,
  Post,
} from "../types/post";

export async function createPost(
  supabase: SupabaseClient,
  input: CreatePostInput
): Promise<Post> {
  const {
    data,
    error,
  } = await supabase
    .from("posts")
    .insert(input)
    .select("*")
    .single();

  if (error) {
    throw new Error(
      `投稿の作成に失敗しました: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "投稿データを取得できませんでした。"
    );
  }

  return data as Post;
}
