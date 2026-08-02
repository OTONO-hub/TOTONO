import {
  ArrowUpRight,
  CalendarRange,
  Route,
} from "lucide-react";

import type { JourneyYear } from "@/lib/profile-journey";

type JourneyCardProps = {
  journey: JourneyYear[];
};

function formatVisits(visits: number) {
  return `${visits} Visits`;
}

export function JourneyCard({
  journey,
}: JourneyCardProps) {
  const latestYear =
    journey.at(-1) ?? null;

  const firstYear =
    journey.at(0) ?? null;

  const growth =
    latestYear && firstYear
      ? latestYear.visits -
        firstYear.visits
      : 0;

  return (
    <section
      aria-labelledby="sauna-journey-heading"
      className="
        mt-8
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:mt-10
        sm:rounded-[2.5rem]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b border-border/45
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-8
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
              className="
                flex
                size-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-secondary/25
                text-foreground
              "
            >
              <Route
                className="size-4.5"
                strokeWidth={1.8}
              />
            </span>

            <div>
              <p
                className="
                  text-[0.6875rem]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-muted-foreground
                "
              >
                Sauna Journey
              </p>

              <h2
                id="sauna-journey-heading"
                className="
                  mt-1
                  text-xl
                  font-semibold
                  tracking-[-0.03em]
                  text-foreground
                  sm:text-2xl
                "
              >
                サウナジャーニー
              </h2>
            </div>
          </div>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            これまでのサ活を年ごとに振り返り、
            訪問回数の変化を確認できます。
          </p>
        </div>

        {latestYear && (
          <div
            className="
              flex
              w-full
              items-center
              justify-between
              rounded-2xl
              border border-border/45
              bg-background/45
              px-4
              py-3
              sm:w-auto
              sm:min-w-48
              sm:justify-start
              sm:gap-4
            "
          >
            <span
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <CalendarRange
                className="size-4"
                strokeWidth={1.8}
              />
            </span>

            <div>
              <p
                className="
                  text-[0.6875rem]
                  font-medium
                  text-muted-foreground
                "
              >
                Latest Year
              </p>

              <p
                className="
                  mt-0.5
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                {latestYear.year}
                <span
                  className="
                    ml-2
                    font-normal
                    text-muted-foreground
                  "
                >
                  {formatVisits(
                    latestYear.visits
                  )}
                </span>
              </p>
            </div>
          </div>
        )}
      </div>

      {journey.length === 0 ? (
        <div
          className="
            px-5
            py-12
            text-center
            sm:px-8
            sm:py-14
            lg:px-10
          "
        >
          <div
            className="
              mx-auto
              flex
              size-14
              items-center
              justify-center
              rounded-full
              bg-muted
              text-muted-foreground
            "
          >
            <Route
              className="size-5"
              strokeWidth={1.7}
            />
          </div>

          <p
            className="
              mt-5
              text-sm
              font-semibold
              text-foreground
            "
          >
            まだサウナジャーニーはありません
          </p>

          <p
            className="
              mx-auto
              mt-2
              max-w-md
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            サ活を投稿すると、
            年ごとの訪問回数がここに表示されます。
          </p>
        </div>
      ) : (
        <div
          className="
            grid
            gap-8
            px-5
            py-7
            sm:px-8
            sm:py-9
            lg:grid-cols-[minmax(0,1fr)_15rem]
            lg:items-start
            lg:px-10
          "
        >
          <div className="space-y-7">
            {journey.map((year) => (
              <div key={year.year}>
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-lg
                        font-semibold
                        tracking-[-0.025em]
                        text-foreground
                      "
                    >
                      {year.year}
                    </p>

                    <p
                      className="
                        mt-1
                        text-xs
                        text-muted-foreground
                      "
                    >
                      {formatVisits(
                        year.visits
                      )}
                    </p>
                  </div>

                  <p
                    className="
                      text-sm
                      font-semibold
                      tabular-nums
                      text-foreground
                    "
                  >
                    {year.progress}%
                  </p>
                </div>

                <div
                  className="
                    mt-3
                    h-2.5
                    overflow-hidden
                    rounded-full
                    bg-muted
                  "
                >
                  <div
                    className="
                      h-full
                      rounded-full
                      bg-linear-to-r
                      from-secondary
                      via-success
                      to-accent
                      transition-[width]
                      duration-700
                      ease-out
                    "
                    style={{
                      width: `${year.progress}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <aside
            className="
              rounded-[1.5rem]
              border border-border/45
              bg-background/45
              p-5
            "
          >
            <p
              className="
                text-[0.6875rem]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-muted-foreground
              "
            >
              Journey Insight
            </p>

            <p
              className="
                mt-3
                text-3xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
              "
            >
              {journey.reduce(
                (total, year) =>
                  total + year.visits,
                0
              )}
            </p>

            <p
              className="
                mt-1
                text-sm
                text-muted-foreground
              "
            >
              Total Visits
            </p>

            <div
              className="
                mt-5
                border-t
                border-border/45
                pt-5
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-sm
                  font-medium
                  text-foreground
                "
              >
                <ArrowUpRight
                  className="size-4"
                  strokeWidth={1.8}
                />

                年間の変化
              </div>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                {journey.length === 1
                  ? "最初のサウナイヤーが始まりました。これからの記録がここに積み重なります。"
                  : growth > 0
                    ? `最初の年より、最新年は${growth}回多くサウナを訪れています。`
                    : growth < 0
                      ? `最新年は最初の年より${Math.abs(
                          growth
                        )}回少ないペースです。`
                      : "最初の年と最新年は、同じ訪問回数です。"}
              </p>
            </div>
          </aside>
        </div>
      )}
    </section>
  );
}
