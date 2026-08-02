import type { ReactNode } from "react";

import { BackgroundGlow } from "@/components/ui/background-glow";

type HomeExperienceProps = {
  hero: ReactNode;
  todaySauna: ReactNode;
  todayChecklist: ReactNode;
  todayActions: ReactNode;
  todayTimeline: ReactNode;
  todayWeather: ReactNode;
  todayCrowd: ReactNode;
  todayMeal: ReactNode;
  quickActions: ReactNode;
  recommendations: ReactNode;
  popularSaunas: ReactNode;
  saunaLife: ReactNode;
  friendsActivity: ReactNode;
  mobileNavigation?: ReactNode;
};

type HomeExperienceSectionProps = {
  children: ReactNode;
  id?: string;
  ariaLabel: string;
  tone?: "default" | "soft";
  spacing?: "default" | "compact";
  isLast?: boolean;
  className?: string;
};

function HomeExperienceSection({
  children,
  id,
  ariaLabel,
  tone = "default",
  spacing = "default",
  isLast = false,
  className = "",
}: HomeExperienceSectionProps) {
  return (
    <section
      id={id}
      aria-label={ariaLabel}
      className={`
        relative
        isolate
        overflow-hidden
        ${
          isLast
            ? ""
            : `
              border-b
              border-border/40
            `
        }
        ${
          tone === "soft"
            ? "bg-muted/15"
            : "bg-background"
        }
        ${
          spacing === "compact"
            ? `
              py-10
              sm:py-14
              lg:py-16
            `
            : `
              py-14
              sm:py-18
              lg:py-22
            `
        }
        ${className}
      `}
    >
      {children}
    </section>
  );
}

export function HomeExperience({
  hero,
  todaySauna,
  todayChecklist,
  todayActions,
  todayTimeline,
  todayWeather,
  todayCrowd,
  todayMeal,
  quickActions,
  recommendations,
  popularSaunas,
  saunaLife,
  friendsActivity,
  mobileNavigation,
}: HomeExperienceProps) {
  return (
    <>
      <main
        className="
          min-h-screen
          overflow-x-hidden
          bg-background
          pb-24
          pt-20
          sm:pb-0
        "
      >
        {hero}

        <HomeExperienceSection
          id="home-today"
          ariaLabel="今日のサウナ体験"
          tone="soft"
          spacing="compact"
          className="
            scroll-mt-28
            sm:scroll-mt-32
          "
        >
          <BackgroundGlow
            position="top-right"
            tone="secondary"
            size="lg"
            className="
              -right-32
              -top-24
              size-80
            "
          />

          <BackgroundGlow
            position="bottom-left"
            tone="accent"
            size="lg"
            className="
              -bottom-36
              -left-32
              size-80
            "
          />

          <div
            className="
              relative
              z-10
              space-y-10
              sm:space-y-12
              lg:space-y-14
            "
          >
            {todaySauna}

            {todayChecklist}

            {todayActions}

            {todayTimeline}

            {todayWeather}

            {todayCrowd}

            {todayMeal}

            {quickActions}
          </div>
        </HomeExperienceSection>

        <HomeExperienceSection
          id="home-recommendations"
          ariaLabel="あなたへのおすすめ施設"
          className="
            scroll-mt-28
            sm:scroll-mt-32
          "
        >
          <BackgroundGlow
            position="top-right"
            tone="accent"
            size="lg"
            className="
              -right-32
              -top-24
              size-80
            "
          />

          <div className="relative z-10">
            {recommendations}
          </div>
        </HomeExperienceSection>

        <HomeExperienceSection
          id="home-popular-saunas"
          ariaLabel="人気のサウナ施設"
          tone="soft"
          className="
            scroll-mt-28
            sm:scroll-mt-32
          "
        >
          <BackgroundGlow
            position="top-left"
            tone="accent"
            size="lg"
            className="
              -left-32
              -top-24
              size-80
            "
          />

          <BackgroundGlow
            position="bottom-right"
            tone="secondary"
            size="lg"
            className="
              -bottom-36
              -right-32
              size-80
            "
          />

          <div className="relative z-10">
            {popularSaunas}
          </div>
        </HomeExperienceSection>

        <HomeExperienceSection
          id="home-sauna-life"
          ariaLabel="あなたのサウナライフ"
          className="
            scroll-mt-28
            sm:scroll-mt-32
          "
        >
          <BackgroundGlow
            position="top-right"
            tone="secondary"
            size="lg"
            className="
              -right-32
              -top-24
              size-80
            "
          />

          <BackgroundGlow
            position="bottom-left"
            tone="accent"
            size="lg"
            className="
              -bottom-36
              -left-32
              size-80
            "
          />

          <div className="relative z-10">
            {saunaLife}
          </div>
        </HomeExperienceSection>

        <HomeExperienceSection
          id="home-community"
          ariaLabel="サウナコミュニティ"
          tone="soft"
          isLast
          className="
            scroll-mt-28
            sm:scroll-mt-32
          "
        >
          <BackgroundGlow
            position="top-left"
            tone="secondary"
            size="lg"
            className="
              -left-32
              -top-24
              size-80
            "
          />

          <div className="relative z-10">
            {friendsActivity}
          </div>
        </HomeExperienceSection>
      </main>

      {mobileNavigation}
    </>
  );
}
