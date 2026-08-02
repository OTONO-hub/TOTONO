import type { SupabaseClient } from "@supabase/supabase-js";

const DEFAULT_RECENT_ENTRY_LIMIT = 4;

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
  favoriteSaunas: JournalFavoriteSauna[];
  reflectionMessage: string;
};

/**
 * 日本時間における現在の年月を
 * YYYY-MM形式で返します。
 *
 * 例：
 * 2026-07
 */
function getCurrentYearMonthInJapan(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
  }).format(new Date());
}

/**
 * Journalの見出しで使用する
 * 日本語の年月表記を返します。
 *
 * 例：
 * 2026年7月
 */
function getMonthLabel(yearMonth: string): string {
  const [year, month] = yearMonth.split("-");

  const monthNumber = Number(month);

  if (
    !year ||
    !Number.isInteger(monthNumber) ||
    monthNumber < 1 ||
    monthNumber > 12
  ) {
    return yearMonth;
  }

  return `${year}年${monthNumber}月`;
}

/**
 * 施設名の表記揺れを抑えるための
 * 比較用文字列を作成します。
 */
function normalizeSaunaName(saunaName: string): string {
  return saunaName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("ja-JP");
}

/**
 * 有効な評価だけを取り出します。
 */
function getValidRatings(
  posts: JournalPost[]
): number[] {
  return posts
    .map((post) => post.rating)
    .filter(
      (rating): rating is number =>
        typeof rating === "number" &&
        Number.isFinite(rating)
    );
}

/**
 * 投稿の平均評価を計算します。
 *
 * 投稿がない場合や、
 * 有効な評価がない場合はnullを返します。
 */
function calculateAverageRating(
  posts: JournalPost[]
): number | null {
  const ratings = getValidRatings(posts);

  if (ratings.length === 0) {
    return null;
  }

  const totalRating = ratings.reduce(
    (total, rating) => total + rating,
    0
  );

  return (
    Math.round(
      (totalRating / ratings.length) * 10
    ) / 10
  );
}

/**
 * 今月のJournalサマリーを作成します。
 */
function createJournalSummary(
  monthlyPosts: JournalPost[],
  yearMonth: string
): JournalSummary {
  const visitedSaunas = new Set(
    monthlyPosts
      .map((post) =>
        normalizeSaunaName(post.sauna_name)
      )
      .filter(Boolean)
  ).size;

  const totalSets = monthlyPosts.reduce(
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

  return {
    yearMonth,
    monthLabel: getMonthLabel(yearMonth),
    monthlyVisits: monthlyPosts.length,
    visitedSaunas,
    totalSets,
    averageRating:
      calculateAverageRating(monthlyPosts),
  };
}

/**
 * よく行く施設を集計します。
 *
 * 訪問回数が多い順に並べ、
 * 同じ回数の場合は直近の訪問日が
 * 新しい施設を先に表示します。
 */
function createFavoriteSaunas(
  posts: JournalPost[],
  limit: number
): JournalFavoriteSauna[] {
  const saunaMap = new Map<
    string,
    {
      saunaName: string;
      posts: JournalPost[];
    }
  >();

  for (const post of posts) {
    const normalizedName =
      normalizeSaunaName(post.sauna_name);

    if (!normalizedName) {
      continue;
    }

    const currentSauna = saunaMap.get(
      normalizedName
    );

    if (currentSauna) {
      currentSauna.posts.push(post);
      continue;
    }

    saunaMap.set(normalizedName, {
      saunaName: post.sauna_name.trim(),
      posts: [post],
    });
  }

  return [...saunaMap.values()]
    .map(({ saunaName, posts: saunaPosts }) => {
      const sortedPosts = [...saunaPosts].sort(
        (a, b) =>
          b.visit_date.localeCompare(a.visit_date)
      );

      return {
        saunaName,
        visitCount: saunaPosts.length,
        averageRating:
          calculateAverageRating(saunaPosts),
        latestVisitDate:
          sortedPosts[0]?.visit_date ?? "",
      };
    })
    .sort((a, b) => {
      if (b.visitCount !== a.visitCount) {
        return b.visitCount - a.visitCount;
      }

      return b.latestVisitDate.localeCompare(
        a.latestVisitDate
      );
    })
    .slice(0, limit);
}

/**
 * 今月のサ活内容から、
 * Journalに表示する短い振り返り文を作成します。
 *
 * 現段階ではルールベースで生成し、
 * 将来的にAIによる文章生成へ置き換えられる
 * 責務分離にしています。
 */
function createReflectionMessage(
  summary: JournalSummary,
  favoriteSaunas: JournalFavoriteSauna[]
): string {
  if (summary.monthlyVisits === 0) {
    return "今月のサ活はまだありません。次の整いを、ゆっくり探してみましょう。";
  }

  if (
    summary.monthlyVisits === 1 &&
    favoriteSaunas[0]
  ) {
    return `${favoriteSaunas[0].saunaName}で、今月最初のサ活を記録しました。`;
  }

  if (summary.monthlyVisits >= 8) {
    return `今月は${summary.monthlyVisits}回サウナを訪れています。自分らしい整いのリズムができています。`;
  }

  if (
    summary.visitedSaunas >= 3 &&
    favoriteSaunas[0]
  ) {
    return `今月は${summary.visitedSaunas}施設を訪れました。なかでも${favoriteSaunas[0].saunaName}によく足を運んでいます。`;
  }

  if (summary.averageRating !== null) {
    return `今月の平均評価は${summary.averageRating.toFixed(
      1
    )}です。心地よいサウナ時間を重ねています。`;
  }

  return `今月は${summary.monthlyVisits}回のサ活を記録しています。`;
}

/**
 * 現在のユーザーが投稿した
 * すべてのサ活を取得します。
 */
export async function getJournalPosts(
  supabase: SupabaseClient,
  userId: string
): Promise<JournalPost[]> {
  const { data, error } = await supabase
    .from("posts")
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
    .eq("user_id", userId)
    .order("visit_date", {
      ascending: false,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw error;
  }

  return (data ?? []) as JournalPost[];
}

/**
 * Journalトップ画面で必要なデータを
 * 一括で作成します。
 *
 * コンポーネント側でmap・filter・reduceを
 * 大量に書かなくて済むように、
 * 表示用データへの変換をこのサービスで行います。
 */
export async function getJournalData(
  supabase: SupabaseClient,
  userId: string,
  recentEntryLimit = DEFAULT_RECENT_ENTRY_LIMIT
): Promise<JournalData> {
  const posts = await getJournalPosts(
    supabase,
    userId
  );

  const currentYearMonth =
    getCurrentYearMonthInJapan();

  const monthlyPosts = posts.filter((post) =>
    post.visit_date.startsWith(currentYearMonth)
  );

  const summary = createJournalSummary(
    monthlyPosts,
    currentYearMonth
  );

  const favoriteSaunas = createFavoriteSaunas(
    posts,
    3
  );

  const safeRecentEntryLimit = Math.max(
    0,
    Math.floor(recentEntryLimit)
  );

  return {
    summary,
    monthlyPosts,
    recentEntries: posts.slice(
      0,
      safeRecentEntryLimit
    ),
    favoriteSaunas,
    reflectionMessage: createReflectionMessage(
      summary,
      favoriteSaunas
    ),
  };
}
