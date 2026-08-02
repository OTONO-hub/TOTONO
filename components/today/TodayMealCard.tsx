"use client";

import type { ReactNode } from "react";
import {
  Check,
  ChevronRight,
  Coffee,
  MapPin,
  Salad,
  Search,
  Soup,
  Sparkles,
  Utensils,
} from "lucide-react";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";

type MealOptionId =
  | "recovery"
  | "refresh"
  | "relax";

type MealOption = {
  id: MealOptionId;
  title: string;
  subtitle: string;
  description: string;
  examples: string[];
  icon: ReactNode;
};

type TodayMealContentProps = {
  sauna: TodaySauna;
};

const MEAL_OPTIONS: MealOption[] = [
  {
    id: "recovery",
    title: "しっかり整う",
    subtitle: "エネルギーを補給",
    description:
      "サウナ後の空腹をしっかり満たしたい日におすすめです。",
    examples: [
      "カレー",
      "生姜焼き",
      "定食",
    ],
    icon: (
      <Soup
        className="size-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    ),
  },
  {
    id: "refresh",
    title: "さっぱり回復",
    subtitle: "水分と塩分を補給",
    description:
      "身体を重くしすぎず、軽やかに回復したい日におすすめです。",
    examples: [
      "そば",
      "冷麺",
      "サラダ",
    ],
    icon: (
      <Salad
        className="size-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    ),
  },
  {
    id: "relax",
    title: "ゆっくり余韻",
    subtitle: "静かに締めくくる",
    description:
      "食事や飲み物を楽しみながら、整った余韻を残したい日におすすめです。",
    examples: [
      "喫茶店",
      "軽食",
      "デザート",
    ],
    icon: (
      <Coffee
        className="size-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    ),
  },
];

function createStorageKey(
  saunaId: string
): string {
  return `totono:today-meal:${saunaId}`;
}

function isMealOptionId(
  value: unknown
): value is MealOptionId {
  return (
    value === "recovery" ||
    value === "refresh" ||
    value === "relax"
  );
}

function loadSelectedMeal(
  saunaId: string
): MealOptionId | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        createStorageKey(saunaId)
      );

    if (
      isMealOptionId(
        storedValue
      )
    ) {
      return storedValue;
    }
  } catch {
    // localStorageが利用できない場合は、
    // 未選択状態として表示します。
  }

  return null;
}

function createMealSearchHref(
  sauna: TodaySauna,
  meal: MealOption
): string {
  const locationText = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .join(" ");

  const query = [
    locationText,
    sauna.name,
    meal.examples[0],
  ]
    .filter(Boolean)
    .join(" ");

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    query
  )}`;
}

function TodayMealContent({
  sauna,
}: TodayMealContentProps) {
  const [
    selectedMealId,
    setSelectedMealId,
  ] = useState<MealOptionId | null>(
    () =>
      loadSelectedMeal(
        sauna.id
      )
  );

  useEffect(() => {
    try {
      const storageKey =
        createStorageKey(
          sauna.id
        );

      if (!selectedMealId) {
        window.localStorage.removeItem(
          storageKey
        );

        return;
      }

      window.localStorage.setItem(
        storageKey,
        selectedMealId
      );
    } catch {
      // localStorageが利用できない場合も、
      // 現在の画面内では選択状態を維持します。
    }
  }, [
    sauna.id,
    selectedMealId,
  ]);

  const selectedMeal =
    useMemo(
      () =>
        MEAL_OPTIONS.find(
          (meal) =>
            meal.id ===
            selectedMealId
        ) ?? null,
      [selectedMealId]
    );

  const handleSelect = (
    mealId: MealOptionId
  ) => {
    setSelectedMealId(
      (currentMealId) =>
        currentMealId === mealId
          ? null
          : mealId
    );
  };

  return (
    <PageSection
      as="section"
      aria-labelledby="today-meal-heading"
    >
      <AppCard
        variant="glass"
        radius="xl"
        padding="none"
        className="bg-card/85"
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-28
            -top-28
            size-72
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-28
            -left-24
            size-64
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div
          className="
            relative
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

              Sauna Meal
            </div>

            <h2
              id="today-meal-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
                sm:text-3xl
              "
            >
              今日のサ飯
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
              {sauna.name}で整った後の気分に合わせて、
              今日の食事を選びましょう。
            </p>
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-full
              border
              border-border/55
              bg-background/70
              px-4
              py-2
              text-xs
              font-semibold
              text-foreground
              sm:self-auto
            "
          >
            <Utensils
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            サウナ後の楽しみ
          </div>
        </div>

        <div
          className="
            relative
            grid
            gap-4
            px-6
            py-6
            sm:px-8
            sm:py-8
            lg:grid-cols-3
            lg:px-10
          "
        >
          {MEAL_OPTIONS.map(
            (meal) => {
              const isSelected =
                selectedMealId ===
                meal.id;

              return (
                <button
                  key={meal.id}
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    handleSelect(
                      meal.id
                    )
                  }
                  className={`
                    group
                    flex
                    min-h-64
                    flex-col
                    rounded-[1.5rem]
                    border
                    p-5
                    text-left
                    transition
                    duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    focus-visible:ring-offset-background
                    ${
                      isSelected
                        ? `
                          border-primary
                          bg-primary
                          text-primary-foreground
                          shadow-md
                        `
                        : `
                          border-border/55
                          bg-background/65
                          text-foreground
                          hover:-translate-y-1
                          hover:border-border
                          hover:bg-background
                          hover:shadow-md
                        `
                    }
                  `}
                >
                  <div
                    className="
                      flex
                      items-start
                      justify-between
                      gap-4
                    "
                  >
                    <span
                      className={`
                        flex
                        size-11
                        items-center
                        justify-center
                        rounded-full
                        ${
                          isSelected
                            ? `
                              bg-white/15
                              text-primary-foreground
                            `
                            : `
                              bg-secondary/20
                              text-foreground
                            `
                        }
                      `}
                    >
                      {meal.icon}
                    </span>

                    <span
                      className={`
                        flex
                        size-8
                        items-center
                        justify-center
                        rounded-full
                        border
                        transition
                        ${
                          isSelected
                            ? `
                              border-white/20
                              bg-white
                              text-primary
                            `
                            : `
                              border-border
                              text-transparent
                              group-hover:text-muted-foreground
                            `
                        }
                      `}
                    >
                      <Check
                        className="size-4"
                        strokeWidth={2}
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <div className="mt-8">
                    <p
                      className={`
                        text-xs
                        font-semibold
                        ${
                          isSelected
                            ? "text-primary-foreground/60"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {meal.subtitle}
                    </p>

                    <h3
                      className="
                        mt-2
                        text-xl
                        font-semibold
                        tracking-[-0.03em]
                      "
                    >
                      {meal.title}
                    </h3>

                    <p
                      className={`
                        mt-3
                        text-sm
                        leading-7
                        ${
                          isSelected
                            ? "text-primary-foreground/70"
                            : "text-muted-foreground"
                        }
                      `}
                    >
                      {meal.description}
                    </p>
                  </div>

                  <div
                    className="
                      mt-auto
                      flex
                      flex-wrap
                      gap-2
                      pt-6
                    "
                  >
                    {meal.examples.map(
                      (example) => (
                        <span
                          key={example}
                          className={`
                            rounded-full
                            px-3
                            py-1.5
                            text-[0.6875rem]
                            font-semibold
                            ${
                              isSelected
                                ? `
                                  bg-white/10
                                  text-primary-foreground/80
                                `
                                : `
                                  bg-muted
                                  text-muted-foreground
                                `
                            }
                          `}
                        >
                          {example}
                        </span>
                      )
                    )}
                  </div>
                </button>
              );
            }
          )}
        </div>

        <div
          className="
            relative
            border-t
            border-border/45
            px-6
            py-6
            sm:px-8
            lg:px-10
          "
        >
          {selectedMeal ? (
            <div
              className="
                flex
                flex-col
                gap-5
                rounded-[1.5rem]
                bg-background/65
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:p-6
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
                <span
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-success
                    text-white
                  "
                >
                  <Check
                    className="size-5"
                    strokeWidth={2}
                    aria-hidden="true"
                  />
                </span>

                <div>
                  <p
                    className="
                      text-xs
                      font-semibold
                      uppercase
                      tracking-[0.16em]
                      text-muted-foreground
                    "
                  >
                    Today&apos;s Choice
                  </p>

                  <p
                    className="
                      mt-2
                      text-lg
                      font-semibold
                      tracking-[-0.03em]
                      text-foreground
                    "
                  >
                    {selectedMeal.title}
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    近くのお店を探して、
                    サウナ後の余韻まで楽しみましょう。
                  </p>
                </div>
              </div>

              <a
                href={createMealSearchHref(
                  sauna,
                  selectedMeal
                )}
                target="_blank"
                rel="noreferrer"
                className="
                  inline-flex
                  min-h-12
                  shrink-0
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
                  focus-visible:ring-offset-background
                "
              >
                <MapPin
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                近くのお店を探す

                <ChevronRight
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </a>
            </div>
          ) : (
            <div
              className="
                flex
                flex-col
                gap-5
                rounded-[1.5rem]
                border
                border-dashed
                border-border/70
                bg-background/45
                p-5
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:p-6
              "
            >
              <div
                className="
                  flex
                  items-start
                  gap-4
                "
              >
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
                  <Utensils
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
                    今日の気分を選んでみましょう
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    選択した内容は、この施設の今日の予定として保存されます。
                  </p>
                </div>
              </div>

              <Link
                href="/search"
                className="
                  inline-flex
                  min-h-11
                  shrink-0
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-border/70
                  bg-card
                  px-5
                  text-sm
                  font-semibold
                  text-foreground
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
                <Search
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                施設を探し直す
              </Link>
            </div>
          )}
        </div>

        <div
          className="
            relative
            border-t
            border-border/45
            px-6
            py-5
            sm:px-8
            lg:px-10
          "
        >
          <p
            className="
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            現在は食事ジャンルの提案です。実際の営業時間・営業日・メニューは、各店舗の最新情報をご確認ください。
          </p>
        </div>
      </AppCard>
    </PageSection>
  );
}

export function TodayMealCard() {
  const [todaySauna] =
    useTodaySauna();

  if (!todaySauna) {
    return null;
  }

  return (
    <TodayMealContent
      key={todaySauna.id}
      sauna={todaySauna}
    />
  );
}

