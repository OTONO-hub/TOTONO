import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  ChevronRight,
  Flame,
  MapPin,
  RefreshCw,
  Sparkles,
  Star,
} from "lucide-react";

import {
  getJournalData,
  type JournalData,
  type JournalPost,
} from "../services/journal";
import {
  getJournalPage,
  type RecentSaunaActivity,
} from "../services/profile";

type JournalScreenProps = {
  userId: string;
  onSelectPost: (
    postId: string
  ) => void;
};

const JOURNAL_PAGE_SIZE =
  20;

const WEEKDAY_LABELS = [
  "日",
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
];

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

function formatRating(
  rating: number | null
): string {
  return rating ===
    null
    ? "—"
    : rating.toFixed(
        1
      );
}

function JournalSummarySection({
  journalData,
}: {
  journalData:
    JournalData;
}) {
  const {
    summary,
  } =
    journalData;

  return (
    <section
      className="journal-overview-section"
      aria-labelledby="journal-overview-heading"
    >
      <div className="journal-section-heading">
        <div>
          <p className="eyebrow">
            Monthly Overview
          </p>

          <h2 id="journal-overview-heading">
            今月のサ活
          </h2>
        </div>

        <span>
          {summary.monthLabel}
        </span>
      </div>

      <dl className="journal-summary-grid">
        <div className="journal-summary-card">
          <dt>
            サ活回数
          </dt>

          <dd>
            {summary.monthlyVisits}

            <small>
              回
            </small>
          </dd>
        </div>

        <div className="journal-summary-card">
          <dt>
            訪問施設
          </dt>

          <dd>
            {summary.visitedSaunas}

            <small>
              施設
            </small>
          </dd>
        </div>

        <div className="journal-summary-card">
          <dt>
            総セット数
          </dt>

          <dd>
            {summary.totalSets}

            <small>
              セット
            </small>
          </dd>
        </div>

        <div className="journal-summary-card journal-summary-card-accent">
          <dt>
            平均評価
          </dt>

          <dd>
            {formatRating(
              summary.averageRating
            )}

            {summary.averageRating !==
            null ? (
              <small>
                / 5
              </small>
            ) : null}
          </dd>
        </div>
      </dl>
    </section>
  );
}

function JournalCalendar({
  journalData,
}: {
  journalData:
    JournalData;
}) {
  const calendarDays =
    useMemo(
      () => {
        const [
          yearText,
          monthText,
        ] =
          journalData
            .summary
            .yearMonth
            .split(
              "-"
            );

        const year =
          Number(
            yearText
          );

        const month =
          Number(
            monthText
          );

        if (
          !Number.isInteger(
            year
          ) ||
          !Number.isInteger(
            month
          ) ||
          month <
            1 ||
          month >
            12
        ) {
          return [];
        }

        const firstWeekday =
          new Date(
            year,
            month -
              1,
            1
          ).getDay();

        const daysInMonth =
          new Date(
            year,
            month,
            0
          ).getDate();

        const postsByDay =
          new Map<
            number,
            JournalPost[]
          >();

        for (
          const post of
          journalData
            .monthlyPosts
        ) {
          const day =
            Number(
              post.visit_date
                .slice(
                  8,
                  10
                )
            );

          if (
            !Number.isInteger(
              day
            )
          ) {
            continue;
          }

          const currentPosts =
            postsByDay.get(
              day
            ) ??
            [];

          currentPosts.push(
            post
          );

          postsByDay.set(
            day,
            currentPosts
          );
        }

        return [
          ...Array(
            firstWeekday
          ).fill(
            null
          ),

          ...Array.from(
            {
              length:
                daysInMonth,
            },
            (
              _value,
              index
            ) => {
              const day =
                index +
                1;

              return {
                day,

                posts:
                  postsByDay.get(
                    day
                  ) ??
                  [],
              };
            }
          ),
        ];
      },
      [
        journalData,
      ]
    );

  return (
    <section
      className="journal-calendar-section"
      aria-labelledby="journal-calendar-heading"
    >
      <div className="journal-section-heading">
        <div>
          <p className="eyebrow">
            Calendar
          </p>

          <h2 id="journal-calendar-heading">
            サ活カレンダー
          </h2>
        </div>

        <CalendarDays
          aria-hidden="true"
        />
      </div>

      <div className="journal-calendar">
        <div className="journal-calendar-weekdays">
          {WEEKDAY_LABELS.map(
            (
              weekday
            ) => (
              <span
                key={
                  weekday
                }
              >
                {weekday}
              </span>
            )
          )}
        </div>

        <div className="journal-calendar-days">
          {calendarDays.map(
            (
              calendarDay,
              index
            ) =>
              calendarDay ? (
                <div
                  key={
                    calendarDay.day
                  }
                  className={
                    calendarDay
                      .posts
                      .length >
                    0
                      ? "journal-calendar-day recorded"
                      : "journal-calendar-day"
                  }
                  aria-label={
                    calendarDay
                      .posts
                      .length >
                    0
                      ? `${calendarDay.day}日、サ活${calendarDay.posts.length}件`
                      : `${calendarDay.day}日`
                  }
                >
                  <span>
                    {calendarDay.day}
                  </span>

                  {calendarDay
                    .posts
                    .length >
                  0 ? (
                    <i
                      aria-hidden="true"
                    />
                  ) : null}
                </div>
              ) : (
                <div
                  key={`empty-${index}`}
                  className="journal-calendar-day empty"
                  aria-hidden="true"
                />
              )
          )}
        </div>
      </div>
    </section>
  );
}

function RecentEntryCard({
  post,
  onSelectPost,
}: {
  post: JournalPost;
  onSelectPost: (
    postId: string
  ) => void;
}) {
  return (
    <button
      type="button"
      className="journal-recent-entry"
      onClick={() => {
        onSelectPost(
          post.id
        );
      }}
    >
      <div className="journal-recent-date">
        <CalendarDays
          aria-hidden="true"
        />

        <time
          dateTime={
            post.visit_date
          }
        >
          {formatVisitDate(
            post.visit_date
          )}
        </time>
      </div>

      <div className="journal-recent-main">
        <div>
          <h3>
            {post.sauna_name}
          </h3>

          <span>
            {post.set_count}
            セット
          </span>
        </div>

        <div className="journal-recent-rating">
          <Star
            aria-hidden="true"
          />

          {post.rating.toFixed(
            1
          )}
        </div>
      </div>

      {post.comment ? (
        <p>
          {post.comment}
        </p>
      ) : null}

      <span className="journal-recent-link">
        詳細を見る

        <ChevronRight
          aria-hidden="true"
        />
      </span>
    </button>
  );
}

function RecentEntriesSection({
  journalData,
  onSelectPost,
}: {
  journalData:
    JournalData;
  onSelectPost: (
    postId: string
  ) => void;
}) {
  return (
    <section
      className="journal-recent-section"
      aria-labelledby="journal-recent-heading"
    >
      <div className="journal-section-heading">
        <div>
          <p className="eyebrow">
            Recent Entries
          </p>

          <h2 id="journal-recent-heading">
            最近のジャーナル
          </h2>
        </div>
      </div>

      {journalData
        .recentEntries
        .length ===
      0 ? (
        <div className="journal-section-empty">
          <Flame
            aria-hidden="true"
          />

          <strong>
            まだサ活がありません
          </strong>

          <p>
            最初のサ活を記録すると、
            ここに表示されます。
          </p>
        </div>
      ) : (
        <div className="journal-recent-list">
          {journalData
            .recentEntries
            .map(
              (
                post
              ) => (
                <RecentEntryCard
                  key={
                    post.id
                  }
                  post={
                    post
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

function FavoriteSaunasSection({
  journalData,
}: {
  journalData:
    JournalData;
}) {
  return (
    <section
      className="journal-favorites-section"
      aria-labelledby="journal-favorites-heading"
    >
      <div className="journal-section-heading">
        <div>
          <p className="eyebrow">
            Favorite Places
          </p>

          <h2 id="journal-favorites-heading">
            よく行く施設
          </h2>
        </div>

        <Building2
          aria-hidden="true"
        />
      </div>

      {journalData
        .favoriteSaunas
        .length ===
      0 ? (
        <div className="journal-section-empty">
          <Building2
            aria-hidden="true"
          />

          <strong>
            施設の記録は
            まだありません
          </strong>

          <p>
            サ活を記録すると、
            よく行く施設が表示されます。
          </p>
        </div>
      ) : (
        <div className="journal-favorite-list">
          {journalData
            .favoriteSaunas
            .map(
              (
                sauna,
                index
              ) => (
                <article
                  key={
                    sauna.saunaName
                  }
                  className="journal-favorite-card"
                >
                  <span className="journal-favorite-rank">
                    {index +
                      1}
                  </span>

                  <div className="journal-favorite-content">
                    <h3>
                      {sauna.saunaName}
                    </h3>

                    <div className="journal-favorite-meta">
                      <span>
                        訪問
                        <strong>
                          {sauna.visitCount}
                        </strong>
                        回
                      </span>

                      <span>
                        平均
                        <strong>
                          {formatRating(
                            sauna.averageRating
                          )}
                        </strong>
                      </span>
                    </div>
                  </div>
                </article>
              )
            )}
        </div>
      )}
    </section>
  );
}

function JournalActivityCard({
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
              {activity.rating.toFixed(
                1
              )}
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

export function JournalScreen({
  userId,
  onSelectPost,
}: JournalScreenProps) {
  const [
    journalData,
    setJournalData,
  ] =
    useState<
      JournalData | null
    >(
      null
    );

  const [
    activities,
    setActivities,
  ] =
    useState<
      RecentSaunaActivity[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    loadingMore,
    setLoadingMore,
  ] =
    useState(
      false
    );

  const [
    hasMore,
    setHasMore,
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

  useEffect(() => {
    let cancelled =
      false;

    async function loadJournal() {
      try {
        const [
          nextJournalData,
          journalPage,
        ] =
          await Promise.all([
            getJournalData(
              userId,
              4
            ),

            getJournalPage(
              userId,
              {
                pageSize:
                  JOURNAL_PAGE_SIZE,

                offset:
                  0,
              }
            ),
          ]);

        if (cancelled) {
          return;
        }

        setJournalData(
          nextJournalData
        );

        setActivities(
          journalPage.activities
        );

        setHasMore(
          journalPage.hasMore
        );

        setError(
          null
        );
      } catch (
        journalError
      ) {
        if (cancelled) {
          return;
        }

        setError(
          journalError instanceof
            Error
            ? journalError.message
            : "ジャーナルの取得中に問題が発生しました。"
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

    void loadJournal();

    return () => {
      cancelled =
        true;
    };
  }, [
    userId,
    reloadKey,
  ]);

  async function handleLoadMore() {
    if (
      loadingMore ||
      !hasMore
    ) {
      return;
    }

    setLoadingMore(
      true
    );

    setError(
      null
    );

    try {
      const page =
        await getJournalPage(
          userId,
          {
            pageSize:
              JOURNAL_PAGE_SIZE,

            offset:
              activities.length,
          }
        );

      setActivities(
        (
          current
        ) => {
          const existingIds =
            new Set(
              current.map(
                (
                  activity
                ) =>
                  activity.id
              )
            );

          const nextActivities =
            page.activities
              .filter(
                (
                  activity
                ) =>
                  !existingIds.has(
                    activity.id
                  )
              );

          return [
            ...current,
            ...nextActivities,
          ];
        }
      );

      setHasMore(
        page.hasMore
      );
    } catch (
      journalError
    ) {
      setError(
        journalError instanceof
          Error
          ? journalError.message
          : "続きのサ活を取得できませんでした。"
      );
    } finally {
      setLoadingMore(
        false
      );
    }
  }

  function handleRetry() {
    setLoading(
      true
    );

    setError(
      null
    );

    setReloadKey(
      (
        current
      ) =>
        current +
        1
    );
  }

  if (loading) {
    return (
      <section className="journal-screen">
        <div
          className="profile-loading journal-loading"
          role="status"
          aria-live="polite"
        >
          <div className="profile-loading-line profile-loading-line-wide" />

          <div className="profile-loading-line" />

          <p>
            ジャーナルを
            読み込んでいます...
          </p>
        </div>
      </section>
    );
  }

  if (
    error &&
    !journalData
  ) {
    return (
      <section className="journal-screen">
        <div
          className="profile-error journal-error"
          role="alert"
        >
          <strong>
            ジャーナルを
            読み込めませんでした
          </strong>

          <p>
            {error}
          </p>

          <button
            type="button"
            onClick={
              handleRetry
            }
          >
            <RefreshCw
              aria-hidden="true"
            />

            もう一度試す
          </button>
        </div>
      </section>
    );
  }

  if (!journalData) {
    return null;
  }

  return (
    <section className="journal-screen">
      <header className="journal-hero">
        <div className="journal-hero-icon">
          <BookOpen
            aria-hidden="true"
          />
        </div>

        <p className="eyebrow">
          Sauna Journal
        </p>

        <h1>
          {journalData
            .summary
            .monthLabel}
        </h1>

        <div className="journal-reflection">
          <Sparkles
            aria-hidden="true"
          />

          <p>
            {journalData
              .reflectionMessage}
          </p>
        </div>
      </header>

      <JournalSummarySection
        journalData={
          journalData
        }
      />

      <JournalCalendar
        journalData={
          journalData
        }
      />

      <RecentEntriesSection
        journalData={
          journalData
        }
        onSelectPost={
          onSelectPost
        }
      />

      <FavoriteSaunasSection
        journalData={
          journalData
        }
      />

      <section
        className="journal-history-section"
        aria-labelledby="journal-history-heading"
      >
        <div className="journal-section-heading">
          <div>
            <p className="eyebrow">
              All Records
            </p>

            <h2 id="journal-history-heading">
              すべてのサ活
            </h2>
          </div>

          <span>
            {activities.length}
            件表示
          </span>
        </div>

        {activities.length ===
        0 ? (
          <div className="journal-section-empty">
            <Flame
              aria-hidden="true"
            />

            <strong>
              最初のサ活を
              記録してみましょう
            </strong>

            <p>
              記録した施設やセット数、
              写真がここに積み重なります。
            </p>
          </div>
        ) : (
          <div className="profile-activity-list journal-activity-list">
            {activities.map(
              (
                activity
              ) => (
                <JournalActivityCard
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

        {error ? (
          <p
            className="post-submit-error journal-load-more-error"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        {hasMore ? (
          <button
            type="button"
            className="secondary journal-load-more-button"
            onClick={() => {
              void handleLoadMore();
            }}
            disabled={
              loadingMore
            }
          >
            {loadingMore
              ? "読み込んでいます..."
              : "過去のサ活をさらに見る"}
          </button>
        ) : activities.length >
          0 ? (
          <p className="journal-end-message">
            すべてのサ活を表示しました
          </p>
        ) : null}
      </section>
    </section>
  );
}
