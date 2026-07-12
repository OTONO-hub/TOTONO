import { SupabaseClient } from "@supabase/supabase-js";

const POST_IMAGES_BUCKET = "post-images";

export async function uploadPostImage(
  supabase: SupabaseClient,
  userId: string,
  file: File
) {
  const uniqueId = crypto.randomUUID();
  const filePath = `${userId}/${Date.now()}-${uniqueId}.webp`;

  const { error: uploadError } = await supabase.storage
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

export async function deletePostImage(
  supabase: SupabaseClient,
  filePath: string
) {
  const { error } = await supabase.storage
    .from(POST_IMAGES_BUCKET)
    .remove([filePath]);

  if (error) {
    throw new Error(error.message);
  }
}

export function getPostImagePath(publicUrl: string) {
  const marker = `/storage/v1/object/public/${POST_IMAGES_BUCKET}/`;
  const markerIndex = publicUrl.indexOf(marker);

  if (markerIndex === -1) {
    return null;
  }

  return decodeURIComponent(
    publicUrl.slice(markerIndex + marker.length)
  );
}