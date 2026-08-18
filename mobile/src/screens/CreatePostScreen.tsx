import {
  useMemo,
  useRef,
  useState,
  type ChangeEvent,
} from "react";
import {
  ArrowLeft,
  Check,
  ImagePlus,
  Minus,
  Plus,
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
  PostSauna,
} from "../types/post-sauna";
import type {
  Post,
} from "../types/post";

type CreatePostScreenProps = {
  sauna: PostSauna;
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

const MIN_SET_COUNT =
  1;

const MAX_SET_COUNT =
  20;

const MIN_RATING =
  1;

const MAX_RATING =
  5;

const RATING_STEP =
  0.1;

const MAX_IMAGE_COUNT =
  5;

const MAX_COMMENT_LENGTH =
  1000;

function normalizeRating(
  rating: number
): number {
  return Math.min(
    MAX_RATING,
    Math.max(
      MIN_RATING,
      Math.round(
        rating *
          10
      ) / 10
    )
  );
}

export function CreatePostScreen({
  sauna,
  userId,
  onBack,
  onCreated,
}: CreatePostScreenProps) {
  const imageInputRef =
    useRef<HTMLInputElement>(
      null
    );

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
            sauna.name
              .trim() &&
            visitDate &&
            setCount >=
              MIN_SET_COUNT &&
            setCount <=
              MAX_SET_COUNT &&
            rating >=
              MIN_RATING &&
            rating <=
              MAX_RATING &&
            comment.length <=
              MAX_COMMENT_LENGTH
        ),
      [
        sauna.name,
        setCount,
        rating,
        comment.length,
        userId,
        visitDate,
      ]
    );

  function handleSelectImage() {
    if (
      selectingImages ||
      submitting ||
      images.length >=
        MAX_IMAGE_COUNT
    ) {
      return;
    }

    imageInputRef.current
      ?.click();
  }

  function handleImageInputChange(
    event:
      ChangeEvent<HTMLInputElement>
  ) {
    const selectedFiles =
      Array.from(
        event.target.files ??
          []
      );

    if (
      selectedFiles.length ===
      0
    ) {
      event.target.value =
        "";

      return;
    }

    setSelectingImages(
      true
    );

    setError(
      null
    );

    try {
      const remainingCount =
        MAX_IMAGE_COUNT -
        images.length;

      const acceptedFiles =
        selectedFiles
          .filter(
            (
              file
            ) =>
              file.type.startsWith(
                "image/"
              )
          )
          .slice(
            0,
            remainingCount
          );

      if (
        acceptedFiles.length ===
        0
      ) {
        throw new Error(
          "画像ファイルを選択してください。"
        );
      }

      const selectedImages =
        acceptedFiles.map(
          (
            file
          ): SelectedImage => ({
            id:
              crypto.randomUUID(),

            webPath:
              URL.createObjectURL(
                file
              ),
          })
        );

      setImages(
        (
          current
        ) => [
          ...current,
          ...selectedImages,
        ].slice(
          0,
          MAX_IMAGE_COUNT
        )
      );
    } catch (
      selectError
    ) {
      console.error(
        "写真の選択に失敗しました。",
        selectError
      );

      setError(
        selectError instanceof
          Error
          ? selectError.message
          : "写真を選択できませんでした。"
      );
    } finally {
      setSelectingImages(
        false
      );

      event.target.value =
        "";
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
      ) => {
        const removedImage =
          current.find(
            (
              image
            ) =>
              image.id ===
              id
          );

        if (
          removedImage
            ?.webPath.startsWith(
              "blob:"
            )
        ) {
          URL.revokeObjectURL(
            removedImage.webPath
          );
        }

        return current.filter(
          (
            image
          ) =>
            image.id !==
            id
        );
      }
    );
  }

  function decreaseSetCount() {
    setSetCount(
      (
        current
      ) =>
        Math.max(
          MIN_SET_COUNT,
          current -
            1
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
          current +
            1
        )
    );
  }

  function changeRating(
    amount: number
  ) {
    if (submitting) {
      return;
    }

    setRating(
      (
        current
      ) =>
        normalizeRating(
          current +
            amount
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
              sauna.name
                .trim(),

            visit_date:
              visitDate,

            set_count:
              setCount,

            rating:
              normalizeRating(
                rating
              ),

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

      for (
        const image of
        images
      ) {
        if (
          image.webPath.startsWith(
            "blob:"
          )
        ) {
          URL.revokeObjectURL(
            image.webPath
          );
        }
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
          aria-hidden="true"
        />

        <span>
          {sauna.id
            ? "施設詳細へ戻る"
            : "施設選択へ戻る"}
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

        {!sauna.id ? (
          <span className="create-post-manual-sauna-label">
            未登録施設
          </span>
        ) : null}
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
                    alt="選択した投稿写真"
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
                      aria-hidden="true"
                    />
                  </button>
                </div>
              )
            )}
          </div>
        ) : null}

        <input
          ref={
            imageInputRef
          }
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,image/heif"
          multiple
          className="post-image-file-input"
          onChange={
            handleImageInputChange
          }
          disabled={
            selectingImages ||
            submitting
          }
          aria-label="投稿写真を選択"
        />

        {images.length <
        MAX_IMAGE_COUNT ? (
          <button
            type="button"
            className="post-image-picker"
            onClick={
              handleSelectImage
            }
            disabled={
              selectingImages ||
              submitting
            }
          >
            <ImagePlus
              size={22}
              aria-hidden="true"
            />

            <span>
              {selectingImages
                ? "写真を読み込んでいます..."
                : images.length >
                    0
                  ? "写真を追加する"
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
            aria-label="セット数を減らす"
          >
            <Minus
              size={20}
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
              submitting
            }
            aria-label="セット数を増やす"
          >
            <Plus
              size={20}
              aria-hidden="true"
            />
          </button>
        </div>
      </div>

      <div className="post-form-section">
        <span className="post-form-label">
          評価
        </span>

        <div className="rating-stepper">
          <button
            type="button"
            onClick={() => {
              changeRating(
                -RATING_STEP
              );
            }}
            disabled={
              rating <=
                MIN_RATING ||
              submitting
            }
            aria-label="評価を0.1下げる"
          >
            <Minus
              aria-hidden="true"
            />
          </button>

          <div className="rating-stepper-value">
            <strong>
              {rating.toFixed(
                1
              )}
            </strong>

            <span>
              / 5.0
            </span>
          </div>

          <button
            type="button"
            onClick={() => {
              changeRating(
                RATING_STEP
              );
            }}
            disabled={
              rating >=
                MAX_RATING ||
              submitting
            }
            aria-label="評価を0.1上げる"
          >
            <Plus
              aria-hidden="true"
            />
          </button>
        </div>

        <input
          className="rating-slider"
          type="range"
          min={
            MIN_RATING
          }
          max={
            MAX_RATING
          }
          step={
            RATING_STEP
          }
          value={
            rating
          }
          onChange={(
            event
          ) => {
            setRating(
              normalizeRating(
                Number(
                  event.target
                    .value
                )
              )
            );
          }}
          disabled={
            submitting
          }
          aria-label="評価"
          aria-valuetext={`${rating.toFixed(
            1
          )}点`}
        />

        <div className="rating-slider-labels">
          <span>
            1.0
          </span>

          <span>
            5.0
          </span>
        </div>
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
                  MAX_COMMENT_LENGTH
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
          /{MAX_COMMENT_LENGTH}
        </div>
      </div>

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
              aria-hidden="true"
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
