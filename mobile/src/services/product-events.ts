import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export type RecommendationEventName =
  | "recommendation_view"
  | "recommendation_change"
  | "recommendation_detail_view"
  | "recommendation_favorite_add"
  | "recommendation_empty"
  | "recommendation_error";

export type RecommendationEvent = {
  eventName: RecommendationEventName;
  saunaId?: string;
  recommendationReason?: string;
  sessionPosition?: number;
};

export async function insertRecommendationEvent(
  client: SupabaseClient,
  userId: string,
  event: RecommendationEvent
): Promise<void> {
  const { error } = await client.from("product_events").insert({
    user_id: userId,
    event_name: event.eventName,
    platform: "ios",
    sauna_id: event.saunaId ?? null,
    recommendation_reason: event.recommendationReason?.slice(0, 120) ?? null,
    session_position: event.sessionPosition ?? null,
    source: "today_next_sauna",
  });

  if (error) {
    console.warn("推薦イベントを記録できませんでした。", error.message);
  }
}

export function trackRecommendationEvent(
  userId: string,
  event: RecommendationEvent
): void {
  if (!supabase) return;
  void insertRecommendationEvent(supabase, userId, event).catch((error: unknown) => {
    console.warn("推薦イベントを記録できませんでした。", error);
  });
}
