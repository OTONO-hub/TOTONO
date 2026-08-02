import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  CalendarDays,
  PenLine,
  Sparkles,
} from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type JournalHeroProps = {
  monthLabel: string;
  reflectionMessage: string;
};

export function JournalHero({
  monthLabel,
  reflectionMessage,
}: JournalHeroProps) {
  return (
    <section
      aria-labelledby="journal-heading"
      className="
        relative
        overflow-hidden
        border-b border-border/40
        bg-background
        px-4
        pb-12
        pt-10
        sm:px-6
        sm:pb-16
        sm:pt-14
        lg:px-8
        lg:pb-20
        lg:pt-16
      "
    >
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -right-36 -top-28
          size-[30rem]
          rounded-full
          bg-secondary/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute -bottom-44 -left-32
          size-96
          rounded-full
          bg-accent/10
          blur-3xl
        "
      />

      <div
        className="
          relative
          mx-auto
          grid
          w-full
          max-w-7xl
          gap-8
          lg:grid-cols-[minmax(0,1fr)_22rem]
          lg:items-end
          lg:gap-12
        "
      >
        <div className="max-w-3xl">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/55
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
              className="size-4 text-foreground"
              strokeWidth={1.8}
              aria-hidden="true"
            />

            <span>{monthLabel}</span>
          </div>

          <p
            className="
              mt-8
              text-xs
              font-semibold
              uppercase
              tracking-[0.3em]
              text-muted-foreground
            "
          >
            My Sauna Journal
          </p>

          <h1
            id="journal-heading"
            className="
              mt-4
              max-w-3xl
              text-4xl
              font-semibold
              tracking-[-0.05em]
              text-foreground
              sm:text-5xl
              lg:text-6xl
              lg:leading-[1.08]
            "
          >
            整った時間を、
            <br className="hidden sm:block" />
            自分の記録に。
          </h1>

          <p
            className="
              mt-6
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
              sm:text-base
              sm:leading-8
            "
          >
            サ活の積み重ねを振り返りながら、
            自分らしいサウナライフを見つける場所です。
          </p>

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
            <Link
              href="/posts/new"
              className={cn(
                buttonVariants({
                  variant: "totono",
                  size: "xl",
                }),
                "w-full sm:w-auto"
              )}
            >
              <PenLine
                className="size-4"
                strokeWidth={1.8}
                data-icon="inline-start"
              />

              今日のサ活を記録する
            </Link>

            <a
              href="#journal-calendar"
              className={cn(
                buttonVariants({
                  variant: "totonoOutline",
                  size: "xl",
                }),
                "w-full sm:w-auto"
              )}
            >
              カレンダーを見る

              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
                data-icon="inline-end"
              />
            </a>
          </div>
        </div>

        <aside
          aria-label="今月の振り返り"
          className="
            relative
            overflow-hidden
            rounded-[2rem]
            border border-white/55
            bg-card/80
            p-5
            shadow-totono-floating
            backdrop-blur-xl
            sm:p-6
          "
        >
          <div
            aria-hidden="true"
            className="
              pointer-events-none
              absolute -right-10 -top-10
              size-28
              rounded-full
              bg-accent/15
              blur-2xl
            "
          />

          <div
            className="
              relative
              flex
              items-center
              gap-3
            "
          >
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
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <div>
              <p
                className="
                  text-[0.6875rem]
                  font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-muted-foreground
                "
              >
                Monthly Reflection
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  text-foreground
                "
              >
                今月の振り返り
              </p>
            </div>
          </div>

          <div
            className="
              relative
              mt-6
              rounded-[1.5rem]
              border border-border/45
              bg-background/55
              p-5
            "
          >
            <BookOpen
              className="
                mb-4
                size-5
                text-muted-foreground
              "
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <p
              className="
                text-sm
                leading-7
                text-foreground
              "
            >
              {reflectionMessage}
            </p>
          </div>

          <p
            className="
              relative
              mt-4
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            記録が増えるほど、
            あなたらしい傾向が見えてきます。
          </p>
        </aside>
      </div>
    </section>
  );
}
