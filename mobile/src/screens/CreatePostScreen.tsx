import {
  useMemo,
  useState,
} from "react";
import {
  Camera,
} from "@capacitor/camera";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Minus,
  Plus,
  Star,
  X,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  createPostImages,
} from "../services/post-images";
import {
  deleteUploadedPostImages,
  uploadPostImageFromUri,
} from "../services/post-storage";
import {
  createPost,
} from "../services/posts";
import type {
  Sauna,
} from "../services/saunas";
import type {
  Post,
} from "../types/post";

type CreatePostScreenProps = {
  sauna: Sauna;
  userId: string;
  onBack: () => void;
  onCreated: (
    post: Post
  ) => void;
};

type SelectedImage = {
  id: string;
  webPath: string;
};

const MIN_SET_COUNT = 1;
const MAX_SET_COUNT = 20;
const MAX_IMAGE_COUNT = 5;

export function CreatePostScreen({
  sauna,
  userId,
  onBack,
  onCreated,
}: CreatePostScreenProps) {
  const [
    visitDate,
    setVisitDate,
  ] =
    useState(
      getTodayDate()
    );

  const [
    setCount,
    setSetCount,
  ] =
    useState(3);

  const [
    rating,
    setRating,
  ] =
    useState(5);

  const [
    comment,
    setComment,
  ] =
    useState("");

  const [
    images,
    setImages,
  ] =
    useState<
      SelectedImage[]
    >([]);

  const [
    selectingImages,
    setSelectingImages,
  ] =
    useState(false);

  const [
    submitting,
    setSubmitting,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const canSubmit =
    useMemo(
      () =>
        Boolean(
          supabase &&
            userId &&
            sauna.id &&
            sauna.name &&
            visitDate &&
            setCount >=
              MIN_SET_COUNT &&
            rating >= 1 &&
            rating <= 5
        ),
      [
        sauna.id,
        sauna.name,
        setCount,
        rating,
        userId,
        visitDate,
      ]
    );

  async function handleSelectImages() {
    if (
      selectingImages ||
      submitting ||
      images.length >=
        MAX_IMAGE_COUNT
    ) {
      return;
    }

    setSelectingImages(
      true
    );

    setError(
      null
    );

    try {
      const remaining =
        MAX_IMAGE_COUNT -
        images.length;

      const result =
        await Camera.pickImages(
          {
            quality: 85,
            limit:
              remaining,
          }
        );

      const nextImages =
        result.photos
          .filter(
            (
              photo
            ) =>
              Boolean(
                photo.webPath
              )
          )
          .map(
            (
              photo
            ) => ({
              id:
                crypto.randomUUID(),

              webPath:
                photo.webPath!,
            })
          );

      setImages(
        (
          current
        ) => [
          ...current,
          ...nextImages,
        ].slice(
          0,
          MAX_IMAGE_COUNT
        )
      );
    } catch (
      selectError
    ) {
      /*
       * iOSでユーザーが
       * 写真選択をキャンセルした場合は
       * エラー表示しません。
       */
      const message =
        selectError instanceof
        Error
          ? selectError.message
          : "";

      if (
        !message
          .toLowerCase()
          .includes(
            "cancel"
          )
      ) {
        console.error(
          selectError
        );

        setError(
          "写真を選択できませんでした。"
        );
      }
    } finally {
      setSelectingImages(
        false
      );
    }
  }

  function removeImage(
    id: string
  ) {
    if (submitting) {
      return;
    }

    setImages(
      (
        current
      ) =>
        current.filter(
          (
            image
          ) =>
            image.id !==
            id
        )
    );
  }

  function decreaseSetCount() {
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

  async function handleSubmit() {
    if (
      !supabase ||
      !canSubmit ||
      submitting
    ) {
      return;
    }

    const client =
      supabase;

    setSubmitting(
      true
    );

    setError(
      null
    );

    const uploadedFilePaths:
      string[] = [];

    try {
      const uploadedImages = [];

      for (
        let index = 0;
        index <
        images.length;
        index += 1
      ) {
        const image =
          images[index];

        if (!image) {
          continue;
        }

        const uploaded =
          await uploadPostImageFromUri(
            client,
            userId,
            image.webPath,
            index
          );

        uploadedImages.push(
          uploaded
        );

        uploadedFilePaths.push(
          uploaded.filePath
        );
      }

      const firstImageUrl =
        uploadedImages[0]
          ?.publicUrl;

      const post =
        await createPost(
          client,
          {
            user_id:
              userId,

            sauna_id:
              sauna.id,

            sauna_name:
              sauna.name,

            visit_date:
              visitDate,

            set_count:
              setCount,

            rating,

            comment:
              comment.trim(),

            ...(firstImageUrl
              ? {
                  image_url:
                    firstImageUrl,
                }
              : {}),
          }
        );

      if (
        uploadedImages.length >
        0
      ) {
        await createPostImages(
          client,
          uploadedImages.map(
            (
              image,
              index
            ) => ({
              post_id:
                post.id,

              image_url:
                image.publicUrl,

              sort_order:
                index,
            })
          )
        );
      }

      onCreated(
        post
      );
    } catch (
      submitError
    ) {
      console.error(
        submitError
      );

      if (
        uploadedFilePaths.length >
        0
      ) {
        await deleteUploadedPostImages(
          client,
          uploadedFilePaths
        );
      }

      setError(
        submitError
          instanceof Error
          ? submitError.message
          : "投稿に失敗しました。"
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <section className="create-post-screen">
      <button
        type="button"
        className="detail-back-button"
        onClick={
          onBack
        }
        disabled={
          submitting
        }
      >
        <ArrowLeft
          size={18}
        />

        <span>
          施設詳細へ戻る
        </span>
      </button>

      <div className="create-post-header">
        <p className="eyebrow">
          Sauna Journal
        </p>

        <h1>
          サ活を記録する
        </h1>

        <p className="lead">
          {sauna.name}
        </p>
      </div>

      <div className="post-form-section">
        <span className="post-form-label">
          写真
        </span>

        {images.length >
        0 ? (
          <div className="post-image-grid">
            {images.map(
              (
                image
              ) => (
                <div
                  key={
                    image.id
                  }
                  className="post-image-preview"
                >
                  <img
                    src={
                      image.webPath
                    }
                    alt=""
                  />

                  <button
                    type="button"
                    className="post-image-remove"
                    onClick={() => {
                      removeImage(
                        image.id
                      );
                    }}
                    disabled={
                      submitting
                    }
                    aria-label="写真を削除"
                  >
                    <X
                      size={16}
                    />
                  </button>
                </div>
              )
            )}
          </div>
        ) : null}

        {images.length <
        MAX_IMAGE_COUNT ? (
          <button
            type="button"
            className="post-image-picker"
            onClick={() => {
              void handleSelectImages();
            }}
            disabled={
              selectingImages ||
              submitting
            }
          >
            <ImagePlus
              size={22}
            />

            <span>
              {selectingImages
                ? "写真を開いています..."
                : "写真を追加"}
            </span>
          </button>
        ) : null}

        <p className="post-image-count">
          {images.length}
          /{MAX_IMAGE_COUNT}枚
        </p>
      </div>

      <div className="post-form-section">
        <label
          className="post-form-label"
          htmlFor="visit-date"
        >
          訪問日
        </label>

        <input
          id="visit-date"
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
            submitting
          }
        />
      </div>

      <div className="post-form-section">
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
              submitting
            }
          >
            <Minus
              size={20}
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
              submitting
            }
          >
            <Plus
              size={20}
            />
          </button>
        </div>
      </div>

      <div className="post-form-section">
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
                  submitting
                }
              >
                <Star
                  size={28}
                  fill={
                    value <=
                    rating
                      ? "currentColor"
                      : "none"
                  }
                />
              </button>
            )
          )}
        </div>

        <p className="rating-value">
          {rating}.0 / 5.0
        </p>
      </div>

      <div className="post-form-section">
        <label
          className="post-form-label"
          htmlFor="comment"
        >
          今日のサ活
        </label>

        <textarea
          id="comment"
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
                  1000
                )
            );
          }}
          placeholder="サウナ、水風呂、外気浴。今日の体験を残してみましょう。"
          rows={7}
          disabled={
            submitting
          }
        />

        <div className="post-character-count">
          {comment.length}
          /1000
        </div>
      </div>

      {error ? (
        <p className="post-submit-error">
          {error}
        </p>
      ) : null}

      <button
        type="button"
        className="post-submit-button"
        onClick={() => {
          void handleSubmit();
        }}
        disabled={
          !canSubmit ||
          submitting
        }
      >
        {submitting ? (
          "記録しています..."
        ) : (
          <>
            <Check
              size={19}
            />

            <span>
              サ活を記録する
            </span>
          </>
        )}
      </button>
    </section>
  );
}

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
