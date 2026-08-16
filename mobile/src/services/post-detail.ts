import {
  supabase,
} from "../lib/supabase";
import {
  getSaunaById,
  type Sauna,
} from "./saunas";
import {
  isUserBlocked,
} from "./user-blocks";

export type PostDetailAuthor = {
  id: string;
  username: string | null;
  avatarUrl: string | null;
};

export type PostDetailImage = {
  id: string;
  imageUrl: string;
  sortOrder: number;
};

export type PostDetail = {
  id: string;
  userId: string;
  saunaId: string | null;
  saunaName: string;
  visitDate: string;
  setCount: number;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  author: PostDetailAuthor;
  images: PostDetailImage[];
  sauna: Sauna | null;
};

type PostDetailRow = {
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
  updated_at: string;
};

type ProfileRow = {
  id: string;
  username: string | null;
  avatar_url: string | null;
};

type PostImageRow = {
  id: string;
  image_url: string;
  sort_order: number;
};

function createPostImages(
  post: PostDetailRow,
  imageRows: PostImageRow[]
): PostDetailImage[] {
  const sortedImages = [
    ...imageRows,
  ].sort(
    (
      first,
      second
    ) =>
      first.sort_order -
      second.sort_order
  );

  const images =
    sortedImages.map(
      (
        image
      ): PostDetailImage => ({
        id:
          image.id,

        imageUrl:
          image.image_url,

        sortOrder:
          image.sort_order,
      })
    );

  const legacyImageUrl =
    post.image_url?.trim();

  const containsLegacyImage =
    legacyImageUrl
      ? images.some(
          (
            image
          ) =>
            image.imageUrl ===
            legacyImageUrl
        )
      : false;

  if (
    legacyImageUrl &&
    !containsLegacyImage
  ) {
    images.unshift({
      id:
        `legacy-${post.id}`,

      imageUrl:
        legacyImageUrl,

      sortOrder:
        -1,
    });
  }

  return images.slice(
    0,
    5
  );
}

export async function getPostDetail(
  postId: string
): Promise<PostDetail> {
  if (!supabase) {
    throw new Error(
      "Supabaseの設定が見つかりません。"
    );
  }

  const normalizedPostId =
    postId.trim();

  if (!normalizedPostId) {
    throw new Error(
      "投稿IDが指定されていません。"
    );
  }

  const {
    data:
      sessionData,
    error:
      sessionError,
  } =
    await supabase.auth
      .getSession();

  if (sessionError) {
    throw new Error(
      `ログイン状態を確認できませんでした: ${sessionError.message}`
    );
  }

  const currentUserId =
    sessionData.session
      ?.user.id ??
    null;

  const {
    data: postData,
    error: postError,
  } =
    await supabase
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
          created_at,
          updated_at
        `
      )
      .eq(
        "id",
        normalizedPostId
      )
      .maybeSingle<
        PostDetailRow
      >();

  if (postError) {
    throw new Error(
      `投稿を取得できませんでした: ${postError.message}`
    );
  }

  if (!postData) {
    throw new Error(
      "投稿が見つかりませんでした。"
    );
  }

  if (
    currentUserId &&
    currentUserId !==
      postData.user_id
  ) {
    const blocked =
      await isUserBlocked(
        supabase,
        currentUserId,
        postData.user_id
      );

    if (blocked) {
      throw new Error(
        "この投稿は表示できません。"
      );
    }
  }

  const [
    profileResult,
    imagesResult,
    sauna,
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
        .eq(
          "id",
          postData.user_id
        )
        .maybeSingle<
          ProfileRow
        >(),

      supabase
        .from(
          "post_images"
        )
        .select(
          `
            id,
            image_url,
            sort_order
          `
        )
        .eq(
          "post_id",
          postData.id
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

      postData.sauna_id
        ? getSaunaById(
            supabase,
            postData.sauna_id
          )
        : Promise.resolve(
            null
          ),
    ]);

  if (
    profileResult.error
  ) {
    throw new Error(
      `投稿者情報を取得できませんでした: ${profileResult.error.message}`
    );
  }

  if (
    imagesResult.error
  ) {
    throw new Error(
      `投稿写真を取得できませんでした: ${imagesResult.error.message}`
    );
  }

  const profile =
    profileResult.data;

  return {
    id:
      postData.id,

    userId:
      postData.user_id,

    saunaId:
      postData.sauna_id,

    saunaName:
      postData.sauna_name,

    visitDate:
      postData.visit_date,

    setCount:
      postData.set_count,

    rating:
      postData.rating,

    comment:
      postData.comment,

    createdAt:
      postData.created_at,

    updatedAt:
      postData.updated_at,

    author: {
      id:
        profile?.id ??
        postData.user_id,

      username:
        profile?.username ??
        null,

      avatarUrl:
        profile?.avatar_url ??
        null,
    },

    images:
      createPostImages(
        postData,
        imagesResult.data ??
          []
      ),

    sauna,
  };
}
