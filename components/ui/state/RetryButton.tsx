"use client";

import {
  RefreshCw,
} from "lucide-react";
import { useTransition } from "react";
import { useRouter } from "next/navigation";

import { cn } from "@/lib/utils";

type RetryButtonProps = {
  label?: string;
  className?: string;
  onRetry?: () => void | Promise<void>;
};

export function RetryButton({
  label = "もう一度試す",
  className,
  onRetry,
}: RetryButtonProps) {
  const router = useRouter();

  const [
    isPending,
    startTransition,
  ] = useTransition();

  const handleRetry = () => {
    startTransition(async () => {
      if (onRetry) {
        await onRetry();
        return;
      }

      router.refresh();
    });
  };

  return (
    <button
      type="button"
      onClick={handleRetry}
      disabled={isPending}
      className={cn(
        `
          inline-flex
          min-h-11
          items-center
          justify-center
          gap-2
          rounded-full
          bg-foreground
          px-5
          py-2.5
          text-sm
          font-semibold
          text-background
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:opacity-90
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-60
        `,
        className
      )}
    >
      <RefreshCw
        className={cn(
          "size-4",
          isPending && "animate-spin"
        )}
        strokeWidth={1.8}
        aria-hidden="true"
      />

      {isPending
        ? "再読み込み中..."
        : label}
    </button>
  );
}
