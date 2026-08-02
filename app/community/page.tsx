import Link from "next/link";
import {
  BookOpen,
  Compass,
  Flame,
  LogIn,
  MessageCircle,
  PenLine,
  Search,
  Sparkles,
  Users,
} from "lucide-react";

import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getPostImagesByPostIds } from "@/services/post-images";
import { getPosts } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import type { CommentWithAuthor } from "@/types/comment";

export default async function CommunityPage() {
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
              -right-40
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
              -left-44
              top-[38rem]
              size-112
              rounded-full
              bg-accent/10
              blur-3xl
            "
          />

          <FadeIn
            duration="slow"
            distance="subtle"
          >
          <section
            aria-labelledby="community-login-heading"
            className="
              relative
              mx-auto
              max-w-3xl
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
                -right-20
                -top-24
                size-72
                rounded-full
                bg-secondary/30
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
                py-14
                text-center
                sm:px-10
                sm:py-18
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
                <Users
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
                Sauna Community
              </p>

              <h1
                id="community-login-heading"
                className="
                  mt-4
                  text-3xl
                  font-semibold
                  tracking-[-0.045em]
                  text-foreground
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                みんなの整いに出会う
              </h1>

              <p
                className="
                  mx-auto
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-muted-foreground
                  sm:text-base
                  sm:leading-8
                "
              >
                サウナを愛する人たちの記録から、
                次に訪れたい施設や新しい過ごし方を
                見つけることができます。
              </p>

              <div
                className="
                  mt-8
                  flex
                  flex-col
                  justify-center
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  href="/login"
                  className={cn(
                    buttonVariants({
                      variant: "totono",
                      size: "xl",
                    }),
                    "w-full sm:w-auto"
                  )}
                >
                  <LogIn
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-start"
                  />

                  ログインして見る
                </Link>

                <Link
                  href="/search"
                  className={cn(
                    buttonVariants({
                      variant:
                        "totonoOutline",
                      size: "xl",
                    }),
                    "w-full sm:w-auto"
                  )}
                >
                  <Search
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-start"
                  />

                  サウナを探す
                </Link>
              </div>
            </div>

            <div
              className="
                grid
                gap-px
                border-t
                border-border/45
                bg-border/40
                sm:grid-cols-3
              "
            >
              <CommunityFeature
                icon={BookOpen}
                title="記録を読む"
                description="全国のサ活から体験を知る"
              />

              <CommunityFeature
                icon={MessageCircle}
                title="気持ちを伝える"
                description="いいねやコメントで交流する"
              />

              <CommunityFeature
                icon={Compass}
                title="次を見つける"
                description="新しい施設や過ごし方を発見する"
              />
            </div>
          </section>
          </FadeIn>
        </main>
      </>
    );
  }

  const posts =
    await getPosts(supabase);

  const sortedPosts = [
    ...posts,
  ].sort(
    (firstPost, secondPost) =>
      new Date(
        secondPost.created_at
      ).getTime() -
      new Date(
        firstPost.created_at
      ).getTime()
  );

  const postIds =
    sortedPosts.map(
      (post) => post.id
    );

  const [
    comments,
    bookmarkedPostIds,
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

  const profileUserIds = [
    ...sortedPosts.map(
      (post) => post.user_id
    ),
    ...comments.map(
      (comment) =>
        comment.user_id
    ),
  ];

  const profiles =
    await getProfilesByUserIds(
      supabase,
      profileUserIds
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
    const currentComments =
      commentsByPostId.get(
        comment.post_id
      ) ?? [];

    currentComments.push({
      comment,
      author:
        profileByUserId.get(
          comment.user_id
        ) ?? null,
    });

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  const bookmarkedPostIdSet =
    new Set(bookmarkedPostIds);

  const postsWithMeta =
    await Promise.all(
      sortedPosts.map(
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
        })
      )
    );

  const uniqueUserCount =
    new Set(
      sortedPosts.map(
        (post) => post.user_id
      )
    ).size;

  const uniqueSaunaCount =
    new Set(
      sortedPosts
        .map((post) =>
          post.sauna_name
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    ).size;

  const totalCommentCount =
    comments.length;

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
            top-[46rem]
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
          <section
            aria-labelledby="community-heading"
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
                -bottom-36
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
                    <Users
                      className="
                        size-3.5
                        text-foreground
                      "
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    Sauna Community
                  </div>

                  <h1
                    id="community-heading"
                    className="
                      mt-6
                      text-4xl
                      font-semibold
                      tracking-[-0.05em]
                      text-foreground
                      sm:text-5xl
                      lg:text-6xl
                    "
                  >
                    みんなのサ活
                  </h1>

                  <p
                    className="
                      mt-5
                      max-w-2xl
                      text-sm
                      leading-7
                      text-muted-foreground
                      sm:text-base
                      sm:leading-8
                    "
                  >
                    サウナを愛する人たちが残した、
                    今日の体験と整いの記録。
                    次の行き先につながる発見を
                    ゆっくり眺めてみましょう。
                  </p>
                </div>

                <div
                  className="
                    flex
                    w-full
                    flex-col
                    gap-3
                    sm:w-auto
                    sm:flex-row
                  "
                >
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

                    サウナを探す
                  </Link>

                  <Link
                    href="/posts/new"
                    className={cn(
                      buttonVariants({
                        variant: "totono",
                        size: "lg",
                      }),
                      "w-full sm:w-auto"
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
              </div>
            </div>

            <div
              className="
                grid
                gap-px
                border-t
                border-border/45
                bg-border/40
                sm:grid-cols-3
              "
            >
              <CommunityStat
                icon={BookOpen}
                label="サ活"
                value={sortedPosts.length}
                suffix="件"
              />

              <CommunityStat
                icon={Users}
                label="メンバー"
                value={uniqueUserCount}
                suffix="人"
              />

              <CommunityStat
                icon={Flame}
                label="登場施設"
                value={uniqueSaunaCount}
                suffix="施設"
              />
            </div>
          </section>

          <section
            aria-labelledby="community-feed-heading"
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
                    Latest Journal
                  </p>
                </div>

                <h2
                  id="community-feed-heading"
                  className="
                    mt-5
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-4xl
                  "
                >
                  新着のサ活
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
                  新しく投稿された記録から、
                  リアルな施設体験や整い方を発見できます。
                </p>
              </div>

              <div
                className="
                  flex
                  flex-wrap
                  gap-2
                "
              >
                <CommunityMetricBadge
                  icon={MessageCircle}
                  label={`${totalCommentCount}件の会話`}
                />

                <CommunityMetricBadge
                  icon={Sparkles}
                  label={`${sortedPosts.length}件の記録`}
                />
              </div>
            </div>

            <div
              className="
                mx-auto
                max-w-4xl
              "
            >
              {postsWithMeta.length ===
              0 ? (
                <EmptyCommunity />
              ) : (
                <div
                  className="
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
                      comments: postComments,
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
                          postComments
                        }
                        images={
                          postImagesByPostId.get(
                            post.id
                          ) ?? []
                        }
                        imageDisplayMode="cover"
                      />
                    )
                  )}
                </div>
              )}
            </div>
          </section>

          <section
            aria-labelledby="community-next-heading"
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
                  Your Sauna Journal
                </p>

                <h2
                  id="community-next-heading"
                  className="
                    mt-3
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  あなたの体験も残す
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
                  何気ない感想も、
                  次にその施設を訪れる誰かの
                  大切なヒントになります。
                </p>
              </div>

              <Link
                href="/posts/new"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "lg",
                  }),
                  "w-full sm:w-auto"
                )}
              >
                <PenLine
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-start"
                />

                サ活を投稿する
              </Link>
            </div>
          </section>
        </div>
      </main>

      <AppMobileNavigation />
    </>
  );
}

type CommunityFeatureProps = {
  icon: typeof BookOpen;
  title: string;
  description: string;
};

function CommunityFeature({
  icon: Icon,
  title,
  description,
}: CommunityFeatureProps) {
  return (
    <div
      className="
        bg-card/80
        px-5
        py-6
        text-center
      "
    >
      <span
        className="
          mx-auto
          flex
          size-10
          items-center
          justify-center
          rounded-full
          bg-secondary/20
          text-foreground
        "
      >
        <Icon
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <p
        className="
          mt-3
          text-sm
          font-semibold
          text-foreground
        "
      >
        {title}
      </p>

      <p
        className="
          mt-1
          text-xs
          leading-5
          text-muted-foreground
        "
      >
        {description}
      </p>
    </div>
  );
}

type CommunityStatProps = {
  icon: typeof BookOpen;
  label: string;
  value: number;
  suffix: string;
};

function CommunityStat({
  icon: Icon,
  label,
  value,
  suffix,
}: CommunityStatProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        bg-card/80
        px-5
        py-5
        sm:justify-center
        sm:px-6
        sm:py-6
      "
    >
      <span
        className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-secondary/20
          text-foreground
        "
      >
        <Icon
          className="size-4"
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
            tracking-[0.18em]
            text-muted-foreground
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-xl
            font-semibold
            tracking-[-0.03em]
            text-foreground
          "
        >
          {value.toLocaleString(
            "ja-JP"
          )}

          <span
            className="
              ml-1
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            {suffix}
          </span>
        </p>
      </div>
    </div>
  );
}

type CommunityMetricBadgeProps = {
  icon: typeof MessageCircle;
  label: string;
};

function CommunityMetricBadge({
  icon: Icon,
  label,
}: CommunityMetricBadgeProps) {
  return (
    <span
      className="
        inline-flex
        min-h-9
        items-center
        gap-2
        rounded-full
        border
        border-border/55
        bg-card/80
        px-3.5
        py-2
        text-xs
        font-semibold
        text-muted-foreground
        shadow-sm
      "
    >
      <Icon
        className="size-3.5"
        strokeWidth={1.8}
        aria-hidden="true"
      />

      {label}
    </span>
  );
}

function EmptyCommunity() {
  return (
    <EmptyState
      eyebrow="First Journal"
      icon={BookOpen}
      title="まだサ活が投稿されていません"
      description="最初のサ活を投稿して、TOTONOのCommunityを始めましょう。"
      action={{
        label: "最初のサ活を投稿する",
        href: "/posts/new",
        icon: PenLine,
      }}
      secondaryAction={{
        label: "サウナを探す",
        href: "/search",
        icon: Search,
      }}
    />
  );
}
