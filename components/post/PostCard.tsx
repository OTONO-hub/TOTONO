import { LikeButton } from "./LikeButton";
import { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
  userId: string;
  initialLiked: boolean;
  initialLikeCount: number;
};

export function PostCard({
  post,
  userId,
  initialLiked,
  initialLikeCount,
}: PostCardProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">♨️ {post.sauna_name}</h2>
        <span className="text-sm text-gray-500">{post.visit_date}</span>
      </div>

      <div className="mt-4 text-2xl text-yellow-500">
        {"★".repeat(post.rating)}
        <span className="text-gray-300">{"★".repeat(5 - post.rating)}</span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-gray-700">
        {post.comment || "コメントなし"}
      </p>

      <div className="mt-6 flex items-center justify-between border-t pt-4 text-sm text-gray-500">
        <span>🔥 {post.set_count}セット</span>

        <div className="flex gap-6">
          <LikeButton
            postId={post.id}
            userId={userId}
            initialLiked={initialLiked}
            initialCount={initialLikeCount}
          />
          <span>💬 0</span>
        </div>
      </div>
    </article>
  );
}