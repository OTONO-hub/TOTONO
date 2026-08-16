import {
  useEffect,
  useState,
} from "react";
import {
  MapPin,
  Search,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  searchSaunas,
  type Sauna,
} from "../services/saunas";

type SearchScreenProps = {
  onSelectSauna: (
    sauna: Sauna
  ) => void;
};

const MIN_SEARCH_LENGTH =
  1;

const SEARCH_DELAY =
  300;

export function SearchScreen({
  onSelectSauna,
}: SearchScreenProps) {
  const [
    keyword,
    setKeyword,
  ] = useState("");

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
                  trimmedKeyword
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
  }, [keyword]);

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

      {loading ? (
        <div className="search-status">
          <p>
            検索しています...
          </p>
        </div>
      ) : null}

      {error ? (
        <div className="search-status">
          <p>
            {error}
          </p>
        </div>
      ) : null}

      {showInitialState ? (
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
      ) : null}

      {showNoResults ? (
        <div className="card">
          <strong>
            該当する施設が
            見つかりませんでした
          </strong>

          <p>
            別の施設名や
            エリア名でも
            検索してみてください。
          </p>
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
