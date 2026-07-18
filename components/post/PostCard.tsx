import Link from "next/link";
import { Pencil } from "lucide-react";

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
  initialBookmarked: boolean;
  comments: CommentWithAuthor[];
};

export function PostCard({
  post,
  author,
  userId,
  initialLiked,
  initialLikeCount,
  initialBookmarked,
  comments,
}: PostCardProps) {
  const isOwner = post.user_id === userId;

  return (
    <article
      className="
        group
        relative
        overflow-hidden
        rounded-[1.75rem]
        border border-border/55
        bg-card
        shadow-totono-card
        transition
        duration-300
        hover:-translate-y-0.5
        hover:border-border/80
        hover:shadow-totono-hover
        sm:rounded-[2rem]
      "
    >
      {/* カード上部のアクセント */}
      <div
        aria-hidden="true"
        className="
          absolute inset-x-8 top-0
          h-px
          bg-gradient-to-r
          from-transparent
          via-accent/70
          to-transparent
          opacity-0
          transition-opacity
          duration-300
          group-hover:opacity-100
        "
      />

      {/* 投稿ヘッダー */}
      <div className="flex items-start justify-between gap-4 px-5 pt-5 sm:px-7 sm:pt-7">
        <div className="min-w-0 flex-1">
          <PostHeader
            post={post}
            author={author}
          />
        </div>

        {isOwner && (
          <div className="flex shrink-0 items-center gap-1.5">
            <Link
              href={`/posts/${post.id}/edit`}
              aria-label="投稿を編集する"
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-1.5
                rounded-full
                border border-border/70
                bg-background/50
                px-3
                text-xs
                font-medium
                text-muted-foreground
                transition
                duration-200
                hover:-translate-y-0.5
                hover:border-border
                hover:bg-background
                hover:text-foreground
                hover:shadow-sm
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                active:translate-y-0
                sm:px-4
                sm:text-sm
              "
            >
              <Pencil
                className="size-3.5"
                strokeWidth={1.8}
              />

              <span className="hidden sm:inline">
                編集
              </span>
            </Link>

            <DeletePostButton
              postId={post.id}
              imageUrl={post.image_url}
            />
          </div>
        )}
      </div>

      {/* 投稿本文・画像 */}
      <div className="mt-5 px-5 sm:mt-6 sm:px-7">
        <PostBody post={post} />
      </div>

      {/* いいね・コメント・保存 */}
      <div className="mt-6 px-5 sm:mt-7 sm:px-7">
        <div
          className="
            rounded-2xl
            border border-border/45
            bg-background/45
            px-2 py-1.5
            backdrop-blur-sm
            sm:px-3
          "
        >
          <PostFooter
            postId={post.id}
            userId={userId}
            postOwnerId={post.user_id}
            setCount={post.set_count}
            initialLiked={initialLiked}
            initialLikeCount={initialLikeCount}
            initialBookmarked={initialBookmarked}
            commentCount={comments.length}
          />
        </div>
      </div>

      {/* コメントエリア */}
      <div
        className="
          mt-6
          border-t border-border/45
          bg-background/25
          px-5 pb-5 pt-5
          sm:mt-7
          sm:px-7
          sm:pb-7
          sm:pt-6
        "
      >
        {comments.length > 0 && (
          <div className="mb-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <p className="text-sm font-semibold text-foreground">
                コメント
              </p>

              <span
                className="
                  inline-flex
                  min-w-7
                  items-center
                  justify-center
                  rounded-full
                  bg-muted
                  px-2
                  py-1
                  text-[0.6875rem]
                  font-semibold
                  leading-none
                  text-muted-foreground
                "
              >
                {comments.length}
              </span>
            </div>

            <CommentList
              comments={comments}
              currentUserId={userId}
            />
          </div>
        )}

        <CommentForm
          postId={post.id}
          userId={userId}
          postOwnerId={post.user_id}
        />
      </div>
    </article>
  );
}