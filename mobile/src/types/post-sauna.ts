import type {
  Sauna,
} from "../services/saunas";

/**
 * 投稿画面で使用する施設情報です。
 *
 * Supabaseのsaunasテーブルに登録されている施設は
 * idを持ち、手入力された未登録施設はidがnullになります。
 */
export type PostSauna = {
  id: string | null;
  name: string;
};

/**
 * 登録済みのサウナ施設を、
 * 投稿用の施設情報へ変換します。
 */
export function createPostSaunaFromSauna(
  sauna: Sauna
): PostSauna {
  return {
    id:
      sauna.id,

    name:
      sauna.name,
  };
}

/**
 * 手入力された施設名から、
 * 未登録施設の投稿用情報を作成します。
 */
export function createManualPostSauna(
  saunaName: string
): PostSauna {
  const normalizedSaunaName =
    saunaName
      .trim()
      .replace(
        /\s+/g,
        " "
      );

  if (
    !normalizedSaunaName
  ) {
    throw new Error(
      "施設名を入力してください。"
    );
  }

  return {
    id:
      null,

    name:
      normalizedSaunaName,
  };
}

/**
 * 投稿用施設が、
 * Supabaseに登録済みか判定します。
 */
export function isRegisteredPostSauna(
  sauna: PostSauna
): boolean {
  return Boolean(
    sauna.id
  );
}
