import type {
  SupabaseClient,
} from "@supabase/supabase-js";
import {
  describe,
  expect,
  it,
  vi,
} from "vitest";

import {
  getSaunaVisitHistory,
} from "./sauna-visit-history";

function createClientResult(
  result: {
    data: unknown[];
    error: null;
    count: number;
  }
) {
  const returns =
    vi.fn()
      .mockResolvedValue(
        result
      );
  const limit =
    vi.fn()
      .mockReturnValue({
        returns,
      });
  const secondOrder =
    vi.fn()
      .mockReturnValue({
        limit,
      });
  const firstOrder =
    vi.fn()
      .mockReturnValue({
        order:
          secondOrder,
      });
  const secondEq =
    vi.fn()
      .mockReturnValue({
        order:
          firstOrder,
      });
  const firstEq =
    vi.fn()
      .mockReturnValue({
        eq:
          secondEq,
      });
  const select =
    vi.fn()
      .mockReturnValue({
        eq:
          firstEq,
      });
  const from =
    vi.fn()
      .mockReturnValue({
        select,
      });

  return {
    client: {
      from,
    } as unknown as SupabaseClient,
    from,
    select,
    firstEq,
    secondEq,
    firstOrder,
    secondOrder,
    limit,
  };
}

describe("getSaunaVisitHistory", () => {
  it("returns visit count and the three most recent logs", async () => {
    const mock =
      createClientResult({
        data: [
          {
            id: "post-3",
            visit_date:
              "2026-09-23",
            set_count: 4,
            rating: 4.5,
          },
          {
            id: "post-2",
            visit_date:
              "2026-09-10",
            set_count: 3,
            rating: 4,
          },
        ],
        error: null,
        count: 5,
      });

    await expect(
      getSaunaVisitHistory(
        mock.client,
        "user-1",
        "sauna-1"
      )
    ).resolves.toEqual({
      visitCount: 5,
      latestVisitDate:
        "2026-09-23",
      recentVisits: [
        {
          id: "post-3",
          visitDate:
            "2026-09-23",
          setCount: 4,
          rating: 4.5,
        },
        {
          id: "post-2",
          visitDate:
            "2026-09-10",
          setCount: 3,
          rating: 4,
        },
      ],
    });

    expect(
      mock.from
    ).toHaveBeenCalledWith(
      "posts"
    );
    expect(
      mock.firstEq
    ).toHaveBeenCalledWith(
      "user_id",
      "user-1"
    );
    expect(
      mock.secondEq
    ).toHaveBeenCalledWith(
      "sauna_id",
      "sauna-1"
    );
    expect(
      mock.limit
    ).toHaveBeenCalledWith(
      3
    );
  });

  it("returns null when the user has not visited the sauna", async () => {
    const mock =
      createClientResult({
        data: [],
        error: null,
        count: 0,
      });

    await expect(
      getSaunaVisitHistory(
        mock.client,
        "user-1",
        "sauna-1"
      )
    ).resolves.toBeNull();
  });
});
