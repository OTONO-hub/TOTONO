import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  Comment,
  CommentAuthor,
  CommentWithAuthor,
  CreateCommentInput,
} from "../types/comment";

const MAX_COMMENT_LENGTH =
  300;

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

function normalizeCreateInput(
  input: CreateCommentInput
): CreateCommentInput {
  const userId =
    assertRequiredText(
      input.user_id,
      "ユーザーID"
    );

  const postId =
    assertRequiredText(
      input.post_id,
      "投稿ID"
    );

  const content =
    assertRequiredText(
      input.content,
      "コメント"
    );

  if (
    content.length >
    MAX_COMMENT_LENGTH
  ) {
    throw new Error(
      `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`
    );
  }

  return {
    user_id:
      userId,

    post_id:
      postId,

    content,
  };
}

export async function createComment(
  supabase: SupabaseClient,
  input: CreateCommentInput
): Promise<Comment> {
  const normalizedInput =
    normalizeCreateInput(
      input
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "comments"
      )
      .insert(
        normalizedInput
      )
      .select(
        `
          id,
          user_id,
          post_id,
          content,
          created_at
        `
      )
      .single<
        Comment
      >();

  if (error) {
    throw new Error(
      `コメントの投稿に失敗しました: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "投稿したコメントを取得できませんでした。"
    );
  }

  return data;
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

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "comments"
      )
      .select(
        `
          id,
          user_id,
          post_id,
          content,
          created_at
        `
      )
      .eq(
        "post_id",
        normalizedPostId
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      )
      .returns<
        Comment[]
      >();

  if (error) {
    throw new Error(
      `コメントを取得できませんでした: ${error.message}`
    );
  }

  return data ?? [];
}

export async function getCommentsWithAuthorsByPostId(
  supabase: SupabaseClient,
  postId: string
): Promise<
  CommentWithAuthor[]
> {
  const comments =
    await getCommentsByPostId(
      supabase,
      postId
    );

  if (
    comments.length ===
    0
  ) {
    return [];
  }

  const userIds = [
    ...new Set(
      comments.map(
        (
          comment
        ) =>
          comment.user_id
      )
    ),
  ];

  const {
    data:
      profiles,
    error:
      profilesError,
  } =
    await supabase
      .from(
        "profiles"
      )
      .select(
        `
          id,
          username,
          avatar_url
        `
      )
      .in(
        "id",
        userIds
      )
      .returns<
        CommentAuthor[]
      >();

  if (profilesError) {
    throw new Error(
      `コメント投稿者を取得できませんでした: ${profilesError.message}`
    );
  }

  const authorsById =
    new Map<
      string,
      CommentAuthor
    >(
      (
        profiles ??
        []
      ).map(
        (
          profile
        ) => [
          profile.id,
          profile,
        ]
      )
    );

  return comments.map(
    (
      comment
    ): CommentWithAuthor => ({
      comment,

      author:
        authorsById.get(
          comment.user_id
        ) ??
        null,
    })
  );
}

export async function getCommentsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Comment[]> {
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
    return [];
  }

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "comments"
      )
      .select(
        `
          id,
          user_id,
          post_id,
          content,
          created_at
        `
      )
      .in(
        "post_id",
        normalizedPostIds
      )
      .order(
        "created_at",
        {
          ascending:
            true,
        }
      )
      .returns<
        Comment[]
      >();

  if (error) {
    throw new Error(
      `コメント一覧を取得できませんでした: ${error.message}`
    );
  }

  return data ?? [];
}

export async function getCommentCountsByPostIds(
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
        "comments"
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
      `コメント数を取得できませんでした: ${error.message}`
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
    const currentPostId =
      row.post_id as
        string;

    counts.set(
      currentPostId,
      (
        counts.get(
          currentPostId
        ) ??
        0
      ) + 1
    );
  }

  return counts;
}

export async function getLatestCommentsByPostIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<
  Map<
    string,
    Comment
  >
> {
  const comments =
    await getCommentsByPostIds(
      supabase,
      postIds
    );

  const latestComments =
    new Map<
      string,
      Comment
    >();

  for (
    const comment of
    comments
  ) {
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

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "comments"
      )
      .delete()
      .eq(
        "id",
        normalizedCommentId
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .select(
        "id"
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `コメントの削除に失敗しました: ${error.message}`
    );
  }

  if (!data) {
    throw new Error(
      "コメントが見つからないか、削除する権限がありません。"
    );
  }
}
