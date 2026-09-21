import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import type {
  Sauna,
} from "./saunas";

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
      `行きたい状態の取得に失敗しました: ${error.message}`
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
      `行きたいへの追加に失敗しました: ${error.message}`
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
      `行きたいからの解除に失敗しました: ${error.message}`
    );
  }
}

export async function getFavoriteSaunas(
  supabase: SupabaseClient,
  userId: string
): Promise<Sauna[]> {
  const {
    data: favoriteRows,
    error: favoriteError,
  } = await supabase
    .from("favorite_saunas")
    .select("sauna_id, created_at")
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (favoriteError) {
    throw new Error(
      `行きたいサウナの取得に失敗しました: ${favoriteError.message}`
    );
  }

  const saunaIds = (favoriteRows ?? []).map(
    (favorite) => favorite.sauna_id
  );

  if (saunaIds.length === 0) {
    return [];
  }

  const {
    data: saunaRows,
    error: saunaError,
  } = await supabase
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
    .in("id", saunaIds);

  if (saunaError) {
    throw new Error(
      `行きたい施設情報の取得に失敗しました: ${saunaError.message}`
    );
  }

  const saunaById = new Map(
    (saunaRows ?? []).map((sauna) => [
      sauna.id,
      sauna as Sauna,
    ])
  );

  return saunaIds.flatMap((saunaId) => {
    const sauna = saunaById.get(saunaId);

    return sauna ? [sauna] : [];
  });
}
