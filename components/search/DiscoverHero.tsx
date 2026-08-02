import {
  Compass,
  LocateFixed,
  MapPin,
  Search,
  Sparkles,
} from "lucide-react";

import { CurrentLocationSearchButton } from "@/components/search/CurrentLocationSearchButton";
import { SearchForm } from "@/components/search/SearchForm";

const discoveryHints = [
  {
    icon: MapPin,
    label: "エリアから探す",
    description: "都道府県や施設名で検索",
  },
  {
    icon: LocateFixed,
    label: "近くから探す",
    description: "現在地周辺の施設を表示",
  },
  {
    icon: Sparkles,
    label: "体験から探す",
    description: "みんなのサ活も一緒に発見",
  },
];

export function DiscoverHero() {
  return (
    <section
      aria-labelledby="discover-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        px-5
        py-8
        shadow-sm
        backdrop-blur-md
        sm:rounded-[2.5rem]
        sm:px-8
        sm:py-10
        lg:px-10
        lg:py-12
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-28 -top-32
          size-80
          rounded-full
          bg-secondary/20
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-32 -left-24
          size-72
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          grid
          gap-10
          lg:grid-cols-[minmax(0,1fr)_minmax(22rem,0.8fr)]
          lg:items-center
          lg:gap-14
        "
      >
        <div className="max-w-2xl">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/55
              bg-background/70
              px-3.5
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
              shadow-sm
            "
          >
            <Compass
              className="size-4 text-foreground"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Discover
          </div>

          <h1
            id="discover-heading"
            className="
              mt-6
              max-w-2xl
              text-4xl
              font-semibold
              tracking-[-0.05em]
              text-foreground
              sm:text-5xl
              lg:text-6xl
              lg:leading-[1.08]
            "
          >
            次の整いを、
            <br className="hidden sm:block" />
            見つけにいこう。
          </h1>

          <p
            className="
              mt-6
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            施設名、エリア、設備、現在地から検索できます。
            みんなのサ活も参考にしながら、
            今日の気分に合うサウナを見つけましょう。
          </p>

          <div
            className="
              mt-8
              grid
              gap-3
              sm:grid-cols-3
            "
          >
            {discoveryHints.map(
              ({
                icon: Icon,
                label,
                description,
              }) => (
                <div
                  key={label}
                  className="
                    rounded-[1.25rem]
                    border border-border/45
                    bg-background/55
                    p-4
                  "
                >
                  <Icon
                    className="size-4 text-foreground"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      text-foreground
                    "
                  >
                    {label}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-muted-foreground
                    "
                  >
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div
          className="
            rounded-[1.75rem]
            border border-border/55
            bg-background/75
            p-4
            shadow-sm
            sm:p-5
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
              border-b border-border/45
              pb-4
            "
          >
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <Search
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div>
              <p className="text-sm font-semibold text-foreground">
                サウナを検索
              </p>

              <p className="mt-0.5 text-xs text-muted-foreground">
                条件を組み合わせて探せます
              </p>
            </div>
          </div>

          <div className="mt-5">
            <SearchForm />
          </div>

          <div
            className="
              my-4
              flex
              items-center
              gap-3
            "
          >
            <div
              aria-hidden="true"
              className="h-px flex-1 bg-border/70"
            />

            <span
              className="
                text-[0.6875rem]
                font-medium
                uppercase
                tracking-[0.16em]
                text-muted-foreground
              "
            >
              or
            </span>

            <div
              aria-hidden="true"
              className="h-px flex-1 bg-border/70"
            />
          </div>

          <CurrentLocationSearchButton />
        </div>
      </div>
    </section>
  );
}
