import { describe, expect, it } from "vitest";

import { aggregateVisitedSaunas } from "@/services/visited-saunas";

describe("aggregateVisitedSaunas", () => {
  it("同じ施設IDの投稿を1施設へ統合する", () => {
    const result = aggregateVisitedSaunas([
      { sauna_id: "sauna-1", sauna_name: "サウナ東京", visit_date: "2026-09-01" },
      { sauna_id: "sauna-1", sauna_name: "サウナ東京", visit_date: "2026-09-20" },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0]).toMatchObject({ visitCount: 2, latestVisitDate: "2026-09-20" });
  });

  it("施設IDがない旧投稿は正規化した施設名で統合する", () => {
    const result = aggregateVisitedSaunas([
      { sauna_id: null, sauna_name: " レインボー  新小岩 ", visit_date: "2026-08-01" },
      { sauna_id: null, sauna_name: "レインボー 新小岩", visit_date: "2026-08-10" },
    ]);

    expect(result).toHaveLength(1);
    expect(result[0].visitCount).toBe(2);
  });

  it("最終訪問日の新しい施設から並べる", () => {
    const result = aggregateVisitedSaunas([
      { sauna_id: "old", sauna_name: "古い施設", visit_date: "2026-07-01" },
      { sauna_id: "new", sauna_name: "新しい施設", visit_date: "2026-09-01" },
    ]);

    expect(result.map((item) => item.saunaId)).toEqual(["new", "old"]);
  });
});
