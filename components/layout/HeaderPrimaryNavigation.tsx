"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  Compass,
  House,
  UserRound,
  Users,
} from "lucide-react";

import { cn } from "@/lib/utils";

const navigationItems = [
  {
    href: "/",
    label: "Today",
    icon: House,
    matches: (pathname: string) =>
      pathname === "/",
  },
  {
    href: "/search",
    label: "Discover",
    icon: Compass,
    matches: (pathname: string) =>
      pathname === "/search" ||
      pathname.startsWith("/saunas/"),
  },
  {
    href: "/community",
    label: "Community",
    icon: Users,
    matches: (pathname: string) =>
      pathname === "/community" ||
      pathname.startsWith("/posts/") ||
      pathname.startsWith("/users/"),
  },
  {
    href: "/journal",
    label: "Journal",
    icon: BookOpen,
    matches: (pathname: string) =>
      pathname === "/journal" ||
      pathname.startsWith("/bookmarks"),
  },
  {
    href: "/profile",
    label: "Profile",
    icon: UserRound,
    matches: (pathname: string) =>
      pathname === "/profile" ||
      pathname.startsWith("/profile/"),
  },
] as const;

export function HeaderPrimaryNavigation() {
  const pathname = usePathname();

  return (
    <nav
      aria-label="メインナビゲーション"
      className="
        hidden
        min-w-0
        items-center
        rounded-full
        border border-border/55
        bg-background/45
        p-1
        xl:flex
      "
    >
      {navigationItems.map(
        ({
          href,
          label,
          icon: Icon,
          matches,
        }) => {
          const isActive = matches(pathname);

          return (
            <Link
              key={href}
              href={href}
              aria-current={
                isActive
                  ? "page"
                  : undefined
              }
              className={cn(
                `
                  group relative
                  inline-flex min-h-10
                  items-center justify-center
                  gap-2
                  rounded-full
                  px-3
                  text-sm font-medium
                  transition
                  duration-200
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-1
                  focus-visible:ring-offset-background
                `,
                isActive
                  ? `
                    bg-card
                    text-foreground
                    shadow-sm
                  `
                  : `
                    text-muted-foreground
                    hover:bg-card/75
                    hover:text-foreground
                  `
              )}
            >
              <Icon
                className={cn(
                  `
                    size-[1.125rem]
                    transition-transform
                    duration-200
                    group-hover:-translate-y-0.5
                  `,
                  isActive &&
                    "text-foreground"
                )}
                strokeWidth={
                  isActive
                    ? 2
                    : 1.75
                }
                aria-hidden="true"
              />

              <span>{label}</span>

              {isActive ? (
                <span
                  aria-hidden="true"
                  className="
                    absolute
                    -bottom-0.5
                    left-1/2
                    size-1
                    -translate-x-1/2
                    rounded-full
                    bg-accent
                  "
                />
              ) : null}
            </Link>
          );
        }
      )}
    </nav>
  );
}
