import Link from "next/link";

import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { getCommentsByPostId } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPosts } from "@/services/posts";
import { getProfile } from "@/services/profile";

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

  const myPostsWithMeta = await Promise.all(
    myPosts.map(async (post) => ({
      post,
      likeCount: await getLikeCount(supabase, post.id),
      liked: await isLiked(supabase, user.id, post.id),
      comments: await getCommentsByPostId(supabase, post.id),
    }))
  );

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl space-y-6 bg-muted/40 p-6">
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <h1 className="text-3xl font-bold">
            @{profile.username}
          </h1>

          <p className="mt-4 text-muted-foreground">
            {profile.bio || "自己紹介はまだありません。"}
          </p>

          <div className="mt-4 text-sm text-muted-foreground">
            投稿数：{myPosts.length}
          </div>

          <div className="mt-6">
            <Link
              href="/profile/edit"
              className="inline-flex h-10 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition hover:bg-primary/90"
            >
              プロフィール編集
            </Link>
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-2xl font-bold">自分の投稿</h2>

          {myPostsWithMeta.length === 0 ? (
            <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
              <p className="text-muted-foreground">
                まだ投稿がありません。
              </p>

              <Link
                href="/posts/new"
                className="mt-4 inline-block font-medium text-primary"
              >
                最初のサ活を投稿する
              </Link>
            </div>
          ) : (
            myPostsWithMeta.map(
              ({ post, likeCount, liked, comments }) => (
                <PostCard
                  key={post.id}
                  post={post}
                  userId={user.id}
                  initialLiked={liked}
                  initialLikeCount={likeCount}
                  comments={comments}
                />
              )
            )
          )}
        </section>
      </main>
    </>
  );
}