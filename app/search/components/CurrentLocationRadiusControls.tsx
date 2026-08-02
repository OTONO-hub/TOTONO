import Link from "next/link";

type SaunaSortKey =
  | "distance"
  | "popular"
  | "rating";

export const CURRENT_LOCATION_RADIUS_OPTIONS = [
  3,
  5,
  10,
  20,
] as const;

export type SaunaDistanceRange = {
  nearestKm: number;
  farthestKm: number;
};

type CurrentLocationRadiusControlsProps = {
  currentRadiusKm: number;
  currentSort: SaunaSortKey;
  distanceRange: SaunaDistanceRange | null;
  resultCount: number;
  searchParams: URLSearchParams;
  showResultCount?: boolean;
};

export function CurrentLocationRadiusControls({
  currentRadiusKm,
  currentSort,
  distanceRange,
  resultCount,
  searchParams,
  showResultCount = true,
}: CurrentLocationRadiusControlsProps) {
  return (
    <section
      aria-labelledby="current-location-search-heading"
      className="
        flex
        w-full
        flex-col
        gap-3
        sm:w-auto
        sm:items-end
      "
    >
      <h2
        id="current-location-search-heading"
        className="sr-only"
      >
        現在地検索結果
      </h2>

      {showResultCount && (
        <div
          aria-live="polite"
          aria-atomic="true"
          className="
            flex
            flex-wrap
            items-center
            gap-2
          "
        >
          <span
            className="
              inline-flex
              min-h-11
              items-center
              rounded-full
              bg-white
              px-4
              text-xs
              font-medium
              shadow-sm
            "
          >
            {resultCount}施設
          </span>

          {distanceRange && (
            <>
              <span
                className="
                  inline-flex
                  min-h-11
                  items-center
                  rounded-full
                  border
                  border-secondary/35
                  bg-secondary/15
                  px-3
                  text-xs
                  font-medium
                "
              >
                最寄り 約
                {formatDistanceKm(
                  distanceRange.nearestKm
                )}
                km
              </span>

              <span
                className="
                  inline-flex
                  min-h-11
                  items-center
                  rounded-full
                  border
                  border-emerald-200
                  bg-emerald-50
                  px-3
                  text-xs
                  font-medium
                  text-emerald-700
                "
              >
                検索半径
                {currentRadiusKm}
                km
              </span>

              {distanceRange.farthestKm >
                distanceRange.nearestKm && (
                <span
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    rounded-full
                    border
                    border-border/70
                    bg-white/80
                    px-3
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  最遠 約
                  {formatDistanceKm(
                    distanceRange.farthestKm
                  )}
                  km
                </span>
              )}
            </>
          )}
        </div>
      )}

      <nav
        aria-label="検索半径を変更"
        className="
          flex
          flex-wrap
          gap-2
        "
      >
        {CURRENT_LOCATION_RADIUS_OPTIONS.map(
          (radiusOption) => {
            const isActive =
              currentRadiusKm ===
              radiusOption;

            if (isActive) {
              return (
                <span
                  key={radiusOption}
                  aria-current="true"
                  className="
                    inline-flex
                    min-h-11
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-foreground
                    bg-foreground
                    px-4
                    text-xs
                    font-semibold
                    text-background
                    shadow-sm
                  "
                >
                  {radiusOption}
                  km
                </span>
              );
            }

            return (
              <Link
                key={radiusOption}
                href={createRadiusHref(
                  searchParams,
                  radiusOption,
                  currentSort
                )}
                aria-label={`検索半径を${radiusOption}kmへ変更`}
                scroll={false}
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-border/70
                  bg-white
                  px-4
                  text-xs
                  font-medium
                  text-muted-foreground
                  transition
                  duration-200
                  hover:border-foreground/20
                  hover:text-foreground
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-background
                  motion-reduce:transition-none
                "
              >
                {radiusOption}
                km
              </Link>
            );
          }
        )}
      </nav>

      <Link
        href={createLocationResetHref(
          searchParams
        )}
        scroll={false}
        className="
          inline-flex
          min-h-11
          items-center
          text-xs
          font-medium
          text-muted-foreground
          underline
          underline-offset-4
          transition
          hover:text-foreground
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          motion-reduce:transition-none
        "
      >
        現在地検索を解除する
      </Link>
    </section>
  );
}

export function createLocationResetHref(
  searchParams: URLSearchParams
): string {
  const params =
    new URLSearchParams(
      searchParams.toString()
    );

  params.delete("location");
  params.delete("lat");
  params.delete("lng");
  params.delete("radius");

  if (
    params.get("sort") ===
    "distance"
  ) {
    params.set("sort", "popular");
  }

  const query =
    params.toString();

  return query
    ? `/search?${query}`
    : "/search";
}

export function createRadiusHref(
  searchParams: URLSearchParams,
  radiusKm: number,
  currentSort: SaunaSortKey
): string {
  const params =
    new URLSearchParams(
      searchParams.toString()
    );

  params.set(
    "radius",
    radiusKm.toString()
  );

  params.set(
    "sort",
    currentSort
  );

  return `/search?${params.toString()}`;
}

function formatDistanceKm(
  distanceKm: number
): string {
  if (distanceKm < 1) {
    return distanceKm.toFixed(2);
  }

  return distanceKm.toFixed(1);
}
