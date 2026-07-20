import Link from "next/link";
import {
  PenLine,
  Sparkles,
  Star,
} from "lucide-react";

import type { RatingDistribution } from "@/services/sauna-metrics";

type SaunaRatingSummaryProps = {
  saunaId: string;
  averageRating: number | null;
  ratingCount: number;
  ratingDistribution: RatingDistribution;
};

export function SaunaRatingSummary({
  saunaId,
  averageRating,
  ratingCount,
  ratingDistribution,
}: SaunaRatingSummaryProps) {
  const hasRatings =
    ratingCount > 0 && averageRating !== null;

  return (
    <section
      aria-labelledby="rating-summary-heading"
      className="
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-white/70
        bg-white/85
        p-6
        shadow-[0_18px_60px_rgba(62,58,58,0.07)]
        backdrop-blur-xl
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-[#3e3a3a]/8
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#3e3a3a]/45
            "
          >
            Reviews
          </p>

          <h2
            id="rating-summary-heading"
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            みんなの評価
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            TOTONOに投稿されたサ活をもとに、
            施設の評価を集計しています。
          </p>
        </div>

        {hasRatings && (
          <div
            className="
              inline-flex
              w-fit
              shrink-0
              items-center
              gap-2
              rounded-full
              border
              border-[#fdd000]/20
              bg-[#fdd000]/10
              px-4
              py-2
              text-sm
              font-medium
              text-[#3e3a3a]
              shadow-sm
            "
          >
            <Sparkles
              className="
                size-4
                text-[#b59600]
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {ratingCount}件のサ活から集計
            </span>
          </div>
        )}
      </div>

      {hasRatings ? (
        <div
          className="
            mt-8
            grid
            gap-8
            lg:grid-cols-[17rem_1fr]
            lg:items-center
            lg:gap-10
          "
        >
          <AverageRatingCard
            averageRating={averageRating}
            ratingCount={ratingCount}
          />

          <RatingDistributionChart
            distribution={ratingDistribution}
            ratingCount={ratingCount}
          />
        </div>
      ) : (
        <EmptyRatingState saunaId={saunaId} />
      )}
    </section>
  );
}

type AverageRatingCardProps = {
  averageRating: number;
  ratingCount: number;
};

function AverageRatingCard({
  averageRating,
  ratingCount,
}: AverageRatingCardProps) {
  const roundedAverageRating =
    Math.round(averageRating);

  const formattedAverageRating =
    averageRating.toFixed(1);

  return (
    <div
      className="
        group
        relative
        flex
        min-h-64
        flex-col
        items-center
        justify-center
        overflow-hidden
        rounded-[1.75rem]
        border
        border-[#fdd000]/15
        bg-linear-to-br
        from-white
        via-[#fdd000]/5
        to-[#e6e5ef]/55
        px-6
        py-10
        text-center
        shadow-[0_16px_36px_rgba(62,58,58,0.06)]
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#fdd000]/25
        hover:shadow-[0_22px_46px_rgba(62,58,58,0.1)]
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-12
          -top-12
          size-36
          rounded-full
          bg-[#fdd000]/20
          blur-3xl
          transition-opacity
          duration-300
          group-hover:opacity-80
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-16
          -left-12
          size-36
          rounded-full
          bg-[#9fd9f6]/20
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          relative
          z-10
          flex
          items-center
          gap-3
        "
      >
        <span
          className="
            flex
            size-12
            items-center
            justify-center
            rounded-full
            border
            border-white/80
            bg-white/85
            shadow-sm
            backdrop-blur-md
          "
          aria-hidden="true"
        >
          <Star
            className="
              size-6
              fill-[#fdd000]
              text-[#fdd000]
            "
            strokeWidth={1.8}
          />
        </span>

        <span
          className="
            text-6xl
            font-semibold
            tracking-[-0.065em]
            text-[#3e3a3a]
          "
        >
          {formattedAverageRating}
        </span>
      </div>

      <p
        className="
          relative
          z-10
          mt-2
          text-xs
          font-medium
          uppercase
          tracking-[0.18em]
          text-[#3e3a3a]/40
        "
      >
        Overall Rating
      </p>

      <div
        className="
          relative
          z-10
          mt-6
          flex
          items-center
          gap-1
        "
        role="img"
        aria-label={`5点満点中${formattedAverageRating}点`}
      >
        {[1, 2, 3, 4, 5].map(
          (starNumber) => {
            const isActive =
              starNumber <= roundedAverageRating;

            return (
              <Star
                key={starNumber}
                className={`
                  size-5
                  ${
                    isActive
                      ? `
                          fill-[#fdd000]
                          text-[#fdd000]
                        `
                      : `
                          fill-transparent
                          text-[#3e3a3a]/18
                        `
                  }
                `}
                strokeWidth={1.8}
                aria-hidden="true"
              />
            );
          }
        )}
      </div>

      <p
        className="
          relative
          z-10
          mt-4
          text-sm
          text-[#3e3a3a]/55
        "
      >
        {ratingCount}件の評価
      </p>
    </div>
  );
}

type RatingDistributionChartProps = {
  distribution: RatingDistribution;
  ratingCount: number;
};

function RatingDistributionChart({
  distribution,
  ratingCount,
}: RatingDistributionChartProps) {
  const ratings: Array<1 | 2 | 3 | 4 | 5> = [
    5, 4, 3, 2, 1,
  ];

  return (
    <div>
      <div
        className="
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div>
          <h3
            className="
              text-base
              font-semibold
              tracking-[-0.02em]
              text-[#3e3a3a]
            "
          >
            評価の内訳
          </h3>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-[#3e3a3a]/45
            "
          >
            投稿された評価ごとの割合です。
          </p>
        </div>

        <span
          className="
            shrink-0
            text-xs
            font-medium
            text-[#3e3a3a]/45
          "
        >
          Total {ratingCount}
        </span>
      </div>

      <div
        className="
          mt-6
          space-y-5
        "
      >
        {ratings.map((rating) => {
          const count = distribution[rating];

          const percentage =
            ratingCount > 0
              ? (count / ratingCount) * 100
              : 0;

          const roundedPercentage =
            Math.round(percentage);

          return (
            <div
              key={rating}
              className="
                grid
                grid-cols-[2.75rem_1fr_2.75rem]
                items-center
                gap-3
                sm:grid-cols-[3.25rem_1fr_3.5rem]
                sm:gap-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-1
                  text-sm
                  font-medium
                  tabular-nums
                  text-[#3e3a3a]
                "
              >
                <span>{rating}</span>

                <Star
                  className="
                    size-3.5
                    fill-[#fdd000]
                    text-[#fdd000]
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <div
                className="
                  h-3.5
                  overflow-hidden
                  rounded-full
                  bg-[#e6e5ef]/85
                  shadow-inner
                "
                role="progressbar"
                aria-label={`${rating}点の評価は${count}件、全体の${roundedPercentage}パーセントです`}
                aria-valuemin={0}
                aria-valuemax={ratingCount}
                aria-valuenow={count}
                aria-valuetext={`${count}件、${roundedPercentage}%`}
              >
                <div
                  className="
                    h-full
                    min-w-0
                    rounded-full
                    bg-linear-to-r
                    from-[#fdd000]
                    to-[#ffe875]
                    shadow-[0_2px_8px_rgba(253,208,0,0.25)]
                    transition-[width]
                    duration-500
                    ease-out
                    motion-reduce:transition-none
                  "
                  style={{
                    width: `${percentage}%`,
                  }}
                />
              </div>

              <span
                className="
                  text-right
                  text-sm
                  tabular-nums
                  text-[#3e3a3a]/55
                "
              >
                {count}件
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

type EmptyRatingStateProps = {
  saunaId: string;
};

function EmptyRatingState({
  saunaId,
}: EmptyRatingStateProps) {
  return (
    <div
      className="
        relative
        mt-8
        overflow-hidden
        rounded-[1.75rem]
        border
        border-dashed
        border-[#3e3a3a]/15
        bg-linear-to-br
        from-[#e6e5ef]/25
        to-white/70
        px-6
        py-12
        text-center
        sm:px-10
        sm:py-14
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          size-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#fdd000]/10
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          size-16
          items-center
          justify-center
          rounded-full
          border
          border-white/80
          bg-white/85
          text-[#3e3a3a]/45
          shadow-sm
          backdrop-blur-md
        "
        aria-hidden="true"
      >
        <Star
          className="size-6"
          strokeWidth={1.7}
        />
      </div>

      <p
        className="
          relative
          z-10
          mt-5
          text-lg
          font-semibold
          tracking-[-0.02em]
          text-[#3e3a3a]
        "
      >
        まだ評価がありません
      </p>

      <p
        className="
          relative
          z-10
          mx-auto
          mt-2
          max-w-md
          text-sm
          leading-7
          text-[#3e3a3a]/55
        "
      >
        この施設を訪れたら、
        あなたのサ活を記録して、
        最初の評価を届けてみましょう。
      </p>

      <Link
        href={`/posts/new?sauna_id=${saunaId}`}
        className="
          relative
          z-10
          mt-7
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
          shadow-[0_10px_24px_rgba(62,58,58,0.16)]
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-[#3e3a3a]/88
          hover:shadow-[0_14px_30px_rgba(62,58,58,0.2)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
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
  );
}