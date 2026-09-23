import type { SupabaseClient } from "@supabase/supabase-js";

import { supabase } from "../lib/supabase";

export type ProductEventName =
  | "app_open"
  | "today_view"
  | "search_view"
  | "sauna_search"
  | "sauna_detail_view"
  | "recommendation_view"
  | "recommendation_change"
  | "recommendation_detail_view"
  | "recommendation_favorite_add"
  | "recommendation_empty"
  | "recommendation_error";

export type ProductEvent = {
  eventName: ProductEventName;
  source: "app_lifecycle" | "screen_view" | "sauna_search" | "today_next_sauna";
  sourceScreen?: string;
  searchMethod?: "keyword" | "prefecture" | "current_location";
  saunaId?: string;
  recommendationReason?: string;
  sessionPosition?: number;
};

export async function insertProductEvent(
  client: SupabaseClient,
  userId: string,
  event: ProductEvent
): Promise<void> {
  const { error } = await client.from("product_events").insert({
    user_id: userId,
    event_name: event.eventName,
    platform: "ios",
    sauna_id: event.saunaId ?? null,
    recommendation_reason: event.recommendationReason?.slice(0, 120) ?? null,
    session_position: event.sessionPosition ?? null,
    source: event.source,
    source_screen: event.sourceScreen?.slice(0, 50) ?? null,
    search_method: event.searchMethod ?? null,
  });

  if (error) {
    console.warn("プロダクトイベントを記録できませんでした。", error.message);
  }
}

export function trackProductEvent(
  userId: string,
  event: ProductEvent
): void {
  if (!supabase) return;
  void insertProductEvent(supabase, userId, event).catch((error: unknown) => {
    console.warn("プロダクトイベントを記録できませんでした。", error);
  });
}

export function trackRecommendationEvent(
  userId: string,
  event: Omit<ProductEvent, "source">
): void {
  trackProductEvent(userId, { ...event, source: "today_next_sauna" });
}
