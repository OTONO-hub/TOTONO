import type { Metadata } from "next";

const SITE_NAME = "TOTONO";
const SITE_DESCRIPTION =
  "サウナへ行く前から、整い始める。サウナ施設の発見、サ活の記録、ユーザー同士の交流を楽しめるサウナライフプラットフォーム。";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(
    /\/$/,
    ""
  ) ?? "http://localhost:3000";

export const siteMetadata: Metadata = {
  metadataBase: new URL(SITE_URL),

  title: {
    default:
      "TOTONO｜サウナへ行く前から、整い始める。",
    template: "%s｜TOTONO",
  },

  description: SITE_DESCRIPTION,

  applicationName: SITE_NAME,

  authors: [
    {
      name: "TOTONO",
    },
  ],

  creator: "TOTONO",
  publisher: "TOTONO",

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

  alternates: {
    canonical: "/",
  },

  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "/",
    siteName: SITE_NAME,
    title:
      "TOTONO｜サウナへ行く前から、整い始める。",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "TOTONO｜サウナへ行く前から、整い始める。",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "TOTONO｜サウナへ行く前から、整い始める。",
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
    ],
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};
