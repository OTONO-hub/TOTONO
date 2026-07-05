import { createClient } from "@/lib/supabase/server";
import { getPosts } from "@/services/posts";
import { Header } from "@/components/layout/Header";
import { Hero } from "@/components/home/Hero";
import { PostCard } from "@/components/post/PostCard";

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

  return (
    <>
      <Header />

      <main className="mx-auto max-w-2xl space-y-6 bg-gray-100 p-6">
        <h1 className="text-3xl font-bold">
          タイムライン
        </h1>

        {posts.length === 0 ? (
          <div className="rounded-xl bg-white p-10 text-center shadow">
            まだ投稿がありません。
          </div>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
        )}
      </main>
    </>
  );
}