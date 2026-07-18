import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Heart,
  MapPin,
  Search,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getFavoriteSaunas } from "@/services/favorite-saunas";

type FavoriteSaunasSectionProps = {
  userId: string;
};

const DISPLAY_LIMIT = 4;

export async function FavoriteSaunasSection({
  userId,
}: FavoriteSaunasSectionProps) {
  const supabase = await createClient();

  /*
   * ログインユーザーのお気に入り施設を取得します。
   */
  const favoriteSaunas = await getFavoriteSaunas(
    supabase,
    userId
  );

  /*
   * プロフィールには最大4件だけ表示します。
   */
  const displayedSaunas = favoriteSaunas.slice(
    0,
    DISPLAY_LIMIT
  );

  return (
    <section
      aria-labelledby="favorite-saunas-heading"
      className="mt-14 sm:mt-16 lg:mt-20"
    >
      {/* セクション見出し */}
      <div
        className="
          mb-8
          flex
          flex-col
          gap-5
          border-b
          border-border/55
          pb-7
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:gap-8
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
                className="size-4 fill-current"
                strokeWidth={1.8}
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
              Favorite Saunas
            </p>
          </div>

          <h2
            id="favorite-saunas-heading"
            className="
              mt-5
              text-3xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-4xl
            "
          >
            お気に入りサウナ
          </h2>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            次に訪れたい場所や、
            また整いに行きたい施設をまとめています。
          </p>
        </div>

        {/* お気に入りがある場合だけ一覧ページへのリンクを表示 */}
        {favoriteSaunas.length > 0 && (
          <Link
            href="/favorite-saunas"
            className="
              group
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-md
              text-sm
              font-medium
              text-muted-foreground
              transition-colors
              hover:text-foreground
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-accent
              focus-visible:ring-offset-2
            "
          >
            <span>すべて見る</span>

            <span className="tabular-nums">
              （{favoriteSaunas.length}件）
            </span>

            <ArrowRight
              className="
                size-4
                transition-transform
                duration-200
                group-hover:translate-x-0.5
              "
              strokeWidth={1.8}
            />
          </Link>
        )}
      </div>

      {/* お気に入りがない場合 */}
      {displayedSaunas.length === 0 ? (
        <div
          className="
            rounded-[2rem]
            border
            border-border/55
            bg-card/90
            px-6
            py-14
            text-center
            shadow-sm
            backdrop-blur-md
            sm:px-10
            sm:py-16
          "
        >
          <div
            className="
              mx-auto
              flex
              size-14
              items-center
              justify-center
              rounded-full
              bg-secondary/25
              text-foreground
            "
          >
            <Heart
              className="size-5"
              strokeWidth={1.7}
            />
          </div>

          <h3
            className="
              mt-6
              text-xl
              font-semibold
              tracking-tight
              text-foreground
            "
          >
            お気に入りのサウナはまだありません
          </h3>

          <p
            className="
              mx-auto
              mt-3
              max-w-md
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            気になる施設を見つけたら、
            施設詳細ページからお気に入りに追加してみましょう。
          </p>

          <Link
            href="/search"
            className={cn(
              buttonVariants({
                variant: "totono",
                size: "xl",
              }),
              "mt-8"
            )}
          >
            <Search
              className="size-4"
              strokeWidth={1.8}
              data-icon="inline-start"
            />

            サウナを探す

            <ArrowRight
              className="size-4"
              strokeWidth={1.8}
              data-icon="inline-end"
            />
          </Link>
        </div>
      ) : (
        /*
         * お気に入り施設カード
         */
        <div
          className="
            grid
            gap-6
            sm:grid-cols-2
            lg:grid-cols-4
          "
        >
          {displayedSaunas.map((sauna) => {
            const locationText = [
              sauna.prefecture,
              sauna.city,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <Link
                key={sauna.id}
                href={`/saunas/${sauna.id}`}
                className="
                  group
                  overflow-hidden
                  rounded-[1.75rem]
                  border
                  border-border/55
                  bg-card/90
                  shadow-sm
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-lg
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-accent
                  focus-visible:ring-offset-2
                "
              >
                {/* 施設画像 */}
                <div
                  className="
                    relative
                    aspect-4/3
                    overflow-hidden
                    bg-muted/60
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
                        25vw
                      "
                      className="
                        object-cover
                        transition
                        duration-500
                        group-hover:scale-[1.03]
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
                            uppercase
                            tracking-[0.22em]
                            text-muted-foreground/60
                          "
                        >
                          TOTONO
                        </p>

                        <p
                          className="
                            mt-3
                            text-xs
                            leading-5
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

                  {/* お気に入りマーク */}
                  <span
                    className="
                      absolute
                      right-4
                      top-4
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-full
                      bg-accent
                      text-foreground
                      shadow-sm
                    "
                    aria-hidden="true"
                  >
                    <Heart
                      className="size-4 fill-current"
                      strokeWidth={1.8}
                    />
                  </span>
                </div>

                {/* 施設情報 */}
                <div className="p-5">
                  <h3
                    className="
                      line-clamp-2
                      text-lg
                      font-semibold
                      leading-7
                      tracking-tight
                      text-foreground
                    "
                  >
                    {sauna.name}
                  </h3>

                  {locationText && (
                    <div
                      className="
                        mt-3
                        flex
                        items-start
                        gap-2
                        text-sm
                        leading-6
                        text-muted-foreground
                      "
                    >
                      <MapPin
                        className="
                          mt-1
                          size-4
                          shrink-0
                        "
                        strokeWidth={1.7}
                      />

                      <span>{locationText}</span>
                    </div>
                  )}

                  <div
                    className="
                      mt-5
                      flex
                      items-center
                      justify-between
                      border-t
                      border-border/45
                      pt-4
                    "
                  >
                    <span
                      className="
                        text-sm
                        font-medium
                        text-foreground
                      "
                    >
                      施設を見る
                    </span>

                    <ArrowRight
                      className="
                        size-4
                        text-muted-foreground
                        transition
                        duration-200
                        group-hover:translate-x-1
                        group-hover:text-foreground
                      "
                      strokeWidth={1.8}
                    />
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}