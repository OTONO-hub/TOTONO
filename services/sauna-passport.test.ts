import { describe, expect, it } from "vitest";

import { summarizeSaunaPassport } from "./sauna-passport";

describe("summarizeSaunaPassport", () => {
  it("counts unique days, facilities, and prefectures", () => {
    const summary = summarizeSaunaPassport(
      [
        { sauna_id: "a", sauna_name: "湯の森", visit_date: "2026-09-01" },
        { sauna_id: "a", sauna_name: "湯の森", visit_date: "2026-09-01" },
        { sauna_id: "b", sauna_name: "海の湯", visit_date: "2026-09-03" },
        { sauna_id: null, sauna_name: "  森の湯  ", visit_date: "2026-09-04" },
      ],
      new Map([["a", "東京都"], ["b", "神奈川県"]])
    );

    expect(summary).toEqual({
      saunaDays: 3,
      facilities: 3,
      prefectures: 2,
      prefectureNames: ["神奈川県", "東京都"],
    });
  });

  it("keeps empty passport values at zero", () => {
    expect(summarizeSaunaPassport([], new Map())).toEqual({
      saunaDays: 0,
      facilities: 0,
      prefectures: 0,
      prefectureNames: [],
    });
  });
});
