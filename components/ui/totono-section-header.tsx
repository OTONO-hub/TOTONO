import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

import { TotonoEyebrow } from "@/components/ui/totono-eyebrow";

type TotonoSectionHeaderProps<T extends ElementType = "div"> = {
  as?: T;
  eyebrow?: ReactNode;
  eyebrowIcon?: ReactNode;
  eyebrowTone?:
    | "default"
    | "accent"
    | "secondary"
    | "success"
    | "muted";
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  titleAs?: "h1" | "h2" | "h3";
  size?: "sm" | "md" | "lg";
} & Omit<ComponentPropsWithoutRef<T>, "as" | "title">;

const titleSizeClasses = {
  sm: "text-xl sm:text-2xl",
  md: "text-2xl sm:text-3xl",
  lg: "text-3xl sm:text-4xl lg:text-5xl",
} as const;

export function TotonoSectionHeader<T extends ElementType = "div">({
  as,
  eyebrow,
  eyebrowIcon,
  eyebrowTone = "default",
  title,
  description,
  action,
  align = "start",
  titleAs = "h2",
  size = "md",
  className,
  ...props
}: TotonoSectionHeaderProps<T>) {
  const Component = as ?? "div";
  const TitleComponent = titleAs;

  const isCentered = align === "center";

  return (
    <Component
      className={cn(
        "flex w-full gap-5",
        isCentered
          ? "flex-col items-center text-center"
          : "flex-col sm:flex-row sm:items-end sm:justify-between",
        className
      )}
      {...props}
    >
      <div
        className={cn(
          "min-w-0",
          isCentered ? "flex max-w-3xl flex-col items-center" : "max-w-3xl"
        )}
      >
        {eyebrow ? (
          <TotonoEyebrow
            icon={eyebrowIcon}
            tone={eyebrowTone}
            className="mb-4"
          >
            {eyebrow}
          </TotonoEyebrow>
        ) : null}

        <TitleComponent
          className={cn(
            "text-balance font-semibold tracking-[-0.035em]",
            "text-foreground",
            titleSizeClasses[size]
          )}
        >
          {title}
        </TitleComponent>

        {description ? (
          <div
            className={cn(
              "mt-3 text-pretty text-sm leading-7 text-muted-foreground",
              size === "lg" && "sm:text-base sm:leading-8",
              isCentered && "max-w-2xl"
            )}
          >
            {description}
          </div>
        ) : null}
      </div>

      {action ? (
        <div
          className={cn(
            "flex shrink-0 items-center",
            isCentered && "justify-center"
          )}
        >
          {action}
        </div>
      ) : null}
    </Component>
  );
}
