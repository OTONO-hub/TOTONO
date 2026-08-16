import {
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowLeft,
  Car,
  ExternalLink,
  Heart,
  MapPin,
  Phone,
  Utensils,
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
import type {
  Sauna,
} from "../services/saunas";

type SaunaDetailScreenProps = {
  sauna: Sauna;
  userId: string;
  onBack: () => void;
  onCreatePost: () => void;
};

export function SaunaDetailScreen({
  sauna,
  userId,
  onBack,
  onCreatePost,
}: SaunaDetailScreenProps) {
  const [
    favorite,
    setFavorite,
  ] = useState<boolean | null>(
    null
  );

  const [
    favoriteUpdating,
    setFavoriteUpdating,
  ] = useState(false);

  const [
    favoriteError,
    setFavoriteError,
  ] = useState<string | null>(
    null
  );

  useEffect(() => {
    if (!supabase) {
      return;
    }

    const client =
      supabase;

    let cancelled =
      false;

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
          "お気に入り状態を取得できませんでした。"
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

  const locationText =
    [
      sauna.prefecture,
      sauna.city,
      sauna.address,
    ]
      .filter(
        (
          value
        ): value is string =>
          Boolean(
            value?.trim()
          )
      )
      .join(" ");

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
          sauna.id
        );
      } else {
        await removeFavoriteSauna(
          client,
          userId,
          sauna.id
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
          ? "お気に入りに追加できませんでした。"
          : "お気に入りを解除できませんでした。"
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
            検索結果へ戻る
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
              ? "お気に入りから解除"
              : "お気に入りに追加"
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

      {sauna.image_url ? (
        <div className="detail-hero-image">
          <img
            src={
              sauna.image_url
            }
            alt={
              sauna.name
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
          {sauna.name}
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

        {favoriteError ? (
          <p className="favorite-error">
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
              sauna.has_sauna_room
            }
            icon={
              <Wind />
            }
          />

          <FacilityItem
            label="水風呂"
            active={
              sauna.has_cold_bath
            }
            icon={
              <Waves />
            }
          />

          <FacilityItem
            label="外気浴"
            active={
              sauna.has_outdoor_air_bath
            }
            icon={
              <Wind />
            }
          />

          <FacilityItem
            label="休憩スペース"
            active={
              sauna.has_rest_area
            }
            icon={
              <Waves />
            }
          />

          <FacilityItem
            label="食事"
            active={
              sauna.has_restaurant
            }
            icon={
              <Utensils />
            }
          />

          <FacilityItem
            label="駐車場"
            active={
              sauna.has_parking
            }
            icon={
              <Car />
            }
          />
        </div>
      </div>

      <div className="detail-section">
        <p className="detail-section-label">
          Information
        </p>

        <div className="detail-info-card">
          {sauna.opening_hours ? (
            <InfoRow
              label="営業時間"
              value={
                sauna.opening_hours
              }
            />
          ) : null}

          {sauna.postal_code ? (
            <InfoRow
              label="郵便番号"
              value={
                sauna.postal_code
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

          {sauna.phone_number ? (
            <InfoRow
              label="電話番号"
              value={
                sauna.phone_number
              }
            />
          ) : null}
        </div>
      </div>

      <div className="detail-actions">
        {sauna.phone_number ? (
          <a
            className="detail-action-button"
            href={`tel:${sauna.phone_number}`}
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

        {sauna.website_url ? (
          <a
            className="detail-action-button"
            href={
              sauna.website_url
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
  active: boolean;
  icon: ReactNode;
}) {
  return (
    <div
      className={
        active
          ? "facility-item active"
          : "facility-item"
      }
    >
      <div className="facility-icon">
        {icon}
      </div>

      <span>
        {label}
      </span>
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
