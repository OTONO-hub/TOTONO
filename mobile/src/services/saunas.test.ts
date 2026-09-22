import type { SupabaseClient } from "@supabase/supabase-js";
import { describe, expect, it, vi } from "vitest";

import { searchSaunas } from "./saunas";

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
