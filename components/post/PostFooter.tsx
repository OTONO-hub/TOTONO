import { LikeButton } from "./LikeButton";

type Props = {
  postId: string;
  userId: string;
  setCount: number;
  initialLiked: boolean;
  initialLikeCount: number;
  commentCount: number;
};

export function PostFooter({
  postId,
  userId,
  setCount,
  initialLiked,
  initialLikeCount,
  commentCount,
}: Props) {
  return (
    <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-gray-500">
      <span>🔥 {setCount}セット</span>

      <div className="flex gap-6">
        <LikeButton
          postId={postId}
          userId={userId}
          initialLiked={initialLiked}
          initialCount={initialLikeCount}
        />
        <span>💬 {commentCount}</span>
      </div>
    </div>
  );
}