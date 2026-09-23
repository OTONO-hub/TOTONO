import type {
  SupabaseClient,
} from "@supabase/supabase-js";

const RECENT_VISIT_LIMIT =
  3;

type SaunaVisitRow = {
  id: string;
  visit_date: string;
  set_count: number;
  rating: number;
};

export type SaunaVisit = {
  id: string;
  visitDate: string;
  setCount: number;
  rating: number;
};

export type SaunaVisitHistory = {
  visitCount: number;
  latestVisitDate: string;
  recentVisits: SaunaVisit[];
};

function assertRequiredText(
  value: string,
  label: string
): string {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new Error(
      `${label}が指定されていません。`
    );
  }

  return normalizedValue;
}

export async function getSaunaVisitHistory(
  client: SupabaseClient,
  userId: string,
  saunaId: string
): Promise<SaunaVisitHistory | null> {
  const normalizedUserId =
    assertRequiredText(
      userId,
      "ユーザーID"
    );

  const normalizedSaunaId =
    assertRequiredText(
      saunaId,
      "施設ID"
    );

  const {
    data,
    error,
    count,
  } =
    await client
      .from(
        "posts"
      )
      .select(
        `
          id,
          visit_date,
          set_count,
          rating
        `,
        {
          count: "exact",
        }
      )
      .eq(
        "user_id",
        normalizedUserId
      )
      .eq(
        "sauna_id",
        normalizedSaunaId
      )
      .order(
        "visit_date",
        {
          ascending: false,
        }
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(
        RECENT_VISIT_LIMIT
      )
      .returns<
        SaunaVisitRow[]
      >();

  if (error) {
    throw new Error(
      `この施設の訪問履歴を取得できませんでした: ${error.message}`
    );
  }

  const rows =
    data ?? [];

  if (
    rows.length === 0 ||
    !count
  ) {
    return null;
  }

  return {
    visitCount:
      count,

    latestVisitDate:
      rows[0]
        .visit_date,

    recentVisits:
      rows.map(
        (row) => ({
          id:
            row.id,
          visitDate:
            row.visit_date,
          setCount:
            row.set_count,
          rating:
            row.rating,
        })
      ),
  };
}
