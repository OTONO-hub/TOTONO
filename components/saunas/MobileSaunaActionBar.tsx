import Link from "next/link";
import {
  Heart,
  Navigation,
  PenLine,
} from "lucide-react";

type MobileSaunaActionBarProps = {
  saunaId: string;
  name: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
};

export function MobileSaunaActionBar({
  saunaId,
  name,
  locationText,
  latitude,
  longitude,
}: MobileSaunaActionBarProps) {
  const googleMapsUrl = createGoogleMapsRouteUrl({
    name,
    locationText,
    latitude,
    longitude,
  });

  return (
    <div
      className="
        fixed
        inset-x-0
        bottom-0
        z-40
        border-t
        border-white/70
        bg-white/88
        px-3
        pb-[max(0.75rem,env(safe-area-inset-bottom))]
        pt-3
        shadow-[0_-12px_36px_rgba(62,58,58,0.12)]
        backdrop-blur-xl
        lg:hidden
      "
    >
      <nav
        aria-label={`${name}の施設アクション`}
        className="
          mx-auto
          grid
          w-full
          max-w-lg
          grid-cols-[1fr_1fr_1.45fr]
          gap-2
        "
      >
        <a
          href={googleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${name}までのルートをGoogleマップで開く`}
          className="
            inline-flex
            min-h-13
            flex-col
            items-center
            justify-center
            gap-1
            rounded-[1.1rem]
            border
            border-[#3e3a3a]/8
            bg-white
            px-2
            py-2
            text-[0.7rem]
            font-medium
            text-[#3e3a3a]/70
            shadow-sm
            transition
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#3e3a3a]
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          <Navigation
            className="size-4.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>ルート</span>
        </a>

        <a
          href="#sauna-visit-panel"
          className="
            inline-flex
            min-h-13
            flex-col
            items-center
            justify-center
            gap-1
            rounded-[1.1rem]
            border
            border-[#3e3a3a]/8
            bg-white
            px-2
            py-2
            text-[0.7rem]
            font-medium
            text-[#3e3a3a]/70
            shadow-sm
            transition
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#3e3a3a]
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          <Heart
            className="size-4.5"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>保存</span>
        </a>

        <Link
          href={`/posts/new?sauna_id=${saunaId}`}
          className="
            inline-flex
            min-h-13
            items-center
            justify-center
            gap-2
            rounded-[1.1rem]
            bg-[#3e3a3a]
            px-4
            py-3
            text-sm
            font-semibold
            text-white
            shadow-[0_10px_24px_rgba(62,58,58,0.18)]
            transition
            active:scale-[0.98]
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-[#3e3a3a]
            focus-visible:ring-offset-2
            motion-reduce:transform-none
            motion-reduce:transition-none
          "
        >
          <PenLine
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />

          <span>サ活を記録</span>
        </Link>
      </nav>
    </div>
  );
}

type CreateGoogleMapsRouteUrlOptions = {
  name: string;
  locationText: string;
  latitude: number | null;
  longitude: number | null;
};

function createGoogleMapsRouteUrl({
  name,
  locationText,
  latitude,
  longitude,
}: CreateGoogleMapsRouteUrlOptions): string {
  const hasCoordinates =
    typeof latitude === "number" &&
    Number.isFinite(latitude) &&
    typeof longitude === "number" &&
    Number.isFinite(longitude);

  const destination = hasCoordinates
    ? `${latitude},${longitude}`
    : [name.trim(), locationText.trim()]
        .filter(Boolean)
        .join(" ");

  return [
    "https://www.google.com/maps/dir/",
    `?api=1&destination=${encodeURIComponent(destination)}`,
  ].join("");
}
