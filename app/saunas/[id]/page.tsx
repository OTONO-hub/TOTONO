import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  CheckCircle2,
  Clock3,
  ExternalLink,
  Globe2,
  MapPin,
  PenLine,
  Phone,
  Star,
} from "lucide-react";
import { notFound } from "next/navigation";

import { FavoriteSaunaButton } from "@/components/saunas/FavoriteSaunaButton";
import { SaunaMap } from "@/components/saunas/SaunaMap";
import { createClient } from "@/lib/supabase/server";
import { isFavoriteSauna } from "@/services/favorite-saunas";
import { getPostsBySaunaId } from "@/services/posts";
import { getSaunaById } from "@/services/saunas";

type SaunaDetailPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SaunaDetailPage({
  params,
}: SaunaDetailPageProps) {
  const { id } = await params;

  const supabase = await createClient();

  const [
    sauna,
    posts,
    {
      data: { user },
    },
  ] = await Promise.all([
    getSaunaById(supabase, id),
    getPostsBySaunaId(supabase, id),
    supabase.auth.getUser(),
  ]);

  if (!sauna) {
    notFound();
  }

  const initialFavorite = user
    ? await isFavoriteSauna(
        supabase,
        user.id,
        sauna.id
      )
    : false;

  const locationText = [
    sauna.prefecture,
    sauna.city,
    sauna.address,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <main className="min-h-screen bg-[#e6e5ef]/45">
      <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="
            inline-flex items-center gap-2
            text-sm font-medium
            text-[#3e3a3a]/65
            transition
            hover:text-[#3e3a3a]
          "
        >
          <ArrowLeft className="size-4" />
          タイムラインへ戻る
        </Link>

        <section
          className="
            mt-6 overflow-hidden
            rounded-[2rem]
            border border-black/5
            bg-white
            shadow-sm
          "
        >
          <div className="relative aspect-16/7 w-full bg-[#3e3a3a]/8">
            {sauna.image_url ? (
              <Image
                src={sauna.image_url}
                alt={`${sauna.name}の施設画像`}
                fill
                priority
                sizes="
                  (max-width: 768px) 100vw,
                  (max-width: 1200px) 90vw,
                  1152px
                "
                className="object-cover"
              />
            ) : (
              <div
                className="
                  flex h-full items-center
                  justify-center
                  px-6 text-center
                "
              >
                <div>
                  <p
                    className="
                      text-sm font-medium
                      tracking-[0.22em]
                      text-[#3e3a3a]/35
                    "
                  >
                    TOTONO
                  </p>

                  <p
                    className="
                      mt-3 text-sm
                      text-[#3e3a3a]/50
                    "
                  >
                    施設画像はまだ登録されていません
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="p-6 sm:p-8 lg:p-10">
            <div
              className="
                flex flex-col
                justify-between gap-6
                md:flex-row md:items-start
              "
            >
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <p
                    className="
                      text-xs font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[#3e3a3a]/45
                    "
                  >
                    Sauna Facility
                  </p>

                  {sauna.is_verified && (
                    <span
                      className="
                        inline-flex items-center gap-1.5
                        rounded-full
                        bg-[#00b4b6]/10
                        px-3 py-1
                        text-xs font-medium
                        text-[#007f81]
                      "
                    >
                      <CheckCircle2 className="size-3.5" />
                      確認済み施設
                    </span>
                  )}
                </div>

                <h1
                  className="
                    mt-4 text-3xl
                    font-semibold tracking-tight
                    text-[#3e3a3a]
                    sm:text-4xl
                  "
                >
                  {sauna.name}
                </h1>

                {locationText && (
                  <div
                    className="
                      mt-4 flex items-start gap-2
                      text-sm leading-6
                      text-[#3e3a3a]/65
                    "
                  >
                    <MapPin className="mt-0.5 size-4 shrink-0" />
                    <span>{locationText}</span>
                  </div>
                )}
              </div>

              <div
                className="
                  flex shrink-0 flex-col gap-3
                  md:w-64
                "
              >
                <div
                  className="
                    rounded-2xl
                    bg-[#e6e5ef]/65
                    px-5 py-4
                    text-center
                  "
                >
                  <p
                    className="
                      text-2xl font-semibold
                      text-[#3e3a3a]
                    "
                  >
                    {posts.length}
                  </p>

                  <p
                    className="
                      mt-1 text-xs
                      text-[#3e3a3a]/55
                    "
                  >
                    サ活投稿
                  </p>
                </div>

                <FavoriteSaunaButton
                  saunaId={sauna.id}
                  userId={user?.id ?? null}
                  initialFavorite={initialFavorite}
                />

                <Link
                  href={`/posts/new?sauna_id=${sauna.id}`}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#3e3a3a]
                    px-6 py-3
                    text-sm
                    font-medium
                    text-white
                    transition
                    hover:bg-[#3e3a3a]/85
                    focus-visible:outline-none
                    focus-visible:ring-2
                    focus-visible:ring-[#3e3a3a]
                    focus-visible:ring-offset-2
                  "
                >
                  <PenLine className="size-4" />
                  この施設で投稿する
                </Link>
              </div>
            </div>

            <div
              className="
                mt-8 grid gap-4
                border-t border-black/5
                pt-8
                sm:grid-cols-2
              "
            >
              {sauna.opening_hours && (
                <FacilityInformation
                  icon={<Clock3 className="size-4" />}
                  label="営業時間"
                  value={sauna.opening_hours}
                />
              )}

              {sauna.phone_number && (
                <FacilityInformation
                  icon={<Phone className="size-4" />}
                  label="電話番号"
                  value={sauna.phone_number}
                  href={`tel:${sauna.phone_number}`}
                />
              )}

              {sauna.website_url && (
                <FacilityInformation
                  icon={<Globe2 className="size-4" />}
                  label="公式サイト"
                  value="公式サイトを見る"
                  href={sauna.website_url}
                  external
                />
              )}

              {sauna.postal_code && (
                <FacilityInformation
                  icon={<MapPin className="size-4" />}
                  label="郵便番号"
                  value={`〒${sauna.postal_code}`}
                />
              )}
            </div>
          </div>
        </section>

        <SaunaMap
          name={sauna.name}
          prefecture={sauna.prefecture}
          city={sauna.city}
          address={sauna.address}
          latitude={sauna.latitude}
          longitude={sauna.longitude}
        />

        <section className="mt-12">
          <div
            className="
              flex items-end
              justify-between gap-4
            "
          >
            <div>
              <p
                className="
                  text-xs font-semibold
                  uppercase
                  tracking-[0.2em]
                  text-[#3e3a3a]/45
                "
              >
                Community
              </p>

              <h2
                className="
                  mt-2 text-2xl
                  font-semibold tracking-tight
                  text-[#3e3a3a]
                "
              >
                この施設のサ活
              </h2>
            </div>

            <span
              className="
                text-sm
                text-[#3e3a3a]/55
              "
            >
              {posts.length}件
            </span>
          </div>

          {posts.length > 0 ? (
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {posts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="
                    group overflow-hidden
                    rounded-[1.75rem]
                    border border-black/5
                    bg-white
                    shadow-sm
                    transition
                    duration-300
                    hover:-translate-y-1
                    hover:shadow-lg
                  "
                >
                  {post.image_url && (
                    <div
                      className="
                        relative aspect-16/10
                        w-full overflow-hidden
                        bg-[#3e3a3a]/5
                      "
                    >
                      <Image
                        src={post.image_url}
                        alt={`${post.sauna_name}の投稿画像`}
                        fill
                        sizes="
                          (max-width: 768px) 100vw,
                          50vw
                        "
                        className="
                          object-cover
                          transition duration-500
                          group-hover:scale-[1.03]
                        "
                      />
                    </div>
                  )}

                  <div className="p-6">
                    <div
                      className="
                        flex flex-wrap
                        items-center gap-3
                        text-xs
                        text-[#3e3a3a]/55
                      "
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <CalendarDays className="size-3.5" />
                        {formatVisitDate(post.visit_date)}
                      </span>

                      <span className="inline-flex items-center gap-1.5">
                        <Star className="size-3.5" />
                        {post.rating} / 5
                      </span>
                    </div>

                    <h3
                      className="
                        mt-4 text-lg
                        font-semibold
                        text-[#3e3a3a]
                      "
                    >
                      {post.sauna_name}
                    </h3>

                    {post.comment && (
                      <p
                        className="
                          mt-3 line-clamp-3
                          text-sm leading-7
                          text-[#3e3a3a]/65
                        "
                      >
                        {post.comment}
                      </p>
                    )}

                    <div
                      className="
                        mt-5 inline-flex
                        items-center gap-1.5
                        text-sm font-medium
                        text-[#3e3a3a]
                      "
                    >
                      投稿を見る
                      <ExternalLink className="size-3.5" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div
              className="
                mt-6 rounded-[1.75rem]
                border border-dashed
                border-[#3e3a3a]/15
                bg-white/60
                px-6 py-14
                text-center
              "
            >
              <p
                className="
                  text-base font-medium
                  text-[#3e3a3a]
                "
              >
                この施設の投稿はまだありません
              </p>

              <p
                className="
                  mt-2 text-sm
                  text-[#3e3a3a]/55
                "
              >
                最初のサ活をTOTONOに残してみましょう。
              </p>

              <Link
                href={`/posts/new?sauna_id=${sauna.id}`}
                className="
                  mt-6 inline-flex
                  items-center justify-center
                  gap-2
                  rounded-full
                  bg-[#3e3a3a]
                  px-6 py-3
                  text-sm font-medium
                  text-white
                  transition
                  hover:bg-[#3e3a3a]/85
                  focus-visible:outline-none
                  focus-visible:ring-2
                  focus-visible:ring-[#3e3a3a]
                  focus-visible:ring-offset-2
                "
              >
                <PenLine className="size-4" />
                この施設で投稿する
              </Link>
            </div>
          )}
        </section>
      </div>
    </main>
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
          flex size-9 shrink-0
          items-center justify-center
          rounded-full
          bg-[#e6e5ef]
          text-[#3e3a3a]
        "
      >
        {icon}
      </span>

      <span>
        <span
          className="
            block text-xs
            text-[#3e3a3a]/45
          "
        >
          {label}
        </span>

        <span
          className="
            mt-1 block text-sm
            font-medium
            text-[#3e3a3a]
          "
        >
          {value}
        </span>
      </span>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className="
          flex items-center gap-3
          rounded-2xl
          border border-black/5
          bg-[#e6e5ef]/35
          p-4
          transition
          hover:bg-[#e6e5ef]/65
        "
      >
        {content}
      </a>
    );
  }

  return (
    <div
      className="
        flex items-center gap-3
        rounded-2xl
        border border-black/5
        bg-[#e6e5ef]/35
        p-4
      "
    >
      {content}
    </div>
  );
}

function formatVisitDate(visitDate: string) {
  const date = new Date(`${visitDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return visitDate;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(date);
}