import Link from "next/link";

type FeaturedArticle = {
  id: string;
  category: string;
  title: string;
  description: string;
  imageUrl: string;
  searchQuery: string;
};

const featuredArticles: FeaturedArticle[] = [
  {
    id: "morning-sauna",
    category: "Morning Sauna",
    title: "朝サウナのすすめ",
    description:
      "1日のはじまりを整える、朝サウナの魅力。",
    imageUrl: "/articles/morning-sauna.webp",
    searchQuery: "朝サウナ",
  },
  {
    id: "oropo",
    category: "Sauna Drink",
    title: "サウナ後のオロポ図鑑",
    description:
      "定番からアレンジまで、オロポの楽しみ方。",
    imageUrl: "/articles/oropo.webp",
    searchQuery: "オロポ",
  },
  {
    id: "air-bath",
    category: "Outdoor Bath",
    title: "外気浴が気持ちいい季節",
    description:
      "風と自然を感じる、おすすめの外気浴体験。",
    imageUrl: "/articles/air-bath.webp",
    searchQuery: "外気浴",
  },
  {
    id: "loyly",
    category: "Sauna Style",
    title: "セルフロウリュの楽しみ方",
    description:
      "自分のペースで楽しむ、サウナの醍醐味。",
    imageUrl: "/articles/loyly.webp",
    searchQuery: "セルフロウリュ",
  },
];

export function FeaturedArticles() {
  return (
    <section
      id="featured-articles"
      aria-labelledby="featured-articles-title"
      className="bg-background py-16 sm:py-20 lg:py-24"
    >
      <div className="mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        {/* セクション見出し */}
        <div className="mb-8 flex items-end justify-between gap-6 sm:mb-10">
          <div>
            <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
              Feature
            </p>

            <h2
              id="featured-articles-title"
              className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl"
            >
              特集記事
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-muted-foreground sm:text-base">
              サウナをもっと楽しむための、
              小さな発見と過ごし方を紹介します。
            </p>
          </div>

          <Link
            href="/search"
            className="group hidden shrink-0 items-center gap-2 text-sm font-medium text-foreground sm:inline-flex"
          >
            すべて見る

            <span
              aria-hidden="true"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
            >
              →
            </span>
          </Link>
        </div>

        {/* 記事一覧 */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredArticles.map((article) => (
            <article
              key={article.id}
              className="group min-w-0"
            >
              <Link
                href={`/search?q=${encodeURIComponent(
                  article.searchQuery
                )}`}
                className="block focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-4"
              >
                <div
                  className="relative aspect-4/3 overflow-hidden rounded-[1.5rem] bg-muted bg-cover bg-center"
                  style={{
                    backgroundImage: `linear-gradient(
                      180deg,
                      rgba(20, 20, 18, 0.02) 25%,
                      rgba(20, 20, 18, 0.78) 100%
                    ), url("${article.imageUrl}")`,
                    backgroundColor: "#d8d4cc",
                  }}
                  role="img"
                  aria-label={`${article.title}の特集写真`}
                >
                  <div className="absolute inset-0 transition-transform duration-700 ease-out group-hover:scale-[1.025]" />

                  <div className="absolute right-0 bottom-0 left-0 p-5 text-white sm:p-6">
                    <p className="text-[10px] font-medium tracking-[0.2em] text-white/70 uppercase">
                      {article.category}
                    </p>

                    <h3 className="mt-3 text-xl leading-snug font-semibold tracking-[-0.02em]">
                      {article.title}
                    </h3>

                    <p className="mt-2 text-sm leading-6 text-white/80">
                      {article.description}
                    </p>

                    <div className="mt-5 flex items-center gap-2 text-xs font-medium text-white">
                      記事を見る

                      <span
                        aria-hidden="true"
                        className="transition-transform duration-200 ease-out group-hover:translate-x-1"
                      >
                        →
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>

        <Link
          href="/search"
          className="mt-7 inline-flex items-center gap-2 text-sm font-medium text-foreground sm:hidden"
        >
          すべて見る
          <span aria-hidden="true">→</span>
        </Link>
      </div>
    </section>
  );
}