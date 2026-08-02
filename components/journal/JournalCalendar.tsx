import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
} from "lucide-react";

import type { JournalPost } from "@/services/journal";

type JournalCalendarProps = {
  yearMonth: string;
  monthLabel: string;
  posts: JournalPost[];
};

type CalendarDay = {
  key: string;
  day: number | null;
  date: string | null;
  posts: JournalPost[];
};

const WEEKDAY_LABELS = [
  "月",
  "火",
  "水",
  "木",
  "金",
  "土",
  "日",
];

function createCalendarDays(
  yearMonth: string,
  posts: JournalPost[]
): CalendarDay[] {
  const [yearText, monthText] =
    yearMonth.split("-");

  const year = Number(yearText);
  const month = Number(monthText);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return [];
  }

  const postsByDate = new Map<
    string,
    JournalPost[]
  >();

  for (const post of posts) {
    const currentPosts =
      postsByDate.get(post.visit_date) ?? [];

    currentPosts.push(post);

    postsByDate.set(
      post.visit_date,
      currentPosts
    );
  }

  const daysInMonth = new Date(
    Date.UTC(year, month, 0)
  ).getUTCDate();

  const firstDay = new Date(
    Date.UTC(year, month - 1, 1)
  ).getUTCDay();

  /*
   * JavaScriptは日曜日を0として扱います。
   * 今回のカレンダーは月曜日始まりなので、
   * 月曜日を0へ変換します。
   */
  const leadingEmptyDays =
    (firstDay + 6) % 7;

  const calendarDays: CalendarDay[] = [];

  for (
    let index = 0;
    index < leadingEmptyDays;
    index += 1
  ) {
    calendarDays.push({
      key: `empty-leading-${index}`,
      day: null,
      date: null,
      posts: [],
    });
  }

  for (
    let day = 1;
    day <= daysInMonth;
    day += 1
  ) {
    const date = `${yearText}-${monthText}-${String(
      day
    ).padStart(2, "0")}`;

    calendarDays.push({
      key: date,
      day,
      date,
      posts: postsByDate.get(date) ?? [],
    });
  }

  /*
   * 最後の週も7日分表示されるように
   * 空のセルを追加します。
   */
  while (calendarDays.length % 7 !== 0) {
    calendarDays.push({
      key: `empty-trailing-${calendarDays.length}`,
      day: null,
      date: null,
      posts: [],
    });
  }

  return calendarDays;
}

function getTodayInJapan(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function JournalCalendar({
  yearMonth,
  monthLabel,
  posts,
}: JournalCalendarProps) {
  const calendarDays = createCalendarDays(
    yearMonth,
    posts
  );

  const today = getTodayInJapan();

  if (calendarDays.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="journal-calendar-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:rounded-[2.5rem]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b border-border/45
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
                bg-secondary/20
                text-foreground
              "
            >
              <CalendarDays
                className="size-4"
                strokeWidth={1.7}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              Monthly Calendar
            </p>
          </div>

          <h2
            id="journal-calendar-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-foreground
              sm:text-3xl
            "
          >
            {monthLabel}の記録
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            サウナへ行った日を、月ごとに振り返れます。
          </p>
        </div>

        <div
          className="
            inline-flex
            items-center
            gap-2
            text-xs
            font-medium
            text-muted-foreground
          "
        >
          <span
            aria-hidden="true"
            className="
              size-2.5
              rounded-full
              bg-accent
            "
          />

          サ活を記録した日
        </div>
      </div>

      <div
        className="
          overflow-x-auto
          px-4
          py-5
          sm:px-7
          sm:py-7
        "
      >
        <div className="min-w-[42rem]">
          <div
            className="
              grid
              grid-cols-7
              border-b border-border/45
            "
          >
            {WEEKDAY_LABELS.map(
              (weekday, index) => (
                <div
                  key={weekday}
                  className="
                    px-2
                    pb-3
                    text-center
                    text-xs
                    font-semibold
                    text-muted-foreground
                  "
                >
                  <span
                    className={
                      index >= 5
                        ? "text-foreground/65"
                        : undefined
                    }
                  >
                    {weekday}
                  </span>
                </div>
              )
            )}
          </div>

          <div
            className="
              grid
              grid-cols-7
            "
          >
            {calendarDays.map((calendarDay) => {
              if (
                calendarDay.day === null ||
                calendarDay.date === null
              ) {
                return (
                  <div
                    key={calendarDay.key}
                    aria-hidden="true"
                    className="
                      min-h-28
                      border-b
                      border-r
                      border-border/35
                      bg-muted/10
                      p-2
                    "
                  />
                );
              }

              const hasPosts =
                calendarDay.posts.length > 0;

              const isToday =
                calendarDay.date === today;

              const firstPost =
                calendarDay.posts[0];

              return (
                <div
                  key={calendarDay.key}
                  className="
                    relative
                    min-h-28
                    border-b
                    border-r
                    border-border/35
                    p-2
                    sm:p-3
                  "
                >
                  <div
                    className="
                      flex
                      items-center
                      justify-between
                      gap-2
                    "
                  >
                    <span
                      className={`
                        flex
                        size-7
                        items-center
                        justify-center
                        rounded-full
                        text-xs
                        font-semibold
                        tabular-nums
                        ${
                          isToday
                            ? "bg-foreground text-background"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {calendarDay.day}
                    </span>

                    {calendarDay.posts.length > 1 ? (
                      <span
                        className="
                          rounded-full
                          bg-muted
                          px-2
                          py-0.5
                          text-[0.65rem]
                          font-semibold
                          text-muted-foreground
                        "
                      >
                        {calendarDay.posts.length}件
                      </span>
                    ) : null}
                  </div>

                  {hasPosts && firstPost ? (
                    <Link
                      href={`/posts/${firstPost.id}`}
                      className="
                        group
                        mt-3
                        block
                        rounded-xl
                        border border-accent/20
                        bg-accent/10
                        p-2.5
                        transition-colors
                        hover:bg-accent/15
                        motion-reduce:transition-none
                      "
                    >
                      <span
                        className="
                          block
                          truncate
                          text-xs
                          font-semibold
                          text-foreground
                        "
                      >
                        {firstPost.sauna_name}
                      </span>

                      <span
                        className="
                          mt-1.5
                          flex
                          items-center
                          justify-between
                          gap-2
                          text-[0.65rem]
                          text-muted-foreground
                        "
                      >
                        {firstPost.set_count}セット

                        <ArrowRight
                          className="
                            size-3
                            transition-transform
                            group-hover:translate-x-0.5
                            motion-reduce:transition-none
                          "
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>
                    </Link>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
