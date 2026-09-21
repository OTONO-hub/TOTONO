import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, CalendarDays, MapPin, Waves } from "lucide-react";

import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { getVisitedSaunas } from "@/services/visited-saunas";

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime())
    ? value
    : new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

export default async function VisitedSaunasPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <><Header /><main className="min-h-screen bg-muted/25 px-5 pb-20 pt-28 text-center"><h1 className="text-2xl font-semibold">ログインが必要です</h1><Link href="/login" className="mt-6 inline-flex rounded-full bg-primary px-7 py-3 text-primary-foreground">ログインへ</Link></main></>;
  }

  const saunas = await getVisitedSaunas(supabase, user.id);

  return (
    <><Header /><main className="min-h-screen bg-muted/25 pb-24 pt-28">
      <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
        <Link href="/profile" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" />プロフィールへ戻る</Link>
        <section className="mt-8 rounded-[2rem] border border-border/55 bg-card/90 px-6 py-10 shadow-sm sm:px-10">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Visited</p>
          <h1 className="mt-4 text-3xl font-semibold tracking-[-0.04em] sm:text-4xl">行ったサウナ</h1>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">投稿から自動で残った、あなたの訪問施設です。</p>
          <p className="mt-5 text-2xl font-semibold">{saunas.length}<span className="ml-1 text-sm text-muted-foreground">施設</span></p>
        </section>

        {saunas.length === 0 ? (
          <section className="mt-10 rounded-[2rem] border border-border/55 bg-card/90 px-6 py-16 text-center">
            <MapPin className="mx-auto size-7 text-muted-foreground" />
            <h2 className="mt-5 text-xl font-semibold">行ったサウナはまだありません</h2>
            <p className="mt-3 text-sm text-muted-foreground">サ活を投稿すると、訪れた施設が自動で追加されます。</p>
          </section>
        ) : (
          <section className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-label="行ったサウナ一覧">
            {saunas.map((sauna) => {
              const content = <>
                <div className="relative aspect-[16/10] overflow-hidden bg-[#3e3a3a]">
                  {sauna.imageUrl ? <Image src={sauna.imageUrl} alt={`${sauna.saunaName}の施設画像`} fill sizes="(max-width: 640px) 100vw, 33vw" className="object-cover" /> : <div className="flex h-full items-center justify-center"><Waves className="size-8 text-white/60" /></div>}
                </div>
                <div className="p-5">
                  <h2 className="text-lg font-semibold">{sauna.saunaName}</h2>
                  <p className="mt-2 flex items-center gap-2 text-xs text-muted-foreground"><MapPin className="size-3.5" />{[sauna.prefecture, sauna.city].filter(Boolean).join(" ") || "所在地未登録"}</p>
                  <div className="mt-4 flex items-center justify-between border-t border-border/45 pt-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />最終訪問 {formatDate(sauna.latestVisitDate)}</span>
                    <strong className="text-foreground">{sauna.visitCount}回</strong>
                  </div>
                  {sauna.saunaId ? <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-foreground">施設詳細を見る<ArrowRight className="size-3.5" /></span> : null}
                </div>
              </>;

              return sauna.saunaId ? <Link key={`id:${sauna.saunaId}`} href={`/saunas/${sauna.saunaId}`} className="overflow-hidden rounded-[1.75rem] border border-border/55 bg-card/90 shadow-sm transition hover:-translate-y-1 hover:shadow-md">{content}</Link> : <article key={`name:${sauna.saunaName}`} className="overflow-hidden rounded-[1.75rem] border border-border/55 bg-card/90 shadow-sm">{content}</article>;
            })}
          </section>
        )}
      </div>
    </main></>
  );
}
