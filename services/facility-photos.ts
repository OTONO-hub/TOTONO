export const FACILITY_PHOTO_BUCKET = "facility-photos";
export const FACILITY_PHOTO_EVIDENCE_BUCKET = "facility-photo-evidence";
export const MAX_FACILITY_PHOTO_BYTES = 10 * 1024 * 1024;

export type FacilityPhotoSourceType =
  | "self_shot"
  | "facility_provided"
  | "open_license";

const PHOTO_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
]);

const EVIDENCE_MIME_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "application/pdf",
]);

export function isFacilityPhotoSourceType(
  value: string
): value is FacilityPhotoSourceType {
  return [
    "self_shot",
    "facility_provided",
    "open_license",
  ].includes(value);
}

export function validateFacilityPhotoFile(file: File): string | null {
  if (!PHOTO_MIME_TYPES.has(file.type)) {
    return "施設写真はJPEG・PNG・WebPのみ登録できます。";
  }
  if (file.size <= 0 || file.size > MAX_FACILITY_PHOTO_BYTES) {
    return "施設写真は10MB以下にしてください。";
  }
  return null;
}

export function validateEvidenceFile(file: File): string | null {
  if (!EVIDENCE_MIME_TYPES.has(file.type)) {
    return "許諾証拠はJPEG・PNG・PDFのみ登録できます。";
  }
  if (file.size <= 0 || file.size > MAX_FACILITY_PHOTO_BYTES) {
    return "許諾証拠は10MB以下にしてください。";
  }
  return null;
}

export function validateRightsMetadata(input: {
  sourceType: string;
  photographerName: string;
  rightsHolderName: string;
  permissionScope: string;
  permissionEvidenceNote: string;
  sourceUrl: string;
  licenseName: string;
  licenseUrl: string;
}): string | null {
  if (!isFacilityPhotoSourceType(input.sourceType)) {
    return "許可された登録元を選択してください。";
  }

  if (
    !input.photographerName.trim() ||
    !input.rightsHolderName.trim() ||
    !input.permissionScope.trim() ||
    !input.permissionEvidenceNote.trim()
  ) {
    return "撮影者・権利者・許諾範囲・許諾証拠の説明は必須です。";
  }

  if (
    input.sourceType === "open_license" &&
    (!input.sourceUrl.trim() ||
      !input.licenseName.trim() ||
      !input.licenseUrl.trim())
  ) {
    return "オープンライセンス写真には出典URL・ライセンス名・ライセンスURLが必要です。";
  }

  return null;
}

export function createSafeExtension(file: File): string {
  if (file.type === "image/png") return "png";
  if (file.type === "image/webp") return "webp";
  if (file.type === "application/pdf") return "pdf";
  return "jpg";
}
