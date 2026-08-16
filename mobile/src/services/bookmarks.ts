import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type PostBookmarkState = {
  isBookmarked: boolean;
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

export async function bookmarkPost(
  supabase: SupabaseClient,
  userId: string,
  postId: string
): Promise<void> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedPostId =
    assertRequiredText(
      postId,
      "投稿ID"
    );

  const {
    error,
  } =
    await supabase
      .from(
        "bookmarks"
      )
      .insert({
        user_id:
          normalizedUserId,

        post_id:
          normalizedPostId,
      });

  if (error) {
    throw new Error(
      `投稿を保存できませんでした: ${error.message}`
    );
  }
}

export async function unbookmarkPost(
  supabase: SupabaseClient,
  userId: string,
  postId: string
): Promise<void> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedPostId =
    assertRequiredText(
      postId,
      "投稿ID"
    );

  const {
    error,
  } =
    await supabase
      .from(
        "bookmarks"
      )
      .delete()
      .eq(
        "user_id",
        normalizedUserId
      )
      .eq(
        "post_id",
        normalizedPostId
      );

  if (error) {
    throw new Error(
      `投稿の保存を解除できませんでした: ${error.message}`
    );
  }
}

export async function isPostBookmarked(
  supabase: SupabaseClient,
  userId: string,
  postId: string
): Promise<boolean> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedPostId =
    assertRequiredText(
      postId,
      "投稿ID"
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "bookmarks"
      )
      .select(
        "post_id"
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .eq(
        "post_id",
        normalizedPostId
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `投稿の保存状態を取得できませんでした: ${error.message}`
    );
  }

  return Boolean(
    data
  );
}

export async function getPostBookmarkState(
  supabase: SupabaseClient,
  userId: string,
  postId: string
): Promise<PostBookmarkState> {
  const bookmarked =
    await isPostBookmarked(
      supabase,
      userId,
      postId
    );

  return {
    isBookmarked:
      bookmarked,
  };
}

export async function getBookmarkedPostIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "bookmarks"
      )
      .select(
        `
          post_id,
          created_at
        `
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );

  if (error) {
    throw new Error(
      `保存済み投稿を取得できませんでした: ${error.message}`
    );
  }

  return (
    data ??
    []
  )
    .map(
      (
        row
      ) =>
        row.post_id as
          string
    )
    .filter(
      Boolean
    );
}

export async function getBookmarkedPostIdSet(
  supabase: SupabaseClient,
  userId: string,
  postIds: string[]
): Promise<
  Set<string>
> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedPostIds = [
    ...new Set(
      postIds
        .map(
          (
            postId
          ) =>
            postId.trim()
        )
        .filter(
          Boolean
        )
    ),
  ];

  if (
    normalizedPostIds.length ===
    0
  ) {
    return new Set();
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "bookmarks"
      )
      .select(
        "post_id"
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .in(
        "post_id",
        normalizedPostIds
      );

  if (error) {
    throw new Error(
      `投稿の保存状態を取得できませんでした: ${error.message}`
    );
  }

  return new Set(
    (
      data ??
      []
    ).map(
      (
        row
      ) =>
        row.post_id as
          string
    )
  );
}
