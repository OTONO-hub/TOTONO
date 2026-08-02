import {
  Images,
  Star,
} from "lucide-react";

import { PostImage } from "@/components/post/PostImage";
import { PostImageGallery } from "@/components/post/PostImageGallery";
import type {
  PostImage as PostImageRecord,
} from "@/services/post-images";
import type { Post } from "@/types/post";

export type PostImageDisplayMode =
  | "cover"
  | "gallery";

type Props = {
  post: Post;
  images?: PostImageRecord[];
  imageDisplayMode?: PostImageDisplayMode;
};

type RatingStarProps = {
  fillPercentage: number;
};

const MAX_RATING = 5;
const RATING_DECIMAL_PLACES = 1;

function RatingStar({
  fillPercentage,
}: RatingStarProps) {
  const normalizedFillPercentage =
    Math.max(
      0,
      Math.min(
        100,
        fillPercentage
      )
    );

  return (
    <span
      aria-hidden="true"
      className="
        relative
        block
        size-[1.125rem]
        shrink-0
      "
    >
      <Star
        aria-hidden="true"
        className="
          absolute
          inset-0
          size-full
          fill-transparent
          text-foreground/15
        "
        strokeWidth={1.6}
      />

      <span
        aria-hidden="true"
        className="
          absolute
          inset-y-0
          left-0
          overflow-hidden
        "
        style={{
          width: `${normalizedFillPercentage}%`,
        }}
      >
        <Star
          aria-hidden="true"
          className="
            absolute
            inset-0
            size-[1.125rem]
            fill-accent
            text-accent
          "
          strokeWidth={1.6}
        />
      </span>
    </span>
  );
}

export function PostBody({
  post,
  images = [],
  imageDisplayMode = "cover",
}: Props) {
  const numericRating =
    Number(post.rating);

  const clampedRating = Math.max(
    0,
    Math.min(
      MAX_RATING,
      Number.isFinite(
        numericRating
      )
        ? numericRating
        : 0
    )
  );

  const rating =
    Math.round(
      clampedRating * 10
    ) / 10;

  const formattedRating =
    rating.toFixed(
      RATING_DECIMAL_PLACES
    );

  const hasPostImages =
    images.length > 0;

  const hasLegacyImage =
    !hasPostImages &&
    Boolean(post.image_url);

  const hasAnyImage =
    hasPostImages ||
    hasLegacyImage;

  const primaryImage =
    images[0] ?? null;

  return (
    <div>
      <div
        role="img"
        aria-label={`評価は5点満点中${formattedRating}点です`}
        className="
          flex
          flex-wrap
          items-center
          justify-between
          gap-3
          rounded-2xl
          border border-border/45
          bg-background/40
          px-4
          py-3
        "
      >
        <div
          aria-hidden="true"
          className="
            flex
            items-center
            gap-1
          "
        >
          {Array.from(
            {
              length: MAX_RATING,
            },
            (_, index) => {
              const fillPercentage =
                (rating - index) *
                100;

              return (
                <RatingStar
                  key={index}
                  fillPercentage={
                    fillPercentage
                  }
                />
              );
            }
          )}
        </div>

        <div
          aria-hidden="true"
          className="
            flex
            items-baseline
            gap-1.5
          "
        >
          <span
            className="
              text-base
              font-semibold
              tabular-nums
              text-foreground
            "
          >
            {formattedRating}
          </span>

          <span
            className="
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            / {MAX_RATING}.0
          </span>
        </div>
      </div>

      {hasPostImages &&
      imageDisplayMode ===
        "gallery" ? (
        <div className="mt-5 sm:mt-6">
          <PostImageGallery
            images={images}
            saunaName={
              post.sauna_name
            }
          />
        </div>
      ) : null}

      {primaryImage &&
      imageDisplayMode ===
        "cover" ? (
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
            imageUrl={
              primaryImage.image_url
            }
            saunaName={
              post.sauna_name
            }
          />

          {images.length > 1 ? (
            <span
              className="
                absolute
                right-3
                top-3
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-black/65
                px-3
                py-1.5
                text-xs
                font-semibold
                tabular-nums
                text-white
                shadow-sm
                backdrop-blur-sm
              "
            >
              <Images
                aria-hidden="true"
                className="size-3.5"
              />

              <span aria-hidden="true">
                {images.length}
              </span>

              <span className="sr-only">
                投稿画像は全部で
                {images.length}
                枚あります
              </span>
            </span>
          ) : null}

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              ring-1
              ring-inset
              ring-white/15
            "
          />
        </div>
      ) : null}

      {hasLegacyImage &&
      post.image_url ? (
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
            imageUrl={
              post.image_url
            }
            saunaName={
              post.sauna_name
            }
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              ring-1
              ring-inset
              ring-white/15
            "
          />
        </div>
      ) : null}

      <div
        className={
          hasAnyImage
            ? "pt-6"
            : "pt-5"
        }
      >
        {post.comment ? (
          <p
            className="
              whitespace-pre-wrap
              wrap-break-word
              text-sm
              leading-7
              text-foreground/85
              sm:text-base
              sm:leading-8
            "
          >
            {post.comment}
          </p>
        ) : (
          <p
            className="
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            この投稿にはコメントがありません。
          </p>
        )}
      </div>
    </div>
  );
}
