"use client";

import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useRef,
  useState,
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

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: MotionDuration;
  distance?: MotionDistance;
  once?: boolean;
  threshold?: number;
  rootMargin?: string;
};

export function ScrollReveal({
  children,
  className,
  delay = 0,
  duration = "normal",
  distance = "normal",
  once = true,
  threshold = 0.15,
  rootMargin = "0px 0px -8% 0px",
}: ScrollRevealProps) {
  const elementRef =
    useRef<HTMLDivElement>(null);

  const prefersReducedMotion =
    useReducedMotion();

  const [
    isVisible,
    setIsVisible,
  ] = useState(false);

  useEffect(() => {
    if (prefersReducedMotion) {
      return;
    }

    const element =
      elementRef.current;

    if (!element) {
      return;
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);

            if (once) {
              observer.unobserve(
                element
              );
            }

            return;
          }

          if (!once) {
            setIsVisible(false);
          }
        },
        {
          threshold,
          rootMargin,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [
    once,
    prefersReducedMotion,
    rootMargin,
    threshold,
  ]);

  const style: CSSProperties = {
    opacity:
      prefersReducedMotion ||
      isVisible
        ? 1
        : 0,
    transform:
      prefersReducedMotion ||
      isVisible
        ? "none"
        : `translateY(${MOTION_DISTANCE[distance]}px)`,
    transitionProperty:
      "opacity, transform",
    transitionDuration:
      prefersReducedMotion
        ? "1ms"
        : `${MOTION_DURATION[duration]}ms`,
    transitionDelay:
      prefersReducedMotion
        ? "0ms"
        : `${Math.max(0, delay)}ms`,
    transitionTimingFunction:
      MOTION_EASING.entrance,
  };

  return (
    <div
      ref={elementRef}
      className={cn(
        "will-change-[opacity,transform]",
        className
      )}
      style={style}
    >
      {children}
    </div>
  );
}
