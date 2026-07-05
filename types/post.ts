export type Post = {
  id: string;
  user_id: string;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string | null;
  created_at: string;
  updated_at: string;
};

export type CreatePostInput = {
  user_id: string;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string;
};