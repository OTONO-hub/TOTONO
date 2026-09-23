import { notFound, redirect } from "next/navigation";

import { FacilityPhotoManager } from "@/components/admin/FacilityPhotoManager";
import {
  AdminAccessError,
  requireAdmin,
} from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";

type SaunaRow = {
  id: string;
  name: string;
  prefecture: string | null;
  image_url: string | null;
};

async function getAllSaunas(): Promise<SaunaRow[]> {
  const client = createAdminClient();
  const rows: SaunaRow[] = [];
  const pageSize = 500;

  for (let start = 0; ; start += pageSize) {
    const { data, error } = await client
      .from("saunas")
      .select("id, name, prefecture, image_url")
      .order("prefecture", { nullsFirst: false })
      .order("name")
      .range(start, start + pageSize - 1);
    if (error) throw error;
    rows.push(...((data ?? []) as SaunaRow[]));
    if (!data || data.length < pageSize) break;
  }

  return rows;
}

export default async function FacilityPhotosAdminPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof AdminAccessError && error.status === 401) {
      redirect("/login?next=/admin/facility-photos");
    }
    notFound();
  }

  const client = createAdminClient();
  const [saunas, photoResult, pilotResult] = await Promise.all([
    getAllSaunas(),
    client
      .from("facility_photos")
      .select(
        "id, sauna_id, public_url, source_type, photographer_name, created_at"
      )
      .eq("review_status", "approved")
      .is("removed_at", null)
      .order("created_at", { ascending: false }),
    client
      .from("facility_photo_pilot_facilities")
      .select("sauna_id"),
  ]);

  if (photoResult.error) throw photoResult.error;
  if (pilotResult.error) throw pilotResult.error;

  const saunaById = new Map(saunas.map((sauna) => [sauna.id, sauna]));
  const pilotIds = new Set(
    (pilotResult.data ?? []).map((row) => row.sauna_id as string)
  );
  const coveredIds = new Set(
    (photoResult.data ?? []).map((photo) => photo.sauna_id as string)
  );
  const missing = saunas.filter((sauna) => !coveredIds.has(sauna.id));

  const progress = Array.from(
    saunas.reduce(
      (map, sauna) => {
        const prefecture = sauna.prefecture ?? "未設定";
        const current = map.get(prefecture) ?? { total: 0, covered: 0 };
        current.total += 1;
        if (coveredIds.has(sauna.id)) current.covered += 1;
        map.set(prefecture, current);
        return map;
      },
      new Map<string, { total: number; covered: number }>()
    )
  ).sort((a, b) => b[1].total - a[1].total);

  return (
    <main className="min-h-screen bg-[#f4f2ef] px-5 py-10 text-[#282322] sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="text-xs font-bold tracking-[0.24em] text-black/45">TOTONO PRODUCT HQ</p>
        <h1 className="mt-3 text-3xl font-black sm:text-4xl">Facility Photo Coverage</h1>
        <p className="mt-3 max-w-3xl text-sm leading-7 text-black/60">
          権利確認、施設一致、外観写真であることを審査してから公開します。最初の検証枠は15施設です。
        </p>

        <section className="mt-8 grid gap-4 sm:grid-cols-3">
          <Metric label="全国施設" value={saunas.length} />
          <Metric label="写真掲載済み" value={coveredIds.size} />
          <Metric label="未登録" value={missing.length} />
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">都道府県別掲載進捗</h2>
          <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {progress.map(([prefecture, value]) => {
              const percent = value.total
                ? Math.round((value.covered / value.total) * 1000) / 10
                : 0;
              return (
                <div key={prefecture} className="rounded-2xl bg-[#f6f5f3] p-4">
                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-bold">{prefecture}</span>
                    <span>{value.covered}/{value.total}（{percent}%）</span>
                  </div>
                  <div className="mt-3 h-2 overflow-hidden rounded-full bg-black/10">
                    <div className="h-full rounded-full bg-[#3796bd]" style={{ width: `${percent}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-10 rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-bold">写真未登録施設</h2>
          <p className="mt-2 text-sm text-black/55">「検証」は初回15施設の対象です。権利確認前の画像URLは掲載済みに数えません。</p>
          <div className="mt-5 max-h-96 overflow-auto rounded-xl border border-black/10">
            <table className="w-full min-w-[34rem] text-left text-sm">
              <thead className="sticky top-0 bg-[#eeeae5]">
                <tr><th className="p-3">対象</th><th className="p-3">都道府県</th><th className="p-3">施設</th></tr>
              </thead>
              <tbody>
                {missing.map((sauna) => (
                  <tr key={sauna.id} className="border-t border-black/5">
                    <td className="p-3 font-bold text-[#23789b]">{pilotIds.has(sauna.id) ? "検証" : "—"}</td>
                    <td className="p-3">{sauna.prefecture ?? "未設定"}</td>
                    <td className="p-3">{sauna.name}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="mt-10">
          <FacilityPhotoManager
            saunas={saunas.map((sauna) => ({
              id: sauna.id,
              name: sauna.name,
              prefecture: sauna.prefecture,
              isPilot: pilotIds.has(sauna.id),
            }))}
            photos={(photoResult.data ?? []).map((photo) => ({
              id: photo.id as string,
              publicUrl: photo.public_url as string,
              saunaName:
                saunaById.get(photo.sauna_id as string)?.name ?? "不明な施設",
              sourceType: photo.source_type as string,
              photographerName: photo.photographer_name as string,
              createdAt: photo.created_at as string,
            }))}
          />
        </div>
      </div>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-3xl bg-[#282322] p-6 text-white">
      <p className="text-sm text-white/60">{label}</p>
      <p className="mt-2 text-4xl font-black">{value.toLocaleString("ja-JP")}</p>
    </div>
  );
}
