import {
  BarChart3,
  Building2,
  CalendarDays,
  Clock3,
  LayoutDashboard,
} from "lucide-react";

const navigationItems = [
  {
    href: "#journal-overview",
    label: "概要",
    icon: LayoutDashboard,
  },
  {
    href: "#journal-calendar",
    label: "カレンダー",
    icon: CalendarDays,
  },
  {
    href: "#recent-journal-entries",
    label: "最近の記録",
    icon: Clock3,
  },
  {
    href: "#favorite-saunas",
    label: "施設",
    icon: Building2,
  },
  {
    href: "#journal-insights",
    label: "分析",
    icon: BarChart3,
  },
];

export function JournalSectionNavigation() {
  return (
    <nav
      aria-label="Journal内ナビゲーション"
      className="
        overflow-x-auto
        rounded-[1.5rem]
        border border-border/55
        bg-card/90
        p-2
        shadow-md
        backdrop-blur-md
        [scrollbar-width:none]
        [&::-webkit-scrollbar]:hidden
      "
    >
      <div
        className="
          flex
          min-w-max
          items-center
          gap-1
        "
      >
        {navigationItems.map(
          ({ href, label, icon: Icon }) => (
            <a
              key={href}
              href={href}
              className="
                inline-flex
                min-h-11
                items-center
                gap-2
                rounded-[1rem]
                px-4
                text-sm
                font-medium
                text-muted-foreground
                transition-colors
                hover:bg-background
                hover:text-foreground
                active:scale-[0.98]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                motion-safe:transition-transform
              "
            >
              <Icon
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              {label}
            </a>
          )
        )}
      </div>
    </nav>
  );
}
