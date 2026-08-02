import type { RecommendedSauna } from "@/services/recommendations";
import type { PopularSauna } from "@/services/saunas";

/*
 * getPostsが返す投稿配列から、
 * 投稿1件分の型を取得します。
 */
type PostsResult = Awaited<
  ReturnType<
    (typeof import("@/services/posts"))["getPosts"]
  >
>;

export type DashboardPost =
  PostsResult[number];

/*
 * getProfilesByUserIdsが返すプロフィール配列から、
 * プロフィール1件分の型を取得します。
 */
type ProfilesResult = Awaited<
  ReturnType<
    (
      typeof import(
        "@/services/profile"
      )
    )["getProfilesByUserIds"]
  >
>;

export type DashboardProfile =
  ProfilesResult[number];

/*
 * コミュニティ表示用の投稿です。
 *
 * 通常の投稿データへ、
 * 投稿者プロフィールを追加しています。
 */
export type DashboardActivityPost =
  DashboardPost & {
    profile: DashboardProfile | null;
  };

/*
 * Heroに表示する時間帯別メッセージです。
 */
export type DashboardHeroMessage = {
  /*
   * 英語の短い挨拶です。
   */
  greeting: string;

  /*
   * Heroの大きな見出しです。
   */
  heading: string;

  /*
   * 見出しを補足する説明です。
   */
  description: string;
};

/*
 * Heroへ表示する、
 * ユーザーのサウナライフ概要です。
 */
export type DashboardSummary = {
  /*
   * 今月のサ活投稿数です。
   */
  monthlyVisits: number;

  /*
   * これまで訪れた施設数です。
   *
   * 同じ施設への複数投稿は、
   * 1施設として数えます。
   */
  uniqueSaunas: number;

  /*
   * これまでの累計サ活投稿数です。
   */
  totalVisits: number;
};

/*
 * ログイン後のホーム画面で使用する
 * データをまとめた型です。
 */
export type DashboardData = {
  /*
   * 時間帯に応じたHeroメッセージです。
   */
  heroMessage: DashboardHeroMessage;

  /*
   * Heroへ表示するサ活概要です。
   */
  summary: DashboardSummary;

  /*
   * Heroに表示する「今日の一軒」です。
   */
  todayPick: RecommendedSauna | null;

  /*
   * 今日の一軒を選んだ理由です。
   */
  todayPickReason: string;

  /*
   * 今日の一軒以外のおすすめ候補です。
   */
  recommendations: RecommendedSauna[];

  /*
   * おすすめと重複しない人気施設です。
   */
  popularSaunas: PopularSauna[];

  /*
   * ユーザーの活動から推測した
   * 優先都道府県です。
   */
  preferredPrefecture: string | null;

  /*
   * ログインユーザー自身のサ活投稿です。
   */
  myPosts: DashboardPost[];

  /*
   * 投稿者プロフィールを追加した
   * コミュニティ表示用投稿です。
   */
  friendsActivityPosts:
    DashboardActivityPost[];
};
