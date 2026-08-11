import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock3,
  ExternalLink,
  Globe2,
  Heart,
  MapPinned,
  MapPin,
  PenLine,
  Phone,
  Star,
} from "lucide-react";

import { FavoriteSaunaButton } from "@/components/saunas/FavoriteSaunaButton";

type SaunaOverviewProps = {
  saunaId: string;
  name: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
  userId: string | null;
  initialFavorite: boolean;
  averageRating: number | null;
  ratingCount: number;
  postCount: number;
  favoriteCount: number;
  openingHours: string | null;
  phoneNumber: string | null;
  websiteUrl: string | null;
  postalCode: string | null;
};

export function SaunaOverview({
  saunaId,
  name,
  locationText,
  latitude,
  longitude,
  userId,
  initialFavorite,
  averageRating,
  ratingCount,
  postCount,
  favoriteCount,
  openingHours,
  phoneNumber,
  websiteUrl,
  postalCode,
}: SaunaOverviewProps) {
  const normalizedWebsiteUrl =
    normalizeExternalUrl(websiteUrl);

  const hasFacilityInformation =
    Boolean(openingHours) ||
    Boolean(phoneNumber) ||
    Boolean(normalizedWebsiteUrl) ||
    Boolean(postalCode);

  const googleMapsUrl = createGoogleMapsUrl({
    name,
    locationText,
    latitude,
    longitude,
  });

  return (
    <div
      className="
        flex
        h-full
        flex-col
        bg-white/95
        p-6
        sm:p-8
        lg:p-8
        xl:p-10
      "
    >
      <header>
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
            text-[#3e3a3a]/40
          "
        >
          Plan Your Visit
        </p>

        <h2
          className="
            mt-2
            text-2xl
            font-semibold
            tracking-[-0.04em]
            text-[#3e3a3a]
          "
        >
          今日、この施設へ
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-[#3e3a3a]/58
          "
        >
          ルートや施設情報を確認して、
          次のサウナ時間を計画しましょう。
        </p>
      </header>

      <section
        aria-labelledby="sauna-actions-title"
        className="mt-7"
      >
        <h3
          id="sauna-actions-title"
          className="sr-only"
        >
          施設に関する操作
        </h3>

        <div className="
            grid
            gap-3
            sm:grid-cols-2
            lg:grid-cols-1
          ">
          {googleMapsUrl && (
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${name}までのルートをGoogleマップで開く`}
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#fdd000]
                px-6
                py-3
                text-sm
                font-semibold
                text-[#3e3a3a]
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3e3a3a]
                focus-visible:ring-offset-2
                active:translate-y-0
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            >
              <MapPinned
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Googleマップでルートを見る

              <ExternalLink
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </a>
          )}

          <div className="sm:col-span-2 lg:col-span-1">
            <FavoriteSaunaButton
              saunaId={saunaId}
              userId={userId}
              initialFavorite={initialFavorite}
            />
          </div>

          <Link
            href={`/posts/new?sauna_id=${saunaId}`}
            className="
              inline-flex
              min-h-12
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#3e3a3a]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              shadow-sm
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:bg-[#3e3a3a]/88
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#3e3a3a]
              focus-visible:ring-offset-2
              active:translate-y-0
              motion-reduce:transform-none
              motion-reduce:transition-none
            "
          >
            <PenLine
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            この施設で投稿する
          </Link>
        </div>
      </section>

      <section
        aria-labelledby="sauna-metrics-title"
        className="
          mt-8
          border-t
          border-[#3e3a3a]/8
          pt-8
        "
      >
        <div className="flex items-end justify-between gap-4">
          <div>
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.2em]
                text-[#3e3a3a]/40
              "
            >
              Community
            </p>

            <h3
              id="sauna-metrics-title"
              className="
                mt-1.5
                text-lg
                font-semibold
                tracking-[-0.03em]
                text-[#3e3a3a]
              "
            >
              みんなのサ活データ
            </h3>
          </div>
        </div>

        <div
          className="
            mt-5
            grid
            grid-cols-3
            gap-3
          "
        >
          <CompactMetricCard
            icon={
              <Star
                className="
                  size-4
                  fill-[#fdd000]
                  text-[#fdd000]
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            value={
              averageRating !== null
                ? averageRating.toFixed(1)
                : "—"
            }
            label={
              ratingCount > 0
                ? `${ratingCount}件`
                : "未評価"
            }
          />

          <CompactMetricCard
            icon={
              <BookOpen
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            value={postCount.toString()}
            label="サ活"
          />

          <CompactMetricCard
            icon={
              <Heart
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            value={favoriteCount.toString()}
            label="保存"
          />
        </div>
      </section>

      <section
        aria-labelledby="facility-information-title"
        className="
          mt-8
          border-t
          border-[#3e3a3a]/8
          pt-8
        "
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.2em]
            text-[#3e3a3a]/40
          "
        >
          Information
        </p>

        <h3
          id="facility-information-title"
          className="
            mt-1.5
            text-lg
            font-semibold
            tracking-[-0.03em]
            text-[#3e3a3a]
          "
        >
          訪問前の施設情報
        </h3>

        {hasFacilityInformation ? (
          <div className="mt-5 grid gap-3">
            {openingHours && (
              <FacilityInformation
                icon={
                  <Clock3
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
                label="営業時間"
                value={openingHours}
              />
            )}

            {phoneNumber && (
              <FacilityInformation
                icon={
                  <Phone
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
                label="電話番号"
                value={phoneNumber}
                href={`tel:${phoneNumber}`}
              />
            )}

            {normalizedWebsiteUrl && (
              <FacilityInformation
                icon={
                  <Globe2
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
                label="公式サイト"
                value="公式サイトを見る"
                href={normalizedWebsiteUrl}
                external
              />
            )}

            {postalCode && (
              <FacilityInformation
                icon={
                  <MapPin
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
                label="郵便番号"
                value={`〒${postalCode}`}
              />
            )}
          </div>
        ) : (
          <div
            className="
              mt-5
              rounded-[1.5rem]
              border
              border-dashed
              border-[#3e3a3a]/15
              bg-[#e6e5ef]/25
              px-5
              py-8
              text-center
            "
          >
            <p
              className="
                text-sm
                leading-6
                text-[#3e3a3a]/50
              "
            >
              施設情報はまだ登録されていません。
            </p>
          </div>
        )}
      </section>

      <p
        className="
          mt-auto
          pt-7
          text-xs
          leading-6
          text-[#3e3a3a]/42
        "
      >
        ※ 営業時間などは変更される場合があります。
        訪問前に公式情報もご確認ください。
      </p>
    </div>
  );
}

type GoogleMapsUrlInput = {
  name: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
};

function createGoogleMapsUrl({
  name,
  locationText,
  latitude,
  longitude,
}: GoogleMapsUrlInput) {
  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const destination = hasCoordinates
    ? `${latitude},${longitude}`
    : [name, locationText]
        .filter(
          (value) => value.trim().length > 0
        )
        .join(" ");

  if (!destination) {
    return null;
  }

  const searchParams = new URLSearchParams({
    api: "1",
    destination,
    travelmode: "driving",
  });

  return `https://www.google.com/maps/dir/?${searchParams.toString()}`;
}

type CompactMetricCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

function CompactMetricCard({
  icon,
  value,
  label,
}: CompactMetricCardProps) {
  return (
    <div
      className="
        min-w-0
        rounded-[1.25rem]
        border
        border-[#3e3a3a]/6
        bg-linear-to-br
        from-white
        to-[#e6e5ef]/45
        px-3
        py-4
        shadow-[0_10px_24px_rgba(62,58,58,0.04)]
        text-center
      "
    >
      <span
        className="
          mx-auto
          flex
          size-9
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#3e3a3a]
          shadow-sm
        "
      >
        {icon}
      </span>

      <span
        className="
          mt-3
          block
          truncate
          text-xl
          font-semibold
          tracking-[-0.03em]
          text-[#3e3a3a]
        "
      >
        {value}
      </span>

      <span
        className="
          mt-0.5
          block
          truncate
          text-[0.7rem]
          leading-5
          text-[#3e3a3a]/48
        "
      >
        {label}
      </span>
    </div>
  );
}

type FacilityInformationProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

function FacilityInformation({
  icon,
  label,
  value,
  href,
  external = false,
}: FacilityInformationProps) {
  const content = (
    <>
      <span
        className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#3e3a3a]
          shadow-sm
        "
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span
          className="
            block
            text-xs
            text-[#3e3a3a]/45
          "
        >
          {label}
        </span>

        <span
          className="
            mt-1
            block
            break-words
            text-sm
            font-medium
            leading-6
            text-[#3e3a3a]
          "
        >
          {value}
        </span>
      </span>

      {external && (
        <ExternalLink
          className="
            size-3.5
            shrink-0
            text-[#3e3a3a]/35
          "
          strokeWidth={1.8}
          aria-hidden="true"
        />
      )}
    </>
  );

  const className = `
    flex
    min-h-20
    items-center
    gap-3
    rounded-[1.25rem]
    border
    border-[#3e3a3a]/6
    bg-linear-to-br
    from-white
    to-[#e6e5ef]/38
    p-4
    shadow-[0_8px_20px_rgba(62,58,58,0.035)]
  `;

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={
          external
            ? "noopener noreferrer"
            : undefined
        }
        className={`
          ${className}
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-[#e6e5ef]/60
          hover:shadow-sm
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
          motion-reduce:transform-none
          motion-reduce:transition-none
        `}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}


function normalizeExternalUrl(
  value: string | null
): string | null {
  const trimmedValue = value?.trim();

  if (!trimmedValue) {
    return null;
  }

  if (
    trimmedValue.startsWith("https://") ||
    trimmedValue.startsWith("http://")
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}
