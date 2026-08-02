import type {
  ComponentPropsWithoutRef,
  ElementType,
} from "react";

import { cn } from "@/lib/utils";

export type TotonoSectionSpacing =
  | "none"
  | "sm"
  | "md"
  | "lg"
  | "xl";

export type TotonoSectionTone =
  | "transparent"
  | "surface"
  | "muted"
  | "dark";

type TotonoSectionOwnProps<
  TElement extends ElementType
> = {
  as?: TElement;
  spacing?: TotonoSectionSpacing;
  tone?: TotonoSectionTone;
};

export type TotonoSectionProps<
  TElement extends ElementType = "section"
> = TotonoSectionOwnProps<TElement> &
  Omit<
    ComponentPropsWithoutRef<TElement>,
    keyof TotonoSectionOwnProps<TElement>
  >;

const spacingClassNames = {
  none: "py-0",
  sm: "py-8 sm:py-10",
  md: "py-12 sm:py-16",
  lg: "py-16 sm:py-20 lg:py-24",
  xl: "py-20 sm:py-24 lg:py-32",
} satisfies Record<
  TotonoSectionSpacing,
  string
>;

const toneClassNames = {
  transparent: "bg-transparent",
  surface: "bg-card text-card-foreground",
  muted: "bg-muted/40 text-foreground",
  dark: "bg-primary text-primary-foreground",
} satisfies Record<
  TotonoSectionTone,
  string
>;

export function TotonoSection<
  TElement extends ElementType = "section"
>({
  as,
  spacing = "lg",
  tone = "transparent",
  className,
  ...props
}: TotonoSectionProps<TElement>) {
  const Component = as ?? "section";

  return (
    <Component
      data-totono-section=""
      data-spacing={spacing}
      data-tone={tone}
      className={cn(
        "relative w-full",
        spacingClassNames[spacing],
        toneClassNames[tone],
        className
      )}
      {...props}
    />
  );
}
