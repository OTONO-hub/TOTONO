import { Header } from "@/components/layout/Header";
import { ProfileSkeleton } from "@/components/ui/skeleton/ProfileSkeleton";

export default function ProfileLoading() {
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
          プロフィールを読み込んでいます
        </span>

        <div
          className="
            mx-auto
            w-full
            max-w-6xl
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <ProfileSkeleton />
        </div>
      </main>
    </>
  );
}
