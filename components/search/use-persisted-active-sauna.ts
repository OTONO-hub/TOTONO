"use client";

import {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState,
} from "react";

const STORAGE_KEY =
  "totono:search-active-sauna";

function loadActiveSaunaId():
  | string
  | null {
  if (
    typeof window === "undefined"
  ) {
    return null;
  }

  try {
    const savedValue =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (
      !savedValue ||
      savedValue.trim().length ===
        0
    ) {
      return null;
    }

    return savedValue;
  } catch {
    return null;
  }
}

export function usePersistedActiveSauna(): [
  string | null,
  Dispatch<
    SetStateAction<
      string | null
    >
  >,
] {
  const [
    activeSaunaId,
    setActiveSaunaId,
  ] = useState<string | null>(
    loadActiveSaunaId
  );

  useEffect(() => {
    try {
      if (activeSaunaId) {
        window.localStorage.setItem(
          STORAGE_KEY,
          activeSaunaId
        );

        return;
      }

      window.localStorage.removeItem(
        STORAGE_KEY
      );
    } catch {
      // localStorageが利用できない環境でも、
      // 検索画面上の選択操作は継続します。
    }
  }, [activeSaunaId]);

  return [
    activeSaunaId,
    setActiveSaunaId,
  ];
}
