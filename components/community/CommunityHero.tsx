import Link from "next/link";
import {
  Heart,
  MessageCircle,
  PenLine,
  Users,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type CommunityHeroProps = {
  postCount: number;
};

const communityPoints = [
  {
    icon: Heart,
    label: "共感する",
    description:
      "気になるサ活へ、静かにいいねを届ける",
  },
  {
    icon: MessageCircle,
    label: "語り合う",
    description:
      "施設や過ごし方についてコメントで交流する",
  },
  {
    icon: Users,
    label: "つながる",
    description:
      "自分に合うサウナ仲間や記録を見つける",
  },
];

export function CommunityHero({
  postCount,
}: CommunityHeroProps) {
  return (
    <section
      aria-labelledby="community-heading"
      className="
        relative
        overflow-hidden
        border-b border-border/40
        bg-background
        px-4
        py-12
        sm:px-6
        sm:py-16
        lg:px-8
        lg:py-20
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-36
          -top-24
          size-[28rem]
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -bottom-40
          -left-36
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          grid
          w-full
          max-w-6xl
          gap-10
          lg:grid-cols-[minmax(0,1fr)_22rem]
          lg:items-end
          lg:gap-14
        "
      >
        <div className="max-w-3xl">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/55
              bg-card/80
              px-3.5
              py-2
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
              shadow-sm
              backdrop-blur-md
            "
          >
            <Users
              className="size-4 text-foreground"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            Community
          </div>

          <h1
            id="community-heading"
            className="
              mt-6
              text-4xl
              font-semibold
              tracking-[-0.05em]
              text-foreground
              sm:text-5xl
              lg:text-6xl
              lg:leading-[1.08]
            "
          >
            サウナの余韻を、
            <br className="hidden sm:block" />
            みんなと分かち合う。
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            施設の感想や過ごし方から、
            次に行きたいサウナを見つける場所です。
            競うのではなく、いいねやコメントで
            静かにサウナ仲間とつながれます。
          </p>

          <div
            className="
              mt-8
              grid
              gap-3
              sm:grid-cols-3
            "
          >
            {communityPoints.map(
              ({
                icon: Icon,
                label,
                description,
              }) => (
                <div
                  key={label}
                  className="
                    rounded-[1.25rem]
                    border border-border/45
                    bg-card/65
                    p-4
                    backdrop-blur-md
                  "
                >
                  <Icon
                    className="size-4 text-foreground"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <p
                    className="
                      mt-3
                      text-sm
                      font-semibold
                      text-foreground
                    "
                  >
                    {label}
                  </p>

                  <p
                    className="
                      mt-1
                      text-xs
                      leading-5
                      text-muted-foreground
                    "
                  >
                    {description}
                  </p>
                </div>
              )
            )}
          </div>
        </div>

        <div
          className="
            rounded-[1.75rem]
            border border-border/55
            bg-card/85
            p-5
            shadow-sm
            backdrop-blur-md
          "
        >
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-muted-foreground
            "
          >
            Community Activity
          </p>

          <div
            className="
              mt-4
              flex
              items-end
              justify-between
              gap-4
            "
          >
            <div>
              <p
                className="
                  text-4xl
                  font-semibold
                  tracking-[-0.05em]
                  text-foreground
                "
              >
                {postCount}
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  text-muted-foreground
                "
              >
                公開中のサ活
              </p>
            </div>

            <span
              className="
                flex
                size-12
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <MessageCircle
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
          </div>

          <Link
            href="/posts/new"
            className={cn(
              buttonVariants({
                variant: "totono",
                size: "xl",
              }),
              "mt-6 w-full"
            )}
          >
            <PenLine
              className="size-4"
              strokeWidth={1.8}
              data-icon="inline-start"
            />

            サ活を記録する
          </Link>
        </div>
      </div>
    </section>
  );
}
