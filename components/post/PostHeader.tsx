import { ProfileAvatar } from "@/components/profile/ProfileAvatar";
import { Post } from "@/types/post";
import { Profile } from "@/types/profile";

type Props = {
  post: Post;
  author: Profile | null;
};

export function PostHeader({ post, author }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <ProfileAvatar
          avatarUrl={author?.avatar_url ?? null}
          username={author?.username ?? null}
          size="md"
        />

        <div className="min-w-0 flex-1">
          <p className="truncate font-semibold">
            @{author?.username || "ユーザー"}
          </p>

          <p className="text-sm text-muted-foreground">
            {post.visit_date}
          </p>
        </div>
      </div>

      <h2 className="break-words text-2xl font-bold">
        ♨️ {post.sauna_name}
      </h2>
    </div>
  );
}