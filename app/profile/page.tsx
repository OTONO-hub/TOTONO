import Link from "next/link";
import {
  ArrowRight,
  Edit3,
  PenLine,
  Sparkles,
  Users,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { PostCard } from "@/components/post/PostCard";
import { AchievementBadges } from "@/components/profile/AchievementBadges";
import { AchievementCard } from "@/components/profile/AchievementCard";
import { AnnualSaunaReport } from "@/components/profile/AnnualSaunaReport";
import { FavoriteSaunasSection } from "@/components/profile/FavoriteSaunasSection";
import { JournalEntryCard } from "@/components/profile/JournalEntryCard";
import { MonthlyActivityChart } from "@/components/profile/MonthlyActivityChart";
import { NextAchievementCard } from "@/components/profile/NextAchievementCard";
import { ProfileHero } from "@/components/profile/ProfileHero";
import { SaunaPersonaCard } from "@/components/profile/SaunaPersonaCard";
import { SaunaRhythmCard } from "@/components/profile/SaunaRhythmCard";
import { SaunaSummary } from "@/components/profile/SaunaSummary";
import { TopVisitedSaunas } from "@/components/profile/TopVisitedSaunas";
import { XpStatusCard } from "@/components/profile/XpStatusCard";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state/EmptyState";
import { calculateNextAchievement } from "@/lib/profile-next-achievement";
import { calculateSaunaPersona } from "@/lib/profile-persona";
import { calculateSaunaRhythm } from "@/lib/profile-rhythm";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getFollowerCount,
  getFollowingCount,
} from "@/services/follows";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getPostImagesByPostIds } from "@/services/post-images";
import { getPosts } from "@/services/posts";
import {
  getProfile,
  getProfilesByUserIds,
} from "@/services/profile";
import { getProfileInsights } from "@/services/profile-insights";
import { calculateSaunaXp } from "@/services/profile-xp";
import type { CommentWithAuthor } from "@/types/comment";

export default async function ProfilePage() {
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
              absolute
              -right-32
              top-16
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
              <Users
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
              My Lounge
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
              プロフィールやこれまでのサ活を確認するには、
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

  const profile = await getProfile(
    supabase,
    user.id
  );

  if (!profile) {
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
              absolute
              -left-32
              top-20
              size-80
              rounded-full
              bg-accent/10
              blur-3xl
            "
          />

          <section
            className="
              relative
              mx-auto
              max-w-2xl
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              px-6
              py-14
              text-center
              shadow-sm
              backdrop-blur-md
              sm:px-12
              sm:py-16
            "
          >
            <div
              className="
                mx-auto
                flex
                size-16
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Sparkles
                className="size-6"
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
              Welcome to TOTONO
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
              プロフィールを設定しましょう
            </h1>

            <p
              className="
                mx-auto
                mt-4
                max-w-lg
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
                sm:leading-8
              "
            >
              ユーザー名や自己紹介を設定すると、
              サ活の記録や他のユーザーとの交流を
              より楽しめます。
            </p>

            <Link
              href="/profile/edit"
              className={cn(
                buttonVariants({
                  variant: "totono",
                  size: "xl",
                }),
                "mt-8"
              )}
            >
              <Edit3
                className="size-4"
                strokeWidth={1.8}
                data-icon="inline-start"
              />

              プロフィールを設定する
            </Link>
          </section>
        </main>
      </>
    );
  }

  const [
    posts,
    followingCount,
    followerCount,
  ] = await Promise.all([
    getPosts(supabase),
    getFollowingCount(
      supabase,
      user.id
    ),
    getFollowerCount(
      supabase,
      user.id
    ),
  ]);

  const myPosts = posts.filter(
    (post) =>
      post.user_id === user.id
  );

  const myPostIds = myPosts.map(
    (post) => post.id
  );

  const [
    comments,
    bookmarkedPostIds,
    postImagesByPostId,
  ] = await Promise.all([
    getCommentsByPostIds(
      supabase,
      myPostIds
    ),
    getBookmarkedPostIds(
      supabase,
      user.id,
      myPostIds
    ),
    getPostImagesByPostIds(
      supabase,
      myPostIds
    ),
  ]);

  const bookmarkedPostIdSet =
    new Set(bookmarkedPostIds);

  const commentAuthorProfiles =
    await getProfilesByUserIds(
      supabase,
      comments.map(
        (comment) =>
          comment.user_id
      )
    );

  const profilesByUserId = new Map(
    [
      profile,
      ...commentAuthorProfiles,
    ].map((item) => [
      item.id,
      item,
    ])
  );

  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor:
      CommentWithAuthor = {
      comment,
      author:
        profilesByUserId.get(
          comment.user_id
        ) ?? null,
    };

    const currentComments =
      commentsByPostId.get(
        comment.post_id
      ) ?? [];

    currentComments.push(
      commentWithAuthor
    );

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  const myPostsWithMeta =
    await Promise.all(
      myPosts.map(
        async (post) => ({
          post,
          likeCount:
            await getLikeCount(
              supabase,
              post.id
            ),
          liked:
            await isLiked(
              supabase,
              user.id,
              post.id
            ),
          bookmarked:
            bookmarkedPostIdSet.has(
              post.id
            ),
          comments:
            commentsByPostId.get(
              post.id
            ) ?? [],
          images:
            postImagesByPostId.get(
              post.id
            ) ?? [],
        })
      )
    );

  const profileInsights =
    getProfileInsights(myPosts);

  const saunaRhythm =
    calculateSaunaRhythm(myPosts);

  const saunaPersona =
    calculateSaunaPersona(myPosts);

  const nextAchievement =
    calculateNextAchievement(
      profileInsights
    );

  const visitedSaunaCount =
    new Set(
      myPosts
        .map((post) =>
          post.sauna_name.trim()
        )
        .filter(Boolean)
    ).size;

  const totalSetCount =
    myPosts.reduce(
      (total, post) =>
        total +
        (post.set_count ?? 0),
      0
    );

  const xp = calculateSaunaXp({
    visitCount: myPosts.length,
    visitedSaunaCount,
    totalSetCount,
  });

  const memberSince = new Date(
    profile.created_at
  ).toLocaleDateString(
    "ja-JP",
    {
      year: "numeric",
      month: "long",
    }
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
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            top-20
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
            absolute
            -left-40
            top-136
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
          <FadeIn
            duration="slow"
            distance="subtle"
          >
            <ProfileHero
              username={
                profile.username
              }
              avatarUrl={
                profile.avatar_url
              }
              bio={profile.bio}
              memberSince={
                memberSince
              }
              postCount={
                myPosts.length
              }
              followingCount={
                followingCount
              }
              followerCount={
                followerCount
              }
            />
          </FadeIn>

          <ScrollReveal
            duration="normal"
            distance="subtle"
          >
            <JournalEntryCard
              monthlyVisits={
                profileInsights.monthlyVisits
              }
              totalVisits={
                profileInsights.totalSaunaVisits
              }
            />
          </ScrollReveal>

          <ScrollReveal
            delay={40}
            duration="slow"
            distance="normal"
          >
            <SaunaSummary
              insights={
                profileInsights
              }
            />
          </ScrollReveal>

          <ScrollReveal
            delay={60}
            duration="slow"
            distance="normal"
          >
            <AnnualSaunaReport
              report={
                profileInsights.annualReport
              }
            />
          </ScrollReveal>

          <ScrollReveal
            duration="normal"
            distance="subtle"
          >
            <SaunaRhythmCard
              rhythm={saunaRhythm}
            />
          </ScrollReveal>

          <ScrollReveal
            delay={40}
            duration="normal"
            distance="subtle"
          >
            <SaunaPersonaCard
              persona={saunaPersona}
            />
          </ScrollReveal>

          <ScrollReveal
            delay={60}
            duration="normal"
            distance="subtle"
          >
            <NextAchievementCard
              achievement={
                nextAchievement
              }
            />
          </ScrollReveal>

          <ScrollReveal
            duration="slow"
            distance="normal"
          >
            <AchievementCard
              report={
                profileInsights.annualReport
              }
            />
          </ScrollReveal>

          <ScrollReveal
            delay={40}
            duration="normal"
            distance="subtle"
          >
            <XpStatusCard xp={xp} />
          </ScrollReveal>

          <ScrollReveal
            duration="slow"
            distance="normal"
          >
            <MonthlyActivityChart
              activities={
                profileInsights.monthlyActivities
              }
            />
          </ScrollReveal>

          <ScrollReveal
            delay={40}
            duration="slow"
            distance="normal"
          >
            <TopVisitedSaunas
              saunas={
                profileInsights.topVisitedSaunas
              }
            />
          </ScrollReveal>

          <ScrollReveal
            duration="normal"
            distance="subtle"
          >
            <AchievementBadges
              insights={
                profileInsights
              }
            />
          </ScrollReveal>

          <ScrollReveal
            delay={40}
            duration="slow"
            distance="normal"
          >
            <FavoriteSaunasSection
              userId={user.id}
            />
          </ScrollReveal>

          <section
            aria-labelledby="my-posts-heading"
            className="
              mt-14
              sm:mt-16
              lg:mt-20
            "
          >
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
                      size-9
                      items-center
                      justify-center
                      rounded-full
                      bg-accent/20
                      text-foreground
                    "
                  >
                    <Sparkles
                      className="size-4"
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
                    Sauna Journal
                  </p>
                </div>

                <h2
                  id="my-posts-heading"
                  className="
                    mt-5
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-4xl
                  "
                >
                  自分のサ活
                </h2>

                <p
                  className="
                    mt-3
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  これまでに残した整いの記録を、
                  ゆっくり振り返れます。
                </p>
              </div>

              <Link
                href="/posts/new"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "lg",
                  }),
                  "w-full px-5 sm:w-auto"
                )}
              >
                <PenLine
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-start"
                />

                サ活を記録する
              </Link>
            </div>

            <div
              className="
                mx-auto
                max-w-4xl
              "
            >
              {myPostsWithMeta.length ===
              0 ? (
                <EmptyState
                  eyebrow="Your First Journal"
                  icon={PenLine}
                  title="まだサ活の記録がありません"
                  description="訪れたサウナの感想やセット数を記録して、自分だけのサウナジャーナルを始めましょう。"
                  action={{
                    label:
                      "最初のサ活を投稿する",
                    href: "/posts/new",
                    icon: PenLine,
                  }}
                />
              ) : (
                <div
                  className="
                    space-y-8
                    sm:space-y-12
                  "
                >
                  {myPostsWithMeta.map(
                    ({
                      post,
                      likeCount,
                      liked,
                      bookmarked,
                      comments,
                      images,
                    }) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        author={
                          profile
                        }
                        userId={
                          user.id
                        }
                        initialLiked={
                          liked
                        }
                        initialLikeCount={
                          likeCount
                        }
                        initialBookmarked={
                          bookmarked
                        }
                        comments={
                          comments
                        }
                        images={images}
                        imageDisplayMode="cover"
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </>
  );
}
