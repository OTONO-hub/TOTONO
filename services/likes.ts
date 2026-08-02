import type { SupabaseClient } from "@supabase/supabase-js";

import {
  assertRequiredText,
  assertSupabaseError,
} from "@/lib/supabase/assert";

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

  const { error } = await supabase
    .from("likes")
    .insert({
      user_id: normalizedUserId,
      post_id: normalizedPostId,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "いいねに失敗しました。",
    context: "likePost",
  });
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

  const { error } = await supabase
    .from("likes")
    .delete()
    .eq(
      "user_id",
      normalizedUserId
    )
    .eq(
      "post_id",
      normalizedPostId
    );

  assertSupabaseError(error, {
    fallbackMessage:
      "いいね解除に失敗しました。",
    context: "unlikePost",
  });
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

  const { count, error } =
    await supabase
      .from("likes")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq(
        "post_id",
        normalizedPostId
      );

  assertSupabaseError(error, {
    fallbackMessage:
      "いいね数の取得に失敗しました。",
    context: "getLikeCount",
  });

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

  const { data, error } =
    await supabase
      .from("likes")
      .select("id")
      .eq(
        "user_id",
        normalizedUserId
      )
      .eq(
        "post_id",
        normalizedPostId
      )
      .maybeSingle();

  assertSupabaseError(error, {
    fallbackMessage:
      "いいね状態の取得に失敗しました。",
    context: "isLiked",
  });

  return Boolean(data);
}

/**
 * 投稿IDごとのいいね数を
 * 一括取得します。
 */
export async function getLikeCountsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Map<string, number>> {
  const normalizedPostIds = [
    ...new Set(
      postIds
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];

  if (
    normalizedPostIds.length === 0
  ) {
    return new Map();
  }

  const { data, error } =
    await supabase
      .from("likes")
      .select("post_id")
      .in(
        "post_id",
        normalizedPostIds
      );

  assertSupabaseError(error, {
    fallbackMessage:
      "いいね数の取得に失敗しました。",
    context:
      "getLikeCountsByPostIds",
  });

  const counts = new Map<
    string,
    number
  >();

  for (const row of data ?? []) {
    counts.set(
      row.post_id,
      (counts.get(row.post_id) ??
        0) + 1
    );
  }

  return counts;
}

/**
 * 指定ユーザーが
 * いいね済みの投稿ID一覧を取得します。
 */
export async function getLikedPostIds(
  supabase: SupabaseClient,
  userId: string,
  postIds: string[]
): Promise<Set<string>> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedPostIds = [
    ...new Set(
      postIds
        .map((id) => id.trim())
        .filter(Boolean)
    ),
  ];

  if (
    normalizedPostIds.length === 0
  ) {
    return new Set();
  }

  const { data, error } =
    await supabase
      .from("likes")
      .select("post_id")
      .eq(
        "user_id",
        normalizedUserId
      )
      .in(
        "post_id",
        normalizedPostIds
      );

  assertSupabaseError(error, {
    fallbackMessage:
      "いいね状態の取得に失敗しました。",
    context:
      "getLikedPostIds",
  });

  return new Set(
    (data ?? []).map(
      (row) => row.post_id
    )
  );
}
