import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Heart,
  MapPin,
  Search,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getFavoriteSaunas } from "@/services/favorite-saunas";

export default async function FavoriteSaunasPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * 未ログイン時
   */
  if (!user) {
    return (
      <>
        <Header />

        <main
          className="
            relative
            min-h-screen
            overflow-hidden
            bg-muted/25
            px-4
            pb-20
            pt-28
            sm:px-6
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -right-32 top-16
              size-80
              rounded-full
              bg-secondary/15
              blur-3xl
            "
          />

          <section
            className="
              relative
              mx-auto
              max-w-xl
              rounded-[2rem]
              border border-border/55
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
                flex size-14
                items-center justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Heart
                className="size-5"
                strokeWidth={1.7}
              />
            </div>

            <p
              className="
                mt-6
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted-foreground
              "
            >
              Favorite Saunas
            </p>

            <h1
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-3xl
              "
            >
              ログインが必要です
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-md
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              お気に入りに追加したサウナを確認するには、
              ログインしてください。
            </p>

            <Link
              href="/login"
              className={cn(
                buttonVariants({
                  variant: "totono",
                  size: "xl",
                }),
                "mt-8"
              )}
            >
              ログインへ

              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
                data-icon="inline-end"
              />
            </Link>
          </section>
        </main>
      </>
    );
  }

  /*
   * ログインユーザーのお気に入り施設を取得します。
   */
  const favoriteSaunas = await getFavoriteSaunas(
    supabase,
    user.id
  );

  return (
    <>
      <Header />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-muted/25
          pb-24
          pt-28
          sm:pb-28
          sm:pt-32
        "
      >
        {/* 背景装飾 */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute -right-40 top-20
            size-120
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute -left-40 top-136
            size-112
            rounded-full
            bg-accent/8
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-6xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          {/* 戻る導線 */}
          <Link
            href="/profile"
            className="
              inline-flex
              items-center
              gap-2
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
            <ArrowLeft
              className="size-4"
              strokeWidth={1.8}
            />

            プロフィールへ戻る
          </Link>

          {/* ページヘッダー */}
          <section
            aria-labelledby="favorite-saunas-heading"
            className="
              relative
              mt-8
              overflow-hidden
              rounded-[2rem]
              border border-border/55
              bg-card/90
              px-6
              py-10
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
              sm:px-10
              sm:py-12
              lg:px-12
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -right-16 -top-20
                size-64
                rounded-full
                bg-secondary/25
                blur-3xl
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -bottom-24 left-24
                size-52
                rounded-full
                bg-accent/15
                blur-3xl
              "
            />

            <div
              className="
                relative
                flex
                flex-col
                gap-7
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <div className="flex items-center gap-3">
                  <span
                    className="
                      flex size-10
                      items-center justify-center
                      rounded-full
                      bg-accent
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

                <h1
                  id="favorite-saunas-heading"
                  className="
                    mt-6
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-4xl
                    lg:text-5xl
                  "
                >
                  お気に入りサウナ
                </h1>

                <p
                  className="
                    mt-4
                    max-w-2xl
                    text-sm
                    leading-7
                    text-muted-foreground
                    sm:text-base
                    sm:leading-8
                  "
                >
                  次に訪れたい場所や、
                  また整いに行きたい施設をまとめています。
                </p>
              </div>

              <div
                className="
                  w-fit
                  rounded-2xl
                  border border-border/50
                  bg-background/55
                  px-5
                  py-4
                  backdrop-blur-sm
                "
              >
                <p
                  className="
                    text-[0.6875rem]
                    font-medium
                    text-muted-foreground
                  "
                >
                  保存した施設
                </p>

                <p
                  className="
                    mt-1
                    text-2xl
                    font-semibold
                    tabular-nums
                    text-foreground
                  "
                >
                  {favoriteSaunas.length}
                  <span
                    className="
                      ml-1
                      text-sm
                      font-medium
                      text-muted-foreground
                    "
                  >
                    件
                  </span>
                </p>
              </div>
            </div>
          </section>

          {/* お気に入り一覧 */}
          <section
            aria-label="お気に入りサウナ一覧"
            className="mt-12 sm:mt-14 lg:mt-16"
          >
            {favoriteSaunas.length === 0 ? (
              <div
                className="
                  rounded-[2rem]
                  border border-border/55
                  bg-card/90
                  px-6
                  py-16
                  text-center
                  shadow-sm
                  backdrop-blur-md
                  sm:px-10
                  sm:py-20
                "
              >
                <div
                  className="
                    mx-auto
                    flex size-14
                    items-center justify-center
                    rounded-full
                    bg-secondary/25
                    text-foreground
                  "
                >
                  <Search
                    className="size-5"
                    strokeWidth={1.7}
                  />
                </div>

                <h2
                  className="
                    mt-6
                    text-xl
                    font-semibold
                    tracking-tight
                    text-foreground
                  "
                >
                  お気に入りのサウナはまだありません
                </h2>

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
                  サウナを探す

                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-end"
                  />
                </Link>
              </div>
            ) : (
              <div
                className="
                  grid
                  gap-6
                  sm:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {favoriteSaunas.map((sauna) => {
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
                        border border-border/55
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
                              33vw
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
                              flex h-full
                              items-center justify-center
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
                                登録されていません
                              </p>
                            </div>
                          </div>
                        )}

                        <span
                          className="
                            absolute
                            right-4 top-4
                            flex size-10
                            items-center justify-center
                            rounded-full
                            bg-accent
                            text-foreground
                            shadow-sm
                          "
                        >
                          <Heart
                            className="size-4 fill-current"
                            strokeWidth={1.8}
                          />
                        </span>
                      </div>

                      <div className="p-6">
                        <h2
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
                        </h2>

                        {locationText && (
                          <div
                            className="
                              mt-3
                              flex items-start
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
                            mt-6
                            flex
                            items-center
                            justify-between
                            border-t
                            border-border/45
                            pt-5
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
        </div>
      </main>
    </>
  );
}