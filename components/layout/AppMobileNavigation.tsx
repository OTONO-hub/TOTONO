"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Home,
  Plus,
  Search,
  UserRound,
} from "lucide-react";

type NavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
  isPrimary?: boolean;
  matches: (pathname: string) => boolean;
};

const navigationItems: NavigationItem[] = [
  {
    label: "Today",
    href: "/",
    icon: Home,
    matches: (pathname) => pathname === "/",
  },
  {
    label: "Discover",
    href: "/search",
    icon: Search,
    matches: (pathname) =>
      pathname === "/search" ||
      pathname.startsWith("/saunas/"),
  },
  {
    label: "記録",
    href: "/posts/new",
    icon: Plus,
    isPrimary: true,
    matches: (pathname) =>
      pathname === "/posts/new",
  },
  {
    label: "Journal",
    href: "/journal",
    icon: BookOpen,
    matches: (pathname) =>
      pathname === "/journal" ||
      pathname.startsWith("/journal/") ||
      pathname === "/bookmarks" ||
      pathname.startsWith("/bookmarks/"),
  },
  {
    label: "Profile",
    href: "/profile",
    icon: UserRound,
    matches: (pathname) =>
      pathname === "/profile" ||
      pathname.startsWith("/profile/"),
  },
];

export function AppMobileNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="モバイルメインナビゲーション"
      className="
        fixed
        inset-x-0
        bottom-0
        z-50
        border-t border-border/60
        bg-background/95
        px-2
        pb-[max(0.5rem,env(safe-area-inset-bottom))]
        pt-2
        shadow-[0_-12px_40px_rgba(62,58,58,0.08)]
        backdrop-blur-xl
        md:hidden
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-lg
          grid-cols-5
          items-end
          gap-1
        "
      >
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.matches(pathname);

          if (item.isPrimary) {
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-label="サ活を記録する"
                aria-current={
                  isActive ? "page" : undefined
                }
                className="
                  group
                  -mt-6
                  flex
                  min-w-0
                  flex-col
                  items-center
                  gap-1.5
                  rounded-2xl
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-background
                "
              >
                <span
                  className={`
                    flex
                    size-14
                    items-center
                    justify-center
                    rounded-full
                    border-4
                    border-background
                    shadow-lg
                    transition
                    duration-200
                    group-active:scale-95
                    motion-reduce:transition-none
                    ${
                      isActive
                        ? "bg-foreground text-background"
                        : "bg-accent text-foreground"
                    }
                  `}
                >
                  <Icon
                    className="size-6"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                </span>

                <span
                  className="
                    truncate
                    text-[0.65rem]
                    font-semibold
                    text-foreground
                  "
                >
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={
                isActive ? "page" : undefined
              }
              className={`
                relative
                flex
                min-w-0
                flex-col
                items-center
                gap-1.5
                rounded-2xl
                px-1
                py-2
                transition-colors
                motion-reduce:transition-none
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-background
                ${
                  isActive
                    ? "text-foreground"
                    : "text-muted-foreground"
                }
              `}
            >
              <span
                className={`
                  flex
                  size-8
                  items-center
                  justify-center
                  rounded-full
                  transition-colors
                  motion-reduce:transition-none
                  ${
                    isActive
                      ? "bg-secondary/25"
                      : "bg-transparent"
                  }
                `}
              >
                <Icon
                  className="size-[1.15rem]"
                  strokeWidth={
                    isActive ? 2 : 1.7
                  }
                  aria-hidden="true"
                />
              </span>

              <span
                className="
                  max-w-full
                  truncate
                  text-[0.65rem]
                  font-medium
                "
              >
                {item.label}
              </span>

              {isActive ? (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    bottom-0
                    h-0.5
                    w-5
                    rounded-full
                    bg-foreground
                  "
                />
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
