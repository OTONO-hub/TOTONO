import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  Layers3,
  Star,
} from "lucide-react";

import type { JournalSummary as JournalSummaryData } from "@/services/journal";

type JournalSummaryProps = {
  summary: JournalSummaryData;
};

type SummaryItem = {
  label: string;
  value: string;
  unit: string;
  icon: LucideIcon;
};

export function JournalSummary({
  summary,
}: JournalSummaryProps) {
  const summaryItems: SummaryItem[] = [
    {
      label: "今月のサ活",
      value: String(summary.monthlyVisits),
      unit: "回",
      icon: CalendarDays,
    },
    {
      label: "訪問施設",
      value: String(summary.visitedSaunas),
      unit: "施設",
      icon: Building2,
    },
    {
      label: "合計セット",
      value: String(summary.totalSets),
      unit: "セット",
      icon: Layers3,
    },
    {
      label: "平均評価",
      value:
        summary.averageRating === null
          ? "-"
          : summary.averageRating.toFixed(1),
      unit: summary.averageRating === null ? "" : "/ 5",
      icon: Star,
    },
  ];

  return (
    <section
      aria-labelledby="journal-summary-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:rounded-[2.5rem]
      "
    >
      <div
        className="
          border-b border-border/45
          px-5
          py-6
          sm:px-8
          sm:py-7
        "
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
            text-muted-foreground
          "
        >
          Monthly Summary
        </p>

        <h2
          id="journal-summary-heading"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.035em]
            text-foreground
            sm:text-3xl
          "
        >
          {summary.monthLabel}のサウナライフ
        </h2>
      </div>

      <div
        className="
          grid
          grid-cols-2
          divide-x
          divide-y
          divide-border/45
          lg:grid-cols-4
          lg:divide-y-0
        "
      >
        {summaryItems.map((item) => {
          const Icon = item.icon;

          return (
            <article
              key={item.label}
              className="
                min-w-0
                p-5
                sm:p-7
                lg:p-8
              "
            >
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  bg-muted/60
                  text-foreground
                "
              >
                <Icon
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />
              </div>

              <p
                className="
                  mt-6
                  text-xs
                  font-medium
                  tracking-[0.08em]
                  text-muted-foreground
                "
              >
                {item.label}
              </p>

              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  items-baseline
                  gap-x-2
                "
              >
                <strong
                  className="
                    text-3xl
                    font-semibold
                    tracking-[-0.045em]
                    text-foreground
                    tabular-nums
                    sm:text-4xl
                  "
                >
                  {item.value}
                </strong>

                {item.unit ? (
                  <span
                    className="
                      text-xs
                      font-medium
                      text-muted-foreground
                      sm:text-sm
                    "
                  >
                    {item.unit}
                  </span>
                ) : null}
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
