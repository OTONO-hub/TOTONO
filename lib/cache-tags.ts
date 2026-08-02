/**
 * Next.js Cache Tag
 *
 * データ更新時のinvalidate対象を
 * 一元管理します。
 */

export const CACHE_TAGS = {
  dashboard: "dashboard",
  posts: "posts",
  profile: "profile",
  comments: "comments",
  likes: "likes",
  notifications: "notifications",
  saunas: "saunas",
  recommendations: "recommendations",
  search: "search",
  journal: "journal",
  today: "today",
} as const;

export type CacheTag =
  (typeof CACHE_TAGS)[keyof typeof CACHE_TAGS];
  