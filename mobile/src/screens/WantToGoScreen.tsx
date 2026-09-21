import {
  useCallback,
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  ChevronRight,
  Heart,
  MapPin,
  RefreshCw,
  Trash2,
  Waves,
} from "lucide-react";

import {
  supabase,
} from "../lib/supabase";
import {
  getFavoriteSaunas,
  removeFavoriteSauna,
} from "../services/favorite-saunas";
import type {
  Sauna,
} from "../services/saunas";

type WantToGoScreenProps = {
  userId: string;
  onBack: () => void;
  onSelectSauna: (
    sauna: Sauna
  ) => void;
};

export function WantToGoScreen({
  userId,
  onBack,
  onSelectSauna,
}: WantToGoScreenProps) {
  const [saunas, setSaunas] =
    useState<Sauna[]>([]);
  const [loading, setLoading] =
    useState(true);
  const [error, setError] =
    useState<string | null>(null);
  const [removingId, setRemovingId] =
    useState<string | null>(null);
  const [reloadKey, setReloadKey] =
    useState(0);

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client = supabase;
    let cancelled = false;

    async function loadSaunas() {
      setLoading(true);
      setError(null);

      try {
        const result =
          await getFavoriteSaunas(
            client,
            userId
          );

        if (!cancelled) {
          setSaunas(result);
        }
      } catch (loadError) {
        if (!cancelled) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "行きたいサウナを読み込めませんでした。"
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    void loadSaunas();

    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  const handleRemove = useCallback(
    async (saunaId: string) => {
      if (!supabase || removingId) {
        return;
      }

      setRemovingId(saunaId);
      setError(null);

      try {
        await removeFavoriteSauna(
          supabase,
          userId,
          saunaId
        );

        setSaunas((currentSaunas) =>
          currentSaunas.filter(
            (sauna) => sauna.id !== saunaId
          )
        );
      } catch (removeError) {
        setError(
          removeError instanceof Error
            ? removeError.message
            : "行きたいから解除できませんでした。"
        );
      } finally {
        setRemovingId(null);
      }
    },
    [removingId, userId]
  );

  const displayError =
    supabase
      ? error
      : "Supabaseへ接続できませんでした。";

  return (
    <section className="saved-posts-screen">
      <header className="saved-posts-header">
        <button
          type="button"
          className="detail-back-button"
          onClick={onBack}
        >
          <ArrowLeft aria-hidden="true" />
          プロフィールへ戻る
        </button>

        <p className="eyebrow">
          Want to Go
        </p>
        <h1>行きたいサウナ</h1>
        <p className="lead">
          気になる施設を、次のサ活候補としてまとめています。
        </p>
      </header>

      {displayError && saunas.length > 0 ? (
        <p
          className="saved-posts-action-error"
          role="alert"
        >
          {displayError}
        </p>
      ) : null}

      {supabase && loading ? (
        <div
          className="saved-posts-loading"
          role="status"
          aria-live="polite"
        >
          {[1, 2, 3].map((item) => (
            <div
              key={item}
              className="saved-posts-loading-card"
            >
              <div />
              <span />
              <span />
            </div>
          ))}

          <p>行きたいサウナを読み込んでいます...</p>
        </div>
      ) : displayError && saunas.length === 0 ? (
        <div
          className="saved-posts-error"
          role="alert"
        >
          <strong>
            行きたいサウナを読み込めませんでした
          </strong>
          <p>{displayError}</p>
          <button
            type="button"
            onClick={() => {
              setReloadKey((current) => current + 1);
            }}
          >
            <RefreshCw aria-hidden="true" />
            もう一度試す
          </button>
        </div>
      ) : saunas.length === 0 ? (
        <div className="saved-posts-empty">
          <div className="saved-posts-empty-icon">
            <Heart aria-hidden="true" />
          </div>
          <strong>
            行きたいサウナはまだありません
          </strong>
          <p>
            気になるサウナを見つけて、次のサ活候補に追加してみましょう。
          </p>
        </div>
      ) : (
        <div className="saved-posts-list">
          {saunas.map((sauna) => {
            const location = [
              sauna.prefecture,
              sauna.city,
            ]
              .filter(Boolean)
              .join(" ");

            return (
              <article
                key={sauna.id}
                className="saved-post-card"
              >
                <button
                  type="button"
                  className="saved-post-main"
                  onClick={() => {
                    onSelectSauna(sauna);
                  }}
                  aria-label={`${sauna.name}の施設詳細を見る`}
                >
                  {sauna.image_url ? (
                    <div className="saved-post-image">
                      <img
                        src={sauna.image_url}
                        alt={`${sauna.name}の施設画像`}
                        loading="lazy"
                      />
                    </div>
                  ) : (
                    <div className="saved-post-image saved-post-image-placeholder">
                      <Waves aria-hidden="true" />
                    </div>
                  )}

                  <div className="saved-post-content">
                    <div className="saved-post-title">
                      <MapPin aria-hidden="true" />
                      <h2>{sauna.name}</h2>
                    </div>

                    <div className="saved-post-meta">
                      <span>
                        <MapPin aria-hidden="true" />
                        {location || "所在地未登録"}
                      </span>
                    </div>

                    <span className="saved-post-detail-link">
                      施設詳細を見る
                      <ChevronRight aria-hidden="true" />
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  className="saved-post-remove"
                  disabled={removingId === sauna.id}
                  onClick={() => {
                    void handleRemove(sauna.id);
                  }}
                >
                  <Trash2 aria-hidden="true" />
                  {removingId === sauna.id
                    ? "解除中..."
                    : "行きたいから解除"}
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
