import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type PostLikeState = {
  count: number;
  isLiked: boolean;
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

export async function likePost(
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
        "likes"
      )
      .insert({
        user_id:
          normalizedUserId,

        post_id:
          normalizedPostId,
      });

  if (error) {
    throw new Error(
      `いいねに失敗しました: ${error.message}`
    );
  }
}

export async function unlikePost(
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
        "likes"
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
      `いいね解除に失敗しました: ${error.message}`
    );
  }
}

export async function getLikeCount(
  supabase: SupabaseClient,
  postId: string
): Promise<number> {
  const normalizedPostId =
    assertRequiredText(
      postId,
      "投稿ID"
    );

  const {
    count,
    error,
  } =
    await supabase
      .from(
        "likes"
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
        "post_id",
        normalizedPostId
      );

  if (error) {
    throw new Error(
      `いいね数を取得できませんでした: ${error.message}`
    );
  }

  return count ?? 0;
}

export async function isLiked(
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
        "likes"
      )
      .select(
        "id"
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
      `いいね状態を取得できませんでした: ${error.message}`
    );
  }

  return Boolean(
    data
  );
}

export async function getPostLikeState(
  supabase: SupabaseClient,
  userId: string,
  postId: string
): Promise<PostLikeState> {
  const [
    count,
    liked,
  ] =
    await Promise.all([
      getLikeCount(
        supabase,
        postId
      ),

      isLiked(
        supabase,
        userId,
        postId
      ),
    ]);

  return {
    count,
    isLiked:
      liked,
  };
}

export async function getLikeCountsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<
  Map<
    string,
    number
  >
> {
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
    return new Map();
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "likes"
      )
      .select(
        "post_id"
      )
      .in(
        "post_id",
        normalizedPostIds
      );

  if (error) {
    throw new Error(
      `いいね数を取得できませんでした: ${error.message}`
    );
  }

  const counts =
    new Map<
      string,
      number
    >();

  for (
    const row of
    data ??
    []
  ) {
    const postId =
      row.post_id as
        string;

    counts.set(
      postId,
      (
        counts.get(
          postId
        ) ??
        0
      ) + 1
    );
  }

  return counts;
}

export async function getLikedPostIds(
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
        "likes"
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
      `いいね状態を取得できませんでした: ${error.message}`
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
