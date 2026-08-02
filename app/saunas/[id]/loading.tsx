import { Header } from "@/components/layout/Header";
import { SaunaSkeleton } from "@/components/ui/skeleton/SaunaSkeleton";

export default function SaunaDetailLoading() {
  return (
    <>
      <Header />

      <main
        aria-busy="true"
        aria-live="polite"
        className="
          min-h-screen
          bg-[#e6e5ef]/45
          pb-36
          pt-6
          sm:pb-40
          sm:pt-8
          lg:pb-28
          lg:pt-10
        "
      >
        <span className="sr-only">
          サウナ施設情報を読み込んでいます
        </span>

        <div
          className="
            mx-auto
            w-full
            max-w-7xl
            px-5
            sm:px-6
            lg:px-8
          "
        >
          <SaunaSkeleton />
        </div>
      </main>
    </>
  );
}
