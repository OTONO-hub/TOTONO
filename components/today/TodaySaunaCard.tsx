"use client";

import { useSyncExternalStore } from "react";
import {
  ArrowRight,
  CalendarDays,
  MapPin,
  Navigation,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";
import { AppButton } from "@/components/ui/app-button";
import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";

function subscribeToMountedState(): () => void {
  return () => {};
}

function useHasMounted(): boolean {
  return useSyncExternalStore(
    subscribeToMountedState,
    () => true,
    () => false
  );
}

function createLocationText(
  sauna: TodaySauna
): string {
  return [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .join(" ");
}

function createMapHref(
  sauna: TodaySauna
): string {
  if (
    sauna.latitude !== null &&
    sauna.longitude !== null
  ) {
    return `https://www.google.com/maps/search/?api=1&query=${sauna.latitude},${sauna.longitude}`;
  }

  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    sauna.name
  )}`;
}

function createSelectedDateText(
  selectedAt: string
): string | null {
  const date = new Date(selectedAt);

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}

function TodaySaunaSkeleton() {
  return (
    <PageSection
      as="section"
      aria-label="今日行くサウナを読み込み中"
      aria-busy="true"
    >
      <AppCard
        variant="glass"
        radius="xl"
        padding="none"
        className="
          min-h-64
          animate-pulse
          bg-card/55
          motion-reduce:animate-none
        "
      />
    </PageSection>
  );
}

function TodaySaunaEmptyCard() {
  return (
    <PageSection
      as="section"
      aria-labelledby="today-sauna-heading"
    >
      <AppCard
        variant="glass"
        radius="xl"
        padding="none"
        className="
          bg-card/80
          p-6
          sm:p-8
          lg:p-10
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-20
            -top-24
            -z-10
            size-64
            rounded-full
            bg-secondary/20
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-28
            -left-20
            -z-10
            size-56
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            flex
            flex-col
            gap-8
            lg:flex-row
            lg:items-center
            lg:justify-between
          "
        >
          <div className="max-w-2xl">
            <div
              className="
                inline-flex
                items-center
                gap-2
                text-xs
                font-semibold
                uppercase
                tracking-[0.22em]
                text-muted-foreground
              "
            >
              <Sparkles
                aria-hidden="true"
                className="size-4"
                strokeWidth={1.8}
              />

              Today&apos;s Sauna
            </div>

            <h2
              id="today-sauna-heading"
              className="
                mt-5
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
                sm:text-3xl
              "
            >
              今日はどこで整いますか。
            </h2>

            <p
              className="
                mt-4
                max-w-xl
                text-sm
                leading-7
                text-muted-foreground
                sm:text-base
                sm:leading-8
              "
            >
              近くのサウナや、今の気分に合う施設から、
              今日の一軒を見つけましょう。
            </p>
          </div>

          <AppButton
            href="/search"
            size="lg"
            leadingIcon={
              <Search
                className="size-4"
                strokeWidth={1.8}
              />
            }
            trailingIcon={
              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
              />
            }
            className="
              w-full
              justify-between
              lg:w-fit
              lg:min-w-56
            "
          >
            今日のサウナを探す
          </AppButton>
        </div>
      </AppCard>
    </PageSection>
  );
}

export function TodaySaunaCard() {
  const [
    todaySauna,
    setTodaySauna,
  ] = useTodaySauna();

  const hasMounted = useHasMounted();

  if (!hasMounted) {
    return <TodaySaunaSkeleton />;
  }

  if (!todaySauna) {
    return <TodaySaunaEmptyCard />;
  }

  const locationText =
    createLocationText(todaySauna);

  const selectedDateText =
    createSelectedDateText(
      todaySauna.selectedAt
    );

  const mapHref =
    createMapHref(todaySauna);

  return (
    <PageSection
      as="section"
      aria-labelledby="today-sauna-heading"
    >
      <AppCard
        as="article"
        variant="glass"
        radius="xl"
        padding="none"
        className="
          bg-card/85
          p-6
          sm:p-8
          lg:p-10
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-24
            -top-28
            -z-10
            size-72
            rounded-full
            bg-secondary/20
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -bottom-36
            -left-24
            -z-10
            size-64
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            grid
            gap-8
            lg:grid-cols-[minmax(0,1fr)_auto]
            lg:items-end
          "
        >
          <div>
            <div
              className="
                flex
                flex-wrap
                items-center
                gap-3
              "
            >
              <div
                className="
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.22em]
                  text-muted-foreground
                "
              >
                <Sparkles
                  aria-hidden="true"
                  className="size-4"
                  strokeWidth={1.8}
                />

                Today&apos;s Sauna
              </div>

              <span
                className="
                  inline-flex
                  items-center
                  rounded-full
                  bg-accent/20
                  px-3
                  py-1
                  text-[0.6875rem]
                  font-semibold
                  text-foreground
                "
              >
                決定済み
              </span>
            </div>

            <h2
              id="today-sauna-heading"
              className="
                mt-5
                text-3xl
                font-semibold
                tracking-[-0.045em]
                text-foreground
                sm:text-4xl
              "
            >
              {todaySauna.name}
            </h2>

            {locationText && (
              <p
                className="
                  mt-4
                  flex
                  items-center
                  gap-2
                  text-sm
                  text-muted-foreground
                  sm:text-base
                "
              >
                <MapPin
                  aria-hidden="true"
                  className="size-4 shrink-0"
                  strokeWidth={1.8}
                />

                <span>{locationText}</span>
              </p>
            )}

            {selectedDateText && (
              <p
                className="
                  mt-3
                  flex
                  items-center
                  gap-2
                  text-xs
                  text-muted-foreground
                "
              >
                <CalendarDays
                  aria-hidden="true"
                  className="size-4 shrink-0"
                  strokeWidth={1.8}
                />

                {selectedDateText}に今日の予定へ追加
              </p>
            )}

            <p
              className="
                mt-6
                max-w-2xl
                text-sm
                leading-7
                text-foreground/75
                sm:text-base
                sm:leading-8
              "
            >
              今日の一軒が決まりました。
              持ち物や移動方法を確認して、
              ゆっくり準備を始めましょう。
            </p>
          </div>

          <div
            className="
              flex
              w-full
              flex-col
              gap-3
              sm:flex-row
              sm:flex-wrap
              lg:max-w-md
              lg:justify-end
            "
          >
            <AppButton
              href={`/saunas/${todaySauna.id}`}
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
              施設を見る
            </AppButton>

            <AppButton
              href={mapHref}
              external
              variant="secondary"
              size="lg"
              leadingIcon={
                <Navigation
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              className="
                w-full
                sm:w-fit
              "
            >
              地図で見る
            </AppButton>

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
              施設を変更
            </AppButton>

            <AppButton
              variant="danger"
              size="lg"
              leadingIcon={
                <Trash2
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              onClick={() =>
                setTodaySauna(null)
              }
              className="
                w-full
                sm:w-fit
              "
            >
              予定を解除
            </AppButton>
          </div>
        </div>
      </AppCard>
    </PageSection>
  );
}
