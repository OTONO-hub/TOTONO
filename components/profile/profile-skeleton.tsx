import { TotonoCard } from "@/components/ui/totono-card";
import { TotonoSkeleton } from "@/components/ui/totono-skeleton";
import { cn } from "@/lib/utils";

type ProfileSkeletonProps = {
  className?: string;
  showStats?: boolean;
  showActions?: boolean;
};

export function ProfileSkeleton({
  className,
  showStats = true,
  showActions = true,
}: ProfileSkeletonProps) {
  return (
    <TotonoCard
      className={cn("w-full", className)}
      aria-label="プロフィールを読み込み中"
      aria-busy="true"
    >
      <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
        <TotonoSkeleton
          rounded="full"
          className="size-24 shrink-0 sm:size-28"
        />

        <div className="min-w-0 flex-1">
          <div className="space-y-3">
            <TotonoSkeleton className="h-7 w-48 max-w-full" />
            <TotonoSkeleton className="h-4 w-32 max-w-full" />
          </div>

          <div className="mt-5 max-w-2xl space-y-2">
            <TotonoSkeleton className="h-4 w-full" />
            <TotonoSkeleton className="h-4 w-[90%]" />
            <TotonoSkeleton className="h-4 w-2/3" />
          </div>

          {showStats ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <TotonoSkeleton
                rounded="full"
                className="h-10 w-28"
              />
              <TotonoSkeleton
                rounded="full"
                className="h-10 w-28"
              />
              <TotonoSkeleton
                rounded="full"
                className="h-10 w-24"
              />
            </div>
          ) : null}
        </div>

        {showActions ? (
          <div className="flex shrink-0 gap-2 sm:flex-col">
            <TotonoSkeleton
              rounded="full"
              className="h-11 w-28"
            />
            <TotonoSkeleton
              rounded="full"
              className="h-11 w-28"
            />
          </div>
        ) : null}
      </div>

      {showStats ? (
        <div className="mt-8 grid grid-cols-2 gap-3 border-t border-border/40 pt-6 sm:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <div
              key={index}
              className="rounded-2xl border border-border/40 bg-muted/20 p-4"
            >
              <TotonoSkeleton className="h-3 w-16" />
              <TotonoSkeleton className="mt-3 h-7 w-12" />
            </div>
          ))}
        </div>
      ) : null}
    </TotonoCard>
  );
}
