import {
  useEffect,
  useState,
} from "react";
import {
  MapPin,
  PenLine,
  Search,
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
};

const MIN_SEARCH_LENGTH =
  1;

const SEARCH_DELAY =
  300;

export function PostStartScreen({
  onSelectSauna,
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
          まず、訪れたサウナ施設を
          選択してください。
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
      </section>

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

      {showInitialState ? (
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
        <div className="post-start-guide">
          <MapPin
            aria-hidden="true"
          />

          <strong>
            施設が見つかりませんでした
          </strong>

          <p>
            施設名を短くしたり、
            エリア名でも検索してみてください。
          </p>
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
        </div>
      ) : null}
    </section>
  );
}
