import {
  useEffect,
  useState,
} from "react";
import {
  Check,
  RefreshCw,
  UserPlus,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  followUser,
  getFollowState,
  unfollowUser,
} from "../services/follows";
import {
  createNotification,
} from "../services/notifications";

type FollowButtonProps = {
  currentUserId: string;
  profileUserId: string;
  onFollowerCountChange?: (
    count: number
  ) => void;
};

export function FollowButton({
  currentUserId,
  profileUserId,
  onFollowerCountChange,
}: FollowButtonProps) {
  const [
    following,
    setFollowing,
  ] =
    useState(
      false
    );

  const [
    followerCount,
    setFollowerCount,
  ] =
    useState(
      0
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    updating,
    setUpdating,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
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

  const isOwnProfile =
    currentUserId ===
    profileUserId;

  useEffect(() => {
    if (
      !supabase ||
      isOwnProfile
    ) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    async function loadFollowState() {
      try {
        const state =
          await getFollowState(
            client,
            currentUserId,
            profileUserId
          );

        if (cancelled) {
          return;
        }

        setFollowing(
          state.isFollowing
        );

        setFollowerCount(
          state.followerCount
        );

        onFollowerCountChange?.(
          state.followerCount
        );

        setError(
          null
        );
      } catch (
        followStateError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          followStateError instanceof
            Error
            ? followStateError.message
            : "フォロー状態を取得できませんでした。"
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    }

    void loadFollowState();

    return () => {
      cancelled =
        true;
    };
  }, [
    currentUserId,
    isOwnProfile,
    onFollowerCountChange,
    profileUserId,
    reloadKey,
  ]);

  async function createFollowNotification() {
    if (
      !supabase ||
      isOwnProfile
    ) {
      return;
    }

    try {
      await createNotification(
        supabase,
        {
          recipientId:
            profileUserId,

          actorId:
            currentUserId,

          type:
            "follow",

          postId:
            null,
        }
      );
    } catch (
      notificationError
    ) {
      console.error(
        "フォロー通知の作成に失敗しました。",
        notificationError
      );
    }
  }

  async function handleToggleFollow() {
    if (
      !supabase ||
      updating ||
      isOwnProfile
    ) {
      return;
    }

    const client =
      supabase;

    const previousFollowing =
      following;

    const previousFollowerCount =
      followerCount;

    const nextFollowing =
      !previousFollowing;

    const nextFollowerCount =
      Math.max(
        0,
        previousFollowerCount +
          (
            nextFollowing
              ? 1
              : -1
          )
      );

    setUpdating(
      true
    );

    setError(
      null
    );

    setFollowing(
      nextFollowing
    );

    setFollowerCount(
      nextFollowerCount
    );

    onFollowerCountChange?.(
      nextFollowerCount
    );

    try {
      if (
        previousFollowing
      ) {
        await unfollowUser(
          client,
          currentUserId,
          profileUserId
        );
      } else {
        await followUser(
          client,
          currentUserId,
          profileUserId
        );

        await createFollowNotification();
      }
    } catch (
      followError
    ) {
      setFollowing(
        previousFollowing
      );

      setFollowerCount(
        previousFollowerCount
      );

      onFollowerCountChange?.(
        previousFollowerCount
      );

      setError(
        followError instanceof
          Error
          ? followError.message
          : "フォロー状態を更新できませんでした。"
      );
    } finally {
      setUpdating(
        false
      );
    }
  }

  if (
    isOwnProfile
  ) {
    return null;
  }

  if (loading) {
    return (
      <div
        className="follow-button-loading"
        role="status"
        aria-live="polite"
      >
        <span />

        <span className="sr-only">
          フォロー状態を読み込んでいます
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="follow-button-error">
        <p role="alert">
          {error}
        </p>

        <button
          type="button"
          onClick={() => {
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
        >
          <RefreshCw
            aria-hidden="true"
          />

          再読み込み
        </button>
      </div>
    );
  }

  return (
    <button
      type="button"
      className={
        following
          ? "follow-button following"
          : "follow-button"
      }
      onClick={() => {
        void handleToggleFollow();
      }}
      disabled={
        updating
      }
      aria-pressed={
        following
      }
    >
      {following ? (
        <Check
          aria-hidden="true"
        />
      ) : (
        <UserPlus
          aria-hidden="true"
        />
      )}

      <span>
        {updating
          ? "更新中..."
          : following
            ? "フォロー中"
            : "フォローする"}
      </span>
    </button>
  );
}
