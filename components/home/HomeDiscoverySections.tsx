import {
  Search,
  Sparkles,
} from "lucide-react";

import { DashboardContainer } from "@/components/home/dashboard-container";
import { AppButton } from "@/components/ui/app-button";
import { DashboardSection } from "@/components/home/dashboard-section";
import { DashboardState } from "@/components/home/dashboard-state";
import { HomeSectionReveal } from "@/components/home/HomeSectionReveal";
import { RecommendedSaunas } from "@/components/home/RecommendedSaunas";
import { PopularSaunas } from "@/components/saunas/PopularSaunas";
import type { RecommendedSauna } from "@/services/recommendations";
import type { PopularSauna } from "@/services/saunas";

type HomeSearchActionProps = {
  label: string;
};

type AlternativeRecommendationsSectionProps = {
  saunas: RecommendedSauna[];
  preferredPrefecture: string | null;
};

type HomePopularSaunasSectionProps = {
  saunas: PopularSauna[];
};

function HomeSearchAction({
  label,
}: HomeSearchActionProps) {
  return (
    <AppButton
      href="/search"
      leadingIcon={
        <Search
          className="size-4"
          strokeWidth={1.8}
        />
      }
    >
      {label}
    </AppButton>
  );
}

export function AlternativeRecommendationsSection({
  saunas,
  preferredPrefecture,
}: AlternativeRecommendationsSectionProps) {
  return (
    <DashboardContainer>
      {saunas.length > 0 ? (
        <HomeSectionReveal>
          <RecommendedSaunas
            saunas={saunas}
            preferredPrefecture={
              preferredPrefecture
            }
          />
        </HomeSectionReveal>
      ) : (
        <DashboardSection
          eyebrow="More for You"
          title="ほかの候補を探す"
          description="今日の一軒以外にも、あなたに合う施設を少しずつ増やしていきます。"
          variant="soft"
        >
          <DashboardState
            title="ほかの候補を準備しています"
            description="気になる施設の保存やサ活の記録が増えると、今日の一軒とは異なる候補も提案できるようになります。"
            icon={
              <Sparkles
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            action={
              <HomeSearchAction label="ほかの施設を探す" />
            }
          />
        </DashboardSection>
      )}
    </DashboardContainer>
  );
}

export function HomePopularSaunasSection({
  saunas,
}: HomePopularSaunasSectionProps) {
  return (
    <DashboardContainer>
      {saunas.length > 0 ? (
        <HomeSectionReveal>
          <PopularSaunas
            saunas={saunas}
          />
        </HomeSectionReveal>
      ) : (
        <DashboardSection
          eyebrow="Trending Saunas"
          title="人気のサウナ施設"
          description="おすすめとは異なる、TOTONOで注目されている施設を紹介します。"
          variant="soft"
        >
          <DashboardState
            title="新しい人気施設を集計しています"
            description="おすすめ以外の人気施設が増えると、まだ見ていない候補がここに表示されます。"
            icon={
              <Sparkles
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            action={
              <HomeSearchAction label="人気施設を探す" />
            }
          />
        </DashboardSection>
      )}
    </DashboardContainer>
  );
}
