import {
  AlertTriangle,
  ArrowLeft,
} from "lucide-react";
import Link from "next/link";

import { RetryButton } from "@/components/ui/state/RetryButton";
import { cn } from "@/lib/utils";

type ErrorStateProps = {
  title?: string;
  description?: string;
  eyebrow?: string;
  backHref?: string;
  backLabel?: string;
  retryLabel?: string;
  className?: string;
  onRetry?: () => void | Promise<void>;
};

export function ErrorState({
  title = "うまく読み込めませんでした",
  description =
    "通信状態を確認して、もう一度お試しください。時間をおいて再度アクセスすると解決する場合があります。",
  eyebrow = "Something went quiet",
  backHref,
  backLabel = "前の画面へ戻る",
  retryLabel = "もう一度試す",
  className,
  onRetry,
}: ErrorStateProps) {
  return (
    <section
      role="alert"
      className={cn(
        `
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-error/15
          bg-linear-to-br
          from-card/95
          via-background
          to-error/5
          px-6
          py-14
          text-center
          shadow-sm
          sm:rounded-[2.5rem]
          sm:px-10
          sm:py-18
        `,
        className
      )}
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
          bg-error/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          size-16
          items-center
          justify-center
          rounded-full
          border
          border-error/15
          bg-error/8
          text-error
          shadow-sm
        "
      >
        <AlertTriangle
          className="size-6"
          strokeWidth={1.7}
          aria-hidden="true"
        />
      </div>

      <p
        className="
          relative
          z-10
          mt-6
          text-xs
          font-semibold
          uppercase
          tracking-[0.24em]
          text-muted-foreground
        "
      >
        {eyebrow}
      </p>

      <h1
        className="
          relative
          z-10
          mt-4
          text-2xl
          font-semibold
          tracking-[-0.035em]
          text-foreground
          sm:text-3xl
        "
      >
        {title}
      </h1>

      <p
        className="
          relative
          z-10
          mx-auto
          mt-4
          max-w-xl
          text-sm
          leading-7
          text-muted-foreground
          sm:text-base
          sm:leading-8
        "
      >
        {description}
      </p>

      <div
        className="
          relative
          z-10
          mt-8
          flex
          flex-col
          items-center
          justify-center
          gap-3
          sm:flex-row
        "
      >
        <RetryButton
          label={retryLabel}
          onRetry={onRetry}
        />

        {backHref ? (
          <Link
            href={backHref}
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              border
              border-border/60
              bg-card/85
              px-5
              py-2.5
              text-sm
              font-semibold
              text-foreground
              transition
              hover:bg-muted/60
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              sm:w-auto
            "
          >
            <ArrowLeft
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            {backLabel}
          </Link>
        ) : null}
      </div>
    </section>
  );
}
