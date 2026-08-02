import type {
  ComponentPropsWithoutRef,
  ElementType,
  ReactNode,
} from "react";
import {
  ArrowRight,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import { AppButton } from "@/components/ui/app-button";
import { cn } from "@/lib/utils";

type EmptyStateAction = {
  label: string;
  href: string;
  icon?: LucideIcon;
  external?: boolean;
};

export type EmptyStateSize =
  | "default"
  | "compact";

type EmptyStateOwnProps<
  TElement extends ElementType
> = {
  as?: TElement;
  title: ReactNode;
  description: ReactNode;
  eyebrow?: ReactNode;
  icon?: LucideIcon;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
  headingAs?: ElementType;
  headingId?: string;
  descriptionId?: string;
  size?: EmptyStateSize;
  className?: string;
  children?: ReactNode;
};

export type EmptyStateProps<
  TElement extends ElementType = "section"
> = EmptyStateOwnProps<TElement> &
  Omit<
    ComponentPropsWithoutRef<TElement>,
    keyof EmptyStateOwnProps<TElement>
  >;

const sizeClassNames = {
  default: `
    px-6
    py-14
    sm:px-10
    sm:py-18
  `,
  compact: `
    px-5
    py-9
    sm:px-7
    sm:py-11
  `,
} satisfies Record<
  EmptyStateSize,
  string
>;

const iconContainerClassNames = {
  default: "size-16",
  compact: "size-12",
} satisfies Record<
  EmptyStateSize,
  string
>;

const iconClassNames = {
  default: "size-6",
  compact: "size-5",
} satisfies Record<
  EmptyStateSize,
  string
>;

const titleClassNames = {
  default: `
    text-2xl
    sm:text-3xl
  `,
  compact: `
    text-xl
    sm:text-2xl
  `,
} satisfies Record<
  EmptyStateSize,
  string
>;

export function EmptyState<
  TElement extends ElementType = "section"
>({
  as,
  title,
  description,
  eyebrow = "Quiet Lounge",
  icon: Icon = Sparkles,
  action,
  secondaryAction,
  headingAs: Heading = "h2",
  headingId = "empty-state-heading",
  descriptionId = "empty-state-description",
  size = "default",
  className,
  children,
  ...elementProps
}: EmptyStateProps<TElement>) {
  const Component = as ?? "section";

  return (
    <Component
      aria-labelledby={headingId}
      aria-describedby={descriptionId}
      data-empty-state=""
      data-size={size}
      className={cn(
        `
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-dashed
          border-border/60
          bg-linear-to-br
          from-card/90
          via-background
          to-secondary/10
          text-center
          shadow-sm
          sm:rounded-[2.5rem]
        `,
        sizeClassNames[size],
        className
      )}
      {...elementProps}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          size-56
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className={cn(
          `
            relative
            z-10
            mx-auto
            flex
            items-center
            justify-center
            rounded-full
            border
            border-border/55
            bg-card/85
            text-foreground
            shadow-sm
            backdrop-blur-md
          `,
          iconContainerClassNames[size]
        )}
      >
        <Icon
          aria-hidden="true"
          className={
            iconClassNames[size]
          }
          strokeWidth={1.7}
        />
      </div>

      {eyebrow ? (
        <p
          className={cn(
            `
              relative
              z-10
              text-xs
              font-semibold
              uppercase
              tracking-[0.24em]
              text-muted-foreground
            `,
            size === "compact"
              ? "mt-5"
              : "mt-6"
          )}
        >
          {eyebrow}
        </p>
      ) : null}

      <Heading
        id={headingId}
        className={cn(
          `
            relative
            z-10
            mt-4
            text-balance
            font-semibold
            tracking-[-0.035em]
            text-foreground
          `,
          titleClassNames[size]
        )}
      >
        {title}
      </Heading>

      <p
        id={descriptionId}
        className={cn(
          `
            relative
            z-10
            mx-auto
            max-w-xl
            text-pretty
            text-sm
            leading-7
            text-muted-foreground
          `,
          size === "compact"
            ? "mt-3"
            : `
              mt-4
              sm:text-base
              sm:leading-8
            `
        )}
      >
        {description}
      </p>

      {children ? (
        <div
          className={cn(
            "relative z-10",
            size === "compact"
              ? "mt-5"
              : "mt-6"
          )}
        >
          {children}
        </div>
      ) : null}

      {action || secondaryAction ? (
        <div
          className={cn(
            `
              relative
              z-10
              flex
              flex-col
              items-center
              justify-center
              gap-3
              sm:flex-row
            `,
            size === "compact"
              ? "mt-6"
              : "mt-8"
          )}
        >
          {action ? (
            <EmptyStateActionButton
              action={action}
              primary
            />
          ) : null}

          {secondaryAction ? (
            <EmptyStateActionButton
              action={
                secondaryAction
              }
            />
          ) : null}
        </div>
      ) : null}
    </Component>
  );
}

type EmptyStateActionButtonProps = {
  action: EmptyStateAction;
  primary?: boolean;
};

function EmptyStateActionButton({
  action,
  primary = false,
}: EmptyStateActionButtonProps) {
  const ActionIcon =
    action.icon ?? ArrowRight;

  return (
    <AppButton
      href={action.href}
      external={action.external}
      variant={
        primary
          ? "primary"
          : "secondary"
      }
      size="md"
      trailingIcon={
        <ActionIcon
          className="size-4"
          strokeWidth={1.8}
        />
      }
      className="
        w-full
        sm:w-fit
      "
    >
      {action.label}
    </AppButton>
  );
}
