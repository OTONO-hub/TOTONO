import type {
  SupabaseClient,
} from "@supabase/supabase-js";

const POST_IMAGES_BUCKET =
  "post-images";

export type UploadedPostImage = {
  publicUrl: string;
  filePath: string;
};

export async function uploadPostImageFromUri(
  supabase: SupabaseClient,
  userId: string,
  imageUri: string,
  sortOrder: number
): Promise<UploadedPostImage> {
  const normalizedUserId =
    userId.trim();

  if (!normalizedUserId) {
    throw new Error(
      "画像アップロードに必要なユーザー情報がありません。"
    );
  }

  const response =
    await fetch(
      imageUri
    );

  if (!response.ok) {
    throw new Error(
      "選択した画像を読み込めませんでした。"
    );
  }

  const originalBlob =
    await response.blob();

  const extension =
    getExtensionFromMimeType(
      originalBlob.type
    );

  const uniqueId =
    crypto.randomUUID();

  const filePath =
    `${normalizedUserId}/${Date.now()}-${sortOrder}-${uniqueId}.${extension}`;

  const {
    error,
  } =
    await supabase.storage
      .from(
        POST_IMAGES_BUCKET
      )
      .upload(
        filePath,
        originalBlob,
        {
          contentType:
            originalBlob.type ||
            "image/jpeg",

          cacheControl:
            "31536000",

          upsert: false,
        }
      );

  if (error) {
    throw new Error(
      `画像のアップロードに失敗しました: ${error.message}`
    );
  }

  const {
    data,
  } =
    supabase.storage
      .from(
        POST_IMAGES_BUCKET
      )
      .getPublicUrl(
        filePath
      );

  return {
    publicUrl:
      data.publicUrl,

    filePath,
  };
}

export async function deleteUploadedPostImages(
  supabase: SupabaseClient,
  filePaths: string[]
): Promise<void> {
  const normalizedPaths = [
    ...new Set(
      filePaths
        .map(
          (
            path
          ) =>
            path.trim()
        )
        .filter(
          Boolean
        )
    ),
  ];

  if (
    normalizedPaths.length ===
    0
  ) {
    return;
  }

  const {
    error,
  } =
    await supabase.storage
      .from(
        POST_IMAGES_BUCKET
      )
      .remove(
        normalizedPaths
      );

  if (error) {
    console.error(
      "アップロード済み画像の削除に失敗しました。",
      error
    );
  }
}

function getExtensionFromMimeType(
  mimeType: string
): string {
  switch (
    mimeType.toLowerCase()
  ) {
    case "image/png":
      return "png";

    case "image/webp":
      return "webp";

    case "image/heic":
    case "image/heif":
      return "heic";

    default:
      return "jpg";
  }
}
