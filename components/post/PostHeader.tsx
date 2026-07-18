import Link from "next/link";
import {
  ArrowUpRight,
  CalendarDays,
  MapPin,
} from "lucide-react";

import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import type { Post } from "@/types/post";
import type { Profile } from "@/types/profile";

type Props = {
  post: Post;
  author: Profile | null;
};

export function PostHeader({
  post,
  author,
}: Props) {
  const authorName =
    author?.username || "ユーザー";

  const formattedDate = new Date(
    `${post.visit_date}T00:00:00`
  ).toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header>
      {/* カテゴリー */}
      <div className="flex items-center gap-2">
        <span className="flex size-8 items-center justify-center rounded-full bg-secondary/25 text-foreground">
          <MapPin
            className="size-3.5"
            strokeWidth={1.8}
          />
        </span>

        <p className="text-[0.6875rem] font-semibold tracking-[0.22em] text-muted-foreground uppercase">
          Sauna visit
        </p>
      </div>

      {/* 施設名 */}
      <div className="mt-4">
        {post.sauna_id ? (
          <Link
            href={`/saunas/${post.sauna_id}`}
            className="
              group/title
              inline-flex
              max-w-full
              items-start
              gap-2
              rounded-lg
              transition-colors
              duration-200
              hover:text-primary
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-4
              focus-visible:ring-offset-card
            "
          >
            <h2 className="min-w-0 wrap-break-word text-2xl leading-tight font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
              {post.sauna_name}
            </h2>

            <ArrowUpRight
              className="
                mt-1.5
                size-4
                shrink-0
                text-muted-foreground
                transition
                duration-200
                group-hover/title:-translate-y-0.5
                group-hover/title:translate-x-0.5
                group-hover/title:text-foreground
                sm:size-[1.125rem]
              "
              strokeWidth={1.8}
            />
          </Link>
        ) : (
          <h2 className="wrap-break-word text-2xl leading-tight font-semibold tracking-[-0.035em] text-foreground sm:text-3xl">
            {post.sauna_name}
          </h2>
        )}
      </div>

      {/* 投稿者・訪問日 */}
      <div className="mt-5 flex flex-col gap-3 border-t border-border/45 pt-5 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/users/${post.user_id}`}
          className="
            group/author
            flex min-w-0
            items-center
            gap-3
            rounded-xl
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-4
            focus-visible:ring-offset-card
          "
        >
          <ProfileAvatar
            avatarUrl={author?.avatar_url ?? null}
            username={author?.username ?? null}
            size="md"
          />

          <div className="min-w-0">
            <p className="text-[0.6875rem] font-medium tracking-[0.08em] text-muted-foreground">
              POSTED BY
            </p>

            <p className="mt-0.5 truncate text-sm font-semibold text-foreground transition-colors duration-200 group-hover/author:text-primary">
              @{authorName}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-2 text-muted-foreground sm:justify-end">
          <CalendarDays
            className="size-4 shrink-0"
            strokeWidth={1.7}
          />

          <div className="sm:text-right">
            <p className="text-[0.6875rem] font-medium tracking-[0.06em]">
              訪問日
            </p>

            <time
              dateTime={post.visit_date}
              className="mt-0.5 block text-sm font-medium text-foreground/80"
            >
              {formattedDate}
            </time>
          </div>
        </div>
      </div>
    </header>
  );
}