import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type FollowState = {
  isFollowing: boolean;
  followerCount: number;
  followingCount: number;
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

function assertDifferentUsers(
  followerId: string,
  followingId: string
) {
  if (
    followerId ===
    followingId
  ) {
    throw new Error(
      "自分自身をフォローすることはできません。"
    );
  }
}

export async function followUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<void> {
  const normalizedFollowerId =
    assertRequiredText(
      followerId,
      "フォローするユーザーID"
    );

  const normalizedFollowingId =
    assertRequiredText(
      followingId,
      "フォローされるユーザーID"
    );

  assertDifferentUsers(
    normalizedFollowerId,
    normalizedFollowingId
  );

  const {
    error,
  } =
    await supabase
      .from(
        "follows"
      )
      .insert({
        follower_id:
          normalizedFollowerId,

        following_id:
          normalizedFollowingId,
      });

  if (error) {
    throw new Error(
      `フォローに失敗しました: ${error.message}`
    );
  }
}

export async function unfollowUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<void> {
  const normalizedFollowerId =
    assertRequiredText(
      followerId,
      "フォローするユーザーID"
    );

  const normalizedFollowingId =
    assertRequiredText(
      followingId,
      "フォローされるユーザーID"
    );

  assertDifferentUsers(
    normalizedFollowerId,
    normalizedFollowingId
  );

  const {
    error,
  } =
    await supabase
      .from(
        "follows"
      )
      .delete()
      .eq(
        "follower_id",
        normalizedFollowerId
      )
      .eq(
        "following_id",
        normalizedFollowingId
      );

  if (error) {
    throw new Error(
      `フォロー解除に失敗しました: ${error.message}`
    );
  }
}

export async function isFollowingUser(
  supabase: SupabaseClient,
  followerId: string,
  followingId: string
): Promise<boolean> {
  const normalizedFollowerId =
    assertRequiredText(
      followerId,
      "フォローするユーザーID"
    );

  const normalizedFollowingId =
    assertRequiredText(
      followingId,
      "フォローされるユーザーID"
    );

  if (
    normalizedFollowerId ===
    normalizedFollowingId
  ) {
    return false;
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "follows"
      )
      .select(
        "follower_id"
      )
      .eq(
        "follower_id",
        normalizedFollowerId
      )
      .eq(
        "following_id",
        normalizedFollowingId
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `フォロー状態を取得できませんでした: ${error.message}`
    );
  }

  return Boolean(
    data
  );
}

export async function getFollowerCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const {
    count,
    error,
  } =
    await supabase
      .from(
        "follows"
      )
      .select(
        "*",
        {
          count:
            "exact",

          head:
            true,
        }
      )
      .eq(
        "following_id",
        normalizedUserId
      );

  if (error) {
    throw new Error(
      `フォロワー数を取得できませんでした: ${error.message}`
    );
  }

  return count ?? 0;
}

export async function getFollowingCount(
  supabase: SupabaseClient,
  userId: string
): Promise<number> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const {
    count,
    error,
  } =
    await supabase
      .from(
        "follows"
      )
      .select(
        "*",
        {
          count:
            "exact",

          head:
            true,
        }
      )
      .eq(
        "follower_id",
        normalizedUserId
      );

  if (error) {
    throw new Error(
      `フォロー中の人数を取得できませんでした: ${error.message}`
    );
  }

  return count ?? 0;
}

export async function getFollowState(
  supabase: SupabaseClient,
  currentUserId: string,
  profileUserId: string
): Promise<FollowState> {
  const normalizedCurrentUserId =
    assertRequiredText(
      currentUserId,
      "現在のユーザーID"
    );

  const normalizedProfileUserId =
    assertRequiredText(
      profileUserId,
      "プロフィールのユーザーID"
    );

  const [
    following,
    followerCount,
    followingCount,
  ] =
    await Promise.all([
      isFollowingUser(
        supabase,
        normalizedCurrentUserId,
        normalizedProfileUserId
      ),

      getFollowerCount(
        supabase,
        normalizedProfileUserId
      ),

      getFollowingCount(
        supabase,
        normalizedProfileUserId
      ),
    ]);

  return {
    isFollowing:
      following,

    followerCount,

    followingCount,
  };
}
