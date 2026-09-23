import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import { insertProductEvent } from "./product-events";

describe("insertProductEvent", () => {
  it("inserts an iOS recommendation event without personal profile data", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const from = vi.fn().mockReturnValue({ insert });
    const client = { from } as unknown as SupabaseClient;

    await insertProductEvent(client, "user-1", {
      eventName: "recommendation_detail_view",
      source: "today_next_sauna",
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
      source_screen: null,
    });
  });

  it("does not reject the user action when event insertion fails", async () => {
    const insert = vi.fn().mockResolvedValue({ error: { message: "offline" } });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;
    const warning = vi.spyOn(console, "warn").mockImplementation(() => undefined);

    await expect(insertProductEvent(client, "user-1", {
      eventName: "recommendation_view",
      source: "today_next_sauna",
    })).resolves.toBeUndefined();
    expect(warning).toHaveBeenCalled();
    warning.mockRestore();
  });

  it("inserts a screen view with only the previous screen", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;

    await insertProductEvent(client, "user-1", {
      eventName: "search_view",
      source: "screen_view",
      sourceScreen: "today",
    });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      event_name: "search_view",
      source: "screen_view",
      source_screen: "today",
      sauna_id: null,
    }));
  });
});
