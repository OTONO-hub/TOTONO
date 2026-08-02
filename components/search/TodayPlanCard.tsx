"use client";

import {
  Check,
  ChevronDown,
  ChevronUp,
  Circle,
  MapPin,
  Navigation,
  Sparkles,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { createGoogleMapsDirectionUrl } from "@/lib/sauna-navigation";

type TodayPlanChecklistItem = {
  id: string;
  label: string;
};

type TodayPlanCardProps = {
  saunaId: string;
  saunaName: string;
  prefecture?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  ranking?: number | null;
};

const DEFAULT_CHECKLIST_ITEMS: TodayPlanChecklistItem[] = [
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
    label: "水分",
  },
  {
    id: "change-of-clothes",
    label: "着替え",
  },
];

function createStorageKey(
  saunaId: string
): string {
  return `totono:today-plan:${saunaId}`;
}

function isStringArray(
  value: unknown
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string"
    )
  );
}

function loadCompletedItemIds(
  saunaId: string
): string[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const savedValue =
      window.localStorage.getItem(
        createStorageKey(
          saunaId
        )
      );

    if (!savedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(savedValue);

    if (
      !isStringArray(
        parsedValue
      )
    ) {
      return [];
    }

    return parsedValue.filter(
      (itemId) =>
        DEFAULT_CHECKLIST_ITEMS.some(
          (item) =>
            item.id === itemId
        )
    );
  } catch {
    return [];
  }
}

export function TodayPlanCard({
  saunaId,
  saunaName,
  prefecture,
  city,
  latitude,
  longitude,
  ranking,
}: TodayPlanCardProps) {
  const [
    completedItemIds,
    setCompletedItemIds,
  ] = useState<string[]>(
    () =>
      loadCompletedItemIds(
        saunaId
      )
  );

  const [
    isChecklistOpen,
    setIsChecklistOpen,
  ] = useState(true);

  const location = useMemo(
    () =>
      [
        prefecture,
        city,
      ]
        .filter(Boolean)
        .join(" "),
    [
      prefecture,
      city,
    ]
  );

  const completedCount =
    completedItemIds.length;

  const totalItemCount =
    DEFAULT_CHECKLIST_ITEMS.length;

  const completionPercentage =
    Math.round(
      (
        completedCount /
        totalItemCount
      ) * 100
    );

  const directionUrl =
    createGoogleMapsDirectionUrl({
      name: saunaName,
      latitude,
      longitude,
    });

  useEffect(() => {
    try {
      window.localStorage.setItem(
        createStorageKey(
          saunaId
        ),
        JSON.stringify(
          completedItemIds
        )
      );
    } catch {
      // localStorageが使用できない場合も、
      // 画面上の操作は継続します。
    }
  }, [
    completedItemIds,
    saunaId,
  ]);

  const toggleChecklistItem = (
    itemId: string
  ): void => {
    setCompletedItemIds(
      (currentItemIds) => {
        if (
          currentItemIds.includes(
            itemId
          )
        ) {
          return currentItemIds.filter(
            (currentItemId) =>
              currentItemId !==
              itemId
          );
        }

        return [
          ...currentItemIds,
          itemId,
        ];
      }
    );
  };

  const resetChecklist =
    (): void => {
      setCompletedItemIds(
        []
      );
    };

  return (
    <section
      aria-labelledby={`today-plan-heading-${saunaId}`}
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-[#fdd000]/35
        bg-white/90
        shadow-[0_20px_60px_rgba(62,58,58,0.09)]
        backdrop-blur-xl
      "
    >
      <header
        className="
          flex
          items-center
          justify-between
          gap-4
          border-b
          border-[#3e3a3a]/7
          bg-[#fdd000]/10
          px-5
          py-4
          sm:px-6
        "
      >
        <div
          className="
            flex
            min-w-0
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
              bg-[#fdd000]
              text-[#3e3a3a]
              shadow-[0_8px_24px_rgba(253,208,0,0.28)]
            "
          >
            <Sparkles
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <p
              className="
                text-[0.625rem]
                font-bold
                tracking-[0.14em]
                text-[#3e3a3a]/45
              "
            >
              TODAY PLAN
            </p>

            <h2
              id={`today-plan-heading-${saunaId}`}
              className="
                mt-0.5
                truncate
                text-sm
                font-bold
                text-[#3e3a3a]
                sm:text-base
              "
            >
              今日のサウナを準備する
            </h2>
          </div>
        </div>

        <span
          className="
            shrink-0
            rounded-full
            bg-white/80
            px-3
            py-1.5
            text-[0.6875rem]
            font-bold
            text-[#3e3a3a]/55
            shadow-sm
          "
        >
          {completedCount}/{totalItemCount}完了
        </span>
      </header>

      <div
        className="
          grid
          gap-6
          p-5
          sm:p-6
          lg:grid-cols-[minmax(0,0.9fr)_minmax(20rem,1.1fr)]
        "
      >
        <div
          className="
            flex
            min-w-0
            flex-col
            justify-between
            gap-6
          "
        >
          <div>
            <div
              className="
                flex
                items-start
                gap-4
              "
            >
              {ranking ? (
                <span
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#3e3a3a]
                    text-sm
                    font-extrabold
                    text-white
                  "
                >
                  {ranking}
                </span>
              ) : (
                <span
                  className="
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-[#e6e5ef]
                    text-[#3e3a3a]
                  "
                >
                  <MapPin
                    className="size-4"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>
              )}

              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    font-semibold
                    text-[#00b4b6]
                  "
                >
                  今日の行き先
                </p>

                <h3
                  className="
                    mt-1
                    text-xl
                    font-bold
                    leading-snug
                    tracking-[-0.025em]
                    text-[#3e3a3a]
                  "
                >
                  {saunaName}
                </h3>

                {location ? (
                  <p
                    className="
                      mt-2
                      flex
                      items-center
                      gap-1.5
                      text-sm
                      text-[#3e3a3a]/50
                    "
                  >
                    <MapPin
                      className="size-3.5"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />

                    {location}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className="
                mt-6
                rounded-[1.4rem]
                bg-[#e6e5ef]/40
                p-4
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
                <span
                  className="
                    text-xs
                    font-semibold
                    text-[#3e3a3a]/55
                  "
                >
                  準備状況
                </span>

                <span
                  className="
                    text-xs
                    font-bold
                    text-[#3e3a3a]
                  "
                >
                  {completionPercentage}%
                </span>
              </div>

              <div
                className="
                  mt-3
                  h-2
                  overflow-hidden
                  rounded-full
                  bg-white
                "
              >
                <div
                  className="
                    h-full
                    rounded-full
                    bg-[#00b4b6]
                    transition-[width]
                    duration-300
                  "
                  style={{
                    width: `${completionPercentage}%`,
                  }}
                />
              </div>

              <p
                className="
                  mt-3
                  text-xs
                  leading-relaxed
                  text-[#3e3a3a]/45
                "
              >
                持ち物を確認したら、経路を開いて出発しましょう。
              </p>
            </div>
          </div>

          <a
            href={directionUrl}
            target="_blank"
            rel="noreferrer"
            className="
              inline-flex
              min-h-12
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#fdd000]
              px-6
              text-sm
              font-bold
              text-[#3e3a3a]
              shadow-[0_12px_30px_rgba(253,208,0,0.30)]
              transition-all
              duration-200
              hover:-translate-y-0.5
              hover:shadow-[0_16px_38px_rgba(253,208,0,0.38)]
              active:translate-y-0
              active:scale-[0.98]
            "
          >
            <Navigation
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />

            経路を開いて今日行く
          </a>
        </div>

        <div
          className="
            overflow-hidden
            rounded-[1.5rem]
            border
            border-[#3e3a3a]/8
            bg-white
          "
        >
          <button
            type="button"
            aria-expanded={
              isChecklistOpen
            }
            onClick={() =>
              setIsChecklistOpen(
                (currentValue) =>
                  !currentValue
              )
            }
            className="
              flex
              min-h-14
              w-full
              items-center
              justify-between
              gap-4
              px-4
              text-left
              transition-colors
              hover:bg-[#e6e5ef]/25
              sm:px-5
            "
          >
            <div>
              <p
                className="
                  text-sm
                  font-bold
                  text-[#3e3a3a]
                "
              >
                持ち物チェック
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-[#3e3a3a]/45
                "
              >
                チェック内容は施設ごとに保存されます
              </p>
            </div>

            {isChecklistOpen ? (
              <ChevronUp
                className="
                  size-4
                  shrink-0
                  text-[#3e3a3a]/45
                "
                strokeWidth={1.9}
                aria-hidden="true"
              />
            ) : (
              <ChevronDown
                className="
                  size-4
                  shrink-0
                  text-[#3e3a3a]/45
                "
                strokeWidth={1.9}
                aria-hidden="true"
              />
            )}
          </button>

          {isChecklistOpen ? (
            <div
              className="
                border-t
                border-[#3e3a3a]/7
                p-3
                sm:p-4
              "
            >
              <ul className="space-y-2">
                {DEFAULT_CHECKLIST_ITEMS.map(
                  (item) => {
                    const isCompleted =
                      completedItemIds.includes(
                        item.id
                      );

                    return (
                      <li key={item.id}>
                        <button
                          type="button"
                          aria-pressed={
                            isCompleted
                          }
                          onClick={() =>
                            toggleChecklistItem(
                              item.id
                            )
                          }
                          className={`
                            flex
                            min-h-12
                            w-full
                            items-center
                            gap-3
                            rounded-[1rem]
                            px-3.5
                            text-left
                            transition-all
                            duration-200
                            ${
                              isCompleted
                                ? `
                                    bg-[#00b4b6]/10
                                    text-[#007f81]
                                  `
                                : `
                                    bg-[#e6e5ef]/25
                                    text-[#3e3a3a]
                                    hover:bg-[#e6e5ef]/50
                                  `
                            }
                          `}
                        >
                          <span
                            className={`
                              flex
                              size-7
                              shrink-0
                              items-center
                              justify-center
                              rounded-full
                              transition-colors
                              ${
                                isCompleted
                                  ? `
                                      bg-[#00b4b6]
                                      text-white
                                    `
                                  : `
                                      bg-white
                                      text-[#3e3a3a]/25
                                      shadow-sm
                                    `
                              }
                            `}
                          >
                            {isCompleted ? (
                              <Check
                                className="size-3.5"
                                strokeWidth={2.5}
                                aria-hidden="true"
                              />
                            ) : (
                              <Circle
                                className="size-3.5"
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
                                isCompleted
                                  ? "line-through opacity-65"
                                  : ""
                              }
                            `}
                          >
                            {item.label}
                          </span>
                        </button>
                      </li>
                    );
                  }
                )}
              </ul>

              {completedCount > 0 ? (
                <button
                  type="button"
                  onClick={
                    resetChecklist
                  }
                  className="
                    mt-3
                    min-h-10
                    w-full
                    rounded-full
                    text-xs
                    font-semibold
                    text-[#3e3a3a]/45
                    transition-colors
                    hover:bg-[#e95884]/8
                    hover:text-[#c23d65]
                  "
                >
                  チェックをリセット
                </button>
              ) : null}
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
