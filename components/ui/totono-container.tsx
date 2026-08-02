import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type TotonoContainerProps<T extends ElementType = "div"> = {
  as?: T;
  size?: "sm" | "md" | "lg" | "xl" | "full";
  gutter?: "none" | "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "size">;

const containerSizeClasses = {
  sm: "max-w-3xl",
  md: "max-w-5xl",
  lg: "max-w-6xl",
  xl: "max-w-7xl",
  full: "max-w-none",
} as const;

const containerGutterClasses = {
  none: "px-0",
  sm: "px-4",
  md: "px-4 sm:px-6 lg:px-8",
  lg: "px-5 sm:px-8 lg:px-10",
} as const;

export function TotonoContainer<T extends ElementType = "div">({
  as,
  size = "xl",
  gutter = "md",
  className,
  ...props
}: TotonoContainerProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "mx-auto w-full",
        containerSizeClasses[size],
        containerGutterClasses[gutter],
        className
      )}
      {...props}
    />
  );
}
