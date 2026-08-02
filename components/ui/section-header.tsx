import type {
  ElementType,
  ReactNode,
} from "react";

import { cn } from "@/lib/utils";

type SectionHeaderProps = {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  align?: "start" | "center";
  headingAs?: ElementType;
  id?: string;
  className?: string;
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  action,
  align = "start",
  headingAs: Heading = "h2",
  id,
  className,
}: SectionHeaderProps) {
  return (
    <div
      data-section-header=""
      className={cn(
        `
          flex
          flex-col
          gap-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        `,
        align === "center" &&
          "text-center sm:text-left",
        className
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.24em]
              text-muted-foreground
            "
          >
            {eyebrow}
          </p>
        ) : null}

        <Heading
          id={id}
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.04em]
            text-foreground
            text-balance
            sm:text-3xl
          "
        >
          {title}
        </Heading>

        {description ? (
          <p
            className="
              mt-3
              text-sm
              leading-7
              text-muted-foreground
              text-pretty
              sm:text-base
            "
          >
            {description}
          </p>
        ) : null}
      </div>

      {action ? (
        <div className="shrink-0">
          {action}
        </div>
      ) : null}
    </div>
  );
}
