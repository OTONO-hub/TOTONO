import { Header } from "@/components/layout/Header";
import { HeroSkeleton } from "@/components/ui/skeleton/HeroSkeleton";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

export default function SearchLoading() {
  return (
    <>
      <Header />

      <div
        aria-busy="true"
        aria-live="polite"
        aria-label="検索画面を読み込んでいます"
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-muted/25
          pb-32
          pt-28
          sm:pb-28
          sm:pt-32
        "
      >
        <span className="sr-only">
          検索画面を読み込んでいます。
          しばらくお待ちください。
        </span>

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            top-16
            size-112
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-6xl
            space-y-12
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <HeroSkeleton />

          <section
            aria-hidden="true"
            className="
              rounded-[2rem]
              border
              border-border/45
              bg-card/85
              p-5
              shadow-sm
              backdrop-blur-md
              sm:p-7
            "
          >
            <div
              className="
                grid
                gap-4
                md:grid-cols-[minmax(0,1fr)_12rem]
              "
            >
              <Skeleton className="h-12 rounded-full" />
              <Skeleton className="h-12 rounded-full" />
            </div>

            <div
              className="
                mt-4
                flex
                flex-wrap
                gap-3
              "
            >
              <Skeleton className="h-10 w-28 rounded-full" />
              <Skeleton className="h-10 w-32 rounded-full" />
              <Skeleton className="h-10 w-24 rounded-full" />
            </div>
          </section>

          <section aria-hidden="true">
            <div className="mb-7 space-y-3">
              <Skeleton className="h-4 w-32 rounded-full" />
              <Skeleton className="h-8 w-56 rounded-xl" />
            </div>

            <ListSkeleton
              count={6}
              columns={3}
            />
          </section>

          <section aria-hidden="true">
            <div className="mb-7 space-y-3">
              <Skeleton className="h-4 w-28 rounded-full" />
              <Skeleton className="h-8 w-52 rounded-xl" />
            </div>

            <ListSkeleton
              count={3}
              columns={1}
            />
          </section>
        </div>
      </div>
    </>
  );
}
