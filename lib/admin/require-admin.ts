import "server-only";

import { createAdminClient } from "@/lib/supabase/admin";
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

  const appRole = user.app_metadata?.role;
  if (appRole === "admin") {
    return user;
  }

  const adminClient = createAdminClient();
  const { data, error: adminError } = await adminClient
    .from("admin_users")
    .select("user_id")
    .eq("user_id", user.id)
    .maybeSingle();

  if (adminError || !data) {
    throw new AdminAccessError(403, "管理者権限が必要です。");
  }

  return user;
}
