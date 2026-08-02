"use client";

import {
  Children,
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASING,
  MOTION_STAGGER,
  type MotionDistance,
  type MotionDuration,
  type MotionStagger,
} from "@/components/motion/motion-tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";

type StaggerContainerProps = {
  children: ReactNode;
  className?: string;
  initialDelay?: number;
  stagger?: MotionStagger;
  duration?: MotionDuration;
  distance?: MotionDistance;
};

export function StaggerContainer({
  children,
  className,
  initialDelay = 0,
  stagger = "normal",
  duration = "normal",
  distance = "subtle",
}: StaggerContainerProps) {
  const prefersReducedMotion =
    useReducedMotion();

  return (
    <div className={className}>
      {Children.map(
        children,
        (child, index) => {
          const style: CSSProperties = {
            animationDelay:
              prefersReducedMotion
                ? "0ms"
                : `${
                    Math.max(
                      0,
                      initialDelay
                    ) +
                    index *
                      MOTION_STAGGER[
                        stagger
                      ]
                  }ms`,
            animationDuration:
              prefersReducedMotion
                ? "1ms"
                : `${MOTION_DURATION[duration]}ms`,
            animationTimingFunction:
              MOTION_EASING.entrance,
            ["--motion-from-transform" as string]:
              prefersReducedMotion
                ? "none"
                : `translateY(${MOTION_DISTANCE[distance]}px)`,
          };

          return (
            <div
              className={cn(
                !prefersReducedMotion &&
                  "motion-fade-in"
              )}
              style={style}
            >
              {child}
            </div>
          );
        }
      )}
    </div>
  );
}
