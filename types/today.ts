export type TodayUser = {
  id: string;
  username: string | null;
};

export type TodayRecommendation = {
  saunaId: string;
  saunaName: string;
  area: string | null;
  imageUrl: string | null;
  reason: string;
  tags: string[];
  isBookmarked: boolean;
};

export type TodaySavedSauna = {
  saunaId: string;
  saunaName: string;
  area: string | null;
  imageUrl: string | null;
  isBookmarked: boolean;
  detailHref: string;
};

export type TodayActivity = {
  postId: string;
  saunaName: string;
  visitDate: string;
  setCount: number;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
  username: string;
  commentCount: number;
};

export type TodayPageData = {
  recommendation: TodayRecommendation | null;
  savedSaunas: TodaySavedSauna[];
  recentActivities: TodayActivity[];
};
