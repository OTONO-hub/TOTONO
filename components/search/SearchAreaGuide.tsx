import Link from "next/link";
import {
  ArrowRight,
  MapPinned,
} from "lucide-react";

import type { SaunaArea } from "@/constants/areas";

type SearchAreaGuideProps = {
  area: SaunaArea;
};

export function SearchAreaGuide({
  area,
}: SearchAreaGuideProps) {
  return (
    <section
      aria-labelledby="search-area-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/60
        bg-card
        shadow-sm
      "
    >
      <div
        className="
          border-b border-border/50
          px-5 py-6
          sm:px-8
          sm:py-8
        "
      >
        <div
          className="
            inline-flex
            items-center
            gap-2
            rounded-full
            bg-secondary/15
            px-3
            py-1.5
            text-xs
            font-semibold
            text-foreground
          "
        >
          <MapPinned
            className="size-4"
            strokeWidth={1.8}
          />

          Area Search
        </div>

        <h2
          id="search-area-heading"
          className="
            mt-5
            text-2xl
            font-semibold
            tracking-[-0.03em]
            text-foreground
            sm:text-3xl
          "
        >
          {area.name}のサウナを探す
        </h2>

        <p
          className="
            mt-3
            max-w-2xl
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
            sm:leading-8
          "
        >
          都道府県を選択して、
          気になるサウナ施設やサ活の記録を
          探してみましょう。
        </p>
      </div>

      <div
        className="
          grid
          gap-3
          p-5
          sm:grid-cols-2
          sm:p-8
          lg:grid-cols-3
        "
      >
        {area.prefectures.map(
          (prefecture) => (
            <Link
              key={prefecture}
              href={`/search?q=${encodeURIComponent(
                prefecture
              )}`}
              aria-label={`${prefecture}のサウナ施設を探す`}
              className="
                group
                flex
                min-h-16
                items-center
                justify-between
                gap-4
                rounded-2xl
                border border-border/60
                bg-background
                px-5
                py-4
                transition
                duration-200
                hover:-translate-y-0.5
                hover:border-foreground/15
                hover:bg-card
                hover:shadow-sm
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                active:translate-y-0
              "
            >
              <span
                className="
                  text-sm
                  font-semibold
                  text-foreground
                  sm:text-base
                "
              >
                {prefecture}
              </span>

              <span
                className="
                  flex
                  size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/15
                  text-foreground
                  transition
                  duration-200
                  group-hover:translate-x-0.5
                  group-hover:bg-secondary/25
                "
              >
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                />
              </span>
            </Link>
          )
        )}
      </div>
    </section>
  );
}
