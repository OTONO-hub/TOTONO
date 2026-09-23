export type LaunchMode =
  | "first"
  | "returning";

type LaunchStorage =
  Pick<
    Storage,
    | "getItem"
    | "setItem"
  >;

const LAUNCH_SEEN_KEY =
  "totono:launch-experience-seen";

const FIRST_LAUNCH_DURATION_MS =
  1500;

const RETURNING_LAUNCH_DURATION_MS =
  600;

function getBrowserStorage(): LaunchStorage | null {
  if (
    typeof window ===
    "undefined"
  ) {
    return null;
  }

  try {
    return window.localStorage;
  } catch {
    return null;
  }
}

export function getLaunchMode(
  storage:
    | LaunchStorage
    | null =
    getBrowserStorage()
): LaunchMode {
  if (!storage) {
    return "returning";
  }

  try {
    return storage.getItem(
      LAUNCH_SEEN_KEY
    ) === "1"
      ? "returning"
      : "first";
  } catch {
    return "returning";
  }
}

export function markLaunchExperienceSeen(
  storage:
    | LaunchStorage
    | null =
    getBrowserStorage()
): void {
  if (!storage) {
    return;
  }

  try {
    storage.setItem(
      LAUNCH_SEEN_KEY,
      "1"
    );
  } catch {
    // Storage failure must never block app startup.
  }
}

export function getLaunchMinimumDuration(
  mode: LaunchMode
): number {
  return mode ===
    "first"
    ? FIRST_LAUNCH_DURATION_MS
    : RETURNING_LAUNCH_DURATION_MS;
}
