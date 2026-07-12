import Link from "next/link";

import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Post } from "@/types/post";
import { Profile } from "@/types/profile";

type Props = {
  post: Post;
  author: Profile | null;
};

export function PostHeader({ post, author }: Props) {
  const authorName = author?.username || "ユーザー";

  return (
    <div className="space-y-4">
      <Link
        href={`/users/${post.user_id}`}
        className="group flex w-fit items-center gap-3 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <ProfileAvatar
          avatarUrl={author?.avatar_url ?? null}
          username={author?.username ?? null}
          size="md"
        />

        <div className="min-w-0">
          <p className="truncate font-semibold transition group-hover:text-primary">
            @{authorName}
          </p>

          <p className="text-sm text-muted-foreground">
            {post.visit_date}
          </p>
        </div>
      </Link>

      <h2 className="wrap-break-word text-2xl font-bold">
        ♨️ {post.sauna_name}
      </h2>
    </div>
  );
}