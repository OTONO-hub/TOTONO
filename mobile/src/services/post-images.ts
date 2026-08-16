import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type PostImage = {
  id: string;
  post_id: string;
  image_url: string;
  sort_order: number;
  created_at: string;
};

export type CreatePostImageInput = {
  post_id: string;
  image_url: string;
  sort_order: number;
};

const MAX_POST_IMAGE_COUNT = 5;

export async function createPostImages(
  supabase: SupabaseClient,
  inputs: CreatePostImageInput[]
): Promise<PostImage[]> {
  if (inputs.length === 0) {
    return [];
  }

  if (
    inputs.length >
    MAX_POST_IMAGE_COUNT
  ) {
    throw new Error(
      `投稿画像は最大${MAX_POST_IMAGE_COUNT}枚までです。`
    );
  }

  const normalizedInputs =
    inputs.map(
      (
        input
      ) => ({
        post_id:
          input.post_id.trim(),

        image_url:
          input.image_url.trim(),

        sort_order:
          input.sort_order,
      })
    );

  const {
    data,
    error,
  } = await supabase
    .from("post_images")
    .insert(
      normalizedInputs
    )
    .select(
      "id, post_id, image_url, sort_order, created_at"
    )
    .order(
      "sort_order",
      {
        ascending: true,
      }
    );

  if (error) {
    throw new Error(
      `投稿画像の保存に失敗しました: ${error.message}`
    );
  }

  return (
    data ?? []
  ) as PostImage[];
}
