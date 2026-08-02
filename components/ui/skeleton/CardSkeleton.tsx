import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { cn } from "@/lib/utils";

type CardSkeletonProps = {
  className?: string;
  showImage?: boolean;
};

export function CardSkeleton({
  className,
  showImage = true,
}: CardSkeletonProps) {
  return (
    <article
      aria-hidden="true"
      className={cn(
        `
          overflow-hidden
          rounded-[2rem]
          border
          border-border/45
          bg-card/85
          shadow-sm
          backdrop-blur-md
        `,
        className
      )}
    >
      {showImage ? (
        <Skeleton
          className="
            aspect-[4/3]
            w-full
            rounded-none
          "
        />
      ) : null}

      <div className="space-y-5 p-5 sm:p-6">
        <div className="flex items-center gap-3">
          <Skeleton className="size-11 rounded-full" />

          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-3 w-20" />
          </div>
        </div>

        <div className="space-y-3">
          <Skeleton className="h-5 w-2/3" />
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>

        <div className="flex items-center justify-between gap-4 pt-2">
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-full" />
            <Skeleton className="h-9 w-20 rounded-full" />
          </div>

          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </article>
  );
}
