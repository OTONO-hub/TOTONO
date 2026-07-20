import {
  ExternalLink,
  Map,
  MapPin,
  Navigation,
} from "lucide-react";

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
    .filter(
      (value): value is string =>
        typeof value === "string" &&
        value.trim().length > 0
    )
    .map((value) => value.trim())
    .join(" ");

  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const mapQuery = hasCoordinates
    ? `${latitude},${longitude}`
    : [name.trim(), addressText]
        .filter(Boolean)
        .join(" ");

  if (!mapQuery) {
    return null;
  }

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

  const googleMapsUrl = [
    "https://www.google.com/maps/search/",
    `?api=1&query=${encodedMapQuery}`,
  ].join("");

  const destinationLabel =
    addressText || `${name}の所在地`;

  return (
    <section
      aria-labelledby="sauna-map-heading"
      className="
        mt-10
        overflow-hidden
        rounded-[2rem]
        border
        border-white/70
        bg-white/85
        p-6
        shadow-[0_18px_60px_rgba(62,58,58,0.07)]
        backdrop-blur-xl
        sm:p-8
        lg:p-10
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-[#3e3a3a]/8
          pb-6
          sm:flex-row
          sm:items-end
          sm:justify-between
        "
      >
        <div className="min-w-0">
          <p
            className="
              text-xs
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#3e3a3a]/45
            "
          >
            Location
          </p>

          <h2
            id="sauna-map-heading"
            className="
              mt-2
              text-2xl
              font-semibold
              tracking-[-0.035em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            アクセス
          </h2>

          <p
            className="
              mt-3
              max-w-xl
              text-sm
              leading-7
              text-[#3e3a3a]/60
            "
          >
            施設の所在地と周辺地図を確認できます。
          </p>
        </div>

        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}をGoogleマップで開く（新しいタブで開きます）`}
          className="
            inline-flex
            min-h-11
            w-fit
            shrink-0
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-[#3e3a3a]/10
            bg-white/75
            px-4
            py-2.5
            text-sm
            font-medium
            text-[#3e3a3a]/70
            shadow-sm
            backdrop-blur-md
            transition-all
            duration-200
            hover:-translate-y-0.5
            hover:border-[#3e3a3a]/18
            hover:bg-white
            hover:text-[#3e3a3a]
            hover:shadow-md
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#3e3a3a]
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          <Navigation
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>Googleマップで開く</span>

          <ExternalLink
            className="size-3.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </a>
      </div>

      <div
        className="
          relative
          mt-8
          overflow-hidden
          rounded-[1.75rem]
          border
          border-[#3e3a3a]/8
          bg-[#e6e5ef]/40
          shadow-[0_16px_40px_rgba(62,58,58,0.08)]
        "
      >
        {embedUrl ? (
          <>
            <iframe
              title={`${name}の所在地を示すGoogleマップ`}
              src={embedUrl}
              loading="lazy"
              allowFullScreen
              referrerPolicy="strict-origin-when-cross-origin"
              className="
                h-80
                w-full
                border-0
                bg-[#e6e5ef]/40
                sm:h-96
                lg:h-[28rem]
              "
            />

            <div
              className="
                pointer-events-none
                absolute
                inset-x-0
                bottom-0
                h-24
                bg-linear-to-t
                from-[#3e3a3a]/18
                to-transparent
              "
              aria-hidden="true"
            />
          </>
        ) : (
          <MapUnavailableState
            name={name}
            googleMapsUrl={googleMapsUrl}
          />
        )}

        {addressText && (
          <div
            className="
              absolute
              inset-x-4
              bottom-4
              z-10
              sm:inset-x-auto
              sm:left-5
              sm:max-w-md
            "
          >
            <div
              className="
                flex
                items-start
                gap-3
                rounded-[1.25rem]
                border
                border-white/70
                bg-white/88
                px-4
                py-3.5
                shadow-[0_12px_30px_rgba(62,58,58,0.14)]
                backdrop-blur-xl
              "
            >
              <span
                className="
                  flex
                  size-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-full
                  bg-[#e6e5ef]/80
                  text-[#3e3a3a]
                "
                aria-hidden="true"
              >
                <MapPin
                  className="size-4"
                  strokeWidth={1.8}
                />
              </span>

              <div className="min-w-0">
                <p
                  className="
                    text-xs
                    font-medium
                    text-[#3e3a3a]/45
                  "
                >
                  Address
                </p>

                <address
                  className="
                    mt-1
                    wrap-break-words
                    text-sm
                    not-italic
                    leading-6
                    text-[#3e3a3a]
                  "
                >
                  {addressText}
                </address>
              </div>
            </div>
          </div>
        )}
      </div>

      {!addressText && (
        <div
          className="
            mt-4
            flex
            items-start
            gap-2.5
            rounded-[1.25rem]
            bg-[#e6e5ef]/35
            px-4
            py-3.5
            text-sm
            leading-6
            text-[#3e3a3a]/60
          "
        >
          <MapPin
            className="
              mt-0.5
              size-4
              shrink-0
            "
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span className="wrap-break-words">
            {destinationLabel}
          </span>
        </div>
      )}

      <p
        className="
          mt-5
          text-xs
          leading-6
          text-[#3e3a3a]/45
        "
      >
        ※ 営業時間や交通状況は変更される場合があります。
        訪問前に施設の公式情報もご確認ください。
      </p>
    </section>
  );
}

type MapUnavailableStateProps = {
  name: string;
  googleMapsUrl: string;
};

function MapUnavailableState({
  name,
  googleMapsUrl,
}: MapUnavailableStateProps) {
  return (
    <div
      className="
        relative
        flex
        min-h-80
        flex-col
        items-center
        justify-center
        overflow-hidden
        px-6
        py-12
        text-center
        sm:min-h-96
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-16
          -top-16
          size-52
          rounded-full
          bg-[#9fd9f6]/25
          blur-3xl
        "
        aria-hidden="true"
      />

      <div
        className="
          pointer-events-none
          absolute
          -bottom-20
          -left-16
          size-52
          rounded-full
          bg-[#fdd000]/12
          blur-3xl
        "
        aria-hidden="true"
      />

      <span
        className="
          relative
          z-10
          flex
          size-16
          items-center
          justify-center
          rounded-full
          border
          border-white/75
          bg-white/80
          text-[#3e3a3a]/55
          shadow-sm
          backdrop-blur-md
        "
        aria-hidden="true"
      >
        <Map
          className="size-6"
          strokeWidth={1.7}
        />
      </span>

      <p
        className="
          relative
          z-10
          mt-5
          text-lg
          font-semibold
          tracking-[-0.02em]
          text-[#3e3a3a]
        "
      >
        地図を表示できません
      </p>

      <p
        className="
          relative
          z-10
          mx-auto
          mt-2
          max-w-md
          text-sm
          leading-7
          text-[#3e3a3a]/55
        "
      >
        現在、ページ内で地図を読み込めません。
        Googleマップでは施設の所在地を確認できます。
      </p>

      <a
        href={googleMapsUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${name}をGoogleマップで確認する（新しいタブで開きます）`}
        className="
          relative
          z-10
          mt-7
          inline-flex
          min-h-12
          items-center
          justify-center
          gap-2
          rounded-full
          bg-[#3e3a3a]
          px-6
          py-3
          text-sm
          font-medium
          text-white
          shadow-[0_10px_24px_rgba(62,58,58,0.16)]
          transition-all
          duration-200
          hover:-translate-y-0.5
          hover:bg-[#3e3a3a]/88
          hover:shadow-[0_14px_30px_rgba(62,58,58,0.2)]
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
          motion-reduce:transform-none
          motion-reduce:transition-none
        "
      >
        <Navigation
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />

        Googleマップで確認する

        <ExternalLink
          className="size-4"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      </a>
    </div>
  );
}
