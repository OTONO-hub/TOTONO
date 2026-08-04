import { JsonLd } from "@/components/seo/json-ld";
import { SITE_URL } from "@/lib/site-metadata";

const SITE_NAME = "TOTONO";

const SITE_DESCRIPTION =
  "サウナへ行く前から、整い始める。サウナ施設の発見、サ活の記録、ユーザー同士の交流を楽しめるサウナライフプラットフォーム。";

export function SiteJsonLd() {
  const organizationId =
    `${SITE_URL}/#organization`;

  const websiteId =
    `${SITE_URL}/#website`;

  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Organization",
          "@id": organizationId,
          name: SITE_NAME,
          alternateName: "トトノ",
          url: SITE_URL,
          logo: {
            "@type": "ImageObject",
            url: `${SITE_URL}/icons/icon-512x512.png`,
            width: 512,
            height: 512,
          },
          description: SITE_DESCRIPTION,
        }}
      />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          "@id": websiteId,
          url: SITE_URL,
          name: SITE_NAME,
          alternateName: "トトノ",
          description: SITE_DESCRIPTION,
          publisher: {
            "@id": organizationId,
          },
          inLanguage: "ja-JP",
        }}
      />
    </>
  );
}
