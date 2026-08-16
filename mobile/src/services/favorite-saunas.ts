import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export async function isFavoriteSauna(
  supabase: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<boolean> {
  const {
    data,
    error,
  } = await supabase
    .from("favorite_saunas")
    .select("id")
    .eq("user_id", userId)
    .eq("sauna_id", saunaId)
    .maybeSingle();

  if (error) {
    throw new Error(
      `お気に入り状態の取得に失敗しました: ${error.message}`
    );
  }

  return Boolean(data);
}

export async function addFavoriteSauna(
  supabase: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("favorite_saunas")
    .insert({
      user_id: userId,
      sauna_id: saunaId,
    });

  if (error) {
    throw new Error(
      `お気に入りへの追加に失敗しました: ${error.message}`
    );
  }
}

export async function removeFavoriteSauna(
  supabase: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<void> {
  const {
    error,
  } = await supabase
    .from("favorite_saunas")
    .delete()
    .eq("user_id", userId)
    .eq("sauna_id", saunaId);

  if (error) {
    throw new Error(
      `お気に入りの解除に失敗しました: ${error.message}`
    );
  }
}
