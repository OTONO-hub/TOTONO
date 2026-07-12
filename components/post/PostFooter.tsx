import { BookmarkButton } from "./BookmarkButton";
import { LikeButton } from "./LikeButton";

type Props = {
  postId: string;
  userId: string;
  setCount: number;
  initialLiked: boolean;
  initialLikeCount: number;
  initialBookmarked: boolean;
  commentCount: number;
};

export function PostFooter({
  postId,
  userId,
  setCount,
  initialLiked,
  initialLikeCount,
  initialBookmarked,
  commentCount,
}: Props) {
  return (
    <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-gray-500">
      <span>🔥 {setCount}セット</span>

      <div className="flex items-center gap-6">
        <LikeButton
          postId={postId}
          userId={userId}
          initialLiked={initialLiked}
          initialCount={initialLikeCount}
        />

        <span>💬 {commentCount}</span>

        <BookmarkButton
          postId={postId}
          userId={userId}
          initialBookmarked={initialBookmarked}
        />
      </div>
    </div>
  );
}