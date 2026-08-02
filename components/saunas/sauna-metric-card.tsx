import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";

type SaunaMetricCardProps = {
  saunaId: string;
  name: string;
  imageUrl: string | null;
  location: string | null;
  averageRating?: number | null;
  ratingCount?: number;
  favoriteCount?: number;
  postCount?: number;
  badge?: string;
  reason?: string | null;
};

export function SaunaMetricCard({
  saunaId,
  name,
  imageUrl,
  location,
  averageRating = null,
  ratingCount = 0,
  favoriteCount = 0,
  postCount = 0,
  badge = "おすすめ",
  reason = null,
}: SaunaMetricCardProps) {
  const hasRating =
    averageRating !== null &&
    ratingCount > 0;

  const isHighlyRated =
    hasRating &&
    averageRating !== null &&
    averageRating >= 4.5;

  return (
    <article
      className="
        group
        min-w-0
        overflow-hidden
        rounded-[1.75rem]
        border border-border/55
        bg-background/45
        transition
        duration-300
        hover:-translate-y-1
        hover:bg-background/70
        hover:shadow-md
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      <Link
        href={`/saunas/${saunaId}`}
        className="
          block
          h-full
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
        "
      >
        <div
          className="
            relative
            aspect-[16/10]
            overflow-hidden
            bg-muted/60
          "
        >
          {imageUrl ? (
            <>
              <Image
                src={imageUrl}
                alt={`${name}の施設画像`}
                fill
                sizes="
                  (max-width: 767px) calc(100vw - 72px),
                  (max-width: 1023px) 50vw,
                  33vw
                "
                className="
                  object-cover
                  transition-transform
                  duration-700
                  ease-out
                  group-hover:scale-[1.025]
                  motion-reduce:transform-none
                  motion-reduce:transition-none
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  inset-0
                  bg-linear-to-t
                  from-black/35
                  via-transparent
                  to-transparent
                "
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
                bg-linear-to-br
                from-muted
                via-card
                to-secondary/20
                px-3
                text-center
              "
            >
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-8
                  -top-8
                  size-24
                  rounded-full
                  bg-secondary/30
                  blur-2xl
                "
              />

              <div className="relative z-10">
                <ImageIcon
                  className="
                    mx-auto
                    size-6
                    text-muted-foreground/55
                  "
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <span
                  className="
                    mt-2
                    block
                    text-[0.625rem]
                    font-semibold
                    uppercase
                    tracking-[0.18em]
                    text-muted-foreground/65
                  "
                >
                  TOTONO
                </span>
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
              border border-white/25
              bg-white/85
              px-3
              py-1.5
              text-[0.6875rem]
              font-semibold
              text-foreground
              shadow-sm
              backdrop-blur-md
            "
          >
            {isHighlyRated ? (
              <Star
                className="
                  size-3.5
                  fill-accent
                  text-accent
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />
            ) : (
              <Sparkles
                className="size-3.5 text-success"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            )}

            {isHighlyRated ? "高評価" : badge}
          </span>
        </div>

        <div className="p-5">
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
            {name}
          </h3>

          <p
            className="
              mt-2
              flex
              min-w-0
              items-center
              gap-1.5
              text-sm
              text-muted-foreground
            "
          >
            <MapPin
              className="size-3.5 shrink-0"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span className="truncate">
              {location?.trim() ||
                "所在地情報は未登録です"}
            </span>
          </p>

          {reason && (
            <div
              className="
                mt-4
                rounded-2xl
                border border-secondary/30
                bg-secondary/10
                px-3.5
                py-3
              "
            >
              <p
                className="
                  flex
                  items-start
                  gap-2
                  text-xs
                  font-medium
                  leading-5
                  text-foreground/75
                "
              >
                <Sparkles
                  className="
                    mt-0.5
                    size-3.5
                    shrink-0
                    text-success
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                <span>{reason}</span>
              </p>
            </div>
          )}

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            {hasRating &&
            averageRating !== null ? (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border border-accent/30
                  bg-accent/15
                  px-3
                  py-1.5
                  text-xs
                  font-semibold
                  tabular-nums
                  text-foreground
                "
              >
                <Star
                  className="
                    size-3.5
                    fill-accent
                    text-accent
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {averageRating.toFixed(1)}

                <span className="font-medium text-muted-foreground">
                  ({ratingCount})
                </span>
              </span>
            ) : (
              <span
                className="
                  inline-flex
                  items-center
                  gap-1.5
                  rounded-full
                  border border-border/55
                  bg-muted/60
                  px-3
                  py-1.5
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                <Star
                  className="size-3.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                未評価
              </span>
            )}

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border border-destructive/15
                bg-destructive/10
                px-3
                py-1.5
                text-xs
                font-medium
                tabular-nums
                text-foreground/75
              "
            >
              <Heart
                className="size-3.5 text-destructive"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {favoriteCount}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border border-border/55
                bg-muted/60
                px-3
                py-1.5
                text-xs
                font-medium
                tabular-nums
                text-foreground/75
              "
            >
              <MessageCircle
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {postCount}件
            </span>
          </div>

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              border-t border-border/45
              pt-4
              text-sm
              font-medium
              text-foreground
            "
          >
            施設を見る

            <ArrowRight
              className="
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
        </div>
      </Link>
    </article>
  );
}
