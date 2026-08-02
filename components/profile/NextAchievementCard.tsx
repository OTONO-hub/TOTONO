import type { LucideIcon } from "lucide-react";
import {
  Compass,
  Flame,
  Heart,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import type {
  NextAchievement,
  NextAchievementType,
} from "@/lib/profile-next-achievement";

type NextAchievementCardProps = {
  achievement: NextAchievement;
};

type AchievementVisual = {
  icon: LucideIcon;
  eyebrow: string;
  supportingText: string;
};

const ACHIEVEMENT_VISUALS: Record<
  NextAchievementType,
  AchievementVisual
> = {
  "first-steam": {
    icon: Flame,
    eyebrow: "BEGIN YOUR JOURNEY",
    supportingText:
      "最初の記録から、あなたのサウナジャーニーが始まります。",
  },

  "sauna-lover": {
    icon: Heart,
    eyebrow: "KEEP YOUR RHYTHM",
    supportingText:
      "サ活を重ねるたびに、サウナのある時間が日常へ育っていきます。",
  },

  explorer: {
    icon: Compass,
    eyebrow: "FIND A NEW PLACE",
    supportingText:
      "新しい施設との出会いが、あなたのサウナ体験を広げます。",
  },

  perfection: {
    icon: Star,
    eyebrow: "A PERFECT MOMENT",
    supportingText:
      "心から満足できたサ活を、評価と一緒に記録してみましょう。",
  },

  completed: {
    icon: Trophy,
    eyebrow: "ALL ACHIEVEMENTS UNLOCKED",
    supportingText:
      "これまで積み重ねたサ活が、すべての実績につながりました。",
  },
};

/**
 * 単位と現在値に応じて、
 * 表示用の単位を返します。
 */
function formatUnit(
  unit: string,
  current: number
): string {
  if (unit === "visits" && current === 1) {
    return "visit";
  }

  if (
    unit === "saunas" &&
    current === 1
  ) {
    return "sauna";
  }

  if (
    unit === "achievements" &&
    current === 1
  ) {
    return "achievement";
  }

  return unit;
}

export function NextAchievementCard({
  achievement,
}: NextAchievementCardProps) {
  const visual =
    ACHIEVEMENT_VISUALS[
      achievement.type
    ];

  const AchievementIcon = visual.icon;

  const progress = Math.max(
    0,
    Math.min(
      achievement.progress,
      100
    )
  );

  const displayUnit = formatUnit(
    achievement.unit,
    achievement.current
  );

  if (achievement.isCompleted) {
    return (
      <section
        aria-labelledby="next-achievement-heading"
        className="
          relative
          mt-8
          overflow-hidden
          rounded-[2rem]
          border border-success/20
          bg-card/90
          shadow-sm
          backdrop-blur-md
          sm:mt-10
        "
      >
        {/* 背景装飾 */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            size-72
            rounded-full
            bg-success/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-20
            -left-16
            size-56
            rounded-full
            bg-accent/12
            blur-3xl
          "
        />

        <div
          className="
            relative
            grid
            gap-7
            px-6
            py-8
            sm:px-8
            sm:py-10
            lg:grid-cols-[minmax(0,1fr)_15rem]
            lg:items-center
            lg:gap-10
          "
        >
          <div className="min-w-0">
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border border-success/20
                bg-success/8
                px-3
                py-1.5
                text-[0.68rem]
                font-semibold
                uppercase
                tracking-[0.14em]
                text-foreground/75
              "
            >
              <Sparkles
                className="size-3.5"
                strokeWidth={1.8}
              />

              Achievement Complete
            </div>

            <p
              className="
                mt-6
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-muted-foreground
              "
            >
              {visual.eyebrow}
            </p>

            <h2
              id="next-achievement-heading"
              className="
                mt-3
                max-w-2xl
                wrap-break-word
                text-3xl
                font-semibold
                tracking-[-0.045em]
                text-foreground
                sm:text-4xl
              "
            >
              {achievement.name}
            </h2>

            <p
              className="
                mt-2
                text-sm
                font-medium
                tracking-[0.06em]
                text-muted-foreground
              "
            >
              {achievement.englishName}
            </p>

            <p
              className="
                mt-5
                max-w-2xl
                text-sm
                leading-7
                text-foreground/80
                sm:text-base
                sm:leading-8
              "
            >
              {achievement.description}
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
              rounded-[1.75rem]
              border border-success/20
              bg-success/8
              p-5
              sm:p-6
              lg:flex-col
              lg:items-start
            "
          >
            <div
              className="
                flex
                size-14
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-success/15
                text-foreground
              "
            >
              <AchievementIcon
                className="size-7"
                strokeWidth={1.6}
              />
            </div>

            <div className="min-w-0">
              <p
                className="
                  text-[0.6875rem]
                  font-semibold
                  uppercase
                  tracking-[0.12em]
                  text-muted-foreground
                "
              >
                Journey complete
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-foreground/75
                  lg:mt-3
                  lg:leading-7
                "
              >
                {visual.supportingText}
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="next-achievement-heading"
      className="
        relative
        mt-8
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:mt-10
      "
    >
      {/* 背景装飾 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          size-72
          rounded-full
          bg-accent/14
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-16
          size-56
          rounded-full
          bg-secondary/18
          blur-3xl
        "
      />

      <div
        className="
          relative
          grid
          gap-7
          px-6
          py-8
          sm:px-8
          sm:py-10
          lg:grid-cols-[minmax(0,1fr)_17rem]
          lg:items-stretch
          lg:gap-9
        "
      >
        {/* 実績情報 */}
        <div className="min-w-0">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/45
              bg-background/60
              px-3
              py-1.5
              text-[0.68rem]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-muted-foreground
            "
          >
            <Sparkles
              className="size-3.5"
              strokeWidth={1.8}
            />

            Next Achievement
          </div>

          <p
            className="
              mt-6
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-muted-foreground
            "
          >
            {visual.eyebrow}
          </p>

          <h2
            id="next-achievement-heading"
            className="
              mt-3
              wrap-break-word
              text-3xl
              font-semibold
              tracking-[-0.045em]
              text-foreground
              sm:text-4xl
            "
          >
            {achievement.name}
          </h2>

          <p
            className="
              mt-2
              text-sm
              font-medium
              tracking-[0.08em]
              text-muted-foreground
            "
          >
            {achievement.englishName}
          </p>

          <p
            className="
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-foreground/80
              sm:text-base
              sm:leading-8
            "
          >
            {achievement.description}
          </p>

          {/* 進捗 */}
          <div
            className="
              mt-6
              rounded-[1.5rem]
              border border-border/45
              bg-background/55
              px-4
              py-5
              sm:px-5
            "
          >
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
                    text-[0.6875rem]
                    font-semibold
                    uppercase
                    tracking-[0.12em]
                    text-muted-foreground
                  "
                >
                  Progress
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    font-medium
                    tabular-nums
                    text-foreground
                  "
                >
                  {achievement.current}
                  {" / "}
                  {achievement.target}
                  {" "}
                  {displayUnit}
                </p>
              </div>

              <p
                className="
                  text-2xl
                  font-semibold
                  tabular-nums
                  tracking-[-0.04em]
                  text-foreground
                "
              >
                {progress}%
              </p>
            </div>

            <div
              className="
                mt-4
                h-2.5
                overflow-hidden
                rounded-full
                bg-muted
              "
              role="progressbar"
              aria-label={`${achievement.name}の進捗`}
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={progress}
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-accent
                  transition-[width]
                  duration-500
                  ease-out
                "
                style={{
                  width: `${progress}%`,
                }}
              />
            </div>

            <p
              className="
                mt-3
                text-xs
                leading-5
                text-muted-foreground
              "
            >
              解除まであと
              <span
                className="
                  mx-1
                  font-semibold
                  tabular-nums
                  text-foreground
                "
              >
                {achievement.remaining}
              </span>
              ステップ
            </p>
          </div>
        </div>

        {/* 補助情報 */}
        <div
          className="
            flex
            items-center
            gap-4
            rounded-[1.75rem]
            border border-border/50
            bg-background/55
            p-5
            sm:p-6
            lg:flex-col
            lg:items-start
            lg:justify-between
          "
        >
          <div
            className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-secondary/25
              text-foreground
            "
          >
            <AchievementIcon
              className="size-7"
              strokeWidth={1.6}
            />
          </div>

          <div className="min-w-0 lg:mt-10">
            <p
              className="
                text-[0.6875rem]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-muted-foreground
              "
            >
              Your next step
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-foreground/75
                lg:mt-3
                lg:leading-7
              "
            >
              {visual.supportingText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
