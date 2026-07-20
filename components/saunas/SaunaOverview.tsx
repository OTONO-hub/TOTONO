import type { ReactNode } from "react";
import Link from "next/link";
import {
  BookOpen,
  Clock3,
  ExternalLink,
  Globe2,
  Heart,
  MapPin,
  PenLine,
  Phone,
  Star,
} from "lucide-react";

import { FavoriteSaunaButton } from "@/components/saunas/FavoriteSaunaButton";

type SaunaOverviewProps = {
  saunaId: string;
  userId: string | null;
  initialFavorite: boolean;
  averageRating: number | null;
  ratingCount: number;
  postCount: number;
  favoriteCount: number;
  openingHours: string | null;
  phoneNumber: string | null;
  websiteUrl: string | null;
  postalCode: string | null;
};

export function SaunaOverview({
  saunaId,
  userId,
  initialFavorite,
  averageRating,
  ratingCount,
  postCount,
  favoriteCount,
  openingHours,
  phoneNumber,
  websiteUrl,
  postalCode,
}: SaunaOverviewProps) {
  const hasFacilityInformation =
    Boolean(openingHours) ||
    Boolean(phoneNumber) ||
    Boolean(websiteUrl) ||
    Boolean(postalCode);

  return (
    <div className="p-6 sm:p-8 lg:p-10">
      <section aria-labelledby="sauna-metrics-title">
        <div className="mb-5">
          <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3e3a3a]/40">
            Community Insights
          </p>

          <h2
            id="sauna-metrics-title"
            className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#3e3a3a] sm:text-2xl"
          >
            施設のサ活データ
          </h2>

          <p className="mt-2 text-sm leading-6 text-[#3e3a3a]/55">
            TOTONOに投稿された評価やサ活をもとにした情報です。
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3 sm:gap-4">
          <MetricCard
            icon={
              <Star
                className="size-5 fill-[#fdd000] text-[#fdd000]"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            value={
              averageRating !== null
                ? averageRating.toFixed(1)
                : "—"
            }
            label={
              ratingCount > 0
                ? `${ratingCount}件の評価`
                : "まだ評価がありません"
            }
          />

          <MetricCard
            icon={
              <BookOpen
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            value={postCount.toString()}
            label="サ活投稿"
          />

          <MetricCard
            icon={
              <Heart
                className="size-5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            }
            value={favoriteCount.toString()}
            label="お気に入り"
          />
        </div>
      </section>

      <div className="mt-8 border-t border-black/5 pt-8 sm:mt-10 sm:pt-10">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_17rem] lg:items-start">
          <section aria-labelledby="facility-information-title">
            <div className="mb-5">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3e3a3a]/40">
                Information
              </p>

              <h2
                id="facility-information-title"
                className="mt-2 text-xl font-semibold tracking-[-0.03em] text-[#3e3a3a]"
              >
                施設情報
              </h2>
            </div>

            {hasFacilityInformation ? (
              <div className="grid gap-3 sm:grid-cols-2">
                {openingHours && (
                  <FacilityInformation
                    icon={
                      <Clock3
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    }
                    label="営業時間"
                    value={openingHours}
                  />
                )}

                {phoneNumber && (
                  <FacilityInformation
                    icon={
                      <Phone
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    }
                    label="電話番号"
                    value={phoneNumber}
                    href={`tel:${phoneNumber}`}
                  />
                )}

                {websiteUrl && (
                  <FacilityInformation
                    icon={
                      <Globe2
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    }
                    label="公式サイト"
                    value="公式サイトを見る"
                    href={websiteUrl}
                    external
                  />
                )}

                {postalCode && (
                  <FacilityInformation
                    icon={
                      <MapPin
                        className="size-4"
                        strokeWidth={1.8}
                        aria-hidden="true"
                      />
                    }
                    label="郵便番号"
                    value={`〒${postalCode}`}
                  />
                )}
              </div>
            ) : (
              <div className="rounded-[1.5rem] border border-dashed border-[#3e3a3a]/15 bg-[#e6e5ef]/25 px-5 py-8 text-center">
                <p className="text-sm leading-6 text-[#3e3a3a]/50">
                  施設情報はまだ登録されていません。
                </p>
              </div>
            )}
          </section>

          <aside
            aria-labelledby="sauna-actions-title"
            className="rounded-[1.75rem] border border-black/5 bg-[#e6e5ef]/35 p-5 sm:p-6"
          >
            <p className="text-xs font-semibold uppercase tracking-[0.22em] text-[#3e3a3a]/40">
              Your Sauna Life
            </p>

            <h2
              id="sauna-actions-title"
              className="mt-2 text-lg font-semibold tracking-[-0.03em] text-[#3e3a3a]"
            >
              この施設を楽しむ
            </h2>

            <p className="mt-2 text-sm leading-6 text-[#3e3a3a]/55">
              気になる施設として保存したり、訪問後のサ活を記録できます。
            </p>

            <div className="mt-5 flex flex-col gap-3">
              <FavoriteSaunaButton
                saunaId={saunaId}
                userId={userId}
                initialFavorite={initialFavorite}
              />

              <Link
                href={`/posts/new?sauna_id=${saunaId}`}
                className="
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
                  shadow-sm
                  transition
                  hover:-translate-y-0.5
                  hover:bg-[#3e3a3a]/88
                  hover:shadow-md
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3e3a3a]
                  focus-visible:ring-offset-2
                  active:translate-y-0
                "
              >
                <PenLine
                  className="size-4"
                  strokeWidth={1.8}
                  aria-hidden="true"
                />
                この施設で投稿する
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

type MetricCardProps = {
  icon: ReactNode;
  value: string;
  label: string;
};

function MetricCard({
  icon,
  value,
  label,
}: MetricCardProps) {
  return (
    <div
      className="
        flex
        min-w-0
        items-center
        gap-4
        rounded-[1.5rem]
        border
        border-black/5
        bg-[#e6e5ef]/40
        p-5
        transition
        hover:-translate-y-0.5
        hover:bg-[#e6e5ef]/65
        hover:shadow-sm
      "
    >
      <span
        className="
          flex
          size-11
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#3e3a3a]
          shadow-sm
        "
      >
        {icon}
      </span>

      <span className="min-w-0">
        <span className="block text-xl font-semibold tracking-tight text-[#3e3a3a]">
          {value}
        </span>

        <span className="mt-0.5 block text-xs leading-5 text-[#3e3a3a]/50">
          {label}
        </span>
      </span>
    </div>
  );
}

type FacilityInformationProps = {
  icon: ReactNode;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
};

function FacilityInformation({
  icon,
  label,
  value,
  href,
  external = false,
}: FacilityInformationProps) {
  const content = (
    <>
      <span
        className="
          flex
          size-10
          shrink-0
          items-center
          justify-center
          rounded-full
          bg-white
          text-[#3e3a3a]
          shadow-sm
        "
      >
        {icon}
      </span>

      <span className="min-w-0 flex-1">
        <span className="block text-xs text-[#3e3a3a]/45">
          {label}
        </span>

        <span className="mt-1 block break-words text-sm font-medium leading-6 text-[#3e3a3a]">
          {value}
        </span>
      </span>

      {external && (
        <ExternalLink
          className="size-3.5 shrink-0 text-[#3e3a3a]/35"
          strokeWidth={1.8}
          aria-hidden="true"
        />
      )}
    </>
  );

  const className = `
    flex
    min-h-20
    items-center
    gap-3
    rounded-[1.25rem]
    border
    border-black/5
    bg-[#e6e5ef]/30
    p-4
  `;

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noopener noreferrer" : undefined}
        className={`
          ${className}
          transition
          hover:-translate-y-0.5
          hover:bg-[#e6e5ef]/60
          hover:shadow-sm
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#3e3a3a]
          focus-visible:ring-offset-2
        `}
      >
        {content}
      </a>
    );
  }

  return <div className={className}>{content}</div>;
}
