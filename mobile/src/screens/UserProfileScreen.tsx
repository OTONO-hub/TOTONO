import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  CalendarDays,
  ChevronRight,
  Flame,
  MapPin,
  RefreshCw,
  Star,
  UserRound,
  UsersRound,
} from "lucide-react";

import {
  BlockUserButton,
} from "../components/BlockUserButton";
import {
  FollowButton,
} from "../components/FollowButton";
import {
  supabase,
} from "../lib/supabase";
import {
  getFollowerCount,
  getFollowingCount,
} from "../services/follows";
import {
  getProfileData,
  type ProfileData,
  type RecentSaunaActivity,
} from "../services/profile";

type UserProfileScreenProps = {
  currentUserId: string;
  profileUserId: string;
  onBack: () => void;
  onSelectPost: (
    postId: string
  ) => void;
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
  profile: ProfileData
): string {
  return (
    profile.username
      ?.trim() ||
    "TOTONOユーザー"
  );
}

function UserProfileLoading() {
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

function UserProfileError({
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

function UserProfileHero({
  profile,
  currentUserId,
  profileUserId,
  followerCount,
  followingCount,
  onFollowerCountChange,
}: {
  profile: ProfileData;
  currentUserId: string;
  profileUserId: string;
  followerCount: number;
  followingCount: number;
  onFollowerCountChange: (
    count: number
  ) => void;
}) {
  const displayName =
    getDisplayName(
      profile
    );

  return (
    <header className="profile-hero user-profile-hero">
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
      </div>

      {profile.bio ? (
        <p className="profile-bio">
          {profile.bio}
        </p>
      ) : (
        <p className="profile-bio profile-bio-empty">
          サウナライフを
          TOTONOで記録しています。
        </p>
      )}

      <dl
        className="user-profile-follow-counts"
        aria-label="フォロー情報"
      >
        <div>
          <dt>
            フォロワー
          </dt>

          <dd>
            {followerCount}
          </dd>
        </div>

        <div>
          <dt>
            フォロー中
          </dt>

          <dd>
            {followingCount}
          </dd>
        </div>
      </dl>

      <div className="user-profile-actions">
        <FollowButton
          currentUserId={
            currentUserId
          }
          profileUserId={
            profileUserId
          }
          onFollowerCountChange={
            onFollowerCountChange
          }
        />

        {supabase ? (
          <BlockUserButton
            supabase={
              supabase
            }
            currentUserId={
              currentUserId
            }
            targetUserId={
              profileUserId
            }
            targetUserName={
              displayName
            }
          />
        ) : null}
      </div>
    </header>
  );
}

function UserProfileSummary({
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
      aria-labelledby="user-profile-summary-heading"
    >
      <div className="profile-section-heading">
        <div>
          <p className="eyebrow">
            Records
          </p>

          <h2 id="user-profile-summary-heading">
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

function UserActivityCard({
  activity,
  onSelectPost,
}: {
  activity: RecentSaunaActivity;
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

function UserActivities({
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
      aria-labelledby="user-recent-activities-heading"
    >
      <div className="profile-section-heading">
        <div>
          <p className="eyebrow">
            Recent Activity
          </p>

          <h2 id="user-recent-activities-heading">
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
            まだサ活がありません
          </strong>

          <p>
            このユーザーのサ活が
            ここに表示されます。
          </p>
        </div>
      ) : (
        <div className="profile-activity-list">
          {activities.map(
            (
              activity
            ) => (
              <UserActivityCard
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

export function UserProfileScreen({
  currentUserId,
  profileUserId,
  onBack,
  onSelectPost,
}: UserProfileScreenProps) {
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
    followerCount,
    setFollowerCount,
  ] =
    useState(
      0
    );

  const [
    followingCount,
    setFollowingCount,
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

  useEffect(() => {
    let cancelled =
      false;

    async function loadUserProfile() {
      if (!supabase) {
        setError(
          "Supabaseの設定が見つかりません。"
        );

        setLoading(
          false
        );

        return;
      }

      try {
        const [
          nextProfile,
          nextFollowerCount,
          nextFollowingCount,
        ] =
          await Promise.all([
            getProfileData(
              profileUserId
            ),

            getFollowerCount(
              supabase,
              profileUserId
            ),

            getFollowingCount(
              supabase,
              profileUserId
            ),
          ]);

        if (cancelled) {
          return;
        }

        setProfile(
          nextProfile
        );

        setFollowerCount(
          nextFollowerCount
        );

        setFollowingCount(
          nextFollowingCount
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

    void loadUserProfile();

    return () => {
      cancelled =
        true;
    };
  }, [
    profileUserId,
    reloadKey,
  ]);

  return (
    <section className="profile-screen user-profile-screen">
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

      {loading ? (
        <UserProfileLoading />
      ) : null}

      {!loading &&
      (error ||
        !profile) ? (
        <UserProfileError
          message={
            error ??
            "プロフィールが見つかりませんでした。"
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
      !error &&
      profile ? (
        <>
          <UserProfileHero
            profile={
              profile
            }
            currentUserId={
              currentUserId
            }
            profileUserId={
              profileUserId
            }
            followerCount={
              followerCount
            }
            followingCount={
              followingCount
            }
            onFollowerCountChange={
              setFollowerCount
            }
          />

          <UserProfileSummary
            profile={
              profile
            }
          />

          <UserActivities
            activities={
              profile.recentActivities
            }
            onSelectPost={
              onSelectPost
            }
          />

          <footer className="user-profile-footer">
            <UsersRound
              aria-hidden="true"
            />

            <p>
              TOTONOでサウナライフを
              共有しています。
            </p>
          </footer>
        </>
      ) : null}
    </section>
  );
}
