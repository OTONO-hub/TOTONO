import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { JsonLd } from "@/components/seo/json-ld";
import { RecentlyViewedSaunaTracker } from "@/components/saunas/RecentlyViewedSaunaTracker";
import { SaunaDetailContent } from "@/components/saunas/SaunaDetailContent";
import { createClient } from "@/lib/supabase/server";
import { isFavoriteSauna } from "@/services/favorite-saunas";
import { getPostImagesByPostIds } from "@/services/post-images";
import { getPostsBySaunaId } from "@/services/posts";
import {
  getSaunaMetricsBySaunaIds,
  type RatingDistribution,
} from "@/services/sauna-metrics";
import { getSaunaById } from "@/services/saunas";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type SaunaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: SaunaDetailPageProps): Promise<Metadata> {
  const { id } = await params;

  const supabase = await createClient();
  const sauna = await getSaunaById(supabase, id);

  if (!sauna) {
    return {
      title: "サウナ施設が見つかりません",
      description:
        "指定されたサウナ施設は存在しないか、削除された可能性があります。",
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const location = createSaunaLocation(
    sauna.prefecture,
    sauna.city
  );

  const description = location
    ? `${sauna.name}は${location}のサウナ施設です。TOTONOで施設情報やサ活投稿、評価を確認できます。`
    : `${sauna.name}の施設情報やサ活投稿、評価をTOTONOで確認できます。`;

  const canonicalUrl = `${SITE_URL}/saunas/${sauna.id}`;

  const images = sauna.image_url
    ? [
        {
          url: sauna.image_url,
          alt: `${sauna.name}の施設画像`,
        },
      ]
    : undefined;

  return {
    title: sauna.name,
    description,

    alternates: {
      canonical: canonicalUrl,
    },

    openGraph: {
      type: "website",
      locale: "ja_JP",
      url: canonicalUrl,
      siteName: "TOTONO",
      title: `${sauna.name} | TOTONO`,
      description,
      images,
    },

    twitter: {
      card: "summary_large_image",
      title: `${sauna.name} | TOTONO`,
      description,
      images: sauna.image_url
        ? [sauna.image_url]
        : undefined,
    },
  };
}

export default async function SaunaDetailPage({
  params,
}: SaunaDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const [
    sauna,
    posts,
    {
      data: { user },
    },
  ] = await Promise.all([
    getSaunaById(supabase, id),
    getPostsBySaunaId(supabase, id),
    supabase.auth.getUser(),
  ]);

  if (!sauna) {
    notFound();
  }

  const postIds = posts.map(
    (post) => post.id
  );

  const [
    initialFavorite,
    metricsBySaunaId,
    postImagesByPostId,
  ] = await Promise.all([
    user
      ? isFavoriteSauna(
          supabase,
          user.id,
          sauna.id
        )
      : Promise.resolve(false),

    getSaunaMetricsBySaunaIds(
      supabase,
      [sauna.id]
    ),

    getPostImagesByPostIds(
      supabase,
      postIds
    ),
  ]);

  /*
   * 施設Community一覧では1枚目をカバーとして表示し、
   * 画像総数を枚数バッジに使用します。
   *
   * post_imagesが存在しない旧投稿は、
   * posts.image_urlをフォールバックとして利用します。
   */
  const communityPosts = posts.map(
    (post) => {
      const postImages =
        postImagesByPostId.get(
          post.id
        ) ?? [];

      const coverImageUrl =
        postImages[0]?.image_url ??
        post.image_url ??
        null;

      const imageCount =
        postImages.length > 0
          ? postImages.length
          : coverImageUrl
            ? 1
            : 0;

      return {
        ...post,
        image_url: coverImageUrl,
        image_count: imageCount,
      };
    }
  );

  const metrics = metricsBySaunaId[sauna.id];

  const postCount =
    metrics?.postCount ?? posts.length;

  const favoriteCount =
    metrics?.favoriteCount ?? 0;

  const averageRating =
    metrics?.averageRating ?? null;

  const ratingCount =
    metrics?.ratingCount ?? 0;

  const ratingDistribution =
    metrics?.ratingDistribution ??
    createEmptyRatingDistribution();

  const location = createSaunaLocation(
    sauna.prefecture,
    sauna.city
  );

  const description = location
    ? `${sauna.name}は${location}のサウナ施設です。TOTONOで施設情報やサ活投稿、評価を確認できます。`
    : `${sauna.name}の施設情報やサ活投稿、評価をTOTONOで確認できます。`;

  const canonicalUrl =
    `${SITE_URL}/saunas/${sauna.id}`;

  const saunaJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${canonicalUrl}#sauna`,
    name: sauna.name,
    url: canonicalUrl,
    description,

    ...(sauna.image_url
      ? {
          image: sauna.image_url,
        }
      : {}),

    ...(sauna.prefecture || sauna.city
      ? {
          address: {
            "@type": "PostalAddress",
            ...(sauna.prefecture
              ? {
                  addressRegion:
                    sauna.prefecture,
                }
              : {}),
            ...(sauna.city
              ? {
                  addressLocality:
                    sauna.city,
                }
              : {}),
            addressCountry: "JP",
          },
        }
      : {}),

    ...(averageRating !== null &&
    ratingCount > 0
      ? {
          aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: averageRating,
            ratingCount,
            bestRating: 5,
            worstRating: 1,
          },
        }
      : {}),

    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": canonicalUrl,
    },
  };

  return (
    <>
      <JsonLd data={saunaJsonLd} />

      <RecentlyViewedSaunaTracker
        sauna={{
          id: sauna.id,
          name: sauna.name,
          imageUrl: sauna.image_url,
          prefecture: sauna.prefecture,
          city: sauna.city,
          averageRating,
        }}
      />

      <SaunaDetailContent
        sauna={sauna}
        posts={communityPosts}
        userId={user?.id ?? null}
        initialFavorite={initialFavorite}
        averageRating={averageRating}
        ratingCount={ratingCount}
        postCount={postCount}
        favoriteCount={favoriteCount}
        ratingDistribution={ratingDistribution}
      />
    </>
  );
}

function createSaunaLocation(
  prefecture: string | null,
  city: string | null
): string {
  return [prefecture, city]
    .filter(
      (
        value
      ): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .join("");
}

function createEmptyRatingDistribution(): RatingDistribution {
  return {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
  };
}