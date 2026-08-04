import {
  Flame,
  Sparkles,
} from "lucide-react";

function LoadingLine({
  className = "",
}: {
  className?: string;
}) {
  return (
    <div
      aria-hidden="true"
      className={`
        animate-pulse
        rounded-full
        bg-muted
        motion-reduce:animate-none
        ${className}
      `}
    />
  );
}

function LoadingCard() {
  return (
    <div
      aria-hidden="true"
      className="
        overflow-hidden
        rounded-[1.75rem]
        border
        border-border/55
        bg-card/85
        p-5
        shadow-sm
        sm:p-6
      "
    >
      <div className="flex items-center gap-3">
        <div
          className="
            size-11
            animate-pulse
            rounded-2xl
            bg-muted
            motion-reduce:animate-none
          "
        />

        <div className="min-w-0 flex-1 space-y-2">
          <LoadingLine className="h-4 w-2/5" />
          <LoadingLine className="h-3 w-3/5 bg-muted/70" />
        </div>
      </div>

      <div
        className="
          mt-5
          h-32
          animate-pulse
          rounded-[1.25rem]
          bg-muted/65
          motion-reduce:animate-none
        "
      />

      <div className="mt-5 space-y-3">
        <LoadingLine className="h-4 w-full" />
        <LoadingLine className="h-4 w-5/6 bg-muted/70" />
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div
      aria-busy="true"
      aria-live="polite"
      aria-label="ページを読み込んでいます"
      className="
        relative
        min-h-[70vh]
        overflow-hidden
        bg-background
        px-5
        py-12
        sm:px-8
        sm:py-16
        lg:py-20
      "
    >
      <span className="sr-only">
        ページを読み込んでいます。しばらくお待ちください。
      </span>

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -left-28
          -top-32
          size-80
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
          -bottom-28
          -right-24
          size-72
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
        <div
          aria-hidden="true"
          className="
            flex
            flex-col
            gap-6
            border-b
            border-border/50
            pb-8
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div className="max-w-2xl">
            <div className="flex items-center gap-3">
              <div
                className="
                  flex
                  size-10
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/15
                  text-muted-foreground
                "
              >
                <Sparkles
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.8}
                />
              </div>

              <LoadingLine className="h-3 w-28" />
            </div>

            <LoadingLine className="mt-6 h-10 w-4/5 max-w-lg rounded-xl sm:h-12" />
            <LoadingLine className="mt-4 h-4 w-full max-w-xl bg-muted/70" />
            <LoadingLine className="mt-3 h-4 w-2/3 max-w-md bg-muted/70" />
          </div>

          <div
            className="
              flex
              items-center
              gap-2
              text-sm
              text-muted-foreground
            "
          >
            <Flame
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
            />

            読み込み中
          </div>
        </div>

        <div
          aria-hidden="true"
          className="
            mt-8
            grid
            gap-5
            md:grid-cols-2
            lg:grid-cols-3
          "
        >
          {Array.from({
            length: 3,
          }).map((_, index) => (
            <LoadingCard key={index} />
          ))}
        </div>
      </div>
    </div>
  );
}
