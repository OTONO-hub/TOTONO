"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { likePost, unlikePost } from "@/services/likes";

type Props = {
  postId: string;
  userId: string;
  initialLiked: boolean;
  initialCount: number;
};

export function LikeButton({
  postId,
  userId,
  initialLiked,
  initialCount,
}: Props) {
  const supabase = createClient();

  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (liked) {
        await unlikePost(supabase, userId, postId);
        setLiked(false);
        setCount((prev) => prev - 1);
      } else {
        await likePost(supabase, userId, postId);
        setLiked(true);
        setCount((prev) => prev + 1);
      }
    } catch (error) {
      alert(error instanceof Error ? error.message : "エラーが発生しました。");
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handleLike}
      disabled={loading}
      className="flex items-center gap-1"
    >
      <span className="text-xl">
        {liked ? "❤️" : "🤍"}
      </span>

      <span>{count}</span>
    </button>
  );
}