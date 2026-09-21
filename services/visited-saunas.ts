import type { SupabaseClient } from "@supabase/supabase-js";

export type VisitedSauna = {
  saunaId: string | null;
  saunaName: string;
  visitCount: number;
  latestVisitDate: string;
  imageUrl: string | null;
  prefecture: string | null;
  city: string | null;
};

type VisitPost = {
  sauna_id: string | null;
  sauna_name: string;
  visit_date: string;
};

function normalizeSaunaName(name: string): string {
  return name.trim().replace(/\s+/g, " ").toLocaleLowerCase("ja-JP");
}

export function aggregateVisitedSaunas(posts: VisitPost[]): VisitedSauna[] {
  const visits = new Map<string, VisitedSauna>();

  for (const post of posts) {
    const saunaId = post.sauna_id?.trim() || null;
    const saunaName = post.sauna_name.trim().replace(/\s+/g, " ");

    if (!saunaName) continue;

    const key = saunaId
      ? `id:${saunaId}`
      : `name:${normalizeSaunaName(saunaName)}`;
    const existing = visits.get(key);

    if (existing) {
      existing.visitCount += 1;
      if (post.visit_date > existing.latestVisitDate) {
        existing.latestVisitDate = post.visit_date;
      }
      continue;
    }

    visits.set(key, {
      saunaId,
      saunaName,
      visitCount: 1,
      latestVisitDate: post.visit_date,
      imageUrl: null,
      prefecture: null,
      city: null,
    });
  }

  return [...visits.values()].sort((a, b) =>
    b.latestVisitDate.localeCompare(a.latestVisitDate)
  );
}

export async function getVisitedSaunas(
  supabase: SupabaseClient,
  userId: string
): Promise<VisitedSauna[]> {
  const { data: posts, error: postsError } = await supabase
    .from("posts")
    .select("sauna_id, sauna_name, visit_date")
    .eq("user_id", userId)
    .order("visit_date", { ascending: false });

  if (postsError) {
    throw new Error(`行ったサウナの取得に失敗しました: ${postsError.message}`);
  }

  const visited = aggregateVisitedSaunas(posts ?? []);
  const saunaIds = visited.flatMap((item) => item.saunaId ? [item.saunaId] : []);

  if (saunaIds.length === 0) return visited;

  const { data: saunas, error: saunasError } = await supabase
    .from("saunas")
    .select("id, name, image_url, prefecture, city")
    .in("id", saunaIds);

  if (saunasError) {
    throw new Error(`訪問施設情報の取得に失敗しました: ${saunasError.message}`);
  }

  const saunaById = new Map((saunas ?? []).map((sauna) => [sauna.id, sauna]));

  return visited.map((item) => {
    const sauna = item.saunaId ? saunaById.get(item.saunaId) : null;
    return sauna ? {
      ...item,
      saunaName: sauna.name,
      imageUrl: sauna.image_url,
      prefecture: sauna.prefecture,
      city: sauna.city,
    } : item;
  });
}
