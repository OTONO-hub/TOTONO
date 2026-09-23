import { revalidatePath } from "next/cache";

import {
  AdminAccessError,
  requireAdmin,
} from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  FACILITY_PHOTO_BUCKET,
  FACILITY_PHOTO_EVIDENCE_BUCKET,
} from "@/services/facility-photos";

export async function DELETE(
  request: Request,
  context: RouteContext<"/api/admin/facility-photos/[id]">
) {
  try {
    const user = await requireAdmin();
    const { id } = await context.params;
    const payload = (await request.json().catch(() => null)) as
      | { reason?: unknown }
      | null;
    const reason =
      typeof payload?.reason === "string" ? payload.reason.trim() : "";

    if (!reason) {
      return Response.json(
        { error: "削除理由を入力してください。" },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { data: photo, error } = await adminClient
      .from("facility_photos")
      .select(
        "id, sauna_id, storage_path, permission_evidence_path, public_url, is_hero"
      )
      .eq("id", id)
      .neq("review_status", "removed")
      .maybeSingle();

    if (error || !photo) {
      return Response.json(
        { error: "対象写真が見つかりません。" },
        { status: 404 }
      );
    }

    const { error: photoStorageError } = await adminClient.storage
      .from(FACILITY_PHOTO_BUCKET)
      .remove([photo.storage_path]);
    if (photoStorageError) throw photoStorageError;

    if (photo.permission_evidence_path) {
      const { error: evidenceError } = await adminClient.storage
        .from(FACILITY_PHOTO_EVIDENCE_BUCKET)
        .remove([photo.permission_evidence_path]);
      if (evidenceError) throw evidenceError;
    }

    const removedAt = new Date().toISOString();
    const { error: updateError } = await adminClient
      .from("facility_photos")
      .update({
        review_status: "removed",
        is_hero: false,
        removed_at: removedAt,
        removed_by: user.id,
        removal_reason: reason,
        updated_at: removedAt,
      })
      .eq("id", id);
    if (updateError) throw updateError;

    const { error: heroError } = await adminClient.rpc(
      "refresh_facility_photo_hero",
      { target_sauna_id: photo.sauna_id }
    );
    if (heroError) throw heroError;

    revalidatePath(`/saunas/${photo.sauna_id}`);
    revalidatePath("/search");
    revalidatePath("/admin/facility-photos");

    return Response.json({ removed: true });
  } catch (error) {
    if (error instanceof AdminAccessError) {
      return Response.json(
        { error: error.message },
        { status: error.status }
      );
    }
    console.error("Facility photo removal failed", error);
    return Response.json(
      { error: "施設写真を削除できませんでした。" },
      { status: 500 }
    );
  }
}
