import { CardSkeleton } from "@/components/ui/skeleton/CardSkeleton";
import { cn } from "@/lib/utils";

type ListSkeletonProps = {
  className?: string;
  count?: number;
  columns?: 1 | 2 | 3;
  showImage?: boolean;
};

export function ListSkeleton({
  className,
  count = 3,
  columns = 1,
  showImage = true,
}: ListSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "grid gap-6",
        columns === 1 &&
          "grid-cols-1",
        columns === 2 &&
          "grid-cols-1 md:grid-cols-2",
        columns === 3 &&
          "grid-cols-1 md:grid-cols-2 xl:grid-cols-3",
        className
      )}
    >
      {Array.from({
        length: Math.max(1, count),
      }).map((_, index) => (
        <CardSkeleton
          key={index}
          showImage={showImage}
        />
      ))}
    </div>
  );
}
