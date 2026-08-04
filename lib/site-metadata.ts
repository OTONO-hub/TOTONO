import type { Metadata } from "next";

const SITE_NAME = "TOTONO";

const DEFAULT_TITLE =
  "TOTONO｜サウナへ行く前から、整い始める。";

const SITE_DESCRIPTION =
  "サウナへ行く前から、整い始める。サウナ施設の発見、サ活の記録、ユーザー同士の交流を楽しめるサウナライフプラットフォーム。";

function normalizeSiteUrl(url: string): string {
  return url
    .trim()
    .replace(/\/+$/, "");
}

function getSiteUrl(): string {
  const configuredSiteUrl =
    process.env.NEXT_PUBLIC_SITE_URL;

  if (configuredSiteUrl) {
    return normalizeSiteUrl(configuredSiteUrl);
  }

  const vercelProductionUrl =
    process.env.VERCEL_PROJECT_PRODUCTION_URL;

  if (vercelProductionUrl) {
    return normalizeSiteUrl(
      `https://${vercelProductionUrl}`
    );
  }

  const vercelUrl =
    process.env.VERCEL_URL;

  if (vercelUrl) {
    return normalizeSiteUrl(
      `https://${vercelUrl}`
    );
  }

  return "http://localhost:3000";
}

export const SITE_URL = getSiteUrl();

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default: DEFAULT_TITLE,
    template: "%s｜TOTONO",
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  authors: [
    {
      name: SITE_NAME,
    },
  ],

  creator: SITE_NAME,
  publisher: SITE_NAME,

  keywords: [
    "TOTONO",
    "サウナ",
    "サ活",
    "サウナ施設",
    "サウナ検索",
    "サウナ記録",
    "サウナSNS",
    "ととのう",
    "温浴施設",
    "水風呂",
    "外気浴",
  ],

  category: "lifestyle",

  openGraph: {
    type: "website",
    locale: "ja_JP",
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: DEFAULT_TITLE,
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  icons: {
    icon: [
      {
        url: "/favicon.ico",
      },
      {
        url: "/favicon-32x32.png",
        sizes: "32x32",
        type: "image/png",
      },
      {
        url: "/favicon-16x16.png",
        sizes: "16x16",
        type: "image/png",
      },
    ],
    shortcut: "/favicon.ico",
    apple: [
      {
        url: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png",
      },
    ],
  },

  manifest: "/manifest.webmanifest",

  appleWebApp: {
    capable: true,
    title: SITE_NAME,
    statusBarStyle: "default",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
