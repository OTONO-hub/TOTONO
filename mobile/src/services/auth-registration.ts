import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export const MIN_USERNAME_LENGTH =
  2;

export const MAX_USERNAME_LENGTH =
  30;

export function normalizeUsername(
  value: string
): string {
  return value.trim();
}

export function validateRegistrationUsername(
  value: string
): string | null {
  const normalizedValue =
    normalizeUsername(
      value
    );

  const length =
    Array.from(
      normalizedValue
    ).length;

  if (!normalizedValue) {
    return "ユーザー名を入力してください。";
  }

  if (
    length <
    MIN_USERNAME_LENGTH
  ) {
    return `ユーザー名は${MIN_USERNAME_LENGTH}文字以上で入力してください。`;
  }

  if (
    length >
    MAX_USERNAME_LENGTH
  ) {
    return `ユーザー名は${MAX_USERNAME_LENGTH}文字以内で入力してください。`;
  }

  if (
    /[\u0000-\u001f\u007f]/.test(
      normalizedValue
    )
  ) {
    return "ユーザー名に使用できない文字が含まれています。";
  }

  return null;
}

export async function isUsernameAvailable(
  client: SupabaseClient,
  username: string
): Promise<boolean> {
  const {
    data,
    error,
  } =
    await client.rpc(
      "is_username_available",
      {
        candidate_username:
          normalizeUsername(
            username
          ),
        excluded_user_id:
          null,
      }
    );

  if (error) {
    throw new Error(
      `ユーザー名を確認できませんでした: ${error.message}`
    );
  }

  return data === true;
}

export function wasCreatedDuringRegistration(
  createdAt: string,
  registrationStartedAt: number
): boolean {
  const createdAtTime =
    Date.parse(
      createdAt
    );

  if (
    !Number.isFinite(
      createdAtTime
    )
  ) {
    return false;
  }

  return (
    createdAtTime >=
    registrationStartedAt -
      10_000
  );
}
