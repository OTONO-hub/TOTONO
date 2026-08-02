import Link from "next/link";
import type { ReactNode } from "react";
import {
  ArrowRight,
  Clock3,
  PenLine,
  Sparkles,
} from "lucide-react";

type RecentSaunaActivitiesProps = {
  hasActivities: boolean;
  children: ReactNode;
};

export function RecentSaunaActivities({
  hasActivities,
  children,
}: RecentSaunaActivitiesProps) {
  return (
    <section
      aria-labelledby="recent-sauna-activities-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:rounded-[2.5rem]
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b border-border/45
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
          <div className="flex items-center gap-3">
            <span
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <Clock3
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
              Recent Activity
            </p>
          </div>

          <h2
            id="recent-sauna-activities-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            最近のあなたのサ活
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            これまでに残した整いの記録を振り返り、
            次のサウナ選びにつなげましょう。
          </p>
        </div>

        {hasActivities && (
          <Link
            href="/profile"
            className="
              inline-flex
              min-h-11
              w-full
              items-center
              justify-center
              gap-2
              rounded-full
              border border-border/70
              bg-background/70
              px-5
              text-sm
              font-semibold
              text-foreground
              transition
              duration-200
              hover:-translate-y-0.5
              hover:bg-background
              hover:shadow-sm
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-ring
              focus-visible:ring-offset-2
              focus-visible:ring-offset-card
              active:translate-y-0
              sm:w-auto
            "
          >
            すべて見る

            <ArrowRight
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </Link>
        )}
      </div>

      <div className="px-5 py-6 sm:px-8 sm:py-8 lg:px-10">
        {hasActivities ? (
          <div className="mx-auto max-w-4xl space-y-8">
            {children}
          </div>
        ) : (
          <div
            className="
              rounded-[1.75rem]
              border border-dashed border-border/70
              bg-muted/25
              px-6
              py-12
              text-center
              sm:px-10
              sm:py-16
            "
          >
            <span
              className="
                mx-auto
                flex
                size-14
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Sparkles
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <h3
              className="
                mt-6
                text-xl
                font-semibold
                tracking-[-0.025em]
                text-foreground
              "
            >
              まだサ活の記録がありません
            </h3>

            <p
              className="
                mx-auto
                mt-3
                max-w-md
                text-sm
                leading-7
                text-muted-foreground
              "
            >
              最初のサ活を記録すると、
              ここにあなたの整いの履歴が表示されます。
            </p>

            <Link
              href="/posts/new"
              className="
                mt-7
                inline-flex
                min-h-11
                items-center
                justify-center
                gap-2
                rounded-full
                bg-primary
                px-6
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
              "
            >
              <PenLine
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              最初のサ活を記録する
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
