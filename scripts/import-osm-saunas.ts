import {
  createClient,
  type SupabaseClient,
} from "@supabase/supabase-js";
import {
  mkdir,
  writeFile,
} from "node:fs/promises";
import path from "node:path";

const DEFAULT_OVERPASS_API_URLS = [
  "https://overpass-api.de/api/interpreter",
  "https://overpass.kumi.systems/api/interpreter",
  "https://overpass.nchc.org.tw/api/interpreter",
];

const IMPORT_SOURCE = "openstreetmap";
const UPSERT_BATCH_SIZE = 100;
const REQUEST_TIMEOUT_MS = 180_000;
const PREFECTURE_REQUEST_DELAY_MS = 10_000;
const MAX_REQUEST_ATTEMPTS = 5;
const RETRY_BASE_DELAY_MS = 5_000;

const OUTPUT_DIRECTORY = path.resolve(
  process.cwd(),
  "data",
  "sauna-imports"
);

type PrefectureConfig = {
  name: string;
  isoCode: string;
  fileSlug: string;
};

const PREFECTURES: PrefectureConfig[] = [
  { name: "北海道", isoCode: "JP-01", fileSlug: "hokkaido" },
  { name: "青森県", isoCode: "JP-02", fileSlug: "aomori" },
  { name: "岩手県", isoCode: "JP-03", fileSlug: "iwate" },
  { name: "宮城県", isoCode: "JP-04", fileSlug: "miyagi" },
  { name: "秋田県", isoCode: "JP-05", fileSlug: "akita" },
  { name: "山形県", isoCode: "JP-06", fileSlug: "yamagata" },
  { name: "福島県", isoCode: "JP-07", fileSlug: "fukushima" },
  { name: "茨城県", isoCode: "JP-08", fileSlug: "ibaraki" },
  { name: "栃木県", isoCode: "JP-09", fileSlug: "tochigi" },
  { name: "群馬県", isoCode: "JP-10", fileSlug: "gunma" },
  { name: "埼玉県", isoCode: "JP-11", fileSlug: "saitama" },
  { name: "千葉県", isoCode: "JP-12", fileSlug: "chiba" },
  { name: "東京都", isoCode: "JP-13", fileSlug: "tokyo" },
  { name: "神奈川県", isoCode: "JP-14", fileSlug: "kanagawa" },
  { name: "新潟県", isoCode: "JP-15", fileSlug: "niigata" },
  { name: "富山県", isoCode: "JP-16", fileSlug: "toyama" },
  { name: "石川県", isoCode: "JP-17", fileSlug: "ishikawa" },
  { name: "福井県", isoCode: "JP-18", fileSlug: "fukui" },
  { name: "山梨県", isoCode: "JP-19", fileSlug: "yamanashi" },
  { name: "長野県", isoCode: "JP-20", fileSlug: "nagano" },
  { name: "岐阜県", isoCode: "JP-21", fileSlug: "gifu" },
  { name: "静岡県", isoCode: "JP-22", fileSlug: "shizuoka" },
  { name: "愛知県", isoCode: "JP-23", fileSlug: "aichi" },
  { name: "三重県", isoCode: "JP-24", fileSlug: "mie" },
  { name: "滋賀県", isoCode: "JP-25", fileSlug: "shiga" },
  { name: "京都府", isoCode: "JP-26", fileSlug: "kyoto" },
  { name: "大阪府", isoCode: "JP-27", fileSlug: "osaka" },
  { name: "兵庫県", isoCode: "JP-28", fileSlug: "hyogo" },
  { name: "奈良県", isoCode: "JP-29", fileSlug: "nara" },
  { name: "和歌山県", isoCode: "JP-30", fileSlug: "wakayama" },
  { name: "鳥取県", isoCode: "JP-31", fileSlug: "tottori" },
  { name: "島根県", isoCode: "JP-32", fileSlug: "shimane" },
  { name: "岡山県", isoCode: "JP-33", fileSlug: "okayama" },
  { name: "広島県", isoCode: "JP-34", fileSlug: "hiroshima" },
  { name: "山口県", isoCode: "JP-35", fileSlug: "yamaguchi" },
  { name: "徳島県", isoCode: "JP-36", fileSlug: "tokushima" },
  { name: "香川県", isoCode: "JP-37", fileSlug: "kagawa" },
  { name: "愛媛県", isoCode: "JP-38", fileSlug: "ehime" },
  { name: "高知県", isoCode: "JP-39", fileSlug: "kochi" },
  { name: "福岡県", isoCode: "JP-40", fileSlug: "fukuoka" },
  { name: "佐賀県", isoCode: "JP-41", fileSlug: "saga" },
  { name: "長崎県", isoCode: "JP-42", fileSlug: "nagasaki" },
  { name: "熊本県", isoCode: "JP-43", fileSlug: "kumamoto" },
  { name: "大分県", isoCode: "JP-44", fileSlug: "oita" },
  { name: "宮崎県", isoCode: "JP-45", fileSlug: "miyazaki" },
  { name: "鹿児島県", isoCode: "JP-46", fileSlug: "kagoshima" },
  { name: "沖縄県", isoCode: "JP-47", fileSlug: "okinawa" },
];

type OsmElementType =
  | "node"
  | "way"
  | "relation";

type OsmTags = Record<string, string>;

type OsmElement = {
  id: number;
  type: OsmElementType;
  lat?: number;
  lon?: number;
  center?: {
    lat: number;
    lon: number;
  };
  timestamp?: string;
  tags?: OsmTags;
};

type OverpassResponse = {
  elements?: OsmElement[];
};

type SaunaImportRow = {
  name: string;
  normalized_name: string;
  address: string | null;
  prefecture: string;
  city: string | null;
  postal_code: string | null;
  latitude: number | null;
  longitude: number | null;
  phone_number: string | null;
  website_url: string | null;
  opening_hours: string | null;
  image_url: null;
  google_place_id: null;
  source: string;
  source_id: string;
  source_url: string;
  source_updated_at: string | null;
  imported_at: string;
  last_synced_at: string;
  has_sauna_room: boolean;
  has_cold_bath: boolean;
  has_outdoor_air_bath: boolean;
  has_rest_area: boolean;
  has_restaurant: boolean;
  has_parking: boolean;
  is_verified: boolean;
};

type RejectedSaunaRow = {
  original_name: string | null;
  source_id: string;
  source_url: string;
  reason: string;
};

type ImportResult = {
  acceptedRows: SaunaImportRow[];
  rejectedRows: RejectedSaunaRow[];
};

type PrefectureImportSummary = {
  prefecture: string;
  fetched: number;
  accepted: number;
  rejected: number;
  written: number;
  error: string | null;
};

const CLOSED_NAME_PATTERNS = [
  "閉業",
  "閉店",
  "閉館",
  "廃業",
  "廃止",
  "営業終了",
  "解体済",
  "取り壊し",
  "跡地",
  "(跡)",
  "（跡）",
];

const ROCK_BATH_NAME_PATTERNS = [
  "岩盤浴",
  "岩盤ヨガ",
  "ホットヨガ",
];

const EDITOR_NOTE_PATTERNS = [
  /ハートにジャストミート/u,
  /\d{6,}$/u,
  /\d{6,}\s*$/u,
];

function hasArgument(argument: string): boolean {
  return process.argv.includes(argument);
}

function getArgumentValue(prefix: string): string | null {
  const argument = process.argv.find((value) =>
    value.startsWith(`${prefix}=`)
  );

  if (!argument) {
    return null;
  }

  return argument.slice(prefix.length + 1).trim() || null;
}

function getRequiredEnvironmentVariable(
  name: string
): string {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(
      `環境変数 ${name} が設定されていません。`
    );
  }

  return value;
}

function createAdminClient(): SupabaseClient {
  const supabaseUrl =
    getRequiredEnvironmentVariable(
      "NEXT_PUBLIC_SUPABASE_URL"
    );

  const serviceRoleKey =
    getRequiredEnvironmentVariable(
      "SUPABASE_SERVICE_ROLE_KEY"
    );

  return createClient(
    supabaseUrl,
    serviceRoleKey,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    }
  );
}

function findPrefecture(
  value: string
): PrefectureConfig | null {
  const normalizedValue =
    value.trim().toLowerCase();

  return (
    PREFECTURES.find(
      (candidate) =>
        candidate.name === value.trim() ||
        candidate.isoCode.toLowerCase() ===
          normalizedValue ||
        candidate.fileSlug === normalizedValue
    ) ?? null
  );
}

function resolveTargetPrefectures(): PrefectureConfig[] {
  if (hasArgument("--all")) {
    const startValue =
      getArgumentValue("--start");

    if (!startValue) {
      return PREFECTURES;
    }

    const startPrefecture =
      findPrefecture(startValue);

    if (!startPrefecture) {
      throw new Error(
        `開始都道府県「${startValue}」が見つかりません。`
      );
    }

    const startIndex =
      PREFECTURES.findIndex(
        (candidate) =>
          candidate.isoCode ===
          startPrefecture.isoCode
      );

    return PREFECTURES.slice(startIndex);
  }

  const requestedPrefecture =
    getArgumentValue("--prefecture") ?? "東京都";

  const prefecture =
    findPrefecture(requestedPrefecture);

  if (!prefecture) {
    throw new Error(
      `対象都道府県「${requestedPrefecture}」が見つかりません。`
    );
  }

  return [prefecture];
}

function createOverpassQuery(
  prefecture: PrefectureConfig
): string {
  return `
[out:json][timeout:150];

area
  ["boundary"="administrative"]
  ["ISO3166-2"="${prefecture.isoCode}"]
  ->.targetArea;

(
  nwr["leisure"="sauna"](area.targetArea);
  nwr["sauna"="yes"](area.targetArea);
  nwr["amenity"="public_bath"]["sauna"="yes"](area.targetArea);
  nwr["amenity"="public_bath"]["bath:type"="sauna"](area.targetArea);
);

out center meta;
`;
}

function sleep(milliseconds: number): Promise<void> {
  return new Promise((resolve) => {
    setTimeout(resolve, milliseconds);
  });
}

function getOverpassApiUrls(): string[] {
  const customUrl =
    process.env.OVERPASS_API_URL?.trim();

  if (customUrl) {
    return [
      customUrl,
      ...DEFAULT_OVERPASS_API_URLS.filter(
        (url) => url !== customUrl
      ),
    ];
  }

  return DEFAULT_OVERPASS_API_URLS;
}

function getRetryDelayMs(
  attempt: number
): number {
  return (
    RETRY_BASE_DELAY_MS *
    2 ** (attempt - 1)
  );
}

async function fetchOsmElements(
  prefecture: PrefectureConfig
): Promise<OsmElement[]> {
  const endpoints =
    getOverpassApiUrls();

  let lastError: unknown = null;

  for (
    let attempt = 1;
    attempt <= MAX_REQUEST_ATTEMPTS;
    attempt += 1
  ) {
    const endpoint =
      endpoints[
        (attempt - 1) %
          endpoints.length
      ];

    const controller =
      new AbortController();

    const timeoutId = setTimeout(() => {
      controller.abort();
    }, REQUEST_TIMEOUT_MS);

    try {
      console.log(
        `取得先: ${endpoint} ` +
        `(${attempt}/${MAX_REQUEST_ATTEMPTS})`
      );

      const response = await fetch(
        endpoint,
        {
          method: "POST",
          headers: {
            "Content-Type":
              "application/x-www-form-urlencoded;charset=UTF-8",
            "User-Agent":
              "TOTONO-Sauna-Importer/1.0",
          },
          body: new URLSearchParams({
            data: createOverpassQuery(
              prefecture
            ),
          }),
          signal: controller.signal,
        }
      );

      if (!response.ok) {
        throw new Error(
          `HTTP ${response.status}`
        );
      }

      const payload =
        (await response.json()) as OverpassResponse;

      return payload.elements ?? [];
    } catch (error) {
      lastError = error;

      if (
        attempt <
        MAX_REQUEST_ATTEMPTS
      ) {
        const retryDelay =
          getRetryDelayMs(attempt);

        console.warn(
          `${prefecture.name}の取得に失敗しました。` +
          `${retryDelay / 1000}秒後に別の取得先も含めて再試行します。 ` +
          `(${attempt}/${MAX_REQUEST_ATTEMPTS})`
        );

        await sleep(retryDelay);
      }
    } finally {
      clearTimeout(timeoutId);
    }
  }

  const message =
    lastError instanceof Error
      ? lastError.message
      : String(lastError);

  throw new Error(
    `${prefecture.name}のOpenStreetMapデータ取得に失敗しました: ${message}`
  );
}

function normalizeName(name: string): string {
  return name
    .normalize("NFKC")
    .trim()
    .replace(/\s+/g, "")
    .toLowerCase();
}

function sanitizeFacilityName(
  name: string
): string {
  return name
    .normalize("NFKC")
    .replace(/[；;]/g, "・")
    .replace(/\s+/g, " ")
    .trim();
}

function getFirstTag(
  tags: OsmTags,
  keys: string[]
): string | null {
  for (const key of keys) {
    const value = tags[key]?.trim();

    if (value) {
      return value;
    }
  }

  return null;
}

function getFacilityName(
  tags: OsmTags
): string | null {
  return getFirstTag(tags, [
    "name:ja",
    "name",
    "official_name:ja",
    "official_name",
    "brand:ja",
    "brand",
  ]);
}

function getCity(tags: OsmTags): string | null {
  return getFirstTag(tags, [
    "addr:city",
    "addr:ward",
    "addr:town",
    "addr:suburb",
    "addr:village",
  ]);
}

function createAddress(
  tags: OsmTags
): string | null {
  const fullAddress = getFirstTag(tags, [
    "addr:full",
    "contact:address",
  ]);

  if (fullAddress) {
    return fullAddress;
  }

  const addressParts = [
    tags["addr:province"],
    tags["addr:city"],
    tags["addr:ward"],
    tags["addr:district"],
    tags["addr:suburb"],
    tags["addr:quarter"],
    tags["addr:neighbourhood"],
    tags["addr:block_number"],
    tags["addr:housenumber"],
    tags["addr:street"],
  ]
    .map((value) => value?.trim())
    .filter(
      (value): value is string =>
        Boolean(value)
    );

  if (addressParts.length === 0) {
    return null;
  }

  return Array.from(
    new Set(addressParts)
  ).join("");
}

function getCoordinates(
  element: OsmElement
): {
  latitude: number | null;
  longitude: number | null;
} {
  if (
    typeof element.lat === "number" &&
    typeof element.lon === "number"
  ) {
    return {
      latitude: element.lat,
      longitude: element.lon,
    };
  }

  if (
    typeof element.center?.lat === "number" &&
    typeof element.center?.lon === "number"
  ) {
    return {
      latitude: element.center.lat,
      longitude: element.center.lon,
    };
  }

  return {
    latitude: null,
    longitude: null,
  };
}

function parseBooleanTag(
  value: string | undefined
): boolean {
  if (!value) {
    return false;
  }

  return [
    "yes",
    "true",
    "1",
    "designated",
    "permissive",
  ].includes(value.trim().toLowerCase());
}

function includesAnyPattern(
  value: string,
  patterns: string[]
): boolean {
  return patterns.some((pattern) =>
    value.includes(pattern)
  );
}

function hasEditorNotePattern(
  name: string
): boolean {
  return EDITOR_NOTE_PATTERNS.some(
    (pattern) => pattern.test(name)
  );
}

function getRejectionReason(
  element: OsmElement,
  name: string | null
): string | null {
  const tags = element.tags ?? {};

  if (!name) {
    return "施設名がありません";
  }

  const sanitizedName =
    sanitizeFacilityName(name);

  if (!sanitizedName) {
    return "施設名が空です";
  }

  if (
    includesAnyPattern(
      sanitizedName,
      CLOSED_NAME_PATTERNS
    )
  ) {
    return "施設名に閉店・廃業を示す表記があります";
  }

  if (
    tags.disused === "yes" ||
    tags.abandoned === "yes" ||
    tags.demolished === "yes" ||
    tags.removed === "yes"
  ) {
    return "OSMタグで廃止・撤去済みと判定されました";
  }

  if (
    tags["disused:amenity"] ||
    tags["abandoned:amenity"] ||
    tags["demolished:amenity"]
  ) {
    return "OSMタグで旧施設と判定されました";
  }

  if (
    includesAnyPattern(
      sanitizedName,
      ROCK_BATH_NAME_PATTERNS
    ) &&
    !sanitizedName.includes("サウナ")
  ) {
    return "岩盤浴・ホットヨガのみの可能性があります";
  }

  if (
    hasEditorNotePattern(
      sanitizedName
    )
  ) {
    return "施設名に編集メモまたは管理用文字列が含まれています";
  }

  if (sanitizedName.length > 100) {
    return "施設名が長すぎます";
  }

  return null;
}

function createImportRow(
  element: OsmElement,
  prefecture: PrefectureConfig,
  importedAt: string
): SaunaImportRow | null {
  const tags = element.tags ?? {};

  const originalName =
    getFacilityName(tags);

  if (!originalName) {
    return null;
  }

  const name =
    sanitizeFacilityName(
      originalName
    );

  const normalizedName =
    normalizeName(name);

  if (!normalizedName) {
    return null;
  }

  const {
    latitude,
    longitude,
  } = getCoordinates(element);

  const sourceId =
    `${element.type}/${element.id}`;

  return {
    name,
    normalized_name: normalizedName,
    address: createAddress(tags),
    prefecture: prefecture.name,
    city: getCity(tags),
    postal_code:
      tags["addr:postcode"]?.trim() ||
      null,
    latitude,
    longitude,
    phone_number:
      getFirstTag(tags, [
        "contact:phone",
        "phone",
      ]),
    website_url:
      getFirstTag(tags, [
        "contact:website",
        "website",
        "url",
      ]),
    opening_hours:
      tags.opening_hours?.trim() ||
      null,
    image_url: null,
    google_place_id: null,
    source: IMPORT_SOURCE,
    source_id: sourceId,
    source_url:
      `https://www.openstreetmap.org/${sourceId}`,
    source_updated_at:
      element.timestamp ?? null,
    imported_at: importedAt,
    last_synced_at: importedAt,
    has_sauna_room: true,
    has_cold_bath:
      parseBooleanTag(
        tags.cold_bath
      ) ||
      parseBooleanTag(
        tags["bath:cold"]
      ),
    has_outdoor_air_bath:
      parseBooleanTag(
        tags.outdoor_bath
      ) ||
      parseBooleanTag(
        tags.open_air_bath
      ),
    has_rest_area:
      parseBooleanTag(
        tags.rest_area
      ),
    has_restaurant:
      parseBooleanTag(
        tags.restaurant
      ) ||
      parseBooleanTag(
        tags.food
      ),
    has_parking:
      parseBooleanTag(
        tags.parking
      ) ||
      tags.amenity === "parking",
    is_verified: false,
  };
}

function processElements(
  elements: OsmElement[],
  prefecture: PrefectureConfig,
  importedAt: string
): ImportResult {
  const acceptedRowsBySourceId =
    new Map<string, SaunaImportRow>();

  const rejectedRows:
    RejectedSaunaRow[] = [];

  for (const element of elements) {
    const tags = element.tags ?? {};

    const originalName =
      getFacilityName(tags);

    const sourceId =
      `${element.type}/${element.id}`;

    const sourceUrl =
      `https://www.openstreetmap.org/${sourceId}`;

    const rejectionReason =
      getRejectionReason(
        element,
        originalName
      );

    if (rejectionReason) {
      rejectedRows.push({
        original_name:
          originalName,
        source_id: sourceId,
        source_url: sourceUrl,
        reason: rejectionReason,
      });

      continue;
    }

    const row = createImportRow(
      element,
      prefecture,
      importedAt
    );

    if (!row) {
      rejectedRows.push({
        original_name:
          originalName,
        source_id: sourceId,
        source_url: sourceUrl,
        reason:
          "登録データへの変換に失敗しました",
      });

      continue;
    }

    acceptedRowsBySourceId.set(
      row.source_id,
      row
    );
  }

  return {
    acceptedRows: Array.from(
      acceptedRowsBySourceId.values()
    ),
    rejectedRows,
  };
}

function escapeCsvValue(
  value:
    | string
    | number
    | boolean
    | null
    | undefined
): string {
  if (
    value === null ||
    value === undefined
  ) {
    return "";
  }

  const text = String(value);

  if (
    text.includes(",") ||
    text.includes('"') ||
    text.includes("\n") ||
    text.includes("\r")
  ) {
    return `"${text.replace(
      /"/g,
      '""'
    )}"`;
  }

  return text;
}

function createAcceptedCsv(
  rows: SaunaImportRow[]
): string {
  const headers = [
    "name",
    "normalized_name",
    "prefecture",
    "city",
    "address",
    "postal_code",
    "latitude",
    "longitude",
    "phone_number",
    "website_url",
    "opening_hours",
    "source",
    "source_id",
    "source_url",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.name,
        row.normalized_name,
        row.prefecture,
        row.city,
        row.address,
        row.postal_code,
        row.latitude,
        row.longitude,
        row.phone_number,
        row.website_url,
        row.opening_hours,
        row.source,
        row.source_id,
        row.source_url,
      ]
        .map(escapeCsvValue)
        .join(",")
    ),
  ];

  return `\uFEFF${lines.join("\n")}\n`;
}

function createRejectedCsv(
  rows: RejectedSaunaRow[]
): string {
  const headers = [
    "original_name",
    "source_id",
    "source_url",
    "reason",
  ];

  const lines = [
    headers.join(","),
    ...rows.map((row) =>
      [
        row.original_name,
        row.source_id,
        row.source_url,
        row.reason,
      ]
        .map(escapeCsvValue)
        .join(",")
    ),
  ];

  return `\uFEFF${lines.join("\n")}\n`;
}

async function writeCsvFiles(
  prefecture: PrefectureConfig,
  acceptedRows: SaunaImportRow[],
  rejectedRows: RejectedSaunaRow[]
): Promise<void> {
  await mkdir(
    OUTPUT_DIRECTORY,
    {
      recursive: true,
    }
  );

  const acceptedCsvPath = path.join(
    OUTPUT_DIRECTORY,
    `${prefecture.fileSlug}-saunas-accepted.csv`
  );

  const rejectedCsvPath = path.join(
    OUTPUT_DIRECTORY,
    `${prefecture.fileSlug}-saunas-rejected.csv`
  );

  await Promise.all([
    writeFile(
      acceptedCsvPath,
      createAcceptedCsv(
        acceptedRows
      ),
      "utf8"
    ),
    writeFile(
      rejectedCsvPath,
      createRejectedCsv(
        rejectedRows
      ),
      "utf8"
    ),
  ]);

  console.log(
    `登録候補CSV: ${acceptedCsvPath}`
  );

  console.log(
    `除外候補CSV: ${rejectedCsvPath}`
  );
}

function printImportSummary(
  prefecture: PrefectureConfig,
  elements: OsmElement[],
  acceptedRows: SaunaImportRow[],
  rejectedRows: RejectedSaunaRow[]
): void {
  console.log("");
  console.log(
    `===== TOTONO ${prefecture.name}施設インポート =====`
  );

  console.log(
    `OpenStreetMap取得件数: ${elements.length}`
  );

  console.log(
    `登録候補件数: ${acceptedRows.length}`
  );

  console.log(
    `除外件数: ${rejectedRows.length}`
  );

  const previewRows =
    acceptedRows.slice(0, 10);

  if (previewRows.length > 0) {
    console.table(
      previewRows.map((row) => ({
        name: row.name,
        city: row.city,
        address: row.address,
        source_id: row.source_id,
      }))
    );
  }

  if (
    acceptedRows.length >
    previewRows.length
  ) {
    console.log(
      `登録候補の先頭${previewRows.length}件だけ表示しています。`
    );
  }
}

function splitIntoBatches<T>(
  values: T[],
  batchSize: number
): T[][] {
  const batches: T[][] = [];

  for (
    let index = 0;
    index < values.length;
    index += batchSize
  ) {
    batches.push(
      values.slice(
        index,
        index + batchSize
      )
    );
  }

  return batches;
}

async function upsertSaunas(
  supabase: SupabaseClient,
  rows: SaunaImportRow[]
): Promise<number> {
  const batches = splitIntoBatches(
    rows,
    UPSERT_BATCH_SIZE
  );

  let processedCount = 0;

  for (
    let index = 0;
    index < batches.length;
    index += 1
  ) {
    const batch = batches[index];

    const { error } = await supabase
      .from("saunas")
      .upsert(batch, {
        onConflict:
          "source,source_id",
        ignoreDuplicates: false,
      });

    if (error) {
      throw new Error(
        `施設の登録に失敗しました。バッチ ${
          index + 1
        }/${batches.length}: ${error.message}`
      );
    }

    processedCount +=
      batch.length;

    console.log(
      `登録進捗: ${processedCount}/${rows.length}`
    );
  }

  return processedCount;
}

async function importPrefecture(
  prefecture: PrefectureConfig,
  shouldWrite: boolean,
  supabase: SupabaseClient | null
): Promise<PrefectureImportSummary> {
  try {
    console.log("");
    console.log(
      `${prefecture.name}を処理します。モード: ${
        shouldWrite ? "WRITE" : "DRY RUN"
      }`
    );

    const elements =
      await fetchOsmElements(prefecture);

    const importedAt =
      new Date().toISOString();

    const {
      acceptedRows,
      rejectedRows,
    } = processElements(
      elements,
      prefecture,
      importedAt
    );

    printImportSummary(
      prefecture,
      elements,
      acceptedRows,
      rejectedRows
    );

    await writeCsvFiles(
      prefecture,
      acceptedRows,
      rejectedRows
    );

    let written = 0;

    if (shouldWrite) {
      if (!supabase) {
        throw new Error(
          "Supabaseクライアントがありません。"
        );
      }

      if (acceptedRows.length > 0) {
        written = await upsertSaunas(
          supabase,
          acceptedRows
        );
      }
    }

    return {
      prefecture: prefecture.name,
      fetched: elements.length,
      accepted: acceptedRows.length,
      rejected: rejectedRows.length,
      written,
      error: null,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : String(error);

    console.error(
      `${prefecture.name}の処理に失敗しました: ${message}`
    );

    return {
      prefecture: prefecture.name,
      fetched: 0,
      accepted: 0,
      rejected: 0,
      written: 0,
      error: message,
    };
  }
}

async function main(): Promise<void> {
  const shouldWrite =
    hasArgument("--write");

  const targetPrefectures =
    resolveTargetPrefectures();

  const supabase = shouldWrite
    ? createAdminClient()
    : null;

  console.log(
    `対象: ${
      targetPrefectures.length === PREFECTURES.length
        ? "全国47都道府県"
        : targetPrefectures
            .map((prefecture) => prefecture.name)
            .join(", ")
    }`
  );

  const startValue =
    getArgumentValue("--start");

  if (startValue) {
    console.log(
      `再開位置: ${startValue}`
    );
  }

  console.log(
    `モード: ${shouldWrite ? "WRITE" : "DRY RUN"}`
  );

  const summaries:
    PrefectureImportSummary[] = [];

  for (
    let index = 0;
    index < targetPrefectures.length;
    index += 1
  ) {
    const prefecture =
      targetPrefectures[index];

    const summary =
      await importPrefecture(
        prefecture,
        shouldWrite,
        supabase
      );

    summaries.push(summary);

    if (
      index <
      targetPrefectures.length - 1
    ) {
      await sleep(
        PREFECTURE_REQUEST_DELAY_MS
      );
    }
  }

  console.log("");
  console.log(
    "===== TOTONO 施設インポート最終結果 ====="
  );

  console.table(
    summaries.map((summary) => ({
      prefecture: summary.prefecture,
      fetched: summary.fetched,
      accepted: summary.accepted,
      rejected: summary.rejected,
      written: summary.written,
      status: summary.error
        ? "FAILED"
        : "SUCCESS",
    }))
  );

  const totalAccepted =
    summaries.reduce(
      (total, summary) =>
        total + summary.accepted,
      0
    );

  const totalWritten =
    summaries.reduce(
      (total, summary) =>
        total + summary.written,
      0
    );

  const failedCount =
    summaries.filter(
      (summary) => summary.error
    ).length;

  console.log(
    `登録候補合計: ${totalAccepted}件`
  );

  if (shouldWrite) {
    console.log(
      `登録・更新合計: ${totalWritten}件`
    );
  }

  console.log(
    `失敗した都道府県: ${failedCount}件`
  );

  const failedPrefectures =
    summaries.filter(
      (summary) => summary.error
    );

  if (
    failedPrefectures.length > 0
  ) {
    console.log("");
    console.log(
      "===== 再実行コマンド ====="
    );

    for (
      const failed of
      failedPrefectures
    ) {
      const command = shouldWrite
        ? "npm run import:saunas:write"
        : "npm run import:saunas";

      console.log(
        `${command} -- --prefecture=${failed.prefecture}`
      );
    }
  }

  if (!shouldWrite) {
    console.log("");
    console.log(
      "Dry Runのため、Supabaseには登録していません。"
    );
  }

  if (failedCount > 0) {
    process.exitCode = 1;
  }
}

main().catch(
  (error: unknown) => {
    console.error("");
    console.error(
      "施設インポートに失敗しました。"
    );

    console.error(
      error instanceof Error
        ? error.message
        : error
    );

    process.exitCode = 1;
  }
);
