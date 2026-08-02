import {
  Building2,
  Compass,
  FileText,
  LocateFixed,
  Search as SearchIcon,
} from "lucide-react";

import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { PostCard } from "@/components/post/PostCard";
import { FadeIn } from "@/components/motion/FadeIn";
import { ScrollReveal } from "@/components/motion/ScrollReveal";
import { EmptyState } from "@/components/ui/state/EmptyState";
import { SearchDiscoveryHero } from "@/components/search/SearchDiscoveryHero";
import { SearchMessage } from "./components/SearchMessage";
import { SearchResultsExplorer } from "@/components/search/SearchResultsExplorer";
import { ResultSectionHeader } from "./components/ResultSectionHeader";
import { SaunaSortControls } from "./components/SaunaSortControls";
import { CurrentLocationRadiusControls } from "./components/CurrentLocationRadiusControls";
import { CurrentLocationEmptyResult } from "./components/CurrentLocationEmptyResult";
import {
  createEmptySaunaMessage,
  createLocationSearch,
  createNoResultDescription,
  createSortSearchParams,
  getSaunaDistanceRange,
  normalizeSaunaFeatures,
  normalizeSaunaSort,
  type SaunaSortKey,
} from "./utils/search-params";
import { SaunaSearchCard } from "@/components/search/SaunaSearchCard";
import { createClient } from "@/lib/supabase/server";
import { getBookmarkedPostIds } from "@/services/bookmarks";
import { getCommentsByPostIds } from "@/services/comments";
import { getLikeCount, isLiked } from "@/services/likes";
import { getProfilesByUserIds } from "@/services/profile";
import { getPostImagesByPostIds } from "@/services/post-images";
import { getSaunaMetricsBySaunaIds } from "@/services/sauna-metrics";
import { searchPosts } from "@/services/search";
import {
  searchSaunas,
  type SaunaFeature,
  type SaunaLocationSearch,
} from "@/services/saunas";
import type { CommentWithAuthor } from "@/types/comment";

/**
 * 検索ページがURLから受け取る
 * クエリパラメータです。
 */
type SearchPageProps = {
  searchParams: Promise<{
    /**
     * キーワードです。
     */
    q?: string;

    /**
     * 都道府県です。
     */
    prefecture?: string;

    /**
     * 選択された設備条件です。
     */
    features?: string | string[];

    /**
     * 現在地の緯度です。
     */
    lat?: string;

    /**
     * 現在地の経度です。
     */
    lng?: string;

    /**
     * 現在地検索の半径です。
     */
    radius?: string;

    /**
     * 現在地検索中か判定する値です。
     */
    location?: string;

    /**
     * 施設検索結果の並び順です。
     */
    sort?: string;
  }>;
};

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  /**
   * URLから検索条件を取得します。
   */
  const {
    q = "",
    prefecture = "",
    features: featureParams,
    lat,
    lng,
    radius,
    location,
    sort = "",
  } = await searchParams;

  /**
   * 前後の空白を削除した検索キーワードです。
   */
  const query = q.trim();

  /**
   * 前後の空白を削除した都道府県です。
   */
  const selectedPrefecture =
    prefecture.trim();

  /**
   * URLから設備条件を取得します。
   */
  const features: SaunaFeature[] =
    normalizeSaunaFeatures(
      featureParams
    );

  /**
   * URLから現在地検索の条件を作成します。
   *
   * 値が不正な場合はnullになります。
   */
  const currentLocation:
    | SaunaLocationSearch
    | null = createLocationSearch({
    latitude: lat,
    longitude: lng,
    radius,
    location,
  });

  /**
   * 現在地検索中かどうかを判定します。
   */
  const isCurrentLocationSearch =
    currentLocation !== null;

  /**
   * URLのsortパラメータを安全な並び順へ変換します。
   *
   * 現在地検索では「近い順」、
   * 通常検索では「人気順」を初期値にします。
   */
  const saunaSort: SaunaSortKey =
    normalizeSaunaSort(
      sort,
      isCurrentLocationSearch
    );

  /**
   * 並び替えリンクでも、現在の検索条件を
   * 失わないようにURLパラメータを作成します。
   */
  const sortSearchParams =
    createSortSearchParams({
      query,
      selectedPrefecture,
      features,
      latitude: lat,
      longitude: lng,
      radius,
      location,
    });

  /**
   * 施設検索を実行する条件です。
   *
   * 次のいずれかが指定されていれば
   * 施設検索を実行します。
   *
   * ・キーワード
   * ・都道府県
   * ・設備条件
   * ・現在地
   */
  const shouldSearchSaunas =
    Boolean(query) ||
    Boolean(selectedPrefecture) ||
    features.length > 0 ||
    isCurrentLocationSearch;

  /**
   * 投稿検索はキーワードが
   * 入力されている場合だけ実行します。
   */
  const shouldSearchPosts =
    Boolean(query);

  const supabase =
    await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /**
   * 投稿検索と施設検索を並行して実行します。
   *
   * 現在地だけで検索している場合は、
   * 投稿検索を実行しません。
   */
  const [posts, saunas] =
    await Promise.all([
      shouldSearchPosts
        ? searchPosts(
            supabase,
            query
          )
        : Promise.resolve([]),

      shouldSearchSaunas
        ? searchSaunas(
            supabase,
            query,
            features,
            selectedPrefecture ||
              undefined,
            {
              location:
                currentLocation,
            }
          )
        : Promise.resolve([]),
    ]);

  /**
   * 検索結果に表示する施設について、
   * 投稿数・お気に入り数・評価を取得します。
   */
  const saunaMetrics =
    await getSaunaMetricsBySaunaIds(
      supabase,
      saunas.map(
        (sauna) => sauna.id
      )
    );

  /**
   * URLで選択された条件に合わせて、
   * 施設検索結果を並び替えます。
   */
  const sortedSaunas = [
    ...saunas,
  ].sort((a, b) => {
    const metricsA =
      saunaMetrics[a.id];

    const metricsB =
      saunaMetrics[b.id];

    if (
      saunaSort === "distance"
    ) {
      const distanceA =
        typeof a.distance_km ===
          "number" &&
        Number.isFinite(
          a.distance_km
        )
          ? a.distance_km
          : Number.POSITIVE_INFINITY;

      const distanceB =
        typeof b.distance_km ===
          "number" &&
        Number.isFinite(
          b.distance_km
        )
          ? b.distance_km
          : Number.POSITIVE_INFINITY;

      const distanceDifference =
        distanceA - distanceB;

      if (
        distanceDifference !== 0
      ) {
        return distanceDifference;
      }
    }

    if (
      saunaSort === "rating"
    ) {
      const averageRatingA =
        metricsA?.averageRating ??
        -1;

      const averageRatingB =
        metricsB?.averageRating ??
        -1;

      const ratingDifference =
        averageRatingB -
        averageRatingA;

      if (
        ratingDifference !== 0
      ) {
        return ratingDifference;
      }

      const ratingCountDifference =
        (metricsB?.ratingCount ??
          0) -
        (metricsA?.ratingCount ??
          0);

      if (
        ratingCountDifference !==
        0
      ) {
        return ratingCountDifference;
      }
    }

    if (
      saunaSort === "popular"
    ) {
      const popularityA =
        (metricsA?.postCount ??
          0) *
          3 +
        (metricsA?.favoriteCount ??
          0) *
          2 +
        (metricsA?.ratingCount ??
          0);

      const popularityB =
        (metricsB?.postCount ??
          0) *
          3 +
        (metricsB?.favoriteCount ??
          0) *
          2 +
        (metricsB?.ratingCount ??
          0);

      const popularityDifference =
        popularityB -
        popularityA;

      if (
        popularityDifference !==
        0
      ) {
        return popularityDifference;
      }
    }

    return a.name.localeCompare(
      b.name,
      "ja"
    );
  });

  /**
   * 現在地検索結果の中から、
   * 最寄り施設と最も遠い施設の距離を取得します。
   */
  const saunaDistanceRange =
    isCurrentLocationSearch
      ? getSaunaDistanceRange(
          saunas
        )
      : null;

  /**
   * 検索された投稿に付いている
   * コメントを取得します。
   */
  const comments =
    await getCommentsByPostIds(
      supabase,
      posts.map(
        (post) => post.id
      )
    );

  /**
   * ログインユーザーが保存している
   * 投稿IDを取得します。
   */
  const bookmarkedPostIds =
    user
      ? await getBookmarkedPostIds(
          supabase,
          user.id,
          posts.map(
            (post) => post.id
          )
        )
      : [];

  const bookmarkedPostIdSet =
    new Set(
      bookmarkedPostIds
    );

  /**
   * 投稿者とコメント投稿者の
   * ユーザーIDをまとめます。
   */
  const userIds = [
    ...posts.map(
      (post) => post.user_id
    ),
    ...comments.map(
      (comment) =>
        comment.user_id
    ),
  ];

  /**
   * 投稿やコメントに表示する
   * プロフィールを一括取得します。
   */
  const postIds = posts.map((post) => post.id);

  const [
    profiles,
    postImagesByPostId,
  ] = await Promise.all([
    getProfilesByUserIds(
      supabase,
      userIds
    ),
    getPostImagesByPostIds(
      supabase,
      postIds
    ),
  ]);

  const profilesByUserId =
    new Map(
      profiles.map(
        (profile) => [
          profile.id,
          profile,
        ]
      )
    );

  /**
   * コメントを投稿IDごとに整理します。
   */
  const commentsByPostId =
    new Map<
      string,
      CommentWithAuthor[]
    >();

  for (
    const comment of comments
  ) {
    const commentWithAuthor: CommentWithAuthor =
      {
        comment,
        author:
          profilesByUserId.get(
            comment.user_id
          ) ?? null,
      };

    const currentComments =
      commentsByPostId.get(
        comment.post_id
      ) ?? [];

    currentComments.push(
      commentWithAuthor
    );

    commentsByPostId.set(
      comment.post_id,
      currentComments
    );
  }

  /**
   * 投稿カードに必要な情報を
   * 投稿ごとにまとめます。
   */
  const postsWithMeta =
    user
      ? await Promise.all(
          posts.map(
            async (post) => ({
              post,

              author:
                profilesByUserId.get(
                  post.user_id
                ) ?? null,

              likeCount:
                await getLikeCount(
                  supabase,
                  post.id
                ),

              liked:
                await isLiked(
                  supabase,
                  user.id,
                  post.id
                ),

              bookmarked:
                bookmarkedPostIdSet.has(
                  post.id
                ),

              comments:
                commentsByPostId.get(
                  post.id
                ) ?? [],
              images:
                postImagesByPostId.get(
                  post.id
                ) ?? [],
            })
          )
        )
      : [];

  /**
   * 施設と投稿を合わせた
   * 検索結果件数です。
   */
  const totalResultCount =
    saunas.length +
    postsWithMeta.length;

  /**
   * 検索条件が指定されているかを
   * 判定します。
   */
  const hasSearchCondition =
    shouldSearchSaunas ||
    shouldSearchPosts;

  /**
   * 検索結果が0件だった場合に
   * 表示する説明文です。
   */
  const noResultDescription =
    createNoResultDescription({
      query,
      isCurrentLocationSearch,
      selectedPrefecture,
    });

  return (
    <>
      <Header />

      <main
        className="
          relative
          min-h-screen
          overflow-hidden
          bg-muted/25
          px-4
          pb-32
          pt-10
          sm:px-6
          sm:pt-12
          md:pb-20
        "
      >
        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -right-40
            top-12
            size-96
            rounded-full
            bg-secondary/15
            blur-3xl
          "
        />

        <div
          aria-hidden="true"
          className="
            pointer-events-none
            absolute
            -left-48
            top-[32rem]
            size-96
            rounded-full
            bg-accent/10
            blur-3xl
          "
        />

        <div
          className="
            relative
            mx-auto
            w-full
            max-w-6xl
          "
        >
          <FadeIn
            duration="slow"
            distance="subtle"
          >
            <SearchDiscoveryHero
              currentRadiusKm={
                currentLocation?.radiusKm ??
                10
              }
            />
          </FadeIn>

          {!user ? (
            <SearchMessage
              title="ログインが必要です"
              description="施設やサ活の検索結果を見るには、ログインしてください。"
            />
          ) : !hasSearchCondition ? (
            <SearchMessage
              title="検索条件を指定してください"
              description="キーワードを入力するか、現在地から周辺のサウナを探せます。"
            />
          ) : totalResultCount ===
            0 ? (
            isCurrentLocationSearch ? (
              <CurrentLocationEmptyResult
                currentRadiusKm={
                  currentLocation.radiusKm
                }
                currentSort={
                  saunaSort
                }
                description={
                  noResultDescription
                }
                searchParams={
                  sortSearchParams
                }
              />
            ) : (
              <EmptyState
                className="mt-10"
                eyebrow="No Results"
                icon={SearchIcon}
                title="検索結果が見つかりませんでした"
                description={
                  noResultDescription
                }
                action={{
                  label: "条件をリセット",
                  href: "/search",
                  icon: SearchIcon,
                }}
                secondaryAction={{
                  label: "Communityを見る",
                  href: "/community",
                  icon: Compass,
                }}
              />
            )
          ) : (
            <div
              className="
                mt-12
                space-y-16
                sm:mt-14
                sm:space-y-20
              "
            >
              {isCurrentLocationSearch ? (
                <ScrollReveal
                  duration="normal"
                  distance="subtle"
                >
                  <section
                    aria-label="現在地検索の条件"
                    className="
                      flex
                      flex-col
                      gap-4
                      rounded-[1.75rem]
                      border
                      border-secondary/30
                      bg-secondary/10
                      px-5
                      py-5
                      sm:flex-row
                      sm:items-center
                      sm:justify-between
                      sm:px-6
                    "
                  >
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                    "
                  >
                    <span
                      className="
                        mt-0.5
                        flex
                        size-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-white
                        text-foreground
                        shadow-sm
                      "
                    >
                      <LocateFixed
                        className="size-4"
                        strokeWidth={
                          1.8
                        }
                        aria-hidden="true"
                      />
                    </span>

                    <div>
                      <p
                        className="
                          text-sm
                          font-semibold
                          text-foreground
                        "
                      >
                        現在地周辺の施設
                      </p>

                      <p
                        className="
                          mt-1
                          text-xs
                          leading-5
                          text-muted-foreground
                        "
                      >
                        現在地から
                        {
                          currentLocation.radiusKm
                        }
                        km以内の施設を表示しています。
                      </p>
                    </div>
                  </div>

                  <CurrentLocationRadiusControls
                    currentRadiusKm={
                      currentLocation.radiusKm
                    }
                    currentSort={
                      saunaSort
                    }
                    distanceRange={
                      saunaDistanceRange
                    }
                    resultCount={
                      saunas.length
                    }
                    searchParams={
                      sortSearchParams
                    }
                  />
                  </section>
                </ScrollReveal>
              ) : null}

              <ScrollReveal
                duration="slow"
                distance="normal"
              >
                <section
                  aria-labelledby="sauna-results-heading"
                >
                <ResultSectionHeader
                  id="sauna-results-heading"
                  icon={
                    <Building2
                      className="size-4.5"
                      strokeWidth={
                        1.8
                      }
                    />
                  }
                  eyebrow={
                    isCurrentLocationSearch
                      ? "Nearby Saunas"
                      : "Sauna Facilities"
                  }
                  title={
                    isCurrentLocationSearch
                      ? "現在地周辺のサウナ"
                      : "サウナ施設"
                  }
                  count={
                    saunas.length
                  }
                />

                {saunas.length >
                0 ? (
                  <SaunaSortControls
                    currentSort={
                      saunaSort
                    }
                    isCurrentLocationSearch={
                      isCurrentLocationSearch
                    }
                    searchParams={
                      sortSearchParams
                    }
                  />
                ) : null}

                {saunas.length ===
                0 ? (
                  <EmptyState
                    className="mt-8"
                    eyebrow="No Saunas"
                    icon={Building2}
                    title="条件に合うサウナが見つかりませんでした"
                    description={createEmptySaunaMessage(
                      {
                        query,
                        isCurrentLocationSearch,
                        radiusKm:
                          currentLocation?.radiusKm,
                      }
                    )}
                    action={{
                      label: "条件をリセット",
                      href: "/search",
                      icon: SearchIcon,
                    }}
                  />
                ) : (
                  <SearchResultsExplorer
                    saunas={
                      sortedSaunas
                    }
                    currentLocation={
                      currentLocation
                    }
                  >
                    {sortedSaunas.map(
                      (sauna) => {
                        const metrics =
                          saunaMetrics[
                            sauna.id
                          ];

                        return (
                          <SaunaSearchCard
                            key={
                              sauna.id
                            }
                            sauna={
                              sauna
                            }
                            postCount={
                              metrics?.postCount ??
                              0
                            }
                            favoriteCount={
                              metrics?.favoriteCount ??
                              0
                            }
                            averageRating={
                              metrics?.averageRating ??
                              null
                            }
                            ratingCount={
                              metrics?.ratingCount ??
                              0
                            }
                          />
                        );
                      }
                    )}
                  </SearchResultsExplorer>
                )}
                </section>
              </ScrollReveal>

              {shouldSearchPosts ? (
                <ScrollReveal
                  delay={60}
                  duration="slow"
                  distance="normal"
                >
                  <section
                    aria-labelledby="post-results-heading"
                  >
                  <ResultSectionHeader
                    id="post-results-heading"
                    icon={
                      <FileText
                        className="size-4.5"
                        strokeWidth={
                          1.8
                        }
                      />
                    }
                    eyebrow="Sauna Journals"
                    title="みんなのサ活"
                    count={
                      postsWithMeta.length
                    }
                  />

                  {postsWithMeta.length ===
                  0 ? (
                    <EmptyState
                      className="mt-8"
                      eyebrow="No Journals"
                      icon={FileText}
                      title="一致するサ活が見つかりませんでした"
                      description={`「${query}」に一致するサ活は、まだ投稿されていないようです。`}
                      action={{
                        label: "Communityを見る",
                        href: "/community",
                        icon: Compass,
                      }}
                    />
                  ) : (
                    <div
                      className="
                        mx-auto
                        mt-8
                        max-w-3xl
                        space-y-8
                        sm:space-y-12
                      "
                    >
                      {postsWithMeta.map(
                        ({
                          post,
                          author,
                          likeCount,
                          liked,
                          bookmarked,
                          comments:
                            postComments,
                          images,
                        }) => (
                          <PostCard
                            key={
                              post.id
                            }
                            post={
                              post
                            }
                            author={
                              author
                            }
                            userId={
                              user.id
                            }
                            initialLiked={
                              liked
                            }
                            initialLikeCount={
                              likeCount
                            }
                            initialBookmarked={
                              bookmarked
                            }
                            comments={
                              postComments
                            }
                            images={images}
                            imageDisplayMode="cover"
                          />
                        )
                      )}
                    </div>
                  )}
                  </section>
                </ScrollReveal>
              ) : null}
            </div>
          )}
        </div>
      </main>

      {user ? (
        <AppMobileNavigation />
      ) : null}
    </>
  );
}
