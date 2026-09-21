import type { SupabaseClient } from "@supabase/supabase-js";

import { assertSupabaseError } from "@/lib/supabase/assert";

export const MAX_PRIVATE_NOTE_LENGTH = 2000;

type PostPrivateNoteRow = {
  note: string;
};

export async function getPostPrivateNote(
  supabase: SupabaseClient,
  postId: string
): Promise<string> {
  const normalizedPostId = postId.trim();

  if (!normalizedPostId) {
    return "";
  }

  const { data, error } = await supabase
    .from("post_private_notes")
    .select("note")
    .eq("post_id", normalizedPostId)
    .maybeSingle<PostPrivateNoteRow>();

  assertSupabaseError(error, {
    fallbackMessage: "自分だけのメモの取得に失敗しました。",
    context: "getPostPrivateNote",
  });

  return data?.note ?? "";
}

export async function savePostPrivateNote(
  supabase: SupabaseClient,
  postId: string,
  userId: string,
  note: string
): Promise<void> {
  const normalizedPostId = postId.trim();
  const normalizedUserId = userId.trim();
  const normalizedNote = note.trim();

  if (!normalizedPostId || !normalizedUserId) {
    throw new Error("メモの保存に必要な情報がありません。");
  }

  if (normalizedNote.length > MAX_PRIVATE_NOTE_LENGTH) {
    throw new Error(
      `自分だけのメモは${MAX_PRIVATE_NOTE_LENGTH}文字以内で入力してください。`
    );
  }

  if (!normalizedNote) {
    const { error } = await supabase
      .from("post_private_notes")
      .delete()
      .eq("post_id", normalizedPostId)
      .eq("user_id", normalizedUserId);

    assertSupabaseError(error, {
      fallbackMessage: "自分だけのメモの削除に失敗しました。",
      context: "savePostPrivateNote.delete",
    });

    return;
  }

  const { error } = await supabase
    .from("post_private_notes")
    .upsert(
      {
        post_id: normalizedPostId,
        user_id: normalizedUserId,
        note: normalizedNote,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "post_id" }
    );

  assertSupabaseError(error, {
    fallbackMessage: "自分だけのメモの保存に失敗しました。",
    context: "savePostPrivateNote.upsert",
  });
}
