"use client";

import {
  List,
  MapPinned,
} from "lucide-react";

import type { MobileSearchView } from "@/components/search/search-results-explorer.types";

type MobileSearchSwitcherProps = {
  activeView: MobileSearchView;
  resultCount: number;
  onChange: (
    view: MobileSearchView
  ) => void;
};

export function MobileSearchSwitcher({
  activeView,
  resultCount,
  onChange,
}: MobileSearchSwitcherProps) {
  const normalizedResultCount =
    Math.max(0, resultCount);

  const activeViewLabel =
    activeView === "list"
      ? "施設一覧"
      : "地図";

  return (
    <div
      role="group"
      aria-label="検索結果の表示方法"
      className="
        sticky
        top-3
        z-30
        mb-6
        grid
        grid-cols-2
        gap-1
        rounded-[1.25rem]
        border
        border-white/75
        bg-white/90
        p-1.5
        shadow-[0_12px_32px_rgba(62,58,58,0.10)]
        backdrop-blur-xl
        xl:hidden
      "
    >
      <p
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {activeViewLabel}
        表示に切り替えました。
      </p>

      <MobileViewButton
        view="list"
        label="施設一覧"
        activeView={activeView}
        resultCount={
          normalizedResultCount
        }
        onChange={onChange}
      />

      <MobileViewButton
        view="map"
        label="地図"
        activeView={activeView}
        resultCount={
          normalizedResultCount
        }
        onChange={onChange}
      />
    </div>
  );
}

type MobileViewButtonProps = {
  view: MobileSearchView;
  label: string;
  activeView: MobileSearchView;
  resultCount: number;
  onChange: (
    view: MobileSearchView
  ) => void;
};

function MobileViewButton({
  view,
  label,
  activeView,
  resultCount,
  onChange,
}: MobileViewButtonProps) {
  const isActive =
    activeView === view;

  const Icon =
    view === "list"
      ? List
      : MapPinned;

  const accessibleLabel =
    view === "list"
      ? `${resultCount}件の施設一覧を表示${
          isActive
            ? "。現在選択中です"
            : ""
        }`
      : `検索結果を地図で表示${
          isActive
            ? "。現在選択中です"
            : ""
        }`;

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      aria-pressed={isActive}
      onClick={() => {
        if (!isActive) {
          onChange(view);
        }
      }}
      className={`
        flex
        min-h-11
        min-w-0
        items-center
        justify-center
        gap-2
        rounded-[0.9rem]
        px-3
        text-sm
        font-semibold
        transition-all
        duration-200
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-white
        motion-reduce:transition-none
        sm:px-4
        ${
          isActive
            ? `
              bg-[#3e3a3a]
              text-white
              shadow-sm
            `
            : `
              text-[#3e3a3a]/55
              hover:bg-[#e6e5ef]/60
              hover:text-[#3e3a3a]
            `
        }
      `}
    >
      <Icon
        aria-hidden="true"
        className="size-4 shrink-0"
        strokeWidth={1.9}
      />

      <span className="truncate">
        {label}
      </span>

      {view === "list" ? (
        <span
          aria-hidden="true"
          className={`
            shrink-0
            rounded-full
            px-2
            py-0.5
            text-[0.625rem]
            font-bold
            tabular-nums
            ${
              isActive
                ? `
                  bg-white/15
                  text-white
                `
                : `
                  bg-[#e6e5ef]
                  text-[#3e3a3a]/55
                `
            }
          `}
        >
          {resultCount}
        </span>
      ) : null}
    </button>
  );
}
