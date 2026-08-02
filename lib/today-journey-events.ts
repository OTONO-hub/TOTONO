export const TODAY_JOURNEY_UPDATED_EVENT =
  "totono:today-journey-updated";

export type TodayJourneyUpdatedDetail = {
  saunaId: string;
};

export function notifyTodayJourneyUpdated(
  saunaId: string
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.dispatchEvent(
    new CustomEvent<TodayJourneyUpdatedDetail>(
      TODAY_JOURNEY_UPDATED_EVENT,
      {
        detail: {
          saunaId,
        },
      }
    )
  );
}
