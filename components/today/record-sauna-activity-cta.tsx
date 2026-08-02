import { ArrowUpRight, NotebookPen } from "lucide-react";

import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { BackgroundGlow } from "@/components/ui/background-glow";

export function RecordSaunaActivityCta() {
  return (
    <AppCard
      as="section"
      aria-labelledby="record-sauna-activity-title"
      variant="glass"
      radius="xl"
      padding="none"
      className="
        bg-primary
        px-6
        py-8
        text-primary-foreground
        sm:px-8
        sm:py-10
        lg:flex
        lg:items-center
        lg:justify-between
        lg:gap-10
        lg:px-12
        lg:py-12
      "
    >
      <BackgroundGlow
        tone="accent"
        position="top-right"
        size="lg"
        className="bg-accent/15"
      />

      <div className="relative max-w-2xl">
        <div
          className="
            flex
            size-11
            items-center
            justify-center
            rounded-full
            bg-white/10
          "
        >
          <NotebookPen
            aria-hidden="true"
            className="size-5"
            strokeWidth={1.8}
          />
        </div>

        <h2
          id="record-sauna-activity-title"
          className="
            mt-6
            text-2xl
            font-semibold
            tracking-[-0.035em]
            sm:text-3xl
          "
        >
          今日を記録する
        </h2>

        <p
          className="
            mt-3
            max-w-xl
            text-sm
            leading-7
            text-primary-foreground/65
            sm:text-base
          "
        >
          静かな時間を、自分のサウナライフに積み重ねましょう。
        </p>
      </div>

      <div className="relative mt-8 shrink-0 lg:mt-0">
        <AppButton
          href="/posts/new"
          size="lg"
          trailingIcon={
            <ArrowUpRight
              className="size-4"
              strokeWidth={1.8}
            />
          }
          className="
            bg-accent
            text-foreground
            hover:bg-accent/90
          "
        >
          記録する
        </AppButton>
      </div>
    </AppCard>
  );
}

