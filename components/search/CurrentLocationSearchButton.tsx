"use client";

import { useState } from "react";
import {
  LoaderCircle,
  LocateFixed,
  MapPin,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

/**
 * 現在地検索で選択できる
 * 検索半径です。
 *
 * 単位はkmです。
 */
const SEARCH_RADIUS_OPTIONS = [
  3,
  5,
  10,
  20,
] as const;

/**
 * 検索半径の型です。
 */
type SearchRadius =
  (typeof SEARCH_RADIUS_OPTIONS)[number];

/**
 * 標準の検索半径です。
 */
const DEFAULT_SEARCH_RADIUS_KM: SearchRadius =
  10;

/**
 * ブラウザへ位置情報を要求するときの
 * 最大待機時間です。
 *
 * 単位はミリ秒です。
 */
const GEOLOCATION_TIMEOUT_MS =
  10_000;

/**
 * 過去に取得した位置情報を
 * 再利用できる時間です。
 *
 * 現在は5分に設定しています。
 */
const GEOLOCATION_MAXIMUM_AGE_MS =
  5 * 60 * 1000;

type CurrentLocationSearchButtonProps = {
  /**
   * 最初に選択される検索半径です。
   *
   * 3・5・10・20以外の値が渡された場合は、
   * 10kmを使用します。
   */
  radiusKm?: number;

  /**
   * コンポーネントへ追加する
   * classNameです。
   */
  className?: string;
};

/**
 * 現在地と検索半径を指定して、
 * 周辺のサウナ施設を検索するコンポーネントです。
 */
export function CurrentLocationSearchButton({
  radiusKm = DEFAULT_SEARCH_RADIUS_KM,
  className = "",
}: CurrentLocationSearchButtonProps) {
  const router = useRouter();

  /**
   * ユーザーが選択している
   * 検索半径です。
   */
  const [
    selectedRadiusKm,
    setSelectedRadiusKm,
  ] = useState<SearchRadius>(
    normalizeInitialRadius(radiusKm)
  );

  /**
   * 現在地を取得しているかを管理します。
   */
  const [
    isLocating,
    setIsLocating,
  ] = useState(false);

  /**
   * 現在地を取得して
   * 検索ページへ移動します。
   */
  const handleCurrentLocationSearch =
    () => {
      /**
       * 現在地の取得中は
       * 重複実行しません。
       */
      if (isLocating) {
        return;
      }

      /**
       * ブラウザが位置情報取得に
       * 対応しているか確認します。
       */
      if (
        !navigator.geolocation
      ) {
        toast.error(
          "このブラウザでは現在地を取得できません。"
        );

        return;
      }

      setIsLocating(true);

      navigator.geolocation.getCurrentPosition(
        /**
         * 現在地を正常に取得できた場合です。
         */
        (position) => {
          const latitude =
            position.coords.latitude;

          const longitude =
            position.coords.longitude;

          /**
           * URLへ追加する検索条件を作ります。
           */
          const searchParams =
            new URLSearchParams();

          searchParams.set(
            "lat",
            latitude.toString()
          );

          searchParams.set(
            "lng",
            longitude.toString()
          );

          searchParams.set(
            "radius",
            selectedRadiusKm.toString()
          );

          /**
           * 現在地検索であることを
           * 検索ページ側で判定するための値です。
           */
          searchParams.set(
            "location",
            "current"
          );

          toast.success(
            `現在地から${selectedRadiusKm}km以内を検索します。`
          );

          /**
           * 検索条件を付けて
           * 検索ページへ移動します。
           */
          router.push(
            `/search?${searchParams.toString()}`
          );
        },

        /**
         * 現在地の取得に失敗した場合です。
         */
        (error) => {
          setIsLocating(false);

          toast.error(
            getGeolocationErrorMessage(
              error
            )
          );
        },

        /**
         * 位置情報取得時の設定です。
         */
        {
          enableHighAccuracy: true,

          timeout:
            GEOLOCATION_TIMEOUT_MS,

          maximumAge:
            GEOLOCATION_MAXIMUM_AGE_MS,
        }
      );
    };

  return (
    <div
      className={`
        rounded-[1.5rem]
        border
        border-border/55
        bg-background/55
        p-4
        ${className}
      `}
    >
      <div
        className="
          flex
          items-start
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
            bg-secondary/25
            text-foreground
          "
        >
          <MapPin
            aria-hidden="true"
            className="size-4"
            strokeWidth={1.8}
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
            現在地から探す
          </p>

          <p
            className="
              mt-1
              text-xs
              leading-5
              text-muted-foreground
            "
          >
            検索する範囲を選択してください。
          </p>
        </div>
      </div>

      <fieldset
        disabled={isLocating}
        className="mt-4"
      >
        <legend className="sr-only">
          現在地からの検索半径
        </legend>

        <div
          className="
            grid
            grid-cols-4
            gap-2
          "
        >
          {SEARCH_RADIUS_OPTIONS.map(
            (radiusOption) => {
              const isSelected =
                selectedRadiusKm ===
                radiusOption;

              return (
                <button
                  key={radiusOption}
                  type="button"
                  onClick={() =>
                    setSelectedRadiusKm(
                      radiusOption
                    )
                  }
                  aria-pressed={
                    isSelected
                  }
                  className={`
                    inline-flex
                    min-h-10
                    items-center
                    justify-center
                    rounded-full
                    border
                    px-2
                    text-xs
                    font-medium
                    transition
                    duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                    disabled:pointer-events-none
                    disabled:opacity-60
                    ${
                      isSelected
                        ? `
                          border-foreground
                          bg-foreground
                          text-background
                          shadow-sm
                        `
                        : `
                          border-border/70
                          bg-card
                          text-muted-foreground
                          hover:border-foreground/25
                          hover:text-foreground
                        `
                    }
                  `}
                >
                  {radiusOption}km
                </button>
              );
            }
          )}
        </div>
      </fieldset>

      <button
        type="button"
        onClick={
          handleCurrentLocationSearch
        }
        disabled={isLocating}
        aria-busy={isLocating}
        className="
          mt-4
          inline-flex
          min-h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          bg-foreground
          px-5
          text-sm
          font-medium
          text-background
          shadow-sm
          transition
          duration-200
          hover:-translate-y-0.5
          hover:opacity-90
          hover:shadow-md
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          disabled:pointer-events-none
          disabled:opacity-60
        "
      >
        {isLocating ? (
          <>
            <LoaderCircle
              aria-hidden="true"
              className="
                size-4
                animate-spin
              "
              strokeWidth={1.8}
            />

            現在地を取得中
          </>
        ) : (
          <>
            <LocateFixed
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />

            {selectedRadiusKm}
            km以内のサウナを探す
          </>
        )}
      </button>

      <p
        className="
          mt-3
          text-center
          text-[0.6875rem]
          leading-5
          text-muted-foreground
        "
      >
        位置情報は周辺検索にのみ使用します。
      </p>
    </div>
  );
}

/**
 * 親コンポーネントから渡された
 * 初期検索半径を検証します。
 */
function normalizeInitialRadius(
  radiusKm: number
): SearchRadius {
  const matchingRadius =
    SEARCH_RADIUS_OPTIONS.find(
      (radiusOption) =>
        radiusOption === radiusKm
    );

  return (
    matchingRadius ??
    DEFAULT_SEARCH_RADIUS_KM
  );
}

/**
 * Geolocation APIのエラーを、
 * ユーザー向けの日本語へ変換します。
 */
function getGeolocationErrorMessage(
  error: GeolocationPositionError
): string {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "位置情報の利用が許可されていません。ブラウザの設定から位置情報を許可してください。";

    case error.POSITION_UNAVAILABLE:
      return "現在地を取得できませんでした。端末の位置情報設定や通信環境をご確認ください。";

    case error.TIMEOUT:
      return "現在地の取得に時間がかかっています。もう一度お試しください。";

    default:
      return "現在地の取得に失敗しました。";
  }
}
