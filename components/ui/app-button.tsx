import Link from "next/link";
import type {
  AnchorHTMLAttributes,
  ButtonHTMLAttributes,
  ReactNode,
} from "react";

export type AppButtonVariant =
  | "primary"
  | "secondary"
  | "ghost"
  | "danger";

export type AppButtonSize =
  | "sm"
  | "md"
  | "lg";

type AppButtonBaseProps = {
  children: ReactNode;
  variant?: AppButtonVariant;
  size?: AppButtonSize;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  fullWidth?: boolean;
  className?: string;
};

type AppButtonLinkProps =
  AppButtonBaseProps & {
    href: string;
    external?: boolean;
  } & Omit<
    AnchorHTMLAttributes<HTMLAnchorElement>,
    "children" | "className" | "href"
  >;

type AppButtonNativeProps =
  AppButtonBaseProps & {
    href?: never;
    external?: never;
  } & Omit<
    ButtonHTMLAttributes<HTMLButtonElement>,
    "children" | "className"
  >;

export type AppButtonProps =
  | AppButtonLinkProps
  | AppButtonNativeProps;

type ButtonClassNameOptions = {
  variant: AppButtonVariant;
  size: AppButtonSize;
  fullWidth: boolean;
  className: string;
};

function createButtonClassName({
  variant,
  size,
  fullWidth,
  className,
}: ButtonClassNameOptions): string {
  const baseClassName = `
    inline-flex
    shrink-0
    items-center
    justify-center
    gap-2
    rounded-full
    font-semibold
    transition
    duration-200
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    disabled:pointer-events-none
    disabled:opacity-50
    active:translate-y-0
    motion-reduce:transform-none
    motion-reduce:transition-none
  `;

  const variantClassName = {
    primary: `
      bg-primary
      text-primary-foreground
      shadow-sm
      hover:-translate-y-0.5
      hover:shadow-md
    `,
    secondary: `
      border
      border-border/70
      bg-card/75
      text-foreground
      shadow-sm
      backdrop-blur-md
      hover:-translate-y-0.5
      hover:bg-card
      hover:shadow-md
    `,
    ghost: `
      bg-transparent
      text-foreground
      hover:bg-muted/60
    `,
    danger: `
      bg-transparent
      text-muted-foreground
      hover:bg-destructive/10
      hover:text-destructive
    `,
  } satisfies Record<
    AppButtonVariant,
    string
  >;

  const sizeClassName = {
    sm: `
      min-h-10
      px-4
      text-xs
    `,
    md: `
      min-h-11
      px-5
      text-sm
    `,
    lg: `
      min-h-12
      px-6
      text-sm
    `,
  } satisfies Record<
    AppButtonSize,
    string
  >;

  const widthClassName = fullWidth
    ? "w-full"
    : "w-fit";

  return `
    ${baseClassName}
    ${variantClassName[variant]}
    ${sizeClassName[size]}
    ${widthClassName}
    ${className}
  `;
}

function createButtonContent({
  children,
  leadingIcon,
  trailingIcon,
}: {
  children: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
}) {
  return (
    <>
      {leadingIcon ? (
        <span
          aria-hidden="true"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
          "
        >
          {leadingIcon}
        </span>
      ) : null}

      <span>{children}</span>

      {trailingIcon ? (
        <span
          aria-hidden="true"
          className="
            inline-flex
            shrink-0
            items-center
            justify-center
          "
        >
          {trailingIcon}
        </span>
      ) : null}
    </>
  );
}

function isLinkButton(
  props: AppButtonProps
): props is AppButtonLinkProps {
  return (
    "href" in props &&
    typeof props.href === "string"
  );
}

export function AppButton(
  props: AppButtonProps
) {
  if (isLinkButton(props)) {
    const {
      href,
      external = false,
      children,
      variant = "primary",
      size = "md",
      leadingIcon,
      trailingIcon,
      fullWidth = false,
      className = "",
      ...linkProps
    } = props;

    const buttonClassName =
      createButtonClassName({
        variant,
        size,
        fullWidth,
        className,
      });

    const content = createButtonContent({
      children,
      leadingIcon,
      trailingIcon,
    });

    if (external) {
      const {
        target = "_blank",
        rel = "noreferrer",
        ...externalLinkProps
      } = linkProps;

      return (
        <a
          href={href}
          target={target}
          rel={rel}
          className={buttonClassName}
          {...externalLinkProps}
        >
          {content}
        </a>
      );
    }

    return (
      <Link
        href={href}
        className={buttonClassName}
        {...linkProps}
      >
        {content}
      </Link>
    );
  }

  const {
    children,
    variant = "primary",
    size = "md",
    leadingIcon,
    trailingIcon,
    fullWidth = false,
    className = "",
    type = "button",
    ...buttonProps
  } = props;

  const buttonClassName =
    createButtonClassName({
      variant,
      size,
      fullWidth,
      className,
    });

  const content = createButtonContent({
    children,
    leadingIcon,
    trailingIcon,
  });

  return (
    <button
      type={type}
      className={buttonClassName}
      {...buttonProps}
    >
      {content}
    </button>
  );
}
