"use client";

import {
  Building2,
  FileText,
  RotateCcw,
  Search,
  SlidersHorizontal,
} from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import {
  normalizeSearchSort,
  type SearchSort,
} from "@/services/search-sort";
import type { SaunaFeature } from "@/services/saunas";

type SearchResultSummaryProps = {
  query: string;
  saunaCount: number;
  postCount: number;
};

type FeatureDefinition = {
  value: SaunaFeature;
  label: string;
};

const FEATURE_DEFINITIONS: FeatureDefinition[] = [
  {
    value: "sauna",
    label: "サウナ室",
  },
  {
    value: "cold-bath",
    label: "水風呂",
  },
  {
    value: "outdoor",
    label: "外気浴",
  },
  {
    value: "rest-area",
    label: "休憩スペース",
  },
  {
    value: "restaurant",
    label: "食事処",
  },
  {
    value: "parking",
    label: "駐車場",
  },
];

const SORT_LABELS: Record<
  SearchSort,
  string
> = {
  popular: "人気順",
  rating: "評価順",
  posts: "投稿数順",
  name: "施設名順",
};

export function SearchResultSummary({
  query,
  saunaCount,
  postCount,
}: SearchResultSummaryProps) {
  const searchParams =
    useSearchParams();

  const selectedFeatures =
    getSelectedFeatures(
      searchParams.get("features")
    );

  const selectedSort =
    normalizeSearchSort(
      searchParams.get("sort") ??
        undefined
    );

  const area =
    searchParams.get("area");

  const hasAdditionalConditions =
    selectedFeatures.length > 0 ||
    selectedSort !== "popular" ||
    Boolean(area);

  const totalCount =
    saunaCount + postCount;

  return (
    <section
      aria-labelledby="search-result-summary-heading"
      className="
        mt-8
        overflow-hidden
        rounded-[1.75rem]
        border
        border-border/55
        bg-card/80
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-6
          px-5
          py-6
          sm:px-7
          sm:py-7
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >
        <div className="min-w-0">
          <div
            className="
              flex
              items-center
              gap-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.18em]
              text-muted-foreground
            "
          >
            <Search
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Search Results
          </div>

          <h2
            id="search-result-summary-heading"
            className="
              mt-3
              break-words
              text-xl
              font-semibold
              tracking-[-0.03em]
              text-foreground
              sm:text-2xl
            "
          >
            「{query}」の検索結果
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            条件に一致する結果が
            <span
              className="
                mx-1
                font-semibold
                tabular-nums
                text-foreground
              "
            >
              {totalCount}件
            </span>
            見つかりました。
          </p>
        </div>

        <div
          className="
            grid
            grid-cols-2
            gap-3
            sm:flex
            sm:items-center
          "
        >
          <ResultCountCard
            icon={
              <Building2
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="サウナ施設"
            count={saunaCount}
          />

          <ResultCountCard
            icon={
              <FileText
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            label="サ活"
            count={postCount}
          />
        </div>
      </div>

      <div
        className="
          border-t
          border-border/50
          bg-muted/25
          px-5
          py-5
          sm:px-7
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
          <div className="min-w-0">
            <div
              className="
                flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.16em]
                text-muted-foreground
              "
            >
              <SlidersHorizontal
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Current Conditions
            </div>

            <div
              className="
                mt-3
                flex
                flex-wrap
                items-center
                gap-2
              "
            >
              <ConditionBadge>
                並び順：
                {SORT_LABELS[selectedSort]}
              </ConditionBadge>

              {selectedFeatures.map(
                (feature) => (
                  <ConditionBadge
                    key={feature.value}
                  >
                    {feature.label}
                  </ConditionBadge>
                )
              )}

              {selectedFeatures.length ===
                0 && (
                <span
                  className="
                    text-xs
                    leading-6
                    text-muted-foreground
                  "
                >
                  設備条件は指定されていません
                </span>
              )}
            </div>
          </div>

          {hasAdditionalConditions && (
            <Link
              href={createResetUrl(
                query,
                area
              )}
              scroll={false}
              className="
                inline-flex
                h-10
                shrink-0
                items-center
                justify-center
                gap-2
                self-start
                rounded-full
                border
                border-border/60
                bg-card
                px-4
                text-xs
                font-semibold
                text-foreground
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:border-primary/20
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                sm:self-center
              "
            >
              <RotateCcw
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              条件を解除
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

type ResultCountCardProps = {
  icon: React.ReactNode;
  label: string;
  count: number;
};

function ResultCountCard({
  icon,
  label,
  count,
}: ResultCountCardProps) {
  return (
    <div
      className="
        min-w-32
        rounded-2xl
        border
        border-border/55
        bg-background/65
        px-4
        py-3
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-xs
          font-medium
          text-muted-foreground
        "
      >
        {icon}
        {label}
      </div>

      <p
        className="
          mt-1.5
          text-xl
          font-semibold
          tabular-nums
          tracking-[-0.03em]
          text-foreground
        "
      >
        {count}
        <span
          className="
            ml-1
            text-xs
            font-medium
            text-muted-foreground
          "
        >
          件
        </span>
      </p>
    </div>
  );
}

type ConditionBadgeProps = {
  children: React.ReactNode;
};

function ConditionBadge({
  children,
}: ConditionBadgeProps) {
  return (
    <span
      className="
        inline-flex
        min-h-8
        items-center
        rounded-full
        border
        border-primary/10
        bg-primary/5
        px-3
        py-1
        text-xs
        font-medium
        leading-5
        text-foreground
      "
    >
      {children}
    </span>
  );
}

function getSelectedFeatures(
  value: string | null
): FeatureDefinition[] {
  if (!value) {
    return [];
  }

  const selectedValues = new Set(
    value
      .split(",")
      .map((feature) =>
        feature.trim()
      )
      .filter(Boolean)
  );

  return FEATURE_DEFINITIONS.filter(
    (feature) =>
      selectedValues.has(
        feature.value
      )
  );
}

function createResetUrl(
  query: string,
  area: string | null
) {
  const params =
    new URLSearchParams();

  if (query) {
    params.set("q", query);
  }

  /*
   * エリア案内は残し、
   * 設備条件と並び順だけを解除します。
   */
  if (area) {
    params.set("area", area);
  }

  const queryString =
    params.toString();

  return queryString
    ? `/search?${queryString}`
    : "/search";
}
