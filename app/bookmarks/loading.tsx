import { Header } from "@/components/layout/Header";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";
import { Skeleton } from "@/components/ui/skeleton/Skeleton";

export default function BookmarksLoading() {
  return (
    <>
      <Header />

      <div
        aria-busy="true"
        aria-live="polite"
        aria-label="保存済み投稿を読み込んでいます"
        className="
          min-h-screen
          bg-muted/25
          pb-32
          pt-28
          sm:pb-28
          sm:pt-32
        "
      >
        <span className="sr-only">
          保存済み投稿を読み込んでいます。
          しばらくお待ちください。
        </span>

        <div
          className="
            mx-auto
            w-full
            max-w-5xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <section
            aria-hidden="true"
            className="
              rounded-[2rem]
              border
              border-border/45
              bg-card/85
              p-6
              shadow-sm
              backdrop-blur-md
              sm:p-8
            "
          >
            <Skeleton className="h-4 w-28 rounded-full" />
            <Skeleton className="mt-5 h-10 w-64 max-w-full rounded-xl" />
            <Skeleton className="mt-4 h-4 w-full max-w-xl rounded-full" />
            <Skeleton className="mt-3 h-4 w-4/5 max-w-lg rounded-full" />
          </section>

          <div className="mt-10">
            <ListSkeleton
              count={4}
              columns={1}
            />
          </div>
        </div>
      </div>
    </>
  );
}
