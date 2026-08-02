import {
  CalendarDays,
  Flame,
  MapPin,
  Star,
  Trophy,
} from "lucide-react";

import type { BestSaunaOfYear } from "@/lib/profile-best-sauna";

type BestSaunaCardProps = {
  bestSauna: BestSaunaOfYear | null;
};

/**
 * YYYY-MM-DD形式の日付を
 * 日本語の日付表示へ変換します。
 *
 * 例:
 * 2026-07-24
 * ↓
 * 2026年7月24日
 */
function formatVisitDate(
  visitDate: string
): string {
  const [
    year,
    month,
    day,
  ] = visitDate
    .split("-")
    .map(Number);

  if (
    !year ||
    !month ||
    !day
  ) {
    return visitDate;
  }

  return `${year}年${month}月${day}日`;
}

/**
 * 評価を小数第1位で表示します。
 *
 * 例:
 * 5 → 5.0
 * 4.5 → 4.5
 */
function formatRating(
  rating: number
): string {
  return rating.toFixed(1);
}

export function BestSaunaCard({
  bestSauna,
}: BestSaunaCardProps) {
  return (
    <section
      aria-labelledby="best-sauna-heading"
      className="
        relative
        mt-6
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:mt-8
        sm:rounded-[2.5rem]
      "
    >
      {/* 背景装飾 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-16 -top-20
          size-64
          rounded-full
          bg-accent/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-24 -left-16
          size-64
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        className="
          relative
          px-5
          py-7
          sm:px-8
          sm:py-9
          lg:px-10
          lg:py-10
        "
      >
        {/* カード見出し */}
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-3
              "
            >
              <span
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent/25
                  text-foreground
                "
              >
                <Trophy
                  className="size-4.5"
                  strokeWidth={1.8}
                />
              </span>

              <p
                className="
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-muted-foreground
                "
              >
                Best Sauna of the Year
              </p>
            </div>

            <h2
              id="best-sauna-heading"
              className="
                mt-5
                text-2xl
                font-semibold
                tracking-[-0.035em]
                text-foreground
                sm:text-3xl
              "
            >
              今年のマイベストサウナ
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              今年のサ活から、評価・訪問回数・訪問日をもとに
              あなたのベストサウナを選びました。
            </p>
          </div>

          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              border border-border/50
              bg-background/55
              px-4
              py-2
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            <Flame
              className="size-3.5"
              strokeWidth={1.8}
            />

            今年のサ活
          </div>
        </div>

        {bestSauna ? (
          <div
            className="
              mt-8
              overflow-hidden
              rounded-[1.75rem]
              border border-border/50
              bg-background/55
              sm:mt-10
            "
          >
            {/* 施設名と評価 */}
            <div
              className="
                flex
                flex-col
                gap-5
                border-b border-border/45
                px-5
                py-6
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-7
                sm:py-7
              "
            >
              <div className="min-w-0">
                <p
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  <MapPin
                    className="size-3.5"
                    strokeWidth={1.7}
                  />

                  Your Best Place
                </p>

                <h3
                  className="
                    mt-3
                    wrap-break-word
                    text-2xl
                    font-semibold
                    tracking-[-0.035em]
                    text-foreground
                    sm:text-3xl
                  "
                >
                  {bestSauna.saunaName}
                </h3>
              </div>

              <div
                className="
                  flex
                  w-fit
                  items-center
                  gap-2
                  rounded-full
                  bg-accent/25
                  px-4
                  py-2.5
                "
              >
                <Star
                  className="
                    size-4
                    fill-current
                    text-foreground
                  "
                  strokeWidth={1.7}
                />

                <span
                  className="
                    text-lg
                    font-semibold
                    tabular-nums
                    text-foreground
                  "
                >
                  {formatRating(
                    bestSauna.averageRating
                  )}
                </span>
              </div>
            </div>

            {/* 集計情報 */}
            <dl
              className="
                grid
                sm:grid-cols-3
              "
            >
              <div
                className="
                  px-5
                  py-5
                  sm:px-7
                  sm:py-6
                "
              >
                <dt
                  className="
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  訪問回数
                </dt>

                <dd
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tabular-nums
                    text-foreground
                  "
                >
                  {bestSauna.visitCount}
                  <span
                    className="
                      ml-1
                      text-sm
                      font-medium
                      text-muted-foreground
                    "
                  >
                    回
                  </span>
                </dd>
              </div>

              <div
                className="
                  border-t
                  border-border/45
                  px-5
                  py-5
                  sm:border-l
                  sm:border-t-0
                  sm:px-7
                  sm:py-6
                "
              >
                <dt
                  className="
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  総セット数
                </dt>

                <dd
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tabular-nums
                    text-foreground
                  "
                >
                  {bestSauna.totalSetCount}
                  <span
                    className="
                      ml-1
                      text-sm
                      font-medium
                      text-muted-foreground
                    "
                  >
                    セット
                  </span>
                </dd>
              </div>

              <div
                className="
                  border-t
                  border-border/45
                  px-5
                  py-5
                  sm:border-l
                  sm:border-t-0
                  sm:px-7
                  sm:py-6
                "
              >
                <dt
                  className="
                    flex
                    items-center
                    gap-2
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  <CalendarDays
                    className="size-3.5"
                    strokeWidth={1.7}
                  />

                  最後に訪問
                </dt>

                <dd
                  className="
                    mt-2
                    text-sm
                    font-semibold
                    leading-6
                    text-foreground
                  "
                >
                  {formatVisitDate(
                    bestSauna.latestVisitDate
                  )}
                </dd>
              </div>
            </dl>
          </div>
        ) : (
          <div
            className="
              mt-8
              rounded-[1.75rem]
              border border-dashed border-border/65
              bg-background/40
              px-6
              py-12
              text-center
              sm:mt-10
              sm:px-10
              sm:py-14
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
                bg-accent/20
                text-foreground
              "
            >
              <Trophy
                className="size-5"
                strokeWidth={1.7}
              />
            </div>

            <h3
              className="
                mt-5
                text-lg
                font-semibold
                tracking-tight
                text-foreground
              "
            >
              今年のベストサウナはまだありません
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              今年訪れたサウナを記録すると、
              あなたのマイベストサウナがここに表示されます。
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
