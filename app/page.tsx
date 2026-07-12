import { Hero } from "@/components/home/Hero";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getPosts } from "@/services/posts";
import { getProfilesByUserIds } from "@/services/profile";
import { CommentWithAuthor } from "@/types/comment";

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

  // 投稿とコメントを取得
  const posts = await getPosts(supabase);

  const comments = await getCommentsByPostIds(
    supabase,
    posts.map((post) => post.id)
  );

  // ログインユーザーが保存している投稿IDをまとめて取得
  const bookmarkedPostIds = await getBookmarkedPostIds(
    supabase,
    user.id,
    posts.map((post) => post.id)
  );

  const bookmarkedPostIdSet = new Set(bookmarkedPostIds);

  // 投稿者とコメント投稿者のIDをまとめる
  const userIds = [
    ...posts.map((post) => post.user_id),
    ...comments.map((comment) => comment.user_id),
  ];

  // 必要なプロフィールを1回で取得
  const profiles = await getProfilesByUserIds(
    supabase,
    userIds
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [profile.id, profile])
  );

  // 投稿IDごとにコメントを分類
  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
      comment,
      author:
        profilesByUserId.get(comment.user_id) ?? null,
    };

    const currentComments =
      commentsByPostId.get(comment.post_id) ?? [];

    currentComments.push(commentWithAuthor);

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  const postsWithMeta = await Promise.all(
    posts.map(async (post) => ({
      post,
      author:
        profilesByUserId.get(post.user_id) ?? null,
      likeCount: await getLikeCount(
        supabase,
        post.id
      ),
      liked: await isLiked(
        supabase,
        user.id,
        post.id
      ),
      bookmarked: bookmarkedPostIdSet.has(post.id),
      comments:
        commentsByPostId.get(post.id) ?? [],
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
              bookmarked,
              comments,
            }) => (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                userId={user.id}
                initialLiked={liked}
                initialLikeCount={likeCount}
                initialBookmarked={bookmarked}
                comments={comments}
              />
            )
          )
        )}
      </main>
    </>
  );
}