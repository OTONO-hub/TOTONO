import type {
  SupabaseClient,
} from "@supabase/supabase-js";

export type UserBlockState = {
  isBlocked: boolean;
};

export type BlockedUser = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
  blockedAt: string;
};

type UserBlockRow = {
  blocked_id: string;
  created_at: string;
};

type BlockedProfileRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
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

function normalizeUserIds(
  blockerId: string,
  blockedId: string
): {
  blockerId: string;
  blockedId: string;
} {
  const normalizedBlockerId =
    assertRequiredText(
      blockerId,
      "ユーザーID"
    );

  const normalizedBlockedId =
    assertRequiredText(
      blockedId,
      "ブロック対象ユーザーID"
    );

  if (
    normalizedBlockerId ===
    normalizedBlockedId
  ) {
    throw new Error(
      "自分自身をブロックすることはできません。"
    );
  }

  return {
    blockerId:
      normalizedBlockerId,

    blockedId:
      normalizedBlockedId,
  };
}

export async function blockUser(
  supabase: SupabaseClient,
  blockerId: string,
  blockedId: string
): Promise<void> {
  const normalizedIds =
    normalizeUserIds(
      blockerId,
      blockedId
    );

  const {
    error,
  } =
    await supabase
      .from(
        "user_blocks"
      )
      .insert({
        blocker_id:
          normalizedIds.blockerId,

        blocked_id:
          normalizedIds.blockedId,
      });

  if (!error) {
    return;
  }

  if (
    error.code ===
    "23505"
  ) {
    return;
  }

  throw new Error(
    `ユーザーをブロックできませんでした: ${error.message}`
  );
}

export async function unblockUser(
  supabase: SupabaseClient,
  blockerId: string,
  blockedId: string
): Promise<void> {
  const normalizedIds =
    normalizeUserIds(
      blockerId,
      blockedId
    );

  const {
    error,
  } =
    await supabase
      .from(
        "user_blocks"
      )
      .delete()
      .eq(
        "blocker_id",
        normalizedIds.blockerId
      )
      .eq(
        "blocked_id",
        normalizedIds.blockedId
      );

  if (error) {
    throw new Error(
      `ブロックを解除できませんでした: ${error.message}`
    );
  }
}

export async function isUserBlocked(
  supabase: SupabaseClient,
  blockerId: string,
  blockedId: string
): Promise<boolean> {
  const normalizedIds =
    normalizeUserIds(
      blockerId,
      blockedId
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "user_blocks"
      )
      .select(
        "id"
      )
      .eq(
        "blocker_id",
        normalizedIds.blockerId
      )
      .eq(
        "blocked_id",
        normalizedIds.blockedId
      )
      .maybeSingle();

  if (error) {
    throw new Error(
      `ブロック状態を確認できませんでした: ${error.message}`
    );
  }

  return Boolean(
    data
  );
}

export async function getBlockedUserIds(
  supabase: SupabaseClient,
  blockerId: string
): Promise<Set<string>> {
  const normalizedBlockerId =
    assertRequiredText(
      blockerId,
      "ユーザーID"
    );

  const {
    data,
    error,
  } =
    await supabase
      .from(
        "user_blocks"
      )
      .select(
        "blocked_id"
      )
      .eq(
        "blocker_id",
        normalizedBlockerId
      );

  if (error) {
    throw new Error(
      `ブロック中のユーザーを取得できませんでした: ${error.message}`
    );
  }

  return new Set(
    (
      data ??
      []
    ).map(
      (
        row
      ) =>
        row.blocked_id as
          string
    )
  );
}

export async function getBlockedUserIdsArray(
  supabase: SupabaseClient,
  blockerId: string
): Promise<string[]> {
  const blockedUserIds =
    await getBlockedUserIds(
      supabase,
      blockerId
    );

  return [
    ...blockedUserIds,
  ];
}

export async function getBlockedUsers(
  supabase: SupabaseClient,
  blockerId: string
): Promise<BlockedUser[]> {
  const normalizedBlockerId =
    assertRequiredText(
      blockerId,
      "ユーザーID"
    );

  const {
    data:
      blockRows,
    error:
      blocksError,
  } =
    await supabase
      .from(
        "user_blocks"
      )
      .select(
        `
          blocked_id,
          created_at
        `
      )
      .eq(
        "blocker_id",
        normalizedBlockerId
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      )
      .returns<
        UserBlockRow[]
      >();

  if (blocksError) {
    throw new Error(
      `ブロック中のユーザーを取得できませんでした: ${blocksError.message}`
    );
  }

  const blocks =
    blockRows ??
    [];

  if (
    blocks.length ===
    0
  ) {
    return [];
  }

  const blockedUserIds =
    blocks.map(
      (
        block
      ) =>
        block.blocked_id
    );

  const {
    data:
      profileRows,
    error:
      profilesError,
  } =
    await supabase
      .from(
        "profiles"
      )
      .select(
        `
          id,
          username,
          avatar_url
        `
      )
      .in(
        "id",
        blockedUserIds
      )
      .returns<
        BlockedProfileRow[]
      >();

  if (profilesError) {
    throw new Error(
      `ブロック中のプロフィールを取得できませんでした: ${profilesError.message}`
    );
  }

  const profilesById =
    new Map<
      string,
      BlockedProfileRow
    >(
      (
        profileRows ??
        []
      ).map(
        (
          profile
        ) => [
          profile.id,
          profile,
        ]
      )
    );

  return blocks.map(
    (
      block
    ): BlockedUser => {
      const profile =
        profilesById.get(
          block.blocked_id
        );

      return {
        id:
          block.blocked_id,

        username:
          profile?.username ??
          null,

        avatarUrl:
          profile?.avatar_url ??
          null,

        blockedAt:
          block.created_at,
      };
    }
  );
}
