import type { ReactNode } from "react";

type EmptyResultMessageProps = {
  children: ReactNode;
};

export function EmptyResultMessage({
  children,
}: EmptyResultMessageProps) {
  return (
    <div
      className="
        mt-8
        rounded-[1.75rem]
        border
        border-dashed
        border-border/70
        bg-card/60
        px-6
        py-10
        text-center
      "
    >
      <p
        className="
          text-sm
          leading-7
          text-muted-foreground
        "
      >
        {children}
      </p>
    </div>
  );
}
