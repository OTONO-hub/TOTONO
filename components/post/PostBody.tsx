import { Post } from "@/types/post";
import { PostImage } from "./PostImage";

type Props = {
  post: Post;
};

export function PostBody({ post }: Props) {
  return (
    <div className="mt-4">
      <div className="text-2xl text-yellow-500">
        {"★".repeat(post.rating)}
        <span className="text-gray-300">
          {"★".repeat(5 - post.rating)}
        </span>
      </div>

      {post.image_url && (
        <PostImage
          imageUrl={post.image_url}
          saunaName={post.sauna_name}
        />
      )}

      <p className="mt-4 whitespace-pre-wrap text-gray-700">
        {post.comment || "コメントはまだありません。"}
      </p>
    </div>
  );
}