import type { LucideIcon } from "lucide-react";
import {
  Activity,
  CalendarDays,
  Compass,
  Home,
  MessageSquareText,
  Sparkles,
} from "lucide-react";

import type {
  SaunaPersona,
  SaunaPersonaType,
} from "@/lib/profile-persona";

type SaunaPersonaCardProps = {
  persona: SaunaPersona;
};

type PersonaVisual = {
  icon: LucideIcon;
  eyebrow: string;
  supportingText: string;
};

const PERSONA_VISUALS: Record<
  SaunaPersonaType,
  PersonaVisual
> = {
  explorer: {
    icon: Compass,
    eyebrow: "DISCOVER YOUR STYLE",
    supportingText:
      "まだ見ぬサウナとの出会いが、あなたの記録を広げています。",
  },

  "home-sauna": {
    icon: Home,
    eyebrow: "YOUR FAVORITE PLACE",
    supportingText:
      "繰り返し訪れたくなる場所が、あなたのサ活の中心になっています。",
  },

  "weekend-sauna": {
    icon: CalendarDays,
    eyebrow: "WEEKEND RHYTHM",
    supportingText:
      "週末の時間を使いながら、自分らしい整い方を楽しんでいます。",
  },

  reviewer: {
    icon: MessageSquareText,
    eyebrow: "MEMORIES IN WORDS",
    supportingText:
      "サウナで感じたことを言葉にしながら、体験を丁寧に残しています。",
  },

  "sauna-regular": {
    icon: Activity,
    eyebrow: "YOUR SAUNA PACE",
    supportingText:
      "無理のないリズムで、サウナのある時間を生活に取り入れています。",
  },

  discovering: {
    icon: Sparkles,
    eyebrow: "DISCOVERING YOUR STYLE",
    supportingText:
      "記録が増えるたびに、あなたらしいサウナスタイルが少しずつ見えてきます。",
  },
};

export function SaunaPersonaCard({
  persona,
}: SaunaPersonaCardProps) {
  const visual =
    PERSONA_VISUALS[persona.type];

  const PersonaIcon = visual.icon;

  const isDiscovering =
    persona.type === "discovering";

  return (
    <section
      aria-labelledby="sauna-persona-heading"
      className="
        relative
        mt-8
        overflow-hidden
        rounded-[2rem]
        border border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
        sm:mt-10
      "
    >
      {/* 背景装飾 */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none
          absolute
          -right-20
          -top-20
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
          -bottom-24
          -left-16
          size-56
          rounded-full
          bg-accent/15
          blur-3xl
        "
      />

      <div
        className="
          relative
          grid
          gap-7
          px-6
          py-7
          sm:px-8
          sm:py-9
          lg:grid-cols-[minmax(0,1fr)_17rem]
          lg:items-stretch
          lg:gap-8
        "
      >
        {/* Personaの主要情報 */}
        <div className="min-w-0">
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/45
              bg-background/60
              px-3
              py-1.5
              text-[0.68rem]
              font-semibold
              uppercase
              tracking-[0.14em]
              text-muted-foreground
            "
          >
            <Sparkles
              className="size-3.5"
              strokeWidth={1.8}
            />

            Your Sauna Persona
          </div>

          <p
            className="
              mt-6
              text-xs
              font-semibold
              uppercase
              tracking-[0.16em]
              text-muted-foreground
            "
          >
            {visual.eyebrow}
          </p>

          <h2
            id="sauna-persona-heading"
            className="
              mt-3
              wrap-break-word
              text-3xl
              font-semibold
              tracking-[-0.045em]
              text-foreground
              sm:text-4xl
            "
          >
            {persona.name}
          </h2>

          <p
            className="
              mt-2
              text-sm
              font-medium
              tracking-[0.08em]
              text-muted-foreground
            "
          >
            {persona.englishName}
          </p>

          <p
            className="
              mt-5
              max-w-2xl
              text-sm
              leading-7
              text-foreground/80
              sm:mt-6
              sm:text-base
              sm:leading-8
            "
          >
            {persona.description}
          </p>

          <div
            className="
              mt-5
              rounded-[1.25rem]
              border border-border/45
              bg-background/55
              px-4
              py-4
              sm:mt-6
              sm:px-5
            "
          >
            <p
              className="
                text-[0.6875rem]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-muted-foreground
              "
            >
              {isDiscovering
                ? "Next insight"
                : "Your pattern"}
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-foreground/85
              "
            >
              {persona.reason}
            </p>
          </div>
        </div>

        {/* Personaの補助情報 */}
        <div
          className="
            flex
            items-center
            gap-4
            rounded-[1.75rem]
            border border-border/50
            bg-background/55
            p-5
            sm:p-6
            lg:flex-col
            lg:items-start
            lg:justify-between
          "
        >
          <div
            className="
              flex
              size-14
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-secondary/25
              text-foreground
            "
          >
            <PersonaIcon
              className="size-7"
              strokeWidth={1.6}
            />
          </div>

          <div className="min-w-0 lg:mt-10">
            <p
              className="
                text-[0.6875rem]
                font-semibold
                uppercase
                tracking-[0.12em]
                text-muted-foreground
              "
            >
              {isDiscovering
                ? "Still discovering"
                : "About your style"}
            </p>

            <p
              className="
                mt-2
                text-sm
                leading-6
                text-foreground/75
                lg:mt-3
                lg:leading-7
              "
            >
              {visual.supportingText}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
