"use client";

import {
  ChangeEvent,
  FormEvent,
  useEffect,
  useMemo,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  Camera,
  LoaderCircle,
  Save,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import {
  compressAvatarImage,
  deleteAvatarImage,
  getAvatarImagePath,
  uploadAvatarImage,
  validateAvatarImage,
} from "@/services/avatar";
import {
  getProfile,
  updateProfile,
} from "@/services/profile";

const MAX_USERNAME_LENGTH = 30;
const MAX_BIO_LENGTH = 160;

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [currentAvatarUrl, setCurrentAvatarUrl] = useState<
    string | null
  >(null);

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<
    string | null
  >(null);

  const [initialLoading, setInitialLoading] = useState(true);
  const [processingImage, setProcessingImage] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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

        const profile = await getProfile(supabase, user.id);

        setUsername(profile.username ?? "");
        setBio(profile.bio ?? "");
        setCurrentAvatarUrl(profile.avatar_url ?? null);
      } catch (error) {
        toast.error(
          error instanceof Error
            ? error.message
            : "プロフィールの取得に失敗しました。"
        );

        router.push("/profile");
      } finally {
        setInitialLoading(false);
      }
    };

    fetchProfile();
  }, [router, supabase]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const handleAvatarChange = async (
    event: ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setProcessingImage(true);

    try {
      validateAvatarImage(file);

      const compressedAvatar = await compressAvatarImage(file);

      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }

      const previewUrl = URL.createObjectURL(compressedAvatar);

      setAvatarFile(compressedAvatar);
      setAvatarPreviewUrl(previewUrl);

      toast.success("プロフィール画像を最適化しました。");
    } catch (error) {
      event.target.value = "";

      setAvatarFile(null);

      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
        setAvatarPreviewUrl(null);
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "プロフィール画像の処理に失敗しました。"
      );
    } finally {
      setProcessingImage(false);
    }
  };

  const handleUpdateProfile = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const trimmedUsername = username.trim();
    const trimmedBio = bio.trim();

    if (!trimmedUsername) {
      toast.error("ユーザー名を入力してください。");
      return;
    }

    if (trimmedUsername.length > MAX_USERNAME_LENGTH) {
      toast.error(
        `ユーザー名は${MAX_USERNAME_LENGTH}文字以内で入力してください。`
      );
      return;
    }

    if (trimmedBio.length > MAX_BIO_LENGTH) {
      toast.error(
        `自己紹介は${MAX_BIO_LENGTH}文字以内で入力してください。`
      );
      return;
    }

    if (processingImage) {
      toast.error(
        "プロフィール画像の処理が完了するまでお待ちください。"
      );
      return;
    }

    setSaving(true);

    let newUploadedAvatarPath: string | null = null;

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

      let avatarUrl = currentAvatarUrl ?? undefined;

      if (avatarFile) {
        const uploadedAvatar = await uploadAvatarImage(
          supabase,
          user.id,
          avatarFile
        );

        avatarUrl = uploadedAvatar.publicUrl;
        newUploadedAvatarPath = uploadedAvatar.filePath;
      }

      await updateProfile(supabase, user.id, {
        username: trimmedUsername,
        bio: trimmedBio,
        avatar_url: avatarUrl,
      });

      /*
       * profilesテーブルの更新成功後に、
       * 以前のプロフィール画像をStorageから削除します。
       */
      if (avatarFile && currentAvatarUrl) {
        const oldAvatarPath =
          getAvatarImagePath(currentAvatarUrl);

        if (oldAvatarPath) {
          try {
            await deleteAvatarImage(
              supabase,
              oldAvatarPath
            );
          } catch (cleanupError) {
            console.error(
              "古いプロフィール画像の削除に失敗しました。",
              cleanupError
            );
          }
        }
      }

      toast.success("プロフィールを更新しました！");

      router.push("/profile");
      router.refresh();
    } catch (error) {
      /*
       * 新しい画像のアップロード後にDB更新が失敗した場合、
       * 使用されない新画像をStorageから削除します。
       */
      if (newUploadedAvatarPath) {
        try {
          await deleteAvatarImage(
            supabase,
            newUploadedAvatarPath
          );
        } catch (cleanupError) {
          console.error(
            "新しいプロフィール画像の削除に失敗しました。",
            cleanupError
          );
        }
      }

      toast.error(
        error instanceof Error
          ? error.message
          : "プロフィールの更新に失敗しました。"
      );
    } finally {
      setSaving(false);
    }
  };

  const displayedAvatarUrl =
    avatarPreviewUrl ?? currentAvatarUrl;

  if (initialLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-muted/40">
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoaderCircle className="size-5 animate-spin" />
          プロフィールを読み込んでいます...
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-muted/40 px-4 py-10">
      <div className="mx-auto w-full max-w-xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight">
            プロフィール編集
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            TOTONOで表示するプロフィール情報を設定します。
          </p>
        </div>

        <form
          onSubmit={handleUpdateProfile}
          className="space-y-6 rounded-2xl border bg-card p-6 shadow-sm"
        >
          <section className="flex flex-col items-center">
            <div className="relative size-32 overflow-hidden rounded-full border bg-muted">
              {displayedAvatarUrl ? (
                <Image
                  src={displayedAvatarUrl}
                  alt="プロフィール画像"
                  fill
                  className="object-cover"
                  sizes="128px"
                  unoptimized={Boolean(avatarPreviewUrl)}
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <UserRound className="size-14 text-muted-foreground" />
                </div>
              )}
            </div>

            <label
              htmlFor="avatar"
              className="mt-4 inline-flex cursor-pointer items-center gap-2 rounded-md border px-4 py-2 text-sm font-medium transition hover:bg-muted"
            >
              {processingImage ? (
                <LoaderCircle className="size-4 animate-spin" />
              ) : (
                <Camera className="size-4" />
              )}

              {processingImage
                ? "画像を処理中..."
                : "プロフィール画像を選択"}
            </label>

            <Input
              id="avatar"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={handleAvatarChange}
              disabled={saving || processingImage}
              className="sr-only"
            />

            <p className="mt-3 text-center text-xs text-muted-foreground">
              JPEG・PNG・WebP / 最大5MB
              <br />
              選択した画像は中央で正方形に切り抜かれます。
            </p>
          </section>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="username"
                className="text-sm font-medium"
              >
                ユーザー名
              </label>

              <span className="text-xs text-muted-foreground">
                {username.length} / {MAX_USERNAME_LENGTH}
              </span>
            </div>

            <Input
              id="username"
              type="text"
              value={username}
              onChange={(event) =>
                setUsername(event.target.value)
              }
              placeholder="例：kazuya"
              maxLength={MAX_USERNAME_LENGTH}
              disabled={saving}
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label
                htmlFor="bio"
                className="text-sm font-medium"
              >
                自己紹介
              </label>

              <span className="text-xs text-muted-foreground">
                {bio.length} / {MAX_BIO_LENGTH}
              </span>
            </div>

            <Textarea
              id="bio"
              value={bio}
              onChange={(event) => setBio(event.target.value)}
              placeholder="好きなサウナやサウナ歴を書いてみましょう。"
              maxLength={MAX_BIO_LENGTH}
              disabled={saving}
              className="min-h-32 resize-none"
            />
          </div>

          <Button
            type="submit"
            size="lg"
            className="w-full"
            disabled={
              saving ||
              processingImage
            }
          >
            {saving ? (
              <>
                <LoaderCircle className="animate-spin" />
                保存中...
              </>
            ) : (
              <>
                <Save />
                プロフィールを保存
              </>
            )}
          </Button>
        </form>
      </div>
    </main>
  );
}