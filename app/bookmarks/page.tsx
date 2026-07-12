import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { getAllBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPostsByIds } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import { CommentWithAuthor } from "@/types/comment";

export default async function BookmarksPage() {
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
            保存済み投稿を見るにはログインしてください。
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
    profiles.map((profile) => [profile.id, profile])
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

  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds
  );

  const postsWithMeta = await Promise.all(
    posts.map(async (post) => ({
      post,
      author:
        profilesByUserId.get(post.user_id) ?? null,
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

      <main className="mx-auto min-h-screen max-w-3xl space-y-6 bg-muted/40 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            保存済み投稿
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            あとで見返したいサ活投稿を確認できます。
          </p>
        </div>

        {postsWithMeta.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              保存済みの投稿はまだありません。
            </p>
          </div>
        ) : (
          <section className="space-y-4">
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
                  initialBookmarked={bookmarked}
                  comments={comments}
                />
              )
            )}
          </section>
        )}
      </main>
    </>
  );
}