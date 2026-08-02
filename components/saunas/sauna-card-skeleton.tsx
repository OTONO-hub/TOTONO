import { TotonoCard } from "@/components/ui/totono-card";
import { TotonoSkeleton } from "@/components/ui/totono-skeleton";
import { cn } from "@/lib/utils";

type SaunaCardSkeletonProps = {
  className?: string;
  orientation?: "vertical" | "horizontal";
};

export function SaunaCardSkeleton({
  className,
  orientation = "vertical",
}: SaunaCardSkeletonProps) {
  if (orientation === "horizontal") {
    return (
      <TotonoCard
        padding="none"
        className={cn(
          "grid overflow-hidden sm:grid-cols-[15rem_1fr]",
          className
        )}
        aria-label="サウナ施設を読み込み中"
        aria-busy="true"
      >
        <TotonoSkeleton
          rounded="sm"
          className="aspect-[16/10] w-full rounded-none sm:aspect-auto sm:h-full"
        />

        <div className="flex min-w-0 flex-col justify-between p-5 sm:p-6">
          <div>
            <TotonoSkeleton
              rounded="full"
              className="h-7 w-24"
            />

            <TotonoSkeleton className="mt-4 h-6 w-2/3" />
            <TotonoSkeleton className="mt-3 h-4 w-40 max-w-full" />

            <div className="mt-5 space-y-2">
              <TotonoSkeleton className="h-4 w-full" />
              <TotonoSkeleton className="h-4 w-4/5" />
            </div>
          </div>

          <div className="mt-6 flex items-center justify-between">
            <TotonoSkeleton
              rounded="full"
              className="h-8 w-24"
            />
            <TotonoSkeleton
              rounded="full"
              className="size-10"
            />
          </div>
        </div>
      </TotonoCard>
    );
  }

  return (
    <TotonoCard
      padding="none"
      className={cn("overflow-hidden", className)}
      aria-label="サウナ施設を読み込み中"
      aria-busy="true"
    >
      <TotonoSkeleton
        rounded="sm"
        className="aspect-[4/3] w-full rounded-none"
      />

      <div className="p-5 sm:p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0 flex-1">
            <TotonoSkeleton className="h-6 w-3/4" />
            <TotonoSkeleton className="mt-3 h-4 w-36 max-w-full" />
          </div>

          <TotonoSkeleton
            rounded="full"
            className="size-10 shrink-0"
          />
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          <TotonoSkeleton
            rounded="full"
            className="h-7 w-20"
          />
          <TotonoSkeleton
            rounded="full"
            className="h-7 w-24"
          />
        </div>

        <div className="mt-5 space-y-2">
          <TotonoSkeleton className="h-4 w-full" />
          <TotonoSkeleton className="h-4 w-4/5" />
        </div>

        <div className="mt-6 flex items-center justify-between border-t border-border/40 pt-5">
          <TotonoSkeleton
            rounded="full"
            className="h-8 w-24"
          />
          <TotonoSkeleton
            rounded="full"
            className="h-9 w-28"
          />
        </div>
      </div>
    </TotonoCard>
  );
}
