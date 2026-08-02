"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import {
  ArrowRight,
  MapPinned,
  Navigation,
  NotebookPen,
  Search,
  Sparkles,
  Trash2,
} from "lucide-react";

import { AppCard } from "@/components/ui/app-card";
import { PageSection } from "@/components/ui/page-section";

import {
  type TodaySauna,
  useTodaySauna,
} from "@/components/search/use-today-sauna";

type ActionCardProps = {
  href: string;
  title: string;
  description: string;
  icon: ReactNode;
  external?: boolean;
  primary?: boolean;
};

function createMapHref(
  sauna: TodaySauna
): string {
  if (
    sauna.latitude !== null &&
    sauna.longitude !== null
  ) {
    const destination =
      `${sauna.latitude},${sauna.longitude}`;

    const searchParams =
      new URLSearchParams({
        api: "1",
        destination,
      });

    return `https://www.google.com/maps/dir/?${searchParams.toString()}`;
  }

  const searchParams =
    new URLSearchParams({
      api: "1",
      destination: sauna.name,
    });

  return `https://www.google.com/maps/dir/?${searchParams.toString()}`;
}

function createPostHref(
  sauna: TodaySauna
): string {
  const searchParams =
    new URLSearchParams({
      saunaId: sauna.id,
      saunaName: sauna.name,
      source: "today",
    });

  return `/posts/new?${searchParams.toString()}`;
}

function ActionCard({
  href,
  title,
  description,
  icon,
  external = false,
  primary = false,
}: ActionCardProps) {
  const className = `
    group
    flex
    min-h-40
    flex-col
    justify-between
    rounded-[1.5rem]
    border
    p-5
    text-left
    shadow-sm
    transition
    duration-200
    hover:-translate-y-1
    hover:shadow-md
    focus-visible:outline-none
    focus-visible:ring-2
    focus-visible:ring-ring
    focus-visible:ring-offset-2
    focus-visible:ring-offset-background
    ${
      primary
        ? `
          border-primary
          bg-primary
          text-primary-foreground
        `
        : `
          border-border/55
          bg-background/70
          text-foreground
          hover:border-border
          hover:bg-background
        `
    }
  `;

  const content = (
    <>
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
            items-center
            justify-center
            rounded-full
            ${
              primary
                ? `
                  bg-white/15
                  text-primary-foreground
                `
                : `
                  bg-secondary/20
                  text-foreground
                `
            }
          `}
        >
          {icon}
        </span>

        <ArrowRight
          className="
            size-4
            transition-transform
            duration-200
            group-hover:translate-x-1
          "
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </div>

      <div className="mt-8">
        <p
          className="
            text-base
            font-semibold
            tracking-[-0.02em]
          "
        >
          {title}
        </p>

        <p
          className={`
            mt-2
            text-sm
            leading-6
            ${
              primary
                ? "text-primary-foreground/70"
                : "text-muted-foreground"
            }
          `}
        >
          {description}
        </p>
      </div>
    </>
  );

  if (external) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={className}
      >
        {content}
      </a>
    );
  }

  return (
    <Link
      href={href}
      className={className}
    >
      {content}
    </Link>
  );
}

export function TodayActions() {
  const [
    todaySauna,
    setTodaySauna,
  ] = useTodaySauna();

  if (!todaySauna) {
    return null;
  }

  const mapHref =
    createMapHref(todaySauna);

  const postHref =
    createPostHref(todaySauna);

  const handleClearTodaySauna = () => {
    setTodaySauna(null);
  };

  return (
    <PageSection
      as="section"
      aria-labelledby="today-actions-heading"
    >
      <AppCard
        variant="glass"
        radius="xl"
        padding="none"
        className="bg-card/85"
      >
        <div
          className="
            flex
            flex-col
            gap-4
            border-b
            border-border/45
            px-6
            py-6
            sm:flex-row
            sm:items-end
            sm:justify-between
            sm:px-8
            sm:py-8
            lg:px-10
          "
        >
          <div>
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
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              Next Action
            </div>

            <h2
              id="today-actions-heading"
              className="
                mt-4
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-foreground
                sm:text-3xl
              "
            >
              次に何をしますか？
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
              {todaySauna.name}へ向かう準備や、
              サ活の記録をここから始められます。
            </p>
          </div>

          <div
            className="
              inline-flex
              items-center
              gap-2
              self-start
              rounded-full
              bg-accent/15
              px-4
              py-2
              text-xs
              font-semibold
              text-foreground
              sm:self-auto
            "
          >
            <MapPinned
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            今日の予定
          </div>
        </div>

        <div
          className="
            grid
            gap-4
            px-6
            py-6
            sm:grid-cols-2
            sm:px-8
            sm:py-8
            lg:grid-cols-3
            lg:px-10
          "
        >
          <ActionCard
            href={mapHref}
            title="ナビを開く"
            description="Googleマップで施設までの経路を確認します。"
            external
            primary
            icon={
              <Navigation
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
          />

          <ActionCard
            href={postHref}
            title="サ活を記録する"
            description="今日のサウナ体験をTOTONOへ残します。"
            icon={
              <NotebookPen
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
          />

          <ActionCard
            href="/search"
            title="別の施設を探す"
            description="検索画面へ戻って、今日の一軒を変更します。"
            icon={
              <Search
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
          />
        </div>

        <div
          className="
            flex
            flex-col
            gap-4
            border-t
            border-border/45
            px-6
            py-5
            sm:flex-row
            sm:items-center
            sm:justify-between
            sm:px-8
            lg:px-10
          "
        >
          <div>
            <p
              className="
                text-sm
                font-semibold
                text-foreground
              "
            >
              今日の予定を変更しますか？
            </p>

            <p
              className="
                mt-1
                text-xs
                leading-6
                text-muted-foreground
              "
            >
              予定を解除しても、施設情報や投稿は削除されません。
            </p>
          </div>

          <button
            type="button"
            onClick={
              handleClearTodaySauna
            }
            className="
              inline-flex
              min-h-11
              shrink-0
              items-center
              justify-center
              gap-2
              rounded-full
              px-5
              text-sm
              font-semibold
              text-muted-foreground
              transition
              duration-200
              hover:bg-destructive/10
              hover:text-destructive
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-background
            "
          >
            <Trash2
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            今日の予定を解除
          </button>
        </div>
      </AppCard>
    </PageSection>
  );
}

