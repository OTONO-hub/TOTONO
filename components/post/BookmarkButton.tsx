"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  addBookmark,
  removeBookmark,
} from "@/services/bookmarks";

type Props = {
  postId: string;
  userId: string;
  initialBookmarked: boolean;
};

export function BookmarkButton({
  postId,
  userId,
  initialBookmarked,
}: Props) {
  const supabase = createClient();

  const [bookmarked, setBookmarked] = useState(initialBookmarked);
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (bookmarked) {
        await removeBookmark(supabase, userId, postId);
        setBookmarked(false);
      } else {
        await addBookmark(supabase, userId, postId);
        setBookmarked(true);
      }
    } catch (error) {
      alert(
        error instanceof Error
          ? error.message
          : "エラーが発生しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={loading}
      aria-label={
        bookmarked
          ? "ブックマークを解除"
          : "ブックマークに保存"
      }
      className="flex items-center disabled:opacity-50"
    >
      <span className="text-xl">
        {bookmarked ? "🔖" : "🏷️"}
      </span>
    </button>
  );
}