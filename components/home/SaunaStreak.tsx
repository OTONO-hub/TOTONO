import Link from "next/link";
import {
  ArrowRight,
  CalendarCheck,
  Flame,
  History,
  Trophy,
} from "lucide-react";

export type SaunaStreakPost = {
  visit_date: string;
};

type SaunaStreakProps = {
  posts: SaunaStreakPost[];
};

type WeekKey = {
  year: number;
  week: number;
};

export function SaunaStreak({
  posts,
}: SaunaStreakProps) {
  const validVisitDates = posts
    .map((post) =>
      createDateFromJapanDateText(
        post.visit_date
      )
    )
    .filter(
      (date) =>
        !Number.isNaN(date.getTime())
    )
    .sort(
      (dateA, dateB) =>
        dateB.getTime() -
        dateA.getTime()
    );

  const uniqueWeekKeys = createUniqueWeekKeys(
    validVisitDates
  );

  const currentWeekKey =
    getCurrentWeekKeyInJapan();

  const currentStreak =
    calculateCurrentStreak(
      uniqueWeekKeys,
      currentWeekKey
    );

  const longestStreak =
    calculateLongestStreak(
      uniqueWeekKeys
    );

  const lastVisitDate =
    validVisitDates[0] ?? null;

  const lastVisitLabel =
    createLastVisitLabel(
      lastVisitDate
    );

  const hasActivityThisWeek =
    uniqueWeekKeys.some(
      (weekKey) =>
        areSameWeekKey(
          weekKey,
          currentWeekKey
        )
    );

  const guideMessage =
    createGuideMessage({
      hasPosts:
        validVisitDates.length > 0,
      hasActivityThisWeek,
      currentStreak,
    });

  return (
    <section
      aria-labelledby="sauna-streak-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border/50
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
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-accent/20
                text-foreground
              "
            >
              <Flame
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.24em]
                text-muted-foreground
              "
            >
              Sauna Rhythm
            </p>
          </div>

          <h2
            id="sauna-streak-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            あなたのサ活ペース
          </h2>

          <p
            className="
              mt-2
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            無理のないペースで続けている、
            あなたのサウナ習慣です。
          </p>
        </div>

        <Link
          href="/posts/new"
          className="
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            bg-primary
            px-5
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
            sm:w-auto
          "
        >
          サ活を記録する

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>

      <div
        className="
          grid
          gap-4
          p-5
          sm:grid-cols-3
          sm:p-8
        "
      >
        <StreakCard
          label="現在のストリーク"
          value={`${currentStreak}`}
          unit="週"
          description={
            currentStreak > 0
              ? "継続中のサ活ペース"
              : "今週の記録から始まります"
          }
          icon={
            <Flame
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
          emphasized
        />

        <StreakCard
          label="最長ストリーク"
          value={`${longestStreak}`}
          unit="週"
          description="これまでの最長記録"
          icon={
            <Trophy
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
        />

        <StreakCard
          label="最後のサ活"
          value={lastVisitLabel.value}
          unit={lastVisitLabel.unit}
          description={
            lastVisitDate
              ? formatVisitDate(
                  lastVisitDate
                )
              : "まだ記録がありません"
          }
          icon={
            <History
              className="size-5"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          }
        />
      </div>

      <div
        className="
          border-t
          border-border/50
          px-5
          py-5
          sm:px-8
          sm:py-6
        "
      >
        <div
          className="
            flex
            items-start
            gap-3
            rounded-2xl
            border
            border-border/50
            bg-background/65
            px-4
            py-4
          "
        >
          <span
            className="
              mt-0.5
              flex
              size-8
              shrink-0
              items-center
              justify-center
              rounded-full
              bg-secondary/20
              text-foreground
            "
          >
            <CalendarCheck
              className="size-4"
              strokeWidth={1.8}
              aria-hidden="true"
            />
          </span>

          <p
            className="
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            {guideMessage}
          </p>
        </div>
      </div>
    </section>
  );
}

type StreakCardProps = {
  label: string;
  value: string;
  unit: string;
  description: string;
  icon: React.ReactNode;
  emphasized?: boolean;
};

function StreakCard({
  label,
  value,
  unit,
  description,
  icon,
  emphasized = false,
}: StreakCardProps) {
  return (
    <article
      className={`
        rounded-[1.5rem]
        border
        px-5
        py-5
        ${
          emphasized
            ? `
              border-accent/35
              bg-accent/10
            `
            : `
              border-border/55
              bg-background/70
            `
        }
      `}
    >
      <div
        className="
          flex
          items-center
          justify-between
          gap-3
        "
      >
        <p
          className="
            text-xs
            font-semibold
            text-muted-foreground
          "
        >
          {label}
        </p>

        <span
          className={`
            flex
            size-9
            items-center
            justify-center
            rounded-full
            text-foreground
            ${
              emphasized
                ? "bg-accent/25"
                : "bg-secondary/18"
            }
          `}
        >
          {icon}
        </span>
      </div>

      <div
        className="
          mt-5
          flex
          items-end
          gap-1.5
        "
      >
        <span
          className="
            text-3xl
            font-semibold
            tracking-[-0.05em]
            text-foreground
          "
        >
          {value}
        </span>

        {unit && (
          <span
            className="
              pb-1
              text-xs
              font-semibold
              text-muted-foreground
            "
          >
            {unit}
          </span>
        )}
      </div>

      <p
        className="
          mt-3
          text-xs
          leading-6
          text-muted-foreground
        "
      >
        {description}
      </p>
    </article>
  );
}

function createUniqueWeekKeys(
  dates: Date[]
): WeekKey[] {
  const weekKeyMap = new Map<
    string,
    WeekKey
  >();

  for (const date of dates) {
    const weekKey =
      getIsoWeekKey(date);

    weekKeyMap.set(
      createWeekKeyText(weekKey),
      weekKey
    );
  }

  return Array.from(
    weekKeyMap.values()
  ).sort(compareWeekKeysDescending);
}

function calculateCurrentStreak(
  weekKeys: WeekKey[],
  currentWeekKey: WeekKey
): number {
  if (weekKeys.length === 0) {
    return 0;
  }

  const weekKeyTexts = new Set(
    weekKeys.map(createWeekKeyText)
  );

  const hasCurrentWeek =
    weekKeyTexts.has(
      createWeekKeyText(
        currentWeekKey
      )
    );

  const startingWeekKey =
    hasCurrentWeek
      ? currentWeekKey
      : getPreviousWeekKey(
          currentWeekKey
        );

  if (
    !weekKeyTexts.has(
      createWeekKeyText(
        startingWeekKey
      )
    )
  ) {
    return 0;
  }

  let streak = 0;
  let targetWeekKey =
    startingWeekKey;

  while (
    weekKeyTexts.has(
      createWeekKeyText(
        targetWeekKey
      )
    )
  ) {
    streak += 1;

    targetWeekKey =
      getPreviousWeekKey(
        targetWeekKey
      );
  }

  return streak;
}

function calculateLongestStreak(
  weekKeys: WeekKey[]
): number {
  if (weekKeys.length === 0) {
    return 0;
  }

  const ascendingWeekKeys = [
    ...weekKeys,
  ].sort(compareWeekKeysAscending);

  let longestStreak = 1;
  let currentStreak = 1;

  for (
    let index = 1;
    index < ascendingWeekKeys.length;
    index += 1
  ) {
    const previousWeekKey =
      ascendingWeekKeys[index - 1];

    const currentWeekKey =
      ascendingWeekKeys[index];

    const expectedCurrentWeek =
      getNextWeekKey(
        previousWeekKey
      );

    if (
      areSameWeekKey(
        currentWeekKey,
        expectedCurrentWeek
      )
    ) {
      currentStreak += 1;
      longestStreak = Math.max(
        longestStreak,
        currentStreak
      );
    } else {
      currentStreak = 1;
    }
  }

  return longestStreak;
}

function getCurrentWeekKeyInJapan(): WeekKey {
  const todayText =
    new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());

  const today =
    createDateFromJapanDateText(
      todayText
    );

  return getIsoWeekKey(today);
}

function getIsoWeekKey(
  date: Date
): WeekKey {
  const normalizedDate =
    new Date(date);

  normalizedDate.setHours(
    0,
    0,
    0,
    0
  );

  const day =
    normalizedDate.getDay() || 7;

  normalizedDate.setDate(
    normalizedDate.getDate() +
      4 -
      day
  );

  const year =
    normalizedDate.getFullYear();

  const yearStart = new Date(
    year,
    0,
    1
  );

  const week = Math.ceil(
    (
      (
        normalizedDate.getTime() -
        yearStart.getTime()
      ) /
        86400000 +
      1
    ) / 7
  );

  return {
    year,
    week,
  };
}

function getPreviousWeekKey(
  weekKey: WeekKey
): WeekKey {
  const date =
    createDateFromWeekKey(
      weekKey
    );

  date.setDate(
    date.getDate() - 7
  );

  return getIsoWeekKey(date);
}

function getNextWeekKey(
  weekKey: WeekKey
): WeekKey {
  const date =
    createDateFromWeekKey(
      weekKey
    );

  date.setDate(
    date.getDate() + 7
  );

  return getIsoWeekKey(date);
}

function createDateFromWeekKey(
  weekKey: WeekKey
): Date {
  const januaryFourth = new Date(
    weekKey.year,
    0,
    4
  );

  const januaryFourthDay =
    januaryFourth.getDay() || 7;

  const mondayOfFirstWeek =
    new Date(januaryFourth);

  mondayOfFirstWeek.setDate(
    januaryFourth.getDate() -
      januaryFourthDay +
      1
  );

  const result = new Date(
    mondayOfFirstWeek
  );

  result.setDate(
    mondayOfFirstWeek.getDate() +
      (weekKey.week - 1) * 7
  );

  return result;
}

function compareWeekKeysAscending(
  weekKeyA: WeekKey,
  weekKeyB: WeekKey
): number {
  return (
    createDateFromWeekKey(
      weekKeyA
    ).getTime() -
    createDateFromWeekKey(
      weekKeyB
    ).getTime()
  );
}

function compareWeekKeysDescending(
  weekKeyA: WeekKey,
  weekKeyB: WeekKey
): number {
  return (
    compareWeekKeysAscending(
      weekKeyB,
      weekKeyA
    )
  );
}

function createWeekKeyText(
  weekKey: WeekKey
): string {
  return `${weekKey.year}-${weekKey.week}`;
}

function areSameWeekKey(
  weekKeyA: WeekKey,
  weekKeyB: WeekKey
): boolean {
  return (
    weekKeyA.year ===
      weekKeyB.year &&
    weekKeyA.week ===
      weekKeyB.week
  );
}

function createLastVisitLabel(
  lastVisitDate: Date | null
): {
  value: string;
  unit: string;
} {
  if (!lastVisitDate) {
    return {
      value: "—",
      unit: "",
    };
  }

  const todayText =
    new Intl.DateTimeFormat(
      "sv-SE",
      {
        timeZone: "Asia/Tokyo",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }
    ).format(new Date());

  const today =
    createDateFromJapanDateText(
      todayText
    );

  const differenceInMilliseconds =
    today.getTime() -
    lastVisitDate.getTime();

  const differenceInDays = Math.max(
    0,
    Math.floor(
      differenceInMilliseconds /
        86400000
    )
  );

  if (differenceInDays === 0) {
    return {
      value: "今日",
      unit: "",
    };
  }

  return {
    value: `${differenceInDays}`,
    unit: "日前",
  };
}

function formatVisitDate(
  date: Date
): string {
  return new Intl.DateTimeFormat(
    "ja-JP",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "long",
      day: "numeric",
    }
  ).format(date);
}

function createGuideMessage({
  hasPosts,
  hasActivityThisWeek,
  currentStreak,
}: {
  hasPosts: boolean;
  hasActivityThisWeek: boolean;
  currentStreak: number;
}): string {
  if (!hasPosts) {
    return "最初のサ活を記録すると、あなたのサウナ習慣がここに表示されます。";
  }

  if (hasActivityThisWeek) {
    return currentStreak > 1
      ? `${currentStreak}週連続のサ活を達成しています。今週も自分らしいペースで整えています。`
      : "今週のサ活が記録されています。ここから新しいペースを作っていきましょう。";
  }

  if (currentStreak > 0) {
    return `先週まで${currentStreak}週連続でサ活を記録しています。今週記録するとストリークを継続できます。`;
  }

  return "今週のサ活を記録すると、新しいストリークが始まります。";
}

function createDateFromJapanDateText(
  dateText: string
): Date {
  const normalizedDateText =
    dateText.slice(0, 10);

  return new Date(
    `${normalizedDateText}T00:00:00+09:00`
  );
}
