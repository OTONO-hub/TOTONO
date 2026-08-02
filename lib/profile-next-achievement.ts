import type { ProfileInsights } from "@/services/profile-insights";

export type NextAchievementType =
  | "first-steam"
  | "sauna-lover"
  | "explorer"
  | "perfection"
  | "completed";

export type NextAchievement = {
  type: NextAchievementType;
  name: string;
  englishName: string;
  description: string;
  current: number;
  target: number;
  remaining: number;
  progress: number;
  unit: string;
  isCompleted: boolean;
};

type AchievementCandidate = NextAchievement & {
  unlocked: boolean;
  priority: number;
};

const FIRST_STEAM_TARGET = 1;
const SAUNA_LOVER_TARGET = 10;
const EXPLORER_TARGET = 5;
const PERFECTION_TARGET = 1;

/**
 * 数値を指定した範囲内に収めます。
 */
function clamp(
  value: number,
  minimum: number,
  maximum: number
): number {
  return Math.min(
    Math.max(value, minimum),
    maximum
  );
}

/**
 * 数値として安全に扱える値へ変換します。
 */
function toSafeNumber(
  value: number | string | null | undefined
): number {
  const parsedValue = Number(value);

  if (!Number.isFinite(parsedValue)) {
    return 0;
  }

  return parsedValue;
}

/**
 * 0以上の整数へ変換します。
 *
 * 投稿数や施設数に、小数や負の値が
 *入らないようにします。
 */
function toNonNegativeInteger(
  value: number | string | null | undefined
): number {
  return Math.max(
    Math.floor(toSafeNumber(value)),
    0
  );
}

/**
 * 現在値と目標値から、
 * 0〜100の進捗率を計算します。
 */
function calculateProgress(
  current: number,
  target: number
): number {
  if (target <= 0) {
    return 100;
  }

  const progress = Math.round(
    (current / target) * 100
  );

  return clamp(progress, 0, 100);
}

/**
 * First Steamの候補を作成します。
 */
function createFirstSteamCandidate(
  insights: ProfileInsights
): AchievementCandidate {
  const totalSaunaVisits =
    toNonNegativeInteger(
      insights.totalSaunaVisits
    );

  const current = Math.min(
    totalSaunaVisits,
    FIRST_STEAM_TARGET
  );

  const remaining = Math.max(
    FIRST_STEAM_TARGET - current,
    0
  );

  const unlocked =
    insights.hasFirstSteam ||
    totalSaunaVisits >= FIRST_STEAM_TARGET;

  return {
    type: "first-steam",
    name: "はじめての整い",
    englishName: "First Steam",
    description:
      "最初のサ活を記録すると解除されます。",
    current,
    target: FIRST_STEAM_TARGET,
    remaining,
    progress: calculateProgress(
      current,
      FIRST_STEAM_TARGET
    ),
    unit: "visit",
    isCompleted: false,
    unlocked,
    priority: 0,
  };
}

/**
 * Sauna Loverの候補を作成します。
 */
function createSaunaLoverCandidate(
  insights: ProfileInsights
): AchievementCandidate {
  const totalSaunaVisits =
    toNonNegativeInteger(
      insights.totalSaunaVisits
    );

  const current = Math.min(
    totalSaunaVisits,
    SAUNA_LOVER_TARGET
  );

  const remaining = Math.max(
    SAUNA_LOVER_TARGET - current,
    0
  );

  const unlocked =
    insights.hasSaunaLover ||
    totalSaunaVisits >= SAUNA_LOVER_TARGET;

  return {
    type: "sauna-lover",
    name: "サウナラバー",
    englishName: "Sauna Lover",
    description:
      remaining === 1
        ? "あと1回のサ活で解除されます。"
        : `あと${remaining}回のサ活で解除されます。`,
    current,
    target: SAUNA_LOVER_TARGET,
    remaining,
    progress: calculateProgress(
      current,
      SAUNA_LOVER_TARGET
    ),
    unit: "visits",
    isCompleted: false,
    unlocked,
    priority: 1,
  };
}

/**
 * Explorerの候補を作成します。
 */
function createExplorerCandidate(
  insights: ProfileInsights
): AchievementCandidate {
  const visitedSaunas =
    toNonNegativeInteger(
      insights.visitedSaunas
    );

  const current = Math.min(
    visitedSaunas,
    EXPLORER_TARGET
  );

  const remaining = Math.max(
    EXPLORER_TARGET - current,
    0
  );

  const unlocked =
    insights.hasExplorer ||
    visitedSaunas >= EXPLORER_TARGET;

  return {
    type: "explorer",
    name: "サウナエクスプローラー",
    englishName: "Explorer",
    description:
      remaining === 1
        ? "あと1つの施設を訪れると解除されます。"
        : `あと${remaining}つの施設を訪れると解除されます。`,
    current,
    target: EXPLORER_TARGET,
    remaining,
    progress: calculateProgress(
      current,
      EXPLORER_TARGET
    ),
    unit: "saunas",
    isCompleted: false,
    unlocked,
    priority: 2,
  };
}

/**
 * Perfectionの候補を作成します。
 */
function createPerfectionCandidate(
  insights: ProfileInsights
): AchievementCandidate {
  const highestRating = Math.max(
    toSafeNumber(insights.highestRating),
    0
  );

  const unlocked =
    insights.hasPerfection ||
    highestRating >= 5;

  const current = unlocked ? 1 : 0;
  const remaining = unlocked ? 0 : 1;

  return {
    type: "perfection",
    name: "パーフェクトサ活",
    englishName: "Perfection",
    description:
      "評価5のサ活を記録すると解除されます。",
    current,
    target: PERFECTION_TARGET,
    remaining,
    progress: calculateProgress(
      current,
      PERFECTION_TARGET
    ),
    unit: "perfect visit",
    isCompleted: false,
    unlocked,
    priority: 3,
  };
}

/**
 * すべての実績が解除済みの場合に返します。
 */
function createCompletedAchievement(): NextAchievement {
  return {
    type: "completed",
    name: "すべての実績を解除しました",
    englishName:
      "All Achievements Unlocked",
    description:
      "これからも、自分らしいサ活の記録を楽しみましょう。",
    current: 4,
    target: 4,
    remaining: 0,
    progress: 100,
    unit: "achievements",
    isCompleted: true,
  };
}

/**
 * ProfileInsightsから、
 * 次に解除できそうな実績を計算します。
 *
 * 判定ルール:
 *
 * 1. 未解除の実績だけを候補にする
 * 2. 進捗率が最も高い実績を選ぶ
 * 3. 同率の場合はpriorityが小さいものを選ぶ
 * 4. すべて解除済みならcompletedを返す
 */
export function calculateNextAchievement(
  insights: ProfileInsights
): NextAchievement {
  const candidates: AchievementCandidate[] = [
    createFirstSteamCandidate(insights),
    createSaunaLoverCandidate(insights),
    createExplorerCandidate(insights),
    createPerfectionCandidate(insights),
  ];

  const lockedAchievements =
    candidates.filter(
      (achievement) =>
        !achievement.unlocked
    );

  if (lockedAchievements.length === 0) {
    return createCompletedAchievement();
  }

  const sortedAchievements = [
    ...lockedAchievements,
  ].sort((first, second) => {
    if (
      first.progress !== second.progress
    ) {
      return second.progress - first.progress;
    }

    return first.priority - second.priority;
  });

  const nextAchievement =
    sortedAchievements[0];

  return {
    type: nextAchievement.type,
    name: nextAchievement.name,
    englishName:
      nextAchievement.englishName,
    description:
      nextAchievement.description,
    current: nextAchievement.current,
    target: nextAchievement.target,
    remaining:
      nextAchievement.remaining,
    progress:
      nextAchievement.progress,
    unit: nextAchievement.unit,
    isCompleted:
      nextAchievement.isCompleted,
  };
}
