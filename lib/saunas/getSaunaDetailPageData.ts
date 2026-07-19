import { createClient } from "@/lib/supabase/server";
import { isFavoriteSauna } from "@/services/favorite-saunas";
import { getPostsBySaunaId } from "@/services/posts";
import {
  getSaunaMetricsBySaunaIds,
  type RatingDistribution,
} from "@/services/sauna-metrics";
import { getSaunaById } from "@/services/saunas";

export async function getSaunaDetailPageData(
  saunaId: string
) {
  const supabase = await createClient();

  const [
    sauna,
    posts,
    {
      data: { user },
    },
  ] = await Promise.all([
    getSaunaById(supabase, saunaId),
    getPostsBySaunaId(supabase, saunaId),
    supabase.auth.getUser(),
  ]);

  if (!sauna) {
    return null;
  }

  const [initialFavorite, metricsBySaunaId] =
    await Promise.all([
      user
        ? isFavoriteSauna(
            supabase,
            user.id,
            sauna.id
          )
        : Promise.resolve(false),
      getSaunaMetricsBySaunaIds(
        supabase,
        [sauna.id]
      ),
    ]);

  const metrics = metricsBySaunaId[sauna.id];

  return {
    sauna,
    posts,
    userId: user?.id ?? null,
    initialFavorite,
    averageRating:
      metrics?.averageRating ?? null,
    ratingCount:
      metrics?.ratingCount ?? 0,
    postCount:
      metrics?.postCount ?? posts.length,
    favoriteCount:
      metrics?.favoriteCount ?? 0,
    ratingDistribution:
      metrics?.ratingDistribution ??
      createEmptyRatingDistribution(),
  };
}

function createEmptyRatingDistribution(): RatingDistribution {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
}
