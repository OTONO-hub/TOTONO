import Link from "next/link";
import {
  ArrowRight,
  CloudSun,
  Flame,
  LocateFixed,
  MapPin,
  MoonStar,
  Snowflake,
  Sparkles,
  Star,
  Trees,
} from "lucide-react";

type DiscoverQuickSearchesProps = {
  isLoggedIn: boolean;
};

const quickSearches = [
  {
    key: "outdoor-air",
    title: "外気浴で選ぶ",
    description:
      "風を感じながら、ゆっくり整える施設",
    href: "/search?features=outdoor_air_bath",
    icon: Trees,
    iconClassName:
      "bg-success/10 text-success",
  },
  {
    key: "cold-bath",
    title: "水風呂で選ぶ",
    description:
      "サウナ後の爽快感を重視したい日に",
    href: "/search?features=cold_bath",
    icon: Snowflake,
    iconClassName:
      "bg-secondary/25 text-foreground",
  },
  {
    key: "restaurant",
    title: "サ飯まで楽しむ",
    description:
      "整った後の食事まで満喫できる施設",
    href: "/search?features=restaurant",
    icon: Flame,
    iconClassName:
      "bg-accent/20 text-foreground",
  },
  {
    key: "rest-area",
    title: "ゆっくり休む",
    description:
      "休憩スペースで余韻まで楽しめる施設",
    href: "/search?features=rest_area",
    icon: MoonStar,
    iconClassName:
      "bg-primary/8 text-foreground",
  },
];

const prefectureSearches = [
  {
    label: "東京都",
    href: "/search?prefecture=東京都",
  },
  {
    label: "神奈川県",
    href: "/search?prefecture=神奈川県",
  },
  {
    label: "埼玉県",
    href: "/search?prefecture=埼玉県",
  },
  {
    label: "千葉県",
    href: "/search?prefecture=千葉県",
  },
  {
    label: "大阪府",
    href: "/search?prefecture=大阪府",
  },
  {
    label: "京都府",
    href: "/search?prefecture=京都府",
  },
];

export function DiscoverQuickSearches({
  isLoggedIn,
}: DiscoverQuickSearchesProps) {
  return (
    <section
      aria-labelledby="discover-quick-searches-heading"
      className="
        mt-8
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/85
        shadow-sm
        backdrop-blur-md
        sm:mt-10
        sm:rounded-[2.5rem]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border/45
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
          lg:px-10
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Sparkles
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.25em]
                text-muted-foreground
              "
            >
              Discover by Mood
            </p>
          </div>

          <h2
            id="discover-quick-searches-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-foreground
              sm:text-3xl
            "
          >
            今日の気分から探す
          </h2>

          <p
            className="
              mt-3
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            施設名が決まっていなくても、
            過ごし方や設備から次のサウナを見つけられます。
          </p>
        </div>

        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-2
            rounded-full
            border
            border-border/55
            bg-background/65
            px-3.5
            py-2
            text-xs
            font-semibold
            text-muted-foreground
          "
        >
          <CloudSun
            className="size-3.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          Sauna Mood
        </div>
      </div>

      <div
        className="
          grid
          gap-px
          bg-border/40
          sm:grid-cols-2
          lg:grid-cols-4
        "
      >
        {quickSearches.map(
          ({
            key,
            title,
            description,
            href,
            icon: Icon,
            iconClassName,
          }) => (
            <Link
              key={key}
              href={
                isLoggedIn
                  ? href
                  : "/login"
              }
              className="
                group
                relative
                bg-card/90
                px-5
                py-6
                transition
                duration-300
                hover:z-10
                hover:-translate-y-1
                hover:bg-card
                hover:shadow-lg
                focus-visible:z-10
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-inset
                focus-visible:ring-ring
                sm:px-6
                sm:py-7
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-4
                "
              >
                <span
                  className={`
                    flex
                    size-11
                    shrink-0
                    items-center
                    justify-center
                    rounded-2xl
                    ${iconClassName}
                  `}
                >
                  <Icon
                    className="size-5"
                    strokeWidth={1.75}
                    aria-hidden="true"
                  />
                </span>

                <ArrowRight
                  className="
                    mt-1
                    size-4
                    text-muted-foreground
                    transition
                    duration-200
                    group-hover:translate-x-1
                    group-hover:text-foreground
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </div>

              <h3
                className="
                  mt-5
                  text-base
                  font-semibold
                  tracking-[-0.02em]
                  text-foreground
                "
              >
                {title}
              </h3>

              <p
                className="
                  mt-2
                  text-xs
                  leading-6
                  text-muted-foreground
                "
              >
                {description}
              </p>
            </Link>
          )
        )}
      </div>

      <div
        className="
          border-t
          border-border/45
          px-5
          py-6
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            flex
            flex-col
            gap-4
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-9
                shrink-0
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <MapPin
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div>
              <p
                className="
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                人気のエリア
              </p>

              <p
                className="
                  mt-0.5
                  text-xs
                  text-muted-foreground
                "
              >
                都道府県からすぐに検索
              </p>
            </div>
          </div>

          <div
            className="
              flex
              flex-wrap
              gap-2
            "
          >
            {prefectureSearches.map(
              ({
                label,
                href,
              }) => (
                <Link
                  key={label}
                  href={
                    isLoggedIn
                      ? href
                      : "/login"
                  }
                  className="
                    inline-flex
                    min-h-9
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-border/55
                    bg-background/65
                    px-3.5
                    text-xs
                    font-semibold
                    text-muted-foreground
                    transition
                    duration-200
                    hover:border-border
                    hover:bg-background
                    hover:text-foreground
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-ring
                    focus-visible:ring-offset-2
                  "
                >
                  {label}
                </Link>
              )
            )}
          </div>
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
        <DiscoverPoint
          icon={LocateFixed}
          title="現在地から"
          description="近くの施設を距離順で探せます"
        />

        <DiscoverPoint
          icon={Star}
          title="評価から"
          description="利用者の評価を比較できます"
        />

        <DiscoverPoint
          icon={Flame}
          title="人気から"
          description="投稿やお気に入りを参考にできます"
        />
      </div>
    </section>
  );
}

type DiscoverPointProps = {
  icon: typeof LocateFixed;
  title: string;
  description: string;
};

function DiscoverPoint({
  icon: Icon,
  title,
  description,
}: DiscoverPointProps) {
  return (
    <div
      className="
        flex
        items-center
        gap-3
        bg-card/80
        px-5
        py-5
        sm:justify-center
      "
    >
      <span
        className="
          flex
          size-9
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-secondary/15
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
            text-xs
            font-semibold
            text-foreground
          "
        >
          {title}
        </p>

        <p
          className="
            mt-0.5
            text-[0.6875rem]
            leading-5
            text-muted-foreground
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}
