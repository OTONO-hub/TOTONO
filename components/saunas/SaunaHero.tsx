import Image from "next/image";
import {
  CheckCircle2,
  MapPin,
  Star,
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
  return (
    <div
      className="
        relative
        aspect-[4/3]
        w-full
        overflow-hidden
        bg-[#3e3a3a]/8
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
          className="object-cover"
        />
      ) : (
        <div
          className="
            flex
            h-full
            items-center
            justify-center
            px-6
            text-center
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                tracking-[0.24em]
                text-[#3e3a3a]/35
              "
            >
              TOTONO
            </p>

            <p
              className="
                mt-4
                text-sm
                leading-7
                text-[#3e3a3a]/50
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
          from-black/55
          via-black/5
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
        "
      >
        {isVerified ? (
          <span
            className="
              inline-flex
              items-center
              gap-1.5
              rounded-full
              bg-white/90
              px-3
              py-1.5
              text-xs
              font-semibold
              text-[#007f81]
              shadow-sm
              backdrop-blur-md
            "
          >
            <CheckCircle2
              className="size-3.5"
              strokeWidth={2}
            />
            確認済み施設
          </span>
        ) : (
          <span />
        )}

        <div
          className="
            inline-flex
            items-center
            gap-1.5
            rounded-full
            bg-white/90
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#3e3a3a]
            shadow-sm
            backdrop-blur-md
          "
        >
          <Star
            className="
              size-3.5
              fill-[#fdd000]
              text-[#fdd000]
            "
            strokeWidth={1.8}
          />

          {averageRating !== null ? (
            <>
              <span>
                {averageRating.toFixed(1)}
              </span>

              <span
                className="
                  font-normal
                  text-[#3e3a3a]/55
                "
              >
                （{ratingCount}件）
              </span>
            </>
          ) : (
            <span className="font-normal">
              未評価
            </span>
          )}
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          right-0
          p-5
          sm:p-8
          lg:p-10
        "
      >
        <p
          className="
            text-xs
            font-semibold
            uppercase
            tracking-[0.22em]
            text-white/70
          "
        >
          Sauna Facility
        </p>

        <h1
          className="
            mt-3
            max-w-4xl
            text-3xl
            font-semibold
            tracking-[-0.04em]
            text-white
            drop-shadow-sm
            sm:text-4xl
            lg:text-5xl
          "
        >
          {name}
        </h1>

        {locationText && (
          <div
            className="
              mt-4
              flex
              max-w-3xl
              items-start
              gap-2
              text-sm
              leading-6
              text-white/80
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
            />

            <span>{locationText}</span>
          </div>
        )}
      </div>
    </div>
  );
}
