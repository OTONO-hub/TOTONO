import {
  useCallback,
  useState,
} from "react";

type UseLightboxNavigationParams = {
  imageCount: number;
  initialIndex: number;
  onBeforeChange?: () => void;
};

export function useLightboxNavigation({
  imageCount,
  initialIndex,
  onBeforeChange,
}: UseLightboxNavigationParams) {
  const safeInitialIndex =
    normalizeIndex(
      initialIndex,
      imageCount
    );

  const [activeIndex, setActiveIndex] =
    useState(safeInitialIndex);

  const hasPrevious =
    activeIndex > 0;

  const hasNext =
    activeIndex <
    imageCount - 1;

  const changeImage =
    useCallback(
      (nextIndex: number) => {
        if (imageCount <= 0) {
          return;
        }

        const normalizedIndex =
          normalizeIndex(
            nextIndex,
            imageCount
          );

        if (
          normalizedIndex ===
          activeIndex
        ) {
          return;
        }

        onBeforeChange?.();

        setActiveIndex(
          normalizedIndex
        );
      },
      [
        activeIndex,
        imageCount,
        onBeforeChange,
      ]
    );

  const showPrevious =
    useCallback(() => {
      if (!hasPrevious) {
        return;
      }

      changeImage(
        activeIndex - 1
      );
    }, [
      activeIndex,
      changeImage,
      hasPrevious,
    ]);

  const showNext =
    useCallback(() => {
      if (!hasNext) {
        return;
      }

      changeImage(
        activeIndex + 1
      );
    }, [
      activeIndex,
      changeImage,
      hasNext,
    ]);

  return {
    activeIndex,
    hasPrevious,
    hasNext,
    changeImage,
    showPrevious,
    showNext,
  };
}

function normalizeIndex(
  index: number,
  imageCount: number
): number {
  if (imageCount <= 0) {
    return 0;
  }

  return Math.max(
    0,
    Math.min(
      imageCount - 1,
      index
    )
  );
}
