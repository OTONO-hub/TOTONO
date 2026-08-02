import Image from "next/image";
import { ArrowRight } from "lucide-react";

import { AppButton } from "@/components/ui/app-button";
import { BackgroundGlow } from "@/components/ui/background-glow";
import { PageSection } from "@/components/ui/page-section";

export function Hero() {
  return (
    <section
      aria-labelledby="public-hero-heading"
      className="
        relative
        isolate
        overflow-hidden
        bg-background
      "
    >
      <BackgroundGlow
        tone="secondary"
        position="top-right"
        size="lg"
        className="
          -right-24
          -top-24
          size-80
          bg-secondary/25
        "
      />

      <BackgroundGlow
        tone="accent"
        position="bottom-left"
        size="lg"
        className="
          -bottom-32
          -left-24
          size-80
          bg-accent/15
        "
      />

      <PageSection
        width="wide"
        className="
          grid
          min-h-[calc(100svh-5rem)]
          items-center
          gap-12
          pb-16
          pt-28
          lg:grid-cols-2
          lg:gap-14
          lg:pb-24
          lg:pt-32
        "
      >
        <div
          className="
            relative
            z-10
            flex
            flex-col
            items-start
          "
        >
          <p
            className="
              mb-6
              text-xs
              font-semibold
              uppercase
              tracking-[0.28em]
              text-muted-foreground
            "
          >
            Sauna discovery &amp; journal
          </p>

          <h1
            id="public-hero-heading"
            className="
              text-left
              text-4xl
              font-semibold
              leading-[1.25]
              tracking-[-0.04em]
              text-foreground
              sm:text-5xl
              lg:text-[3.25rem]
              xl:text-[3.5rem]
            "
          >
            <span className="block lg:whitespace-nowrap">
              サウナへ行く前から、
            </span>

            <span className="mt-1 block">
              整い始める。
            </span>
          </h1>

          <p
            className="
              mt-7
              max-w-lg
              text-left
              text-base
              leading-8
              text-muted-foreground
              sm:text-lg
            "
          >
            全国のサウナとの出会いを、もっと心地よく。
            <br className="hidden sm:block" />
            記録し、見つけ、共有する、新しいサ活体験。
          </p>

          <div
            className="
              mt-10
              flex
              w-full
              flex-col
              gap-3
              sm:w-auto
              sm:flex-row
            "
          >
            <AppButton
              href="/register"
              size="lg"
              trailingIcon={
                <ArrowRight
                  className="size-4"
                  strokeWidth={1.8}
                />
              }
              className="
                w-full
                bg-accent
                text-foreground
                hover:bg-accent/90
                sm:w-fit
              "
            >
              はじめる
            </AppButton>

            <AppButton
              href="/login"
              variant="ghost"
              size="lg"
              className="
                w-full
                sm:w-fit
              "
            >
              ログイン
            </AppButton>
          </div>

          <p
            className="
              mt-8
              text-left
              text-xs
              leading-6
              text-muted-foreground
            "
          >
            あなたのサ活を記録して、
            <br className="sm:hidden" />
            次に訪れたい場所を見つけましょう。
          </p>
        </div>

        <div className="relative">
          <div
            className="
              relative
              aspect-[4/5]
              min-h-[440px]
              overflow-hidden
              rounded-[2rem]
              bg-[#d8d4cc]
              shadow-[0_28px_80px_rgba(62,58,58,0.14)]
              sm:aspect-[5/4]
              lg:aspect-[4/5]
              lg:min-h-[620px]
            "
          >
            <Image
              src="/hero-sauna.webp"
              alt="静かな自然の中にあるサウナ施設"
              fill
              preload
              sizes="
                (max-width: 639px) calc(100vw - 2rem),
                (max-width: 1023px) calc(100vw - 3rem),
                50vw
              "
              className="object-cover"
            />

            <div
              aria-hidden="true"
              className="
                absolute
                inset-0
                bg-linear-to-b
                from-black/[0.02]
                via-black/[0.06]
                to-black/45
              "
            />

            <div
              className="
                relative
                z-10
                flex
                h-full
                items-end
                p-6
                sm:p-8
              "
            >
              <div className="max-w-sm text-left text-white">
                <p
                  className="
                    text-xs
                    font-semibold
                    uppercase
                    tracking-[0.2em]
                    opacity-80
                  "
                >
                  Today&apos;s escape
                </p>

                <p
                  className="
                    mt-3
                    text-xl
                    font-medium
                    leading-relaxed
                    sm:text-2xl
                  "
                >
                  心と身体をほどく、
                  <br />
                  次のサウナを見つける。
                </p>
              </div>
            </div>
          </div>
        </div>
      </PageSection>

      <div
        aria-hidden="true"
        className="
          absolute
          bottom-6
          left-1/2
          hidden
          -translate-x-1/2
          flex-col
          items-center
          gap-2
          lg:flex
        "
      >
        <span
          className="
            text-[10px]
            font-medium
            uppercase
            tracking-[0.24em]
            text-muted-foreground
          "
        >
          Scroll
        </span>

        <span
          className="
            h-10
            w-px
            bg-gradient-to-b
            from-foreground/30
            to-transparent
          "
        />
      </div>
    </section>
  );
}
