"use client";

import { useMemo, useState } from "react";
import {
  usePathname,
  useRouter,
} from "next/navigation";
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
  const router = useRouter();
  const pathname = usePathname();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [bookmarked, setBookmarked] =
    useState(initialBookmarked);

  const [loading, setLoading] =
    useState(false);

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

        toast.success(
          "保存済み投稿から削除しました。"
        );

        if (
          pathname === "/bookmarks" ||
          pathname.startsWith("/bookmarks/")
        ) {
          router.refresh();
        }

        return;
      }

      await addBookmark(
        supabase,
        userId,
        postId
      );

      setBookmarked(true);

      toast.success(
        "投稿を保存しました。"
      );
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

  const accessibleLabel = loading
    ? bookmarked
      ? "ブックマークを解除しています"
      : "ブックマークに保存しています"
    : bookmarked
      ? "ブックマークを解除"
      : "ブックマークに保存";

  return (
    <button
      type="button"
      onClick={handleBookmark}
      disabled={loading}
      aria-label={accessibleLabel}
      aria-pressed={bookmarked}
      aria-busy={loading}
      className="
        group
        inline-flex
        size-11
        shrink-0
        items-center
        justify-center
        rounded-full
        text-muted-foreground
        transition-colors
        duration-200
        hover:text-foreground
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        disabled:cursor-not-allowed
        disabled:opacity-50
        motion-reduce:transition-none
      "
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className={`
          size-5
          transition-all
          duration-200
          motion-reduce:transition-none
          ${
            bookmarked
              ? "fill-current text-foreground"
              : "fill-none stroke-current group-hover:scale-105 motion-reduce:group-hover:scale-100"
          }
        `}
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75V22l-6-3.75L6 22V3.75Z" />
      </svg>
    </button>
  );
}
