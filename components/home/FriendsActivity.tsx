import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Images,
  Sparkles,
  Star,
  Users,
} from "lucide-react";

type ActivityProfile = {
  username?: string | null;
  avatar_url?: string | null;
};

export type FriendsActivityPost = {
  id: string;
  user_id: string;
  sauna_name: string;
  visit_date?: string | null;
  rating: number;
  image_url?: string | null;
  image_count?: number;
  created_at: string;

  /**
   * 投稿取得処理によって、プロフィール情報が
   * profileまたはprofilesに格納されている場合に対応します。
   */
  profile?: ActivityProfile | null;
  profiles?: ActivityProfile | null;
};

type FriendsActivityProps = {
  posts: FriendsActivityPost[];
};

const DISPLAY_LIMIT = 5;

export function FriendsActivity({
  posts,
}: FriendsActivityProps) {
  const recentPosts = posts.slice(
    0,
    DISPLAY_LIMIT
  );

  return (
    <section
      aria-labelledby="friends-activity-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-border/50
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
        "
      >
        <div>
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
                bg-secondary/20
                text-foreground
              "
            >
              <Users
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
                tracking-[0.24em]
                text-muted-foreground
              "
            >
              Community
            </p>
          </div>

          <h2
            id="friends-activity-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            みんなのサ活
          </h2>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            コミュニティで生まれた、
            最近のサウナ時間をのぞいてみましょう。
          </p>
        </div>

        {recentPosts.length > 0 ? (
          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              bg-accent/15
              px-4
              py-2
              text-xs
              font-semibold
              text-foreground
            "
          >
            <Sparkles
              className="size-3.5"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            最近の{recentPosts.length}件
          </div>
        ) : null}
      </div>

      {recentPosts.length > 0 ? (
        <>
          <div
            className="
              grid
              gap-4
              p-5
              sm:p-8
              lg:grid-cols-2
            "
          >
            {recentPosts.map(
              (post, index) => (
                <ActivityCard
                  key={post.id}
                  post={post}
                  isFeatured={
                    index === 0
                  }
                />
              )
            )}
          </div>

          <div
            className="
              border-t
              border-border/50
              px-5
              py-5
              sm:px-8
            "
          >
            <Link
              href="/community"
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                border
                border-border/70
                bg-background/70
                px-5
                text-sm
                font-semibold
                text-foreground
                transition
                duration-200
                hover:-translate-y-0.5
                hover:border-border
                hover:bg-background
                hover:shadow-sm
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                active:translate-y-0
                sm:w-auto
              "
            >
              もっと見る

              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </Link>
          </div>
        </>
      ) : (
        <EmptyActivity />
      )}
    </section>
  );
}

type ActivityCardProps = {
  post: FriendsActivityPost;
  isFeatured: boolean;
};

function ActivityCard({
  post,
  isFeatured,
}: ActivityCardProps) {
  const profile =
    post.profile ??
    post.profiles ??
    null;

  const username =
    profile?.username?.trim() ||
    "TOTONOユーザー";

  const avatarUrl =
    profile?.avatar_url || null;

  const initial =
    getInitial(username);

  return (
    <article
      className={`
        group
        overflow-hidden
        rounded-[1.5rem]
        border
        border-border/55
        bg-background/65
        transition
        duration-200
        hover:-translate-y-0.5
        hover:border-border
        hover:bg-background
        hover:shadow-md
        ${
          isFeatured
            ? "lg:row-span-2"
            : ""
        }
      `}
    >
      {post.image_url ? (
        <Link
          href={`/posts/${post.id}`}
          className="
            relative
            block
            aspect-[16/10]
            overflow-hidden
            bg-muted
          "
        >
          <Image
            src={post.image_url}
            alt={`${post.sauna_name}のサ活写真`}
            fill
            sizes={
              isFeatured
                ? `
                  (max-width: 1024px) 100vw,
                  50vw
                `
                : `
                  (max-width: 1024px) 100vw,
                  50vw
                `
            }
            className="
              object-cover
              transition
              duration-500
              group-hover:scale-[1.03]
            "
          />

          <div
            className="
              absolute
              inset-x-0
              bottom-0
              h-20
              bg-gradient-to-t
              from-black/35
              to-transparent
            "
          />

          {(post.image_count ?? 0) > 1 ? (
            <span
              className="
                absolute
                right-3
                top-3
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-black/65
                px-3
                py-1.5
                text-xs
                font-semibold
                tabular-nums
                text-white
                shadow-sm
                backdrop-blur-sm
              "
              aria-label={`${post.image_count}枚の画像`}
            >
              <Images
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {post.image_count}
            </span>
          ) : null}
        </Link>
      ) : null}

      <div
        className="
          p-5
          sm:p-6
        "
      >
        <div
          className="
            flex
            items-center
            gap-3
          "
        >
          <Link
            href={`/users/${post.user_id}`}
            aria-label={`${username}のプロフィールを見る`}
            className="
              relative
              flex
              size-11
              shrink-0
              items-center
              justify-center
              overflow-hidden
              rounded-full
              border
              border-border/60
              bg-card
              text-sm
              font-semibold
              text-foreground
              transition
              hover:border-border
              hover:shadow-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
            "
          >
            {avatarUrl ? (
              <Image
                src={avatarUrl}
                alt=""
                fill
                sizes="44px"
                className="object-cover"
              />
            ) : (
              <span aria-hidden="true">
                {initial}
              </span>
            )}
          </Link>

          <div className="min-w-0">
            <Link
              href={`/users/${post.user_id}`}
              className="
                block
                truncate
                text-sm
                font-semibold
                text-foreground
                transition
                hover:opacity-70
              "
            >
              {username}
            </Link>

            <p
              className="
                mt-0.5
                text-xs
                text-muted-foreground
              "
            >
              {formatRelativeTime(
                post.created_at
              )}
            </p>
          </div>
        </div>

        <Link
          href={`/posts/${post.id}`}
          className="
            mt-5
            block
            rounded-xl
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
        >
          <p
            className="
              flex
              items-start
              gap-2
              text-base
              font-semibold
              leading-7
              tracking-[-0.02em]
              text-foreground
            "
          >
            <MapPin
              className="
                mt-1
                size-4
                shrink-0
                text-muted-foreground
              "
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>
              {post.sauna_name}
              <span
                className="
                  ml-1
                  font-normal
                  text-muted-foreground
                "
              >
                へ行きました
              </span>
            </span>
          </p>
        </Link>

        <div
          className="
            mt-4
            flex
            flex-wrap
            items-center
            gap-x-4
            gap-y-2
          "
        >
          <RatingDisplay
            rating={post.rating}
          />

          {post.visit_date ? (
            <div
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-muted-foreground
              "
            >
              <CalendarDays
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              <time
                dateTime={
                  post.visit_date
                }
              >
                {formatVisitDate(
                  post.visit_date
                )}
              </time>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
}

type RatingDisplayProps = {
  rating: number;
};

function RatingDisplay({
  rating,
}: RatingDisplayProps) {
  const normalizedRating =
    Math.min(
      5,
      Math.max(0, rating)
    );

  return (
    <div
      className="
        inline-flex
        items-center
        gap-1.5
      "
      aria-label={`評価 ${normalizedRating.toFixed(
        1
      )}点`}
    >
      <Star
        className="
          size-4
          fill-accent
          text-accent
        "
        strokeWidth={1.8}
        aria-hidden="true"
      />

      <span
        className="
          text-sm
          font-semibold
          text-foreground
        "
      >
        {formatRating(
          normalizedRating
        )}
      </span>
    </div>
  );
}

function EmptyActivity() {
  return (
    <div
      className="
        px-5
        py-10
        sm:px-8
        sm:py-12
      "
    >
      <div
        className="
          flex
          flex-col
          items-center
          rounded-[1.5rem]
          border
          border-dashed
          border-border
          bg-background/55
          px-6
          py-10
          text-center
        "
      >
        <span
          className="
            flex
            size-12
            items-center
            justify-center
            rounded-full
            bg-secondary/20
            text-foreground
          "
        >
          <Users
            className="size-5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <h3
          className="
            mt-5
            text-lg
            font-semibold
            tracking-[-0.02em]
            text-foreground
          "
        >
          まだサ活がありません
        </h3>

        <p
          className="
            mt-2
            max-w-md
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          最初のサウナ時間を記録して、
          TOTONOのコミュニティを始めましょう。
        </p>

        <Link
          href="/posts/new"
          className="
            mt-6
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-full
            bg-primary
            px-6
            text-sm
            font-semibold
            text-primary-foreground
            shadow-sm
            transition
            duration-200
            hover:-translate-y-0.5
            hover:shadow-md
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
            active:translate-y-0
          "
        >
          記録する

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </div>
  );
}

function getInitial(
  username: string
): string {
  const normalizedUsername =
    username.trim();

  if (!normalizedUsername) {
    return "T";
  }

  return normalizedUsername
    .slice(0, 1)
    .toUpperCase();
}

function formatRating(
  rating: number
): string {
  if (Number.isInteger(rating)) {
    return rating.toString();
  }

  return rating.toFixed(1);
}

function formatVisitDate(
  value: string
): string {
  const date = parseDate(value);

  if (!date) {
    return value;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month: "numeric",
      day: "numeric",
    }
  ).format(date);
}

function formatRelativeTime(
  value: string
): string {
  const date = new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return "";
  }

  const differenceInSeconds =
    Math.round(
      (date.getTime() -
        Date.now()) /
        1000
    );

  const absoluteSeconds =
    Math.abs(
      differenceInSeconds
    );

  const formatter =
    new Intl.RelativeTimeFormat(
      "ja-JP",
      {
        numeric: "auto",
      }
    );

  if (absoluteSeconds < 60) {
    return "たった今";
  }

  const differenceInMinutes =
    Math.round(
      differenceInSeconds / 60
    );

  if (
    Math.abs(
      differenceInMinutes
    ) < 60
  ) {
    return formatter.format(
      differenceInMinutes,
      "minute"
    );
  }

  const differenceInHours =
    Math.round(
      differenceInMinutes / 60
    );

  if (
    Math.abs(
      differenceInHours
    ) < 24
  ) {
    return formatter.format(
      differenceInHours,
      "hour"
    );
  }

  const differenceInDays =
    Math.round(
      differenceInHours / 24
    );

  if (
    Math.abs(
      differenceInDays
    ) < 7
  ) {
    return formatter.format(
      differenceInDays,
      "day"
    );
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      month: "numeric",
      day: "numeric",
    }
  ).format(date);
}

function parseDate(
  value: string
): Date | null {
  const dateOnlyPattern =
    /^\d{4}-\d{2}-\d{2}$/;

  const date = dateOnlyPattern.test(
    value
  )
    ? new Date(
        `${value}T00:00:00`
      )
    : new Date(value);

  if (
    Number.isNaN(date.getTime())
  ) {
    return null;
  }

  return date;
}
