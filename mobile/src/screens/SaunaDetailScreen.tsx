import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  CalendarDays,
  Car,
  ChevronRight,
  ExternalLink,
  Flame,
  Heart,
  History,
  MapPin,
  MessageCircle,
  Phone,
  Star,
  Utensils,
  UserRound,
  Waves,
  Wind,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  addFavoriteSauna,
  isFavoriteSauna,
  removeFavoriteSauna,
} from "../services/favorite-saunas";
import {
  getCommunityFeed,
  type CommunityPost,
} from "../services/community";
import {
  getSaunaById,
  type Sauna,
} from "../services/saunas";
import {
  saveRecentlyViewedSauna,
} from "../services/recently-viewed-saunas";
import {
  getSaunaVisitHistory,
  type SaunaVisitHistory,
} from "../services/sauna-visit-history";

type SaunaDetailScreenProps = {
  sauna: Sauna;
  userId: string;
  onBack: () => void;
  onCreatePost: () => void;
  onSelectPost: (
    postId: string
  ) => void;
};

const SAUNA_LOG_LIMIT =
  3;

function formatVisitDate(
  value: string
): string {
  const [
    year,
    month,
    day,
  ] =
    value.split(
      "-"
    );

  if (
    !year ||
    !month ||
    !day
  ) {
    return value;
  }

  return `${year}.${month}.${day}`;
}

/**
 * 都道府県・市区町村・住所の
 * 重複を避けた表示用住所を作成します。
 */
function createLocationText(
  sauna: Sauna
): string {
  const address =
    sauna.address?.trim() ??
    "";

  /*
   * addressに完全な住所が登録されている場合は、
   * それを優先して表示します。
   *
   * 例：
   * prefecture: 東京都
   * city: 文京区
   * address: 東京都文京区春日1丁目1-1
   *
   * 表示：
   * 東京都文京区春日1丁目1-1
   */
  if (address) {
    return address;
  }

  /*
   * addressがない場合のみ、
   * 都道府県と市区町村から表示文を作成します。
   */
  return [
    sauna.prefecture,
    sauna.city,
  ]
    .map(
      (value) =>
        value?.trim() ??
        ""
    )
    .filter(Boolean)
    .filter(
      (
        value,
        index,
        values
      ) =>
        values.indexOf(
          value
        ) === index
    )
    .join(" ");
}

export function SaunaDetailScreen({
  sauna,
  userId,
  onBack,
  onCreatePost,
  onSelectPost,
}: SaunaDetailScreenProps) {
  useEffect(() => {
    saveRecentlyViewedSauna({
      id: sauna.id,
      name: sauna.name,
      imageUrl: sauna.image_url,
      prefecture: sauna.prefecture,
      city: sauna.city,
      averageRating: null,
    });
  }, [sauna]);

  /*
   * 検索結果から渡された施設情報を
   * 初期表示に使用します。
   *
   * その後、施設IDから最新の完全な情報を
   * Supabaseより再取得します。
   */
  const [
    displaySauna,
    setDisplaySauna,
  ] =
    useState<Sauna>(
      sauna
    );

  const [
    saunaLoading,
    setSaunaLoading,
  ] =
    useState(false);

  const [
    saunaError,
    setSaunaError,
  ] =
    useState<string | null>(
      null
    );

  const [
    favorite,
    setFavorite,
  ] =
    useState<boolean | null>(
      null
    );

  const [
    favoriteUpdating,
    setFavoriteUpdating,
  ] =
    useState(false);

  const [
    favoriteError,
    setFavoriteError,
  ] =
    useState<string | null>(
      null
    );

  const [
    visitHistory,
    setVisitHistory,
  ] =
    useState<
      SaunaVisitHistory | null
    >(
      null
    );

  const [
    historyLoading,
    setHistoryLoading,
  ] =
    useState(
      false
    );

  const [
    historyError,
    setHistoryError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    saunaLogs,
    setSaunaLogs,
  ] =
    useState<
      CommunityPost[]
    >(
      []
    );

  const [
    saunaLogsLoading,
    setSaunaLogsLoading,
  ] =
    useState(
      false
    );

  const [
    saunaLogsError,
    setSaunaLogsError,
  ] =
    useState<
      string | null
    >(
      null
    );

  /*
   * 詳細画面を開いたときに、
   * 施設IDから完全な施設情報を再取得します。
   */
  useEffect(() => {
    /*
     * 別の施設へ切り替わった場合、
     * まず新しい施設の受け取りデータを表示します。
     */
    setDisplaySauna(
      sauna
    );

    setSaunaError(
      null
    );

    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    async function loadSauna() {
      setSaunaLoading(
        true
      );

      try {
        const latestSauna =
          await getSaunaById(
            client,
            sauna.id
          );

        if (cancelled) {
          return;
        }

        if (latestSauna) {
          setDisplaySauna(
            latestSauna
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          "施設情報を再取得できませんでした。",
          error
        );

        /*
         * 再取得に失敗した場合も、
         * 検索結果から渡された情報で
         * 詳細画面を表示し続けます。
         */
        setSaunaError(
          "最新の施設情報を取得できませんでした。"
        );
      } finally {
        if (!cancelled) {
          setSaunaLoading(
            false
          );
        }
      }
    }

    void loadSauna();

    return () => {
      cancelled =
        true;
    };
  }, [
    sauna,
  ]);

  /*
   * 行きたい状態を取得します。
   */
  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    setFavorite(
      null
    );

    setFavoriteError(
      null
    );

    async function loadFavorite() {
      try {
        const result =
          await isFavoriteSauna(
            client,
            userId,
            sauna.id
          );

        if (cancelled) {
          return;
        }

        setFavorite(
          result
        );
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          error
        );

        setFavorite(
          false
        );

        setFavoriteError(
          "行きたい状態を取得できませんでした。"
        );
      }
    }

    void loadFavorite();

    return () => {
      cancelled =
        true;
    };
  }, [
    sauna.id,
    userId,
  ]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    setSaunaLogs([]);
    setSaunaLogsError(
      null
    );
    setSaunaLogsLoading(
      true
    );

    async function loadSaunaLogs() {
      try {
        const result =
          await getCommunityFeed(
            client,
            userId,
            {
              pageSize:
                SAUNA_LOG_LIMIT,
              saunaId:
                sauna.id,
              excludeCurrentUser:
                true,
            }
          );

        if (!cancelled) {
          setSaunaLogs(
            result.posts
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          error
        );
        setSaunaLogsError(
          "この施設のサ活を表示できませんでした。"
        );
      } finally {
        if (!cancelled) {
          setSaunaLogsLoading(
            false
          );
        }
      }
    }

    void loadSaunaLogs();

    return () => {
      cancelled =
        true;
    };
  }, [
    sauna.id,
    userId,
  ]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

    setVisitHistory(
      null
    );
    setHistoryError(
      null
    );
    setHistoryLoading(
      true
    );

    async function loadVisitHistory() {
      try {
        const result =
          await getSaunaVisitHistory(
            client,
            userId,
            sauna.id
          );

        if (!cancelled) {
          setVisitHistory(
            result
          );
        }
      } catch (error) {
        if (cancelled) {
          return;
        }

        console.error(
          error
        );
        setHistoryError(
          "訪問履歴を表示できませんでした。"
        );
      } finally {
        if (!cancelled) {
          setHistoryLoading(
            false
          );
        }
      }
    }

    void loadVisitHistory();

    return () => {
      cancelled =
        true;
    };
  }, [
    sauna.id,
    userId,
  ]);

  const locationText =
    createLocationText(
      displaySauna
    );

  async function handleFavoriteToggle() {
    if (
      !supabase ||
      favorite === null ||
      favoriteUpdating
    ) {
      return;
    }

    const client =
      supabase;

    const nextFavorite =
      !favorite;

    setFavoriteUpdating(
      true
    );

    setFavoriteError(
      null
    );

    setFavorite(
      nextFavorite
    );

    try {
      if (nextFavorite) {
        await addFavoriteSauna(
          client,
          userId,
          displaySauna.id,
          "sauna_detail"
        );
      } else {
        await removeFavoriteSauna(
          client,
          userId,
          displaySauna.id
        );
      }
    } catch (error) {
      console.error(
        error
      );

      setFavorite(
        !nextFavorite
      );

      setFavoriteError(
        nextFavorite
          ? "行きたいに追加できませんでした。"
          : "行きたいから解除できませんでした。"
      );
    } finally {
      setFavoriteUpdating(
        false
      );
    }
  }

  return (
    <section className="sauna-detail-screen">
      <div className="detail-top-bar">
        <button
          type="button"
          className="detail-back-button"
          onClick={
            onBack
          }
        >
          <ArrowLeft
            size={18}
            aria-hidden="true"
          />

          <span>
            前の画面へ戻る
          </span>
        </button>

        <button
          type="button"
          className={
            favorite
              ? "favorite-button active"
              : "favorite-button"
          }
          onClick={() => {
            void handleFavoriteToggle();
          }}
          disabled={
            favorite === null ||
            favoriteUpdating
          }
          aria-label={
            favorite
              ? "行きたいから解除"
              : "行きたいに追加"
          }
          aria-pressed={
            favorite ??
            false
          }
        >
          <Heart
            size={20}
            fill={
              favorite
                ? "currentColor"
                : "none"
            }
            aria-hidden="true"
          />
        </button>
      </div>

      {displaySauna.image_url ? (
        <div className="detail-hero-image">
          <img
            src={
              displaySauna.image_url
            }
            alt={
              displaySauna.name
            }
          />
        </div>
      ) : (
        <div className="detail-hero-placeholder">
          <span>
            TOTONO
          </span>
        </div>
      )}

      <div className="detail-header">
        <p className="eyebrow">
          Sauna
        </p>

        <h1>
          {displaySauna.name}
        </h1>

        {locationText ? (
          <div className="detail-location">
            <MapPin
              size={17}
              aria-hidden="true"
            />

            <span>
              {locationText}
            </span>
          </div>
        ) : null}

        {saunaLoading ? (
          <p
            className="search-status"
            role="status"
            aria-live="polite"
          >
            施設情報を確認しています...
          </p>
        ) : null}

        {saunaError ? (
          <p
            className="favorite-error"
            role="alert"
          >
            {saunaError}
          </p>
        ) : null}

        {favoriteError ? (
          <p
            className="favorite-error"
            role="alert"
          >
            {favoriteError}
          </p>
        ) : null}
      </div>

      <div className="detail-primary-actions">
        <button
          type="button"
          className="record-sauna-button"
          onClick={
            onCreatePost
          }
        >
          サ活を記録する
        </button>
      </div>

      <div className="detail-section">
        <p className="detail-section-label">
          Facilities
        </p>

        <div className="facility-grid">
          <FacilityItem
            label="サウナ室"
            active={
              displaySauna.has_sauna_room
            }
            icon={
              <Wind />
            }
          />

          <FacilityItem
            label="水風呂"
            active={
              displaySauna.has_cold_bath
            }
            icon={
              <Waves />
            }
          />

          <FacilityItem
            label="外気浴"
            active={
              displaySauna.has_outdoor_air_bath
            }
            icon={
              <Wind />
            }
          />

          <FacilityItem
            label="休憩スペース"
            active={
              displaySauna.has_rest_area
            }
            icon={
              <Waves />
            }
          />

          <FacilityItem
            label="食事"
            active={
              displaySauna.has_restaurant
            }
            icon={
              <Utensils />
            }
          />

          <FacilityItem
            label="駐車場"
            active={
              displaySauna.has_parking
            }
            icon={
              <Car />
            }
          />
        </div>
      </div>

      {historyLoading ? (
        <div
          className="detail-history-loading"
          role="status"
        >
          訪問履歴を確認しています...
        </div>
      ) : null}

      {visitHistory ? (
        <section
          className="detail-section"
          aria-labelledby="detail-history-heading"
        >
          <p className="detail-section-label">
            Your history
          </p>

          <div className="detail-history-card">
            <div className="detail-history-summary">
              <span className="detail-history-icon">
                <History
                  aria-hidden="true"
                />
              </span>

              <div>
                <h2 id="detail-history-heading">
                  あなたは{visitHistory.visitCount}回訪れています
                </h2>

                <p>
                  最終訪問 {formatVisitDate(
                    visitHistory.latestVisitDate
                  )}
                </p>
              </div>
            </div>

            <div className="detail-history-list">
              {visitHistory.recentVisits.map(
                (visit) => (
                  <button
                    key={
                      visit.id
                    }
                    type="button"
                    className="detail-history-entry"
                    onClick={() => {
                      onSelectPost(
                        visit.id
                      );
                    }}
                  >
                    <span className="detail-history-date">
                      <CalendarDays
                        aria-hidden="true"
                      />

                      {formatVisitDate(
                        visit.visitDate
                      )}
                    </span>

                    <span className="detail-history-meta">
                      {visit.setCount}セット

                      <span>
                        <Star
                          aria-hidden="true"
                        />

                        {visit.rating}
                      </span>
                    </span>

                    <ChevronRight
                      aria-hidden="true"
                    />
                  </button>
                )
              )}
            </div>
          </div>
        </section>
      ) : null}

      {historyError ? (
        <p
          className="detail-history-error"
          role="alert"
        >
          {historyError}
        </p>
      ) : null}

      {saunaLogsLoading ? (
        <div
          className="detail-sauna-logs-loading"
          role="status"
        >
          この施設のサ活を確認しています...
        </div>
      ) : null}

      {saunaLogs.length > 0 ? (
        <section
          className="detail-section"
          aria-labelledby="detail-sauna-logs-heading"
        >
          <p className="detail-section-label">
            Sauna logs
          </p>

          <div className="detail-sauna-logs-heading">
            <div>
              <h2 id="detail-sauna-logs-heading">
                この施設のサ活
              </h2>

              <p>
                サウナ好きのリアルな体験
              </p>
            </div>

            <Flame
              aria-hidden="true"
            />
          </div>

          <div className="detail-sauna-logs-list">
            {saunaLogs.map(
              (post) => {
                const authorName =
                  post.author.username
                    ?.trim() ||
                  "TOTONOユーザー";

                const primaryImage =
                  post.images[0]
                    ?.imageUrl ??
                  null;

                return (
                  <button
                    key={
                      post.id
                    }
                    type="button"
                    className="detail-sauna-log-card"
                    onClick={() => {
                      onSelectPost(
                        post.id
                      );
                    }}
                  >
                    <span className="detail-sauna-log-author">
                      <span className="detail-sauna-log-avatar">
                        {post.author.avatarUrl ? (
                          <img
                            src={
                              post.author.avatarUrl
                            }
                            alt=""
                            loading="lazy"
                          />
                        ) : (
                          <UserRound
                            aria-hidden="true"
                          />
                        )}
                      </span>

                      <span>
                        <strong>
                          {authorName}
                        </strong>

                        <small>
                          {formatVisitDate(
                            post.visitDate
                          )}
                        </small>
                      </span>
                    </span>

                    {primaryImage ? (
                      <span className="detail-sauna-log-image">
                        <img
                          src={
                            primaryImage
                          }
                          alt=""
                          loading="lazy"
                        />
                      </span>
                    ) : null}

                    <span className="detail-sauna-log-meta">
                      <span>
                        <Flame
                          aria-hidden="true"
                        />

                        {post.setCount}セット
                      </span>

                      <span>
                        <Star
                          aria-hidden="true"
                        />

                        {post.rating.toFixed(
                          1
                        )}
                      </span>

                      <span>
                        <MessageCircle
                          aria-hidden="true"
                        />

                        {post.commentCount}
                      </span>
                    </span>

                    {post.comment ? (
                      <span className="detail-sauna-log-comment">
                        {post.comment}
                      </span>
                    ) : null}

                    <span className="detail-sauna-log-link">
                      サ活を見る

                      <ChevronRight
                        aria-hidden="true"
                      />
                    </span>
                  </button>
                );
              }
            )}
          </div>
        </section>
      ) : null}

      {saunaLogsError ? (
        <p
          className="detail-sauna-logs-error"
          role="alert"
        >
          {saunaLogsError}
        </p>
      ) : null}

      <div className="detail-section">
        <p className="detail-section-label">
          Information
        </p>

        <div className="detail-info-card">
          {displaySauna.opening_hours ? (
            <InfoRow
              label="営業時間"
              value={
                displaySauna.opening_hours
              }
            />
          ) : null}

          {displaySauna.postal_code ? (
            <InfoRow
              label="郵便番号"
              value={
                displaySauna.postal_code
              }
            />
          ) : null}

          {locationText ? (
            <InfoRow
              label="住所"
              value={
                locationText
              }
            />
          ) : null}

          {displaySauna.phone_number ? (
            <InfoRow
              label="電話番号"
              value={
                displaySauna.phone_number
              }
            />
          ) : null}
        </div>
      </div>

      <div className="detail-actions">
        {displaySauna.phone_number ? (
          <a
            className="detail-action-button"
            href={`tel:${displaySauna.phone_number}`}
          >
            <Phone
              size={18}
              aria-hidden="true"
            />

            <span>
              電話する
            </span>
          </a>
        ) : null}

        {displaySauna.website_url ? (
          <a
            className="detail-action-button"
            href={
              displaySauna.website_url
            }
            target="_blank"
            rel="noreferrer"
          >
            <ExternalLink
              size={18}
              aria-hidden="true"
            />

            <span>
              公式サイト
            </span>
          </a>
        ) : null}
      </div>
    </section>
  );
}

function FacilityItem({
  label,
  active,
  icon,
}: {
  label: string;
  active: boolean | null;
  icon: ReactNode;
}) {
  return (
    <div
      className={
        active === true
          ? "facility-item active"
          : active === null
            ? "facility-item unknown"
            : "facility-item"
      }
    >
      <div className="facility-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>

      {active === null ? (
        <small>未確認</small>
      ) : null}
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="detail-info-row">
      <span className="detail-info-label">
        {label}
      </span>

      <strong>
        {value}
      </strong>
    </div>
  );
}
