import type { ReactNode } from "react";

import { HomeCommunitySection } from "@/components/home/HomeCommunitySection";
import {
  AlternativeRecommendationsSection,
  HomePopularSaunasSection,
} from "@/components/home/HomeDiscoverySections";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeQuickActionsSection } from "@/components/home/HomeQuickActionsSection";
import { HomeSaunaLifeSection } from "@/components/home/HomeSaunaLifeSection";
import { HomeSummarySection } from "@/components/home/HomeSummarySection";
import { TodayHeroSection } from "@/components/home/TodayHeroSection";
import { TodayJourneyCard } from "@/components/home/TodayJourneyCard";
import { TodayJourneyHistory } from "@/components/home/TodayJourneyHistory";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { TodayActions } from "@/components/today/TodayActions";
import { TodayChecklist } from "@/components/today/TodayChecklist";
import { TodayCrowdCard } from "@/components/today/TodayCrowdCard";
import { TodayMealCard } from "@/components/today/TodayMealCard";
import { TodaySaunaCard } from "@/components/today/TodaySaunaCard";
import { TodayTimeline } from "@/components/today/TodayTimeline";
import { TodayWeather } from "@/components/today/TodayWeather";
import type { DashboardData } from "@/types/dashboard";

type HomePresenterProps = {
  userId: string;
  todayLabel: string;
  dashboard: DashboardData;
  mobileNavigation?: ReactNode;
};

export function HomePresenter({
  userId,
  todayLabel,
  dashboard,
  mobileNavigation,
}: HomePresenterProps) {
  return (
    <HomeExperience
      mobileNavigation={mobileNavigation}
      hero={
        <FadeIn
          duration="slow"
          distance="subtle"
          direction="up"
        >
          <TodayHeroSection
            todayLabel={todayLabel}
            greeting={
              dashboard.heroMessage.greeting
            }
            heading={
              dashboard.heroMessage.heading
            }
            description={
              dashboard.heroMessage.description
            }
            summary={dashboard.summary}
            sauna={dashboard.todayPick}
            reason={
              dashboard.todayPickReason
            }
          />
        </FadeIn>
      }
      todaySauna={
        <div
          role="group"
          aria-label="今日のサウナプラン"
          className="
            space-y-6
            sm:space-y-8
          "
        >
          <ScrollReveal
            duration="slow"
            distance="subtle"
          >
            <TodayJourneyCard />
          </ScrollReveal>

          <ScrollReveal
            delay={40}
            duration="slow"
            distance="subtle"
          >
            <TodaySaunaCard />
          </ScrollReveal>

          <ScrollReveal
            delay={80}
            duration="slow"
            distance="subtle"
          >
            <TodayJourneyHistory />
          </ScrollReveal>
        </div>
      }
      todayChecklist={
        <ScrollReveal
          duration="normal"
          distance="subtle"
        >
          <TodayChecklist />
        </ScrollReveal>
      }
      todayActions={
        <ScrollReveal
          delay={40}
          duration="normal"
          distance="subtle"
        >
          <TodayActions />
        </ScrollReveal>
      }
      todayTimeline={
        <ScrollReveal
          duration="slow"
          distance="normal"
        >
          <TodayTimeline />
        </ScrollReveal>
      }
      todayWeather={
        <ScrollReveal
          duration="normal"
          distance="subtle"
        >
          <TodayWeather />
        </ScrollReveal>
      }
      todayCrowd={
        <ScrollReveal
          delay={40}
          duration="normal"
          distance="subtle"
        >
          <TodayCrowdCard />
        </ScrollReveal>
      }
      todayMeal={
        <ScrollReveal
          delay={80}
          duration="normal"
          distance="subtle"
        >
          <TodayMealCard />
        </ScrollReveal>
      }
      quickActions={
        <ScrollReveal
          duration="normal"
          distance="subtle"
        >
          <HomeQuickActionsSection />
        </ScrollReveal>
      }
      recommendations={
        <ScrollReveal
          duration="slow"
          distance="normal"
        >
          <AlternativeRecommendationsSection
            saunas={
              dashboard.recommendations
            }
            preferredPrefecture={
              dashboard.preferredPrefecture
            }
          />
        </ScrollReveal>
      }
      popularSaunas={
        <ScrollReveal
          duration="slow"
          distance="normal"
        >
          <HomePopularSaunasSection
            saunas={
              dashboard.popularSaunas
            }
          />
        </ScrollReveal>
      }
      saunaLife={
        <div
          role="group"
          aria-label="サウナライフの記録と振り返り"
          className="
            space-y-6
            sm:space-y-8
          "
        >
          <ScrollReveal
            duration="slow"
            distance="normal"
          >
            <HomeSummarySection
              summary={dashboard.summary}
            />
          </ScrollReveal>

          <ScrollReveal
            delay={60}
            duration="slow"
            distance="normal"
          >
            <HomeSaunaLifeSection
              userId={userId}
              posts={dashboard.myPosts}
            />
          </ScrollReveal>
        </div>
      }
      friendsActivity={
        <ScrollReveal
          duration="slow"
          distance="normal"
        >
          <HomeCommunitySection
            posts={
              dashboard.friendsActivityPosts
            }
          />
        </ScrollReveal>
      }
    />
  );
}
