import type { SupabaseClient } from "@supabase/supabase-js";

import type {
  TodayActivity,
  TodaySavedSauna,
} from "@/types/today";

type RecentActivityRow = {
  id: string;
  user_id: string;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string | null;
  image_url: string | null;
  comments:
    | {
        id: string;
      }[]
    | null;
};

type ProfileRow = {
  id: string;
  username: string | null;
};

type SavedPost = {
  id: string;
  sauna_name: string;
  image_url: string | null;
};

type BookmarkRow = {
  post_id: string;
  created_at: string;
  posts:
    | SavedPost
    | SavedPost[]
    | null;
};

function getSavedPost(
  posts: BookmarkRow["posts"]
): SavedPost | null {
  if (!posts) {
    return null;
  }

  if (Array.isArray(posts)) {
    return posts[0] ?? null;
  }

  return posts;
}

export async function getRecentActivities(
  supabase: SupabaseClient,
  limit = 2
): Promise<TodayActivity[]> {
  const safeLimit = Math.max(
    1,
    Math.floor(limit)
  );

  const { data, error } = await supabase
    .from("posts")
    .select(`
      id,
      user_id,
      sauna_name,
      visit_date,
      set_count,
      rating,
      comment,
      image_url,
      comments (
        id
      )
    `)
    .order("created_at", {
      ascending: false,
    })
    .limit(safeLimit);

  if (error) {
    console.error(
      "最近のサ活の取得に失敗しました:",
      error.message
    );

    return [];
  }

  if (!data || data.length === 0) {
    return [];
  }

  const posts =
    data as unknown as RecentActivityRow[];

  const userIds = [
    ...new Set(
      posts
        .map((post) => post.user_id)
        .filter(
          (userId): userId is string =>
            typeof userId === "string" &&
            userId.length > 0
        )
    ),
  ];

  const profilesByUserId =
    new Map<string, ProfileRow>();

  if (userIds.length > 0) {
    const {
      data: profileData,
      error: profileError,
    } = await supabase
      .from("profiles")
      .select(`
        id,
        username
      `)
      .in("id", userIds);

    if (profileError) {
      console.error(
        "最近のサ活のプロフィール取得に失敗しました:",
        profileError.message
      );
    } else {
      const profiles =
        (profileData ?? []) as ProfileRow[];

      for (const profile of profiles) {
        profilesByUserId.set(
          profile.id,
          profile
        );
      }
    }
  }

  return posts.map((post) => {
    const profile =
      profilesByUserId.get(post.user_id);

    return {
      postId: post.id,
      saunaName: post.sauna_name,
      visitDate: post.visit_date,
      setCount: post.set_count,
      rating: post.rating,
      comment: post.comment,
      imageUrl: post.image_url,
      username:
        profile?.username?.trim() ||
        "TOTONOユーザー",
      commentCount:
        post.comments?.length ?? 0,
    };
  });
}

export async function getTodaySavedSaunas(
  supabase: SupabaseClient,
  userId: string,
  limit = 3
): Promise<TodaySavedSauna[]> {
  const safeLimit = Math.max(
    1,
    Math.floor(limit)
  );

  const { data, error } = await supabase
    .from("bookmarks")
    .select(`
      post_id,
      created_at,
      posts (
        id,
        sauna_name,
        image_url
      )
    `)
    .eq("user_id", userId)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(
      "保存した施設の取得に失敗しました:",
      error.message
    );

    return [];
  }

  if (!data) {
    return [];
  }

  const bookmarks =
    data as unknown as BookmarkRow[];

  const savedSaunas: TodaySavedSauna[] = [];
  const usedSaunaNames = new Set<string>();

  for (const bookmark of bookmarks) {
    const post = getSavedPost(
      bookmark.posts
    );

    if (!post) {
      continue;
    }

    const normalizedSaunaName =
      post.sauna_name
        .trim()
        .toLowerCase();

    if (
      normalizedSaunaName.length === 0 ||
      usedSaunaNames.has(
        normalizedSaunaName
      )
    ) {
      continue;
    }

    usedSaunaNames.add(
      normalizedSaunaName
    );

    savedSaunas.push({
      saunaId: post.id,
      saunaName: post.sauna_name,
      area: null,
      imageUrl: post.image_url,
      isBookmarked: true,
      detailHref: `/posts/${post.id}`,
    });

    if (
      savedSaunas.length >= safeLimit
    ) {
      break;
    }
  }

  return savedSaunas;
}
