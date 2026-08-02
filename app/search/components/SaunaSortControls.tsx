import type { ReactNode } from "react";
import Link from "next/link";
import {
  Flame,
  Navigation,
  Star,
} from "lucide-react";

type SaunaSortKey =
  | "distance"
  | "popular"
  | "rating";

type SaunaSortControlsProps = {
  currentSort: SaunaSortKey;
  isCurrentLocationSearch: boolean;
  searchParams: URLSearchParams;
};

type SortOption = {
  value: SaunaSortKey;
  label: string;
  description: string;
  icon: ReactNode;
};

/**
 * 施設検索結果の並び替えリンクです。
 *
 * Linkを使用するため、JavaScriptが無効な環境でも
 * 通常のページ遷移として利用できます。
 */
export function SaunaSortControls({
  currentSort,
  isCurrentLocationSearch,
  searchParams,
}: SaunaSortControlsProps) {
  const sortOptions: SortOption[] = [
    ...(isCurrentLocationSearch
      ? [
          {
            value: "distance" as const,
            label: "近い順",
            description:
              "現在地から近い施設を優先",
            icon: (
              <Navigation
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />
            ),
          },
        ]
      : []),
    {
      value: "popular",
      label: "人気順",
      description:
        "サ活・お気に入りが多い順",
      icon: (
        <Flame
          aria-hidden="true"
          className="size-4"
          strokeWidth={1.8}
        />
      ),
    },
    {
      value: "rating",
      label: "評価順",
      description:
        "平均評価が高い施設を優先",
      icon: (
        <Star
          aria-hidden="true"
          className="size-4"
          strokeWidth={1.8}
        />
      ),
    },
  ];

  const gridColumnClassName =
    sortOptions.length === 3
      ? "sm:grid-cols-3"
      : "sm:grid-cols-2";

  return (
    <nav
      aria-label="サウナ施設の並び替え"
      className="
        mt-6
        rounded-[1.5rem]
        border
        border-border/55
        bg-card/70
        p-2
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className={`
          grid
          gap-2
          ${gridColumnClassName}
        `}
      >
        {sortOptions.map((option) => {
          const isActive =
            currentSort === option.value;

          return (
            <Link
              key={option.value}
              href={createSortHref(
                searchParams,
                option.value
              )}
              aria-current={
                isActive
                  ? "true"
                  : undefined
              }
              aria-label={`${option.label}に並び替える。${option.description}${
                isActive
                  ? "。現在選択中です"
                  : ""
              }`}
              scroll={false}
              className={`
                flex
                min-h-11
                min-w-0
                items-center
                gap-3
                rounded-[1.1rem]
                border
                px-4
                py-3
                text-left
                transition-all
                duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                motion-reduce:transition-none
                ${
                  isActive
                    ? `
                      border-foreground/10
                      bg-foreground
                      text-background
                      shadow-sm
                    `
                    : `
                      border-transparent
                      text-foreground
                      hover:border-border
                      hover:bg-white/80
                    `
                }
              `}
            >
              <span
                aria-hidden="true"
                className={`
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  ${
                    isActive
                      ? `
                        bg-white/12
                        text-background
                      `
                      : `
                        bg-secondary/25
                        text-foreground
                      `
                  }
                `}
              >
                {option.icon}
              </span>

              <span
                aria-hidden="true"
                className="min-w-0"
              >
                <span
                  className="
                    block
                    text-sm
                    font-semibold
                  "
                >
                  {option.label}
                </span>

                <span
                  className={`
                    mt-0.5
                    hidden
                    truncate
                    text-[0.6875rem]
                    sm:block
                    ${
                      isActive
                        ? "text-background/65"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {option.description}
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

/**
 * 現在の検索条件を保ったまま、
 * 並び順だけを変更したURLを作成します。
 */
function createSortHref(
  searchParams: URLSearchParams,
  sort: SaunaSortKey
): string {
  const params = new URLSearchParams(
    searchParams.toString()
  );

  params.set("sort", sort);

  return `/search?${params.toString()}`;
}
