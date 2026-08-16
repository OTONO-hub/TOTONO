import {
  createClient,
} from "npm:@supabase/supabase-js@2";

const SUPABASE_URL =
  Deno.env.get(
    "SUPABASE_URL"
  );

const SUPABASE_ANON_KEY =
  Deno.env.get(
    "SUPABASE_ANON_KEY"
  );

const SUPABASE_SERVICE_ROLE_KEY =
  Deno.env.get(
    "SUPABASE_SERVICE_ROLE_KEY"
  );

const STORAGE_BUCKETS = [
  "post-images",
  "avatars",
] as const;

const STORAGE_LIST_LIMIT =
  100;

const STORAGE_REMOVE_LIMIT =
  100;

const corsHeaders = {
  "Access-Control-Allow-Origin":
    "*",

  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",

  "Access-Control-Allow-Methods":
    "POST, OPTIONS",

  "Content-Type":
    "application/json",
};

function createJsonResponse(
  body: Record<
    string,
    unknown
  >,
  status = 200
): Response {
  return new Response(
    JSON.stringify(
      body
    ),
    {
      status,
      headers:
        corsHeaders,
    }
  );
}

function assertEnvironmentVariables() {
  if (
    !SUPABASE_URL ||
    !SUPABASE_ANON_KEY ||
    !SUPABASE_SERVICE_ROLE_KEY
  ) {
    throw new Error(
      "Supabaseのサーバー設定が不足しています。"
    );
  }
}

async function getUserFilePaths(
  adminClient:
    ReturnType<
      typeof createClient
    >,
  bucketName: string,
  userId: string
): Promise<string[]> {
  const filePaths:
    string[] = [];

  let offset =
    0;

  while (true) {
    const {
      data,
      error,
    } =
      await adminClient.storage
        .from(
          bucketName
        )
        .list(
          userId,
          {
            limit:
              STORAGE_LIST_LIMIT,

            offset,

            sortBy: {
              column:
                "name",

              order:
                "asc",
            },
          }
        );

    if (error) {
      throw new Error(
        `${bucketName}の画像一覧を取得できませんでした: ${error.message}`
      );
    }

    const files =
      data ??
      [];

    for (
      const file of
      files
    ) {
      if (
        !file.name ||
        file.id ===
          null
      ) {
        continue;
      }

      filePaths.push(
        `${userId}/${file.name}`
      );
    }

    if (
      files.length <
      STORAGE_LIST_LIMIT
    ) {
      break;
    }

    offset +=
      STORAGE_LIST_LIMIT;
  }

  return filePaths;
}

async function removeFiles(
  adminClient:
    ReturnType<
      typeof createClient
    >,
  bucketName: string,
  filePaths: string[]
): Promise<void> {
  for (
    let index = 0;
    index <
    filePaths.length;
    index +=
      STORAGE_REMOVE_LIMIT
  ) {
    const paths =
      filePaths.slice(
        index,
        index +
          STORAGE_REMOVE_LIMIT
      );

    const {
      error,
    } =
      await adminClient.storage
        .from(
          bucketName
        )
        .remove(
          paths
        );

    if (error) {
      throw new Error(
        `${bucketName}の画像を削除できませんでした: ${error.message}`
      );
    }
  }
}

async function removeUserStorageFiles(
  adminClient:
    ReturnType<
      typeof createClient
    >,
  userId: string
): Promise<void> {
  for (
    const bucketName of
    STORAGE_BUCKETS
  ) {
    const filePaths =
      await getUserFilePaths(
        adminClient,
        bucketName,
        userId
      );

    if (
      filePaths.length ===
      0
    ) {
      continue;
    }

    await removeFiles(
      adminClient,
      bucketName,
      filePaths
    );
  }
}

Deno.serve(
  async (
    request
  ): Promise<Response> => {
    if (
      request.method ===
      "OPTIONS"
    ) {
      return new Response(
        "ok",
        {
          headers:
            corsHeaders,
        }
      );
    }

    if (
      request.method !==
      "POST"
    ) {
      return createJsonResponse(
        {
          error:
            "許可されていないリクエストです。",
        },
        405
      );
    }

    try {
      assertEnvironmentVariables();

      const authorizationHeader =
        request.headers.get(
          "Authorization"
        );

      if (
        !authorizationHeader
      ) {
        return createJsonResponse(
          {
            error:
              "ログイン情報がありません。",
          },
          401
        );
      }

      const userClient =
        createClient(
          SUPABASE_URL!,
          SUPABASE_ANON_KEY!,
          {
            global: {
              headers: {
                Authorization:
                  authorizationHeader,
              },
            },

            auth: {
              persistSession:
                false,

              autoRefreshToken:
                false,
            },
          }
        );

      const {
        data:
          userData,
        error:
          userError,
      } =
        await userClient.auth
          .getUser();

      if (
        userError ||
        !userData.user
      ) {
        return createJsonResponse(
          {
            error:
              "ログイン状態を確認できませんでした。",
          },
          401
        );
      }

      const userId =
        userData.user.id;

      const adminClient =
        createClient(
          SUPABASE_URL!,
          SUPABASE_SERVICE_ROLE_KEY!,
          {
            auth: {
              persistSession:
                false,

              autoRefreshToken:
                false,
            },
          }
        );

      await removeUserStorageFiles(
        adminClient,
        userId
      );

      const {
        error:
          deleteUserError,
      } =
        await adminClient.auth
          .admin
          .deleteUser(
            userId,
            false
          );

      if (
        deleteUserError
      ) {
        throw new Error(
          `アカウントを削除できませんでした: ${deleteUserError.message}`
        );
      }

      return createJsonResponse({
        success:
          true,
      });
    } catch (
      error
    ) {
      console.error(
        "delete-account:",
        error
      );

      return createJsonResponse(
        {
          error:
            error instanceof Error
              ? error.message
              : "アカウント削除中に問題が発生しました。",
        },
        500
      );
    }
  }
);
