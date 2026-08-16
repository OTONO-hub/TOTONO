import {
  useEffect,
  useState,
} from "react";
import {
  Bookmark,
  RefreshCw,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  bookmarkPost,
  getPostBookmarkState,
  unbookmarkPost,
} from "../services/bookmarks";

type PostBookmarkButtonProps = {
  currentUserId: string;
  postId: string;
};

export function PostBookmarkButton({
  currentUserId,
  postId,
}: PostBookmarkButtonProps) {
  const [
    bookmarked,
    setBookmarked,
  ] =
    useState(
      false
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    updating,
    setUpdating,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    reloadKey,
    setReloadKey,
  ] =
    useState(
      0
    );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    async function loadBookmarkState() {
      try {
        const state =
          await getPostBookmarkState(
            client,
            currentUserId,
            postId
          );

        if (cancelled) {
          return;
        }

        setBookmarked(
          state.isBookmarked
        );

        setError(
          null
        );
      } catch (
        bookmarkError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          bookmarkError instanceof
            Error
            ? bookmarkError.message
            : "保存状態を取得できませんでした。"
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    }

    void loadBookmarkState();

    return () => {
      cancelled =
        true;
    };
  }, [
    currentUserId,
    postId,
    reloadKey,
  ]);

  async function handleToggleBookmark() {
    if (
      !supabase ||
      loading ||
      updating
    ) {
      return;
    }

    const client =
      supabase;

    const previousBookmarked =
      bookmarked;

    setUpdating(
      true
    );

    setError(
      null
    );

    setBookmarked(
      !previousBookmarked
    );

    try {
      if (
        previousBookmarked
      ) {
        await unbookmarkPost(
          client,
          currentUserId,
          postId
        );
      } else {
        await bookmarkPost(
          client,
          currentUserId,
          postId
        );
      }
    } catch (
      bookmarkError
    ) {
      setBookmarked(
        previousBookmarked
      );

      setError(
        bookmarkError instanceof
          Error
          ? bookmarkError.message
          : "保存状態を更新できませんでした。"
      );
    } finally {
      setUpdating(
        false
      );
    }
  }

  if (loading) {
    return (
      <button
        type="button"
        className="post-bookmark-button loading"
        disabled
        aria-label="保存状態を確認中"
      >
        <Bookmark
          aria-hidden="true"
        />

        <span>
          確認中...
        </span>
      </button>
    );
  }

  if (error) {
    return (
      <div className="post-bookmark-error">
        <p role="alert">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
            setLoading(
              true
            );

            setReloadKey(
              (
                currentKey
              ) =>
                currentKey +
                1
            );
          }}
        >
          <RefreshCw
            aria-hidden="true"
          />

          再読み込み
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={
        bookmarked
          ? "post-bookmark-button active"
          : "post-bookmark-button"
      }
      onClick={() => {
        void handleToggleBookmark();
      }}
      disabled={
        updating
      }
      aria-pressed={
        bookmarked
      }
      aria-label={
        bookmarked
          ? "投稿の保存を解除"
          : "投稿を保存"
      }
    >
      <Bookmark
        fill={
          bookmarked
            ? "currentColor"
            : "none"
        }
        aria-hidden="true"
      />

      <span>
        {updating
          ? "更新中..."
          : bookmarked
            ? "保存済み"
            : "保存する"}
      </span>
    </button>
  );
}
