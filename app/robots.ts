import type { MetadataRoute } from "next";

import { SITE_URL } from "@/lib/site-metadata";

const isProduction =
  process.env.NODE_ENV === "production";

export default function robots(): MetadataRoute.Robots {
  if (!isProduction) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    };
  }

  return {
    rules: [
      {
        userAgent: "*",

        allow: [
          "/",
          "/search",
          "/community",
          "/journal",
          "/saunas/",
          "/posts/",
        ],

        disallow: [
  "/api/",
  "/login",
  "/register",
  "/profile",
  "/profile/edit",
  "/bookmarks",
  "/notifications",
  "/today",
  "/today-preview",
  "/account-deleted",
],
      },
    ],

    sitemap: `${SITE_URL}/sitemap.xml`,

    host: SITE_URL,
  };
}
