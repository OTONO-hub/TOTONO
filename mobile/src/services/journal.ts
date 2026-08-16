import {
  supabase,
} from "../lib/supabase";

const DEFAULT_RECENT_ENTRY_LIMIT =
  4;

const FAVORITE_SAUNA_LIMIT =
  3;

export type JournalPost = {
  id: string;
  user_id: string;
  sauna_id: string | null;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type JournalSummary = {
  yearMonth: string;
  monthLabel: string;
  monthlyVisits: number;
  visitedSaunas: number;
  totalSets: number;
  averageRating: number | null;
};

export type JournalFavoriteSauna = {
  saunaName: string;
  visitCount: number;
  averageRating: number | null;
  latestVisitDate: string;
};

export type JournalData = {
  summary: JournalSummary;
  recentEntries: JournalPost[];
  monthlyPosts: JournalPost[];
  favoriteSaunas:
    JournalFavoriteSauna[];
  reflectionMessage: string;
};

function assertRequiredText(
  value: string,
  label: string
): string {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new Error(
      `${label}が指定されていません。`
    );
  }

  return normalizedValue;
}

function getCurrentYearMonthInJapan():
  string {
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone:
        "Asia/Tokyo",

      year:
        "numeric",

      month:
        "2-digit",
    }
  ).format(
    new Date()
  );
}

function getMonthLabel(
  yearMonth: string
): string {
  const [
    year,
    month,
  ] =
    yearMonth.split(
      "-"
    );

  const monthNumber =
    Number(
      month
    );

  if (
    !year ||
    !Number.isInteger(
      monthNumber
    ) ||
    monthNumber <
      1 ||
    monthNumber >
      12
  ) {
    return yearMonth;
  }

  return `${year}年${monthNumber}月`;
}

function normalizeSaunaName(
  saunaName: string
): string {
  return saunaName
    .trim()
    .replace(
      /\s+/g,
      " "
    )
    .toLocaleLowerCase(
      "ja-JP"
    );
}

function getValidRatings(
  posts: JournalPost[]
): number[] {
  return posts
    .map(
      (
        post
      ) =>
        post.rating
    )
    .filter(
      (
        rating
      ): rating is number =>
        typeof rating ===
          "number" &&
        Number.isFinite(
          rating
        )
    );
}

function calculateAverageRating(
  posts: JournalPost[]
): number | null {
  const ratings =
    getValidRatings(
      posts
    );

  if (
    ratings.length ===
    0
  ) {
    return null;
  }

  const totalRating =
    ratings.reduce(
      (
        total,
        rating
      ) =>
        total +
        rating,
      0
    );

  return (
    Math.round(
      (totalRating /
        ratings.length) *
        10
    ) / 10
  );
}

function createJournalSummary(
  monthlyPosts:
    JournalPost[],
  yearMonth: string
): JournalSummary {
  const visitedSaunas =
    new Set(
      monthlyPosts
        .map(
          (
            post
          ) =>
            normalizeSaunaName(
              post.sauna_name
            )
        )
        .filter(
          Boolean
        )
    ).size;

  const totalSets =
    monthlyPosts.reduce(
      (
        total,
        post
      ) => {
        const setCount =
          typeof post.set_count ===
            "number" &&
          Number.isFinite(
            post.set_count
          )
            ? post.set_count
            : 0;

        return (
          total +
          setCount
        );
      },
      0
    );

  return {
    yearMonth,

    monthLabel:
      getMonthLabel(
        yearMonth
      ),

    monthlyVisits:
      monthlyPosts.length,

    visitedSaunas,

    totalSets,

    averageRating:
      calculateAverageRating(
        monthlyPosts
      ),
  };
}

function createFavoriteSaunas(
  posts: JournalPost[],
  limit: number
): JournalFavoriteSauna[] {
  const saunaMap =
    new Map<
      string,
      {
        saunaName: string;
        posts: JournalPost[];
      }
    >();

  for (
    const post of
    posts
  ) {
    const normalizedName =
      normalizeSaunaName(
        post.sauna_name
      );

    if (!normalizedName) {
      continue;
    }

    const currentSauna =
      saunaMap.get(
        normalizedName
      );

    if (currentSauna) {
      currentSauna
        .posts
        .push(
          post
        );

      continue;
    }

    saunaMap.set(
      normalizedName,
      {
        saunaName:
          post.sauna_name
            .trim(),

        posts: [
          post,
        ],
      }
    );
  }

  return [
    ...saunaMap
      .values(),
  ]
    .map(
      ({
        saunaName,
        posts:
          saunaPosts,
      }) => {
        const sortedPosts = [
          ...saunaPosts,
        ].sort(
          (
            first,
            second
          ) =>
            second
              .visit_date
              .localeCompare(
                first
                  .visit_date
              )
        );

        return {
          saunaName,

          visitCount:
            saunaPosts.length,

          averageRating:
            calculateAverageRating(
              saunaPosts
            ),

          latestVisitDate:
            sortedPosts[0]
              ?.visit_date ??
            "",
        };
      }
    )
    .sort(
      (
        first,
        second
      ) => {
        if (
          second.visitCount !==
          first.visitCount
        ) {
          return (
            second.visitCount -
            first.visitCount
          );
        }

        return second
          .latestVisitDate
          .localeCompare(
            first
              .latestVisitDate
          );
      }
    )
    .slice(
      0,
      Math.max(
        0,
        Math.floor(
          limit
        )
      )
    );
}

function createReflectionMessage(
  summary:
    JournalSummary,
  favoriteSaunas:
    JournalFavoriteSauna[]
): string {
  if (
    summary.monthlyVisits ===
    0
  ) {
    return "今月のサ活はまだありません。次の整いを、ゆっくり探してみましょう。";
  }

  if (
    summary.monthlyVisits ===
      1 &&
    favoriteSaunas[0]
  ) {
    return `${favoriteSaunas[0].saunaName}で、今月最初のサ活を記録しました。`;
  }

  if (
    summary.monthlyVisits >=
    8
  ) {
    return `今月は${summary.monthlyVisits}回サウナを訪れています。自分らしい整いのリズムができています。`;
  }

  if (
    summary.visitedSaunas >=
      3 &&
    favoriteSaunas[0]
  ) {
    return `今月は${summary.visitedSaunas}施設を訪れました。なかでも${favoriteSaunas[0].saunaName}によく足を運んでいます。`;
  }

  if (
    summary.averageRating !==
    null
  ) {
    return `今月の平均評価は${summary.averageRating.toFixed(
      1
    )}です。心地よいサウナ時間を重ねています。`;
  }

  return `今月は${summary.monthlyVisits}回のサ活を記録しています。`;
}

export async function getJournalPosts(
  userId: string
): Promise<
  JournalPost[]
> {
  if (!supabase) {
    throw new Error(
      "Supabaseの設定が見つかりません。"
    );
  }

  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "posts"
      )
      .select(
        `
          id,
          user_id,
          sauna_id,
          sauna_name,
          visit_date,
          set_count,
          rating,
          comment,
          image_url,
          created_at,
          updated_at
        `
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .order(
        "visit_date",
        {
          ascending:
            false,
        }
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      )
      .returns<
        JournalPost[]
      >();

  if (error) {
    throw new Error(
      `ジャーナルを取得できませんでした: ${error.message}`
    );
  }

  return (
    data ??
    []
  );
}

export async function getJournalData(
  userId: string,
  recentEntryLimit =
    DEFAULT_RECENT_ENTRY_LIMIT
): Promise<
  JournalData
> {
  const posts =
    await getJournalPosts(
      userId
    );

  const currentYearMonth =
    getCurrentYearMonthInJapan();

  const monthlyPosts =
    posts.filter(
      (
        post
      ) =>
        post.visit_date
          .startsWith(
            currentYearMonth
          )
    );

  const summary =
    createJournalSummary(
      monthlyPosts,
      currentYearMonth
    );

  const favoriteSaunas =
    createFavoriteSaunas(
      posts,
      FAVORITE_SAUNA_LIMIT
    );

  const safeRecentEntryLimit =
    Math.max(
      0,
      Math.floor(
        recentEntryLimit
      )
    );

  return {
    summary,

    monthlyPosts,

    recentEntries:
      posts.slice(
        0,
        safeRecentEntryLimit
      ),

    favoriteSaunas,

    reflectionMessage:
      createReflectionMessage(
        summary,
        favoriteSaunas
      ),
  };
}
