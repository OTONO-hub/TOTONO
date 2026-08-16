import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  Bookmark,
  CalendarDays,
  ChevronRight,
  Flame,
  MapPin,
  RefreshCw,
  Star,
  Trash2,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  getBookmarkedPostIds,
  unbookmarkPost,
} from "../services/bookmarks";
import {
  getPostDetail,
  type PostDetail,
} from "../services/post-detail";

type SavedPostsScreenProps = {
  userId: string;
  onBack: () => void;
  onSelectPost: (
    postId: string
  ) => void;
};

type SavedPostItem = {
  post: PostDetail;
};

const SAVED_POST_LIMIT =
  30;

function formatVisitDate(
  visitDate: string
): string {
  const date =
    new Date(
      `${visitDate}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return visitDate;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      year:
        "numeric",
      month:
        "short",
      day:
        "numeric",
    }
  ).format(
    date
  );
}

function SavedPostsLoading() {
  return (
    <div
      className="saved-posts-loading"
      role="status"
      aria-live="polite"
    >
      {[1, 2, 3].map(
        (
          item
        ) => (
          <div
            key={
              item
            }
            className="saved-posts-loading-card"
          >
            <div />

            <span />

            <span />
          </div>
        )
      )}

      <p>
        保存済み投稿を
        読み込んでいます...
      </p>
    </div>
  );
}

function SavedPostsError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="saved-posts-error"
      role="alert"
    >
      <strong>
        保存済み投稿を
        読み込めませんでした
      </strong>

      <p>
        {message}
      </p>

      <button
        type="button"
        onClick={
          onRetry
        }
      >
        <RefreshCw
          aria-hidden="true"
        />

        もう一度試す
      </button>
    </div>
  );
}

function SavedPostsEmpty() {
  return (
    <div className="saved-posts-empty">
      <div className="saved-posts-empty-icon">
        <Bookmark
          aria-hidden="true"
        />
      </div>

      <strong>
        保存済み投稿は
        まだありません
      </strong>

      <p>
        気になるサ活を保存すると、
        ここからいつでも見返せます。
      </p>
    </div>
  );
}

function SavedPostCard({
  item,
  removing,
  onSelectPost,
  onRemove,
}: {
  item: SavedPostItem;
  removing: boolean;
  onSelectPost: (
    postId: string
  ) => void;
  onRemove: (
    postId: string
  ) => void;
}) {
  const {
    post,
  } =
    item;

  const primaryImage =
    post.images[0] ??
    null;

  return (
    <article className="saved-post-card">
      <button
        type="button"
        className="saved-post-main"
        onClick={() => {
          onSelectPost(
            post.id
          );
        }}
        aria-label={`${post.saunaName}でのサ活詳細を見る`}
      >
        {primaryImage ? (
          <div className="saved-post-image">
            <img
              src={
                primaryImage.imageUrl
              }
              alt={`${post.saunaName}でのサ活`}
              loading="lazy"
            />
          </div>
        ) : (
          <div className="saved-post-image saved-post-image-placeholder">
            <Flame
              aria-hidden="true"
            />
          </div>
        )}

        <div className="saved-post-content">
          <div className="saved-post-title">
            <MapPin
              aria-hidden="true"
            />

            <h2>
              {post.saunaName}
            </h2>
          </div>

          <div className="saved-post-meta">
            <span>
              <CalendarDays
                aria-hidden="true"
              />

              {formatVisitDate(
                post.visitDate
              )}
            </span>

            <span>
              <Flame
                aria-hidden="true"
              />

              {post.setCount}
              セット
            </span>

            <span>
              <Star
                aria-hidden="true"
              />

              {post.rating}.0
            </span>
          </div>

          {post.comment ? (
            <p>
              {post.comment}
            </p>
          ) : null}

          <span className="saved-post-detail-link">
            詳細を見る

            <ChevronRight
              aria-hidden="true"
            />
          </span>
        </div>
      </button>

      <button
        type="button"
        className="saved-post-remove"
        onClick={() => {
          onRemove(
            post.id
          );
        }}
        disabled={
          removing
        }
        aria-label={`${post.saunaName}の保存を解除`}
      >
        <Trash2
          aria-hidden="true"
        />

        {removing
          ? "解除中..."
          : "保存を解除"}
      </button>
    </article>
  );
}

export function SavedPostsScreen({
  userId,
  onBack,
  onSelectPost,
}: SavedPostsScreenProps) {
  const [
    savedPosts,
    setSavedPosts,
  ] =
    useState<
      SavedPostItem[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    removingPostIds,
    setRemovingPostIds,
  ] =
    useState<
      Set<string>
    >(
      new Set()
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
    actionError,
    setActionError,
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
    let cancelled =
      false;

    async function loadSavedPosts() {
      if (!supabase) {
        if (
          !cancelled
        ) {
          setError(
            "Supabaseの設定が見つかりません。"
          );

          setLoading(
            false
          );
        }

        return;
      }

      try {
        const postIds =
          await getBookmarkedPostIds(
            supabase,
            userId
          );

        const limitedPostIds =
          postIds.slice(
            0,
            SAVED_POST_LIMIT
          );

        const postResults =
          await Promise.allSettled(
            limitedPostIds.map(
              (
                postId
              ) =>
                getPostDetail(
                  postId
                )
            )
          );

        if (cancelled) {
          return;
        }

        const availablePosts =
          postResults
            .filter(
              (
                result
              ): result is PromiseFulfilledResult<PostDetail> =>
                result.status ===
                "fulfilled"
            )
            .map(
              (
                result
              ) => ({
                post:
                  result.value,
              })
            );

        setSavedPosts(
          availablePosts
        );

        setError(
          null
        );
      } catch (
        savedPostsError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          savedPostsError instanceof
            Error
            ? savedPostsError.message
            : "保存済み投稿の取得中に問題が発生しました。"
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

    void loadSavedPosts();

    return () => {
      cancelled =
        true;
    };
  }, [
    userId,
    reloadKey,
  ]);

  async function handleRemoveBookmark(
    postId: string
  ) {
    if (
      !supabase ||
      removingPostIds.has(
        postId
      )
    ) {
      return;
    }

    const client =
      supabase;

    setRemovingPostIds(
      (
        currentIds
      ) => {
        const nextIds =
          new Set(
            currentIds
          );

        nextIds.add(
          postId
        );

        return nextIds;
      }
    );

    setActionError(
      null
    );

    try {
      await unbookmarkPost(
        client,
        userId,
        postId
      );

      setSavedPosts(
        (
          currentPosts
        ) =>
          currentPosts.filter(
            (
              item
            ) =>
              item.post.id !==
              postId
          )
      );
    } catch (
      removeError
    ) {
      setActionError(
        removeError instanceof
          Error
          ? removeError.message
          : "保存を解除できませんでした。"
      );
    } finally {
      setRemovingPostIds(
        (
          currentIds
        ) => {
          const nextIds =
            new Set(
              currentIds
            );

          nextIds.delete(
            postId
          );

          return nextIds;
        }
      );
    }
  }

  return (
    <section className="saved-posts-screen">
      <header className="saved-posts-header">
        <button
          type="button"
          className="detail-back-button"
          onClick={
            onBack
          }
        >
          <ArrowLeft
            aria-hidden="true"
          />

          戻る
        </button>

        <div>
          <p className="eyebrow">
            Saved Sauna Life
          </p>

          <h1>
            保存済み投稿
          </h1>

          <p className="lead">
            また読み返したい、
            みんなのサウナライフ。
          </p>
        </div>
      </header>

      {loading ? (
        <SavedPostsLoading />
      ) : null}

      {!loading &&
      error ? (
        <SavedPostsError
          message={
            error
          }
          onRetry={() => {
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
        />
      ) : null}

      {!loading &&
      !error &&
      actionError ? (
        <p
          className="saved-posts-action-error"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      {!loading &&
      !error &&
      savedPosts.length ===
        0 ? (
        <SavedPostsEmpty />
      ) : null}

      {!loading &&
      !error &&
      savedPosts.length >
        0 ? (
        <div className="saved-posts-list">
          {savedPosts.map(
            (
              item
            ) => (
              <SavedPostCard
                key={
                  item.post.id
                }
                item={
                  item
                }
                removing={
                  removingPostIds.has(
                    item.post.id
                  )
                }
                onSelectPost={
                  onSelectPost
                }
                onRemove={(
                  postId
                ) => {
                  void handleRemoveBookmark(
                    postId
                  );
                }}
              />
            )
          )}
        </div>
      ) : null}
    </section>
  );
}
