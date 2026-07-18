import Link from "next/link";
import {
  ArrowRight,
  PenLine,
  Sparkles,
} from "lucide-react";

import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { Hero } from "@/components/home/Hero";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { PopularSaunas } from "@/components/saunas/PopularSaunas";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getPosts } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import { getPopularSaunas } from "@/services/saunas";
import type { CommentWithAuthor } from "@/types/comment";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * 未ログイン時は、
   * サービス紹介用のトップページを表示します。
   */
  if (!user) {
    return (
      <>
        <Header />

        <main>
          <Hero />
          <HomeHighlights />
          <FeaturedArticles />
        </main>
      </>
    );
  }

  /*
   * 投稿と人気施設を並行して取得します。
   */
  const [posts, popularSaunas] =
    await Promise.all([
      getPosts(supabase),
      getPopularSaunas(supabase, 3),
    ]);

  const postIds = posts.map(
    (post) => post.id
  );

  /*
   * 投稿に紐づくコメントを取得します。
   */
  const comments =
    await getCommentsByPostIds(
      supabase,
      postIds
    );

  /*
   * ログインユーザーが保存している投稿IDを
   * まとめて取得します。
   */
  const bookmarkedPostIds =
    await getBookmarkedPostIds(
      supabase,
      user.id,
      postIds
    );

  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds
  );

  /*
   * 投稿者とコメント投稿者のIDをまとめます。
   */
  const userIds = [
    ...posts.map(
      (post) => post.user_id
    ),
    ...comments.map(
      (comment) => comment.user_id
    ),
  ];

  /*
   * 必要なプロフィールをまとめて取得します。
   */
  const profiles =
    await getProfilesByUserIds(
      supabase,
      userIds
    );

  const profilesByUserId = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
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
   * 各投稿に表示するメタ情報を取得します。
   */
  const postsWithMeta =
    await Promise.all(
      posts.map(async (post) => ({
        post,
        author:
          profilesByUserId.get(
            post.user_id
          ) ?? null,
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

  return (
    <>
      <Header />

      <main className="min-h-screen overflow-hidden bg-background pt-20">
        <HomeHighlights />

        <FeaturedArticles />

        {/* 人気サウナ施設 */}
        {popularSaunas.length > 0 && (
          <section
            aria-labelledby="popular-saunas-heading"
            className="
              relative
              border-t border-border/40
              bg-background
              py-16
              sm:py-20
              lg:py-24
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute -left-32 top-0
                size-80
                rounded-full
                bg-secondary/10
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
              <div className="sr-only">
                <h2 id="popular-saunas-heading">
                  人気のサウナ施設
                </h2>
              </div>

              <PopularSaunas
                saunas={popularSaunas}
              />
            </div>
          </section>
        )}

        {/* タイムライン */}
        <section
          id="community"
          aria-labelledby="community-heading"
          className="
            relative
            border-t border-border/40
            bg-muted/25
            py-16
            sm:py-20
            lg:py-28
          "
        >
          {/* 背景装飾 */}
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -right-40 -top-20
              size-[30rem]
              rounded-full
              bg-primary/5
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -bottom-48 -left-40
              size-[28rem]
              rounded-full
              bg-secondary/10
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
            {/* セクション見出し */}
            <div
              className="
                mb-10
                rounded-[2rem]
                border border-border/50
                bg-card/75
                px-5
                py-6
                shadow-sm
                backdrop-blur-md
                sm:mb-14
                sm:px-8
                sm:py-8
                lg:flex
                lg:items-end
                lg:justify-between
                lg:gap-12
              "
            >
              <div className="max-w-2xl">
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
                      tracking-[0.28em]
                      text-muted-foreground
                    "
                  >
                    Community
                  </p>
                </div>

                <h1
                  id="community-heading"
                  className="
                    mt-5
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-4xl
                    lg:text-5xl
                  "
                >
                  みんなのサ活
                </h1>

                <p
                  className="
                    mt-4
                    max-w-xl
                    text-sm
                    leading-7
                    text-muted-foreground
                    sm:text-base
                    sm:leading-8
                  "
                >
                  サウナを愛する人たちが残した、
                  今日の体験と整いの記録。
                  次のサウナ選びにつながる発見を
                  ゆっくり眺めてみましょう。
                </p>
              </div>

              <Link
                href="/posts/new"
                className="
                  mt-6
                  inline-flex
                  min-h-12
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-primary
                  px-6
                  text-sm
                  font-semibold
                  text-primary-foreground
                  shadow-sm
                  transition
                  duration-200
                  hover:-translate-y-0.5
                  hover:shadow-md
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-card
                  active:translate-y-0
                  lg:mt-0
                  lg:w-auto
                "
              >
                <PenLine
                  className="size-4"
                  strokeWidth={1.8}
                />

                サ活を記録する

                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                />
              </Link>
            </div>

            {/* 投稿一覧 */}
            <div className="mx-auto max-w-4xl">
              {postsWithMeta.length === 0 ? (
                <div
                  className="
                    rounded-[2rem]
                    border border-border/60
                    bg-card
                    px-6
                    py-16
                    text-center
                    shadow-sm
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
                      bg-secondary/20
                      text-foreground
                    "
                  >
                    <PenLine
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
                    まだサ活の記録がありません
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
                    最初のサ活を投稿して、
                    TOTONOのコミュニティを
                    始めましょう。
                  </p>

                  <Link
                    href="/posts/new"
                    className="
                      mt-7
                      inline-flex
                      min-h-11
                      items-center
                      justify-center
                      gap-2
                      rounded-full
                      bg-primary
                      px-6
                      text-sm
                      font-semibold
                      text-primary-foreground
                      transition
                      duration-200
                      hover:-translate-y-0.5
                      hover:shadow-md
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-ring
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-card
                      active:translate-y-0
                    "
                  >
                    最初のサ活を投稿する

                    <ArrowRight
                      className="size-4"
                      strokeWidth={1.8}
                    />
                  </Link>
                </div>
              ) : (
                <div className="space-y-8 sm:space-y-12">
                  {postsWithMeta.map(
                    ({
                      post,
                      author,
                      likeCount,
                      liked,
                      bookmarked,
                      comments: postComments,
                    }) => (
                      <PostCard
                        key={post.id}
                        post={post}
                        author={author}
                        userId={user.id}
                        initialLiked={liked}
                        initialLikeCount={
                          likeCount
                        }
                        initialBookmarked={
                          bookmarked
                        }
                        comments={
                          postComments
                        }
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  );
}