import Link from "next/link";

import { DeleteCommentButton } from "@/components/comment/DeleteCommentButton";
import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { CommentWithAuthor } from "@/types/comment";

type Props = {
  comments: CommentWithAuthor[];
  currentUserId: string;
};

export function CommentList({
  comments,
  currentUserId,
}: Props) {
  if (comments.length === 0) {
    return (
      <p className="mt-4 text-sm text-muted-foreground">
        最初のコメントを投稿してみましょう！
      </p>
    );
  }

  return (
    <div className="mt-4 space-y-3">
      {comments.map(({ comment, author }) => {
        const authorName =
          author?.username || "ユーザー";

        const isOwner =
          comment.user_id === currentUserId;

        return (
          <div
            key={comment.id}
            className="rounded-xl border bg-muted/40 p-3"
          >
            <div className="flex items-start gap-3">
              <Link
                href={`/users/${comment.user_id}`}
                className="shrink-0 rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <ProfileAvatar
                  avatarUrl={
                    author?.avatar_url ?? null
                  }
                  username={
                    author?.username ?? null
                  }
                  size="sm"
                />
              </Link>

              <div className="min-w-0 flex-1">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/users/${comment.user_id}`}
                    className="truncate font-semibold transition hover:text-primary"
                  >
                    @{authorName}
                  </Link>

                  {isOwner && (
                    <DeleteCommentButton
                      commentId={comment.id}
                      userId={comment.user_id}
                    />
                  )}
                </div>

                <p className="mt-1 whitespace-pre-wrap wrap-break-word text-sm text-foreground">
                  {comment.content}
                </p>

                <p className="mt-2 text-xs text-muted-foreground">
                  {new Date(
                    comment.created_at
                  ).toLocaleString("ja-JP")}
                </p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}