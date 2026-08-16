import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  UserRound,
  UserRoundCheck,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  getBlockedUsers,
  unblockUser,
  type BlockedUser,
} from "../services/user-blocks";

type BlockedUsersScreenProps = {
  currentUserId: string;
  onBack: () => void;
};

function getBlockedUserName(
  user: BlockedUser
): string {
  return (
    user.username
      ?.trim() ||
    "TOTONOユーザー"
  );
}

function formatBlockedDate(
  blockedAt: string
): string {
  const date =
    new Date(
      blockedAt
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return blockedAt;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone:
        "Asia/Tokyo",
      year:
        "numeric",
      month:
        "long",
      day:
        "numeric",
    }
  ).format(
    date
  );
}

function BlockedUsersLoading() {
  return (
    <div
      className="blocked-users-loading"
      role="status"
      aria-live="polite"
    >
      <div className="blocked-users-loading-icon" />

      <div className="blocked-users-loading-line blocked-users-loading-line-wide" />

      <div className="blocked-users-loading-line" />

      <p>
        ブロック中のユーザーを
        読み込んでいます...
      </p>
    </div>
  );
}

function BlockedUsersError({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="blocked-users-error"
      role="alert"
    >
      <strong>
        ブロック一覧を
        読み込めませんでした
      </strong>

      <p>
        {message}
      </p>

      <button
        type="button"
        onClick={
          onRetry
        }
      >
        <RefreshCw
          aria-hidden="true"
        />

        もう一度試す
      </button>
    </div>
  );
}

function BlockedUsersEmpty() {
  return (
    <div className="blocked-users-empty">
      <div className="blocked-users-empty-icon">
        <ShieldCheck
          aria-hidden="true"
        />
      </div>

      <strong>
        ブロック中のユーザーはいません
      </strong>

      <p>
        ブロックしたユーザーは
        ここで確認・解除できます。
      </p>
    </div>
  );
}

export function BlockedUsersScreen({
  currentUserId,
  onBack,
}: BlockedUsersScreenProps) {
  const [
    users,
    setUsers,
  ] =
    useState<
      BlockedUser[]
    >(
      []
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
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

  const [
    processingUserId,
    setProcessingUserId,
  ] =
    useState<
      string | null
    >(
      null
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
    reloadKey,
    setReloadKey,
  ] =
    useState(
      0
    );

  useEffect(
    () => {
      if (!supabase) {
        return;
      }

      let active =
        true;

      async function loadUsers() {
        try {
          const nextUsers =
            await getBlockedUsers(
              supabase!,
              currentUserId
            );

          if (!active) {
            return;
          }

          setUsers(
            nextUsers
          );

          setErrorMessage(
            null
          );
        } catch (
          error
        ) {
          if (!active) {
            return;
          }

          setErrorMessage(
            error instanceof Error
              ? error.message
              : "ブロック一覧の取得中に問題が発生しました。"
          );
        } finally {
          if (active) {
            setLoading(
              false
            );
          }
        }
      }

      void loadUsers();

      return () => {
        active =
          false;
      };
    },
    [
      currentUserId,
      reloadKey,
    ]
  );

  async function handleUnblock(
    user: BlockedUser
  ) {
    if (
      !supabase ||
      processingUserId
    ) {
      return;
    }

    const userName =
      getBlockedUserName(
        user
      );

    const confirmed =
      window.confirm(
        `${userName}さんのブロックを解除しますか？`
      );

    if (!confirmed) {
      return;
    }

    setProcessingUserId(
      user.id
    );

    setErrorMessage(
      null
    );

    setCompletedMessage(
      null
    );

    try {
      await unblockUser(
        supabase,
        currentUserId,
        user.id
      );

      setUsers(
        (
          currentUsers
        ) =>
          currentUsers.filter(
            (
              currentUser
            ) =>
              currentUser.id !==
              user.id
          )
      );

      setCompletedMessage(
        `${userName}さんのブロックを解除しました。`
      );
    } catch (
      error
    ) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "ブロックを解除できませんでした。"
      );
    } finally {
      setProcessingUserId(
        null
      );
    }
  }

  if (!supabase) {
    return (
      <section className="blocked-users-screen">
        <button
          type="button"
          className="detail-back-button"
          onClick={
            onBack
          }
        >
          <ArrowLeft
            aria-hidden="true"
          />

          戻る
        </button>

        <BlockedUsersError
          message="Supabaseの設定が見つかりません。"
          onRetry={() => {
            window.location.reload();
          }}
        />
      </section>
    );
  }

  return (
    <section className="blocked-users-screen">
      <button
        type="button"
        className="detail-back-button"
        onClick={
          onBack
        }
      >
        <ArrowLeft
          aria-hidden="true"
        />

        戻る
      </button>

      <header className="blocked-users-header">
        <p className="eyebrow">
          Safety
        </p>

        <h1>
          ブロック中のユーザー
        </h1>

        <p>
          ブロックしたユーザーの投稿や通知は表示されません。解除すると、再び表示されるようになります。
        </p>
      </header>

      {completedMessage ? (
        <p
          className="blocked-users-completed"
          role="status"
        >
          <UserRoundCheck
            aria-hidden="true"
          />

          {completedMessage}
        </p>
      ) : null}

      {loading ? (
        <BlockedUsersLoading />
      ) : null}

      {!loading &&
      errorMessage ? (
        <BlockedUsersError
          message={
            errorMessage
          }
          onRetry={() => {
            setLoading(
              true
            );

            setReloadKey(
              (
                currentKey
              ) =>
                currentKey +
                1
            );
          }}
        />
      ) : null}

      {!loading &&
      !errorMessage &&
      users.length ===
        0 ? (
        <BlockedUsersEmpty />
      ) : null}

      {!loading &&
      !errorMessage &&
      users.length >
        0 ? (
        <ul
          className="blocked-users-list"
          aria-label="ブロック中のユーザー一覧"
        >
          {users.map(
            (
              user
            ) => {
              const userName =
                getBlockedUserName(
                  user
                );

              const processing =
                processingUserId ===
                user.id;

              return (
                <li
                  key={
                    user.id
                  }
                  className="blocked-user-card"
                >
                  <div className="blocked-user-avatar">
                    {user.avatarUrl ? (
                      <img
                        src={
                          user.avatarUrl
                        }
                        alt={`${userName}のプロフィール画像`}
                        loading="lazy"
                      />
                    ) : (
                      <UserRound
                        aria-hidden="true"
                      />
                    )}
                  </div>

                  <div className="blocked-user-content">
                    <strong>
                      {userName}
                    </strong>

                    <span>
                      {formatBlockedDate(
                        user.blockedAt
                      )}
                      にブロック
                    </span>
                  </div>

                  <button
                    type="button"
                    className="blocked-user-unblock-button"
                    onClick={() => {
                      void handleUnblock(
                        user
                      );
                    }}
                    disabled={
                      Boolean(
                        processingUserId
                      )
                    }
                  >
                    {processing
                      ? "解除中..."
                      : "解除する"}
                  </button>
                </li>
              );
            }
          )}
        </ul>
      ) : null}
    </section>
  );
}
