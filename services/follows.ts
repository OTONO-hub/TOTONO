import type { SupabaseClient } from "@supabase/supabase-js";

export async function isFollowing(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
) {
  const { data, error } = await supabase
    .from("follows")
    .select("id")
    .eq("follower_id", followerId)
    .eq("following_id", followingId)
    .maybeSingle();

  if (error) {
    throw error;
  }

  return !!data;
}

export async function followUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
) {
  const { error } = await supabase.from("follows").insert({
    follower_id: followerId,
    following_id: followingId,
  });

  if (error) {
    throw error;
  }
}

export async function unfollowUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
) {
  const { error } = await supabase
    .from("follows")
    .delete()
    .eq("follower_id", followerId)
    .eq("following_id", followingId);

  if (error) {
    throw error;
  }
}

export async function getFollowingCount(
  supabase: SupabaseClient,
  userId: string
) {
  const { count, error } = await supabase
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("follower_id", userId);

  if (error) {
    throw error;
  }

  return count ?? 0;
}

export async function getFollowerCount(
  supabase: SupabaseClient,
  userId: string
) {
  const { count, error } = await supabase
    .from("follows")
    .select("*", {
      count: "exact",
      head: true,
    })
    .eq("following_id", userId);

  if (error) {
    throw error;
  }

  return count ?? 0;
}