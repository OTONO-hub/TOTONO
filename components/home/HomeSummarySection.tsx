import type { ReactNode } from "react";

import {
  ArrowRight,
  CalendarDays,
  Flame,
  MapPinned,
} from "lucide-react";

import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";
import { SectionHeader } from "@/components/ui/section-header";
import type { DashboardSummary } from "@/types/dashboard";

type HomeSummarySectionProps = {
  summary: DashboardSummary;
};

type SummaryItemProps = {
  label: string;
  value: number;
  unit: string;
  icon: ReactNode;
};

function SummaryItem({
  label,
  value,
  unit,
  icon,
}: SummaryItemProps) {
  return (
    <AppCard
      variant="glass"
      radius="lg"
      padding="md"
      interactive
      className="group"
    >
      <div
        className="
          flex
          items-center
          gap-3
          text-muted-foreground
        "
      >
        <span
          aria-hidden="true"
          className="
            flex
            size-9
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-secondary/20
            text-foreground
            transition-transform
            duration-200
            group-hover:scale-105
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          {icon}
        </span>

        <span
          className="
            text-xs
            font-semibold
            tracking-[0.04em]
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-5
          text-3xl
          font-semibold
          tracking-[-0.05em]
          text-foreground
          sm:text-4xl
        "
      >
        {value}

        <span
          className="
            ml-1.5
            text-sm
            font-medium
            tracking-normal
            text-muted-foreground
          "
        >
          {unit}
        </span>
      </p>
    </AppCard>
  );
}

export function HomeSummarySection({
  summary,
}: HomeSummarySectionProps) {
  return (
    <PageSection
      as="section"
      aria-labelledby="home-summary-heading"
    >
      <SectionHeader
        eyebrow="Sauna Life"
        title="あなたのサウナライフ"
        description="これまでのサ活を、静かに振り返ります。"
        action={
          <AppButton
            href="/profile"
            variant="secondary"
            trailingIcon={
              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
              />
            }
          >
            詳しく振り返る
          </AppButton>
        }
      />

      <div
        aria-label="サウナライフの概要"
        className="
          mt-8
          grid
          grid-cols-1
          gap-4
          sm:grid-cols-3
        "
      >
        <SummaryItem
          label="今月のサ活"
          value={summary.monthlyVisits}
          unit="回"
          icon={
            <CalendarDays
              className="size-4"
              strokeWidth={1.8}
            />
          }
        />

        <SummaryItem
          label="訪れた施設"
          value={summary.uniqueSaunas}
          unit="施設"
          icon={
            <MapPinned
              className="size-4"
              strokeWidth={1.8}
            />
          }
        />

        <SummaryItem
          label="累計サ活"
          value={summary.totalVisits}
          unit="回"
          icon={
            <Flame
              className="size-4"
              strokeWidth={1.8}
            />
          }
        />
      </div>
    </PageSection>
  );
}
