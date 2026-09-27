import "server-only";

import { createClient } from "@/lib/supabase/server";

export class AdminAccessError extends Error {
  constructor(
    public readonly status: 401 | 403,
    message: string
  ) {
    super(message);
  }
}

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    throw new AdminAccessError(401, "ログインが必要です。");
  }

  const { data: isAdmin, error: adminError } =
    await supabase.rpc("is_totono_admin");

  if (adminError || !isAdmin) {
    throw new AdminAccessError(403, "管理者権限が必要です。");
  }

  return user;
}
