import {
  supabase,
} from "../lib/supabase";
import type {
  Sauna,
} from "./saunas";

export type TodayRecentActivity = {
  id: string;
  saunaId: string | null;
  saunaName: string;
  visitDate: string;
  setCount: number;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
};

export type TodayData = {
  recentActivity:
    | TodayRecentActivity
    | null;
  favoriteSaunas: Sauna[];
};

type PostImageRow = {
  image_url: string;
  sort_order: number;
};

type RecentPostRow = {
  id: string;
  sauna_id: string | null;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string | null;
  image_url: string | null;
  post_images:
    | PostImageRow[]
    | null;
};

type FavoriteSaunaRow = {
  sauna_id: string;
  created_at: string;
  saunas:
    | Sauna
    | Sauna[]
    | null;
};

const FAVORITE_LIMIT =
  6;

function getPrimaryImageUrl(
  post: RecentPostRow
): string | null {
  const sortedImages = [
    ...(post.post_images ??
      []),
  ].sort(
    (
      first,
      second
    ) =>
      first.sort_order -
      second.sort_order
  );

  return (
    sortedImages[0]
      ?.image_url ??
    post.image_url ??
    null
  );
}

function getFavoriteSauna(
  favorite:
    FavoriteSaunaRow
): Sauna | null {
  if (
    Array.isArray(
      favorite.saunas
    )
  ) {
    return (
      favorite.saunas[0] ??
      null
    );
  }

  return (
    favorite.saunas ??
    null
  );
}

export async function getTodayData(
  userId: string
): Promise<TodayData> {
  if (!supabase) {
    throw new Error(
      "Supabaseの設定が見つかりません。"
    );
  }

  const [
    recentPostResult,
    favoritesResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "posts"
        )
        .select(
          `
            id,
            sauna_id,
            sauna_name,
            visit_date,
            set_count,
            rating,
            comment,
            image_url,
            post_images (
              image_url,
              sort_order
            )
          `
        )
        .eq(
          "user_id",
          userId
        )
        .order(
          "visit_date",
          {
            ascending:
              false,
          }
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(
          1
        )
        .maybeSingle<
          RecentPostRow
        >(),

      supabase
        .from(
          "favorite_saunas"
        )
        .select(
          `
            sauna_id,
            created_at,
            saunas (
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
            )
          `
        )
        .eq(
          "user_id",
          userId
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .limit(
          FAVORITE_LIMIT
        )
        .returns<
          FavoriteSaunaRow[]
        >(),
    ]);

  if (
    recentPostResult.error
  ) {
    throw new Error(
      `最近のサ活を取得できませんでした: ${recentPostResult.error.message}`
    );
  }

  if (
    favoritesResult.error
  ) {
    throw new Error(
      `お気に入り施設を取得できませんでした: ${favoritesResult.error.message}`
    );
  }

  const recentPost =
    recentPostResult.data;

  const recentActivity:
    | TodayRecentActivity
    | null =
    recentPost
      ? {
          id:
            recentPost.id,

          saunaId:
            recentPost.sauna_id,

          saunaName:
            recentPost.sauna_name,

          visitDate:
            recentPost.visit_date,

          setCount:
            recentPost.set_count,

          rating:
            recentPost.rating,

          comment:
            recentPost.comment,

          imageUrl:
            getPrimaryImageUrl(
              recentPost
            ),
        }
      : null;

  const favoriteSaunas =
    (
      favoritesResult.data ??
      []
    )
      .map(
        getFavoriteSauna
      )
      .filter(
        (
          sauna
        ): sauna is Sauna =>
          sauna !==
          null
      );

  return {
    recentActivity,
    favoriteSaunas,
  };
}
