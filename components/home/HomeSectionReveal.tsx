"use client";

import {
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

type HomeSectionRevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
};

export function HomeSectionReveal({
  children,
  className = "",
  delay = 0,
}: HomeSectionRevealProps) {
  const sectionRef =
    useRef<HTMLDivElement | null>(
      null
    );

  const [isVisible, setIsVisible] =
    useState(false);

  useEffect(() => {
    const element =
      sectionRef.current;

    if (!element) {
      return;
    }

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    if (
      prefersReducedMotion ||
      !("IntersectionObserver" in window)
    ) {
      const timeoutId =
        window.setTimeout(() => {
          setIsVisible(true);
        }, 0);

      return () => {
        window.clearTimeout(
          timeoutId
        );
      };
    }

    const observer =
      new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) {
            return;
          }

          setIsVisible(true);
          observer.unobserve(element);
        },
        {
          root: null,
          rootMargin:
            "0px 0px -8% 0px",
          threshold: 0.08,
        }
      );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, []);

  const normalizedDelay =
    Math.max(0, delay);

  return (
    <div
      ref={sectionRef}
      style={{
        transitionDelay: isVisible
          ? `${normalizedDelay}ms`
          : "0ms",
      }}
      className={`
        transform-gpu
        transition-[opacity,transform]
        duration-700
        ease-out
        motion-reduce:translate-y-0
        motion-reduce:opacity-100
        motion-reduce:transition-none
        ${
          isVisible
            ? `
              translate-y-0
              opacity-100
            `
            : `
              translate-y-5
              opacity-0
            `
        }
        ${className}
      `}
    >
      {children}
    </div>
  );
}
