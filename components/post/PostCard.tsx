import { CommentForm } from "@/components/comment/CommentForm";
import { CommentList } from "@/components/comment/CommentList";
import { PostBody } from "@/components/post/PostBody";
import { PostFooter } from "@/components/post/PostFooter";
import { PostHeader } from "@/components/post/PostHeader";
import { Comment } from "@/types/comment";
import { Post } from "@/types/post";

type PostCardProps = {
  post: Post;
  userId: string;
  initialLiked: boolean;
  initialLikeCount: number;
  comments: Comment[];
};

export function PostCard({
  post,
  userId,
  initialLiked,
  initialLikeCount,
  comments,
}: PostCardProps) {
  return (
    <article className="rounded-2xl bg-white p-6 shadow transition hover:shadow-lg">
      <PostHeader post={post} />

      <PostBody post={post} />

      <PostFooter
        postId={post.id}
        userId={userId}
        setCount={post.set_count}
        initialLiked={initialLiked}
        initialLikeCount={initialLikeCount}
        commentCount={comments.length}
      />

      <CommentList comments={comments} />

      <CommentForm postId={post.id} userId={userId} />
    </article>
  );
}