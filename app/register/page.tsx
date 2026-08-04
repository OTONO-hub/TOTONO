"use client";

import type { FormEvent } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Flame,
  LoaderCircle,
  LockKeyhole,
  Mail,
  UserRound,
  X,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

const MIN_USERNAME_LENGTH = 2;
const MAX_USERNAME_LENGTH = 30;
const MIN_PASSWORD_LENGTH = 8;

type UsernameState =
  | "idle"
  | "checking"
  | "available"
  | "unavailable";

function getSignUpErrorMessage(
  message: string
): string {
  const normalizedMessage =
    message.toLowerCase();

  if (
    normalizedMessage.includes(
      "user already registered"
    ) ||
    normalizedMessage.includes(
      "already been registered"
    )
  ) {
    return "このメールアドレスはすでに登録されています。";
  }

  if (
    normalizedMessage.includes(
      "password should be at least"
    )
  ) {
    return `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。`;
  }

  if (
    normalizedMessage.includes(
      "unable to validate email"
    ) ||
    normalizedMessage.includes(
      "invalid email"
    )
  ) {
    return "有効なメールアドレスを入力してください。";
  }

  if (
    normalizedMessage.includes(
      "too many requests"
    ) ||
    normalizedMessage.includes(
      "rate limit"
    ) ||
    normalizedMessage.includes(
      "email rate limit exceeded"
    )
  ) {
    return "登録の試行回数が多すぎます。少し時間をおいてからお試しください。";
  }

  if (
    normalizedMessage.includes(
      "database error saving new user"
    ) ||
    normalizedMessage.includes(
      "duplicate key"
    ) ||
    normalizedMessage.includes(
      "unique constraint"
    )
  ) {
    return "このユーザー名はすでに使用されている可能性があります。別の名前をお試しください。";
  }

  return "アカウントを作成できませんでした。入力内容や通信状況をご確認ください。";
}

export default function RegisterPage() {
  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [username, setUsername] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [
    passwordConfirmation,
    setPasswordConfirmation,
  ] = useState("");

  const [
    isPasswordVisible,
    setIsPasswordVisible,
  ] = useState(false);

  const [
    isConfirmationVisible,
    setIsConfirmationVisible,
  ] = useState(false);

  const [hasAgreed, setHasAgreed] =
    useState(false);

  const [
    usernameState,
    setUsernameState,
  ] = useState<UsernameState>("idle");

  const [
    checkedUsername,
    setCheckedUsername,
  ] = useState("");

  const [
    isSubmitting,
    setIsSubmitting,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const [
    isRegistrationComplete,
    setIsRegistrationComplete,
  ] = useState(false);

  const normalizedUsername =
    username.trim();

  const usernameLength =
    Array.from(username).length;

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

  const resetUsernameCheck = () => {
    setUsernameState("idle");
    setCheckedUsername("");
  };

  const validateUsername = (
    value: string
  ): string | null => {
    const normalizedValue = value.trim();
    const length =
      Array.from(normalizedValue).length;

    if (!normalizedValue) {
      return "ユーザー名を入力してください。";
    }

    if (length < MIN_USERNAME_LENGTH) {
      return `ユーザー名は${MIN_USERNAME_LENGTH}文字以上で入力してください。`;
    }

    if (length > MAX_USERNAME_LENGTH) {
      return `ユーザー名は${MAX_USERNAME_LENGTH}文字以内で入力してください。`;
    }

    if (/[\u0000-\u001f\u007f]/.test(normalizedValue)) {
      return "ユーザー名に使用できない文字が含まれています。";
    }

    return null;
  };

  const checkUsernameAvailability =
    async (): Promise<boolean> => {
      const validationMessage =
        validateUsername(username);

      if (validationMessage) {
        setUsernameState("idle");
        setErrorMessage(validationMessage);
        return false;
      }

      setUsernameState("checking");
      setErrorMessage(null);

      try {
        const { data, error } =
          await supabase.rpc(
            "is_username_available",
            {
              candidate_username:
                normalizedUsername,
              excluded_user_id: null,
            }
          );

        if (error) {
          console.error(
            "ユーザー名の重複確認に失敗しました。",
            error
          );

          setUsernameState("idle");
          setErrorMessage(
            "ユーザー名を確認できませんでした。通信状況をご確認ください。"
          );

          return false;
        }

        if (data !== true) {
          setUsernameState("unavailable");
          setCheckedUsername(
            normalizedUsername
          );
          setErrorMessage(
            "このユーザー名はすでに使用されています。"
          );

          return false;
        }

        setUsernameState("available");
        setCheckedUsername(
          normalizedUsername
        );

        return true;
      } catch (error) {
        console.error(
          "ユーザー名の確認中に予期しないエラーが発生しました。",
          error
        );

        setUsernameState("idle");
        setErrorMessage(
          "ユーザー名を確認できませんでした。時間をおいてお試しください。"
        );

        return false;
      }
    };

  const handleSignUp = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedEmail =
      email.trim();

    const usernameValidationMessage =
      validateUsername(username);

    if (usernameValidationMessage) {
      setErrorMessage(
        usernameValidationMessage
      );
      return;
    }

    if (
      !normalizedEmail ||
      !password ||
      !passwordConfirmation
    ) {
      setErrorMessage(
        "すべての入力項目を入力してください。"
      );
      return;
    }

    if (
      password.length <
      MIN_PASSWORD_LENGTH
    ) {
      setErrorMessage(
        `パスワードは${MIN_PASSWORD_LENGTH}文字以上で入力してください。`
      );
      return;
    }

    if (
      password !==
      passwordConfirmation
    ) {
      setErrorMessage(
        "確認用パスワードが一致していません。"
      );
      return;
    }

    if (!hasAgreed) {
      setErrorMessage(
        "利用規約とプライバシーポリシーへの同意が必要です。"
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      let isUsernameAvailable =
        usernameState === "available" &&
        checkedUsername ===
          normalizedUsername;

      if (!isUsernameAvailable) {
        isUsernameAvailable =
          await checkUsernameAvailability();
      }

      if (!isUsernameAvailable) {
        return;
      }

      const { error } =
        await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: {
              username:
                normalizedUsername,
            },
          },
        });

      if (error) {
        const message =
          getSignUpErrorMessage(
            error.message
          );

        if (
          error.message
            .toLowerCase()
            .includes(
              "database error saving new user"
            )
        ) {
          setUsernameState(
            "unavailable"
          );
        }

        setErrorMessage(message);
        toast.error(message);
        return;
      }

      setIsRegistrationComplete(
        true
      );

      toast.success(
        "確認メールを送信しました。"
      );
    } catch (error) {
      console.error(
        "TOTONOのアカウント作成中に予期しないエラーが発生しました。",
        error
      );

      const message =
        "通信中に問題が発生しました。時間をおいて、もう一度お試しください。";

      setErrorMessage(message);
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isRegistrationComplete) {
    return (
      <div
        className="
          relative
          flex
          min-h-screen
          items-center
          justify-center
          overflow-hidden
          bg-background
          px-5
          py-16
          sm:px-8
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-36
            -top-36
            size-96
            rounded-full
            bg-secondary/20
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-36
            -right-28
            size-96
            rounded-full
            bg-accent/12
            blur-3xl
          "
        />

        <section
          aria-labelledby="registration-complete-title"
          aria-describedby="registration-complete-description"
          className="
            relative
            w-full
            max-w-md
            overflow-hidden
            rounded-[2rem]
            border
            border-border/60
            bg-card/90
            p-7
            text-center
            shadow-xl
            shadow-black/5
            backdrop-blur-xl
            sm:rounded-[2.5rem]
            sm:p-10
          "
        >
          <div
            className="
              mx-auto
              flex
              size-16
              items-center
              justify-center
              rounded-full
              bg-success/10
              text-success
            "
          >
            <CheckCircle2
              aria-hidden="true"
              className="size-7"
              strokeWidth={1.8}
            />
          </div>

          <p
            className="
              mt-6
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Check your email
          </p>

          <h1
            id="registration-complete-title"
            className="
              mt-3
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            確認メールを送信しました
          </h1>

          <p
            id="registration-complete-description"
            className="
              mt-5
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
            "
          >
            <span className="font-semibold text-foreground">
              {email.trim()}
            </span>
            に確認メールを送信しました。
            メール内のリンクを開いて、
            登録を完了してください。
          </p>

          <div
            className="
              mt-6
              rounded-2xl
              border
              border-border/60
              bg-muted/35
              p-4
              text-left
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            登録するプロフィール名は
            「
            <span className="font-semibold text-foreground">
              {normalizedUsername}
            </span>
            」です。
            メールが届かない場合は、迷惑メールフォルダも
            ご確認ください。
          </div>

          <Link
            href="/login"
            className="
              mt-8
              inline-flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-primary
              px-6
              text-sm
              font-semibold
              text-primary-foreground
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          >
            ログイン画面へ進む

            <ArrowRight
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />
          </Link>
        </section>
      </div>
    );
  }

  return (
    <div
      className="
        relative
        flex
        min-h-screen
        items-center
        justify-center
        overflow-hidden
        bg-background
        px-5
        py-16
        sm:px-8
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-36
          -top-36
          size-96
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-36
          -right-28
          size-96
          rounded-full
          bg-accent/12
          blur-3xl
        "
      />

      <div
        className="
          relative
          w-full
          max-w-md
          overflow-hidden
          rounded-[2rem]
          border
          border-border/60
          bg-card/90
          p-6
          shadow-xl
          shadow-black/5
          backdrop-blur-xl
          sm:rounded-[2.5rem]
          sm:p-9
        "
      >
        <header className="text-center">
          <Link
            href="/"
            aria-label="TOTONO ホームへ戻る"
            className="
              mx-auto
              inline-flex
              size-14
              items-center
              justify-center
              rounded-full
              bg-primary
              text-primary-foreground
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          >
            <Flame
              aria-hidden="true"
              className="size-6"
              strokeWidth={1.8}
            />
          </Link>

          <p
            className="
              mt-5
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Start your sauna life
          </p>

          <h1
            className="
              mt-3
              text-3xl
              font-semibold
              tracking-[-0.045em]
              text-foreground
            "
          >
            新規登録
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            サウナの発見と記録を、
            <br />
            今日からTOTONOで始めましょう。
          </p>
        </header>

        <form
          onSubmit={handleSignUp}
          aria-busy={isSubmitting}
          className="mt-8 space-y-5"
        >
          <div>
            <div className="flex items-center justify-between gap-4">
              <label
                htmlFor="register-username"
                className="block text-sm font-semibold"
              >
                プロフィール名
              </label>

              <span className="text-xs text-muted-foreground">
                {usernameLength} / {MAX_USERNAME_LENGTH}
              </span>
            </div>

            <div className="relative mt-2">
              <UserRound
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
                strokeWidth={1.8}
              />

              <input
                id="register-username"
                name="username"
                type="text"
                autoComplete="username"
                minLength={MIN_USERNAME_LENGTH}
                maxLength={MAX_USERNAME_LENGTH}
                required
                disabled={isSubmitting}
                value={username}
                onChange={(event) => {
                  setUsername(
                    event.target.value
                  );
                  resetUsernameCheck();
                  clearError();
                }}
                onBlur={() => {
                  if (
                    username.trim() &&
                    usernameState === "idle"
                  ) {
                    void checkUsernameAvailability();
                  }
                }}
                aria-invalid={
                  usernameState ===
                    "unavailable" ||
                  Boolean(errorMessage)
                    ? true
                    : undefined
                }
                aria-describedby="register-username-help register-username-status"
                placeholder="例：サウナ太郎"
                className="
                  min-h-12
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-background/80
                  py-3
                  pl-11
                  pr-12
                  text-base
                  outline-none
                  transition
                  placeholder:text-muted-foreground/65
                  hover:border-foreground/25
                  focus:border-foreground/40
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <div
                aria-hidden="true"
                className="
                  absolute
                  right-4
                  top-1/2
                  -translate-y-1/2
                "
              >
                {usernameState ===
                "checking" ? (
                  <LoaderCircle
                    className="size-4 animate-spin text-muted-foreground motion-reduce:animate-none"
                    strokeWidth={1.8}
                  />
                ) : null}

                {usernameState ===
                "available" ? (
                  <Check
                    className="size-4 text-success"
                    strokeWidth={2}
                  />
                ) : null}

                {usernameState ===
                "unavailable" ? (
                  <X
                    className="size-4 text-destructive"
                    strokeWidth={2}
                  />
                ) : null}
              </div>
            </div>

            <p
              id="register-username-help"
              className="mt-2 text-xs leading-5 text-muted-foreground"
            >
              {MIN_USERNAME_LENGTH}〜{MAX_USERNAME_LENGTH}
              文字で入力してください。大文字・小文字や前後の空白だけが
              異なる名前も同じ名前として扱われます。
            </p>

            <p
              id="register-username-status"
              aria-live="polite"
              className={
                usernameState === "available"
                  ? "mt-2 text-xs font-medium text-success"
                  : usernameState === "unavailable"
                    ? "mt-2 text-xs font-medium text-destructive"
                    : "sr-only"
              }
            >
              {usernameState === "available"
                ? "このユーザー名は使用できます。"
                : usernameState === "unavailable"
                  ? "このユーザー名はすでに使用されています。"
                  : ""}
            </p>
          </div>

          <div>
            <label
              htmlFor="register-email"
              className="block text-sm font-semibold"
            >
              メールアドレス
            </label>

            <div className="relative mt-2">
              <Mail
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
                strokeWidth={1.8}
              />

              <input
                id="register-email"
                name="email"
                type="email"
                inputMode="email"
                autoComplete="email"
                autoCapitalize="none"
                spellCheck={false}
                required
                disabled={isSubmitting}
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  clearError();
                }}
                placeholder="example@gmail.com"
                className="
                  min-h-12
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-background/80
                  py-3
                  pl-11
                  pr-4
                  text-base
                  outline-none
                  transition
                  placeholder:text-muted-foreground/65
                  hover:border-foreground/25
                  focus:border-foreground/40
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="register-password"
              className="block text-sm font-semibold"
            >
              パスワード
            </label>

            <p
              id="register-password-help"
              className="mt-1 text-xs text-muted-foreground"
            >
              {MIN_PASSWORD_LENGTH}文字以上で入力してください。
            </p>

            <div className="relative mt-2">
              <LockKeyhole
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
                strokeWidth={1.8}
              />

              <input
                id="register-password"
                name="new-password"
                type={
                  isPasswordVisible
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                disabled={isSubmitting}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError();
                }}
                aria-describedby="register-password-help"
                placeholder="8文字以上のパスワード"
                className="
                  min-h-12
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-background/80
                  py-3
                  pl-11
                  pr-12
                  text-base
                  outline-none
                  transition
                  placeholder:text-muted-foreground/65
                  hover:border-foreground/25
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
                disabled={isSubmitting}
                onClick={() => {
                  setIsPasswordVisible(
                    (current) => !current
                  );
                }}
                aria-label={
                  isPasswordVisible
                    ? "パスワードを非表示にする"
                    : "パスワードを表示する"
                }
                aria-pressed={isPasswordVisible}
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
              htmlFor="register-password-confirmation"
              className="block text-sm font-semibold"
            >
              パスワード確認
            </label>

            <div className="relative mt-2">
              <LockKeyhole
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  left-4
                  top-1/2
                  size-4
                  -translate-y-1/2
                  text-muted-foreground
                "
                strokeWidth={1.8}
              />

              <input
                id="register-password-confirmation"
                name="new-password-confirmation"
                type={
                  isConfirmationVisible
                    ? "text"
                    : "password"
                }
                autoComplete="new-password"
                minLength={MIN_PASSWORD_LENGTH}
                required
                disabled={isSubmitting}
                value={passwordConfirmation}
                onChange={(event) => {
                  setPasswordConfirmation(
                    event.target.value
                  );
                  clearError();
                }}
                placeholder="パスワードを再入力"
                className="
                  min-h-12
                  w-full
                  rounded-2xl
                  border
                  border-border
                  bg-background/80
                  py-3
                  pl-11
                  pr-12
                  text-base
                  outline-none
                  transition
                  placeholder:text-muted-foreground/65
                  hover:border-foreground/25
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
                disabled={isSubmitting}
                onClick={() => {
                  setIsConfirmationVisible(
                    (current) => !current
                  );
                }}
                aria-label={
                  isConfirmationVisible
                    ? "確認用パスワードを非表示にする"
                    : "確認用パスワードを表示する"
                }
                aria-pressed={isConfirmationVisible}
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
                "
              >
                {isConfirmationVisible ? (
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

          <div className="rounded-2xl border border-border/60 bg-muted/30 p-4">
            <label
              htmlFor="register-agreement"
              className="flex cursor-pointer items-start gap-3"
            >
              <input
                id="register-agreement"
                name="agreement"
                type="checkbox"
                required
                disabled={isSubmitting}
                checked={hasAgreed}
                onChange={(event) => {
                  setHasAgreed(
                    event.target.checked
                  );
                  clearError();
                }}
                className="
                  mt-1
                  size-4
                  shrink-0
                  rounded
                  border-border
                  accent-primary
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                "
              />

              <span className="text-sm leading-6 text-muted-foreground">
                <Link
                  href="/terms"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-foreground underline underline-offset-4"
                >
                  利用規約
                </Link>
                と
                <Link
                  href="/privacy"
                  target="_blank"
                  rel="noreferrer"
                  className="mx-1 font-semibold text-foreground underline underline-offset-4"
                >
                  プライバシーポリシー
                </Link>
                に同意します。
              </span>
            </label>
          </div>

          <div
            id="register-error"
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

          <button
            type="submit"
            disabled={
              isSubmitting ||
              usernameState === "checking"
            }
            className="
              inline-flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-primary
              px-6
              text-sm
              font-semibold
              text-primary-foreground
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              disabled:cursor-not-allowed
              disabled:opacity-60
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          >
            {isSubmitting ? (
              <>
                <LoaderCircle
                  aria-hidden="true"
                  className="size-4 animate-spin motion-reduce:animate-none"
                  strokeWidth={1.8}
                />
                登録中
              </>
            ) : (
              <>
                アカウントを作成する
                <ArrowRight
                  aria-hidden="true"
                  className="size-4"
                />
              </>
            )}
          </button>
        </form>

        <div className="mt-8 border-t border-border/60 pt-6 text-center">
          <p className="text-sm text-muted-foreground">
            すでにアカウントをお持ちですか？
          </p>

          <Link
            href="/login"
            className="
              mt-3
              inline-flex
              min-h-10
              items-center
              justify-center
              rounded-full
              px-4
              text-sm
              font-semibold
              text-foreground
              underline
              underline-offset-4
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
            "
          >
            ログインする
          </Link>
        </div>
      </div>
    </div>
  );
}
