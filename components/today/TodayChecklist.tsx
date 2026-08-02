"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  Check,
  CheckCircle2,
  Circle,
  RotateCcw,
  Sparkles,
} from "lucide-react";

import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";

type ChecklistItem = {
  id: string;
  label: string;
};

type ChecklistState = Record<
  string,
  boolean
>;

type TodayChecklistContentProps = {
  sauna: TodaySauna;
};

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "towel",
    label: "タオル",
  },
  {
    id: "sauna-hat",
    label: "サウナハット",
  },
  {
    id: "drink",
    label: "飲み物",
  },
  {
    id: "change-of-clothes",
    label: "着替え",
  },
  {
    id: "wallet",
    label: "財布",
  },
  {
    id: "smartphone",
    label: "スマートフォン",
  },
];

function createStorageKey(
  saunaId: string
): string {
  return `totono:today-checklist:${saunaId}`;
}

function createInitialState(): ChecklistState {
  return Object.fromEntries(
    CHECKLIST_ITEMS.map((item) => [
      item.id,
      false,
    ])
  );
}

function isChecklistState(
  value: unknown
): value is ChecklistState {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Record<
      string,
      unknown
    >;

  return CHECKLIST_ITEMS.every(
    (item) =>
      typeof candidate[item.id] ===
      "boolean"
  );
}

function loadChecklist(
  saunaId: string
): ChecklistState {
  if (
    typeof window === "undefined"
  ) {
    return createInitialState();
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        createStorageKey(saunaId)
      );

    if (!storedValue) {
      return createInitialState();
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (
      !isChecklistState(
        parsedValue
      )
    ) {
      return createInitialState();
    }

    return parsedValue;
  } catch {
    return createInitialState();
  }
}

function TodayChecklistContent({
  sauna,
}: TodayChecklistContentProps) {
  const [
    checklist,
    setChecklist,
  ] = useState<ChecklistState>(
    () => loadChecklist(sauna.id)
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        createStorageKey(sauna.id),
        JSON.stringify(checklist)
      );
    } catch {
      // localStorageが利用できない環境でも、
      // 現在の画面内では状態を維持します。
    }
  }, [
    checklist,
    sauna.id,
  ]);

  const completedCount =
    useMemo(
      () =>
        CHECKLIST_ITEMS.filter(
          (item) =>
            checklist[item.id]
        ).length,
      [checklist]
    );

  const totalCount =
    CHECKLIST_ITEMS.length;

  const progress =
    totalCount > 0
      ? Math.round(
          (completedCount /
            totalCount) *
            100
        )
      : 0;

  const isCompleted =
    completedCount === totalCount;

  const handleToggle = (
    itemId: string
  ) => {
    setChecklist(
      (currentChecklist) => ({
        ...currentChecklist,
        [itemId]:
          !currentChecklist[itemId],
      })
    );
  };

  const handleReset = () => {
    setChecklist(
      createInitialState()
    );
  };

  return (
    <PageSection
      as="section"
      aria-labelledby="today-checklist-heading"
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
            gap-5
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

              Preparation
            </div>

            <h2
              id="today-checklist-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
                sm:text-3xl
              "
            >
              今日の準備
            </h2>

            <p
              className="
                mt-3
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              {sauna.name}へ行く前に、
              必要なものを確認しましょう。
            </p>
          </div>

          <div
            className="
              flex
              items-center
              gap-4
            "
          >
            <div className="text-right">
              <p
                className="
                  text-xs
                  font-semibold
                  text-muted-foreground
                "
              >
                準備状況
              </p>

              <p
                className="
                  mt-1
                  text-xl
                  font-semibold
                  tracking-[-0.03em]
                  text-foreground
                "
              >
                {completedCount}

                <span
                  className="
                    mx-1
                    text-sm
                    font-medium
                    text-muted-foreground
                  "
                >
                  /
                </span>

                {totalCount}
              </p>
            </div>

            <div
              className="
                relative
                flex
                size-14
                items-center
                justify-center
                rounded-full
                bg-background
              "
              aria-label={`準備完了率${progress}%`}
            >
              <svg
                viewBox="0 0 56 56"
                className="
                  absolute
                  inset-0
                  size-full
                  -rotate-90
                "
                aria-hidden="true"
              >
                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  className="text-border/60"
                />

                <circle
                  cx="28"
                  cy="28"
                  r="24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={
                    2 *
                    Math.PI *
                    24
                  }
                  strokeDashoffset={
                    2 *
                    Math.PI *
                    24 *
                    (1 -
                      progress /
                        100)
                  }
                  className="
                    text-success
                    transition-all
                    duration-500
                  "
                />
              </svg>

              <span
                className="
                  relative
                  text-xs
                  font-semibold
                  text-foreground
                "
              >
                {progress}%
              </span>
            </div>
          </div>
        </div>

        <div
          className="
            px-6
            py-6
            sm:px-8
            sm:py-8
            lg:px-10
          "
        >
          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-3
            "
          >
            {CHECKLIST_ITEMS.map(
              (item) => {
                const isChecked =
                  checklist[item.id];

                return (
                  <button
                    key={item.id}
                    type="button"
                    aria-pressed={
                      isChecked
                    }
                    onClick={() =>
                      handleToggle(
                        item.id
                      )
                    }
                    className={`
                      group
                      flex
                      min-h-16
                      items-center
                      gap-3
                      rounded-[1.25rem]
                      border
                      px-4
                      py-4
                      text-left
                      transition
                      duration-200
                      focus-visible:outline-none
                      focus-visible:ring-2
                      focus-visible:ring-ring
                      focus-visible:ring-offset-2
                      focus-visible:ring-offset-background
                      ${
                        isChecked
                          ? `
                            border-success/35
                            bg-success/10
                          `
                          : `
                            border-border/55
                            bg-background/65
                            hover:-translate-y-0.5
                            hover:border-border
                            hover:bg-background
                            hover:shadow-sm
                          `
                      }
                    `}
                  >
                    <span
                      className={`
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        transition
                        duration-200
                        ${
                          isChecked
                            ? `
                              bg-success
                              text-white
                            `
                            : `
                              bg-muted
                              text-muted-foreground
                              group-hover:text-foreground
                            `
                        }
                      `}
                    >
                      {isChecked ? (
                        <Check
                          className="size-4"
                          strokeWidth={2}
                          aria-hidden="true"
                        />
                      ) : (
                        <Circle
                          className="size-4"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      )}
                    </span>

                    <span
                      className={`
                        text-sm
                        font-semibold
                        ${
                          isChecked
                            ? "text-foreground"
                            : "text-foreground/80"
                        }
                      `}
                    >
                      {item.label}
                    </span>
                  </button>
                );
              }
            )}
          </div>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-4
              border-t
              border-border/45
              pt-6
              sm:flex-row
              sm:items-center
              sm:justify-between
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
                className={`
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${
                    isCompleted
                      ? `
                        bg-success
                        text-white
                      `
                      : `
                        bg-secondary/25
                        text-foreground
                      `
                  }
                `}
              >
                <CheckCircle2
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <div>
                <p
                  className="
                    text-sm
                    font-semibold
                    text-foreground
                  "
                >
                  {isCompleted
                    ? "準備が整いました"
                    : "出発前に確認しましょう"}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-6
                    text-muted-foreground
                  "
                >
                  {isCompleted
                    ? "あとは無理をせず、今日のサウナを楽しみましょう。"
                    : `あと${
                        totalCount -
                        completedCount
                      }件で準備完了です。`}
                </p>
              </div>
            </div>

            {completedCount > 0 && (
              <button
                type="button"
                onClick={handleReset}
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  px-4
                  text-sm
                  font-semibold
                  text-muted-foreground
                  transition
                  duration-200
                  hover:bg-muted
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-background
                "
              >
                <RotateCcw
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                チェックをリセット
              </button>
            )}
          </div>
        </div>
      </AppCard>
    </PageSection>
  );
}

export function TodayChecklist() {
  const [todaySauna] =
    useTodaySauna();

  if (!todaySauna) {
    return null;
  }

  return (
    <TodayChecklistContent
      key={todaySauna.id}
      sauna={todaySauna}
    />
  );
}

