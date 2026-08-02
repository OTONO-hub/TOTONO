import {
  describe,
  expect,
  it,
} from "vitest";

import type { RecommendedSauna } from "@/services/recommendations";
import type { DashboardPost } from "@/types/dashboard";
import {
  createHomeHeroMessage,
  createHomeSummary,
  createTodayPickReason,
  getCurrentHourInJapan,
  getCurrentYearMonthInJapan,
  selectAlternativeRecommendations,
  selectTodayPick,
} from "@/view-models/home";

function createDashboardPost({
  id,
  saunaName,
  visitDate,
}: {
  id: string;
  saunaName: string;
  visitDate: string;
}): DashboardPost {
  return {
    id,
    user_id: "user-1",
    sauna_id: null,
    sauna_name: saunaName,
    visit_date: visitDate,
    set_count: 3,
    rating: 4,
    comment: "",
    image_url: null,
    created_at: `${visitDate}T12:00:00.000Z`,
    updated_at: `${visitDate}T12:00:00.000Z`,
  } as DashboardPost;
}

function createRecommendedSauna(
  id: string
): RecommendedSauna {
  return {
    id,
    name: `サウナ ${id}`,
    image_url: null,
    prefecture: "東京都",
    city: "渋谷区",
    average_rating: 4.5,
    rating_count: 10,
    post_count: 20,
    favorite_count: 5,
    recommendation_reason:
      "最近のサ活と相性が良い施設",
  } as RecommendedSauna;
}

describe(
  "getCurrentHourInJapan",
  () => {
    it(
      "日本時間の時刻を0〜23で返す",
      () => {
        const date = new Date(
          "2026-08-02T00:30:00.000Z"
        );

        expect(
          getCurrentHourInJapan(date)
        ).toBe(9);
      }
    );
  }
);

describe(
  "getCurrentYearMonthInJapan",
  () => {
    it(
      "日本時間の年月をYYYY-MM形式で返す",
      () => {
        const date = new Date(
          "2026-07-31T16:00:00.000Z"
        );

        expect(
          getCurrentYearMonthInJapan(
            date
          )
        ).toBe("2026-08");
      }
    );
  }
);

describe(
  "createHomeHeroMessage",
  () => {
    it(
      "朝のメッセージを返す",
      () => {
        const message =
          createHomeHeroMessage(
            new Date(
              "2026-08-02T00:00:00.000Z"
            )
          );

        expect(message.greeting).toBe(
          "Good Morning."
        );

        expect(message.heading).toBe(
          "今日の始まりを、軽やかに整える。"
        );
      }
    );

    it(
      "午後のメッセージを返す",
      () => {
        const message =
          createHomeHeroMessage(
            new Date(
              "2026-08-02T04:00:00.000Z"
            )
          );

        expect(message.greeting).toBe(
          "Good Afternoon."
        );
      }
    );

    it(
      "夕方以降のメッセージを返す",
      () => {
        const message =
          createHomeHeroMessage(
            new Date(
              "2026-08-02T10:00:00.000Z"
            )
          );

        expect(message.greeting).toBe(
          "Good Evening."
        );
      }
    );

    it(
      "深夜のメッセージを返す",
      () => {
        const message =
          createHomeHeroMessage(
            new Date(
              "2026-08-02T15:30:00.000Z"
            )
          );

        expect(message.greeting).toBe(
          "Good Night."
        );
      }
    );
  }
);

describe(
  "createHomeSummary",
  () => {
    it(
      "今月・累計・訪問施設数を集計する",
      () => {
        const posts = [
          createDashboardPost({
            id: "post-1",
            saunaName: "北欧",
            visitDate: "2026-08-01",
          }),
          createDashboardPost({
            id: "post-2",
            saunaName: " 北欧 ",
            visitDate: "2026-08-02",
          }),
          createDashboardPost({
            id: "post-3",
            saunaName: "かるまる",
            visitDate: "2026-07-20",
          }),
        ];

        const summary =
          createHomeSummary(
            posts,
            new Date(
              "2026-08-15T03:00:00.000Z"
            )
          );

        expect(summary).toEqual({
          monthlyVisits: 2,
          uniqueSaunas: 2,
          totalVisits: 3,
        });
      }
    );

    it(
      "施設名の空文字を施設数へ含めない",
      () => {
        const posts = [
          createDashboardPost({
            id: "post-1",
            saunaName: "   ",
            visitDate: "2026-08-01",
          }),
        ];

        const summary =
          createHomeSummary(
            posts,
            new Date(
              "2026-08-15T03:00:00.000Z"
            )
          );

        expect(
          summary.uniqueSaunas
        ).toBe(0);

        expect(
          summary.totalVisits
        ).toBe(1);
      }
    );

    it(
      "投稿がない場合はすべて0を返す",
      () => {
        const summary =
          createHomeSummary(
            [],
            new Date(
              "2026-08-15T03:00:00.000Z"
            )
          );

        expect(summary).toEqual({
          monthlyVisits: 0,
          uniqueSaunas: 0,
          totalVisits: 0,
        });
      }
    );
  }
);

describe(
  "selectTodayPick",
  () => {
    it(
      "おすすめ一覧の先頭を返す",
      () => {
        const first =
          createRecommendedSauna(
            "sauna-1"
          );

        const second =
          createRecommendedSauna(
            "sauna-2"
          );

        expect(
          selectTodayPick([
            first,
            second,
          ])
        ).toBe(first);
      }
    );

    it(
      "候補がない場合はnullを返す",
      () => {
        expect(
          selectTodayPick([])
        ).toBeNull();
      }
    );
  }
);

describe(
  "selectAlternativeRecommendations",
  () => {
    it(
      "Today Pickを除いた候補を返す",
      () => {
        const first =
          createRecommendedSauna(
            "sauna-1"
          );

        const second =
          createRecommendedSauna(
            "sauna-2"
          );

        const third =
          createRecommendedSauna(
            "sauna-3"
          );

        expect(
          selectAlternativeRecommendations(
            [
              first,
              second,
              third,
            ]
          )
        ).toEqual([
          second,
          third,
        ]);
      }
    );

    it(
      "候補が1件だけの場合は空配列を返す",
      () => {
        expect(
          selectAlternativeRecommendations(
            [
              createRecommendedSauna(
                "sauna-1"
              ),
            ]
          )
        ).toEqual([]);
      }
    );
  }
);

describe(
  "createTodayPickReason",
  () => {
    it(
      "候補がない場合の案内を返す",
      () => {
        expect(
          createTodayPickReason({
            preferredPrefecture:
              null,
            recommendationReason:
              null,
            hasTodayPick: false,
          })
        ).toBe(
          "気になるエリアや設備条件から、今日の気分に合うサウナを探してみましょう。"
        );
      }
    );

    it(
      "推薦理由を優先して表示する",
      () => {
        expect(
          createTodayPickReason({
            preferredPrefecture:
              "東京都",
            recommendationReason:
              "外気浴を楽しみやすい施設",
            hasTodayPick: true,
          })
        ).toBe(
          "外気浴を楽しみやすい施設として、今日の一軒に選びました。"
        );
      }
    );

    it(
      "推薦理由がない場合は都道府県を使用する",
      () => {
        expect(
          createTodayPickReason({
            preferredPrefecture:
              "東京都",
            recommendationReason:
              "   ",
            hasTodayPick: true,
          })
        ).toBe(
          "お気に入りや最近のサ活から「東京都」との相性が良いため、今日の一軒に選びました。"
        );
      }
    );

    it(
      "理由と都道府県がない場合は標準文言を返す",
      () => {
        expect(
          createTodayPickReason({
            preferredPrefecture:
              null,
            recommendationReason:
              null,
            hasTodayPick: true,
          })
        ).toBe(
          "TOTONOで注目されている施設の中から、今日の一軒を選びました。"
        );
      }
    );
  }
);
