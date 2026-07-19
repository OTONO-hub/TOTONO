import Link from "next/link";
import { PenLine, Star } from "lucide-react";

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
    ratingCount > 0 &&
    averageRating !== null;

  return (
    <section
      aria-labelledby="rating-summary-heading"
      className="
        mt-10
        rounded-[2rem]
        border
        border-black/5
        bg-white
        p-6
        shadow-sm
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          border-b
          border-black/5
          pb-6
        "
      >
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
            text-sm
            leading-7
            text-[#3e3a3a]/60
          "
        >
          TOTONOに投稿されたサ活をもとに、
          施設の評価を集計しています。
        </p>
      </div>

      {hasRatings ? (
        <div
          className="
            mt-8
            grid
            gap-8
            lg:grid-cols-[16rem_1fr]
            lg:items-center
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

  return (
    <div
      className="
        flex
        flex-col
        items-center
        justify-center
        rounded-[1.75rem]
        bg-[#e6e5ef]/45
        px-6
        py-10
        text-center
      "
    >
      <div
        className="
          flex
          items-center
          gap-3
        "
      >
        <Star
          className="
            size-8
            fill-[#fdd000]
            text-[#fdd000]
          "
          strokeWidth={1.8}
        />

        <span
          className="
            text-5xl
            font-semibold
            tracking-[-0.06em]
            text-[#3e3a3a]
          "
        >
          {averageRating.toFixed(1)}
        </span>
      </div>

      <div
        className="
          mt-5
          flex
          items-center
          gap-1
        "
        aria-label={`5点満点中${averageRating.toFixed(
          1
        )}点`}
      >
        {[1, 2, 3, 4, 5].map(
          (starNumber) => (
            <Star
              key={starNumber}
              className={`
                size-5
                ${
                  starNumber <=
                  roundedAverageRating
                    ? `
                        fill-[#fdd000]
                        text-[#fdd000]
                      `
                    : `
                        fill-transparent
                        text-[#3e3a3a]/20
                      `
                }
              `}
              strokeWidth={1.8}
            />
          )
        )}
      </div>

      <p
        className="
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
  const ratings: Array<
    1 | 2 | 3 | 4 | 5
  > = [5, 4, 3, 2, 1];

  return (
    <div className="space-y-4">
      {ratings.map((rating) => {
        const count = distribution[rating];

        const percentage =
          ratingCount > 0
            ? (count / ratingCount) * 100
            : 0;

        return (
          <div
            key={rating}
            className="
              grid
              grid-cols-[2.5rem_1fr_2.5rem]
              items-center
              gap-3
              sm:grid-cols-[3rem_1fr_3rem]
            "
          >
            <div
              className="
                flex
                items-center
                gap-1
                text-sm
                font-medium
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
              />
            </div>

            <div
              className="
                h-3
                overflow-hidden
                rounded-full
                bg-[#e6e5ef]
              "
              role="progressbar"
              aria-label={`${rating}点の評価`}
              aria-valuemin={0}
              aria-valuemax={ratingCount}
              aria-valuenow={count}
            >
              <div
                className="
                  h-full
                  rounded-full
                  bg-[#fdd000]
                  transition-[width]
                  duration-500
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
        mt-8
        rounded-[1.75rem]
        border
        border-dashed
        border-[#3e3a3a]/15
        bg-[#e6e5ef]/25
        px-6
        py-12
        text-center
      "
    >
      <div
        className="
          mx-auto
          flex
          size-14
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#3e3a3a]/40
          shadow-sm
        "
      >
        <Star
          className="size-5"
          strokeWidth={1.8}
        />
      </div>

      <p
        className="
          mt-5
          text-base
          font-medium
          text-[#3e3a3a]
        "
      >
        まだ評価がありません
      </p>

      <p
        className="
          mt-2
          text-sm
          leading-7
          text-[#3e3a3a]/55
        "
      >
        この施設を訪れたら、
        最初のサ活を投稿してみましょう。
      </p>

      <Link
        href={`/posts/new?sauna_id=${saunaId}`}
        className="
          mt-6
          inline-flex
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
  );
}
