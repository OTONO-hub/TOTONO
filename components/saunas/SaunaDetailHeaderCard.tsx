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
        <ArrowLeft className="size-4" />
        検索結果へ戻る
      </Link>

      <section
        className="
          mt-6
          overflow-hidden
          rounded-[2rem]
          border
          border-black/5
          bg-white
          shadow-sm
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
      </section>
    </>
  );
}