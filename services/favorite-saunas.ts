import type { SupabaseClient } from "@supabase/supabase-js";

import type { Sauna } from "@/services/saunas";

export type FavoriteSauna = {
  id: string;
  user_id: string;
  sauna_id: string;
  created_at: string;
};

/**
 * 指定した施設がお気に入りに登録されているか確認します。
 *
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @param saunaId 施設ID
 * @returns お気に入り登録済みの場合はtrue
 */
export async function isFavoriteSauna(
  supabase: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<boolean> {
  const { data, error } = await supabase
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

/**
 * 指定した施設をお気に入りに追加します。
 *
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @param saunaId 施設ID
 */
export async function addFavoriteSauna(
  supabase: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<void> {
  const { error } = await supabase
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

/**
 * 指定した施設をお気に入りから解除します。
 *
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @param saunaId 施設ID
 */
export async function removeFavoriteSauna(
  supabase: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<void> {
  const { error } = await supabase
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

/**
 * 指定したユーザーのお気に入り施設IDをすべて取得します。
 *
 * 新しくお気に入りに追加した施設が先頭になるように、
 * created_atの降順で取得します。
 *
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @returns お気に入り施設IDの配列
 */
export async function getFavoriteSaunaIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorite_saunas")
    .select("sauna_id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(
      `お気に入り施設の取得に失敗しました: ${error.message}`
    );
  }

  return (data ?? []).map(
    (favoriteSauna) => favoriteSauna.sauna_id
  );
}

/**
 * 指定した施設IDのうち、お気に入り登録されている施設IDを取得します。
 *
 * 施設一覧や検索結果で、複数の施設のお気に入り状態を
 * 一括取得するときに使用します。
 *
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @param saunaIds 確認対象の施設ID一覧
 * @returns お気に入り登録済みの施設ID一覧
 */
export async function getFavoriteSaunaIdsBySaunaIds(
  supabase: SupabaseClient,
  userId: string,
  saunaIds: string[]
): Promise<string[]> {
  if (saunaIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("favorite_saunas")
    .select("sauna_id")
    .eq("user_id", userId)
    .in("sauna_id", saunaIds);

  if (error) {
    throw new Error(
      `お気に入り状態の一括取得に失敗しました: ${error.message}`
    );
  }

  return (data ?? []).map(
    (favoriteSauna) => favoriteSauna.sauna_id
  );
}

/**
 * 指定したユーザーのお気に入り施設情報を取得します。
 *
 * favorite_saunasに保存されている順番を維持し、
 * 新しく追加した施設が先頭になるように返します。
 *
 * @param supabase Supabaseクライアント
 * @param userId ユーザーID
 * @returns お気に入り施設情報の配列
 */
export async function getFavoriteSaunas(
  supabase: SupabaseClient,
  userId: string
): Promise<Sauna[]> {
  const favoriteSaunaIds = await getFavoriteSaunaIds(
    supabase,
    userId
  );

  if (favoriteSaunaIds.length === 0) {
    return [];
  }

  const { data, error } = await supabase
    .from("saunas")
    .select(
      `
        id,
        name,
        normalized_name,
        address,
        prefecture,
        city,
        postal_code,
        latitude,
        longitude,
        phone_number,
        website_url,
        opening_hours,
        image_url,
        google_place_id,
        source,
        is_verified,
        created_at,
        updated_at
      `
    )
    .in("id", favoriteSaunaIds);

  if (error) {
    throw new Error(
      `お気に入り施設情報の取得に失敗しました: ${error.message}`
    );
  }

  const saunaById = new Map(
    (data ?? []).map((sauna) => [sauna.id, sauna])
  );

  return favoriteSaunaIds.flatMap((saunaId) => {
    const sauna = saunaById.get(saunaId);

    if (!sauna) {
      return [];
    }

    return [sauna];
  });
}