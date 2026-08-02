import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type TotonoEmptyStateProps<T extends ElementType = "div"> = {
  as?: T;
  icon?: ReactNode;
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  secondaryAction?: ReactNode;
  size?: "sm" | "md" | "lg";
  tone?: "default" | "soft" | "outline";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "title">;

const sizeClasses = {
  sm: {
    root: "px-5 py-8 sm:px-6",
    icon: "size-11 rounded-2xl [&_svg]:size-5",
    title: "text-lg sm:text-xl",
    description: "max-w-md text-sm leading-7",
  },
  md: {
    root: "px-6 py-12 sm:px-8 sm:py-14",
    icon: "size-14 rounded-[1.25rem] [&_svg]:size-6",
    title: "text-xl sm:text-2xl",
    description: "max-w-lg text-sm leading-7 sm:text-base sm:leading-8",
  },
  lg: {
    root: "px-6 py-16 sm:px-10 sm:py-20",
    icon: "size-16 rounded-[1.5rem] [&_svg]:size-7",
    title: "text-2xl sm:text-3xl",
    description: "max-w-xl text-base leading-8",
  },
} as const;

const toneClasses = {
  default: [
    "border border-border/50",
    "bg-card text-card-foreground",
    "shadow-sm",
  ],
  soft: [
    "border border-border/30",
    "bg-muted/35 text-foreground",
    "shadow-none",
  ],
  outline: [
    "border border-dashed border-border/70",
    "bg-transparent text-foreground",
    "shadow-none",
  ],
} as const;

export function TotonoEmptyState<T extends ElementType = "div">({
  as,
  icon,
  eyebrow,
  title,
  description,
  action,
  secondaryAction,
  size = "md",
  tone = "soft",
  className,
  ...props
}: TotonoEmptyStateProps<T>) {
  const Component = as ?? "div";
  const styles = sizeClasses[size];

  return (
    <Component
      className={cn(
        "flex w-full flex-col items-center justify-center",
        "rounded-[2rem] text-center",
        toneClasses[tone],
        styles.root,
        className
      )}
      {...props}
    >
      {icon ? (
        <div
          aria-hidden="true"
          className={cn(
            "flex items-center justify-center",
            "bg-background text-primary",
            "shadow-sm ring-1 ring-border/40",
            styles.icon
          )}
        >
          {icon}
        </div>
      ) : null}

      {eyebrow ? (
        <p
          className={cn(
            "font-semibold uppercase tracking-[0.16em]",
            "text-muted-foreground",
            icon ? "mt-5" : "",
            size === "sm" ? "text-[0.68rem]" : "text-xs"
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <h2
        className={cn(
          "text-balance font-semibold tracking-[-0.03em]",
          "text-foreground",
          icon && !eyebrow ? "mt-5" : "",
          eyebrow ? "mt-3" : "",
          styles.title
        )}
      >
        {title}
      </h2>

      {description ? (
        <div
          className={cn(
            "mt-3 text-pretty text-muted-foreground",
            styles.description
          )}
        >
          {description}
        </div>
      ) : null}

      {action || secondaryAction ? (
        <div
          className={cn(
            "mt-6 flex w-full flex-col items-center justify-center gap-3",
            "sm:w-auto sm:flex-row"
          )}
        >
          {action}

          {secondaryAction}
        </div>
      ) : null}
    </Component>
  );
}
