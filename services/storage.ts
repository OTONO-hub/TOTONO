import { SupabaseClient } from "@supabase/supabase-js";

export async function uploadPostImage(
  supabase: SupabaseClient,
  userId: string,
  file: File
) {
  const fileExt = file.name.split(".").pop();
  const fileName = `${userId}/${Date.now()}.${fileExt}`;

  const { error } = await supabase.storage
    .from("post-images")
    .upload(fileName, file);

  if (error) {
    throw new Error(error.message);
  }

  const { data } = supabase.storage
    .from("post-images")
    .getPublicUrl(fileName);

  return data.publicUrl;
}