import { SupabaseClient } from "@supabase/supabase-js";

import { Profile } from "@/types/profile";

type UpdateProfileInput = {
  username: string;
  bio: string;
  avatar_url?: string;
};

export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile> {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function getProfilesByUserIds(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Profile[]> {
  const uniqueUserIds = [...new Set(userIds)];

  if (uniqueUserIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", uniqueUserIds);

  if (error) {
    throw new Error(error.message);
  }

  return data ?? [];
}

export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateProfileInput
) {
  const { error } = await supabase
    .from("profiles")
    .update(input)
    .eq("id", userId);

  if (error) {
    throw new Error(error.message);
  }
}