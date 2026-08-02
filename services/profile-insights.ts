export type ProfilePostForInsights = {
  sauna_id?: string | null;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
};

export type MonthlyActivity = {
  yearMonth: string;
  label: string;
  visitCount: number;
};

export type TopVisitedSauna = {
  saunaId: string | null;
  saunaName: string;
  visitCount: number;
};

export type AnnualSaunaReport = {
  year: number;
  visitCount: number;
  visitedSaunas: number;
  totalSets: number;
  averageRating: string;
  topSauna: TopVisitedSauna | null;
  busiestMonth: MonthlyActivity | null;
};

export type ProfileInsights = {
  totalSaunaVisits: number;
  visitedSaunas: number;
  totalSets: number;
  monthlyVisits: number;
  averageRating: string;
  highestRating: string;
  monthlyActivities: MonthlyActivity[];
  topVisitedSaunas: TopVisitedSauna[];
  annualReport: AnnualSaunaReport;
  hasFirstSteam: boolean;
  hasSaunaLover: boolean;
  hasExplorer: boolean;
  hasPerfection: boolean;
  saunaLoverRemaining: number;
  explorerRemaining: number;
};

function getCurrentYearMonthInJapan(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

function getCurrentDatePartsInJapan(): {
  year: number;
  month: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "numeric",
  }).formatToParts(new Date());

  const year = Number(
    parts.find((part) => part.type === "year")?.value
  );

  const month = Number(
    parts.find((part) => part.type === "month")?.value
  );

  return {
    year,
    month,
  };
}

function formatYearMonth(
  year: number,
  month: number
): string {
  return `${year}-${String(month).padStart(2, "0")}`;
}

function normalizeSaunaName(
  saunaName: string
): string {
  return saunaName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("ja-JP");
}

function getSaunaAggregationKey(
  post: ProfilePostForInsights
): string {
  const saunaId =
    typeof post.sauna_id === "string" &&
    post.sauna_id.trim()
      ? post.sauna_id.trim()
      : null;

  if (saunaId) {
    return `id:${saunaId}`;
  }

  const normalizedSaunaName =
    normalizeSaunaName(post.sauna_name);

  return normalizedSaunaName
    ? `name:${normalizedSaunaName}`
    : "";
}

function getVisitedSaunaCount(
  posts: ProfilePostForInsights[]
): number {
  return new Set(
    posts
      .map((post) =>
        getSaunaAggregationKey(post)
      )
      .filter(Boolean)
  ).size;
}

function getValidRatings(
  posts: ProfilePostForInsights[]
): number[] {
  return posts
    .map((post) => post.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" &&
        Number.isFinite(rating)
    );
}

function getAverageRating(
  posts: ProfilePostForInsights[]
): string {
  const ratings = getValidRatings(posts);

  if (ratings.length === 0) {
    return "-";
  }

  const totalRating = ratings.reduce(
    (total, rating) => total + rating,
    0
  );

  return (
    totalRating / ratings.length
  ).toFixed(1);
}

function getTotalSets(
  posts: ProfilePostForInsights[]
): number {
  return posts.reduce(
    (total, post) => {
      const setCount =
        typeof post.set_count === "number" &&
        Number.isFinite(post.set_count)
          ? post.set_count
          : 0;

      return total + setCount;
    },
    0
  );
}

function getMonthlyActivities(
  posts: ProfilePostForInsights[]
): MonthlyActivity[] {
  const { year, month } =
    getCurrentDatePartsInJapan();

  return Array.from(
    { length: 6 },
    (_, index) => {
      const monthOffset = index - 5;

      const targetDate = new Date(
        Date.UTC(
          year,
          month - 1 + monthOffset,
          1
        )
      );

      const targetYear =
        targetDate.getUTCFullYear();

      const targetMonth =
        targetDate.getUTCMonth() + 1;

      const yearMonth = formatYearMonth(
        targetYear,
        targetMonth
      );

      const visitCount = posts.filter(
        (post) =>
          typeof post.visit_date === "string" &&
          post.visit_date.startsWith(yearMonth)
      ).length;

      return {
        yearMonth,
        label: `${targetMonth}月`,
        visitCount,
      };
    }
  );
}

function getAnnualMonthlyActivities(
  posts: ProfilePostForInsights[],
  year: number
): MonthlyActivity[] {
  return Array.from(
    { length: 12 },
    (_, index) => {
      const month = index + 1;

      const yearMonth = formatYearMonth(
        year,
        month
      );

      const visitCount = posts.filter(
        (post) =>
          typeof post.visit_date === "string" &&
          post.visit_date.startsWith(yearMonth)
      ).length;

      return {
        yearMonth,
        label: `${month}月`,
        visitCount,
      };
    }
  );
}

function getTopVisitedSaunas(
  posts: ProfilePostForInsights[],
  limit = 3
): TopVisitedSauna[] {
  const saunaVisitMap = new Map<
    string,
    TopVisitedSauna
  >();

  for (const post of posts) {
    const saunaId =
      typeof post.sauna_id === "string" &&
      post.sauna_id.trim()
        ? post.sauna_id.trim()
        : null;

    const saunaName =
      typeof post.sauna_name === "string"
        ? post.sauna_name
            .trim()
            .replace(/\s+/g, " ")
        : "";

    if (!saunaName) {
      continue;
    }

    const normalizedSaunaName =
      normalizeSaunaName(saunaName);

    const aggregationKey = saunaId
      ? `id:${saunaId}`
      : `name:${normalizedSaunaName}`;

    const existingSauna =
      saunaVisitMap.get(aggregationKey);

    if (existingSauna) {
      existingSauna.visitCount += 1;
      continue;
    }

    saunaVisitMap.set(aggregationKey, {
      saunaId,
      saunaName,
      visitCount: 1,
    });
  }

  return Array.from(saunaVisitMap.values())
    .sort((firstSauna, secondSauna) => {
      if (
        secondSauna.visitCount !==
        firstSauna.visitCount
      ) {
        return (
          secondSauna.visitCount -
          firstSauna.visitCount
        );
      }

      return firstSauna.saunaName.localeCompare(
        secondSauna.saunaName,
        "ja"
      );
    })
    .slice(0, limit);
}

function getBusiestMonth(
  monthlyActivities: MonthlyActivity[]
): MonthlyActivity | null {
  const activeMonths =
    monthlyActivities.filter(
      (activity) => activity.visitCount > 0
    );

  if (activeMonths.length === 0) {
    return null;
  }

  return activeMonths.reduce(
    (busiestMonth, currentMonth) => {
      if (
        currentMonth.visitCount >
        busiestMonth.visitCount
      ) {
        return currentMonth;
      }

      if (
        currentMonth.visitCount ===
          busiestMonth.visitCount &&
        currentMonth.yearMonth >
          busiestMonth.yearMonth
      ) {
        return currentMonth;
      }

      return busiestMonth;
    }
  );
}

function getAnnualSaunaReport(
  posts: ProfilePostForInsights[]
): AnnualSaunaReport {
  const { year } =
    getCurrentDatePartsInJapan();

  const yearPrefix = `${year}-`;

  const annualPosts = posts.filter(
    (post) =>
      typeof post.visit_date === "string" &&
      post.visit_date.startsWith(yearPrefix)
  );

  const annualMonthlyActivities =
    getAnnualMonthlyActivities(
      annualPosts,
      year
    );

  const annualTopSaunas =
    getTopVisitedSaunas(annualPosts, 1);

  return {
    year,
    visitCount: annualPosts.length,
    visitedSaunas:
      getVisitedSaunaCount(annualPosts),
    totalSets: getTotalSets(annualPosts),
    averageRating:
      getAverageRating(annualPosts),
    topSauna: annualTopSaunas[0] ?? null,
    busiestMonth: getBusiestMonth(
      annualMonthlyActivities
    ),
  };
}

export function getProfileInsights(
  posts: ProfilePostForInsights[]
): ProfileInsights {
  const totalSaunaVisits = posts.length;

  const visitedSaunas =
    getVisitedSaunaCount(posts);

  const ratings = getValidRatings(posts);

  const averageRating =
    getAverageRating(posts);

  const highestRating =
    ratings.length > 0
      ? Math.max(...ratings).toFixed(1)
      : "-";

  const totalSets = getTotalSets(posts);

  const currentYearMonth =
    getCurrentYearMonthInJapan();

  const monthlyVisits = posts.filter(
    (post) =>
      typeof post.visit_date === "string" &&
      post.visit_date.startsWith(
        currentYearMonth
      )
  ).length;

  const monthlyActivities =
    getMonthlyActivities(posts);

  const topVisitedSaunas =
    getTopVisitedSaunas(posts);

  const annualReport =
    getAnnualSaunaReport(posts);

  const hasFirstSteam =
    totalSaunaVisits >= 1;

  const hasSaunaLover =
    totalSaunaVisits >= 10;

  const hasExplorer =
    visitedSaunas >= 5;

  const hasPerfection =
    ratings.some(
      (rating) => rating === 5
    );

  return {
    totalSaunaVisits,
    visitedSaunas,
    totalSets,
    monthlyVisits,
    averageRating,
    highestRating,
    monthlyActivities,
    topVisitedSaunas,
    annualReport,
    hasFirstSteam,
    hasSaunaLover,
    hasExplorer,
    hasPerfection,
    saunaLoverRemaining: Math.max(
      10 - totalSaunaVisits,
      0
    ),
    explorerRemaining: Math.max(
      5 - visitedSaunas,
      0
    ),
  };
}
