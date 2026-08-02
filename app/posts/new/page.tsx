"use client";

import {
  type ChangeEvent,
  type FormEvent,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import {
  ImagePlus,
  LoaderCircle,
  Send,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { SaunaSearch } from "@/components/saunas/SaunaSearch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  compressPostImage,
  validatePostImage,
} from "@/services/image";
import {
  createPostImages,
} from "@/services/post-images";
import {
  createPost,
  deletePost,
  updatePost,
} from "@/services/posts";
import {
  getSaunaById,
  type Sauna,
} from "@/services/saunas";
import {
  deletePostImages,
  uploadPostImages,
} from "@/services/storage";

const MAX_COMMENT_LENGTH = 1000;
const MAX_POST_IMAGE_COUNT = 5;
const MIN_RATING = 1;
const MAX_RATING = 5;
const RATING_STEP = 0.1;

type SelectedPostImage = {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
};

export default function NewPostPage() {
  const router = useRouter();

  const ratingHelpTextId = useId();
  const imagesHelpTextId = useId();
  const imagesCountId = useId();
  const commentCountId = useId();
  const formStatusId = useId();

  const visitDateRef =
    useRef<HTMLInputElement>(null);

  const [supabase] = useState(() =>
    createClient()
  );

  const [
    selectedSauna,
    setSelectedSauna,
  ] = useState<Sauna | null>(null);

  const [
    initialSaunaLoading,
    setInitialSaunaLoading,
  ] = useState(true);

  const [isTodayPost, setIsTodayPost] =
    useState(false);

  const [visitDate, setVisitDate] =
    useState("");

  const [setCount, setSetCount] =
    useState(3);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [images, setImages] =
    useState<SelectedPostImage[]>([]);

  const imagesRef =
    useRef<SelectedPostImage[]>([]);

  const [loading, setLoading] =
    useState(false);

  const [
    compressing,
    setCompressing,
  ] = useState(false);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  useEffect(() => {
    return () => {
      for (const image of imagesRef.current) {
        URL.revokeObjectURL(
          image.previewUrl
        );
      }
    };
  }, []);

  useEffect(() => {
    let isActive = true;

    const loadInitialSauna =
      async () => {
        const searchParams =
          new URLSearchParams(
            window.location.search
          );

        const saunaId =
          searchParams
            .get("saunaId")
            ?.trim() ??
          searchParams
            .get("sauna_id")
            ?.trim();

        const source =
          searchParams
            .get("source")
            ?.trim()
            .toLowerCase();

        if (isActive) {
          setIsTodayPost(
            source === "today"
          );
        }

        if (!saunaId) {
          if (isActive) {
            setInitialSaunaLoading(
              false
            );
          }

          return;
        }

        try {
          const sauna =
            await getSaunaById(
              supabase,
              saunaId
            );

          if (!isActive) {
            return;
          }

          if (!sauna) {
            toast.error(
              "指定されたサウナ施設が見つかりませんでした。"
            );

            return;
          }

          setSelectedSauna(sauna);
        } catch (error) {
          if (!isActive) {
            return;
          }

          console.error(
            "投稿画面の施設情報取得に失敗しました。",
            error
          );

          toast.error(
            error instanceof Error
              ? error.message
              : "施設情報の取得に失敗しました。"
          );
        } finally {
          if (isActive) {
            setInitialSaunaLoading(
              false
            );
          }
        }
      };

    void loadInitialSauna();

    return () => {
      isActive = false;
    };
  }, [supabase]);

  const handleImagesChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const selectedFiles = Array.from(
      event.target.files ?? []
    );

    event.target.value = "";

    if (selectedFiles.length === 0) {
      return;
    }

    const remainingCount =
      MAX_POST_IMAGE_COUNT -
      images.length;

    if (remainingCount <= 0) {
      toast.error(
        `投稿画像は最大${MAX_POST_IMAGE_COUNT}枚までです。`
      );

      return;
    }

    const filesToProcess =
      selectedFiles.slice(
        0,
        remainingCount
      );

    if (
      selectedFiles.length >
      remainingCount
    ) {
      toast.error(
        `追加できる画像は残り${remainingCount}枚です。`
      );
    }

    setCompressing(true);

    const nextImages:
      SelectedPostImage[] = [];

    let failedCount = 0;

    try {
      for (const file of filesToProcess) {
        try {
          validatePostImage(file);

          const compressedFile =
            await compressPostImage(
              file
            );

          nextImages.push({
            id: crypto.randomUUID(),
            file: compressedFile,
            previewUrl:
              URL.createObjectURL(
                compressedFile
              ),
            originalSize: file.size,
            compressedSize:
              compressedFile.size,
          });
        } catch (error) {
          failedCount += 1;

          console.error(
            "投稿画像の処理に失敗しました。",
            error
          );
        }
      }

      if (nextImages.length > 0) {
        setImages((currentImages) => [
          ...currentImages,
          ...nextImages,
        ]);

        toast.success(
          `${nextImages.length}枚の画像を最適化しました。`
        );
      }

      if (failedCount > 0) {
        toast.error(
          `${failedCount}枚の画像を追加できませんでした。`
        );
      }
    } finally {
      setCompressing(false);
    }
  };

  const handleRemoveImage = (
    imageId: string
  ) => {
    setImages((currentImages) => {
      const imageToRemove =
        currentImages.find(
          (image) => image.id === imageId
        );

      if (imageToRemove) {
        URL.revokeObjectURL(
          imageToRemove.previewUrl
        );
      }

      return currentImages.filter(
        (image) => image.id !== imageId
      );
    });
  };

  const handleCreatePost = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedComment =
      comment.trim();

    if (initialSaunaLoading) {
      toast.error(
        "施設情報の読み込みが完了するまでお待ちください。"
      );

      return;
    }

    if (!selectedSauna) {
      toast.error(
        "検索候補からサウナ施設を選択してください。"
      );

      return;
    }

    if (!visitDate) {
      toast.error(
        "訪問日を選択してください。"
      );

      visitDateRef.current?.focus();
      return;
    }

    if (
      setCount < 1 ||
      setCount > 10
    ) {
      toast.error(
        "セット数は1〜10セットで入力してください。"
      );

      return;
    }

    const normalizedRating =
      Math.round(rating * 10) / 10;

    if (
      !Number.isFinite(normalizedRating) ||
      normalizedRating < MIN_RATING ||
      normalizedRating > MAX_RATING
    ) {
      toast.error(
        "評価は1.0〜5.0の範囲で入力してください。"
      );

      return;
    }

    if (
      trimmedComment.length >
      MAX_COMMENT_LENGTH
    ) {
      toast.error(
        `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`
      );

      return;
    }

    if (
      images.length >
      MAX_POST_IMAGE_COUNT
    ) {
      toast.error(
        `投稿画像は最大${MAX_POST_IMAGE_COUNT}枚までです。`
      );

      return;
    }

    if (compressing) {
      toast.error(
        "画像の最適化が完了するまでお待ちください。"
      );

      return;
    }

    setLoading(true);

    let createdPostId:
      | string
      | null = null;

    let uploadedFilePaths:
      string[] = [];

    let imageRecordsCreated = false;

    try {
      const {
        data: { user },
        error: userError,
      } =
        await supabase.auth.getUser();

      if (
        userError ||
        !user
      ) {
        toast.error(
          "投稿するにはログインが必要です。"
        );

        router.push("/login");

        return;
      }

      /*
       * 先に投稿を作成し、取得した投稿IDへ
       * 複数画像を紐付けます。
       */
      const createdPost =
        await createPost(
          supabase,
          {
            user_id: user.id,
            sauna_id:
              selectedSauna.id,
            sauna_name:
              selectedSauna.name,
            visit_date: visitDate,
            set_count: setCount,
            rating: normalizedRating,
            comment:
              trimmedComment,
          }
        );

      createdPostId = createdPost.id;

      if (images.length > 0) {
        const uploadedImages =
          await uploadPostImages(
            supabase,
            user.id,
            images.map(
              (image) => image.file
            )
          );

        uploadedFilePaths =
          uploadedImages.map(
            (image) => image.filePath
          );

        await createPostImages(
          supabase,
          uploadedImages.map(
            (image) => ({
              post_id: createdPost.id,
              image_url:
                image.publicUrl,
              sort_order:
                image.sortOrder,
            })
          )
        );

        imageRecordsCreated = true;

        /*
         * 既存画面との互換性を保つため、
         * 1枚目をposts.image_urlにも保存します。
         */
        await updatePost(
          supabase,
          createdPost.id,
          {
            image_url:
              uploadedImages[0]
                ?.publicUrl,
          }
        );
      }

      toast.success(
        "サ活を投稿しました！"
      );

      if (isTodayPost) {
        const completeSearchParams =
          new URLSearchParams({
            saunaId:
              selectedSauna.id,
            saunaName:
              selectedSauna.name,
            postId:
              createdPost.id,
          });

        router.push(
          `/today/complete?${completeSearchParams.toString()}`
        );

        router.refresh();

        return;
      }

      router.push(
        `/posts/${createdPost.id}`
      );
      router.refresh();
    } catch (error) {
      let postDeleted = false;

      if (createdPostId) {
        try {
          await deletePost(
            supabase,
            createdPostId
          );

          postDeleted = true;
        } catch (cleanupError) {
          console.error(
            "投稿作成失敗後の投稿削除に失敗しました。",
            cleanupError
          );
        }
      }

      /*
       * post_images作成後に投稿削除も失敗した場合は、
       * DB参照を壊さないようStorage画像を残します。
       */
      const canDeleteStorageImages =
        !imageRecordsCreated ||
        postDeleted;

      if (
        canDeleteStorageImages &&
        uploadedFilePaths.length > 0
      ) {
        try {
          await deletePostImages(
            supabase,
            uploadedFilePaths
          );
        } catch (cleanupError) {
          console.error(
            "投稿作成失敗後の画像削除に失敗しました。",
            cleanupError
          );
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "投稿に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (
    bytes: number
  ) => {
    return `${(
      bytes /
      1024 /
      1024
    ).toFixed(2)} MB`;
  };

  return (
    <div
      className="
        min-h-screen
        bg-muted/40
        px-4
        py-10
      "
    >
      <div
        className="
          mx-auto
          w-full
          max-w-xl
        "
      >
        <div className="mb-8">
          <h1
            className="
              text-3xl
              font-bold
              tracking-tight
            "
          >
            サ活を記録
          </h1>

          <p
            className="
              mt-2
              text-sm
              text-muted-foreground
            "
          >
            今日のサウナ体験をTOTONOに残しましょう。
          </p>
        </div>

        <form
          onSubmit={
            handleCreatePost
          }
          aria-label="サ活を記録"
          aria-busy={
            loading ||
            compressing ||
            initialSaunaLoading
          }
          aria-describedby={formStatusId}
          className="
            space-y-6
            rounded-2xl
            border
            bg-card
            p-6
            shadow-sm
          "
        >
          {initialSaunaLoading ? (
            <div className="space-y-2">
              <p
                className="
                  text-sm
                  font-medium
                "
              >
                サウナ施設
              </p>

              <div
                className="
                  flex
                  items-center
                  gap-2
                  rounded-2xl
                  border
                  border-border
                  bg-muted/40
                  px-4
                  py-3
                  text-sm
                  text-muted-foreground
                "
              >
                <LoaderCircle
                  className="
                    size-4
                    animate-spin
                    motion-reduce:animate-none
                  "
                  aria-hidden="true"
                />

                施設情報を読み込んでいます...
              </div>
            </div>
          ) : (
            <SaunaSearch
              key={
                selectedSauna?.id ??
                "empty-sauna"
              }
              selectedSauna={
                selectedSauna
              }
              onSelectSauna={
                setSelectedSauna
              }
              inputId="saunaName"
              required
            />
          )}

          <div className="space-y-2">
            <label
              htmlFor="visitDate"
              className="
                text-sm
                font-medium
              "
            >
              訪問日
            </label>

            <Input
              ref={visitDateRef}
              id="visitDate"
              name="visitDate"
              type="date"
              value={visitDate}
              onChange={(event) =>
                setVisitDate(
                  event.target.value
                )
              }
              required
              aria-required="true"
              disabled={loading}
              className="
                min-h-11
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            />
          </div>

          <div
            className="
              grid
              grid-cols-2
              gap-4
            "
          >
            <div className="space-y-2">
              <label
                htmlFor="setCount"
                className="
                  text-sm
                  font-medium
                "
              >
                セット数
              </label>

              <Input
                id="setCount"
                name="setCount"
                type="number"
                inputMode="numeric"
                min={1}
                max={10}
                value={setCount}
                onChange={(event) =>
                  setSetCount(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                required
                aria-required="true"
                disabled={loading}
                className="
                  min-h-11
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-background
                "
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="rating"
                className="
                  text-sm
                  font-medium
                "
              >
                評価
              </label>

              <Input
                id="rating"
                name="rating"
                type="number"
                min={MIN_RATING}
                max={MAX_RATING}
                step={RATING_STEP}
                inputMode="decimal"
                value={rating}
                onChange={(event) =>
                  setRating(
                    Number(
                      event.target
                        .value
                    )
                  )
                }
                required
                aria-required="true"
                aria-describedby={ratingHelpTextId}
                disabled={loading}
                className="
                  min-h-11
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-background
                "
              />

              <p
                id={ratingHelpTextId}
                className="
                  text-xs
                  text-muted-foreground
                "
              >
                1.0〜5.0の範囲で、0.1刻みで入力できます。
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="
                flex
                items-end
                justify-between
                gap-4
              "
            >
              <div>
                <label
                  htmlFor="images"
                  className="
                    text-sm
                    font-medium
                  "
                >
                  今日の写真
                </label>

                <p
                  id={imagesHelpTextId}
                  className="
                    mt-1
                    text-xs
                    leading-5
                    text-muted-foreground
                  "
                >
                  最大5枚まで追加できます。1枚目が一覧のサムネイルになります。
                </p>
              </div>

              <span
                id={imagesCountId}
                aria-live="polite"
                aria-atomic="true"
                className="
                  shrink-0
                  text-xs
                  font-medium
                  tabular-nums
                  text-muted-foreground
                "
              >
                <span aria-hidden="true">
                  {images.length} /{" "}
                  {MAX_POST_IMAGE_COUNT}
                </span>

                <span className="sr-only">
                  最大{MAX_POST_IMAGE_COUNT}枚中
                  {images.length}枚選択済み
                </span>
              </span>
            </div>

            <div
              className="
                rounded-xl
                border
                border-dashed
                p-4
              "
            >
              <div
                className="
                  mb-3
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-muted-foreground
                "
              >
                <ImagePlus
                  className="size-4"
                  aria-hidden="true"
                />

                JPEG・PNG・WebP / 1枚あたり元画像最大20MB
              </div>

              <Input
                id="images"
                name="images"
                type="file"
                accept="
                  image/jpeg,
                  image/png,
                  image/webp
                "
                multiple
                aria-describedby={`${imagesHelpTextId} ${imagesCountId}`}
                onChange={
                  handleImagesChange
                }
                disabled={
                  loading ||
                  compressing ||
                  images.length >=
                    MAX_POST_IMAGE_COUNT
                }
              />

              {compressing && (
                <div
                  className="
                    mt-3
                    flex
                    items-center
                    gap-2
                    text-sm
                    text-muted-foreground
                  "
                >
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                      motion-reduce:animate-none
                    "
                    aria-hidden="true"
                  />

                  画像を最適化しています...
                </div>
              )}

              {images.length > 0 && (
                <div
                  className="
                    mt-4
                    grid
                    grid-cols-2
                    gap-3
                  "
                >
                  {images.map(
                    (image, index) => (
                      <div
                        key={image.id}
                        className="
                          overflow-hidden
                          rounded-xl
                          border
                          border-border/60
                          bg-muted/30
                        "
                      >
                        <div
                          className="
                            relative
                            aspect-square
                            overflow-hidden
                            bg-muted
                          "
                        >
                          <Image
                            src={
                              image.previewUrl
                            }
                            alt={`投稿画像${index + 1}のプレビュー`}
                            fill
                            unoptimized
                            className="object-cover"
                          />

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveImage(
                                image.id
                              )
                            }
                            disabled={
                              loading ||
                              compressing
                            }
                            aria-label={`投稿画像${index + 1}を削除する`}
                            className="
                              absolute
                              right-2
                              top-2
                              inline-flex
                              size-11
                              items-center
                              justify-center
                              rounded-full
                              bg-black/65
                              text-white
                              shadow-sm
                              transition
                              duration-200
                              hover:bg-black/80
                              motion-reduce:transition-none
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-white
                              focus-visible:ring-offset-2
                              focus-visible:ring-offset-black
                              disabled:cursor-not-allowed
                              disabled:opacity-50
                            "
                          >
                            <X
                              className="size-4"
                              aria-hidden="true"
                            />
                          </button>

                          <span
                            className="
                              absolute
                              bottom-2
                              left-2
                              rounded-full
                              bg-black/65
                              px-2.5
                              py-1
                              text-[0.6875rem]
                              font-semibold
                              text-white
                            "
                          >
                            {index === 0
                              ? "カバー"
                              : `${index + 1}枚目`}
                          </span>
                        </div>

                        <div
                          className="
                            space-y-1
                            px-3
                            py-2.5
                            text-xs
                            text-muted-foreground
                          "
                        >
                          <p className="truncate">
                            {image.file.name}
                          </p>

                          <p>
                            {formatFileSize(
                              image.originalSize
                            )}

                            {" → "}

                            {formatFileSize(
                              image.compressedSize
                            )}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}

              {!compressing &&
                images.length <
                  MAX_POST_IMAGE_COUNT && (
                  <p
                    className="
                      mt-3
                      text-xs
                      text-muted-foreground
                    "
                  >
                    あと
                    {MAX_POST_IMAGE_COUNT -
                      images.length}
                    枚追加できます。
                  </p>
                )}
            </div>
          </div>

          <div className="space-y-2">
            <div
              className="
                flex
                items-center
                justify-between
              "
            >
              <label
                htmlFor="comment"
                className="
                  text-sm
                  font-medium
                "
              >
                コメント
              </label>

              <span
                id={commentCountId}
                aria-live="polite"
                aria-atomic="true"
                className="
                  text-xs
                  tabular-nums
                  text-muted-foreground
                "
              >
                <span aria-hidden="true">
                  {comment.length} /{" "}
                  {MAX_COMMENT_LENGTH}
                </span>

                <span className="sr-only">
                  最大{MAX_COMMENT_LENGTH}文字中
                  {comment.length}文字入力済み
                </span>
              </span>
            </div>

            <Textarea
              id="comment"
              name="comment"
              value={comment}
              onChange={(event) =>
                setComment(
                  event.target.value
                )
              }
              placeholder="サウナ、水風呂、外気浴など今日のサ活を記録..."
              maxLength={
                MAX_COMMENT_LENGTH
              }
              disabled={loading}
              aria-describedby={commentCountId}
              className="
                min-h-36
                resize-y
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
              "
            />
          </div>

          <Button
            type="submit"
            aria-busy={
              loading ||
              compressing ||
              initialSaunaLoading
            }
            aria-label={
              loading
                ? "サ活を投稿しています"
                : compressing
                  ? "投稿画像を最適化しています"
                  : initialSaunaLoading
                    ? "施設情報を読み込んでいます"
                    : "サ活を投稿する"
            }
            disabled={
              loading ||
              compressing ||
              initialSaunaLoading
            }
            className="
              min-h-11
              w-full
              rounded-xl
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              motion-reduce:transition-none
            "
            size="lg"
          >
            {loading ? (
              <>
                <LoaderCircle
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />

                投稿中...
              </>
            ) : compressing ? (
              <>
                <LoaderCircle
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />

                画像を最適化中...
              </>
            ) : initialSaunaLoading ? (
              <>
                <LoaderCircle
                  className="animate-spin motion-reduce:animate-none"
                  aria-hidden="true"
                />

                施設情報を読み込み中...
              </>
            ) : (
              <>
                <Send
                  aria-hidden="true"
                />

                投稿する
              </>
            )}
          </Button>

          <p
            id={formStatusId}
            aria-live="polite"
            aria-atomic="true"
            className="sr-only"
          >
            {loading
              ? "サ活を投稿しています。"
              : compressing
                ? "投稿画像を最適化しています。"
                : initialSaunaLoading
                  ? "施設情報を読み込んでいます。"
                  : ""}
          </p>
        </form>
      </div>
    </div>
  );
}
