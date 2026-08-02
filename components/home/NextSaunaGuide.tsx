import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  Check,
  Clock3,
  Search,
  Sparkles,
} from "lucide-react";

export type NextSaunaGuidePost = {
  visit_date: string;
};

type NextSaunaGuideProps = {
  posts: NextSaunaGuidePost[];
};

type SaunaGuideStatus =
  | "first"
  | "today"
  | "soon"
  | "recommended"
  | "overdue";

type SaunaGuide = {
  status: SaunaGuideStatus;
  timingLabel: string;
  title: string;
  description: string;
  daysSinceLastVisit: number | null;
  lastVisitLabel: string;
  actionLabel: string;
  actionHref: string;
};

export function NextSaunaGuide({
  posts,
}: NextSaunaGuideProps) {
  const guide = createSaunaGuide(posts);

  return (
    <section
      aria-labelledby="next-sauna-guide-heading"
      className="
        relative
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
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          size-72
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-24
          -left-20
          size-64
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          grid
          gap-8
          px-5
          py-6
          sm:px-8
          sm:py-8
          lg:grid-cols-[minmax(0,1fr)_19rem]
          lg:items-center
          lg:gap-12
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
              <Sparkles
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
              Next Sauna Day
            </p>
          </div>

          <h2
            id="next-sauna-guide-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            次の整いを考える
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            {guide.description}
          </p>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
            "
          >
            <Link
              href={guide.actionHref}
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-primary
                px-5
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                active:translate-y-0
                sm:w-auto
              "
            >
              {guide.actionHref ===
              "/search" ? (
                <Search
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              ) : (
                <Check
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              )}

              {guide.actionLabel}

              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </Link>

            <Link
              href="/posts/new"
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                rounded-full
                border
                border-border/65
                bg-background/70
                px-5
                text-sm
                font-semibold
                text-foreground
                transition
                duration-200
                hover:-translate-y-0.5
                hover:bg-background
                hover:shadow-sm
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                active:translate-y-0
                sm:w-auto
              "
            >
              サ活を記録する
            </Link>
          </div>
        </div>

        <div
          className="
            overflow-hidden
            rounded-[1.75rem]
            border
            border-border/55
            bg-background/75
            shadow-sm
          "
        >
          <div
            className="
              border-b
              border-border/50
              px-5
              py-5
            "
          >
            <div
              className="
                flex
                items-center
                justify-between
                gap-4
              "
            >
              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    text-muted-foreground
                  "
                >
                  おすすめタイミング
                </p>

                <p
                  className="
                    mt-2
                    text-2xl
                    font-semibold
                    tracking-[-0.04em]
                    text-foreground
                  "
                >
                  {guide.timingLabel}
                </p>
              </div>

              <span
                className="
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/20
                  text-foreground
                "
              >
                <CalendarDays
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>
            </div>
          </div>

          <div
            className="
              px-5
              py-5
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
              "
            >
              <span
                className="
                  mt-0.5
                  flex
                  size-8
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-accent/18
                  text-foreground
                "
              >
                <Clock3
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <div>
                <p
                  className="
                    text-xs
                    font-semibold
                    text-muted-foreground
                  "
                >
                  最後のサ活
                </p>

                <p
                  className="
                    mt-1
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  {guide.lastVisitLabel}
                </p>
              </div>
            </div>

            <p
              className="
                mt-5
                text-xs
                leading-6
                text-muted-foreground
              "
            >
              TOTONOに記録されたサ活履歴をもとに、
              次の行き先を考える目安を表示しています。
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function createSaunaGuide(
  posts: NextSaunaGuidePost[]
): SaunaGuide {
  const validVisitDates = posts
    .map((post) =>
      createDateFromJapanDateText(
        post.visit_date
      )
    )
    .filter(
      (date) =>
        !Number.isNaN(date.getTime())
    )
    .sort(
      (dateA, dateB) =>
        dateB.getTime() -
        dateA.getTime()
    );

  const lastVisitDate =
    validVisitDates[0] ?? null;

  if (!lastVisitDate) {
    return {
      status: "first",
      timingLabel: "はじめてのサ活",
      title: "最初のサウナを探す",
      description:
        "まだサ活の記録がありません。気になる施設を探して、TOTONOで最初の整いを始めましょう。",
      daysSinceLastVisit: null,
      lastVisitLabel:
        "まだ記録がありません",
      actionLabel:
        "最初のサウナを探す",
      actionHref: "/search",
    };
  }

  const today =
    getTodayInJapan();

  const daysSinceLastVisit =
    calculateDifferenceInDays(
      lastVisitDate,
      today
    );

  const lastVisitLabel =
    createLastVisitLabel(
      lastVisitDate,
      daysSinceLastVisit
    );

  if (daysSinceLastVisit === 0) {
    return {
      status: "today",
      timingLabel: "今日は余韻の日",
      title: "今日のサ活を振り返る",
      description:
        "今日はすでにサ活を楽しんでいます。施設の感想やセット数を記録して、今日の整いを残しましょう。",
      daysSinceLastVisit,
      lastVisitLabel,
      actionLabel:
        "今日のサ活を記録する",
      actionHref: "/posts/new",
    };
  }

  if (daysSinceLastVisit <= 3) {
    return {
      status: "soon",
      timingLabel: "数日後",
      title: "余韻を楽しむ",
      description:
        "前回のサ活からまだ日が浅いようです。みんなのサ活を眺めながら、次に行きたい施設をゆっくり探してみましょう。",
      daysSinceLastVisit,
      lastVisitLabel,
      actionLabel:
        "次の候補を探す",
      actionHref: "/search",
    };
  }

  if (daysSinceLastVisit <= 7) {
    return {
      status: "recommended",
      timingLabel:
        createRecommendedTimingLabel(
          today
        ),
      title: "次のサウナを考える",
      description:
        "前回のサ活から少し時間が経ちました。そろそろ次の整いに向けて、気になる施設を探してみませんか。",
      daysSinceLastVisit,
      lastVisitLabel,
      actionLabel:
        "次のサウナを探す",
      actionHref: "/search",
    };
  }

  return {
    status: "overdue",
    timingLabel: "そろそろ",
    title: "久しぶりのサウナへ",
    description:
      "前回のサ活から一週間以上経っています。予定に合う施設を見つけて、久しぶりのサウナ時間を考えてみましょう。",
    daysSinceLastVisit,
    lastVisitLabel,
    actionLabel:
      "行きたい施設を探す",
    actionHref: "/search",
  };
}

function getTodayInJapan(): Date {
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

  return createDateFromJapanDateText(
    todayText
  );
}

function calculateDifferenceInDays(
  fromDate: Date,
  toDate: Date
): number {
  const differenceInMilliseconds =
    toDate.getTime() -
    fromDate.getTime();

  return Math.max(
    0,
    Math.floor(
      differenceInMilliseconds /
        86400000
    )
  );
}

function createLastVisitLabel(
  lastVisitDate: Date,
  daysSinceLastVisit: number
): string {
  if (daysSinceLastVisit === 0) {
    return "今日";
  }

  if (daysSinceLastVisit === 1) {
    return "昨日";
  }

  const formattedDate =
    new Intl.DateTimeFormat(
      "ja-JP",
      {
        timeZone: "Asia/Tokyo",
        month: "long",
        day: "numeric",
      }
    ).format(lastVisitDate);

  return `${daysSinceLastVisit}日前・${formattedDate}`;
}

function createRecommendedTimingLabel(
  today: Date
): string {
  const dayOfWeek = today.getDay();

  if (
    dayOfWeek === 0 ||
    dayOfWeek === 6
  ) {
    return "今日・明日";
  }

  if (
    dayOfWeek === 4 ||
    dayOfWeek === 5
  ) {
    return "今週末";
  }

  return "数日以内";
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
