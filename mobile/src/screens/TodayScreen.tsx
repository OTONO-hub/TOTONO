import {
  useEffect,
  useState,
} from "react";
import {
  CalendarDays,
  ChevronRight,
  Flame,
  Heart,
  MapPin,
  RefreshCw,
  Search,
  Star,
} from "lucide-react";

import type {
  Sauna,
} from "../services/saunas";
import {
  getTodayData,
  type TodayData,
  type TodayRecentActivity,
} from "../services/today";

type TodayScreenProps = {
  userId: string;
  onGoSearch:
    () => void;
  onSelectSauna:
    (
      sauna: Sauna
    ) => void;
  onSelectPost:
    (
      postId: string
    ) => void;
};

function getTodayLabel(): string {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone:
        "Asia/Tokyo",
      month: "long",
      day: "numeric",
      weekday: "long",
    }
  ).format(
    new Date()
  );
}

function getGreeting(): string {
  const hourText =
    new Intl.DateTimeFormat(
      "en-GB",
      {
        timeZone:
          "Asia/Tokyo",
        hour: "2-digit",
        hour12: false,
      }
    ).format(
      new Date()
    );

  const hour =
    Number.parseInt(
      hourText,
      10
    );

  if (hour < 5) {
    return "今夜も、おつかれさまです。";
  }

  if (hour < 11) {
    return "おはようございます。";
  }

  if (hour < 17) {
    return "今日も、おつかれさまです。";
  }

  return "今夜は、どこで整いますか？";
}

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
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(
    date
  );
}

function getSaunaLocation(
  sauna: Sauna
): string {
  const location = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(
      (
        value
      ): value is string =>
        Boolean(
          value?.trim()
        )
    )
    .join("");

  return (
    location ||
    sauna.address ||
    "所在地情報なし"
  );
}

function TodayLoadingState() {
  return (
    <div
      className="today-loading"
      role="status"
      aria-live="polite"
    >
      <div className="today-loading-hero" />

      <div className="today-loading-card" />

      <div className="today-loading-row">
        <div />
        <div />
      </div>

      <p>
        今日のサウナライフを
        準備しています...
      </p>
    </div>
  );
}

function TodayErrorState({
  message,
  onRetry,
  onGoSearch,
}: {
  message: string;
  onRetry:
    () => void;
  onGoSearch:
    () => void;
}) {
  return (
    <div
      className="today-error"
      role="alert"
    >
      <strong>
        Todayを
        読み込めませんでした
      </strong>

      <p>
        {message}
      </p>

      <div className="today-error-actions">
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

        <button
          type="button"
          className="secondary"
          onClick={
            onGoSearch
          }
        >
          <Search
            aria-hidden="true"
          />

          サウナを探す
        </button>
      </div>
    </div>
  );
}

function TodayHero({
  onGoSearch,
}: {
  onGoSearch:
    () => void;
}) {
  return (
    <header className="today-hero">
      <p className="eyebrow">
        {getTodayLabel()}
      </p>

      <p className="today-greeting">
        {getGreeting()}
      </p>

      <h1>
        今日は、
        <br />
        どこで整いますか？
      </h1>

      <p className="lead">
        気になる施設を見つけて、
        今日のサウナライフを
        はじめましょう。
      </p>

      <button
        type="button"
        className="today-search-button"
        onClick={
          onGoSearch
        }
      >
        <Search
          aria-hidden="true"
        />

        サウナを探す

        <ChevronRight
          aria-hidden="true"
        />
      </button>
    </header>
  );
}

function RecentActivitySection({
  activity,
  onGoSearch,
  onSelectPost,
}: {
  activity:
    | TodayRecentActivity
    | null;
  onGoSearch:
    () => void;
  onSelectPost:
    (
      postId: string
    ) => void;
}) {
  return (
    <section
      className="today-section"
      aria-labelledby="today-recent-heading"
    >
      <div className="today-section-heading">
        <div>
          <p className="eyebrow">
            Recent Activity
          </p>

          <h2 id="today-recent-heading">
            最近のサ活
          </h2>
        </div>
      </div>

      {activity ? (
        <button
          type="button"
          className="today-recent-card today-recent-card-button"
          onClick={() => {
            onSelectPost(
              activity.id
            );
          }}
          aria-label={`${activity.saunaName}でのサ活詳細を見る`}
        >
          {activity.imageUrl ? (
            <div className="today-recent-image">
              <img
                src={
                  activity.imageUrl
                }
                alt={`${activity.saunaName}でのサ活`}
              />
            </div>
          ) : (
            <div
              className="today-recent-image today-recent-placeholder"
              aria-hidden="true"
            >
              <Flame />
            </div>
          )}

          <div className="today-recent-content">
            <div className="today-recent-header">
              <div>
                <p className="today-recent-label">
                  Last Sauna
                </p>

                <h3>
                  {activity.saunaName}
                </h3>
              </div>

              <div
                className="today-recent-rating"
                aria-label={`評価 ${activity.rating}点`}
              >
                <Star
                  aria-hidden="true"
                />

                {activity.rating}
              </div>
            </div>

            <div className="today-recent-meta">
              <span>
                <CalendarDays
                  aria-hidden="true"
                />

                {formatVisitDate(
                  activity.visitDate
                )}
              </span>

              <span>
                <Flame
                  aria-hidden="true"
                />

                {activity.setCount}
                セット
              </span>
            </div>

            {activity.comment ? (
              <p className="today-recent-comment">
                {activity.comment}
              </p>
            ) : null}

            <span className="today-recent-detail-link">
              サ活の詳細を見る

              <ChevronRight
                aria-hidden="true"
              />
            </span>
          </div>
        </button>
      ) : (
        <div className="today-empty-activity">
          <div className="today-empty-icon">
            <Flame
              aria-hidden="true"
            />
          </div>

          <strong>
            まだサ活の記録がありません
          </strong>

          <p>
            行きたい施設を見つけて、
            最初のサ活を残してみましょう。
          </p>

          <button
            type="button"
            onClick={
              onGoSearch
            }
          >
            サウナを探す
          </button>
        </div>
      )}
    </section>
  );
}

function FavoriteSaunaCard({
  sauna,
  onSelect,
}: {
  sauna: Sauna;
  onSelect:
    (
      sauna: Sauna
    ) => void;
}) {
  return (
    <button
      type="button"
      className="today-favorite-card"
      onClick={() => {
        onSelect(
          sauna
        );
      }}
      aria-label={`${sauna.name}の施設詳細を見る`}
    >
      <div className="today-favorite-image">
        {sauna.image_url ? (
          <img
            src={
              sauna.image_url
            }
            alt=""
            loading="lazy"
          />
        ) : (
          <div className="today-favorite-placeholder">
            <Flame
              aria-hidden="true"
            />
          </div>
        )}

        <span className="today-favorite-badge">
          <Heart
            aria-hidden="true"
          />

          Favorite
        </span>
      </div>

      <div className="today-favorite-content">
        <strong>
          {sauna.name}
        </strong>

        <span className="today-favorite-location">
          <MapPin
            aria-hidden="true"
          />

          {getSaunaLocation(
            sauna
          )}
        </span>
      </div>
    </button>
  );
}

function FavoriteSaunasSection({
  saunas,
  onGoSearch,
  onSelectSauna,
}: {
  saunas: Sauna[];
  onGoSearch:
    () => void;
  onSelectSauna:
    (
      sauna: Sauna
    ) => void;
}) {
  return (
    <section
      className="today-section"
      aria-labelledby="today-favorites-heading"
    >
      <div className="today-section-heading">
        <div>
          <p className="eyebrow">
            Favorites
          </p>

          <h2 id="today-favorites-heading">
            お気に入り施設
          </h2>
        </div>

        <button
          type="button"
          className="today-section-link"
          onClick={
            onGoSearch
          }
        >
          施設を探す

          <ChevronRight
            aria-hidden="true"
          />
        </button>
      </div>

      {saunas.length >
      0 ? (
        <div className="today-favorite-list">
          {saunas.map(
            (
              sauna
            ) => (
              <FavoriteSaunaCard
                key={
                  sauna.id
                }
                sauna={
                  sauna
                }
                onSelect={
                  onSelectSauna
                }
              />
            )
          )}
        </div>
      ) : (
        <div className="today-empty-favorites">
          <Heart
            aria-hidden="true"
          />

          <div>
            <strong>
              行きたい施設を
              保存しましょう
            </strong>

            <p>
              お気に入りに追加した施設が、
              Todayからすぐに見られます。
            </p>
          </div>

          <button
            type="button"
            onClick={
              onGoSearch
            }
          >
            探してみる
          </button>
        </div>
      )}
    </section>
  );
}

function TodayNextAction({
  onGoSearch,
}: {
  onGoSearch:
    () => void;
}) {
  return (
    <section className="today-next-action">
      <div className="today-next-action-icon">
        <Flame
          aria-hidden="true"
        />
      </div>

      <div>
        <p className="eyebrow">
          Next Sauna
        </p>

        <h2>
          次の整いを、
          見つけよう。
        </h2>

        <p>
          全国のサウナ施設から、
          今日の気分に合う場所を
          探せます。
        </p>
      </div>

      <button
        type="button"
        onClick={
          onGoSearch
        }
      >
        サウナを探す

        <ChevronRight
          aria-hidden="true"
        />
      </button>
    </section>
  );
}

export function TodayScreen({
  userId,
  onGoSearch,
  onSelectSauna,
  onSelectPost,
}: TodayScreenProps) {
  const [
    todayData,
    setTodayData,
  ] =
    useState<
      TodayData | null
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

  useEffect(() => {
    let cancelled =
      false;

    async function loadTodayData() {
      setLoading(
        true
      );

      setError(
        null
      );

      try {
        const nextTodayData =
          await getTodayData(
            userId
          );

        if (cancelled) {
          return;
        }

        setTodayData(
          nextTodayData
        );
      } catch (
        todayError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          todayError instanceof
            Error
            ? todayError.message
            : "Todayの取得中に問題が発生しました。"
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

    void loadTodayData();

    return () => {
      cancelled =
        true;
    };
  }, [
    userId,
    reloadKey,
  ]);

  if (loading) {
    return (
      <section className="today-screen">
        <TodayLoadingState />
      </section>
    );
  }

  if (
    error ||
    !todayData
  ) {
    return (
      <section className="today-screen">
        <TodayErrorState
          message={
            error ??
            "Todayのデータが見つかりません。"
          }
          onRetry={() => {
            setReloadKey(
              (
                currentKey
              ) =>
                currentKey +
                1
            );
          }}
          onGoSearch={
            onGoSearch
          }
        />
      </section>
    );
  }

  return (
    <section className="today-screen">
      <TodayHero
        onGoSearch={
          onGoSearch
        }
      />

      <RecentActivitySection
        activity={
          todayData.recentActivity
        }
        onGoSearch={
          onGoSearch
        }
        onSelectPost={
          onSelectPost
        }
      />

      <FavoriteSaunasSection
        saunas={
          todayData.favoriteSaunas
        }
        onGoSearch={
          onGoSearch
        }
        onSelectSauna={
          onSelectSauna
        }
      />

      <TodayNextAction
        onGoSearch={
          onGoSearch
        }
      />
    </section>
  );
}
