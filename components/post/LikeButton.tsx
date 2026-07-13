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
      className="flex items-center gap-1 disabled:opacity-50"
    >
      <span className="text-xl">
        {liked ? "❤️" : "🤍"}
      </span>

      <span>{count}</span>
    </button>
  );
}