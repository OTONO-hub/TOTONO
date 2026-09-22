import { describe, expect, it } from "vitest";

import {
  updateRecentlyViewedSaunas,
  type RecentlyViewedSauna,
} from "./recently-viewed-saunas";

function createSauna(id: string, viewedAt: string): RecentlyViewedSauna {
  return {
    id,
    name: `サウナ${id}`,
    imageUrl: null,
    prefecture: "東京都",
    city: null,
    averageRating: null,
    viewedAt,
  };
}

describe("updateRecentlyViewedSaunas", () => {
  it("moves an existing sauna to the front without duplication", () => {
    const current = [createSauna("a", "old-a"), createSauna("b", "old-b")];
    const next = updateRecentlyViewedSaunas(
      current,
      {
        id: "b",
        name: "サウナb",
        imageUrl: null,
        prefecture: "東京都",
        city: null,
        averageRating: null,
      },
      "new-b"
    );

    expect(next.map((item) => item.id)).toEqual(["b", "a"]);
    expect(next[0]?.viewedAt).toBe("new-b");
  });

  it("keeps only the six most recent saunas", () => {
    const current = Array.from({ length: 6 }, (_, index) =>
      createSauna(String(index), `old-${index}`)
    );
    const next = updateRecentlyViewedSaunas(
      current,
      {
        id: "new",
        name: "新しいサウナ",
        imageUrl: null,
        prefecture: null,
        city: null,
        averageRating: null,
      },
      "new-time"
    );

    expect(next).toHaveLength(6);
    expect(next.map((item) => item.id)).toEqual(["new", "0", "1", "2", "3", "4"]);
  });
});
