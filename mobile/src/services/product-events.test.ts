import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import {
  insertProductEvent,
  recordAppReturn,
} from "./product-events";

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
      search_method: null,
      auth_method: null,
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

  it("records only the search method and not the search text", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;

    await insertProductEvent(client, "user-1", {
      eventName: "sauna_search",
      source: "sauna_search",
      sourceScreen: "search",
      searchMethod: "current_location",
    });

    expect(insert).toHaveBeenCalledWith(expect.objectContaining({
      event_name: "sauna_search",
      search_method: "current_location",
      source_screen: "search",
    }));
    expect(insert.mock.calls[0]?.[0]).not.toHaveProperty("keyword");
  });

  it("records post completion without post content", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;

    await insertProductEvent(client, "user-1", {
      eventName: "post_complete",
      source: "post_flow",
      sourceScreen: "post_create",
      saunaId: "sauna-1",
    });

    const payload = insert.mock.calls[0]?.[0];
    expect(payload).toEqual(expect.objectContaining({
      event_name: "post_complete",
      sauna_id: "sauna-1",
      source: "post_flow",
    }));
    expect(payload).not.toHaveProperty("comment");
    expect(payload).not.toHaveProperty("rating");
  });

  it("records login success without an email address", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;

    await insertProductEvent(client, "user-1", {
      eventName: "login",
      source: "auth",
      sourceScreen: "login",
      authMethod: "email",
    });

    const payload = insert.mock.calls[0]?.[0];
    expect(payload).toEqual(expect.objectContaining({
      event_name: "login",
      auth_method: "email",
      source_screen: "login",
    }));
    expect(payload).not.toHaveProperty("email");
  });

  it("records completed registration without profile input", async () => {
    const insert = vi.fn().mockResolvedValue({ error: null });
    const client = { from: vi.fn().mockReturnValue({ insert }) } as unknown as SupabaseClient;

    await insertProductEvent(client, "new-user-1", {
      eventName: "sign_up",
      source: "auth",
      sourceScreen: "register",
      authMethod: "email",
    });

    const payload = insert.mock.calls[0]?.[0];
    expect(payload).toEqual(expect.objectContaining({
      event_name: "sign_up",
      auth_method: "email",
      source_screen: "register",
    }));
    expect(payload).not.toHaveProperty("email");
    expect(payload).not.toHaveProperty("username");
  });
});

describe("recordAppReturn", () => {
  it("uses the server-side retention RPC", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: true,
      error: null,
    });
    const client = { rpc } as unknown as SupabaseClient;

    await expect(
      recordAppReturn(
        client
      )
    ).resolves.toBe(
      true
    );
    expect(
      rpc
    ).toHaveBeenCalledWith(
      "record_app_return"
    );
  });

  it("does not block app startup when retention tracking fails", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: null,
      error: {
        message: "offline",
      },
    });
    const client = { rpc } as unknown as SupabaseClient;
    const warning = vi
      .spyOn(
        console,
        "warn"
      )
      .mockImplementation(
        () => undefined
      );

    await expect(
      recordAppReturn(
        client
      )
    ).resolves.toBe(
      false
    );
    expect(
      warning
    ).toHaveBeenCalled();
    warning.mockRestore();
  });
});
