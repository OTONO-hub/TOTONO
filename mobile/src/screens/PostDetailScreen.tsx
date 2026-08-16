import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Flame,
  MapPin,
  Pencil,
  RefreshCw,
  Star,
  UserRound,
} from "lucide-react";

import {
  PostBookmarkButton,
} from "../components/PostBookmarkButton";
import {
  PostEngagementSection,
} from "../components/PostEngagementSection";
import {
  ReportPostButton,
} from "../components/ReportPostButton";
import {
  SharePostButton,
} from "../components/SharePostButton";
import {
  supabase,
} from "../lib/supabase";
import {
  getPostDetail,
  type PostDetail,
  type PostDetailImage,
} from "../services/post-detail";
import type {
  Sauna,
} from "../services/saunas";

type PostDetailScreenProps = {
  postId: string;
  currentUserId: string;
  onBack: () => void;
  onEdit: (
    postId: string
  ) => void;
  onSelectSauna: (
    sauna: Sauna
  ) => void;
  onSelectUser?: (
    userId: string
  ) => void;
};

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
        "long",
      day:
        "numeric",
      weekday:
        "short",
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
    return createdAt;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone:
        "Asia/Tokyo",
      year:
        "numeric",
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
  post: PostDetail
): string {
  return (
    post.author.username
      ?.trim() ||
    "TOTONOユーザー"
  );
}

function PostDetailLoading() {
  return (
    <div
      className="post-detail-loading"
      role="status"
      aria-live="polite"
    >
      <div className="post-detail-loading-image" />

      <div className="post-detail-loading-line post-detail-loading-line-wide" />

      <div className="post-detail-loading-line" />

      <div className="post-detail-loading-card" />

      <p>
        サ活を読み込んでいます...
      </p>
    </div>
  );
}

function PostDetailError({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div
      className="post-detail-error"
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

        戻る
      </button>
    </div>
  );
}

function PostImageGallery({
  images,
  saunaName,
}: {
  images:
    PostDetailImage[];
  saunaName: string;
}) {
  const [
    selectedIndex,
    setSelectedIndex,
  ] =
    useState(
      0
    );

  if (
    images.length ===
    0
  ) {
    return (
      <div className="post-detail-image-placeholder">
        <Flame
          aria-hidden="true"
        />

        <span>
          Sauna Life
        </span>
      </div>
    );
  }

  const selectedImage =
    images[
      selectedIndex
    ] ??
    images[0];

  return (
    <section
      className="post-detail-gallery"
      aria-label="投稿写真"
    >
      <div className="post-detail-main-image">
        <img
          src={
            selectedImage.imageUrl
          }
          alt={`${saunaName}でのサ活写真 ${selectedIndex + 1}`}
        />

        {images.length >
        1 ? (
          <span className="post-detail-image-count">
            {selectedIndex +
              1}
            /
            {images.length}
          </span>
        ) : null}
      </div>

      {images.length >
      1 ? (
        <div className="post-detail-thumbnails">
          {images.map(
            (
              image,
              index
            ) => (
              <button
                key={
                  image.id
                }
                type="button"
                className={
                  index ===
                  selectedIndex
                    ? "post-detail-thumbnail active"
                    : "post-detail-thumbnail"
                }
                onClick={() => {
                  setSelectedIndex(
                    index
                  );
                }}
                aria-label={`写真${index + 1}を表示`}
                aria-pressed={
                  index ===
                  selectedIndex
                }
              >
                <img
                  src={
                    image.imageUrl
                  }
                  alt=""
                  loading="lazy"
                />
              </button>
            )
          )}
        </div>
      ) : null}
    </section>
  );
}

function PostAuthor({
  post,
  currentUserId,
  onSelectUser,
}: {
  post: PostDetail;
  currentUserId: string;
  onSelectUser?: (
    userId: string
  ) => void;
}) {
  const authorName =
    getAuthorName(
      post
    );

  const isCurrentUser =
    post.userId ===
    currentUserId;

  const canOpenProfile =
    !isCurrentUser &&
    Boolean(
      onSelectUser
    );

  const content = (
    <>
      <div className="post-detail-author-avatar">
        {post.author.avatarUrl ? (
          <img
            src={
              post.author.avatarUrl
            }
            alt={`${authorName}のプロフィール画像`}
          />
        ) : (
          <UserRound
            aria-hidden="true"
          />
        )}
      </div>

      <div className="post-detail-author-identity">
        <span>
          Recorded by
        </span>

        <strong>
          {authorName}
        </strong>

        {canOpenProfile ? (
          <small>
            プロフィールを見る
          </small>
        ) : null}
      </div>

      {canOpenProfile ? (
        <ChevronRight
          className="post-detail-author-arrow"
          aria-hidden="true"
        />
      ) : null}
    </>
  );

  if (
    !canOpenProfile
  ) {
    return (
      <div className="post-detail-author">
        {content}
      </div>
    );
  }

  return (
    <button
      type="button"
      className="post-detail-author post-detail-author-button"
      onClick={() => {
        onSelectUser?.(
          post.userId
        );
      }}
      aria-label={`${authorName}のプロフィールを見る`}
    >
      {content}
    </button>
  );
}

function PostRating({
  rating,
}: {
  rating: number;
}) {
  return (
    <div
      className="post-detail-rating"
      aria-label={`評価5点中${rating}点`}
    >
      {Array.from(
        {
          length:
            5,
        },
        (
          _value,
          index
        ) => (
          <Star
            key={
              index
            }
            className={
              index <
              rating
                ? "active"
                : undefined
            }
            aria-hidden="true"
          />
        )
      )}

      <strong>
        {rating}.0
      </strong>
    </div>
  );
}

function SaunaLink({
  post,
  onSelectSauna,
}: {
  post: PostDetail;
  onSelectSauna: (
    sauna: Sauna
  ) => void;
}) {
  if (!post.sauna) {
    return (
      <div className="post-detail-sauna-card post-detail-sauna-card-static">
        <div className="post-detail-sauna-icon">
          <MapPin
            aria-hidden="true"
          />
        </div>

        <div>
          <span>
            Sauna
          </span>

          <strong>
            {post.saunaName}
          </strong>
        </div>
      </div>
    );
  }

  const sauna =
    post.sauna;

  const location = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(
      (
        value
      ): value is string =>
        Boolean(
          value?.trim()
        )
    )
    .join("");

  return (
    <button
      type="button"
      className="post-detail-sauna-card"
      onClick={() => {
        onSelectSauna(
          sauna
        );
      }}
      aria-label={`${sauna.name}の施設詳細を見る`}
    >
      {sauna.image_url ? (
        <div className="post-detail-sauna-image">
          <img
            src={
              sauna.image_url
            }
            alt=""
            loading="lazy"
          />
        </div>
      ) : (
        <div className="post-detail-sauna-icon">
          <MapPin
            aria-hidden="true"
          />
        </div>
      )}

      <div className="post-detail-sauna-content">
        <span>
          Sauna
        </span>

        <strong>
          {sauna.name}
        </strong>

        {location ||
        sauna.address ? (
          <small>
            {location ||
              sauna.address}
          </small>
        ) : null}
      </div>

      <ChevronRight
        aria-hidden="true"
      />
    </button>
  );
}

function PostDetailContent({
  post,
  currentUserId,
  onEdit,
  onSelectSauna,
  onSelectUser,
}: {
  post: PostDetail;
  currentUserId: string;
  onEdit: (
    postId: string
  ) => void;
  onSelectSauna: (
    sauna: Sauna
  ) => void;
  onSelectUser?: (
    userId: string
  ) => void;
}) {
  const canEdit =
    post.userId ===
    currentUserId;

  return (
    <>
      <PostImageGallery
        images={
          post.images
        }
        saunaName={
          post.saunaName
        }
      />

      <header className="post-detail-header">
        <div className="post-detail-heading">
          <div>
            <p className="eyebrow">
              Sauna Record
            </p>

            <h1>
              {post.saunaName}
            </h1>
          </div>

          <PostRating
            rating={
              post.rating
            }
          />
        </div>

        <div className="post-detail-visit-date">
          <CalendarDays
            aria-hidden="true"
          />

          <time
            dateTime={
              post.visitDate
            }
          >
            {formatVisitDate(
              post.visitDate
            )}
          </time>
        </div>
      </header>

      <div className="post-detail-record-actions">
        <PostBookmarkButton
          currentUserId={
            currentUserId
          }
          postId={
            post.id
          }
        />

        <SharePostButton
          postId={
            post.id
          }
          saunaName={
            post.saunaName
          }
        />

        {supabase ? (
          <ReportPostButton
            supabase={
              supabase
            }
            currentUserId={
              currentUserId
            }
            postId={
              post.id
            }
            postAuthorId={
              post.userId
            }
          />
        ) : null}

        {canEdit ? (
          <div className="post-detail-owner-actions">
            <button
              type="button"
              onClick={() => {
                onEdit(
                  post.id
                );
              }}
            >
              <Pencil
                aria-hidden="true"
              />

              このサ活を編集する
            </button>
          </div>
        ) : null}
      </div>

      <section
        className="post-detail-summary"
        aria-label="サ活の記録"
      >
        <div>
          <span>
            Set Count
          </span>

          <strong>
            {post.setCount}
          </strong>

          <small>
            セット
          </small>
        </div>

        <div>
          <span>
            Rating
          </span>

          <strong>
            {post.rating}
          </strong>

          <small>
            / 5
          </small>
        </div>
      </section>

      {post.comment ? (
        <section
          className="post-detail-comment-section"
          aria-labelledby="post-detail-comment-heading"
        >
          <p className="eyebrow">
            Sauna Note
          </p>

          <h2 id="post-detail-comment-heading">
            今日のサ活
          </h2>

          <p className="post-detail-comment">
            {post.comment}
          </p>
        </section>
      ) : null}

      <PostEngagementSection
        postId={
          post.id
        }
        postOwnerId={
          post.userId
        }
        currentUserId={
          currentUserId
        }
      />

      <section
        className="post-detail-sauna-section"
        aria-labelledby="post-detail-sauna-heading"
      >
        <p className="eyebrow">
          Visited Sauna
        </p>

        <h2 id="post-detail-sauna-heading">
          訪れた施設
        </h2>

        <SaunaLink
          post={
            post
          }
          onSelectSauna={
            onSelectSauna
          }
        />
      </section>

      <footer className="post-detail-footer">
        <PostAuthor
          post={
            post
          }
          currentUserId={
            currentUserId
          }
          onSelectUser={
            onSelectUser
          }
        />

        <p>
          記録日時：
          <time
            dateTime={
              post.createdAt
            }
          >
            {formatCreatedAt(
              post.createdAt
            )}
          </time>
        </p>
      </footer>
    </>
  );
}

export function PostDetailScreen({
  postId,
  currentUserId,
  onBack,
  onEdit,
  onSelectSauna,
  onSelectUser,
}: PostDetailScreenProps) {
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
    loading,
    setLoading,
  ] =
    useState(
      true
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

        setPost(
          nextPost
        );

        setError(
          null
        );
      } catch (
        postError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          postError instanceof
            Error
            ? postError.message
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
    reloadKey,
  ]);

  return (
    <section className="post-detail-screen">
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

      {loading ? (
        <PostDetailLoading />
      ) : null}

      {!loading &&
      (error ||
        !post) ? (
        <PostDetailError
          message={
            error ??
            "投稿が見つかりませんでした。"
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
      ) : null}

      {!loading &&
      !error &&
      post ? (
        <PostDetailContent
          post={
            post
          }
          currentUserId={
            currentUserId
          }
          onEdit={
            onEdit
          }
          onSelectSauna={
            onSelectSauna
          }
          onSelectUser={
            onSelectUser
          }
        />
      ) : null}
    </section>
  );
}
