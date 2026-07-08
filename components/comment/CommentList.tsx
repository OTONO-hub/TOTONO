import { Comment } from "@/types/comment";

type Props = {
  comments: Comment[];
};

export function CommentList({ comments }: Props) {
  if (comments.length === 0) {
    return (
      <p className="mt-4 text-sm text-gray-400">
        最初のコメントを投稿してみましょう！
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map((comment) => (
        <div
          key={comment.id}
          className="rounded-xl border bg-gray-50 p-3"
        >
          <p className="text-sm text-gray-700">
            {comment.content}
          </p>

          <p className="mt-2 text-xs text-gray-400">
            {new Date(comment.created_at).toLocaleString("ja-JP")}
          </p>
        </div>
      ))}
    </div>
  );
}