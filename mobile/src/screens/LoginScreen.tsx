import {
  useState,
} from "react";
import {
  KeyRound,
  Mail,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import {
  hasSupabaseConfig,
  supabase,
} from "../lib/supabase";
import {
  MAX_USERNAME_LENGTH,
  isUsernameAvailable,
  normalizeUsername,
  validateRegistrationUsername,
  wasCreatedDuringRegistration,
} from "../services/auth-registration";
import {
  openPrivacyPolicy,
  openTermsOfService,
} from "../services/legal-links";
import { trackProductEvent } from "../services/product-events";

type AuthMode =
  | "login"
  | "register";

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
    mode,
    setMode,
  ] =
    useState<AuthMode>(
      "register"
    );

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
    username,
    setUsername,
  ] =
    useState("");

  const [
    hasAgreed,
    setHasAgreed,
  ] =
    useState(
      false
    );

  const [
    registrationStartedAt,
    setRegistrationStartedAt,
  ] =
    useState<
      number | null
    >(
      null
    );

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

    const normalizedUsername =
      normalizeUsername(
        username
      );

    if (
      mode ===
      "register"
    ) {
      const usernameError =
        validateRegistrationUsername(
          normalizedUsername
        );

      if (usernameError) {
        setMessage(
          usernameError
        );
        return;
      }

      if (!hasAgreed) {
        setMessage(
          "利用規約とプライバシーポリシーへの同意が必要です。"
        );
        return;
      }
    }

    setSending(
      true
    );

    setMessage(
      null
    );

    try {
      if (
        mode ===
        "register"
      ) {
        const available =
          await isUsernameAvailable(
            supabase,
            normalizedUsername
          );

        if (!available) {
          setMessage(
            "このユーザー名はすでに使用されています。"
          );
          return;
        }
      }

      const startedAt =
        mode ===
          "register" &&
        registrationStartedAt !==
          null
          ? registrationStartedAt
          : Date.now();

      const {
        error,
      } =
        await supabase.auth
          .signInWithOtp({
            email:
              normalizedEmail,

            options: {
              shouldCreateUser:
                mode ===
                "register",

              ...(mode ===
              "register"
                ? {
                    data: {
                      username:
                        normalizedUsername,
                    },
                  }
                : {}),
            },
          });

      if (error) {
        throw error;
      }

      setEmail(
        normalizedEmail
      );

      if (
        mode ===
        "register"
      ) {
        setUsername(
          normalizedUsername
        );

        setRegistrationStartedAt(
          startedAt
        );
      }

      setOtp("");

      setStep(
        "otp"
      );

      setMessage(
        `${
          mode ===
          "register"
            ? "登録確認"
            : "ログイン"
        }コードをメールへ送信しました。届いた8桁のコードを入力してください。`
      );
    } catch (
      sendError
    ) {
      setMessage(
        `${
          mode ===
          "register"
            ? "登録確認"
            : "ログイン"
        }コードを送信できませんでした: ${getErrorMessage(
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

      const isNewAccount =
        mode ===
          "register" &&
        registrationStartedAt !==
          null &&
        wasCreatedDuringRegistration(
          data.session.user
            .created_at,
          registrationStartedAt
        );

      trackProductEvent(data.session.user.id, {
        eventName:
          isNewAccount
            ? "sign_up"
            : "login",
        source: "auth",
        sourceScreen:
          isNewAccount
            ? "register"
            : "login",
        authMethod: "email",
      });
    } catch (
      verificationError
    ) {
      setMessage(
        `${
          mode ===
          "register"
            ? "登録を完了"
            : "ログイン"
        }できませんでした: ${getErrorMessage(
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

  function handleModeChange(
    nextMode: AuthMode
  ) {
    if (
      sending ||
      verifying
    ) {
      return;
    }

    setMode(
      nextMode
    );
    setStep(
      "email"
    );
    setEmail("");
    setOtp("");
    setUsername("");
    setHasAgreed(
      false
    );
    setRegistrationStartedAt(
      null
    );
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
          {mode ===
          "register"
            ? "登録コードを入力"
            : "ログインコードを入力"}
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
              : mode ===
                  "register"
                ? "アカウントを作成"
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
        {mode ===
        "register" ? (
          <UserPlus
            aria-hidden="true"
          />
        ) : (
          <Mail
            aria-hidden="true"
          />
        )}
      </div>

      <p className="eyebrow">
        {mode ===
        "register"
          ? "Create account"
          : "Welcome back"}
      </p>

      <h1>
        {mode ===
        "register"
          ? "TOTONOをはじめる"
          : "TOTONOへログイン"}
      </h1>

      <p className="lead">
        {mode ===
        "register"
          ? "サウナを探して、記録して、振り返る。最初のアカウントを作成します。"
          : "登録済みのメールアドレスを入力してください。"}
      </p>

      <div className="card form-card">
        {mode ===
        "register" ? (
          <>
            <label htmlFor="register-username">
              ユーザー名
            </label>

            <input
              id="register-username"
              type="text"
              autoComplete="username"
              value={
                username
              }
              onChange={(
                event
              ) => {
                setUsername(
                  event.target
                    .value
                );
              }}
              placeholder="サウナ好き"
              maxLength={
                MAX_USERNAME_LENGTH
              }
              disabled={
                sending
              }
            />

            <p className="login-field-help">
              2〜{MAX_USERNAME_LENGTH}文字・あとから変更できます
            </p>
          </>
        ) : null}

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

        {mode ===
        "register" ? (
          <div className="login-consent">
            <input
              id="register-consent"
              type="checkbox"
              aria-label="利用規約とプライバシーポリシーに同意する"
              checked={
                hasAgreed
              }
              onChange={(
                event
              ) => {
                setHasAgreed(
                  event.target
                    .checked
                );
              }}
              disabled={
                sending
              }
            />

            <span>
              <button
                className="login-inline-link"
                type="button"
                onClick={() => {
                  void openTermsOfService();
                }}
              >
                利用規約
              </button>

              と

              <button
                className="login-inline-link"
                type="button"
                onClick={() => {
                  void openPrivacyPolicy();
                }}
              >
                プライバシーポリシー
              </button>

              に同意します
            </span>
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => {
            void handleSendOtp();
          }}
          disabled={
            !hasSupabaseConfig ||
            !email.trim() ||
            (mode ===
              "register" &&
              (!username.trim() ||
                !hasAgreed)) ||
            sending
          }
        >
          {sending
            ? "送信中..."
            : mode ===
                "register"
              ? "登録コードを送る"
              : "ログインコードを送る"}
        </button>

        <div className="login-mode-divider">
          <span>
            {mode ===
            "register"
              ? "すでにアカウントをお持ちですか？"
              : "TOTONOを初めて使いますか？"}
          </span>
        </div>

        <button
          className="secondary login-mode-button"
          type="button"
          onClick={() => {
            handleModeChange(
              mode ===
                "register"
                ? "login"
                : "register"
            );
          }}
          disabled={
            sending
          }
        >
          {mode ===
          "register"
            ? "ログインへ"
            : "新しいアカウントを作成"}
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
