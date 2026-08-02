"use client";

import {
  Bookmark,
  Compass,
  Sparkles,
  Users,
  type LucideIcon,
} from "lucide-react";
import {
  useEffect,
  useState,
} from "react";

type HomeSectionId =
  | "home-today"
  | "home-discover"
  | "home-community"
  | "home-saved";

type HomeNavigationItem = {
  label: string;
  targetId: HomeSectionId;
  icon: LucideIcon;
};

const NAVIGATION_ITEMS: HomeNavigationItem[] = [
  {
    label: "今日",
    targetId: "home-today",
    icon: Sparkles,
  },
  {
    label: "見つける",
    targetId: "home-discover",
    icon: Compass,
  },
  {
    label: "みんな",
    targetId: "home-community",
    icon: Users,
  },
  {
    label: "保存",
    targetId: "home-saved",
    icon: Bookmark,
  },
];

export function HomeMobileNavigation() {
  const [
    activeSectionId,
    setActiveSectionId,
  ] = useState<HomeSectionId>(
    "home-today"
  );

  useEffect(() => {
    const sectionElements =
      NAVIGATION_ITEMS.map(
        (item) =>
          document.getElementById(
            item.targetId
          )
      ).filter(
        (
          element
        ): element is HTMLElement =>
          element !== null
      );

    if (
      sectionElements.length === 0
    ) {
      return;
    }

    if (
      !(
        "IntersectionObserver" in
        window
      )
    ) {
      return;
    }

    const visibleSections =
      new Map<
        HomeSectionId,
        number
      >();

    const observer =
      new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            const sectionId =
              entry.target
                .id as HomeSectionId;

            if (entry.isIntersecting) {
              visibleSections.set(
                sectionId,
                entry.intersectionRatio
              );
            } else {
              visibleSections.delete(
                sectionId
              );
            }
          }

          const mostVisibleSection =
            Array.from(
              visibleSections.entries()
            ).sort(
              (
                [, firstRatio],
                [, secondRatio]
              ) =>
                secondRatio -
                firstRatio
            )[0];

          if (mostVisibleSection) {
            setActiveSectionId(
              mostVisibleSection[0]
            );
          }
        },
        {
          root: null,
          rootMargin:
            "-136px 0px -55% 0px",
          threshold: [
            0,
            0.1,
            0.25,
            0.5,
            0.75,
          ],
        }
      );

    for (const element of sectionElements) {
      observer.observe(element);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  const handleNavigate = (
    targetId: HomeSectionId
  ) => {
    const target =
      document.getElementById(
        targetId
      );

    if (!target) {
      return;
    }

    setActiveSectionId(targetId);

    const prefersReducedMotion =
      window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

    target.scrollIntoView({
      behavior: prefersReducedMotion
        ? "auto"
        : "smooth",
      block: "start",
    });
  };

  return (
    <nav
      aria-label="ホーム内メニュー"
      className="
        sticky
        top-16
        z-30
        -mx-4
        border-y
        border-border/45
        bg-background/85
        px-4
        py-3
        backdrop-blur-xl
        sm:-mx-6
        sm:px-6
        lg:hidden
      "
    >
      <div
        className="
          mx-auto
          grid
          max-w-md
          grid-cols-4
          gap-2
        "
      >
        {NAVIGATION_ITEMS.map(
          (item) => {
            const Icon = item.icon;

            const isActive =
              activeSectionId ===
              item.targetId;

            return (
              <button
                key={item.targetId}
                type="button"
                aria-current={
                  isActive
                    ? "location"
                    : undefined
                }
                onClick={() =>
                  handleNavigate(
                    item.targetId
                  )
                }
                className={`
                  group
                  flex
                  min-h-14
                  flex-col
                  items-center
                  justify-center
                  gap-1.5
                  rounded-2xl
                  border
                  px-2
                  py-2
                  text-xs
                  font-semibold
                  transition
                  duration-200
                  active:scale-[0.98]
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-ring
                  focus-visible:ring-offset-2
                  focus-visible:ring-offset-background
                  ${
                    isActive
                      ? `
                        border-border/60
                        bg-card
                        text-foreground
                        shadow-sm
                      `
                      : `
                        border-transparent
                        text-muted-foreground
                        hover:border-border/60
                        hover:bg-card/70
                        hover:text-foreground
                      `
                  }
                `}
              >
                <span
                  className={`
                    flex
                    size-7
                    items-center
                    justify-center
                    rounded-full
                    transition
                    duration-200
                    ${
                      isActive
                        ? `
                          bg-accent/25
                          text-foreground
                        `
                        : `
                          bg-transparent
                          text-current
                          group-hover:-translate-y-0.5
                        `
                    }
                  `}
                >
                  <Icon
                    className="size-4"
                    strokeWidth={
                      isActive
                        ? 2
                        : 1.8
                    }
                    aria-hidden="true"
                  />
                </span>

                <span>
                  {item.label}
                </span>
              </button>
            );
          }
        )}
      </div>
    </nav>
  );
}
