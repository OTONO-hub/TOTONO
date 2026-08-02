"use client";

import {
  Check,
  RotateCcw,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";

import { CurrentLocationFilter } from "@/components/search/CurrentLocationFilter";

const FILTERS = [
  {
    id: "sauna",
    label: "サウナ",
  },
  {
    id: "cold-bath",
    label: "水風呂",
  },
  {
    id: "outdoor",
    label: "外気浴",
  },
  {
    id: "restaurant",
    label: "レストラン",
  },
  {
    id: "parking",
    label: "駐車場",
  },
] as const;

type FilterId =
  (typeof FILTERS)[number]["id"];

function isFilterId(
  value: string
): value is FilterId {
  return FILTERS.some(
    (filter) =>
      filter.id === value
  );
}

export function SearchFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  const selectedFilters = new Set(
    searchParams
      .get("features")
      ?.split(",")
      .map((value) =>
        value.trim()
      )
      .filter(isFilterId) ?? []
  );

  /*
   * 現在の検索条件を維持したまま、
   * 設備条件だけを更新します。
   */
  const updateFilters = (
    nextFilters: Set<FilterId>
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    if (nextFilters.size > 0) {
      params.set(
        "features",
        Array.from(
          nextFilters
        ).join(",")
      );
    } else {
      params.delete("features");
    }

    const queryString =
      params.toString();

    router.push(
      queryString
        ? `${pathname}?${queryString}`
        : pathname,
      {
        scroll: false,
      }
    );
  };

  const handleFilterClick = (
    filterId: FilterId
  ) => {
    const nextFilters =
      new Set(
        selectedFilters
      );

    if (
      nextFilters.has(filterId)
    ) {
      nextFilters.delete(
        filterId
      );
    } else {
      nextFilters.add(
        filterId
      );
    }

    updateFilters(nextFilters);
  };

  const handleReset = () => {
    updateFilters(
      new Set<FilterId>()
    );
  };

  return (
    <div
      className="
        flex
        flex-col
        gap-5
      "
    >
      <section
        aria-labelledby="search-filters-heading"
        className="
          rounded-[2rem]
          border
          border-border/60
          bg-card
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <div
          className="
            flex
            flex-col
            justify-between
            gap-4
            sm:flex-row
            sm:items-center
          "
        >
          <div>
            <h2
              id="search-filters-heading"
              className="
                text-lg
                font-semibold
                tracking-[-0.02em]
                text-foreground
              "
            >
              設備で探す
            </h2>

            <p
              className="
                mt-1
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              気になる設備を選択してください。
            </p>
          </div>

          {selectedFilters.size >
            0 && (
            <button
              type="button"
              onClick={
                handleReset
              }
              className="
                inline-flex
                w-fit
                items-center
                gap-2
                rounded-full
                px-3
                py-2
                text-sm
                font-medium
                text-muted-foreground
                transition
                hover:bg-muted
                hover:text-foreground
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
              "
            >
              <RotateCcw
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              選択を解除
            </button>
          )}
        </div>

        <div
          className="
            mt-5
            flex
            flex-wrap
            gap-3
          "
        >
          {FILTERS.map(
            (filter) => {
              const isSelected =
                selectedFilters.has(
                  filter.id
                );

              return (
                <button
                  key={
                    filter.id
                  }
                  type="button"
                  aria-pressed={
                    isSelected
                  }
                  onClick={() =>
                    handleFilterClick(
                      filter.id
                    )
                  }
                  className={`
                    inline-flex
                    min-h-11
                    items-center
                    gap-2
                    rounded-full
                    border
                    px-4
                    py-2
                    text-sm
                    font-medium
                    transition
                    duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    ${
                      isSelected
                        ? `
                          border-foreground
                          bg-foreground
                          text-background
                          shadow-sm
                        `
                        : `
                          border-border
                          bg-background
                          text-foreground
                          hover:border-foreground/20
                          hover:bg-secondary/10
                        `
                    }
                  `}
                >
                  <span
                    className={`
                      flex
                      size-5
                      items-center
                      justify-center
                      rounded-full
                      border
                      ${
                        isSelected
                          ? `
                            border-background/30
                            bg-background/15
                          `
                          : `
                            border-border
                            bg-card
                          `
                      }
                    `}
                  >
                    {isSelected && (
                      <Check
                        className="size-3"
                        strokeWidth={2.2}
                        aria-hidden="true"
                      />
                    )}
                  </span>

                  {filter.label}
                </button>
              );
            }
          )}
        </div>
      </section>

      <CurrentLocationFilter />
    </div>
  );
}
