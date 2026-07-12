import imageCompression from "browser-image-compression";

const MAX_ORIGINAL_IMAGE_SIZE = 20 * 1024 * 1024;
const MAX_COMPRESSED_IMAGE_SIZE_MB = 1;
const MAX_IMAGE_DIMENSION = 1920;

const ALLOWED_IMAGE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

export function validatePostImage(file: File) {
  if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
    throw new Error(
      "JPEG・PNG・WebP形式の画像を選択してください。"
    );
  }

  if (file.size > MAX_ORIGINAL_IMAGE_SIZE) {
    throw new Error("画像サイズは20MB以下にしてください。");
  }
}

export async function compressPostImage(file: File): Promise<File> {
  validatePostImage(file);

  const compressedFile = await imageCompression(file, {
    maxSizeMB: MAX_COMPRESSED_IMAGE_SIZE_MB,
    maxWidthOrHeight: MAX_IMAGE_DIMENSION,
    useWebWorker: true,
    fileType: "image/webp",
    initialQuality: 0.8,
  });

  return compressedFile;
}