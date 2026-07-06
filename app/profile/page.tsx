import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import { getPosts } from "@/services/posts";
import { PostCard } from "@/components/post/PostCard";
import { Header } from "@/components/layout/Header";
import Link from "next/link";

export default async function ProfilePage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return (
      <>
        <Header />
        <main className="mx-auto max-w-2xl p-6">
          <p>ログインしてください。</p>
          <Link href="/login" className="text-blue-600">
            ログインへ
          </Link>
        </main>
      </>
    );
  }

  const profile = await getProfile(supabase, user.id);
  const posts = await getPosts(supabase);
  const myPosts = posts.filter((post) => post.user_id === user.id);

  return (
    <>
      <Header />

      <main className="mx-auto max-w-3xl space-y-6 bg-gray-100 p-6">
        <section className="rounded-2xl bg-white p-6 shadow">
          <h1 className="text-3xl font-bold">@{profile.username}</h1>

          <p className="mt-4 text-gray-700">
            {profile.bio || "自己紹介はまだありません。"}
          </p>

          <div className="mt-6">
            <Link
              href="/profile/edit"
              className="rounded-lg bg-blue-600 px-4 py-2 font-bold text-white"
            >
              プロフィール編集
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">自分の投稿</h2>

          {myPosts.length === 0 ? (
            <div className="rounded-xl bg-white p-8 text-center shadow">
              まだ投稿がありません。
            </div>
          ) : (
            myPosts.map((post) => <PostCard key={post.id} post={post} />)
          )}
        </section>
      </main>
    </>
  );
}