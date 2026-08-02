import Link from "next/link";
import { MapPinned } from "lucide-react";

import { TotonoCard } from "@/components/ui/totono-card";
import { TotonoSectionHeader } from "@/components/ui/totono-section-header";
import { SAUNA_AREAS } from "@/constants/areas";

export function AreaDiscovery() {
  return (
    <TotonoCard
      as="section"
      padding="none"
      className="w-full"
    >
      <div className="border-b border-border/50 px-6 py-8 sm:px-8">
        <TotonoSectionHeader
          eyebrow="エリア"
          eyebrowIcon={<MapPinned />}
          eyebrowTone="secondary"
          title="エリアから探す"
          description={
            <>
              サウナ旅行や出張先でも、自分に合った施設を
              見つけられます。
            </>
          }
          size="md"
        />
      </div>

      <div className="grid gap-4 p-6 sm:grid-cols-2 sm:p-8 lg:grid-cols-4">
        {SAUNA_AREAS.map((area) => (
          <TotonoCard
            key={area.id}
            as={Link}
            href={`/search?area=${area.id}`}
            variant="soft"
            radius="lg"
            padding="md"
            interactive
            className="
              group
              flex
              min-h-48
              flex-col
              justify-between
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring/50
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
            "
          >
            <div>
              <h3 className="text-lg font-semibold tracking-[-0.02em] text-foreground">
                {area.name}
              </h3>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {area.prefectures.length}都道府県
              </p>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              {area.prefectures
                .slice(0, 3)
                .map((prefecture) => (
                  <span
                    key={prefecture}
                    className="
                      rounded-full
                      bg-secondary/20
                      px-2.5
                      py-1
                      text-xs
                      font-medium
                      text-foreground
                      transition-colors
                      duration-200
                      group-hover:bg-secondary/30
                    "
                  >
                    {prefecture}
                  </span>
                ))}
            </div>
          </TotonoCard>
        ))}
      </div>
    </TotonoCard>
  );
}
