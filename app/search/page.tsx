import type { Metadata } from "next";

import { Header } from "@/components/layout/Header";
import { SearchContent } from "@/components/search/SearchContent";
import { SearchHero } from "@/components/search/SearchHero";
import { SearchPageShell } from "@/components/search/SearchPageShell";
import { normalizeSearchQuery } from "@/lib/search-query";
import { createClient } from "@/lib/supabase/server";
import { getSearchPageData } from "@/services/search-page";

type SearchPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

function getSearchCanonicalUrl() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

  if (!siteUrl) {
    return undefined;
  }

  try {
    return new URL("/search", siteUrl);
  } catch {
    console.error(
      "NEXT_PUBLIC_SITE_URLの形式が正しくありません。"
    );

    return undefined;
  }
}

export async function generateMetadata({
  searchParams,
}: SearchPageProps): Promise<Metadata> {
  const { q } = await searchParams;
  const query = normalizeSearchQuery(q);
  const canonicalUrl = getSearchCanonicalUrl();

  if (!query) {
    return {
      title: "サウナを探す | TOTONO",
      description:
        "施設名、地域名、サ活の投稿内容から、お気に入りのサウナを探せます。",
      robots: {
        index: false,
        follow: true,
      },
      alternates: canonicalUrl
        ? {
            canonical: canonicalUrl,
          }
        : undefined,
    };
  }

  return {
    title: `${query}の検索結果 | TOTONO`,
    description: `TOTONOで「${query}」に関連するサウナ施設やサ活を検索した結果です。`,
    robots: {
      index: false,
      follow: true,
    },
    alternates: canonicalUrl
      ? {
          canonical: canonicalUrl,
        }
      : undefined,
  };
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q } = await searchParams;
  const query = normalizeSearchQuery(q);

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const searchData =
    user && query
      ? await getSearchPageData({
          supabase,
          userId: user.id,
          query,
        })
      : null;

  const saunas = searchData?.saunas ?? [];
  const saunaMetrics = searchData?.saunaMetrics ?? {};
  const postsWithMeta = searchData?.postsWithMeta ?? [];

  return (
    <>
      <Header />

      <SearchPageShell>
        <SearchHero />

        <SearchContent
          userId={user?.id ?? null}
          query={query}
          saunas={saunas}
          saunaMetrics={saunaMetrics}
          posts={postsWithMeta}
        />
      </SearchPageShell>
    </>
  );
}
