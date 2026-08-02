import type {
  TodayPageData,
  TodayUser,
} from "@/types/today";

import { PageSection } from "@/components/ui/page-section";

import { TodayRecommendationSection } from "./recommendation/today-recommendation-section";
import { RecentActivitiesSection } from "./recent-activities/recent-activities-section";
import { RecordSaunaActivityCta } from "./record-sauna-activity-cta";
import { SavedSaunasSection } from "./saved-saunas/saved-saunas-section";
import { TodayGreeting } from "./today-greeting";

type TodayPageProps = {
  user: TodayUser;
  data: TodayPageData;
};

export function TodayPage({
  user,
  data,
}: TodayPageProps) {
  return (
    <main
      className="
        min-h-screen
        bg-background
        pb-28
        text-foreground
        sm:pb-24
        lg:pb-32
      "
    >
      <PageSection
        width="wide"
        className="
          pb-10
          pt-8
          sm:pt-12
          lg:pb-16
          lg:pt-14
        "
      >
        <header
          className="
            border-b
            border-border/45
            pb-8
            sm:pb-10
          "
        >
          <TodayGreeting
            username={user.username}
          />
        </header>

        <div
          className="
            mt-10
            space-y-16
            sm:mt-14
            sm:space-y-20
            lg:mt-16
            lg:space-y-24
          "
        >
          <TodayRecommendationSection
            recommendation={
              data.recommendation
            }
          />

          <SavedSaunasSection
            saunas={data.savedSaunas}
          />

          <RecentActivitiesSection
            activities={
              data.recentActivities
            }
          />

          <RecordSaunaActivityCta />
        </div>
      </PageSection>
    </main>
  );
}

