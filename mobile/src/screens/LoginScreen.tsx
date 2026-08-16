import {
  useState,
} from "react";
import {
  KeyRound,
  Mail,
  RefreshCw,
} from "lucide-react";

import {
  hasSupabaseConfig,
  supabase,
} from "../lib/supabase";

type LoginStep =
  | "email"
  | "otp";

function getErrorMessage(
  error: unknown
): string {
  if (
    error instanceof
      Error
  ) {
    return error.message;
  }

  return "通信中に予期しない問題が発生しました。";
}

export function LoginScreen() {
  const [
    step,
    setStep,
  ] =
    useState<LoginStep>(
      "email"
    );

  const [
    email,
    setEmail,
  ] =
    useState("");

  const [
    otp,
    setOtp,
  ] =
    useState("");

  const [
    sending,
    setSending,
  ] =
    useState(
      false
    );

  const [
    verifying,
    setVerifying,
  ] =
    useState(
      false
    );

  const [
    message,
    setMessage,
  ] =
    useState<
      string | null
    >(
      hasSupabaseConfig
        ? null
        : "mobile/.env にSupabase設定を追加してください。"
    );

  async function handleSendOtp() {
    if (
      !supabase ||
      !email.trim() ||
      sending ||
      verifying
    ) {
      return;
    }

    const normalizedEmail =
      email
        .trim()
        .toLowerCase();

    setSending(
      true
    );

    setMessage(
      null
    );

    try {
      const {
        error,
      } =
        await supabase.auth
          .signInWithOtp({
            email:
              normalizedEmail,

            options: {
              shouldCreateUser:
                false,
            },
          });

      if (error) {
        throw error;
      }

      setEmail(
        normalizedEmail
      );

      setOtp("");

      setStep(
        "otp"
      );

      setMessage(
        "ログインコードをメールへ送信しました。届いた8桁のコードを入力してください。"
      );
    } catch (
      sendError
    ) {
      setMessage(
        `ログインコードを送信できませんでした: ${getErrorMessage(
          sendError
        )}`
      );
    } finally {
      setSending(
        false
      );
    }
  }

  async function handleVerifyOtp() {
    if (
      !supabase ||
      !email ||
      verifying ||
      sending
    ) {
      return;
    }

    const normalizedOtp =
      otp
        .replace(
          /\D/g,
          ""
        )
        .slice(
          0,
          8
        );

    if (
      normalizedOtp.length !==
      8
    ) {
      setMessage(
        "8桁のログインコードを入力してください。"
      );

      return;
    }

    setVerifying(
      true
    );

    setMessage(
      null
    );

    try {
      const {
        data,
        error,
      } =
        await supabase.auth
          .verifyOtp({
            email,
            token:
              normalizedOtp,
            type:
              "email",
          });

      if (error) {
        throw error;
      }

      if (!data.session) {
        throw new Error(
          "ログインセッションを作成できませんでした。"
        );
      }
    } catch (
      verificationError
    ) {
      setMessage(
        `ログインできませんでした: ${getErrorMessage(
          verificationError
        )}`
      );
    } finally {
      setVerifying(
        false
      );
    }
  }

  function handleBackToEmail() {
    if (
      sending ||
      verifying
    ) {
      return;
    }

    setStep(
      "email"
    );

    setOtp("");

    setMessage(
      null
    );
  }

  if (
    step === "otp"
  ) {
    return (
      <section className="center-screen login-screen">
        <div className="login-icon">
          <KeyRound
            aria-hidden="true"
          />
        </div>

        <p className="eyebrow">
          Verification
        </p>

        <h1>
          ログインコードを入力
        </h1>

        <p className="lead">
          <strong className="login-email">
            {email}
          </strong>

          に届いたコードを
          入力してください。
        </p>

        <div className="card form-card">
          <label htmlFor="otp">
            8桁のログインコード
          </label>

          <input
            id="otp"
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            value={
              otp
            }
            onChange={(
              event
            ) => {
              setOtp(
                event.target.value
                  .replace(
                    /\D/g,
                    ""
                  )
                  .slice(
                    0,
                    8
                  )
              );
            }}
            onKeyDown={(
              event
            ) => {
              if (
                event.key ===
                  "Enter" &&
                otp.length ===
                  8
              ) {
                void handleVerifyOtp();
              }
            }}
            placeholder="12345678"
            maxLength={8}
            disabled={
              verifying ||
              sending
            }
          />

          <button
            type="button"
            onClick={() => {
              void handleVerifyOtp();
            }}
            disabled={
              otp.length !==
                8 ||
              verifying ||
              sending
            }
          >
            {verifying
              ? "確認中..."
              : "ログイン"}
          </button>

          <button
            className="secondary login-resend-button"
            type="button"
            onClick={() => {
              void handleSendOtp();
            }}
            disabled={
              sending ||
              verifying
            }
          >
            <RefreshCw
              aria-hidden="true"
            />

            {sending
              ? "再送信中..."
              : "コードを再送する"}
          </button>

          <button
            className="login-text-button"
            type="button"
            onClick={
              handleBackToEmail
            }
            disabled={
              sending ||
              verifying
            }
          >
            メールアドレスを入れ直す
          </button>

          {message ? (
            <p
              className="message"
              aria-live="polite"
            >
              {message}
            </p>
          ) : null}
        </div>
      </section>
    );
  }

  return (
    <section className="center-screen login-screen">
      <div className="login-icon">
        <Mail
          aria-hidden="true"
        />
      </div>

      <p className="eyebrow">
        Welcome
      </p>

      <h1>
        TOTONOへログイン
      </h1>

      <p className="lead">
        登録済みの
        メールアドレスを
        入力してください。
      </p>

      <div className="card form-card">
        <label htmlFor="email">
          メールアドレス
        </label>

        <input
          id="email"
          type="email"
          autoComplete="email"
          inputMode="email"
          value={
            email
          }
          onChange={(
            event
          ) => {
            setEmail(
              event.target
                .value
            );
          }}
          onKeyDown={(
            event
          ) => {
            if (
              event.key ===
                "Enter" &&
              email.trim()
            ) {
              void handleSendOtp();
            }
          }}
          placeholder="you@example.com"
          disabled={
            sending
          }
        />

        <button
          type="button"
          onClick={() => {
            void handleSendOtp();
          }}
          disabled={
            !hasSupabaseConfig ||
            !email.trim() ||
            sending
          }
        >
          {sending
            ? "送信中..."
            : "ログインコードを送る"}
        </button>

        {message ? (
          <p
            className="message"
            aria-live="polite"
          >
            {message}
          </p>
        ) : null}
      </div>
    </section>
  );
}
