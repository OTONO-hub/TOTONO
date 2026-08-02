import { Skeleton } from "@/components/ui/skeleton/Skeleton";

export function SaunaSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="
        space-y-8
        sm:space-y-10
      "
    >
      <section
        className="
          overflow-hidden
          rounded-[2rem]
          border
          border-border/45
          bg-card/85
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
        "
      >
        <Skeleton className="aspect-[16/9] w-full rounded-none" />

        <div className="space-y-5 p-6 sm:p-8">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-9 w-2/3" />
          <Skeleton className="h-4 w-1/2" />

          <div className="flex flex-wrap gap-3 pt-2">
            <Skeleton className="h-11 w-32 rounded-full" />
            <Skeleton className="h-11 w-28 rounded-full" />
            <Skeleton className="h-11 w-36 rounded-full" />
          </div>
        </div>
      </section>

      <div
        className="
          grid
          gap-6
          xl:grid-cols-2
        "
      >
        {Array.from({
          length: 2,
        }).map((_, index) => (
          <section
            key={index}
            className="
              rounded-[2rem]
              border
              border-border/45
              bg-card/85
              p-6
              shadow-sm
              sm:p-8
            "
          >
            <Skeleton className="h-7 w-40" />

            <div className="mt-7 grid grid-cols-2 gap-4">
              {Array.from({
                length: 6,
              }).map((__, itemIndex) => (
                <Skeleton
                  key={itemIndex}
                  className="h-20 rounded-[1.25rem]"
                />
              ))}
            </div>
          </section>
        ))}
      </div>

      <Skeleton className="h-96 w-full rounded-[2rem]" />

      <section
        className="
          rounded-[2rem]
          border
          border-border/45
          bg-card/85
          p-6
          shadow-sm
          sm:p-8
        "
      >
        <Skeleton className="h-7 w-56" />

        <div
          className="
            mt-7
            grid
            gap-5
            md:grid-cols-2
            xl:grid-cols-3
          "
        >
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <Skeleton
              key={index}
              className="aspect-[4/3] rounded-[1.5rem]"
            />
          ))}
        </div>
      </section>
    </div>
  );
}
