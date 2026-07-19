import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  Heart,
  MapPin,
  Star,
} from "lucide-react";

import type { Sauna } from "@/services/saunas";

type SaunaSearchCardProps = {
  sauna: Sauna;
  postCount: number;
  favoriteCount: number;
  averageRating: number | null;
  ratingCount: number;
};

export function SaunaSearchCard({
  sauna,
  postCount,
  favoriteCount,
  averageRating,
  ratingCount,
}: SaunaSearchCardProps) {
  const locationText = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Link
      href={`/saunas/${sauna.id}`}
      aria-label={`${sauna.name}の施設詳細を見る`}
      className="
        group
        block
        overflow-hidden
        rounded-[1.75rem]
        border
        border-border/55
        bg-card
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:shadow-lg
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
          aspect-[4/3]
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
              (max-width: 640px) 100vw,
              (max-width: 1024px) 50vw,
              320px
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
              h-full
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  tracking-[0.22em]
                  text-muted-foreground/60
                "
              >
                TOTONO
              </p>

              <p
                className="
                  mt-3
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                施設画像はまだ
                <br />
                登録されていません
              </p>
            </div>
          </div>
        )}

        {sauna.is_verified && (
          <div
            className="
              absolute
              left-3
              top-3
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-card/90
              px-3
              py-1.5
              text-[0.6875rem]
              font-semibold
              text-foreground
              shadow-sm
              backdrop-blur-md
            "
          >
            <CheckCircle2
              className="size-3.5 text-success"
              strokeWidth={2}
            />

            施設確認済み
          </div>
        )}

        <div
          className="
            absolute
            bottom-3
            right-3
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-card/90
            px-3
            py-1.5
            text-xs
            font-semibold
            text-foreground
            shadow-sm
            backdrop-blur-md
          "
        >
          <Star
            className="
              size-3.5
              fill-accent
              text-accent
            "
            strokeWidth={1.8}
          />

          {averageRating !== null ? (
            <>
              <span>
                {averageRating.toFixed(1)}
              </span>

              <span
                className="
                  font-normal
                  text-muted-foreground
                "
              >
                ({ratingCount})
              </span>
            </>
          ) : (
            <span className="font-normal">
              未評価
            </span>
          )}
        </div>
      </div>

      <div className="p-5">
        <p
          className="
            text-[0.6875rem]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-muted-foreground
          "
        >
          Sauna Facility
        </p>

        <h3
          className="
            mt-2
            line-clamp-2
            text-lg
            font-semibold
            leading-7
            tracking-[-0.025em]
            text-foreground
            transition
            duration-200
            group-hover:text-foreground/75
          "
        >
          {sauna.name}
        </h3>

        <div
          className="
            mt-4
            flex
            items-start
            gap-2
            text-sm
            text-muted-foreground
          "
        >
          <MapPin
            className="
              mt-0.5
              size-4
              shrink-0
            "
            strokeWidth={1.7}
          />

          <span className="line-clamp-2 leading-6">
            {locationText ||
              sauna.address ||
              "所在地未登録"}
          </span>
        </div>

        <div
          className="
            mt-6
            border-t
            border-border/50
            pt-5
          "
        >
          <div
            className="
              grid
              grid-cols-2
              gap-3
              text-sm
            "
          >
            <div
              className="
                flex
                items-center
                gap-2
                text-muted-foreground
              "
            >
              <BookOpen
                className="size-4 shrink-0"
                strokeWidth={1.8}
              />

              <span>
                サ活{" "}
                <strong
                  className="
                    font-semibold
                    text-foreground
                  "
                >
                  {postCount}
                </strong>
                件
              </span>
            </div>

            <div
              className="
                flex
                items-center
                gap-2
                text-muted-foreground
              "
            >
              <Heart
                className="size-4 shrink-0"
                strokeWidth={1.8}
              />

              <span>
                お気に入り{" "}
                <strong
                  className="
                    font-semibold
                    text-foreground
                  "
                >
                  {favoriteCount}
                </strong>
                人
              </span>
            </div>
          </div>

          <div
            className="
              mt-5
              text-sm
              font-semibold
              text-foreground
              transition
              duration-200
              group-hover:translate-x-1
            "
          >
            施設詳細を見る →
          </div>
        </div>
      </div>
    </Link>
  );
}
