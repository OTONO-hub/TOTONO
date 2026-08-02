import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  LogIn,
  PenLine,
  Sparkles,
  Search,
  UserRound,
} from "lucide-react";

import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { FollowButton } from "@/components/profile/FollowButton";
import { PublicProfileHero } from "@/components/profile/PublicProfileHero";
import { buttonVariants } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/state/EmptyState";
import { createClient } from "@/lib/supabase/server";
import { cn } from "@/lib/utils";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getFollowerCount,
  getFollowingCount,
  isFollowing,
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
import type { CommentWithAuthor } from "@/types/comment";

type UserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const profile = await getProfile(
    supabase,
    id
  );

  if (!profile) {
    notFound();
  }

  if (
    user &&
    user.id === profile.id
  ) {
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
              size-112
              rounded-full
              bg-secondary/15
              blur-3xl
            "
          />

          <section
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
                <UserRound
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
                Your Profile
              </p>

              <h1
                className="
                  mt-4
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-4xl
                "
              >
                これはあなたのプロフィールです
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
                自分のサ活や分析レポートは、
                マイプロフィールから確認できます。
              </p>

              <Link
                href="/profile"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "xl",
                  }),
                  "mt-8"
                )}
              >
                マイプロフィールへ

                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-end"
                />
              </Link>
            </div>
          </section>
        </main>

        <AppMobileNavigation />
      </>
    );
  }

  const allPosts =
    await getPosts(supabase);

  const userPosts =
    allPosts.filter(
      (post) =>
        post.user_id === profile.id
    );

  const [
    followingCount,
    followerCount,
  ] = await Promise.all([
    getFollowingCount(
      supabase,
      profile.id
    ),
    getFollowerCount(
      supabase,
      profile.id
    ),
  ]);

  const memberSince = new Date(
    profile.created_at
  ).toLocaleDateString(
    "ja-JP",
    {
      year: "numeric",
      month: "long",
    }
  );

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
            pb-28
            pt-28
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
              -left-48
              top-[42rem]
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
            <Link
              href="/community"
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
                focus-visible:ring-ring
                focus-visible:ring-offset-2
              "
            >
              <ArrowLeft
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Communityへ戻る
            </Link>

            <PublicProfileHero
              className="mt-7"
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
                userPosts.length
              }
              followingCount={
                followingCount
              }
              followerCount={
                followerCount
              }
            />

            <section
              aria-labelledby="login-to-view-posts-heading"
              className="
                mt-10
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
                  from-secondary/20
                  via-background
                  to-accent/10
                  px-6
                  py-12
                  text-center
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
                    border
                    border-border/50
                    bg-card/75
                    text-foreground
                    shadow-sm
                  "
                >
                  <LogIn
                    className="size-5"
                    strokeWidth={1.8}
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
                  Member Journal
                </p>

                <h2
                  id="login-to-view-posts-heading"
                  className="
                    mt-4
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  サ活の続きを見る
                </h2>

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
                  投稿へのいいね、保存、コメントや
                  フォロー機能を利用するには、
                  TOTONOへログインしてください。
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
                  ログインして見る

                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-end"
                  />
                </Link>
              </div>
            </section>
          </div>
        </main>
      </>
    );
  }

  const userPostIds =
    userPosts.map(
      (post) => post.id
    );

  const [
    comments,
    bookmarkedPostIds,
    initialFollowing,
    postImagesByPostId,
  ] = await Promise.all([
    getCommentsByPostIds(
      supabase,
      userPostIds
    ),
    getBookmarkedPostIds(
      supabase,
      user.id,
      userPostIds
    ),
    isFollowing(
      supabase,
      user.id,
      profile.id
    ),
    getPostImagesByPostIds(
      supabase,
      userPostIds
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

  const profilesByUserId =
    new Map(
      [
        profile,
        ...commentAuthorProfiles,
      ].map((item) => [
        item.id,
        item,
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

  const postsWithMeta =
    await Promise.all(
      userPosts.map(
        async (post) => ({
          post,
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
            top-[48rem]
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
          <Link
            href="/community"
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
              focus-visible:ring-ring
              focus-visible:ring-offset-2
            "
          >
            <ArrowLeft
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Communityへ戻る
          </Link>

          <PublicProfileHero
            className="mt-7"
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
              userPosts.length
            }
            followingCount={
              followingCount
            }
            followerCount={
              followerCount
            }
            actions={
              <FollowButton
                currentUserId={
                  user.id
                }
                targetUserId={
                  profile.id
                }
                initialFollowing={
                  initialFollowing
                }
              />
            }
          />

          <section
            aria-labelledby="public-posts-heading"
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
                      bg-secondary/20
                      text-foreground
                    "
                  >
                    <BookOpen
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
                    Sauna Journal
                  </p>
                </div>

                <h2
                  id="public-posts-heading"
                  className="
                    mt-5
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-4xl
                  "
                >
                  {profile.username}
                  さんのサ活
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
                  訪れた施設や整い方を、
                  一つひとつの記録から見ることができます。
                </p>
              </div>

              <div
                className="
                  inline-flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-border/55
                  bg-card/80
                  px-4
                  py-2.5
                  text-sm
                  font-semibold
                  text-foreground
                  shadow-sm
                "
              >
                <Sparkles
                  className="
                    size-4
                    text-accent
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {userPosts.length}
                件の記録
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
                <EmptyState
                  eyebrow="Quiet Journal"
                  icon={PenLine}
                  title="まだサ活の記録がありません"
                  description="このユーザーがサ活を投稿すると、ここに記録が表示されます。"
                  action={{
                    label: "Communityを見る",
                    href: "/community",
                    icon: BookOpen,
                  }}
                  secondaryAction={{
                    label: "サウナを探す",
                    href: "/search",
                    icon: Search,
                  }}
                />
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
                      initialLiked,
                      initialLikeCount,
                      initialBookmarked,
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
              )}
            </div>
          </section>

          <section
            aria-labelledby="public-profile-next-heading"
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
                  Continue Exploring
                </p>

                <h2
                  id="public-profile-next-heading"
                  className="
                    mt-3
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  ほかのサ活も見てみる
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
                  Communityでは、
                  さまざまなユーザーのサウナ体験を
                  見つけることができます。
                </p>
              </div>

              <Link
                href="/community"
                className={cn(
                  buttonVariants({
                    variant: "totono",
                    size: "lg",
                  }),
                  "w-full sm:w-auto"
                )}
              >
                Communityへ

                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                  data-icon="inline-end"
                />
              </Link>
            </div>
          </section>
        </div>
      </main>

      <AppMobileNavigation />
    </>
  );
}
