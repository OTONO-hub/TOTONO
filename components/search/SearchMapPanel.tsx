"use client";

import { useId } from "react";
import {
  List,
  MapPinned,
} from "lucide-react";

import { MapView } from "@/components/map/MapView";
import type {
  SearchCurrentLocation,
  SearchSauna,
} from "@/components/search/search-results-explorer.types";

type SearchMapPanelProps = {
  saunas: SearchSauna[];
  currentLocation: SearchCurrentLocation;
  activeSauna: SearchSauna | null;
  isVisibleOnMobile: boolean;
  onShowList: () => void;
};

export function SearchMapPanel({
  saunas,
  currentLocation,
  activeSauna,
  isVisibleOnMobile,
  onShowList,
}: SearchMapPanelProps) {
  const headingId = useId();
  const descriptionId = useId();
  const activeSaunaStatusId = useId();

  return (
    <aside
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      aria-hidden={
        isVisibleOnMobile
          ? undefined
          : true
      }
      className={`
        min-w-0
        ${
          isVisibleOnMobile
            ? "block"
            : "hidden"
        }
        xl:sticky
        xl:top-24
        xl:block
        xl:[&[aria-hidden='true']]:block
      `}
    >
      <div
        className="
          overflow-hidden
          rounded-[2rem]
          border
          border-white/75
          bg-white/85
          p-3
          shadow-[0_20px_60px_rgba(62,58,58,0.09)]
          backdrop-blur-xl
          sm:p-4
        "
      >
        <div
          className="
            flex
            items-center
            justify-between
            gap-4
            px-2
            pb-4
            pt-1
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
              aria-hidden="true"
              className="
                flex
                size-8
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#9fd9f6]/30
                text-[#3e3a3a]
              "
            >
              <MapPinned
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.9}
              />
            </span>

            <div>
              <h2
                id={headingId}
                className="
                  text-sm
                  font-semibold
                  text-[#3e3a3a]
                "
              >
                地図から見る
              </h2>

              <p
                id={descriptionId}
                className="
                  mt-0.5
                  text-xs
                  leading-5
                  text-[#3e3a3a]/55
                "
              >
                地図上の施設を選ぶと、対応する施設情報を確認できます。
              </p>
            </div>
          </div>

          {activeSauna ? (
            <span
              className="
                hidden
                max-w-52
                items-center
                gap-1.5
                rounded-full
                bg-[#fdd000]/25
                px-3
                py-1.5
                text-[0.6875rem]
                font-semibold
                text-[#3e3a3a]
                sm:inline-flex
              "
            >
              <span
                aria-hidden="true"
                className="
                  size-2
                  shrink-0
                  rounded-full
                  bg-[#fdd000]
                "
              />

              <span className="truncate">
                {activeSauna.name}
              </span>
            </span>
          ) : (
            <span
              aria-hidden="true"
              className="
                hidden
                rounded-full
                bg-[#00b4b6]/10
                px-3
                py-1.5
                text-[0.6875rem]
                font-semibold
                text-[#007f81]
                sm:inline-flex
              "
            >
              MAP
            </span>
          )}
        </div>

        <p
          id={activeSaunaStatusId}
          aria-live="polite"
          aria-atomic="true"
          className="sr-only"
        >
          {activeSauna
            ? `${activeSauna.name}を選択しています。`
            : "選択中のサウナ施設はありません。"}
        </p>

        <div
          role="region"
          aria-label={`検索結果${saunas.length}件の地図`}
          aria-describedby={`${descriptionId} ${activeSaunaStatusId}`}
          className="
            overflow-hidden
            rounded-[1.5rem]
            border
            border-[#3e3a3a]/8
            bg-[#e6e5ef]/35
          "
        >
          <MapView
            saunas={saunas}
            currentLocation={
              currentLocation
            }
          />
        </div>
      </div>

      <button
        type="button"
        onClick={onShowList}
        aria-label={`施設一覧へ戻る。検索結果は${saunas.length}件です`}
        className="
          mt-4
          flex
          min-h-12
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          border
          border-[#3e3a3a]/10
          bg-white/85
          px-5
          text-sm
          font-semibold
          text-[#3e3a3a]
          shadow-sm
          backdrop-blur-md
          transition-all
          duration-200
          hover:border-[#3e3a3a]/20
          hover:bg-white
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
          active:scale-[0.98]
          motion-reduce:transform-none
          motion-reduce:transition-none
          xl:hidden
        "
      >
        <List
          aria-hidden="true"
          className="size-4"
          strokeWidth={1.9}
        />

        施設一覧へ戻る
      </button>
    </aside>
  );
}
