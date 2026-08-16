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

export type CommentAuthor = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

export type CommentWithAuthor = {
  comment: Comment;
  author:
    | CommentAuthor
    | null;
};
