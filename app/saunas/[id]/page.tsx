import { notFound } from "next/navigation";

import { SaunaDetailContent } from "@/components/saunas/SaunaDetailContent";
import { getSaunaDetailPageData } from "@/lib/saunas/getSaunaDetailPageData";

type SaunaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SaunaDetailPage({
  params,
}: SaunaDetailPageProps) {
  const { id } = await params;

  const pageData =
    await getSaunaDetailPageData(id);

  if (!pageData) {
    notFound();
  }

  return (
    <SaunaDetailContent
      sauna={pageData.sauna}
      posts={pageData.posts}
      userId={pageData.userId}
      initialFavorite={
        pageData.initialFavorite
      }
      averageRating={
        pageData.averageRating
      }
      ratingCount={pageData.ratingCount}
      postCount={pageData.postCount}
      favoriteCount={
        pageData.favoriteCount
      }
      ratingDistribution={
        pageData.ratingDistribution
      }
    />
  );
}