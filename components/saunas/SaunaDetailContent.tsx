import type { RatingDistribution } from "@/services/sauna-metrics";

import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { MobileSaunaActionBar } from "@/components/saunas/MobileSaunaActionBar";
import { SaunaCommunityPosts } from "@/components/saunas/SaunaCommunityPosts";
import { SaunaDetailHeaderCard } from "@/components/saunas/SaunaDetailHeaderCard";
import { SaunaDetailSectionNav } from "@/components/saunas/SaunaDetailSectionNav";
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
  image_count?: number;
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
          pb-36
          pt-6
          sm:px-6
          sm:pb-40
          sm:pt-8
          lg:px-8
          lg:pb-28
          lg:pt-10
        "
      >
        <FadeIn
          duration="slow"
          distance="subtle"
        >
          <SaunaDetailHeaderCard
            saunaId={sauna.id}
            name={sauna.name}
            imageUrl={sauna.image_url}
            isVerified={sauna.is_verified}
            locationText={locationText}
            latitude={sauna.latitude}
            longitude={sauna.longitude}
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
        </FadeIn>

        <FadeIn
          delay={60}
          duration="normal"
          distance="subtle"
        >
          <SaunaDetailSectionNav />
        </FadeIn>

        <div
          className="
            mt-6
            grid
            items-stretch
            gap-6
            sm:mt-8
            xl:grid-cols-2
            xl:gap-8
          "
        >
          <div
            id="sauna-facilities"
            className="
              scroll-mt-40
              xl:h-full
            "
          >
            <ScrollReveal
              duration="slow"
              distance="normal"
            >
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
            </ScrollReveal>
          </div>

          <div
            id="sauna-ratings"
            className="
              scroll-mt-40
              xl:h-full
            "
          >
            <ScrollReveal
              delay={50}
              duration="slow"
              distance="normal"
            >
              <SaunaRatingSummary
                saunaId={sauna.id}
                averageRating={averageRating}
                ratingCount={ratingCount}
                ratingDistribution={
                  ratingDistribution
                }
              />
            </ScrollReveal>
          </div>
        </div>

        <div
          id="sauna-access"
          className="scroll-mt-40"
        >
          <ScrollReveal
            duration="slow"
            distance="normal"
          >
            <SaunaMap
              name={sauna.name}
              prefecture={sauna.prefecture}
              city={sauna.city}
              address={sauna.address}
              latitude={sauna.latitude}
              longitude={sauna.longitude}
            />
          </ScrollReveal>
        </div>

        <div
          id="sauna-community"
          className="scroll-mt-40"
        >
          <ScrollReveal
            delay={60}
            duration="slow"
            distance="normal"
          >
            <SaunaCommunityPosts
              saunaId={sauna.id}
              posts={posts}
            />
          </ScrollReveal>
        </div>
      </div>

      <MobileSaunaActionBar
        saunaId={sauna.id}
        name={sauna.name}
        locationText={locationText}
        latitude={sauna.latitude}
        longitude={sauna.longitude}
      />
    </main>
  );
}
