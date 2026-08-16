import {
  useEffect,
  useState,
  type FormEvent,
} from "react";
import {
  CheckCircle2,
  Flag,
  X,
} from "lucide-react";
import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  createPostReport,
  isPostReported,
  type PostReportReason,
} from "../services/post-reports";

type ReportPostButtonProps = {
  supabase: SupabaseClient;
  currentUserId: string;
  postId: string;
  postAuthorId: string;
};

type ReportReasonOption = {
  value: PostReportReason;
  label: string;
  description: string;
};

const REPORT_REASON_OPTIONS:
  ReportReasonOption[] = [
    {
      value: "spam",
      label: "スパム・宣伝",
      description:
        "無関係な宣伝や繰り返し投稿",
    },
    {
      value: "harassment",
      label: "嫌がらせ",
      description:
        "個人への攻撃や不快な表現",
    },
    {
      value: "inappropriate",
      label: "不適切な内容",
      description:
        "公序良俗に反する画像や文章",
    },
    {
      value: "false_information",
      label: "誤った情報",
      description:
        "施設情報などに重大な誤りがある",
    },
    {
      value: "other",
      label: "その他",
      description:
        "上記以外の問題",
    },
  ];

const MAX_DETAILS_LENGTH =
  500;

export function ReportPostButton({
  supabase,
  currentUserId,
  postId,
  postAuthorId,
}: ReportPostButtonProps) {
  const [
    isOpen,
    setIsOpen,
  ] =
    useState(
      false
    );

  const [
    selectedReason,
    setSelectedReason,
  ] =
    useState<
      PostReportReason
    >(
      "spam"
    );

  const [
    details,
    setDetails,
  ] =
    useState(
      ""
    );

  const [
    reported,
    setReported,
  ] =
    useState(
      false
    );

  const [
    checking,
    setChecking,
  ] =
    useState(
      true
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );

  const [
    errorMessage,
    setErrorMessage,
  ] =
    useState<
      string | null
    >(
      null
    );

  useEffect(
    () => {
      let active =
        true;

      async function loadReportState() {
        try {
          const result =
            await isPostReported(
              supabase,
              currentUserId,
              postId
            );

          if (active) {
            setReported(
              result
            );
          }
        } catch (
          error
        ) {
          console.error(
            "通報状態を確認できませんでした。",
            error
          );
        } finally {
          if (active) {
            setChecking(
              false
            );
          }
        }
      }

      void loadReportState();

      return () => {
        active =
          false;
      };
    },
    [
      supabase,
      currentUserId,
      postId,
    ]
  );

  if (
    currentUserId ===
    postAuthorId
  ) {
    return null;
  }

  function openReportForm() {
    setErrorMessage(
      null
    );

    setIsOpen(
      true
    );
  }

  function closeReportForm() {
    if (submitting) {
      return;
    }

    setIsOpen(
      false
    );

    setErrorMessage(
      null
    );
  }

  async function handleSubmit(
    event:
      FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      submitting ||
      reported
    ) {
      return;
    }

    setSubmitting(
      true
    );

    setErrorMessage(
      null
    );

    try {
      await createPostReport(
        supabase,
        {
          postId,
          reporterId:
            currentUserId,
          reason:
            selectedReason,
          details,
        }
      );

      setReported(
        true
      );

      setIsOpen(
        false
      );

      setDetails(
        ""
      );
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "投稿を通報できませんでした。"
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <>
      <button
        type="button"
        className={
          reported
            ? "report-post-button reported"
            : "report-post-button"
        }
        onClick={
          reported
            ? undefined
            : openReportForm
        }
        disabled={
          checking ||
          reported
        }
        aria-label={
          reported
            ? "この投稿は通報済みです"
            : "この投稿を通報する"
        }
      >
        {reported ? (
          <CheckCircle2
            aria-hidden="true"
            size={
              17
            }
          />
        ) : (
          <Flag
            aria-hidden="true"
            size={
              17
            }
          />
        )}

        <span>
          {checking
            ? "確認中"
            : reported
              ? "通報済み"
              : "通報する"}
        </span>
      </button>

      {isOpen ? (
        <div
          className="report-post-overlay"
          role="presentation"
          onMouseDown={
            (
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeReportForm();
              }
            }
          }
        >
          <section
            className="report-post-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="report-post-title"
          >
            <header className="report-post-dialog-header">
              <div>
                <p className="report-post-eyebrow">
                  Community safety
                </p>

                <h2 id="report-post-title">
                  この投稿を通報
                </h2>
              </div>

              <button
                type="button"
                className="report-post-close-button"
                onClick={
                  closeReportForm
                }
                disabled={
                  submitting
                }
                aria-label="通報画面を閉じる"
              >
                <X
                  aria-hidden="true"
                  size={
                    20
                  }
                />
              </button>
            </header>

            <p className="report-post-description">
              通報内容は投稿者には公開されません。内容を確認し、必要に応じて対応します。
            </p>

            <form
              className="report-post-form"
              onSubmit={
                handleSubmit
              }
            >
              <fieldset
                className="report-post-reasons"
                disabled={
                  submitting
                }
              >
                <legend>
                  通報理由
                </legend>

                {REPORT_REASON_OPTIONS.map(
                  (
                    option
                  ) => (
                    <label
                      key={
                        option.value
                      }
                      className={
                        selectedReason ===
                        option.value
                          ? "report-post-reason selected"
                          : "report-post-reason"
                      }
                    >
                      <input
                        type="radio"
                        name="report-reason"
                        value={
                          option.value
                        }
                        checked={
                          selectedReason ===
                          option.value
                        }
                        onChange={
                          () => {
                            setSelectedReason(
                              option.value
                            );
                          }
                        }
                      />

                      <span className="report-post-reason-copy">
                        <strong>
                          {option.label}
                        </strong>

                        <small>
                          {option.description}
                        </small>
                      </span>
                    </label>
                  )
                )}
              </fieldset>

              <label className="report-post-details">
                <span>
                  詳細（任意）
                </span>

                <textarea
                  value={
                    details
                  }
                  onChange={
                    (
                      event
                    ) => {
                      setDetails(
                        event.target.value
                      );
                    }
                  }
                  maxLength={
                    MAX_DETAILS_LENGTH
                  }
                  rows={
                    4
                  }
                  placeholder="問題だと感じた内容を入力してください"
                  disabled={
                    submitting
                  }
                />

                <small>
                  {details.length}
                  /
                  {MAX_DETAILS_LENGTH}
                </small>
              </label>

              {errorMessage ? (
                <p
                  className="report-post-error"
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}

              <div className="report-post-dialog-actions">
                <button
                  type="button"
                  className="report-post-cancel-button"
                  onClick={
                    closeReportForm
                  }
                  disabled={
                    submitting
                  }
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  className="report-post-submit-button"
                  disabled={
                    submitting
                  }
                >
                  {submitting
                    ? "送信中..."
                    : "通報を送信"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
