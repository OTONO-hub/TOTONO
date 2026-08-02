export type SaunaRhythmPost = {
  visit_date: string;
};

export type SaunaRhythm = {
  monthlyVisits: number;
  lastThirtyDaysVisits: number;
  averageIntervalDays: number | null;
  averagePaceLabel: string;
};

const JAPAN_TIME_ZONE = "Asia/Tokyo";

const MILLISECONDS_PER_DAY =
  1000 * 60 * 60 * 24;

/**
 * Dateオブジェクトを、日本時間の
 * YYYY-MM-DD形式へ変換します。
 */
function formatDateInJapan(
  date: Date
): string {
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone: JAPAN_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    }
  ).format(date);
}

/**
 * YYYY-MM-DD形式の日付文字列を、
 * UTC午前0時のDateオブジェクトへ変換します。
 *
 * visit_dateに時刻が含まれている場合も、
 * 先頭の年月日のみを使用します。
 */
function parseVisitDate(
  dateString: string
): Date | null {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})/.exec(
      dateString
    );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const parsedDate = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (
    Number.isNaN(parsedDate.getTime())
  ) {
    return null;
  }

  /*
   * 2026-02-31のような存在しない日付を
   * Dateが自動補正してしまうことを防ぎます。
   */
  if (
    parsedDate.getUTCFullYear() !== year ||
    parsedDate.getUTCMonth() !==
      month - 1 ||
    parsedDate.getUTCDate() !== day
  ) {
    return null;
  }

  return parsedDate;
}

/**
 * DateオブジェクトをYYYY-MM-DD形式へ変換します。
 *
 * この関数で扱うDateはUTC午前0時として
 * 作成されているため、UTCの値を使用します。
 */
function formatUtcDate(
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

/**
 * 2つの日付の差を日数で返します。
 */
function getDifferenceInDays(
  earlierDate: Date,
  laterDate: Date
): number {
  const differenceInMilliseconds =
    laterDate.getTime() -
    earlierDate.getTime();

  return Math.floor(
    differenceInMilliseconds /
      MILLISECONDS_PER_DAY
  );
}

/**
 * 平均ペースの表示文言を作成します。
 */
function createAveragePaceLabel(
  averageIntervalDays: number | null,
  uniqueVisitDayCount: number
): string {
  if (uniqueVisitDayCount === 0) {
    return "まだ記録がありません";
  }

  if (
    uniqueVisitDayCount === 1 ||
    averageIntervalDays === null
  ) {
    return "記録を続けると表示されます";
  }

  if (averageIntervalDays <= 1) {
    return "約1日に1回";
  }

  return `約${averageIntervalDays}日に1回`;
}

/**
 * 投稿履歴からSauna Rhythmを計算します。
 */
export function calculateSaunaRhythm(
  posts: SaunaRhythmPost[],
  now: Date = new Date()
): SaunaRhythm {
  /*
   * Vercelなどの実行環境に左右されないよう、
   * 今日の日付を日本時間で取得します。
   */
  const todayInJapan =
    formatDateInJapan(now);

  const today =
    parseVisitDate(todayInJapan);

  if (!today) {
    return {
      monthlyVisits: 0,
      lastThirtyDaysVisits: 0,
      averageIntervalDays: null,
      averagePaceLabel:
        "計算できませんでした",
    };
  }

  const currentYearMonth =
    todayInJapan.slice(0, 7);

  /*
   * 有効な訪問日だけを取り出します。
   *
   * 不正な日付と未来の日付は
   * 集計対象から除外します。
   */
  const validVisitDates = posts
    .map((post) =>
      parseVisitDate(post.visit_date)
    )
    .filter(
      (date): date is Date =>
        date !== null
    )
    .filter(
      (date) =>
        date.getTime() <=
        today.getTime()
    )
    .sort(
      (dateA, dateB) =>
        dateA.getTime() -
        dateB.getTime()
    );

  /*
   * 今月の有効な投稿数を計算します。
   *
   * 同じ日に複数投稿がある場合は、
   * 投稿数分をサ活回数として数えます。
   */
  const monthlyVisits =
    validVisitDates.filter(
      (visitDate) =>
        formatUtcDate(
          visitDate
        ).startsWith(
          currentYearMonth
        )
    ).length;

  /*
   * 今日を0日目として、
   * 29日前までを直近30日として数えます。
   */
  const lastThirtyDaysVisits =
    validVisitDates.filter(
      (visitDate) => {
        const differenceInDays =
          getDifferenceInDays(
            visitDate,
            today
          );

        return (
          differenceInDays >= 0 &&
          differenceInDays < 30
        );
      }
    ).length;

  /*
   * 平均ペースの計算では、
   * 同じ日の重複投稿を1日にまとめます。
   */
  const uniqueVisitDateStrings = [
    ...new Set(
      validVisitDates.map(
        formatUtcDate
      )
    ),
  ];

  const uniqueVisitDates =
    uniqueVisitDateStrings.map(
      (dateString) => {
        const parsedDate =
          parseVisitDate(
            dateString
          );

        /*
         * uniqueVisitDateStringsは、
         * validVisitDatesから作成しているため
         * 通常nullにはなりません。
         */
        return parsedDate;
      }
    ).filter(
      (date): date is Date =>
        date !== null
    );

  let averageIntervalDays:
    | number
    | null = null;

  if (uniqueVisitDates.length >= 2) {
    let totalIntervalDays = 0;

    for (
      let index = 1;
      index < uniqueVisitDates.length;
      index += 1
    ) {
      const previousVisitDate =
        uniqueVisitDates[index - 1];

      const currentVisitDate =
        uniqueVisitDates[index];

      totalIntervalDays +=
        getDifferenceInDays(
          previousVisitDate,
          currentVisitDate
        );
    }

    const intervalCount =
      uniqueVisitDates.length - 1;

    averageIntervalDays = Math.max(
      1,
      Math.round(
        totalIntervalDays /
          intervalCount
      )
    );
  }

  return {
    monthlyVisits,
    lastThirtyDaysVisits,
    averageIntervalDays,
    averagePaceLabel:
      createAveragePaceLabel(
        averageIntervalDays,
        uniqueVisitDates.length
      ),
  };
}
