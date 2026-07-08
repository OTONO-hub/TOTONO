import { Post } from "@/types/post";

type Props = {
  post: Post;
};

export function PostBody({ post }: Props) {
  return (
    <>
      <div className="mt-4 text-2xl text-yellow-500">
        {"★".repeat(post.rating)}
        <span className="text-gray-300">{"★".repeat(5 - post.rating)}</span>
      </div>

      <p className="mt-4 whitespace-pre-wrap text-gray-700">
        {post.comment || "コメントなし"}
      </p>
    </>
  );
}