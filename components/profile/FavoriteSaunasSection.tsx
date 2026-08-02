import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  Heart,
  MapPin,
  Search,
  Star,
  Waves,
} from "lucide-react";

import { DashboardState } from "@/components/home/dashboard-state";
import { FavoriteSaunaButton } from "@/components/saunas/FavoriteSaunaButton";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getFavoriteSaunas } from "@/services/favorite-saunas";
import { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";

type FavoriteSaunasSectionProps = {
  userId: string;
};

const FAVORITE_SAUNA_DISPLAY_LIMIT = 6;

export async function FavoriteSaunasSection({
  userId,
}: FavoriteSaunasSectionProps) {
  const supabase = await createClient();

  const favoriteSaunas = await getFavoriteSaunas(
    supabase,
    userId
  );

  const displayedSaunas = favoriteSaunas.slice(
    0,
    FAVORITE_SAUNA_DISPLAY_LIMIT
  );

  const metricsBySaunaId =
    await getSaunaMetricsBySaunaIds(
      supabase,
      displayedSaunas.map((sauna) => sauna.id)
    );

  return (
    <section
      aria-labelledby="favorite-saunas-heading"
      className="mt-8 sm:mt-10"
    >
      <div
        className="
          overflow-hidden
          rounded-[2rem]
          border border-border/55
          bg-card/90
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            border-b border-border/45
            px-5
            py-6
            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:px-8
            sm:py-7
            lg:px-10
          "
        >
          <div>
            <div className="flex items-center gap-3">
              <span
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  bg-accent/20
                  text-foreground
                "
              >
                <Heart
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.25em]
                  text-muted-foreground
                "
              >
                My Sauna List
              </p>
            </div>

            <h2
              id="favorite-saunas-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-3xl
              "
            >
              お気に入り施設
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              また行きたい施設や、これから訪れたい施設をまとめています。
            </p>
          </div>

          {favoriteSaunas.length > 0 && (
            <p
              className="
                shrink-0
                text-sm
                font-medium
                tabular-nums
                text-muted-foreground
              "
            >
              {favoriteSaunas.length}施設
            </p>
          )}
        </div>

        {displayedSaunas.length === 0 ? (
          <div className="px-5 py-8 sm:px-8 sm:py-10 lg:px-10">
            <DashboardState
              title="お気に入り施設はまだありません"
              description="気になるサウナを見つけたら、施設詳細ページからお気に入りに保存してみましょう。"
              icon={
                <Search
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
              action={
                <Link
                  href="/search"
                  className={cn(
                    buttonVariants({
                      variant: "totono",
                      size: "xl",
                    })
                  )}
                >
                  施設を探す

                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-end"
                    aria-hidden="true"
                  />
                </Link>
              }
            />
          </div>
        ) : (
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
            {displayedSaunas.map((sauna) => {
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
                      <h3
                        className="
                          wrap-break-word
                          text-lg
                          font-semibold
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
                          aria-label={
                            hasRating
                              ? `平均評価${metrics.averageRating?.toFixed(1)}、${metrics.ratingCount}件の評価`
                              : "まだ評価はありません"
                          }
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
        )}

        {favoriteSaunas.length >
          FAVORITE_SAUNA_DISPLAY_LIMIT && (
          <div
            className="
              border-t border-border/45
              px-5
              py-5
              text-center
              sm:px-8
              lg:px-10
            "
          >
            <p className="text-sm text-muted-foreground">
              最新の{FAVORITE_SAUNA_DISPLAY_LIMIT}
              施設を表示しています。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
