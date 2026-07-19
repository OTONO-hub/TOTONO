import type { SupabaseClient } from "@supabase/supabase-js";

import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import {
  getLikeCount,
  isLiked,
} from "@/services/likes";
import { getProfilesByUserIds } from "@/services/profile";
import { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";
import { searchPosts } from "@/services/search";
import { searchSaunas } from "@/services/saunas";
import type { CommentWithAuthor } from "@/types/comment";
import type { PostSearchResultItem } from "@/types/search";

type GetSearchPageDataParams = {
  supabase: SupabaseClient;
  userId: string;
  query: string;
};

export async function getSearchPageData({
  supabase,
  userId,
  query,
}: GetSearchPageDataParams) {
  const [posts, saunas] = await Promise.all([
    searchPosts(supabase, query),
    searchSaunas(supabase, query),
  ]);

  const postIds = posts.map((post) => post.id);
  const saunaIds = saunas.map((sauna) => sauna.id);

  const [
    saunaMetrics,
    comments,
    bookmarkedPostIds,
  ] = await Promise.all([
    getSaunaMetricsBySaunaIds(
      supabase,
      saunaIds
    ),
    getCommentsByPostIds(
      supabase,
      postIds
    ),
    getBookmarkedPostIds(
      supabase,
      userId,
      postIds
    ),
  ]);

  const bookmarkedPostIdSet = new Set(
    bookmarkedPostIds
  );

  const userIds = [
    ...posts.map((post) => post.user_id),
    ...comments.map((comment) => comment.user_id),
  ];

  const uniqueUserIds = [...new Set(userIds)];

  const profiles = await getProfilesByUserIds(
    supabase,
    uniqueUserIds
  );

  const profilesByUserId = new Map(
    profiles.map((profile) => [
      profile.id,
      profile,
    ])
  );

  const commentsByPostId = new Map<
    string,
    CommentWithAuthor[]
  >();

  for (const comment of comments) {
    const commentWithAuthor: CommentWithAuthor = {
      comment,
      author:
        profilesByUserId.get(comment.user_id) ??
        null,
    };

    const currentComments =
      commentsByPostId.get(comment.post_id) ?? [];

    currentComments.push(commentWithAuthor);

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  const postsWithMeta: PostSearchResultItem[] =
    await Promise.all(
      posts.map(async (post) => {
        const [likeCount, liked] =
          await Promise.all([
            getLikeCount(
              supabase,
              post.id
            ),
            isLiked(
              supabase,
              userId,
              post.id
            ),
          ]);

        return {
          post,
          author:
            profilesByUserId.get(post.user_id) ??
            null,
          likeCount,
          liked,
          bookmarked:
            bookmarkedPostIdSet.has(post.id),
          comments:
            commentsByPostId.get(post.id) ?? [],
        };
      })
    );

  return {
    saunas,
    saunaMetrics,
    postsWithMeta,
  };
}