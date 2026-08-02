"use client";

import {
  type CSSProperties,
  type ReactNode,
} from "react";

import {
  MOTION_DISTANCE,
  MOTION_DURATION,
  MOTION_EASING,
  type MotionDistance,
  type MotionDuration,
} from "@/components/motion/motion-tokens";
import { useReducedMotion } from "@/components/motion/useReducedMotion";
import { cn } from "@/lib/utils";

type FadeInProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: MotionDuration;
  distance?: MotionDistance;
  direction?:
    | "up"
    | "down"
    | "left"
    | "right"
    | "none";
};

export function FadeIn({
  children,
  className,
  delay = 0,
  duration = "normal",
  distance = "normal",
  direction = "up",
}: FadeInProps) {
  const prefersReducedMotion =
    useReducedMotion();

  const translate =
    prefersReducedMotion
      ? "none"
      : createTranslate(
          direction,
          MOTION_DISTANCE[distance]
        );

  const style: CSSProperties = {
    opacity: 1,
    transform: "none",
    animationDelay:
      prefersReducedMotion
        ? "0ms"
        : `${Math.max(0, delay)}ms`,
    animationDuration:
      prefersReducedMotion
        ? "1ms"
        : `${MOTION_DURATION[duration]}ms`,
    animationTimingFunction:
      MOTION_EASING.entrance,
    ["--motion-from-transform" as string]:
      translate,
  };

  return (
    <div
      className={cn(
        !prefersReducedMotion &&
          "motion-fade-in",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}

function createTranslate(
  direction:
    | "up"
    | "down"
    | "left"
    | "right"
    | "none",
  distance: number
): string {
  switch (direction) {
    case "up":
      return `translateY(${distance}px)`;

    case "down":
      return `translateY(-${distance}px)`;

    case "left":
      return `translateX(${distance}px)`;

    case "right":
      return `translateX(-${distance}px)`;

    default:
      return "none";
  }
}
