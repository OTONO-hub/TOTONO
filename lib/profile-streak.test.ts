import {
  describe,
  expect,
  it,
} from "vitest";

import {
  calculateSaunaStreak,
  type ProfilePostForStreak,
} from "./profile-streak";


/*
 * テスト用の投稿データを作成します。
 *
 * 実際の投稿データには多くの項目がありますが、
 * Sauna Streakの計算で必要なのは
 * visit_dateだけです。
 */
function createPosts(
  visitDates: string[]
): ProfilePostForStreak[] {
  return visitDates.map(
    (visitDate) => ({
      visit_date: visitDate,
    })
  );
}

describe(
  "calculateSaunaStreak",
  () => {
    it(
      "投稿がない場合はすべて0を返す",
      () => {
        const result =
          calculateSaunaStreak(
            [],
            "2026-07-25"
          );

        expect(result).toEqual({
          currentStreak: 0,
          longestStreak: 0,
          activeThisWeek: false,
          lastVisitDate: null,
          totalActiveWeeks: 0,
        });
      }
    );

    it(
      "同じ週に複数投稿があっても1週として扱う",
      () => {
        const posts = createPosts([
          "2026-07-20",
          "2026-07-22",
          "2026-07-25",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-07-25"
          );

        expect(
          result.currentStreak
        ).toBe(1);

        expect(
          result.longestStreak
        ).toBe(1);

        expect(
          result.activeThisWeek
        ).toBe(true);

        expect(
          result.totalActiveWeeks
        ).toBe(1);

        expect(
          result.lastVisitDate
        ).toBe("2026-07-25");
      }
    );

    it(
      "3週連続で訪問している場合は3週を返す",
      () => {
        const posts = createPosts([
          "2026-07-06",
          "2026-07-13",
          "2026-07-20",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-07-25"
          );

        expect(
          result.currentStreak
        ).toBe(3);

        expect(
          result.longestStreak
        ).toBe(3);

        expect(
          result.activeThisWeek
        ).toBe(true);

        expect(
          result.totalActiveWeeks
        ).toBe(3);
      }
    );

    it(
      "今週未訪問でも先週まで継続していれば記録を維持する",
      () => {
        const posts = createPosts([
          "2026-06-29",
          "2026-07-06",
          "2026-07-13",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-07-20"
          );

        expect(
          result.currentStreak
        ).toBe(3);

        expect(
          result.longestStreak
        ).toBe(3);

        expect(
          result.activeThisWeek
        ).toBe(false);

        expect(
          result.lastVisitDate
        ).toBe("2026-07-13");
      }
    );

    it(
      "前の週にも訪問がない場合は現在の連続記録を0にする",
      () => {
        const posts = createPosts([
          "2026-06-22",
          "2026-06-29",
          "2026-07-06",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-07-20"
          );

        expect(
          result.currentStreak
        ).toBe(0);

        expect(
          result.longestStreak
        ).toBe(3);

        expect(
          result.activeThisWeek
        ).toBe(false);

        expect(
          result.totalActiveWeeks
        ).toBe(3);
      }
    );

    it(
      "途中で週が空いた場合も過去最長の連続記録を計算する",
      () => {
        const posts = createPosts([
          "2026-06-01",
          "2026-06-08",
          "2026-06-22",
          "2026-06-29",
          "2026-07-06",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-07-10"
          );

        expect(
          result.currentStreak
        ).toBe(3);

        expect(
          result.longestStreak
        ).toBe(3);

        expect(
          result.activeThisWeek
        ).toBe(true);

        expect(
          result.totalActiveWeeks
        ).toBe(5);
      }
    );

    it(
      "不正な日付は計算対象から除外する",
      () => {
        const posts = createPosts([
          "",
          "invalid-date",
          "2026-02-31",
          "2026-07-13",
          "2026-07-20",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-07-25"
          );

        expect(
          result.currentStreak
        ).toBe(2);

        expect(
          result.longestStreak
        ).toBe(2);

        expect(
          result.activeThisWeek
        ).toBe(true);

        expect(
          result.totalActiveWeeks
        ).toBe(2);

        expect(
          result.lastVisitDate
        ).toBe("2026-07-20");
      }
    );

    it(
      "年をまたぐ連続週も正しく計算する",
      () => {
        const posts = createPosts([
          "2025-12-22",
          "2025-12-29",
          "2026-01-05",
        ]);

        const result =
          calculateSaunaStreak(
            posts,
            "2026-01-07"
          );

        expect(
          result.currentStreak
        ).toBe(3);

        expect(
          result.longestStreak
        ).toBe(3);

        expect(
          result.activeThisWeek
        ).toBe(true);

        expect(
          result.totalActiveWeeks
        ).toBe(3);

        expect(
          result.lastVisitDate
        ).toBe("2026-01-05");
      }
    );
  }
);
