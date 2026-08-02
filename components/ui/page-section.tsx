import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

export type PageSectionWidth =
  | "narrow"
  | "medium"
  | "default"
  | "wide"
  | "full";

export type PageSectionGutter =
  | "none"
  | "small"
  | "compact"
  | "default"
  | "roomy";

type PageSectionOwnProps<
  TElement extends ElementType
> = {
  as?: TElement;
  children?: ReactNode;
  width?: PageSectionWidth;
  gutter?: PageSectionGutter;
  className?: string;
};

export type PageSectionProps<
  TElement extends ElementType = "div"
> = PageSectionOwnProps<TElement> &
  Omit<
    ComponentPropsWithoutRef<TElement>,
    keyof PageSectionOwnProps<TElement>
  >;

const widthClassNames = {
  narrow: "max-w-3xl",
  medium: "max-w-5xl",
  default: "max-w-6xl",
  wide: "max-w-7xl",
  full: "max-w-none",
} satisfies Record<
  PageSectionWidth,
  string
>;

const gutterClassNames = {
  none: "px-0",
  small: "px-4",
  compact: `
    px-3
    sm:px-5
    lg:px-6
  `,
  default: `
    px-4
    sm:px-6
    lg:px-8
  `,
  roomy: `
    px-5
    sm:px-8
    lg:px-10
  `,
} satisfies Record<
  PageSectionGutter,
  string
>;

function createPageSectionClassName({
  width,
  gutter,
  className,
}: {
  width: PageSectionWidth;
  gutter: PageSectionGutter;
  className?: string;
}): string {
  return cn(
    "mx-auto w-full",
    widthClassNames[width],
    gutterClassNames[gutter],
    className
  );
}

export function PageSection<
  TElement extends ElementType = "div"
>({
  as,
  children,
  width = "default",
  gutter = "default",
  className,
  ...elementProps
}: PageSectionProps<TElement>) {
  const Component = as ?? "div";

  return (
    <Component
      data-page-section=""
      data-width={width}
      data-gutter={gutter}
      className={createPageSectionClassName({
        width,
        gutter,
        className,
      })}
      {...elementProps}
    >
      {children}
    </Component>
  );
}
