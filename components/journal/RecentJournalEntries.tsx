import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  PenLine,
  Star,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { JournalPost } from "@/services/journal";

type RecentJournalEntriesProps = {
  entries: JournalPost[];
};

function formatVisitDate(visitDate: string): string {
  const date = new Date(`${visitDate}T00:00:00+09:00`);

  if (Number.isNaN(date.getTime())) {
    return visitDate;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
    weekday: "short",
  }).format(date);
}

export function RecentJournalEntries({
  entries,
}: RecentJournalEntriesProps) {
  return (
    <section
      aria-labelledby="recent-journal-heading"
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
        "
      >
        <div>
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.22em]
              text-muted-foreground
            "
          >
            Recent Activity
          </p>

          <h2
            id="recent-journal-heading"
            className="
              mt-3
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-foreground
              sm:text-3xl
            "
          >
            最近のサ活
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
            写真や感想から、最近の整いを振り返れます。
          </p>
        </div>

        <Link
          href="/posts/new"
          className={cn(
            buttonVariants({
              variant: "outline",
              size: "lg",
            }),
            "w-full sm:w-auto"
          )}
        >
          <PenLine
            className="size-4"
            strokeWidth={1.8}
            data-icon="inline-start"
          />

          新しいサ活
        </Link>
      </div>

      {entries.length === 0 ? (
        <div
          className="
            px-5
            py-16
            text-center
            sm:px-8
            sm:py-20
          "
        >
          <div
            className="
              mx-auto
              flex
              size-12
              items-center
              justify-center
              rounded-full
              bg-secondary/20
              text-foreground
            "
          >
            <PenLine
              className="size-5"
              strokeWidth={1.7}
              aria-hidden="true"
            />
          </div>

          <h3
            className="
              mt-6
              text-xl
              font-semibold
              tracking-[-0.025em]
              text-foreground
            "
          >
            まだサ活がありません
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
            最初のサウナ体験を記録すると、
            ここから自分だけのJournalが始まります。
          </p>

          <Link
            href="/posts/new"
            className={cn(
              buttonVariants({
                variant: "totono",
                size: "lg",
              }),
              "mt-7"
            )}
          >
            最初のサ活を記録する
          </Link>
        </div>
      ) : (
        <div
          className="
            grid
            gap-4
            p-4
            sm:grid-cols-2
            sm:p-6
            lg:grid-cols-4
          "
        >
          {entries.map((entry) => {
            const normalizedComment =
              entry.comment?.trim() ?? "";

            return (
              <article
                key={entry.id}
                className="
                  group
                  min-w-0
                  overflow-hidden
                  rounded-[1.6rem]
                  border border-border/50
                  bg-background/70
                  transition
                  duration-300
                  hover:-translate-y-1
                  hover:shadow-md
                  motion-reduce:transform-none
                  motion-reduce:transition-none
                "
              >
                <Link
                  href={`/posts/${entry.id}`}
                  className="flex h-full flex-col"
                >
                  <div
                    className="
                      relative
                      aspect-[4/3]
                      overflow-hidden
                      bg-muted
                    "
                  >
                    {entry.image_url ? (
                      <Image
                        src={entry.image_url}
                        alt={`${entry.sauna_name}のサ活写真`}
                        fill
                        sizes="
                          (max-width: 640px) 100vw,
                          (max-width: 1024px) 50vw,
                          25vw
                        "
                        className="
                          object-cover
                          transition-transform
                          duration-500
                          group-hover:scale-[1.03]
                          motion-reduce:transform-none
                          motion-reduce:transition-none
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-full
                          items-center
                          justify-center
                          bg-gradient-to-br
                          from-secondary/20
                          via-muted/55
                          to-accent/15
                        "
                      >
                        <span
                          className="
                            text-xs
                            font-semibold
                            uppercase
                            tracking-[0.2em]
                            text-muted-foreground
                          "
                        >
                          Sauna Journal
                        </span>
                      </div>
                    )}
                  </div>

                  <div
                    className="
                      flex
                      flex-1
                      flex-col
                      p-5
                    "
                  >
                    <div
                      className="
                        flex
                        flex-wrap
                        items-center
                        gap-2
                      "
                    >
                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-xs
                          font-medium
                          text-muted-foreground
                        "
                      >
                        <CalendarDays
                          className="size-3.5"
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        <time dateTime={entry.visit_date}>
                          {formatVisitDate(
                            entry.visit_date
                          )}
                        </time>
                      </span>

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1
                          rounded-full
                          bg-accent/15
                          px-2.5
                          py-1
                          text-xs
                          font-semibold
                          text-foreground
                          tabular-nums
                        "
                        aria-label={`5点満点中${entry.rating}点`}
                      >
                        <Star
                          className="
                            size-3
                            fill-accent
                            text-accent
                          "
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />

                        {entry.rating.toFixed(1)}
                      </span>
                    </div>

                    <h3
                      className="
                        mt-4
                        line-clamp-2
                        text-lg
                        font-semibold
                        tracking-[-0.025em]
                        text-foreground
                      "
                    >
                      {entry.sauna_name}
                    </h3>

                    <p
                      className="
                        mt-3
                        line-clamp-3
                        text-sm
                        leading-7
                        text-muted-foreground
                      "
                    >
                      {normalizedComment ||
                        "コメントのないサ活記録です。"}
                    </p>

                    <div
                      className="
                        mt-auto
                        flex
                        items-center
                        justify-between
                        gap-4
                        pt-6
                      "
                    >
                      <span
                        className="
                          text-xs
                          font-medium
                          text-muted-foreground
                        "
                      >
                        {entry.set_count}セット
                      </span>

                      <span
                        className="
                          inline-flex
                          items-center
                          gap-1.5
                          text-sm
                          font-medium
                          text-foreground
                        "
                      >
                        記録を見る

                        <ArrowRight
                          className="
                            size-4
                            transition-transform
                            duration-200
                            group-hover:translate-x-1
                            motion-reduce:transition-none
                          "
                          strokeWidth={1.8}
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                  </div>
                </Link>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
