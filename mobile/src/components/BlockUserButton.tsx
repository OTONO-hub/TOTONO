import {
  useEffect,
  useState,
} from "react";
import {
  Ban,
  CheckCircle2,
  UserRoundX,
  X,
} from "lucide-react";
import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  blockUser,
  isUserBlocked,
  unblockUser,
} from "../services/user-blocks";

type BlockUserButtonProps = {
  supabase: SupabaseClient;
  currentUserId: string;
  targetUserId: string;
  targetUserName?:
    | string
    | null;
  onBlocked?: (
    targetUserId: string
  ) => void;
  onUnblocked?: (
    targetUserId: string
  ) => void;
};

export function BlockUserButton({
  supabase,
  currentUserId,
  targetUserId,
  targetUserName,
  onBlocked,
  onUnblocked,
}: BlockUserButtonProps) {
  const [
    blocked,
    setBlocked,
  ] =
    useState(
      false
    );

  const [
    checking,
    setChecking,
  ] =
    useState(
      currentUserId !==
        targetUserId
    );

  const [
    isOpen,
    setIsOpen,
  ] =
    useState(
      false
    );

  const [
    submitting,
    setSubmitting,
  ] =
    useState(
      false
    );

  const [
    completedMessage,
    setCompletedMessage,
  ] =
    useState<
      string | null
    >(
      null
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

  const normalizedTargetName =
    targetUserName
      ?.trim() ||
    "このユーザー";

  useEffect(
    () => {
      if (
        currentUserId ===
        targetUserId
      ) {
        return;
      }

      let active =
        true;

      async function loadBlockState() {
        try {
          const result =
            await isUserBlocked(
              supabase,
              currentUserId,
              targetUserId
            );

          if (active) {
            setBlocked(
              result
            );
          }
        } catch (
          error
        ) {
          console.error(
            "ブロック状態を確認できませんでした。",
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

      void loadBlockState();

      return () => {
        active =
          false;
      };
    },
    [
      supabase,
      currentUserId,
      targetUserId,
    ]
  );

  if (
    currentUserId ===
    targetUserId
  ) {
    return null;
  }

  function openConfirmation() {
    setErrorMessage(
      null
    );

    setCompletedMessage(
      null
    );

    setIsOpen(
      true
    );
  }

  function closeConfirmation() {
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

  async function handleConfirm() {
    if (submitting) {
      return;
    }

    setSubmitting(
      true
    );

    setErrorMessage(
      null
    );

    setCompletedMessage(
      null
    );

    try {
      if (blocked) {
        await unblockUser(
          supabase,
          currentUserId,
          targetUserId
        );

        setBlocked(
          false
        );

        setCompletedMessage(
          "ブロックを解除しました。"
        );

        onUnblocked?.(
          targetUserId
        );
      } else {
        await blockUser(
          supabase,
          currentUserId,
          targetUserId
        );

        setBlocked(
          true
        );

        setCompletedMessage(
          "ユーザーをブロックしました。"
        );

        onBlocked?.(
          targetUserId
        );
      }

      setIsOpen(
        false
      );
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : blocked
            ? "ブロックを解除できませんでした。"
            : "ユーザーをブロックできませんでした。"
      );
    } finally {
      setSubmitting(
        false
      );
    }
  }

  return (
    <div className="block-user-control">
      <button
        type="button"
        className={
          blocked
            ? "block-user-button blocked"
            : "block-user-button"
        }
        onClick={
          openConfirmation
        }
        disabled={
          checking ||
          submitting
        }
        aria-label={
          blocked
            ? `${normalizedTargetName}さんのブロックを解除する`
            : `${normalizedTargetName}さんをブロックする`
        }
      >
        {blocked ? (
          <CheckCircle2
            aria-hidden="true"
            size={
              17
            }
          />
        ) : (
          <UserRoundX
            aria-hidden="true"
            size={
              17
            }
          />
        )}

        <span>
          {checking
            ? "確認中"
            : blocked
              ? "ブロックを解除"
              : "ブロックする"}
        </span>
      </button>

      {completedMessage ? (
        <p
          className="block-user-completed"
          role="status"
        >
          {completedMessage}
        </p>
      ) : null}

      {isOpen ? (
        <div
          className="block-user-overlay"
          role="presentation"
          onMouseDown={
            (
              event
            ) => {
              if (
                event.target ===
                event.currentTarget
              ) {
                closeConfirmation();
              }
            }
          }
        >
          <section
            className="block-user-dialog"
            role="dialog"
            aria-modal="true"
            aria-labelledby="block-user-title"
          >
            <header className="block-user-dialog-header">
              <div className="block-user-dialog-icon">
                <Ban
                  aria-hidden="true"
                  size={
                    23
                  }
                />
              </div>

              <button
                type="button"
                className="block-user-close-button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  submitting
                }
                aria-label="確認画面を閉じる"
              >
                <X
                  aria-hidden="true"
                  size={
                    20
                  }
                />
              </button>
            </header>

            <h2 id="block-user-title">
              {blocked
                ? "ブロックを解除しますか？"
                : `${normalizedTargetName}さんをブロックしますか？`}
            </h2>

            <p>
              {blocked
                ? "ブロックを解除すると、このユーザーの投稿が再び表示されます。"
                : "ブロックすると、このユーザーの投稿はCommunityなどに表示されなくなります。相手には通知されません。"}
            </p>

            {errorMessage ? (
              <p
                className="block-user-error"
                role="alert"
              >
                {errorMessage}
              </p>
            ) : null}

            <div className="block-user-dialog-actions">
              <button
                type="button"
                className="block-user-cancel-button"
                onClick={
                  closeConfirmation
                }
                disabled={
                  submitting
                }
              >
                キャンセル
              </button>

              <button
                type="button"
                className={
                  blocked
                    ? "block-user-confirm-button unblock"
                    : "block-user-confirm-button"
                }
                onClick={() => {
                  void handleConfirm();
                }}
                disabled={
                  submitting
                }
              >
                {submitting
                  ? "処理中..."
                  : blocked
                    ? "ブロックを解除"
                    : "ブロックする"}
              </button>
            </div>
          </section>
        </div>
      ) : null}
    </div>
  );
}
