import type { SupabaseClient } from "@supabase/supabase-js";

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

/**
 * 1件の投稿に紐づく画像を、並び順どおりに取得します。
 */
export async function getPostImagesByPostId(
  supabase: SupabaseClient,
  postId: string
): Promise<PostImage[]> {
  const trimmedPostId = postId.trim();

  if (!trimmedPostId) {
    return [];
  }

  const { data, error } = await supabase
    .from("post_images")
    .select(
      "id, post_id, image_url, sort_order, created_at"
    )
    .eq("post_id", trimmedPostId)
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `投稿画像の取得に失敗しました: ${error.message}`
    );
  }

  return (data ?? []) as PostImage[];
}

/**
 * 複数投稿に紐づく画像を一括取得します。
 *
 * 戻り値は投稿IDをキーにしたMapです。
 */
export async function getPostImagesByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Map<string, PostImage[]>> {
  const uniquePostIds = Array.from(
    new Set(
      postIds
        .map((postId) => postId.trim())
        .filter(Boolean)
    )
  );

  if (uniquePostIds.length === 0) {
    return new Map();
  }

  const { data, error } = await supabase
    .from("post_images")
    .select(
      "id, post_id, image_url, sort_order, created_at"
    )
    .in("post_id", uniquePostIds)
    .order("post_id", {
      ascending: true,
    })
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `投稿画像の一括取得に失敗しました: ${error.message}`
    );
  }

  const imagesByPostId =
    new Map<string, PostImage[]>();

  for (const image of (data ??
    []) as PostImage[]) {
    const currentImages =
      imagesByPostId.get(image.post_id) ??
      [];

    currentImages.push(image);

    imagesByPostId.set(
      image.post_id,
      currentImages
    );
  }

  return imagesByPostId;
}

/**
 * 1件の投稿へ最大5枚の画像情報を保存します。
 *
 * sort_orderは0〜4で重複しない必要があります。
 */
export async function createPostImages(
  supabase: SupabaseClient,
  inputs: CreatePostImageInput[]
): Promise<PostImage[]> {
  if (inputs.length === 0) {
    return [];
  }

  if (inputs.length > MAX_POST_IMAGE_COUNT) {
    throw new Error(
      `投稿画像は最大${MAX_POST_IMAGE_COUNT}枚までです。`
    );
  }

  const normalizedInputs =
    normalizeCreatePostImageInputs(inputs);

  const { data, error } = await supabase
    .from("post_images")
    .insert(normalizedInputs)
    .select(
      "id, post_id, image_url, sort_order, created_at"
    )
    .order("sort_order", {
      ascending: true,
    });

  if (error) {
    throw new Error(
      `投稿画像の保存に失敗しました: ${error.message}`
    );
  }

  return (data ?? []) as PostImage[];
}

/**
 * 指定した画像レコードを削除します。
 *
 * RLSにより、自分の投稿画像だけ削除できます。
 */
export async function deletePostImageRecord(
  supabase: SupabaseClient,
  imageId: string
): Promise<void> {
  const trimmedImageId = imageId.trim();

  if (!trimmedImageId) {
    return;
  }

  const { error } = await supabase
    .from("post_images")
    .delete()
    .eq("id", trimmedImageId);

  if (error) {
    throw new Error(
      `投稿画像の削除に失敗しました: ${error.message}`
    );
  }
}

/**
 * 1件の投稿に紐づく画像レコードをすべて削除します。
 *
 * 投稿削除時はDB側のON DELETE CASCADEでも削除されますが、
 * 明示的な差し替え処理などでも利用できます。
 */
export async function deletePostImageRecordsByPostId(
  supabase: SupabaseClient,
  postId: string
): Promise<void> {
  const trimmedPostId = postId.trim();

  if (!trimmedPostId) {
    return;
  }

  const { error } = await supabase
    .from("post_images")
    .delete()
    .eq("post_id", trimmedPostId);

  if (error) {
    throw new Error(
      `投稿画像の一括削除に失敗しました: ${error.message}`
    );
  }
}

/**
 * 投稿画像の並び順を更新します。
 *
 * 今回の初回UIでは選択順をそのまま保存しますが、
 * 将来のドラッグ＆ドロップ対応でも利用できます。
 */
export async function updatePostImageSortOrder(
  supabase: SupabaseClient,
  imageId: string,
  sortOrder: number
): Promise<void> {
  const trimmedImageId = imageId.trim();

  if (!trimmedImageId) {
    throw new Error(
      "並び順を変更する画像が指定されていません。"
    );
  }

  if (
    !Number.isInteger(sortOrder) ||
    sortOrder < 0 ||
    sortOrder >= MAX_POST_IMAGE_COUNT
  ) {
    throw new Error(
      "画像の並び順は0〜4の整数で指定してください。"
    );
  }

  const { error } = await supabase
    .from("post_images")
    .update({
      sort_order: sortOrder,
    })
    .eq("id", trimmedImageId);

  if (error) {
    throw new Error(
      `画像の並び順更新に失敗しました: ${error.message}`
    );
  }
}

/**
 * 保存前の入力を検証・正規化します。
 */
function normalizeCreatePostImageInputs(
  inputs: CreatePostImageInput[]
): CreatePostImageInput[] {
  const normalizedInputs = inputs.map(
    (input) => ({
      post_id: input.post_id.trim(),
      image_url: input.image_url.trim(),
      sort_order: input.sort_order,
    })
  );

  const postIds = new Set(
    normalizedInputs.map(
      (input) => input.post_id
    )
  );

  if (
    postIds.size !== 1 ||
    postIds.has("")
  ) {
    throw new Error(
      "投稿画像には同一の有効な投稿IDが必要です。"
    );
  }

  const sortOrders = new Set<number>();

  for (const input of normalizedInputs) {
    if (!input.image_url) {
      throw new Error(
        "投稿画像URLが空です。"
      );
    }

    if (
      !Number.isInteger(input.sort_order) ||
      input.sort_order < 0 ||
      input.sort_order >=
        MAX_POST_IMAGE_COUNT
    ) {
      throw new Error(
        "画像の並び順は0〜4の整数で指定してください。"
      );
    }

    if (sortOrders.has(input.sort_order)) {
      throw new Error(
        "同じ画像の並び順が重複しています。"
      );
    }

    sortOrders.add(input.sort_order);
  }

  return [...normalizedInputs].sort(
    (a, b) =>
      a.sort_order - b.sort_order
  );
}
