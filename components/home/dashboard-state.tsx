import type { ReactNode } from "react";
import {
  AlertCircle,
  Inbox,
  RefreshCw,
} from "lucide-react";

type DashboardStateProps = {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
  variant?: "empty" | "error";
};

function getDefaultIcon(
  variant: DashboardStateProps["variant"]
) {
  if (variant === "error") {
    return (
      <AlertCircle
        className="size-5"
        strokeWidth={1.8}
        aria-hidden="true"
      />
    );
  }

  return (
    <Inbox
      className="size-5"
      strokeWidth={1.8}
      aria-hidden="true"
    />
  );
}

export function DashboardState({
  title,
  description,
  icon,
  action,
  className = "",
  variant = "empty",
}: DashboardStateProps) {
  const isError = variant === "error";

  return (
    <div
      role={isError ? "alert" : undefined}
      className={`
        flex
        min-h-56
        flex-col
        items-center
        justify-center
        rounded-[1.5rem]
        border
        border-dashed
        px-6
        py-10
        text-center
        ${
          isError
            ? "border-destructive/25 bg-destructive/[0.04]"
            : "border-border/60 bg-background/55"
        }
        ${className}
      `}
    >
      <div
        className={`
          flex
          size-12
          items-center
          justify-center
          rounded-full
          ${
            isError
              ? "bg-destructive/10 text-destructive"
              : "bg-secondary/20 text-foreground"
          }
        `}
      >
        {icon ?? getDefaultIcon(variant)}
      </div>

      <h3
        className="
          mt-5
          text-base
          font-semibold
          tracking-[-0.02em]
          text-foreground
          sm:text-lg
        "
      >
        {title}
      </h3>

      <p
        className="
          mt-2
          max-w-md
          text-sm
          leading-7
          text-muted-foreground
        "
      >
        {description}
      </p>

      {action && (
        <div className="mt-6">
          {action}
        </div>
      )}
    </div>
  );
}

type DashboardErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
  action?: ReactNode;
  className?: string;
};

export function DashboardErrorState({
  title = "読み込みに失敗しました",
  description = "通信状況を確認して、もう一度お試しください。",
  onRetry,
  action,
  className = "",
}: DashboardErrorStateProps) {
  const retryAction =
    action ??
    (onRetry ? (
      <button
        type="button"
        onClick={onRetry}
        className="
          inline-flex
          min-h-11
          items-center
          justify-center
          gap-2
          rounded-full
          border border-border/70
          bg-card
          px-5
          text-sm
          font-semibold
          text-foreground
          shadow-sm
          transition
          duration-200
          hover:-translate-y-0.5
          hover:shadow-md
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
          active:translate-y-0
        "
      >
        <RefreshCw
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        もう一度試す
      </button>
    ) : null);

  return (
    <DashboardState
      title={title}
      description={description}
      action={retryAction}
      variant="error"
      className={className}
    />
  );
}
