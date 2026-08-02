import type { ReactNode } from "react";
import {
  Activity,
  CalendarDays,
  Waves,
} from "lucide-react";

import type { SaunaRhythm } from "@/lib/profile-rhythm";

type SaunaRhythmCardProps = {
  rhythm: SaunaRhythm;
};

type RhythmItemProps = {
  icon: ReactNode;
  label: string;
  value: string;
  description: string;
};

type AveragePaceContent = {
  value: string;
  description: string;
};

/**
 * 投稿状況に応じて、
 * 平均ペース欄の表示内容を整えます。
 */
function getAveragePaceContent(
  rhythm: SaunaRhythm
): AveragePaceContent {
  if (rhythm.monthlyVisits === 0 &&
      rhythm.lastThirtyDaysVisits === 0 &&
      rhythm.averageIntervalDays === null) {
    return {
      value: "未計測",
      description:
        "最初のサ活を記録すると、あなたのリズム分析が始まります。",
    };
  }

  if (rhythm.averageIntervalDays === null) {
    return {
      value: "分析中",
      description:
        "もう1回記録すると、平均ペースが表示されます。",
    };
  }

  return {
    value: rhythm.averagePaceLabel,
    description:
      "記録された訪問日の平均間隔",
  };
}

function RhythmItem({
  icon,
  label,
  value,
  description,
}: RhythmItemProps) {
  return (
    <div
      className="
        flex
        min-h-[10.5rem]
        flex-col
        justify-between
        rounded-[1.5rem]
        border border-border/50
        bg-background/55
        p-5
      "
    >
      <div>
        <div
          className="
            flex
            size-10
            items-center
            justify-center
            rounded-full
            bg-secondary/25
            text-foreground
          "
        >
          {icon}
        </div>

        <p
          className="
            mt-4
            text-sm
            font-medium
            text-muted-foreground
          "
        >
          {label}
        </p>
      </div>

      <div className="mt-5">
        <p
          className="
            wrap-break-word
            text-2xl
            font-semibold
            tracking-[-0.03em]
            text-foreground
            sm:text-3xl
          "
        >
          {value}
        </p>

        <p
          className="
            mt-2
            text-xs
            leading-5
            text-muted-foreground
          "
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export function SaunaRhythmCard({
  rhythm,
}: SaunaRhythmCardProps) {
  const averagePace =
    getAveragePaceContent(rhythm);

  return (
    <section
      aria-labelledby="sauna-rhythm-heading"
      className="
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
      <div
        className="
          flex
          flex-col
          gap-4
          border-b border-border/45
          px-6
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
        "
      >
        <div>
          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              bg-accent/20
              px-3
              py-1.5
              text-xs
              font-semibold
              uppercase
              tracking-[0.12em]
              text-foreground
            "
          >
            <Waves
              className="size-3.5"
              strokeWidth={1.8}
            />

            Sauna Rhythm
          </div>

          <h2
            id="sauna-rhythm-heading"
            className="
              mt-4
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            あなたのサウナリズム
          </h2>

          <p
            className="
              mt-2
              max-w-xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            回数を競うのではなく、最近のサウナとの付き合い方を振り返ります。
          </p>
        </div>

        <p
          className="
            text-xs
            leading-5
            text-muted-foreground/75
          "
        >
          訪問日の記録から自動集計
        </p>
      </div>

      <div
        className="
          grid
          gap-4
          p-4
          sm:grid-cols-3
          sm:p-6
        "
      >
        <RhythmItem
          icon={
            <CalendarDays
              className="size-5"
              strokeWidth={1.8}
            />
          }
          label="今月のサ活"
          value={`${rhythm.monthlyVisits}回`}
          description="今月記録したサウナ訪問数"
        />

        <RhythmItem
          icon={
            <Activity
              className="size-5"
              strokeWidth={1.8}
            />
          }
          label="直近30日"
          value={`${rhythm.lastThirtyDaysVisits}回`}
          description="今日を含む直近30日間の訪問数"
        />

        <RhythmItem
          icon={
            <Waves
              className="size-5"
              strokeWidth={1.8}
            />
          }
          label="平均ペース"
          value={averagePace.value}
          description={averagePace.description}
        />
      </div>
    </section>
  );
}
