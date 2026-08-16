import type {
  SupabaseClient,
} from "@supabase/supabase-js";

const AVATARS_BUCKET =
  "avatars";

export type UpdateProfileInput = {
  username: string;
  bio: string;
  avatarUrl:
    | string
    | null;
};

export type UpdatedProfile = {
  id: string;
  username: string | null;
  bio: string | null;
  avatarUrl: string | null;
  updatedAt: string | null;
};

export type UploadedAvatar = {
  publicUrl: string;
  filePath: string;
};

type UpdatedProfileRow = {
  id: string;
  username: string | null;
  bio: string | null;
  avatar_url: string | null;
  updated_at: string | null;
};

function assertRequiredText(
  value: string,
  label: string
): string {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new Error(
      `${label}が指定されていません。`
    );
  }

  return normalizedValue;
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

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateProfileInput
): Promise<UpdatedProfile> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedUsername =
    input.username.trim();

  const normalizedBio =
    input.bio.trim();

  if (
    !normalizedUsername
  ) {
    throw new Error(
      "ユーザー名を入力してください。"
    );
  }

  if (
    normalizedUsername.length >
    40
  ) {
    throw new Error(
      "ユーザー名は40文字以内で入力してください。"
    );
  }

  if (
    normalizedBio.length >
    160
  ) {
    throw new Error(
      "自己紹介は160文字以内で入力してください。"
    );
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "profiles"
      )
      .update({
        username:
          normalizedUsername,

        bio:
          normalizedBio ||
          null,

        avatar_url:
          input.avatarUrl,

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        normalizedUserId
      )
      .select(
        `
          id,
          username,
          bio,
          avatar_url,
          updated_at
        `
      )
      .maybeSingle<
        UpdatedProfileRow
      >();

  if (error) {
    throw new Error(
      `プロフィールを更新できませんでした: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "更新対象のプロフィールが見つかりませんでした。"
    );
  }

  return {
    id:
      data.id,

    username:
      data.username,

    bio:
      data.bio,

    avatarUrl:
      data.avatar_url,

    updatedAt:
      data.updated_at,
  };
}

export async function uploadAvatarFromUri(
  supabase: SupabaseClient,
  userId: string,
  imageUri: string
): Promise<UploadedAvatar> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedImageUri =
    assertRequiredText(
      imageUri,
      "画像"
    );

  const response =
    await fetch(
      normalizedImageUri
    );

  if (!response.ok) {
    throw new Error(
      "選択した画像を読み込めませんでした。"
    );
  }

  const imageBlob =
    await response.blob();

  if (
    imageBlob.size ===
    0
  ) {
    throw new Error(
      "選択した画像が空です。"
    );
  }

  if (
    imageBlob.size >
    5 *
      1024 *
      1024
  ) {
    throw new Error(
      "プロフィール画像は5MB以内にしてください。"
    );
  }

  const contentType =
    imageBlob.type ||
    "image/jpeg";

  if (
    !contentType.startsWith(
      "image/"
    )
  ) {
    throw new Error(
      "画像ファイルを選択してください。"
    );
  }

  const extension =
    getExtensionFromMimeType(
      contentType
    );

  const uniqueId =
    crypto.randomUUID();

  const filePath =
    `${normalizedUserId}/${Date.now()}-${uniqueId}.${extension}`;

  const {
    error,
  } =
    await supabase.storage
      .from(
        AVATARS_BUCKET
      )
      .upload(
        filePath,
        imageBlob,
        {
          contentType,

          cacheControl:
            "31536000",

          upsert:
            false,
        }
      );

  if (error) {
    throw new Error(
      `プロフィール画像をアップロードできませんでした: ${error.message}`
    );
  }

  const {
    data,
  } =
    supabase.storage
      .from(
        AVATARS_BUCKET
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

export async function deleteUploadedAvatar(
  supabase: SupabaseClient,
  filePath: string
): Promise<void> {
  const normalizedFilePath =
    filePath.trim();

  if (
    !normalizedFilePath
  ) {
    return;
  }

  const {
    error,
  } =
    await supabase.storage
      .from(
        AVATARS_BUCKET
      )
      .remove([
        normalizedFilePath,
      ]);

  if (error) {
    console.error(
      "アップロード済みプロフィール画像を削除できませんでした。",
      error
    );
  }
}
