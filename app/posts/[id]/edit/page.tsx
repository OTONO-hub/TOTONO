"use client";

import {
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
  useEffect,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  Camera,
  Flame,
  ImagePlus,
  LoaderCircle,
  MessageSquareText,
  Save,
  Sparkles,
  Star,
  X,
} from "lucide-react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import { toast } from "sonner";

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
  deletePostImageRecord,
  getPostImagesByPostId,
  updatePostImageSortOrder,
  type PostImage,
} from "@/services/post-images";
import {
  getPostById,
  updatePost,
} from "@/services/posts";
import {
  deletePostImages,
  getPostImagePath,
  uploadPostImages,
} from "@/services/storage";

const MAX_COMMENT_LENGTH = 1000;
const MAX_SAUNA_NAME_LENGTH = 100;
const MAX_POST_IMAGE_COUNT = 5;

type SelectedPostImage = {
  id: string;
  file: File;
  previewUrl: string;
  originalSize: number;
  compressedSize: number;
};

type ExistingPostImage = PostImage & {
  isLegacy?: boolean;
};

export default function EditPostPage() {
  const params =
    useParams<{ id: string }>();

  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const saunaNameInputRef =
    useRef<HTMLInputElement>(null);

  const visitDateInputRef =
    useRef<HTMLInputElement>(null);

  const setCountInputRef =
    useRef<HTMLInputElement>(null);

  const ratingInputRef =
    useRef<HTMLInputElement>(null);

  const saunaNameCountId = useId();
  const ratingHelpId = useId();
  const commentHelpId = useId();
  const commentCountId = useId();
  const imageHelpId = useId();
  const imageCountId = useId();
  const formStatusId = useId();

  const [saunaName, setSaunaName] =
    useState("");

  const [visitDate, setVisitDate] =
    useState("");

  const [setCount, setSetCount] =
    useState(3);

  const [rating, setRating] =
    useState(5);

  const [comment, setComment] =
    useState("");

  const [
    existingImages,
    setExistingImages,
  ] = useState<ExistingPostImage[]>([]);

  const [
    newImages,
    setNewImages,
  ] = useState<SelectedPostImage[]>([]);

  const newImagesRef =
    useRef<SelectedPostImage[]>([]);

  const [
    removedExistingImages,
    setRemovedExistingImages,
  ] = useState<ExistingPostImage[]>([]);

  const [
    initialLoading,
    setInitialLoading,
  ] = useState(true);

  const [loading, setLoading] =
    useState(false);

  const [
    compressing,
    setCompressing,
  ] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post =
          await getPostById(
            supabase,
            params.id
          );

        if (!post) {
          toast.error(
            "投稿が見つかりません。"
          );

          router.push("/");
          return;
        }

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
            "ログインしてください。"
          );

          router.push("/login");
          return;
        }

        if (
          user.id !== post.user_id
        ) {
          toast.error(
            "この投稿は編集できません。"
          );

          router.push(
            `/posts/${params.id}`
          );

          return;
        }

        setSaunaName(
          post.sauna_name
        );

        setVisitDate(
          post.visit_date
        );

        setSetCount(
          post.set_count
        );

        setRating(post.rating);

        setComment(
          post.comment ?? ""
        );

        const postImages =
          await getPostImagesByPostId(
            supabase,
            params.id
          );

        if (postImages.length > 0) {
          setExistingImages(
            postImages
          );
        } else if (post.image_url) {
          setExistingImages([
            {
              id: `legacy-${post.id}`,
              post_id: post.id,
              image_url:
                post.image_url,
              sort_order: 0,
              created_at:
                post.created_at,
              isLegacy: true,
            },
          ]);
        }
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "投稿の取得に失敗しました。"
        );

        router.push("/");
      } finally {
        setInitialLoading(false);
      }
    };

    void fetchPost();
  }, [
    params.id,
    router,
    supabase,
  ]);

  useEffect(() => {
    newImagesRef.current =
      newImages;
  }, [newImages]);

  useEffect(() => {
    return () => {
      for (const image of
        newImagesRef.current) {
        URL.revokeObjectURL(
          image.previewUrl
        );
      }
    };
  }, []);

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

    const currentImageCount =
      existingImages.length +
      newImages.length;

    const remainingCount =
      MAX_POST_IMAGE_COUNT -
      currentImageCount;

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

    const preparedImages:
      SelectedPostImage[] = [];

    let failedCount = 0;

    try {
      for (const file of
        filesToProcess) {
        try {
          validatePostImage(file);

          const compressedImage =
            await compressPostImage(
              file
            );

          preparedImages.push({
            id: crypto.randomUUID(),
            file: compressedImage,
            previewUrl:
              URL.createObjectURL(
                compressedImage
              ),
            originalSize: file.size,
            compressedSize:
              compressedImage.size,
          });
        } catch (error) {
          failedCount += 1;

          console.error(
            "投稿画像の処理に失敗しました。",
            error
          );
        }
      }

      if (preparedImages.length > 0) {
        setNewImages(
          (currentImages) => [
            ...currentImages,
            ...preparedImages,
          ]
        );

        toast.success(
          `${preparedImages.length}枚の画像を最適化しました。`
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

  const handleRemoveExistingImage = (
    imageId: string
  ) => {
    setExistingImages(
      (currentImages) => {
        const imageToRemove =
          currentImages.find(
            (image) =>
              image.id === imageId
          );

        if (imageToRemove) {
          setRemovedExistingImages(
            (removedImages) => [
              ...removedImages,
              imageToRemove,
            ]
          );
        }

        return currentImages.filter(
          (image) =>
            image.id !== imageId
        );
      }
    );
  };

  const handleRestoreExistingImage = (
    imageId: string
  ) => {
    setRemovedExistingImages(
      (removedImages) => {
        const imageToRestore =
          removedImages.find(
            (image) =>
              image.id === imageId
          );

        if (imageToRestore) {
          setExistingImages(
            (currentImages) =>
              [
                ...currentImages,
                imageToRestore,
              ].sort(
                (a, b) =>
                  a.sort_order -
                  b.sort_order
              )
          );
        }

        return removedImages.filter(
          (image) =>
            image.id !== imageId
        );
      }
    );
  };

  const handleRemoveNewImage = (
    imageId: string
  ) => {
    setNewImages((currentImages) => {
      const imageToRemove =
        currentImages.find(
          (image) =>
            image.id === imageId
        );

      if (imageToRemove) {
        URL.revokeObjectURL(
          imageToRemove.previewUrl
        );
      }

      return currentImages.filter(
        (image) =>
          image.id !== imageId
      );
    });
  };

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (
      loading ||
      compressing
    ) {
      return;
    }

    const trimmedSaunaName =
      saunaName.trim();

    const trimmedComment =
      comment.trim();

    const normalizedRating =
      Math.round(rating * 10) / 10;

    if (!trimmedSaunaName) {
      toast.error(
        "サウナ施設名を入力してください。"
      );

      return;
    }

    if (
      trimmedSaunaName.length >
      MAX_SAUNA_NAME_LENGTH
    ) {
      toast.error(
        `サウナ施設名は${MAX_SAUNA_NAME_LENGTH}文字以内で入力してください。`
      );

      saunaNameInputRef.current?.focus();
      return;
    }

    if (!visitDate) {
      toast.error(
        "訪問日を入力してください。"
      );

      visitDateInputRef.current?.focus();
      return;
    }

    if (
      setCount < 1 ||
      setCount > 10
    ) {
      toast.error(
        "セット数は1〜10の範囲で入力してください。"
      );

      setCountInputRef.current?.focus();
      return;
    }

    if (
      !Number.isFinite(
        normalizedRating
      ) ||
      normalizedRating < 1 ||
      normalizedRating > 5
    ) {
      toast.error(
        "評価は1.0〜5.0の範囲で入力してください。"
      );

      ratingInputRef.current?.focus();
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

    setLoading(true);

    let uploadedFilePaths:
      string[] = [];

    const createdImageRecordIds:
  string[] = [];

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
        throw new Error(
          "ログインしてください。"
        );
      }

      const currentPost =
        await getPostById(
          supabase,
          params.id
        );

      if (!currentPost) {
        throw new Error(
          "投稿が見つかりません。"
        );
      }

      if (
        currentPost.user_id !==
        user.id
      ) {
        throw new Error(
          "この投稿は編集できません。"
        );
      }

      const uploadedImages =
        newImages.length > 0
          ? await uploadPostImages(
              supabase,
              user.id,
              newImages.map(
                (image) =>
                  image.file
              )
            )
          : [];

      uploadedFilePaths =
        uploadedImages.map(
          (image) =>
            image.filePath
        );

      for (const removedImage of
        removedExistingImages) {
        if (!removedImage.isLegacy) {
          await deletePostImageRecord(
            supabase,
            removedImage.id
          );
        }
      }

      const keptExistingImages =
        [...existingImages].sort(
          (a, b) =>
            a.sort_order -
            b.sort_order
        );

      for (
        let index = 0;
        index <
        keptExistingImages.length;
        index += 1
      ) {
        const image =
          keptExistingImages[index];

        if (
          image &&
          !image.isLegacy &&
          image.sort_order !== index
        ) {
          await updatePostImageSortOrder(
            supabase,
            image.id,
            index
          );
        }
      }

      const legacyImages =
        keptExistingImages.filter(
          (image) =>
            image.isLegacy
        );

      if (legacyImages.length > 0) {
        const createdLegacyImages =
          await createPostImages(
            supabase,
            legacyImages.map(
              (image, index) => ({
                post_id: params.id,
                image_url:
                  image.image_url,
                sort_order: index,
              })
            )
          );

        createdImageRecordIds.push(
          ...createdLegacyImages.map(
            (image) => image.id
          )
        );
      }

      if (uploadedImages.length > 0) {
        const startSortOrder =
          keptExistingImages.length;

        const createdImages =
          await createPostImages(
            supabase,
            uploadedImages.map(
              (image, index) => ({
                post_id: params.id,
                image_url:
                  image.publicUrl,
                sort_order:
                  startSortOrder +
                  index,
              })
            )
          );

        createdImageRecordIds.push(
          ...createdImages.map(
            (image) => image.id
          )
        );
      }

      const finalImageUrls = [
        ...keptExistingImages.map(
          (image) =>
            image.image_url
        ),
        ...uploadedImages.map(
          (image) =>
            image.publicUrl
        ),
      ];

      await updatePost(
        supabase,
        params.id,
        {
          sauna_name:
            trimmedSaunaName,
          visit_date:
            visitDate,
          set_count:
            setCount,
          rating:
            normalizedRating,
          comment:
            trimmedComment ||
            undefined,
          image_url:
            finalImageUrls[0] ??
            null,
        }
      );

      const removedStoragePaths =
        removedExistingImages
          .map((image) =>
            getPostImagePath(
              image.image_url
            )
          )
          .filter(
            (
              path
            ): path is string =>
              Boolean(path)
          );

      if (
        removedStoragePaths.length > 0
      ) {
        try {
          await deletePostImages(
            supabase,
            removedStoragePaths
          );
        } catch (cleanupError) {
          console.error(
            "削除済み投稿画像のStorage整理に失敗しました。",
            cleanupError
          );
        }
      }

      toast.success(
        "サ活を更新しました。"
      );

      router.push(
        `/posts/${params.id}`
      );

      router.refresh();
    } catch (error) {
      for (const imageId of
        createdImageRecordIds) {
        try {
          await deletePostImageRecord(
            supabase,
            imageId
          );
        } catch (cleanupError) {
          console.error(
            "更新失敗後の画像レコード削除に失敗しました。",
            cleanupError
          );
        }
      }

      if (uploadedFilePaths.length > 0) {
        try {
          await deletePostImages(
            supabase,
            uploadedFilePaths
          );
        } catch (cleanupError) {
          console.error(
            "更新失敗後の画像削除に失敗しました。",
            cleanupError
          );
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "投稿の更新に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  if (initialLoading) {
    return (
      <div
        role="status"
        aria-live="polite"
        aria-busy="true"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-muted/25
          px-4
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-4
            text-center
          "
        >
          <div
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-full
              border
              border-border/55
              bg-card
              shadow-sm
            "
          >
            <LoaderCircle
              className="
                size-5
                animate-spin
                motion-reduce:animate-none
                text-foreground
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </div>

          <p
            className="
              text-sm
              font-medium
              text-muted-foreground
            "
          >
            サ活を読み込んでいます
          </p>
        </div>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-muted/25
        px-4
        pb-24
        pt-24
        sm:px-6
        sm:pt-28
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          top-10
          size-120
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-40
          top-[44rem]
          size-112
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-6xl
        "
      >
        <Link
          href={`/posts/${params.id}`}
          className="
            inline-flex
            items-center
            gap-2
            text-sm
            font-medium
            text-muted-foreground
            transition-colors
            hover:text-foreground
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
        >
          <ArrowLeft
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          投稿詳細へ戻る
        </Link>

        <div
          className="
            mt-7
            grid
            gap-7
            lg:grid-cols-[minmax(0,1fr)_22rem]
            lg:items-start
          "
        >
          <section
            aria-labelledby="edit-post-heading"
            className="
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            <div
              className="
                relative
                overflow-hidden
                border-b
                border-border/45
                bg-linear-to-br
                from-secondary/25
                via-background
                to-accent/10
                px-6
                py-8
                sm:px-8
                sm:py-10
              "
            >
              <div
                aria-hidden="true"
                className="
                  absolute
                  -right-24
                  -top-28
                  size-72
                  rounded-full
                  bg-secondary/30
                  blur-3xl
                "
              />

              <div className="relative">
                <div
                  className="
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-border/55
                    bg-card/70
                    px-3.5
                    py-2
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.22em]
                    text-muted-foreground
                    shadow-sm
                  "
                >
                  <Sparkles
                    className="
                      size-3.5
                      text-foreground
                    "
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  Edit Journal
                </div>

                <h1
                  id="edit-post-heading"
                  className="
                    mt-5
                    text-3xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                    sm:text-4xl
                  "
                >
                  サ活を編集する
                </h1>

                <p
                  className="
                    mt-3
                    max-w-2xl
                    text-sm
                    leading-7
                    text-muted-foreground
                    sm:text-base
                  "
                >
                  訪問した施設やその日の整いを、
                  より正確な記録へ整えましょう。
                </p>
              </div>
            </div>

            <form
              onSubmit={
                handleSubmit
              }
              aria-label="サ活の編集フォーム"
              aria-busy={
                loading || compressing
              }
              aria-describedby={formStatusId}
              className="
                space-y-8
                px-5
                py-7
                sm:px-8
                sm:py-9
              "
            >
              <FormSection
                icon={Flame}
                title="施設"
                description="訪れたサウナ施設を入力します。"
              >
                <label
                  htmlFor="sauna-name"
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  サウナ施設名
                </label>

                <Input
                  ref={saunaNameInputRef}
                  id="sauna-name"
                  value={saunaName}
                  onChange={(
                    event
                  ) =>
                    setSaunaName(
                      event.target
                        .value
                    )
                  }
                  maxLength={
                    MAX_SAUNA_NAME_LENGTH
                  }
                  required
                  aria-required="true"
                  aria-describedby={saunaNameCountId}
                  placeholder="例：黄金湯"
                  disabled={
                    loading
                  }
                  className="
                    mt-3
                    min-h-12
                    rounded-xl
                    bg-background/80
                  "
                />

                <p
                  id={saunaNameCountId}
                  aria-live="polite"
                  aria-atomic="true"
                  className="
                    mt-2
                    text-right
                    text-xs
                    text-muted-foreground
                  "
                >
                  {
                    saunaName.length
                  }
                  /
                  {
                    MAX_SAUNA_NAME_LENGTH
                  }
                </p>
              </FormSection>

              <FormSection
                icon={
                  CalendarDays
                }
                title="訪問日"
                description="実際に施設を訪れた日を記録します。"
              >
                <label
                  htmlFor="visit-date"
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  訪問日
                </label>

                <Input
                  ref={visitDateInputRef}
                  id="visit-date"
                  type="date"
                  value={visitDate}
                  required
                  aria-required="true"
                  onChange={(
                    event
                  ) =>
                    setVisitDate(
                      event.target
                        .value
                    )
                  }
                  disabled={
                    loading
                  }
                  className="
                    mt-3
                    min-h-12
                    rounded-xl
                    bg-background/80
                  "
                />
              </FormSection>

              <div
                className="
                  grid
                  gap-6
                  sm:grid-cols-2
                "
              >
                <FormSection
                  icon={Flame}
                  title="セット数"
                  description="その日に入ったセット数です。"
                >
                  <label
                    htmlFor="set-count"
                    className="
                      text-sm
                      font-semibold
                      text-foreground
                    "
                  >
                    セット数
                  </label>

                  <Input
                    ref={setCountInputRef}
                    id="set-count"
                    type="number"
                    min={1}
                    max={10}
                    value={setCount}
                    required
                    aria-required="true"
                    onChange={(
                      event
                    ) =>
                      setSetCount(
                        Number(
                          event
                            .target
                            .value
                        )
                      )
                    }
                    disabled={
                      loading
                    }
                    className="
                      mt-3
                      min-h-12
                      rounded-xl
                      bg-background/80
                    "
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-medium
                      text-muted-foreground
                    "
                  >
                    🔥 {setCount}
                    セット
                  </p>
                </FormSection>

                <FormSection
                  icon={Star}
                  title="評価"
                  description="今回の体験を0.1刻みで評価します。"
                >
                  <label
                    htmlFor="rating"
                    className="
                      text-sm
                      font-semibold
                      text-foreground
                    "
                  >
                    評価
                  </label>

                  <p
                    id={ratingHelpId}
                    className="sr-only"
                  >
                    評価は1.0から5.0まで、0.1刻みで入力してください。
                  </p>

                  <Input
                    ref={ratingInputRef}
                    id="rating"
                    type="number"
                    min={1}
                    max={5}
                    step={0.1}
                    inputMode="decimal"
                    value={rating}
                    required
                    aria-required="true"
                    aria-describedby={ratingHelpId}
                    onChange={(
                      event
                    ) =>
                      setRating(
                        event.target.value ===
                          ""
                          ? Number.NaN
                          : Number(
                              event.target
                                .value
                            )
                      )
                    }
                    onBlur={() => {
                      if (
                        Number.isFinite(
                          rating
                        )
                      ) {
                        setRating(
                          Math.round(
                            rating * 10
                          ) / 10
                        );
                      }
                    }}
                    disabled={
                      loading
                    }
                    className="
                      mt-3
                      min-h-12
                      rounded-xl
                      bg-background/80
                    "
                  />

                  <div
                    className="
                      mt-3
                      flex
                      items-center
                      justify-between
                      gap-4
                    "
                  >
                    <div
                      className="
                        flex
                        gap-1
                      "
                      aria-hidden="true"
                    >
                      {[
                        1, 2, 3, 4, 5,
                      ].map(
                        (value) => (
                          <Star
                            key={
                              value
                            }
                            className={
                              value <=
                              Math.floor(
                                Number.isFinite(
                                  rating
                                )
                                  ? rating
                                  : 0
                              )
                                ? "size-4 fill-accent text-accent"
                                : "size-4 text-border"
                            }
                            strokeWidth={
                              1.7
                            }
                          />
                        )
                      )}
                    </div>

                    <p
                      className="
                        text-sm
                        font-semibold
                        tabular-nums
                        text-foreground
                      "
                    >
                      {Number.isFinite(
                        rating
                      )
                        ? rating.toFixed(1)
                        : "—"}
                      <span
                        className="
                          ml-1
                          text-xs
                          font-medium
                          text-muted-foreground
                        "
                      >
                        / 5.0
                      </span>
                    </p>
                  </div>
                </FormSection>
              </div>

              <FormSection
                icon={
                  MessageSquareText
                }
                title="サ活メモ"
                description="温度、導線、外気浴、印象に残ったことなどを自由に残せます。"
              >
                <label
                  htmlFor="comment"
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  コメント
                </label>

                <Textarea
                  id="comment"
                  value={comment}
                  onChange={(
                    event
                  ) =>
                    setComment(
                      event.target
                        .value
                    )
                  }
                  maxLength={
                    MAX_COMMENT_LENGTH
                  }
                  aria-describedby={`${commentHelpId} ${commentCountId}`}
                  placeholder="その日の整いや、印象に残ったポイントを記録してください。"
                  disabled={
                    loading
                  }
                  className="
                    mt-3
                    min-h-40
                    resize-y
                    rounded-xl
                    bg-background/80
                    leading-7
                  "
                />

                <div
                  className="
                    mt-2
                    flex
                    items-center
                    justify-between
                    gap-4
                    text-xs
                    text-muted-foreground
                  "
                >
                  <span id={commentHelpId}>
                    コメントは任意です
                  </span>

                  <span
                    id={commentCountId}
                    aria-live="polite"
                    aria-atomic="true"
                    className="tabular-nums"
                  >
                    {
                      comment.length
                    }
                    /
                    {
                      MAX_COMMENT_LENGTH
                    }
                  </span>
                </div>
              </FormSection>

              <FormSection
                icon={Camera}
                title="投稿画像"
                description="現在の画像を残したまま、最大5枚まで追加・削除できます。"
              >
                <div
                  className="
                    flex
                    items-end
                    justify-between
                    gap-4
                  "
                >
                  <div>
                    <p
                      className="
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      今日の写真
                    </p>

                    <p
                      id={imageHelpId}
                      className="
                        mt-1
                        text-xs
                        leading-6
                        text-muted-foreground
                      "
                    >
                      1枚目が一覧のサムネイルになります。
                    </p>
                  </div>

                  <span
                    id={imageCountId}
                    aria-live="polite"
                    aria-atomic="true"
                    className="
                      shrink-0
                      text-xs
                      font-medium
                      text-muted-foreground
                    "
                  >
                    {
                      existingImages.length +
                      newImages.length
                    }
                    {" / "}
                    {MAX_POST_IMAGE_COUNT}
                  </span>
                </div>

                {(
                  existingImages.length > 0 ||
                  newImages.length > 0
                ) && (
                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-3
                    "
                  >
                    {existingImages.map(
                      (image, index) => (
                        <ImagePreviewCard
                          key={image.id}
                          imageUrl={
                            image.image_url
                          }
                          label={
                            index === 0
                              ? "カバー"
                              : `${index + 1}枚目`
                          }
                          onRemove={() =>
                            handleRemoveExistingImage(
                              image.id
                            )
                          }
                          disabled={
                            loading ||
                            compressing
                          }
                        />
                      )
                    )}

                    {newImages.map(
                      (image, index) => {
                        const displayIndex =
                          existingImages.length +
                          index;

                        return (
                          <ImagePreviewCard
                            key={image.id}
                            imageUrl={
                              image.previewUrl
                            }
                            label={
                              displayIndex === 0
                                ? "カバー"
                                : `${displayIndex + 1}枚目`
                            }
                            onRemove={() =>
                              handleRemoveNewImage(
                                image.id
                              )
                            }
                            disabled={
                              loading ||
                              compressing
                            }
                            unoptimized
                            footer={
                              <>
                                {formatFileSize(
                                  image.originalSize
                                )}
                                {" → "}
                                {formatFileSize(
                                  image.compressedSize
                                )}
                              </>
                            }
                          />
                        );
                      }
                    )}
                  </div>
                )}

                {
                  existingImages.length +
                    newImages.length <
                  MAX_POST_IMAGE_COUNT
                ? (
                  <label
                    htmlFor="post-images"
                    aria-disabled={
                      loading || compressing
                        ? "true"
                        : undefined
                    }
                    className="
                      mt-4
                      flex
                      min-h-28
                      cursor-pointer
                      items-center
                      justify-center
                      gap-3
                      rounded-[1.25rem]
                      border
                      border-dashed
                      border-border/70
                      bg-muted/20
                      px-5
                      py-6
                      text-center
                      transition-colors
                      hover:bg-muted/35
                      focus-within:outline-none
                      focus-within:ring-2
                      focus-within:ring-ring
                      focus-within:ring-offset-2
                      focus-within:ring-offset-background
                      motion-reduce:transition-none
                    "
                  >
                    {compressing ? (
                      <LoaderCircle
                        className="
                          size-5
                          animate-spin
                motion-reduce:animate-none
                        "
                        aria-hidden="true"
                      />
                    ) : (
                      <ImagePlus
                        className="size-5"
                        aria-hidden="true"
                      />
                    )}

                    <span
                      className="
                        text-sm
                        font-semibold
                        text-foreground
                      "
                    >
                      {compressing
                        ? "画像を最適化しています"
                        : "写真を追加する"}
                    </span>
                  </label>
                ) : null}

                <input
                  id="post-images"
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  multiple
                  aria-describedby={`${imageHelpId} ${imageCountId}`}
                  onChange={
                    handleImagesChange
                  }
                  disabled={
                    loading ||
                    compressing ||
                    existingImages.length +
                      newImages.length >=
                      MAX_POST_IMAGE_COUNT
                  }
                  className="sr-only"
                />

                {removedExistingImages.length > 0 && (
                  <div
                    className="
                      mt-5
                      rounded-xl
                      border
                      border-border/60
                      bg-muted/20
                      p-4
                    "
                  >
                    <p
                      className="
                        text-xs
                        font-semibold
                        text-foreground
                      "
                    >
                      保存時に削除される写真
                    </p>

                    <div
                      className="
                        mt-3
                        flex
                        flex-wrap
                        gap-2
                      "
                    >
                      {removedExistingImages.map(
                        (image) => (
                          <button
                            key={image.id}
                            type="button"
                            onClick={() =>
                              handleRestoreExistingImage(
                                image.id
                              )
                            }
                            disabled={loading}
                            className="
                              inline-flex
                              min-h-11
                              items-center
                              rounded-full
                              border
                              border-border/70
                              bg-background
                              px-3
                              text-xs
                              font-semibold
                              text-foreground
                              transition
                              hover:bg-muted
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-ring
                              focus-visible:ring-offset-2
                              focus-visible:ring-offset-background
                              motion-reduce:transition-none
                            "
                          >
                            元に戻す
                          </button>
                        )
                      )}
                    </div>
                  </div>
                )}
              </FormSection>

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-border/55
                  pt-7
                  sm:flex-row
                  sm:justify-end
                "
              >
                <Button
                  type="button"
                  variant="totonoOutline"
                  size="lg"
                  onClick={() =>
                    router.push(
                      `/posts/${params.id}`
                    )
                  }
                  disabled={
                    loading
                  }
                  className="
                    min-h-11
                    w-full
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                    sm:w-auto
                  "
                >
                  キャンセル
                </Button>

                <Button
                  type="submit"
                  variant="totono"
                  size="lg"
                  disabled={
                    loading ||
                    compressing
                  }
                  aria-busy={loading}
                  aria-label={
                    loading
                      ? "変更を保存しています"
                      : compressing
                        ? "画像を最適化しています"
                        : "変更を保存する"
                  }
                  className="
                    min-h-11
                    w-full
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                    sm:w-auto
                  "
                >
                  {loading ? (
                    <LoaderCircle
                      className="
                        size-4
                        animate-spin
                motion-reduce:animate-none
                      "
                      strokeWidth={
                        1.8
                      }
                      aria-hidden="true"
                    />
                  ) : (
                    <Save
                      className="size-4"
                      strokeWidth={
                        1.8
                      }
                      aria-hidden="true"
                    />
                  )}

                  {loading
                    ? "保存しています"
                    : "変更を保存する"}
                </Button>
              </div>

              <p
                id={formStatusId}
                aria-live="polite"
                aria-atomic="true"
                className="sr-only"
              >
                {loading
                  ? "変更を保存しています。"
                  : compressing
                    ? "画像を最適化しています。"
                    : ""}
              </p>
            </form>
          </section>

          <aside
            className="
              space-y-5
              lg:sticky
              lg:top-28
            "
          >
            <div
              className="
                rounded-[2rem]
                border
                border-border/55
                bg-card/85
                p-6
                shadow-sm
                backdrop-blur-md
              "
            >
              <div
                className="
                  flex
                  size-11
                  items-center
                  justify-center
                  rounded-full
                  bg-accent/20
                  text-foreground
                "
              >
                <Sparkles
                  className="size-4.5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h2
                className="
                  mt-5
                  text-xl
                  font-semibold
                  tracking-[-0.03em]
                  text-foreground
                "
              >
                記録を整えるポイント
              </h2>

              <div
                className="
                  mt-5
                  space-y-4
                "
              >
                <EditTip
                  number="01"
                  title="事実を残す"
                  description="訪問日やセット数は、後から振り返る分析にも使われます。"
                />

                <EditTip
                  number="02"
                  title="体験を残す"
                  description="温度、混雑、外気浴、サ飯など、次回に役立つ情報を残しましょう。"
                />

                <EditTip
                  number="03"
                  title="写真を選ぶ"
                  description="施設の空気感が伝わる写真は、他のユーザーの発見にもつながります。"
                />
              </div>
            </div>

            <div
              className="
                rounded-[1.5rem]
                border
                border-border/55
                bg-background/75
                p-5
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              編集内容は保存後すぐに
              投稿詳細とプロフィールへ反映されます。
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

type ImagePreviewCardProps = {
  imageUrl: string;
  label: string;
  onRemove: () => void;
  disabled: boolean;
  unoptimized?: boolean;
  footer?: ReactNode;
};

function ImagePreviewCard({
  imageUrl,
  label,
  onRemove,
  disabled,
  unoptimized = false,
  footer,
}: ImagePreviewCardProps) {
  return (
    <div
      className="
        overflow-hidden
        rounded-[1.25rem]
        border
        border-border/60
        bg-muted/25
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
          src={imageUrl}
          alt={`${label}の投稿画像`}
          fill
          unoptimized={unoptimized}
          className="object-cover"
        />

        <button
          type="button"
          onClick={onRemove}
          disabled={disabled}
          aria-label={`${label}を削除する`}
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
            hover:bg-black/80
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-white
            focus-visible:ring-offset-2
            focus-visible:ring-offset-black
            disabled:cursor-not-allowed
            motion-reduce:transition-none
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
          {label}
        </span>
      </div>

      {footer ? (
        <div
          className="
            px-3
            py-2.5
            text-xs
            text-muted-foreground
          "
        >
          {footer}
        </div>
      ) : null}
    </div>
  );
}

type FormSectionProps = {
  icon: typeof Flame;
  title: string;
  description: string;
  children: ReactNode;
};

function FormSection({
  icon: Icon,
  title,
  description,
  children,
}: FormSectionProps) {
  return (
    <section
      className="
        rounded-[1.5rem]
        border
        border-border/55
        bg-background/55
        p-5
        sm:p-6
      "
    >
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        <span
          className="
            flex
            size-10
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-secondary/20
            text-foreground
          "
        >
          <Icon
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <div>
          <h2
            className="
              text-base
              font-semibold
              text-foreground
            "
          >
            {title}
          </h2>

          <p
            className="
              mt-1
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            {description}
          </p>
        </div>
      </div>

      <div className="mt-5">
        {children}
      </div>
    </section>
  );
}

type EditTipProps = {
  number: string;
  title: string;
  description: string;
};

function EditTip({
  number,
  title,
  description,
}: EditTipProps) {
  return (
    <div
      className="
        flex
        gap-4
        border-t
        border-border/45
        pt-4
        first:border-t-0
        first:pt-0
      "
    >
      <span
        className="
          text-xs
          font-semibold
          tracking-[0.18em]
          text-muted-foreground
        "
      >
        {number}
      </span>

      <div>
        <p
          className="
            text-sm
            font-semibold
            text-foreground
          "
        >
          {title}
        </p>

        <p
          className="
            mt-1
            text-xs
            leading-6
            text-muted-foreground
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

function formatFileSize(
  bytes: number
): string {
  if (bytes < 1024) {
    return `${bytes}B`;
  }

  const kilobytes =
    bytes / 1024;

  if (kilobytes < 1024) {
    return `${kilobytes.toFixed(
      1
    )}KB`;
  }

  return `${(
    kilobytes / 1024
  ).toFixed(1)}MB`;
}
