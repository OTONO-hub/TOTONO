"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useParams, useRouter } from "next/navigation";
import { ImagePlus, LoaderCircle, Save } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  compressPostImage,
  validatePostImage,
} from "@/services/image";
import { getPostById, updatePost } from "@/services/posts";
import {
  deletePostImage,
  getPostImagePath,
  uploadPostImage,
} from "@/services/storage";

const MAX_COMMENT_LENGTH = 1000;
const MAX_SAUNA_NAME_LENGTH = 100;

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();

  const supabase = useMemo(() => createClient(), []);

  const [saunaName, setSaunaName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [setCount, setSetCount] = useState(3);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  const [image, setImage] = useState<File | null>(null);

  const [currentImageUrl, setCurrentImageUrl] = useState<
    string | null
  >(null);

  const [originalImageSize, setOriginalImageSize] = useState<
    number | null
  >(null);

  const [compressedImageSize, setCompressedImageSize] = useState<
    number | null
  >(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [compressing, setCompressing] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const post = await getPostById(supabase, params.id);

        if (!post) {
          toast.error("投稿が見つかりません。");
          router.push("/");
          return;
        }

        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser();

        if (userError || !user) {
          toast.error("ログインしてください。");
          router.push("/login");
          return;
        }

        if (user.id !== post.user_id) {
          toast.error("この投稿は編集できません。");
          router.push("/");
          return;
        }

        setSaunaName(post.sauna_name);
        setVisitDate(post.visit_date);
        setSetCount(post.set_count);
        setRating(post.rating);
        setComment(post.comment ?? "");
        setCurrentImageUrl(post.image_url);
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

    fetchPost();
  }, [params.id, router, supabase]);

  const handleImageChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      setImage(null);
      setOriginalImageSize(null);
      setCompressedImageSize(null);
      return;
    }

    setCompressing(true);
    setImage(null);
    setOriginalImageSize(file.size);
    setCompressedImageSize(null);

    try {
      validatePostImage(file);

      const compressedFile = await compressPostImage(file);

      setImage(compressedFile);
      setCompressedImageSize(compressedFile.size);

      toast.success("新しい画像を最適化しました。");
    } catch (error) {
      event.target.value = "";

      setImage(null);
      setOriginalImageSize(null);
      setCompressedImageSize(null);

      toast.error(
        error instanceof Error
          ? error.message
          : "画像の処理に失敗しました。"
      );
    } finally {
      setCompressing(false);
    }
  };

  const handleUpdatePost = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedSaunaName = saunaName.trim();
    const trimmedComment = comment.trim();

    if (!trimmedSaunaName) {
      toast.error("サウナ施設名を入力してください。");
      return;
    }

    if (trimmedSaunaName.length > MAX_SAUNA_NAME_LENGTH) {
      toast.error(
        `サウナ施設名は${MAX_SAUNA_NAME_LENGTH}文字以内で入力してください。`
      );
      return;
    }

    if (!visitDate) {
      toast.error("訪問日を選択してください。");
      return;
    }

    if (setCount < 1 || setCount > 10) {
      toast.error("セット数は1〜10セットで入力してください。");
      return;
    }

    if (rating < 1 || rating > 5) {
      toast.error("評価は1〜5で入力してください。");
      return;
    }

    if (trimmedComment.length > MAX_COMMENT_LENGTH) {
      toast.error(
        `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`
      );
      return;
    }

    if (compressing) {
      toast.error("画像の最適化が完了するまでお待ちください。");
      return;
    }

    setLoading(true);

    let newUploadedFilePath: string | null = null;

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("ログインしてください。");
        router.push("/login");
        return;
      }

      let imageUrl = currentImageUrl ?? undefined;

      if (image) {
        const uploadedImage = await uploadPostImage(
          supabase,
          user.id,
          image
        );

        imageUrl = uploadedImage.publicUrl;
        newUploadedFilePath = uploadedImage.filePath;
      }

      await updatePost(supabase, params.id, {
        user_id: user.id,
        sauna_name: trimmedSaunaName,
        visit_date: visitDate,
        set_count: setCount,
        rating,
        comment: trimmedComment,
        image_url: imageUrl,
      });

      /*
       * DB更新に成功した後で、
       * 古い投稿画像をStorageから削除します。
       */
      if (image && currentImageUrl) {
        const oldImagePath = getPostImagePath(currentImageUrl);

        if (oldImagePath) {
          try {
            await deletePostImage(supabase, oldImagePath);
          } catch (cleanupError) {
            console.error(
              "古い投稿画像の削除に失敗しました。",
              cleanupError
            );
          }
        }
      }

      toast.success("投稿を更新しました！");

      router.push("/");
      router.refresh();
    } catch (error) {
      /*
       * 新画像アップロード後にDB更新が失敗した場合、
       * 新しくアップロードした画像を削除します。
       */
      if (newUploadedFilePath) {
        try {
          await deletePostImage(
            supabase,
            newUploadedFilePath
          );
        } catch (cleanupError) {
          console.error(
            "新しい投稿画像の削除に失敗しました。",
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

  const formatFileSize = (bytes: number) => {
    return `${(bytes / 1024 / 1024).toFixed(2)} MB`;
  };

  if (initialLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          投稿を読み込んでいます...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            サ活を編集
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            投稿したサウナ体験を編集できます。
          </p>
        </div>

        <form
          onSubmit={handleUpdatePost}
          className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <div className="space-y-2">
            <label
              htmlFor="saunaName"
              className="text-sm font-medium"
            >
              サウナ施設名
            </label>

            <Input
              id="saunaName"
              type="text"
              value={saunaName}
              onChange={(event) =>
                setSaunaName(event.target.value)
              }
              maxLength={MAX_SAUNA_NAME_LENGTH}
              disabled={loading}
            />
          </div>

          <div className="space-y-2">
            <label
              htmlFor="visitDate"
              className="text-sm font-medium"
            >
              訪問日
            </label>

            <Input
              id="visitDate"
              type="date"
              value={visitDate}
              onChange={(event) =>
                setVisitDate(event.target.value)
              }
              disabled={loading}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label
                htmlFor="setCount"
                className="text-sm font-medium"
              >
                セット数
              </label>

              <Input
                id="setCount"
                type="number"
                min={1}
                max={10}
                value={setCount}
                onChange={(event) =>
                  setSetCount(Number(event.target.value))
                }
                disabled={loading}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="rating"
                className="text-sm font-medium"
              >
                評価
              </label>

              <Input
                id="rating"
                type="number"
                min={1}
                max={5}
                value={rating}
                onChange={(event) =>
                  setRating(Number(event.target.value))
                }
                disabled={loading}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="image"
              className="text-sm font-medium"
            >
              サウナ写真
            </label>

            <div className="rounded-xl border border-dashed p-4">
              <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
                <ImagePlus className="size-4" />
                JPEG・PNG・WebP / 元画像最大20MB
              </div>

              {currentImageUrl && !image && (
                <p className="mb-3 text-sm text-muted-foreground">
                  現在の画像が設定されています。新しい画像を選ぶと変更されます。
                </p>
              )}

              <Input
                id="image"
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={loading || compressing}
              />

              {compressing && (
                <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                  <LoaderCircle className="size-4 animate-spin" />
                  画像を最適化しています...
                </div>
              )}

              {!compressing && image && (
                <div className="mt-3 space-y-1 text-sm text-muted-foreground">
                  <p className="truncate">
                    新しい画像：{image.name}
                  </p>

                  {originalImageSize !== null &&
                    compressedImageSize !== null && (
                      <p>
                        {formatFileSize(originalImageSize)}
                        {" → "}
                        {formatFileSize(compressedImageSize)}
                      </p>
                    )}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="comment"
                className="text-sm font-medium"
              >
                コメント
              </label>

              <span className="text-xs text-muted-foreground">
                {comment.length} / {MAX_COMMENT_LENGTH}
              </span>
            </div>

            <Textarea
              id="comment"
              value={comment}
              onChange={(event) =>
                setComment(event.target.value)
              }
              maxLength={MAX_COMMENT_LENGTH}
              disabled={loading}
              className="min-h-36 resize-none"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || compressing}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" />
                更新中...
              </>
            ) : compressing ? (
              <>
                <LoaderCircle className="animate-spin" />
                画像を最適化中...
              </>
            ) : (
              <>
                <Save />
                変更を保存
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}