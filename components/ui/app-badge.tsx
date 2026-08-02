import type {
  HTMLAttributes,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type AppBadgeVariant =
  | "default"
  | "accent"
  | "secondary"
  | "success"
  | "danger"
  | "outline"
  | "dark";

export type AppBadgeSize =
  | "sm"
  | "md";

type AppBadgeProps =
  HTMLAttributes<HTMLSpanElement> & {
    children: ReactNode;
    variant?: AppBadgeVariant;
    size?: AppBadgeSize;
    leadingIcon?: ReactNode;
    dot?: boolean;
  };

const variantClassNames = {
  default: `
    border-border/55
    bg-muted/70
    text-muted-foreground
  `,
  accent: `
    border-accent/30
    bg-accent/20
    text-foreground
  `,
  secondary: `
    border-secondary/40
    bg-secondary/25
    text-foreground
  `,
  success: `
    border-success/25
    bg-success/10
    text-success
  `,
  danger: `
    border-destructive/25
    bg-destructive/10
    text-destructive
  `,
  outline: `
    border-border/70
    bg-transparent
    text-muted-foreground
  `,
  dark: `
    border-white/15
    bg-foreground
    text-background
  `,
} satisfies Record<
  AppBadgeVariant,
  string
>;

const sizeClassNames = {
  sm: `
    min-h-6
    gap-1.5
    px-2.5
    py-1
    text-[0.625rem]
  `,
  md: `
    min-h-7
    gap-2
    px-3
    py-1.5
    text-xs
  `,
} satisfies Record<
  AppBadgeSize,
  string
>;

const dotClassNames = {
  default: "bg-muted-foreground",
  accent: "bg-accent",
  secondary: "bg-secondary",
  success: "bg-success",
  danger: "bg-destructive",
  outline: "bg-muted-foreground",
  dark: "bg-background",
} satisfies Record<
  AppBadgeVariant,
  string
>;

export function AppBadge({
  children,
  variant = "default",
  size = "sm",
  leadingIcon,
  dot = false,
  className,
  ...spanProps
}: AppBadgeProps) {
  return (
    <span
      data-app-badge=""
      data-variant={variant}
      data-size={size}
      className={cn(
        `
          inline-flex
          w-fit
          max-w-full
          shrink-0
          items-center
          justify-center
          rounded-full
          border
          font-semibold
          leading-none
          tracking-[0.04em]
        `,
        variantClassNames[variant],
        sizeClassNames[size],
        className
      )}
      {...spanProps}
    >
      {dot ? (
        <span
          aria-hidden="true"
          className={cn(
            "size-1.5 shrink-0 rounded-full",
            dotClassNames[variant]
          )}
        />
      ) : null}

      {leadingIcon ? (
        <span
          aria-hidden="true"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
            [&_svg]:size-3.5
          "
        >
          {leadingIcon}
        </span>
      ) : null}

      <span className="truncate">
        {children}
      </span>
    </span>
  );
}
