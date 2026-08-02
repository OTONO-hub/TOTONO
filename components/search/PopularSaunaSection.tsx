import type {
  ReactNode,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowUpRight,
  Flame,
  Heart,
  MapPin,
  Medal,
  MessageCircle,
  Star,
} from "lucide-react";

import type { PopularSauna } from "@/services/saunas";

type PopularSaunaSectionProps = {
  saunas: PopularSauna[];
  area?: string | null;
};

const RANK_LABELS = [
  "1st",
  "2nd",
  "3rd",
];

export function PopularSaunaSection({
  saunas,
  area,
}: PopularSaunaSectionProps) {
  if (saunas.length === 0) {
    return null;
  }

  const rankingTitle = area
    ? `${area}の人気サウナランキング`
    : "人気サウナランキング";

  const rankingDescription = area
    ? `${area}で投稿・お気に入り・評価を集めている施設を紹介します。`
    : "投稿・お気に入り・評価をもとに、TOTONOで注目されている施設を紹介します。";

  const rankingLabel = area
    ? "AREA RANKING"
    : "NATIONAL RANKING";

  return (
    <section
      aria-labelledby="popular-sauna-heading"
      className="
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          justify-between
          gap-5
          border-b
          border-border/50
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:px-7
          sm:py-7
        "
      >
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-accent/20
              px-3
              py-1.5
              text-xs
              font-semibold
              tracking-[0.08em]
              text-foreground
            "
          >
            <Flame
              className="size-3.5"
              strokeWidth={1.9}
              aria-hidden="true"
            />

            TRENDING
          </div>

          <h2
            id="popular-sauna-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            {rankingTitle}
          </h2>

          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            {rankingDescription}
          </p>
        </div>

        <p
          className="
            text-xs
            font-medium
            tracking-[0.08em]
            text-muted-foreground
          "
        >
          {rankingLabel}
        </p>
      </div>

      <div
        className="
          grid
          gap-4
          p-4
          sm:p-5
          lg:grid-cols-3
        "
      >
        {saunas.map(
          (sauna, index) => (
            <PopularSaunaCard
              key={sauna.id}
              sauna={sauna}
              rank={index + 1}
            />
          )
        )}
      </div>
    </section>
  );
}

type PopularSaunaCardProps = {
  sauna: PopularSauna;
  rank: number;
};

function PopularSaunaCard({
  sauna,
  rank,
}: PopularSaunaCardProps) {
  const location = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(
      (
        value
      ): value is string =>
        typeof value ===
          "string" &&
        value.trim().length > 0
    )
    .map((value) =>
      value.trim()
    )
    .join(" ");

  const averageRating =
    typeof sauna.average_rating ===
      "number"
      ? sauna.average_rating.toFixed(
          1
        )
      : "—";

  return (
    <Link
      href={`/saunas/${sauna.id}`}
      aria-label={`${rank}位 ${sauna.name}の施設詳細を見る`}
      className="
        group
        relative
        overflow-hidden
        rounded-[1.6rem]
        border
        border-border/55
        bg-background/65
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:border-primary/15
        hover:shadow-lg
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
      "
    >
      <div
        className="
          relative
          aspect-[16/10]
          overflow-hidden
          bg-muted
        "
      >
        {sauna.image_url ? (
          <Image
            src={sauna.image_url}
            alt={`${sauna.name}の施設画像`}
            fill
            sizes="
              (max-width: 1024px) 100vw,
              33vw
            "
            className="
              object-cover
              transition
              duration-500
              group-hover:scale-[1.04]
            "
          />
        ) : (
          <div
            className="
              flex
              size-full
              items-center
              justify-center
              bg-gradient-to-br
              from-secondary/25
              via-background
              to-accent/15
            "
          >
            <Flame
              className="
                size-10
                text-primary/25
              "
              strokeWidth={1.5}
              aria-hidden="true"
            />
          </div>
        )}

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            bg-gradient-to-t
            from-black/35
            via-transparent
            to-transparent
          "
        />

        <div
          className="
            absolute
            left-4
            top-4
            inline-flex
            items-center
            gap-2
            rounded-full
            border
            border-white/35
            bg-white/90
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#3e3a3a]
            shadow-sm
            backdrop-blur-md
          "
        >
          <Medal
            className="size-3.5"
            strokeWidth={1.9}
            aria-hidden="true"
          />

          {RANK_LABELS[
            rank - 1
          ] ?? `${rank}th`}
        </div>

        <div
          className="
            absolute
            bottom-4
            right-4
            flex
            size-10
            items-center
            justify-center
            rounded-full
            bg-white/90
            text-[#3e3a3a]
            shadow-sm
            backdrop-blur-md
            transition
            duration-300
            group-hover:rotate-6
            group-hover:scale-105
          "
        >
          <ArrowUpRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </div>
      </div>

      <div className="p-5">
        <div className="min-w-0">
          <h3
            className="
              line-clamp-2
              text-lg
              font-semibold
              leading-7
              tracking-[-0.03em]
              text-foreground
              transition
              group-hover:text-primary/80
            "
          >
            {sauna.name}
          </h3>

          {location && (
            <p
              className="
                mt-2
                flex
                items-center
                gap-1.5
                text-xs
                text-muted-foreground
              "
            >
              <MapPin
                className="
                  size-3.5
                  shrink-0
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span className="truncate">
                {location}
              </span>
            </p>
          )}
        </div>

        <div
          className="
            mt-5
            grid
            grid-cols-3
            gap-2
          "
        >
          <Metric
            icon={
              <Star
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="評価"
            value={averageRating}
          />

          <Metric
            icon={
              <MessageCircle
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="投稿"
            value={formatCount(
              sauna.post_count
            )}
          />

          <Metric
            icon={
              <Heart
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="保存"
            value={formatCount(
              sauna.favorite_count
            )}
          />
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            gap-3
            border-t
            border-border/50
            pt-4
          "
        >
          <span
            className="
              min-w-0
              truncate
              text-xs
              text-muted-foreground
            "
          >
            {sauna.rating_count > 0
              ? `${formatCount(
                  sauna.rating_count
                )}件の評価`
              : "評価はまだありません"}
          </span>

          <span
            className="
              inline-flex
              shrink-0
              items-center
              gap-1
              text-xs
              font-semibold
              text-foreground
            "
          >
            施設を見る

            <ArrowUpRight
              className="
                size-3.5
                transition
                group-hover:translate-x-0.5
                group-hover:-translate-y-0.5
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}

type MetricProps = {
  icon: ReactNode;
  label: string;
  value: string;
};

function Metric({
  icon,
  label,
  value,
}: MetricProps) {
  return (
    <div
      className="
        min-w-0
        rounded-xl
        bg-muted/45
        px-2
        py-3
        text-center
      "
    >
      <div
        className="
          flex
          items-center
          justify-center
          gap-1
          text-muted-foreground
        "
      >
        {icon}

        <span className="text-[0.65rem]">
          {label}
        </span>
      </div>

      <p
        className="
          mt-1
          truncate
          text-sm
          font-semibold
          tabular-nums
          text-foreground
        "
      >
        {value}
      </p>
    </div>
  );
}

function formatCount(
  count: number
): string {
  return new Intl.NumberFormat(
    "ja-JP"
  ).format(count);
}
