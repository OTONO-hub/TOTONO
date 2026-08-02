import {
  BarChart3,
  Sparkles,
} from "lucide-react";

import { AchievementBadges } from "@/components/profile/AchievementBadges";
import { AchievementCard } from "@/components/profile/AchievementCard";
import { AnnualSaunaReport } from "@/components/profile/AnnualSaunaReport";
import { BestSaunaCard } from "@/components/profile/BestSaunaCard";
import { JourneyCard } from "@/components/profile/JourneyCard";
import { MonthlyActivityChart } from "@/components/profile/MonthlyActivityChart";
import { NextAchievementCard } from "@/components/profile/NextAchievementCard";
import { SaunaPersonaCard } from "@/components/profile/SaunaPersonaCard";
import { SaunaRhythmCard } from "@/components/profile/SaunaRhythmCard";
import { SaunaStreakCard } from "@/components/profile/SaunaStreakCard";
import { TopVisitedSaunas } from "@/components/profile/TopVisitedSaunas";
import { XpStatusCard } from "@/components/profile/XpStatusCard";
import { calculateBestSaunaOfYear } from "@/lib/profile-best-sauna";
import { calculateNextAchievement } from "@/lib/profile-next-achievement";
import { calculateSaunaJourney } from "@/lib/profile-journey";
import { calculateSaunaPersona } from "@/lib/profile-persona";
import { calculateSaunaRhythm } from "@/lib/profile-rhythm";
import { calculateSaunaStreak } from "@/lib/profile-streak";
import { getPosts } from "@/services/posts";
import { getProfileInsights } from "@/services/profile-insights";
import { calculateSaunaXp } from "@/services/profile-xp";

type JournalInsightsProps = {
  posts: Awaited<ReturnType<typeof getPosts>>;
};

export function JournalInsights({
  posts,
}: JournalInsightsProps) {
  const profileInsights =
    getProfileInsights(posts);

  const saunaJourney =
    calculateSaunaJourney(posts);

  const bestSauna =
    calculateBestSaunaOfYear(posts);

  const saunaRhythm =
    calculateSaunaRhythm(posts);

  const saunaStreak =
    calculateSaunaStreak(posts);

  const saunaPersona =
    calculateSaunaPersona(posts);

  const nextAchievement =
    calculateNextAchievement(
      profileInsights
    );

  const visitedSaunaCount = new Set(
    posts
      .map((post) =>
        post.sauna_name.trim()
      )
      .filter(Boolean)
  ).size;

  const totalSetCount = posts.reduce(
    (total, post) =>
      total + (post.set_count ?? 0),
    0
  );

  const xp = calculateSaunaXp({
    visitCount: posts.length,
    visitedSaunaCount,
    totalSetCount,
  });

  if (posts.length === 0) {
    return (
      <section
        aria-labelledby="journal-insights-heading"
        className="
          overflow-hidden
          rounded-[2rem]
          border border-border/55
          bg-card/90
          px-6
          py-14
          text-center
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
          sm:px-10
          sm:py-16
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
            bg-secondary/20
            text-foreground
          "
        >
          <BarChart3
            className="size-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <p
          className="
            mt-6
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
            text-muted-foreground
          "
        >
          Sauna Insights
        </p>

        <h2
          id="journal-insights-heading"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.035em]
            text-foreground
            sm:text-3xl
          "
        >
          分析するサ活がまだありません
        </h2>

        <p
          className="
            mx-auto
            mt-4
            max-w-lg
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          サ活を記録すると、訪問リズムやお気に入り施設、
          ストリーク、年間レポートなどがここに表示されます。
        </p>
      </section>
    );
  }

  return (
    <section
      aria-labelledby="journal-insights-heading"
      className="space-y-6 sm:space-y-8"
    >
      <div
        className="
          relative
          overflow-hidden
          rounded-[2rem]
          border border-border/55
          bg-card/90
          px-6
          py-8
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
          sm:px-8
          sm:py-10
          lg:px-10
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute -right-20 -top-20
            size-64
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div className="relative">
          <div
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-accent/20
              text-foreground
            "
          >
            <Sparkles
              className="size-5"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <p
            className="
              mt-6
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Sauna Insights
          </p>

          <h2
            id="journal-insights-heading"
            className="
              mt-3
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
              lg:text-4xl
            "
          >
            サウナライフを深く知る
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            これまでの訪問記録から、サウナのリズム、
            好み、成長、次の目標を振り返ります。
          </p>
        </div>
      </div>

      <AnnualSaunaReport
        report={profileInsights.annualReport}
      />

      <BestSaunaCard
        bestSauna={bestSauna}
      />

      <JourneyCard
        journey={saunaJourney}
      />

      <SaunaRhythmCard
        rhythm={saunaRhythm}
      />

      <SaunaStreakCard
        streak={saunaStreak}
      />

      <SaunaPersonaCard
        persona={saunaPersona}
      />

      <NextAchievementCard
        achievement={nextAchievement}
      />

      <AchievementCard
        report={profileInsights.annualReport}
      />

      <XpStatusCard xp={xp} />

      <MonthlyActivityChart
        activities={
          profileInsights.monthlyActivities
        }
      />

      <TopVisitedSaunas
        saunas={
          profileInsights.topVisitedSaunas
        }
      />

      <AchievementBadges
        insights={profileInsights}
      />
    </section>
  );
}