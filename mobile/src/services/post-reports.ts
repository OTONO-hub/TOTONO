import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type PostReportReason =
  | "spam"
  | "harassment"
  | "inappropriate"
  | "false_information"
  | "other";

export type CreatePostReportInput = {
  postId: string;
  reporterId: string;
  reason: PostReportReason;
  details?: string | null;
};

const MAX_REPORT_DETAILS_LENGTH =
  500;

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

function normalizeReportDetails(
  details?: string | null
): string | null {
  const normalizedDetails =
    details?.trim() ??
    "";

  if (!normalizedDetails) {
    return null;
  }

  if (
    normalizedDetails.length >
    MAX_REPORT_DETAILS_LENGTH
  ) {
    throw new Error(
      `通報の詳細は${MAX_REPORT_DETAILS_LENGTH}文字以内で入力してください。`
    );
  }

  return normalizedDetails;
}

export async function createPostReport(
  supabase: SupabaseClient,
  input: CreatePostReportInput
): Promise<void> {
  const normalizedPostId =
    assertRequiredText(
      input.postId,
      "投稿ID"
    );

  const normalizedReporterId =
    assertRequiredText(
      input.reporterId,
      "ユーザーID"
    );

  const normalizedDetails =
    normalizeReportDetails(
      input.details
    );

  const {
    error,
  } =
    await supabase
      .from(
        "post_reports"
      )
      .insert({
        post_id:
          normalizedPostId,

        reporter_id:
          normalizedReporterId,

        reason:
          input.reason,

        details:
          normalizedDetails,
      });

  if (!error) {
    return;
  }

  if (
    error.code ===
    "23505"
  ) {
    throw new Error(
      "この投稿はすでに通報済みです。"
    );
  }

  throw new Error(
    `投稿を通報できませんでした: ${error.message}`
  );
}

export async function isPostReported(
  supabase: SupabaseClient,
  reporterId: string,
  postId: string
): Promise<boolean> {
  const normalizedReporterId =
    assertRequiredText(
      reporterId,
      "ユーザーID"
    );

  const normalizedPostId =
    assertRequiredText(
      postId,
      "投稿ID"
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "post_reports"
      )
      .select(
        "id"
      )
      .eq(
        "reporter_id",
        normalizedReporterId
      )
      .eq(
        "post_id",
        normalizedPostId
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `通報状態を確認できませんでした: ${error.message}`
    );
  }

  return Boolean(
    data
  );
}
