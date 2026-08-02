import type { ReactNode } from "react";
import {
  BookOpen,
  CalendarDays,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";

import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { cn } from "@/lib/utils";

type PublicProfileHeroProps = {
  username: string;
  avatarUrl: string | null;
  bio: string | null;
  memberSince: string;
  postCount: number;
  followingCount: number;
  followerCount: number;
  actions?: ReactNode;
  className?: string;
};

export function PublicProfileHero({
  username,
  avatarUrl,
  bio,
  memberSince,
  postCount,
  followingCount,
  followerCount,
  actions,
  className,
}: PublicProfileHeroProps) {
  const displayName =
    username.trim() || "TOTONOユーザー";

  const displayBio =
    bio?.trim() ||
    "まだ自己紹介は登録されていません。";

  return (
    <section
      aria-labelledby="public-profile-heading"
      className={cn(
        `
          relative
          overflow-hidden
          rounded-[2rem]
          border
          border-border/55
          bg-card/90
          shadow-sm
          backdrop-blur-md
          sm:rounded-[2.5rem]
        `,
        className
      )}
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-24
          -top-28
          size-80
          rounded-full
          bg-secondary/25
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          -bottom-36
          -left-24
          absolute
          size-72
          rounded-full
          bg-accent/12
          blur-3xl
        "
      />

      <div
        className="
          relative
          bg-linear-to-br
          from-secondary/20
          via-background/85
          to-accent/10
          px-5
          py-8
          sm:px-8
          sm:py-10
          lg:px-10
          lg:py-12
        "
      >
        <div
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_auto]
            lg:items-end
          "
        >
          <div
            className="
              flex
              min-w-0
              flex-col
              gap-6
              sm:flex-row
              sm:items-center
            "
          >
            <div
              className="
                shrink-0
                rounded-full
                border
                border-white/60
                bg-white/35
                p-1.5
                shadow-md
                backdrop-blur-md
              "
            >
              <ProfileAvatar
                avatarUrl={avatarUrl}
                username={displayName}
                size="xl"
              />
            </div>

            <div className="min-w-0">
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-border/55
                  bg-card/65
                  px-3.5
                  py-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-muted-foreground
                  shadow-sm
                "
              >
                <UserRound
                  className="
                    size-3.5
                    text-foreground
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                Sauna Member
              </div>

              <h1
                id="public-profile-heading"
                className="
                  mt-5
                  wrap-break-word
                  text-3xl
                  font-semibold
                  tracking-[-0.045em]
                  text-foreground
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                {displayName}
              </h1>

              <p
                className="
                  mt-2
                  text-sm
                  font-medium
                  text-muted-foreground
                "
              >
                @{displayName}
              </p>

              <p
                className="
                  mt-5
                  max-w-2xl
                  whitespace-pre-wrap
                  wrap-break-word
                  text-sm
                  leading-7
                  text-foreground/75
                  sm:text-base
                  sm:leading-8
                "
              >
                {displayBio}
              </p>

              <div
                className="
                  mt-5
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-medium
                  text-muted-foreground
                "
              >
                <CalendarDays
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                {memberSince}からTOTONOを利用
              </div>
            </div>
          </div>

          {actions ? (
            <div
              className="
                flex
                w-full
                flex-col
                gap-3
                sm:w-auto
                sm:flex-row
                lg:justify-end
              "
            >
              {actions}
            </div>
          ) : null}
        </div>
      </div>

      <div
        className="
          grid
          gap-px
          border-t
          border-border/45
          bg-border/40
          sm:grid-cols-3
        "
      >
        <ProfileStat
          icon={BookOpen}
          label="サ活"
          value={postCount}
          suffix="件"
        />

        <ProfileStat
          icon={Users}
          label="フォロー"
          value={followingCount}
          suffix="人"
        />

        <ProfileStat
          icon={Sparkles}
          label="フォロワー"
          value={followerCount}
          suffix="人"
        />
      </div>
    </section>
  );
}

type ProfileStatProps = {
  icon: typeof BookOpen;
  label: string;
  value: number;
  suffix: string;
};

function ProfileStat({
  icon: Icon,
  label,
  value,
  suffix,
}: ProfileStatProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-4
        bg-card/80
        px-5
        py-5
        sm:justify-center
        sm:px-6
        sm:py-6
      "
    >
      <span
        className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-secondary/20
          text-foreground
        "
      >
        <Icon
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </span>

      <div>
        <p
          className="
            text-[0.625rem]
            font-semibold
            uppercase
            tracking-[0.18em]
            text-muted-foreground
          "
        >
          {label}
        </p>

        <p
          className="
            mt-1
            text-xl
            font-semibold
            tracking-[-0.03em]
            text-foreground
          "
        >
          {value.toLocaleString("ja-JP")}

          <span
            className="
              ml-1
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            {suffix}
          </span>
        </p>
      </div>
    </div>
  );
}
