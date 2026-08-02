import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  MapPin,
  Sparkles,
} from "lucide-react";

import type { TodayRecommendation } from "@/types/today";

type TodayRecommendationCardProps = {
  recommendation: TodayRecommendation;
};

export function TodayRecommendationCard({
  recommendation,
}: TodayRecommendationCardProps) {
  return (
    <article
      className="
        overflow-hidden
        rounded-[1.75rem]
        border
        border-black/[0.06]
        bg-white
        shadow-[0_18px_60px_rgba(62,58,58,0.07)]
      "
    >
      <div className="grid lg:grid-cols-[1.08fr_0.92fr]">
        <div
          className="
            relative
            aspect-[4/3]
            overflow-hidden
            bg-[#e6e5ef]
            lg:aspect-auto
            lg:min-h-[480px]
          "
        >
          {recommendation.imageUrl ? (
            <Image
              src={recommendation.imageUrl}
              alt={`${recommendation.saunaName}の施設写真`}
              fill
              priority
              sizes="
                (max-width: 1024px) 100vw,
                55vw
              "
              className="
                object-cover
                transition-transform
                duration-700
                hover:scale-[1.02]
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                min-h-[290px]
                items-center
                justify-center
                px-8
                text-center
                lg:min-h-[480px]
              "
            >
              <div>
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-white/70
                    shadow-sm
                  "
                >
                  <Sparkles
                    aria-hidden="true"
                    className="h-6 w-6 text-[#3e3a3a]/55"
                  />
                </div>

                <p
                  className="
                    mt-5
                    text-sm
                    font-medium
                    text-[#3e3a3a]/55
                  "
                >
                  {recommendation.saunaName}
                </p>
              </div>
            </div>
          )}

          <div className="absolute right-4 top-4">
            <button
              type="button"
              aria-label={
                recommendation.isBookmarked
                  ? `${recommendation.saunaName}の保存を解除する`
                  : `${recommendation.saunaName}を保存する`
              }
              className="
                flex
                h-11
                w-11
                items-center
                justify-center
                rounded-full
                border
                border-white/60
                bg-white/90
                text-[#3e3a3a]
                shadow-sm
                backdrop-blur
                transition-transform
                duration-200
                hover:scale-105
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#fdd000]
                focus-visible:ring-offset-2
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            >
              <Bookmark
                aria-hidden="true"
                className="h-5 w-5"
                fill={
                  recommendation.isBookmarked
                    ? "currentColor"
                    : "none"
                }
              />
            </button>
          </div>
        </div>

        <div
          className="
            flex
            flex-col
            justify-center
            px-6
            py-8
            sm:px-8
            sm:py-10
            lg:px-12
            lg:py-14
          "
        >
          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              bg-[#fdd000]/20
              px-3
              py-1.5
              text-xs
              font-medium
              text-[#3e3a3a]
            "
          >
            <Sparkles
              aria-hidden="true"
              className="h-3.5 w-3.5"
            />

            あなたへの提案
          </div>

          <h3
            className="
              mt-6
              text-[2rem]
              font-medium
              leading-tight
              tracking-[-0.04em]
              text-[#3e3a3a]
              sm:text-[2.5rem]
            "
          >
            {recommendation.saunaName}
          </h3>

          {recommendation.area && (
            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-sm
                text-[#3e3a3a]/55
              "
            >
              <MapPin
                aria-hidden="true"
                className="h-4 w-4 shrink-0"
              />

              <span>{recommendation.area}</span>
            </div>
          )}

          <p
            className="
              mt-7
              max-w-md
              border-l-2
              border-[#fdd000]
              pl-4
              text-sm
              leading-7
              text-[#3e3a3a]/65
              sm:text-base
              sm:leading-8
            "
          >
            {recommendation.reason}
          </p>

          {recommendation.tags.length > 0 && (
            <ul
              aria-label="施設の特徴"
              className="
                mt-7
                flex
                flex-wrap
                gap-2
              "
            >
              {recommendation.tags
                .slice(0, 3)
                .map((tag) => (
                  <li
                    key={tag}
                    className="
                      rounded-full
                      bg-[#3e3a3a]/[0.05]
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-[#3e3a3a]/65
                    "
                  >
                    {tag}
                  </li>
                ))}
            </ul>
          )}

          <div className="mt-9">
            <Link
              href={`/saunas/${recommendation.saunaId}`}
              className="
                group
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#3e3a3a]
                px-6
                text-sm
                font-medium
                text-white
                transition
                duration-300
                hover:-translate-y-0.5
                hover:bg-[#2f2c2c]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#fdd000]
                focus-visible:ring-offset-2
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            >
              この施設を見る

              <ArrowUpRight
                aria-hidden="true"
                className="
                  h-4
                  w-4
                  transition-transform
                  duration-300
                  group-hover:translate-x-0.5
                  group-hover:-translate-y-0.5
                  motion-reduce:transform-none
                  motion-reduce:transition-none
                "
              />
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
}
