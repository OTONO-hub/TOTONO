import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getFollowerCount,
  getFollowingCount,
} from "@/services/follows";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPosts } from "@/services/posts";
import {
  getProfile,
  getProfilesByUserIds,
} from "@/services/profile";
import { CommentWithAuthor } from "@/types/comment";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />

        <main className="mx-auto max-w-2xl p-6">
          <p className="text-muted-foreground">
            ログインしてください。
          </p>

          <Link
            href="/login"
            className="mt-4 inline-block font-medium text-primary"
          >
            ログインへ
          </Link>
        </main>
      </>
    );
  }

  const profile = await getProfile(supabase, user.id);
  const posts = await getPosts(supabase);

  const myPosts = posts.filter(
    (post) => post.user_id === user.id
  );

  const comments = await getCommentsByPostIds(
    supabase,
    myPosts.map((post) => post.id)
  );

  const bookmarkedPostIds = await getBookmarkedPostIds(
    supabase,
    user.id,
    myPosts.map((post) => post.id)
  );

  const bookmarkedPostIdSet = new Set(bookmarkedPostIds);

  const [followingCount, followerCount] =
    await Promise.all([
      getFollowingCount(supabase, user.id),
      getFollowerCount(supabase, user.id),
    ]);

  const commentAuthorProfiles =
    await getProfilesByUserIds(
      supabase,
      comments.map((comment) => comment.user_id)
    );

  const profilesByUserId = new Map(
    [
      profile,
      ...commentAuthorProfiles,
    ].map((item) => [item.id, item])
  );

  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
      comment,
      author:
        profilesByUserId.get(comment.user_id) ?? null,
    };

    const currentComments =
      commentsByPostId.get(comment.post_id) ?? [];

    currentComments.push(commentWithAuthor);

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  const myPostsWithMeta = await Promise.all(
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
      bookmarked: bookmarkedPostIdSet.has(post.id),
      comments:
        commentsByPostId.get(post.id) ?? [],
    }))
  );

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl space-y-8 bg-muted/40 px-4 py-8 sm:px-6">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="flex flex-col items-center gap-5 text-center sm:flex-row sm:items-start sm:text-left">
            <ProfileAvatar
              avatarUrl={profile.avatar_url}
              username={profile.username}
              size="xl"
            />

            <div className="min-w-0 flex-1">
              <h1 className="wrap-break-word text-3xl font-bold tracking-tight">
                @{profile.username || "ユーザー"}
              </h1>

              <p className="mt-3 whitespace-pre-wrap text-muted-foreground">
                {profile.bio ||
                  "自己紹介はまだありません。"}
              </p>

              <div className="mt-4 flex justify-center gap-6 text-sm sm:justify-start">
                <div>
                  <span className="font-bold">
                    {myPosts.length}
                  </span>

                  <span className="ml-1 text-muted-foreground">
                    投稿
                  </span>
                </div>

                <div>
                  <span className="font-bold">
                    {followingCount}
                  </span>

                  <span className="ml-1 text-muted-foreground">
                    フォロー
                  </span>
                </div>

                <div>
                  <span className="font-bold">
                    {followerCount}
                  </span>

                  <span className="ml-1 text-muted-foreground">
                    フォロワー
                  </span>
                </div>
              </div>

              <div className="mt-6">
                <Link
                  href="/profile/edit"
                  className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                >
                  プロフィール編集
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">
            自分の投稿
          </h2>

          {myPostsWithMeta.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
              <p className="text-muted-foreground">
                まだ投稿がありません。
              </p>

              <Link
                href="/posts/new"
                className="mt-4 inline-block font-medium text-primary"
              >
                最初のサ活を投稿する
              </Link>
            </div>
          ) : (
            myPostsWithMeta.map(
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
                  initialLikeCount={likeCount}
                  initialBookmarked={bookmarked}
                  comments={comments}
                />
              )
            )
          )}
        </section>
      </main>
    </>
  );
}