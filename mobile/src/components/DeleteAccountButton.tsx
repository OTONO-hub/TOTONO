import {
  useState,
  type FormEvent,
} from "react";
import {
  AlertTriangle,
  Trash2,
  X,
} from "lucide-react";
import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  deleteCurrentAccount,
} from "../services/account";

type DeleteAccountButtonProps = {
  supabase: SupabaseClient;
};

const DELETE_CONFIRMATION_TEXT =
  "削除";

export function DeleteAccountButton({
  supabase,
}: DeleteAccountButtonProps) {
  const [
    isOpen,
    setIsOpen,
  ] =
    useState(
      false
    );

  const [
    confirmationText,
    setConfirmationText,
  ] =
    useState(
      ""
    );

  const [
    deleting,
    setDeleting,
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

  const canDelete =
    confirmationText.trim() ===
      DELETE_CONFIRMATION_TEXT &&
    !deleting;

  function openDialog() {
    setConfirmationText(
      ""
    );

    setErrorMessage(
      null
    );

    setIsOpen(
      true
    );
  }

  function closeDialog() {
    if (deleting) {
      return;
    }

    setIsOpen(
      false
    );

    setConfirmationText(
      ""
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

    if (!canDelete) {
      return;
    }

    setDeleting(
      true
    );

    setErrorMessage(
      null
    );

    try {
      await deleteCurrentAccount(
        supabase
      );

      /*
       * 削除後はAuthの状態変更によって
       * App.tsxがログイン画面へ切り替わります。
       */
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "アカウントを削除できませんでした。"
      );

      setDeleting(
        false
      );
    }
  }

  return (
    <>
      <button
        type="button"
        className="delete-account-open-button"
        onClick={
          openDialog
        }
      >
        <Trash2
          aria-hidden="true"
        />

        アカウントを削除
      </button>

      {isOpen ? (
        <div
          className="delete-account-overlay"
          role="presentation"
          onMouseDown={
            (
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeDialog();
              }
            }
          }
        >
          <section
            className="delete-account-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
            aria-describedby="delete-account-description"
          >
            <header className="delete-account-dialog-header">
              <div className="delete-account-warning-icon">
                <AlertTriangle
                  aria-hidden="true"
                />
              </div>

              <button
                type="button"
                className="delete-account-close-button"
                onClick={
                  closeDialog
                }
                disabled={
                  deleting
                }
                aria-label="アカウント削除画面を閉じる"
              >
                <X
                  aria-hidden="true"
                />
              </button>
            </header>

            <h2 id="delete-account-title">
              アカウントを削除しますか？
            </h2>

            <p id="delete-account-description">
              この操作を行うと、プロフィール、サ活、投稿画像、コメント、いいね、保存済み投稿など、TOTONOのすべてのデータが完全に削除されます。
            </p>

            <div className="delete-account-warning">
              <strong>
                この操作は取り消せません
              </strong>

              <p>
                削除したデータを復元することはできません。必要な記録がある場合は、削除前にご確認ください。
              </p>
            </div>

            <form
              className="delete-account-form"
              onSubmit={
                handleSubmit
              }
            >
              <label htmlFor="delete-account-confirmation">
                確認のため「
                {DELETE_CONFIRMATION_TEXT}
                」と入力してください
              </label>

              <input
                id="delete-account-confirmation"
                type="text"
                value={
                  confirmationText
                }
                onChange={
                  (
                    event
                  ) => {
                    setConfirmationText(
                      event.target.value
                    );
                  }
                }
                placeholder={
                  DELETE_CONFIRMATION_TEXT
                }
                autoComplete="off"
                autoCapitalize="none"
                spellCheck={
                  false
                }
                disabled={
                  deleting
                }
              />

              {errorMessage ? (
                <p
                  className="delete-account-error"
                  role="alert"
                >
                  {errorMessage}
                </p>
              ) : null}

              <div className="delete-account-dialog-actions">
                <button
                  type="button"
                  className="delete-account-cancel-button"
                  onClick={
                    closeDialog
                  }
                  disabled={
                    deleting
                  }
                >
                  キャンセル
                </button>

                <button
                  type="submit"
                  className="delete-account-confirm-button"
                  disabled={
                    !canDelete
                  }
                >
                  {deleting
                    ? "削除しています..."
                    : "完全に削除する"}
                </button>
              </div>
            </form>
          </section>
        </div>
      ) : null}
    </>
  );
}
