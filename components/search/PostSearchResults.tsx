import { FileText } from "lucide-react";

import { PostCard } from "@/components/post/PostCard";
import { EmptyResultMessage } from "@/components/search/EmptyResultMessage";
import { ResultSectionHeader } from "@/components/search/ResultSectionHeader";
import type { PostSearchResultItem } from "@/types/search";

type PostSearchResultsProps = {
  query: string;
  userId: string;
  posts: PostSearchResultItem[];
};

export function PostSearchResults({
  query,
  userId,
  posts,
}: PostSearchResultsProps) {
  return (
    <section
      aria-labelledby="post-results-heading"
      className="min-w-0"
    >
      <ResultSectionHeader
        id="post-results-heading"
        icon={
          <FileText
            className="size-4.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        }
        eyebrow="Sauna Journals"
        title="みんなのサ活"
        count={posts.length}
      />

      {posts.length === 0 ? (
        <EmptyResultMessage>
          「{query}」に一致するサ活は
          見つかりませんでした。
        </EmptyResultMessage>
      ) : (
        <div
          className="
            mx-auto
            mt-8
            max-w-4xl
            space-y-8
            sm:mt-10
            sm:space-y-12
          "
        >
          {posts.map(
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
                userId={userId}
                initialLiked={liked}
                initialLikeCount={likeCount}
                initialBookmarked={bookmarked}
                comments={comments}
              />
            )
          )}
        </div>
      )}
    </section>
  );
}