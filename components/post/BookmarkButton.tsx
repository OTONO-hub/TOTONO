"use client";

import { useMemo, useState } from "react";
import { toast } from "sonner";

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
  const supabase = useMemo(() => createClient(), []);

  const [bookmarked, setBookmarked] = useState(
    initialBookmarked
  );
  const [loading, setLoading] = useState(false);

  const handleBookmark = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (bookmarked) {
        await removeBookmark(
          supabase,
          userId,
          postId
        );

        setBookmarked(false);
      } else {
        await addBookmark(
          supabase,
          userId,
          postId
        );

        setBookmarked(true);
      }
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ブックマーク操作に失敗しました。"
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
      aria-pressed={bookmarked}
      className="
        group
        inline-flex
        items-center
        justify-center
        rounded-full
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
          bookmarked
            ? "fill-current text-foreground"
            : "fill-none stroke-current group-hover:scale-105"
        }`}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V22l-6-3.75L6 22V3.75Z" />
      </svg>
    </button>
  );
}
