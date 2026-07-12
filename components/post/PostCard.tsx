import Link from "next/link";

import { CommentForm } from "@/components/comment/CommentForm";
import { CommentList } from "@/components/comment/CommentList";
import { DeletePostButton } from "@/components/post/DeletePostButton";
import { PostBody } from "@/components/post/PostBody";
import { PostFooter } from "@/components/post/PostFooter";
import { PostHeader } from "@/components/post/PostHeader";
import { Comment } from "@/types/comment";
import { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
  userId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  comments: Comment[];
};

export function PostCard({
  post,
  userId,
  initialLiked,
  initialLikeCount,
  comments,
}: PostCardProps) {
  const isOwner = post.user_id === userId;

  return (
    <article className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="flex items-start justify-between gap-4">
        <PostHeader post={post} />

        {isOwner && (
          <div className="flex gap-2">
            <Link
              href={`/posts/${post.id}/edit`}
              className="rounded-lg border px-3 py-1 text-sm font-medium text-gray-600 hover:bg-gray-100"
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