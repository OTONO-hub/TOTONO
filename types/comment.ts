import { Profile } from "@/types/profile";

export type Comment = {
  id: string;
  user_id: string;
  post_id: string;
  content: string;
  created_at: string;
};

export type CreateCommentInput = {
  user_id: string;
  post_id: string;
  content: string;
};

export type CommentWithAuthor = {
  comment: Comment;
  author: Profile | null;
};