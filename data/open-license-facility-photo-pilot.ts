export type OpenLicenseFacilityPhoto = {
  key: string;
  facility: {
    nameAliases: readonly string[];
    prefecture: string;
    cityIncludes?: string;
  };
  downloadUrl: string;
  sourceUrl: string;
  workTitle: string;
  photographerName: string;
  licenseName: "CC BY 3.0" | "CC BY-SA 4.0" | "CC0 1.0";
  licenseUrl: string;
  capturedAt: string | null;
};

/**
 * Wikimedia Commonsのファイルページで、施設一致・撮影者・ライセンスを
 * 2026-11-14に確認した初回検証用データ。
 *
 * downloadUrlは原寸の無制限取得を避け、表示用最大1920pxの画像を取得する。
 */
export const OPEN_LICENSE_FACILITY_PHOTO_PILOT = [
  {
    key: "sauna-center",
    facility: {
      nameAliases: [
        "サウナセンター",
        "サウナセンター鶯谷本店",
      ],
      prefecture: "東京都",
      cityIncludes: "台東区",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/サウナセンター外観.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:サウナセンター外観.jpg",
    workTitle: "サウナセンター外観",
    photographerName: "伊佐坂安物",
    licenseName: "CC BY 3.0",
    licenseUrl: "https://creativecommons.org/licenses/by/3.0/",
    capturedAt: "2023-03-07",
  },
  {
    key: "sauna-shikiji",
    facility: {
      nameAliases: ["サウナしきじ"],
      prefecture: "静岡県",
      cityIncludes: "静岡市",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Sauna_Shikiji_2023.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Sauna_Shikiji_2023.jpg",
    workTitle: "Sauna Shikiji 2023",
    photographerName: "しんぎんぐきゃっと",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2023-01-15",
  },
  {
    key: "yulax",
    facility: {
      nameAliases: ["湯らっくす"],
      prefecture: "熊本県",
      cityIncludes: "熊本市",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/湯らっくす.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:湯らっくす.jpg",
    workTitle: "湯らっくす",
    photographerName: "Kotaria0311",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2017-07-14",
  },
  {
    key: "aogashima-fureai-sauna",
    facility: {
      nameAliases: [
        "青ヶ島村 ふれあいサウナ",
        "青ヶ島村ふれあいサウナ",
        "ふれあいサウナ",
      ],
      prefecture: "東京都",
      cityIncludes: "青ヶ島村",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Aogashima_fureai_sauna.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Aogashima_fureai_sauna.jpg",
    workTitle: "Aogashima fureai sauna",
    photographerName: "ブルーノ・プラス",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: null,
  },
  {
    key: "esaka-ekimae-sauna",
    facility: {
      nameAliases: ["エサカ駅前サウナ", "江坂駅前サウナ"],
      prefecture: "大阪府",
      cityIncludes: "吹田市",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Esaka-ekimae-sauna-Osaka.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Esaka-ekimae-sauna-Osaka.jpg",
    workTitle: "Esaka-ekimae-sauna-Osaka",
    photographerName: "HQA02330",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2020-07-29",
  },
  {
    key: "wellbe-imaike",
    facility: {
      nameAliases: ["ウェルビー今池", "ウェルビー今池店"],
      prefecture: "愛知県",
      cityIncludes: "名古屋市",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Wellbe-Imaike-Nagoya.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wellbe-Imaike-Nagoya.jpg",
    workTitle: "Wellbe-Imaike-Nagoya",
    photographerName: "HQA02330",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2020-09-19",
  },
  {
    key: "wellbe-sakae",
    facility: {
      nameAliases: ["ウェルビー栄", "ウェルビー栄店"],
      prefecture: "愛知県",
      cityIncludes: "名古屋市",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Wellbe-Sakae-Nagoya.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Wellbe-Sakae-Nagoya.jpg",
    workTitle: "Wellbe-Sakae-Nagoya",
    photographerName: "HQA02330",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2020-05-30",
  },
  {
    key: "koganeyu-tokyo",
    facility: {
      nameAliases: ["黄金湯"],
      prefecture: "東京都",
      cityIncludes: "墨田区",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Koganeyu_Tokyo.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Koganeyu_Tokyo.jpg",
    workTitle: "Koganeyu Tokyo",
    photographerName: "妖精書士",
    licenseName: "CC0 1.0",
    licenseUrl: "https://creativecommons.org/publicdomain/zero/1.0/",
    capturedAt: "2026-04-05",
  },
  {
    key: "matsumotoyu-tokyo",
    facility: {
      nameAliases: ["松本湯"],
      prefecture: "東京都",
      cityIncludes: "中野区",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/Mastumotoyu.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:Mastumotoyu.jpg",
    workTitle: "Mastumotoyu",
    photographerName: "Totti",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2026-10-08",
  },
  {
    key: "hottayu-tokyo",
    facility: {
      nameAliases: ["堀田湯"],
      prefecture: "東京都",
      cityIncludes: "足立区",
    },
    downloadUrl:
      "https://commons.wikimedia.org/wiki/Special:Redirect/file/堀田湯_2026-10_1.jpg?width=1920",
    sourceUrl:
      "https://commons.wikimedia.org/wiki/File:堀田湯_2026-10_1.jpg",
    workTitle: "堀田湯 2026-10 1",
    photographerName: "Masao",
    licenseName: "CC BY-SA 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by-sa/4.0/",
    capturedAt: "2026-10-17",
  },
] as const satisfies readonly OpenLicenseFacilityPhoto[];
