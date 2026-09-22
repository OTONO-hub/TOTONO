"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Flame,
  Star,
} from "lucide-react";
import { useMemo, useState } from "react";

import type { JournalPost } from "@/services/journal";

type JournalCalendarProps = {
  initialYearMonth: string;
  posts: JournalPost[];
};

type CalendarDay = {
  key: string;
  day: number | null;
  date: string | null;
  posts: JournalPost[];
};

const WEEKDAY_LABELS = ["月", "火", "水", "木", "金", "土", "日"];

function getMonthLabel(yearMonth: string): string {
  const [yearText, monthText] = yearMonth.split("-");
  const month = Number(monthText);

  if (!yearText || !Number.isInteger(month)) {
    return yearMonth;
  }

  return `${yearText}年${month}月`;
}

function moveMonth(yearMonth: string, amount: number): string {
  const [yearText, monthText] = yearMonth.split("-");
  const year = Number(yearText);
  const month = Number(monthText);

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    month < 1 ||
    month > 12
  ) {
    return yearMonth;
  }

  const nextDate = new Date(
    Date.UTC(year, month - 1 + amount, 1)
  );

  return `${nextDate.getUTCFullYear()}-${String(
    nextDate.getUTCMonth() + 1
  ).padStart(2, "0")}`;
}

function createCalendarDays(
  yearMonth: string,
  posts: JournalPost[]
): CalendarDay[] {
  const [yearText, monthText] = yearMonth.split("-");
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

  const postsByDate = new Map<string, JournalPost[]>();

  for (const post of posts) {
    if (!post.visit_date.startsWith(yearMonth)) {
      continue;
    }

    const currentPosts = postsByDate.get(post.visit_date) ?? [];
    currentPosts.push(post);
    postsByDate.set(post.visit_date, currentPosts);
  }

  const daysInMonth = new Date(Date.UTC(year, month, 0)).getUTCDate();
  const firstDay = new Date(Date.UTC(year, month - 1, 1)).getUTCDay();
  const leadingEmptyDays = (firstDay + 6) % 7;
  const calendarDays: CalendarDay[] = [];

  for (let index = 0; index < leadingEmptyDays; index += 1) {
    calendarDays.push({
      key: `empty-leading-${index}`,
      day: null,
      date: null,
      posts: [],
    });
  }

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = `${yearMonth}-${String(day).padStart(2, "0")}`;

    calendarDays.push({
      key: date,
      day,
      date,
      posts: postsByDate.get(date) ?? [],
    });
  }

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

function formatSelectedDate(date: string): string {
  const parsedDate = new Date(`${date}T00:00:00+09:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return date;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(parsedDate);
}

export function JournalCalendar({
  initialYearMonth,
  posts,
}: JournalCalendarProps) {
  const [yearMonth, setYearMonth] = useState(initialYearMonth);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const calendarDays = useMemo(
    () => createCalendarDays(yearMonth, posts),
    [posts, yearMonth]
  );

  const monthPosts = useMemo(
    () => posts.filter((post) => post.visit_date.startsWith(yearMonth)),
    [posts, yearMonth]
  );

  const selectedPosts = useMemo(
    () =>
      selectedDate
        ? posts.filter((post) => post.visit_date === selectedDate)
        : [],
    [posts, selectedDate]
  );

  const today = getTodayInJapan();
  const monthLabel = getMonthLabel(yearMonth);

  const changeMonth = (amount: number) => {
    setYearMonth((current) => moveMonth(current, amount));
    setSelectedDate(null);
  };

  if (calendarDays.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="journal-calendar-heading"
      className="overflow-hidden rounded-[2rem] border border-border/55 bg-card/90 shadow-sm backdrop-blur-md sm:rounded-[2.5rem]"
    >
      <div className="flex flex-col gap-5 border-b border-border/45 px-5 py-6 sm:flex-row sm:items-end sm:justify-between sm:px-8 sm:py-7">
        <div>
          <div className="flex items-center gap-3">
            <span className="flex size-10 items-center justify-center rounded-full bg-secondary/20 text-foreground">
              <CalendarDays className="size-4" strokeWidth={1.7} aria-hidden="true" />
            </span>
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-muted-foreground">
              Sauna Calendar
            </p>
          </div>

          <h2
            id="journal-calendar-heading"
            className="mt-4 text-2xl font-semibold tracking-[-0.035em] text-foreground sm:text-3xl"
          >
            {monthLabel}の記録
          </h2>
          <p className="mt-3 text-sm leading-7 text-muted-foreground">
            日付を選ぶと、その日のサ活を振り返れます。
          </p>
        </div>

        <div className="flex items-center justify-between gap-3 sm:justify-end" aria-label="表示月を変更">
          <button
            type="button"
            onClick={() => changeMonth(-1)}
            aria-label="前月を表示"
            className="flex size-11 items-center justify-center rounded-full border border-border/60 bg-background text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ChevronLeft className="size-4" aria-hidden="true" />
          </button>
          <span className="min-w-28 text-center text-sm font-semibold tabular-nums">
            {monthLabel}
          </span>
          <button
            type="button"
            onClick={() => changeMonth(1)}
            aria-label="翌月を表示"
            className="flex size-11 items-center justify-center rounded-full border border-border/60 bg-background text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <ChevronRight className="size-4" aria-hidden="true" />
          </button>
        </div>
      </div>

      <div className="px-4 py-5 sm:px-7 sm:py-7">
        <div className="grid grid-cols-7 border-b border-border/45">
          {WEEKDAY_LABELS.map((weekday, index) => (
            <div key={weekday} className="px-1 pb-3 text-center text-xs font-semibold text-muted-foreground">
              <span className={index >= 5 ? "text-foreground/65" : undefined}>
                {weekday}
              </span>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 pt-2 sm:gap-2">
          {calendarDays.map((calendarDay) => {
            if (calendarDay.day === null || calendarDay.date === null) {
              return <div key={calendarDay.key} aria-hidden="true" className="aspect-square" />;
            }

            const hasPosts = calendarDay.posts.length > 0;
            const isToday = calendarDay.date === today;
            const isSelected = calendarDay.date === selectedDate;

            return (
              <button
                key={calendarDay.key}
                type="button"
                onClick={() => setSelectedDate(calendarDay.date)}
                aria-pressed={isSelected}
                aria-label={`${monthLabel}${calendarDay.day}日${
                  hasPosts ? `、サ活${calendarDay.posts.length}件` : "、サ活なし"
                }`}
                className={`relative flex aspect-square min-w-0 flex-col items-center justify-center rounded-xl border text-xs font-semibold tabular-nums transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 sm:rounded-2xl ${
                  isSelected
                    ? "border-foreground bg-foreground text-background"
                    : hasPosts
                      ? "border-accent/35 bg-accent/10 text-foreground hover:bg-accent/20"
                      : "border-transparent text-muted-foreground hover:bg-muted/60"
                }`}
              >
                <span className={isToday && !isSelected ? "underline decoration-accent decoration-2 underline-offset-4" : undefined}>
                  {calendarDay.day}
                </span>
                {hasPosts ? (
                  <span
                    aria-hidden="true"
                    className={`absolute bottom-1.5 size-1.5 rounded-full sm:bottom-2 ${
                      isSelected ? "bg-accent" : "bg-foreground"
                    }`}
                  />
                ) : null}
              </button>
            );
          })}
        </div>

        {monthPosts.length === 0 ? (
          <div className="mt-6 rounded-2xl border border-dashed border-border/60 bg-muted/20 px-5 py-10 text-center">
            <Flame className="mx-auto size-5 text-muted-foreground" aria-hidden="true" />
            <h3 className="mt-4 text-sm font-semibold">この月のサ活はまだありません</h3>
            <p className="mt-2 text-xs leading-6 text-muted-foreground">
              サ活を記録すると、カレンダーに印がつきます。
            </p>
          </div>
        ) : selectedDate ? (
          <div className="mt-6 border-t border-border/45 pt-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">Selected Day</p>
                <h3 className="mt-2 text-lg font-semibold">{formatSelectedDate(selectedDate)}</h3>
              </div>
              <span className="text-xs font-medium text-muted-foreground">{selectedPosts.length}件</span>
            </div>

            {selectedPosts.length === 0 ? (
              <p className="mt-4 rounded-2xl bg-muted/35 px-4 py-5 text-sm text-muted-foreground">
                この日のサ活記録はありません。
              </p>
            ) : (
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                {selectedPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/posts/${post.id}`}
                    className="group rounded-2xl border border-border/55 bg-background/70 p-4 transition hover:-translate-y-0.5 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 motion-reduce:transform-none"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <h4 className="truncate text-sm font-semibold">{post.sauna_name}</h4>
                        <p className="mt-2 text-xs text-muted-foreground">{post.set_count}セット</p>
                      </div>
                      <span className="flex items-center gap-1 text-xs font-semibold">
                        <Star className="size-3.5 fill-accent text-accent" aria-hidden="true" />
                        {post.rating.toFixed(1)}
                      </span>
                    </div>
                    <span className="mt-4 flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground group-hover:text-foreground">
                      詳細を見る
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="mt-6 border-t border-border/45 pt-5 text-center text-xs text-muted-foreground">
            印のある日付を選ぶと、その日の記録を表示します。
          </p>
        )}
      </div>
    </section>
  );
}
