import type { RatingDistribution } from "@/services/sauna-metrics";

import { SaunaCommunityPosts } from "@/components/saunas/SaunaCommunityPosts";
import { SaunaDetailHeaderCard } from "@/components/saunas/SaunaDetailHeaderCard";
import { SaunaFacilities } from "@/components/saunas/SaunaFacilities";
import { SaunaMap } from "@/components/saunas/SaunaMap";
import { SaunaRatingSummary } from "@/components/saunas/SaunaRatingSummary";

type SaunaDetail = {
  id: string;
  name: string;
  image_url: string | null;
  is_verified: boolean;
  prefecture: string | null;
  city: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  opening_hours: string | null;
  phone_number: string | null;
  website_url: string | null;
  postal_code: string | null;
  has_sauna_room: boolean;
  has_cold_bath: boolean;
  has_outdoor_air_bath: boolean;
  has_rest_area: boolean;
  has_restaurant: boolean;
  has_parking: boolean;
};

type SaunaPost = {
  id: string;
  sauna_name: string;
  visit_date: string;
  rating: number;
  comment: string | null;
  image_url: string | null;
};

type SaunaDetailContentProps = {
  sauna: SaunaDetail;
  posts: SaunaPost[];
  userId: string | null;
  initialFavorite: boolean;
  averageRating: number | null;
  ratingCount: number;
  postCount: number;
  favoriteCount: number;
  ratingDistribution: RatingDistribution;
};

export function SaunaDetailContent({
  sauna,
  posts,
  userId,
  initialFavorite,
  averageRating,
  ratingCount,
  postCount,
  favoriteCount,
  ratingDistribution,
}: SaunaDetailContentProps) {
  const locationText = [
    sauna.prefecture,
    sauna.city,
    sauna.address,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .map((value) => value.trim())
    .join(" ");

  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-[#e6e5ef]/45
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-[-8rem]
          top-24
          size-80
          rounded-full
          bg-[#9fd9f6]/16
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          right-[-9rem]
          top-[34rem]
          size-96
          rounded-full
          bg-[#fdd000]/8
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          bottom-32
          left-1/3
          size-80
          rounded-full
          bg-white/45
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          relative
          z-10
          mx-auto
          w-full
          max-w-7xl
          px-5
          pb-20
          pt-6
          sm:px-6
          sm:pb-24
          sm:pt-8
          lg:px-8
          lg:pb-28
          lg:pt-10
        "
      >
        <SaunaDetailHeaderCard
          saunaId={sauna.id}
          name={sauna.name}
          imageUrl={sauna.image_url}
          isVerified={sauna.is_verified}
          locationText={locationText}
          userId={userId}
          initialFavorite={initialFavorite}
          averageRating={averageRating}
          ratingCount={ratingCount}
          postCount={postCount}
          favoriteCount={favoriteCount}
          openingHours={sauna.opening_hours}
          phoneNumber={sauna.phone_number}
          websiteUrl={sauna.website_url}
          postalCode={sauna.postal_code}
        />

        <SaunaFacilities
          hasSaunaRoom={sauna.has_sauna_room}
          hasColdBath={sauna.has_cold_bath}
          hasOutdoorAirBath={
            sauna.has_outdoor_air_bath
          }
          hasRestArea={sauna.has_rest_area}
          hasRestaurant={sauna.has_restaurant}
          hasParking={sauna.has_parking}
        />

        <SaunaRatingSummary
          saunaId={sauna.id}
          averageRating={averageRating}
          ratingCount={ratingCount}
          ratingDistribution={ratingDistribution}
        />

        <SaunaMap
          name={sauna.name}
          prefecture={sauna.prefecture}
          city={sauna.city}
          address={sauna.address}
          latitude={sauna.latitude}
          longitude={sauna.longitude}
        />

        <SaunaCommunityPosts
          saunaId={sauna.id}
          posts={posts}
        />
      </div>
    </main>
  );
}
