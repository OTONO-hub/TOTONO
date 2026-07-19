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
 */
export async function getFavoriteSaunaIds(
  supabase: SupabaseClient,
  userId: string
): Promise<string[]> {
  const { data, error } = await supabase
    .from("favorite_saunas")
    .select("sauna_id")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

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
 * 指定した施設IDのうち、
 * お気に入り登録されている施設IDを取得します。
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
 */
export async function getFavoriteSaunas(
  supabase: SupabaseClient,
  userId: string
): Promise<Sauna[]> {
  const favoriteSaunaIds =
    await getFavoriteSaunaIds(
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
        has_sauna_room,
        has_cold_bath,
        has_outdoor_air_bath,
        has_rest_area,
        has_restaurant,
        has_parking,
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
    (data ?? []).map((sauna) => [
      sauna.id,
      sauna,
    ])
  );

  return favoriteSaunaIds.flatMap(
    (saunaId) => {
      const sauna = saunaById.get(saunaId);

      if (!sauna) {
        return [];
      }

      return [sauna];
    }
  );
}
