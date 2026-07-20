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

export function SaunaHero({
  name,
  imageUrl,
  isVerified,
  locationText,
  averageRating,
  ratingCount,
}: SaunaHeroProps) {
  const hasRating =
    averageRating !== null && ratingCount > 0;

  const formattedAverageRating = hasRating
    ? averageRating.toFixed(1)
    : null;

  return (
    <div
      className="
        group
        relative
        aspect-[4/3]
        w-full
        overflow-hidden
        bg-[#3e3a3a]
        sm:aspect-[16/8]
        lg:aspect-[16/7]
      "
    >
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={`${name}の施設画像`}
          fill
          priority
          sizes="
            (max-width: 768px) 100vw,
            (max-width: 1200px) 90vw,
            1152px
          "
          className="
            object-cover
            transition-transform
            duration-1000
            ease-out
            group-hover:scale-[1.015]
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        />
      ) : (
        <div
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

          <div className="relative">
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
                className="size-6 text-white/70"
                strokeWidth={1.5}
                aria-hidden="true"
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
          from-black/80
          via-black/20
          to-black/15
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          inset-x-0
          bottom-0
          h-3/4
          bg-linear-to-t
          from-black/60
          via-black/15
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
              className="size-3.5 text-[#9fd9f6]"
              strokeWidth={2}
              aria-hidden="true"
            />

            確認済み施設
          </span>
        ) : (
          <span aria-hidden="true" />
        )}

        <div
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
          aria-label={
            hasRating
              ? `平均評価${formattedAverageRating}、${ratingCount}件の評価`
              : "まだ評価はありません"
          }
        >
          <Star
            className="
              size-3.5
              fill-[#fdd000]
              text-[#fdd000]
            "
            strokeWidth={1.8}
            aria-hidden="true"
          />

          {hasRating ? (
            <>
              <span>
                {formattedAverageRating}
              </span>

              <span className="font-normal text-white/65">
                （{ratingCount}件）
              </span>
            </>
          ) : (
            <span className="font-normal text-white/75">
              未評価
            </span>
          )}
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
        <div
          className="
            max-w-4xl
            rounded-[1.5rem]
            border
            border-white/10
            bg-black/15
            p-4
            shadow-lg
            backdrop-blur-[2px]
            sm:rounded-[1.75rem]
            sm:p-6
            lg:p-7
          "
        >
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
              leading-tight
              tracking-[-0.04em]
              text-white
              drop-shadow-sm
              sm:mt-3
              sm:text-4xl
              lg:text-5xl
            "
          >
            {name}
          </h1>

          {locationText && (
            <div
              className="
                mt-3
                flex
                max-w-3xl
                items-start
                gap-2
                text-sm
                leading-6
                text-white/75
                sm:mt-4
                sm:text-base
              "
            >
              <MapPin
                className="
                  mt-0.5
                  size-4
                  shrink-0
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <span className="break-words">
                {locationText}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}