import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Building2,
} from "lucide-react";

import { JournalCalendar } from "@/components/journal/JournalCalendar";
import { JournalHero } from "@/components/journal/JournalHero";
import { JournalInsights } from "@/components/journal/JournalInsights";
import { JournalSummary } from "@/components/journal/JournalSummary";
import { JournalSectionNavigation } from "@/components/journal/JournalSectionNavigation";
import { RecentJournalEntries } from "@/components/journal/RecentJournalEntries";
import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { buttonVariants } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getJournalData } from "@/services/journal";
import { getPosts } from "@/services/posts";

export default async function JournalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

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
              absolute -left-32 top-12
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
                flex
                size-14
                items-center
                justify-center
                rounded-full
                bg-secondary/25
                text-foreground
              "
            >
              <BookOpen
                className="size-5"
                strokeWidth={1.7}
                aria-hidden="true"
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
              Sauna Journal
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
              サ活の記録やサウナライフの振り返りを確認するには、
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
   * Journal画面に必要なデータと、
   * 全投稿データを並行して取得します。
   */
  const [
    journalData,
    allPosts,
  ] = await Promise.all([
    getJournalData(
      supabase,
      user.id,
      4
    ),
    getPosts(supabase),
  ]);

  const myPosts = allPosts.filter(
    (post) => post.user_id === user.id
  );

  return (
    <>
      <Header />

      <main
        className="
          min-h-screen
          overflow-hidden
          bg-muted/25
          pb-32
          pt-20
          md:pb-24
          [scroll-behavior:smooth]
        "
      >
        <JournalHero
          monthLabel={
            journalData.summary.monthLabel
          }
          reflectionMessage={
            journalData.reflectionMessage
          }
        />

        <div
          className="
            mx-auto
            max-w-7xl
            space-y-6
            px-4
            py-8
            sm:space-y-8
            sm:px-6
            sm:py-12
            lg:px-8
            lg:py-16
          "
        >
          <div
            className="
              sticky
              top-24
              z-30
            "
          >
            <JournalSectionNavigation />
          </div>

          <div
            id="journal-overview"
            className="scroll-mt-28"
          >
            <JournalSummary
              summary={journalData.summary}
            />
          </div>

          <div
            id="journal-calendar"
            className="scroll-mt-28"
          >
            <JournalCalendar
              yearMonth={
                journalData.summary.yearMonth
              }
              monthLabel={
                journalData.summary.monthLabel
              }
              posts={journalData.monthlyPosts}
            />
          </div>

          <div
            id="recent-journal-entries"
            className="scroll-mt-28"
          >
            <RecentJournalEntries
              entries={journalData.recentEntries}
            />
          </div>

          <section
            id="favorite-saunas"
            aria-labelledby="favorite-saunas-heading"
            className="
              scroll-mt-28
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
                border-b border-border/45
                px-5
                py-6
                sm:px-8
                sm:py-7
              "
            >
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
                  <Building2
                    className="size-4"
                    strokeWidth={1.7}
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-muted-foreground
                    "
                  >
                    Favorite Places
                  </p>

                  <h2
                    id="favorite-saunas-heading"
                    className="
                      mt-2
                      text-2xl
                      font-semibold
                      tracking-[-0.035em]
                      text-foreground
                      sm:text-3xl
                    "
                  >
                    よく行く施設
                  </h2>
                </div>
              </div>
            </div>

            {journalData.favoriteSaunas.length ===
            0 ? (
              <div
                className="
                  px-5
                  py-12
                  text-center
                  sm:px-8
                "
              >
                <p
                  className="
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  サ活を記録すると、よく行く施設がここに表示されます。
                </p>
              </div>
            ) : (
              <div
                className="
                  grid
                  divide-y
                  divide-border/45
                  md:grid-cols-3
                  md:divide-x
                  md:divide-y-0
                "
              >
                {journalData.favoriteSaunas.map(
                  (sauna, index) => (
                    <article
                      key={sauna.saunaName}
                      className="
                        min-w-0
                        p-6
                        sm:p-8
                      "
                    >
                      <p
                        className="
                          text-xs
                          font-semibold
                          uppercase
                          tracking-[0.18em]
                          text-muted-foreground
                        "
                      >
                        No. {index + 1}
                      </p>

                      <h3
                        className="
                          mt-4
                          break-words
                          text-xl
                          font-semibold
                          tracking-[-0.03em]
                          text-foreground
                        "
                      >
                        {sauna.saunaName}
                      </h3>

                      <div
                        className="
                          mt-6
                          flex
                          flex-wrap
                          gap-x-6
                          gap-y-3
                        "
                      >
                        <div>
                          <p
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            訪問回数
                          </p>

                          <p
                            className="
                              mt-1
                              text-lg
                              font-semibold
                              text-foreground
                              tabular-nums
                            "
                          >
                            {sauna.visitCount}回
                          </p>
                        </div>

                        <div>
                          <p
                            className="
                              text-xs
                              text-muted-foreground
                            "
                          >
                            平均評価
                          </p>

                          <p
                            className="
                              mt-1
                              text-lg
                              font-semibold
                              text-foreground
                              tabular-nums
                            "
                          >
                            {sauna.averageRating ===
                            null
                              ? "-"
                              : sauna.averageRating.toFixed(
                                  1
                                )}
                          </p>
                        </div>
                      </div>
                    </article>
                  )
                )}
              </div>
            )}
          </section>

          <div
            id="journal-insights"
            className="scroll-mt-28"
          >
            <JournalInsights posts={myPosts} />
          </div>
        </div>
      </main>

      <AppMobileNavigation />
    </>
  );
}
