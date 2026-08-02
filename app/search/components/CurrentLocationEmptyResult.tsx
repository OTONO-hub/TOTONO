import Link from "next/link";
import { LocateFixed } from "lucide-react";

import {
  CURRENT_LOCATION_RADIUS_OPTIONS,
  CurrentLocationRadiusControls,
  createLocationResetHref,
  createRadiusHref,
} from "./CurrentLocationRadiusControls";

type SaunaSortKey = "distance" | "popular" | "rating";

type CurrentLocationEmptyResultProps = {
  currentRadiusKm: number;
  currentSort: SaunaSortKey;
  description: string;
  searchParams: URLSearchParams;
};

/**
 * 現在地検索が0件だった場合の表示です。
 *
 * 結果がなくても、位置情報を取り直さずに
 * 検索半径を広げられるようにします。
 */
export function CurrentLocationEmptyResult({
  currentRadiusKm,
  currentSort,
  description,
  searchParams,
}: CurrentLocationEmptyResultProps) {
  const nextRadiusKm =
    getNextLocationRadiusKm(currentRadiusKm);

  return (
    <section
      className="
        mt-10
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-12
        shadow-sm
        backdrop-blur-md
        sm:px-10
        sm:py-14
      "
    >
      <div
        className="
          mx-auto
          max-w-2xl
          text-center
        "
      >
        <div
          className="
            mx-auto
            flex
            size-14
            items-center
            justify-center
            rounded-full
            bg-secondary/25
            text-foreground
          "
        >
          <LocateFixed
            className="size-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <h2
          className="
            mt-6
            text-xl
            font-semibold
            tracking-tight
            text-foreground
          "
        >
          現在地周辺に施設が見つかりませんでした
        </h2>

        <p
          className="
            mx-auto
            mt-3
            max-w-lg
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          {description}
        </p>

        <div
          className="
            mt-8
            rounded-[1.5rem]
            border
            border-secondary/30
            bg-secondary/10
            p-5
          "
        >
          <p
            className="
              text-sm
              font-semibold
              text-foreground
            "
          >
            検索半径を広げる
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            現在は{currentRadiusKm}km以内を検索しています。
          </p>

          {nextRadiusKm !== null ? (
            <Link
              href={createRadiusHref(
                searchParams,
                nextRadiusKm,
                currentSort,
              )}
              scroll={false}
              className="
                mt-5
                inline-flex
                min-h-11
                items-center
                justify-center
                rounded-full
                bg-foreground
                px-5
                text-sm
                font-semibold
                text-background
                shadow-sm
                transition
                duration-200
                hover:opacity-90
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-foreground
                focus-visible:ring-offset-2
                motion-reduce:transition-none
              "
            >
              {nextRadiusKm}kmまで広げて探す
            </Link>
          ) : (
            <Link
              href={createLocationResetHref(searchParams)}
              scroll={false}
              className="
                mt-5
                inline-flex
                min-h-11
                items-center
                justify-center
                rounded-full
                bg-foreground
                px-5
                text-sm
                font-semibold
                text-background
                shadow-sm
                transition
                duration-200
                hover:opacity-90
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-foreground
                focus-visible:ring-offset-2
                motion-reduce:transition-none
              "
            >
              通常検索へ切り替える
            </Link>
          )}

          <div
            className="
              mt-5
              flex
              justify-center
            "
          >
            <CurrentLocationRadiusControls
              currentRadiusKm={currentRadiusKm}
              currentSort={currentSort}
              distanceRange={null}
              resultCount={0}
              searchParams={searchParams}
              showResultCount={false}
            />
          </div>
        </div>
      </div>
    </section>
  );
}

/**
 * 現在選択中の半径より、
 * 1段階広い検索半径を返します。
 *
 * すでに最大半径の場合はnullを返します。
 */
function getNextLocationRadiusKm(
  currentRadiusKm: number,
): number | null {
  return (
    CURRENT_LOCATION_RADIUS_OPTIONS.find(
      (radiusOption) =>
        radiusOption > currentRadiusKm,
    ) ?? null
  );
}
