import type {
  ComponentPropsWithoutRef,
} from "react";

export type BackgroundGlowTone =
  | "accent"
  | "secondary"
  | "success";

export type BackgroundGlowPosition =
  | "top-left"
  | "top-right"
  | "bottom-left"
  | "bottom-right";

export type BackgroundGlowSize =
  | "sm"
  | "md"
  | "lg";

type BackgroundGlowProps =
  ComponentPropsWithoutRef<"div"> & {
    tone?: BackgroundGlowTone;
    position?: BackgroundGlowPosition;
    size?: BackgroundGlowSize;
  };

export function BackgroundGlow({
  tone = "secondary",
  position = "top-right",
  size = "md",
  className = "",
  ...divProps
}: BackgroundGlowProps) {
  const toneClassName = {
    accent: "bg-accent/10",
    secondary: "bg-secondary/15",
    success: "bg-success/10",
  } satisfies Record<
    BackgroundGlowTone,
    string
  >;

  const positionClassName = {
    "top-left": "-left-24 -top-24",
    "top-right": "-right-24 -top-24",
    "bottom-left": "-bottom-28 -left-24",
    "bottom-right": "-bottom-28 -right-24",
  } satisfies Record<
    BackgroundGlowPosition,
    string
  >;

  const sizeClassName = {
    sm: "size-56",
    md: "size-64",
    lg: "size-72",
  } satisfies Record<
    BackgroundGlowSize,
    string
  >;

  return (
    <div
      aria-hidden="true"
      className={`
        pointer-events-none
        absolute
        -z-10
        rounded-full
        blur-3xl
        ${toneClassName[tone]}
        ${positionClassName[position]}
        ${sizeClassName[size]}
        ${className}
      `}
      {...divProps}
    />
  );
}
