type SaunaMetricCardSkeletonProps = {
  count?: number;
};

function SaunaMetricCardSkeletonItem() {
  return (
    <div
      aria-hidden="true"
      className="
        overflow-hidden
        rounded-[1.75rem]
        border border-border/55
        bg-background/45
      "
    >
      <div
        className="
          aspect-[16/10]
          animate-pulse
          bg-muted/75
        "
      />

      <div className="p-5">
        <div
          className="
            h-6
            w-3/4
            animate-pulse
            rounded-full
            bg-muted
          "
        />

        <div
          className="
            mt-3
            h-4
            w-1/2
            animate-pulse
            rounded-full
            bg-muted/80
          "
        />

        <div
          className="
            mt-4
            h-[3.75rem]
            animate-pulse
            rounded-2xl
            bg-secondary/10
          "
        />

        <div
          className="
            mt-4
            flex
            flex-wrap
            gap-2
          "
        >
          <div
            className="
              h-8
              w-24
              animate-pulse
              rounded-full
              bg-muted
            "
          />

          <div
            className="
              h-8
              w-16
              animate-pulse
              rounded-full
              bg-muted
            "
          />

          <div
            className="
              h-8
              w-20
              animate-pulse
              rounded-full
              bg-muted
            "
          />
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            justify-between
            border-t border-border/45
            pt-4
          "
        >
          <div
            className="
              h-4
              w-20
              animate-pulse
              rounded-full
              bg-muted
            "
          />

          <div
            className="
              size-4
              animate-pulse
              rounded-full
              bg-muted
            "
          />
        </div>
      </div>
    </div>
  );
}

export function SaunaMetricCardSkeleton({
  count = 3,
}: SaunaMetricCardSkeletonProps) {
  const safeCount = Math.min(
    Math.max(Math.floor(count), 1),
    6
  );

  return (
    <div
      role="status"
      aria-label="施設情報を読み込んでいます"
      className="
        grid
        gap-4
        md:grid-cols-2
        lg:grid-cols-3
      "
    >
      {Array.from({
        length: safeCount,
      }).map((_, index) => (
        <SaunaMetricCardSkeletonItem
          key={index}
        />
      ))}

      <span className="sr-only">
        施設情報を読み込んでいます
      </span>
    </div>
  );
}
