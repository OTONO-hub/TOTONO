import {
  CalendarDays,
  Flame,
  Sparkles,
} from "lucide-react";

import { DashboardContainer } from "@/components/home/dashboard-container";
import { SaunaMetricCardSkeleton } from "@/components/saunas/sauna-metric-card-skeleton";

function HeaderSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="
        border-b border-border/45
        bg-background/90
        backdrop-blur-xl
      "
    >
      <div
        className="
          mx-auto
          flex
          h-20
          max-w-7xl
          items-center
          justify-between
          px-5
          sm:px-8
          lg:px-10
        "
      >
        <div
          className="
            h-9
            w-32
            animate-pulse
            rounded-full
            bg-muted
          "
        />

        <div className="flex items-center gap-3">
          <div
            className="
              hidden
              h-10
              w-24
              animate-pulse
              rounded-full
              bg-muted
              sm:block
            "
          />

          <div
            className="
              size-10
              animate-pulse
              rounded-full
              bg-muted
            "
          />
        </div>
      </div>
    </div>
  );
}

function HeroSkeleton() {
  return (
    <section
      aria-hidden="true"
      className="
        relative
        overflow-hidden
        border-b border-border/40
        py-12
        sm:py-16
        lg:py-20
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-24
          -top-24
          size-72
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <DashboardContainer className="relative">
        <div
          className="
            grid
            gap-8
            lg:grid-cols-[1.35fr_0.65fr]
            lg:items-end
          "
        >
          <div>
            <div
              className="
                h-7
                w-44
                animate-pulse
                rounded-full
                bg-muted
              "
            />

            <div
              className="
                mt-6
                h-12
                max-w-xl
                animate-pulse
                rounded-2xl
                bg-muted
                sm:h-16
              "
            />

            <div
              className="
                mt-4
                h-5
                max-w-lg
                animate-pulse
                rounded-full
                bg-muted/80
              "
            />

            <div
              className="
                mt-3
                h-5
                w-3/4
                max-w-md
                animate-pulse
                rounded-full
                bg-muted/80
              "
            />
          </div>

          <div
            className="
              grid
              gap-3
              sm:grid-cols-2
              lg:grid-cols-1
            "
          >
            {Array.from({ length: 2 }).map(
              (_, index) => (
                <div
                  key={index}
                  className="
                    h-28
                    animate-pulse
                    rounded-[1.5rem]
                    border border-border/45
                    bg-muted/60
                  "
                />
              )
            )}
          </div>
        </div>
      </DashboardContainer>
    </section>
  );
}

function SectionHeaderSkeleton({
  icon,
}: {
  icon: React.ReactNode;
}) {
  return (
    <div
      aria-hidden="true"
      className="
        flex
        flex-col
        gap-4
        border-b border-border/45
        pb-6
        sm:flex-row
        sm:items-end
        sm:justify-between
      "
    >
      <div className="min-w-0">
        <div className="flex items-center gap-3">
          <span
            className="
              flex
              size-9
              items-center
              justify-center
              rounded-full
              bg-muted
              text-muted-foreground
            "
          >
            {icon}
          </span>

          <div
            className="
              h-3
              w-24
              animate-pulse
              rounded-full
              bg-muted
            "
          />
        </div>

        <div
          className="
            mt-4
            h-9
            w-56
            animate-pulse
            rounded-xl
            bg-muted
          "
        />

        <div
          className="
            mt-3
            h-4
            w-full
            max-w-md
            animate-pulse
            rounded-full
            bg-muted/80
          "
        />
      </div>

      <div
        className="
          h-10
          w-36
          animate-pulse
          rounded-full
          bg-muted
        "
      />
    </div>
  );
}

function SaunaSectionSkeleton({
  icon,
}: {
  icon: React.ReactNode;
}) {
  return (
    <section
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        p-5
        shadow-sm
        backdrop-blur-md
        sm:rounded-[2.5rem]
        sm:p-8
        lg:p-10
      "
    >
      <SectionHeaderSkeleton icon={icon} />

      <div className="mt-7">
        <SaunaMetricCardSkeleton count={3} />
      </div>
    </section>
  );
}

export default function Loading() {
  return (
    <>
      <HeaderSkeleton />

      <main
        aria-busy="true"
        aria-live="polite"
        className="min-h-screen bg-background"
      >
        <span className="sr-only">
          ホーム画面を読み込んでいます
        </span>

        <HeroSkeleton />

        <section className="py-16 sm:py-20">
          <DashboardContainer>
            <SaunaSectionSkeleton
              icon={
                <Sparkles
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
            />
          </DashboardContainer>
        </section>

        <section
          className="
            border-t border-border/40
            bg-muted/15
            py-16
            sm:py-20
          "
        >
          <DashboardContainer>
            <SaunaSectionSkeleton
              icon={
                <Flame
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              }
            />
          </DashboardContainer>
        </section>

        <section className="py-16 sm:py-20">
          <DashboardContainer>
            <div
              aria-hidden="true"
              className="
                rounded-[2rem]
                border border-border/55
                bg-card/90
                p-5
                shadow-sm
                sm:rounded-[2.5rem]
                sm:p-8
                lg:p-10
              "
            >
              <SectionHeaderSkeleton
                icon={
                  <CalendarDays
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />
                }
              />

              <div
                className="
                  mt-7
                  grid
                  gap-4
                  md:grid-cols-2
                  lg:grid-cols-3
                "
              >
                {Array.from({
                  length: 3,
                }).map((_, index) => (
                  <div
                    key={index}
                    className="
                      h-48
                      animate-pulse
                      rounded-[1.5rem]
                      border border-border/45
                      bg-muted/60
                    "
                  />
                ))}
              </div>
            </div>
          </DashboardContainer>
        </section>
      </main>
    </>
  );
}
