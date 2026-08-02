import { Flame, Trophy } from "lucide-react";

import { SaunaMetricCard } from "@/components/saunas/sauna-metric-card";
import { TotonoCard } from "@/components/ui/totono-card";
import { TotonoSectionHeader } from "@/components/ui/totono-section-header";
import type { PopularSauna } from "@/services/saunas";

type PopularSaunasProps = {
  saunas: PopularSauna[];
};

export function PopularSaunas({
  saunas,
}: PopularSaunasProps) {
  if (saunas.length === 0) {
    return null;
  }

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
      aria-label="人気のサウナ施設"
    >
      <div className="border-b border-border/45 px-5 py-7 sm:px-8 sm:py-8 lg:px-10">
        <TotonoSectionHeader
          eyebrow="Trending Saunas"
          eyebrowIcon={
            <Flame
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
          eyebrowTone="accent"
          title="人気のサウナ施設"
          description="投稿・お気に入り・利用者評価をもとに、TOTONOで注目されている施設を紹介します。"
          titleAs="h2"
          size="md"
          action={
            <div
              className="
                inline-flex
                w-fit
                shrink-0
                items-center
                gap-2
                rounded-full
                bg-muted/70
                px-4
                py-2.5
                text-xs
                font-medium
                text-muted-foreground
              "
            >
              <Trophy
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span>総合人気順</span>
            </div>
          }
        />
      </div>

      <div className="grid gap-4 p-5 sm:p-8 md:grid-cols-2 lg:grid-cols-3 lg:p-10">
        {saunas.map((sauna, index) => {
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
            <div
              key={sauna.id}
              className="relative min-w-0"
            >
              <span
                className="
                  absolute
                  -left-2
                  -top-2
                  z-20
                  inline-flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-white/40
                  bg-foreground
                  text-xs
                  font-semibold
                  tabular-nums
                  text-background
                  shadow-md
                "
                aria-label={`人気順位${index + 1}位`}
              >
                {index + 1}
              </span>

              <SaunaMetricCard
                saunaId={sauna.id}
                name={sauna.name}
                imageUrl={sauna.image_url}
                location={locationText}
                averageRating={sauna.average_rating}
                ratingCount={sauna.rating_count}
                favoriteCount={sauna.favorite_count}
                postCount={sauna.post_count}
                badge="人気"
                reason="TOTONOの投稿・保存・評価から選ばれた注目施設"
              />
            </div>
          );
        })}
      </div>
    </TotonoCard>
  );
}