import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Heart,
  ImageIcon,
  MapPin,
  Navigation,
  Star,
} from "lucide-react";

import type { Sauna } from "@/services/saunas";

type SaunaSearchCardProps = {
  sauna: Sauna;
  postCount: number;
  favoriteCount: number;
  averageRating: number | null;
  ratingCount: number;
};

/**
 * 施設検索結果に表示する
 * サウナ施設カードです。
 */
export function SaunaSearchCard({
  sauna,
  postCount,
  favoriteCount,
  averageRating,
  ratingCount,
}: SaunaSearchCardProps) {
  /**
   * 都道府県と市区町村を組み合わせて、
   * 施設の所在地を作成します。
   */
  const locationText = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .map((value) => value.trim())
    .join(" ");

  /**
   * 都道府県・市区町村がない場合は、
   * 詳細住所を表示します。
   */
  const displayLocation =
    locationText ||
    sauna.address?.trim() ||
    "所在地未登録";

  /**
   * 現在地検索を行った場合だけ、
   * 現在地から施設までの距離を表示します。
   *
   * 通常検索ではdistance_kmが存在しないため、
   * 距離表示は自動的に非表示になります。
   */
  const distanceLabel = formatDistanceKm(
    sauna.distance_km
  );

  /**
   * スクリーンリーダーなどで使用する
   * 評価情報です。
   */
  const ratingLabel =
    averageRating !== null
      ? `${averageRating.toFixed(
          1
        )}、${ratingCount}件の評価`
      : "まだ評価はありません";

  /**
   * カード全体の説明文です。
   */
  const cardAriaLabel = [
    `${sauna.name}の施設詳細を見る`,
    ratingLabel,
    distanceLabel
      ? `現在地から${distanceLabel}`
      : null,
  ]
    .filter(Boolean)
    .join("。");

  return (
    <Link
      href={`/saunas/${sauna.id}`}
      aria-label={cardAriaLabel}
      className="
        group
        flex
        h-full
        min-w-0
        flex-col
        overflow-hidden
        rounded-[1.75rem]
        border
        border-[#3e3a3a]/7
        bg-white/85
        shadow-[0_12px_34px_rgba(62,58,58,0.055)]
        backdrop-blur-md
        transition-all
        duration-300
        ease-out
        hover:-translate-y-1
        hover:border-[#3e3a3a]/12
        hover:bg-white
        hover:shadow-[0_22px_50px_rgba(62,58,58,0.11)]
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-[#3e3a3a]
        focus-visible:ring-offset-3
        focus-visible:ring-offset-[#e6e5ef]
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      <SaunaImage
        imageUrl={sauna.image_url}
        saunaName={sauna.name}
        isVerified={sauna.is_verified}
        averageRating={averageRating}
        ratingCount={ratingCount}
      />

      <div
        className="
          flex
          flex-1
          flex-col
          p-5
          sm:p-6
        "
      >
        <div>
          <p
            className="
              text-[0.6875rem]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#3e3a3a]/45
            "
          >
            Sauna Facility
          </p>

          <h3
            className="
              mt-2
              line-clamp-2
              text-xl
              font-semibold
              leading-7
              tracking-[-0.03em]
              text-[#3e3a3a]
              transition-colors
              duration-200
              group-hover:text-[#3e3a3a]/75
              motion-reduce:transition-none
            "
          >
            {sauna.name}
          </h3>

          <div
            className="
              mt-4
              flex
              min-w-0
              items-start
              gap-2
              text-sm
              text-[#3e3a3a]/58
            "
          >
            <MapPin
              className="
                mt-0.5
                size-4
                shrink-0
              "
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span
              className="
                line-clamp-2
                min-w-0
                leading-6
              "
            >
              {displayLocation}
            </span>
          </div>

          {distanceLabel && (
            <div
              className="
                mt-3
                inline-flex
                max-w-full
                items-center
                gap-2
                rounded-full
                border
                border-[#9fd9f6]/45
                bg-[#9fd9f6]/20
                px-3
                py-1.5
                text-xs
                font-semibold
                text-[#3e3a3a]/75
              "
            >
              <Navigation
                className="
                  size-3.5
                  shrink-0
                  text-[#00b4b6]
                "
                strokeWidth={1.9}
                aria-hidden="true"
              />

              <span className="truncate">
                現在地から
              </span>

              <span
                className="
                  shrink-0
                  tabular-nums
                  text-[#3e3a3a]
                "
              >
                {distanceLabel}
              </span>
            </div>
          )}
        </div>

        <div
          className="
            mt-6
            grid
            grid-cols-2
            gap-3
          "
        >
          <MetricCard
            icon={
              <BookOpen
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="サ活"
            value={postCount}
            unit="件"
          />

          <MetricCard
            icon={
              <Heart
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="お気に入り"
            value={favoriteCount}
            unit="人"
          />
        </div>

        <div
          className="
            mt-auto
            pt-6
          "
        >
          <div
            className="
              flex
              items-center
              justify-between
              border-t
              border-[#3e3a3a]/7
              pt-5
            "
          >
            <span
              className="
                text-sm
                font-semibold
                text-[#3e3a3a]
              "
            >
              施設詳細を見る
            </span>

            <span
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                border
                border-[#3e3a3a]/10
                bg-white/80
                text-[#3e3a3a]/60
                transition-all
                duration-200
                group-hover:translate-x-0.5
                group-hover:border-[#3e3a3a]
                group-hover:bg-[#3e3a3a]
                group-hover:text-white
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
              aria-hidden="true"
            >
              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
              />
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}

type SaunaImageProps = {
  imageUrl: string | null;
  saunaName: string;
  isVerified: boolean;
  averageRating: number | null;
  ratingCount: number;
};

/**
 * 施設カード上部の画像エリアです。
 */
function SaunaImage({
  imageUrl,
  saunaName,
  isVerified,
  averageRating,
  ratingCount,
}: SaunaImageProps) {
  return (
    <div
      className="
        relative
        aspect-[4/3]
        overflow-hidden
        bg-[#e6e5ef]/70
      "
    >
      {imageUrl ? (
        <>
          <Image
            src={imageUrl}
            alt={`${saunaName}の施設画像`}
            fill
            sizes="
              (max-width: 639px) calc(100vw - 40px),
              (max-width: 1023px) 50vw,
              360px
            "
            className="
              object-cover
              transition-transform
              duration-500
              ease-out
              group-hover:scale-[1.04]
              motion-reduce:transition-none
            "
          />

          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute
              inset-0
              bg-gradient-to-t
              from-[#3e3a3a]/28
              via-transparent
              to-black/5
            "
          />
        </>
      ) : (
        <ImagePlaceholder />
      )}

      <div
        className="
          absolute
          inset-x-3
          top-3
          flex
          items-start
          justify-between
          gap-2
        "
      >
        <div>
          {isVerified && (
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-white/50
                bg-white/88
                px-3
                py-1.5
                text-[0.6875rem]
                font-semibold
                text-[#3e3a3a]
                shadow-sm
                backdrop-blur-md
              "
            >
              <CheckCircle2
                className="
                  size-3.5
                  text-[#00b4b6]
                "
                strokeWidth={2}
                aria-hidden="true"
              />

              施設確認済み
            </span>
          )}
        </div>

        <RatingBadge
          averageRating={averageRating}
          ratingCount={ratingCount}
        />
      </div>
    </div>
  );
}

/**
 * 施設画像が未登録の場合に表示する
 * プレースホルダーです。
 */
function ImagePlaceholder() {
  return (
    <div
      className="
        relative
        flex
        h-full
        items-center
        justify-center
        overflow-hidden
        bg-gradient-to-br
        from-[#e6e5ef]
        via-white
        to-[#9fd9f6]/25
        px-6
        text-center
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          size-36
          rounded-full
          bg-[#9fd9f6]/35
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-14
          -left-12
          size-36
          rounded-full
          bg-[#fdd000]/18
          blur-3xl
        "
      />

      <div className="relative z-10">
        <span
          className="
            mx-auto
            flex
            size-11
            items-center
            justify-center
            rounded-full
            border
            border-[#3e3a3a]/7
            bg-white/70
            text-[#3e3a3a]/35
            shadow-sm
          "
        >
          <ImageIcon
            className="size-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </span>

        <p
          className="
            mt-4
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
            text-[#3e3a3a]/35
          "
        >
          TOTONO
        </p>

        <p
          className="
            mt-2
            text-sm
            leading-6
            text-[#3e3a3a]/52
          "
        >
          施設画像はまだ
          <br />
          登録されていません
        </p>
      </div>
    </div>
  );
}

type RatingBadgeProps = {
  averageRating: number | null;
  ratingCount: number;
};

/**
 * 施設画像上に表示する評価バッジです。
 */
function RatingBadge({
  averageRating,
  ratingCount,
}: RatingBadgeProps) {
  return (
    <span
      className="
        inline-flex
        shrink-0
        items-center
        gap-1.5
        rounded-full
        border
        border-white/50
        bg-white/88
        px-3
        py-1.5
        text-xs
        font-semibold
        text-[#3e3a3a]
        shadow-sm
        backdrop-blur-md
      "
      aria-label={
        averageRating !== null
          ? `平均評価${averageRating.toFixed(
              1
            )}、${ratingCount}件の評価`
          : "まだ評価はありません"
      }
    >
      <Star
        className={`
          size-3.5
          ${
            averageRating !== null
              ? "fill-[#fdd000] text-[#fdd000]"
              : "text-[#3e3a3a]/30"
          }
        `}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      {averageRating !== null ? (
        <>
          <span className="tabular-nums">
            {averageRating.toFixed(1)}
          </span>

          <span
            className="
              font-normal
              text-[#3e3a3a]/48
            "
          >
            ({ratingCount})
          </span>
        </>
      ) : (
        <span
          className="
            font-normal
            text-[#3e3a3a]/55
          "
        >
          未評価
        </span>
      )}
    </span>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  label: string;
  value: number;
  unit: string;
};

/**
 * サ活数やお気に入り数を表示する
 * 小さな指標カードです。
 */
function MetricCard({
  icon,
  label,
  value,
  unit,
}: MetricCardProps) {
  return (
    <div
      className="
        min-w-0
        rounded-2xl
        border
        border-[#3e3a3a]/6
        bg-[#e6e5ef]/35
        px-3
        py-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-1.5
          text-xs
          text-[#3e3a3a]/50
        "
      >
        <span
          className="shrink-0"
          aria-hidden="true"
        >
          {icon}
        </span>

        <span className="truncate">
          {label}
        </span>
      </div>

      <p
        className="
          mt-2
          text-sm
          font-semibold
          tabular-nums
          text-[#3e3a3a]
        "
      >
        {value}

        <span
          className="
            ml-0.5
            text-xs
            font-normal
            text-[#3e3a3a]/50
          "
        >
          {unit}
        </span>
      </p>
    </div>
  );
}

/**
 * 現在地から施設までの距離を、
 * 画面表示用の文字列へ変換します。
 *
 * 不正な値やマイナス値の場合は、
 * 距離を表示しません。
 */
function formatDistanceKm(
  distanceKm?: number | null
): string | null {
  if (
    typeof distanceKm !== "number" ||
    !Number.isFinite(distanceKm) ||
    distanceKm < 0
  ) {
    return null;
  }

  /**
   * 1km未満の場合は、
   * メートル表示の方が分かりやすいため
   * mへ変換します。
   */
  if (distanceKm < 1) {
    const distanceMeters = Math.max(
      Math.round(distanceKm * 1000),
      1
    );

    return `${distanceMeters}m`;
  }

  /**
   * 1km以上の場合は、
   * 小数第1位まで表示します。
   */
  return `${distanceKm.toFixed(1)}km`;
}
