"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  ExternalLink,
  MapPinned,
  Navigation,
  Plus,
  Sparkles,
} from "lucide-react";

import type { SearchSauna } from "@/components/search/search-results-explorer.types";
import {
  createGoogleMapsDirectionUrl,
  createGoogleMapsPlaceUrl,
} from "@/lib/sauna-navigation";

type SelectedSaunaPanelProps = {
  sauna: SearchSauna | null;
  ranking: number | null;
  location: string;
  resultCount: number;
  isComparisonSauna: boolean;
  comparisonIsFull: boolean;
  onToggleComparison: (
    saunaId: string
  ) => void;
  onShowMap: () => void;
};

function openExternalUrl(
  url: string
): void {
  window.open(
    url,
    "_blank",
    "noopener,noreferrer"
  );
}

export function SelectedSaunaPanel({
  sauna,
  ranking,
  location,
  resultCount,
  isComparisonSauna,
  comparisonIsFull,
  onToggleComparison,
  onShowMap,
}: SelectedSaunaPanelProps) {
  if (!sauna || ranking === null) {
    return (
      <section
        aria-label="施設選択の案内"
        className="
          mb-7
          flex
          flex-col
          gap-4
          rounded-[1.75rem]
          border
          border-dashed
          border-[#3e3a3a]/12
          bg-white/45
          p-5
          sm:flex-row
          sm:items-center
          sm:justify-between
          sm:p-6
        "
      >
        <div
          className="
            flex
            items-center
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
              bg-[#fdd000]/20
              text-[#3e3a3a]
            "
          >
            <MapPinned
              className="size-4"
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </span>

          <div>
            <p
              className="
                text-sm
                font-semibold
                text-[#3e3a3a]
              "
            >
              気になる施設を選んでください
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-relaxed
                text-[#3e3a3a]/45
              "
            >
              カードまたは地図ピンを選ぶと、施設詳細や経路を確認できます。
            </p>
          </div>
        </div>

        <span
          className="
            self-start
            rounded-full
            bg-white/75
            px-3
            py-1.5
            text-[0.6875rem]
            font-semibold
            text-[#3e3a3a]/45
            sm:self-auto
          "
        >
          {resultCount}件から選択
        </span>
      </section>
    );
  }

  const directionUrl =
    createGoogleMapsDirectionUrl({
      name: sauna.name,
      latitude:
        sauna.latitude,
      longitude:
        sauna.longitude,
    });

  const placeUrl =
    createGoogleMapsPlaceUrl({
      name: sauna.name,
      latitude:
        sauna.latitude,
      longitude:
        sauna.longitude,
    });

  const handleOpenDirections =
    (): void => {
      openExternalUrl(
        directionUrl
      );
    };

  const handleOpenPlace =
    (): void => {
      openExternalUrl(
        placeUrl
      );
    };

  return (
    <>
      <section
        aria-label="選択中の施設"
        className="
          mb-7
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#fdd000]/45
          bg-white/90
          shadow-[0_18px_50px_rgba(62,58,58,0.08)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            h-1.5
            w-full
            bg-[#fdd000]
          "
        />

        <div
          className="
            flex
            flex-col
            gap-6
            p-5
            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-col
              gap-5
              lg:flex-row
              lg:items-center
              lg:justify-between
            "
          >
            <div
              className="
                flex
                min-w-0
                items-start
                gap-4
              "
            >
              <div
                className="
                  relative
                  flex
                  size-12
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border-[3px]
                  border-white
                  bg-[#fdd000]
                  text-sm
                  font-extrabold
                  text-[#3e3a3a]
                  shadow-[0_10px_26px_rgba(253,208,0,0.32)]
                "
              >
                {ranking}

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-1
                    left-1/2
                    size-3
                    -translate-x-1/2
                    rotate-45
                    border-b-[3px]
                    border-r-[3px]
                    border-white
                    bg-[#fdd000]
                  "
                />
              </div>

              <div className="min-w-0">
                <div
                  className="
                    mb-1.5
                    flex
                    flex-wrap
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      rounded-full
                      bg-[#fdd000]/20
                      px-2.5
                      py-1
                      text-[0.625rem]
                      font-bold
                      tracking-[0.08em]
                      text-[#3e3a3a]
                    "
                  >
                    <Check
                      className="size-3"
                      strokeWidth={2.5}
                      aria-hidden="true"
                    />

                    SELECTED
                  </span>

                  <span
                    className="
                      text-xs
                      font-medium
                      text-[#3e3a3a]/45
                    "
                  >
                    検索結果
                    {ranking}番
                  </span>
                </div>

                <h2
                  className="
                    truncate
                    text-lg
                    font-bold
                    tracking-[-0.02em]
                    text-[#3e3a3a]
                    sm:text-xl
                  "
                >
                  {sauna.name}
                </h2>

                {location ? (
                  <p
                    className="
                      mt-1
                      text-sm
                      text-[#3e3a3a]/55
                    "
                  >
                    {location}
                  </p>
                ) : null}
              </div>
            </div>

            <div
              className="
                hidden
                shrink-0
                grid-cols-2
                gap-2.5
                sm:grid
                lg:flex
              "
            >
              <button
                type="button"
                onClick={() =>
                  onToggleComparison(
                    sauna.id
                  )
                }
                disabled={
                  !isComparisonSauna &&
                  comparisonIsFull
                }
                className={`
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  px-5
                  text-sm
                  font-semibold
                  transition-all
                  duration-200
                  active:scale-[0.98]
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                  ${
                    isComparisonSauna
                      ? `
                          border-[#00b4b6]/25
                          bg-[#00b4b6]/10
                          text-[#007f81]
                        `
                      : `
                          border-[#3e3a3a]/10
                          bg-white
                          text-[#3e3a3a]
                          hover:border-[#3e3a3a]/20
                        `
                  }
                `}
              >
                {isComparisonSauna ? (
                  <>
                    <Check
                      className="size-4"
                      strokeWidth={2.2}
                      aria-hidden="true"
                    />

                    候補に追加済み
                  </>
                ) : (
                  <>
                    <Plus
                      className="size-4"
                      strokeWidth={2}
                      aria-hidden="true"
                    />

                    比較候補に追加
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={onShowMap}
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#3e3a3a]/10
                  bg-[#e6e5ef]/55
                  px-5
                  text-sm
                  font-semibold
                  text-[#3e3a3a]
                  transition-all
                  duration-200
                  hover:border-[#3e3a3a]/20
                  hover:bg-[#e6e5ef]
                  active:scale-[0.98]
                "
              >
                <MapPinned
                  className="size-4"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />

                地図で確認
              </button>
            </div>
          </div>

          <div
            className="
              hidden
              gap-3
              border-t
              border-[#3e3a3a]/7
              pt-5
              sm:grid
              sm:grid-cols-2
              lg:grid-cols-[minmax(0,1fr)_auto_auto]
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
                rounded-[1.25rem]
                bg-[#fdd000]/12
                px-4
                py-3.5
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
                  bg-[#fdd000]
                  text-[#3e3a3a]
                "
              >
                <Sparkles
                  className="size-4"
                  strokeWidth={2}
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
                  今日のサウナ候補
                </p>

                <p
                  className="
                    mt-1
                    text-xs
                    leading-relaxed
                    text-[#3e3a3a]/50
                  "
                >
                  施設情報を確認して、行き先を決めましょう。
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={
                handleOpenPlace
              }
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-[#3e3a3a]/10
                bg-white
                px-5
                text-sm
                font-semibold
                text-[#3e3a3a]
                transition-all
                duration-200
                hover:border-[#3e3a3a]/20
                hover:bg-[#e6e5ef]/45
                active:scale-[0.98]
              "
            >
              <ExternalLink
                className="size-4"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              Googleマップ
            </button>

            <button
              type="button"
              onClick={
                handleOpenDirections
              }
              className="
                inline-flex
                min-h-12
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#fdd000]
                px-6
                text-sm
                font-bold
                text-[#3e3a3a]
                shadow-[0_10px_28px_rgba(253,208,0,0.28)]
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:shadow-[0_14px_34px_rgba(253,208,0,0.36)]
                active:translate-y-0
                active:scale-[0.98]
              "
            >
              <Navigation
                className="size-4"
                strokeWidth={2}
                aria-hidden="true"
              />

              今日行く
            </button>
          </div>

          <div
            className="
              hidden
              border-t
              border-[#3e3a3a]/7
              pt-5
              sm:block
            "
          >
            <Link
              href={`/saunas/${sauna.id}`}
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#3e3a3a]
                px-5
                text-sm
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#2f2c2c]
                hover:shadow-md
                active:translate-y-0
                active:scale-[0.98]
                lg:w-auto
              "
            >
              施設詳細を見る

              <ArrowRight
                className="size-4"
                strokeWidth={1.9}
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </section>

      <div
        className="
          fixed
          inset-x-0
          bottom-0
          z-50
          border-t
          border-[#3e3a3a]/8
          bg-white/95
          px-4
          pb-[calc(env(safe-area-inset-bottom)+0.75rem)]
          pt-3
          shadow-[0_-14px_40px_rgba(62,58,58,0.12)]
          backdrop-blur-xl
          sm:hidden
        "
      >
        <div
          className="
            mx-auto
            flex
            max-w-lg
            items-center
            gap-2.5
          "
        >
          <Link
            href={`/saunas/${sauna.id}`}
            aria-label={`${sauna.name}の施設詳細を見る`}
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#3e3a3a]/10
              bg-white
              text-[#3e3a3a]
              shadow-sm
              transition-transform
              active:scale-[0.96]
            "
          >
            <ArrowRight
              className="size-4"
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </Link>

          <button
            type="button"
            onClick={
              handleOpenPlace
            }
            aria-label={`${sauna.name}をGoogleマップで見る`}
            className="
              flex
              size-12
              shrink-0
              items-center
              justify-center
              rounded-full
              border
              border-[#3e3a3a]/10
              bg-[#e6e5ef]/65
              text-[#3e3a3a]
              shadow-sm
              transition-transform
              active:scale-[0.96]
            "
          >
            <MapPinned
              className="size-4"
              strokeWidth={1.9}
              aria-hidden="true"
            />
          </button>

          <button
            type="button"
            onClick={
              handleOpenDirections
            }
            className="
              inline-flex
              min-h-12
              min-w-0
              flex-1
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#fdd000]
              px-5
              text-sm
              font-bold
              text-[#3e3a3a]
              shadow-[0_10px_28px_rgba(253,208,0,0.30)]
              transition-transform
              active:scale-[0.98]
            "
          >
            <Navigation
              className="size-4"
              strokeWidth={2}
              aria-hidden="true"
            />

            <span className="truncate">
              今日行く
            </span>
          </button>
        </div>
      </div>

      <div
        aria-hidden="true"
        className="h-20 sm:hidden"
      />
    </>
  );
}
