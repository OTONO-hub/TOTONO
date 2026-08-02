"use client";

import {
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import {
  Check,
  CheckCircle2,
  Clock3,
  Coffee,
  Footprints,
  MapPin,
  NotebookPen,
  Play,
  RotateCcw,
  Sparkles,
  Timer,
  Waves,
} from "lucide-react";

import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";
import {
  createTodayPostHref,
  getTodayJourneyProgress,
  getTodayJourneyStepIndex,
  loadTodayJourneyState,
  saveTodayArrivalTime,
  saveTodayJourneyStep,
  type JourneyStepId,
} from "@/lib/today-journey-storage";

type TimelineItem = {
  id: JourneyStepId;
  title: string;
  description: string;
  offsetMinutes: number;
  icon: ReactNode;
};

type TodayTimelineContentProps = {
  sauna: TodaySauna;
};

function addMinutesToTime(
  baseTime: string,
  offsetMinutes: number
): string {
  const [hourText, minuteText] =
    baseTime.split(":");

  const hour = Number(hourText);
  const minute = Number(minuteText);

  const totalMinutes =
    hour * 60 + minute + offsetMinutes;

  const minutesInDay = 24 * 60;

  const normalizedMinutes =
    ((totalMinutes % minutesInDay) +
      minutesInDay) %
    minutesInDay;

  const resultHour = Math.floor(
    normalizedMinutes / 60
  );

  const resultMinute =
    normalizedMinutes % 60;

  return `${String(resultHour).padStart(
    2,
    "0"
  )}:${String(resultMinute).padStart(
    2,
    "0"
  )}`;
}

function TodayTimelineContent({
  sauna,
}: TodayTimelineContentProps) {
  const initialJourneyState =
    loadTodayJourneyState(sauna.id);

  const [arrivalTime, setArrivalTime] =
    useState(
      initialJourneyState.arrivalTime
    );

  const [currentStepId, setCurrentStepId] =
    useState<JourneyStepId>(
      initialJourneyState.currentStepId
    );

  useEffect(() => {
    try {
      saveTodayArrivalTime(
        sauna.id,
        arrivalTime
      );
    } catch {
      // localStorageが利用できない環境でも、
      // 現在の画面内では時刻を維持します。
    }
  }, [arrivalTime, sauna.id]);

  useEffect(() => {
    try {
      saveTodayJourneyStep(
        sauna.id,
        currentStepId
      );
    } catch {
      // localStorageが利用できない環境でも、
      // 現在の画面内では進行状態を維持します。
    }
  }, [currentStepId, sauna.id]);

  const timelineItems =
    useMemo<TimelineItem[]>(
      () => [
        {
          id: "departure",
          title: "施設へ出発",
          description:
            "忘れ物を確認して、余裕を持って出発しましょう。",
          offsetMinutes: -30,
          icon: (
            <Footprints
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ),
        },
        {
          id: "arrival",
          title: "施設へ到着",
          description: `${sauna.name}へ到着する予定です。`,
          offsetMinutes: 0,
          icon: (
            <MapPin
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ),
        },
        {
          id: "sauna",
          title: "サウナを楽しむ",
          description:
            "体調に合わせて、無理のないペースで入りましょう。",
          offsetMinutes: 10,
          icon: (
            <Timer
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ),
        },
        {
          id: "rest",
          title: "休憩・外気浴",
          description:
            "水分を補給しながら、静かに身体を休めます。",
          offsetMinutes: 80,
          icon: (
            <Waves
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ),
        },
        {
          id: "meal",
          title: "サ飯を楽しむ",
          description:
            "整った後の一食を、ゆっくり楽しみましょう。",
          offsetMinutes: 120,
          icon: (
            <Coffee
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ),
        },
        {
          id: "record",
          title: "サ活を記録",
          description:
            "今日感じたことを、忘れないうちに残します。",
          offsetMinutes: 180,
          icon: (
            <NotebookPen
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          ),
        },
      ],
      [sauna.name]
    );

  const currentStepIndex =
    getTodayJourneyStepIndex(
      currentStepId
    );

  const completedCount =
    currentStepIndex + 1;

  const progress =
    getTodayJourneyProgress(
      currentStepId
    );

  const currentStep =
    timelineItems[currentStepIndex] ??
    timelineItems[0];

  const postHref = createTodayPostHref(sauna);

  const handleSelectStep = (
    stepId: JourneyStepId
  ) => {
    setCurrentStepId(stepId);
  };

  const handleResetJourney = () => {
    setCurrentStepId("departure");
  };

  return (
    <PageSection
      as="section"
      aria-labelledby="today-timeline-heading"
    >
      <AppCard
        variant="glass"
        radius="xl"
        padding="none"
        className="bg-card/85"
      >
        <div
          className="
            flex
            flex-col
            gap-6
            border-b
            border-border/45
            px-6
            py-6
            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:px-8
            sm:py-8
            lg:px-10
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              <Sparkles
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Today&apos;s Timeline
            </div>

            <h2
              id="today-timeline-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
                sm:text-3xl
              "
            >
              今日の予定
            </h2>

            <p
              className="
                mt-3
                max-w-2xl
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              到着予定時刻を決めて、
              現在のステップを更新しながら一日の流れを進められます。
            </p>
          </div>

          <label
            className="
              flex
              w-full
              items-center
              justify-between
              gap-4
              rounded-[1.25rem]
              border
              border-border/55
              bg-background/70
              px-4
              py-3
              sm:w-auto
            "
          >
            <span
              className="
                flex
                items-center
                gap-2
                text-sm
                font-semibold
                text-foreground
              "
            >
              <Clock3
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              到着予定
            </span>

            <input
              type="time"
              value={arrivalTime}
              onChange={(event) =>
                setArrivalTime(
                  event.target.value
                )
              }
              aria-label="施設への到着予定時刻"
              className="
                rounded-lg
                border
                border-border/60
                bg-card
                px-3
                py-2
                text-sm
                font-semibold
                text-foreground
                outline-none
                transition
                focus:border-ring
                focus:ring-2
                focus:ring-ring/20
              "
            />
          </label>
        </div>

        <div
          className="
            border-b
            border-border/45
            px-6
            py-5
            sm:px-8
            lg:px-10
          "
        >
          <div
            className="
              flex
              flex-col
              gap-4
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Journey Status
              </p>

              <p className="mt-2 text-base font-semibold text-foreground">
                現在：{currentStep.title}
              </p>
            </div>

            <button
              type="button"
              onClick={handleResetJourney}
              className="
                inline-flex
                min-h-10
                items-center
                justify-center
                gap-2
                self-start
                rounded-full
                px-4
                text-xs
                font-semibold
                text-muted-foreground
                transition
                hover:bg-muted
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                sm:self-auto
              "
            >
              <RotateCcw
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              最初から
            </button>
          </div>

          <div
            className="
              mt-4
              h-2
              overflow-hidden
              rounded-full
              bg-muted
            "
            role="progressbar"
            aria-label="今日のJourney進行状況"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={progress}
          >
            <div
              className="
                h-full
                rounded-full
                bg-success
                transition-[width]
                duration-300
              "
              style={{
                width: `${progress}%`,
              }}
            />
          </div>

          <p className="mt-2 text-xs text-muted-foreground">
            {completedCount} / {timelineItems.length} ステップ完了
          </p>
        </div>

        <div
          className="
            px-6
            py-7
            sm:px-8
            sm:py-9
            lg:px-10
          "
        >
          <ol
            aria-label="今日のサウナ予定"
            className="relative space-y-0"
          >
            {timelineItems.map(
              (item, index) => {
                const isLast =
                  index ===
                  timelineItems.length - 1;

                const itemTime =
                  addMinutesToTime(
                    arrivalTime,
                    item.offsetMinutes
                  );

                const isCompleted =
                  index < currentStepIndex;

                const isCurrent =
                  index === currentStepIndex;

                return (
                  <li
                    key={item.id}
                    className="
                      relative
                      grid
                      grid-cols-[4.5rem_2.75rem_minmax(0,1fr)]
                      gap-3
                      sm:grid-cols-[5.5rem_3rem_minmax(0,1fr)]
                      sm:gap-5
                    "
                  >
                    <time
                      dateTime={itemTime}
                      className={`
                        pt-2
                        text-sm
                        font-semibold
                        tabular-nums
                        sm:text-base
                        ${
                          isCompleted
                            ? "text-muted-foreground"
                            : "text-foreground"
                        }
                      `}
                    >
                      {itemTime}
                    </time>

                    <div className="relative flex justify-center">
                      {!isLast && (
                        <span
                          aria-hidden="true"
                          className={`
                            absolute
                            bottom-0
                            top-11
                            w-px
                            ${
                              isCompleted
                                ? "bg-success/60"
                                : "bg-border"
                            }
                          `}
                        />
                      )}

                      <span
                        className={`
                          relative
                          z-10
                          flex
                          size-11
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          border
                          transition
                          ${
                            isCompleted
                              ? `
                                border-success
                                bg-success
                                text-white
                              `
                              : isCurrent
                                ? `
                                  border-primary
                                  bg-primary
                                  text-primary-foreground
                                `
                                : `
                                  border-border/55
                                  bg-background
                                  text-muted-foreground
                                `
                          }
                        `}
                      >
                        {isCompleted ? (
                          <Check
                            className="size-5"
                            strokeWidth={2}
                            aria-hidden="true"
                          />
                        ) : (
                          item.icon
                        )}
                      </span>
                    </div>

                    <div
                      className={`
                        min-w-0
                        pb-8
                        ${isLast ? "pb-0" : ""}
                      `}
                    >
                      <div
                        className={`
                          rounded-[1.25rem]
                          border
                          px-4
                          py-4
                          transition
                          sm:px-5
                          ${
                            isCurrent
                              ? `
                                border-primary/35
                                bg-primary/[0.04]
                                shadow-sm
                              `
                              : `
                                border-border/50
                                bg-background/60
                              `
                          }
                        `}
                      >
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-sm font-semibold text-foreground sm:text-base">
                            {item.title}
                          </h3>

                          {isCompleted && (
                            <span className="rounded-full bg-success/12 px-2.5 py-1 text-[0.6875rem] font-semibold text-success">
                              完了
                            </span>
                          )}

                          {isCurrent && (
                            <span className="rounded-full bg-accent/20 px-2.5 py-1 text-[0.6875rem] font-semibold text-foreground">
                              現在地
                            </span>
                          )}
                        </div>

                        <p className="mt-2 text-sm leading-6 text-muted-foreground">
                          {item.description}
                        </p>

                        {!isCurrent && (
                          <button
                            type="button"
                            onClick={() =>
                              handleSelectStep(
                                item.id
                              )
                            }
                            className="
                              mt-4
                              inline-flex
                              min-h-10
                              items-center
                              justify-center
                              gap-2
                              rounded-full
                              border
                              border-border/60
                              bg-card
                              px-4
                              text-xs
                              font-semibold
                              text-foreground
                              transition
                              hover:border-border
                              hover:bg-muted
                              focus-visible:outline-none
                              focus-visible:ring-2
                              focus-visible:ring-ring
                              focus-visible:ring-offset-2
                              focus-visible:ring-offset-background
                            "
                          >
                            <Play
                              className="size-3.5"
                              strokeWidth={1.9}
                              aria-hidden="true"
                            />

                            このステップへ進む
                          </button>
                        )}

                        {item.id === "record" &&
                          isCurrent && (
                            <Link
                              href={postHref}
                              className="
                                mt-4
                                inline-flex
                                min-h-10
                                items-center
                                justify-center
                                gap-2
                                rounded-full
                                bg-primary
                                px-4
                                text-xs
                                font-semibold
                                text-primary-foreground
                                transition
                                duration-200
                                hover:-translate-y-0.5
                                hover:shadow-sm
                                focus-visible:outline-none
                                focus-visible:ring-2
                                focus-visible:ring-ring
                                focus-visible:ring-offset-2
                                focus-visible:ring-offset-background
                              "
                            >
                              <NotebookPen
                                className="size-4"
                                strokeWidth={1.8}
                                aria-hidden="true"
                              />

                              サ活を記録する
                            </Link>
                          )}
                      </div>
                    </div>
                  </li>
                );
              }
            )}
          </ol>

          <div className="mt-8 flex items-start gap-3 rounded-[1.25rem] bg-success/10 p-4">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-success text-white">
              <CheckCircle2
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                進行状況はこの端末に保存されます
              </p>

              <p className="mt-1 text-xs leading-6 text-muted-foreground">
                画面を閉じても、今日選んだ施設と現在のステップから再開できます。
              </p>
            </div>
          </div>
        </div>
      </AppCard>
    </PageSection>
  );
}

export function TodayTimeline() {
  const [todaySauna] = useTodaySauna();

  if (!todaySauna) {
    return null;
  }

  return (
    <TodayTimelineContent
      key={todaySauna.id}
      sauna={todaySauna}
    />
  );
}

