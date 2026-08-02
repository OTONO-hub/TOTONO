import {
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useRef,
  useState,
} from "react";

type Point = {
  x: number;
  y: number;
};

type UseImageZoomParams = {
  minScale?: number;
  maxScale?: number;
  scaleStep?: number;
  swipeThreshold?: number;
  onSwipePrevious?: () => void;
  onSwipeNext?: () => void;
};

const DEFAULT_MIN_SCALE = 1;
const DEFAULT_MAX_SCALE = 3;
const DEFAULT_SCALE_STEP = 0.5;
const DEFAULT_SWIPE_THRESHOLD = 50;

export function useImageZoom({
  minScale = DEFAULT_MIN_SCALE,
  maxScale = DEFAULT_MAX_SCALE,
  scaleStep = DEFAULT_SCALE_STEP,
  swipeThreshold =
    DEFAULT_SWIPE_THRESHOLD,
  onSwipePrevious,
  onSwipeNext,
}: UseImageZoomParams = {}) {
  const [scale, setScale] =
    useState(minScale);

  const [translate, setTranslate] =
    useState<Point>({
      x: 0,
      y: 0,
    });

  const pointerStartRef =
    useRef<Point | null>(null);

  const dragStartTranslateRef =
    useRef<Point>({
      x: 0,
      y: 0,
    });

  const activePointersRef =
    useRef(
      new Map<number, Point>()
    );

  const pinchStartDistanceRef =
    useRef<number | null>(null);

  const pinchStartScaleRef =
    useRef(minScale);

  const resetTransform =
    useCallback(() => {
      setScale(minScale);
      setTranslate({
        x: 0,
        y: 0,
      });

      pointerStartRef.current =
        null;

      pinchStartDistanceRef.current =
        null;

      activePointersRef.current.clear();
    }, [minScale]);

  const zoomIn = useCallback(() => {
    setScale((currentScale) =>
      Math.min(
        maxScale,
        currentScale + scaleStep
      )
    );
  }, [
    maxScale,
    scaleStep,
  ]);

  const zoomOut =
    useCallback(() => {
      setScale((currentScale) => {
        const nextScale =
          Math.max(
            minScale,
            currentScale -
              scaleStep
          );

        if (
          nextScale === minScale
        ) {
          setTranslate({
            x: 0,
            y: 0,
          });
        }

        return nextScale;
      });
    }, [
      minScale,
      scaleStep,
    ]);

  const toggleDoubleClickZoom =
    useCallback(() => {
      if (scale === minScale) {
        setScale(
          Math.min(2, maxScale)
        );
        return;
      }

      resetTransform();
    }, [
      maxScale,
      minScale,
      resetTransform,
      scale,
    ]);

  const handlePointerDown = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    event.currentTarget.setPointerCapture(
      event.pointerId
    );

    const point = {
      x: event.clientX,
      y: event.clientY,
    };

    activePointersRef.current.set(
      event.pointerId,
      point
    );

    pointerStartRef.current =
      point;

    dragStartTranslateRef.current = {
      ...translate,
    };

    if (
      activePointersRef.current.size ===
      2
    ) {
      const points = Array.from(
        activePointersRef.current.values()
      );

      pinchStartDistanceRef.current =
        getDistance(
          points[0],
          points[1]
        );

      pinchStartScaleRef.current =
        scale;
    }
  };

  const handlePointerMove = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    if (
      !activePointersRef.current.has(
        event.pointerId
      )
    ) {
      return;
    }

    activePointersRef.current.set(
      event.pointerId,
      {
        x: event.clientX,
        y: event.clientY,
      }
    );

    if (
      activePointersRef.current.size ===
        2 &&
      pinchStartDistanceRef.current
    ) {
      const points = Array.from(
        activePointersRef.current.values()
      );

      const currentDistance =
        getDistance(
          points[0],
          points[1]
        );

      const ratio =
        currentDistance /
        pinchStartDistanceRef.current;

      const nextScale = Math.max(
        minScale,
        Math.min(
          maxScale,
          pinchStartScaleRef.current *
            ratio
        )
      );

      setScale(nextScale);

      if (
        nextScale === minScale
      ) {
        setTranslate({
          x: 0,
          y: 0,
        });
      }

      return;
    }

    if (
      scale <= minScale ||
      !pointerStartRef.current
    ) {
      return;
    }

    setTranslate({
      x:
        dragStartTranslateRef.current
          .x +
        event.clientX -
        pointerStartRef.current.x,
      y:
        dragStartTranslateRef.current
          .y +
        event.clientY -
        pointerStartRef.current.y,
    });
  };

  const handlePointerEnd = (
    event: ReactPointerEvent<HTMLDivElement>
  ) => {
    const pointerStart =
      pointerStartRef.current;

    activePointersRef.current.delete(
      event.pointerId
    );

    if (
      activePointersRef.current.size <
      2
    ) {
      pinchStartDistanceRef.current =
        null;
    }

    if (
      scale === minScale &&
      pointerStart
    ) {
      const differenceX =
        event.clientX -
        pointerStart.x;

      const differenceY =
        event.clientY -
        pointerStart.y;

      const isHorizontalSwipe =
        Math.abs(differenceX) >
          Math.abs(differenceY) &&
        Math.abs(differenceX) >=
          swipeThreshold;

      if (isHorizontalSwipe) {
        if (differenceX > 0) {
          onSwipePrevious?.();
        } else {
          onSwipeNext?.();
        }
      }
    }

    pointerStartRef.current =
      null;
  };

  const isAtMinimumScale =
    scale <= minScale;

  const isAtMaximumScale =
    scale >= maxScale;

  const isTransformed =
    scale !== minScale ||
    translate.x !== 0 ||
    translate.y !== 0;

  return {
    scale,
    translate,
    isAtMinimumScale,
    isAtMaximumScale,
    isTransformed,
    resetTransform,
    zoomIn,
    zoomOut,
    toggleDoubleClickZoom,
    handlePointerDown,
    handlePointerMove,
    handlePointerEnd,
  };
}

function getDistance(
  first: Point,
  second: Point
): number {
  return Math.hypot(
    second.x - first.x,
    second.y - first.y
  );
}
