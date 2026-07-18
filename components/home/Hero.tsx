import Link from "next/link";

import { buttonVariants } from "../ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-background">
      <div className="mx-auto grid min-h-[calc(100svh-5rem)] max-w-7xl items-center gap-12 px-6 pt-28 pb-16 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-12 lg:pt-32 lg:pb-24">
        {/* コピーエリア */}
        <div className="relative z-10 flex flex-col items-start">
          <p className="mb-6 text-xs font-medium tracking-[0.28em] text-muted-foreground uppercase">
            Sauna discovery &amp; journal
          </p>

          <h1 className="text-left text-4xl leading-[1.25] font-semibold tracking-[-0.04em] text-foreground sm:text-5xl lg:text-[3.25rem] xl:text-[3.5rem]">
            <span className="block lg:whitespace-nowrap">
              サウナへ行く前から、
            </span>

            <span className="mt-1 block">
              整い始める。
            </span>
          </h1>

          <p className="mt-7 max-w-lg text-left text-base leading-8 text-muted-foreground sm:text-lg">
            全国のサウナとの出会いを、もっと心地よく。
            <br className="hidden sm:block" />
            記録し、見つけ、共有する、新しいサ活体験。
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link
              href="/register"
              className={buttonVariants({
                size: "lg",
                className:
                  "h-12 rounded-full bg-accent px-8 text-sm font-semibold text-accent-foreground shadow-none transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-accent/90",
              })}
            >
              はじめる
            </Link>

            <Link
              href="/login"
              className={buttonVariants({
                variant: "ghost",
                size: "lg",
                className:
                  "h-12 rounded-full px-8 text-sm font-medium text-foreground shadow-none transition-colors duration-200 ease-out hover:bg-foreground/5",
              })}
            >
              ログイン
            </Link>
          </div>

          <p className="mt-8 text-left text-xs leading-6 text-muted-foreground">
            あなたのサ活を記録して、
            <br className="sm:hidden" />
            次に訪れたい場所を見つけましょう。
          </p>
        </div>

        {/* 写真エリア */}
        <div className="relative">
          <div
            className="aspect-[4/5] min-h-[440px] overflow-hidden rounded-[2rem] bg-cover bg-center shadow-[0_28px_80px_rgba(62,58,58,0.14)] sm:aspect-[5/4] lg:aspect-[4/5] lg:min-h-[620px]"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(25, 24, 22, 0.02) 35%, rgba(25, 24, 22, 0.42) 100%), url('/hero-sauna.webp')",
              backgroundColor: "#d8d4cc",
            }}
            role="img"
            aria-label="静かな自然の中にあるサウナ施設"
          >
            <div className="flex h-full items-end p-6 sm:p-8">
              <div className="max-w-sm text-left text-white">
                <p className="text-xs font-medium tracking-[0.2em] uppercase opacity-80">
                  Today&apos;s escape
                </p>

                <p className="mt-3 text-xl leading-relaxed font-medium sm:text-2xl">
                  心と身体をほどく、
                  <br />
                  次のサウナを見つける。
                </p>
              </div>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute -top-6 -right-6 -z-10 h-32 w-32 rounded-full bg-secondary/40 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="absolute -bottom-8 -left-8 -z-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl"
          />
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex">
        <span className="text-[10px] font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Scroll
        </span>

        <span
          aria-hidden="true"
          className="h-10 w-px bg-gradient-to-b from-foreground/30 to-transparent"
        />
      </div>
    </section>
  );
}