import type {
  SaunaFeature,
  SaunaLocationSearch,
} from "@/services/saunas";

import {
  createLocationSearch,
  createSortSearchParams,
  normalizeSaunaFeatures,
  normalizeSaunaSort,
  type SaunaSortKey,
} from "./search-params";

/**
 * Next.jsから検索ページへ渡される
 * URLクエリパラメータです。
 */
export type SearchPageSearchParams = {
  q?: string;
  prefecture?: string;
  features?: string | string[];
  lat?: string;
  lng?: string;
  radius?: string;
  location?: string;
  sort?: string;
};

/**
 * 検索ページ内で使用する、
 * 検証・整形済みの検索条件です。
 */
type ParsedSearchPageParams = {
  query: string;
  selectedPrefecture: string;
  features: SaunaFeature[];
  currentLocation: SaunaLocationSearch | null;
  isCurrentLocationSearch: boolean;
  saunaSort: SaunaSortKey;
  sortSearchParams: URLSearchParams;
};

/**
 * URLクエリパラメータを、
 * 検索ページで安全に使用できる値へ変換します。
 *
 * page.tsxでは変換方法を意識せず、
 * 整形済みの検索条件だけを利用できます。
 */
export function parseSearchPageParams(
  searchParams: SearchPageSearchParams,
): ParsedSearchPageParams {
  const {
    q = "",
    prefecture = "",
    features: featureParams,
    lat,
    lng,
    radius,
    location,
    sort = "",
  } = searchParams;

  const query = q.trim();
  const selectedPrefecture = prefecture.trim();
  const features =
    normalizeSaunaFeatures(featureParams);

  const currentLocation = createLocationSearch({
    latitude: lat,
    longitude: lng,
    radius,
    location,
  });

  const isCurrentLocationSearch =
    currentLocation !== null;

  const saunaSort = normalizeSaunaSort(
    sort,
    isCurrentLocationSearch,
  );

  const sortSearchParams =
    createSortSearchParams({
      query,
      selectedPrefecture,
      features,
      latitude: lat,
      longitude: lng,
      radius,
      location,
    });

  return {
    query,
    selectedPrefecture,
    features,
    currentLocation,
    isCurrentLocationSearch,
    saunaSort,
    sortSearchParams,
  };
}
