import Link from "next/link";

import { CommentForm } from "@/components/comment/CommentForm";
import { CommentList } from "@/components/comment/CommentList";
import { DeletePostButton } from "@/components/post/DeletePostButton";
import { PostBody } from "@/components/post/PostBody";
import { PostFooter } from "@/components/post/PostFooter";
import { PostHeader } from "@/components/post/PostHeader";
import { CommentWithAuthor } from "@/types/comment";
import { Post } from "@/types/post";
import { Profile } from "@/types/profile";

type PostCardProps = {
  post: Post;
  author: Profile | null;
  userId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  comments: CommentWithAuthor[];
};

export function PostCard({
  post,
  author,
  userId,
  initialLiked,
  initialLikeCount,
  comments,
}: PostCardProps) {
  const isOwner = post.user_id === userId;

  return (
    <article className="rounded-2xl border bg-card p-6 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-4">
        <PostHeader post={post} author={author} />

        {isOwner && (
          <div className="flex shrink-0 gap-2">
            <Link
              href={`/posts/${post.id}/edit`}
              className="inline-flex h-9 items-center justify-center rounded-md border px-3 text-sm font-medium transition hover:bg-muted"
            >
              編集
            </Link>

            <DeletePostButton
              postId={post.id}
              imageUrl={post.image_url}
            />
          </div>
        )}
      </div>

      <PostBody post={post} />

      <PostFooter
        postId={post.id}
        userId={userId}
        setCount={post.set_count}
        initialLiked={initialLiked}
        initialLikeCount={initialLikeCount}
        commentCount={comments.length}
      />

      <CommentList comments={comments} />

      <CommentForm
        postId={post.id}
        userId={userId}
      />
    </article>
  );
}