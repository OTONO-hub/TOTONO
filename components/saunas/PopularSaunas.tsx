import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  MapPin,
  Medal,
  MessageCircle,
} from "lucide-react";

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
    <section
      className="
        overflow-hidden
        rounded-[2rem]
        border border-black/5
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          flex flex-col
          justify-between gap-4
          border-b border-black/5
          px-6 py-6
          sm:flex-row sm:items-end
          sm:px-8
        "
      >
        <div>
          <div
            className="
              inline-flex items-center gap-2
              rounded-full
              bg-[#fdd000]/20
              px-3 py-1.5
              text-xs font-semibold
              text-[#3e3a3a]
            "
          >
            <Flame className="size-3.5" />
            Popular Sauna
          </div>

          <h2
            className="
              mt-4 text-2xl
              font-semibold tracking-tight
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            人気のサウナ施設
          </h2>

          <p
            className="
              mt-2 text-sm leading-6
              text-[#3e3a3a]/55
            "
          >
            TOTONOでサ活投稿の多い施設を紹介します。
          </p>
        </div>

        <p
          className="
            text-xs leading-5
            text-[#3e3a3a]/45
          "
        >
          投稿数をもとに集計
        </p>
      </div>

      <ol className="divide-y divide-black/5">
        {saunas.map((sauna, index) => {
          const rank = index + 1;

          const locationText = [
            sauna.prefecture,
            sauna.city,
          ]
            .filter(Boolean)
            .join(" ");

          return (
            <li key={sauna.id}>
              <Link
                href={`/saunas/${sauna.id}`}
                className="
                  group grid gap-4
                  px-6 py-5
                  transition
                  hover:bg-[#e6e5ef]/35
                  sm:grid-cols-[auto_96px_1fr_auto]
                  sm:items-center
                  sm:px-8
                "
              >
                <div className="flex items-center gap-4 sm:contents">
                  <RankBadge rank={rank} />

                  <div
                    className="
                      relative size-20
                      shrink-0 overflow-hidden
                      rounded-2xl
                      bg-[#e6e5ef]
                      sm:size-24
                    "
                  >
                    {sauna.image_url ? (
                      <Image
                        src={sauna.image_url}
                        alt={`${sauna.name}の施設画像`}
                        fill
                        sizes="96px"
                        className="
                          object-cover
                          transition duration-500
                          group-hover:scale-105
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex h-full
                          items-center justify-center
                          px-2 text-center
                        "
                      >
                        <span
                          className="
                            text-[10px] font-semibold
                            tracking-[0.18em]
                            text-[#3e3a3a]/35
                          "
                        >
                          TOTONO
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="min-w-0">
                  <p
                    className="
                      truncate text-lg
                      font-semibold
                      text-[#3e3a3a]
                    "
                  >
                    {sauna.name}
                  </p>

                  {locationText && (
                    <p
                      className="
                        mt-2 flex items-center
                        gap-1.5 text-sm
                        text-[#3e3a3a]/55
                      "
                    >
                      <MapPin className="size-3.5 shrink-0" />
                      <span className="truncate">
                        {locationText}
                      </span>
                    </p>
                  )}

                  <p
                    className="
                      mt-3 inline-flex
                      items-center gap-1.5
                      text-sm font-medium
                      text-[#3e3a3a]/70
                    "
                  >
                    <MessageCircle className="size-4" />
                    {sauna.post_count}件のサ活
                  </p>
                </div>

                <span
                  className="
                    hidden size-10
                    items-center justify-center
                    rounded-full
                    border border-[#3e3a3a]/10
                    text-[#3e3a3a]/55
                    transition
                    group-hover:border-[#3e3a3a]
                    group-hover:bg-[#3e3a3a]
                    group-hover:text-white
                    sm:flex
                  "
                  aria-hidden="true"
                >
                  <ArrowUpRight className="size-4" />
                </span>
              </Link>
            </li>
          );
        })}
      </ol>
    </section>
  );
}

type RankBadgeProps = {
  rank: number;
};

function RankBadge({ rank }: RankBadgeProps) {
  if (rank === 1) {
    return (
      <span
        className="
          flex size-11 shrink-0
          items-center justify-center
          rounded-full
          bg-[#fdd000]
          text-[#3e3a3a]
          shadow-sm
        "
        aria-label="1位"
      >
        <Medal className="size-5" />
      </span>
    );
  }

  if (rank === 2) {
    return (
      <span
        className="
          flex size-11 shrink-0
          items-center justify-center
          rounded-full
          bg-[#ced7dc]
          text-[#3e3a3a]
          shadow-sm
        "
        aria-label="2位"
      >
        <span className="text-sm font-bold">
          2
        </span>
      </span>
    );
  }

  if (rank === 3) {
    return (
      <span
        className="
          flex size-11 shrink-0
          items-center justify-center
          rounded-full
          bg-[#e7c5a8]
          text-[#3e3a3a]
          shadow-sm
        "
        aria-label="3位"
      >
        <span className="text-sm font-bold">
          3
        </span>
      </span>
    );
  }

  return (
    <span
      className="
        flex size-11 shrink-0
        items-center justify-center
        rounded-full
        bg-[#e6e5ef]
        text-sm font-bold
        text-[#3e3a3a]
      "
      aria-label={`${rank}位`}
    >
      {rank}
    </span>
  );
}