import {
  Activity,
  Building2,
  CalendarDays,
  Layers3,
  Star,
  Trophy,
  type LucideIcon,
} from "lucide-react";

import type { ProfileInsights } from "@/services/profile-insights";

type SaunaSummaryProps = {
  insights: ProfileInsights;
};

const MAX_RATING = 5;

export function SaunaSummary({
  insights,
}: SaunaSummaryProps) {
  const totalSaunaVisits =
    normalizeCount(
      insights.totalSaunaVisits
    );

  const visitedSaunas =
    normalizeCount(
      insights.visitedSaunas
    );

  const totalSets =
    normalizeCount(
      insights.totalSets
    );

  const monthlyVisits =
    normalizeCount(
      insights.monthlyVisits
    );

  const averageRating =
    normalizeRating(
      insights.averageRating
    );

  const highestRating =
    normalizeRating(
      insights.highestRating
    );

  return (
    <section
      aria-labelledby="sauna-summary-heading"
      className="mt-8 sm:mt-10"
    >
      <div
        className="
          overflow-hidden
          rounded-[2rem]
          border
          border-border/55
          bg-card/90
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-border/45
            px-5
            py-6
            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:px-8
            sm:py-7
            lg:px-10
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                aria-hidden="true"
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/25
                  text-foreground
                "
              >
                <Activity
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.8}
                />
              </span>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-muted-foreground
                "
              >
                Sauna Summary
              </p>
            </div>

            <h2
              id="sauna-summary-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-3xl
              "
            >
              整いサマリー
            </h2>
          </div>

          <p
            className="
              max-w-md
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            これまでに記録したサ活から、
            あなたの整いの歩みをまとめています。
          </p>
        </div>

        <dl
          aria-label="サウナ活動の集計"
          className="
            grid
            grid-cols-2
            gap-px
            bg-border/45
            sm:grid-cols-3
            lg:grid-cols-6
          "
        >
          <SummaryItem
            icon={Activity}
            label="総サ活数"
            value={totalSaunaVisits}
            displayValue={formatCount(
              totalSaunaVisits
            )}
            unit="回"
            iconClassName="
              bg-accent/20
              text-foreground
            "
          />

          <SummaryItem
            icon={Building2}
            label="訪問施設数"
            value={visitedSaunas}
            displayValue={formatCount(
              visitedSaunas
            )}
            unit="施設"
            iconClassName="
              bg-secondary/25
              text-foreground
            "
          />

          <SummaryItem
            icon={Layers3}
            label="合計セット数"
            value={totalSets}
            displayValue={formatCount(
              totalSets
            )}
            unit="セット"
            iconClassName="
              bg-success/15
              text-success
            "
          />

          <SummaryItem
            icon={CalendarDays}
            label="今月のサ活"
            value={monthlyVisits}
            displayValue={formatCount(
              monthlyVisits
            )}
            unit="回"
            iconClassName="
              bg-error/10
              text-error
            "
          />

          <SummaryItem
            icon={Star}
            label="平均評価"
            value={averageRating}
            displayValue={
              averageRating ??
              "—"
            }
            unit={
              averageRating
                ? `/ ${MAX_RATING.toFixed(1)}`
                : undefined
            }
            accessibleValue={
              averageRating
                ? `5点満点中${averageRating}点`
                : "評価なし"
            }
            iconClassName="
              bg-accent/20
              text-foreground
            "
          />

          <SummaryItem
            icon={Trophy}
            label="最高評価"
            value={highestRating}
            displayValue={
              highestRating ??
              "—"
            }
            unit={
              highestRating
                ? `/ ${MAX_RATING.toFixed(1)}`
                : undefined
            }
            accessibleValue={
              highestRating
                ? `5点満点中${highestRating}点`
                : "評価なし"
            }
            iconClassName="
              bg-secondary/25
              text-foreground
            "
          />
        </dl>
      </div>
    </section>
  );
}

type SummaryItemProps = {
  icon: LucideIcon;
  label: string;
  value: number | string | null;
  displayValue: string;
  unit?: string;
  accessibleValue?: string;
  iconClassName: string;
};

function SummaryItem({
  icon: Icon,
  label,
  value,
  displayValue,
  unit,
  accessibleValue,
  iconClassName,
}: SummaryItemProps) {
  const spokenValue =
    accessibleValue ??
    (unit
      ? `${value}${unit}`
      : String(value));

  return (
    <div
      aria-label={`${label}、${spokenValue}`}
      className="
        min-w-0
        bg-card
        px-5
        py-6
        sm:px-6
        sm:py-7
      "
    >
      <div
        aria-hidden="true"
        className={`
          flex
          size-10
          items-center
          justify-center
          rounded-2xl
          ${iconClassName}
        `}
      >
        <Icon
          aria-hidden="true"
          className="size-[1.125rem]"
          strokeWidth={1.8}
        />
      </div>

      <dt
        aria-hidden="true"
        className="
          mt-5
          text-xs
          font-medium
          text-muted-foreground
        "
      >
        {label}
      </dt>

      <dd
        aria-hidden="true"
        className="
          mt-2
          flex
          min-w-0
          items-baseline
          gap-1.5
          text-3xl
          font-semibold
          tracking-[-0.04em]
          text-foreground
        "
      >
        <span
          className="
            min-w-0
            truncate
            tabular-nums
          "
        >
          {displayValue}
        </span>

        {unit ? (
          <span
            className="
              shrink-0
              text-xs
              font-medium
              tracking-normal
              text-muted-foreground
            "
          >
            {unit}
          </span>
        ) : null}
      </dd>
    </div>
  );
}

function normalizeCount(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value)
  );
}

function formatCount(
  value: number
): string {
  return value.toLocaleString(
    "ja-JP"
  );
}

function normalizeRating(
  value: string
): string | null {
  const numericValue =
    Number(value);

  if (
    !Number.isFinite(
      numericValue
    )
  ) {
    return null;
  }

  const clampedValue =
    Math.max(
      0,
      Math.min(
        MAX_RATING,
        numericValue
      )
    );

  return clampedValue.toFixed(1);
}
