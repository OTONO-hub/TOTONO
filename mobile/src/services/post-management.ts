import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  deleteUploadedPostImages,
} from "./post-storage";
import type {
  Post,
} from "../types/post";

const POST_IMAGES_BUCKET =
  "post-images";

export type UpdatePostInput = {
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string;
  image_url:
    | string
    | null;
};

type OwnedPostRow = {
  id: string;
  user_id: string;
  image_url: string | null;
};

type OwnedPostImageRow = {
  image_url: string;
};

function validateUpdateInput(
  input: UpdatePostInput
) {
  if (
    !input.visit_date
      .trim()
  ) {
    throw new Error(
      "訪問日を入力してください。"
    );
  }

  if (
    input.set_count < 1 ||
    input.set_count > 20
  ) {
    throw new Error(
      "セット数は1〜20の範囲で入力してください。"
    );
  }

  if (
    input.rating < 1 ||
    input.rating > 5
  ) {
    throw new Error(
      "評価は1〜5の範囲で入力してください。"
    );
  }

  if (
    input.comment.length >
    1000
  ) {
    throw new Error(
      "コメントは1000文字以内で入力してください。"
    );
  }
}

async function getOwnedPost(
  supabase: SupabaseClient,
  postId: string,
  userId: string
): Promise<OwnedPostRow> {
  const {
    data,
    error,
  } =
    await supabase
      .from(
        "posts"
      )
      .select(
        `
          id,
          user_id,
          image_url
        `
      )
      .eq(
        "id",
        postId
      )
      .eq(
        "user_id",
        userId
      )
      .maybeSingle<
        OwnedPostRow
      >();

  if (error) {
    throw new Error(
      `投稿の確認に失敗しました: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "投稿が見つからないか、編集する権限がありません。"
    );
  }

  return data;
}

export async function updateOwnPost(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  input: UpdatePostInput
): Promise<Post> {
  const normalizedPostId =
    postId.trim();

  const normalizedUserId =
    userId.trim();

  if (
    !normalizedPostId ||
    !normalizedUserId
  ) {
    throw new Error(
      "投稿の編集に必要な情報がありません。"
    );
  }

  validateUpdateInput(
    input
  );

  await getOwnedPost(
    supabase,
    normalizedPostId,
    normalizedUserId
  );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "posts"
      )
      .update({
        visit_date:
          input.visit_date,

        set_count:
          input.set_count,

        rating:
          input.rating,

        comment:
          input.comment
            .trim(),

        image_url:
          input.image_url,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        normalizedPostId
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .select(
        "*"
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `投稿の更新に失敗しました: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "投稿を更新できませんでした。"
    );
  }

  return data as Post;
}

export async function replacePostImages(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  imageUrls: string[]
): Promise<void> {
  const normalizedPostId =
    postId.trim();

  const normalizedUserId =
    userId.trim();

  await getOwnedPost(
    supabase,
    normalizedPostId,
    normalizedUserId
  );

  const normalizedUrls = [
    ...new Set(
      imageUrls
        .map(
          (
            imageUrl
          ) =>
            imageUrl.trim()
        )
        .filter(
          Boolean
        )
    ),
  ].slice(
    0,
    5
  );

  const {
    error:
      deleteError,
  } =
    await supabase
      .from(
        "post_images"
      )
      .delete()
      .eq(
        "post_id",
        normalizedPostId
      );

  if (deleteError) {
    throw new Error(
      `投稿写真の更新準備に失敗しました: ${deleteError.message}`
    );
  }

  if (
    normalizedUrls.length ===
    0
  ) {
    return;
  }

  const {
    error:
      insertError,
  } =
    await supabase
      .from(
        "post_images"
      )
      .insert(
        normalizedUrls.map(
          (
            imageUrl,
            index
          ) => ({
            post_id:
              normalizedPostId,

            image_url:
              imageUrl,

            sort_order:
              index,
          })
        )
      );

  if (insertError) {
    throw new Error(
      `投稿写真の更新に失敗しました: ${insertError.message}`
    );
  }
}

export async function deleteOwnPost(
  supabase: SupabaseClient,
  postId: string,
  userId: string
): Promise<void> {
  const normalizedPostId =
    postId.trim();

  const normalizedUserId =
    userId.trim();

  const ownedPost =
    await getOwnedPost(
      supabase,
      normalizedPostId,
      normalizedUserId
    );

  const {
    data:
      postImageRows,
    error:
      imageFetchError,
  } =
    await supabase
      .from(
        "post_images"
      )
      .select(
        "image_url"
      )
      .eq(
        "post_id",
        normalizedPostId
      )
      .returns<
        OwnedPostImageRow[]
      >();

  if (imageFetchError) {
    throw new Error(
      `投稿写真の確認に失敗しました: ${imageFetchError.message}`
    );
  }

  const {
    data:
      deletedPost,
    error:
      deleteError,
  } =
    await supabase
      .from(
        "posts"
      )
      .delete()
      .eq(
        "id",
        normalizedPostId
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .select(
        "id"
      )
      .maybeSingle();

  if (deleteError) {
    throw new Error(
      `投稿の削除に失敗しました: ${deleteError.message}`
    );
  }

  if (!deletedPost) {
    throw new Error(
      "投稿を削除できませんでした。"
    );
  }

  const imageUrls = [
    ownedPost.image_url,
    ...(
      postImageRows ??
      []
    ).map(
      (
        image
      ) =>
        image.image_url
    ),
  ].filter(
    (
      imageUrl
    ): imageUrl is string =>
      Boolean(
        imageUrl
      )
  );

  const filePaths =
    imageUrls
      .map(
        getPostImageFilePath
      )
      .filter(
        (
          filePath
        ): filePath is string =>
          Boolean(
            filePath
          )
      );

  await deleteUploadedPostImages(
    supabase,
    filePaths
  );
}

function getPostImageFilePath(
  publicUrl: string
): string | null {
  try {
    const url =
      new URL(
        publicUrl
      );

    const marker =
      `/storage/v1/object/public/${POST_IMAGES_BUCKET}/`;

    const markerIndex =
      url.pathname.indexOf(
        marker
      );

    if (
      markerIndex ===
      -1
    ) {
      return null;
    }

    const encodedPath =
      url.pathname.slice(
        markerIndex +
          marker.length
      );

    if (!encodedPath) {
      return null;
    }

    return decodeURIComponent(
      encodedPath
    );
  } catch {
    return null;
  }
}
