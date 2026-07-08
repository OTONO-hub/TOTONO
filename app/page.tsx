import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { getCommentsByPostId } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPosts } from "@/services/posts";

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />
        <Hero />
      </>
    );
  }

  const posts = await getPosts(supabase);

  const postsWithMeta = await Promise.all(
    posts.map(async (post) => ({
      post,
      likeCount: await getLikeCount(supabase, post.id),
      liked: await isLiked(supabase, user.id, post.id),
      comments: await getCommentsByPostId(supabase, post.id),
    }))
  );

  return (
    <>
      <Header />

      <main className="mx-auto max-w-3xl space-y-6 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold">タイムライン</h1>

        {postsWithMeta.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            まだ投稿がありません。
          </div>
        ) : (
          postsWithMeta.map(({ post, likeCount, liked, comments }) => (
            <PostCard
              key={post.id}
              post={post}
              userId={user.id}
              initialLiked={liked}
              initialLikeCount={likeCount}
              comments={comments}
            />
          ))
        )}
      </main>
    </>
  );
}