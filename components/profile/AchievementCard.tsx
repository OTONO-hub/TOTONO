import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  Crown,
  Flame,
  MapPin,
  Medal,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { AchievementCardImageButton } from "@/components/profile/AchievementCardImageButton";
import type { AnnualSaunaReport } from "@/services/profile-insights";

type AchievementCardProps = {
  report: AnnualSaunaReport;
};

type AchievementLevel = {
  name: string;
  label: string;
  description: string;
  textClassName: string;
  badgeClassName: string;
  icon: ReactNode;
};

type AchievementStatProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function getAchievementLevel(
  visitCount: number
): AchievementLevel {
  if (visitCount >= 100) {
    return {
      name: "Master",
      label: "SAUNA MASTER",
      description:
        "一年を通してサウナを極めた、TOTONO最高クラスのサウナーです。",
      textClassName:
        "bg-gradient-to-r from-[#fdd000] via-white to-[#9fd9f6] bg-clip-text text-transparent",
      badgeClassName:
        "border-[#fdd000]/30 bg-gradient-to-r from-[#fdd000]/20 to-[#9fd9f6]/20 text-white",
      icon: (
        <Crown
          className="size-4"
          strokeWidth={1.8}
        />
      ),
    };
  }

  if (visitCount >= 60) {
    return {
      name: "Gold",
      label: "GOLD SAUNER",
      description:
        "日常の中にサウナが深く根づいた、上級サウナーです。",
      textClassName: "text-[#fdd000]",
      badgeClassName:
        "border-[#fdd000]/30 bg-[#fdd000]/15 text-[#fdd000]",
      icon: (
        <Trophy
          className="size-4"
          strokeWidth={1.8}
        />
      ),
    };
  }

  if (visitCount >= 30) {
    return {
      name: "Silver",
      label: "SILVER SAUNER",
      description:
        "継続的にサ活を楽しんでいる、経験豊富なサウナーです。",
      textClassName: "text-[#d9dde3]",
      badgeClassName:
        "border-white/20 bg-white/10 text-[#e8ebef]",
      icon: (
        <Medal
          className="size-4"
          strokeWidth={1.8}
        />
      ),
    };
  }

  if (visitCount >= 10) {
    return {
      name: "Bronze",
      label: "BRONZE SAUNER",
      description:
        "サウナの楽しみ方が少しずつ広がり始めています。",
      textClassName: "text-[#d49a6a]",
      badgeClassName:
        "border-[#d49a6a]/30 bg-[#d49a6a]/15 text-[#e3ab7b]",
      icon: (
        <Medal
          className="size-4"
          strokeWidth={1.8}
        />
      ),
    };
  }

  return {
    name: "Beginner",
    label: "SAUNA BEGINNER",
    description:
      "これから自分だけのサウナライフを育てていく段階です。",
    textClassName: "text-white/65",
    badgeClassName:
      "border-white/15 bg-white/8 text-white/65",
    icon: (
      <Sparkles
        className="size-4"
        strokeWidth={1.8}
      />
    ),
  };
}

function AchievementStat({
  icon,
  label,
  value,
}: AchievementStatProps) {
  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-white/6
        p-4
        backdrop-blur-sm
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-white/50
        "
      >
        {icon}

        <span
          className="
            text-[11px]
            font-semibold
            uppercase
            tracking-[0.12em]
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-4
          text-xl
          font-semibold
          tracking-[-0.04em]
          text-white
          sm:text-2xl
        "
      >
        {value}
      </p>
    </div>
  );
}

export function AchievementCard({
  report,
}: AchievementCardProps) {
  const level = getAchievementLevel(
    report.visitCount
  );

  const topSauna = report.topSauna;

  return (
    <div
      className="
        mt-10
        sm:mt-12
      "
    >
      <div
        className="
          mb-4
          flex
          justify-end
        "
      >
        <AchievementCardImageButton
          year={report.year}
        />
      </div>

      <section
        id="totono-achievement-card"
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          bg-[#302d2d]
          text-white
          shadow-xl
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-24
            -top-28
            size-80
            rounded-full
            bg-[#fdd000]/12
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            -bottom-28
            -left-24
            size-80
            rounded-full
            bg-[#9fd9f6]/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-x-0
            top-0
            h-px
            bg-gradient-to-r
            from-transparent
            via-white/25
            to-transparent
          "
        />

        <div
          className="
            relative
            px-6
            py-7
            sm:px-8
            sm:py-9
          "
        >
          <div
            className="
              flex
              flex-col
              gap-6
              sm:flex-row
              sm:items-start
              sm:justify-between
            "
          >
            <div>
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border border-white/10
                  bg-white/8
                  px-3
                  py-1.5
                  text-[11px]
                  font-semibold
                  uppercase
                  tracking-[0.18em]
                  text-white/70
                  backdrop-blur-sm
                "
              >
                <Flame
                  className="size-3.5"
                  strokeWidth={1.8}
                />

                TOTONO Achievement
              </div>

              <p
                className="
                  mt-6
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.3em]
                  text-white/35
                "
              >
                {report.year} Sauna Record
              </p>

              <h2
                className="
                  mt-2
                  text-2xl
                  font-semibold
                  tracking-[-0.05em]
                  text-white
                  sm:text-3xl
                "
              >
                SAUNA ACHIEVEMENT
              </h2>
            </div>

            <div
              className={`
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.14em]
                ${level.badgeClassName}
              `}
            >
              {level.icon}

              {level.label}
            </div>
          </div>

          <div
            className="
              mt-9
              rounded-[1.75rem]
              border border-white/10
              bg-black/10
              px-5
              py-7
              text-center
              backdrop-blur-sm
              sm:px-8
              sm:py-9
            "
          >
            <div
              className="
                mx-auto
                flex
                size-14
                items-center
                justify-center
                rounded-2xl
                border border-white/10
                bg-white/8
                text-[#fdd000]
              "
            >
              <Star
                className="size-6"
                strokeWidth={1.6}
              />
            </div>

            <p
              className="
                mt-5
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-white/40
              "
            >
              Current Level
            </p>

            <p
              className={`
                mt-2
                text-4xl
                font-semibold
                tracking-[-0.06em]
                sm:text-5xl
                ${level.textClassName}
              `}
            >
              {level.name}
            </p>

            <p
              className="
                mx-auto
                mt-4
                max-w-lg
                text-sm
                leading-6
                text-white/55
              "
            >
              {level.description}
            </p>
          </div>

          <div
            className="
              mt-4
              grid
              gap-3
              sm:grid-cols-3
            "
          >
            <AchievementStat
              icon={
                <Flame
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              label="Sauna Visits"
              value={`${report.visitCount}回`}
            />

            <AchievementStat
              icon={
                <MapPin
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              label="Visited Saunas"
              value={`${report.visitedSaunas}施設`}
            />

            <AchievementStat
              icon={
                <BarChart3
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              label="Total Sets"
              value={`${report.totalSets}セット`}
            />
          </div>

          <div
            className="
              mt-4
              rounded-2xl
              border border-white/10
              bg-white/6
              p-5
              backdrop-blur-sm
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-4
              "
            >
              <div className="min-w-0">
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-white/45
                  "
                >
                  <Trophy
                    className="size-4"
                    strokeWidth={1.8}
                  />

                  <span
                    className="
                      text-[11px]
                      font-semibold
                      uppercase
                      tracking-[0.14em]
                    "
                  >
                    Home Sauna
                  </span>
                </div>

                {topSauna ? (
                  <>
                    <p
                      className="
                        mt-4
                        truncate
                        text-lg
                        font-semibold
                        tracking-[-0.03em]
                        text-white
                      "
                    >
                      {topSauna.saunaName}
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-sm
                        text-white/50
                      "
                    >
                      {report.year}年に
                      {topSauna.visitCount}
                      回訪問
                    </p>
                  </>
                ) : (
                  <>
                    <p
                      className="
                        mt-4
                        text-lg
                        font-semibold
                        text-white/70
                      "
                    >
                      まだ登録されていません
                    </p>

                    <p
                      className="
                        mt-1.5
                        text-sm
                        text-white/45
                      "
                    >
                      サ活を記録するとホームサウナが表示されます
                    </p>
                  </>
                )}
              </div>

              {topSauna?.saunaId && (
                <Link
                  href={`/saunas/${topSauna.saunaId}`}
                  aria-label={`${topSauna.saunaName}の施設詳細を見る`}
                  className="
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    border border-white/10
                    bg-white/8
                    text-white/65
                    transition
                    hover:-translate-y-0.5
                    hover:bg-white/12
                    hover:text-white
                  "
                >
                  <ArrowUpRight
                    className="size-4"
                    strokeWidth={1.8}
                  />
                </Link>
              )}
            </div>
          </div>

          <div
            className="
              mt-7
              flex
              flex-col
              gap-2
              border-t
              border-white/10
              pt-5
              text-xs
              text-white/35
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <p
              className="
                font-semibold
                uppercase
                tracking-[0.22em]
              "
            >
              TOTONO
            </p>

            <p>
              サウナへ行く前から、整い始める。
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
