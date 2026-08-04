import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const DELETE_CONFIRMATION_TEXT =
  "TOTONOを退会する";

const USER_STORAGE_BUCKETS = [
  "avatars",
  "post-images",
] as const;

const STORAGE_LIST_LIMIT = 1000;

type DeleteAccountRequestBody = {
  password?: unknown;
  confirmation?: unknown;
};

type StorageListItem = {
  id: string | null;
  name: string;
  metadata: Record<string, unknown> | null;
};

function createErrorResponse(
  message: string,
  status: number
) {
  return NextResponse.json(
    {
      success: false,
      message,
    },
    {
      status,
      headers: {
        "Cache-Control": "no-store",
      },
    }
  );
}

function getRequestText(
  value: unknown
): string {
  return typeof value === "string"
    ? value
    : "";
}

async function listStorageFilesRecursively(
  bucketName: string,
  folderPath: string
): Promise<string[]> {
  const adminClient =
    createAdminClient();

  const collectedPaths: string[] = [];

  let offset = 0;

  while (true) {
    const { data, error } =
      await adminClient.storage
        .from(bucketName)
        .list(folderPath, {
          limit: STORAGE_LIST_LIMIT,
          offset,
          sortBy: {
            column: "name",
            order: "asc",
          },
        });

    if (error) {
      console.error(
        "Storageファイル一覧の取得に失敗しました。",
        {
          bucketName,
          folderPath,
          message: error.message,
        }
      );

      throw new Error(
        "保存された画像を確認できませんでした。"
      );
    }

    const items =
      (data ?? []) as StorageListItem[];

    for (const item of items) {
      const itemPath = folderPath
        ? `${folderPath}/${item.name}`
        : item.name;

      const isFolder =
        item.id === null &&
        item.metadata === null;

      if (isFolder) {
        const nestedPaths =
          await listStorageFilesRecursively(
            bucketName,
            itemPath
          );

        collectedPaths.push(
          ...nestedPaths
        );

        continue;
      }

      collectedPaths.push(itemPath);
    }

    if (
      items.length <
      STORAGE_LIST_LIMIT
    ) {
      break;
    }

    offset += STORAGE_LIST_LIMIT;
  }

  return collectedPaths;
}

async function deleteStorageFiles(
  userId: string
): Promise<void> {
  const adminClient =
    createAdminClient();

  for (
    const bucketName
    of USER_STORAGE_BUCKETS
  ) {
    const paths =
      await listStorageFilesRecursively(
        bucketName,
        userId
      );

    if (paths.length === 0) {
      continue;
    }

    for (
      let index = 0;
      index < paths.length;
      index += STORAGE_LIST_LIMIT
    ) {
      const batch = paths.slice(
        index,
        index + STORAGE_LIST_LIMIT
      );

      const { error } =
        await adminClient.storage
          .from(bucketName)
          .remove(batch);

      if (error) {
        console.error(
          "Storageファイルの削除に失敗しました。",
          {
            bucketName,
            userId,
            fileCount: batch.length,
            message: error.message,
          }
        );

        throw new Error(
          "保存された画像を削除できませんでした。"
        );
      }
    }
  }
}

export async function DELETE(
  request: Request
) {
  const supabase =
    await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (
    userError ||
    !user ||
    !user.email
  ) {
    return createErrorResponse(
      "ログインが必要です。",
      401
    );
  }

  let body: DeleteAccountRequestBody;

  try {
    body =
      (await request.json()) as DeleteAccountRequestBody;
  } catch {
    return createErrorResponse(
      "削除確認の内容が正しくありません。",
      400
    );
  }

  const password =
    getRequestText(body.password);

  const confirmation =
    getRequestText(body.confirmation);

  if (!password) {
    return createErrorResponse(
      "現在のパスワードを入力してください。",
      400
    );
  }

  if (
    confirmation !==
    DELETE_CONFIRMATION_TEXT
  ) {
    return createErrorResponse(
      `確認欄に「${DELETE_CONFIRMATION_TEXT}」と入力してください。`,
      400
    );
  }

  /*
   * 削除処理の直前に、サーバー側で
   * 現在のメールアドレスとパスワードを再確認します。
   */
  const {
    data: authenticationData,
    error: authenticationError,
  } =
    await supabase.auth.signInWithPassword({
      email: user.email,
      password,
    });

  if (
    authenticationError ||
    !authenticationData.user ||
    authenticationData.user.id !==
      user.id
  ) {
    return createErrorResponse(
      "パスワードが正しくありません。",
      401
    );
  }

  try {
    /*
     * Authユーザーより先にStorageを削除します。
     * Storage所有ファイルが残っていると、
     * Authユーザーを削除できない場合があります。
     */
    await deleteStorageFiles(
      user.id
    );

    const adminClient =
      createAdminClient();

    const { error: deleteUserError } =
      await adminClient.auth.admin.deleteUser(
        user.id
      );

    if (deleteUserError) {
      console.error(
        "Supabase Authユーザーの削除に失敗しました。",
        {
          userId: user.id,
          code:
            deleteUserError.code,
          message:
            deleteUserError.message,
        }
      );

      return createErrorResponse(
        "アカウントを削除できませんでした。時間をおいて、もう一度お試しください。",
        500
      );
    }

    /*
     * JWTは発行後すぐ無効になるとは限らないため、
     * ローカルセッションの破棄も試みます。
     */
    try {
      await supabase.auth.signOut({
        scope: "local",
      });
    } catch (signOutError) {
      console.error(
        "削除後のセッション破棄に失敗しました。",
        signOutError
      );
    }

    return NextResponse.json(
      {
        success: true,
        message:
          "アカウントを削除しました。",
      },
      {
        status: 200,
        headers: {
          "Cache-Control":
            "no-store",
        },
      }
    );
  } catch (error) {
    console.error(
      "アカウント削除処理中に予期しないエラーが発生しました。",
      {
        userId: user.id,
        error,
      }
    );

    return createErrorResponse(
      error instanceof Error
        ? error.message
        : "アカウントを削除できませんでした。",
      500
    );
  }
}
