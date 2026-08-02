import {
  getTodayJourneyProgress,
  loadTodayJourneyState,
  type JourneyStepId,
} from "@/lib/today-journey-storage";

export type TodayJourneyHistoryEntry = {
  date: string;
  saunaId: string;
  saunaName: string;
  currentStepId: JourneyStepId;
  progress: number;
  completedAt: string | null;
};

const TODAY_JOURNEY_HISTORY_KEY =
  "totono:today-journey-history";

function getJapanDateKey(): string {
  return new Intl.DateTimeFormat("sv-SE", {
    timeZone: "Asia/Tokyo",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

function isHistoryEntry(
  value: unknown
): value is TodayJourneyHistoryEntry {
  if (
    typeof value !== "object" ||
    value === null
  ) {
    return false;
  }

  const entry =
    value as Partial<TodayJourneyHistoryEntry>;

  return (
    typeof entry.date === "string" &&
    typeof entry.saunaId === "string" &&
    typeof entry.saunaName === "string" &&
    typeof entry.currentStepId === "string" &&
    typeof entry.progress === "number" &&
    (
      entry.completedAt === null ||
      typeof entry.completedAt === "string"
    )
  );
}

export function loadTodayJourneyHistory():
  TodayJourneyHistoryEntry[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored =
      window.localStorage.getItem(
        TODAY_JOURNEY_HISTORY_KEY
      );

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed
      .filter(isHistoryEntry)
      .sort((a, b) =>
        b.date.localeCompare(a.date)
      );
  } catch {
    return [];
  }
}

export function saveTodayJourneySnapshot(
  sauna: {
    id: string;
    name: string;
  }
): TodayJourneyHistoryEntry {
  const journey =
    loadTodayJourneyState(sauna.id);

  const progress =
    getTodayJourneyProgress(
      journey.currentStepId
    );

  const entry: TodayJourneyHistoryEntry = {
    date: getJapanDateKey(),
    saunaId: sauna.id,
    saunaName: sauna.name,
    currentStepId:
      journey.currentStepId,
    progress,
    completedAt:
      progress === 100
        ? new Date().toISOString()
        : null,
  };

  if (typeof window === "undefined") {
    return entry;
  }

  const history =
    loadTodayJourneyHistory();

  const nextHistory = [
    entry,
    ...history.filter(
      (item) =>
        !(
          item.date === entry.date &&
          item.saunaId === entry.saunaId
        )
    ),
  ].slice(0, 30);

  window.localStorage.setItem(
    TODAY_JOURNEY_HISTORY_KEY,
    JSON.stringify(nextHistory)
  );

  return entry;
}
