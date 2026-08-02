"use client";

import {
  Check,
  Compass,
  MapPin,
  Route,
  Sparkles,
} from "lucide-react";

type SelectedSaunaRecommendationProps = {
  saunaName: string;
  prefecture?: string | null;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  ranking: number;
  currentLocation?: {
    latitude: number;
    longitude: number;
  } | null;
  isComparisonSauna: boolean;
};

const EARTH_RADIUS_KM = 6371;

function degreesToRadians(
  degrees: number
): number {
  return (
    (degrees * Math.PI) /
    180
  );
}

function hasValidCoordinate(
  value: number | null | undefined,
  minimum: number,
  maximum: number
): value is number {
  return (
    typeof value === "number" &&
    Number.isFinite(value) &&
    value >= minimum &&
    value <= maximum
  );
}

function calculateDistanceKm(
  startLatitude: number,
  startLongitude: number,
  endLatitude: number,
  endLongitude: number
): number {
  const latitudeDifference =
    degreesToRadians(
      endLatitude -
        startLatitude
    );

  const longitudeDifference =
    degreesToRadians(
      endLongitude -
        startLongitude
    );

  const startLatitudeRadians =
    degreesToRadians(
      startLatitude
    );

  const endLatitudeRadians =
    degreesToRadians(
      endLatitude
    );

  const haversine =
    Math.sin(
      latitudeDifference / 2
    ) **
      2 +
    Math.cos(
      startLatitudeRadians
    ) *
      Math.cos(
        endLatitudeRadians
      ) *
      Math.sin(
        longitudeDifference / 2
      ) **
        2;

  const angularDistance =
    2 *
    Math.atan2(
      Math.sqrt(haversine),
      Math.sqrt(
        1 - haversine
      )
    );

  return (
    EARTH_RADIUS_KM *
    angularDistance
  );
}

function formatDistance(
  distanceKm: number
): string {
  if (distanceKm < 1) {
    return `${Math.round(
      distanceKm * 1000
    )}m`;
  }

  if (distanceKm < 10) {
    return `${distanceKm.toFixed(
      1
    )}km`;
  }

  return `${Math.round(
    distanceKm
  )}km`;
}

function getDistanceMessage(
  distanceKm: number
): string {
  if (distanceKm <= 3) {
    return "今いる場所から立ち寄りやすい距離です";
  }

  if (distanceKm <= 10) {
    return "今日のお出かけ候補にしやすい距離です";
  }

  if (distanceKm <= 30) {
    return "少し足を延ばして訪れたい施設です";
  }

  return "次のサウナ旅の候補として保存しておけます";
}

export function SelectedSaunaRecommendation({
  saunaName,
  prefecture,
  city,
  latitude,
  longitude,
  ranking,
  currentLocation,
  isComparisonSauna,
}: SelectedSaunaRecommendationProps) {
  const location = [
    prefecture,
    city,
  ]
    .filter(Boolean)
    .join(" ");

  const hasSaunaCoordinates =
    hasValidCoordinate(
      latitude,
      -90,
      90
    ) &&
    hasValidCoordinate(
      longitude,
      -180,
      180
    );

  const hasCurrentLocation =
    Boolean(
      currentLocation &&
        hasValidCoordinate(
          currentLocation.latitude,
          -90,
          90
        ) &&
        hasValidCoordinate(
          currentLocation.longitude,
          -180,
          180
        )
    );

  const distanceKm =
    hasSaunaCoordinates &&
    hasCurrentLocation &&
    currentLocation
      ? calculateDistanceKm(
          currentLocation.latitude,
          currentLocation.longitude,
          latitude,
          longitude
        )
      : null;

  return (
    <section
      aria-labelledby="selected-sauna-recommendation-heading"
      className="
        overflow-hidden
        rounded-[1.75rem]
        border
        border-[#fdd000]/35
        bg-gradient-to-br
        from-white
        via-white
        to-[#fdd000]/10
        shadow-[0_18px_50px_rgba(62,58,58,0.07)]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          p-5
          sm:p-6
        "
      >
        <div
          className="
            flex
            items-start
            justify-between
            gap-4
          "
        >
          <div
            className="
              flex
              min-w-0
              items-start
              gap-3.5
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
                shadow-[0_8px_22px_rgba(253,208,0,0.28)]
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
                  tracking-[0.12em]
                  text-[#3e3a3a]/45
                "
              >
                WHY THIS SAUNA?
              </p>

              <h2
                id="selected-sauna-recommendation-heading"
                className="
                  mt-1
                  text-base
                  font-bold
                  tracking-[-0.02em]
                  text-[#3e3a3a]
                  sm:text-lg
                "
              >
                この施設が気になる理由
              </h2>

              <p
                className="
                  mt-1
                  line-clamp-1
                  text-sm
                  text-[#3e3a3a]/55
                "
              >
                {saunaName}
              </p>
            </div>
          </div>

          <span
            className="
              shrink-0
              rounded-full
              border
              border-[#3e3a3a]/8
              bg-white/80
              px-3
              py-1.5
              text-[0.6875rem]
              font-bold
              text-[#3e3a3a]/55
            "
          >
            検索結果 {ranking}番
          </span>
        </div>

        <div
          className="
            grid
            gap-3
            sm:grid-cols-2
          "
        >
          <article
            className="
              flex
              items-start
              gap-3
              rounded-[1.25rem]
              border
              border-[#3e3a3a]/7
              bg-white/75
              p-4
            "
          >
            <span
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#9fd9f6]/25
                text-[#3e3a3a]
              "
            >
              <Compass
                className="size-4"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-[#3e3a3a]
                "
              >
                検索中に見つけた施設
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-[#3e3a3a]/50
                "
              >
                気になる施設として選択されています。詳細や地図を確認して、今日の候補にできます。
              </p>
            </div>
          </article>

          <article
            className="
              flex
              items-start
              gap-3
              rounded-[1.25rem]
              border
              border-[#3e3a3a]/7
              bg-white/75
              p-4
            "
          >
            <span
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#00b4b6]/12
                text-[#007f81]
              "
            >
              <MapPin
                className="size-4"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </span>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-[#3e3a3a]
                "
              >
                {location ||
                  "施設エリア"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-[#3e3a3a]/50
                "
              >
                {location
                  ? `${location}で探しているときの候補として確認できます。`
                  : "施設詳細ページで住所やアクセス情報を確認できます。"}
              </p>
            </div>
          </article>

          {distanceKm !== null ? (
            <article
              className="
                flex
                items-start
                gap-3
                rounded-[1.25rem]
                border
                border-[#3e3a3a]/7
                bg-white/75
                p-4
              "
            >
              <span
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#e6e5ef]
                  text-[#3e3a3a]
                "
              >
                <Route
                  className="size-4"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </span>

              <div>
                <p
                  className="
                    text-xs
                    font-bold
                    text-[#3e3a3a]
                  "
                >
                  現在地から約
                  {formatDistance(
                    distanceKm
                  )}
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-[#3e3a3a]/50
                  "
                >
                  {getDistanceMessage(
                    distanceKm
                  )}
                </p>
              </div>
            </article>
          ) : null}

          <article
            className="
              flex
              items-start
              gap-3
              rounded-[1.25rem]
              border
              border-[#3e3a3a]/7
              bg-white/75
              p-4
            "
          >
            <span
              className={`
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-full
                ${
                  isComparisonSauna
                    ? `
                        bg-[#00b4b6]
                        text-white
                      `
                    : `
                        bg-[#fdd000]/20
                        text-[#3e3a3a]
                      `
                }
              `}
            >
              <Check
                className="size-4"
                strokeWidth={2.1}
                aria-hidden="true"
              />
            </span>

            <div>
              <p
                className="
                  text-xs
                  font-bold
                  text-[#3e3a3a]
                "
              >
                {isComparisonSauna
                  ? "比較候補に追加済み"
                  : "ほかの施設と比較できます"}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-relaxed
                  text-[#3e3a3a]/50
                "
              >
                {isComparisonSauna
                  ? "ほかの候補と見比べながら、今日行く施設を選べます。"
                  : "最大3施設まで候補へ追加して、場所や詳細を見比べられます。"}
              </p>
            </div>
          </article>
        </div>

        <div
          className="
            rounded-[1.2rem]
            bg-[#3e3a3a]
            px-4
            py-3.5
            text-white
            sm:px-5
          "
        >
          <p
            className="
              text-xs
              font-semibold
              leading-relaxed
              text-white/85
            "
          >
            今日の気分に合いそうなら、施設詳細を確認して次のサウナ時間を整えましょう。
          </p>
        </div>
      </div>
    </section>
  );
}