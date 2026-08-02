import { TotonoCard } from "@/components/ui/totono-card";
import { TotonoSkeleton } from "@/components/ui/totono-skeleton";
import { cn } from "@/lib/utils";

type PostCardSkeletonProps = {
  className?: string;
  showImage?: boolean;
};

export function PostCardSkeleton({
  className,
  showImage = true,
}: PostCardSkeletonProps) {
  return (
    <TotonoCard
      padding="none"
      className={cn("overflow-hidden", className)}
      aria-label="投稿を読み込み中"
      aria-busy="true"
    >
      <div className="flex items-center gap-3 px-5 py-5 sm:px-6">
        <TotonoSkeleton
          rounded="full"
          className="size-11 shrink-0"
        />

        <div className="min-w-0 flex-1 space-y-2">
          <TotonoSkeleton className="h-4 w-32 max-w-full" />
          <TotonoSkeleton className="h-3 w-24 max-w-full" />
        </div>

        <TotonoSkeleton
          rounded="full"
          className="size-9 shrink-0"
        />
      </div>

      {showImage ? (
        <TotonoSkeleton
          rounded="sm"
          className="aspect-[16/10] w-full rounded-none"
        />
      ) : null}

      <div className="space-y-5 px-5 py-6 sm:px-6">
        <div className="space-y-3">
          <TotonoSkeleton className="h-6 w-2/3" />

          <div className="flex flex-wrap gap-2">
            <TotonoSkeleton
              rounded="full"
              className="h-8 w-24"
            />
            <TotonoSkeleton
              rounded="full"
              className="h-8 w-20"
            />
            <TotonoSkeleton
              rounded="full"
              className="h-8 w-28"
            />
          </div>
        </div>

        <div className="space-y-2">
          <TotonoSkeleton className="h-4 w-full" />
          <TotonoSkeleton className="h-4 w-[92%]" />
          <TotonoSkeleton className="h-4 w-3/4" />
        </div>

        <div className="flex items-center justify-between border-t border-border/40 pt-5">
          <div className="flex items-center gap-3">
            <TotonoSkeleton
              rounded="full"
              className="h-9 w-20"
            />
            <TotonoSkeleton
              rounded="full"
              className="h-9 w-20"
            />
          </div>

          <TotonoSkeleton
            rounded="full"
            className="size-9"
          />
        </div>
      </div>
    </TotonoCard>
  );
}
