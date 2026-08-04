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

export type UsernameAvailabilityOptions = {
  excludedUserId?: string | null;
};

const USERNAME_UNIQUE_CONSTRAINT =
  "profiles_username_unique_normalized_idx";

function isUsernameAlreadyUsedError(
  error: {
    code?: string | null;
    message?: string | null;
    details?: string | null;
    hint?: string | null;
  } | null
): boolean {
  if (!error) {
    return false;
  }

  const searchableText = [
    error.message,
    error.details,
    error.hint,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  return (
    error.code === "23505" &&
    searchableText.includes(
      USERNAME_UNIQUE_CONSTRAINT
    )
  );
}

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
 * 指定したユーザー名が使用可能か確認します。
 *
 * excludedUserIdを指定すると、そのユーザー自身の
 * 現在のプロフィール名は重複として扱いません。
 */
export async function isUsernameAvailable(
  supabase: SupabaseClient,
  username: string,
  options: UsernameAvailabilityOptions = {}
): Promise<boolean> {
  const normalizedUsername =
    assertRequiredText(
      username,
      "ユーザー名"
    );

  const normalizedExcludedUserId =
    options.excludedUserId?.trim() ||
    null;

  const { data, error } =
    await supabase.rpc(
      "is_username_available",
      {
        candidate_username:
          normalizedUsername,
        excluded_user_id:
          normalizedExcludedUserId,
      }
    );

  assertSupabaseError(error, {
    fallbackMessage:
      "ユーザー名の確認に失敗しました。",
    context:
      "isUsernameAvailable",
  });

  return data === true;
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
    assertRequiredText(
      input.username,
      "ユーザー名"
    );

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

  if (
    isUsernameAlreadyUsedError(error)
  ) {
    throw new Error(
      "このユーザー名はすでに使用されています。"
    );
  }

  assertSupabaseError(error, {
    fallbackMessage:
      "プロフィールの更新に失敗しました。",
    context: "updateProfile",
  });
}
