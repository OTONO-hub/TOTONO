import {
  PostCardSkeleton,
} from "@/components/post/post-card-skeleton";
import {
  SaunaCardSkeleton,
} from "@/components/saunas/sauna-card-skeleton";
import { PageSection } from "@/components/ui/page-section";
import { TotonoSkeleton } from "@/components/ui/totono-skeleton";
import { cn } from "@/lib/utils";

export type TotonoPageSkeletonLayout =
  | "posts"
  | "saunas"
  | "simple";

type TotonoPageSkeletonProps = {
  className?: string;
  layout?: TotonoPageSkeletonLayout;
  itemCount?: number;
  label?: string;
};

const MINIMUM_ITEM_COUNT = 1;
const MAXIMUM_ITEM_COUNT = 12;

export function TotonoPageSkeleton({
  className,
  layout = "simple",
  itemCount = 3,
  label = "ページを読み込んでいます",
}: TotonoPageSkeletonProps) {
  const safeItemCount =
    normalizeItemCount(itemCount);

  return (
    <section
      aria-label={label}
      aria-busy="true"
      aria-live="polite"
      data-page-skeleton=""
      data-layout={layout}
      className={cn(
        `
          min-h-[40rem]
          bg-background
          py-10
          sm:py-14
          lg:py-16
        `,
        className
      )}
    >
      <span className="sr-only">
        {label}
      </span>

      <PageSection width="wide">
        <SkeletonPageHeader />

        {layout === "posts" ? (
          <PostSkeletonList
            itemCount={safeItemCount}
          />
        ) : null}

        {layout === "saunas" ? (
          <SaunaSkeletonGrid
            itemCount={safeItemCount}
          />
        ) : null}

        {layout === "simple" ? (
          <SimpleSkeletonList
            itemCount={safeItemCount}
          />
        ) : null}
      </PageSection>
    </section>
  );
}

function SkeletonPageHeader() {
  return (
    <div
      aria-hidden="true"
      className="
        mb-8
        sm:mb-10
        lg:mb-12
      "
    >
      <TotonoSkeleton
        rounded="full"
        className="h-7 w-28"
      />

      <TotonoSkeleton
        rounded="lg"
        className="
          mt-4
          h-9
          w-64
          max-w-full
          sm:h-11
          sm:w-80
        "
      />

      <div
        className="
          mt-4
          max-w-2xl
          space-y-2
        "
      >
        <TotonoSkeleton
          rounded="sm"
          className="h-4 w-full"
        />

        <TotonoSkeleton
          rounded="sm"
          className="h-4 w-4/5"
        />
      </div>
    </div>
  );
}

type SkeletonCollectionProps = {
  itemCount: number;
};

function PostSkeletonList({
  itemCount,
}: SkeletonCollectionProps) {
  return (
    <div
      aria-hidden="true"
      className="
        mx-auto
        max-w-3xl
        space-y-6
        sm:space-y-8
      "
    >
      {Array.from({
        length: itemCount,
      }).map((_, index) => (
        <PostCardSkeleton
          key={`post-skeleton-${index}`}
        />
      ))}
    </div>
  );
}

function SaunaSkeletonGrid({
  itemCount,
}: SkeletonCollectionProps) {
  return (
    <div
      aria-hidden="true"
      className="
        grid
        gap-6
        md:grid-cols-2
        lg:grid-cols-3
      "
    >
      {Array.from({
        length: itemCount,
      }).map((_, index) => (
        <SaunaCardSkeleton
          key={`sauna-skeleton-${index}`}
        />
      ))}
    </div>
  );
}

function SimpleSkeletonList({
  itemCount,
}: SkeletonCollectionProps) {
  return (
    <div
      aria-hidden="true"
      className="
        space-y-5
        sm:space-y-6
      "
    >
      {Array.from({
        length: itemCount,
      }).map((_, index) => (
        <SimpleSkeletonCard
          key={`simple-skeleton-${index}`}
        />
      ))}
    </div>
  );
}

function SimpleSkeletonCard() {
  return (
    <div
      className="
        rounded-[2rem]
        border
        border-border/50
        bg-card
        p-6
        shadow-sm
        sm:rounded-[2.5rem]
        sm:p-8
      "
    >
      <div
        className="
          flex
          items-start
          gap-4
        "
      >
        <TotonoSkeleton
          rounded="full"
          className="
            size-12
            shrink-0
          "
        />

        <div
          className="
            min-w-0
            flex-1
          "
        >
          <TotonoSkeleton
            rounded="sm"
            className="
              h-5
              w-48
              max-w-full
            "
          />

          <div
            className="
              mt-4
              space-y-2
            "
          >
            <TotonoSkeleton
              rounded="sm"
              className="h-4 w-full"
            />

            <TotonoSkeleton
              rounded="sm"
              className="h-4 w-[92%]"
            />

            <TotonoSkeleton
              rounded="sm"
              className="h-4 w-3/4"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function normalizeItemCount(
  itemCount: number
): number {
  if (!Number.isFinite(itemCount)) {
    return MINIMUM_ITEM_COUNT;
  }

  return Math.max(
    MINIMUM_ITEM_COUNT,
    Math.min(
      MAXIMUM_ITEM_COUNT,
      Math.floor(itemCount)
    )
  );
}
