"use client";

import {
  useEffect,
  useRef,
  useState,
  type ComponentType,
  type SVGProps,
} from "react";
import {
  BookOpen,
  MapPin,
  Sparkles,
  Star,
} from "lucide-react";

type SectionId =
  | "sauna-facilities"
  | "sauna-ratings"
  | "sauna-access"
  | "sauna-community";

type NavigationItem = {
  id: SectionId;
  label: string;
  icon: ComponentType<SVGProps<SVGSVGElement>>;
};

const navigationItems: NavigationItem[] = [
  {
    id: "sauna-facilities",
    label: "設備",
    icon: Sparkles,
  },
  {
    id: "sauna-ratings",
    label: "評価",
    icon: Star,
  },
  {
    id: "sauna-access",
    label: "アクセス",
    icon: MapPin,
  },
  {
    id: "sauna-community",
    label: "サ活",
    icon: BookOpen,
  },
];

export function SaunaDetailSectionNav() {
  const [activeSection, setActiveSection] =
    useState<SectionId>("sauna-facilities");

  const navigationRef =
    useRef<HTMLElement | null>(null);

  useEffect(() => {
    const sectionElements = navigationItems
      .map((item) =>
        document.getElementById(item.id)
      )
      .filter(
        (
          element
        ): element is HTMLElement =>
          element instanceof HTMLElement
      );

    if (sectionElements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (firstEntry, secondEntry) =>
              secondEntry.intersectionRatio -
              firstEntry.intersectionRatio
          );

        const mostVisibleEntry =
          visibleEntries[0];

        if (!mostVisibleEntry) {
          return;
        }

        const sectionId =
          mostVisibleEntry.target.id as SectionId;

        setActiveSection(sectionId);
      },
      {
        root: null,
        rootMargin: "-24% 0px -58% 0px",
        threshold: [
          0,
          0.1,
          0.25,
          0.5,
          0.75,
          1,
        ],
      }
    );

    sectionElements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  useEffect(() => {
    const activeLink =
      navigationRef.current?.querySelector<
        HTMLAnchorElement
      >(
        `[data-section-id="${activeSection}"]`
      );

    activeLink?.scrollIntoView({
      behavior: "smooth",
      block: "nearest",
      inline: "center",
    });
  }, [activeSection]);

  const handleNavigationClick = (
    sectionId: SectionId
  ) => {
    setActiveSection(sectionId);
  };

  return (
    <div
      className="
        sticky
        top-20
        z-30
        mt-5
        sm:mt-6
      "
    >
      <nav
        ref={navigationRef}
        aria-label="施設詳細ページ内メニュー"
        className="
          overflow-x-auto
          rounded-[1.4rem]
          border
          border-white/75
          bg-white/82
          p-2
          shadow-[0_12px_32px_rgba(62,58,58,0.08)]
          backdrop-blur-xl
          [scrollbar-width:none]
          [&::-webkit-scrollbar]:hidden
        "
      >
        <ul
          className="
            grid
            min-w-[25rem]
            grid-cols-4
            gap-1.5
            sm:min-w-0
          "
        >
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const isActive =
              activeSection === item.id;

            return (
              <li key={item.id}>
                <a
                  href={`#${item.id}`}
                  data-section-id={item.id}
                  aria-current={
                    isActive ? "location" : undefined
                  }
                  onClick={() =>
                    handleNavigationClick(item.id)
                  }
                  className={`
                    group
                    relative
                    flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    overflow-hidden
                    rounded-[1rem]
                    px-3
                    py-2.5
                    text-sm
                    font-medium
                    transition-all
                    duration-200
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#3e3a3a]
                    focus-visible:ring-offset-2
                    motion-reduce:transition-none
                    ${
                      isActive
                        ? `
                          bg-[#3e3a3a]
                          text-white
                          shadow-[0_8px_20px_rgba(62,58,58,0.16)]
                        `
                        : `
                          text-[#3e3a3a]/60
                          hover:bg-[#e6e5ef]/55
                          hover:text-[#3e3a3a]
                        `
                    }
                  `}
                >
                  {isActive && (
                    <span
                      aria-hidden="true"
                      className="
                        pointer-events-none
                        absolute
                        inset-x-4
                        bottom-0
                        h-px
                        bg-[#fdd000]
                      "
                    />
                  )}

                  <Icon
                    className={`
                      relative
                      z-10
                      size-4
                      shrink-0
                      transition-transform
                      duration-200
                      group-hover:scale-110
                      motion-reduce:transition-none
                      ${
                        isActive
                          ? "text-[#fdd000]"
                          : ""
                      }
                    `}
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  <span className="relative z-10">
                    {item.label}
                  </span>
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
