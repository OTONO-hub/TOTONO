import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Bookmark,
  MapPin,
  Waves,
} from "lucide-react";

import type { TodaySavedSauna } from "@/types/today";

type SavedSaunaCardProps = {
  sauna: TodaySavedSauna;
};

export function SavedSaunaCard({
  sauna,
}: SavedSaunaCardProps) {
  return (
    <article
      className="
        group
        relative
        flex
        h-full
        flex-col
        overflow-hidden
        rounded-[1.5rem]
        border
        border-black/5
        bg-white
        transition
        duration-300
        hover:-translate-y-0.5
        hover:border-black/10
        hover:shadow-[0_18px_50px_rgba(62,58,58,0.07)]
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      <div
        className="
          relative
          aspect-[4/3]
          overflow-hidden
          bg-[#e6e5ef]
        "
      >
        {sauna.imageUrl ? (
          <Image
            src={sauna.imageUrl}
            alt={`${sauna.saunaName}の施設写真`}
            fill
            sizes="
              (max-width: 640px) 80vw,
              (max-width: 1024px) 50vw,
              33vw
            "
            className="
              object-cover
              transition-transform
              duration-500
              group-hover:scale-[1.02]
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          />
        ) : (
          <div
            className="
              flex
              h-full
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div>
              <div
                className="
                  mx-auto
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-full
                  bg-white/70
                "
              >
                <Waves
                  aria-hidden="true"
                  className="h-5 w-5 text-[#3e3a3a]/55"
                />
              </div>

              <p
                className="
                  mt-4
                  text-sm
                  font-medium
                  text-[#3e3a3a]/55
                "
              >
                {sauna.saunaName}
              </p>
            </div>
          </div>
        )}

        <div className="absolute right-3 top-3">
          <div
            aria-label={`${sauna.saunaName}は保存済みです`}
            className="
              flex
              h-10
              w-10
              items-center
              justify-center
              rounded-full
              border
              border-white/50
              bg-white/90
              text-[#3e3a3a]
              shadow-sm
              backdrop-blur
            "
          >
            <Bookmark
              aria-hidden="true"
              className="h-[18px] w-[18px]"
              fill="currentColor"
            />
          </div>
        </div>
      </div>

      <div
        className="
          flex
          flex-1
          flex-col
          px-5
          pb-5
          pt-5
        "
      >
        <h3
          className="
            text-lg
            font-medium
            leading-snug
            tracking-[-0.02em]
            text-[#3e3a3a]
          "
        >
          {sauna.saunaName}
        </h3>

        {sauna.area && (
          <div
            className="
              mt-2
              flex
              items-center
              gap-1.5
              text-sm
              text-[#3e3a3a]/55
            "
          >
            <MapPin
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0"
            />

            <span>{sauna.area}</span>
          </div>
        )}

        <div className="mt-auto pt-5">
          <Link
            href={sauna.detailHref}
            className="
              inline-flex
              items-center
              gap-1.5
              text-sm
              font-medium
              text-[#3e3a3a]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#fdd000]
              focus-visible:ring-offset-2
            "
          >
            保存したサ活を見る

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
    </article>
  );
}
