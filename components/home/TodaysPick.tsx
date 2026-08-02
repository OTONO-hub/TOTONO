import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ImageIcon,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

import type { RecommendedSauna } from "@/services/recommendations";

type TodaysPickProps = {
  sauna: RecommendedSauna | null;
};

function createLocationText(
  prefecture: string | null,
  city: string | null
): string {
  const location = [prefecture, city]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .map((value) => value.trim())
    .join(" ");

  return location || "エリア情報なし";
}

export function TodaysPick({
  sauna,
}: TodaysPickProps) {
  if (!sauna) {
    return null;
  }

  const locationText = createLocationText(
    sauna.prefecture,
    sauna.city
  );

  const ratingText =
    sauna.average_rating !== null
      ? sauna.average_rating.toFixed(1)
      : "未評価";

  return (
    <section
      aria-labelledby="todays-pick-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          grid
          lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)]
        "
      >
        <Link
          href={`/saunas/${sauna.id}`}
          className="
            group
            relative
            block
            min-h-64
            overflow-hidden
            bg-muted/50
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-inset
            focus-visible:ring-ring
            sm:min-h-80
            lg:min-h-full
          "
        >
          {sauna.image_url ? (
            <>
              <Image
                src={sauna.image_url}
                alt={`${sauna.name}の施設画像`}
                fill
                sizes="
                  (max-width: 1023px) 100vw,
                  55vw
                "
                className="
                  object-cover
                  transition-transform
                  duration-500
                  group-hover:scale-[1.03]
                  motion-reduce:transition-none
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  inset-0
                  bg-gradient-to-t
                  from-black/40
                  via-black/5
                  to-transparent
                "
              />
            </>
          ) : (
            <div
              className="
                flex
                h-full
                min-h-64
                items-center
                justify-center
                sm:min-h-80
              "
            >
              <div className="text-center">
                <ImageIcon
                  className="
                    mx-auto
                    size-8
                    text-muted-foreground
                  "
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <p
                  className="
                    mt-3
                    text-sm
                    font-medium
                    text-muted-foreground
                  "
                >
                  施設画像は準備中です
                </p>
              </div>
            </div>
          )}

          <span
            className="
              absolute
              left-5
              top-5
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-white/40
              bg-white/85
              px-3
              py-1.5
              text-xs
              font-semibold
              text-foreground
              shadow-sm
              backdrop-blur-md
            "
          >
            <Sparkles
              className="size-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Today&apos;s Pick
          </span>
        </Link>

        <div
          className="
            flex
            flex-col
            justify-center
            px-5
            py-8
            sm:px-8
            sm:py-10
            lg:px-10
            lg:py-12
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.25em]
              text-muted-foreground
            "
          >
            Recommended for You
          </p>

          <h2
            id="todays-pick-heading"
            className="
              mt-4
              text-3xl
              font-semibold
              tracking-[-0.045em]
              text-foreground
              sm:text-4xl
            "
          >
            {sauna.name}
          </h2>

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-3
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-semibold
                text-foreground
              "
            >
              <Star
                className="
                  size-4
                  fill-accent
                  text-accent
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {ratingText}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-sm
                text-muted-foreground
              "
            >
              <MapPin
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />

              {locationText}
            </span>
          </div>

          <div
            className="
              mt-6
              rounded-2xl
              border border-secondary/30
              bg-secondary/10
              px-4
              py-4
            "
          >
            <p
              className="
                text-xs
                font-semibold
                text-foreground
              "
            >
              おすすめの理由
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              {sauna.recommendation_reason ??
                "TOTONOで注目されている人気施設です。"}
            </p>
          </div>

          <Link
            href={`/saunas/${sauna.id}`}
            className="
              mt-7
              inline-flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-primary
              px-6
              text-sm
              font-semibold
              text-primary-foreground
              shadow-sm
              transition
              duration-200
              hover:-translate-y-0.5
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-card
              active:translate-y-0
              sm:w-fit
            "
          >
            施設の詳細を見る

            <ArrowRight
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </section>
  );
}
