"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

export type TodaySauna = {
  id: string;
  name: string;
  prefecture: string | null;
  city: string | null;
  latitude: number | null;
  longitude: number | null;
  selectedAt: string;
};

const STORAGE_KEY =
  "totono:today-sauna";

function isNullableString(
  value: unknown
): value is string | null {
  return (
    typeof value === "string" ||
    value === null
  );
}

function isNullableNumber(
  value: unknown
): value is number | null {
  return (
    value === null ||
    (typeof value === "number" &&
      Number.isFinite(value))
  );
}

function isTodaySauna(
  value: unknown
): value is TodaySauna {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const candidate =
    value as Record<
      string,
      unknown
    >;

  return (
    typeof candidate.id ===
      "string" &&
    typeof candidate.name ===
      "string" &&
    isNullableString(
      candidate.prefecture
    ) &&
    isNullableString(
      candidate.city
    ) &&
    isNullableNumber(
      candidate.latitude
    ) &&
    isNullableNumber(
      candidate.longitude
    ) &&
    typeof candidate.selectedAt ===
      "string"
  );
}

function loadTodaySauna():
  | TodaySauna
  | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const storedValue =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (!storedValue) {
      return null;
    }

    const parsedValue: unknown =
      JSON.parse(storedValue);

    if (
      !isTodaySauna(
        parsedValue
      )
    ) {
      return null;
    }

    return parsedValue;
  } catch {
    return null;
  }
}

export function useTodaySauna(): [
  TodaySauna | null,
  Dispatch<
    SetStateAction<
      TodaySauna | null
    >
  >,
] {
  const [
    todaySauna,
    setTodaySauna,
  ] = useState<
    TodaySauna | null
  >(loadTodaySauna);

  useEffect(() => {
    try {
      if (!todaySauna) {
        window.localStorage.removeItem(
          STORAGE_KEY
        );

        return;
      }

      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(
          todaySauna
        )
      );
    } catch {
      // localStorageが利用できない環境でも、
      // 現在の画面内では状態を維持します。
    }
  }, [todaySauna]);

  return [
    todaySauna,
    setTodaySauna,
  ];
}
