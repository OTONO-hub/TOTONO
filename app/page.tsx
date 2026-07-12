import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { getCommentsByPostId } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPosts } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";

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

  const profiles = await getProfilesByUserIds(
    supabase,
    posts.map((post) => post.user_id)
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [profile.id, profile])
  );

  const postsWithMeta = await Promise.all(
    posts.map(async (post) => ({
      post,
      author: profilesByUserId.get(post.user_id) ?? null,
      likeCount: await getLikeCount(supabase, post.id),
      liked: await isLiked(supabase, user.id, post.id),
      comments: await getCommentsByPostId(supabase, post.id),
    }))
  );

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl space-y-6 bg-muted/40 px-4 py-8 sm:px-6">
        <h1 className="text-3xl font-bold tracking-tight">
          タイムライン
        </h1>

        {postsWithMeta.length === 0 ? (
          <div className="rounded-xl border bg-card p-10 text-center shadow-sm">
            <p className="text-muted-foreground">
              まだ投稿がありません。
            </p>
          </div>
        ) : (
          postsWithMeta.map(
            ({
              post,
              author,
              likeCount,
              liked,
              comments,
            }) => (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                userId={user.id}
                initialLiked={liked}
                initialLikeCount={likeCount}
                comments={comments}
              />
            )
          )
        )}
      </main>
    </>
  );
}