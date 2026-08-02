"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Clock3,
  History,
  ImageIcon,
  MapPin,
  Star,
  Trash2,
} from "lucide-react";

import {
  clearRecentlyViewedSaunas,
  getRecentlyViewedSaunas,
  type RecentlyViewedSauna,
} from "@/lib/recently-viewed-saunas";

export function RecentlyViewedSaunas() {
  const [saunas, setSaunas] = useState<
    RecentlyViewedSauna[]
  >([]);

  const [isLoaded, setIsLoaded] =
    useState(false);

  useEffect(() => {
  const timeoutId = window.setTimeout(() => {
    setSaunas(getRecentlyViewedSaunas());
    setIsLoaded(true);
  }, 0);

  return () => {
    window.clearTimeout(timeoutId);
  };
}, []);


  const handleClearHistory = () => {
    clearRecentlyViewedSaunas();
    setSaunas([]);
  };

  if (!isLoaded || saunas.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="recently-viewed-saunas-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border/50
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <History
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.24em]
                text-muted-foreground
              "
            >
              Recently Viewed
            </p>
          </div>

          <h2
            id="recently-viewed-saunas-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            最近見た施設
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
            気になっていた施設へ、
            すぐに戻ることができます。
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearHistory}
          className="
            inline-flex
            min-h-10
            w-fit
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-border
            bg-background/80
            px-4
            text-xs
            font-semibold
            text-muted-foreground
            transition
            duration-200
            hover:border-foreground/20
            hover:bg-background
            hover:text-foreground
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-card
          "
        >
          <Trash2
            className="size-3.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          履歴を削除
        </button>
      </div>

      <div
        className="
          grid
          gap-4
          p-5
          sm:grid-cols-2
          sm:p-8
          lg:grid-cols-3
        "
      >
        {saunas.map((sauna) => (
          <RecentlyViewedSaunaCard
            key={sauna.id}
            sauna={sauna}
          />
        ))}
      </div>
    </section>
  );
}

type RecentlyViewedSaunaCardProps = {
  sauna: RecentlyViewedSauna;
};

function RecentlyViewedSaunaCard({
  sauna,
}: RecentlyViewedSaunaCardProps) {
  const locationText = createLocationText(
    sauna.prefecture,
    sauna.city
  );

  const viewedAtText = formatViewedAt(
    sauna.viewedAt
  );

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border/55
        bg-background/70
        transition
        duration-300
        hover:-translate-y-1
        hover:border-foreground/10
        hover:shadow-md
      "
    >
      <Link
        href={`/saunas/${sauna.id}`}
        className="
          block
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-ring
        "
      >
        <div
          className="
            relative
            aspect-[16/10]
            overflow-hidden
            bg-muted/55
          "
        >
          {sauna.imageUrl ? (
            <Image
              src={sauna.imageUrl}
              alt={`${sauna.name}の施設画像`}
              fill
              sizes="
                (max-width: 639px) 100vw,
                (max-width: 1023px) 50vw,
                33vw
              "
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.04]
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
              "
            >
              <div className="text-center">
                <ImageIcon
                  className="
                    mx-auto
                    size-7
                    text-muted-foreground/70
                  "
                  strokeWidth={1.5}
                  aria-hidden="true"
                />

                <p
                  className="
                    mt-2
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  画像は準備中です
                </p>
              </div>
            </div>
          )}

          <span
            className="
              absolute
              left-3
              top-3
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/45
              bg-white/85
              px-2.5
              py-1.5
              text-[11px]
              font-semibold
              text-foreground
              shadow-sm
              backdrop-blur-md
            "
          >
            <Clock3
              className="size-3"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {viewedAtText}
          </span>
        </div>

        <div className="p-4 sm:p-5">
          <h3
            className="
              line-clamp-2
              text-lg
              font-semibold
              leading-7
              tracking-[-0.025em]
              text-foreground
            "
          >
            {sauna.name}
          </h3>

          <div
            className="
              mt-3
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-muted-foreground
              "
            >
              <MapPin
                className="size-3.5"
                strokeWidth={1.7}
                aria-hidden="true"
              />

              {locationText}
            </span>

            {sauna.averageRating !== null && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  text-xs
                  font-semibold
                  text-foreground
                "
              >
                <Star
                  className="
                    size-3.5
                    fill-accent
                    text-accent
                  "
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                {sauna.averageRating.toFixed(1)}
              </span>
            )}
          </div>

          <span
            className="
              mt-5
              inline-flex
              items-center
              gap-2
              text-sm
              font-semibold
              text-foreground
            "
          >
            もう一度見る

            <ArrowRight
              className="
                size-4
                transition-transform
                duration-200
                group-hover:translate-x-1
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>
        </div>
      </Link>
    </article>
  );
}

function createLocationText(
  prefecture: string | null,
  city: string | null
): string {
  const locationText = [
    prefecture,
    city,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .map((value) => value.trim())
    .join(" ");

  return locationText || "エリア情報なし";
}

function formatViewedAt(
  viewedAt: string
): string {
  const viewedDate = new Date(viewedAt);

  if (Number.isNaN(viewedDate.getTime())) {
    return "最近";
  }

  const now = new Date();

  const differenceMilliseconds =
    now.getTime() - viewedDate.getTime();

  const differenceMinutes = Math.floor(
    differenceMilliseconds / 60_000
  );

  if (differenceMinutes < 1) {
    return "たった今";
  }

  if (differenceMinutes < 60) {
    return `${differenceMinutes}分前`;
  }

  const differenceHours = Math.floor(
    differenceMinutes / 60
  );

  if (differenceHours < 24) {
    return `${differenceHours}時間前`;
  }

  const differenceDays = Math.floor(
    differenceHours / 24
  );

  if (differenceDays === 1) {
    return "昨日";
  }

  if (differenceDays < 7) {
    return `${differenceDays}日前`;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month: "numeric",
      day: "numeric",
    }
  ).format(viewedDate);
}
