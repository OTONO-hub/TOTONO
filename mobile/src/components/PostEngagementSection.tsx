import {
  useEffect,
  useState,
} from "react";
import {
  Heart,
  MessageCircle,
  RefreshCw,
  Send,
  Trash2,
  UserRound,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  createComment,
  deleteComment,
  getCommentsWithAuthorsByPostId,
} from "../services/comments";
import {
  getPostLikeState,
  likePost,
  unlikePost,
} from "../services/likes";
import {
  createNotification,
} from "../services/notifications";
import type {
  CommentWithAuthor,
} from "../types/comment";
import type {
  NotificationType,
} from "../types/notification";

type PostEngagementSectionProps = {
  postId: string;
  postOwnerId: string;
  currentUserId: string;
};

const MAX_COMMENT_LENGTH =
  300;

function formatCommentDate(
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
    return createdAt;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone:
        "Asia/Tokyo",
      month:
        "short",
      day:
        "numeric",
      hour:
        "2-digit",
      minute:
        "2-digit",
    }
  ).format(
    date
  );
}

function getAuthorName(
  item: CommentWithAuthor
): string {
  const username =
    item.author
      ?.username
      ?.trim();

  return (
    username ||
    "TOTONOユーザー"
  );
}

function EngagementLoading() {
  return (
    <div
      className="post-engagement-loading"
      role="status"
      aria-live="polite"
    >
      <div className="post-engagement-loading-actions" />

      <div className="post-engagement-loading-comment" />

      <p>
        みんなの反応を
        読み込んでいます...
      </p>
    </div>
  );
}

function EngagementError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="post-engagement-error"
      role="alert"
    >
      <strong>
        反応を読み込めませんでした
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

function CommentItem({
  item,
  currentUserId,
  deletingCommentId,
  onDelete,
}: {
  item: CommentWithAuthor;
  currentUserId: string;
  deletingCommentId:
    | string
    | null;
  onDelete: (
    commentId: string
  ) => void;
}) {
  const {
    comment,
    author,
  } =
    item;

  const authorName =
    getAuthorName(
      item
    );

  const isOwnComment =
    comment.user_id ===
    currentUserId;

  const isDeleting =
    deletingCommentId ===
    comment.id;

  return (
    <article className="post-comment-card">
      <div className="post-comment-avatar">
        {author?.avatar_url ? (
          <img
            src={
              author.avatar_url
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

      <div className="post-comment-content">
        <div className="post-comment-header">
          <div>
            <strong>
              {authorName}
            </strong>

            <time
              dateTime={
                comment.created_at
              }
            >
              {formatCommentDate(
                comment.created_at
              )}
            </time>
          </div>

          {isOwnComment ? (
            <button
              type="button"
              className="post-comment-delete"
              onClick={() => {
                onDelete(
                  comment.id
                );
              }}
              disabled={
                isDeleting
              }
              aria-label="コメントを削除"
            >
              <Trash2
                aria-hidden="true"
              />
            </button>
          ) : null}
        </div>

        <p>
          {comment.content}
        </p>

        {isDeleting ? (
          <span className="post-comment-deleting">
            削除しています...
          </span>
        ) : null}
      </div>
    </article>
  );
}

export function PostEngagementSection({
  postId,
  postOwnerId,
  currentUserId,
}: PostEngagementSectionProps) {
  const [
    likeCount,
    setLikeCount,
  ] =
    useState(
      0
    );

  const [
    liked,
    setLiked,
  ] =
    useState(
      false
    );

  const [
    comments,
    setComments,
  ] =
    useState<
      CommentWithAuthor[]
    >([]);

  const [
    commentText,
    setCommentText,
  ] =
    useState("");

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    liking,
    setLiking,
  ] =
    useState(
      false
    );

  const [
    submittingComment,
    setSubmittingComment,
  ] =
    useState(
      false
    );

  const [
    deletingCommentId,
    setDeletingCommentId,
  ] =
    useState<
      string | null
    >(
      null
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

    async function loadEngagement() {
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
        const [
          likeState,
          nextComments,
        ] =
          await Promise.all([
            getPostLikeState(
              supabase,
              currentUserId,
              postId
            ),

            getCommentsWithAuthorsByPostId(
              supabase,
              postId
            ),
          ]);

        if (cancelled) {
          return;
        }

        setLikeCount(
          likeState.count
        );

        setLiked(
          likeState.isLiked
        );

        setComments(
          nextComments
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
            : "反応の取得中に問題が発生しました。"
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

    void loadEngagement();

    return () => {
      cancelled =
        true;
    };
  }, [
    currentUserId,
    postId,
    reloadKey,
  ]);

  async function createEngagementNotification(
    type: NotificationType
  ) {
    if (
      !supabase ||
      currentUserId ===
        postOwnerId
    ) {
      return;
    }

    try {
      await createNotification(
        supabase,
        {
          recipientId:
            postOwnerId,

          actorId:
            currentUserId,

          type,

          postId,
        }
      );
    } catch (
      notificationError
    ) {
      console.error(
        "通知の作成に失敗しました。",
        notificationError
      );
    }
  }

  async function reloadComments() {
    if (!supabase) {
      return;
    }

    const nextComments =
      await getCommentsWithAuthorsByPostId(
        supabase,
        postId
      );

    setComments(
      nextComments
    );
  }

  async function handleLikeToggle() {
    if (
      !supabase ||
      liking
    ) {
      return;
    }

    const client =
      supabase;

    const previousLiked =
      liked;

    const previousCount =
      likeCount;

    setLiking(
      true
    );

    setActionError(
      null
    );

    setLiked(
      !previousLiked
    );

    setLikeCount(
      Math.max(
        0,
        previousCount +
          (
            previousLiked
              ? -1
              : 1
          )
      )
    );

    try {
      if (
        previousLiked
      ) {
        await unlikePost(
          client,
          currentUserId,
          postId
        );
      } else {
        await likePost(
          client,
          currentUserId,
          postId
        );

        await createEngagementNotification(
          "like"
        );
      }
    } catch (
      likeError
    ) {
      setLiked(
        previousLiked
      );

      setLikeCount(
        previousCount
      );

      setActionError(
        likeError instanceof
          Error
          ? likeError.message
          : "いいねを更新できませんでした。"
      );
    } finally {
      setLiking(
        false
      );
    }
  }

  async function handleSubmitComment() {
    if (
      !supabase ||
      submittingComment
    ) {
      return;
    }

    const normalizedComment =
      commentText.trim();

    if (
      !normalizedComment
    ) {
      setActionError(
        "コメントを入力してください。"
      );

      return;
    }

    if (
      normalizedComment.length >
      MAX_COMMENT_LENGTH
    ) {
      setActionError(
        `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`
      );

      return;
    }

    const client =
      supabase;

    setSubmittingComment(
      true
    );

    setActionError(
      null
    );

    try {
      await createComment(
        client,
        {
          user_id:
            currentUserId,

          post_id:
            postId,

          content:
            normalizedComment,
        }
      );

      setCommentText("");

      await Promise.all([
        reloadComments(),

        createEngagementNotification(
          "comment"
        ),
      ]);
    } catch (
      commentError
    ) {
      setActionError(
        commentError instanceof
          Error
          ? commentError.message
          : "コメントを投稿できませんでした。"
      );
    } finally {
      setSubmittingComment(
        false
      );
    }
  }

  async function handleDeleteComment(
    commentId: string
  ) {
    if (
      !supabase ||
      deletingCommentId
    ) {
      return;
    }

    const client =
      supabase;

    setDeletingCommentId(
      commentId
    );

    setActionError(
      null
    );

    try {
      await deleteComment(
        client,
        commentId,
        currentUserId
      );

      setComments(
        (
          currentComments
        ) =>
          currentComments.filter(
            (
              item
            ) =>
              item.comment.id !==
              commentId
          )
      );
    } catch (
      deleteError
    ) {
      setActionError(
        deleteError instanceof
          Error
          ? deleteError.message
          : "コメントを削除できませんでした。"
      );
    } finally {
      setDeletingCommentId(
        null
      );
    }
  }

  if (loading) {
    return (
      <section className="post-engagement-section">
        <EngagementLoading />
      </section>
    );
  }

  if (error) {
    return (
      <section className="post-engagement-section">
        <EngagementError
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
    <section
      className="post-engagement-section"
      aria-labelledby="post-engagement-heading"
    >
      <div className="post-engagement-heading">
        <div>
          <p className="eyebrow">
            Community
          </p>

          <h2 id="post-engagement-heading">
            みんなの反応
          </h2>
        </div>

        <span>
          {comments.length}
          コメント
        </span>
      </div>

      <div className="post-engagement-actions">
        <button
          type="button"
          className={
            liked
              ? "post-like-button active"
              : "post-like-button"
          }
          onClick={() => {
            void handleLikeToggle();
          }}
          disabled={
            liking
          }
          aria-pressed={
            liked
          }
          aria-label={
            liked
              ? "いいねを解除"
              : "いいねする"
          }
        >
          <Heart
            fill={
              liked
                ? "currentColor"
                : "none"
            }
            aria-hidden="true"
          />

          <strong>
            {liked
              ? "いいね済み"
              : "いいね"}
          </strong>

          <span>
            {likeCount}
          </span>
        </button>

        <div className="post-comment-count">
          <MessageCircle
            aria-hidden="true"
          />

          <strong>
            コメント
          </strong>

          <span>
            {comments.length}
          </span>
        </div>
      </div>

      <form
        className="post-comment-form"
        onSubmit={(
          event
        ) => {
          event.preventDefault();

          void handleSubmitComment();
        }}
      >
        <label htmlFor={`post-comment-${postId}`}>
          コメントを追加
        </label>

        <textarea
          id={`post-comment-${postId}`}
          value={
            commentText
          }
          onChange={(
            event
          ) => {
            setCommentText(
              event.target
                .value
                .slice(
                  0,
                  MAX_COMMENT_LENGTH
                )
            );
          }}
          placeholder="このサ活にコメントしてみましょう。"
          rows={4}
          disabled={
            submittingComment
          }
        />

        <div className="post-comment-form-footer">
          <span>
            {commentText.length}
            /{MAX_COMMENT_LENGTH}
          </span>

          <button
            type="submit"
            disabled={
              !commentText.trim() ||
              submittingComment
            }
          >
            <Send
              aria-hidden="true"
            />

            {submittingComment
              ? "送信中..."
              : "コメントする"}
          </button>
        </div>
      </form>

      {actionError ? (
        <p
          className="post-engagement-action-error"
          role="alert"
        >
          {actionError}
        </p>
      ) : null}

      {comments.length ===
      0 ? (
        <div className="post-comments-empty">
          <MessageCircle
            aria-hidden="true"
          />

          <strong>
            まだコメントはありません
          </strong>

          <p>
            最初のコメントを
            残してみましょう。
          </p>
        </div>
      ) : (
        <div className="post-comment-list">
          {comments.map(
            (
              item
            ) => (
              <CommentItem
                key={
                  item.comment.id
                }
                item={
                  item
                }
                currentUserId={
                  currentUserId
                }
                deletingCommentId={
                  deletingCommentId
                }
                onDelete={(
                  commentId
                ) => {
                  void handleDeleteComment(
                    commentId
                  );
                }}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}
