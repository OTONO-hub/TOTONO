import {
  useEffect,
  useState,
} from "react";
import {
  Award,
  BarChart3,
  Bookmark,
  ChevronRight,
  Flame,
  Gauge,
  LogOut,
  MapPin,
  Pencil,
  RefreshCw,
  Sparkles,
  Star,
  Target,
  Trophy,
  UserRound,
  UserRoundX,
  Users,
  Waves,
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
  getFollowerCount,
  getFollowingCount,
} from "../services/follows";
import {
  getJournalPosts,
  type JournalPost,
} from "../services/journal";
import {
  calculateNextAchievement,
  type NextAchievement,
} from "../services/profile-next-achievement";
import {
  calculateSaunaPersona,
  type SaunaPersona,
} from "../services/profile-persona";
import {
  getProfileInsights,
  type ProfileInsights,
} from "../services/profile-insights";
import {
  calculateSaunaRhythm,
  type SaunaRhythm,
} from "../services/profile-rhythm";
import {
  getProfileData,
  type ProfileData,
} from "../services/profile";
import {
  calculateSaunaXp,
  type SaunaXpResult,
} from "../services/profile-xp";

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

type ProfileViewData = {
  profile: ProfileData;
  posts: JournalPost[];
  followerCount: number;
  followingCount: number;
  insights: ProfileInsights;
  xp: SaunaXpResult;
  persona: SaunaPersona;
  rhythm: SaunaRhythm;
  nextAchievement:
    NextAchievement;
};

function getDisplayName(
  profile:
    ProfileData,
  email:
    | string
    | null
): string {
  const username =
    profile.username
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
  data,
  email,
  onEditProfile,
}: {
  data:
    ProfileViewData;
  email:
    | string
    | null;
  onEditProfile?:
    () => void;
}) {
  const displayName =
    getDisplayName(
      data.profile,
      email
    );

  return (
    <header className="profile-rich-hero">
      <div className="profile-rich-avatar">
        {data.profile
          .avatarUrl ? (
          <img
            src={
              data.profile
                .avatarUrl
            }
            alt={`${displayName}のプロフィール画像`}
          />
        ) : (
          <UserRound
            aria-hidden="true"
          />
        )}
      </div>

      <div className="profile-rich-identity">
        <p className="eyebrow">
          My Lounge
        </p>

        <h1>
          {displayName}
        </h1>

        {data.profile.bio ? (
          <p>
            {data.profile.bio}
          </p>
        ) : (
          <p className="profile-rich-bio-empty">
            あなたのサウナライフが、
            ここに積み重なっていきます。
          </p>
        )}
      </div>

      {onEditProfile ? (
        <button
          type="button"
          className="profile-rich-edit-button"
          onClick={
            onEditProfile
          }
        >
          <Pencil
            aria-hidden="true"
          />

          編集
        </button>
      ) : null}

      <dl className="profile-social-summary">
        <div>
          <dt>
            サ活
          </dt>

          <dd>
            {data.posts.length}
          </dd>
        </div>

        <div>
          <dt>
            フォロー
          </dt>

          <dd>
            {data.followingCount}
          </dd>
        </div>

        <div>
          <dt>
            フォロワー
          </dt>

          <dd>
            {data.followerCount}
          </dd>
        </div>
      </dl>
    </header>
  );
}

function XpStatusSection({
  xp,
}: {
  xp: SaunaXpResult;
}) {
  return (
    <section className="profile-rich-section profile-xp-section">
      <div className="profile-rich-section-heading">
        <div className="profile-rich-section-icon">
          <Gauge
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="eyebrow">
            Sauna Level
          </p>

          <h2>
            {xp.level}
          </h2>
        </div>

        <strong className="profile-xp-total">
          {xp.currentXp}
          XP
        </strong>
      </div>

      <div className="profile-progress-track">
        <span
          style={{
            width:
              `${xp.progressPercentage}%`,
          }}
        />
      </div>

      <div className="profile-progress-meta">
        {xp.nextLevel ? (
          <>
            <span>
              次は
              {xp.nextLevel}
            </span>

            <span>
              あと
              {xp.xpUntilNextLevel}
              XP
            </span>
          </>
        ) : (
          <span>
            最高レベルに到達しました
          </span>
        )}
      </div>

      <div className="profile-xp-breakdown">
        <span>
          訪問
          <strong>
            {xp.breakdown
              .visitXp}
          </strong>
          XP
        </span>

        <span>
          施設
          <strong>
            {xp.breakdown
              .visitedSaunaXp}
          </strong>
          XP
        </span>

        <span>
          セット
          <strong>
            {xp.breakdown
              .setXp}
          </strong>
          XP
        </span>
      </div>
    </section>
  );
}

function PersonaAndRhythm({
  persona,
  rhythm,
}: {
  persona: SaunaPersona;
  rhythm: SaunaRhythm;
}) {
  return (
    <div className="profile-personality-grid">
      <section className="profile-rich-section profile-persona-card">
        <div className="profile-card-icon">
          <Sparkles
            aria-hidden="true"
          />
        </div>

        <p className="eyebrow">
          Sauna Persona
        </p>

        <h2>
          {persona.name}
        </h2>

        <span>
          {persona.englishName}
        </span>

        <p>
          {persona.description}
        </p>

        <small>
          {persona.reason}
        </small>
      </section>

      <section className="profile-rich-section profile-rhythm-card">
        <div className="profile-card-icon">
          <Waves
            aria-hidden="true"
          />
        </div>

        <p className="eyebrow">
          Sauna Rhythm
        </p>

        <h2>
          {rhythm.averagePaceLabel}
        </h2>

        <dl>
          <div>
            <dt>
              今月
            </dt>

            <dd>
              {rhythm.monthlyVisits}
              回
            </dd>
          </div>

          <div>
            <dt>
              直近30日
            </dt>

            <dd>
              {rhythm
                .lastThirtyDaysVisits}
              回
            </dd>
          </div>
        </dl>
      </section>
    </div>
  );
}

function ProfileSummarySection({
  insights,
}: {
  insights:
    ProfileInsights;
}) {
  return (
    <section className="profile-rich-section">
      <div className="profile-rich-section-heading">
        <div className="profile-rich-section-icon">
          <BarChart3
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="eyebrow">
            Sauna Summary
          </p>

          <h2>
            サウナライフ
          </h2>
        </div>
      </div>

      <dl className="profile-rich-summary-grid">
        <div>
          <dt>
            累計サ活
          </dt>

          <dd>
            {insights
              .totalSaunaVisits}
            <small>
              回
            </small>
          </dd>
        </div>

        <div>
          <dt>
            訪問施設
          </dt>

          <dd>
            {insights
              .visitedSaunas}
            <small>
              施設
            </small>
          </dd>
        </div>

        <div>
          <dt>
            総セット
          </dt>

          <dd>
            {insights
              .totalSets}
            <small>
              セット
            </small>
          </dd>
        </div>

        <div>
          <dt>
            今月
          </dt>

          <dd>
            {insights
              .monthlyVisits}
            <small>
              回
            </small>
          </dd>
        </div>

        <div>
          <dt>
            平均評価
          </dt>

          <dd>
            {insights
              .averageRating}
          </dd>
        </div>

        <div>
          <dt>
            最高評価
          </dt>

          <dd>
            {insights
              .highestRating}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function AnnualReportSection({
  insights,
}: {
  insights:
    ProfileInsights;
}) {
  const report =
    insights.annualReport;

  return (
    <section className="profile-rich-section profile-annual-section">
      <div className="profile-rich-section-heading">
        <div className="profile-rich-section-icon">
          <Trophy
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="eyebrow">
            Annual Report
          </p>

          <h2>
            {report.year}
            年の記録
          </h2>
        </div>
      </div>

      <dl className="profile-annual-grid">
        <div>
          <dt>
            サ活
          </dt>

          <dd>
            {report.visitCount}
            回
          </dd>
        </div>

        <div>
          <dt>
            訪問施設
          </dt>

          <dd>
            {report.visitedSaunas}
            施設
          </dd>
        </div>

        <div>
          <dt>
            総セット
          </dt>

          <dd>
            {report.totalSets}
          </dd>
        </div>

        <div>
          <dt>
            平均評価
          </dt>

          <dd>
            {report.averageRating}
          </dd>
        </div>
      </dl>

      {report.topSauna ? (
        <div className="profile-annual-highlight">
          <MapPin
            aria-hidden="true"
          />

          <div>
            <span>
              今年よく訪れた施設
            </span>

            <strong>
              {report.topSauna
                .saunaName}
            </strong>
          </div>
        </div>
      ) : null}

      {report.busiestMonth ? (
        <div className="profile-annual-highlight">
          <Flame
            aria-hidden="true"
          />

          <div>
            <span>
              最も活発だった月
            </span>

            <strong>
              {report.busiestMonth
                .label}
              ・
              {report.busiestMonth
                .visitCount}
              回
            </strong>
          </div>
        </div>
      ) : null}
    </section>
  );
}

function MonthlyActivitySection({
  insights,
}: {
  insights:
    ProfileInsights;
}) {
  const maximumVisits =
    Math.max(
      1,
      ...insights
        .monthlyActivities
        .map(
          (
            activity
          ) =>
            activity.visitCount
        )
    );

  return (
    <section className="profile-rich-section">
      <div className="profile-rich-section-heading">
        <div className="profile-rich-section-icon">
          <BarChart3
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="eyebrow">
            Activity
          </p>

          <h2>
            直近6か月
          </h2>
        </div>
      </div>

      <div className="profile-monthly-chart">
        {insights
          .monthlyActivities
          .map(
            (
              activity
            ) => {
              const height =
                Math.max(
                  activity.visitCount >
                    0
                    ? 12
                    : 4,
                  Math.round(
                    (
                      activity.visitCount /
                      maximumVisits
                    ) *
                      100
                  )
                );

              return (
                <div
                  key={
                    activity.yearMonth
                  }
                  className="profile-monthly-column"
                >
                  <span>
                    {activity.visitCount}
                  </span>

                  <div className="profile-monthly-bar-track">
                    <i
                      style={{
                        height:
                          `${height}%`,
                      }}
                    />
                  </div>

                  <small>
                    {activity.label}
                  </small>
                </div>
              );
            }
          )}
      </div>
    </section>
  );
}

function TopSaunasSection({
  insights,
}: {
  insights:
    ProfileInsights;
}) {
  return (
    <section className="profile-rich-section">
      <div className="profile-rich-section-heading">
        <div className="profile-rich-section-icon">
          <MapPin
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="eyebrow">
            Top Places
          </p>

          <h2>
            よく訪れる施設
          </h2>
        </div>
      </div>

      {insights
        .topVisitedSaunas
        .length ===
      0 ? (
        <p className="profile-rich-empty">
          サ活を記録すると、
          よく訪れる施設が表示されます。
        </p>
      ) : (
        <div className="profile-top-sauna-list">
          {insights
            .topVisitedSaunas
            .map(
              (
                sauna,
                index
              ) => (
                <div
                  key={
                    sauna.saunaId ??
                    sauna.saunaName
                  }
                  className="profile-top-sauna-card"
                >
                  <span>
                    {index +
                      1}
                  </span>

                  <strong>
                    {sauna.saunaName}
                  </strong>

                  <small>
                    {sauna.visitCount}
                    回
                  </small>
                </div>
              )
            )}
        </div>
      )}
    </section>
  );
}

function AchievementsSection({
  insights,
  nextAchievement,
}: {
  insights:
    ProfileInsights;
  nextAchievement:
    NextAchievement;
}) {
  const achievements = [
    {
      name:
        "はじめての整い",

      description:
        "最初のサ活を記録",

      unlocked:
        insights.hasFirstSteam,
    },

    {
      name:
        "サウナラバー",

      description:
        "サ活を10回記録",

      unlocked:
        insights.hasSaunaLover,
    },

    {
      name:
        "エクスプローラー",

      description:
        "5施設を訪問",

      unlocked:
        insights.hasExplorer,
    },

    {
      name:
        "パーフェクト",

      description:
        "評価5.0を記録",

      unlocked:
        insights.hasPerfection,
    },
  ];

  return (
    <section className="profile-rich-section">
      <div className="profile-rich-section-heading">
        <div className="profile-rich-section-icon">
          <Award
            aria-hidden="true"
          />
        </div>

        <div>
          <p className="eyebrow">
            Achievements
          </p>

          <h2>
            実績
          </h2>
        </div>
      </div>

      <div className="profile-achievement-grid">
        {achievements.map(
          (
            achievement
          ) => (
            <article
              key={
                achievement.name
              }
              className={
                achievement.unlocked
                  ? "profile-achievement-card unlocked"
                  : "profile-achievement-card"
              }
            >
              <Award
                aria-hidden="true"
              />

              <strong>
                {achievement.name}
              </strong>

              <small>
                {achievement.description}
              </small>
            </article>
          )
        )}
      </div>

      <div className="profile-next-achievement">
        <Target
          aria-hidden="true"
        />

        <div>
          <span>
            {nextAchievement
              .isCompleted
              ? "Complete"
              : "Next Achievement"}
          </span>

          <strong>
            {nextAchievement.name}
          </strong>

          <p>
            {nextAchievement.description}
          </p>

          <div className="profile-progress-track">
            <span
              style={{
                width:
                  `${nextAchievement.progress}%`,
              }}
            />
          </div>

          <small>
            {nextAchievement.current}
            /
            {nextAchievement.target}
          </small>
        </div>
      </div>
    </section>
  );
}

function ProfileMenu({
  onOpenSavedPosts,
  onOpenBlockedUsers,
}: {
  onOpenSavedPosts?:
    () => void;
  onOpenBlockedUsers?:
    () => void;
}) {
  return (
    <section className="profile-rich-menu">
      {onOpenSavedPosts ? (
        <button
          type="button"
          onClick={
            onOpenSavedPosts
          }
        >
          <span className="profile-rich-menu-icon">
            <Bookmark
              aria-hidden="true"
            />
          </span>

          <span>
            <strong>
              保存済み投稿
            </strong>

            <small>
              気になるサ活を見返す
            </small>
          </span>

          <ChevronRight
            aria-hidden="true"
          />
        </button>
      ) : null}

      {onOpenBlockedUsers ? (
        <button
          type="button"
          onClick={
            onOpenBlockedUsers
          }
        >
          <span className="profile-rich-menu-icon profile-rich-menu-blocked">
            <UserRoundX
              aria-hidden="true"
            />
          </span>

          <span>
            <strong>
              ブロック中のユーザー
            </strong>

            <small>
              ブロックの確認・解除
            </small>
          </span>

          <ChevronRight
            aria-hidden="true"
          />
        </button>
      ) : null}
    </section>
  );
}

export function ProfileScreen({
  userId,
  email,
  onSelectPost: _onSelectPost,
  onEditProfile,
  onOpenSavedPosts,
  onOpenBlockedUsers,
}: ProfileScreenProps) {
  const [
    data,
    setData,
  ] =
    useState<
      ProfileViewData | null
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
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    async function loadProfile() {
      try {
        const [
          profile,
          posts,
          followerCount,
          followingCount,
        ] =
          await Promise.all([
            getProfileData(
              userId
            ),

            getJournalPosts(
              userId
            ),

            getFollowerCount(
              client,
              userId
            ),

            getFollowingCount(
              client,
              userId
            ),
          ]);

        if (cancelled) {
          return;
        }

        const insights =
          getProfileInsights(
            posts
          );

        const xp =
          calculateSaunaXp({
            visitCount:
              insights
                .totalSaunaVisits,

            visitedSaunaCount:
              insights
                .visitedSaunas,

            totalSetCount:
              insights
                .totalSets,
          });

        const persona =
          calculateSaunaPersona(
            posts
          );

        const rhythm =
          calculateSaunaRhythm(
            posts
          );

        const nextAchievement =
          calculateNextAchievement(
            insights
          );

        setData({
          profile,
          posts,
          followerCount,
          followingCount,
          insights,
          xp,
          persona,
          rhythm,
          nextAchievement,
        });

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
      <section className="profile-screen profile-rich-screen">
        <ProfileLoadingState />
      </section>
    );
  }

  if (
    error ||
    !data
  ) {
    return (
      <section className="profile-screen profile-rich-screen">
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
    <section className="profile-screen profile-rich-screen">
      <ProfileHero
        data={
          data
        }
        email={
          email
        }
        onEditProfile={
          onEditProfile
        }
      />

      <XpStatusSection
        xp={
          data.xp
        }
      />

      <PersonaAndRhythm
        persona={
          data.persona
        }
        rhythm={
          data.rhythm
        }
      />

      <ProfileSummarySection
        insights={
          data.insights
        }
      />

      <AnnualReportSection
        insights={
          data.insights
        }
      />

      <MonthlyActivitySection
        insights={
          data.insights
        }
      />

      <TopSaunasSection
        insights={
          data.insights
        }
      />

      <AchievementsSection
        insights={
          data.insights
        }
        nextAchievement={
          data.nextAchievement
        }
      />

      <ProfileMenu
        onOpenSavedPosts={
          onOpenSavedPosts
        }
        onOpenBlockedUsers={
          onOpenBlockedUsers
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
