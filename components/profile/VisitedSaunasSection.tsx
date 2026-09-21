import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function VisitedSaunasSection({ count }: { count: number }) {
  return (
    <section className="mt-8 overflow-hidden rounded-[2rem] border border-border/55 bg-card/90 px-6 py-7 shadow-sm backdrop-blur-md sm:mt-10 sm:px-8">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full bg-secondary/25">
              <MapPin className="size-4" aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">Visited</p>
          </div>
          <h2 className="mt-4 text-2xl font-semibold tracking-[-0.035em]">行ったサウナ</h2>
          <p className="mt-2 text-sm leading-7 text-muted-foreground">
            {count > 0 ? `${count}施設のサウナライフが記録されています。` : "サ活を記録すると、訪れた施設がここに育っていきます。"}
          </p>
        </div>
        <Link href="/visited-saunas" className={cn(buttonVariants({ variant: "totonoOutline", size: "xl" }), "shrink-0")}>
          一覧を見る
          <ArrowRight className="size-4" aria-hidden="true" />
        </Link>
      </div>
    </section>
  );
}
