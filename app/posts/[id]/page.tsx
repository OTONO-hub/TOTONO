import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { isBookmarked } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPostImagesByPostId } from "@/services/post-images";
import { getPostById } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import type { CommentWithAuthor } from "@/types/comment";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { id } = await params;

  const supabase = await createClient();
  const post = await getPostById(supabase, id);

  if (!post) {
    return {
      title: "投稿が見つかりません",
      description:
        "指定された投稿は存在しないか、削除された可能性があります。",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const description = createPostDescription({
    saunaName: post.sauna_name,
    comment: post.comment,
    rating: post.rating,
    setCount: post.set_count,
  });

  return {
    title: `${post.sauna_name}のサ活記録`,
    description,
    robots: {
      index: false,
      follow: false,
      googleBot: {
        index: false,
        follow: false,
      },
    },
  };
}

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

        <main className="mx-auto min-h-screen max-w-2xl px-4 py-12 sm:px-6">
          <section className="rounded-[2rem] border border-black/5 bg-white p-8 shadow-sm">
            <p className="text-sm font-medium text-muted-foreground">
              ログインが必要です
            </p>

            <h1 className="mt-3 text-2xl font-semibold tracking-tight text-foreground">
              投稿を見るにはログインしてください
            </h1>

            <p className="mt-3 leading-7 text-muted-foreground">
              TOTONOへログインすると、サ活記録の詳細やコメントを確認できます。
            </p>

            <Link
              href="/login"
              className="
                mt-6 inline-flex min-h-11 items-center justify-center
                rounded-full bg-primary px-6 py-3
                text-sm font-semibold text-primary-foreground
                transition-opacity hover:opacity-85
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
              "
            >
              ログインへ
            </Link>
          </section>
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

  const userIds = Array.from(
    new Set([
      post.user_id,
      ...comments.map(
        (comment) => comment.user_id
      ),
    ])
  );

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

  const commentsWithAuthors: CommentWithAuthor[] =
    comments.map((comment) => ({
      comment,
      author:
        profilesByUserId.get(comment.user_id) ??
        null,
    }));

  const [
    likeCount,
    liked,
    bookmarked,
    images,
  ] = await Promise.all([
      getLikeCount(supabase, post.id),
      isLiked(supabase, user.id, post.id),
      isBookmarked(
        supabase,
        user.id,
        post.id
      ),
      getPostImagesByPostId(
        supabase,
        post.id
      ),
    ]);

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl bg-muted/40 px-4 py-8 sm:px-6">
        <PostCard
          post={post}
          author={
            profilesByUserId.get(
              post.user_id
            ) ?? null
          }
          userId={user.id}
          initialLiked={liked}
          initialLikeCount={likeCount}
          initialBookmarked={bookmarked}
          comments={commentsWithAuthors}
          images={images}
          imageDisplayMode="gallery"
        />
      </main>
    </>
  );
}

type CreatePostDescriptionParams = {
  saunaName: string;
  comment: string | null;
  rating: number;
  setCount: number;
};

function createPostDescription({
  saunaName,
  comment,
  rating,
  setCount,
}: CreatePostDescriptionParams): string {
  const normalizedComment =
    comment?.replace(/\s+/g, " ").trim() ?? "";

  const baseDescription =
    normalizedComment.length > 0
      ? normalizedComment
      : `${saunaName}でのサ活記録です。`;

  const detail =
    ` 評価${rating}、${setCount}セット。`;

  return truncateText(
    `${baseDescription}${detail}`,
    120
  );
}

function truncateText(
  value: string,
  maxLength: number
): string {
  if (value.length <= maxLength) {
    return value;
  }

  return `${value.slice(
    0,
    Math.max(0, maxLength - 1)
  )}…`;
}
