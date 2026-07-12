import { SupabaseClient } from "@supabase/supabase-js";

const AVATARS_BUCKET = "avatars";

const MAX_AVATAR_FILE_SIZE = 5 * 1024 * 1024;
const AVATAR_SIZE = 512;
const AVATAR_QUALITY = 0.8;

const ALLOWED_AVATAR_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function validateAvatarImage(file: File) {
  if (!ALLOWED_AVATAR_TYPES.includes(file.type)) {
    throw new Error(
      "JPEG・PNG・WebP形式の画像を選択してください。"
    );
  }

  if (file.size > MAX_AVATAR_FILE_SIZE) {
    throw new Error(
      "プロフィール画像は5MB以下の画像を選択してください。"
    );
  }
}

export async function compressAvatarImage(
  file: File
): Promise<File> {
  const image = await loadImage(file);

  const sourceSize = Math.min(
    image.naturalWidth,
    image.naturalHeight
  );

  const sourceX = (image.naturalWidth - sourceSize) / 2;
  const sourceY = (image.naturalHeight - sourceSize) / 2;

  const canvas = document.createElement("canvas");

  canvas.width = AVATAR_SIZE;
  canvas.height = AVATAR_SIZE;

  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("画像の処理に失敗しました。");
  }

  context.drawImage(
    image,
    sourceX,
    sourceY,
    sourceSize,
    sourceSize,
    0,
    0,
    AVATAR_SIZE,
    AVATAR_SIZE
  );

  const blob = await new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (result) => {
        if (!result) {
          reject(
            new Error("画像の圧縮に失敗しました。")
          );
          return;
        }

        resolve(result);
      },
      "image/webp",
      AVATAR_QUALITY
    );
  });

  return new File(
    [blob],
    `avatar-${crypto.randomUUID()}.webp`,
    {
      type: "image/webp",
    }
  );
}

export async function uploadAvatarImage(
  supabase: SupabaseClient,
  userId: string,
  file: File
) {
  const filePath = `${userId}/${Date.now()}-${crypto.randomUUID()}.webp`;

  const { error: uploadError } = await supabase.storage
    .from(AVATARS_BUCKET)
    .upload(filePath, file, {
      contentType: "image/webp",
      cacheControl: "31536000",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(uploadError.message);
  }

  const { data } = supabase.storage
    .from(AVATARS_BUCKET)
    .getPublicUrl(filePath);

  return {
    publicUrl: data.publicUrl,
    filePath,
  };
}

export async function deleteAvatarImage(
  supabase: SupabaseClient,
  filePath: string
) {
  const { error } = await supabase.storage
    .from(AVATARS_BUCKET)
    .remove([filePath]);

  if (error) {
    throw new Error(error.message);
  }
}

export function getAvatarImagePath(publicUrl: string) {
  const marker = `/storage/v1/object/public/${AVATARS_BUCKET}/`;

  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    publicUrl.slice(markerIndex + marker.length)
  );
}

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const objectUrl = URL.createObjectURL(file);
    const image = new Image();

    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      resolve(image);
    };

    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);

      reject(
        new Error("画像を読み込めませんでした。")
      );
    };

    image.src = objectUrl;
  });
}