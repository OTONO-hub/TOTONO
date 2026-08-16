import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  ArrowLeft,
  CalendarDays,
  Check,
  Flame,
  Minus,
  Plus,
  RefreshCw,
  Star,
  Trash2,
  X,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  deleteOwnPost,
  updateOwnPost,
} from "../services/post-management";
import {
  getPostDetail,
  type PostDetail,
} from "../services/post-detail";
import type {
  Post,
} from "../types/post";

type EditPostScreenProps = {
  postId: string;
  userId: string;
  onBack:
    () => void;
  onUpdated:
    (
      post: Post
    ) => void;
  onDeleted:
    () => void;
};

const MIN_SET_COUNT =
  1;

const MAX_SET_COUNT =
  20;

const MAX_COMMENT_LENGTH =
  1000;

function getTodayDate(): string {
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone:
        "Asia/Tokyo",
      year:
        "numeric",
      month:
        "2-digit",
      day:
        "2-digit",
    }
  ).format(
    new Date()
  );
}

function EditPostLoading() {
  return (
    <div
      className="edit-post-loading"
      role="status"
      aria-live="polite"
    >
      <div className="edit-post-loading-image" />

      <div className="edit-post-loading-line edit-post-loading-line-wide" />

      <div className="edit-post-loading-line" />

      <div className="edit-post-loading-card" />

      <p>
        サ活を読み込んでいます...
      </p>
    </div>
  );
}

function EditPostError({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry:
    () => void;
  onBack:
    () => void;
}) {
  return (
    <div
      className="edit-post-error"
      role="alert"
    >
      <strong>
        サ活を読み込めませんでした
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

      <button
        type="button"
        className="secondary"
        onClick={
          onBack
        }
      >
        <ArrowLeft
          aria-hidden="true"
        />

        投稿詳細へ戻る
      </button>
    </div>
  );
}

function ExistingPostImages({
  post,
}: {
  post: PostDetail;
}) {
  if (
    post.images.length ===
    0
  ) {
    return (
      <div className="edit-post-no-images">
        <Flame
          aria-hidden="true"
        />

        <div>
          <strong>
            写真なし
          </strong>

          <p>
            この投稿には写真が
            登録されていません。
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="edit-post-image-grid">
        {post.images.map(
          (
            image,
            index
          ) => (
            <div
              key={
                image.id
              }
              className="edit-post-image"
            >
              <img
                src={
                  image.imageUrl
                }
                alt={`${post.saunaName}でのサ活写真 ${index + 1}`}
              />

              <span>
                {index +
                  1}
              </span>
            </div>
          )
        )}
      </div>

      <p className="edit-post-image-note">
        現在の写真はそのまま保持されます。
        写真の追加・削除は次の写真編集機能で対応します。
      </p>
    </>
  );
}

function DeleteConfirmation({
  saunaName,
  deleting,
  error,
  onCancel,
  onConfirm,
}: {
  saunaName: string;
  deleting: boolean;
  error:
    | string
    | null;
  onCancel:
    () => void;
  onConfirm:
    () => void;
}) {
  return (
    <div
      className="delete-post-overlay"
      role="presentation"
    >
      <section
        className="delete-post-dialog"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="delete-post-title"
        aria-describedby="delete-post-description"
      >
        <button
          type="button"
          className="delete-post-close"
          onClick={
            onCancel
          }
          disabled={
            deleting
          }
          aria-label="削除確認を閉じる"
        >
          <X
            aria-hidden="true"
          />
        </button>

        <div className="delete-post-icon">
          <Trash2
            aria-hidden="true"
          />
        </div>

        <p className="eyebrow">
          Delete Record
        </p>

        <h2 id="delete-post-title">
          このサ活を削除しますか？
        </h2>

        <p id="delete-post-description">
          「
          {saunaName}
          」の記録と写真が削除されます。
          この操作は元に戻せません。
        </p>

        {error ? (
          <p className="delete-post-error">
            {error}
          </p>
        ) : null}

        <button
          type="button"
          className="delete-post-confirm"
          onClick={
            onConfirm
          }
          disabled={
            deleting
          }
        >
          <Trash2
            aria-hidden="true"
          />

          {deleting
            ? "削除しています..."
            : "完全に削除する"}
        </button>

        <button
          type="button"
          className="secondary delete-post-cancel"
          onClick={
            onCancel
          }
          disabled={
            deleting
          }
        >
          キャンセル
        </button>
      </section>
    </div>
  );
}

export function EditPostScreen({
  postId,
  userId,
  onBack,
  onUpdated,
  onDeleted,
}: EditPostScreenProps) {
  const [
    post,
    setPost,
  ] =
    useState<
      PostDetail | null
    >(
      null
    );

  const [
    visitDate,
    setVisitDate,
  ] =
    useState("");

  const [
    setCount,
    setSetCount,
  ] =
    useState(
      1
    );

  const [
    rating,
    setRating,
  ] =
    useState(
      5
    );

  const [
    comment,
    setComment,
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
    saving,
    setSaving,
  ] =
    useState(
      false
    );

  const [
    deleting,
    setDeleting,
  ] =
    useState(
      false
    );

  const [
    showDeleteConfirmation,
    setShowDeleteConfirmation,
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
    deleteError,
    setDeleteError,
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

  const canSave =
    useMemo(
      () =>
        Boolean(
          supabase &&
          post &&
          post.userId ===
            userId &&
          visitDate &&
          setCount >=
            MIN_SET_COUNT &&
          setCount <=
            MAX_SET_COUNT &&
          rating >= 1 &&
          rating <= 5 &&
          comment.length <=
            MAX_COMMENT_LENGTH
        ),
      [
        comment.length,
        post,
        rating,
        setCount,
        userId,
        visitDate,
      ]
    );

  useEffect(() => {
    let cancelled =
      false;

    async function loadPost() {
      try {
        const nextPost =
          await getPostDetail(
            postId
          );

        if (cancelled) {
          return;
        }

        if (
          nextPost.userId !==
          userId
        ) {
          throw new Error(
            "この投稿を編集する権限がありません。"
          );
        }

        setPost(
          nextPost
        );

        setVisitDate(
          nextPost.visitDate
        );

        setSetCount(
          nextPost.setCount
        );

        setRating(
          nextPost.rating
        );

        setComment(
          nextPost.comment ??
            ""
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
            : "投稿の取得中に問題が発生しました。"
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

    void loadPost();

    return () => {
      cancelled =
        true;
    };
  }, [
    postId,
    userId,
    reloadKey,
  ]);

  function decreaseSetCount() {
    if (
      saving ||
      deleting
    ) {
      return;
    }

    setSetCount(
      (
        current
      ) =>
        Math.max(
          MIN_SET_COUNT,
          current - 1
        )
    );
  }

  function increaseSetCount() {
    if (
      saving ||
      deleting
    ) {
      return;
    }

    setSetCount(
      (
        current
      ) =>
        Math.min(
          MAX_SET_COUNT,
          current + 1
        )
    );
  }

  async function handleSave() {
    if (
      !supabase ||
      !post ||
      !canSave ||
      saving ||
      deleting
    ) {
      return;
    }

    const client =
      supabase;

    setSaving(
      true
    );

    setError(
      null
    );

    try {
      const updatedPost =
        await updateOwnPost(
          client,
          post.id,
          userId,
          {
            visit_date:
              visitDate,

            set_count:
              setCount,

            rating,

            comment:
              comment.trim(),

            image_url:
              post.images[0]
                ?.imageUrl ??
              null,
          }
        );

      onUpdated(
        updatedPost
      );
    } catch (
      saveError
    ) {
      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "投稿を更新できませんでした。"
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  async function handleDelete() {
    if (
      !supabase ||
      !post ||
      deleting ||
      saving
    ) {
      return;
    }

    const client =
      supabase;

    setDeleting(
      true
    );

    setDeleteError(
      null
    );

    try {
      await deleteOwnPost(
        client,
        post.id,
        userId
      );

      onDeleted();
    } catch (
      deletionError
    ) {
      setDeleteError(
        deletionError instanceof
          Error
          ? deletionError.message
          : "投稿を削除できませんでした。"
      );

      setDeleting(
        false
      );
    }
  }

  if (loading) {
    return (
      <section className="edit-post-screen">
        <EditPostLoading />
      </section>
    );
  }

  if (
    error &&
    !post
  ) {
    return (
      <section className="edit-post-screen">
        <EditPostError
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
          onBack={
            onBack
          }
        />
      </section>
    );
  }

  if (!post) {
    return null;
  }

  return (
    <section className="edit-post-screen">
      <button
        type="button"
        className="detail-back-button"
        onClick={
          onBack
        }
        disabled={
          saving ||
          deleting
        }
      >
        <ArrowLeft
          aria-hidden="true"
        />

        投稿詳細へ戻る
      </button>

      <header className="edit-post-header">
        <p className="eyebrow">
          Edit Sauna Journal
        </p>

        <h1>
          サ活を編集する
        </h1>

        <p className="lead">
          {post.saunaName}
        </p>
      </header>

      <section className="post-form-section">
        <span className="post-form-label">
          現在の写真
        </span>

        <ExistingPostImages
          post={
            post
          }
        />
      </section>

      <section className="post-form-section">
        <label
          className="post-form-label"
          htmlFor="edit-visit-date"
        >
          訪問日
        </label>

        <div className="edit-post-input-wrapper">
          <CalendarDays
            aria-hidden="true"
          />

          <input
            id="edit-visit-date"
            className="post-form-input"
            type="date"
            value={
              visitDate
            }
            max={
              getTodayDate()
            }
            onChange={(
              event
            ) => {
              setVisitDate(
                event.target
                  .value
              );
            }}
            disabled={
              saving ||
              deleting
            }
          />
        </div>
      </section>

      <section className="post-form-section">
        <span className="post-form-label">
          セット数
        </span>

        <div className="set-count-control">
          <button
            type="button"
            onClick={
              decreaseSetCount
            }
            disabled={
              setCount <=
                MIN_SET_COUNT ||
              saving ||
              deleting
            }
          >
            <Minus
              aria-hidden="true"
            />
          </button>

          <strong>
            {setCount}
          </strong>

          <span>
            SETS
          </span>

          <button
            type="button"
            onClick={
              increaseSetCount
            }
            disabled={
              setCount >=
                MAX_SET_COUNT ||
              saving ||
              deleting
            }
          >
            <Plus
              aria-hidden="true"
            />
          </button>
        </div>
      </section>

      <section className="post-form-section">
        <span className="post-form-label">
          評価
        </span>

        <div className="rating-input">
          {[1, 2, 3, 4, 5].map(
            (
              value
            ) => (
              <button
                key={
                  value
                }
                type="button"
                className={
                  value <=
                  rating
                    ? "rating-star active"
                    : "rating-star"
                }
                onClick={() => {
                  setRating(
                    value
                  );
                }}
                disabled={
                  saving ||
                  deleting
                }
                aria-label={`評価${value}点`}
                aria-pressed={
                  value ===
                  rating
                }
              >
                <Star
                  fill={
                    value <=
                    rating
                      ? "currentColor"
                      : "none"
                  }
                  aria-hidden="true"
                />
              </button>
            )
          )}
        </div>

        <p className="rating-value">
          {rating}.0 / 5.0
        </p>
      </section>

      <section className="post-form-section">
        <label
          className="post-form-label"
          htmlFor="edit-comment"
        >
          今日のサ活
        </label>

        <textarea
          id="edit-comment"
          className="post-comment-input"
          value={
            comment
          }
          onChange={(
            event
          ) => {
            setComment(
              event.target
                .value
                .slice(
                  0,
                  MAX_COMMENT_LENGTH
                )
            );
          }}
          placeholder="今日のサウナ体験を残してみましょう。"
          rows={7}
          disabled={
            saving ||
            deleting
          }
        />

        <div className="post-character-count">
          {comment.length}
          /{MAX_COMMENT_LENGTH}
        </div>
      </section>

      {error ? (
        <p
          className="post-submit-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="post-submit-button"
        onClick={() => {
          void handleSave();
        }}
        disabled={
          !canSave ||
          saving ||
          deleting
        }
      >
        {saving ? (
          "更新しています..."
        ) : (
          <>
            <Check
              aria-hidden="true"
            />

            変更を保存する
          </>
        )}
      </button>

      <section className="edit-post-danger-zone">
        <p className="eyebrow">
          Danger Zone
        </p>

        <h2>
          投稿を削除
        </h2>

        <p>
          投稿と投稿写真を完全に削除します。
          この操作は元に戻せません。
        </p>

        <button
          type="button"
          className="edit-post-delete-button"
          onClick={() => {
            setDeleteError(
              null
            );

            setShowDeleteConfirmation(
              true
            );
          }}
          disabled={
            saving ||
            deleting
          }
        >
          <Trash2
            aria-hidden="true"
          />

          この投稿を削除する
        </button>
      </section>

      {showDeleteConfirmation ? (
        <DeleteConfirmation
          saunaName={
            post.saunaName
          }
          deleting={
            deleting
          }
          error={
            deleteError
          }
          onCancel={() => {
            if (!deleting) {
              setShowDeleteConfirmation(
                false
              );

              setDeleteError(
                null
              );
            }
          }}
          onConfirm={() => {
            void handleDelete();
          }}
        />
      ) : null}
    </section>
  );
}
