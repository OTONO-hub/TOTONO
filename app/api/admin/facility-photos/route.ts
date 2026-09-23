import { randomUUID } from "node:crypto";

import { revalidatePath } from "next/cache";

import {
  AdminAccessError,
  requireAdmin,
} from "@/lib/admin/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  createSafeExtension,
  FACILITY_PHOTO_BUCKET,
  FACILITY_PHOTO_EVIDENCE_BUCKET,
  validateEvidenceFile,
  validateFacilityPhotoFile,
  validateRightsMetadata,
} from "@/services/facility-photos";

function field(formData: FormData, name: string): string {
  const value = formData.get(name);
  return typeof value === "string" ? value.trim() : "";
}

function errorResponse(error: unknown) {
  if (error instanceof AdminAccessError) {
    return Response.json(
      { error: error.message },
      { status: error.status }
    );
  }

  console.error("Facility photo upload failed", error);
  return Response.json(
    { error: "施設写真を登録できませんでした。" },
    { status: 500 }
  );
}

export async function POST(request: Request) {
  try {
    const user = await requireAdmin();
    const formData = await request.formData();
    const saunaId = field(formData, "saunaId");
    const sourceType = field(formData, "sourceType");
    const photographerName = field(formData, "photographerName");
    const rightsHolderName = field(formData, "rightsHolderName");
    const permissionScope = field(formData, "permissionScope");
    const permissionEvidenceNote = field(
      formData,
      "permissionEvidenceNote"
    );
    const sourceUrl = field(formData, "sourceUrl");
    const licenseName = field(formData, "licenseName");
    const licenseUrl = field(formData, "licenseUrl");
    const attributionText = field(formData, "attributionText");
    const capturedAt = field(formData, "capturedAt");
    const reviewNote = field(formData, "reviewNote");
    const photo = formData.get("photo");
    const evidence = formData.get("evidence");

    if (!saunaId || !(photo instanceof File)) {
      return Response.json(
        { error: "施設と外観写真を選択してください。" },
        { status: 400 }
      );
    }

    const rightsError = validateRightsMetadata({
      sourceType,
      photographerName,
      rightsHolderName,
      permissionScope,
      permissionEvidenceNote,
      sourceUrl,
      licenseName,
      licenseUrl,
    });
    const photoError = validateFacilityPhotoFile(photo);
    const evidenceError =
      evidence instanceof File && evidence.size > 0
        ? validateEvidenceFile(evidence)
        : null;

    if (rightsError || photoError || evidenceError) {
      return Response.json(
        { error: rightsError ?? photoError ?? evidenceError },
        { status: 400 }
      );
    }

    const adminClient = createAdminClient();
    const { data: sauna, error: saunaError } = await adminClient
      .from("saunas")
      .select("id")
      .eq("id", saunaId)
      .maybeSingle();

    if (saunaError || !sauna) {
      return Response.json(
        { error: "対象施設が見つかりません。" },
        { status: 404 }
      );
    }

    const photoId = randomUUID();
    const photoPath = `${saunaId}/${photoId}.${createSafeExtension(photo)}`;
    let evidencePath: string | null = null;

    const { error: uploadError } = await adminClient.storage
      .from(FACILITY_PHOTO_BUCKET)
      .upload(photoPath, photo, {
        contentType: photo.type,
        upsert: false,
      });

    if (uploadError) throw uploadError;

    try {
      if (evidence instanceof File && evidence.size > 0) {
        evidencePath = `${saunaId}/${photoId}.${createSafeExtension(evidence)}`;
        const { error: evidenceUploadError } = await adminClient.storage
          .from(FACILITY_PHOTO_EVIDENCE_BUCKET)
          .upload(evidencePath, evidence, {
            contentType: evidence.type,
            upsert: false,
          });
        if (evidenceUploadError) throw evidenceUploadError;
      }

      const { data: publicUrlData } = adminClient.storage
        .from(FACILITY_PHOTO_BUCKET)
        .getPublicUrl(photoPath);

      const { error: insertError } = await adminClient
        .from("facility_photos")
        .insert({
          id: photoId,
          sauna_id: saunaId,
          storage_path: photoPath,
          public_url: publicUrlData.publicUrl,
          source_type: sourceType,
          photographer_name: photographerName,
          rights_holder_name: rightsHolderName,
          permission_scope: permissionScope,
          permission_evidence_note: permissionEvidenceNote,
          permission_evidence_path: evidencePath,
          source_url: sourceUrl || null,
          license_name: licenseName || null,
          license_url: licenseUrl || null,
          attribution_text: attributionText || null,
          captured_at: capturedAt || null,
          review_status: "approved",
          review_note: reviewNote || null,
          reviewed_by: user.id,
          reviewed_at: new Date().toISOString(),
          is_hero: false,
          created_by: user.id,
        });
      if (insertError) throw insertError;

      const { error: heroError } = await adminClient.rpc(
        "set_facility_photo_hero",
        { target_photo_id: photoId }
      );
      if (heroError) throw heroError;

      revalidatePath(`/saunas/${saunaId}`);
      revalidatePath("/search");
      revalidatePath("/admin/facility-photos");

      return Response.json({ id: photoId }, { status: 201 });
    } catch (error) {
      await adminClient
        .from("facility_photos")
        .delete()
        .eq("id", photoId);
      await adminClient.storage
        .from(FACILITY_PHOTO_BUCKET)
        .remove([photoPath]);
      if (evidencePath) {
        await adminClient.storage
          .from(FACILITY_PHOTO_EVIDENCE_BUCKET)
          .remove([evidencePath]);
      }
      throw error;
    }
  } catch (error) {
    return errorResponse(error);
  }
}
