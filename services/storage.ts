import type { SupabaseClient } from "@supabase/supabase-js";

const POST_IMAGES_BUCKET = "post-images";
const MAX_POST_IMAGE_COUNT = 5;

export type UploadedPostImage = {
  publicUrl: string;
  filePath: string;
};

export type UploadedPostImageWithOrder =
  UploadedPostImage & {
    sortOrder: number;
  };

/**
 * 投稿画像を1枚アップロードします。
 *
 * 既存コードとの互換性を維持するため、
 * この関数は削除せず引き続き利用できます。
 */
export async function uploadPostImage(
  supabase: SupabaseClient,
  userId: string,
  file: File
): Promise<UploadedPostImage> {
  const trimmedUserId = userId.trim();

  if (!trimmedUserId) {
    throw new Error(
      "画像のアップロードに必要なユーザー情報がありません。"
    );
  }

  const uniqueId = crypto.randomUUID();

  const filePath =
    `${trimmedUserId}/${Date.now()}-${uniqueId}.webp`;

  const { error: uploadError } =
    await supabase.storage
      .from(POST_IMAGES_BUCKET)
      .upload(filePath, file, {
        contentType: "image/webp",
        cacheControl: "31536000",
        upsert: false,
      });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from(POST_IMAGES_BUCKET)
    .getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    filePath,
  };
}

/**
 * 投稿画像を最大5枚まで、受け取った順番でアップロードします。
 *
 * 1枚でもアップロードに失敗した場合は、
 * この処理内ですでにアップロードした画像を削除してから
 * エラーを返します。
 */
export async function uploadPostImages(
  supabase: SupabaseClient,
  userId: string,
  files: File[]
): Promise<UploadedPostImageWithOrder[]> {
  if (files.length === 0) {
    return [];
  }

  if (files.length > MAX_POST_IMAGE_COUNT) {
    throw new Error(
      `投稿画像は最大${MAX_POST_IMAGE_COUNT}枚までです。`
    );
  }

  const uploadedImages:
    UploadedPostImageWithOrder[] = [];

  try {
    for (
      let sortOrder = 0;
      sortOrder < files.length;
      sortOrder += 1
    ) {
      const file = files[sortOrder];

      if (!file) {
        continue;
      }

      const uploadedImage =
        await uploadPostImage(
          supabase,
          userId,
          file
        );

      uploadedImages.push({
        ...uploadedImage,
        sortOrder,
      });
    }

    return uploadedImages;
  } catch (error) {
    const uploadedFilePaths =
      uploadedImages.map(
        (image) => image.filePath
      );

    if (uploadedFilePaths.length > 0) {
      try {
        await deletePostImages(
          supabase,
          uploadedFilePaths
        );
      } catch (cleanupError) {
        console.error(
          "複数画像アップロード失敗後のクリーンアップに失敗しました。",
          cleanupError
        );
      }
    }

    throw error instanceof Error
      ? error
      : new Error(
          "投稿画像のアップロードに失敗しました。"
        );
  }
}

/**
 * 投稿画像を1枚削除します。
 */
export async function deletePostImage(
  supabase: SupabaseClient,
  filePath: string
): Promise<void> {
  const trimmedFilePath = filePath.trim();

  if (!trimmedFilePath) {
    return;
  }

  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .remove([trimmedFilePath]);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * 投稿画像を複数枚まとめて削除します。
 *
 * 空文字や重複パスは除外してから削除します。
 */
export async function deletePostImages(
  supabase: SupabaseClient,
  filePaths: string[]
): Promise<void> {
  const uniqueFilePaths = Array.from(
    new Set(
      filePaths
        .map((filePath) => filePath.trim())
        .filter(Boolean)
    )
  );

  if (uniqueFilePaths.length === 0) {
    return;
  }

  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .remove(uniqueFilePaths);

  if (error) {
    throw new Error(error.message);
  }
}

/**
 * 公開URLからStorage内のファイルパスを取得します。
 */
export function getPostImagePath(
  publicUrl: string
): string | null {
  const marker =
    `/storage/v1/object/public/${POST_IMAGES_BUCKET}/`;

  const markerIndex =
    publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    publicUrl.slice(
      markerIndex + marker.length
    )
  );
}
