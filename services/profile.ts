import type { SupabaseClient } from "@supabase/supabase-js";

import {
  assertRequiredText,
  assertSupabaseError,
} from "@/lib/supabase/assert";
import type { Profile } from "@/types/profile";

export type UpdateProfileInput = {
  username: string;
  bio: string;
  avatar_url?: string;
};

/**
 * ユーザーのプロフィールを取得します。
 */
export async function getProfile(
  supabase: SupabaseClient,
  userId: string
): Promise<Profile | null> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", normalizedUserId)
    .maybeSingle();

  assertSupabaseError(error, {
    fallbackMessage:
      "プロフィールの取得に失敗しました。",
    context: "getProfile",
  });

  return data;
}

/**
 * 複数ユーザーのプロフィールを一括取得します。
 */
export async function getProfilesByUserIds(
  supabase: SupabaseClient,
  userIds: string[]
): Promise<Profile[]> {
  const normalizedUserIds = [
    ...new Set(
      userIds
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];

  if (
    normalizedUserIds.length === 0
  ) {
    return [];
  }

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .in("id", normalizedUserIds);

  assertSupabaseError(error, {
    fallbackMessage:
      "プロフィール一覧の取得に失敗しました。",
    context:
      "getProfilesByUserIds",
  });

  return data ?? [];
}

/**
 * プロフィールを更新します。
 *
 * プロフィールが存在しない場合は
 * upsertにより新規作成されます。
 */
export async function updateProfile(
  supabase: SupabaseClient,
  userId: string,
  input: UpdateProfileInput
): Promise<void> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const username =
    input.username.trim();

  const bio = input.bio.trim();

  const avatarUrl =
    input.avatar_url?.trim() ||
    undefined;

  const { error } = await supabase
    .from("profiles")
    .upsert({
      id: normalizedUserId,
      username,
      bio,
      avatar_url: avatarUrl,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "プロフィールの更新に失敗しました。",
    context: "updateProfile",
  });
}
