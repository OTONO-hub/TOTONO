import type { RecommendedSauna } from "@/services/recommendations";
import type {
  DashboardHeroMessage,
  DashboardPost,
  DashboardSummary,
} from "@/types/dashboard";

const JAPAN_TIME_ZONE = "Asia/Tokyo";
const FALLBACK_HOUR = 12;

type CreateTodayPickReasonInput = {
  preferredPrefecture: string | null;
  recommendationReason?: string | null;
  hasTodayPick: boolean;
};

/**
 * 日本時間の現在時刻から0〜23の「時」を取得します。
 */
export function getCurrentHourInJapan(
  date = new Date()
): number {
  const hourText =
    new Intl.DateTimeFormat(
      "en-US",
      {
        timeZone: JAPAN_TIME_ZONE,
        hour: "2-digit",
        hour12: false,
      }
    ).format(date);

  const parsedHour = Number(hourText);

  if (!Number.isFinite(parsedHour)) {
    return FALLBACK_HOUR;
  }

  if (parsedHour === 24) {
    return 0;
  }

  return parsedHour;
}

/**
 * 日本時間の現在年月をYYYY-MM形式で取得します。
 */
export function getCurrentYearMonthInJapan(
  date = new Date()
): string {
  return new Intl.DateTimeFormat(
    "sv-SE",
    {
      timeZone: JAPAN_TIME_ZONE,
      year: "numeric",
      month: "2-digit",
    }
  ).format(date);
}

/**
 * 時間帯に応じたHome Heroの文言を作成します。
 */
export function createHomeHeroMessage(
  date = new Date()
): DashboardHeroMessage {
  const currentHour =
    getCurrentHourInJapan(date);

  if (
    currentHour >= 5 &&
    currentHour < 12
  ) {
    return {
      greeting: "Good Morning.",
      heading:
        "今日の始まりを、軽やかに整える。",
      description:
        "朝の静かな時間に寄り添う一軒を、これまでのサ活から提案します。",
    };
  }

  if (
    currentHour >= 12 &&
    currentHour < 17
  ) {
    return {
      greeting: "Good Afternoon.",
      heading:
        "少し立ち止まり、気分を整える。",
      description:
        "午後の気分転換にちょうどよい一軒を、TOTONOが選びました。",
    };
  }

  if (
    currentHour >= 17 &&
    currentHour < 23
  ) {
    return {
      greeting: "Good Evening.",
      heading:
        "今日の疲れを、静かにほどく。",
      description:
        "一日の終わりを穏やかに過ごせる、今日の一軒を提案します。",
    };
  }

  return {
    greeting: "Good Night.",
    heading:
      "眠る前に、心と身体をゆるめる。",
    description:
      "夜遅くまで頑張った日に寄り添う、静かな整い方を提案します。",
  };
}

/**
 * ユーザーの投稿からHome表示用のサ活概要を作成します。
 */
export function createHomeSummary(
  posts: DashboardPost[],
  date = new Date()
): DashboardSummary {
  const currentYearMonth =
    getCurrentYearMonthInJapan(date);

  const monthlyVisits = posts.filter(
    (post) =>
      isVisitInYearMonth(
        post.visit_date,
        currentYearMonth
      )
  ).length;

  const uniqueSaunas = new Set(
    posts
      .map((post) =>
        normalizeSaunaName(
          post.sauna_name
        )
      )
      .filter(Boolean)
  ).size;

  return {
    monthlyVisits,
    uniqueSaunas,
    totalVisits: posts.length,
  };
}

/**
 * Today Pickとして表示する施設を取得します。
 */
export function selectTodayPick(
  recommendedSaunas: RecommendedSauna[]
): RecommendedSauna | null {
  return recommendedSaunas[0] ?? null;
}

/**
 * Today Pick以外のおすすめ施設を取得します。
 */
export function selectAlternativeRecommendations(
  recommendedSaunas: RecommendedSauna[]
): RecommendedSauna[] {
  return recommendedSaunas.slice(1);
}

/**
 * Today Pickを選んだ理由をHome表示用の文章へ変換します。
 */
export function createTodayPickReason({
  preferredPrefecture,
  recommendationReason,
  hasTodayPick,
}: CreateTodayPickReasonInput): string {
  if (!hasTodayPick) {
    return "気になるエリアや設備条件から、今日の気分に合うサウナを探してみましょう。";
  }

  const normalizedReason =
    recommendationReason?.trim();

  if (normalizedReason) {
    return `${normalizedReason}として、今日の一軒に選びました。`;
  }

  const normalizedPrefecture =
    preferredPrefecture?.trim();

  if (normalizedPrefecture) {
    return `お気に入りや最近のサ活から「${normalizedPrefecture}」との相性が良いため、今日の一軒に選びました。`;
  }

  return "TOTONOで注目されている施設の中から、今日の一軒を選びました。";
}

function normalizeSaunaName(
  saunaName: string
): string {
  return saunaName
    .trim()
    .toLocaleLowerCase("ja-JP");
}

function isVisitInYearMonth(
  visitDate: string,
  yearMonth: string
): boolean {
  return (
    typeof visitDate === "string" &&
    visitDate.startsWith(yearMonth)
  );
}
