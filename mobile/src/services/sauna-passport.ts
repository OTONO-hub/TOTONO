import type { SupabaseClient } from "@supabase/supabase-js";

import type { JournalPost } from "./journal";

export type SaunaPassport = {
  saunaDays: number;
  facilities: number;
  prefectures: number;
  prefectureNames: string[];
  wantToGo: number;
};

export async function getSaunaPassport(
  supabase: SupabaseClient,
  userId: string,
  posts: JournalPost[]
): Promise<SaunaPassport> {
  const days = new Set(posts.map((post) => post.visit_date.trim()).filter(Boolean));
  const facilities = new Set<string>();
  const saunaIds = new Set<string>();

  for (const post of posts) {
    const saunaId = post.sauna_id?.trim() || null;
    const saunaName = post.sauna_name.trim().replace(/\s+/g, " ");
    if (saunaId) {
      facilities.add(`id:${saunaId}`);
      saunaIds.add(saunaId);
    } else if (saunaName) {
      facilities.add(`name:${saunaName.toLocaleLowerCase("ja-JP")}`);
    }
  }

  const ids = [...saunaIds];
  const [saunasResult, favoritesResult] = await Promise.all([
    ids.length > 0
      ? supabase.from("saunas").select("prefecture").in("id", ids)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("favorite_saunas")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  if (saunasResult.error) {
    throw new Error(`都道府県情報を取得できませんでした: ${saunasResult.error.message}`);
  }
  if (favoritesResult.error) {
    throw new Error(`行きたいサウナ数を取得できませんでした: ${favoritesResult.error.message}`);
  }

  const prefectureNames = [...new Set(
    (saunasResult.data ?? [])
      .map((sauna) => sauna.prefecture?.trim())
      .filter((prefecture): prefecture is string => Boolean(prefecture))
  )].sort((a, b) => a.localeCompare(b, "ja-JP"));

  return {
    saunaDays: days.size,
    facilities: facilities.size,
    prefectures: prefectureNames.length,
    prefectureNames,
    wantToGo: favoritesResult.count ?? 0,
  };
}
