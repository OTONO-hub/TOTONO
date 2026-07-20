import {
  Search,
  Sparkles,
} from "lucide-react";

type SearchMessageProps = {
  title: string;
  description: string;
};

export function SearchMessage({
  title,
  description,
}: SearchMessageProps) {
  return (
    <section
      aria-labelledby="search-message-heading"
      aria-describedby="search-message-description"
      className="
        relative
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-14
        text-center
        shadow-sm
        backdrop-blur-md
        sm:mt-12
        sm:px-10
        sm:py-16
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          size-48
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          size-52
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div className="relative z-10">
        <div
          className="
            mx-auto
            flex
            size-16
            items-center
            justify-center
            rounded-full
            border
            border-border/50
            bg-background/70
            text-foreground
            shadow-sm
          "
        >
          <Search
            className="size-6"
            strokeWidth={1.7}
            aria-hidden="true"
          />
        </div>

        <div
          className="
            mt-5
            flex
            items-center
            justify-center
            gap-2
            text-[0.6875rem]
            font-semibold
            uppercase
            tracking-[0.2em]
            text-muted-foreground
          "
        >
          <Sparkles
            className="size-3.5"
            strokeWidth={1.7}
            aria-hidden="true"
          />

          Sauna Discovery
        </div>

        <h2
          id="search-message-heading"
          className="
            mt-4
            text-xl
            font-semibold
            tracking-[-0.025em]
            text-foreground
            sm:text-2xl
          "
        >
          {title}
        </h2>

        <p
          id="search-message-description"
          className="
            mx-auto
            mt-3
            max-w-lg
            text-sm
            leading-7
            text-muted-foreground
            sm:text-base
            sm:leading-8
          "
        >
          {description}
        </p>

        <div
          aria-hidden="true"
          className="
            mx-auto
            mt-8
            h-px
            w-20
            bg-gradient-to-r
            from-transparent
            via-border
            to-transparent
          "
        />
      </div>
    </section>
  );
}
