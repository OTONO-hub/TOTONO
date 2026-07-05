import { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
};

export function PostCard({ post }: PostCardProps) {
  return (
    <article className="rounded-2xl bg-white p-5 shadow">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-xl font-bold">♨️ {post.sauna_name}</h2>
        <span className="text-sm text-gray-500">{post.visit_date}</span>
      </div>

      <div className="mb-3 text-yellow-500">
        {"★".repeat(post.rating)}
        <span className="text-gray-300">{"★".repeat(5 - post.rating)}</span>
      </div>

      <p className="mb-3 text-gray-700">{post.comment || "コメントなし"}</p>

      <div className="text-sm text-gray-500">
        セット数：{post.set_count}セット
      </div>
    </article>
  );
}