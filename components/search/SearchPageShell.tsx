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
        isolate
        min-h-screen
        overflow-hidden
        bg-muted/25
        px-4
        pb-20
        pt-8
        sm:px-6
        sm:pb-24
        sm:pt-10
        lg:px-8
        lg:pt-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-40
          top-10
          -z-10
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
          top-[36rem]
          -z-10
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          bottom-24
          right-[10%]
          -z-10
          size-72
          rounded-full
          bg-secondary/10
          blur-3xl
        "
      />

      <div
        className="
          mx-auto
          w-full
          max-w-7xl
        "
      >
        {children}
      </div>
    </main>
  );
}