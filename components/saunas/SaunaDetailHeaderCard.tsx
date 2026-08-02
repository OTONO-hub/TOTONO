import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { SaunaHero } from "@/components/saunas/SaunaHero";
import { SaunaOverview } from "@/components/saunas/SaunaOverview";

type SaunaDetailHeaderCardProps = {
  saunaId: string;
  name: string;
  imageUrl: string | null;
  isVerified: boolean;
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

export function SaunaDetailHeaderCard({
  saunaId,
  name,
  imageUrl,
  isVerified,
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
}: SaunaDetailHeaderCardProps) {
  return (
    <>
      <Link
        href="/search"
        className="
          inline-flex
          items-center
          gap-2
          rounded-full
          px-1
          py-2
          text-sm
          font-medium
          text-[#3e3a3a]/65
          transition
          hover:text-[#3e3a3a]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
        "
      >
        <ArrowLeft
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        検索結果へ戻る
      </Link>

      <section
        id="sauna-visit-panel"
        aria-label={`${name}の施設概要と訪問メニュー`}
        className="
          mt-5
          scroll-mt-24
          overflow-hidden
          rounded-[2rem]
          border
          border-white/70
          bg-white/85
          shadow-[0_22px_70px_rgba(62,58,58,0.09)]
          backdrop-blur-xl
          sm:mt-6
          sm:rounded-[2.5rem]
        "
      >
        <div
          className="
            grid
            lg:grid-cols-[minmax(0,1.35fr)_minmax(22rem,0.65fr)]
          "
        >
          <SaunaHero
            name={name}
            imageUrl={imageUrl}
            isVerified={isVerified}
            locationText={locationText}
            averageRating={averageRating}
            ratingCount={ratingCount}
          />

          <SaunaOverview
            saunaId={saunaId}
            name={name}
            locationText={locationText}
            latitude={latitude}
            longitude={longitude}
            userId={userId}
            initialFavorite={initialFavorite}
            averageRating={averageRating}
            ratingCount={ratingCount}
            postCount={postCount}
            favoriteCount={favoriteCount}
            openingHours={openingHours}
            phoneNumber={phoneNumber}
            websiteUrl={websiteUrl}
            postalCode={postalCode}
          />
        </div>
      </section>
    </>
  );
}
