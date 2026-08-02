import { notifyTodayJourneyUpdated } from "@/lib/today-journey-events";

export type JourneyStepId =
  | "departure"
  | "arrival"
  | "sauna"
  | "rest"
  | "meal"
  | "record";

export type JourneyStep = {
  id: JourneyStepId;
  title: string;
};

export type TodayJourneyState = {
  arrivalTime: string;
  currentStepId: JourneyStepId;
};

export const DEFAULT_TODAY_ARRIVAL_TIME =
  "18:30";

export const TODAY_JOURNEY_STEPS: JourneyStep[] = [
  {
    id: "departure",
    title: "施設へ出発",
  },
  {
    id: "arrival",
    title: "施設へ到着",
  },
  {
    id: "sauna",
    title: "サウナを楽しむ",
  },
  {
    id: "rest",
    title: "休憩・外気浴",
  },
  {
    id: "meal",
    title: "サ飯を楽しむ",
  },
  {
    id: "record",
    title: "サ活を記録",
  },
];

export function createTodayChecklistStorageKey(
  saunaId: string
): string {
  return `totono:today-checklist:${saunaId}`;
}

export function createTodayArrivalTimeStorageKey(
  saunaId: string
): string {
  return `totono:today-arrival-time:${saunaId}`;
}

export function createTodayJourneyStorageKey(
  saunaId: string
): string {
  return `totono:today-journey-status:${saunaId}`;
}

export function isTodayJourneyStepId(
  value: unknown
): value is JourneyStepId {
  return (
    typeof value === "string" &&
    TODAY_JOURNEY_STEPS.some(
      (step) => step.id === value
    )
  );
}

export function isValidTodayArrivalTime(
  value: string
): boolean {
  return /^([01]\d|2[0-3]):([0-5]\d)$/.test(
    value
  );
}

export function loadTodayJourneyState(
  saunaId: string
): TodayJourneyState {
  const initialState: TodayJourneyState = {
    arrivalTime:
      DEFAULT_TODAY_ARRIVAL_TIME,
    currentStepId: "departure",
  };

  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    const storedArrivalTime =
      window.localStorage.getItem(
        createTodayArrivalTimeStorageKey(
          saunaId
        )
      );

    const storedJourneyStep =
      window.localStorage.getItem(
        createTodayJourneyStorageKey(
          saunaId
        )
      );

    return {
      arrivalTime:
        storedArrivalTime &&
        isValidTodayArrivalTime(
          storedArrivalTime
        )
          ? storedArrivalTime
          : initialState.arrivalTime,
      currentStepId:
        isTodayJourneyStepId(
          storedJourneyStep
        )
          ? storedJourneyStep
          : initialState.currentStepId,
    };
  } catch {
    return initialState;
  }
}

export function saveTodayArrivalTime(
  saunaId: string,
  arrivalTime: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    createTodayArrivalTimeStorageKey(
      saunaId
    ),
    arrivalTime
  );

  notifyTodayJourneyUpdated(saunaId);
}

export function saveTodayJourneyStep(
  saunaId: string,
  stepId: JourneyStepId
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(
    createTodayJourneyStorageKey(saunaId),
    stepId
  );

  notifyTodayJourneyUpdated(saunaId);
}

export function clearTodayJourneyStorage(
  saunaId: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  const storageKeys = [
    createTodayChecklistStorageKey(
      saunaId
    ),
    createTodayArrivalTimeStorageKey(
      saunaId
    ),
    createTodayJourneyStorageKey(
      saunaId
    ),
  ];

  for (const storageKey of storageKeys) {
    window.localStorage.removeItem(
      storageKey
    );
  }

  notifyTodayJourneyUpdated(saunaId);
}

export function getTodayJourneyStepIndex(
  stepId: JourneyStepId
): number {
  return Math.max(
    TODAY_JOURNEY_STEPS.findIndex(
      (step) => step.id === stepId
    ),
    0
  );
}

export function getTodayJourneyProgress(
  stepId: JourneyStepId
): number {
  const stepIndex =
    getTodayJourneyStepIndex(stepId);

  return Math.round(
    ((stepIndex + 1) /
      TODAY_JOURNEY_STEPS.length) *
      100
  );
}

export function createTodayPostHref(
  sauna: {
    id: string;
    name: string;
  }
): string {
  const searchParams =
    new URLSearchParams({
      saunaId: sauna.id,
      saunaName: sauna.name,
      source: "today",
    });

  return `/posts/new?${searchParams.toString()}`;
}
