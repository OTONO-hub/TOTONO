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
    name: "サウナしきじ",
    location: "静岡県 静岡市",
    rating: 4.8,
    reviewCount: 132,
    imageUrl: "/popular/sauna-shikiji.webp",
    searchQuery: "サウナしきじ",
  },
  {
    rank: 2,
    name: "スパメッツァおおたか",
    location: "千葉県 流山市",
    rating: 4.7,
    reviewCount: 96,
    imageUrl: "/popular/spametsa.webp",
    searchQuery: "スパメッツァおおたか",
  },
  {
    rank: 3,
    name: "The Sauna",
    location: "長野県 信濃町",
    rating: 4.7,
    reviewCount: 87,
    imageUrl: "/popular/the-sauna.webp",
    searchQuery: "The Sauna",
  },
  {
    rank: 4,
    name: "黄金湯",
    location: "東京都 墨田区",
    rating: 4.6,
    reviewCount: 76,
    imageUrl: "/popular/koganeyu.webp",
    searchQuery: "黄金湯",
  },
  {
    rank: 5,
    name: "ウェルビー栄",
    location: "愛知県 名古屋市",
    rating: 4.5,
    reviewCount: 64,
    imageUrl: "/popular/wellbe-sakae.webp",
    searchQuery: "ウェルビー栄",
  },
];

export function PopularSaunas() {
  return (
    <section
      id="popular-saunas"
      className="bg-background py-20 sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="mb-10 flex items-end justify-between gap-6">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.24em] text-muted-foreground">
              Popular
            </p>

            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-foreground sm:text-4xl">
              人気施設
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              サウナ好きから高い評価を集める、
              人気施設を紹介します。
            </p>
          </div>

          <Link
            href="/search"
            className="hidden items-center gap-2 text-sm font-medium text-foreground transition hover:opacity-70 sm:inline-flex"
          >
            すべて見る →
          </Link>
        </div>

        <div className="overflow-hidden rounded-[32px] border border-border/60 bg-card">
          <ol className="divide-y divide-border/60">
            {popularSaunas.map((sauna) => (
              <li key={sauna.rank}>
                <Link
                  href={`/search?q=${encodeURIComponent(
                    sauna.searchQuery
                  )}`}
                  className="group grid grid-cols-[3rem_6rem_1fr_auto] items-center gap-5 px-6 py-5 transition-colors hover:bg-muted/40"
                >
                  {/* ランキング */}
                  <div className="flex size-10 items-center justify-center rounded-full border border-border text-sm font-semibold">
                    {sauna.rank}
                  </div>

                  {/* 写真 */}
                  <div className="relative aspect-4/3 overflow-hidden rounded-xl bg-muted">
                    <Image
                      src={sauna.imageUrl}
                      alt={`${sauna.name}の施設写真`}
                      fill
                      sizes="96px"
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>

                  {/* テキスト */}
                  <div>
                    <h3 className="text-base font-semibold text-foreground sm:text-lg">
                      {sauna.name}
                    </h3>

                    <p className="mt-1 text-sm text-muted-foreground">
                      {sauna.location}
                    </p>

                    <div className="mt-2 flex items-center gap-2 text-sm">
                      <span className="text-yellow-500">★</span>

                      <span className="font-medium">
                        {sauna.rating}
                      </span>

                      <span className="text-muted-foreground">
                        ({sauna.reviewCount}件)
                      </span>
                    </div>
                  </div>

                  {/* 矢印 */}
                  <div className="flex size-10 items-center justify-center rounded-full border border-border transition-all duration-200 group-hover:bg-foreground group-hover:text-background">
                    →
                  </div>
                </Link>
              </li>
            ))}
          </ol>
        </div>

        <Link
          href="/search"
          className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-foreground sm:hidden"
        >
          すべて見る →
        </Link>
      </div>
    </section>
  );
}
