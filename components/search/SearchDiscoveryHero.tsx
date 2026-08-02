import { Search } from "lucide-react";

import { CurrentLocationSearchButton } from "@/components/search/CurrentLocationSearchButton";
import { SearchForm } from "@/components/search/SearchForm";

type SearchDiscoveryHeroProps = {
  currentRadiusKm: number;
};

export function SearchDiscoveryHero({
  currentRadiusKm,
}: SearchDiscoveryHeroProps) {
  return (
    <section
      aria-labelledby="search-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-white/75
        bg-white/88
        px-6
        py-10
        shadow-[0_24px_70px_rgba(62,58,58,0.08)]
        backdrop-blur-xl
        sm:rounded-[2.5rem]
        sm:px-10
        sm:py-12
        lg:px-12
        lg:py-14
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-24
          size-72
          rounded-full
          bg-[#9fd9f6]/25
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          -bottom-28
          absolute
          left-1/3
          size-64
          rounded-full
          bg-[#fdd000]/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
          gap-10
          lg:grid
          lg:grid-cols-[minmax(0,1fr)_minmax(22rem,28rem)]
          lg:items-end
          lg:gap-16
        "
      >
        <div className="max-w-2xl">
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-[#9fd9f6]/25
                text-[#3e3a3a]
              "
            >
              <Search
                className="size-[1.125rem]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-[#3e3a3a]/50
              "
            >
              Sauna Discovery
            </p>
          </div>

          <h1
            id="search-heading"
            className="
              mt-6
              max-w-xl
              text-3xl
              font-semibold
              tracking-[-0.045em]
              text-[#3e3a3a]
              sm:text-4xl
              lg:text-5xl
              lg:leading-[1.12]
            "
          >
            今日の自分に合う
            <br className="hidden sm:block" />
            サウナを見つける。
          </h1>

          <p
            className="
              mt-5
              max-w-xl
              text-sm
              leading-7
              text-[#3e3a3a]/58
              sm:text-base
              sm:leading-8
            "
          >
            施設名やエリア、設備条件から検索。
            現在地周辺のサウナや、みんなのサ活も参考にしながら、
            次に訪れたい場所を見つけましょう。
          </p>

          <div
            className="
              mt-7
              flex
              flex-wrap
              gap-x-6
              gap-y-2
              text-xs
              font-medium
              text-[#3e3a3a]/45
            "
          >
            <span>施設から探す</span>
            <span>現在地から探す</span>
            <span>サ活から探す</span>
          </div>
        </div>

        <div
          className="
            w-full
            rounded-[1.75rem]
            border
            border-[#3e3a3a]/7
            bg-white/78
            p-4
            shadow-[0_16px_45px_rgba(62,58,58,0.07)]
            sm:p-5
          "
        >
          <p
            className="
              mb-4
              text-xs
              font-semibold
              tracking-[0.08em]
              text-[#3e3a3a]/55
            "
          >
            キーワード・エリア・設備から探す
          </p>

          <SearchForm />

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
              className="
                h-px
                flex-1
                bg-[#3e3a3a]/10
              "
            />

            <span
              className="
                text-[0.625rem]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-[#3e3a3a]/35
              "
            >
              or
            </span>

            <div
              aria-hidden="true"
              className="
                h-px
                flex-1
                bg-[#3e3a3a]/10
              "
            />
          </div>

          <CurrentLocationSearchButton
            radiusKm={currentRadiusKm}
            className="w-full"
          />

          <p
            className="
              mt-3
              text-center
              text-[0.6875rem]
              leading-5
              text-[#3e3a3a]/40
            "
          >
            現在地は周辺施設の検索にのみ使用します
          </p>
        </div>
      </div>
    </section>
  );
}
