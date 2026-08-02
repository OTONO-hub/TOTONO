import { Skeleton } from "@/components/ui/skeleton/Skeleton";
import { cn } from "@/lib/utils";

type HeroSkeletonProps = {
  className?: string;
};

export function HeroSkeleton({
  className,
}: HeroSkeletonProps) {
  return (
    <section
      aria-hidden="true"
      className={cn(
        `
          overflow-hidden
          rounded-[2rem]
          border
          border-border/45
          bg-card/85
          p-6
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
          sm:p-8
          lg:p-10
        `,
        className
      )}
    >
      <div
        className="
          grid
          gap-8
          lg:grid-cols-[minmax(0,1.2fr)_minmax(18rem,0.8fr)]
          lg:items-center
        "
      >
        <div className="space-y-6">
          <Skeleton className="h-4 w-36 rounded-full" />

          <div className="space-y-4">
            <Skeleton className="h-10 w-5/6 sm:h-12" />
            <Skeleton className="h-10 w-2/3 sm:h-12" />
          </div>

          <div className="space-y-3">
            <Skeleton className="h-4 w-full max-w-xl" />
            <Skeleton className="h-4 w-4/5 max-w-lg" />
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-12 w-36 rounded-full" />
            <Skeleton className="h-12 w-32 rounded-full" />
          </div>
        </div>

        <Skeleton
          className="
            aspect-[4/3]
            w-full
            rounded-[1.75rem]
          "
        />
      </div>
    </section>
  );
}
