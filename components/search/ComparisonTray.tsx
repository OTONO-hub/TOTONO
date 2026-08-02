"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Columns3,
  MapPin,
  MapPinned,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { SearchSauna } from "@/components/search/search-results-explorer.types";

type ComparisonTrayProps = {
  saunas: SearchSauna[];
  comparisonSaunas: SearchSauna[];
  maximumCount: number;
  onShowMap: (
    saunaId: string
  ) => void;
  onRemove: (
    saunaId: string
  ) => void;
  onClear: () => void;
};

function createLocation(
  sauna: SearchSauna
): string {
  return [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(Boolean)
    .join(" ");
}

function hasCoordinates(
  sauna: SearchSauna
): boolean {
  return (
    typeof sauna.latitude ===
      "number" &&
    Number.isFinite(
      sauna.latitude
    ) &&
    typeof sauna.longitude ===
      "number" &&
    Number.isFinite(
      sauna.longitude
    )
  );
}

export function ComparisonTray({
  saunas,
  comparisonSaunas,
  maximumCount,
  onShowMap,
  onRemove,
  onClear,
}: ComparisonTrayProps) {
  const [
    isModalOpen,
    setIsModalOpen,
  ] = useState(false);

  const comparisonCount =
    comparisonSaunas.length;

  const rankingsBySaunaId =
    useMemo(
      () =>
        new Map(
          saunas.map(
            (
              sauna,
              index
            ) => [
              sauna.id,
              index + 1,
            ]
          )
        ),
      [saunas]
    );

  useEffect(() => {
    if (!isModalOpen) {
      return;
    }

    const handleKeyDown = (
      event: KeyboardEvent
    ): void => {
      if (
        event.key === "Escape"
      ) {
        setIsModalOpen(
          false
        );
      }
    };

    const previousOverflow =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

    window.addEventListener(
      "keydown",
      handleKeyDown
    );

    return () => {
      document.body.style.overflow =
        previousOverflow;

      window.removeEventListener(
        "keydown",
        handleKeyDown
      );
    };
  }, [
    isModalOpen,
  ]);

  if (
    comparisonCount === 0
  ) {
    return null;
  }

  return (
    <>
      <section
        aria-labelledby="comparison-saunas-heading"
        className="
          mb-8
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#00b4b6]/20
          bg-white/85
          shadow-[0_18px_50px_rgba(0,180,182,0.08)]
          backdrop-blur-xl
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-[#3e3a3a]/7
            px-5
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-6
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
                size-10
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-[#00b4b6]/12
                text-[#007f81]
              "
            >
              <Check
                className="size-4"
                strokeWidth={2.2}
                aria-hidden="true"
              />
            </span>

            <div>
              <h2
                id="comparison-saunas-heading"
                className="
                  text-sm
                  font-bold
                  text-[#3e3a3a]
                "
              >
                比較候補
              </h2>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-[#3e3a3a]/45
                "
              >
                ページを更新しても候補は保持されます
              </p>
            </div>
          </div>

          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                rounded-full
                bg-[#00b4b6]/10
                px-3
                py-1.5
                text-xs
                font-bold
                text-[#007f81]
              "
            >
              {comparisonCount}/
              {maximumCount}件
            </span>

            <button
              type="button"
              onClick={() =>
                setIsModalOpen(
                  true
                )
              }
              className="
                inline-flex
                min-h-9
                items-center
                justify-center
                gap-1.5
                rounded-full
                bg-[#3e3a3a]
                px-4
                text-xs
                font-semibold
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#2f2c2c]
                active:translate-y-0
                active:scale-[0.98]
              "
            >
              <Columns3
                className="size-3.5"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              比較する
            </button>

            <button
              type="button"
              onClick={() => {
                setIsModalOpen(
                  false
                );

                onClear();
              }}
              className="
                inline-flex
                min-h-9
                items-center
                justify-center
                gap-1.5
                rounded-full
                px-3
                text-xs
                font-semibold
                text-[#3e3a3a]/50
                transition-colors
                hover:bg-[#e95884]/10
                hover:text-[#c23d65]
              "
            >
              <Trash2
                className="size-3.5"
                strokeWidth={1.9}
                aria-hidden="true"
              />

              すべて解除
            </button>
          </div>
        </div>

        <div
          className="
            grid
            gap-3
            p-4
            sm:p-5
            lg:grid-cols-3
          "
        >
          {comparisonSaunas.map(
            (
              sauna,
              comparisonIndex
            ) => {
              const ranking =
                rankingsBySaunaId.get(
                  sauna.id
                ) ?? null;

              const location =
                createLocation(
                  sauna
                );

              return (
                <article
                  key={sauna.id}
                  className="
                    relative
                    flex
                    min-w-0
                    flex-col
                    rounded-[1.4rem]
                    border
                    border-[#3e3a3a]/8
                    bg-white
                    p-4
                    shadow-sm
                  "
                >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      pr-8
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
                        bg-[#3e3a3a]
                        text-xs
                        font-extrabold
                        text-white
                      "
                    >
                      {ranking ??
                        "—"}
                    </span>

                    <div className="min-w-0">
                      <span
                        className="
                          text-[0.625rem]
                          font-bold
                          tracking-[0.08em]
                          text-[#00b4b6]
                        "
                      >
                        CANDIDATE{" "}
                        {comparisonIndex +
                          1}
                      </span>

                      <h3
                        className="
                          mt-1
                          line-clamp-2
                          text-sm
                          font-bold
                          leading-relaxed
                          text-[#3e3a3a]
                        "
                      >
                        {sauna.name}
                      </h3>

                      {location ? (
                        <p
                          className="
                            mt-1
                            truncate
                            text-xs
                            text-[#3e3a3a]/45
                          "
                        >
                          {location}
                        </p>
                      ) : null}
                    </div>
                  </div>

                  <button
                    type="button"
                    aria-label={`${sauna.name}を比較候補から外す`}
                    onClick={() => {
                      const nextCount =
                        comparisonCount - 1;

                      if (
                        nextCount <= 0
                      ) {
                        setIsModalOpen(
                          false
                        );
                      }

                      onRemove(
                        sauna.id
                      );
                    }}
                    className="
                      absolute
                      right-3
                      top-3
                      flex
                      size-8
                      items-center
                      justify-center
                      rounded-full
                      text-[#3e3a3a]/35
                      transition-colors
                      hover:bg-[#e95884]/10
                      hover:text-[#c23d65]
                    "
                  >
                    <X
                      className="size-4"
                      strokeWidth={1.9}
                      aria-hidden="true"
                    />
                  </button>

                  <div
                    className="
                      mt-4
                      grid
                      grid-cols-2
                      gap-2
                    "
                  >
                    <button
                      type="button"
                      onClick={() =>
                        onShowMap(
                          sauna.id
                        )
                      }
                      className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-full
                        border
                        border-[#3e3a3a]/9
                        bg-[#e6e5ef]/45
                        px-3
                        text-xs
                        font-semibold
                        text-[#3e3a3a]
                        transition-colors
                        hover:bg-[#e6e5ef]
                      "
                    >
                      <MapPinned
                        className="size-3.5"
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />

                      地図
                    </button>

                    <Link
                      href={`/saunas/${sauna.id}`}
                      className="
                        inline-flex
                        min-h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-full
                        bg-[#3e3a3a]
                        px-3
                        text-xs
                        font-semibold
                        text-white
                        transition-colors
                        hover:bg-[#2f2c2c]
                      "
                    >
                      詳細

                      <ArrowRight
                        className="size-3.5"
                        strokeWidth={1.9}
                        aria-hidden="true"
                      />
                    </Link>
                  </div>
                </article>
              );
            }
          )}

          {Array.from({
            length:
              maximumCount -
              comparisonCount,
          }).map(
            (
              _,
              index
            ) => (
              <div
                key={`empty-comparison-${index}`}
                className="
                  flex
                  min-h-36
                  items-center
                  justify-center
                  rounded-[1.4rem]
                  border
                  border-dashed
                  border-[#3e3a3a]/10
                  bg-[#e6e5ef]/20
                  p-5
                  text-center
                "
              >
                <div>
                  <span
                    className="
                      mx-auto
                      flex
                      size-9
                      items-center
                      justify-center
                      rounded-full
                      bg-white
                      text-[#3e3a3a]/30
                      shadow-sm
                    "
                  >
                    <Plus
                      className="size-4"
                      strokeWidth={1.8}
                      aria-hidden="true"
                    />
                  </span>

                  <p
                    className="
                      mt-2
                      text-xs
                      font-medium
                      text-[#3e3a3a]/35
                    "
                  >
                    比較候補を追加
                  </p>
                </div>
              </div>
            )
          )}
        </div>
      </section>

      {isModalOpen ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="comparison-modal-heading"
          className="
            fixed
            inset-0
            z-[100]
            flex
            items-end
            justify-center
            bg-[#3e3a3a]/55
            p-0
            backdrop-blur-sm
            sm:items-center
            sm:p-6
          "
          onMouseDown={(
            event
          ) => {
            if (
              event.target ===
              event.currentTarget
            ) {
              setIsModalOpen(
                false
              );
            }
          }}
        >
          <section
            className="
              flex
              max-h-[92dvh]
              w-full
              max-w-6xl
              flex-col
              overflow-hidden
              rounded-t-[2rem]
              bg-[#f4f3f7]
              shadow-[0_32px_100px_rgba(0,0,0,0.28)]
              sm:rounded-[2rem]
            "
          >
            <header
              className="
                flex
                items-center
                justify-between
                gap-4
                border-b
                border-[#3e3a3a]/8
                bg-white/90
                px-5
                py-4
                backdrop-blur-xl
                sm:px-7
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  items-center
                  gap-3
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
                    bg-[#00b4b6]/12
                    text-[#007f81]
                  "
                >
                  <Columns3
                    className="size-4"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>

                <div className="min-w-0">
                  <p
                    className="
                      text-[0.625rem]
                      font-bold
                      tracking-[0.12em]
                      text-[#00b4b6]
                    "
                  >
                    COMPARE
                  </p>

                  <h2
                    id="comparison-modal-heading"
                    className="
                      truncate
                      text-base
                      font-bold
                      text-[#3e3a3a]
                      sm:text-lg
                    "
                  >
                    サウナ施設を比較する
                  </h2>
                </div>
              </div>

              <button
                type="button"
                aria-label="比較画面を閉じる"
                onClick={() =>
                  setIsModalOpen(
                    false
                  )
                }
                className="
                  flex
                  size-10
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-[#3e3a3a]/8
                  bg-white
                  text-[#3e3a3a]/55
                  transition-colors
                  hover:bg-[#e6e5ef]
                  hover:text-[#3e3a3a]
                "
              >
                <X
                  className="size-4"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </button>
            </header>

            <div
              className="
                overflow-y-auto
                p-4
                sm:p-6
              "
            >
              <div
                className="
                  grid
                  gap-4
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {comparisonSaunas.map(
                  (
                    sauna,
                    index
                  ) => {
                    const ranking =
                      rankingsBySaunaId.get(
                        sauna.id
                      ) ?? null;

                    const location =
                      createLocation(
                        sauna
                      );

                    const coordinatesAvailable =
                      hasCoordinates(
                        sauna
                      );

                    return (
                      <article
                        key={
                          sauna.id
                        }
                        className="
                          flex
                          min-w-0
                          flex-col
                          overflow-hidden
                          rounded-[1.75rem]
                          border
                          border-white/80
                          bg-white
                          shadow-[0_18px_45px_rgba(62,58,58,0.08)]
                        "
                      >
                        <div
                          className="
                            h-1.5
                            bg-[#fdd000]
                          "
                        />

                        <div
                          className="
                            flex
                            flex-1
                            flex-col
                            p-5
                          "
                        >
                          <div
                            className="
                              flex
                              items-start
                              justify-between
                              gap-3
                            "
                          >
                            <span
                              className="
                                rounded-full
                                bg-[#00b4b6]/10
                                px-3
                                py-1.5
                                text-[0.625rem]
                                font-bold
                                tracking-[0.08em]
                                text-[#007f81]
                              "
                            >
                              候補
                              {index +
                                1}
                            </span>

                            <button
                              type="button"
                              aria-label={`${sauna.name}を比較候補から外す`}
                              onClick={() => {
                                const nextCount =
                                  comparisonCount - 1;

                                if (
                                  nextCount <= 0
                                ) {
                                  setIsModalOpen(
                                    false
                                  );
                                }

                                onRemove(
                                  sauna.id
                                );
                              }}
                              className="
                                flex
                                size-8
                                items-center
                                justify-center
                                rounded-full
                                text-[#3e3a3a]/35
                                transition-colors
                                hover:bg-[#e95884]/10
                                hover:text-[#c23d65]
                              "
                            >
                              <X
                                className="size-4"
                                strokeWidth={1.9}
                                aria-hidden="true"
                              />
                            </button>
                          </div>

                          <div className="mt-5">
                            <span
                              className="
                                flex
                                size-11
                                items-center
                                justify-center
                                rounded-full
                                bg-[#3e3a3a]
                                text-sm
                                font-extrabold
                                text-white
                              "
                            >
                              {ranking ??
                                "—"}
                            </span>

                            <h3
                              className="
                                mt-4
                                text-lg
                                font-bold
                                leading-snug
                                tracking-[-0.02em]
                                text-[#3e3a3a]
                              "
                            >
                              {sauna.name}
                            </h3>

                            {location ? (
                              <p
                                className="
                                  mt-2
                                  flex
                                  items-center
                                  gap-1.5
                                  text-sm
                                  text-[#3e3a3a]/50
                                "
                              >
                                <MapPin
                                  className="size-3.5"
                                  strokeWidth={1.8}
                                  aria-hidden="true"
                                />

                                {location}
                              </p>
                            ) : null}
                          </div>

                          <dl
                            className="
                              mt-6
                              divide-y
                              divide-[#3e3a3a]/7
                              rounded-[1.25rem]
                              bg-[#e6e5ef]/30
                              px-4
                            "
                          >
                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                py-3
                              "
                            >
                              <dt
                                className="
                                  text-xs
                                  font-medium
                                  text-[#3e3a3a]/45
                                "
                              >
                                検索順位
                              </dt>

                              <dd
                                className="
                                  text-sm
                                  font-bold
                                  text-[#3e3a3a]
                                "
                              >
                                {ranking
                                  ? `${ranking}位`
                                  : "対象外"}
                              </dd>
                            </div>

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                py-3
                              "
                            >
                              <dt
                                className="
                                  text-xs
                                  font-medium
                                  text-[#3e3a3a]/45
                                "
                              >
                                地域
                              </dt>

                              <dd
                                className="
                                  max-w-[60%]
                                  truncate
                                  text-right
                                  text-sm
                                  font-semibold
                                  text-[#3e3a3a]
                                "
                              >
                                {location ||
                                  "未登録"}
                              </dd>
                            </div>

                            <div
                              className="
                                flex
                                items-center
                                justify-between
                                gap-4
                                py-3
                              "
                            >
                              <dt
                                className="
                                  text-xs
                                  font-medium
                                  text-[#3e3a3a]/45
                                "
                              >
                                地図情報
                              </dt>

                              <dd
                                className={`
                                  text-sm
                                  font-semibold
                                  ${
                                    coordinatesAvailable
                                      ? "text-[#007f81]"
                                      : "text-[#3e3a3a]/40"
                                  }
                                `}
                              >
                                {coordinatesAvailable
                                  ? "利用可能"
                                  : "未登録"}
                              </dd>
                            </div>
                          </dl>

                          <div
                            className="
                              mt-auto
                              grid
                              grid-cols-2
                              gap-2
                              pt-6
                            "
                          >
                            <button
                              type="button"
                              onClick={() => {
                                setIsModalOpen(
                                  false
                                );

                                onShowMap(
                                  sauna.id
                                );
                              }}
                              className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                gap-1.5
                                rounded-full
                                border
                                border-[#3e3a3a]/9
                                bg-[#e6e5ef]/45
                                px-3
                                text-xs
                                font-semibold
                                text-[#3e3a3a]
                                transition-colors
                                hover:bg-[#e6e5ef]
                              "
                            >
                              <MapPinned
                                className="size-3.5"
                                strokeWidth={1.9}
                                aria-hidden="true"
                              />

                              地図
                            </button>

                            <Link
                              href={`/saunas/${sauna.id}`}
                              className="
                                inline-flex
                                min-h-11
                                items-center
                                justify-center
                                gap-1.5
                                rounded-full
                                bg-[#3e3a3a]
                                px-3
                                text-xs
                                font-semibold
                                text-white
                                transition-colors
                                hover:bg-[#2f2c2c]
                              "
                            >
                              施設詳細

                              <ArrowRight
                                className="size-3.5"
                                strokeWidth={1.9}
                                aria-hidden="true"
                              />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  }
                )}

                {Array.from({
                  length:
                    maximumCount -
                    comparisonCount,
                }).map(
                  (
                    _,
                    index
                  ) => (
                    <div
                      key={`modal-empty-comparison-${index}`}
                      className="
                        flex
                        min-h-80
                        items-center
                        justify-center
                        rounded-[1.75rem]
                        border
                        border-dashed
                        border-[#3e3a3a]/12
                        bg-white/40
                        p-6
                        text-center
                      "
                    >
                      <div>
                        <span
                          className="
                            mx-auto
                            flex
                            size-11
                            items-center
                            justify-center
                            rounded-full
                            bg-white
                            text-[#3e3a3a]/30
                            shadow-sm
                          "
                        >
                          <Plus
                            className="size-4"
                            strokeWidth={1.8}
                            aria-hidden="true"
                          />
                        </span>

                        <p
                          className="
                            mt-3
                            text-sm
                            font-semibold
                            text-[#3e3a3a]/45
                          "
                        >
                          施設を追加
                        </p>

                        <p
                          className="
                            mt-1
                            text-xs
                            leading-relaxed
                            text-[#3e3a3a]/35
                          "
                        >
                          検索結果から比較候補を選択してください
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>

            <footer
              className="
                flex
                flex-col
                gap-3
                border-t
                border-[#3e3a3a]/8
                bg-white/90
                px-5
                py-4
                backdrop-blur-xl
                sm:flex-row
                sm:items-center
                sm:justify-between
                sm:px-7
              "
            >
              <p
                className="
                  text-xs
                  text-[#3e3a3a]/45
                "
              >
                現在利用できる施設情報のみを表示しています。
              </p>

              <button
                type="button"
                onClick={() =>
                  setIsModalOpen(
                    false
                  )
                }
                className="
                  inline-flex
                  min-h-11
                  items-center
                  justify-center
                  rounded-full
                  bg-[#3e3a3a]
                  px-6
                  text-sm
                  font-semibold
                  text-white
                  transition-colors
                  hover:bg-[#2f2c2c]
                "
              >
                比較を閉じる
              </button>
            </footer>
          </section>
        </div>
      ) : null}
    </>
  );
}
