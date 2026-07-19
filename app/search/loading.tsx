import { Header } from "@/components/layout/Header";

function SearchResultSkeleton() {
  return (
    <div
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-black/5
        bg-white/70
        shadow-[0_20px_60px_rgba(62,58,58,0.08)]
      "
    >
      <div
        className="
          aspect-[16/9]
          animate-pulse
          bg-[#d8d7df]
        "
      />

      <div className="space-y-5 p-6 sm:p-7">
        <div
          className="
            h-3
            w-20
            animate-pulse
            rounded-full
            bg-[#d8d7df]
          "
        />

        <div
          className="
            h-6
            w-3/4
            animate-pulse
            rounded-full
            bg-[#cbc9d2]
          "
        />

        <div className="space-y-3">
          <div
            className="
              h-3
              w-full
              animate-pulse
              rounded-full
              bg-[#dedde4]
            "
          />

          <div
            className="
              h-3
              w-5/6
              animate-pulse
              rounded-full
              bg-[#dedde4]
            "
          />
        </div>

        <div className="flex gap-3 pt-2">
          <div
            className="
              h-9
              w-24
              animate-pulse
              rounded-full
              bg-[#dedde4]
            "
          />

          <div
            className="
              h-9
              w-20
              animate-pulse
              rounded-full
              bg-[#dedde4]
            "
          />
        </div>
      </div>
    </div>
  );
}

function PostResultSkeleton() {
  return (
    <div
      className="
        rounded-[2rem]
        border
        border-black/5
        bg-white/70
        p-6
        shadow-[0_20px_60px_rgba(62,58,58,0.08)]
        sm:p-8
      "
    >
      <div className="flex items-center gap-4">
        <div
          className="
            size-12
            shrink-0
            animate-pulse
            rounded-full
            bg-[#d8d7df]
          "
        />

        <div className="flex-1 space-y-2">
          <div
            className="
              h-4
              w-32
              animate-pulse
              rounded-full
              bg-[#cbc9d2]
            "
          />

          <div
            className="
              h-3
              w-20
              animate-pulse
              rounded-full
              bg-[#dedde4]
            "
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <div
          className="
            h-4
            w-full
            animate-pulse
            rounded-full
            bg-[#dedde4]
          "
        />

        <div
          className="
            h-4
            w-11/12
            animate-pulse
            rounded-full
            bg-[#dedde4]
          "
        />

        <div
          className="
            h-4
            w-2/3
            animate-pulse
            rounded-full
            bg-[#dedde4]
          "
        />
      </div>

      <div
        className="
          mt-7
          aspect-[16/9]
          animate-pulse
          rounded-[1.5rem]
          bg-[#d8d7df]
        "
      />

      <div className="mt-6 flex gap-5">
        <div
          className="
            h-9
            w-20
            animate-pulse
            rounded-full
            bg-[#dedde4]
          "
        />

        <div
          className="
            h-9
            w-20
            animate-pulse
            rounded-full
            bg-[#dedde4]
          "
        />

        <div
          className="
            h-9
            w-20
            animate-pulse
            rounded-full
            bg-[#dedde4]
          "
        />
      </div>
    </div>
  );
}

export default function SearchLoading() {
  return (
    <>
      <Header />

      <main
        className="
          min-h-screen
          bg-[#e6e5ef]
          px-5
          pb-24
          pt-28
          text-[#3e3a3a]
          sm:px-8
          sm:pt-32
        "
      >
        <div className="mx-auto max-w-6xl">
          <section className="text-center">
            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.28em]
                text-[#3e3a3a]/50
              "
            >
              Find Your Sauna
            </p>

            <div
              className="
                mx-auto
                mt-5
                h-10
                w-56
                animate-pulse
                rounded-full
                bg-[#cbc9d2]
                sm:h-12
                sm:w-72
              "
            />

            <div
              className="
                mx-auto
                mt-5
                h-4
                w-full
                max-w-md
                animate-pulse
                rounded-full
                bg-[#d8d7df]
              "
            />

            <div
              className="
                mx-auto
                mt-10
                h-14
                w-full
                max-w-2xl
                animate-pulse
                rounded-full
                border
                border-black/5
                bg-white/70
              "
            />
          </section>

          <section
            className="
              mt-16
              sm:mt-20
            "
            aria-label="サウナ施設を検索しています"
          >
            <div className="flex items-end justify-between">
              <div className="space-y-3">
                <div
                  className="
                    h-3
                    w-28
                    animate-pulse
                    rounded-full
                    bg-[#cbc9d2]
                  "
                />

                <div
                  className="
                    h-7
                    w-44
                    animate-pulse
                    rounded-full
                    bg-[#cbc9d2]
                  "
                />
              </div>

              <div
                className="
                  h-8
                  w-16
                  animate-pulse
                  rounded-full
                  bg-[#d8d7df]
                "
              />
            </div>

            <div
              className="
                mt-8
                grid
                gap-6
                md:grid-cols-2
                lg:grid-cols-3
              "
            >
              {Array.from({ length: 3 }).map(
                (_, index) => (
                  <SearchResultSkeleton key={index} />
                )
              )}
            </div>
          </section>

          <section
            className="
              mt-16
              sm:mt-20
            "
            aria-label="サ活投稿を検索しています"
          >
            <div className="flex items-end justify-between">
              <div className="space-y-3">
                <div
                  className="
                    h-3
                    w-32
                    animate-pulse
                    rounded-full
                    bg-[#cbc9d2]
                  "
                />

                <div
                  className="
                    h-7
                    w-40
                    animate-pulse
                    rounded-full
                    bg-[#cbc9d2]
                  "
                />
              </div>

              <div
                className="
                  h-8
                  w-16
                  animate-pulse
                  rounded-full
                  bg-[#d8d7df]
                "
              />
            </div>

            <div
              className="
                mx-auto
                mt-8
                max-w-3xl
                space-y-8
              "
            >
              {Array.from({ length: 2 }).map(
                (_, index) => (
                  <PostResultSkeleton key={index} />
                )
              )}
            </div>
          </section>

          <p
            className="
              mt-12
              text-center
              text-sm
              tracking-[0.08em]
              text-[#3e3a3a]/50
            "
            role="status"
            aria-live="polite"
          >
            あなたに合うサウナを探しています。
          </p>
        </div>
      </main>
    </>
  );
}
