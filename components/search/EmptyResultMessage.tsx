import type { ReactNode } from "react";
import {
  SearchX,
  Sparkles,
} from "lucide-react";

type EmptyResultMessageProps = {
  children: ReactNode;
};

export function EmptyResultMessage({
  children,
}: EmptyResultMessageProps) {
  return (
    <div
      role="status"
      className="
        relative
        mt-8
        overflow-hidden
        rounded-[1.75rem]
        border
        border-dashed
        border-border/70
        bg-card/60
        px-6
        py-10
        text-center
        sm:px-8
        sm:py-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          size-40
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div className="relative z-10">
        <div
          className="
            mx-auto
            flex
            size-12
            items-center
            justify-center
            rounded-full
            border
            border-border/50
            bg-background/65
            text-muted-foreground
          "
        >
          <SearchX
            className="size-5"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <p
          className="
            mx-auto
            mt-5
            max-w-xl
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          {children}
        </p>

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-1.5
            text-xs
            text-muted-foreground/75
          "
        >
          <Sparkles
            className="size-3.5"
            strokeWidth={1.7}
            aria-hidden="true"
          />

          別のキーワードでも探してみてください
        </div>
      </div>
    </div>
  );
}
