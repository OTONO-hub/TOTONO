import {
  supabase,
} from "../lib/supabase";

export type ProfileSummary = {
  totalVisits: number;
  visitedSaunas: number;
  totalSets: number;
  averageRating: number | null;
};

export type RecentSaunaActivity = {
  id: string;
  saunaId: string | null;
  saunaName: string;
  visitDate: string;
  setCount: number;
  rating: number;
  comment: string | null;
  imageUrl: string | null;
};

export type ProfileData = {
  username: string | null;
  avatarUrl: string | null;
  bio: string | null;
  summary: ProfileSummary;
  recentActivities: RecentSaunaActivity[];
};

type ProfileRow = {
  username: string | null;
  avatar_url: string | null;
  bio: string | null;
};

type PostImageRow = {
  image_url: string;
  sort_order: number;
};

type ProfilePostRow = {
  id: string;
  sauna_id: string | null;
  sauna_name: string;
  visit_date: string;
  set_count: number;
  rating: number;
  comment: string | null;
  image_url: string | null;
  post_images:
    | PostImageRow[]
    | null;
};

const RECENT_ACTIVITY_LIMIT =
  5;

function getPrimaryImageUrl(
  post: ProfilePostRow
): string | null {
  const sortedImages = [
    ...(post.post_images ??
      []),
  ].sort(
    (
      first,
      second
    ) =>
      first.sort_order -
      second.sort_order
  );

  return (
    sortedImages[0]
      ?.image_url ??
    post.image_url ??
    null
  );
}

function countVisitedSaunas(
  posts: ProfilePostRow[]
): number {
  const saunaKeys =
    posts
      .map((post) => {
        if (
          post.sauna_id
        ) {
          return `id:${post.sauna_id}`;
        }

        const normalizedName =
          post.sauna_name
            .trim()
            .toLocaleLowerCase(
              "ja-JP"
            );

        return normalizedName
          ? `name:${normalizedName}`
          : null;
      })
      .filter(
        (
          saunaKey
        ): saunaKey is string =>
          saunaKey !==
          null
      );

  return new Set(
    saunaKeys
  ).size;
}

function calculateAverageRating(
  posts: ProfilePostRow[]
): number | null {
  if (
    posts.length === 0
  ) {
    return null;
  }

  const ratingTotal =
    posts.reduce(
      (
        total,
        post
      ) =>
        total +
        post.rating,
      0
    );

  return (
    Math.round(
      (ratingTotal /
        posts.length) *
        10
    ) / 10
  );
}

export async function getProfileData(
  userId: string
): Promise<ProfileData> {
  if (!supabase) {
    throw new Error(
      "Supabaseの設定が見つかりません。"
    );
  }

  const [
    profileResult,
    postsResult,
  ] =
    await Promise.all([
      supabase
        .from(
          "profiles"
        )
        .select(
          `
            username,
            avatar_url,
            bio
          `
        )
        .eq(
          "id",
          userId
        )
        .maybeSingle<
          ProfileRow
        >(),

      supabase
        .from(
          "posts"
        )
        .select(
          `
            id,
            sauna_id,
            sauna_name,
            visit_date,
            set_count,
            rating,
            comment,
            image_url,
            post_images (
              image_url,
              sort_order
            )
          `
        )
        .eq(
          "user_id",
          userId
        )
        .order(
          "visit_date",
          {
            ascending:
              false,
          }
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        )
        .returns<
          ProfilePostRow[]
        >(),
    ]);

  if (
    profileResult.error
  ) {
    throw new Error(
      `プロフィールを取得できませんでした: ${profileResult.error.message}`
    );
  }

  if (
    postsResult.error
  ) {
    throw new Error(
      `サ活データを取得できませんでした: ${postsResult.error.message}`
    );
  }

  const profile =
    profileResult.data;

  const posts =
    postsResult.data ??
    [];

  const totalSets =
    posts.reduce(
      (
        total,
        post
      ) =>
        total +
        post.set_count,
      0
    );

  const recentActivities =
    posts
      .slice(
        0,
        RECENT_ACTIVITY_LIMIT
      )
      .map(
        (
          post
        ): RecentSaunaActivity => ({
          id:
            post.id,

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

          imageUrl:
            getPrimaryImageUrl(
              post
            ),
        })
      );

  return {
    username:
      profile?.username ??
      null,

    avatarUrl:
      profile?.avatar_url ??
      null,

    bio:
      profile?.bio ??
      null,

    summary: {
      totalVisits:
        posts.length,

      visitedSaunas:
        countVisitedSaunas(
          posts
        ),

      totalSets,

      averageRating:
        calculateAverageRating(
          posts
        ),
    },

    recentActivities,
  };
}
