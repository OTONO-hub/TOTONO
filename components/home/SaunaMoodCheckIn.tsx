"use client";

import Link from "next/link";
import {
  ArrowRight,
  Check,
  Coffee,
  Compass,
  Leaf,
  Sparkles,
  Waves,
  type LucideIcon,
} from "lucide-react";

import {
  useEffect,
  useState,
} from "react";

type SaunaMoodId =
  | "deep-relax"
  | "quiet-rest"
  | "new-discovery"
  | "sauna-food";

type SaunaMood = {
  id: SaunaMoodId;
  label: string;
  description: string;
  searchLabel: string;
  searchHref: string;
  icon: LucideIcon;
};

const STORAGE_KEY =
  "totono-today-sauna-mood";

const SAUNA_MOODS: SaunaMood[] = [
  {
    id: "deep-relax",
    label: "しっかり整いたい",
    description:
      "サウナ・水風呂・外気浴を楽しめる施設を探します。",
    searchLabel:
      "外気浴のある施設を探す",
    searchHref:
      "/search?features=sauna&features=cold-bath&features=outdoor",
    icon: Waves,
  },
  {
    id: "quiet-rest",
    label: "静かに休みたい",
    description:
      "休憩スペースのある施設で、ゆっくり過ごしましょう。",
    searchLabel:
      "休憩できる施設を探す",
    searchHref:
      "/search?features=rest-area",
    icon: Leaf,
  },
  {
    id: "new-discovery",
    label: "新しい施設へ行きたい",
    description:
      "まだ知らないサウナとの出会いを探します。",
    searchLabel:
      "新しい施設を探す",
    searchHref: "/search",
    icon: Compass,
  },
  {
    id: "sauna-food",
    label: "サ飯まで楽しみたい",
    description:
      "レストランのある施設で、サウナ後の時間も楽しみます。",
    searchLabel:
      "サ飯を楽しめる施設を探す",
    searchHref:
      "/search?features=restaurant",
    icon: Coffee,
  },
];

export function SaunaMoodCheckIn() {
  const [
    selectedMoodId,
    setSelectedMoodId,
  ] = useState<SaunaMoodId | null>(
    null
  );

  const [isReady, setIsReady] =
    useState(false);

  useEffect(() => {
    const timeoutId = window.setTimeout(
      () => {
        const savedMood =
          readSavedMood();

        setSelectedMoodId(savedMood);
        setIsReady(true);
      },
      0
    );

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, []);

  const selectedMood =
    SAUNA_MOODS.find(
      (mood) =>
        mood.id === selectedMoodId
    ) ?? null;

  const handleSelectMood = (
    moodId: SaunaMoodId
  ) => {
    setSelectedMoodId(moodId);

    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        moodId
      );
    } catch {
      // localStorageを利用できない環境でも、
      // 画面上の選択状態はそのまま維持します。
    }
  };

  return (
    <section
      aria-labelledby="sauna-mood-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-4
          border-b
          border-border/50
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
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
                size-10
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Sparkles
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.24em]
                text-muted-foreground
              "
            >
              Today&apos;s Mood
            </p>
          </div>

          <h2
            id="sauna-mood-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            今日のサウナ気分は？
          </h2>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            今の気分を選ぶと、過ごし方に合った
            サウナ施設を探せます。
          </p>
        </div>

        {isReady && selectedMood ? (
          <div
            className="
              inline-flex
              w-fit
              items-center
              gap-2
              rounded-full
              bg-success/10
              px-4
              py-2
              text-xs
              font-semibold
              text-foreground
            "
          >
            <Check
              className="size-3.5"
              strokeWidth={2}
              aria-hidden="true"
            />

            今日の気分を選択済み
          </div>
        ) : null}
      </div>

      <div
        className="
          grid
          gap-3
          p-5
          sm:grid-cols-2
          sm:p-8
        "
      >
        {SAUNA_MOODS.map((mood) => {
          const Icon = mood.icon;

          const isSelected =
            selectedMoodId === mood.id;

          return (
            <button
              key={mood.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() =>
                handleSelectMood(mood.id)
              }
              className={`
                group
                relative
                flex
                min-h-32
                w-full
                items-start
                gap-4
                overflow-hidden
                rounded-[1.5rem]
                border
                p-5
                text-left
                transition
                duration-200
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                ${
                  isSelected
                    ? `
                      border-primary/30
                      bg-primary
                      text-primary-foreground
                      shadow-md
                    `
                    : `
                      border-border/55
                      bg-background/70
                      text-foreground
                      hover:-translate-y-0.5
                      hover:border-border
                      hover:bg-background
                      hover:shadow-sm
                    `
                }
              `}
            >
              <span
                className={`
                  flex
                  size-11
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  transition
                  duration-200
                  ${
                    isSelected
                      ? `
                        bg-white/15
                        text-primary-foreground
                      `
                      : `
                        bg-secondary/20
                        text-foreground
                        group-hover:bg-secondary/30
                      `
                  }
                `}
              >
                <Icon
                  className="size-5"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </span>

              <span className="min-w-0">
                <span
                  className="
                    flex
                    items-center
                    gap-2
                  "
                >
                  <span
                    className="
                      text-base
                      font-semibold
                      tracking-[-0.02em]
                    "
                  >
                    {mood.label}
                  </span>

                  {isSelected ? (
                    <span
                      className="
                        flex
                        size-5
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-primary
                      "
                    >
                      <Check
                        className="size-3"
                        strokeWidth={2.4}
                        aria-hidden="true"
                      />
                    </span>
                  ) : null}
                </span>

                <span
                  className={`
                    mt-2
                    block
                    text-sm
                    leading-6
                    ${
                      isSelected
                        ? "text-primary-foreground/70"
                        : "text-muted-foreground"
                    }
                  `}
                >
                  {mood.description}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      <div
        className="
          border-t
          border-border/50
          px-5
          py-5
          sm:px-8
        "
      >
        {isReady && selectedMood ? (
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
            <div>
              <p
                className="
                  text-xs
                  font-semibold
                  text-muted-foreground
                "
              >
                選択した気分
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                {selectedMood.label}
              </p>
            </div>

            <Link
              href={
                selectedMood.searchHref
              }
              className="
                inline-flex
                min-h-11
                w-full
                items-center
                justify-center
                gap-2
                rounded-full
                bg-primary
                px-5
                text-sm
                font-semibold
                text-primary-foreground
                shadow-sm
                transition
                duration-200
                hover:-translate-y-0.5
                hover:shadow-md
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
                active:translate-y-0
                sm:w-auto
              "
            >
              {selectedMood.searchLabel}

              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </Link>
          </div>
        ) : (
          <p
            className="
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            4つの中から、今の気分に近いものを
            ひとつ選んでください。
          </p>
        )}
      </div>
    </section>
  );
}

function readSavedMood():
  | SaunaMoodId
  | null {
  try {
    const savedMood =
      window.localStorage.getItem(
        STORAGE_KEY
      );

    if (isSaunaMoodId(savedMood)) {
      return savedMood;
    }
  } catch {
    return null;
  }

  return null;
}

function isSaunaMoodId(
  value: string | null
): value is SaunaMoodId {
  return SAUNA_MOODS.some(
    (mood) => mood.id === value
  );
}
