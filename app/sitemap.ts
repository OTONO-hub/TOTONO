import type { MetadataRoute } from "next";

import { createClient } from "@/lib/supabase/server";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

type SitemapPost = {
  id: string;
  created_at: string;
  updated_at: string | null;
};

type SitemapProfile = {
  id: string;
};

type SitemapSauna = {
  id: string;
};

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();

  const now = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: SITE_URL,
      lastModified: now,
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${SITE_URL}/search`,
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.9,
    },
  ];

  const [
    postsResult,
    profilesResult,
    saunasResult,
  ] = await Promise.all([
    supabase
      .from("posts")
      .select("id, created_at, updated_at")
      .order("created_at", {
        ascending: false,
      })
      .limit(1000),

    supabase
      .from("profiles")
      .select("id")
      .limit(1000),

    supabase
      .from("saunas")
      .select("id")
      .limit(1000),
  ]);

  if (postsResult.error) {
    console.error(
      "サイトマップ用の投稿取得に失敗しました:",
      postsResult.error.message
    );
  }

  if (profilesResult.error) {
    console.error(
      "サイトマップ用のプロフィール取得に失敗しました:",
      profilesResult.error.message
    );
  }

  if (saunasResult.error) {
    console.error(
      "サイトマップ用のサウナ施設取得に失敗しました:",
      saunasResult.error.message
    );
  }

  const posts = (postsResult.data ?? []) as SitemapPost[];
  const profiles = (profilesResult.data ?? []) as SitemapProfile[];
  const saunas = (saunasResult.data ?? []) as SitemapSauna[];

  const postPages: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${SITE_URL}/posts/${post.id}`,
    lastModified: post.updated_at ?? post.created_at,
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const profilePages: MetadataRoute.Sitemap = profiles.map(
    (profile) => ({
      url: `${SITE_URL}/users/${profile.id}`,
      changeFrequency: "weekly",
      priority: 0.6,
    })
  );

  const saunaPages: MetadataRoute.Sitemap = saunas.map((sauna) => ({
    url: `${SITE_URL}/saunas/${sauna.id}`,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...saunaPages,
    ...postPages,
    ...profilePages,
  ];
}
