import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ImageIcon,
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
  const hasPosts = posts.length > 0;

  return (
    <section
      aria-labelledby="sauna-community-heading"
      className="
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-white/70
        bg-white/85
        p-6
        shadow-[0_18px_60px_rgba(62,58,58,0.07)]
        backdrop-blur-xl
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-[#3e3a3a]/8
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
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
            id="sauna-community-heading"
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
              max-w-xl
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            実際にこの施設を訪れた人の、
            サウナ体験を見てみましょう。
          </p>
        </div>

        <div
          className="
            flex
            flex-wrap
            items-center
            gap-3
          "
        >
          <span
            aria-label={`${posts.length}件の投稿があります`}
            className="
              inline-flex
              min-h-11
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-[#e6e5ef]/65
              px-4
              py-2.5
              text-sm
              font-medium
              tabular-nums
              text-[#3e3a3a]
              shadow-sm
              backdrop-blur-md
            "
          >
            {posts.length}件のサ活
          </span>

          {hasPosts && (
            <Link
              href={`/posts/new?sauna_id=${saunaId}`}
              className="
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#3e3a3a]
                px-4
                py-2.5
                text-sm
                font-medium
                text-white
                shadow-sm
                transition-all
                duration-200
                hover:-translate-y-0.5
                hover:bg-[#3e3a3a]/88
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#3e3a3a]
                focus-visible:ring-offset-2
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            >
              <PenLine
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              投稿する
            </Link>
          )}
        </div>
      </div>

      {hasPosts ? (
        <div
          role="list"
          aria-label="この施設のサ活一覧"
          className="
            mt-8
            grid
            gap-5
            md:grid-cols-2
          "
        >
          {posts.map((post) => (
            <CommunityPostCard
              key={post.id}
              post={post}
            />
          ))}
        </div>
      ) : (
        <EmptyCommunityState saunaId={saunaId} />
      )}

      {hasPosts && (
        <p
          className="
            mt-6
            text-xs
            leading-6
            text-[#3e3a3a]/45
          "
        >
          ※ 投稿内容は、TOTONOユーザーによるサ活記録です。
          施設の最新情報は公式サイトでもご確認ください。
        </p>
      )}
    </section>
  );
}

type CommunityPostCardProps = {
  post: SaunaCommunityPost;
};

function CommunityPostCard({
  post,
}: CommunityPostCardProps) {
  const formattedVisitDate =
    formatVisitDate(post.visit_date);

  const normalizedComment =
    post.comment?.trim() || null;

  return (
    <article role="listitem">
      <Link
        href={`/posts/${post.id}`}
        aria-label={`${post.sauna_name}のサ活を見る。評価${post.rating}点、訪問日${formattedVisitDate}`}
        className="
          group
          flex
          h-full
          flex-col
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#3e3a3a]/7
          bg-white/90
          shadow-[0_12px_30px_rgba(62,58,58,0.06)]
          transition-all
          duration-300
          ease-out
          hover:-translate-y-1
          hover:border-[#3e3a3a]/12
          hover:shadow-[0_20px_42px_rgba(62,58,58,0.12)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        <PostImage
          imageUrl={post.image_url}
          saunaName={post.sauna_name}
        />

        <div
          className="
            flex
            flex-1
            flex-col
            p-5
            sm:p-6
          "
        >
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-2
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-[#e6e5ef]/60
                px-3
                py-1.5
                text-xs
                font-medium
                text-[#3e3a3a]/65
              "
            >
              <CalendarDays
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <time dateTime={post.visit_date}>
                {formattedVisitDate}
              </time>
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                border-[#fdd000]/15
                bg-[#fdd000]/10
                px-3
                py-1.5
                text-xs
                font-semibold
                tabular-nums
                text-[#3e3a3a]
              "
              aria-label={`5点満点中${post.rating}点`}
            >
              <Star
                className="
                  size-3.5
                  fill-[#fdd000]
                  text-[#fdd000]
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {post.rating.toFixed(1)}
            </span>
          </div>

          <h3
            className="
              mt-5
              break-words
              text-lg
              font-semibold
              tracking-[-0.025em]
              text-[#3e3a3a]
            "
          >
            {post.sauna_name}
          </h3>

          {normalizedComment ? (
            <p
              className="
                mt-3
                line-clamp-3
                break-words
                text-sm
                leading-7
                text-[#3e3a3a]/65
              "
            >
              {normalizedComment}
            </p>
          ) : (
            <p
              className="
                mt-3
                text-sm
                leading-7
                text-[#3e3a3a]/38
              "
            >
              コメントのないサ活記録です。
            </p>
          )}

          <div
            className="
              mt-auto
              flex
              items-center
              justify-between
              gap-4
              pt-6
            "
          >
            <span
              className="
                text-xs
                font-medium
                uppercase
                tracking-[0.16em]
                text-[#3e3a3a]/35
              "
            >
              Sauna Journal
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-sm
                font-medium
                text-[#3e3a3a]
              "
            >
              投稿を見る

              <ArrowRight
                className="
                  size-4
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                  motion-reduce:transition-none
                "
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

type PostImageProps = {
  imageUrl: string | null;
  saunaName: string;
};

function PostImage({
  imageUrl,
  saunaName,
}: PostImageProps) {
  if (!imageUrl) {
    return (
      <div
        className="
          relative
          flex
          aspect-[16/9]
          items-center
          justify-center
          overflow-hidden
          bg-linear-to-br
          from-[#e6e5ef]/80
          via-white
          to-[#9fd9f6]/20
          px-6
          text-center
        "
      >
        <div
          className="
            pointer-events-none
            absolute
            -right-12
            -top-12
            size-36
            rounded-full
            bg-[#9fd9f6]/30
            blur-3xl
          "
          aria-hidden="true"
        />

        <div
          className="
            pointer-events-none
            absolute
            -bottom-16
            -left-12
            size-36
            rounded-full
            bg-[#fdd000]/12
            blur-3xl
          "
          aria-hidden="true"
        />

        <div className="relative z-10">
          <span
            className="
              mx-auto
              flex
              size-12
              items-center
              justify-center
              rounded-full
              border
              border-white/80
              bg-white/75
              text-[#3e3a3a]/45
              shadow-sm
              backdrop-blur-md
            "
            aria-hidden="true"
          >
            <ImageIcon
              className="size-5"
              strokeWidth={1.7}
            />
          </span>

          <p
            className="
              mt-4
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#3e3a3a]/38
            "
          >
            TOTONO Journal
          </p>
        </div>
      </div>
    );
  }

  return (
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
        src={imageUrl}
        alt={`${saunaName}でのサ活の投稿画像`}
        fill
        sizes="
          (max-width: 767px) 100vw,
          (max-width: 1200px) 50vw,
          560px
        "
        className="
          object-cover
          transition-transform
          duration-500
          ease-out
          group-hover:scale-[1.035]
          motion-reduce:transition-none
        "
      />

      <div
        className="
          pointer-events-none
          absolute
          inset-0
          bg-linear-to-t
          from-[#3e3a3a]/22
          via-transparent
          to-transparent
        "
        aria-hidden="true"
      />
    </div>
  );
}

type EmptyCommunityStateProps = {
  saunaId: string;
};

function EmptyCommunityState({
  saunaId,
}: EmptyCommunityStateProps) {
  return (
    <div
      className="
        relative
        mt-8
        overflow-hidden
        rounded-[1.75rem]
        border
        border-dashed
        border-[#3e3a3a]/15
        bg-linear-to-br
        from-[#e6e5ef]/30
        via-white/70
        to-[#9fd9f6]/10
        px-6
        py-12
        text-center
        sm:px-10
        sm:py-14
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          left-1/2
          top-0
          size-52
          -translate-x-1/2
          -translate-y-1/2
          rounded-full
          bg-[#9fd9f6]/20
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          relative
          z-10
          mx-auto
          flex
          size-16
          items-center
          justify-center
          rounded-full
          border
          border-white/80
          bg-white/85
          text-[#3e3a3a]/50
          shadow-sm
          backdrop-blur-md
        "
        aria-hidden="true"
      >
        <BookOpen
          className="size-6"
          strokeWidth={1.7}
        />
      </div>

      <p
        className="
          relative
          z-10
          mt-5
          text-lg
          font-semibold
          tracking-[-0.02em]
          text-[#3e3a3a]
        "
      >
        この施設の投稿はまだありません
      </p>

      <p
        className="
          relative
          z-10
          mx-auto
          mt-2
          max-w-md
          text-sm
          leading-7
          text-[#3e3a3a]/55
        "
      >
        この施設を訪れたら、写真や感想を記録して、
        最初のサ活をTOTONOに残してみましょう。
      </p>

      <Link
        href={`/posts/new?sauna_id=${saunaId}`}
        className="
          relative
          z-10
          mt-7
          inline-flex
          min-h-12
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
          shadow-[0_10px_24px_rgba(62,58,58,0.16)]
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-[#3e3a3a]/88
          hover:shadow-[0_14px_30px_rgba(62,58,58,0.2)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        <PenLine
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        この施設で投稿する
      </Link>
    </div>
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
