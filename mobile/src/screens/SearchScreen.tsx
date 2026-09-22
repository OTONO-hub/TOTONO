import {
  useEffect,
  useState,
} from "react";
import {
  Clock3,
  ChevronDown,
  History,
  MapPin,
  Search,
  Trash2,
  Waves,
} from "lucide-react";

import {
  SaunaSubmissionForm,
} from "../components/SaunaSubmissionForm";
import {
  supabase,
} from "../lib/supabase";
import {
  clearRecentlyViewedSaunas,
  getRecentlyViewedSaunas,
  type RecentlyViewedSauna,
} from "../services/recently-viewed-saunas";
import {
  getSaunaById,
  searchSaunas,
  type Sauna,
} from "../services/saunas";

type SearchScreenProps = {
  currentUserId: string;
  active: boolean;
  onSelectSauna: (
    sauna: Sauna
  ) => void;
};

const MIN_SEARCH_LENGTH =
  1;

const SEARCH_DELAY =
  300;

const PREFECTURES = [
  "北海道", "青森県", "岩手県", "宮城県", "秋田県", "山形県", "福島県",
  "茨城県", "栃木県", "群馬県", "埼玉県", "千葉県", "東京都", "神奈川県",
  "新潟県", "富山県", "石川県", "福井県", "山梨県", "長野県", "岐阜県", "静岡県", "愛知県",
  "三重県", "滋賀県", "京都府", "大阪府", "兵庫県", "奈良県", "和歌山県",
  "鳥取県", "島根県", "岡山県", "広島県", "山口県",
  "徳島県", "香川県", "愛媛県", "高知県",
  "福岡県", "佐賀県", "長崎県", "熊本県", "大分県", "宮崎県", "鹿児島県", "沖縄県",
] as const;

export function SearchScreen({
  currentUserId,
  active,
  onSelectSauna,
}: SearchScreenProps) {
  const [
    keyword,
    setKeyword,
  ] = useState("");

  const [
    prefecture,
    setPrefecture,
  ] = useState("");

  const [
    retryCount,
    setRetryCount,
  ] = useState(0);

  const [
    results,
    setResults,
  ] = useState<
    Sauna[]
  >([]);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [recentlyViewed, setRecentlyViewed] = useState<RecentlyViewedSauna[]>([]);
  const [openingRecentId, setOpeningRecentId] = useState<string | null>(null);
  const [recentError, setRecentError] = useState<string | null>(null);

  useEffect(() => {
    if (!active) return;

    const timeoutId = window.setTimeout(() => {
      setRecentlyViewed(getRecentlyViewedSaunas());
      setOpeningRecentId(null);
      setRecentError(null);
    }, 0);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [active]);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const trimmedKeyword =
      keyword.trim();

    if (
      trimmedKeyword.length < MIN_SEARCH_LENGTH &&
      !prefecture
    ) {
      return;
    }

    const authClient =
      supabase;

    let cancelled =
      false;

    const timeoutId =
      window.setTimeout(
        () => {
          void (async () => {
            setLoading(
              true
            );

            setError(
              null
            );

            try {
              const saunas =
                await searchSaunas(
                  authClient,
                  trimmedKeyword,
                  prefecture
                );

              if (
                cancelled
              ) {
                return;
              }

              setResults(
                saunas
              );
            } catch (
              searchError
            ) {
              if (
                cancelled
              ) {
                return;
              }

              console.error(
                searchError
              );

              setResults(
                []
              );

              setError(
                "サウナ施設を検索できませんでした。"
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
          })();
        },
        SEARCH_DELAY
      );

    return () => {
      cancelled =
        true;

      window.clearTimeout(
        timeoutId
      );
    };
  }, [keyword, prefecture, retryCount]);

  function handleKeywordChange(
    value: string
  ) {
    setKeyword(
      value
    );

    if (
      value.trim().length < MIN_SEARCH_LENGTH &&
      !prefecture
    ) {
      setResults(
        []
      );

      setError(
        null
      );

      setLoading(
        false
      );
    }
  }

  function handlePrefectureChange(
    value: string
  ) {
    setPrefecture(value);
    setError(null);

    if (
      !value &&
      keyword.trim().length < MIN_SEARCH_LENGTH
    ) {
      setResults([]);
      setLoading(false);
    }
  }

  function clearSearchConditions() {
    setKeyword("");
    setPrefecture("");
    setResults([]);
    setError(null);
    setLoading(false);
  }

  async function openRecentlyViewedSauna(saunaId: string) {
    if (!supabase || openingRecentId) return;

    setOpeningRecentId(saunaId);
    setRecentError(null);

    try {
      const sauna = await getSaunaById(supabase, saunaId);
      if (!sauna) throw new Error("施設情報が見つかりませんでした。");
      onSelectSauna(sauna);
    } catch {
      setRecentError("施設詳細を開けませんでした。もう一度お試しください。");
      setOpeningRecentId(null);
    }
  }

  function clearHistory() {
    clearRecentlyViewedSaunas();
    setRecentlyViewed([]);
    setRecentError(null);
  }

  const trimmedKeyword =
    keyword.trim();

  const showInitialState =
    trimmedKeyword.length === 0 &&
    !prefecture;

  const showNoResults =
    (trimmedKeyword.length >= MIN_SEARCH_LENGTH || Boolean(prefecture)) &&
    !loading &&
    !error &&
    results.length ===
      0;

  return (
    <section className="search-screen">
      <div className="search-header">
        <p className="eyebrow">
          Discover
        </p>

        <h1>
          サウナを探す
        </h1>

        <p className="lead">
          行きたい施設を検索して、
          次のサウナを見つけましょう。
        </p>
      </div>

      <div className="search-box">
        <Search
          size={20}
          aria-hidden="true"
        />

        <input
          type="search"
          value={keyword}
          onChange={(
            event
          ) => {
            handleKeywordChange(
              event.target.value
            );
          }}
          placeholder="施設名・エリアから探す"
          aria-label="サウナ施設を検索"
          autoComplete="off"
          enterKeyHint="search"
        />
      </div>

      <div className="search-filter-row">
        <label className="search-prefecture-filter">
          <MapPin aria-hidden="true" />
          <select
            value={prefecture}
            onChange={(event) => {
              handlePrefectureChange(event.target.value);
            }}
            aria-label="都道府県で絞り込む"
          >
            <option value="">全国から探す</option>
            {PREFECTURES.map((name) => (
              <option key={name} value={name}>{name}</option>
            ))}
          </select>
          <ChevronDown aria-hidden="true" />
        </label>

        {prefecture ? (
          <button
            type="button"
            className="search-clear-button"
            onClick={clearSearchConditions}
          >
            条件を解除
          </button>
        ) : null}
      </div>

      {loading ? (
        <div className="search-status">
          <p>
            検索しています...
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="search-error-card" role="alert">
          <p>
            {error}
          </p>
          <button
            type="button"
            onClick={() => {
              setRetryCount((count) => count + 1);
            }}
          >
            もう一度試す
          </button>
        </div>
      ) : null}

      {showInitialState ? (
        recentlyViewed.length > 0 ? (
          <section className="recently-viewed-section" aria-labelledby="recently-viewed-heading">
            <div className="recently-viewed-heading">
              <div>
                <p className="eyebrow"><History aria-hidden="true" />Recently Viewed</p>
                <h2 id="recently-viewed-heading">最近見たサウナ</h2>
              </div>
              <button type="button" onClick={clearHistory}>
                <Trash2 aria-hidden="true" />履歴を削除
              </button>
            </div>

            {recentError ? <p className="saved-posts-action-error" role="alert">{recentError}</p> : null}

            <div className="recently-viewed-list">
              {recentlyViewed.map((sauna) => (
                <button
                  type="button"
                  className="recently-viewed-card"
                  key={sauna.id}
                  disabled={openingRecentId === sauna.id}
                  onClick={() => { void openRecentlyViewedSauna(sauna.id); }}
                >
                  {sauna.imageUrl ? (
                    <img src={sauna.imageUrl} alt="" loading="lazy" />
                  ) : (
                    <span className="recently-viewed-placeholder"><Waves aria-hidden="true" /></span>
                  )}
                  <span className="recently-viewed-content">
                    <strong>{sauna.name}</strong>
                    <small><MapPin aria-hidden="true" />{[sauna.prefecture, sauna.city].filter(Boolean).join(" ") || "所在地未登録"}</small>
                    <small><Clock3 aria-hidden="true" />{openingRecentId === sauna.id ? "読み込み中..." : formatViewedAt(sauna.viewedAt)}</small>
                  </span>
                </button>
              ))}
            </div>
          </section>
        ) : (
          <div className="card">
          <strong>
            行きたいサウナを
            探してみましょう
          </strong>

          <p>
            施設名やエリアを
            入力すると検索できます。
          </p>
          </div>
        )
      ) : null}

      {showNoResults ? (
        <div className="card">
          <strong>
            該当する施設が
            見つかりませんでした
          </strong>

          <p>
            検索条件を変えて
            もう一度お試しください。
          </p>

          <button
            type="button"
            className="search-empty-clear-button"
            onClick={clearSearchConditions}
          >
            検索条件を解除
          </button>

          {trimmedKeyword ? (
            <SaunaSubmissionForm
              currentUserId={currentUserId}
              initialName={trimmedKeyword}
            />
          ) : null}
        </div>
      ) : null}

      {results.length >
      0 ? (
        <div className="search-results">
          {results.map(
            (sauna) => {
              const location =
                [
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
                <button
                  key={
                    sauna.id
                  }
                  type="button"
                  className="sauna-result-card"
                  onClick={() => {
                    onSelectSauna(
                      sauna
                    );
                  }}
                >
                  <div className="sauna-result-content">
                    <div className="sauna-result-copy">
                      <strong>
                        {
                          sauna.name
                        }
                      </strong>

                      <span className="sauna-result-location">
                        <MapPin
                          size={
                            15
                          }
                          aria-hidden="true"
                        />

                        {location ||
                          sauna.address ||
                          "所在地未登録"}
                      </span>
                    </div>

                    {sauna.image_url ? (
                      <img
                        src={
                          sauna.image_url
                        }
                        alt=""
                        className="sauna-result-image"
                      />
                    ) : null}
                  </div>
                </button>
              );
            }
          )}
        </div>
      ) : null}
    </section>
  );
}

function formatViewedAt(value: string): string {
  const viewedAt = new Date(value);
  if (Number.isNaN(viewedAt.getTime())) return "最近";
  const minutes = Math.floor((Date.now() - viewedAt.getTime()) / 60_000);
  if (minutes < 1) return "たった今";
  if (minutes < 60) return `${minutes}分前`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}時間前`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "昨日";
  if (days < 7) return `${days}日前`;
  return new Intl.DateTimeFormat("ja-JP", { month: "numeric", day: "numeric" }).format(viewedAt);
}
