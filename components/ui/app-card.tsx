import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type AppCardVariant =
  | "default"
  | "soft"
  | "glass"
  | "outline";

export type AppCardRadius =
  | "md"
  | "lg"
  | "xl";

export type AppCardPadding =
  | "none"
  | "sm"
  | "md"
  | "lg";

type AppCardOwnProps<
  TElement extends ElementType
> = {
  as?: TElement;
  children?: ReactNode;
  variant?: AppCardVariant;
  radius?: AppCardRadius;
  padding?: AppCardPadding;
  interactive?: boolean;
  className?: string;
};

export type AppCardProps<
  TElement extends ElementType = "div"
> = AppCardOwnProps<TElement> &
  Omit<
    ComponentPropsWithoutRef<TElement>,
    keyof AppCardOwnProps<TElement>
  >;

const variantClassNames = {
  default: `
    border
    border-border/55
    bg-card
    shadow-sm
  `,
  soft: `
    border
    border-border/45
    bg-muted/20
  `,
  glass: `
    border
    border-border/55
    bg-card/80
    shadow-sm
    backdrop-blur-md
  `,
  outline: `
    border
    border-border/70
    bg-transparent
  `,
} satisfies Record<
  AppCardVariant,
  string
>;

const radiusClassNames = {
  md: "rounded-[1.25rem]",
  lg: "rounded-[1.5rem]",
  xl: `
    rounded-[2rem]
    sm:rounded-[2.5rem]
  `,
} satisfies Record<
  AppCardRadius,
  string
>;

const paddingClassNames = {
  none: "",
  sm: `
    p-4
    sm:p-5
  `,
  md: `
    p-5
    sm:p-6
  `,
  lg: `
    p-6
    sm:p-8
    lg:p-10
  `,
} satisfies Record<
  AppCardPadding,
  string
>;

function createAppCardClassName({
  variant,
  radius,
  padding,
  interactive,
  className,
}: {
  variant: AppCardVariant;
  radius: AppCardRadius;
  padding: AppCardPadding;
  interactive: boolean;
  className?: string;
}): string {
  return cn(
    `
      group/card
      relative
      isolate
      overflow-hidden
    `,
    variantClassNames[variant],
    radiusClassNames[radius],
    paddingClassNames[padding],
    interactive && [
      `
        transition
        duration-200
        ease-out
        hover:-translate-y-0.5
        hover:border-border/80
        hover:shadow-md
        focus-within:ring-2
        focus-within:ring-ring
        focus-within:ring-offset-2
        focus-within:ring-offset-background
        motion-reduce:transform-none
        motion-reduce:transition-none
      `,
    ],
    className
  );
}

export function AppCard<
  TElement extends ElementType = "div"
>({
  as,
  children,
  variant = "default",
  radius = "xl",
  padding = "md",
  interactive = false,
  className,
  ...elementProps
}: AppCardProps<TElement>) {
  const Component = as ?? "div";

  return (
    <Component
      data-app-card=""
      data-variant={variant}
      data-radius={radius}
      data-padding={padding}
      data-interactive={
        interactive
          ? "true"
          : undefined
      }
      className={createAppCardClassName({
        variant,
        radius,
        padding,
        interactive,
        className,
      })}
      {...elementProps}
    >
      {children}
    </Component>
  );
}
