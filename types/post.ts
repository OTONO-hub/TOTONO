export type Post = {
  id: string;
  user_id: string;

  // 施設
  sauna_id: string | null;
  sauna_name: string;

  // サ活情報
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string | null;

  // 画像
  image_url: string | null;

  // 日時
  created_at: string;
  updated_at: string;
};

export type CreatePostInput = {
  user_id: string;

  // 施設
  sauna_id?: string | null;
  sauna_name: string;

  // サ活情報
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string;

  // 画像
  image_url?: string;
};