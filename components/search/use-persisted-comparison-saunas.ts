"use client";

import {
  useEffect,
  useState,
} from "react";

const STORAGE_KEY =
  "totono:search-comparison-saunas";

function isStringArray(
  value: unknown
): value is string[] {
  return (
    Array.isArray(value) &&
    value.every(
      (item) =>
        typeof item === "string"
    )
  );
}

function loadComparisonSaunaIds(): string[] {
  if (
    typeof window === "undefined"
  ) {
    return [];
  }

  try {
    const savedValue =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!savedValue) {
      return [];
    }

    const parsedValue: unknown =
      JSON.parse(savedValue);

    if (
      !isStringArray(
        parsedValue
      )
    ) {
      return [];
    }

    return Array.from(
      new Set(
        parsedValue
      )
    );
  } catch {
    return [];
  }
}

export function usePersistedComparisonSaunas(): [
  string[],
  React.Dispatch<
    React.SetStateAction<
      string[]
    >
  >,
] {
  const [
    comparisonSaunaIds,
    setComparisonSaunaIds,
  ] = useState<string[]>(
    loadComparisonSaunaIds
  );

  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          comparisonSaunaIds
        )
      );
    } catch {
      // localStorageが利用できない場合も、
      // 比較機能自体は継続します。
    }
  }, [
    comparisonSaunaIds,
  ]);

  return [
    comparisonSaunaIds,
    setComparisonSaunaIds,
  ];
}
