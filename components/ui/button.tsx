import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2",
    "whitespace-nowrap",
    "font-medium",
    "transition-[color,background-color,border-color,box-shadow,transform]",
    "duration-200 ease-out",
    "outline-none",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none",
    "[&_svg]:shrink-0",
    "[&_svg:not([class*='size-'])]:size-4",
    "focus-visible:ring-2",
    "focus-visible:ring-ring/50",
    "focus-visible:ring-offset-2",
    "focus-visible:ring-offset-background",
    "aria-invalid:border-destructive",
    "aria-invalid:ring-destructive/20",
  ],
  {
    variants: {
      variant: {
        default: [
          "border border-primary",
          "bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-primary/90",
          "hover:shadow-md",
          "active:translate-y-0",
          "active:shadow-sm",
        ],

        primary: [
          "border border-primary",
          "bg-primary text-primary-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-primary/90",
          "hover:shadow-md",
          "active:translate-y-0",
          "active:shadow-sm",
        ],

        totono: [
          "border border-primary",
          "bg-primary text-primary-foreground",
          "shadow-md",
          "hover:-translate-y-0.5",
          "hover:bg-primary/90",
          "hover:shadow-lg",
          "active:translate-y-0",
          "active:shadow-md",
        ],

        totonoOutline: [
          "border border-primary/25",
          "bg-background text-primary",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:border-primary/40",
          "hover:bg-primary/5",
          "hover:shadow-md",
          "active:translate-y-0",
          "active:shadow-sm",
        ],

        secondary: [
          "border border-secondary/60",
          "bg-secondary/35 text-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-secondary/55",
          "hover:shadow-md",
          "active:translate-y-0",
        ],

        accent: [
          "border border-accent",
          "bg-accent text-accent-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-accent/85",
          "hover:shadow-md",
          "active:translate-y-0",
        ],

        outline: [
          "border border-border",
          "bg-background text-foreground",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:border-primary/30",
          "hover:bg-muted/50",
          "hover:shadow-md",
          "active:translate-y-0",
        ],

        ghost: [
          "border border-transparent",
          "bg-transparent text-foreground",
          "shadow-none",
          "hover:bg-muted/60",
          "hover:text-foreground",
        ],

        soft: [
          "border border-border/30",
          "bg-muted/60 text-foreground",
          "shadow-none",
          "hover:bg-muted",
        ],

        danger: [
          "border border-destructive",
          "bg-destructive text-white",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-destructive/90",
          "hover:shadow-md",
          "focus-visible:ring-destructive/30",
          "active:translate-y-0",
        ],

        destructive: [
          "border border-destructive",
          "bg-destructive text-white",
          "shadow-sm",
          "hover:-translate-y-0.5",
          "hover:bg-destructive/90",
          "hover:shadow-md",
          "focus-visible:ring-destructive/30",
          "active:translate-y-0",
        ],

        link: [
          "h-auto rounded-none",
          "border-0 bg-transparent p-0",
          "text-primary underline-offset-4",
          "shadow-none",
          "hover:underline",
        ],

        cta: [
          "border border-primary",
          "bg-primary text-primary-foreground",
          "shadow-md",
          "hover:-translate-y-0.5",
          "hover:bg-primary/90",
          "hover:shadow-lg",
          "active:translate-y-0",
          "active:shadow-md",
        ],
      },

      size: {
        default: "h-10 rounded-xl px-4 py-2 text-sm",
        sm: "h-9 rounded-lg px-3 text-sm",
        lg: "h-12 rounded-2xl px-6 text-sm sm:text-base",
        xl: "h-14 rounded-2xl px-7 text-base",
        icon: "size-10 rounded-xl",
        "icon-sm": "size-9 rounded-lg",
        "icon-lg": "size-12 rounded-2xl",
      },

      shape: {
        default: "",
        pill: "rounded-full",
        square: "",
      },

      fullWidth: {
        true: "w-full",
        false: "",
      },
    },

    defaultVariants: {
      variant: "default",
      size: "default",
      shape: "default",
      fullWidth: false,
    },
  }
);

function Button({
  className,
  variant,
  size,
  shape,
  fullWidth,
  asChild = false,
  type,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Component = asChild ? Slot : "button";

  return (
    <Component
      data-slot="button"
      type={asChild ? undefined : (type ?? "button")}
      className={cn(
        buttonVariants({
          variant,
          size,
          shape,
          fullWidth,
        }),
        className
      )}
      {...props}
    />
  );
}

export { Button, buttonVariants };
