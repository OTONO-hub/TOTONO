import Link from "next/link";
import { ArrowRight, CalendarDays, Heart, MapPin } from "lucide-react";
import type { ReactNode } from "react";

import type { SaunaPassport as SaunaPassportData } from "@/services/sauna-passport";

export function SaunaPassport({
  passport,
}: {
  passport: SaunaPassportData;
}) {
  const progress = Math.min(100, (passport.prefectures / 47) * 100);

  return (
    <section className="mt-6 overflow-hidden rounded-[2rem] border border-emerald-950/10 bg-[linear-gradient(145deg,#173c36,#24594f)] text-white shadow-[0_20px_60px_-30px_rgba(10,45,39,0.65)]">
      <div className="px-5 py-6 sm:px-8 sm:py-8">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.3em] text-emerald-100/70">My Sauna Life</p>
        <div className="mt-2 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold tracking-[-0.04em] sm:text-3xl">Sauna Passport</h2>
            <p className="mt-2 text-sm text-emerald-50/70">サ活を重ねるほど、あなたの記録が育ちます。</p>
          </div>
          <MapPin className="hidden size-9 text-emerald-100/55 sm:block" strokeWidth={1.4} />
        </div>

        <dl className="mt-7 grid grid-cols-3 gap-2 sm:gap-4">
          {[
            ["Sauna Days", passport.saunaDays],
            ["Facilities", passport.facilities],
            ["Prefectures", passport.prefectures],
          ].map(([label, value]) => (
            <div key={label} className="rounded-2xl border border-white/10 bg-white/10 px-3 py-4 backdrop-blur-sm sm:px-5">
              <dt className="text-[0.62rem] uppercase tracking-[0.14em] text-emerald-50/65 sm:text-xs">{label}</dt>
              <dd className="mt-2 text-2xl font-semibold tabular-nums sm:text-3xl">{value}</dd>
            </div>
          ))}
        </dl>

        <div className="mt-6">
          <div className="flex items-center justify-between text-xs font-medium text-emerald-50/75">
            <span>Japan Sauna Journey</span>
            <span>{passport.prefectures} / 47 Prefectures</span>
          </div>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-black/20">
            <div className="h-full rounded-full bg-emerald-200 transition-[width]" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>

      <nav className="grid border-t border-white/10 bg-black/10 sm:grid-cols-3" aria-label="サウナライフの記録">
        <PassportLink href="/favorite-saunas" icon={<Heart />} label="Want to Go" value={`${passport.wantToGo} facilities`} />
        <PassportLink href="/visited-saunas" icon={<MapPin />} label="Visited" value={`${passport.facilities} facilities`} />
        <PassportLink href="/journal" icon={<CalendarDays />} label="Journal" value={`${passport.saunaDays} sauna days`} />
      </nav>
    </section>
  );
}

function PassportLink({ href, icon, label, value }: { href: string; icon: ReactNode; label: string; value: string }) {
  return (
    <Link href={href} className="group flex items-center gap-3 border-white/10 px-5 py-4 transition-colors hover:bg-white/10 sm:border-r sm:last:border-r-0">
      <span className="[&>svg]:size-4 [&>svg]:text-emerald-100">{icon}</span>
      <span className="min-w-0 flex-1"><strong className="block text-sm font-medium">{label}</strong><small className="text-xs text-emerald-50/60">{value}</small></span>
      <ArrowRight className="size-4 text-emerald-50/40 transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
