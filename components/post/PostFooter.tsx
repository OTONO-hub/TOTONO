import {
  Flame,
  MessageCircle,
} from "lucide-react";

import { BookmarkButton } from "./BookmarkButton";
import { LikeButton } from "./LikeButton";

type Props = {
  postId: string;
  userId: string;
  postOwnerId: string;
  setCount: number;
  initialLiked: boolean;
  initialLikeCount: number;
  initialBookmarked: boolean;
  commentCount: number;
};

export function PostFooter({
  postId,
  userId,
  postOwnerId,
  setCount,
  initialLiked,
  initialLikeCount,
  initialBookmarked,
  commentCount,
}: Props) {
  return (
    <footer>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
        {/* セット数 */}
        <div
          className="
            inline-flex
            w-fit
            items-center
            gap-3
            rounded-full
            border border-border/50
            bg-background/70
            px-4
            py-2.5
            backdrop-blur-sm
          "
        >
          <div
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-full
              bg-accent/15
              text-accent
            "
          >
            <Flame
              className="size-4"
              strokeWidth={2}
            />
          </div>

          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.18em] text-muted-foreground">
              Sauna Set
            </p>

            <p className="text-sm font-semibold text-foreground">
              {setCount} セット
            </p>
          </div>
        </div>

        {/* アクション */}
        <div className="flex flex-wrap items-center gap-5">
          <LikeButton
            postId={postId}
            userId={userId}
            postOwnerId={postOwnerId}
            initialLiked={initialLiked}
            initialCount={initialLikeCount}
          />

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border border-border/40
              bg-background/60
              px-3
              py-2
              text-sm
              text-muted-foreground
            "
            aria-label={`コメント${commentCount}件`}
          >
            <MessageCircle
              className="size-4"
              strokeWidth={1.8}
            />

            <span className="font-medium tabular-nums">
              {commentCount}
            </span>
          </div>

          <BookmarkButton
            postId={postId}
            userId={userId}
            initialBookmarked={initialBookmarked}
          />
        </div>
      </div>
    </footer>
  );
}