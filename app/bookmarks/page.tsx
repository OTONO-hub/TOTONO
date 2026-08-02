import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  BookOpen,
  Compass,
  LogIn,
  Search,
  Sparkles,
} from "lucide-react";

import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import {
  getAllBookmarkedPostIds,
  getBookmarkedPostIds,
} from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getPostImagesByPostIds } from "@/services/post-images";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getPostsByIds } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import type { CommentWithAuthor } from "@/types/comment";

export default async function BookmarksPage() {
  const supabase =
    await createClient();

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
            pb-28
            pt-28
            sm:px-6
            sm:pt-32
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              -right-36
              top-16
              size-112
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
              top-[34rem]
              size-96
              rounded-full
              bg-accent/10
              blur-3xl
            "
          />

          <section
            aria-labelledby="bookmarks-login-heading"
            className="
              relative
              mx-auto
              max-w-2xl
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            <div
              className="
                bg-linear-to-br
                from-secondary/25
                via-background
                to-accent/10
                px-6
                py-14
                text-center
                sm:px-10
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
                  border
                  border-border/50
                  bg-card/75
                  text-foreground
                  shadow-sm
                "
              >
                <Bookmark
                  className="size-6"
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
                Saved Journal
              </p>

              <h1
                id="bookmarks-login-heading"
                className="
                  mt-4
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-4xl
                "
              >
                保存したサ活を見る
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
                気になった施設や、
                また読み返したいサ活を保存できます。
                保存済みの投稿を見るにはログインしてください。
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
                <LogIn
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-start"
                />

                ログインする
              </Link>
            </div>
          </section>
        </main>
      </>
    );
  }

  const bookmarkedPostIds =
    await getAllBookmarkedPostIds(
      supabase,
      user.id
    );

  const posts =
    bookmarkedPostIds.length > 0
      ? await getPostsByIds(
          supabase,
          bookmarkedPostIds
        )
      : [];

  const postIds = posts.map(
    (post) => post.id
  );

  const [
    comments,
    confirmedBookmarkedPostIds,
    postImagesByPostId,
  ] = await Promise.all([
    getCommentsByPostIds(
      supabase,
      postIds
    ),
    getBookmarkedPostIds(
      supabase,
      user.id,
      postIds
    ),
    getPostImagesByPostIds(
      supabase,
      postIds
    ),
  ]);

  const authorIds = [
    ...posts.map(
      (post) => post.user_id
    ),
    ...comments.map(
      (comment) => comment.user_id
    ),
  ];

  const profiles =
    await getProfilesByUserIds(
      supabase,
      authorIds
    );

  const profileByUserId =
    new Map(
      profiles.map((profile) => [
        profile.id,
        profile,
      ])
    );

  const commentsByPostId =
    new Map<
      string,
      CommentWithAuthor[]
    >();

  for (const comment of comments) {
    const commentWithAuthor:
      CommentWithAuthor = {
      comment,
      author:
        profileByUserId.get(
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

  const bookmarkedPostIdSet =
    new Set(
      confirmedBookmarkedPostIds
    );

  const postsWithMeta =
    await Promise.all(
      posts.map(
        async (post) => ({
          post,
          author:
            profileByUserId.get(
              post.user_id
            ) ?? null,
          initialLiked:
            await isLiked(
              supabase,
              user.id,
              post.id
            ),
          initialLikeCount:
            await getLikeCount(
              supabase,
              post.id
            ),
          initialBookmarked:
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

  return (
    <>
      <Header />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-muted/25
          pb-32
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
            -right-44
            top-16
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
            -left-48
            top-[44rem]
            size-112
            rounded-full
            bg-accent/10
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
            <section
            aria-labelledby="bookmarks-heading"
            className="
              relative
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-24
                -top-28
                size-80
                rounded-full
                bg-secondary/30
                blur-3xl
              "
            />

            <div
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -bottom-32
                left-16
                size-72
                rounded-full
                bg-accent/15
                blur-3xl
              "
            />

            <div
              className="
                relative
                bg-linear-to-br
                from-secondary/25
                via-background
                to-accent/10
                px-6
                py-10
                sm:px-8
                sm:py-12
                lg:px-10
              "
            >
              <div
                className="
                  flex
                  flex-col
                  gap-8
                  lg:flex-row
                  lg:items-end
                  lg:justify-between
                "
              >
                <div className="max-w-3xl">
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      border-border/55
                      bg-card/70
                      px-3.5
                      py-2
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.22em]
                      text-muted-foreground
                      shadow-sm
                    "
                  >
                    <Bookmark
                      className="
                        size-3.5
                        text-foreground
                      "
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Saved Journal
                  </div>

                  <h1
                    id="bookmarks-heading"
                    className="
                      mt-6
                      text-4xl
                      font-semibold
                      tracking-[-0.05em]
                      text-foreground
                      sm:text-5xl
                    "
                  >
                    保存したサ活
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
                    気になる施設や、
                    次のサウナ選びで参考にしたい記録を
                    ここからいつでも振り返れます。
                  </p>
                </div>

                <div
                  className="
                    flex
                    w-fit
                    items-center
                    gap-4
                    rounded-[1.5rem]
                    border
                    border-border/55
                    bg-card/75
                    px-5
                    py-4
                    shadow-sm
                  "
                >
                  <span
                    className="
                      flex
                      size-11
                      items-center
                      justify-center
                      rounded-full
                      bg-accent/20
                      text-foreground
                    "
                  >
                    <BookOpen
                      className="size-4.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <div>
                    <p
                      className="
                        text-[0.625rem]
                        font-semibold
                        uppercase
                        tracking-[0.2em]
                        text-muted-foreground
                      "
                    >
                      Saved Posts
                    </p>

                    <p
                      className="
                        mt-1
                        text-2xl
                        font-semibold
                        tracking-[-0.03em]
                        text-foreground
                      "
                    >
                      {posts.length}

                      <span
                        className="
                          ml-1
                          text-xs
                          font-medium
                          text-muted-foreground
                        "
                      >
                        件
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>
          </FadeIn>

          <ScrollReveal
            duration="slow"
            distance="normal"
          >
          {postsWithMeta.length ===
          0 ? (
            <EmptyState
              className="mt-10"
              eyebrow="Your Collection"
              icon={Bookmark}
              title="まだ保存したサ活がありません"
              description="Communityや検索画面で気になる投稿を見つけたら、ブックマークボタンから保存してみましょう。"
              action={{
                label: "Communityを見る",
                href: "/community",
                icon: Compass,
              }}
              secondaryAction={{
                label: "サウナを探す",
                href: "/search",
                icon: Search,
              }}
            />
          ) : (
            <section
              aria-labelledby="saved-posts-heading"
              className="
                mt-14
                sm:mt-16
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
                      Saved Collection
                    </p>
                  </div>

                  <h2
                    id="saved-posts-heading"
                    className="
                      mt-5
                      text-3xl
                      font-semibold
                      tracking-[-0.04em]
                      text-foreground
                      sm:text-4xl
                    "
                  >
                    保存した記録
                  </h2>

                  <p
                    className="
                      mt-3
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    保存した順番に関係なく、
                    気になるサ活をまとめて確認できます。
                  </p>
                </div>

                <Link
                  href="/search"
                  className={cn(
                    buttonVariants({
                      variant:
                        "totonoOutline",
                      size: "lg",
                    }),
                    "w-full sm:w-auto"
                  )}
                >
                  <Search
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-start"
                  />

                  さらに探す
                </Link>
              </div>

              <div
                className="
                  mx-auto
                  max-w-4xl
                  space-y-8
                  sm:space-y-12
                "
              >
                {postsWithMeta.map(
                  ({
                    post,
                    author,
                    initialLiked,
                    initialLikeCount,
                    initialBookmarked,
                    comments,
                    images,
                  }) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      author={author}
                      userId={user.id}
                      initialLiked={
                        initialLiked
                      }
                      initialLikeCount={
                        initialLikeCount
                      }
                      initialBookmarked={
                        initialBookmarked
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
            </section>
          )}

          </ScrollReveal>

          <ScrollReveal
            delay={60}
            duration="normal"
            distance="subtle"
          >
          <section
            aria-labelledby="bookmarks-next-heading"
            className="
              mt-12
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/80
              p-6
              shadow-sm
              backdrop-blur-md
              sm:p-8
            "
          >
            <div
              className="
                flex
                flex-col
                gap-6
                sm:flex-row
                sm:items-center
                sm:justify-between
              "
            >
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
                  Next Sauna
                </p>

                <h2
                  id="bookmarks-next-heading"
                  className="
                    mt-3
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  次の行き先を探す
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
                  保存した記録を振り返ったら、
                  検索画面から新しい施設も探してみましょう。
                </p>
              </div>

              <Link
                href="/search"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "lg",
                  }),
                  "w-full sm:w-auto"
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
          </section>
          </ScrollReveal>
        </div>
      </main>

      <AppMobileNavigation />
    </>
  );
}
