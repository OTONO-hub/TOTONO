import Image from "next/image";
import {
  CheckCircle2,
  MapPin,
  Star,
  Waves,
} from "lucide-react";

type SaunaHeroProps = {
  name: string;
  imageUrl: string | null;
  isVerified: boolean;
  locationText: string;
  averageRating: number | null;
  ratingCount: number;
};

const MAX_RATING = 5;

export function SaunaHero({
  name,
  imageUrl,
  isVerified,
  locationText,
  averageRating,
  ratingCount,
}: SaunaHeroProps) {
  const normalizedName =
    name.trim() || "サウナ施設";

  const normalizedLocationText =
    locationText.trim();

  const normalizedRatingCount =
    Math.max(0, ratingCount);

  const hasRating =
    averageRating !== null &&
    Number.isFinite(averageRating) &&
    normalizedRatingCount > 0;

  const normalizedAverageRating =
    hasRating
      ? Math.max(
          0,
          Math.min(
            MAX_RATING,
            averageRating
          )
        )
      : null;

  const formattedAverageRating =
    normalizedAverageRating !== null
      ? normalizedAverageRating.toFixed(1)
      : null;

  const ratingLabel =
    formattedAverageRating !== null
      ? `平均評価は5点満点中${formattedAverageRating}点です。${normalizedRatingCount}件の評価があります`
      : "この施設にはまだ評価がありません";

  return (
    <div
      className="
        group
        relative
        aspect-[4/3]
        w-full
        overflow-hidden
        bg-[#3e3a3a]
        sm:aspect-[16/9]
        lg:aspect-auto
        lg:h-full
        lg:min-h-[42rem]
        xl:min-h-[46rem]
      "
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${normalizedName}の施設画像`}
          fill
          priority
          sizes="
            (max-width: 767px) 100vw,
            (max-width: 1023px) 90vw,
            760px
          "
          className="
            object-cover
            transition-transform
            duration-1000
            ease-out
            group-hover:scale-[1.02]
            motion-reduce:transform-none
            motion-reduce:transition-none
            motion-reduce:group-hover:scale-100
          "
        />
      ) : (
        <div
          role="img"
          aria-label={`${normalizedName}の施設画像はまだ登録されていません`}
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            overflow-hidden
            bg-linear-to-br
            from-[#3e3a3a]
            via-[#504b4b]
            to-[#6b6664]
            px-6
            text-center
          "
        >
          <div
            aria-hidden="true"
            className="
              absolute
              -right-16
              -top-20
              size-72
              rounded-full
              bg-white/5
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="
              absolute
              -bottom-28
              -left-16
              size-80
              rounded-full
              bg-[#9fd9f6]/10
              blur-3xl
            "
          />

          <div
            aria-hidden="true"
            className="relative"
          >
            <div
              className="
                mx-auto
                flex
                size-14
                items-center
                justify-center
                rounded-full
                border
                border-white/15
                bg-white/10
                backdrop-blur-sm
              "
            >
              <Waves
                aria-hidden="true"
                className="
                  size-6
                  text-white/70
                "
                strokeWidth={1.5}
              />
            </div>

            <p
              className="
                mt-5
                text-xs
                font-semibold
                tracking-[0.28em]
                text-white/50
              "
            >
              TOTONO
            </p>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-white/65
              "
            >
              施設画像はまだ
              <br className="sm:hidden" />
              登録されていません
            </p>
          </div>
        </div>
      )}

      <div
        aria-hidden="true"
        className="
          absolute
          inset-0
          bg-linear-to-t
          from-black/90
          via-black/28
          to-black/10
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          bottom-0
          h-4/5
          bg-linear-to-t
          from-black/78
          via-black/26
          to-transparent
        "
      />

      <div
        className="
          absolute
          left-4
          right-4
          top-4
          flex
          flex-wrap
          items-start
          justify-between
          gap-3
          sm:left-6
          sm:right-6
          sm:top-6
          lg:left-8
          lg:right-8
          lg:top-8
        "
      >
        {isVerified ? (
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              border
              border-white/20
              bg-black/25
              px-3
              py-1.5
              text-xs
              font-semibold
              text-white
              shadow-sm
              backdrop-blur-md
            "
          >
            <CheckCircle2
              aria-hidden="true"
              className="
                size-3.5
                text-[#9fd9f6]
              "
              strokeWidth={2}
            />

            確認済み施設
          </span>
        ) : (
          <span aria-hidden="true" />
        )}

        <div
          role="img"
          aria-label={ratingLabel}
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            border
            border-white/20
            bg-black/25
            px-3
            py-1.5
            text-xs
            font-semibold
            text-white
            shadow-sm
            backdrop-blur-md
          "
        >
          <Star
            aria-hidden="true"
            className="
              size-3.5
              fill-[#fdd000]
              text-[#fdd000]
            "
            strokeWidth={1.8}
          />

          <span
            aria-hidden="true"
            className="
              inline-flex
              items-center
              gap-1.5
            "
          >
            {formattedAverageRating !== null ? (
              <>
                <span>
                  {formattedAverageRating}
                </span>

                <span
                  className="
                    font-normal
                    text-white/65
                  "
                >
                  （{normalizedRatingCount}件）
                </span>
              </>
            ) : (
              <span
                className="
                  font-normal
                  text-white/75
                "
              >
                未評価
              </span>
            )}
          </span>
        </div>
      </div>

      <div
        className="
          absolute
          inset-x-0
          bottom-0
          p-4
          sm:p-6
          lg:p-8
        "
      >
        <div className="max-w-4xl">
          <p
            className="
              text-[0.65rem]
              font-semibold
              uppercase
              tracking-[0.26em]
              text-white/55
              sm:text-xs
            "
          >
            Sauna Facility
          </p>

          <h1
            id="sauna-detail-title"
            className="
              mt-2
              text-balance
              break-words
              text-3xl
              font-semibold
              leading-[1.08]
              tracking-[-0.04em]
              text-white
              drop-shadow-sm
              sm:mt-3
              sm:text-4xl
              lg:text-5xl
            "
          >
            {normalizedName}
          </h1>

          {normalizedLocationText ? (
            <div
              className="
                mt-3
                flex
                max-w-3xl
                items-start
                gap-2
                text-sm
                leading-6
                text-white/80
                sm:mt-4
                sm:text-base
              "
            >
              <MapPin
                aria-hidden="true"
                className="
                  mt-0.5
                  size-4
                  shrink-0
                "
                strokeWidth={1.8}
              />

              <span className="break-words">
                {normalizedLocationText}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
