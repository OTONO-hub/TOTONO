import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock3,
  Globe2,
  Heart,
  MapPin,
  PenLine,
  Phone,
  Star,
} from "lucide-react";

import { FavoriteSaunaButton } from "@/components/saunas/FavoriteSaunaButton";

type SaunaOverviewProps = {
  saunaId: string;
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
  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <div
        className="
          grid
          gap-4
          sm:grid-cols-3
        "
      >
        <MetricCard
          icon={
            <Star
              className="
                size-5
                fill-[#fdd000]
                text-[#fdd000]
              "
              strokeWidth={1.8}
            />
          }
          value={
            averageRating !== null
              ? averageRating.toFixed(1)
              : "—"
          }
          label={
            ratingCount > 0
              ? `${ratingCount}件の評価`
              : "まだ評価がありません"
          }
        />

        <MetricCard
          icon={
            <BookOpen
              className="size-5"
              strokeWidth={1.8}
            />
          }
          value={postCount.toString()}
          label="サ活投稿"
        />

        <MetricCard
          icon={
            <Heart
              className="size-5"
              strokeWidth={1.8}
            />
          }
          value={favoriteCount.toString()}
          label="お気に入り"
        />
      </div>

      <div
        className="
          mt-8
          grid
          gap-4
          border-t
          border-black/5
          pt-8
          md:grid-cols-[1fr_16rem]
        "
      >
        <div
          className="
            grid
            gap-4
            sm:grid-cols-2
          "
        >
          {openingHours && (
            <FacilityInformation
              icon={
                <Clock3 className="size-4" />
              }
              label="営業時間"
              value={openingHours}
            />
          )}

          {phoneNumber && (
            <FacilityInformation
              icon={
                <Phone className="size-4" />
              }
              label="電話番号"
              value={phoneNumber}
              href={`tel:${phoneNumber}`}
            />
          )}

          {websiteUrl && (
            <FacilityInformation
              icon={
                <Globe2 className="size-4" />
              }
              label="公式サイト"
              value="公式サイトを見る"
              href={websiteUrl}
              external
            />
          )}

          {postalCode && (
            <FacilityInformation
              icon={
                <MapPin className="size-4" />
              }
              label="郵便番号"
              value={`〒${postalCode}`}
            />
          )}
        </div>

        <div
          className="
            flex
            flex-col
            gap-3
          "
        >
          <FavoriteSaunaButton
            saunaId={saunaId}
            userId={userId}
            initialFavorite={initialFavorite}
          />

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
              transition
              hover:bg-[#3e3a3a]/85
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#3e3a3a]
              focus-visible:ring-offset-2
            "
          >
            <PenLine className="size-4" />
            この施設で投稿する
          </Link>
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

function MetricCard({
  icon,
  value,
  label,
}: MetricCardProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        rounded-[1.5rem]
        border
        border-black/5
        bg-[#e6e5ef]/45
        p-5
      "
    >
      <span
        className="
          flex
          size-11
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

      <span>
        <span
          className="
            block
            text-xl
            font-semibold
            tracking-tight
            text-[#3e3a3a]
          "
        >
          {value}
        </span>

        <span
          className="
            mt-0.5
            block
            text-xs
            text-[#3e3a3a]/50
          "
        >
          {label}
        </span>
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
          size-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-[#e6e5ef]
          text-[#3e3a3a]
        "
      >
        {icon}
      </span>

      <span className="min-w-0">
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
            wrap-break-word
            text-sm
            font-medium
            leading-6
            text-[#3e3a3a]
          "
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="
          flex
          items-center
          gap-3
          rounded-2xl
          border
          border-black/5
          bg-[#e6e5ef]/35
          p-4
          transition
          hover:bg-[#e6e5ef]/65
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
        "
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className="
        flex
        items-center
        gap-3
        rounded-2xl
        border
        border-black/5
        bg-[#e6e5ef]/35
        p-4
      "
    >
      {content}
    </div>
  );
}
