import type {
  SupabaseClient,
} from "@supabase/supabase-js";

import {
  getBookmarkedPostIdSet,
} from "./bookmarks";
import {
  getCommentCountsByPostIds,
} from "./comments";
import {
  getLikedPostIds,
  getLikeCountsByPostIds,
} from "./likes";
import {
  getBlockedUserIds,
} from "./user-blocks";

export type CommunityPostAuthor = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
};

export type CommunityPostImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
};

export type CommunityPost = {
  id: string;
  userId: string;
  saunaId: string | null;
  saunaName: string;
  visitDate: string;
  setCount: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  author:
    CommunityPostAuthor;
  images:
    CommunityPostImage[];
  likeCount: number;
  commentCount: number;
  isLiked: boolean;
  isBookmarked: boolean;
};

export type CommunityFeedPage = {
  posts:
    CommunityPost[];
  hasMore: boolean;
};

type CommunityPostRow = {
  id: string;
  user_id: string;
  sauna_id: string | null;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string | null;
  image_url: string | null;
  created_at: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

type PostImageRow = {
  id: string;
  post_id: string;
  image_url: string;
  sort_order: number;
};

const DEFAULT_PAGE_SIZE =
  15;

const MAX_PAGE_SIZE =
  30;

function normalizePageSize(
  pageSize: number
): number {
  if (
    !Number.isFinite(
      pageSize
    )
  ) {
    return DEFAULT_PAGE_SIZE;
  }

  return Math.min(
    MAX_PAGE_SIZE,
    Math.max(
      1,
      Math.floor(
        pageSize
      )
    )
  );
}

function normalizeOffset(
  offset: number
): number {
  if (
    !Number.isFinite(
      offset
    )
  ) {
    return 0;
  }

  return Math.max(
    0,
    Math.floor(
      offset
    )
  );
}

function createImagesByPostId(
  imageRows: PostImageRow[]
): Map<
  string,
  CommunityPostImage[]
> {
  const imagesByPostId =
    new Map<
      string,
      CommunityPostImage[]
    >();

  const sortedRows = [
    ...imageRows,
  ].sort(
    (
      first,
      second
    ) =>
      first.sort_order -
      second.sort_order
  );

  for (
    const image of
    sortedRows
  ) {
    const currentImages =
      imagesByPostId.get(
        image.post_id
      ) ??
      [];

    if (
      currentImages.length >=
      5
    ) {
      continue;
    }

    currentImages.push({
      id:
        image.id,

      imageUrl:
        image.image_url,

      sortOrder:
        image.sort_order,
    });

    imagesByPostId.set(
      image.post_id,
      currentImages
    );
  }

  return imagesByPostId;
}

function addLegacyImage(
  post: CommunityPostRow,
  images:
    CommunityPostImage[]
): CommunityPostImage[] {
  const legacyImageUrl =
    post.image_url?.trim();

  if (!legacyImageUrl) {
    return images;
  }

  const alreadyIncluded =
    images.some(
      (
        image
      ) =>
        image.imageUrl ===
        legacyImageUrl
    );

  if (
    alreadyIncluded
  ) {
    return images;
  }

  return [
    {
      id:
        `legacy-${post.id}`,

      imageUrl:
        legacyImageUrl,

      sortOrder:
        -1,
    },

    ...images,
  ].slice(
    0,
    5
  );
}

export async function getCommunityFeed(
  supabase: SupabaseClient,
  currentUserId: string,
  options?: {
    pageSize?: number;
    offset?: number;
  }
): Promise<CommunityFeedPage> {
  const normalizedUserId =
    currentUserId.trim();

  if (
    !normalizedUserId
  ) {
    throw new Error(
      "ユーザー情報がありません。"
    );
  }

  const pageSize =
    normalizePageSize(
      options?.pageSize ??
        DEFAULT_PAGE_SIZE
    );

  const offset =
    normalizeOffset(
      options?.offset ??
        0
    );

  const blockedUserIds =
    await getBlockedUserIds(
      supabase,
      normalizedUserId
    );

  let postsQuery =
    supabase
      .from(
        "posts"
      )
      .select(
        `
          id,
          user_id,
          sauna_id,
          sauna_name,
          visit_date,
          set_count,
          rating,
          comment,
          image_url,
          created_at
        `
      )
      .order(
        "created_at",
        {
          ascending:
            false,
        }
      );

  if (
    blockedUserIds.size >
    0
  ) {
    const blockedUserIdFilter =
      `(${[
        ...blockedUserIds,
      ].join(",")})`;

    postsQuery =
      postsQuery.not(
        "user_id",
        "in",
        blockedUserIdFilter
      );
  }

  const {
    data:
      postRows,
    error:
      postsError,
  } =
    await postsQuery
      .range(
        offset,
        offset +
          pageSize
      )
      .returns<
        CommunityPostRow[]
      >();

  if (postsError) {
    throw new Error(
      `Communityを取得できませんでした: ${postsError.message}`
    );
  }

  const fetchedPosts =
    postRows ??
    [];

  const hasMore =
    fetchedPosts.length >
    pageSize;

  const pagePosts =
    fetchedPosts.slice(
      0,
      pageSize
    );

  if (
    pagePosts.length ===
    0
  ) {
    return {
      posts: [],
      hasMore:
        false,
    };
  }

  const postIds =
    pagePosts.map(
      (
        post
      ) =>
        post.id
    );

  const userIds = [
    ...new Set(
      pagePosts.map(
        (
          post
        ) =>
          post.user_id
      )
    ),
  ];

  const [
    profilesResult,
    imagesResult,
    likeCounts,
    commentCounts,
    likedPostIds,
    bookmarkedPostIds,
  ] =
    await Promise.all([
      supabase
        .from(
          "profiles"
        )
        .select(
          `
            id,
            username,
            avatar_url
          `
        )
        .in(
          "id",
          userIds
        )
        .returns<
          ProfileRow[]
        >(),

      supabase
        .from(
          "post_images"
        )
        .select(
          `
            id,
            post_id,
            image_url,
            sort_order
          `
        )
        .in(
          "post_id",
          postIds
        )
        .order(
          "sort_order",
          {
            ascending:
              true,
          }
        )
        .returns<
          PostImageRow[]
        >(),

      getLikeCountsByPostIds(
        supabase,
        postIds
      ),

      getCommentCountsByPostIds(
        supabase,
        postIds
      ),

      getLikedPostIds(
        supabase,
        normalizedUserId,
        postIds
      ),

      getBookmarkedPostIdSet(
        supabase,
        normalizedUserId,
        postIds
      ),
    ]);

  if (
    profilesResult.error
  ) {
    throw new Error(
      `投稿者情報を取得できませんでした: ${profilesResult.error.message}`
    );
  }

  if (
    imagesResult.error
  ) {
    throw new Error(
      `投稿写真を取得できませんでした: ${imagesResult.error.message}`
    );
  }

  const profilesById =
    new Map<
      string,
      ProfileRow
    >(
      (
        profilesResult.data ??
        []
      ).map(
        (
          profile
        ) => [
          profile.id,
          profile,
        ]
      )
    );

  const imagesByPostId =
    createImagesByPostId(
      imagesResult.data ??
        []
    );

  const posts =
    pagePosts.map(
      (
        post
      ): CommunityPost => {
        const profile =
          profilesById.get(
            post.user_id
          );

        const postImages =
          addLegacyImage(
            post,
            imagesByPostId.get(
              post.id
            ) ??
              []
          );

        return {
          id:
            post.id,

          userId:
            post.user_id,

          saunaId:
            post.sauna_id,

          saunaName:
            post.sauna_name,

          visitDate:
            post.visit_date,

          setCount:
            post.set_count,

          rating:
            post.rating,

          comment:
            post.comment,

          createdAt:
            post.created_at,

          author: {
            id:
              profile?.id ??
              post.user_id,

            username:
              profile?.username ??
              null,

            avatarUrl:
              profile?.avatar_url ??
              null,
          },

          images:
            postImages,

          likeCount:
            likeCounts.get(
              post.id
            ) ??
            0,

          commentCount:
            commentCounts.get(
              post.id
            ) ??
            0,

          isLiked:
            likedPostIds.has(
              post.id
            ),

          isBookmarked:
            bookmarkedPostIds.has(
              post.id
            ),
        };
      }
    );

  return {
    posts,
    hasMore,
  };
}
