import { Search } from "lucide-react";

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
      className="
        mt-10
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-14
        text-center
        shadow-sm
        backdrop-blur-md
        sm:px-10
        sm:py-16
      "
    >
      <div
        className="
          mx-auto
          flex
          size-14
          items-center
          justify-center
          rounded-full
          bg-secondary/25
          text-foreground
        "
      >
        <Search
          className="size-5"
          strokeWidth={1.7}
        />
      </div>

      <h2
        className="
          mt-6
          text-xl
          font-semibold
          tracking-tight
          text-foreground
        "
      >
        {title}
      </h2>

      <p
        className="
          mx-auto
          mt-3
          max-w-lg
          text-sm
          leading-7
          text-muted-foreground
        "
      >
        {description}
      </p>
    </section>
  );
}
