import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Search,
  Sparkles,
  Star,
} from "lucide-react";

import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { BackgroundGlow } from "@/components/ui/background-glow";
import { PageSection } from "@/components/ui/page-section";

import type { RecommendedSauna } from "@/services/recommendations";
import type { DashboardSummary } from "@/types/dashboard";

type TodayHeroSectionProps = {
  todayLabel: string;
  greeting: string;
  heading: string;
  description: string;
  summary: DashboardSummary;
  sauna: RecommendedSauna | null;
  reason: string;
};

function createLocationText(
  sauna: RecommendedSauna
): string {
  return [sauna.prefecture, sauna.city]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .join(" ");
}

function formatRating(
  rating: number | null
): string | null {
  if (rating === null) {
    return null;
  }

  return rating.toFixed(1);
}

export function TodayHeroSection({
  todayLabel,
  greeting,
  heading,
  description,
  sauna,
  reason,
}: TodayHeroSectionProps) {
  const locationText = sauna
    ? createLocationText(sauna)
    : "";

  const ratingText = sauna
    ? formatRating(sauna.average_rating)
    : null;

  return (
    <section
      aria-labelledby="today-hero-heading"
      className="
        relative
        isolate
        overflow-hidden
        border-b
        border-border/40
        bg-background
        px-4
        pb-16
        pt-8
        sm:px-6
        sm:pb-24
        sm:pt-12
        lg:px-8
        lg:pb-28
        lg:pt-16
      "
    >
      <BackgroundGlow
        tone="secondary"
        position="top-right"
        size="lg"
        className="
          -right-40
          -top-48
          size-[34rem]
          bg-secondary/20
        "
      />

      <BackgroundGlow
        tone="accent"
        position="bottom-left"
        size="lg"
        className="
          -bottom-56
          -left-40
          size-[30rem]
        "
      />

      <PageSection
        className="
          grid
          gap-10
          lg:grid-cols-[minmax(0,1fr)_26rem]
          lg:items-center
          lg:gap-16
        "
      >
        <div className="max-w-3xl">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-border/55
              bg-card/75
              px-4
              py-2
              text-xs
              font-semibold
              text-muted-foreground
              shadow-sm
              backdrop-blur-md
            "
          >
            <CalendarDays
              aria-hidden="true"
              className="size-4 text-foreground"
              strokeWidth={1.8}
            />

            <span>{todayLabel}</span>
          </div>

          <p
            className="
              mt-9
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-muted-foreground
            "
          >
            {greeting}
          </p>

          <h1
            id="today-hero-heading"
            className="
              mt-4
              max-w-3xl
              text-4xl
              font-semibold
              leading-[1.12]
              tracking-[-0.05em]
              text-foreground
              sm:text-5xl
              lg:text-6xl
              lg:leading-[1.08]
            "
          >
            {heading}
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-base
              leading-8
              text-muted-foreground
              sm:text-lg
            "
          >
            {description}
          </p>

          {sauna ? (
            <AppCard
              variant="glass"
              radius="lg"
              padding="md"
              className="
                mt-8
                max-w-2xl
                bg-card/65
              "
            >
              <div className="flex items-start gap-4">
                <span
                  className="
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-secondary/25
                    text-foreground
                  "
                >
                  <Sparkles
                    aria-hidden="true"
                    className="size-4.5"
                    strokeWidth={1.8}
                  />
                </span>

                <div className="min-w-0">
                  <p
                    className="
                      text-xs
                      font-semibold
                      tracking-[0.08em]
                      text-muted-foreground
                    "
                  >
                    今日おすすめの理由
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-7
                      text-foreground/85
                      sm:text-base
                    "
                  >
                    {reason}
                  </p>
                </div>
              </div>
            </AppCard>
          ) : (
            <AppCard
              variant="glass"
              radius="lg"
              padding="md"
              className="
                mt-8
                max-w-2xl
                bg-card/65
              "
            >
              <div className="flex items-start gap-4">
                <span
                  className="
                    flex
                    size-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-secondary/25
                    text-foreground
                  "
                >
                  <Sparkles
                    aria-hidden="true"
                    className="size-4.5"
                    strokeWidth={1.8}
                  />
                </span>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    今日の一軒を見つけましょう
                  </p>

                  <p
                    className="
                      mt-2
                      text-sm
                      leading-7
                      text-muted-foreground
                    "
                  >
                    {reason}
                  </p>
                </div>
              </div>
            </AppCard>
          )}

          <div
            className="
              mt-8
              flex
              flex-col
              gap-3
              sm:flex-row
              sm:items-center
            "
          >
            <AppButton
              href={
                sauna
                  ? `/saunas/${sauna.id}`
                  : "/search"
              }
              size="lg"
              trailingIcon={
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              className="
                w-full
                sm:w-fit
              "
            >
              {sauna
                ? "今日の一軒を見る"
                : "今日のサウナを探す"}
            </AppButton>

            {sauna && (
              <AppButton
                href="/search"
                variant="secondary"
                size="lg"
                leadingIcon={
                  <Search
                    className="size-4"
                    strokeWidth={1.8}
                  />
                }
                className="
                  w-full
                  sm:w-fit
                "
              >
                ほかの施設を探す
              </AppButton>
            )}
          </div>
        </div>

        {sauna ? (
          <AppCard
            as="article"
            variant="glass"
            radius="xl"
            padding="none"
            interactive
            className="
              group
              bg-card/80
              p-4
              sm:p-5
            "
          >
            <Link
              href={`/saunas/${sauna.id}`}
              aria-label={`${sauna.name}の詳細を見る`}
              className="
                block
                rounded-[1.5rem]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-ring
                focus-visible:ring-offset-2
                focus-visible:ring-offset-card
              "
            >
              <div
                className="
                  relative
                  aspect-[4/5]
                  overflow-hidden
                  rounded-[1.5rem]
                  bg-[#3e3a3a]
                  sm:aspect-[16/12]
                  lg:aspect-[4/5]
                "
              >
                {sauna.image_url ? (
                  <Image
                    src={sauna.image_url}
                    alt={`${sauna.name}の施設画像`}
                    fill
                    priority
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 80vw,
                      416px
                    "
                    className="
                      object-cover
                      transition-transform
                      duration-700
                      ease-out
                      group-hover:scale-[1.03]
                      motion-reduce:transform-none
                      motion-reduce:transition-none
                    "
                  />
                ) : (
                  <div
                    className="
                      absolute
                      inset-0
                      flex
                      items-center
                      justify-center
                      bg-linear-to-br
                      from-[#3e3a3a]
                      via-[#504b4b]
                      to-[#6a6464]
                    "
                  >
                    <Sparkles
                      aria-hidden="true"
                      className="size-11 text-white/75"
                      strokeWidth={1.5}
                    />
                  </div>
                )}

                <div
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-black/75
                    via-black/10
                    to-black/5
                  "
                />

                <div
                  className="
                    absolute
                    left-4
                    top-4
                    inline-flex
                    items-center
                    gap-2
                    rounded-full
                    bg-white/90
                    px-3
                    py-2
                    text-[0.6875rem]
                    font-semibold
                    tracking-[0.12em]
                    text-[#3e3a3a]
                    shadow-sm
                    backdrop-blur-md
                  "
                >
                  <Sparkles
                    aria-hidden="true"
                    className="size-3.5"
                    strokeWidth={1.8}
                  />

                  TODAY&apos;S PICK
                </div>

                <div
                  className="
                    absolute
                    inset-x-5
                    bottom-5
                    text-white
                  "
                >
                  <h2
                    className="
                      text-2xl
                      font-semibold
                      leading-tight
                      tracking-[-0.04em]
                      sm:text-3xl
                    "
                  >
                    {sauna.name}
                  </h2>

                  {locationText && (
                    <p
                      className="
                        mt-3
                        flex
                        items-center
                        gap-1.5
                        text-sm
                        text-white/80
                      "
                    >
                      <MapPin
                        aria-hidden="true"
                        className="size-4 shrink-0"
                        strokeWidth={1.8}
                      />

                      <span className="truncate">
                        {locationText}
                      </span>
                    </p>
                  )}
                </div>
              </div>
            </Link>

            <div
              className="
                flex
                items-center
                justify-between
                gap-4
                px-1
                pb-1
                pt-5
              "
            >
              <div
                className="
                  flex
                  min-w-0
                  flex-wrap
                  items-center
                  gap-x-3
                  gap-y-2
                "
              >
                {ratingText ? (
                  <div
                    className="
                      inline-flex
                      items-center
                      gap-1.5
                      text-sm
                      font-semibold
                      text-foreground
                    "
                  >
                    <Star
                      aria-hidden="true"
                      className="
                        size-4
                        fill-accent
                        text-accent
                      "
                      strokeWidth={1.8}
                    />

                    <span>{ratingText}</span>
                  </div>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    評価集計中
                  </span>
                )}

                {sauna.rating_count > 0 && (
                  <span className="text-xs text-muted-foreground">
                    {sauna.rating_count}件の評価
                  </span>
                )}
              </div>

              <ArrowRight
                aria-hidden="true"
                className="
                  size-4
                  shrink-0
                  text-muted-foreground
                  transition-transform
                  duration-200
                  group-hover:translate-x-1
                  motion-reduce:transform-none
                  motion-reduce:transition-none
                "
                strokeWidth={1.8}
              />
            </div>
          </AppCard>
        ) : (
          <div
            className="
              flex
              min-h-96
              items-center
              justify-center
              rounded-[2rem]
              border
              border-dashed
              border-border/70
              bg-card/45
              p-8
              text-center
              backdrop-blur-md
            "
          >
            <div className="max-w-xs">
              <span
                className="
                  mx-auto
                  flex
                  size-12
                  items-center
                  justify-center
                  rounded-full
                  bg-secondary/25
                  text-foreground
                "
              >
                <Search
                  aria-hidden="true"
                  className="size-5"
                  strokeWidth={1.8}
                />
              </span>

              <p
                className="
                  mt-5
                  text-base
                  font-semibold
                  text-foreground
                "
              >
                今日の候補を探してみましょう
              </p>

              <p
                className="
                  mt-2
                  text-sm
                  leading-7
                  text-muted-foreground
                "
              >
                サ活の記録やお気に入りが増えると、
                あなたに合った一軒を提案できるようになります。
              </p>

              <AppButton
                href="/search"
                trailingIcon={
                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.8}
                  />
                }
                className="mt-6"
              >
                施設を探す
              </AppButton>
            </div>
          </div>
        )}
      </PageSection>
    </section>
  );
}
