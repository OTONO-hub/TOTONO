export type SaunaPersonaPost = {
  sauna_name: string;
  visit_date: string;
  comment: string | null;
};

export type SaunaPersonaType =
  | "explorer"
  | "home-sauna"
  | "weekend-sauna"
  | "reviewer"
  | "sauna-regular"
  | "discovering";

export type SaunaPersona = {
  type: SaunaPersonaType;
  name: string;
  englishName: string;
  description: string;
  reason: string;
  score: number;
};

type ActivePersonaType = Exclude<
  SaunaPersonaType,
  "discovering"
>;

type PersonaScore = {
  type: ActivePersonaType;
  score: number;
  reason: string;
};

type ParsedPersonaPost = {
  saunaName: string;
  visitDate: Date | null;
  visitDateString: string | null;
  comment: string;
};

const JAPAN_TIME_ZONE = "Asia/Tokyo";

const MINIMUM_POST_COUNT = 5;
const MINIMUM_PERSONA_SCORE = 60;

const MILLISECONDS_PER_DAY =
  1000 * 60 * 60 * 24;

/**
 * 同点時の優先順位です。
 *
 * Personaの優劣ではなく、
 * 行動の特徴が明確に表れやすい順です。
 */
const PERSONA_PRIORITY: ActivePersonaType[] =
  [
    "explorer",
    "home-sauna",
    "reviewer",
    "weekend-sauna",
    "sauna-regular",
  ];

const PERSONA_CONTENT: Record<
  SaunaPersonaType,
  {
    name: string;
    englishName: string;
    description: string;
  }
> = {
  explorer: {
    name: "サウナエクスプローラー",
    englishName: "Explorer",
    description:
      "新しいサウナとの出会いを楽しむ、探求型のサウナスタイルです。",
  },
  "home-sauna": {
    name: "ホームサウナー",
    englishName: "Home Sauna",
    description:
      "お気に入りの場所を大切にする、落ち着いたサウナスタイルです。",
  },
  "weekend-sauna": {
    name: "週末サウナー",
    englishName: "Weekend Sauna",
    description:
      "週末のひとときをサウナで整える、休日中心のサウナスタイルです。",
  },
  reviewer: {
    name: "サウナレビュアー",
    englishName: "Reviewer",
    description:
      "サウナで感じたことを丁寧に残す、記録を楽しむサウナスタイルです。",
  },
  "sauna-regular": {
    name: "サウナレギュラー",
    englishName: "Sauna Regular",
    description:
      "無理のないペースでサウナを楽しむ、安定型のサウナスタイルです。",
  },
  discovering: {
    name: "スタイル分析中",
    englishName: "Discovering",
    description:
      "サ活を重ねながら、あなたらしいサウナスタイルを見つけています。",
  },
};

/**
 * 施設名を比較しやすい形へ整えます。
 */
function normalizeSaunaName(
  saunaName: string
): string {
  return saunaName
    .trim()
    .replace(/\s+/g, " ")
    .toLocaleLowerCase("ja-JP");
}

/**
 * Dateを日本時間のYYYY-MM-DDへ変換します。
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
 * YYYY-MM-DD形式の日付を安全に解析します。
 *
 * 日時が含まれている場合も、
 * 先頭の日付部分だけを利用します。
 */
function parseVisitDate(
  dateString: string
): {
  date: Date;
  dateString: string;
} | null {
  const match =
    /^(\d{4})-(\d{2})-(\d{2})/.exec(
      dateString.trim()
    );

  if (!match) {
    return null;
  }

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);

  const date = new Date(
    Date.UTC(year, month - 1, day)
  );

  if (Number.isNaN(date.getTime())) {
    return null;
  }

  /*
   * 2026-02-31などの存在しない日付が
   * 自動補正されることを防ぎます。
   */
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }

  return {
    date,
    dateString: [
      String(year).padStart(4, "0"),
      String(month).padStart(2, "0"),
      String(day).padStart(2, "0"),
    ].join("-"),
  };
}

/**
 * Persona計算用の形式へ投稿を変換します。
 */
function parsePosts(
  posts: SaunaPersonaPost[]
): ParsedPersonaPost[] {
  return posts.map((post) => {
    const parsedDate =
      parseVisitDate(post.visit_date);

    return {
      saunaName: normalizeSaunaName(
        post.sauna_name
      ),
      visitDate:
        parsedDate?.date ?? null,
      visitDateString:
        parsedDate?.dateString ?? null,
      comment:
        post.comment?.trim() ?? "",
    };
  });
}

/**
 * スコアを0〜100へ収めます。
 */
function clampScore(
  score: number
): number {
  return Math.max(
    0,
    Math.min(100, score)
  );
}

/**
 * 2つの日付の差を日数で返します。
 *
 * 両方ともUTC午前0時として作成された
 * 日付を受け取る前提です。
 */
function getDifferenceInDays(
  earlierDate: Date,
  laterDate: Date
): number {
  return Math.floor(
    (
      laterDate.getTime() -
      earlierDate.getTime()
    ) / MILLISECONDS_PER_DAY
  );
}

/**
 * 日本時間の今日を、
 * UTC午前0時の日付として取得します。
 */
function getTodayInJapan(
  now: Date
): Date {
  const todayString =
    formatDateInJapan(now);

  const parsedToday =
    parseVisitDate(todayString);

  /*
   * formatDateInJapanで生成した文字列なので、
   * 通常nullになることはありません。
   */
  if (!parsedToday) {
    throw new Error(
      "日本時間の現在日付を解析できませんでした。"
    );
  }

  return parsedToday.date;
}

/**
 * Explorerのスコアを計算します。
 */
function calculateExplorerScore(
  posts: ParsedPersonaPost[]
): PersonaScore {
  const validSaunaNames = posts
    .map((post) => post.saunaName)
    .filter(Boolean);

  const uniqueSaunaCount =
    new Set(validSaunaNames).size;

  const diversityRate =
    validSaunaNames.length > 0
      ? uniqueSaunaCount /
        validSaunaNames.length
      : 0;

  let score = 0;

  if (uniqueSaunaCount >= 4) {
    score += 40;
  }

  if (diversityRate >= 0.7) {
    score += 40;
  }

  if (uniqueSaunaCount >= 7) {
    score += 20;
  }

  return {
    type: "explorer",
    score: clampScore(score),
    reason:
      uniqueSaunaCount > 0
        ? `これまでに${uniqueSaunaCount}つの施設を訪れています。`
        : "訪問施設の記録を分析しています。",
  };
}

/**
 * Home Saunaのスコアを計算します。
 */
function calculateHomeSaunaScore(
  posts: ParsedPersonaPost[]
): PersonaScore {
  const visitCountBySauna =
    new Map<string, number>();

  for (const post of posts) {
    if (!post.saunaName) {
      continue;
    }

    const currentCount =
      visitCountBySauna.get(
        post.saunaName
      ) ?? 0;

    visitCountBySauna.set(
      post.saunaName,
      currentCount + 1
    );
  }

  const validSaunaPostCount =
    [...visitCountBySauna.values()].reduce(
      (total, count) => total + count,
      0
    );

  const mostVisitedCount =
    Math.max(
      0,
      ...visitCountBySauna.values()
    );

  const mostVisitedRate =
    validSaunaPostCount > 0
      ? mostVisitedCount /
        validSaunaPostCount
      : 0;

  let score = 0;

  if (mostVisitedCount >= 3) {
    score += 40;
  }

  if (mostVisitedRate >= 0.5) {
    score += 40;
  }

  if (mostVisitedCount >= 5) {
    score += 20;
  }

  return {
    type: "home-sauna",
    score: clampScore(score),
    reason:
      mostVisitedCount > 0
        ? `お気に入りの施設を${mostVisitedCount}回訪れています。`
        : "お気に入り施設の傾向を分析しています。",
  };
}

/**
 * Weekend Saunaのスコアを計算します。
 */
function calculateWeekendSaunaScore(
  posts: ParsedPersonaPost[],
  today: Date
): PersonaScore {
  const validDatePosts =
    posts.filter(
      (
        post
      ): post is ParsedPersonaPost & {
        visitDate: Date;
        visitDateString: string;
      } =>
        post.visitDate !== null &&
        post.visitDateString !== null &&
        post.visitDate.getTime() <=
          today.getTime()
    );

  const weekendVisitCount =
    validDatePosts.filter((post) => {
      const dayOfWeek =
        post.visitDate.getUTCDay();

      return (
        dayOfWeek === 0 ||
        dayOfWeek === 6
      );
    }).length;

  const weekendVisitRate =
    validDatePosts.length > 0
      ? weekendVisitCount /
        validDatePosts.length
      : 0;

  let score = 0;

  if (weekendVisitCount >= 3) {
    score += 40;
  }

  if (weekendVisitRate >= 0.6) {
    score += 40;
  }

  if (weekendVisitCount >= 6) {
    score += 20;
  }

  return {
    type: "weekend-sauna",
    score: clampScore(score),
    reason:
      weekendVisitCount > 0
        ? `週末のサ活が${weekendVisitCount}回記録されています。`
        : "訪問曜日の傾向を分析しています。",
  };
}

/**
 * Reviewerのスコアを計算します。
 */
function calculateReviewerScore(
  posts: ParsedPersonaPost[]
): PersonaScore {
  const postsWithComment =
    posts.filter(
      (post) =>
        post.comment.length > 0
    );

  const commentRate =
    posts.length > 0
      ? postsWithComment.length /
        posts.length
      : 0;

  const totalCommentLength =
    postsWithComment.reduce(
      (total, post) =>
        total + post.comment.length,
      0
    );

  const averageCommentLength =
    postsWithComment.length > 0
      ? totalCommentLength /
        postsWithComment.length
      : 0;

  let score = 0;

  if (commentRate >= 0.7) {
    score += 40;
  }

  if (averageCommentLength >= 40) {
    score += 40;
  }

  if (postsWithComment.length >= 8) {
    score += 20;
  }

  return {
    type: "reviewer",
    score: clampScore(score),
    reason:
      postsWithComment.length > 0
        ? `${postsWithComment.length}件のサ活に感想を残しています。`
        : "サ活コメントの傾向を分析しています。",
  };
}

/**
 * Sauna Regularのスコアを計算します。
 */
function calculateSaunaRegularScore(
  posts: ParsedPersonaPost[],
  today: Date
): PersonaScore {
  const validVisitDates = posts
    .filter(
      (
        post
      ): post is ParsedPersonaPost & {
        visitDate: Date;
        visitDateString: string;
      } =>
        post.visitDate !== null &&
        post.visitDateString !== null &&
        post.visitDate.getTime() <=
          today.getTime()
    )
    .map((post) => post.visitDate)
    .sort(
      (dateA, dateB) =>
        dateA.getTime() -
        dateB.getTime()
    );

  /*
   * 平均間隔では、同日の複数投稿を
   * 1日分として扱います。
   */
  const uniqueVisitDates = [
    ...new Map(
      validVisitDates.map((date) => [
        date.toISOString().slice(0, 10),
        date,
      ])
    ).values(),
  ];

  /*
   * 今日を含めた直近90日です。
   *
   * 今日を0日目として、
   * 89日前までを対象にします。
   */
  const lastNinetyDaysVisitCount =
    validVisitDates.filter(
      (visitDate) => {
        const differenceInDays =
          getDifferenceInDays(
            visitDate,
            today
          );

        return (
          differenceInDays >= 0 &&
          differenceInDays < 90
        );
      }
    ).length;

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
      totalIntervalDays +=
        getDifferenceInDays(
          uniqueVisitDates[index - 1],
          uniqueVisitDates[index]
        );
    }

    averageIntervalDays =
      totalIntervalDays /
      (uniqueVisitDates.length - 1);
  }

  let score = 0;

  if (lastNinetyDaysVisitCount >= 4) {
    score += 40;
  }

  if (
    averageIntervalDays !== null &&
    averageIntervalDays >= 7 &&
    averageIntervalDays <= 21
  ) {
    score += 40;
  }

  if (posts.length >= 10) {
    score += 20;
  }

  const roundedAverageInterval =
    averageIntervalDays === null
      ? null
      : Math.round(
          averageIntervalDays
        );

  return {
    type: "sauna-regular",
    score: clampScore(score),
    reason:
      roundedAverageInterval !== null
        ? `平均して約${roundedAverageInterval}日おきにサウナを訪れています。`
        : "訪問ペースを分析しています。",
  };
}

/**
 * Discovering状態を作成します。
 */
function createDiscoveringPersona(
  reason: string
): SaunaPersona {
  const content =
    PERSONA_CONTENT.discovering;

  return {
    type: "discovering",
    name: content.name,
    englishName:
      content.englishName,
    description:
      content.description,
    reason,
    score: 0,
  };
}

/**
 * 投稿履歴からSauna Personaを計算します。
 */
export function calculateSaunaPersona(
  posts: SaunaPersonaPost[],
  now: Date = new Date()
): SaunaPersona {
  if (
    posts.length <
    MINIMUM_POST_COUNT
  ) {
    const remainingCount =
      MINIMUM_POST_COUNT -
      posts.length;

    return createDiscoveringPersona(
      `あと${remainingCount}件記録すると、あなたのスタイル分析が始まります。`
    );
  }

  const parsedPosts =
    parsePosts(posts);

  const today =
    getTodayInJapan(now);

  const scores: PersonaScore[] = [
    calculateExplorerScore(
      parsedPosts
    ),
    calculateHomeSaunaScore(
      parsedPosts
    ),
    calculateReviewerScore(
      parsedPosts
    ),
    calculateWeekendSaunaScore(
      parsedPosts,
      today
    ),
    calculateSaunaRegularScore(
      parsedPosts,
      today
    ),
  ];

  const sortedScores = [
    ...scores,
  ].sort((scoreA, scoreB) => {
    if (
      scoreA.score !== scoreB.score
    ) {
      return (
        scoreB.score -
        scoreA.score
      );
    }

    return (
      PERSONA_PRIORITY.indexOf(
        scoreA.type
      ) -
      PERSONA_PRIORITY.indexOf(
        scoreB.type
      )
    );
  });

  const highestScore =
    sortedScores[0];

  if (
    !highestScore ||
    highestScore.score <
      MINIMUM_PERSONA_SCORE
  ) {
    return createDiscoveringPersona(
      "サ活を重ねながら、あなたらしい傾向を分析しています。"
    );
  }

  const content =
    PERSONA_CONTENT[
      highestScore.type
    ];

  return {
    type: highestScore.type,
    name: content.name,
    englishName:
      content.englishName,
    description:
      content.description,
    reason: highestScore.reason,
    score: highestScore.score,
  };
}
