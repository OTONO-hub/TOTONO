import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  CalendarDays,
  ExternalLink,
  PenLine,
  Star,
} from "lucide-react";

type SaunaCommunityPost = {
  id: string;
  sauna_name: string;
  visit_date: string;
  rating: number;
  comment: string | null;
  image_url: string | null;
};

type SaunaCommunityPostsProps = {
  saunaId: string;
  posts: SaunaCommunityPost[];
};

export function SaunaCommunityPosts({
  saunaId,
  posts,
}: SaunaCommunityPostsProps) {
  return (
    <section className="mt-12">
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-[#3e3a3a]/10
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#3e3a3a]/45
            "
          >
            Community
          </p>

          <h2
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            この施設のサ活
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            実際にこの施設を訪れた人の、
            サウナ体験を見てみましょう。
          </p>
        </div>

        <span
          className="
            text-sm
            font-medium
            text-[#3e3a3a]/55
          "
        >
          {posts.length}件
        </span>
      </div>

      {posts.length > 0 ? (
        <div
          className="
            mt-8
            grid
            gap-5
            md:grid-cols-2
          "
        >
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/posts/${post.id}`}
              className="
                group
                overflow-hidden
                rounded-[1.75rem]
                border
                border-black/5
                bg-white
                shadow-sm
                transition
                duration-300
                hover:-translate-y-1
                hover:shadow-lg
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3e3a3a]
                focus-visible:ring-offset-2
              "
            >
              {post.image_url ? (
                <div
                  className="
                    relative
                    aspect-[16/10]
                    w-full
                    overflow-hidden
                    bg-[#3e3a3a]/5
                  "
                >
                  <Image
                    src={post.image_url}
                    alt={`${post.sauna_name}の投稿画像`}
                    fill
                    sizes="
                      (max-width: 768px) 100vw,
                      50vw
                    "
                    className="
                      object-cover
                      transition
                      duration-500
                      group-hover:scale-[1.03]
                    "
                  />
                </div>
              ) : (
                <div
                  className="
                    flex
                    aspect-[16/7]
                    items-center
                    justify-center
                    bg-[#e6e5ef]/55
                    px-6
                    text-center
                  "
                >
                  <p
                    className="
                      text-xs
                      font-semibold
                      tracking-[0.2em]
                      text-[#3e3a3a]/35
                    "
                  >
                    TOTONO JOURNAL
                  </p>
                </div>
              )}

              <div className="p-6">
                <div
                  className="
                    flex
                    flex-wrap
                    items-center
                    gap-3
                    text-xs
                    text-[#3e3a3a]/55
                  "
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                    "
                  >
                    <CalendarDays className="size-3.5" />

                    {formatVisitDate(
                      post.visit_date
                    )}
                  </span>

                  <span
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                    "
                  >
                    <Star
                      className="
                        size-3.5
                        fill-[#fdd000]
                        text-[#fdd000]
                      "
                    />

                    {post.rating} / 5
                  </span>
                </div>

                <h3
                  className="
                    mt-4
                    text-lg
                    font-semibold
                    text-[#3e3a3a]
                  "
                >
                  {post.sauna_name}
                </h3>

                {post.comment && (
                  <p
                    className="
                      mt-3
                      line-clamp-3
                      text-sm
                      leading-7
                      text-[#3e3a3a]/65
                    "
                  >
                    {post.comment}
                  </p>
                )}

                <div
                  className="
                    mt-5
                    inline-flex
                    items-center
                    gap-1.5
                    text-sm
                    font-medium
                    text-[#3e3a3a]
                    transition
                    duration-200
                    group-hover:translate-x-1
                  "
                >
                  投稿を見る
                  <ExternalLink className="size-3.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div
          className="
            mt-8
            rounded-[1.75rem]
            border
            border-dashed
            border-[#3e3a3a]/15
            bg-white/60
            px-6
            py-14
            text-center
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
              bg-[#e6e5ef]
              text-[#3e3a3a]
            "
          >
            <BookOpen
              className="size-5"
              strokeWidth={1.8}
            />
          </div>

          <p
            className="
              mt-5
              text-base
              font-medium
              text-[#3e3a3a]
            "
          >
            この施設の投稿はまだありません
          </p>

          <p
            className="
              mt-2
              text-sm
              leading-7
              text-[#3e3a3a]/55
            "
          >
            最初のサ活をTOTONOに
            残してみましょう。
          </p>

          <Link
            href={`/posts/new?sauna_id=${saunaId}`}
            className="
              mt-6
              inline-flex
              items-center
              justify-center
              gap-2
              rounded-full
              bg-[#3e3a3a]
              px-6
              py-3
              text-sm
              font-medium
              text-white
              transition
              hover:bg-[#3e3a3a]/85
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#3e3a3a]
              focus-visible:ring-offset-2
            "
          >
            <PenLine className="size-4" />
            この施設で投稿する
          </Link>
        </div>
      )}
    </section>
  );
}

function formatVisitDate(
  visitDate: string
): string {
  const date = new Date(
    `${visitDate}T00:00:00`
  );

  if (Number.isNaN(date.getTime())) {
    return visitDate;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
  }
