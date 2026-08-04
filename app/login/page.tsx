"use client";

import type { FormEvent } from "react";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Flame,
  LoaderCircle,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

function getLoginErrorMessage(message: string): string {
  const normalizedMessage = message.toLowerCase();

  if (
    normalizedMessage.includes("invalid login credentials") ||
    normalizedMessage.includes("invalid credentials")
  ) {
    return "メールアドレスまたはパスワードが正しくありません。";
  }

  if (normalizedMessage.includes("email not confirmed")) {
    return "メールアドレスの確認が完了していません。確認メールをご確認ください。";
  }

  if (
    normalizedMessage.includes("too many requests") ||
    normalizedMessage.includes("rate limit")
  ) {
    return "ログイン試行回数が多すぎます。少し時間をおいてからお試しください。";
  }

  return "ログインできませんでした。入力内容や通信状況をご確認ください。";
}

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [email, setEmail] =
    useState("");
  const [password, setPassword] =
    useState("");
  const [isPasswordVisible, setIsPasswordVisible] =
    useState(false);
  const [isSubmitting, setIsSubmitting] =
    useState(false);
  const [errorMessage, setErrorMessage] =
    useState<string | null>(null);

  const handleLogin = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      setErrorMessage(
        "メールアドレスとパスワードを入力してください。"
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const { error } =
        await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

      if (error) {
        const message =
          getLoginErrorMessage(error.message);

        setErrorMessage(message);
        toast.error(message);
        return;
      }

      toast.success("ログインしました。");

      router.replace("/today");
      router.refresh();
    } catch (error) {
      console.error(
        "TOTONOへのログイン中に予期しないエラーが発生しました。",
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

  const clearError = () => {
    if (errorMessage) {
      setErrorMessage(null);
    }
  };

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
            Welcome back
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
            ログイン
          </h1>

          <p
            className="
              mt-4
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            今日のサウナを見つけて、
            <br />
            あなたのサウナライフを続けましょう。
          </p>
        </header>

        <form
          onSubmit={handleLogin}
          aria-busy={isSubmitting}
          className="mt-8 space-y-5"
        >
          <div>
            <label
              htmlFor="login-email"
              className="
                block
                text-sm
                font-semibold
                text-foreground
              "
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
                id="login-email"
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
                aria-invalid={
                  errorMessage ? true : undefined
                }
                aria-describedby={
                  errorMessage
                    ? "login-error"
                    : undefined
                }
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
                  text-foreground
                  outline-none
                  transition
                  placeholder:text-muted-foreground/65
                  hover:border-foreground/25
                  focus:border-foreground/40
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  focus:ring-offset-background
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="login-password"
              className="
                block
                text-sm
                font-semibold
                text-foreground
              "
            >
              パスワード
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
                id="login-password"
                name="password"
                type={
                  isPasswordVisible
                    ? "text"
                    : "password"
                }
                autoComplete="current-password"
                required
                disabled={isSubmitting}
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value);
                  clearError();
                }}
                aria-invalid={
                  errorMessage ? true : undefined
                }
                aria-describedby={
                  errorMessage
                    ? "login-error"
                    : undefined
                }
                placeholder="パスワードを入力"
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
                  text-foreground
                  outline-none
                  transition
                  placeholder:text-muted-foreground/65
                  hover:border-foreground/25
                  focus:border-foreground/40
                  focus:ring-2
                  focus:ring-ring
                  focus:ring-offset-2
                  focus:ring-offset-background
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              />

              <button
                type="button"
                disabled={isSubmitting}
                onClick={() => {
                  setIsPasswordVisible(
                    (currentValue) =>
                      !currentValue
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
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                  motion-reduce:transition-none
                "
              >
                {isPasswordVisible ? (
                  <EyeOff
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                  />
                ) : (
                  <Eye
                    aria-hidden="true"
                    className="size-4"
                    strokeWidth={1.8}
                  />
                )}
              </button>
            </div>
          </div>

          <div
            id="login-error"
            role="alert"
            aria-live="assertive"
            className={
              errorMessage
                ? `
                  rounded-2xl
                  border
                  border-destructive/25
                  bg-destructive/8
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
            disabled={isSubmitting}
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
              focus-visible:ring-offset-background
              active:translate-y-0
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

                ログイン中
              </>
            ) : (
              <>
                ログイン

                <ArrowRight
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.8}
                />
              </>
            )}
          </button>
        </form>

        <div
          className="
            mt-8
            border-t
            border-border/60
            pt-6
            text-center
          "
        >
          <p className="text-sm text-muted-foreground">
            TOTONOを初めて利用しますか？
          </p>

          <Link
            href="/register"
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
              decoration-border
              underline-offset-4
              transition
              hover:decoration-foreground
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              motion-reduce:transition-none
            "
          >
            新規アカウントを作成する
          </Link>
        </div>
      </div>
    </div>
  );
}
