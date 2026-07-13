import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { isBookmarked } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPostById } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import type { CommentWithAuthor } from "@/types/comment";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PostDetailPage({
  params,
}: Props) {
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
            投稿を見るにはログインしてください。
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

  const post = await getPostById(supabase, id);

  if (!post) {
    notFound();
  }

  const comments = await getCommentsByPostIds(
    supabase,
    [post.id]
  );

  const userIds = [
    post.user_id,
    ...comments.map((comment) => comment.user_id),
  ];

  const profiles = await getProfilesByUserIds(
    supabase,
    userIds
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [profile.id, profile])
  );

  const commentsWithAuthors: CommentWithAuthor[] =
    comments.map((comment) => ({
      comment,
      author:
        profilesByUserId.get(comment.user_id) ?? null,
    }));

  const [likeCount, liked, bookmarked] =
    await Promise.all([
      getLikeCount(supabase, post.id),
      isLiked(supabase, user.id, post.id),
      isBookmarked(supabase, user.id, post.id),
    ]);

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl bg-muted/40 px-4 py-8 sm:px-6">
        <PostCard
          post={post}
          author={
            profilesByUserId.get(post.user_id) ?? null
          }
          userId={user.id}
          initialLiked={liked}
          initialLikeCount={likeCount}
          initialBookmarked={bookmarked}
          comments={commentsWithAuthors}
        />
      </main>
    </>
  );
}