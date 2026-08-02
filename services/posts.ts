import type { SupabaseClient } from "@supabase/supabase-js";

import {
  assertRequiredText,
  assertSupabaseError,
} from "@/lib/supabase/assert";
import { normalizeQueryLimit } from "@/lib/supabase/query-limit";
import type {
  CreatePostInput,
  Post,
} from "@/types/post";

const DEFAULT_RECENT_POST_LIMIT = 12;
const MAXIMUM_POST_LIMIT = 100;

export async function createPost(
  supabase: SupabaseClient,
  input: CreatePostInput
): Promise<Post> {
  const { data, error } = await supabase
    .from("posts")
    .insert(input)
    .select("*")
    .single();

  assertSupabaseError(error, {
    fallbackMessage:
      "投稿の作成に失敗しました。",
    context: "createPost",
  });

  return data;
}

/**
 * 全投稿を新しい順で取得します。
 *
 * 既存画面との互換性を保つために残しています。
 * 全投稿が不要な画面では、
 * getRecentPostsなどの件数制限付き関数を使用してください。
 */
export async function getPosts(
  supabase: SupabaseClient
): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "投稿の取得に失敗しました。",
    context: "getPosts",
  });

  return data ?? [];
}

/**
 * 新着投稿を指定件数だけ取得します。
 *
 * Homeや一覧画面の初期表示など、
 * 全投稿が必要ない場所で使用します。
 */
export async function getRecentPosts(
  supabase: SupabaseClient,
  limit = DEFAULT_RECENT_POST_LIMIT
): Promise<Post[]> {
  const safeLimit =
    normalizeQueryLimit(limit, {
      defaultLimit:
        DEFAULT_RECENT_POST_LIMIT,
      maximumLimit:
        MAXIMUM_POST_LIMIT,
    });

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .order("created_at", {
      ascending: false,
    })
    .limit(safeLimit);

  assertSupabaseError(error, {
    fallbackMessage:
      "新着投稿の取得に失敗しました。",
    context: "getRecentPosts",
  });

  return data ?? [];
}

/**
 * 指定ユーザーの投稿を新しい順で取得します。
 *
 * limitを省略した場合は全件取得します。
 */
export async function getPostsByUserId(
  supabase: SupabaseClient,
  userId: string,
  limit?: number
): Promise<Post[]> {
  const normalizedUserId =
    userId.trim();

  if (!normalizedUserId) {
    return [];
  }

  let query = supabase
    .from("posts")
    .select("*")
    .eq(
      "user_id",
      normalizedUserId
    )
    .order("created_at", {
      ascending: false,
    });

  if (limit !== undefined) {
    query = query.limit(
      normalizeQueryLimit(limit, {
        defaultLimit:
          DEFAULT_RECENT_POST_LIMIT,
        maximumLimit:
          MAXIMUM_POST_LIMIT,
      })
    );
  }

  const { data, error } =
    await query;

  assertSupabaseError(error, {
    fallbackMessage:
      "ユーザーの投稿取得に失敗しました。",
    context: "getPostsByUserId",
  });

  return data ?? [];
}

/**
 * 指定した投稿IDに一致する投稿を取得します。
 *
 * 空文字・重複IDは除外します。
 */
export async function getPostsByIds(
  supabase: SupabaseClient,
  postIds: string[]
): Promise<Post[]> {
  const normalizedPostIds = [
    ...new Set(
      postIds
        .map((postId) =>
          postId.trim()
        )
        .filter(Boolean)
    ),
  ];

  if (
    normalizedPostIds.length === 0
  ) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .in(
      "id",
      normalizedPostIds
    )
    .order("created_at", {
      ascending: false,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "投稿の一括取得に失敗しました。",
    context: "getPostsByIds",
  });

  return data ?? [];
}

/**
 * 指定施設に紐づく投稿を
 * 新しい順で取得します。
 */
export async function getPostsBySaunaId(
  supabase: SupabaseClient,
  saunaId: string
): Promise<Post[]> {
  const normalizedSaunaId =
    saunaId.trim();

  if (!normalizedSaunaId) {
    return [];
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq(
      "sauna_id",
      normalizedSaunaId
    )
    .order("created_at", {
      ascending: false,
    });

  assertSupabaseError(error, {
    fallbackMessage:
      "施設の投稿取得に失敗しました。",
    context: "getPostsBySaunaId",
  });

  return data ?? [];
}

/**
 * 投稿IDから投稿を1件取得します。
 *
 * 該当する投稿がない場合はnullを返します。
 */
export async function getPostById(
  supabase: SupabaseClient,
  id: string
): Promise<Post | null> {
  const normalizedPostId =
    id.trim();

  if (!normalizedPostId) {
    return null;
  }

  const { data, error } = await supabase
    .from("posts")
    .select("*")
    .eq("id", normalizedPostId)
    .maybeSingle();

  assertSupabaseError(error, {
    fallbackMessage:
      "投稿の取得に失敗しました。",
    context: "getPostById",
  });

  return data;
}

export type UpdatePostInput =
  Omit<
    Partial<CreatePostInput>,
    "image_url"
  > & {
    image_url?: string | null;
  };

/**
 * 投稿内容を更新します。
 */
export async function updatePost(
  supabase: SupabaseClient,
  id: string,
  input: UpdatePostInput
): Promise<void> {
  const postId =
    assertRequiredText(
      id,
      "投稿ID"
    );

  const { error } = await supabase
    .from("posts")
    .update(input)
    .eq("id", postId);

  assertSupabaseError(error, {
    fallbackMessage:
      "投稿の更新に失敗しました。",
    context: "updatePost",
  });
}

/**
 * 投稿を削除します。
 */
export async function deletePost(
  supabase: SupabaseClient,
  id: string
): Promise<void> {
  const postId =
    assertRequiredText(
      id,
      "投稿ID"
    );

  const { error } = await supabase
    .from("posts")
    .delete()
    .eq("id", postId);

  assertSupabaseError(error, {
    fallbackMessage:
      "投稿の削除に失敗しました。",
    context: "deletePost",
  });
}
