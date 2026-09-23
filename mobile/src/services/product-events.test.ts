import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import { insertRecommendationEvent } from "./product-events";

describe("insertRecommendationEvent", () => {
  it("inserts an iOS recommendation event without personal profile data", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient;

    await insertRecommendationEvent(client, "user-1", {
      eventName: "recommendation_detail_view",
      saunaId: "sauna-1",
      recommendationReason: "東京都で人気の施設",
      sessionPosition: 2,
    });

    expect(from).toHaveBeenCalledWith("product_events");
    expect(insert).toHaveBeenCalledWith({
      user_id: "user-1",
      event_name: "recommendation_detail_view",
      platform: "ios",
      sauna_id: "sauna-1",
      recommendation_reason: "東京都で人気の施設",
      session_position: 2,
      source: "today_next_sauna",
    });
  });

  it("does not reject the user action when event insertion fails", async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: "offline" } });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(insertRecommendationEvent(client, "user-1", {
      eventName: "recommendation_view",
    })).resolves.toBeUndefined();
    expect(warning).toHaveBeenCalled();
    warning.mockRestore();
  });
});
