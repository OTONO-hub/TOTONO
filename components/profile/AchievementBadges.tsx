import {
  BadgeCheck,
  Flame,
  LockKeyhole,
  Map as MapIcon,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { cn } from "@/lib/utils";
import type { ProfileInsights } from "@/services/profile-insights";

type AchievementBadgesProps = {
  insights: ProfileInsights;
};

export function AchievementBadges({
  insights,
}: AchievementBadgesProps) {
  const {
    hasFirstSteam,
    hasSaunaLover,
    hasExplorer,
    hasPerfection,
    saunaLoverRemaining,
    explorerRemaining,
  } = insights;

  const achievements = [
    {
      key: "first-steam",
      englishName: "First Steam",
      name: "はじめての整い",
      description:
        "最初のサ活を記録すると獲得できます。",
      achieved: hasFirstSteam,
      lockedText: "あと1投稿",
      icon: Sparkles,
      achievedClassName:
        "border-accent/35 bg-accent/10",
      glowClassName: "bg-accent/25",
      iconClassName:
        "bg-accent/25 text-foreground",
    },
    {
      key: "sauna-lover",
      englishName: "Sauna Lover",
      name: "サウナ愛好家",
      description:
        "サ活を10回記録すると獲得できます。",
      achieved: hasSaunaLover,
      lockedText:
        `あと${saunaLoverRemaining}投稿`,
      icon: Flame,
      achievedClassName:
        "border-accent/35 bg-accent/10",
      glowClassName: "bg-accent/25",
      iconClassName:
        "bg-accent/25 text-foreground",
    },
    {
      key: "explorer",
      englishName: "Explorer",
      name: "サウナ探訪者",
      description:
        "5つの異なる施設を記録すると獲得できます。",
      achieved: hasExplorer,
      lockedText:
        `あと${explorerRemaining}施設`,
      icon: MapIcon,
      achievedClassName:
        "border-secondary/45 bg-secondary/10",
      glowClassName: "bg-secondary/30",
      iconClassName:
        "bg-secondary/30 text-foreground",
    },
    {
      key: "perfection",
      englishName: "Perfection",
      name: "至高の整い",
      description:
        "評価5.0のサ活を記録すると獲得できます。",
      achieved: hasPerfection,
      lockedText: "未達成",
      icon: Star,
      achievedClassName:
        "border-secondary/45 bg-secondary/10",
      glowClassName: "bg-secondary/30",
      iconClassName:
        "bg-secondary/30 text-foreground",
    },
  ];

  return (
    <section
      aria-labelledby="achievements-heading"
      className="mt-8 sm:mt-10"
    >
      <div
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
            flex
            flex-col
            gap-4
            border-b border-border/45
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
            <div className="flex items-center gap-3">
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
                <Trophy
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
                Achievements
              </p>
            </div>

            <h2
              id="achievements-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-3xl
              "
            >
              サ活の実績
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
            記録を重ねるほど、新しいバッジが解放されます。
            次の整いを目指してみましょう。
          </p>
        </div>

        <div
          className="
            grid
            gap-4
            p-5
            sm:grid-cols-2
            sm:p-8
            lg:grid-cols-4
            lg:p-10
          "
        >
          {achievements.map(
            ({
              key,
              englishName,
              name,
              description,
              achieved,
              lockedText,
              icon: Icon,
              achievedClassName,
              glowClassName,
              iconClassName,
            }) => (
              <article
                key={key}
                className={cn(
                  `
                    relative
                    overflow-hidden
                    rounded-[1.75rem]
                    border
                    p-5
                    transition-transform
                    duration-300
                    sm:p-6
                  `,
                  achieved
                    ? `${achievedClassName} hover:-translate-y-1`
                    : `
                        border-border/50
                        bg-background/35
                      `
                )}
              >
                <div
                  aria-hidden="true"
                  className={cn(
                    `
                      absolute
                      -right-8
                      -top-8
                      size-24
                      rounded-full
                      blur-2xl
                    `,
                    achieved
                      ? glowClassName
                      : "bg-muted/60"
                  )}
                />

                <div
                  className={cn(
                    `
                      relative
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-2xl
                    `,
                    achieved
                      ? iconClassName
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Icon
                    className="size-5"
                    strokeWidth={1.8}
                  />
                </div>

                <p
                  className="
                    relative
                    mt-5
                    text-[0.6875rem]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-muted-foreground
                  "
                >
                  {englishName}
                </p>

                <h3
                  className="
                    relative
                    mt-2
                    text-lg
                    font-semibold
                    tracking-[-0.025em]
                    text-foreground
                  "
                >
                  {name}
                </h3>

                <p
                  className="
                    relative
                    mt-3
                    min-h-12
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  {description}
                </p>

                <div
                  className={cn(
                    `
                      relative
                      mt-5
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      px-3
                      py-1.5
                      text-xs
                      font-semibold
                    `,
                    achieved
                      ? "bg-success/15 text-success"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  {achieved ? (
                    <>
                      <BadgeCheck
                        className="size-3.5"
                        strokeWidth={2}
                      />
                      達成済み
                    </>
                  ) : (
                    <>
                      <LockKeyhole
                        className="size-3.5"
                        strokeWidth={1.8}
                      />
                      {lockedText}
                    </>
                  )}
                </div>
              </article>
            )
          )}
        </div>
      </div>
    </section>
  );
}
