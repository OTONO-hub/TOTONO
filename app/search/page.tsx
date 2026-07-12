import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { SearchForm } from "@/components/search/SearchForm";
import { createClient } from "@/lib/supabase/server";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getProfilesByUserIds } from "@/services/profile";
import { searchPosts } from "@/services/search";
import { CommentWithAuthor } from "@/types/comment";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;
  const query = q.trim();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const posts = query
    ? await searchPosts(supabase, query)
    : [];

  const comments = await getCommentsByPostIds(
    supabase,
    posts.map((post) => post.id)
  );

  const userIds = [
    ...posts.map((post) => post.user_id),
    ...comments.map((comment) => comment.user_id),
  ];

  const profiles = await getProfilesByUserIds(
    supabase,
    userIds
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [profile.id, profile])
  );

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

  const postsWithMeta = user
    ? await Promise.all(
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
          comments:
            commentsByPostId.get(post.id) ?? [],
        }))
      )
    : [];

  return (
    <>
      <Header />

      <main className="mx-auto min-h-screen max-w-3xl space-y-6 bg-muted/40 px-4 py-8 sm:px-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            サウナ・投稿検索
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            サウナ施設名や投稿内容から検索できます。
          </p>
        </div>

        <SearchForm />

        {!user ? (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              検索結果を見るにはログインしてください。
            </p>
          </div>
        ) : !query ? (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              検索キーワードを入力してください。
            </p>
          </div>
        ) : postsWithMeta.length === 0 ? (
          <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
            <p className="text-muted-foreground">
              「{query}」に一致する投稿はありませんでした。
            </p>
          </div>
        ) : (
          <section className="space-y-4">
            <p className="text-sm text-muted-foreground">
              「{query}」の検索結果：
              {postsWithMeta.length}件
            </p>

            {postsWithMeta.map(
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
            )}
          </section>
        )}
      </main>
    </>
  );
}