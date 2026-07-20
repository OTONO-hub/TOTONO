import Link from "next/link";
import {
  ArrowRight,
  Bookmark,
  Compass,
  LogIn,
  Sparkles,
} from "lucide-react";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { getAllBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPostsByIds } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import type { CommentWithAuthor } from "@/types/comment";

export default async function BookmarksPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />

        <BookmarksPageShell>
          <LoginRequiredState />
        </BookmarksPageShell>
      </>
    );
  }

  const bookmarkedPostIds =
    await getAllBookmarkedPostIds(
      supabase,
      user.id
    );

  const posts = await getPostsByIds(
    supabase,
    bookmarkedPostIds
  );

  const comments = await getCommentsByPostIds(
    supabase,
    posts.map((post) => post.id)
  );

  const userIds = [
    ...posts.map((post) => post.user_id),
    ...comments.map((comment) => comment.user_id),
  ];

  const profiles = await getProfilesByUserIds(
    supabase,
    userIds
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ])
  );

  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
      comment,
      author:
        profilesByUserId.get(comment.user_id) ??
        null,
    };

    const currentComments =
      commentsByPostId.get(comment.post_id) ?? [];

    currentComments.push(commentWithAuthor);

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds
  );

  const postsWithMeta = await Promise.all(
    posts.map(async (post) => ({
      post,
      author:
        profilesByUserId.get(post.user_id) ??
        null,
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
        bookmarkedPostIdSet.has(post.id),
      comments:
        commentsByPostId.get(post.id) ?? [],
    }))
  );

  return (
    <>
      <Header />

      <BookmarksPageShell>
        <BookmarksHero
          savedCount={postsWithMeta.length}
        />

        {postsWithMeta.length === 0 ? (
          <EmptyBookmarksState />
        ) : (
          <section
            aria-labelledby="saved-posts-heading"
            className="mt-12 sm:mt-16"
          >
            <div
              className="
                flex
                flex-col
                gap-4
                sm:flex-row
                sm:items-end
                sm:justify-between
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-muted-foreground
                  "
                >
                  Saved Journals
                </p>

                <h2
                  id="saved-posts-heading"
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tracking-[-0.03em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  保存したサ活
                </h2>
              </div>

              <p
                className="
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                気になる投稿を、いつでもここから見返せます。
              </p>
            </div>

            <div
              className="
                mx-auto
                mt-8
                max-w-4xl
                space-y-8
                sm:mt-10
                sm:space-y-12
              "
            >
              {postsWithMeta.map(
                ({
                  post,
                  author,
                  likeCount,
                  liked,
                  bookmarked,
                  comments,
                }) => (
                  <PostCard
                    key={post.id}
                    post={post}
                    author={author}
                    userId={user.id}
                    initialLiked={liked}
                    initialLikeCount={likeCount}
                    initialBookmarked={
                      bookmarked
                    }
                    comments={comments}
                  />
                )
              )}
            </div>
          </section>
        )}
      </BookmarksPageShell>
    </>
  );
}

type BookmarksPageShellProps = {
  children: React.ReactNode;
};

function BookmarksPageShell({
  children,
}: BookmarksPageShellProps) {
  return (
    <main
      className="
        relative
        isolate
        min-h-screen
        overflow-hidden
        bg-muted/25
        px-4
        pb-20
        pt-8
        sm:px-6
        sm:pb-24
        sm:pt-10
        lg:px-8
        lg:pt-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-44
          top-8
          -z-10
          size-96
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
          -left-44
          top-[34rem]
          -z-10
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {children}
      </div>
    </main>
  );
}

type BookmarksHeroProps = {
  savedCount: number;
};

function BookmarksHero({
  savedCount,
}: BookmarksHeroProps) {
  return (
    <section
      aria-labelledby="bookmarks-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-10
        shadow-sm
        backdrop-blur-md
        sm:px-10
        sm:py-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          size-64
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-24
          left-[28%]
          size-56
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-8
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >
        <div className="max-w-2xl">
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
                bg-accent/20
                text-foreground
              "
            >
              <Bookmark
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              Your Sauna Collection
            </p>
          </div>

          <h1
            id="bookmarks-heading"
            className="
              mt-6
              text-3xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-4xl
            "
          >
            保存済み投稿
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
            あとで見返したいサ活や、
            次の休日に訪れたいサウナを
            自分だけのコレクションとして残せます。
          </p>
        </div>

        <div
          className="
            flex
            w-full
            items-center
            justify-between
            gap-4
            rounded-[1.5rem]
            border
            border-border/55
            bg-background/65
            px-5
            py-4
            shadow-sm
            sm:w-auto
            sm:min-w-52
          "
          aria-label={`保存済み投稿は${savedCount}件です`}
        >
          <div>
            <p
              className="
                text-xs
                text-muted-foreground
              "
            >
              保存している投稿
            </p>

            <p
              className="
                mt-1
                text-2xl
                font-semibold
                tabular-nums
                tracking-[-0.03em]
                text-foreground
              "
            >
              {savedCount}
              <span
                className="
                  ml-1
                  text-sm
                  font-normal
                  text-muted-foreground
                "
              >
                件
              </span>
            </p>
          </div>

          <span
            className="
              flex
              size-11
              items-center
              justify-center
              rounded-full
              bg-foreground
              text-background
            "
          >
            <Sparkles
              className="size-4.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </section>
  );
}

function EmptyBookmarksState() {
  return (
    <section
      aria-labelledby="empty-bookmarks-heading"
      className="
        relative
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-dashed
        border-border/70
        bg-card/70
        px-6
        py-14
        text-center
        sm:mt-12
        sm:px-10
        sm:py-16
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          size-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div className="relative z-10">
        <span
          className="
            mx-auto
            flex
            size-16
            items-center
            justify-center
            rounded-full
            border
            border-border/55
            bg-background/70
            text-muted-foreground
            shadow-sm
          "
        >
          <Bookmark
            className="size-6"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>

        <h2
          id="empty-bookmarks-heading"
          className="
            mt-6
            text-xl
            font-semibold
            tracking-[-0.025em]
            text-foreground
            sm:text-2xl
          "
        >
          保存した投稿はまだありません
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-lg
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
          "
        >
          気になるサ活を見つけたら、
          ブックマークボタンから保存してみましょう。
        </p>

        <div
          className="
            mt-8
            flex
            flex-col
            items-center
            justify-center
            gap-3
            sm:flex-row
          "
        >
          <Link
            href="/"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-foreground
              px-5
              py-2.5
              text-sm
              font-semibold
              text-background
              transition
              duration-200
              hover:-translate-y-0.5
              hover:opacity-90
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transform-none
              motion-reduce:transition-none
              sm:w-auto
            "
          >
            タイムラインを見る

            <ArrowRight
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </Link>

          <Link
            href="/search"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border/70
              bg-background/65
              px-5
              py-2.5
              text-sm
              font-semibold
              text-foreground
              transition
              duration-200
              hover:border-foreground/20
              hover:bg-background
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transition-none
              sm:w-auto
            "
          >
            <Compass
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            サウナを探す
          </Link>
        </div>
      </div>
    </section>
  );
}

function LoginRequiredState() {
  return (
    <section
      aria-labelledby="bookmarks-login-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
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
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
          size-56
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div className="relative z-10">
        <span
          className="
            mx-auto
            flex
            size-16
            items-center
            justify-center
            rounded-full
            border
            border-border/55
            bg-background/70
            text-foreground
            shadow-sm
          "
        >
          <LogIn
            className="size-6"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>

        <p
          className="
            mt-5
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-muted-foreground
          "
        >
          Saved Journals
        </p>

        <h1
          id="bookmarks-login-heading"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.03em]
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
            max-w-lg
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
            sm:leading-8
          "
        >
          保存済み投稿を見るには、
          TOTONOへログインしてください。
        </p>

        <Link
          href="/login"
          className="
            mt-8
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-full
            bg-foreground
            px-6
            py-2.5
            text-sm
            font-semibold
            text-background
            transition
            duration-200
            hover:-translate-y-0.5
            hover:opacity-90
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          ログインへ

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}
