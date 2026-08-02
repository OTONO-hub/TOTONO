"use client";

import {
  CalendarCheck2,
  Check,
  MapPin,
  Sparkles,
  Trash2,
} from "lucide-react";

import type { SearchSauna } from "@/components/search/search-results-explorer.types";
import type { TodaySauna } from "@/components/search/use-today-sauna";

type TodaySaunaBannerProps = {
  activeSauna: SearchSauna | null;
  todaySauna: TodaySauna | null;
  onSetTodaySauna: () => void;
  onClearTodaySauna: () => void;
};

function createLocation(
  prefecture: string | null,
  city: string | null
): string {
  return [
    prefecture,
    city,
  ]
    .filter(Boolean)
    .join(" ");
}

export function TodaySaunaBanner({
  activeSauna,
  todaySauna,
  onSetTodaySauna,
  onClearTodaySauna,
}: TodaySaunaBannerProps) {
  const isActiveSaunaToday =
    Boolean(
      activeSauna &&
        todaySauna &&
        activeSauna.id ===
          todaySauna.id
    );

  const todaySaunaLocation =
    todaySauna
      ? createLocation(
          todaySauna.prefecture,
          todaySauna.city
        )
      : "";

  return (
    <section
      aria-labelledby="today-sauna-heading"
      className="
        mb-8
        overflow-hidden
        rounded-[2rem]
        border
        border-white/75
        bg-white/85
        shadow-[0_20px_60px_rgba(62,58,58,0.08)]
        backdrop-blur-xl
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          p-5
          sm:p-6
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div
          className="
            flex
            min-w-0
            items-start
            gap-4
          "
        >
          <span
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-[#fdd000]/25
              text-[#3e3a3a]
            "
          >
            <CalendarCheck2
              className="size-5"
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div className="min-w-0">
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <p
                className="
                  text-[0.625rem]
                  font-bold
                  tracking-[0.14em]
                  text-[#b69200]
                "
              >
                TODAY&apos;S SAUNA
              </p>

              {todaySauna ? (
                <span
                  className="
                    inline-flex
                    items-center
                    gap-1
                    rounded-full
                    bg-[#00b4b6]/10
                    px-2.5
                    py-1
                    text-[0.625rem]
                    font-bold
                    text-[#007f81]
                  "
                >
                  <Check
                    className="size-3"
                    strokeWidth={2.4}
                    aria-hidden="true"
                  />

                  決定済み
                </span>
              ) : null}
            </div>

            <h2
              id="today-sauna-heading"
              className="
                mt-1
                text-lg
                font-bold
                tracking-[-0.02em]
                text-[#3e3a3a]
                sm:text-xl
              "
            >
              {todaySauna
                ? todaySauna.name
                : "今日行くサウナを決める"}
            </h2>

            {todaySauna ? (
              <>
                {todaySaunaLocation ? (
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

                    {todaySaunaLocation}
                  </p>
                ) : null}

                <p
                  className="
                    mt-2
                    text-xs
                    leading-relaxed
                    text-[#3e3a3a]/40
                  "
                >
                  この施設はブラウザに保存されています。
                </p>
              </>
            ) : (
              <p
                className="
                  mt-2
                  max-w-xl
                  text-sm
                  leading-relaxed
                  text-[#3e3a3a]/50
                "
              >
                施設を選択して、今日のサウナ予定として保存できます。
              </p>
            )}
          </div>
        </div>

        <div
          className="
            flex
            shrink-0
            flex-col
            gap-2
            sm:flex-row
          "
        >
          {activeSauna ? (
            <button
              type="button"
              onClick={
                onSetTodaySauna
              }
              disabled={
                isActiveSaunaToday
              }
              className={`
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-full
                px-5
                text-sm
                font-semibold
                transition-all
                duration-200
                active:scale-[0.98]
                disabled:cursor-default
                ${
                  isActiveSaunaToday
                    ? `
                        bg-[#00b4b6]/12
                        text-[#007f81]
                      `
                    : `
                        bg-[#3e3a3a]
                        text-white
                        shadow-sm
                        hover:-translate-y-0.5
                        hover:bg-[#2f2c2c]
                      `
                }
              `}
            >
              {isActiveSaunaToday ? (
                <>
                  <Check
                    className="size-4"
                    strokeWidth={2.3}
                    aria-hidden="true"
                  />

                  今日の予定に設定済み
                </>
              ) : (
                <>
                  <Sparkles
                    className="size-4"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />

                  選択中の施設に決める
                </>
              )}
            </button>
          ) : (
            <div
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                rounded-full
                bg-[#e6e5ef]/55
                px-5
                text-sm
                font-semibold
                text-[#3e3a3a]/40
              "
            >
              施設を選択してください
            </div>
          )}

          {todaySauna ? (
            <button
              type="button"
              onClick={
                onClearTodaySauna
              }
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#3e3a3a]/9
                bg-white
                px-4
                text-sm
                font-semibold
                text-[#3e3a3a]/55
                transition-colors
                hover:border-[#e95884]/25
                hover:bg-[#e95884]/8
                hover:text-[#c23d65]
              "
            >
              <Trash2
                className="size-4"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              予定を解除
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
