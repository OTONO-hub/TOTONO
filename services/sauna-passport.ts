import type { SupabaseClient } from "@supabase/supabase-js";

export type SaunaPassportPost = {
  sauna_id: string | null;
  sauna_name: string;
  visit_date: string;
};

export type SaunaPassport = {
  saunaDays: number;
  facilities: number;
  prefectures: number;
  prefectureNames: string[];
  wantToGo: number;
};

export function summarizeSaunaPassport(
  posts: SaunaPassportPost[],
  prefecturesBySaunaId: Map<string, string>
): Omit<SaunaPassport, "wantToGo"> {
  const days = new Set<string>();
  const facilities = new Set<string>();
  const prefectures = new Set<string>();

  for (const post of posts) {
    const visitDate = post.visit_date.trim();
    const saunaId = post.sauna_id?.trim() || null;
    const saunaName = post.sauna_name.trim().replace(/\s+/g, " ");

    if (visitDate) days.add(visitDate);
    if (saunaId) {
      facilities.add(`id:${saunaId}`);
      const prefecture = prefecturesBySaunaId.get(saunaId)?.trim();
      if (prefecture) prefectures.add(prefecture);
    } else if (saunaName) {
      facilities.add(`name:${saunaName.toLocaleLowerCase("ja-JP")}`);
    }
  }

  const prefectureNames = [...prefectures].sort((a, b) =>
    a.localeCompare(b, "ja-JP")
  );

  return {
    saunaDays: days.size,
    facilities: facilities.size,
    prefectures: prefectureNames.length,
    prefectureNames,
  };
}

export async function getSaunaPassport(
  supabase: SupabaseClient,
  userId: string,
  posts: SaunaPassportPost[]
): Promise<SaunaPassport> {
  const saunaIds = [...new Set(posts.flatMap((post) =>
    post.sauna_id?.trim() ? [post.sauna_id.trim()] : []
  ))];

  const [saunasResult, favoritesResult] = await Promise.all([
    saunaIds.length > 0
      ? supabase.from("saunas").select("id, prefecture").in("id", saunaIds)
      : Promise.resolve({ data: [], error: null }),
    supabase
      .from("favorite_saunas")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId),
  ]);

  if (saunasResult.error) {
    throw new Error(`都道府県情報の取得に失敗しました: ${saunasResult.error.message}`);
  }
  if (favoritesResult.error) {
    throw new Error(`行きたいサウナ数の取得に失敗しました: ${favoritesResult.error.message}`);
  }

  const prefecturesBySaunaId = new Map(
    (saunasResult.data ?? []).flatMap((sauna) =>
      sauna.prefecture ? [[sauna.id, sauna.prefecture] as const] : []
    )
  );

  return {
    ...summarizeSaunaPassport(posts, prefecturesBySaunaId),
    wantToGo: favoritesResult.count ?? 0,
  };
}
