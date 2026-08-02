import { Header } from "@/components/layout/Header";
import { HeroSkeleton } from "@/components/ui/skeleton/HeroSkeleton";
import { ListSkeleton } from "@/components/ui/skeleton/ListSkeleton";

export default function CommunityLoading() {
  return (
    <>
      <Header />

      <main
        aria-busy="true"
        aria-live="polite"
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
          Communityを読み込んでいます
        </span>

        <div
          className="
            mx-auto
            w-full
            max-w-6xl
            space-y-10
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <HeroSkeleton />

          <ListSkeleton
            count={4}
            columns={1}
          />
        </div>
      </main>
    </>
  );
}
