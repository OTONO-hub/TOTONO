import type { ComponentPropsWithoutRef, ElementType } from "react";

import { cn } from "@/lib/utils";

type TotonoCardProps<T extends ElementType = "div"> = {
  as?: T;
  variant?: "default" | "soft" | "outline" | "glass" | "dark";
  radius?: "md" | "lg" | "xl" | "2xl";
  padding?: "none" | "sm" | "md" | "lg";
  interactive?: boolean;
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const cardVariantClasses = {
  default: [
    "border border-border/50",
    "bg-card text-card-foreground",
    "shadow-sm",
  ],
  soft: [
    "border border-border/30",
    "bg-muted/45 text-foreground",
    "shadow-none",
  ],
  outline: [
    "border border-border/70",
    "bg-transparent text-foreground",
    "shadow-none",
  ],
  glass: [
    "border border-white/50",
    "bg-card/75 text-card-foreground",
    "shadow-sm backdrop-blur-xl",
  ],
  dark: [
    "border border-primary/80",
    "bg-primary text-primary-foreground",
    "shadow-sm",
  ],
} as const;

const cardRadiusClasses = {
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-3xl",
  "2xl": "rounded-[2rem]",
} as const;

const cardPaddingClasses = {
  none: "p-0",
  sm: "p-4 sm:p-5",
  md: "p-5 sm:p-6",
  lg: "p-6 sm:p-8",
} as const;

export function TotonoCard<T extends ElementType = "div">({
  as,
  variant = "default",
  radius = "2xl",
  padding = "lg",
  interactive = false,
  className,
  ...props
}: TotonoCardProps<T>) {
  const Component = as ?? "div";

  return (
    <Component
      className={cn(
        "relative overflow-hidden",
        "transition-[border-color,box-shadow,transform,background-color]",
        "duration-300 ease-out",
        cardVariantClasses[variant],
        cardRadiusClasses[radius],
        cardPaddingClasses[padding],
        interactive && [
          "hover:-translate-y-0.5",
          "hover:border-border",
          "hover:shadow-md",
        ],
        className
      )}
      {...props}
    />
  );
}
