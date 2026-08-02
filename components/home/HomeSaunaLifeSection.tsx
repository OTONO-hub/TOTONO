import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import { SaunaStreak } from "@/components/home/SaunaStreak";
import { WeeklySaunaSummary } from "@/components/home/WeeklySaunaSummary";
import { FavoriteSaunasSection } from "@/components/profile/FavoriteSaunasSection";
import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";
import type { DashboardPost } from "@/types/dashboard";

type HomeSaunaLifeSectionProps = {
  userId: string;
  posts: DashboardPost[];
};

export function HomeSaunaLifeSection({
  userId,
  posts,
}: HomeSaunaLifeSectionProps) {
  return (
    <PageSection>
      <AppCard
        as="section"
        aria-label="サウナライフの詳細"
        variant="glass"
        radius="xl"
        padding="none"
        className="
          bg-card/45
          p-4
          sm:p-6
          lg:p-8
        "
      >
        <div
          className="
            grid
            gap-6
            lg:grid-cols-2
            lg:items-start
          "
        >
          <HomeSectionReveal>
            <WeeklySaunaSummary
              posts={posts}
            />
          </HomeSectionReveal>

          <HomeSectionReveal delay={40}>
            <SaunaStreak
              posts={posts}
            />
          </HomeSectionReveal>
        </div>

        <HomeSectionReveal
          className="
            mt-6
            scroll-mt-28
            sm:mt-8
            sm:scroll-mt-32
          "
          delay={60}
        >
          <div id="home-saved">
            <FavoriteSaunasSection
              userId={userId}
            />
          </div>
        </HomeSectionReveal>
      </AppCard>
    </PageSection>
  );
}
