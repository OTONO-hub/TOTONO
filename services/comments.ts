import type { SupabaseClient } from "@supabase/supabase-js";

import {
  assertRequiredText,
  assertSupabaseError,
} from "@/lib/supabase/assert";
import type {
  Comment,
  CreateCommentInput,
} from "@/types/comment";

export async function createComment(
  supabase: SupabaseClient,
  input: CreateCommentInput
): Promise<void> {
  const { error } = await supabase
    .from("comments")
    .insert(input);

  assertSupabaseError(error, {
    fallbackMessage:
      "コメントの投稿に失敗しました。",
    context: "createComment",
  });
}

export async function getCommentsByPostId(
  supabase: SupabaseClient,
  postId: string
): Promise<Comment[]> {
  const normalizedPostId =
    assertRequiredText(
      postId,
      "投稿ID"
    );

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .eq(
      "post_id",
      normalizedPostId
    )
    .order("created_at", {
      ascending: true,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "コメントの取得に失敗しました。",
    context: "getCommentsByPostId",
  });

  return data ?? [];
}

export async function getCommentsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Comment[]> {
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
    return [];
  }

  const { data, error } = await supabase
    .from("comments")
    .select("*")
    .in(
      "post_id",
      normalizedPostIds
    )
    .order("created_at", {
      ascending: true,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "コメント一覧の取得に失敗しました。",
    context:
      "getCommentsByPostIds",
  });

  return data ?? [];
}

/**
 * 投稿IDごとのコメント数を
 * 一括取得します。
 */
export async function getCommentCountsByPostIds(
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

  const { data, error } = await supabase
    .from("comments")
    .select("post_id")
    .in(
      "post_id",
      normalizedPostIds
    );

  assertSupabaseError(error, {
    fallbackMessage:
      "コメント数の取得に失敗しました。",
    context:
      "getCommentCountsByPostIds",
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
 * 投稿ごとの最新コメントを
 * 一括取得します。
 */
export async function getLatestCommentsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Map<string, Comment>> {
  const comments =
    await getCommentsByPostIds(
      supabase,
      postIds
    );

  const latestComments =
    new Map<string, Comment>();

  for (const comment of comments) {
    latestComments.set(
      comment.post_id,
      comment
    );
  }

  return latestComments;
}

export async function deleteComment(
  supabase: SupabaseClient,
  commentId: string,
  userId: string
): Promise<void> {
  const normalizedCommentId =
    assertRequiredText(
      commentId,
      "コメントID"
    );

  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const { error } = await supabase
    .from("comments")
    .delete()
    .eq(
      "id",
      normalizedCommentId
    )
    .eq(
      "user_id",
      normalizedUserId
    );

  assertSupabaseError(error, {
    fallbackMessage:
      "コメントの削除に失敗しました。",
    context: "deleteComment",
  });
}
