import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type CreateSaunaSubmissionInput = {
  name: string;
  prefecture: string;
  city: string;
  address: string;
  sourceUrl: string;
  note: string;
};

function optionalValue(
  value: string
): string | null {
  const trimmedValue =
    value.trim();

  return trimmedValue ||
    null;
}

export async function createSaunaSubmission(
  supabase: SupabaseClient,
  currentUserId: string,
  input: CreateSaunaSubmissionInput
): Promise<void> {
  const name =
    input.name.trim();

  const prefecture =
    input.prefecture.trim();

  if (!name) {
    throw new Error(
      "施設名を入力してください。"
    );
  }

  if (!prefecture) {
    throw new Error(
      "都道府県を入力してください。"
    );
  }

  const {
    error,
  } = await supabase
    .from(
      "sauna_submissions"
    )
    .insert({
      submitted_by:
        currentUserId,
      request_type:
        "create",
      target_sauna_id:
        null,
      name,
      prefecture,
      city:
        optionalValue(
          input.city
        ),
      address:
        optionalValue(
          input.address
        ),
      source_url:
        optionalValue(
          input.sourceUrl
        ),
      note:
        optionalValue(
          input.note
        ),
      status:
        "pending",
      reviewed_by:
        null,
      reviewed_at:
        null,
    });

  if (error?.code === "23505") {
    throw new Error(
      "同じ施設の追加リクエストをすでに送信しています。"
    );
  }

  if (error) {
    throw new Error(
      `施設の追加リクエストを送信できませんでした: ${error.message}`
    );
  }
}