import { Star } from "lucide-react";

import { PostImage } from "@/components/post/PostImage";
import type { Post } from "@/types/post";

type Props = {
  post: Post;
};

const MAX_RATING = 5;

export function PostBody({
  post,
}: Props) {
  const rating = Math.max(
    0,
    Math.min(MAX_RATING, Number(post.rating) || 0)
  );

  const filledStarCount = Math.round(rating);

  return (
    <div>
      {/* 評価 */}
      <div
        className="
          flex flex-wrap
          items-center
          justify-between
          gap-3
          rounded-2xl
          border border-border/45
          bg-background/40
          px-4 py-3
        "
        aria-label={`評価5点満点中${rating}点`}
      >
        <div className="flex items-center gap-1">
          {Array.from(
            { length: MAX_RATING },
            (_, index) => {
              const isFilled =
                index < filledStarCount;

              return (
                <Star
                  key={index}
                  aria-hidden="true"
                  className={
                    isFilled
                      ? "size-[1.125rem] fill-accent text-accent"
                      : "size-[1.125rem] fill-transparent text-foreground/15"
                  }
                  strokeWidth={1.6}
                />
              );
            }
          )}
        </div>

        <div className="flex items-baseline gap-1.5">
          <span className="text-base font-semibold text-foreground">
            {rating.toFixed(1)}
          </span>

          <span className="text-xs font-medium text-muted-foreground">
            / {MAX_RATING}.0
          </span>
        </div>
      </div>

      {/* 投稿画像 */}
      {post.image_url && (
        <div
          className="
            relative
            mt-5
            overflow-hidden
            rounded-[1.5rem]
            border border-border/35
            bg-muted
            shadow-sm
            sm:mt-6
            sm:rounded-[1.75rem]
          "
        >
          <PostImage
            imageUrl={post.image_url}
            saunaName={post.sauna_name}
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 ring-1 ring-inset ring-white/15"
          />
        </div>
      )}

      {/* 投稿コメント */}
      <div
        className={
          post.image_url
            ? "pt-6"
            : "pt-5"
        }
      >
        {post.comment ? (
          <p className="whitespace-pre-wrap wrap-break-word text-sm leading-7 text-foreground/85 sm:text-base sm:leading-8">
            {post.comment}
          </p>
        ) : (
          <p className="text-sm leading-7 text-muted-foreground">
            この投稿にはコメントがありません。
          </p>
        )}
      </div>
    </div>
  );
}
