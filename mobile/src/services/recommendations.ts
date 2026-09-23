import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";
import { addFavoriteSauna } from "./favorite-saunas";
import type { Sauna } from "./saunas";

const ACTIVITY_LIMIT = 500;
const CANDIDATE_LIMIT = 40;
const HIGH_RATING_THRESHOLD = 4.5;

type FavoriteRow = {
  sauna_id: string;
  saunas: { prefecture: string | null } | { prefecture: string | null }[] | null;
};

type ActivityRow = {
  sauna_id: string | null;
  rating?: number | null;
};

export type NextSaunaRecommendation = {
  sauna: Sauna;
  reason: string;
};

export type RecommendationCandidate = {
  sauna: Sauna;
  postCount: number;
  favoriteCount: number;
  averageRating: number | null;
};

export function selectNextSaunaRecommendation(
  candidates: RecommendationCandidate[],
  excludedSaunaIds: Set<string>,
  preferredPrefecture: string | null
): NextSaunaRecommendation | null {
  const available = candidates
    .filter(({ sauna }) => !excludedSaunaIds.has(sauna.id))
    .sort((first, second) => {
      const firstPreferred = first.sauna.prefecture === preferredPrefecture ? 1 : 0;
      const secondPreferred = second.sauna.prefecture === preferredPrefecture ? 1 : 0;
      if (firstPreferred !== secondPreferred) return secondPreferred - firstPreferred;

      const firstHighlyRated = (first.averageRating ?? 0) >= HIGH_RATING_THRESHOLD ? 1 : 0;
      const secondHighlyRated = (second.averageRating ?? 0) >= HIGH_RATING_THRESHOLD ? 1 : 0;
      if (firstHighlyRated !== secondHighlyRated) return secondHighlyRated - firstHighlyRated;

      const firstScore = first.postCount * 3 + first.favoriteCount * 2 + (first.averageRating ?? 0);
      const secondScore = second.postCount * 3 + second.favoriteCount * 2 + (second.averageRating ?? 0);
      return secondScore - firstScore || first.sauna.id.localeCompare(second.sauna.id);
    });

  const selected = available[0];
  if (!selected) return null;

  const preferred = Boolean(preferredPrefecture && selected.sauna.prefecture === preferredPrefecture);
  const highlyRated = (selected.averageRating ?? 0) >= HIGH_RATING_THRESHOLD;
  const reason = preferred && highlyRated
    ? `${preferredPrefecture}で人気の高評価施設`
    : preferred
      ? `${preferredPrefecture}で人気の施設`
      : highlyRated
        ? "利用者評価の高い人気施設"
        : "TOTONOで注目されている施設";

  return { sauna: selected.sauna, reason };
}

function getPrefecture(row: FavoriteRow): string | null {
  const sauna = Array.isArray(row.saunas) ? row.saunas[0] : row.saunas;
  return sauna?.prefecture?.trim() || null;
}

export async function getNextSaunaRecommendation(
  userId: string,
  sessionExcludedSaunaIds: string[] = []
): Promise<NextSaunaRecommendation | null> {
  if (!supabase) throw new Error("Supabaseの設定が見つかりません。");
  const client: SupabaseClient = supabase;

  const [favoritesResult, visitsResult, postsResult, popularFavoritesResult] = await Promise.all([
    client.from("favorite_saunas").select("sauna_id, saunas (prefecture)").eq("user_id", userId),
    client.from("posts").select("sauna_id").eq("user_id", userId),
    client.from("posts").select("sauna_id, rating").not("sauna_id", "is", null).order("created_at", { ascending: false }).limit(ACTIVITY_LIMIT),
    client.from("favorite_saunas").select("sauna_id").order("created_at", { ascending: false }).limit(ACTIVITY_LIMIT),
  ]);

  if (favoritesResult.error || visitsResult.error || postsResult.error || popularFavoritesResult.error) {
    throw new Error("おすすめ施設を取得できませんでした。");
  }

  const favorites = (favoritesResult.data ?? []) as unknown as FavoriteRow[];
  const visits = (visitsResult.data ?? []) as ActivityRow[];
  const posts = (postsResult.data ?? []) as ActivityRow[];
  const popularFavorites = (popularFavoritesResult.data ?? []) as Array<{ sauna_id: string }>;
  const excluded = new Set([
    ...favorites.map((row) => row.sauna_id),
    ...visits.flatMap((row) => row.sauna_id ? [row.sauna_id] : []),
    ...sessionExcludedSaunaIds,
  ]);

  const prefectureCounts = new Map<string, number>();
  favorites.forEach((row) => {
    const prefecture = getPrefecture(row);
    if (prefecture) prefectureCounts.set(prefecture, (prefectureCounts.get(prefecture) ?? 0) + 1);
  });
  const preferredPrefecture = [...prefectureCounts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;

  const metrics = new Map<string, { postCount: number; favoriteCount: number; ratingTotal: number; ratingCount: number }>();
  const metricFor = (id: string) => {
    const current = metrics.get(id) ?? { postCount: 0, favoriteCount: 0, ratingTotal: 0, ratingCount: 0 };
    metrics.set(id, current);
    return current;
  };
  posts.forEach((row) => {
    if (!row.sauna_id) return;
    const metric = metricFor(row.sauna_id);
    metric.postCount += 1;
    if (typeof row.rating === "number") {
      metric.ratingTotal += row.rating;
      metric.ratingCount += 1;
    }
  });
  popularFavorites.forEach((row) => { metricFor(row.sauna_id).favoriteCount += 1; });

  const candidateIds = [...metrics.entries()]
    .filter(([id]) => !excluded.has(id))
    .sort((a, b) => (b[1].postCount * 3 + b[1].favoriteCount * 2) - (a[1].postCount * 3 + a[1].favoriteCount * 2))
    .slice(0, CANDIDATE_LIMIT)
    .map(([id]) => id);

  let saunaRows: Sauna[] = [];
  if (candidateIds.length > 0) {
    const result = await client.from("saunas").select("*").in("id", candidateIds);
    if (result.error) throw new Error("おすすめ施設を取得できませんでした。");
    saunaRows = (result.data ?? []) as Sauna[];
  }

  if (saunaRows.length === 0) {
    const result = await client.from("saunas").select("*").eq("is_verified", true).order("name").limit(CANDIDATE_LIMIT);
    if (result.error) throw new Error("おすすめ施設を取得できませんでした。");
    saunaRows = (result.data ?? []) as Sauna[];
  }

  return selectNextSaunaRecommendation(
    saunaRows.map((sauna) => {
      const metric = metrics.get(sauna.id);
      return {
        sauna,
        postCount: metric?.postCount ?? 0,
        favoriteCount: metric?.favoriteCount ?? 0,
        averageRating: metric?.ratingCount ? metric.ratingTotal / metric.ratingCount : null,
      };
    }),
    excluded,
    preferredPrefecture
  );
}

export async function saveRecommendedSauna(userId: string, saunaId: string): Promise<void> {
  if (!supabase) throw new Error("Supabaseの設定が見つかりません。");
  await addFavoriteSauna(supabase, userId, saunaId);
}
