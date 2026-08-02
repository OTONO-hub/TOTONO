import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

export type TotonoSkeletonRounded =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl"
  | "full";

type TotonoSkeletonProps =
  HTMLAttributes<HTMLDivElement> & {
    rounded?: TotonoSkeletonRounded;
  };

const roundedClassNames = {
  none: "rounded-none",
  sm: "rounded-md",
  md: "rounded-xl",
  lg: "rounded-2xl",
  xl: "rounded-[2rem]",
  full: "rounded-full",
} satisfies Record<
  TotonoSkeletonRounded,
  string
>;

export function TotonoSkeleton({
  rounded = "md",
  className,
  ...props
}: TotonoSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      data-totono-skeleton=""
      data-rounded={rounded}
      className={cn(
        `
          animate-pulse
          bg-muted
          motion-reduce:animate-none
        `,
        roundedClassNames[rounded],
        className
      )}
      {...props}
    />
  );
}
