"use client";

import {
  useCallback,
  useEffect,
  useId,
  useMemo,
  useState,
} from "react";
import {
  CalendarDays,
  CheckCircle2,
  Clock3,
  History,
} from "lucide-react";

import { useTodaySauna } from "@/components/search/use-today-sauna";
import { PageSection } from "@/components/ui/page-section";
import { TODAY_JOURNEY_UPDATED_EVENT } from "@/lib/today-journey-events";
import {
  loadTodayJourneyHistory,
  saveTodayJourneySnapshot,
  type TodayJourneyHistoryEntry,
} from "@/lib/today-journey-history";
import { TODAY_JOURNEY_STEPS } from "@/lib/today-journey-storage";

const MAXIMUM_HISTORY_COUNT = 7;
const MINIMUM_PROGRESS = 0;
const MAXIMUM_PROGRESS = 100;

type NormalizedJourneyHistoryEntry =
  TodayJourneyHistoryEntry & {
    progress: number;
    saunaName: string;
  };

function getJapanDateKey(date = new Date()): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(date);
}

function formatDateLabel(date: string): string {
  const today = getJapanDateKey();
  const yesterdayDate = new Date();
  yesterdayDate.setDate(yesterdayDate.getDate() - 1);

  if (date === today) {
    return "今日";
  }

  if (date === getJapanDateKey(yesterdayDate)) {
    return "昨日";
  }

  const parsedDate = new Date(`${date}T00:00:00+09:00`);

  if (Number.isNaN(parsedDate.getTime())) {
    return "日付不明";
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "numeric",
    day: "numeric",
    weekday: "short",
  }).format(parsedDate);
}

function getStepTitle(stepId: string): string {
  return (
    TODAY_JOURNEY_STEPS.find((step) => step.id === stepId)?.title ??
    "Journey進行中"
  );
}

function normalizeProgress(progress: number): number {
  if (!Number.isFinite(progress)) {
    return MINIMUM_PROGRESS;
  }

  return Math.max(
    MINIMUM_PROGRESS,
    Math.min(MAXIMUM_PROGRESS, Math.round(progress))
  );
}

function normalizeHistoryEntry(
  entry: TodayJourneyHistoryEntry
): NormalizedJourneyHistoryEntry {
  return {
    ...entry,
    progress: normalizeProgress(entry.progress),
    saunaName: entry.saunaName.trim() || "名称未登録のサウナ施設",
  };
}

export function TodayJourneyHistory() {
  const [todaySauna] = useTodaySauna();
  const descriptionId = useId();

  const [history, setHistory] = useState<TodayJourneyHistoryEntry[]>(() =>
    loadTodayJourneyHistory()
  );

  const refreshHistory = useCallback(() => {
    setHistory(loadTodayJourneyHistory());
  }, []);

  useEffect(() => {
    let refreshTimer: number | null = null;

    if (todaySauna) {
      try {
        saveTodayJourneySnapshot(todaySauna);
      } catch (error) {
        console.error("Journey履歴の保存に失敗しました。", error);
      }

      refreshTimer = window.setTimeout(refreshHistory, 0);
    }

    const handleJourneyUpdated = () => {
      refreshHistory();
    };

    const handleStorage = () => {
      refreshHistory();
    };

    const handleFocus = () => {
      refreshHistory();
    };

    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshHistory();
      }
    };

    window.addEventListener(
      TODAY_JOURNEY_UPDATED_EVENT,
      handleJourneyUpdated
    );
    window.addEventListener("storage", handleStorage);
    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      if (refreshTimer !== null) {
        window.clearTimeout(refreshTimer);
      }

      window.removeEventListener(
        TODAY_JOURNEY_UPDATED_EVENT,
        handleJourneyUpdated
      );
      window.removeEventListener("storage", handleStorage);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [refreshHistory, todaySauna]);

  const recentHistory = useMemo(
    () =>
      history
        .slice(0, MAXIMUM_HISTORY_COUNT)
        .map(normalizeHistoryEntry),
    [history]
  );

  return (
    <PageSection>
      <section
        aria-labelledby="journey-history-heading"
      aria-describedby={descriptionId}
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-border/45
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-7
        "
      >
        <div>
          <div className="flex items-center gap-3">
            <span
              aria-hidden="true"
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-secondary/25
                text-foreground
              "
            >
              <History
                aria-hidden="true"
                className="size-[1.125rem]"
                strokeWidth={1.8}
              />
            </span>

            <p
              className="
                text-[0.6875rem]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-muted-foreground
              "
            >
              Journey History
            </p>
          </div>

          <h2
            id="journey-history-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-foreground
            "
          >
            最近のJourney
          </h2>
        </div>

        <p
          id={descriptionId}
          className="text-sm leading-6 text-muted-foreground"
        >
          {recentHistory.length > 0
            ? `直近${recentHistory.length}件のサウナ体験`
            : "直近のサウナ体験を表示します"}
        </p>
      </div>

      {recentHistory.length === 0 ? (
        <div role="status" className="px-5 py-10 text-center sm:px-7">
          <CalendarDays
            aria-hidden="true"
            className="mx-auto size-8 text-muted-foreground"
            strokeWidth={1.5}
          />

          <p className="mt-4 text-sm font-semibold text-foreground">
            Journey履歴はまだありません
          </p>

          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            今日のサウナを設定すると、ここに体験が残ります。
          </p>
        </div>
      ) : (
        <div
          role="list"
          aria-label="最近のJourney履歴"
          className="divide-y divide-border/45"
        >
          {recentHistory.map((entry) => {
            const isComplete = entry.progress === MAXIMUM_PROGRESS;
            const stepTitle = getStepTitle(entry.currentStepId);
            const dateLabel = formatDateLabel(entry.date);
            const stateLabel = isComplete ? "完了" : "進行中";

            return (
              <article
                key={`${entry.date}-${entry.saunaId}`}
                role="listitem"
                aria-label={`${dateLabel}、${entry.saunaName}、現在のステップは${stepTitle}、進行率${entry.progress}%、${stateLabel}`}
                className="
                  grid
                  gap-4
                  px-5
                  py-5
                  sm:grid-cols-[7rem_minmax(0,1fr)_8rem]
                  sm:items-center
                  sm:px-7
                "
              >
                <div aria-hidden="true">
                  <p className="text-sm font-semibold text-foreground">
                    {dateLabel}
                  </p>

                  <time
                    dateTime={entry.date}
                    className="
                      mt-1
                      block
                      text-xs
                      tabular-nums
                      text-muted-foreground
                    "
                  >
                    {entry.date}
                  </time>
                </div>

                <div aria-hidden="true" className="min-w-0">
                  <p
                    className="truncate text-sm font-semibold text-foreground"
                    title={entry.saunaName}
                  >
                    {entry.saunaName}
                  </p>

                  <div
                    className="
                      mt-2
                      flex
                      items-center
                      gap-2
                      text-xs
                      text-muted-foreground
                    "
                  >
                    {isComplete ? (
                      <CheckCircle2
                        aria-hidden="true"
                        className="size-3.5 shrink-0 text-success"
                        strokeWidth={2}
                      />
                    ) : (
                      <Clock3
                        aria-hidden="true"
                        className="size-3.5 shrink-0"
                        strokeWidth={1.8}
                      />
                    )}

                    <span className="truncate">{stepTitle}</span>
                  </div>
                </div>

                <div>
                  <div
                    aria-hidden="true"
                    className="
                      flex
                      items-center
                      justify-between
                      gap-3
                      text-xs
                      font-semibold
                    "
                  >
                    <span
                      className={
                        isComplete ? "text-success" : "text-foreground"
                      }
                    >
                      {entry.progress}%
                    </span>

                    <span className="text-muted-foreground">{stateLabel}</span>
                  </div>

                  <div
                    role="progressbar"
                    aria-label={`${entry.saunaName}のJourney進行状況`}
                    aria-valuetext={`${entry.progress}%、${stateLabel}`}
                    aria-valuemin={MINIMUM_PROGRESS}
                    aria-valuemax={MAXIMUM_PROGRESS}
                    aria-valuenow={entry.progress}
                    className="
                      mt-2
                      h-1.5
                      overflow-hidden
                      rounded-full
                      bg-muted
                    "
                  >
                    <div
                      aria-hidden="true"
                      className={`
                        h-full
                        rounded-full
                        transition-[width]
                        duration-500
                        ease-out
                        motion-reduce:transition-none
                        ${isComplete ? "bg-success" : "bg-primary"}
                      `}
                      style={{
                        width: `${entry.progress}%`,
                      }}
                    />
                  </div>
                </div>
              </article>
            );
          })}
        </div>
        )}
      </section>
    </PageSection>
  );
}
