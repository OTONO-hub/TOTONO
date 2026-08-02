"use client";

import {
  ArrowRight,
  Check,
  CheckCircle2,
  Clock3,
  MapPinned,
  NotebookPen,
  Play,
  Search,
  Sparkles,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useState,
} from "react";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { BackgroundGlow } from "@/components/ui/background-glow";
import { PageSection } from "@/components/ui/page-section";
import {
  TODAY_JOURNEY_UPDATED_EVENT,
  type TodayJourneyUpdatedDetail,
} from "@/lib/today-journey-events";
import {
  createTodayArrivalTimeStorageKey,
  createTodayJourneyStorageKey,
  createTodayPostHref,
  getTodayJourneyProgress,
  getTodayJourneyStepIndex,
  loadTodayJourneyState,
  saveTodayJourneyStep,
  TODAY_JOURNEY_STEPS,
  type TodayJourneyState,
} from "@/lib/today-journey-storage";

function getJourneyActionLabel(
  nextStepTitle: string | null
): string {
  switch (nextStepTitle) {
    case "到着":
      return "到着しました";

    case "サウナ":
      return "サウナへ進む";

    case "外気浴":
      return "外気浴へ進む";

    case "サ飯":
      return "サ飯へ進む";

    case "記録":
      return "今日を記録する";

    default:
      return "次へ進む";
  }
}

function TodayJourneyCardContent({
  sauna,
}: {
  sauna: TodaySauna;
}) {
  const [journeyState, setJourneyState] =
    useState<TodayJourneyState>(() =>
      loadTodayJourneyState(sauna.id)
    );

  const refreshJourneyState =
    useCallback(() => {
      setJourneyState(
        loadTodayJourneyState(sauna.id)
      );
    }, [sauna.id]);

  useEffect(() => {
    const handleStorage = (
      event: StorageEvent
    ) => {
      const isArrivalTimeUpdate =
        event.key ===
        createTodayArrivalTimeStorageKey(
          sauna.id
        );

      const isJourneyUpdate =
        event.key ===
        createTodayJourneyStorageKey(
          sauna.id
        );

      if (
        isArrivalTimeUpdate ||
        isJourneyUpdate
      ) {
        refreshJourneyState();
      }
    };

    const handleJourneyUpdated = (
      event: Event
    ) => {
      const customEvent =
        event as CustomEvent<TodayJourneyUpdatedDetail>;

      if (
        customEvent.detail?.saunaId ===
        sauna.id
      ) {
        refreshJourneyState();
      }
    };

    const handleFocus = () => {
      refreshJourneyState();
    };

    const handleVisibilityChange = () => {
      if (
        document.visibilityState ===
        "visible"
      ) {
        refreshJourneyState();
      }
    };

    window.addEventListener(
      "storage",
      handleStorage
    );

    window.addEventListener(
      TODAY_JOURNEY_UPDATED_EVENT,
      handleJourneyUpdated
    );

    window.addEventListener(
      "focus",
      handleFocus
    );

    document.addEventListener(
      "visibilitychange",
      handleVisibilityChange
    );

    return () => {
      window.removeEventListener(
        "storage",
        handleStorage
      );

      window.removeEventListener(
        TODAY_JOURNEY_UPDATED_EVENT,
        handleJourneyUpdated
      );

      window.removeEventListener(
        "focus",
        handleFocus
      );

      document.removeEventListener(
        "visibilitychange",
        handleVisibilityChange
      );
    };
  }, [
    refreshJourneyState,
    sauna.id,
  ]);

  const currentStepIndex =
    getTodayJourneyStepIndex(
      journeyState.currentStepId
    );

  const currentStep =
    TODAY_JOURNEY_STEPS[
      currentStepIndex
    ];

  const progress =
    getTodayJourneyProgress(
      journeyState.currentStepId
    );

  const nextStep =
    TODAY_JOURNEY_STEPS[
      currentStepIndex + 1
    ] ?? null;

  const isRecordStep =
    journeyState.currentStepId ===
    "record";

  const completedSteps =
    TODAY_JOURNEY_STEPS.slice(
      0,
      currentStepIndex
    );

  const remainingStepCount = Math.max(
    TODAY_JOURNEY_STEPS.length -
      currentStepIndex -
      1,
    0
  );

  const postHref =
    createTodayPostHref(sauna);

  const actionLabel =
    getJourneyActionLabel(
      nextStep?.title ?? null
    );

  const handleAdvanceJourney = () => {
    if (!nextStep) {
      return;
    }

    const nextJourneyState: TodayJourneyState = {
      ...journeyState,
      currentStepId: nextStep.id,
    };

    setJourneyState(nextJourneyState);

    try {
      saveTodayJourneyStep(
        sauna.id,
        nextStep.id
      );
    } catch {
      // localStorageが利用できない場合でも、
      // 現在の画面内では進行状態を維持します。
    }
  };

  return (
    <AppCard
      as="section"
      aria-labelledby="home-today-journey-heading"
      variant="glass"
      radius="xl"
      padding="none"
      className="bg-card/90"
    >
      <BackgroundGlow
        tone="secondary"
        position="top-right"
        size="lg"
        className="bg-secondary/20"
      />

      <BackgroundGlow
        tone="accent"
        position="bottom-left"
        size="md"
      />

      <div
        className="
          grid
          gap-8
          p-5
          sm:p-7
          lg:grid-cols-[minmax(0,1fr)_19rem]
          lg:items-center
          lg:gap-12
          lg:p-8
        "
      >
        <div className="min-w-0">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border/55
              bg-background/70
              px-3
              py-2
              text-[0.6875rem]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-muted-foreground
            "
          >
            <Sparkles
              aria-hidden="true"
              className="size-3.5"
              strokeWidth={1.8}
            />

            Today&apos;s Journey
          </div>

          <h2
            id="home-today-journey-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            {sauna.name}
          </h2>

          <div
            className="
              mt-4
              flex
              flex-wrap
              items-center
              gap-x-5
              gap-y-2
              text-sm
              text-muted-foreground
            "
          >
            {journeyState.arrivalTime && (
              <span
                className="
                  inline-flex
                  items-center
                  gap-2
                "
              >
                <Clock3
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.8}
                />

                {journeyState.arrivalTime}
                到着予定
              </span>
            )}

            <span
              className="
                inline-flex
                items-center
                gap-2
              "
            >
              <MapPinned
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />

              現在：{currentStep.title}
            </span>
          </div>

          <div
            className="
              mt-7
              rounded-[1.5rem]
              border
              border-border/45
              bg-background/55
              p-4
              sm:p-5
            "
          >
            <div
              className="
                flex
                items-start
                justify-between
                gap-5
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
                  現在のステップ
                </p>

                <p
                  className="
                    mt-2
                    text-xl
                    font-semibold
                    tracking-[-0.03em]
                    text-foreground
                  "
                >
                  {currentStep.title}
                </p>

                <p
                  className="
                    mt-2
                    text-sm
                    leading-6
                    text-muted-foreground
                  "
                >
                  {isRecordStep
                    ? "今日の体験を、静かに残しましょう。"
                    : remainingStepCount > 0
                      ? `あと${remainingStepCount}ステップで記録まで完了します。`
                      : "Journeyはまもなく完了です。"}
                </p>
              </div>

              <div
                className="
                  flex
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-success/15
                  text-success
                "
              >
                {isRecordStep ? (
                  <CheckCircle2
                    aria-hidden="true"
                    className="size-5"
                    strokeWidth={1.8}
                  />
                ) : (
                  <span
                    className="
                      text-sm
                      font-semibold
                    "
                  >
                    {currentStepIndex + 1}
                  </span>
                )}
              </div>
            </div>

            <div className="mt-5">
              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                "
              >
                <p
                  className="
                    text-xs
                    font-semibold
                    text-muted-foreground
                  "
                >
                  進行状況
                </p>

                <p
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  {progress}%
                </p>
              </div>

              <div
                role="progressbar"
                aria-label="今日のJourney進行状況"
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={progress}
                className="
                  mt-3
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-muted
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-success
                    transition-[width]
                    duration-300
                    motion-reduce:transition-none
                  "
                  style={{
                    width: `${progress}%`,
                  }}
                />
              </div>
            </div>

            {completedSteps.length > 0 && (
              <div
                aria-label="完了したJourneyステップ"
                className="
                  mt-5
                  flex
                  flex-wrap
                  gap-2
                "
              >
                {completedSteps.map(
                  (step) => (
                    <span
                      key={step.id}
                      className="
                        inline-flex
                        items-center
                        gap-1.5
                        rounded-full
                        bg-success/10
                        px-3
                        py-1.5
                        text-xs
                        font-medium
                        text-foreground/75
                      "
                    >
                      <Check
                        aria-hidden="true"
                        className="
                          size-3.5
                          text-success
                        "
                        strokeWidth={2}
                      />

                      {step.title}
                    </span>
                  )
                )}
              </div>
            )}
          </div>
        </div>

        <div
          className="
            flex
            w-full
            flex-col
            gap-3
          "
        >
          {isRecordStep ? (
            <AppButton
              href={postHref}
              size="lg"
              fullWidth
              leadingIcon={
                <NotebookPen
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              trailingIcon={
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              className="justify-between"
            >
              今日を記録する
            </AppButton>
          ) : (
            <AppButton
              type="button"
              size="lg"
              fullWidth
              disabled={!nextStep}
              onClick={handleAdvanceJourney}
              leadingIcon={
                <Play
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              trailingIcon={
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              className="justify-between"
            >
              {actionLabel}
            </AppButton>
          )}

          <AppButton
            href="/today"
            variant="secondary"
            fullWidth
            leadingIcon={
              <CheckCircle2
                className="size-4"
                strokeWidth={1.8}
              />
            }
            trailingIcon={
              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
              />
            }
            className="justify-between"
          >
            Journey詳細
          </AppButton>
        </div>
      </div>
    </AppCard>
  );
}

function TodayJourneyEmptyCard() {
  return (
    <AppCard
      as="section"
      aria-labelledby="home-today-empty-heading"
      variant="glass"
      radius="xl"
      padding="none"
      className="
        bg-card/85
        p-5
        sm:p-7
        lg:p-8
      "
    >
      <BackgroundGlow
        tone="secondary"
        position="top-right"
        size="md"
        className="bg-secondary/20"
      />

      <div
        className="
          flex
          flex-col
          gap-7
          sm:flex-row
          sm:items-center
          sm:justify-between
        "
      >
        <div className="max-w-2xl">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border/55
              bg-background/70
              px-3
              py-2
              text-[0.6875rem]
              font-semibold
              uppercase
              tracking-[0.16em]
              text-muted-foreground
            "
          >
            <Sparkles
              aria-hidden="true"
              className="size-3.5"
              strokeWidth={1.8}
            />

            Today&apos;s Journey
          </div>

          <h2
            id="home-today-empty-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            今日はどこで整いますか。
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
            "
          >
            行きたい施設を今日のサウナに設定すると、
            出発から記録までをひとつの流れで進められます。
          </p>
        </div>

        <AppButton
          href="/search"
          size="lg"
          leadingIcon={
            <Search
              className="size-4"
              strokeWidth={1.8}
            />
          }
          trailingIcon={
            <ArrowRight
              className="size-4"
              strokeWidth={1.8}
            />
          }
          className="
            w-full
            justify-between
            sm:w-fit
            sm:min-w-52
          "
        >
          今日のサウナを探す
        </AppButton>
      </div>
    </AppCard>
  );
}

export function TodayJourneyCard() {
  const [todaySauna] = useTodaySauna();

  return (
    <PageSection>
      {todaySauna ? (
        <TodayJourneyCardContent
          key={todaySauna.id}
          sauna={todaySauna}
        />
      ) : (
        <TodayJourneyEmptyCard />
      )}
    </PageSection>
  );
}
