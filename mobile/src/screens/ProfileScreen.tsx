import {
  useEffect,
  useState,
} from "react";
import {
  Bookmark,
  CalendarDays,
  ChevronRight,
  Flame,
  LogOut,
  MapPin,
  Pencil,
  RefreshCw,
  Star,
  UserRound,
  UserRoundX,
} from "lucide-react";

import {
  DeleteAccountButton,
} from "../components/DeleteAccountButton";
import {
  LegalLinks,
} from "../components/LegalLinks";
import {
  supabase,
} from "../lib/supabase";
import {
  getProfileData,
  type ProfileData,
  type RecentSaunaActivity,
} from "../services/profile";

type ProfileScreenProps = {
  userId: string;
  email:
    | string
    | null;
  onSelectPost: (
    postId: string
  ) => void;
  onEditProfile?: () => void;
  onOpenSavedPosts?: () => void;
  onOpenBlockedUsers?: () => void;
};

function formatVisitDate(
  visitDate: string
): string {
  const date =
    new Date(
      `${visitDate}T00:00:00`
    );

  if (
    Number.isNaN(
      date.getTime()
    )
  ) {
    return visitDate;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
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

function getDisplayName(
  profile:
    | ProfileData
    | null,
  email:
    | string
    | null
): string {
  const username =
    profile?.username
      ?.trim();

  if (username) {
    return username;
  }

  if (email) {
    return (
      email.split(
        "@"
      )[0] ||
      "TOTONOユーザー"
    );
  }

  return "TOTONOユーザー";
}

function ProfileLoadingState() {
  return (
    <div
      className="profile-loading"
      role="status"
      aria-live="polite"
    >
      <div className="profile-loading-avatar" />

      <div className="profile-loading-line profile-loading-line-wide" />

      <div className="profile-loading-line" />

      <p>
        サウナライフを
        読み込んでいます...
      </p>
    </div>
  );
}

function ProfileErrorState({
  message,
  onRetry,
}: {
  message: string;
  onRetry: () => void;
}) {
  return (
    <div
      className="profile-error"
      role="alert"
    >
      <strong>
        プロフィールを
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

function ProfileHero({
  profile,
  email,
}: {
  profile: ProfileData;
  email:
    | string
    | null;
}) {
  const displayName =
    getDisplayName(
      profile,
      email
    );

  return (
    <header className="profile-hero">
      <div className="profile-avatar">
        {profile.avatarUrl ? (
          <img
            src={
              profile.avatarUrl
            }
            alt={`${displayName}のプロフィール画像`}
          />
        ) : (
          <UserRound
            aria-hidden="true"
          />
        )}
      </div>

      <div className="profile-identity">
        <p className="eyebrow">
          Sauna Life
        </p>

        <h1>
          {displayName}
        </h1>

        {email ? (
          <p className="profile-email">
            {email}
          </p>
        ) : null}
      </div>

      {profile.bio ? (
        <p className="profile-bio">
          {profile.bio}
        </p>
      ) : (
        <p className="profile-bio profile-bio-empty">
          あなたのサウナライフが、
          ここに積み重なっていきます。
        </p>
      )}
    </header>
  );
}

function ProfileSummary({
  profile,
}: {
  profile: ProfileData;
}) {
  const {
    summary,
  } =
    profile;

  return (
    <section
      className="profile-summary-section"
      aria-labelledby="profile-summary-heading"
    >
      <div className="profile-section-heading">
        <div>
          <p className="eyebrow">
            My Records
          </p>

          <h2 id="profile-summary-heading">
            サウナライフ
          </h2>
        </div>
      </div>

      <dl className="profile-summary-grid">
        <div className="profile-summary-card">
          <dt>
            サ活回数
          </dt>

          <dd>
            {summary.totalVisits}

            <span>
              回
            </span>
          </dd>
        </div>

        <div className="profile-summary-card">
          <dt>
            訪問施設
          </dt>

          <dd>
            {summary.visitedSaunas}

            <span>
              施設
            </span>
          </dd>
        </div>

        <div className="profile-summary-card">
          <dt>
            総セット数
          </dt>

          <dd>
            {summary.totalSets}

            <span>
              セット
            </span>
          </dd>
        </div>

        <div className="profile-summary-card profile-summary-card-accent">
          <dt>
            平均評価
          </dt>

          <dd>
            {summary.averageRating ??
              "—"}

            {summary.averageRating !==
            null ? (
              <span>
                / 5
              </span>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function RecentActivityCard({
  activity,
  onSelectPost,
}: {
  activity:
    RecentSaunaActivity;
  onSelectPost: (
    postId: string
  ) => void;
}) {
  return (
    <button
      type="button"
      className="profile-activity-card profile-activity-button"
      onClick={() => {
        onSelectPost(
          activity.id
        );
      }}
      aria-label={`${activity.saunaName}でのサ活詳細を見る`}
    >
      {activity.imageUrl ? (
        <div className="profile-activity-image">
          <img
            src={
              activity.imageUrl
            }
            alt={`${activity.saunaName}でのサ活`}
            loading="lazy"
          />
        </div>
      ) : (
        <div
          className="profile-activity-image profile-activity-image-placeholder"
          aria-hidden="true"
        >
          <Flame />
        </div>
      )}

      <div className="profile-activity-content">
        <div className="profile-activity-heading">
          <div>
            <div className="profile-activity-sauna">
              <MapPin
                aria-hidden="true"
              />

              <h3>
                {activity.saunaName}
              </h3>
            </div>

            <div className="profile-activity-date">
              <CalendarDays
                aria-hidden="true"
              />

              <time
                dateTime={
                  activity.visitDate
                }
              >
                {formatVisitDate(
                  activity.visitDate
                )}
              </time>
            </div>
          </div>

          <div
            className="profile-activity-rating"
            aria-label={`評価 ${activity.rating}点`}
          >
            <Star
              aria-hidden="true"
            />

            <span>
              {activity.rating}
            </span>
          </div>
        </div>

        <div className="profile-activity-meta">
          <span>
            <Flame
              aria-hidden="true"
            />

            {activity.setCount}
            セット
          </span>
        </div>

        {activity.comment ? (
          <p className="profile-activity-comment">
            {activity.comment}
          </p>
        ) : null}

        <span className="profile-activity-detail-link">
          サ活の詳細を見る

          <ChevronRight
            aria-hidden="true"
          />
        </span>
      </div>
    </button>
  );
}

function RecentActivities({
  activities,
  onSelectPost,
}: {
  activities:
    RecentSaunaActivity[];
  onSelectPost: (
    postId: string
  ) => void;
}) {
  return (
    <section
      className="profile-activities-section"
      aria-labelledby="recent-activities-heading"
    >
      <div className="profile-section-heading">
        <div>
          <p className="eyebrow">
            Recent Activity
          </p>

          <h2 id="recent-activities-heading">
            最近のサ活
          </h2>
        </div>

        {activities.length >
        0 ? (
          <span className="profile-section-count">
            最新
            {activities.length}
            件
          </span>
        ) : null}
      </div>

      {activities.length ===
      0 ? (
        <div className="profile-empty-activities">
          <div className="profile-empty-icon">
            <Flame
              aria-hidden="true"
            />
          </div>

          <strong>
            最初のサ活を
            記録してみましょう
          </strong>

          <p>
            記録した施設やセット数、
            写真がここに表示されます。
          </p>
        </div>
      ) : (
        <div className="profile-activity-list">
          {activities.map(
            (
              activity
            ) => (
              <RecentActivityCard
                key={
                  activity.id
                }
                activity={
                  activity
                }
                onSelectPost={
                  onSelectPost
                }
              />
            )
          )}
        </div>
      )}
    </section>
  );
}

export function ProfileScreen({
  userId,
  email,
  onSelectPost,
  onEditProfile,
  onOpenSavedPosts,
  onOpenBlockedUsers,
}: ProfileScreenProps) {
  const [
    profile,
    setProfile,
  ] =
    useState<
      ProfileData | null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
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

  const [
    signingOut,
    setSigningOut,
  ] =
    useState(
      false
    );

  useEffect(() => {
    let cancelled =
      false;

    async function loadProfile() {
      try {
        const nextProfile =
          await getProfileData(
            userId
          );

        if (cancelled) {
          return;
        }

        setProfile(
          nextProfile
        );

        setError(
          null
        );
      } catch (
        profileError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          profileError instanceof
            Error
            ? profileError.message
            : "プロフィールの取得中に問題が発生しました。"
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

    void loadProfile();

    return () => {
      cancelled =
        true;
    };
  }, [
    userId,
    reloadKey,
  ]);

  async function handleSignOut() {
    if (
      !supabase ||
      signingOut
    ) {
      return;
    }

    setSigningOut(
      true
    );

    const {
      error:
        signOutError,
    } =
      await supabase.auth
        .signOut();

    if (
      signOutError
    ) {
      setError(
        `ログアウトできませんでした: ${signOutError.message}`
      );

      setSigningOut(
        false
      );
    }
  }

  if (loading) {
    return (
      <section className="profile-screen">
        <ProfileLoadingState />
      </section>
    );
  }

  if (
    error ||
    !profile
  ) {
    return (
      <section className="profile-screen">
        <ProfileErrorState
          message={
            error ??
            "プロフィールデータが見つかりません。"
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

        <button
          className="secondary profile-sign-out-button"
          type="button"
          onClick={() => {
            void handleSignOut();
          }}
          disabled={
            signingOut
          }
        >
          <LogOut
            aria-hidden="true"
          />

          {signingOut
            ? "ログアウト中..."
            : "ログアウト"}
        </button>
      </section>
    );
  }

  return (
    <section className="profile-screen">
      <ProfileHero
        profile={
          profile
        }
        email={
          email
        }
      />

      {onEditProfile ? (
        <button
          type="button"
          className="profile-edit-button"
          onClick={
            onEditProfile
          }
        >
          <Pencil
            aria-hidden="true"
          />

          プロフィールを編集
        </button>
      ) : null}

      {onOpenSavedPosts ? (
        <button
          type="button"
          className="profile-saved-posts-button"
          onClick={
            onOpenSavedPosts
          }
        >
          <span className="profile-saved-posts-icon">
            <Bookmark
              aria-hidden="true"
            />
          </span>

          <span className="profile-saved-posts-content">
            <strong>
              保存済み投稿
            </strong>

            <small>
              気になるサ活を見返す
            </small>
          </span>

          <ChevronRight
            className="profile-saved-posts-arrow"
            aria-hidden="true"
          />
        </button>
      ) : null}

      {onOpenBlockedUsers ? (
        <button
          type="button"
          className="profile-saved-posts-button profile-blocked-users-button"
          onClick={
            onOpenBlockedUsers
          }
        >
          <span className="profile-saved-posts-icon profile-blocked-users-icon">
            <UserRoundX
              aria-hidden="true"
            />
          </span>

          <span className="profile-saved-posts-content">
            <strong>
              ブロック中のユーザー
            </strong>

            <small>
              ブロックの確認・解除
            </small>
          </span>

          <ChevronRight
            className="profile-saved-posts-arrow"
            aria-hidden="true"
          />
        </button>
      ) : null}

      <ProfileSummary
        profile={
          profile
        }
      />

      <RecentActivities
        activities={
          profile.recentActivities
        }
        onSelectPost={
          onSelectPost
        }
      />

      <LegalLinks />

      <section className="profile-account-section">
        <p className="eyebrow">
          Account
        </p>

        <div className="profile-account-actions">
          <button
            className="secondary profile-sign-out-button"
            type="button"
            onClick={() => {
              void handleSignOut();
            }}
            disabled={
              signingOut
            }
          >
            <LogOut
              aria-hidden="true"
            />

            {signingOut
              ? "ログアウト中..."
              : "ログアウト"}
          </button>

          {supabase ? (
            <DeleteAccountButton
              supabase={
                supabase
              }
            />
          ) : null}
        </div>
      </section>
    </section>
  );
}