"use client";

import Link from "next/link";
import {
  useSearchParams,
} from "next/navigation";
import { MapPin, X } from "lucide-react";

import {
  getSaunaAreaById,
} from "@/constants/areas";
import type {
  SaunaFeature,
} from "@/services/saunas";
import type {
  SearchSort,
} from "@/services/search-sort";

/*
 * 設備条件ごとの表示名です。
 *
 * URLでは英語の識別子を使用していますが、
 * 画面には日本語で表示します。
 */
const FEATURE_LABELS: Record<
  SaunaFeature,
  string
> = {
  sauna: "サウナ室",
  "cold-bath": "水風呂",
  outdoor: "外気浴",
  "rest-area": "休憩スペース",
  restaurant: "レストラン",
  parking: "駐車場",
};

/*
 * 並び順ごとの表示名です。
 */
const SORT_LABELS: Record<
  SearchSort,
  string
> = {
  popular: "人気順",
  rating: "評価が高い順",
  posts: "投稿数順",
  name: "施設名順",
};

const VALID_FEATURES =
  Object.keys(
    FEATURE_LABELS
  ) as SaunaFeature[];

const VALID_SORTS =
  Object.keys(
    SORT_LABELS
  ) as SearchSort[];

/*
 * URLから取得した文字列が
 * 正しい設備条件かを確認します。
 */
function isSaunaFeature(
  value: string
): value is SaunaFeature {
  return VALID_FEATURES.includes(
    value as SaunaFeature
  );
}

/*
 * URLから取得した文字列が
 * 正しい並び順かを確認します。
 */
function isSearchSort(
  value: string
): value is SearchSort {
  return VALID_SORTS.includes(
    value as SearchSort
  );
}

export function SearchFilterChips() {
  const searchParams =
    useSearchParams();

  /*
   * 現在選択されているエリアIDを取得します。
   *
   * 例：
   * tokyo
   */
  const areaId =
    searchParams.get("area");

  /*
   * エリアIDから、
   * 東京都などの表示名を取得します。
   */
  const selectedArea = areaId
    ? getSaunaAreaById(areaId)
    : null;

  /*
   * URLの設備条件を配列へ変換します。
   *
   * 例：
   * cold-bath,parking
   *
   * ↓
   *
   * ["cold-bath", "parking"]
   */
  const selectedFeatures =
    (
      searchParams.get("features") ??
      ""
    )
      .split(",")
      .map((feature) =>
        feature.trim()
      )
      .filter(isSaunaFeature);

  /*
   * URLから並び順を取得します。
   */
  const sortParam =
    searchParams.get("sort");

  const selectedSort =
    sortParam &&
    isSearchSort(sortParam)
      ? sortParam
      : null;

  /*
   * エリア、設備条件、明示的な並び順が
   * 何も選ばれていない場合は、
   * チップ一覧を表示しません。
   */
  const hasActiveFilters =
    Boolean(selectedArea) ||
    selectedFeatures.length > 0 ||
    Boolean(selectedSort);

  if (!hasActiveFilters) {
    return null;
  }

  /*
   * 指定したURLパラメータを削除した
   * 検索ページのURLを作成します。
   *
   * それ以外の検索条件は維持されます。
   */
  const createUrlWithoutParam = (
    paramName: string
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    params.delete(paramName);

    const queryString =
      params.toString();

    return queryString
      ? `/search?${queryString}`
      : "/search";
  };

  /*
   * 指定した設備条件だけを解除した
   * URLを作成します。
   */
  const createUrlWithoutFeature = (
    featureToRemove: SaunaFeature
  ) => {
    const params =
      new URLSearchParams(
        searchParams.toString()
      );

    const remainingFeatures =
      selectedFeatures.filter(
        (feature) =>
          feature !==
          featureToRemove
      );

    if (
      remainingFeatures.length === 0
    ) {
      params.delete("features");
    } else {
      params.set(
        "features",
        remainingFeatures.join(",")
      );
    }

    const queryString =
      params.toString();

    return queryString
      ? `/search?${queryString}`
      : "/search";
  };

  return (
    <div
      className="
        mt-4
        flex
        flex-wrap
        items-center
        gap-2
      "
      aria-label="現在の検索条件"
    >
      {selectedArea && (
        <Link
          href={createUrlWithoutParam(
            "area"
          )}
          className="
            group
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-full
            border
            border-black/5
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-[#3e3a3a]
            shadow-sm
            transition
            hover:-translate-y-0.5
            hover:border-[#fdd000]/70
            hover:shadow-md
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#fdd000]
            focus-visible:ring-offset-2
          "
          aria-label={`${selectedArea.name}の条件を解除`}
        >
          <MapPin
            className="
              size-4
              text-[#3e3a3a]/65
            "
            aria-hidden="true"
          />

          <span>
            {selectedArea.name}
          </span>

          <X
            className="
              size-3.5
              text-[#3e3a3a]/45
              transition
              group-hover:text-[#3e3a3a]
            "
            aria-hidden="true"
          />
        </Link>
      )}

      {selectedFeatures.map(
        (feature) => (
          <Link
            key={feature}
            href={createUrlWithoutFeature(
              feature
            )}
            className="
              group
              inline-flex
              min-h-10
              items-center
              gap-2
              rounded-full
              border
              border-black/5
              bg-white
              px-4
              py-2
              text-sm
              font-medium
              text-[#3e3a3a]
              shadow-sm
              transition
              hover:-translate-y-0.5
              hover:border-[#9fd9f6]
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#9fd9f6]
              focus-visible:ring-offset-2
            "
            aria-label={`${FEATURE_LABELS[feature]}の条件を解除`}
          >
            <span
              className="
                size-2
                rounded-full
                bg-[#9fd9f6]
              "
              aria-hidden="true"
            />

            <span>
              {
                FEATURE_LABELS[
                  feature
                ]
              }
            </span>

            <X
              className="
                size-3.5
                text-[#3e3a3a]/45
                transition
                group-hover:text-[#3e3a3a]
              "
              aria-hidden="true"
            />
          </Link>
        )
      )}

      {selectedSort && (
        <Link
          href={createUrlWithoutParam(
            "sort"
          )}
          className="
            group
            inline-flex
            min-h-10
            items-center
            gap-2
            rounded-full
            border
            border-black/5
            bg-white
            px-4
            py-2
            text-sm
            font-medium
            text-[#3e3a3a]
            shadow-sm
            transition
            hover:-translate-y-0.5
            hover:border-[#fdd000]/70
            hover:shadow-md
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#fdd000]
            focus-visible:ring-offset-2
          "
          aria-label={`${SORT_LABELS[selectedSort]}を解除`}
        >
          <span
            className="
              size-2
              rounded-full
              bg-[#fdd000]
            "
            aria-hidden="true"
          />

          <span>
            {
              SORT_LABELS[
                selectedSort
              ]
            }
          </span>

          <X
            className="
              size-3.5
              text-[#3e3a3a]/45
              transition
              group-hover:text-[#3e3a3a]
            "
            aria-hidden="true"
          />
        </Link>
      )}
    </div>
  );
}
