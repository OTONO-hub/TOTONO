type SupabaseErrorLike = {
  message?: string | null;
  code?: string | null;
  details?: string | null;
  hint?: string | null;
};

type AssertSupabaseErrorOptions = {
  fallbackMessage: string;
  context?: string;
};

/**
 * Supabaseから返されたエラーを確認し、
 * エラーが存在する場合は利用者向けのErrorへ変換します。
 *
 * PostgREST・Auth・Storageなど、
 * messageを持つSupabaseエラー全般で利用できます。
 */
export function assertSupabaseError(
  error: SupabaseErrorLike | null | undefined,
  options: AssertSupabaseErrorOptions
): asserts error is null | undefined {
  if (!error) {
    return;
  }

  const {
    fallbackMessage,
    context,
  } = options;

  const normalizedMessage =
    normalizeErrorMessage(
      error.message
    );

  const displayMessage =
    normalizedMessage ||
    fallbackMessage;

  if (context) {
    console.error(
      `[${context}] Supabase error`,
      {
        message:
          error.message ?? null,
        code:
          error.code ?? null,
        details:
          error.details ?? null,
        hint:
          error.hint ?? null,
      }
    );
  }

  throw new Error(displayMessage);
}

/**
 * IDなど、必須の文字列が空でないことを確認します。
 *
 * trim済みの値を返すため、
 * サービス側で同じ処理を繰り返す必要がありません。
 */
export function assertRequiredText(
  value: string,
  fieldName: string
): string {
  const normalizedValue =
    value.trim();

  if (!normalizedValue) {
    throw new Error(
      `${fieldName}が指定されていません。`
    );
  }

  return normalizedValue;
}

function normalizeErrorMessage(
  message: string | null | undefined
): string | null {
  if (
    typeof message !== "string"
  ) {
    return null;
  }

  const normalizedMessage =
    message.trim();

  return normalizedMessage ||
    null;
}
