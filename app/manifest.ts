import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "TOTONO",
    short_name: "TOTONO",
    description:
      "サウナへ行く前から、整い始める。サウナ施設の発見、サ活の記録、ユーザー同士の交流を楽しめるサウナライフプラットフォーム。",
    start_url: "/",
    display: "standalone",
    background_color: "#e6e5ef",
    theme_color: "#3e3a3a",
    orientation: "portrait-primary",
    scope: "/",
    lang: "ja",
    categories: [
      "lifestyle",
      "social",
      "travel",
    ],
    icons: [
      {
        src: "/icons/icon-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-maskable-192x192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "/icons/icon-maskable-512x512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
