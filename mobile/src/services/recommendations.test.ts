import { describe, expect, it } from "vitest";

import { selectNextSaunaRecommendation, type RecommendationCandidate } from "./recommendations";
import type { Sauna } from "./saunas";

function sauna(id: string, prefecture: string): Sauna {
  return { id, name: id, prefecture, city: null } as Sauna;
}

describe("selectNextSaunaRecommendation", () => {
  it("excludes saved and visited facilities and prioritizes the preferred prefecture", () => {
    const candidates: RecommendationCandidate[] = [
      { sauna: sauna("excluded", "東京都"), postCount: 20, favoriteCount: 20, averageRating: 5 },
      { sauna: sauna("tokyo", "東京都"), postCount: 2, favoriteCount: 1, averageRating: 4.2 },
      { sauna: sauna("osaka", "大阪府"), postCount: 10, favoriteCount: 10, averageRating: 5 },
    ];

    const result = selectNextSaunaRecommendation(candidates, new Set(["excluded"]), "東京都");

    expect(result?.sauna.id).toBe("tokyo");
    expect(result?.reason).toBe("東京都で人気の施設");
  });

  it("returns null when every candidate is excluded", () => {
    const candidates: RecommendationCandidate[] = [
      { sauna: sauna("visited", "東京都"), postCount: 1, favoriteCount: 0, averageRating: 5 },
    ];

    expect(selectNextSaunaRecommendation(candidates, new Set(["visited"]), null)).toBeNull();
  });
});
