import {
  useEffect,
  useState,
} from "react";
import {
  Building2,
  ChevronRight,
  MapPin,
  PenLine,
  Plus,
  Search,
  X,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  searchSaunas,
  type Sauna,
} from "../services/saunas";

type PostStartScreenProps = {
  onSelectSauna: (
    sauna: Sauna
  ) => void;

  onSelectManualSauna?: (
    saunaName: string
  ) => void;
};

const MIN_SEARCH_LENGTH =
  1;

const SEARCH_DELAY =
  300;

const MAX_MANUAL_NAME_LENGTH =
  100;

export function PostStartScreen({
  onSelectSauna,
  onSelectManualSauna,
}: PostStartScreenProps) {
  const [
    keyword,
    setKeyword,
  ] =
    useState("");

  const [
    results,
    setResults,
  ] =
    useState<
      Sauna[]
    >([]);

  const [
    loading,
    setLoading,
  ] =
    useState(false);

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(null);

  const [
    showingManualEntry,
    setShowingManualEntry,
  ] =
    useState(false);

  const [
    manualSaunaName,
    setManualSaunaName,
  ] =
    useState("");

  const [
    manualEntryError,
    setManualEntryError,
  ] =
    useState<
      string | null
    >(null);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const trimmedKeyword =
      keyword.trim();

    if (
      trimmedKeyword.length <
      MIN_SEARCH_LENGTH
    ) {
      return;
    }

    const client =
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
                  client,
                  trimmedKeyword
                );

              if (cancelled) {
                return;
              }

              setResults(
                saunas
              );
            } catch (
              searchError
            ) {
              if (cancelled) {
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
  }, [
    keyword,
  ]);

  function handleKeywordChange(
    value: string
  ) {
    setKeyword(
      value
    );

    if (
      value.trim().length <
      MIN_SEARCH_LENGTH
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

  function openManualEntry() {
    const suggestedName =
      keyword
        .trim()
        .slice(
          0,
          MAX_MANUAL_NAME_LENGTH
        );

    setManualSaunaName(
      suggestedName
    );

    setManualEntryError(
      null
    );

    setShowingManualEntry(
      true
    );
  }

  function closeManualEntry() {
    setShowingManualEntry(
      false
    );

    setManualEntryError(
      null
    );
  }

  function handleManualSaunaSubmit() {
    const normalizedSaunaName =
      manualSaunaName
        .trim()
        .replace(
          /\s+/g,
          " "
        );

    if (
      !normalizedSaunaName
    ) {
      setManualEntryError(
        "施設名を入力してください。"
      );

      return;
    }

    if (
      normalizedSaunaName.length >
      MAX_MANUAL_NAME_LENGTH
    ) {
      setManualEntryError(
        `施設名は${MAX_MANUAL_NAME_LENGTH}文字以内で入力してください。`
      );

      return;
    }

    if (
      !onSelectManualSauna
    ) {
      setManualEntryError(
        "未登録施設の投稿準備が完了していません。"
      );

      return;
    }

    setManualEntryError(
      null
    );

    onSelectManualSauna(
      normalizedSaunaName
    );
  }

  const trimmedKeyword =
    keyword.trim();

  const showInitialState =
    trimmedKeyword.length ===
    0;

  const showNoResults =
    trimmedKeyword.length >=
      MIN_SEARCH_LENGTH &&
    !loading &&
    !error &&
    results.length ===
      0;

  return (
    <section className="post-start-screen">
      <header className="post-start-header">
        <div className="post-start-header-icon">
          <PenLine
            aria-hidden="true"
          />
        </div>

        <p className="eyebrow">
          New Sauna Journal
        </p>

        <h1>
          サ活を記録する
        </h1>

        <p className="lead">
          訪れたサウナを検索するか、
          施設名を直接入力して記録できます。
        </p>
      </header>

      <section className="post-start-step">
        <div className="post-start-step-heading">
          <span>
            1
          </span>

          <div>
            <strong>
              施設を選択
            </strong>

            <small>
              施設名やエリアから検索できます
            </small>
          </div>
        </div>

        <div className="search-box post-start-search-box">
          <Search
            size={20}
            aria-hidden="true"
          />

          <input
            type="search"
            value={
              keyword
            }
            onChange={(
              event
            ) => {
              handleKeywordChange(
                event.target
                  .value
              );
            }}
            placeholder="訪れた施設を検索"
            aria-label="投稿するサウナ施設を検索"
            autoComplete="off"
            enterKeyHint="search"
            autoFocus
          />
        </div>

        <div className="post-start-manual-divider">
          <span>
            または
          </span>
        </div>

        <button
          type="button"
          className="post-start-manual-button"
          onClick={
            openManualEntry
          }
        >
          <span className="post-start-manual-button-icon">
            <Plus
              aria-hidden="true"
            />
          </span>

          <span className="post-start-manual-button-copy">
            <strong>
              登録されていない施設を入力
            </strong>

            <small>
              検索にないサウナでも投稿できます
            </small>
          </span>

          <ChevronRight
            className="post-start-manual-button-arrow"
            aria-hidden="true"
          />
        </button>
      </section>

      {showingManualEntry ? (
        <section
          className="post-start-manual-panel"
          aria-labelledby="manual-sauna-title"
        >
          <div className="post-start-manual-panel-header">
            <div>
              <p className="eyebrow">
                Manual Entry
              </p>

              <h2 id="manual-sauna-title">
                施設名を入力
              </h2>
            </div>

            <button
              type="button"
              className="post-start-manual-close"
              onClick={
                closeManualEntry
              }
              aria-label="手入力を閉じる"
            >
              <X
                aria-hidden="true"
              />
            </button>
          </div>

          <p className="post-start-manual-description">
            施設データに登録されていない
            サウナでも、施設名を入力して
            サ活を記録できます。
          </p>

          <label
            className="post-start-manual-label"
            htmlFor="manual-sauna-name"
          >
            施設名
          </label>

          <div className="post-start-manual-input">
            <Building2
              aria-hidden="true"
            />

            <input
              id="manual-sauna-name"
              type="text"
              value={
                manualSaunaName
              }
              onChange={(
                event
              ) => {
                setManualSaunaName(
                  event.target
                    .value
                    .slice(
                      0,
                      MAX_MANUAL_NAME_LENGTH
                    )
                );

                setManualEntryError(
                  null
                );
              }}
              placeholder="例：○○温泉"
              maxLength={
                MAX_MANUAL_NAME_LENGTH
              }
              autoComplete="organization"
              enterKeyHint="done"
              autoFocus
              onKeyDown={(
                event
              ) => {
                if (
                  event.key ===
                  "Enter"
                ) {
                  event.preventDefault();

                  handleManualSaunaSubmit();
                }
              }}
            />
          </div>

          <div className="post-start-manual-meta">
            <span>
              サウナ施設の正式名称を
              入力してください
            </span>

            <span>
              {manualSaunaName.length}
              /{MAX_MANUAL_NAME_LENGTH}
            </span>
          </div>

          {manualEntryError ? (
            <p
              className="post-start-manual-error"
              role="alert"
            >
              {manualEntryError}
            </p>
          ) : null}

          <button
            type="button"
            className="post-start-manual-submit"
            onClick={
              handleManualSaunaSubmit
            }
            disabled={
              !manualSaunaName.trim()
            }
          >
            この施設名で投稿を続ける

            <ChevronRight
              aria-hidden="true"
            />
          </button>

          <p className="post-start-manual-notice">
            手入力した施設は施設詳細や
            お気に入りの対象にはなりませんが、
            投稿とジャーナルには保存されます。
          </p>
        </section>
      ) : null}

      {loading ? (
        <div
          className="search-status"
          role="status"
          aria-live="polite"
        >
          <p>
            施設を検索しています...
          </p>
        </div>
      ) : null}

      {error ? (
        <div
          className="search-status"
          role="alert"
        >
          <p>
            {error}
          </p>
        </div>
      ) : null}

      {showInitialState &&
      !showingManualEntry ? (
        <div className="post-start-guide">
          <Search
            aria-hidden="true"
          />

          <strong>
            訪れたサウナを
            検索してください
          </strong>

          <p>
            施設を選択すると、
            写真・セット数・評価・感想を
            入力できます。
          </p>
        </div>
      ) : null}

      {showNoResults ? (
        <div className="post-start-guide post-start-no-results">
          <MapPin
            aria-hidden="true"
          />

          <strong>
            施設が見つかりませんでした
          </strong>

          <p>
            検索条件を変えるか、
            登録されていない施設として
            直接入力できます。
          </p>

          <button
            type="button"
            onClick={
              openManualEntry
            }
          >
            「{trimmedKeyword}」で投稿する
          </button>
        </div>
      ) : null}

      {results.length >
      0 ? (
        <div className="post-start-results">
          <p className="post-start-results-label">
            投稿する施設を選択
          </p>

          {results.map(
            (
              sauna
            ) => {
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
                  className="post-start-sauna-card"
                  onClick={() => {
                    onSelectSauna(
                      sauna
                    );
                  }}
                >
                  {sauna.image_url ? (
                    <img
                      src={
                        sauna.image_url
                      }
                      alt=""
                    />
                  ) : (
                    <span className="post-start-sauna-placeholder">
                      <MapPin
                        aria-hidden="true"
                      />
                    </span>
                  )}

                  <span className="post-start-sauna-copy">
                    <strong>
                      {sauna.name}
                    </strong>

                    <small>
                      <MapPin
                        aria-hidden="true"
                      />

                      {location ||
                        sauna.address ||
                        "所在地未登録"}
                    </small>
                  </span>

                  <span className="post-start-select-label">
                    選択
                  </span>
                </button>
              );
            }
          )}

          <button
            type="button"
            className="post-start-results-manual-button"
            onClick={
              openManualEntry
            }
          >
            <Plus
              aria-hidden="true"
            />

            検索結果にない施設を入力する
          </button>
        </div>
      ) : null}
    </section>
  );
}
