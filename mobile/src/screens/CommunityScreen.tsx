import {
  useEffect,
  useState,
} from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  Flame,
  Heart,
  MapPin,
  MessageCircle,
  RefreshCw,
  Star,
  UserRound,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  bookmarkPost,
  unbookmarkPost,
} from "../services/bookmarks";
import {
  getCommunityFeed,
  type CommunityPost,
} from "../services/community";
import {
  likePost,
  unlikePost,
} from "../services/likes";
import {
  createNotification,
} from "../services/notifications";

type CommunityScreenProps = {
  currentUserId: string;
  onSelectPost: (
    postId: string
  ) => void;
  onSelectUser: (
    userId: string
  ) => void;
};

const PAGE_SIZE =
  15;

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
      month:
        "long",
      day:
        "numeric",
    }
  ).format(
    date
  );
}

function formatCreatedAt(
  createdAt: string
): string {
  const date =
    new Date(
      createdAt
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return "";
  }

  const elapsedMinutes =
    Math.max(
      0,
      Math.floor(
        (
          Date.now() -
          date.getTime()
        ) /
          60000
      )
    );

  if (
    elapsedMinutes <
    1
  ) {
    return "たった今";
  }

  if (
    elapsedMinutes <
    60
  ) {
    return `${elapsedMinutes}分前`;
  }

  const elapsedHours =
    Math.floor(
      elapsedMinutes /
        60
    );

  if (
    elapsedHours <
    24
  ) {
    return `${elapsedHours}時間前`;
  }

  const elapsedDays =
    Math.floor(
      elapsedHours /
        24
    );

  if (
    elapsedDays <
    7
  ) {
    return `${elapsedDays}日前`;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month:
        "short",
      day:
        "numeric",
    }
  ).format(
    date
  );
}

function getAuthorName(
  post: CommunityPost
): string {
  return (
    post.author.username
      ?.trim() ||
    "TOTONOユーザー"
  );
}

function CommunityLoading() {
  return (
    <div
      className="community-loading"
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
            className="community-loading-card"
          >
            <div className="community-loading-author" />

            <div className="community-loading-image" />

            <div className="community-loading-line community-loading-line-wide" />

            <div className="community-loading-line" />
          </div>
        )
      )}

      <p>
        みんなのサ活を
        読み込んでいます...
      </p>
    </div>
  );
}

function CommunityEmpty({
  onRefresh,
}: {
  onRefresh: () => void;
}) {
  return (
    <div className="community-empty">
      <div className="community-empty-icon">
        <Flame
          aria-hidden="true"
        />
      </div>

      <strong>
        まだサ活がありません
      </strong>

      <p>
        新しいサ活が投稿されると、
        ここに表示されます。
      </p>

      <button
        type="button"
        onClick={
          onRefresh
        }
      >
        <RefreshCw
          aria-hidden="true"
        />

        更新する
      </button>
    </div>
  );
}

function CommunityError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="community-error"
      role="alert"
    >
      <strong>
        Communityを
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

function CommunityPostCard({
  post,
  liking,
  bookmarking,
  onSelectPost,
  onSelectUser,
  onToggleLike,
  onToggleBookmark,
}: {
  post: CommunityPost;
  liking: boolean;
  bookmarking: boolean;
  onSelectPost: (
    postId: string
  ) => void;
  onSelectUser: (
    userId: string
  ) => void;
  onToggleLike: (
    post: CommunityPost
  ) => void;
  onToggleBookmark: (
    post: CommunityPost
  ) => void;
}) {
  const authorName =
    getAuthorName(
      post
    );

  const primaryImage =
    post.images[0] ??
    null;

  return (
    <article className="community-post-card">
      <button
        type="button"
        className="community-post-author community-post-author-button"
        onClick={() => {
          onSelectUser(
            post.userId
          );
        }}
        aria-label={`${authorName}のプロフィールを見る`}
      >
        <div className="community-post-avatar">
          {post.author.avatarUrl ? (
            <img
              src={
                post.author.avatarUrl
              }
              alt={`${authorName}のプロフィール画像`}
              loading="lazy"
            />
          ) : (
            <UserRound
              aria-hidden="true"
            />
          )}
        </div>

        <div className="community-post-author-content">
          <strong>
            {authorName}
          </strong>

          <span>
            {formatCreatedAt(
              post.createdAt
            )}
          </span>
        </div>

        <span className="community-author-profile-label">
          プロフィール
        </span>

        <ChevronRight
          className="community-author-arrow"
          aria-hidden="true"
        />
      </button>

      <button
        type="button"
        className="community-post-image-button"
        onClick={() => {
          onSelectPost(
            post.id
          );
        }}
        aria-label={`${post.saunaName}でのサ活詳細を見る`}
      >
        {primaryImage ? (
          <div className="community-post-image">
            <img
              src={
                primaryImage.imageUrl
              }
              alt={`${post.saunaName}でのサ活`}
              loading="lazy"
            />

            {post.images.length >
            1 ? (
              <span className="community-post-image-count">
                1/
                {post.images.length}
              </span>
            ) : null}
          </div>
        ) : (
          <div className="community-post-image community-post-placeholder">
            <Flame
              aria-hidden="true"
            />

            <span>
              Sauna Life
            </span>
          </div>
        )}
      </button>

      <div className="community-post-content">
        <button
          type="button"
          className="community-post-title"
          onClick={() => {
            onSelectPost(
              post.id
            );
          }}
        >
          <span>
            <MapPin
              aria-hidden="true"
            />

            {post.saunaName}
          </span>

          <ChevronRight
            aria-hidden="true"
          />
        </button>

        <div className="community-post-meta">
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

            {post.rating.toFixed(1)}
          </span>
        </div>

        {post.comment ? (
          <button
            type="button"
            className="community-post-comment"
            onClick={() => {
              onSelectPost(
                post.id
              );
            }}
          >
            {post.comment}
          </button>
        ) : null}

        <div className="community-post-actions">
          <button
            type="button"
            className={
              post.isLiked
                ? "community-like-button active"
                : "community-like-button"
            }
            onClick={() => {
              onToggleLike(
                post
              );
            }}
            disabled={
              liking
            }
            aria-pressed={
              post.isLiked
            }
            aria-label={
              post.isLiked
                ? "いいねを解除"
                : "いいねする"
            }
          >
            <Heart
              fill={
                post.isLiked
                  ? "currentColor"
                  : "none"
              }
              aria-hidden="true"
            />

            <span>
              {post.likeCount}
            </span>
          </button>

          <button
            type="button"
            className="community-comment-button"
            onClick={() => {
              onSelectPost(
                post.id
              );
            }}
            aria-label={`コメント${post.commentCount}件を見る`}
          >
            <MessageCircle
              aria-hidden="true"
            />

            <span>
              {post.commentCount}
            </span>
          </button>

          <button
            type="button"
            className={
              post.isBookmarked
                ? "community-bookmark-button active"
                : "community-bookmark-button"
            }
            onClick={() => {
              onToggleBookmark(
                post
              );
            }}
            disabled={
              bookmarking
            }
            aria-pressed={
              post.isBookmarked
            }
            aria-label={
              post.isBookmarked
                ? "投稿の保存を解除"
                : "投稿を保存"
            }
          >
            <Bookmark
              fill={
                post.isBookmarked
                  ? "currentColor"
                  : "none"
              }
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            className="community-detail-button"
            onClick={() => {
              onSelectPost(
                post.id
              );
            }}
          >
            詳細を見る

            <ChevronRight
              aria-hidden="true"
            />
          </button>
        </div>
      </div>
    </article>
  );
}

export function CommunityScreen({
  currentUserId,
  onSelectPost,
  onSelectUser,
}: CommunityScreenProps) {
  const [
    posts,
    setPosts,
  ] =
    useState<
      CommunityPost[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    refreshing,
    setRefreshing,
  ] =
    useState(
      false
    );

  const [
    loadingMore,
    setLoadingMore,
  ] =
    useState(
      false
    );

  const [
    hasMore,
    setHasMore,
  ] =
    useState(
      false
    );

  const [
    likingPostIds,
    setLikingPostIds,
  ] =
    useState<
      Set<string>
    >(
      new Set()
    );

  const [
    bookmarkingPostIds,
    setBookmarkingPostIds,
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

    async function loadInitialFeed() {
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
        const page =
          await getCommunityFeed(
            supabase,
            currentUserId,
            {
              pageSize:
                PAGE_SIZE,

              offset:
                0,
            }
          );

        if (cancelled) {
          return;
        }

        setPosts(
          page.posts
        );

        setHasMore(
          page.hasMore
        );

        setError(
          null
        );
      } catch (
        loadError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          loadError instanceof
            Error
            ? loadError.message
            : "Communityの取得中に問題が発生しました。"
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );

          setRefreshing(
            false
          );
        }
      }
    }

    void loadInitialFeed();

    return () => {
      cancelled =
        true;
    };
  }, [
    currentUserId,
    reloadKey,
  ]);

  function handleRefresh() {
    if (
      loading ||
      refreshing
    ) {
      return;
    }

    setRefreshing(
      true
    );

    setActionError(
      null
    );

    setReloadKey(
      (
        currentKey
      ) =>
        currentKey +
        1
    );
  }

  async function handleLoadMore() {
    if (
      !supabase ||
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    setLoadingMore(
      true
    );

    setActionError(
      null
    );

    try {
      const page =
        await getCommunityFeed(
          supabase,
          currentUserId,
          {
            pageSize:
              PAGE_SIZE,

            offset:
              posts.length,
          }
        );

      setPosts(
        (
          currentPosts
        ) => {
          const existingIds =
            new Set(
              currentPosts.map(
                (
                  post
                ) =>
                  post.id
              )
            );

          const newPosts =
            page.posts.filter(
              (
                post
              ) =>
                !existingIds.has(
                  post.id
                )
            );

          return [
            ...currentPosts,
            ...newPosts,
          ];
        }
      );

      setHasMore(
        page.hasMore
      );
    } catch (
      loadMoreError
    ) {
      setActionError(
        loadMoreError instanceof
          Error
          ? loadMoreError.message
          : "続きを取得できませんでした。"
      );
    } finally {
      setLoadingMore(
        false
      );
    }
  }

  async function createLikeNotification(
    post: CommunityPost
  ) {
    if (
      !supabase ||
      post.userId ===
        currentUserId
    ) {
      return;
    }

    try {
      await createNotification(
        supabase,
        {
          recipientId:
            post.userId,

          actorId:
            currentUserId,

          type:
            "like",

          postId:
            post.id,
        }
      );
    } catch (
      notificationError
    ) {
      console.error(
        "いいね通知の作成に失敗しました。",
        notificationError
      );
    }
  }

  async function handleToggleLike(
    post: CommunityPost
  ) {
    if (
      !supabase ||
      likingPostIds.has(
        post.id
      )
    ) {
      return;
    }

    const previousLiked =
      post.isLiked;

    setLikingPostIds(
      (
        currentIds
      ) => {
        const nextIds =
          new Set(
            currentIds
          );

        nextIds.add(
          post.id
        );

        return nextIds;
      }
    );

    setActionError(
      null
    );

    setPosts(
      (
        currentPosts
      ) =>
        currentPosts.map(
          (
            currentPost
          ) =>
            currentPost.id ===
            post.id
              ? {
                  ...currentPost,

                  isLiked:
                    !previousLiked,

                  likeCount:
                    Math.max(
                      0,
                      currentPost.likeCount +
                        (
                          previousLiked
                            ? -1
                            : 1
                        )
                    ),
                }
              : currentPost
        )
    );

    try {
      if (
        previousLiked
      ) {
        await unlikePost(
          supabase,
          currentUserId,
          post.id
        );
      } else {
        await likePost(
          supabase,
          currentUserId,
          post.id
        );

        await createLikeNotification(
          post
        );
      }
    } catch (
      likeError
    ) {
      setPosts(
        (
          currentPosts
        ) =>
          currentPosts.map(
            (
              currentPost
            ) =>
              currentPost.id ===
              post.id
                ? {
                    ...currentPost,

                    isLiked:
                      previousLiked,

                    likeCount:
                      post.likeCount,
                  }
                : currentPost
          )
      );

      setActionError(
        likeError instanceof
          Error
          ? likeError.message
          : "いいねを更新できませんでした。"
      );
    } finally {
      setLikingPostIds(
        (
          currentIds
        ) => {
          const nextIds =
            new Set(
              currentIds
            );

          nextIds.delete(
            post.id
          );

          return nextIds;
        }
      );
    }
  }

  async function handleToggleBookmark(
    post: CommunityPost
  ) {
    if (
      !supabase ||
      bookmarkingPostIds.has(
        post.id
      )
    ) {
      return;
    }

    const previousBookmarked =
      post.isBookmarked;

    setBookmarkingPostIds(
      (
        currentIds
      ) => {
        const nextIds =
          new Set(
            currentIds
          );

        nextIds.add(
          post.id
        );

        return nextIds;
      }
    );

    setActionError(
      null
    );

    setPosts(
      (
        currentPosts
      ) =>
        currentPosts.map(
          (
            currentPost
          ) =>
            currentPost.id ===
            post.id
              ? {
                  ...currentPost,

                  isBookmarked:
                    !previousBookmarked,
                }
              : currentPost
        )
    );

    try {
      if (
        previousBookmarked
      ) {
        await unbookmarkPost(
          supabase,
          currentUserId,
          post.id
        );
      } else {
        await bookmarkPost(
          supabase,
          currentUserId,
          post.id
        );
      }
    } catch (
      bookmarkError
    ) {
      setPosts(
        (
          currentPosts
        ) =>
          currentPosts.map(
            (
              currentPost
            ) =>
              currentPost.id ===
              post.id
                ? {
                    ...currentPost,

                    isBookmarked:
                      previousBookmarked,
                  }
                : currentPost
          )
      );

      setActionError(
        bookmarkError instanceof
          Error
          ? bookmarkError.message
          : "保存状態を更新できませんでした。"
      );
    } finally {
      setBookmarkingPostIds(
        (
          currentIds
        ) => {
          const nextIds =
            new Set(
              currentIds
            );

          nextIds.delete(
            post.id
          );

          return nextIds;
        }
      );
    }
  }

  if (loading) {
    return (
      <section className="community-screen">
        <CommunityLoading />
      </section>
    );
  }

  if (
    error &&
    posts.length ===
      0
  ) {
    return (
      <section className="community-screen">
        <CommunityError
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
      </section>
    );
  }

  return (
    <section className="community-screen">
      <header className="community-header">
        <div>
          <p className="eyebrow">
            Community
          </p>

          <h1>
            みんなのサ活
          </h1>

          <p className="lead">
            サウナを愛する人たちの、
            今日の記録。
          </p>
        </div>

        <button
          type="button"
          className="community-refresh-button"
          onClick={
            handleRefresh
          }
          disabled={
            refreshing
          }
          aria-label="Communityを更新"
        >
          <RefreshCw
            className={
              refreshing
                ? "spinning"
                : undefined
            }
            aria-hidden="true"
          />
        </button>
      </header>

      {actionError ? (
        <p
          className="community-action-error"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      {posts.length ===
      0 ? (
        <CommunityEmpty
          onRefresh={
            handleRefresh
          }
        />
      ) : (
        <div className="community-feed">
          {posts.map(
            (
              post
            ) => (
              <CommunityPostCard
                key={
                  post.id
                }
                post={
                  post
                }
                liking={
                  likingPostIds.has(
                    post.id
                  )
                }
                bookmarking={
                  bookmarkingPostIds.has(
                    post.id
                  )
                }
                onSelectPost={
                  onSelectPost
                }
                onSelectUser={
                  onSelectUser
                }
                onToggleLike={(
                  selectedPost
                ) => {
                  void handleToggleLike(
                    selectedPost
                  );
                }}
                onToggleBookmark={(
                  selectedPost
                ) => {
                  void handleToggleBookmark(
                    selectedPost
                  );
                }}
              />
            )
          )}
        </div>
      )}

      {hasMore ? (
        <button
          type="button"
          className="community-load-more"
          onClick={() => {
            void handleLoadMore();
          }}
          disabled={
            loadingMore
          }
        >
          {loadingMore
            ? "読み込んでいます..."
            : "さらに表示"}
        </button>
      ) : posts.length >
        0 ? (
        <p className="community-feed-end">
          すべてのサ活を表示しました
        </p>
      ) : null}
    </section>
  );
}
