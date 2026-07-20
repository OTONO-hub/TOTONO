import Link from "next/link";
import {
  Activity,
  ArrowRight,
  BadgeCheck,
  Building2,
  CalendarDays,
  Edit3,
  Flame,
  LockKeyhole,
  Map as MapIcon,
  PenLine,
  Sparkles,
  Star,
  Trophy,
  Users,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { FavoriteSaunasSection } from "@/components/profile/FavoriteSaunasSection";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { buttonVariants } from "@/components/ui/button";
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
import { getPosts } from "@/services/posts";
import {
  getProfile,
  getProfilesByUserIds,
} from "@/services/profile";
import type { CommentWithAuthor } from "@/types/comment";

export default async function ProfilePage() {
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

  /*
   * プロフィール未設定時
   */
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
              absolute -left-32 top-20
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
              border border-border/55
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

  /*
   * 投稿とフォロー数を取得します。
   */
  const [
    posts,
    followingCount,
    followerCount,
  ] = await Promise.all([
    getPosts(supabase),
    getFollowingCount(supabase, user.id),
    getFollowerCount(supabase, user.id),
  ]);

  const myPosts = posts.filter(
    (post) => post.user_id === user.id
  );

  const myPostIds = myPosts.map(
    (post) => post.id
  );

  /*
   * コメントとブックマークを並行して取得します。
   */
  const [
    comments,
    bookmarkedPostIds,
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
  ]);

  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds
  );

  /*
   * コメント投稿者のプロフィールを取得します。
   */
  const commentAuthorProfiles =
    await getProfilesByUserIds(
      supabase,
      comments.map(
        (comment) => comment.user_id
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

  /*
   * 投稿IDごとにコメントを分類します。
   */
  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
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

  /*
   * 投稿カードに必要な情報を取得します。
   */
  const myPostsWithMeta =
    await Promise.all(
      myPosts.map(async (post) => ({
        post,
        likeCount: await getLikeCount(
          supabase,
          post.id
        ),
        liked: await isLiked(
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
      }))
    );

  /*
   * 整いサマリーを計算します。
   * 既に取得している myPosts のみを使用するため、
   * DBやAPIへの追加アクセスはありません。
   */
  const totalSaunaVisits = myPosts.length;

  const visitedSaunas = new Set(
    myPosts
      .map((post) =>
        post.sauna_name
          .trim()
          .replace(/\\s+/g, " ")
          .toLocaleLowerCase("ja-JP")
      )
      .filter(Boolean)
  ).size;

  const ratings = myPosts
    .map((post) => post.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" &&
        Number.isFinite(rating)
    );

  const averageRating =
    ratings.length > 0
      ? (
          ratings.reduce(
            (total, rating) => total + rating,
            0
          ) / ratings.length
        ).toFixed(1)
      : "-";

  const highestRating =
    ratings.length > 0
      ? Math.max(...ratings).toFixed(1)
      : "-";

  /*
   * 実績バッジの達成状況を計算します。
   * DBは使わず、整いサマリーと同じ投稿データだけで判定します。
   */
  const hasFirstSteam = totalSaunaVisits >= 1;
  const hasSaunaLover = totalSaunaVisits >= 10;
  const hasExplorer = visitedSaunas >= 5;
  const hasPerfection = ratings.some(
    (rating) => rating === 5
  );

  const saunaLoverRemaining = Math.max(
    10 - totalSaunaVisits,
    0
  );

  const explorerRemaining = Math.max(
    5 - visitedSaunas,
    0
  );

  const memberSince = new Date(
    profile.created_at
  ).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
  });

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
          {/* プロフィールヘッダー */}
          <section
            aria-labelledby="profile-heading"
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            {/* 上部のラウンジ背景 */}
            <div
              className="
                relative
                h-28
                overflow-hidden
                border-b border-border/40
                bg-linear-to-br
                from-secondary/30
                via-background
                to-accent/15
                sm:h-36
              "
            >
              <div
                aria-hidden="true"
                className="
                  absolute -right-10 -top-16
                  size-52
                  rounded-full
                  bg-secondary/30
                  blur-3xl
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute -bottom-20 left-16
                  size-44
                  rounded-full
                  bg-accent/15
                  blur-3xl
                "
              />

              <p
                className="
                  absolute
                  right-6
                  top-6
                  text-[0.625rem]
                  font-semibold
                  uppercase
                  tracking-[0.28em]
                  text-muted-foreground/70
                  sm:right-8
                  sm:top-8
                "
              >
                My Sauna Lounge
              </p>
            </div>

            <div
              className="
                px-5
                pb-7
                sm:px-8
                sm:pb-9
                lg:px-10
              "
            >
              <div
                className="
                  -mt-12
                  flex
                  flex-col
                  gap-6
                  sm:-mt-14
                  lg:flex-row
                  lg:items-end
                  lg:justify-between
                "
              >
                <div
                  className="
                    flex
                    flex-col
                    items-center
                    gap-5
                    text-center
                    sm:flex-row
                    sm:items-end
                    sm:text-left
                  "
                >
                  <div
                    className="
                      rounded-full
                      border-4
                      border-card
                      bg-card
                      shadow-md
                    "
                  >
                    <ProfileAvatar
                      avatarUrl={
                        profile.avatar_url
                      }
                      username={
                        profile.username
                      }
                      size="xl"
                    />
                  </div>

                  <div className="min-w-0 pb-1">
                    <p
                      className="
                        text-[0.6875rem]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-muted-foreground
                      "
                    >
                      TOTONO Member
                    </p>

                    <h1
                      id="profile-heading"
                      className="
                        mt-2
                        wrap-break-word
                        text-3xl
                        font-semibold
                        tracking-[-0.04em]
                        text-foreground
                        sm:text-4xl
                      "
                    >
                      @
                      {profile.username ||
                        "ユーザー"}
                    </h1>
                  </div>
                </div>

                <Link
                  href="/profile/edit"
                  className={cn(
                    buttonVariants({
                      variant:
                        "totonoOutline",
                      size: "lg",
                    }),
                    "w-full px-5 sm:w-auto"
                  )}
                >
                  <Edit3
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-start"
                  />

                  プロフィール編集
                </Link>
              </div>

              <div
                className="
                  mt-7
                  grid
                  gap-6
                  border-t border-border/45
                  pt-7
                  lg:grid-cols-[minmax(0,1fr)_auto]
                  lg:items-end
                "
              >
                {/* 自己紹介 */}
                <div className="max-w-2xl">
                  <p
                    className="
                      text-[0.6875rem]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-muted-foreground
                    "
                  >
                    About
                  </p>

                  <p
                    className="
                      mt-3
                      whitespace-pre-wrap
                      wrap-break-word
                      text-sm
                      leading-7
                      text-foreground/80
                      sm:text-base
                      sm:leading-8
                    "
                  >
                    {profile.bio ||
                      "自己紹介はまだありません。プロフィール編集から、好きなサウナやサ活について書いてみましょう。"}
                  </p>

                  <div
                    className="
                      mt-4
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-muted-foreground
                    "
                  >
                    <CalendarDays
                      className="size-3.5"
                      strokeWidth={1.7}
                    />

                    <span>
                      {memberSince}から利用
                    </span>
                  </div>
                </div>

                {/* 投稿・フォロー数 */}
                <dl
                  className="
                    grid
                    grid-cols-3
                    overflow-hidden
                    rounded-2xl
                    border border-border/50
                    bg-background/45
                  "
                >
                  <div
                    className="
                      min-w-0
                      px-4
                      py-4
                      text-center
                      sm:px-6
                    "
                  >
                    <dt
                      className="
                        text-[0.6875rem]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      投稿
                    </dt>

                    <dd
                      className="
                        mt-1
                        text-xl
                        font-semibold
                        tabular-nums
                        text-foreground
                      "
                    >
                      {myPosts.length}
                    </dd>
                  </div>

                  <div
                    className="
                      min-w-0
                      border-x
                      border-border/45
                      px-4
                      py-4
                      text-center
                      sm:px-6
                    "
                  >
                    <dt
                      className="
                        text-[0.6875rem]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      フォロー
                    </dt>

                    <dd
                      className="
                        mt-1
                        text-xl
                        font-semibold
                        tabular-nums
                        text-foreground
                      "
                    >
                      {followingCount}
                    </dd>
                  </div>

                  <div
                    className="
                      min-w-0
                      px-4
                      py-4
                      text-center
                      sm:px-6
                    "
                  >
                    <dt
                      className="
                        text-[0.6875rem]
                        font-medium
                        text-muted-foreground
                      "
                    >
                      フォロワー
                    </dt>

                    <dd
                      className="
                        mt-1
                        text-xl
                        font-semibold
                        tabular-nums
                        text-foreground
                      "
                    >
                      {followerCount}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
                    </section>

          {/* 整いサマリー */}
          <section
            aria-labelledby="sauna-summary-heading"
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
                  gap-4
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
                        bg-secondary/25
                        text-foreground
                      "
                    >
                      <Activity
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
                      Sauna Summary
                    </p>
                  </div>

                  <h2
                    id="sauna-summary-heading"
                    className="
                      mt-4
                      text-2xl
                      font-semibold
                      tracking-[-0.035em]
                      text-foreground
                      sm:text-3xl
                    "
                  >
                    整いサマリー
                  </h2>
                </div>

                <p
                  className="
                    max-w-md
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  これまでに記録したサ活から、
                  あなたの整いの歩みをまとめています。
                </p>
              </div>

              <dl
                className="
                  grid
                  grid-cols-2
                  divide-x
                  divide-y
                  divide-border/45
                  sm:grid-cols-4
                  sm:divide-y-0
                "
              >
                <div
                  className="
                    min-w-0
                    bg-background/25
                    px-5
                    py-6
                    sm:px-6
                    sm:py-7
                    lg:px-8
                  "
                >
                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-accent/20
                      text-foreground
                    "
                  >
                    <Activity
                      className="size-4.5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <dt
                    className="
                      mt-5
                      text-xs
                      font-medium
                      text-muted-foreground
                    "
                  >
                    総サ活数
                  </dt>

                  <dd
                    className="
                      mt-2
                      flex
                      items-baseline
                      gap-1.5
                      text-3xl
                      font-semibold
                      tracking-[-0.04em]
                      text-foreground
                    "
                  >
                    <span className="tabular-nums">
                      {totalSaunaVisits}
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        tracking-normal
                        text-muted-foreground
                      "
                    >
                      回
                    </span>
                  </dd>
                </div>

                <div
                  className="
                    min-w-0
                    bg-background/25
                    px-5
                    py-6
                    sm:px-6
                    sm:py-7
                    lg:px-8
                  "
                >
                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-secondary/25
                      text-foreground
                    "
                  >
                    <Building2
                      className="size-4.5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <dt
                    className="
                      mt-5
                      text-xs
                      font-medium
                      text-muted-foreground
                    "
                  >
                    訪問施設数
                  </dt>

                  <dd
                    className="
                      mt-2
                      flex
                      items-baseline
                      gap-1.5
                      text-3xl
                      font-semibold
                      tracking-[-0.04em]
                      text-foreground
                    "
                  >
                    <span className="tabular-nums">
                      {visitedSaunas}
                    </span>

                    <span
                      className="
                        text-xs
                        font-medium
                        tracking-normal
                        text-muted-foreground
                      "
                    >
                      施設
                    </span>
                  </dd>
                </div>

                <div
                  className="
                    min-w-0
                    bg-background/25
                    px-5
                    py-6
                    sm:px-6
                    sm:py-7
                    lg:px-8
                  "
                >
                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-accent/20
                      text-foreground
                    "
                  >
                    <Star
                      className="size-4.5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <dt
                    className="
                      mt-5
                      text-xs
                      font-medium
                      text-muted-foreground
                    "
                  >
                    平均評価
                  </dt>

                  <dd
                    className="
                      mt-2
                      flex
                      items-baseline
                      gap-1.5
                      text-3xl
                      font-semibold
                      tracking-[-0.04em]
                      text-foreground
                    "
                  >
                    <span className="tabular-nums">
                      {averageRating}
                    </span>

                    {averageRating !== "-" && (
                      <span
                        className="
                          text-xs
                          font-medium
                          tracking-normal
                          text-muted-foreground
                        "
                      >
                        / 5.0
                      </span>
                    )}
                  </dd>
                </div>

                <div
                  className="
                    min-w-0
                    bg-background/25
                    px-5
                    py-6
                    sm:px-6
                    sm:py-7
                    lg:px-8
                  "
                >
                  <div
                    className="
                      flex
                      size-10
                      items-center
                      justify-center
                      rounded-2xl
                      bg-secondary/25
                      text-foreground
                    "
                  >
                    <Trophy
                      className="size-4.5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <dt
                    className="
                      mt-5
                      text-xs
                      font-medium
                      text-muted-foreground
                    "
                  >
                    最高評価
                  </dt>

                  <dd
                    className="
                      mt-2
                      flex
                      items-baseline
                      gap-1.5
                      text-3xl
                      font-semibold
                      tracking-[-0.04em]
                      text-foreground
                    "
                  >
                    <span className="tabular-nums">
                      {highestRating}
                    </span>

                    {highestRating !== "-" && (
                      <span
                        className="
                          text-xs
                          font-medium
                          tracking-normal
                          text-muted-foreground
                        "
                      >
                        / 5.0
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </div>
          </section>

          {/* 実績・バッジ */}
          <section
            aria-labelledby="achievements-heading"
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
                  gap-4
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
                      <Trophy
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
                      Achievements
                    </p>
                  </div>

                  <h2
                    id="achievements-heading"
                    className="
                      mt-4
                      text-2xl
                      font-semibold
                      tracking-[-0.035em]
                      text-foreground
                      sm:text-3xl
                    "
                  >
                    サ活の実績
                  </h2>
                </div>

                <p
                  className="
                    max-w-md
                    text-sm
                    leading-7
                    text-muted-foreground
                  "
                >
                  記録を重ねるほど、新しいバッジが解放されます。
                  次の整いを目指してみましょう。
                </p>
              </div>

              <div
                className="
                  grid
                  gap-4
                  p-5
                  sm:grid-cols-2
                  sm:p-8
                  lg:grid-cols-4
                  lg:p-10
                "
              >
                <article
                  className={cn(
                    `
                      relative
                      overflow-hidden
                      rounded-[1.75rem]
                      border
                      p-5
                      transition-transform
                      duration-300
                      sm:p-6
                    `,
                    hasFirstSteam
                      ? `
                          border-accent/35
                          bg-accent/10
                          hover:-translate-y-1
                        `
                      : `
                          border-border/50
                          bg-background/35
                        `
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      `
                        absolute -right-8 -top-8
                        size-24
                        rounded-full
                        blur-2xl
                      `,
                      hasFirstSteam
                        ? "bg-accent/25"
                        : "bg-muted/60"
                    )}
                  />

                  <div
                    className={cn(
                      `
                        relative
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-2xl
                      `,
                      hasFirstSteam
                        ? "bg-accent/25 text-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Sparkles
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p
                    className="
                      relative
                      mt-5
                      text-[0.6875rem]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-muted-foreground
                    "
                  >
                    First Steam
                  </p>

                  <h3
                    className="
                      relative
                      mt-2
                      text-lg
                      font-semibold
                      tracking-[-0.025em]
                      text-foreground
                    "
                  >
                    はじめての整い
                  </h3>

                  <p
                    className="
                      relative
                      mt-3
                      min-h-12
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    最初のサ活を記録すると獲得できます。
                  </p>

                  <div
                    className={cn(
                      `
                        relative
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                      `,
                      hasFirstSteam
                        ? `
                            bg-success/15
                            text-success
                          `
                        : `
                            bg-muted
                            text-muted-foreground
                          `
                    )}
                  >
                    {hasFirstSteam ? (
                      <>
                        <BadgeCheck
                          className="size-3.5"
                          strokeWidth={2}
                        />
                        達成済み
                      </>
                    ) : (
                      <>
                        <LockKeyhole
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                        あと1投稿
                      </>
                    )}
                  </div>
                </article>

                <article
                  className={cn(
                    `
                      relative
                      overflow-hidden
                      rounded-[1.75rem]
                      border
                      p-5
                      transition-transform
                      duration-300
                      sm:p-6
                    `,
                    hasSaunaLover
                      ? `
                          border-accent/35
                          bg-accent/10
                          hover:-translate-y-1
                        `
                      : `
                          border-border/50
                          bg-background/35
                        `
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      `
                        absolute -right-8 -top-8
                        size-24
                        rounded-full
                        blur-2xl
                      `,
                      hasSaunaLover
                        ? "bg-accent/25"
                        : "bg-muted/60"
                    )}
                  />

                  <div
                    className={cn(
                      `
                        relative
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-2xl
                      `,
                      hasSaunaLover
                        ? "bg-accent/25 text-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Flame
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p
                    className="
                      relative
                      mt-5
                      text-[0.6875rem]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-muted-foreground
                    "
                  >
                    Sauna Lover
                  </p>

                  <h3
                    className="
                      relative
                      mt-2
                      text-lg
                      font-semibold
                      tracking-[-0.025em]
                      text-foreground
                    "
                  >
                    サウナ愛好家
                  </h3>

                  <p
                    className="
                      relative
                      mt-3
                      min-h-12
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    サ活を10回記録すると獲得できます。
                  </p>

                  <div
                    className={cn(
                      `
                        relative
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                      `,
                      hasSaunaLover
                        ? `
                            bg-success/15
                            text-success
                          `
                        : `
                            bg-muted
                            text-muted-foreground
                          `
                    )}
                  >
                    {hasSaunaLover ? (
                      <>
                        <BadgeCheck
                          className="size-3.5"
                          strokeWidth={2}
                        />
                        達成済み
                      </>
                    ) : (
                      <>
                        <LockKeyhole
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                        あと{saunaLoverRemaining}投稿
                      </>
                    )}
                  </div>
                </article>

                <article
                  className={cn(
                    `
                      relative
                      overflow-hidden
                      rounded-[1.75rem]
                      border
                      p-5
                      transition-transform
                      duration-300
                      sm:p-6
                    `,
                    hasExplorer
                      ? `
                          border-secondary/45
                          bg-secondary/10
                          hover:-translate-y-1
                        `
                      : `
                          border-border/50
                          bg-background/35
                        `
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      `
                        absolute -right-8 -top-8
                        size-24
                        rounded-full
                        blur-2xl
                      `,
                      hasExplorer
                        ? "bg-secondary/30"
                        : "bg-muted/60"
                    )}
                  />

                  <div
                    className={cn(
                      `
                        relative
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-2xl
                      `,
                      hasExplorer
                        ? "bg-secondary/30 text-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <MapIcon
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p
                    className="
                      relative
                      mt-5
                      text-[0.6875rem]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-muted-foreground
                    "
                  >
                    Explorer
                  </p>

                  <h3
                    className="
                      relative
                      mt-2
                      text-lg
                      font-semibold
                      tracking-[-0.025em]
                      text-foreground
                    "
                  >
                    サウナ探訪者
                  </h3>

                  <p
                    className="
                      relative
                      mt-3
                      min-h-12
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    5つの異なる施設を記録すると獲得できます。
                  </p>

                  <div
                    className={cn(
                      `
                        relative
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                      `,
                      hasExplorer
                        ? `
                            bg-success/15
                            text-success
                          `
                        : `
                            bg-muted
                            text-muted-foreground
                          `
                    )}
                  >
                    {hasExplorer ? (
                      <>
                        <BadgeCheck
                          className="size-3.5"
                          strokeWidth={2}
                        />
                        達成済み
                      </>
                    ) : (
                      <>
                        <LockKeyhole
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                        あと{explorerRemaining}施設
                      </>
                    )}
                  </div>
                </article>

                <article
                  className={cn(
                    `
                      relative
                      overflow-hidden
                      rounded-[1.75rem]
                      border
                      p-5
                      transition-transform
                      duration-300
                      sm:p-6
                    `,
                    hasPerfection
                      ? `
                          border-secondary/45
                          bg-secondary/10
                          hover:-translate-y-1
                        `
                      : `
                          border-border/50
                          bg-background/35
                        `
                  )}
                >
                  <div
                    aria-hidden="true"
                    className={cn(
                      `
                        absolute -right-8 -top-8
                        size-24
                        rounded-full
                        blur-2xl
                      `,
                      hasPerfection
                        ? "bg-secondary/30"
                        : "bg-muted/60"
                    )}
                  />

                  <div
                    className={cn(
                      `
                        relative
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-2xl
                      `,
                      hasPerfection
                        ? "bg-secondary/30 text-foreground"
                        : "bg-muted text-muted-foreground"
                    )}
                  >
                    <Star
                      className="size-5"
                      strokeWidth={1.8}
                    />
                  </div>

                  <p
                    className="
                      relative
                      mt-5
                      text-[0.6875rem]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-muted-foreground
                    "
                  >
                    Perfection
                  </p>

                  <h3
                    className="
                      relative
                      mt-2
                      text-lg
                      font-semibold
                      tracking-[-0.025em]
                      text-foreground
                    "
                  >
                    至高の整い
                  </h3>

                  <p
                    className="
                      relative
                      mt-3
                      min-h-12
                      text-sm
                      leading-6
                      text-muted-foreground
                    "
                  >
                    評価5.0のサ活を記録すると獲得できます。
                  </p>

                  <div
                    className={cn(
                      `
                        relative
                        mt-5
                        inline-flex
                        items-center
                        gap-2
                        rounded-full
                        px-3
                        py-1.5
                        text-xs
                        font-semibold
                      `,
                      hasPerfection
                        ? `
                            bg-success/15
                            text-success
                          `
                        : `
                            bg-muted
                            text-muted-foreground
                          `
                    )}
                  >
                    {hasPerfection ? (
                      <>
                        <BadgeCheck
                          className="size-3.5"
                          strokeWidth={2}
                        />
                        達成済み
                      </>
                    ) : (
                      <>
                        <LockKeyhole
                          className="size-3.5"
                          strokeWidth={1.8}
                        />
                        未達成
                      </>
                    )}
                  </div>
                </article>
              </div>
            </div>
          </section>

          <FavoriteSaunasSection userId={user.id} />

          {/* 自分の投稿 */}
          <section
            aria-labelledby="my-posts-heading"
            className="mt-14 sm:mt-16 lg:mt-20"
          >
            <div
              className="
                mb-8
                flex
                flex-col
                gap-5
                border-b border-border/55
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

            <div className="mx-auto max-w-4xl">
              {myPostsWithMeta.length === 0 ? (
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
                      flex
                      size-14
                      items-center
                      justify-center
                      rounded-full
                      bg-secondary/25
                      text-foreground
                    "
                  >
                    <PenLine
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
                    まだサ活の記録がありません
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
                    訪れたサウナの感想やセット数を記録して、
                    自分だけのサウナジャーナルを始めましょう。
                  </p>

                  <Link
                    href="/posts/new"
                    className={cn(
                      buttonVariants({
                        variant: "totono",
                        size: "xl",
                      }),
                      "mt-8"
                    )}
                  >
                    最初のサ活を投稿する

                    <ArrowRight
                      className="size-4"
                      strokeWidth={1.8}
                      data-icon="inline-end"
                    />
                  </Link>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-12">
                  {myPostsWithMeta.map(
                    ({
                      post,
                      likeCount,
                      liked,
                      bookmarked,
                      comments,
                    }) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        author={profile}
                        userId={user.id}
                        initialLiked={liked}
                        initialLikeCount={
                          likeCount
                        }
                        initialBookmarked={
                          bookmarked
                        }
                        comments={comments}
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
