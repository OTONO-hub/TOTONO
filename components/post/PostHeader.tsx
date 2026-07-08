import { Post } from "@/types/post";

type Props = {
  post: Post;
};

export function PostHeader({ post }: Props) {
  return (
    <div className="flex items-center justify-between">
      <h2 className="text-2xl font-bold">♨️ {post.sauna_name}</h2>
      <span className="text-sm text-gray-500">{post.visit_date}</span>
    </div>
  );
}