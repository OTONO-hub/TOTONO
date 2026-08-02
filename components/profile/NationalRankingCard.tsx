import {
  BarChart3,
  LockKeyhole,
  Trophy,
  Users,
} from "lucide-react";

import type { SaunaXpResult } from "@/services/profile-xp";

type Props = {
  xp: SaunaXpResult;
};

export function NationalRankingCard({
  xp,
}: Props) {
  return (
    <section
      aria-labelledby="national-ranking-heading"
      className="
        relative
        mt-6
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:mt-8
      "
    >
      {/* 背景装飾 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-20 -top-20
          size-56
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-24 -left-16
          size-52
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          grid
          gap-8
          px-6
          py-7
          sm:px-8
          sm:py-9
          lg:grid-cols-[minmax(0,1fr)_auto]
          lg:items-center
          lg:gap-12
        "
      >
        {/* 左側 */}
        <div>
          <div className="flex items-center gap-3">
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
              <Trophy
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
                  tracking-[0.22em]
                  text-muted-foreground
                "
              >
                National Ranking
              </p>

              <h2
                id="national-ranking-heading"
                className="
                  mt-1
                  text-xl
                  font-semibold
                  tracking-[-0.025em]
                  text-foreground
                  sm:text-2xl
                "
              >
                全国サウナランキング
              </h2>
            </div>
          </div>

          <p
            className="
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            TOTONOメンバーのサ活XPをもとにした
            全国ランキングを準備しています。
            サ活を記録しながら、ランキング公開をお待ちください。
          </p>

          <div
            className="
              mt-6
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/55
              bg-background/55
              px-4
              py-2
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            <LockKeyhole
              className="size-3.5"
              strokeWidth={1.8}
            />

            ランキング集計準備中
          </div>
        </div>

        {/* 右側 */}
        <div
          className="
            grid
            grid-cols-2
            overflow-hidden
            rounded-2xl
            border border-border/50
            bg-background/45
            lg:min-w-72
          "
        >
          <div
            className="
              px-5
              py-5
              text-center
              sm:px-7
              sm:py-6
            "
          >
            <div
              className="
                mx-auto
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-accent/15
                text-foreground
              "
            >
              <BarChart3
                className="size-4"
                strokeWidth={1.8}
              />
            </div>

            <p
              className="
                mt-3
                text-[0.6875rem]
                font-medium
                text-muted-foreground
              "
            >
              現在のXP
            </p>

            <p
              className="
                mt-1
                text-xl
                font-semibold
                tabular-nums
                text-foreground
              "
            >
              {xp.currentXp.toLocaleString("ja-JP")}
            </p>
          </div>

          <div
            className="
              border-l
              border-border/45
              px-5
              py-5
              text-center
              sm:px-7
              sm:py-6
            "
          >
            <div
              className="
                mx-auto
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <Users
                className="size-4"
                strokeWidth={1.8}
              />
            </div>

            <p
              className="
                mt-3
                text-[0.6875rem]
                font-medium
                text-muted-foreground
              "
            >
              現在のレベル
            </p>

            <p
              className="
                mt-1
                truncate
                text-base
                font-semibold
                text-foreground
                sm:text-lg
              "
            >
              {xp.level}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
