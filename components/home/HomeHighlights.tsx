import Image from "next/image";
import Link from "next/link";

type PopularSauna = {
  rank: number;
  name: string;
  location: string;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  searchQuery: string;
};

const popularSaunas: PopularSauna[] = [
  {
    rank: 1,
    name: "サウナ東京",
    location: "東京都 港区赤坂",
    rating: 4.8,
    reviewCount: 132,
    imageUrl: "/popular/sauna-tokyo.webp",
    searchQuery: "サウナ東京",
  },
  {
    rank: 2,
    name: "品川サウナ",
    location: "東京都 品川区大井",
    rating: 4.7,
    reviewCount: 96,
    imageUrl: "/popular/shinagawa-sauna.webp",
    searchQuery: "品川サウナ",
  },
  {
    rank: 3,
    name: "黄金湯",
    location: "東京都 墨田区太平",
    rating: 4.7,
    reviewCount: 87,
    imageUrl: "/popular/koganeyu.webp",
    searchQuery: "黄金湯",
  },
  {
    rank: 4,
    name: "King & Queen",
    location: "埼玉県 所沢市",
    rating: 4.6,
    reviewCount: 76,
    imageUrl: "/popular/king-and-queen.webp",
    searchQuery: "温泉バルコニー King & Queen",
  },
  {
    rank: 5,
    name: "生姜サウナ 金の亀",
    location: "東京都 港区赤坂",
    rating: 4.5,
    reviewCount: 64,
    imageUrl: "/popular/shoga-sauna.webp",
    searchQuery: "生姜サウナ 金の亀",
  },
];

export function HomeHighlights() {
  return (
    <section className="bg-background py-20 sm:py-24 lg:py-28">
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-10">
          {/* Today's Pick */}
          <div className="min-w-0">
            <div className="mb-8">
              <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                Today&apos;s Pick
              </p>

              <div className="mt-4 flex items-end justify-between gap-6">
                <div>
                  <h2 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
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
                  className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-foreground sm:inline-flex"
                >
                  サウナを探す

                  <span
                    aria-hidden="true"
                    className="transition-transform duration-200 group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>

            <article className="group relative min-h-136 overflow-hidden rounded-[2rem] bg-muted sm:min-h-152">
              <Image
                src="/todays-pick.webp"
                alt="自然に囲まれた静かなサウナ施設"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 850px"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
              />

              <div className="absolute inset-0 bg-linear-to-t from-black/85 via-black/25 to-black/5" />

              <div className="absolute top-6 left-6 rounded-full bg-white/85 px-4 py-2 text-xs font-medium text-neutral-900 backdrop-blur-md sm:top-8 sm:left-8">
                Editor&apos;s Choice
              </div>

              <div className="absolute right-0 bottom-0 left-0 p-6 text-white sm:p-8 lg:p-10">
                <p className="text-xs font-medium tracking-[0.2em] text-white/75 uppercase">
                  Today&apos;s escape
                </p>

                <h3 className="mt-4 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
                  今日のおすすめサウナ
                </h3>

                <div className="mt-4 flex items-center gap-3 text-sm">
                  <span
                    aria-label="評価5点満点中5点"
                    className="tracking-[0.12em] text-yellow-400"
                  >
                    ★★★★★
                  </span>

                  <span className="font-medium">
                    5.0
                  </span>
                </div>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/85 sm:text-base">
                  森と水に囲まれた静かな場所で、
                  日常を忘れて心と身体をゆっくりほどく時間を。
                </p>

                <Link
                  href="/search"
                  className="mt-7 inline-flex h-12 items-center justify-center gap-3 rounded-full bg-accent px-7 text-sm font-semibold text-accent-foreground transition duration-200 hover:-translate-y-0.5 hover:bg-accent/90"
                >
                  サウナを見つける
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>

            <Link
              href="/search"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground sm:hidden"
            >
              サウナを探す
              <span aria-hidden="true">→</span>
            </Link>
          </div>

          {/* Popular */}
          <aside className="min-w-0">
            <div className="mb-8 flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
                  Popular
                </p>

                <h2 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground">
                  人気施設
                </h2>
              </div>

              <Link
                href="/search"
                className="group inline-flex shrink-0 items-center gap-2 text-sm font-medium text-foreground"
              >
                すべて見る

                <span
                  aria-hidden="true"
                  className="transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </Link>
            </div>

            <ol className="space-y-3">
              {popularSaunas.map((sauna) => (
                <li key={sauna.rank}>
                  <Link
                    href={`/search?q=${encodeURIComponent(
                      sauna.searchQuery
                    )}`}
                    className="group grid grid-cols-[2rem_5rem_minmax(0,1fr)] items-center gap-3 rounded-2xl p-2 transition-colors duration-200 hover:bg-muted/50"
                  >
                    {/* 順位 */}
                    <span className="flex size-8 items-center justify-center rounded-full border border-border/70 text-xs font-medium text-foreground">
                      {sauna.rank}
                    </span>

                    {/* 施設写真 */}
                    <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                      <Image
                        src={sauna.imageUrl}
                        alt={`${sauna.name}の外観写真`}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    </div>

                    {/* 施設情報 */}
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {sauna.name}
                      </h3>

                      <p className="mt-1 truncate text-xs text-muted-foreground">
                        {sauna.location}
                      </p>

                      <div className="mt-1.5 flex items-center gap-1.5 text-xs">
                        <span
                          aria-hidden="true"
                          className="text-yellow-500"
                        >
                          ★
                        </span>

                        <span className="font-medium text-foreground">
                          {sauna.rating.toFixed(1)}
                        </span>

                        <span className="truncate text-muted-foreground">
                          （{sauna.reviewCount}件）
                        </span>
                      </div>
                    </div>
                  </Link>
                </li>
              ))}
            </ol>
          </aside>
        </div>
      </div>
    </section>
  );
}