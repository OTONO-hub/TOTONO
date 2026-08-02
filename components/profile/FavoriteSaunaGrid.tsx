import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  MapPin,
  Star,
  Waves,
} from "lucide-react";

import { FavoriteSaunaButton } from "@/components/saunas/FavoriteSaunaButton";
import type {
  SaunaMetrics,
} from "@/services/sauna-metrics";
import type { Sauna } from "@/services/saunas";

type FavoriteSaunaGridProps = {
  saunas: Sauna[];
  userId: string;
  metricsBySaunaId: Record<
    string,
    SaunaMetrics
  >;
};

export function FavoriteSaunaGrid({
  saunas,
  userId,
  metricsBySaunaId,
}: FavoriteSaunaGridProps) {
  return (
    <div
      className="
        grid
        gap-4
        p-5
        sm:grid-cols-2
        sm:p-8
        lg:grid-cols-3
        lg:p-10
      "
    >
      {saunas.map((sauna) => {
        const metrics =
          metricsBySaunaId[sauna.id];

        const hasRating =
          metrics &&
          metrics.averageRating !== null &&
          metrics.ratingCount > 0;

        const locationText = [
          sauna.prefecture,
          sauna.city,
        ]
          .filter(
            (value): value is string =>
              typeof value === "string" &&
              value.trim().length > 0
          )
          .join(" ");

        return (
          <article
            key={sauna.id}
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
            "
          >
            <Link
              href={`/saunas/${sauna.id}`}
              className="
                block
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
                  bg-[#3e3a3a]
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
                ) : (
                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-linear-to-br
                      from-[#3e3a3a]
                      via-[#504b4b]
                      to-[#6b6664]
                    "
                  >
                    <div className="text-center">
                      <span
                        className="
                          mx-auto
                          flex
                          size-11
                          items-center
                          justify-center
                          rounded-full
                          border border-white/15
                          bg-white/10
                        "
                      >
                        <Waves
                          className="size-5 text-white/70"
                          strokeWidth={1.5}
                          aria-hidden="true"
                        />
                      </span>

                      <p
                        className="
                          mt-3
                          text-[0.625rem]
                          font-semibold
                          uppercase
                          tracking-[0.26em]
                          text-white/45
                        "
                      >
                        TOTONO
                      </p>
                    </div>
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-black/45
                    via-transparent
                    to-transparent
                  "
                />

                {sauna.is_verified && (
                  <span
                    className="
                      absolute
                      left-3
                      top-3
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      border border-white/20
                      bg-black/25
                      px-2.5
                      py-1.5
                      text-[0.6875rem]
                      font-semibold
                      text-white
                      backdrop-blur-md
                    "
                  >
                    <CheckCircle2
                      className="size-3.5 text-secondary"
                      strokeWidth={2}
                      aria-hidden="true"
                    />
                    確認済み
                  </span>
                )}
              </div>

              <div className="p-5">
                <h2
                  className="
                    wrap-break-word
                    text-lg
                    font-semibold
                    tracking-[-0.025em]
                    text-foreground
                  "
                >
                  {sauna.name}
                </h2>

                <div
                  className="
                    mt-3
                    flex
                    min-h-5
                    items-start
                    gap-2
                    text-xs
                    leading-5
                    text-muted-foreground
                  "
                >
                  <MapPin
                    className="mt-0.5 size-3.5 shrink-0"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <span>
                    {locationText ||
                      "所在地未登録"}
                  </span>
                </div>

                <div
                  className="
                    mt-4
                    flex
                    items-center
                    justify-between
                    gap-3
                    border-t border-border/45
                    pt-4
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      gap-1.5
                      text-sm
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

                    {hasRating ? (
                      <>
                        <span className="font-semibold tabular-nums">
                          {metrics.averageRating?.toFixed(
                            1
                          )}
                        </span>

                        <span className="text-xs text-muted-foreground">
                          ({metrics.ratingCount}件)
                        </span>
                      </>
                    ) : (
                      <span className="text-xs text-muted-foreground">
                        未評価
                      </span>
                    )}
                  </div>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1
                      text-xs
                      font-medium
                      text-foreground
                    "
                  >
                    詳細を見る

                    <ArrowRight
                      className="size-3.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>
                </div>
              </div>
            </Link>

            <div
              className="
                border-t border-border/45
                px-5
                py-4
              "
            >
              <FavoriteSaunaButton
                saunaId={sauna.id}
                userId={userId}
                initialFavorite
              />
            </div>
          </article>
        );
      })}
    </div>
  );
}
