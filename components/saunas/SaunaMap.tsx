import { ExternalLink, MapPin } from "lucide-react";

type SaunaMapProps = {
  name: string;
  prefecture?: string | null;
  city?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
};

export function SaunaMap({
  name,
  prefecture,
  city,
  address,
  latitude,
  longitude,
}: SaunaMapProps) {
  const apiKey =
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY;

  const addressText = [
    prefecture,
    city,
    address,
  ]
    .filter(Boolean)
    .join(" ");

  const hasCoordinates =
    typeof latitude === "number" &&
    typeof longitude === "number";

  const mapQuery = hasCoordinates
    ? `${latitude},${longitude}`
    : [name, addressText]
        .filter(Boolean)
        .join(" ");

  const encodedMapQuery =
    encodeURIComponent(mapQuery);

  const embedUrl = apiKey
    ? [
        "https://www.google.com/maps/embed/v1/place",
        `?key=${encodeURIComponent(apiKey)}`,
        `&q=${encodedMapQuery}`,
        "&language=ja",
        "&region=JP",
        "&zoom=16",
      ].join("")
    : null;

  const googleMapsUrl = hasCoordinates
    ? `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`
    : `https://www.google.com/maps/search/?api=1&query=${encodedMapQuery}`;

  if (!mapQuery) {
    return null;
  }

  return (
    <section className="mt-8">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p
            className="
              text-xs font-semibold
              uppercase tracking-[0.2em]
              text-[#3e3a3a]/45
            "
          >
            Location
          </p>

          <h2
            className="
              mt-2 text-xl
              font-semibold tracking-tight
              text-[#3e3a3a]
            "
          >
            アクセス
          </h2>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noreferrer"
          className="
            inline-flex items-center gap-1.5
            text-sm font-medium
            text-[#3e3a3a]/65
            transition
            hover:text-[#3e3a3a]
          "
        >
          Googleマップで開く
          <ExternalLink className="size-3.5" />
        </a>
      </div>

      <div
        className="
          overflow-hidden
          rounded-[1.75rem]
          border border-black/5
          bg-white
          shadow-sm
        "
      >
        {embedUrl ? (
          <iframe
            title={`${name}のGoogleマップ`}
            src={embedUrl}
            loading="lazy"
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className="h-90 w-full border-0 sm:h-105"
          />
        ) : (
          <div
            className="
              flex min-h-80
              flex-col items-center
              justify-center
              px-6 py-12
              text-center
            "
          >
            <span
              className="
                flex size-12
                items-center justify-center
                rounded-full
                bg-[#e6e5ef]
                text-[#3e3a3a]
              "
            >
              <MapPin className="size-5" />
            </span>

            <p
              className="
                mt-4 text-base font-medium
                text-[#3e3a3a]
              "
            >
              Googleマップを表示できません
            </p>

            <p
              className="
                mt-2 max-w-md
                text-sm leading-6
                text-[#3e3a3a]/55
              "
            >
              環境変数
              NEXT_PUBLIC_GOOGLE_MAPS_EMBED_API_KEY
              が設定されているか確認してください。
            </p>

            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noreferrer"
              className="
                mt-5 inline-flex
                items-center gap-2
                rounded-full
                bg-[#3e3a3a]
                px-5 py-2.5
                text-sm font-medium
                text-white
                transition
                hover:bg-[#3e3a3a]/85
              "
            >
              Googleマップで開く
              <ExternalLink className="size-4" />
            </a>
          </div>
        )}
      </div>

      {addressText && (
        <div
          className="
            mt-3 flex items-start gap-2
            px-1
            text-sm leading-6
            text-[#3e3a3a]/60
          "
        >
          <MapPin className="mt-0.5 size-4 shrink-0" />
          <span>{addressText}</span>
        </div>
      )}
    </section>
  );
}