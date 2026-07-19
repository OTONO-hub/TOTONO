import type { CommentWithAuthor } from "@/types/comment";
import type { Post } from "@/types/post";
import type { Profile } from "@/types/profile";

export type PostSearchResultItem = {
  post: Post;
  author: Profile | null;
  likeCount: number;
  liked: boolean;
  bookmarked: boolean;
  comments: CommentWithAuthor[];
};
