import {
  Building2,
  FileText,
  Search,
} from "lucide-react";

type DiscoverSectionNavigationProps = {
  saunaCount: number;
  postCount: number;
  showPostResults: boolean;
};

export function DiscoverSectionNavigation({
  saunaCount,
  postCount,
  showPostResults,
}: DiscoverSectionNavigationProps) {
  return (
    <nav
      aria-label="検索結果内ナビゲーション"
      className="
        sticky
        top-24
        z-30
        mt-6
        overflow-x-auto
        rounded-[1.5rem]
        border border-border/55
        bg-card/90
        p-2
        shadow-md
        backdrop-blur-xl
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
        <a
          href="#discover-search"
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
            transition
            hover:bg-background
            hover:text-foreground
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
          "
        >
          <Search
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          検索条件
        </a>

        <a
          href="#sauna-results"
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
            transition
            hover:bg-background
            hover:text-foreground
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
          "
        >
          <Building2
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          施設

          <span
            className="
              rounded-full
              bg-muted
              px-2
              py-0.5
              text-[0.6875rem]
              font-semibold
              text-muted-foreground
            "
          >
            {saunaCount}
          </span>
        </a>

        {showPostResults ? (
          <a
            href="#post-results"
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
              transition
              hover:bg-background
              hover:text-foreground
              active:scale-[0.98]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
            "
          >
            <FileText
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            みんなのサ活

            <span
              className="
                rounded-full
                bg-muted
                px-2
                py-0.5
                text-[0.6875rem]
                font-semibold
                text-muted-foreground
              "
            >
              {postCount}
            </span>
          </a>
        ) : null}
      </div>
    </nav>
  );
}
