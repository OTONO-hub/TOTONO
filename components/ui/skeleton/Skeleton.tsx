import type {
  ComponentPropsWithoutRef,
  ElementType,
} from "react";

import { cn } from "@/lib/utils";

type SkeletonProps<
  T extends ElementType = "div",
> = {
  as?: T;
} & ComponentPropsWithoutRef<T>;

export function Skeleton<
  T extends ElementType = "div",
>({
  as,
  className,
  ...props
}: SkeletonProps<T>) {
  const Component =
    as ?? "div";

  return (
    <Component
      aria-hidden="true"
      className={cn(
        `
          skeleton-shimmer
          rounded-xl
          bg-foreground/7
        `,
        className
      )}
      {...props}
    />
  );
}
