import { JsonLd } from "@/components/seo/json-ld";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ??
  "http://localhost:3000";

export function SiteJsonLd() {
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": `${SITE_URL}/#organization`,
          name: "TOTONO",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icons/icon-512x512.png`,
            width: 512,
            height: 512,
          },
          description:
            "サウナの記録を残し、自分だけのお気に入りサウナを見つけるサウナライフプラットフォーム",
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": `${SITE_URL}/#website`,
          url: SITE_URL,
          name: "TOTONO",
          alternateName: "トトノ",
          description:
            "サウナへ行く前から、整い始める。サウナの記録と施設探しを楽しめるサウナライフプラットフォーム",
          publisher: {
            "@id": `${SITE_URL}/#organization`,
          },
          inLanguage: "ja-JP",
          potentialAction: {
            "@type": "SearchAction",
            target: {
              "@type": "EntryPoint",
              urlTemplate: `${SITE_URL}/search?q={search_term_string}`,
            },
            "query-input": "required name=search_term_string",
          },
        }}
      />
    </>
  );
}
