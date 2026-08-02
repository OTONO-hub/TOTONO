type DashboardSectionSkeletonProps = {
  rows?: number;
  cards?: number;
  className?: string;
};

export function DashboardSectionSkeleton({
  rows = 2,
  cards = 3,
  className = "",
}: DashboardSectionSkeletonProps) {
  return (
    <div
      aria-hidden="true"
      className={`
        animate-pulse
        rounded-[1.5rem]
        border border-border/45
        bg-card/65
        p-5
        sm:p-7
        lg:p-8
        ${className}
      `}
    >
      <div className="max-w-xl">
        <div className="h-3 w-20 rounded-full bg-muted" />

        <div className="mt-4 h-7 w-52 rounded-full bg-muted" />

        <div
          className="
            mt-3
            h-4
            w-full
            max-w-md
            rounded-full
            bg-muted/80
          "
        />
      </div>

      <div
        className="
          mt-7
          grid
          gap-4
          sm:grid-cols-2
          lg:grid-cols-3
        "
      >
        {Array.from({
          length: cards,
        }).map((_, cardIndex) => (
          <div
            key={cardIndex}
            className="
              rounded-[1.25rem]
              border border-border/40
              bg-background/60
              p-5
            "
          >
            <div className="size-10 rounded-full bg-muted" />

            <div
              className="
                mt-5
                h-5
                w-2/3
                rounded-full
                bg-muted
              "
            />

            <div className="mt-4 space-y-3">
              {Array.from({
                length: rows,
              }).map((_, rowIndex) => (
                <div
                  key={rowIndex}
                  className={`
                    h-3
                    rounded-full
                    bg-muted/80
                    ${
                      rowIndex === rows - 1
                        ? "w-3/4"
                        : "w-full"
                    }
                  `}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
