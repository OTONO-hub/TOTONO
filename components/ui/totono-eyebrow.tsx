import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type TotonoEyebrowProps<T extends ElementType = "p"> = {
  as?: T;
  icon?: ReactNode;
  tone?: "default" | "accent" | "secondary" | "success" | "muted";
  size?: "sm" | "md";
} & Omit<ComponentPropsWithoutRef<T>, "as">;

const toneClasses = {
  default: "bg-primary/8 text-primary",
  accent: "bg-accent/20 text-foreground",
  secondary: "bg-secondary/25 text-foreground",
  success: "bg-success/15 text-success",
  muted: "bg-muted text-muted-foreground",
} as const;

const sizeClasses = {
  sm: "min-h-7 px-3 py-1 text-[0.68rem]",
  md: "min-h-8 px-3.5 py-1.5 text-xs",
} as const;

export function TotonoEyebrow<T extends ElementType = "p">({
  as,
  icon,
  tone = "default",
  size = "sm",
  className,
  children,
  ...props
}: TotonoEyebrowProps<T>) {
  const Component = as ?? "p";

  return (
    <Component
      className={cn(
        "inline-flex w-fit items-center gap-2",
        "rounded-full",
        "font-semibold uppercase tracking-[0.16em]",
        toneClasses[tone],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {icon ? (
        <span
          aria-hidden="true"
          className="flex shrink-0 items-center justify-center [&_svg]:size-3.5"
        >
          {icon}
        </span>
      ) : null}

      <span>{children}</span>
    </Component>
  );
}
