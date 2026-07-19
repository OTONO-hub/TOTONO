import { Search } from "lucide-react";

import { SearchForm } from "@/components/search/SearchForm";

export function SearchHero() {
  return (
    <section
      aria-labelledby="search-heading"
      className="
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        px-6
        py-10
        shadow-sm
        backdrop-blur-md
        sm:px-10
        sm:py-12
      "
    >
      <div
        className="
          flex
          flex-col
          gap-8
          lg:flex-row
          lg:items-end
          lg:justify-between
        "
      >
        <div className="max-w-2xl">
          <div className="flex items-center gap-3">
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-secondary/25
                text-foreground
              "
            >
              <Search
                className="size-4.5"
                strokeWidth={1.8}
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              Sauna Discovery
            </p>
          </div>

          <h1
            id="search-heading"
            className="
              mt-6
              text-3xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-4xl
            "
          >
            サウナを探す
          </h1>

          <p
            className="
              mt-4
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            気になるサウナ施設や、みんなのサ活から、
            次に訪れたい場所を見つけましょう。
          </p>
        </div>

        <div className="w-full lg:max-w-md">
          <SearchForm />
        </div>
      </div>
    </section>
  );
}
