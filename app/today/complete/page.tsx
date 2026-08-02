import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Check,
  Flame,
  MessageCircle,
  Sparkles,
} from "lucide-react";

import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { TodayJourneyCompleteButton } from "@/components/today/TodayJourneyCompleteButton";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TodayCompletePageProps = {
  searchParams: Promise<{
    saunaId?: string | string[];
    saunaName?: string | string[];
    postId?: string | string[];
  }>;
};

function getSingleSearchParam(
  value: string | string[] | undefined
): string | null {
  if (typeof value === "string") {
    const trimmedValue = value.trim();

    return trimmedValue.length > 0
      ? trimmedValue
      : null;
  }

  if (Array.isArray(value)) {
    const firstValue = value[0]?.trim();

    return firstValue
      ? firstValue
      : null;
  }

  return null;
}

export default async function TodayCompletePage({
  searchParams,
}: TodayCompletePageProps) {
  const resolvedSearchParams =
    await searchParams;

  const saunaId =
    getSingleSearchParam(
      resolvedSearchParams.saunaId
    );

  const saunaName =
    getSingleSearchParam(
      resolvedSearchParams.saunaName
    ) ?? "今日のサウナ";

  const postId =
    getSingleSearchParam(
      resolvedSearchParams.postId
    );

  const saunaHref = saunaId
    ? `/saunas/${encodeURIComponent(
        saunaId
      )}`
    : "/search";

  const primaryHref = postId
    ? `/posts/${encodeURIComponent(postId)}`
    : saunaHref;

  const primaryLabel = postId
    ? "投稿を見る"
    : "施設ページを見る";

  return (
    <>
      <Header />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-muted/25
          px-4
          pb-32
          pt-28
          sm:px-6
          sm:pb-24
          sm:pt-32
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-36
            top-8
            size-96
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
            -bottom-32
            -left-36
            size-96
            rounded-full
            bg-accent/15
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-3xl
          "
        >
          <section
            aria-labelledby="today-complete-heading"
            className="
              overflow-hidden
              rounded-[2rem]
              border
              border-border/55
              bg-card/90
              shadow-sm
              backdrop-blur-md
              sm:rounded-[2.5rem]
            "
          >
            <div
              className="
                relative
                overflow-hidden
                bg-linear-to-br
                from-secondary/25
                via-background
                to-accent/15
                px-6
                py-12
                text-center
                sm:px-10
                sm:py-16
              "
            >
              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -right-20
                  -top-20
                  size-64
                  rounded-full
                  bg-secondary/30
                  blur-3xl
                "
              />

              <div
                aria-hidden="true"
                className="
                  pointer-events-none
                  absolute
                  -bottom-24
                  -left-16
                  size-64
                  rounded-full
                  bg-accent/20
                  blur-3xl
                "
              />

              <div
                className="
                  relative
                  mx-auto
                  flex
                  size-20
                  items-center
                  justify-center
                  rounded-full
                  bg-success
                  text-white
                  shadow-lg
                "
              >
                <Check
                  className="size-8"
                  strokeWidth={2}
                  aria-hidden="true"
                />

                <span
                  aria-hidden="true"
                  className="
                    absolute
                    inset-0
                    animate-ping
                    rounded-full
                    bg-success/25
                  "
                />
              </div>

              <div
                className="
                  relative
                  mt-8
                  inline-flex
                  items-center
                  gap-2
                  text-xs
                  font-semibold
                  uppercase
                  tracking-[0.24em]
                  text-muted-foreground
                "
              >
                <Sparkles
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                Today&apos;s Journey Complete
              </div>

              <h1
                id="today-complete-heading"
                className="
                  relative
                  mt-5
                  text-3xl
                  font-semibold
                  tracking-[-0.05em]
                  text-foreground
                  sm:text-4xl
                  lg:text-5xl
                "
              >
                今日も、お疲れさまでした。
              </h1>

              <p
                className="
                  relative
                  mx-auto
                  mt-5
                  max-w-xl
                  text-sm
                  leading-7
                  text-muted-foreground
                  sm:text-base
                  sm:leading-8
                "
              >
                {saunaName}
                での体験を、TOTONOに記録しました。
                今日の整いが、次のサウナ選びにつながっていきます。
              </p>

              <div
                className="
                  relative
                  mx-auto
                  mt-8
                  inline-flex
                  items-center
                  gap-3
                  rounded-full
                  border
                  border-border/55
                  bg-card/75
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-foreground
                  shadow-sm
                "
              >
                <Flame
                  className="size-4 text-error"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />

                サ活の記録が追加されました
              </div>
            </div>

            <div
              className="
                border-t
                border-border/45
                px-6
                py-7
                sm:px-8
                sm:py-8
              "
            >
              <div
                className="
                  grid
                  gap-3
                  sm:grid-cols-2
                "
              >
                <Link
                  href={primaryHref}
                  className={cn(
                    buttonVariants({
                      variant: "totono",
                      size: "xl",
                    }),
                    `
                      w-full
                      justify-between
                      rounded-[1.25rem]
                      px-5
                    `
                  )}
                >
                  <span
                    className="
                      inline-flex
                      items-center
                      gap-3
                    "
                  >
                    <BookOpen
                      className="size-4"
                      strokeWidth={1.8}
                      data-icon="inline-start"
                    />

                    {primaryLabel}
                  </span>

                  <ArrowRight
                    className="size-4"
                    strokeWidth={1.8}
                    data-icon="inline-end"
                  />
                </Link>

                <TodayJourneyCompleteButton
                  saunaId={saunaId}
                />
              </div>

              <Link
                href="/community"
                className="
                  mt-4
                  flex
                  min-h-14
                  w-full
                  items-center
                  justify-between
                  rounded-[1.25rem]
                  border
                  border-border/55
                  bg-background/65
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
                "
              >
                <span
                  className="
                    inline-flex
                    items-center
                    gap-3
                  "
                >
                  <MessageCircle
                    className="size-4"
                    strokeWidth={1.8}
                    aria-hidden="true"
                  />

                  みんなのサ活を見る
                </span>

                <ArrowRight
                  className="
                    size-4
                    text-muted-foreground
                  "
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
              </Link>
            </div>

            <div
              className="
                border-t
                border-border/45
                bg-muted/20
                px-6
                py-5
                text-center
                sm:px-8
              "
            >
              <p
                className="
                  text-xs
                  leading-6
                  text-muted-foreground
                "
              >
                水分を補給して、整った余韻をゆっくり楽しみましょう。
              </p>
            </div>
          </section>
        </div>
      </main>

      <AppMobileNavigation />
    </>
  );
}
