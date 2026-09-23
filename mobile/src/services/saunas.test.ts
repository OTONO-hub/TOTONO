import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import {
  searchNearbySaunas,
  searchSaunas,
} from "./saunas";

describe("searchSaunas", () => {
  it("does not query when both search conditions are empty", async () => {
    const rpc = vi.fn();
    const from = vi.fn();
    const supabase = { rpc, from } as unknown as SupabaseClient;

    await expect(searchSaunas(supabase, "  ", "  ")).resolves.toEqual([]);
    expect(rpc).not.toHaveBeenCalled();
    expect(from).not.toHaveBeenCalled();
  });

  it("passes the prefecture to ranked keyword search", async () => {
    const rpc = vi.fn().mockResolvedValue({ data: [], error: null });
    const supabase = { rpc } as unknown as SupabaseClient;

    await searchSaunas(supabase, " 北欧 ", "東京都");

    expect(rpc).toHaveBeenCalledWith("search_saunas_ranked", {
      search_keyword: "北欧",
      search_prefecture: "東京都",
      result_limit: 20,
    });
  });

  it("can search by prefecture without a keyword", async () => {
    const limit = vi.fn().mockResolvedValue({ data: [], error: null });
    const secondOrder = vi.fn().mockReturnValue({ limit });
    const firstOrder = vi.fn().mockReturnValue({ order: secondOrder });
    const eq = vi.fn().mockReturnValue({ order: firstOrder });
    const select = vi.fn().mockReturnValue({ eq });
    const from = vi.fn().mockReturnValue({ select });
    const supabase = { from } as unknown as SupabaseClient;

    await searchSaunas(supabase, "", " 神奈川県 ");

    expect(from).toHaveBeenCalledWith("saunas");
    expect(eq).toHaveBeenCalledWith("prefecture", "神奈川県");
    expect(firstOrder).toHaveBeenCalledWith("is_verified", {
      ascending: false,
    });
    expect(secondOrder).toHaveBeenCalledWith("name", {
      ascending: true,
    });
    expect(limit).toHaveBeenCalledWith(20);
  });
});

describe("searchNearbySaunas", () => {
  it("passes validated location conditions to nearby search", async () => {
    const rpc = vi.fn().mockResolvedValue({
      data: [{ id: "nearby", distance_km: 1.2 }],
      error: null,
    });
    const supabase = { rpc } as unknown as SupabaseClient;

    const result = await searchNearbySaunas(
      supabase,
      " 北欧 ",
      {
        latitude: 35.6812,
        longitude: 139.7671,
        radiusKm: 10,
      }
    );

    expect(rpc).toHaveBeenCalledWith("search_saunas_nearby", {
      user_latitude: 35.6812,
      user_longitude: 139.7671,
      search_radius_km: 10,
      search_keyword: "北欧",
      search_features: [],
      result_limit: 20,
    });
    expect(result[0]).toMatchObject({ distance_km: 1.2 });
  });

  it("rejects unsupported radius values before querying", async () => {
    const rpc = vi.fn();
    const supabase = { rpc } as unknown as SupabaseClient;

    await expect(
      searchNearbySaunas(supabase, "", {
        latitude: 35.6812,
        longitude: 139.7671,
        radiusKm: 100,
      })
    ).rejects.toThrow("現在地検索の条件が正しくありません。");
    expect(rpc).not.toHaveBeenCalled();
  });
});
