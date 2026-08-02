import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  ChartNoAxesCombined,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JournalEntryCardProps = {
  monthlyVisits: number;
  totalVisits: number;
};

export function JournalEntryCard({
  monthlyVisits,
  totalVisits,
}: JournalEntryCardProps) {
  return (
    <section
      aria-labelledby="profile-journal-heading"
      className="
        relative
        mt-8
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        p-6
        shadow-sm
        backdrop-blur-md
        sm:mt-10
        sm:rounded-[2.5rem]
        sm:p-8
        lg:p-10
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-20 -top-20
          size-60
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div
        className="
          relative
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
              size-11
              items-center
              justify-center
              rounded-full
              bg-secondary/20
              text-foreground
            "
          >
            <BookOpen
              className="size-5"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <p
            className="
              mt-6
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Sauna Journal
          </p>

          <h2
            id="profile-journal-heading"
            className="
              mt-3
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            サウナライフの記録
          </h2>

          <p
            className="
              mt-4
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            サ活履歴やカレンダー、よく行く施設など、
            自分だけのサウナライフをJournalで振り返れます。
          </p>

          <div
            className="
              mt-7
              grid
              max-w-md
              grid-cols-2
              gap-3
            "
          >
            <div
              className="
                rounded-2xl
                border border-border/45
                bg-background/65
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-muted-foreground
                "
              >
                <CalendarDays
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <span className="text-xs">
                  今月
                </span>
              </div>

              <p
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                  text-foreground
                  tabular-nums
                "
              >
                {monthlyVisits}
                <span
                  className="
                    ml-1.5
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  回
                </span>
              </p>
            </div>

            <div
              className="
                rounded-2xl
                border border-border/45
                bg-background/65
                p-4
              "
            >
              <div
                className="
                  flex
                  items-center
                  gap-2
                  text-muted-foreground
                "
              >
                <ChartNoAxesCombined
                  className="size-4"
                  strokeWidth={1.7}
                  aria-hidden="true"
                />

                <span className="text-xs">
                  累計
                </span>
              </div>

              <p
                className="
                  mt-3
                  text-2xl
                  font-semibold
                  tracking-[-0.035em]
                  text-foreground
                  tabular-nums
                "
              >
                {totalVisits}
                <span
                  className="
                    ml-1.5
                    text-xs
                    font-medium
                    text-muted-foreground
                  "
                >
                  回
                </span>
              </p>
            </div>
          </div>
        </div>

        <Link
          href="/journal"
          className={cn(
            buttonVariants({
              variant: "totono",
              size: "xl",
            }),
            "w-full lg:w-auto"
          )}
        >
          Journalを開く

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            data-icon="inline-end"
          />
        </Link>
      </div>
    </section>
  );
}
