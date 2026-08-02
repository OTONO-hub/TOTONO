import {
  Activity,
  CalendarDays,
  Flame,
  Star,
  TrendingDown,
  TrendingUp,
} from "lucide-react";

export type WeeklySummaryPost = {
  visit_date: string;
  set_count: number;
  rating: number;
};

type WeeklySaunaSummaryProps = {
  posts: WeeklySummaryPost[];
};

type WeeklySummary = {
  visitCount: number;
  totalSets: number;
  averageRating: number | null;
};

export function WeeklySaunaSummary({
  posts,
}: WeeklySaunaSummaryProps) {
  const currentWeekRange =
    getCurrentWeekRangeInJapan();

  const previousWeekRange =
    getPreviousWeekRange(currentWeekRange);

  const currentWeekPosts = posts.filter(
    (post) =>
      isDateWithinRange(
        post.visit_date,
        currentWeekRange.start,
        currentWeekRange.end
      )
  );

  const previousWeekPosts = posts.filter(
    (post) =>
      isDateWithinRange(
        post.visit_date,
        previousWeekRange.start,
        previousWeekRange.end
      )
  );

  const currentSummary =
    createWeeklySummary(currentWeekPosts);

  const previousSummary =
    createWeeklySummary(previousWeekPosts);

  const visitDifference =
    currentSummary.visitCount -
    previousSummary.visitCount;

  const weekLabel = createWeekLabel(
    currentWeekRange.start,
    currentWeekRange.end
  );

  return (
    <section
      aria-labelledby="weekly-sauna-summary-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border/50
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
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
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Activity
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
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
              Weekly Summary
            </p>
          </div>

          <h2
            id="weekly-sauna-summary-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            今週のサ活
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            今週の整いを、数字で振り返ります。
          </p>
        </div>

        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-border/60
            bg-background/75
            px-4
            py-2
            text-xs
            font-semibold
            text-muted-foreground
          "
        >
          <CalendarDays
            className="size-3.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          {weekLabel}
        </div>
      </div>

      <div
        className="
          grid
          gap-4
          p-5
          sm:grid-cols-2
          sm:p-8
          lg:grid-cols-4
        "
      >
        <SummaryCard
          label="サ活回数"
          value={`${currentSummary.visitCount}`}
          unit="回"
          description="今週訪れた回数"
          icon={
            <Flame
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
        />

        <SummaryCard
          label="合計セット"
          value={`${currentSummary.totalSets}`}
          unit="セット"
          description="今週積み重ねたセット数"
          icon={
            <Activity
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
        />

        <SummaryCard
          label="平均評価"
          value={
            currentSummary.averageRating !== null
              ? currentSummary.averageRating.toFixed(1)
              : "—"
          }
          unit={
            currentSummary.averageRating !== null
              ? "/ 5"
              : ""
          }
          description={
            currentSummary.averageRating !== null
              ? "今週のサ活満足度"
              : "評価付きの記録はありません"
          }
          icon={
            <Star
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
        />

        <ComparisonCard
          difference={visitDifference}
          previousVisitCount={
            previousSummary.visitCount
          }
        />
      </div>

      {currentSummary.visitCount === 0 && (
        <div
          className="
            border-t
            border-border/50
            px-5
            py-6
            sm:px-8
          "
        >
          <p
            className="
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            今週のサ活はまだ記録されていません。
            次のサウナ時間を楽しんだら、
            TOTONOに記録してみましょう。
          </p>
        </div>
      )}
    </section>
  );
}

type SummaryCardProps = {
  label: string;
  value: string;
  unit: string;
  description: string;
  icon: React.ReactNode;
};

function SummaryCard({
  label,
  value,
  unit,
  description,
  icon,
}: SummaryCardProps) {
  return (
    <article
      className="
        rounded-[1.5rem]
        border
        border-border/55
        bg-background/70
        px-5
        py-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-xs
            font-semibold
            text-muted-foreground
          "
        >
          {label}
        </p>

        <span
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-full
            bg-secondary/18
            text-foreground
          "
        >
          {icon}
        </span>
      </div>

      <div
        className="
          mt-5
          flex
          items-end
          gap-1.5
        "
      >
        <span
          className="
            text-3xl
            font-semibold
            tracking-[-0.05em]
            text-foreground
          "
        >
          {value}
        </span>

        {unit && (
          <span
            className="
              pb-1
              text-xs
              font-semibold
              text-muted-foreground
            "
          >
            {unit}
          </span>
        )}
      </div>

      <p
        className="
          mt-3
          text-xs
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </article>
  );
}

type ComparisonCardProps = {
  difference: number;
  previousVisitCount: number;
};

function ComparisonCard({
  difference,
  previousVisitCount,
}: ComparisonCardProps) {
  const isIncrease = difference > 0;
  const isDecrease = difference < 0;

  let valueText = "±0";
  let description =
    "先週と同じペースです";

  if (isIncrease) {
    valueText = `+${difference}`;
    description =
      "先週よりサ活が増えています";
  }

  if (isDecrease) {
    valueText = `${difference}`;
    description =
      "先週よりゆったりしたペースです";
  }

  if (
    previousVisitCount === 0 &&
    difference > 0
  ) {
    description =
      "今週からサ活が始まりました";
  }

  return (
    <article
      className="
        rounded-[1.5rem]
        border
        border-border/55
        bg-background/70
        px-5
        py-5
      "
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-xs
            font-semibold
            text-muted-foreground
          "
        >
          先週との比較
        </p>

        <span
          className="
            flex
            size-9
            items-center
            justify-center
            rounded-full
            bg-accent/18
            text-foreground
          "
        >
          {isDecrease ? (
            <TrendingDown
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ) : (
            <TrendingUp
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          )}
        </span>
      </div>

      <div
        className="
          mt-5
          flex
          items-end
          gap-1.5
        "
      >
        <span
          className="
            text-3xl
            font-semibold
            tracking-[-0.05em]
            text-foreground
          "
        >
          {valueText}
        </span>

        <span
          className="
            pb-1
            text-xs
            font-semibold
            text-muted-foreground
          "
        >
          回
        </span>
      </div>

      <p
        className="
          mt-3
          text-xs
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </article>
  );
}

function createWeeklySummary(
  posts: WeeklySummaryPost[]
): WeeklySummary {
  const visitCount = posts.length;

  const totalSets = posts.reduce(
    (total, post) =>
      total +
      normalizePositiveNumber(
        post.set_count
      ),
    0
  );

  const validRatings = posts
    .map((post) => post.rating)
    .filter(
      (rating) =>
        Number.isFinite(rating) &&
        rating > 0
    );

  const averageRating =
    validRatings.length > 0
      ? validRatings.reduce(
          (total, rating) =>
            total + rating,
          0
        ) / validRatings.length
      : null;

  return {
    visitCount,
    totalSets,
    averageRating,
  };
}

function normalizePositiveNumber(
  value: number
): number {
  if (!Number.isFinite(value) || value < 0) {
    return 0;
  }

  return value;
}

type DateRange = {
  start: Date;
  end: Date;
};

function getCurrentWeekRangeInJapan(): DateRange {
  const todayText =
    new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());

  const today = createDateFromJapanDateText(
    todayText
  );

  const dayOfWeek = today.getDay();

  const daysSinceMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1;

  const start = new Date(today);

  start.setDate(
    today.getDate() - daysSinceMonday
  );

  const end = new Date(start);

  end.setDate(start.getDate() + 6);

  return {
    start,
    end,
  };
}

function getPreviousWeekRange(
  currentWeekRange: DateRange
): DateRange {
  const start = new Date(
    currentWeekRange.start
  );

  start.setDate(start.getDate() - 7);

  const end = new Date(
    currentWeekRange.end
  );

  end.setDate(end.getDate() - 7);

  return {
    start,
    end,
  };
}

function isDateWithinRange(
  dateText: string,
  start: Date,
  end: Date
): boolean {
  const date =
    createDateFromJapanDateText(
      dateText
    );

  if (Number.isNaN(date.getTime())) {
    return false;
  }

  return date >= start && date <= end;
}

function createDateFromJapanDateText(
  dateText: string
): Date {
  const normalizedDateText =
    dateText.slice(0, 10);

  return new Date(
    `${normalizedDateText}T00:00:00+09:00`
  );
}

function createWeekLabel(
  start: Date,
  end: Date
): string {
  const formatter =
    new Intl.DateTimeFormat(
      "ja-JP",
      {
        timeZone: "Asia/Tokyo",
        month: "numeric",
        day: "numeric",
      }
    );

  return `${formatter.format(
    start
  )}〜${formatter.format(end)}`;
}
