import type { ReactNode } from "react";

type ResultSectionHeaderProps = {
  id: string;
  icon: ReactNode;
  eyebrow: string;
  title: string;
  count: number;
};

export function ResultSectionHeader({
  id,
  icon,
  eyebrow,
  title,
  count,
}: ResultSectionHeaderProps) {
  return (
    <div
      className="
        flex
        flex-col
        gap-4
        border-b
        border-border/55
        pb-6
        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >
      <div>
        <div className="flex items-center gap-3">
          <span
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              bg-secondary/25
              text-foreground
            "
          >
            {icon}
          </span>

          <p
            className="
              text-[0.6875rem]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-muted-foreground
            "
          >
            {eyebrow}
          </p>
        </div>

        <h2
          id={id}
          className="
            mt-4
            text-2xl
            font-semibold
            tracking-[-0.035em]
            text-foreground
            sm:text-3xl
          "
        >
          {title}
        </h2>
      </div>

      <p
        className="
          text-sm
          font-medium
          text-muted-foreground
        "
      >
        {count}件
      </p>
    </div>
  );
}
