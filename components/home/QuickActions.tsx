import Link from "next/link";
import {
  ArrowUpRight,
  Heart,
  PenLine,
  Search,
  UserRound,
  type LucideIcon,
} from "lucide-react";

type QuickAction = {
  label: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

const quickActions: QuickAction[] = [
  {
    label: "探す",
    description: "今日行く施設を見つける",
    href: "/search",
    icon: Search,
  },
  {
    label: "記録する",
    description: "今日のサ活を残す",
    href: "/posts/new",
    icon: PenLine,
  },
  {
    label: "お気に入り",
    description: "保存した施設を見る",
    href: "/profile",
    icon: Heart,
  },
  {
    label: "プロフィール",
    description: "自分のサウナライフを見る",
    href: "/profile",
    icon: UserRound,
  },
];

export function QuickActions() {
  return (
    <div
      role="list"
      aria-label="よく使う操作"
      className="
        grid
        grid-cols-2
        gap-3
        lg:grid-cols-4
      "
    >
      {quickActions.map((action) => {
        const Icon = action.icon;

        return (
          <Link
            key={action.label}
            href={action.href}
            role="listitem"
            aria-label={`${action.label}。${action.description}`}
            className="
              group
              relative
              flex
              min-h-36
              min-w-0
              flex-col
              justify-between
              overflow-hidden
              rounded-[1.5rem]
              border
              border-border/50
              bg-card/75
              p-4
              shadow-sm
              transition
              duration-200
              hover:-translate-y-1
              hover:border-border
              hover:bg-card
              hover:shadow-md
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
              motion-reduce:transform-none
              motion-reduce:transition-none
              sm:min-h-40
              sm:p-5
            "
          >
            <span
              aria-hidden="true"
              className="
                pointer-events-none
                absolute
                -right-10
                -top-10
                size-28
                rounded-full
                bg-secondary/15
                blur-2xl
                transition
                duration-300
                group-hover:bg-accent/15
                motion-reduce:transition-none
              "
            />

            <div
              aria-hidden="true"
              className="
                relative
                flex
                items-start
                justify-between
                gap-3
              "
            >
              <span
                className="
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/20
                  text-foreground
                  transition
                  duration-200
                  group-hover:bg-accent/25
                  motion-reduce:transition-none
                "
              >
                <Icon
                  className="size-[1.125rem]"
                  strokeWidth={1.8}
                />
              </span>

              <ArrowUpRight
                className="
                  size-4
                  shrink-0
                  text-muted-foreground
                  transition-transform
                  duration-200
                  group-hover:-translate-y-0.5
                  group-hover:translate-x-0.5
                  group-hover:text-foreground
                  motion-reduce:transform-none
                  motion-reduce:transition-none
                "
                strokeWidth={1.8}
              />
            </div>

            <div
              aria-hidden="true"
              className="
                relative
                mt-5
                min-w-0
              "
            >
              <p
                className="
                  text-base
                  font-semibold
                  text-foreground
                "
              >
                {action.label}
              </p>

              <p
                className="
                  mt-1
                  text-xs
                  leading-5
                  text-muted-foreground
                "
              >
                {action.description}
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
