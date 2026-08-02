import Link from "next/link";
import {
  ArrowUpRight,
  Crown,
  MapPin,
  Medal,
  Sparkles,
} from "lucide-react";

import type { TopVisitedSauna } from "@/services/profile-insights";

type TopVisitedSaunasProps = {
  saunas: TopVisitedSauna[];
};

function getRankIcon(rank: number) {
  if (rank === 1) {
    return (
      <Crown
        className="size-4"
        strokeWidth={1.8}
      />
    );
  }

  if (rank === 2) {
    return (
      <Medal
        className="size-4"
        strokeWidth={1.8}
      />
    );
  }

  return (
    <Sparkles
      className="size-4"
      strokeWidth={1.8}
    />
  );
}

function getRankLabel(rank: number): string {
  if (rank === 1) {
    return "1st";
  }

  if (rank === 2) {
    return "2nd";
  }

  return "3rd";
}

export function TopVisitedSaunas({
  saunas,
}: TopVisitedSaunasProps) {
  return (
    <section
      className="
        mt-10
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:mt-12
      "
    >
      <div
        className="
          flex flex-col
          gap-4
          border-b border-border/45
          px-6 py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
        "
      >
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-accent/20
              px-3 py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-foreground
            "
          >
            <Crown
              className="size-3.5"
              strokeWidth={1.8}
            />

            Home Sauna
          </div>

          <h2
            className="
              mt-4
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
              sm:text-2xl
            "
          >
            よく行く施設
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-6
              text-muted-foreground
            "
          >
            これまでのサ活から、訪問回数が多い施設を表示しています。
          </p>
        </div>

        {saunas.length > 0 && (
          <p
            className="
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            訪問回数 TOP3
          </p>
        )}
      </div>

      <div className="px-5 py-5 sm:px-8 sm:py-7">
        {saunas.length === 0 ? (
          <div
            className="
              rounded-2xl
              border border-dashed
              border-border/70
              bg-muted/30
              px-5 py-10
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                size-12
                items-center
                justify-center
                rounded-full
                bg-secondary/25
                text-foreground
              "
            >
              <MapPin
                className="size-5"
                strokeWidth={1.7}
              />
            </div>

            <h3
              className="
                mt-5
                text-base
                font-semibold
                text-foreground
              "
            >
              よく行く施設はまだありません
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              サ活を記録すると、訪問回数が多い施設がここに表示されます。
            </p>
          </div>
        ) : (
          <ol className="space-y-3">
            {saunas.map((sauna, index) => {
              const rank = index + 1;

              const content = (
                <>
                  <div
                    className="
                      flex
                      min-w-0
                      items-center
                      gap-4
                    "
                  >
                    <div
                      className={`
                        flex
                        size-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        ${
                          rank === 1
                            ? "bg-accent/25 text-foreground"
                            : rank === 2
                              ? "bg-secondary/25 text-foreground"
                              : "bg-muted text-muted-foreground"
                        }
                      `}
                    >
                      {getRankIcon(rank)}
                    </div>

                    <div className="min-w-0">
                      <div
                        className="
                          flex
                          items-center
                          gap-2
                        "
                      >
                        <span
                          className="
                            text-[0.625rem]
                            font-semibold
                            uppercase
                            tracking-[0.18em]
                            text-muted-foreground
                          "
                        >
                          {getRankLabel(rank)}
                        </span>

                        {rank === 1 && (
                          <span
                            className="
                              rounded-full
                              bg-accent/20
                              px-2 py-0.5
                              text-[0.625rem]
                              font-semibold
                              text-foreground
                            "
                          >
                            HOME
                          </span>
                        )}
                      </div>

                      <p
                        className="
                          mt-1
                          truncate
                          text-sm
                          font-semibold
                          text-foreground
                          sm:text-base
                        "
                      >
                        {sauna.saunaName}
                      </p>
                    </div>
                  </div>

                  <div
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-3
                    "
                  >
                    <div className="text-right">
                      <p
                        className="
                          text-lg
                          font-semibold
                          tabular-nums
                          text-foreground
                        "
                      >
                        {sauna.visitCount}
                        <span
                          className="
                            ml-1
                            text-xs
                            font-normal
                            text-muted-foreground
                          "
                        >
                          回
                        </span>
                      </p>

                      <p
                        className="
                          text-[0.625rem]
                          text-muted-foreground
                        "
                      >
                        visits
                      </p>
                    </div>

                    {sauna.saunaId && (
                      <ArrowUpRight
                        className="
                          size-4
                          text-muted-foreground
                          transition-transform
                          group-hover:-translate-y-0.5
                          group-hover:translate-x-0.5
                        "
                        strokeWidth={1.8}
                      />
                    )}
                  </div>
                </>
              );

              return (
                <li key={`${sauna.saunaId ?? sauna.saunaName}-${rank}`}>
                  {sauna.saunaId ? (
                    <Link
                      href={`/saunas/${sauna.saunaId}`}
                      className="
                        group
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border border-border/50
                        bg-background/45
                        px-4 py-4
                        transition
                        hover:-translate-y-0.5
                        hover:border-border
                        hover:bg-background/70
                        hover:shadow-sm
                        sm:px-5
                      "
                    >
                      {content}
                    </Link>
                  ) : (
                    <div
                      className="
                        flex
                        items-center
                        justify-between
                        gap-4
                        rounded-2xl
                        border border-border/50
                        bg-background/45
                        px-4 py-4
                        sm:px-5
                      "
                    >
                      {content}
                    </div>
                  )}
                </li>
              );
            })}
          </ol>
        )}
      </div>
    </section>
  );
}
