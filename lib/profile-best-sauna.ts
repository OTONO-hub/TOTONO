export type ProfilePostForBestSauna = {
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
};

export type BestSaunaOfYear = {
  saunaName: string;
  visitCount: number;
  totalSetCount: number;
  averageRating: number;
  latestVisitDate: string;
};

type SaunaAggregate = {
  saunaName: string;
  normalizedSaunaName: string;
  visitCount: number;
  totalSetCount: number;
  totalRating: number;
  latestVisitDate: string;
};

/**
 * 日本時間における現在の年を取得します。
 */
function getCurrentYearInJapan(): number {
  const yearText = new Intl.DateTimeFormat(
    "en-US",
    {
      timeZone: "Asia/Tokyo",
      year: "numeric",
    }
  ).format(new Date());

  return Number(yearText);
}

/**
 * 施設名を比較用に正規化します。
 *
 * 前後の空白を削除し、
 * 大文字と小文字の違いを無視して
 * 同じ施設として集計できるようにします。
 */
function normalizeSaunaName(
  saunaName: string
): string {
  return saunaName
    .trim()
    .toLocaleLowerCase("ja-JP");
}

/**
 * 訪問日から年を取得します。
 *
 * visit_dateは
 * YYYY-MM-DD形式を想定しています。
 */
function getVisitYear(
  visitDate: string
): number | null {
  const match = visitDate.match(
    /^(\d{4})-\d{2}-\d{2}$/
  );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);

  return Number.isFinite(year)
    ? year
    : null;
}

/**
 * 平均評価を小数第1位に丸めます。
 */
function roundRating(
  rating: number
): number {
  return Math.round(rating * 10) / 10;
}

/**
 * 今年の投稿履歴から、
 * 年間ベストサウナを計算します。
 *
 * 判定順:
 * 1. 平均評価が高い
 * 2. 訪問回数が多い
 * 3. 最新訪問日が新しい
 */
export function calculateBestSaunaOfYear(
  posts: ProfilePostForBestSauna[]
): BestSaunaOfYear | null {
  const currentYear =
    getCurrentYearInJapan();

  const aggregates = new Map<
    string,
    SaunaAggregate
  >();

  for (const post of posts) {
    const saunaName =
      post.sauna_name.trim();

    if (!saunaName) {
      continue;
    }

    const visitYear =
      getVisitYear(post.visit_date);

    if (visitYear !== currentYear) {
      continue;
    }

    const normalizedSaunaName =
      normalizeSaunaName(saunaName);

    const current =
      aggregates.get(
        normalizedSaunaName
      );

    if (!current) {
      aggregates.set(
        normalizedSaunaName,
        {
          saunaName,
          normalizedSaunaName,
          visitCount: 1,
          totalSetCount:
            post.set_count ?? 0,
          totalRating:
            post.rating ?? 0,
          latestVisitDate:
            post.visit_date,
        }
      );

      continue;
    }

    current.visitCount += 1;
    current.totalSetCount +=
      post.set_count ?? 0;
    current.totalRating +=
      post.rating ?? 0;

    if (
      post.visit_date >
      current.latestVisitDate
    ) {
      current.latestVisitDate =
        post.visit_date;
    }
  }

  const candidates = Array.from(
    aggregates.values()
  );

  if (candidates.length === 0) {
    return null;
  }

  candidates.sort((a, b) => {
    const averageRatingA =
      a.totalRating / a.visitCount;

    const averageRatingB =
      b.totalRating / b.visitCount;

    if (
      averageRatingA !==
      averageRatingB
    ) {
      return (
        averageRatingB -
        averageRatingA
      );
    }

    if (
      a.visitCount !==
      b.visitCount
    ) {
      return (
        b.visitCount -
        a.visitCount
      );
    }

    return b.latestVisitDate.localeCompare(
      a.latestVisitDate
    );
  });

  const bestSauna = candidates[0];

  return {
    saunaName: bestSauna.saunaName,
    visitCount:
      bestSauna.visitCount,
    totalSetCount:
      bestSauna.totalSetCount,
    averageRating: roundRating(
      bestSauna.totalRating /
        bestSauna.visitCount
    ),
    latestVisitDate:
      bestSauna.latestVisitDate,
  };
}
