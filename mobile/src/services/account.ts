import type {
  SupabaseClient,
} from "@supabase/supabase-js";

type DeleteAccountResponse = {
  success?: boolean;
  error?: string;
};

export async function deleteCurrentAccount(
  supabase: SupabaseClient
): Promise<void> {
  const {
    data,
    error,
  } =
    await supabase.functions
      .invoke<
        DeleteAccountResponse
      >(
        "delete-account",
        {
          body: {},
        }
      );

  if (error) {
    throw new Error(
      `アカウントを削除できませんでした: ${error.message}`
    );
  }

  if (
    data?.error
  ) {
    throw new Error(
      data.error
    );
  }

  if (
    !data?.success
  ) {
    throw new Error(
      "アカウントの削除結果を確認できませんでした。"
    );
  }

  /*
   * Authユーザー削除後に、
   * 端末内へ保存されたセッションを消去します。
   *
   * scope: "local"にすることで、
   * 削除済みユーザーに対する
   * サーバーログアウト通信を行いません。
   */
  const {
    error:
      signOutError,
  } =
    await supabase.auth
      .signOut({
        scope:
          "local",
      });

  if (signOutError) {
    console.warn(
      "端末内のログイン情報を完全に消去できませんでした。",
      signOutError
    );
  }
}
