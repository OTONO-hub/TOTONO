import { Sparkles } from "lucide-react";

import { SaunaMetricCard } from "@/components/saunas/sauna-metric-card";
import { TotonoCard } from "@/components/ui/totono-card";
import { TotonoSectionHeader } from "@/components/ui/totono-section-header";
import type { RecommendedSauna } from "@/services/recommendations";

export type RecommendedSaunasProps = {
  saunas: RecommendedSauna[];
  preferredPrefecture: string | null;
};

export function RecommendedSaunas({
  saunas,
  preferredPrefecture,
}: RecommendedSaunasProps) {
  if (saunas.length === 0) {
    return null;
  }

  const description = preferredPrefecture
    ? `${preferredPrefecture}の人気施設を中心に、評価4.5以上の施設を優先して選びました。`
    : "全国の人気施設から、評価4.5以上の施設を優先して選びました。";

  const priorityLabel = preferredPrefecture
    ? `${preferredPrefecture}・高評価を優先`
    : "高評価施設を優先";

  return (
    <TotonoCard
      as="section"
      padding="none"
      radius="2xl"
      className="
        w-full
        bg-card/90
        backdrop-blur-md
        sm:rounded-[2.5rem]
      "
      aria-label="あなたへのおすすめサウナ施設"
    >
      <div className="border-b border-border/45 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
        <TotonoSectionHeader
          eyebrow="For You"
          eyebrowIcon={
            <Sparkles
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
          eyebrowTone="secondary"
          title="あなたへのおすすめ"
          description={description}
          titleAs="h2"
          size="md"
          action={
            <div
              className="
                inline-flex
                w-fit
                shrink-0
                items-center
                rounded-full
                bg-muted/70
                px-4
                py-2.5
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              {priorityLabel}
            </div>
          }
        />
      </div>

      <div className="grid gap-4 p-5 sm:p-8 md:grid-cols-2 lg:grid-cols-3 lg:p-10">
        {saunas.map((sauna) => {
          const locationText = [
            sauna.prefecture,
            sauna.city,
          ]
            .filter(
              (value): value is string =>
                typeof value === "string" &&
                value.trim().length > 0
            )
            .map((value) => value.trim())
            .join(" ");

          return (
            <SaunaMetricCard
              key={sauna.id}
              saunaId={sauna.id}
              name={sauna.name}
              imageUrl={sauna.image_url}
              location={locationText}
              averageRating={sauna.average_rating}
              ratingCount={sauna.rating_count}
              favoriteCount={sauna.favorite_count}
              postCount={sauna.post_count}
              badge="おすすめ"
              reason={
                sauna.recommendation_reason ??
                "TOTONOで注目されている人気施設"
              }
            />
          );
        })}
      </div>
    </TotonoCard>
  );
}
