"use client";

import {
  FormEvent,
  MouseEvent,
  useRef,
  useState,
} from "react";
import { useRouter } from "next/navigation";
import {
  AlertTriangle,
  Eye,
  EyeOff,
  LoaderCircle,
  Trash2,
  X,
} from "lucide-react";
import { toast } from "sonner";

const DELETE_CONFIRMATION_TEXT =
  "TOTONOを退会する";

type DeleteAccountResponse = {
  success?: boolean;
  message?: string;
};

export function DeleteAccountDialog() {
  const router = useRouter();

  const dialogRef =
    useRef<HTMLDialogElement>(null);

  const [password, setPassword] =
    useState("");

  const [confirmation, setConfirmation] =
    useState("");

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [
    isDeleting,
    setIsDeleting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const isConfirmationValid =
    confirmation ===
    DELETE_CONFIRMATION_TEXT;

  const canDelete =
    password.length > 0 &&
    isConfirmationValid &&
    !isDeleting;

  const resetForm = () => {
    setPassword("");
    setConfirmation("");
    setIsPasswordVisible(false);
    setErrorMessage(null);
  };

  const openDialog = () => {
    resetForm();
    dialogRef.current?.showModal();
  };

  const closeDialog = () => {
    if (isDeleting) {
      return;
    }

    dialogRef.current?.close();
    resetForm();
  };

  const handleBackdropClick = (
    event: MouseEvent<HTMLDialogElement>
  ) => {
    if (
      event.target ===
      dialogRef.current
    ) {
      closeDialog();
    }
  };

  const handleDeleteAccount = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!canDelete) {
      return;
    }

    setIsDeleting(true);
    setErrorMessage(null);

    try {
      const response = await fetch(
        "/api/account",
        {
          method: "DELETE",
          headers: {
            "Content-Type":
              "application/json",
          },
          cache: "no-store",
          body: JSON.stringify({
            password,
            confirmation,
          }),
        }
      );

      let responseData:
        | DeleteAccountResponse
        | null = null;

      try {
        responseData =
          (await response.json()) as DeleteAccountResponse;
      } catch {
        responseData = null;
      }

      if (!response.ok) {
        const message =
          responseData?.message ??
          "アカウントを削除できませんでした。";

        setErrorMessage(message);
        toast.error(message);
        return;
      }

      dialogRef.current?.close();
      resetForm();

      toast.success(
        responseData?.message ??
          "アカウントを削除しました。"
      );

      router.replace(
        "/account-deleted"
      );

      router.refresh();
    } catch (error) {
      console.error(
        "アカウント削除中に予期しないエラーが発生しました。",
        error
      );

      const message =
        "通信中に問題が発生しました。時間をおいて、もう一度お試しください。";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <section
        aria-labelledby="delete-account-heading"
        className="
          rounded-3xl
          border
          border-destructive/25
          bg-destructive/5
          p-5
          sm:p-6
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <div
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-destructive/10
                  text-destructive
                "
              >
                <AlertTriangle
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.8}
                />
              </div>

              <h2
                id="delete-account-heading"
                className="
                  text-lg
                  font-semibold
                  text-foreground
                "
              >
                アカウントを削除
              </h2>
            </div>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              プロフィール、投稿、画像、
              コメント、いいねなど、
              アカウントに関連するデータを
              完全に削除します。
            </p>
          </div>

          <button
            type="button"
            onClick={openDialog}
            className="
              inline-flex
              min-h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-destructive/35
              bg-background
              px-5
              text-sm
              font-semibold
              text-destructive
              transition
              hover:bg-destructive/10
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-destructive
              focus-visible:ring-offset-2
              motion-reduce:transition-none
            "
          >
            <Trash2
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />

            削除手続きへ
          </button>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        aria-labelledby="delete-dialog-title"
        aria-describedby="delete-dialog-description"
        onClick={handleBackdropClick}
        onCancel={(event) => {
          event.preventDefault();
          closeDialog();
        }}
        className="
          m-auto
          w-[calc(100%-2rem)]
          max-w-lg
          overflow-visible
          rounded-[2rem]
          border
          border-border/60
          bg-card
          p-0
          text-foreground
          shadow-2xl
          backdrop:bg-black/45
          backdrop:backdrop-blur-sm
        "
      >
        <div
          className="
            relative
            max-h-[calc(100dvh-2rem)]
            overflow-y-auto
            p-6
            sm:p-8
          "
        >
          <button
            type="button"
            onClick={closeDialog}
            disabled={isDeleting}
            aria-label="削除確認画面を閉じる"
            className="
              absolute
              right-4
              top-4
              flex
              size-10
              items-center
              justify-center
              rounded-full
              text-muted-foreground
              transition
              hover:bg-muted
              hover:text-foreground
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              disabled:cursor-not-allowed
              disabled:opacity-50
              motion-reduce:transition-none
            "
          >
            <X
              aria-hidden="true"
              className="size-5"
            />
          </button>

          <div
            className="
              flex
              size-14
              items-center
              justify-center
              rounded-full
              bg-destructive/10
              text-destructive
            "
          >
            <AlertTriangle
              aria-hidden="true"
              className="size-6"
              strokeWidth={1.8}
            />
          </div>

          <h2
            id="delete-dialog-title"
            className="
              mt-5
              pr-10
              text-2xl
              font-semibold
              tracking-tight
            "
          >
            アカウントを完全に削除しますか？
          </h2>

          <p
            id="delete-dialog-description"
            className="
              mt-4
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            この操作は取り消せません。
            TOTONOに保存されたプロフィール、
            投稿、画像、コメント、お気に入り、
            フォローなどが削除されます。
          </p>

          <form
            onSubmit={handleDeleteAccount}
            aria-busy={isDeleting}
            className="mt-7 space-y-5"
          >
            <div>
              <label
                htmlFor="delete-account-password"
                className="
                  block
                  text-sm
                  font-semibold
                "
              >
                現在のパスワード
              </label>

              <div className="relative mt-2">
                <input
                  id="delete-account-password"
                  name="password"
                  type={
                    isPasswordVisible
                      ? "text"
                      : "password"
                  }
                  autoComplete="current-password"
                  required
                  disabled={isDeleting}
                  value={password}
                  onChange={(event) => {
                    setPassword(
                      event.target.value
                    );

                    if (errorMessage) {
                      setErrorMessage(null);
                    }
                  }}
                  aria-invalid={
                    errorMessage
                      ? true
                      : undefined
                  }
                  aria-describedby={
                    errorMessage
                      ? "delete-account-error"
                      : undefined
                  }
                  placeholder="パスワードを入力"
                  className="
                    min-h-12
                    w-full
                    rounded-2xl
                    border
                    border-border
                    bg-background
                    px-4
                    py-3
                    pr-12
                    text-base
                    outline-none
                    transition
                    placeholder:text-muted-foreground/65
                    focus:border-foreground/40
                    focus:ring-2
                    focus:ring-ring
                    focus:ring-offset-2
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                />

                <button
                  type="button"
                  disabled={isDeleting}
                  onClick={() => {
                    setIsPasswordVisible(
                      (current) =>
                        !current
                    );
                  }}
                  aria-label={
                    isPasswordVisible
                      ? "パスワードを非表示にする"
                      : "パスワードを表示する"
                  }
                  aria-pressed={
                    isPasswordVisible
                  }
                  className="
                    absolute
                    right-2
                    top-1/2
                    flex
                    size-10
                    -translate-y-1/2
                    items-center
                    justify-center
                    rounded-full
                    text-muted-foreground
                    transition
                    hover:bg-muted
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    disabled:opacity-50
                    motion-reduce:transition-none
                  "
                >
                  {isPasswordVisible ? (
                    <EyeOff
                      aria-hidden="true"
                      className="size-4"
                    />
                  ) : (
                    <Eye
                      aria-hidden="true"
                      className="size-4"
                    />
                  )}
                </button>
              </div>
            </div>

            <div>
              <label
                htmlFor="delete-account-confirmation"
                className="
                  block
                  text-sm
                  font-semibold
                "
              >
                削除確認
              </label>

              <p
                id="delete-confirmation-help"
                className="
                  mt-2
                  text-sm
                  leading-6
                  text-muted-foreground
                "
              >
                確認のため、以下を入力してください。
              </p>

              <code
                className="
                  mt-3
                  block
                  rounded-xl
                  bg-muted
                  px-4
                  py-3
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                {DELETE_CONFIRMATION_TEXT}
              </code>

              <input
                id="delete-account-confirmation"
                name="confirmation"
                type="text"
                autoComplete="off"
                required
                disabled={isDeleting}
                value={confirmation}
                onChange={(event) => {
                  setConfirmation(
                    event.target.value
                  );

                  if (errorMessage) {
                    setErrorMessage(null);
                  }
                }}
                aria-invalid={
                  confirmation.length > 0 &&
                  !isConfirmationValid
                    ? true
                    : undefined
                }
                aria-describedby="delete-confirmation-help"
                placeholder={DELETE_CONFIRMATION_TEXT}
                className="
                  mt-3
                  min-h-12
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-background
                  px-4
                  py-3
                  text-base
                  outline-none
                  transition
                  placeholder:text-muted-foreground/50
                  focus:border-foreground/40
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>

            <div
              id="delete-account-error"
              role="alert"
              aria-live="assertive"
              className={
                errorMessage
                  ? `
                    rounded-2xl
                    border
                    border-destructive/25
                    bg-destructive/10
                    px-4
                    py-3
                    text-sm
                    leading-6
                    text-destructive
                  `
                  : "sr-only"
              }
            >
              {errorMessage ?? ""}
            </div>

            <div
              className="
                flex
                flex-col-reverse
                gap-3
                pt-2
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={closeDialog}
                disabled={isDeleting}
                className="
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border
                  bg-background
                  px-6
                  text-sm
                  font-semibold
                  transition
                  hover:bg-muted
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  motion-reduce:transition-none
                "
              >
                キャンセル
              </button>

              <button
                type="submit"
                disabled={!canDelete}
                className="
                  inline-flex
                  min-h-12
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  bg-destructive
                  px-6
                  text-sm
                  font-semibold
                  text-destructive-foreground
                  shadow-sm
                  transition
                  hover:opacity-90
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-destructive
                  focus-visible:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  motion-reduce:transition-none
                "
              >
                {isDeleting ? (
                  <>
                    <LoaderCircle
                      aria-hidden="true"
                      className="
                        size-4
                        animate-spin
                        motion-reduce:animate-none
                      "
                    />

                    削除しています
                  </>
                ) : (
                  <>
                    <Trash2
                      aria-hidden="true"
                      className="size-4"
                    />

                    アカウントを完全に削除
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </dialog>
    </>
  );
}
