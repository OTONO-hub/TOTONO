import Link from "next/link";

export function TodaysPick() {
  return (
    <section
      id="todays-pick"
      className="bg-background py-20 sm:py-24 lg:py-32"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        {/* セクション見出し */}
        <div className="mb-10 sm:mb-14">
          <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
            Today&apos;s Pick
          </p>

          <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-3xl leading-tight font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                今日行きたくなるサウナ
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
                日常から少し離れて、心と身体をゆっくりほどく。
                <br className="hidden sm:block" />
                今日の気分に合う一軒を紹介します。
              </p>
            </div>

            <Link
              href="/search"
              className="group inline-flex w-fit items-center gap-2 text-sm font-medium text-foreground"
            >
              サウナを探す

              <span
                aria-hidden="true"
                className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              >
                →
              </span>
            </Link>
          </div>
        </div>

        {/* おすすめ施設 */}
        <article className="overflow-hidden rounded-[2rem] border border-border/50 bg-card">
          <div className="grid lg:grid-cols-[1.35fr_0.65fr]">
            {/* 写真 */}
            <div
              className="relative min-h-[360px] bg-cover bg-center sm:min-h-[480px] lg:min-h-[620px]"
              style={{
                backgroundImage:
                  "linear-gradient(180deg, rgba(20, 20, 18, 0.02) 40%, rgba(20, 20, 18, 0.28) 100%), url('/todays-pick.webp')",
                backgroundColor: "#d8d4cc",
              }}
              role="img"
              aria-label="今日おすすめする静かなサウナ施設"
            >
              <div className="absolute top-6 left-6 rounded-full bg-background/80 px-4 py-2 text-xs font-medium text-foreground backdrop-blur-md sm:top-8 sm:left-8">
                Editor&apos;s Choice
              </div>
            </div>

            {/* 施設情報 */}
            <div className="flex flex-col justify-between p-7 sm:p-10 lg:p-12">
              <div>
                <p className="text-xs font-medium tracking-[0.2em] text-muted-foreground uppercase">
                  Tokyo · Ikebukuro
                </p>

                <h3 className="mt-5 text-3xl leading-tight font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
                  かるまる池袋
                </h3>

                <p
                  className="mt-4 text-sm tracking-[0.16em] text-foreground"
                  aria-label="評価5点満点中5点"
                >
                  ★ ★ ★ ★ ★
                </p>

                <p className="mt-8 text-base leading-8 text-muted-foreground">
                  都会の中心で、自分のためだけの時間を過ごす。
                  多彩なサウナと水風呂を巡りながら、深く静かに整う体験を。
                </p>

                <dl className="mt-10 grid grid-cols-2 gap-6 border-y border-border/60 py-6">
                  <div>
                    <dt className="text-xs text-muted-foreground">
                      おすすめ
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-foreground">
                      外気浴
                    </dd>
                  </div>

                  <div>
                    <dt className="text-xs text-muted-foreground">
                      気分
                    </dt>

                    <dd className="mt-2 text-sm font-medium text-foreground">
                      深く整いたい日
                    </dd>
                  </div>
                </dl>
              </div>

              <Link
                href="/search?q=かるまる池袋"
                className="mt-10 inline-flex h-12 w-full items-center justify-center rounded-full bg-accent px-6 text-sm font-semibold text-accent-foreground transition duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent/90 sm:w-fit"
              >
                この施設を見つける
              </Link>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
