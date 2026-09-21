import { supabase } from "../lib/supabase";
import { getJournalPosts } from "./journal";

export type VisitedSauna = {
  saunaId: string | null;
  saunaName: string;
  visitCount: number;
  latestVisitDate: string;
  imageUrl: string | null;
  prefecture: string | null;
  city: string | null;
};

export async function getVisitedSaunas(userId: string): Promise<VisitedSauna[]> {
  if (!supabase) throw new Error("Supabaseの設定が見つかりません。");

  const posts = await getJournalPosts(userId);
  const map = new Map<string, VisitedSauna>();

  for (const post of posts) {
    const saunaId = post.sauna_id?.trim() || null;
    const saunaName = post.sauna_name.trim().replace(/\s+/g, " ");
    if (!saunaName) continue;
    const key = saunaId ? `id:${saunaId}` : `name:${saunaName.toLocaleLowerCase("ja-JP")}`;
    const existing = map.get(key);
    if (existing) {
      existing.visitCount += 1;
      if (post.visit_date > existing.latestVisitDate) existing.latestVisitDate = post.visit_date;
    } else {
      map.set(key, { saunaId, saunaName, visitCount: 1, latestVisitDate: post.visit_date, imageUrl: null, prefecture: null, city: null });
    }
  }

  const visited = [...map.values()].sort((a, b) => b.latestVisitDate.localeCompare(a.latestVisitDate));
  const saunaIds = visited.flatMap((item) => item.saunaId ? [item.saunaId] : []);
  if (saunaIds.length === 0) return visited;

  const { data, error } = await supabase.from("saunas").select("id, name, image_url, prefecture, city").in("id", saunaIds);
  if (error) throw new Error(`訪問施設情報を取得できませんでした: ${error.message}`);
  const saunaById = new Map((data ?? []).map((sauna) => [sauna.id, sauna]));

  return visited.map((item) => {
    const sauna = item.saunaId ? saunaById.get(item.saunaId) : null;
    return sauna ? { ...item, saunaName: sauna.name, imageUrl: sauna.image_url, prefecture: sauna.prefecture, city: sauna.city } : item;
  });
}
