import {
  createHash,
  randomUUID,
} from "node:crypto";

import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";

import {
  OPEN_LICENSE_FACILITY_PHOTO_PILOT,
  type OpenLicenseFacilityPhoto,
} from "../data/open-license-facility-photo-pilot";
import {
  FACILITY_PHOTO_BUCKET,
  MAX_FACILITY_PHOTO_BYTES,
} from "../services/facility-photos";

const REVIEWED_AT = "2026-11-14T00:00:00.000Z";
const REVIEW_DATE = "2026-11-14";
const WRITE_MODE = process.argv.includes("--write");

type SaunaRow = {
  id: string;
  name: string;
  normalized_name: string | null;
  prefecture: string | null;
  city: string | null;
  address: string | null;
};

type ExistingPhotoRow = {
  id: string;
  review_status: string;
  is_hero: boolean;
  removed_at: string | null;
};

type ImportOutcome = {
  key: string;
  facilityName: string | null;
  status: "ready" | "created" | "already_registered" | "blocked" | "error";
  detail: string;
};

function requiredEnvironmentVariable(name: string): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`環境変数 ${name} が設定されていません。`);
  }

  return value;
}

function createAdminClient(): SupabaseClient {
  return createClient(
    requiredEnvironmentVariable("NEXT_PUBLIC_SUPABASE_URL"),
    requiredEnvironmentVariable("SUPABASE_SERVICE_ROLE_KEY"),
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

function normalizeFacilityName(value: string): string {
  return value
    .normalize("NFKC")
    .replace(/[\s　]+/gu, "")
    .toLocaleLowerCase("ja-JP");
}

function matchesCity(
  sauna: SaunaRow,
  cityIncludes: string | undefined
): boolean {
  if (!cityIncludes) return true;

  const location = `${sauna.city ?? ""}${sauna.address ?? ""}`;
  return normalizeFacilityName(location).includes(
    normalizeFacilityName(cityIncludes)
  );
}

async function resolveSauna(
  client: SupabaseClient,
  photo: OpenLicenseFacilityPhoto
): Promise<SaunaRow> {
  const { data, error } = await client
    .from("saunas")
    .select("id, name, normalized_name, prefecture, city, address")
    .eq("prefecture", photo.facility.prefecture)
    .limit(1000);

  if (error) throw error;

  const aliasSet = new Set(
    photo.facility.nameAliases.map(normalizeFacilityName)
  );

  const nameMatches = ((data ?? []) as SaunaRow[]).filter((sauna) => {
    const names = [sauna.name, sauna.normalized_name]
      .filter((value): value is string => Boolean(value))
      .map(normalizeFacilityName);

    return names.some((name) => aliasSet.has(name));
  });

  const cityMatches = nameMatches.filter((sauna) =>
    matchesCity(sauna, photo.facility.cityIncludes)
  );

  if (cityMatches.length === 1) return cityMatches[0];

  if (cityMatches.length > 1) {
    throw new Error(
      `施設候補が複数あります: ${cityMatches
        .map((sauna) => `${sauna.name} (${sauna.id})`)
        .join(", ")}`
    );
  }

  if (nameMatches.length === 1 && photo.facility.cityIncludes) {
    throw new Error(
      `施設名は一致しましたが所在地が ${photo.facility.cityIncludes} と一致しません: ${nameMatches[0].name}`
    );
  }

  throw new Error(
    `施設が見つかりません: ${photo.facility.nameAliases.join(" / ")} (${photo.facility.prefecture})`
  );
}

async function findExistingPhoto(
  client: SupabaseClient,
  saunaId: string,
  sourceUrl: string
): Promise<ExistingPhotoRow | null> {
  const { data, error } = await client
    .from("facility_photos")
    .select("id, review_status, is_hero, removed_at")
    .eq("sauna_id", saunaId)
    .eq("source_url", sourceUrl)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;
  return data as ExistingPhotoRow | null;
}

async function resolveAdminUserId(client: SupabaseClient): Promise<string> {
  const configuredId = process.env.FACILITY_PHOTO_ADMIN_USER_ID?.trim();

  if (configuredId) {
    const { data, error } = await client
      .from("admin_users")
      .select("user_id")
      .eq("user_id", configuredId)
      .maybeSingle();

    if (error) throw error;
    if (!data) {
      throw new Error(
        "FACILITY_PHOTO_ADMIN_USER_ID が admin_users に登録されていません。"
      );
    }

    return configuredId;
  }

  const { data, error } = await client
    .from("admin_users")
    .select("user_id")
    .order("created_at", { ascending: true })
    .limit(2);

  if (error) throw error;

  const rows = (data ?? []) as { user_id: string }[];

  if (rows.length !== 1) {
    throw new Error(
      rows.length === 0
        ? "admin_users に管理者が登録されていません。"
        : "管理者が複数います。FACILITY_PHOTO_ADMIN_USER_ID を指定してください。"
    );
  }

  return rows[0].user_id;
}

function fileExtension(contentType: string): "jpg" | "png" | "webp" {
  if (contentType === "image/png") return "png";
  if (contentType === "image/webp") return "webp";
  return "jpg";
}

async function downloadPhoto(photo: OpenLicenseFacilityPhoto): Promise<{
  bytes: ArrayBuffer;
  contentType: "image/jpeg" | "image/png" | "image/webp";
}> {
  const response = await fetch(photo.downloadUrl, {
    headers: {
      "User-Agent":
        "TOTONO-FacilityPhotoImporter/1.0 (https://totono-nine.vercel.app)",
    },
    redirect: "follow",
  });

  if (!response.ok) {
    throw new Error(
      `画像取得に失敗しました (${response.status}): ${photo.sourceUrl}`
    );
  }

  const contentType = response.headers
    .get("content-type")
    ?.split(";")[0]
    ?.trim();

  if (
    contentType !== "image/jpeg" &&
    contentType !== "image/png" &&
    contentType !== "image/webp"
  ) {
    throw new Error(
      `許可されていない画像形式です (${contentType ?? "不明"}): ${photo.sourceUrl}`
    );
  }

  const bytes = await response.arrayBuffer();

  if (bytes.byteLength <= 0 || bytes.byteLength > MAX_FACILITY_PHOTO_BYTES) {
    throw new Error(
      `画像サイズが10MBの上限を超えています: ${photo.sourceUrl}`
    );
  }

  return { bytes, contentType };
}

async function markAsPilot(
  client: SupabaseClient,
  saunaId: string,
  adminUserId: string
): Promise<void> {
  const { error } = await client
    .from("facility_photo_pilot_facilities")
    .upsert(
      {
        sauna_id: saunaId,
        selected_by: adminUserId,
        note: "オープンライセンス写真・初回10施設検証枠",
      },
      { onConflict: "sauna_id" }
    );

  if (error) throw error;
}

async function createPhoto(
  client: SupabaseClient,
  sauna: SaunaRow,
  photo: OpenLicenseFacilityPhoto,
  adminUserId: string
): Promise<void> {
  const photoId = randomUUID();
  const downloaded = await downloadPhoto(photo);
  const sha256 = createHash("sha256")
    .update(new Uint8Array(downloaded.bytes))
    .digest("hex");
  const storagePath = `open-license/${sauna.id}/${photoId}.${fileExtension(
    downloaded.contentType
  )}`;

  const { error: uploadError } = await client.storage
    .from(FACILITY_PHOTO_BUCKET)
    .upload(storagePath, downloaded.bytes, {
      contentType: downloaded.contentType,
      upsert: false,
    });

  if (uploadError) throw uploadError;

  try {
    const { data: publicUrlData } = client.storage
      .from(FACILITY_PHOTO_BUCKET)
      .getPublicUrl(storagePath);

    const changeNotice =
      photo.licenseName === "CC0 1.0"
        ? "表示用にリサイズ・トリミング"
        : "表示用にリサイズ・トリミング、同ライセンス";
    const attributionText =
      `「${photo.workTitle}」写真: ${photo.photographerName} / ` +
      `Wikimedia Commons / ${photo.licenseName}（${changeNotice}）`;

    const { error: insertError } = await client
      .from("facility_photos")
      .insert({
        id: photoId,
        sauna_id: sauna.id,
        storage_path: storagePath,
        public_url: publicUrlData.publicUrl,
        source_type: "open_license",
        photographer_name: photo.photographerName,
        rights_holder_name: photo.photographerName,
        permission_scope:
          `${photo.licenseName}の条件に従い、TOTONO Web・iOSで表示。` +
          "表示最適化のためのリサイズ・トリミングを含む。",
        permission_evidence_note:
          `${REVIEW_DATE}にWikimedia Commonsのファイルページで` +
          `撮影者・ライセンス・施設外観の一致を確認。` +
          `取得画像SHA-256: ${sha256} / 出典: ${photo.sourceUrl}`,
        permission_evidence_path: null,
        source_url: photo.sourceUrl,
        license_name: photo.licenseName,
        license_url: photo.licenseUrl,
        attribution_text: attributionText,
        captured_at: photo.capturedAt,
        review_status: "approved",
        review_note:
          "Wikimedia Commonsの出典とライセンスを確認した初回10施設検証枠。",
        reviewed_by: adminUserId,
        reviewed_at: REVIEWED_AT,
        is_hero: false,
        created_by: adminUserId,
      });

    if (insertError) throw insertError;

    const { error: heroError } = await client.rpc(
      "set_facility_photo_hero",
      { target_photo_id: photoId }
    );

    if (heroError) throw heroError;
  } catch (error) {
    await client.from("facility_photos").delete().eq("id", photoId);
    await client.storage.from(FACILITY_PHOTO_BUCKET).remove([storagePath]);
    throw error;
  }
}

async function importOne(
  client: SupabaseClient,
  photo: OpenLicenseFacilityPhoto,
  adminUserId: string | null
): Promise<ImportOutcome> {
  try {
    const sauna = await resolveSauna(client, photo);
    const existing = await findExistingPhoto(
      client,
      sauna.id,
      photo.sourceUrl
    );

    if (existing?.removed_at || existing?.review_status === "removed") {
      return {
        key: photo.key,
        facilityName: sauna.name,
        status: "blocked",
        detail: "削除済み写真のため、自動再登録しません。",
      };
    }

    if (existing && existing.review_status !== "approved") {
      return {
        key: photo.key,
        facilityName: sauna.name,
        status: "blocked",
        detail: `既存写真が ${existing.review_status} のため、自動変更しません。`,
      };
    }

    if (existing) {
      if (WRITE_MODE && !existing.is_hero) {
        const { error } = await client.rpc("set_facility_photo_hero", {
          target_photo_id: existing.id,
        });
        if (error) throw error;
      }

      return {
        key: photo.key,
        facilityName: sauna.name,
        status: "already_registered",
        detail: existing.is_hero
          ? "同じ出典のHero写真が登録済みです。"
          : WRITE_MODE
            ? "同じ出典の承認済み写真をHeroへ設定しました。"
            : "同じ出典の承認済み写真があります。",
      };
    }

    if (!WRITE_MODE) {
      return {
        key: photo.key,
        facilityName: sauna.name,
        status: "ready",
        detail: `${photo.photographerName} / ${photo.licenseName}`,
      };
    }

    if (!adminUserId) {
      throw new Error("管理者ユーザーIDを解決できませんでした。");
    }

    await markAsPilot(client, sauna.id, adminUserId);
    await createPhoto(client, sauna, photo, adminUserId);

    return {
      key: photo.key,
      facilityName: sauna.name,
      status: "created",
      detail: `${photo.photographerName} / ${photo.licenseName}`,
    };
  } catch (error) {
    return {
      key: photo.key,
      facilityName: null,
      status: "error",
      detail: error instanceof Error ? error.message : String(error),
    };
  }
}

async function main(): Promise<void> {
  const client = createAdminClient();
  const adminUserId = WRITE_MODE ? await resolveAdminUserId(client) : null;

  console.log(
    WRITE_MODE
      ? "施設写真をSupabaseへ登録します。"
      : "ドライランです。DB・Storageは変更しません。"
  );

  const outcomes: ImportOutcome[] = [];

  for (const photo of OPEN_LICENSE_FACILITY_PHOTO_PILOT) {
    const outcome = await importOne(client, photo, adminUserId);
    outcomes.push(outcome);
    console.log(
      `[${outcome.status}] ${outcome.facilityName ?? outcome.key}: ${outcome.detail}`
    );
  }

  const errors = outcomes.filter(
    (outcome) => outcome.status === "error" || outcome.status === "blocked"
  );

  console.log(
    `完了: ${outcomes.length - errors.length}/${outcomes.length}件が確認済み、` +
      `${errors.length}件に確認事項があります。`
  );

  if (errors.length > 0) process.exitCode = 1;
}

void main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
