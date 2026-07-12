import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { createClient } from "@/lib/supabase/server";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPosts } from "@/services/posts";
import {
  getProfile,
  getProfilesByUserIds,
} from "@/services/profile";
import { CommentWithAuthor } from "@/types/comment";

type UserProfilePageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function UserProfilePage({
  params,
}: UserProfilePageProps) {
  const { id } = await params;

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
            プロフィールを見るにはログインしてください。
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

  let profile;

  try {
    profile = await getProfile(supabase, id);
  } catch {
    notFound();
  }

  const posts = await getPosts(supabase);

  const userPosts = posts.filter(
    (post) => post.user_id === profile.id
  );

  const comments = await getCommentsByPostIds(
    supabase,
    userPosts.map((post) => post.id)
  );

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

  const userPostsWithMeta = await Promise.all(
    userPosts.map(async (post) => ({
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
      comments:
        commentsByPostId.get(post.id) ?? [],
    }))
  );

  const isOwnProfile = user.id === profile.id;

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
                    {userPosts.length}
                  </span>

                  <span className="ml-1 text-muted-foreground">
                    投稿
                  </span>
                </div>
              </div>

              {isOwnProfile && (
                <div className="mt-6">
                  <Link
                    href="/profile/edit"
                    className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
                  >
                    プロフィール編集
                  </Link>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="wrap-break-word text-2xl font-bold">
            @{profile.username || "ユーザー"}さんの投稿
          </h2>

          {userPostsWithMeta.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
              <p className="text-muted-foreground">
                まだ投稿がありません。
              </p>
            </div>
          ) : (
            userPostsWithMeta.map(
              ({
                post,
                likeCount,
                liked,
                comments,
              }) => (
                <PostCard
                  key={post.id}
                  post={post}
                  author={profile}
                  userId={user.id}
                  initialLiked={liked}
                  initialLikeCount={likeCount}
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