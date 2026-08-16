export type SaunaXpLevel =
  | "Beginner"
  | "Bronze"
  | "Silver"
  | "Gold"
  | "Master";

export type SaunaXpInput = {
  visitCount: number;
  visitedSaunaCount: number;
  totalSetCount: number;
};

export type SaunaXpBreakdown = {
  visitXp: number;
  visitedSaunaXp: number;
  setXp: number;
};

export type SaunaXpResult = {
  level: SaunaXpLevel;
  currentXp: number;
  currentLevelXp: number;
  nextLevel: SaunaXpLevel | null;
  nextLevelXp: number | null;
  xpUntilNextLevel: number;
  progressPercentage: number;
  breakdown: SaunaXpBreakdown;
};

type SaunaXpLevelDefinition = {
  level: SaunaXpLevel;
  requiredXp: number;
};

const XP_PER_VISIT = 100;
const XP_PER_VISITED_SAUNA = 50;
const XP_PER_SET = 10;

const SAUNA_XP_LEVELS: SaunaXpLevelDefinition[] = [
  {
    level: "Beginner",
    requiredXp: 0,
  },
  {
    level: "Bronze",
    requiredXp: 1_000,
  },
  {
    level: "Silver",
    requiredXp: 3_000,
  },
  {
    level: "Gold",
    requiredXp: 6_000,
  },
  {
    level: "Master",
    requiredXp: 10_000,
  },
];

function normalizeCount(
  value: number
): number {
  if (!Number.isFinite(value)) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(value)
  );
}

function calculateProgressPercentage(
  currentXp: number,
  currentLevelXp: number,
  nextLevelXp: number | null
): number {
  if (nextLevelXp === null) {
    return 100;
  }

  const levelXpRange =
    nextLevelXp - currentLevelXp;

  if (levelXpRange <= 0) {
    return 100;
  }

  const earnedXpInCurrentLevel =
    currentXp - currentLevelXp;

  const percentage =
    (earnedXpInCurrentLevel /
      levelXpRange) *
    100;

  return Math.min(
    100,
    Math.max(
      0,
      Math.round(percentage)
    )
  );
}

function getCurrentLevelIndex(
  currentXp: number
): number {
  let currentLevelIndex = 0;

  for (
    let index = 0;
    index < SAUNA_XP_LEVELS.length;
    index += 1
  ) {
    const levelDefinition =
      SAUNA_XP_LEVELS[index];

    if (
      currentXp >=
      levelDefinition.requiredXp
    ) {
      currentLevelIndex = index;
    }
  }

  return currentLevelIndex;
}

export function calculateSaunaXp(
  input: SaunaXpInput
): SaunaXpResult {
  const visitCount =
    normalizeCount(input.visitCount);

  const visitedSaunaCount =
    normalizeCount(
      input.visitedSaunaCount
    );

  const totalSetCount =
    normalizeCount(
      input.totalSetCount
    );

  const breakdown: SaunaXpBreakdown = {
    visitXp:
      visitCount * XP_PER_VISIT,

    visitedSaunaXp:
      visitedSaunaCount *
      XP_PER_VISITED_SAUNA,

    setXp:
      totalSetCount * XP_PER_SET,
  };

  const currentXp =
    breakdown.visitXp +
    breakdown.visitedSaunaXp +
    breakdown.setXp;

  const currentLevelIndex =
    getCurrentLevelIndex(currentXp);

  const currentLevelDefinition =
    SAUNA_XP_LEVELS[
      currentLevelIndex
    ];

  const nextLevelDefinition =
    SAUNA_XP_LEVELS[
      currentLevelIndex + 1
    ] ?? null;

  const nextLevelXp =
    nextLevelDefinition?.requiredXp ??
    null;

  const xpUntilNextLevel =
    nextLevelXp === null
      ? 0
      : Math.max(
          0,
          nextLevelXp - currentXp
        );

  const progressPercentage =
    calculateProgressPercentage(
      currentXp,
      currentLevelDefinition.requiredXp,
      nextLevelXp
    );

  return {
    level:
      currentLevelDefinition.level,

    currentXp,

    currentLevelXp:
      currentLevelDefinition.requiredXp,

    nextLevel:
      nextLevelDefinition?.level ??
      null,

    nextLevelXp,

    xpUntilNextLevel,

    progressPercentage,

    breakdown,
  };
}
