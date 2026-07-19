import type { ComponentProps } from "react";
import { Building2 } from "lucide-react";

import { EmptyResultMessage } from "@/components/search/EmptyResultMessage";
import { ResultSectionHeader } from "@/components/search/ResultSectionHeader";
import { SaunaSearchCard } from "@/components/search/SaunaSearchCard";

type SaunaSearchCardProps =
  ComponentProps<typeof SaunaSearchCard>;

type Sauna =
  SaunaSearchCardProps["sauna"];

type SaunaMetrics = Pick<
  SaunaSearchCardProps,
  | "postCount"
  | "favoriteCount"
  | "averageRating"
  | "ratingCount"
>;

type SaunaMetricsById = Record<
  string,
  SaunaMetrics | undefined
>;

type SaunaSearchResultsProps = {
  query: string;
  saunas: Sauna[];
  saunaMetrics: SaunaMetricsById;
};

export function SaunaSearchResults({
  query,
  saunas,
  saunaMetrics,
}: SaunaSearchResultsProps) {
  return (
    <section
      aria-labelledby="sauna-results-heading"
    >
      <ResultSectionHeader
        id="sauna-results-heading"
        icon={
          <Building2
            className="size-4.5"
            strokeWidth={1.8}
          />
        }
        eyebrow="Sauna Facilities"
        title="サウナ施設"
        count={saunas.length}
      />

      {saunas.length === 0 ? (
        <EmptyResultMessage>
          「{query}」に一致するサウナ施設は
          見つかりませんでした。
        </EmptyResultMessage>
      ) : (
        <div
          className="
            mt-8
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-3
          "
        >
          {saunas.map((sauna) => {
            const metrics =
              saunaMetrics[sauna.id];

            return (
              <SaunaSearchCard
                key={sauna.id}
                sauna={sauna}
                postCount={
                  metrics?.postCount ?? 0
                }
                favoriteCount={
                  metrics?.favoriteCount ?? 0
                }
                averageRating={
                  metrics?.averageRating ?? null
                }
                ratingCount={
                  metrics?.ratingCount ?? 0
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}
