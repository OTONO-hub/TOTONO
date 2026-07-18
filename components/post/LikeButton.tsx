"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";
import { likePost, unlikePost } from "@/services/likes";
import { createNotification } from "@/services/notifications";

type Props = {
  postId: string;
  userId: string;
  postOwnerId: string;
  initialLiked: boolean;
  initialCount: number;
};

export function LikeButton({
  postId,
  userId,
  postOwnerId,
  initialLiked,
  initialCount,
}: Props) {
  const supabase = useMemo(() => createClient(), []);

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (liked) {
        await unlikePost(supabase, userId, postId);

        setLiked(false);
        setCount((prev) => Math.max(prev - 1, 0));
      } else {
        await likePost(supabase, userId, postId);

        setLiked(true);
        setCount((prev) => prev + 1);

        try {
          await createNotification(supabase, {
            recipientId: postOwnerId,
            actorId: userId,
            type: "like",
            postId,
          });
        } catch (notificationError) {
          console.error(
            "いいね通知の作成に失敗しました。",
            notificationError
          );
        }
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "いいね操作に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      aria-label={liked ? "いいねを解除" : "いいねする"}
      aria-pressed={liked}
      className="
        group
        inline-flex
        items-center
        gap-2
        rounded-full
        text-sm
        text-muted-foreground
        transition-colors
        hover:text-foreground
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        disabled:cursor-not-allowed
        disabled:opacity-50
      "
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`size-5 transition-all duration-200 ${
          liked
            ? "fill-current text-red-500"
            : "fill-none stroke-current group-hover:scale-105"
        }`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path
          d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78Z"
        />
      </svg>

      <span className="tabular-nums">
        {count}
      </span>
    </button>
  );
}