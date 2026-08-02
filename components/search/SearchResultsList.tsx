"use client";

import { type ReactNode } from "react";

import {
  Check,
  List,
  Plus,
} from "lucide-react";

import type { SearchSauna } from "@/components/search/search-results-explorer.types";

type SearchResultsListProps = {
  saunas: SearchSauna[];
  cards: ReactNode[];
  activeSaunaId: string | null;
  comparisonSaunaIds: string[];
  maximumComparisonCount: number;
  isVisibleOnMobile: boolean;
  onSelectSauna: (
    saunaId: string
  ) => void;
  onToggleComparison: (
    saunaId: string
  ) => void;
};

export function SearchResultsList({
  saunas,
  cards,
  activeSaunaId,
  comparisonSaunaIds,
  maximumComparisonCount,
  isVisibleOnMobile,
  onSelectSauna,
  onToggleComparison,
}: SearchResultsListProps) {
  const comparisonIsFull =
    comparisonSaunaIds.length >=
    maximumComparisonCount;

  return (
    <section
      aria-labelledby="search-results-list-heading"
      className={`
        min-w-0
        ${
          isVisibleOnMobile
            ? "block"
            : "hidden"
        }
        xl:block
      `}
    >
      <div
        className="
          mb-5
          flex
          items-center
          justify-between
          gap-4
        "
      >
        <div
          className="
            flex
            items-center
            gap-2.5
          "
        >
          <span
            className="
              flex
              size-8
              items-center
              justify-center
              rounded-full
              bg-[#e6e5ef]
              text-[#3e3a3a]
            "
          >
            <List
              className="size-3.5"
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div>
            <h2
              id="search-results-list-heading"
              className="
                text-sm
                font-semibold
                text-[#3e3a3a]
              "
            >
              施設一覧
            </h2>

            <p
              className="
                mt-0.5
                text-xs
                text-[#3e3a3a]/45
              "
            >
              番号は地図上のピンと対応しています
            </p>
          </div>
        </div>

        <span
          className="
            rounded-full
            border
            border-[#3e3a3a]/8
            bg-white/75
            px-3
            py-1.5
            text-xs
            font-semibold
            text-[#3e3a3a]/55
          "
        >
          {saunas.length}件
        </span>
      </div>

      <div
        className="
          grid
          gap-6
          sm:grid-cols-2
          xl:grid-cols-1
          2xl:grid-cols-2
        "
      >
        {cards.map(
          (
            card,
            index
          ) => {
            const sauna =
              saunas[index];

            if (!sauna) {
              return (
                <div
                  key={`unmatched-card-${index}`}
                >
                  {card}
                </div>
              );
            }

            const ranking =
              index + 1;

            const isActive =
              activeSaunaId ===
              sauna.id;

            const isComparisonSauna =
              comparisonSaunaIds.includes(
                sauna.id
              );

            const handleMouseEnter = (): void => {
  onSelectSauna(sauna.id);
};

const handleFocusCapture = (): void => {
  onSelectSauna(sauna.id);
};

const handleClickCapture = (): void => {
  onSelectSauna(sauna.id);
};

            return (
              <div
                key={sauna.id}
                id={`sauna-card-${sauna.id}`}
                data-sauna-result-card="true"
                data-sauna-id={
                  sauna.id
                }
                data-search-ranking={
                  ranking
                }
                data-selected={
                  isActive
                    ? "true"
                    : "false"
                }
                aria-current={
                  isActive
                    ? "true"
                    : undefined
                }
                onMouseEnter={
                  handleMouseEnter
                }
                onFocusCapture={
                  handleFocusCapture
                }
                onClickCapture={
                  handleClickCapture
                }
                className={`
                  group/sauna-result
                  relative
                  scroll-mt-32
                  rounded-[2rem]
                  transition-all
                  duration-300
                  ease-out
                  motion-reduce:transition-none
                  ${
                    isActive
                      ? `
                          ring-2
                          ring-[#fdd000]
                          ring-offset-4
                          ring-offset-[#e6e5ef]
                          shadow-[0_24px_60px_rgba(253,208,0,0.18)]
                        `
                      : `
                          hover:-translate-y-0.5
                        `
                  }
                `}
              >
                <div
                  aria-label={`検索結果${ranking}番目`}
                  className={`
                    pointer-events-none
                    absolute
                    left-4
                    top-4
                    z-20
                    flex
                    size-10
                    items-center
                    justify-center
                    rounded-full
                    border-[3px]
                    border-white
                    text-sm
                    font-extrabold
                    shadow-[0_8px_20px_rgba(62,58,58,0.28)]
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? `
                            -translate-y-1
                            scale-110
                            bg-[#fdd000]
                            text-[#3e3a3a]
                            shadow-[0_12px_28px_rgba(253,208,0,0.38)]
                          `
                        : `
                            bg-[#3e3a3a]
                            text-white
                            group-hover/sauna-result:-translate-y-1
                            group-hover/sauna-result:scale-105
                            group-hover/sauna-result:bg-[#fdd000]
                            group-hover/sauna-result:text-[#3e3a3a]
                            group-focus-within/sauna-result:-translate-y-1
                            group-focus-within/sauna-result:scale-105
                            group-focus-within/sauna-result:bg-[#fdd000]
                            group-focus-within/sauna-result:text-[#3e3a3a]
                          `
                    }
                  `}
                >
                  {ranking}
                </div>

                <span
                  aria-hidden="true"
                  className={`
                    pointer-events-none
                    absolute
                    left-[1.875rem]
                    top-[3.05rem]
                    z-20
                    size-3
                    rotate-45
                    border-b-[3px]
                    border-r-[3px]
                    border-white
                    transition-all
                    duration-300
                    ${
                      isActive
                        ? `
                            -translate-y-1
                            bg-[#fdd000]
                          `
                        : `
                            bg-[#3e3a3a]
                            group-hover/sauna-result:-translate-y-1
                            group-hover/sauna-result:bg-[#fdd000]
                            group-focus-within/sauna-result:-translate-y-1
                            group-focus-within/sauna-result:bg-[#fdd000]
                          `
                    }
                  `}
                />

                <div
                  className="
                    absolute
                    right-4
                    top-4
                    z-30
                    flex
                    flex-col
                    items-end
                    gap-2
                  "
                >
                  {isActive ? (
                    <div
                      className="
                        pointer-events-none
                        inline-flex
                        min-h-8
                        items-center
                        gap-1.5
                        rounded-full
                        border
                        border-white/80
                        bg-[#fdd000]
                        px-3
                        text-[0.6875rem]
                        font-bold
                        text-[#3e3a3a]
                        shadow-[0_8px_22px_rgba(253,208,0,0.30)]
                      "
                    >
                      <Check
                        className="size-3.5"
                        strokeWidth={2.5}
                        aria-hidden="true"
                      />

                      選択中
                    </div>
                  ) : null}

                  <button
                    type="button"
                    aria-pressed={
                      isComparisonSauna
                    }
                    disabled={
                      !isComparisonSauna &&
                      comparisonIsFull
                    }
                    onClick={(
                      event
                    ) => {
                      event.preventDefault();
                      event.stopPropagation();

                      onToggleComparison(
                        sauna.id
                      );
                    }}
                    className={`
                      inline-flex
                      min-h-8
                      items-center
                      justify-center
                      gap-1.5
                      rounded-full
                      border
                      border-white/80
                      px-3
                      text-[0.6875rem]
                      font-bold
                      shadow-md
                      backdrop-blur-md
                      transition-all
                      duration-200
                      active:scale-[0.97]
                      disabled:cursor-not-allowed
                      disabled:opacity-45
                      ${
                        isComparisonSauna
                          ? `
                              bg-[#00b4b6]
                              text-white
                            `
                          : `
                              bg-white/92
                              text-[#3e3a3a]
                              hover:bg-[#00b4b6]
                              hover:text-white
                            `
                      }
                    `}
                  >
                    {isComparisonSauna ? (
                      <>
                        <Check
                          className="size-3.5"
                          strokeWidth={2.3}
                          aria-hidden="true"
                        />

                        候補
                      </>
                    ) : (
                      <>
                        <Plus
                          className="size-3.5"
                          strokeWidth={2}
                          aria-hidden="true"
                        />

                        比較
                      </>
                    )}
                  </button>
                </div>

                {card}
              </div>
            );
          }
        )}
      </div>
    </section>
  );
}
