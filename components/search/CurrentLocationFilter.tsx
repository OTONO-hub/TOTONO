"use client";

import {
  LoaderCircle,
  LocateFixed,
  MapPin,
  RotateCcw,
} from "lucide-react";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
import { useState } from "react";

const DISTANCE_OPTIONS = [
  {
    value: 5,
    label: "5km以内",
  },
  {
    value: 10,
    label: "10km以内",
  },
  {
    value: 20,
    label: "20km以内",
  },
] as const;

type Distance =
  (typeof DISTANCE_OPTIONS)[number]["value"];

/*
 * 数値が検索範囲として
 * 使用できる値かを確認します。
 */
function isDistance(
  value: number
): value is Distance {
  return DISTANCE_OPTIONS.some(
    (option) =>
      option.value === value
  );
}

/*
 * URLへ保存できる緯度かを確認します。
 */
function isValidLatitude(
  value: string | null
) {
  if (!value) {
    return false;
  }

  const latitude = Number(value);

  return (
    Number.isFinite(latitude) &&
    latitude >= -90 &&
    latitude <= 90
  );
}

/*
 * URLへ保存できる経度かを確認します。
 */
function isValidLongitude(
  value: string | null
) {
  if (!value) {
    return false;
  }

  const longitude = Number(value);

  return (
    Number.isFinite(longitude) &&
    longitude >= -180 &&
    longitude <= 180
  );
}

export function CurrentLocationFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams =
    useSearchParams();

  /*
   * 現在地取得処理中かどうかを管理します。
   */
  const [loading, setLoading] =
    useState(false);

  /*
   * 位置情報の取得に失敗した場合の
   * メッセージを管理します。
   */
  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  /*
   * URLに保存されている緯度・経度を
   * 取得します。
   */
  const latitude =
    searchParams.get("lat");

  const longitude =
    searchParams.get("lng");

  /*
   * 緯度と経度が有効な場合のみ、
   * 現在地検索が有効と判断します。
   */
  const hasLocation =
    isValidLatitude(latitude) &&
    isValidLongitude(longitude);

  /*
   * URLから検索範囲を取得します。
   *
   * URLに正しい値がない場合は、
   * 10kmを初期値として使用します。
   */
  const radiusParam = Number(
    searchParams.get("radius")
  );

  const selectedRadius: Distance =
    isDistance(radiusParam)
      ? radiusParam
      : 10;

  /*
   * 現在のURL条件を維持したまま、
   * 指定されたパラメータだけを
   * 更新します。
   */
  const updateSearchParams = (
    updates: Record<
      string,
      string | null
    >
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    for (const [
      key,
      value,
    ] of Object.entries(updates)) {
      if (value === null) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
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

  /*
   * ブラウザのGeolocation APIを使って、
   * 現在地を取得します。
   */
  const handleGetCurrentLocation =
    () => {
      /*
       * 連続クリックによる
       * 二重実行を防止します。
       */
      if (loading) {
        return;
      }

      setErrorMessage(null);

      /*
       * ブラウザが位置情報取得に
       * 対応しているか確認します。
       */
      if (
        typeof navigator ===
          "undefined" ||
        !navigator.geolocation
      ) {
        setErrorMessage(
          "このブラウザでは現在地を取得できません。"
        );

        return;
      }

      setLoading(true);

      navigator.geolocation.getCurrentPosition(
        /*
         * 現在地の取得に成功した場合です。
         */
        (position) => {
          const nextLatitude =
            position.coords.latitude;

          const nextLongitude =
            position.coords.longitude;

          /*
           * 緯度・経度を小数点以下6桁に整え、
           * URLへ保存します。
           *
           * 小数点以下6桁で、
           * おおよそ10cm単位の精度があります。
           */
          updateSearchParams({
            lat:
              nextLatitude.toFixed(6),

            lng:
              nextLongitude.toFixed(6),

            radius:
              String(selectedRadius),
          });

          setLoading(false);
          setErrorMessage(null);
        },

        /*
         * 現在地の取得に失敗した場合です。
         */
        (error) => {
          setLoading(false);

          switch (error.code) {
            case error.PERMISSION_DENIED:
              setErrorMessage(
                "位置情報の利用が許可されていません。ブラウザの設定から位置情報を許可してください。"
              );
              break;

            case error.POSITION_UNAVAILABLE:
              setErrorMessage(
                "現在地を取得できませんでした。通信環境や端末の位置情報設定をご確認ください。"
              );
              break;

            case error.TIMEOUT:
              setErrorMessage(
                "現在地の取得に時間がかかっています。もう一度お試しください。"
              );
              break;

            default:
              setErrorMessage(
                "現在地の取得に失敗しました。もう一度お試しください。"
              );
              break;
          }
        },

        /*
         * 位置情報取得時の設定です。
         */
        {
          /*
           * バッテリー消費を抑えるため、
           * GPSの最高精度は要求しません。
           */
          enableHighAccuracy: false,

          /*
           * 10秒でタイムアウトします。
           */
          timeout: 10000,

          /*
           * 5分以内に取得した位置情報があれば、
           * 再利用を許可します。
           */
          maximumAge: 300000,
        }
      );
    };

  /*
   * 検索範囲を変更します。
   *
   * 現在地取得前でも、
   * 選択した範囲をURLへ保存します。
   */
  const handleRadiusChange = (
    distance: Distance
  ) => {
    setErrorMessage(null);

    updateSearchParams({
      radius: String(distance),
    });
  };

  /*
   * 現在地検索を解除します。
   *
   * 検索キーワード、エリア、設備条件、
   * 並び順などは維持します。
   */
  const handleResetLocation = () => {
    updateSearchParams({
      lat: null,
      lng: null,
      radius: null,
    });

    setLoading(false);
    setErrorMessage(null);
  };

  return (
    <section
      aria-labelledby="current-location-heading"
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
          gap-5
        "
      >
        <div
          className="
            flex
            flex-col
            justify-between
            gap-4
            sm:flex-row
            sm:items-start
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  flex
                  size-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#9fd9f6]/25
                  text-foreground
                "
              >
                <LocateFixed
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <h2
                id="current-location-heading"
                className="
                  text-lg
                  font-semibold
                  tracking-[-0.02em]
                  text-foreground
                "
              >
                現在地から探す
              </h2>
            </div>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-muted-foreground
              "
            >
              端末の位置情報を使用して、近くのサウナを探します。
            </p>
          </div>

          {hasLocation && (
            <button
              type="button"
              onClick={
                handleResetLocation
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

              現在地を解除
            </button>
          )}
        </div>

        {hasLocation ? (
          /*
           * 現在地を取得済みの場合です。
           */
          <div
            className="
              rounded-[1.5rem]
              border
              border-[#00b4b6]/20
              bg-[#00b4b6]/8
              p-4
            "
          >
            <div
              className="
                flex
                items-center
                gap-3
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
                  bg-[#00b4b6]/15
                  text-[#007f81]
                "
              >
                <MapPin
                  className="size-4"
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
                  現在地を取得しました
                </p>

                <p
                  className="
                    mt-0.5
                    text-xs
                    leading-5
                    text-muted-foreground
                  "
                >
                  現在地から
                  {selectedRadius}
                  km以内の施設を検索します。
                </p>
              </div>
            </div>

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-2
              "
              aria-label="現在地からの検索範囲"
            >
              {DISTANCE_OPTIONS.map(
                (option) => {
                  const isSelected =
                    selectedRadius ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      aria-pressed={
                        isSelected
                      }
                      onClick={() =>
                        handleRadiusChange(
                          option.value
                        )
                      }
                      className={`
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
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
                      {option.label}
                    </button>
                  );
                }
              )}
            </div>
          </div>
        ) : (
          /*
           * 現在地をまだ取得していない場合です。
           */
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
            <div
              className="
                flex
                flex-wrap
                gap-2
              "
              aria-label="現在地からの検索範囲"
            >
              {DISTANCE_OPTIONS.map(
                (option) => {
                  const isSelected =
                    selectedRadius ===
                    option.value;

                  return (
                    <button
                      key={
                        option.value
                      }
                      type="button"
                      aria-pressed={
                        isSelected
                      }
                      onClick={() =>
                        handleRadiusChange(
                          option.value
                        )
                      }
                      className={`
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        rounded-full
                        border
                        px-4
                        py-2
                        text-sm
                        font-medium
                        transition
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
                      {option.label}
                    </button>
                  );
                }
              )}
            </div>

            <button
              type="button"
              onClick={
                handleGetCurrentLocation
              }
              disabled={loading}
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-foreground
                px-5
                py-2.5
                text-sm
                font-semibold
                text-background
                shadow-sm
                transition
                hover:-translate-y-0.5
                hover:shadow-md
                disabled:cursor-not-allowed
                disabled:opacity-60
                sm:w-auto
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
              "
            >
              {loading ? (
                <>
                  <LoaderCircle
                    className="
                      size-4
                      animate-spin
                    "
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  現在地を取得中
                </>
              ) : (
                <>
                  <LocateFixed
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  現在地を取得
                </>
              )}
            </button>
          </div>
        )}

        {errorMessage && (
          <p
            role="alert"
            className="
              rounded-2xl
              border
              border-[#e95884]/20
              bg-[#e95884]/8
              px-4
              py-3
              text-sm
              leading-6
              text-[#a52c55]
            "
          >
            {errorMessage}
          </p>
        )}

        <p
          className="
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          位置情報は近隣施設の検索にのみ使用し、端末やブラウザへ永続的に保存しません。
        </p>
      </div>
    </section>
  );
}
