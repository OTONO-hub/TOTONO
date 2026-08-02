import { Skeleton } from "@/components/ui/skeleton/Skeleton";

export function ProfileSkeleton() {
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
          p-6
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
          sm:p-8
        "
      >
        <div
          className="
            flex
            flex-col
            items-center
            gap-6
            text-center
            sm:flex-row
            sm:text-left
          "
        >
          <Skeleton className="size-28 shrink-0 rounded-full" />

          <div className="w-full space-y-4">
            <Skeleton className="mx-auto h-8 w-48 sm:mx-0" />
            <Skeleton className="mx-auto h-4 w-64 max-w-full sm:mx-0" />
            <Skeleton className="mx-auto h-4 w-52 max-w-full sm:mx-0" />

            <div className="flex justify-center gap-3 pt-2 sm:justify-start">
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      <div
        className="
          grid
          gap-6
          md:grid-cols-2
          xl:grid-cols-3
        "
      >
        {Array.from({
          length: 3,
        }).map((_, index) => (
          <section
            key={index}
            className="
              rounded-[1.75rem]
              border
              border-border/45
              bg-card/85
              p-6
              shadow-sm
            "
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-5 h-10 w-32" />
            <Skeleton className="mt-4 h-3.5 w-full" />
            <Skeleton className="mt-2 h-3.5 w-3/4" />
          </section>
        ))}
      </div>

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
        <Skeleton className="h-7 w-44" />

        <div className="mt-7 space-y-5">
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <div
              key={index}
              className="
                flex
                items-center
                gap-4
              "
            >
              <Skeleton className="size-12 rounded-full" />

              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-3.5 w-3/4" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
