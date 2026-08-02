import {
  CalendarCheck2,
  Flame,
  History,
} from "lucide-react";

import type { SaunaStreak } from "@/lib/profile-streak";

type SaunaStreakCardProps = {
  streak: SaunaStreak;
};

function createStreakMessage(
  streak: SaunaStreak
): string {
  if (streak.totalActiveWeeks === 0) {
    return "最初のサ活を記録すると、ここからあなたの習慣が始まります。";
  }

  if (streak.activeThisWeek) {
    if (streak.currentStreak >= 8) {
      return "素晴らしい習慣です。今週のサ活も記録されています。";
    }

    if (streak.currentStreak >= 4) {
      return "安定したサウナ習慣が続いています。";
    }

    if (streak.currentStreak >= 2) {
      return "今週もサ活を記録しました。このペースで続けましょう。";
    }

    return "今週のサ活を記録しました。新しい連続記録の始まりです。";
  }

  if (streak.currentStreak > 0) {
    return "今週中にサ活を記録すると、現在の連続記録を更新できます。";
  }

  return "次のサ活から、新しい連続記録を始められます。";
}

function createCurrentStreakLabel(
  streak: SaunaStreak
): string {
  if (streak.currentStreak === 0) {
    return "記録準備中";
  }

  return `${streak.currentStreak}週連続`;
}

function createLastVisitLabel(
  lastVisitDate: string | null
): string {
  if (!lastVisitDate) {
    return "まだ記録がありません";
  }

  const match =
    /^(\d{4})-(\d{2})-(\d{2})$/.exec(
      lastVisitDate
    );

  if (!match) {
    return lastVisitDate;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  return `${year}年${month}月${day}日`;
}

export function SaunaStreakCard({
  streak,
}: SaunaStreakCardProps) {
  const message =
    createStreakMessage(streak);

  const currentStreakLabel =
    createCurrentStreakLabel(streak);

  const lastVisitLabel =
    createLastVisitLabel(
      streak.lastVisitDate
    );

  return (
    <section
      className="
        overflow-hidden
        rounded-[2rem]
        border border-black/5
        bg-white
        shadow-sm
      "
    >
      <div
        className="
          border-b border-black/5
          px-6 py-6
          sm:px-8
        "
      >
        <div
          className="
            flex flex-col gap-5
            sm:flex-row
            sm:items-start
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center gap-2
                rounded-full
                bg-[#fdd000]/20
                px-3 py-1.5
                text-xs font-semibold
                tracking-[0.16em]
                text-[#3e3a3a]
                uppercase
              "
            >
              <Flame
                aria-hidden="true"
                className="size-3.5"
              />

              Sauna Streak
            </div>

            <h2
              className="
                mt-4
                text-2xl font-semibold
                tracking-[-0.03em]
                text-[#3e3a3a]
              "
            >
              サウナ習慣
            </h2>

            <p
              className="
                mt-2 max-w-xl
                text-sm leading-7
                text-[#3e3a3a]/65
              "
            >
              週に1回以上のサ活を、
              連続して記録した週数です。
            </p>
          </div>

          <div
            className="
              rounded-[1.5rem]
              bg-[#3e3a3a]
              px-5 py-4
              text-white
              sm:min-w-44
            "
          >
            <p
              className="
                text-xs font-medium
                tracking-[0.14em]
                text-white/55
                uppercase
              "
            >
              Current Streak
            </p>

            <p
              className="
                mt-2 text-2xl
                font-semibold
                tracking-[-0.03em]
              "
            >
              {currentStreakLabel}
            </p>

            <p
              className="
                mt-1 text-xs
                leading-5
                text-white/60
              "
            >
              {streak.activeThisWeek
                ? "今週のサ活を記録済み"
                : "今週はまだ未記録"}
            </p>
          </div>
        </div>
      </div>

      <div
        className="
          grid gap-4
          px-6 py-6
          sm:grid-cols-3
          sm:px-8
        "
      >
        <div
          className="
            rounded-[1.5rem]
            border border-black/5
            bg-[#e6e5ef]/45
            p-5
          "
        >
          <div
            className="
              flex items-center gap-2
              text-[#3e3a3a]/55
            "
          >
            <Flame
              aria-hidden="true"
              className="size-4"
            />

            <p
              className="
                text-xs font-medium
                tracking-[0.12em]
                uppercase
              "
            >
              Current
            </p>
          </div>

          <p
            className="
              mt-4 text-3xl
              font-semibold
              tracking-[-0.04em]
              text-[#3e3a3a]
            "
          >
            {streak.currentStreak}
            <span
              className="
                ml-1 text-sm
                font-medium
                text-[#3e3a3a]/45
              "
            >
              週
            </span>
          </p>

          <p
            className="
              mt-2 text-sm
              text-[#3e3a3a]/55
            "
          >
            現在の連続記録
          </p>
        </div>

        <div
          className="
            rounded-[1.5rem]
            border border-black/5
            bg-[#e6e5ef]/45
            p-5
          "
        >
          <div
            className="
              flex items-center gap-2
              text-[#3e3a3a]/55
            "
          >
            <History
              aria-hidden="true"
              className="size-4"
            />

            <p
              className="
                text-xs font-medium
                tracking-[0.12em]
                uppercase
              "
            >
              Longest
            </p>
          </div>

          <p
            className="
              mt-4 text-3xl
              font-semibold
              tracking-[-0.04em]
              text-[#3e3a3a]
            "
          >
            {streak.longestStreak}
            <span
              className="
                ml-1 text-sm
                font-medium
                text-[#3e3a3a]/45
              "
            >
              週
            </span>
          </p>

          <p
            className="
              mt-2 text-sm
              text-[#3e3a3a]/55
            "
          >
            過去最長の連続記録
          </p>
        </div>

        <div
          className="
            rounded-[1.5rem]
            border border-black/5
            bg-[#e6e5ef]/45
            p-5
          "
        >
          <div
            className="
              flex items-center gap-2
              text-[#3e3a3a]/55
            "
          >
            <CalendarCheck2
              aria-hidden="true"
              className="size-4"
            />

            <p
              className="
                text-xs font-medium
                tracking-[0.12em]
                uppercase
              "
            >
              Active Weeks
            </p>
          </div>

          <p
            className="
              mt-4 text-3xl
              font-semibold
              tracking-[-0.04em]
              text-[#3e3a3a]
            "
          >
            {streak.totalActiveWeeks}
            <span
              className="
                ml-1 text-sm
                font-medium
                text-[#3e3a3a]/45
              "
            >
              週
            </span>
          </p>

          <p
            className="
              mt-2 text-sm
              text-[#3e3a3a]/55
            "
          >
            サ活を記録した週
          </p>
        </div>
      </div>

      <div
        className="
          mx-6 mb-6
          rounded-[1.5rem]
          border border-black/5
          bg-[#9fd9f6]/15
          px-5 py-5
          sm:mx-8
        "
      >
        <p
          className="
            text-sm font-medium
            leading-7
            text-[#3e3a3a]
          "
        >
          {message}
        </p>

        <div
          className="
            mt-3 flex
            flex-col gap-1
            text-xs
            text-[#3e3a3a]/55
            sm:flex-row
            sm:items-center
            sm:justify-between
          "
        >
          <span>
            最終サ活：{lastVisitLabel}
          </span>

          <span>
            1週間は月曜日から日曜日
          </span>
        </div>
      </div>
    </section>
  );
}
