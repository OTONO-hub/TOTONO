import type { ReactNode } from "react";

type SearchPageShellProps = {
  children: ReactNode;
};

export function SearchPageShell({
  children,
}: SearchPageShellProps) {
  return (
    <main
      className="
        relative
        min-h-screen
        overflow-hidden
        bg-muted/25
        px-4
        pb-20
        pt-10
        sm:px-6
        sm:pt-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          top-12
          size-96
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-48
          top-[32rem]
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          w-full
          max-w-6xl
        "
      >
        {children}
      </div>
    </main>
  );
}
