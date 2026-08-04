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
  Check,
  LoaderCircle,
  Save,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { DeleteAccountDialog } from "@/components/profile/DeleteAccountDialog";
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
  isUsernameAvailable,
  updateProfile,
} from "@/services/profile";

const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 30;
const MAX_BIO_LENGTH = 160;

type UsernameAvailabilityState =
  | "idle"
  | "checking"
  | "available"
  | "unavailable";

function normalizeUsername(value: string): string {
  return value.trim();
}

export default function EditProfilePage() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [currentUserId, setCurrentUserId] = useState<string | null>(
    null
  );
  const [initialUsername, setInitialUsername] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");

  const [usernameAvailability, setUsernameAvailability] =
    useState<UsernameAvailabilityState>("idle");
  const [checkedUsername, setCheckedUsername] = useState("");

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
        const profileUsername = profile?.username ?? "";

        setCurrentUserId(user.id);
        setInitialUsername(profileUsername);
        setUsername(profileUsername);
        setBio(profile?.bio ?? "");
        setCurrentAvatarUrl(profile?.avatar_url ?? null);

        if (profileUsername) {
          setCheckedUsername(normalizeUsername(profileUsername));
          setUsernameAvailability("available");
        }
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

    void fetchProfile();
  }, [router, supabase]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) {
        URL.revokeObjectURL(avatarPreviewUrl);
      }
    };
  }, [avatarPreviewUrl]);

  const validateUsername = (value: string): string | null => {
    const normalizedValue = normalizeUsername(value);
    const usernameLength = Array.from(normalizedValue).length;

    if (!normalizedValue) {
      return "ユーザー名を入力してください。";
    }

    if (usernameLength < MIN_USERNAME_LENGTH) {
      return `ユーザー名は${MIN_USERNAME_LENGTH}文字以上で入力してください。`;
    }

    if (usernameLength > MAX_USERNAME_LENGTH) {
      return `ユーザー名は${MAX_USERNAME_LENGTH}文字以内で入力してください。`;
    }

    if (/[\u0000-\u001f\u007f]/.test(normalizedValue)) {
      return "ユーザー名に使用できない文字が含まれています。";
    }

    return null;
  };

  const resetUsernameAvailability = () => {
    setUsernameAvailability("idle");
    setCheckedUsername("");
  };

  const checkUsernameAvailability = async (): Promise<boolean> => {
    const normalizedUsername = normalizeUsername(username);
    const validationMessage = validateUsername(username);

    if (validationMessage) {
      resetUsernameAvailability();
      toast.error(validationMessage);
      return false;
    }

    if (!currentUserId) {
      toast.error("ユーザー情報を確認できませんでした。");
      return false;
    }

    if (
      normalizedUsername.toLowerCase() ===
      normalizeUsername(initialUsername).toLowerCase()
    ) {
      setCheckedUsername(normalizedUsername);
      setUsernameAvailability("available");
      return true;
    }

    setUsernameAvailability("checking");

    try {
      const available = await isUsernameAvailable(
        supabase,
        normalizedUsername,
        {
          excludedUserId: currentUserId,
        }
      );

      setCheckedUsername(normalizedUsername);
      setUsernameAvailability(
        available ? "available" : "unavailable"
      );

      return available;
    } catch (error) {
      console.error(
        "プロフィール名の確認中にエラーが発生しました。",
        error
      );

      resetUsernameAvailability();

      toast.error(
        error instanceof Error
          ? error.message
          : "ユーザー名の確認に失敗しました。"
      );

      return false;
    }
  };

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

    if (saving) {
      return;
    }

    const trimmedUsername = normalizeUsername(username);
    const trimmedBio = bio.trim();
    const usernameValidationMessage = validateUsername(username);

    if (usernameValidationMessage) {
      toast.error(usernameValidationMessage);
      return;
    }

    if (Array.from(trimmedBio).length > MAX_BIO_LENGTH) {
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

    if (!currentUserId) {
      toast.error("ユーザー情報を確認できませんでした。");
      router.push("/login");
      return;
    }

    setSaving(true);

    let newUploadedAvatarPath: string | null = null;

    try {
      const hasValidAvailabilityCheck =
        usernameAvailability === "available" &&
        checkedUsername === trimmedUsername;

      const available = hasValidAvailabilityCheck
        ? true
        : await checkUsernameAvailability();

      if (!available) {
        if (usernameAvailability !== "unavailable") {
          setUsernameAvailability("unavailable");
          setCheckedUsername(trimmedUsername);
        }

        toast.error(
          "このユーザー名はすでに使用されています。"
        );
        return;
      }

      let avatarUrl = currentAvatarUrl ?? undefined;

      if (avatarFile) {
        const uploadedAvatar = await uploadAvatarImage(
          supabase,
          currentUserId,
          avatarFile
        );

        avatarUrl = uploadedAvatar.publicUrl;
        newUploadedAvatarPath = uploadedAvatar.filePath;
      }

      await updateProfile(supabase, currentUserId, {
        username: trimmedUsername,
        bio: trimmedBio,
        avatar_url: avatarUrl,
      });

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

      const message =
        error instanceof Error
          ? error.message
          : "プロフィールの更新に失敗しました。";

      if (
        message ===
        "このユーザー名はすでに使用されています。"
      ) {
        setUsernameAvailability("unavailable");
        setCheckedUsername(trimmedUsername);
      }

      toast.error(message);
    } finally {
      setSaving(false);
    }
  };

  const displayedAvatarUrl =
    avatarPreviewUrl ?? currentAvatarUrl;

  const usernameLength = Array.from(username).length;

  if (initialLoading) {
    return (
      <div
        aria-busy="true"
        aria-live="polite"
        className="
          flex
          min-h-screen
          items-center
          justify-center
          bg-muted/40
        "
      >
        <div className="flex items-center gap-2 text-muted-foreground">
          <LoaderCircle
            aria-hidden="true"
            className="
              size-5
              animate-spin
              motion-reduce:animate-none
            "
          />

          プロフィールを読み込んでいます...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/40 px-4 py-10">
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
          aria-busy={saving}
          className="
            space-y-6
            rounded-2xl
            border
            bg-card
            p-6
            shadow-sm
          "
        >
          <section
            aria-labelledby="profile-image-heading"
            className="flex flex-col items-center"
          >
            <h2
              id="profile-image-heading"
              className="sr-only"
            >
              プロフィール画像
            </h2>

            <div
              className="
                relative
                size-32
                overflow-hidden
                rounded-full
                border
                bg-muted
              "
            >
              {displayedAvatarUrl ? (
                <Image
                  src={displayedAvatarUrl}
                  alt="現在のプロフィール画像"
                  fill
                  className="object-cover"
                  sizes="128px"
                  unoptimized={Boolean(avatarPreviewUrl)}
                />
              ) : (
                <div className="flex size-full items-center justify-center">
                  <UserRound
                    aria-hidden="true"
                    className="size-14 text-muted-foreground"
                  />
                </div>
              )}
            </div>

            <label
              htmlFor="avatar"
              className="
                mt-4
                inline-flex
                min-h-11
                cursor-pointer
                items-center
                gap-2
                rounded-full
                border
                px-4
                py-2
                text-sm
                font-medium
                transition
                hover:bg-muted
                focus-within:ring-2
                focus-within:ring-ring
                focus-within:ring-offset-2
                motion-reduce:transition-none
              "
            >
              {processingImage ? (
                <LoaderCircle
                  aria-hidden="true"
                  className="
                    size-4
                    animate-spin
                    motion-reduce:animate-none
                  "
                />
              ) : (
                <Camera
                  aria-hidden="true"
                  className="size-4"
                />
              )}

              {processingImage
                ? "画像を処理中..."
                : "プロフィール画像を選択"}
            </label>

            <Input
              id="avatar"
              name="avatar"
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
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="username"
                className="text-sm font-medium"
              >
                ユーザー名
              </label>

              <span className="text-xs text-muted-foreground">
                {usernameLength} / {MAX_USERNAME_LENGTH}
              </span>
            </div>

            <div className="relative">
              <Input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value);
                  resetUsernameAvailability();
                }}
                onBlur={() => {
                  if (
                    normalizeUsername(username) &&
                    usernameAvailability === "idle"
                  ) {
                    void checkUsernameAvailability();
                  }
                }}
                placeholder="例：kazuya"
                minLength={MIN_USERNAME_LENGTH}
                maxLength={MAX_USERNAME_LENGTH}
                required
                disabled={saving}
                aria-invalid={
                  usernameAvailability === "unavailable"
                    ? true
                    : undefined
                }
                aria-describedby="username-help username-status"
                className="pr-11"
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  right-3
                  top-1/2
                  -translate-y-1/2
                "
              >
                {usernameAvailability === "checking" ? (
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                      text-muted-foreground
                      motion-reduce:animate-none
                    "
                  />
                ) : null}

                {usernameAvailability === "available" ? (
                  <Check className="size-4 text-success" />
                ) : null}

                {usernameAvailability === "unavailable" ? (
                  <X className="size-4 text-destructive" />
                ) : null}
              </div>
            </div>

            <p
              id="username-help"
              className="text-xs leading-5 text-muted-foreground"
            >
              {MIN_USERNAME_LENGTH}〜{MAX_USERNAME_LENGTH}
              文字で入力してください。大文字・小文字や前後の空白だけが
              異なる名前も同じ名前として扱われます。
            </p>

            <p
              id="username-status"
              aria-live="polite"
              className={
                usernameAvailability === "available"
                  ? "text-xs font-medium text-success"
                  : usernameAvailability === "unavailable"
                    ? "text-xs font-medium text-destructive"
                    : "sr-only"
              }
            >
              {usernameAvailability === "available"
                ? "このユーザー名は使用できます。"
                : usernameAvailability === "unavailable"
                  ? "このユーザー名はすでに使用されています。"
                  : ""}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="bio"
                className="text-sm font-medium"
              >
                自己紹介
              </label>

              <span className="text-xs text-muted-foreground">
                {Array.from(bio).length} / {MAX_BIO_LENGTH}
              </span>
            </div>

            <Textarea
              id="bio"
              name="bio"
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
              processingImage ||
              usernameAvailability === "checking" ||
              usernameAvailability === "unavailable"
            }
          >
            {saving ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="
                    animate-spin
                    motion-reduce:animate-none
                  "
                />

                保存中...
              </>
            ) : (
              <>
                <Save aria-hidden="true" />
                プロフィールを保存
              </>
            )}
          </Button>
        </form>

        <div className="mt-10">
          <DeleteAccountDialog />
        </div>
      </div>
    </div>
  );
}
