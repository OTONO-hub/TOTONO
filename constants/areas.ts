/**
 * TOTONOで使用する地方区分です。
 *
 * 表示順を維持するため、
 * オブジェクトではなく配列として管理します。
 */
export type SaunaArea = {
  id: SaunaAreaId;
  name: string;
  shortName: string;
  prefectures: readonly string[];
};

/**
 * 地方を識別するためのIDです。
 *
 * URLやコンポーネントの状態管理では、
 * 日本語名ではなくこちらのIDを使用します。
 */
export type SaunaAreaId =
  | "hokkaido-tohoku"
  | "kanto"
  | "chubu"
  | "kinki"
  | "chugoku"
  | "shikoku"
  | "kyushu-okinawa";

/**
 * TOTONOで使用する地方と都道府県の一覧です。
 */
export const SAUNA_AREAS = [
  {
    id: "hokkaido-tohoku",
    name: "北海道・東北",
    shortName: "北海道・東北",
    prefectures: [
      "北海道",
      "青森県",
      "岩手県",
      "宮城県",
      "秋田県",
      "山形県",
      "福島県",
    ],
  },
  {
    id: "kanto",
    name: "関東",
    shortName: "関東",
    prefectures: [
      "茨城県",
      "栃木県",
      "群馬県",
      "埼玉県",
      "千葉県",
      "東京都",
      "神奈川県",
    ],
  },
  {
    id: "chubu",
    name: "中部",
    shortName: "中部",
    prefectures: [
      "新潟県",
      "富山県",
      "石川県",
      "福井県",
      "山梨県",
      "長野県",
      "岐阜県",
      "静岡県",
      "愛知県",
    ],
  },
  {
    id: "kinki",
    name: "近畿",
    shortName: "近畿",
    prefectures: [
      "三重県",
      "滋賀県",
      "京都府",
      "大阪府",
      "兵庫県",
      "奈良県",
      "和歌山県",
    ],
  },
  {
    id: "chugoku",
    name: "中国",
    shortName: "中国",
    prefectures: [
      "鳥取県",
      "島根県",
      "岡山県",
      "広島県",
      "山口県",
    ],
  },
  {
    id: "shikoku",
    name: "四国",
    shortName: "四国",
    prefectures: [
      "徳島県",
      "香川県",
      "愛媛県",
      "高知県",
    ],
  },
  {
    id: "kyushu-okinawa",
    name: "九州・沖縄",
    shortName: "九州・沖縄",
    prefectures: [
      "福岡県",
      "佐賀県",
      "長崎県",
      "熊本県",
      "大分県",
      "宮崎県",
      "鹿児島県",
      "沖縄県",
    ],
  },
] as const satisfies readonly SaunaArea[];

/**
 * 日本全国の都道府県一覧です。
 *
 * 地方ごとの配列から生成することで、
 * 地域データとの重複管理を避けます。
 */
export const PREFECTURES = SAUNA_AREAS.flatMap(
  (area) => area.prefectures
);

/**
 * IDを指定して地方情報を取得します。
 *
 * @param areaId 地方ID
 * @returns 地方情報。該当しない場合はnull
 */
export function getSaunaAreaById(
  areaId: string
): SaunaArea | null {
  return (
    SAUNA_AREAS.find(
      (area) => area.id === areaId
    ) ?? null
  );
}

/**
 * 都道府県名から所属する地方を取得します。
 *
 * @param prefecture 都道府県名
 * @returns 地方情報。該当しない場合はnull
 */
export function getSaunaAreaByPrefecture(
  prefecture: string
): SaunaArea | null {
  const trimmedPrefecture = prefecture.trim();

  if (!trimmedPrefecture) {
    return null;
  }

  return (
    SAUNA_AREAS.find((area) =>
      area.prefectures.some(
        (areaPrefecture) =>
          areaPrefecture === trimmedPrefecture
      )
    ) ?? null
  );
}

/**
 * 指定した文字列が、
 * TOTONOで管理している都道府県名か判定します。
 *
 * @param prefecture 判定する文字列
 */
export function isPrefecture(
  prefecture: string
): boolean {
  const trimmedPrefecture = prefecture.trim();

  return PREFECTURES.some(
    (registeredPrefecture) =>
      registeredPrefecture === trimmedPrefecture
  );
}
