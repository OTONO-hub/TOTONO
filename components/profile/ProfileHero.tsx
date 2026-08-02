import Link from "next/link";
import {
  CalendarDays,
  Edit3,
  PenLine,
} from "lucide-react";

import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ProfileHeroProps = {
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  memberSince: string;
  postCount: number;
  followingCount: number;
  followerCount: number;
};

export function ProfileHero({
  username,
  avatarUrl,
  bio,
  memberSince,
  postCount,
  followingCount,
  followerCount,
}: ProfileHeroProps) {
  const displayName =
    username?.trim() || "ユーザー";

  const normalizedBio =
    bio?.trim() || null;

  const normalizedPostCount =
    normalizeMetricValue(postCount);

  const normalizedFollowingCount =
    normalizeMetricValue(followingCount);

  const normalizedFollowerCount =
    normalizeMetricValue(followerCount);

  return (
    <section
      aria-labelledby="profile-heading"
      className="
        relative
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:rounded-[2.5rem]
      "
    >
      <div
        className="
          relative
          h-32
          overflow-hidden
          border-b
          border-border/40
          bg-linear-to-br
          from-secondary/30
          via-background
          to-accent/15
          sm:h-40
        "
      >
        <div
          aria-hidden="true"
          className="
            absolute
            -right-12
            -top-20
            size-64
            rounded-full
            bg-secondary/35
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            -bottom-24
            left-12
            size-52
            rounded-full
            bg-accent/20
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            absolute
            inset-0
            text-foreground
            opacity-[0.16]
            [background-image:radial-gradient(circle_at_center,currentColor_1px,transparent_1px)]
            [background-size:24px_24px]
          "
        />

        <p
          aria-hidden="true"
          className="
            absolute
            right-6
            top-6
            text-[0.625rem]
            font-semibold
            uppercase
            tracking-[0.3em]
            text-muted-foreground/70
            sm:right-8
            sm:top-8
          "
        >
          My Sauna Lounge
        </p>
      </div>

      <div
        className="
          px-5
          pb-7
          sm:px-8
          sm:pb-9
          lg:px-10
        "
      >
        <div
          className="
            -mt-14
            flex
            flex-col
            gap-6
            sm:-mt-16
            lg:flex-row
            lg:items-end
            lg:justify-between
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-col
              items-center
              gap-5
              text-center
              sm:flex-row
              sm:items-end
              sm:text-left
            "
          >
            <div
              className="
                shrink-0
                rounded-full
                border-4
                border-card
                bg-card
                p-1
                shadow-lg
              "
            >
              <ProfileAvatar
                avatarUrl={avatarUrl}
                username={displayName}
                size="xl"
              />
            </div>

            <div className="min-w-0 pb-1">
              <div
                className="
                  flex
                  flex-wrap
                  items-center
                  justify-center
                  gap-2
                  sm:justify-start
                "
              >
                <p
                  className="
                    text-[0.6875rem]
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    text-muted-foreground
                  "
                >
                  TOTONO Member
                </p>

                <span
                  aria-label={`サ活の投稿数、${normalizedPostCount}件`}
                  className="
                    inline-flex
                    items-center
                    gap-1.5
                    rounded-full
                    bg-accent/15
                    px-2.5
                    py-1
                    text-[0.625rem]
                    font-semibold
                    text-foreground
                  "
                >
                  <PenLine
                    aria-hidden="true"
                    className="size-3"
                    strokeWidth={1.8}
                  />

                  <span aria-hidden="true">
                    {normalizedPostCount} Journal
                  </span>
                </span>
              </div>

              <h1
                id="profile-heading"
                className="
                  mt-2
                  wrap-break-word
                  text-3xl
                  font-semibold
                  tracking-[-0.04em]
                  text-foreground
                  sm:text-4xl
                "
              >
                @{displayName}
              </h1>
            </div>
          </div>

          <Link
            href="/profile/edit"
            aria-label={`${displayName}のプロフィールを編集`}
            className={cn(
              buttonVariants({
                variant: "totonoOutline",
                size: "lg",
              }),
              `
                w-full
                px-5
                sm:w-auto
              `
            )}
          >
            <Edit3
              aria-hidden="true"
              className="size-4"
              strokeWidth={1.8}
              data-icon="inline-start"
            />

            プロフィール編集
          </Link>
        </div>

        <div
          className="
            mt-7
            grid
            gap-7
            border-t
            border-border/45
            pt-7
            lg:grid-cols-[minmax(0,1fr)_auto]
            lg:items-end
          "
        >
          <div className="max-w-2xl">
            <p
              className="
                text-[0.6875rem]
                font-semibold
                uppercase
                tracking-[0.18em]
                text-muted-foreground
              "
            >
              About
            </p>

            <p
              className="
                mt-3
                whitespace-pre-wrap
                wrap-break-word
                text-sm
                leading-7
                text-foreground/80
                sm:text-base
                sm:leading-8
              "
            >
              {normalizedBio ??
                "自己紹介はまだありません。プロフィール編集から、好きなサウナやサ活について書いてみましょう。"}
            </p>

            <div
              className="
                mt-4
                flex
                items-center
                gap-2
                text-xs
                text-muted-foreground
              "
            >
              <CalendarDays
                aria-hidden="true"
                className="size-3.5"
                strokeWidth={1.7}
              />

              <span>
                {memberSince}から利用
              </span>
            </div>
          </div>

          <dl
            aria-label={`${displayName}のプロフィール統計`}
            className="
              grid
              grid-cols-3
              overflow-hidden
              rounded-2xl
              border
              border-border/50
              bg-background/45
              shadow-sm
            "
          >
            <ProfileMetric
              label="投稿"
              value={normalizedPostCount}
            />

            <ProfileMetric
              label="フォロー"
              value={normalizedFollowingCount}
              bordered
            />

            <ProfileMetric
              label="フォロワー"
              value={normalizedFollowerCount}
            />
          </dl>
        </div>
      </div>
    </section>
  );
}

type ProfileMetricProps = {
  label: string;
  value: number;
  bordered?: boolean;
};

function ProfileMetric({
  label,
  value,
  bordered = false,
}: ProfileMetricProps) {
  return (
    <div
      className={cn(
        `
          min-w-0
          px-3
          py-4
          text-center
          sm:px-6
        `,
        bordered &&
          "border-x border-border/45"
      )}
    >
      <dt
        className="
          truncate
          text-[0.6875rem]
          font-medium
          text-muted-foreground
        "
      >
        {label}
      </dt>

      <dd
        className="
          mt-1
          truncate
          text-xl
          font-semibold
          tabular-nums
          text-foreground
        "
      >
        {value.toLocaleString("ja-JP")}
      </dd>
    </div>
  );
}

function normalizeMetricValue(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value)
  );
}
