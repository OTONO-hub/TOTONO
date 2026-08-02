import {
  BarChart3,
  CalendarDays,
} from "lucide-react";

import type { MonthlyActivity } from "@/services/profile-insights";

type MonthlyActivityChartProps = {
  activities: MonthlyActivity[];
};

type NormalizedMonthlyActivity = {
  yearMonth: string;
  label: string;
  visitCount: number;
};

const MINIMUM_ACTIVE_BAR_HEIGHT = 18;
const EMPTY_BAR_HEIGHT = 6;

export function MonthlyActivityChart({
  activities,
}: MonthlyActivityChartProps) {
  const normalizedActivities =
    normalizeActivities(activities);

  const maximumVisitCount = Math.max(
    ...normalizedActivities.map(
      (activity) =>
        activity.visitCount
    ),
    1
  );

  const totalVisits =
    normalizedActivities.reduce(
      (total, activity) =>
        total +
        activity.visitCount,
      0
    );

  const monthCount =
    normalizedActivities.length;

  return (
    <section
      aria-labelledby="monthly-activity-heading"
      aria-describedby="monthly-activity-description"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card
        shadow-sm
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
          px-6
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
        "
      >
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-secondary/25
              px-3
              py-1.5
              text-xs
              font-semibold
              tracking-[0.12em]
              text-foreground
            "
          >
            <BarChart3
              aria-hidden="true"
              className="size-3.5"
              strokeWidth={1.8}
            />

            ACTIVITY
          </div>

          <h2
            id="monthly-activity-heading"
            className="
              mt-4
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
              sm:text-2xl
            "
          >
            月別サ活推移
          </h2>

          <p
            id="monthly-activity-description"
            className="
              mt-2
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            直近
            {monthCount > 0
              ? monthCount
              : 6}
            か月のサ活回数を表示しています。
          </p>
        </div>

        <div
          aria-label={`${monthCount}か月のサ活合計、${totalVisits}回`}
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-2xl
            bg-muted/60
            px-4
            py-3
            text-sm
            text-foreground
          "
        >
          <CalendarDays
            aria-hidden="true"
            className="size-4"
            strokeWidth={1.8}
          />

          <span
            aria-hidden="true"
            className="font-medium"
          >
            {monthCount > 0
              ? monthCount
              : 6}
            か月合計
          </span>

          <span
            aria-hidden="true"
            className="
              font-semibold
              tabular-nums
            "
          >
            {totalVisits.toLocaleString(
              "ja-JP"
            )}
            回
          </span>
        </div>
      </div>

      <div
        className="
          px-4
          py-7
          sm:px-8
          sm:py-8
        "
      >
        {normalizedActivities.length >
        0 ? (
          <>
            <div
              role="img"
              aria-label={createChartLabel(
                normalizedActivities
              )}
              className="
                grid
                auto-cols-fr
                grid-flow-col
                items-end
                gap-2
                overflow-x-auto
                pb-1
                sm:gap-4
              "
            >
              {normalizedActivities.map(
                (activity) => {
                  const barHeight =
                    calculateBarHeight(
                      activity.visitCount,
                      maximumVisitCount
                    );

                  return (
                    <div
                      key={
                        activity.yearMonth
                      }
                      className="
                        flex
                        min-w-12
                        flex-col
                        items-center
                      "
                    >
                      <div
                        aria-hidden="true"
                        className="
                          mb-3
                          text-xs
                          font-semibold
                          tabular-nums
                          text-foreground
                          sm:text-sm
                        "
                      >
                        {activity.visitCount.toLocaleString(
                          "ja-JP"
                        )}

                        <span
                          className="
                            ml-0.5
                            text-[0.625rem]
                            font-normal
                            text-muted-foreground
                          "
                        >
                          回
                        </span>
                      </div>

                      <div
                        aria-hidden="true"
                        className="
                          flex
                          h-40
                          w-full
                          max-w-12
                          items-end
                          overflow-hidden
                          rounded-full
                          bg-muted/70
                          p-1
                          sm:h-48
                        "
                      >
                        <div
                          className={`
                            relative
                            w-full
                            rounded-full
                            transition-[height]
                            duration-500
                            ease-out
                            motion-reduce:transition-none
                            ${
                              activity.visitCount >
                              0
                                ? `
                                  bg-success
                                  after:absolute
                                  after:inset-x-1
                                  after:top-1
                                  after:h-px
                                  after:rounded-full
                                  after:bg-white/45
                                `
                                : `
                                  bg-foreground/10
                                `
                            }
                          `}
                          style={{
                            height: `${barHeight}%`,
                          }}
                        />
                      </div>

                      <div
                        aria-hidden="true"
                        className="
                          mt-3
                          max-w-full
                          truncate
                          text-xs
                          font-medium
                          text-muted-foreground
                          sm:text-sm
                        "
                      >
                        {activity.label}
                      </div>
                    </div>
                  );
                }
              )}
            </div>

            <dl className="sr-only">
              {normalizedActivities.map(
                (activity) => (
                  <div
                    key={`summary-${activity.yearMonth}`}
                  >
                    <dt>
                      {activity.label}
                    </dt>

                    <dd>
                      {activity.visitCount}
                      回
                    </dd>
                  </div>
                )
              )}
            </dl>
          </>
        ) : null}

        {totalVisits === 0 ? (
          <div
            role="status"
            className="
              mt-6
              rounded-2xl
              border
              border-dashed
              border-border/70
              bg-muted/30
              px-5
              py-5
              text-center
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            直近
            {monthCount > 0
              ? monthCount
              : 6}
            か月のサ活記録はまだありません。
            <br />
            サ活を記録すると、ここに月別の推移が表示されます。
          </div>
        ) : null}
      </div>
    </section>
  );
}

function normalizeActivities(
  activities: MonthlyActivity[]
): NormalizedMonthlyActivity[] {
  return activities.map(
    (activity) => ({
      yearMonth:
        activity.yearMonth,
      label:
        activity.label.trim() ||
        activity.yearMonth,
      visitCount:
        normalizeVisitCount(
          activity.visitCount
        ),
    })
  );
}

function normalizeVisitCount(
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

function calculateBarHeight(
  visitCount: number,
  maximumVisitCount: number
): number {
  if (visitCount === 0) {
    return EMPTY_BAR_HEIGHT;
  }

  return Math.max(
    (visitCount /
      maximumVisitCount) *
      100,
    MINIMUM_ACTIVE_BAR_HEIGHT
  );
}

function createChartLabel(
  activities: NormalizedMonthlyActivity[]
): string {
  const summary =
    activities
      .map(
        (activity) =>
          `${activity.label}は${activity.visitCount}回`
      )
      .join("、");

  return `月別サ活推移。${summary}。`;
}
