"use client";

import { useEffect } from "react";

import {
  saveRecentlyViewedSauna,
  type SaveRecentlyViewedSaunaInput,
} from "@/lib/recently-viewed-saunas";

type RecentlyViewedSaunaTrackerProps = {
  sauna: SaveRecentlyViewedSaunaInput;
};

/**
 * 施設詳細ページを開いたことを
 * ブラウザのlocalStorageへ保存します。
 *
 * 画面には何も表示しません。
 */
export function RecentlyViewedSaunaTracker({
  sauna,
}: RecentlyViewedSaunaTrackerProps) {
  useEffect(() => {
    saveRecentlyViewedSauna(sauna);
  }, [sauna]);

  return null;
}
