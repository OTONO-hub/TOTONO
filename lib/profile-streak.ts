export type ProfilePostForStreak = {
  visit_date: string;
};

export type SaunaStreak = {
  currentStreak: number;
  longestStreak: number;
  activeThisWeek: boolean;
  lastVisitDate: string | null;
  totalActiveWeeks: number;
};

/*
 * 1日をミリ秒へ変換した値です。
 */
const ONE_DAY_MS =
  24 * 60 * 60 * 1000;

/*
 * 日本時間における今日の日付を
 * YYYY-MM-DD形式で取得します。
 *
 * 例:
 * 2026-07-25
 */
function getCurrentDateInJapan(): string {
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(new Date());
}

/*
 * YYYY-MM-DD形式の日付を、
 * UTC基準のDateへ変換します。
 *
 * 時刻を持たない日付として扱うことで、
 * 実行環境のタイムゾーンによる
 * 日付のずれを防ぎます。
 */
function parseDateKey(
  dateKey: string
): Date | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(
    dateKey
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(
      year,
      month - 1,
      day
    )
  );

  /*
   * 2026-02-31のような存在しない日付を
   * JavaScriptが自動補正することがあります。
   *
   * 元の日付と変換後の日付を比較し、
   * 存在しない日付を除外します。
   */
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return date;
}

/*
 * DateをYYYY-MM-DD形式へ変換します。
 */
function formatDateKey(
  date: Date
): string {
  const year = date.getUTCFullYear();

  const month = String(
    date.getUTCMonth() + 1
  ).padStart(2, "0");

  const day = String(
    date.getUTCDate()
  ).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/*
 * 指定された日付が含まれる週の
 * 月曜日を取得します。
 *
 * TOTONOでは、
 *
 * 月曜日
 * ↓
 * 日曜日
 *
 * を1週間として扱います。
 */
function getMondayOfWeek(
  date: Date
): Date {
  const dayOfWeek = date.getUTCDay();

  /*
   * JavaScriptでは、
   *
   * 日曜日 = 0
   * 月曜日 = 1
   * 火曜日 = 2
   * ...
   *
   * となっています。
   */
  const daysSinceMonday =
    dayOfWeek === 0
      ? 6
      : dayOfWeek - 1;

  return new Date(
    date.getTime() -
      daysSinceMonday * ONE_DAY_MS
  );
}

/*
 * 週の月曜日を、
 * 比較可能なYYYY-MM-DD形式で取得します。
 */
function getWeekKey(
  date: Date
): string {
  return formatDateKey(
    getMondayOfWeek(date)
  );
}

/*
 * 指定された週から、
 * 前の週のキーを取得します。
 */
function getPreviousWeekKey(
  weekKey: string
): string | null {
  const date = parseDateKey(weekKey);

  if (!date) {
    return null;
  }

  return formatDateKey(
    new Date(
      date.getTime() -
        7 * ONE_DAY_MS
    )
  );
}

/*
 * サ活投稿から、
 * 週単位の連続記録を計算します。
 *
 * currentStreak:
 * 現在継続中の連続週数
 *
 * longestStreak:
 * 過去を含めた最長連続週数
 *
 * activeThisWeek:
 * 今週すでにサ活を記録したか
 *
 * lastVisitDate:
 * 最後にサウナへ行った日
 *
 * totalActiveWeeks:
 * サ活が1回以上あった週の合計
 */
export function calculateSaunaStreak(
  posts: ProfilePostForStreak[],
  referenceDate = getCurrentDateInJapan()
): SaunaStreak {
  const validVisitDates = posts
    .map((post) =>
      post.visit_date.trim()
    )
    .filter(Boolean)
    .filter(
      (visitDate) =>
        parseDateKey(visitDate) !== null
    );

  if (validVisitDates.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      activeThisWeek: false,
      lastVisitDate: null,
      totalActiveWeeks: 0,
    };
  }

  /*
   * 同じ日に複数投稿があっても、
   * 1回の訪問日として扱います。
   */
  const uniqueVisitDates = [
    ...new Set(validVisitDates),
  ].sort();

  const lastVisitDate =
    uniqueVisitDates.at(-1) ?? null;

  /*
   * 同じ週に複数回訪問しても、
   * アクティブな週は1週間として扱います。
   */
  const activeWeekKeys = [
    ...new Set(
      uniqueVisitDates
        .map(parseDateKey)
        .filter(
          (date): date is Date =>
            date !== null
        )
        .map(getWeekKey)
    ),
  ].sort();

  const activeWeekSet = new Set(
    activeWeekKeys
  );

  /*
   * 最長連続週数を計算します。
   */
  let longestStreak = 0;
  let runningStreak = 0;
  let previousWeekKey: string | null =
    null;

  for (const weekKey of activeWeekKeys) {
    if (!previousWeekKey) {
      runningStreak = 1;
    } else {
      const expectedWeekKey =
        formatDateKey(
          new Date(
            parseDateKey(
              previousWeekKey
            )!.getTime() +
              7 * ONE_DAY_MS
          )
        );

      if (weekKey === expectedWeekKey) {
        runningStreak += 1;
      } else {
        runningStreak = 1;
      }
    }

    longestStreak = Math.max(
      longestStreak,
      runningStreak
    );

    previousWeekKey = weekKey;
  }

  const parsedReferenceDate =
    parseDateKey(referenceDate) ??
    parseDateKey(
      getCurrentDateInJapan()
    )!;

  const currentWeekKey =
    getWeekKey(parsedReferenceDate);

  const previousCurrentWeekKey =
    getPreviousWeekKey(currentWeekKey);

  const activeThisWeek =
    activeWeekSet.has(currentWeekKey);

  /*
   * 今週まだサ活していなくても、
   * 先週まで記録が続いている場合は
   * ストリークを維持します。
   *
   * 月曜日になった瞬間に0へ戻ることを防ぎ、
   * 今週中に次のサ活を行える設計です。
   */
  let streakStartWeekKey:
    | string
    | null = null;

  if (activeThisWeek) {
    streakStartWeekKey =
      currentWeekKey;
  } else if (
    previousCurrentWeekKey &&
    activeWeekSet.has(
      previousCurrentWeekKey
    )
  ) {
    streakStartWeekKey =
      previousCurrentWeekKey;
  }

  let currentStreak = 0;
  let checkingWeekKey =
    streakStartWeekKey;

  while (
    checkingWeekKey &&
    activeWeekSet.has(
      checkingWeekKey
    )
  ) {
    currentStreak += 1;

    checkingWeekKey =
      getPreviousWeekKey(
        checkingWeekKey
      );
  }

  return {
    currentStreak,
    longestStreak,
    activeThisWeek,
    lastVisitDate,
    totalActiveWeeks:
      activeWeekKeys.length,
  };
}
