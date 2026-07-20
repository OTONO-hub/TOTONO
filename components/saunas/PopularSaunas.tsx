import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Flame,
  ImageIcon,
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
      aria-labelledby="popular-saunas-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-white/70
        bg-white/85
        p-6
        shadow-[0_18px_60px_rgba(62,58,58,0.07)]
        backdrop-blur-xl
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-[#3e3a3a]/8
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-[#fdd000]/20
              bg-[#fdd000]/14
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#3e3a3a]
            "
          >
            <Flame
              className="size-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Popular Sauna
          </div>

          <h2
            id="popular-saunas-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            人気のサウナ施設
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            TOTONOに投稿されたサ活をもとに、
            今注目されている施設を紹介します。
          </p>
        </div>

        <div
          className="
            inline-flex
            w-fit
            items-center
            rounded-full
            bg-[#e6e5ef]/60
            px-4
            py-2.5
            text-xs
            font-medium
            text-[#3e3a3a]/55
          "
        >
          投稿数をもとに集計
        </div>
      </div>

      <ol
        aria-label="人気サウナ施設ランキング"
        className="
          mt-7
          grid
          gap-4
        "
      >
        {saunas.map((sauna, index) => {
          const rank = index + 1;

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
            <PopularSaunaItem
              key={sauna.id}
              sauna={sauna}
              rank={rank}
              locationText={locationText}
            />
          );
        })}
      </ol>

      <p
        className="
          mt-6
          text-xs
          leading-6
          text-[#3e3a3a]/42
        "
      >
        ※ ランキングはTOTONO内の投稿状況により変動します。
      </p>
    </section>
  );
}

type PopularSaunaItemProps = {
  sauna: PopularSauna;
  rank: number;
  locationText: string;
};

function PopularSaunaItem({
  sauna,
  rank,
  locationText,
}: PopularSaunaItemProps) {
  return (
    <li>
      <Link
        href={`/saunas/${sauna.id}`}
        aria-label={`${rank}位、${sauna.name}の施設詳細を見る。${sauna.post_count}件のサ活があります`}
        className="
          group
          grid
          min-w-0
          gap-4
          overflow-hidden
          rounded-[1.5rem]
          border
          border-[#3e3a3a]/7
          bg-white/80
          p-4
          shadow-[0_10px_28px_rgba(62,58,58,0.045)]
          transition-all
          duration-300
          ease-out
          hover:-translate-y-0.5
          hover:border-[#3e3a3a]/12
          hover:bg-white
          hover:shadow-[0_18px_38px_rgba(62,58,58,0.1)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
          sm:grid-cols-[auto_104px_minmax(0,1fr)_auto]
          sm:items-center
          sm:gap-5
          sm:p-5
          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-3
            sm:block
          "
        >
          <RankBadge rank={rank} />

          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-[#e6e5ef]/65
              px-3
              py-1.5
              text-xs
              font-semibold
              tabular-nums
              text-[#3e3a3a]/70
              sm:hidden
            "
          >
            <MessageCircle
              className="size-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {sauna.post_count}件
          </span>
        </div>

        <SaunaThumbnail
          imageUrl={sauna.image_url}
          saunaName={sauna.name}
        />

        <div className="min-w-0">
          <p
            className="
              break-words
              text-lg
              font-semibold
              tracking-[-0.02em]
              text-[#3e3a3a]
              sm:text-xl
            "
          >
            {sauna.name}
          </p>

          {locationText ? (
            <p
              className="
                mt-2
                flex
                min-w-0
                items-center
                gap-1.5
                text-sm
                text-[#3e3a3a]/55
              "
            >
              <MapPin
                className="size-3.5 shrink-0"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span className="truncate">
                {locationText}
              </span>
            </p>
          ) : (
            <p
              className="
                mt-2
                text-sm
                text-[#3e3a3a]/38
              "
            >
              所在地情報は未登録です
            </p>
          )}

          <div
            className="
              mt-4
              hidden
              w-fit
              items-center
              gap-1.5
              rounded-full
              border
              border-[#3e3a3a]/7
              bg-[#e6e5ef]/45
              px-3
              py-1.5
              text-sm
              font-medium
              tabular-nums
              text-[#3e3a3a]/70
              sm:inline-flex
            "
          >
            <MessageCircle
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {sauna.post_count}件のサ活
          </div>
        </div>

        <span
          className="
            hidden
            size-11
            shrink-0
            items-center
            justify-center
            rounded-full
            border
            border-[#3e3a3a]/10
            bg-white/70
            text-[#3e3a3a]/55
            shadow-sm
            transition-all
            duration-200
            group-hover:translate-x-0.5
            group-hover:border-[#3e3a3a]
            group-hover:bg-[#3e3a3a]
            group-hover:text-white
            sm:flex
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
          aria-hidden="true"
        >
          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
          />
        </span>

        <div
          className="
            flex
            items-center
            justify-end
            border-t
            border-[#3e3a3a]/7
            pt-4
            text-sm
            font-medium
            text-[#3e3a3a]
            sm:hidden
          "
        >
          施設を見る

          <ArrowRight
            className="
              ml-1.5
              size-4
              transition-transform
              duration-200
              group-hover:translate-x-1
              motion-reduce:transition-none
            "
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      </Link>
    </li>
  );
}

type SaunaThumbnailProps = {
  imageUrl: string | null;
  saunaName: string;
};

function SaunaThumbnail({
  imageUrl,
  saunaName,
}: SaunaThumbnailProps) {
  return (
    <div
      className="
        relative
        aspect-[16/10]
        w-full
        overflow-hidden
        rounded-[1.25rem]
        bg-[#e6e5ef]/70
        sm:aspect-square
        sm:size-[104px]
      "
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={`${saunaName}の施設画像`}
            fill
            sizes="
              (max-width: 639px) calc(100vw - 72px),
              104px
            "
            className="
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.04]
              motion-reduce:transition-none
            "
          />

          <div
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#3e3a3a]/16
              to-transparent
            "
            aria-hidden="true"
          />
        </>
      ) : (
        <div
          className="
            relative
            flex
            h-full
            items-center
            justify-center
            overflow-hidden
            bg-gradient-to-br
            from-[#e6e5ef]
            via-white
            to-[#9fd9f6]/20
            px-3
            text-center
          "
        >
          <div
            className="
              pointer-events-none
              absolute
              -right-7
              -top-7
              size-20
              rounded-full
              bg-[#9fd9f6]/30
              blur-2xl
            "
            aria-hidden="true"
          />

          <div className="relative z-10">
            <ImageIcon
              className="
                mx-auto
                size-5
                text-[#3e3a3a]/30
              "
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span
              className="
                mt-2
                block
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#3e3a3a]/35
              "
            >
              TOTONO
            </span>
          </div>
        </div>
      )}
    </div>
  );
}

type RankBadgeProps = {
  rank: number;
};

function RankBadge({
  rank,
}: RankBadgeProps) {
  if (rank === 1) {
    return (
      <span
        className="
          flex
          size-12
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          border-[#fdd000]/30
          bg-[#fdd000]
          text-[#3e3a3a]
          shadow-[0_8px_20px_rgba(253,208,0,0.22)]
        "
        aria-label="ランキング1位"
      >
        <Medal
          className="size-5"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>
    );
  }

  const rankStyle =
    rank === 2
      ? "border-[#ced7dc] bg-[#ced7dc]/80"
      : rank === 3
        ? "border-[#d8aa83]/25 bg-[#e7c5a8]/80"
        : "border-[#3e3a3a]/5 bg-[#e6e5ef]/70";

  return (
    <span
      className={`
        flex
        size-12
        shrink-0
        items-center
        justify-center
        rounded-full
        border
        text-sm
        font-bold
        tabular-nums
        text-[#3e3a3a]
        shadow-sm
        ${rankStyle}
      `}
      aria-label={`ランキング${rank}位`}
    >
      {rank}
    </span>
  );
}
