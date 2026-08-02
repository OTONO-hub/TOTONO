import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Compass,
  Heart,
  ImageIcon,
  MapPin,
  MessageCircle,
  Sparkles,
  Star,
} from "lucide-react";

import type { PopularSauna } from "@/services/saunas";

export type RecommendedForYouPost = {
  sauna_id?: string | null;
  sauna_name?: string | null;
};

type RecommendedForYouProps = {
  saunas: PopularSauna[];
  myPosts: RecommendedForYouPost[];
};

type RecommendedSauna = PopularSauna & {
  recommendationReasons: string[];
};

const MAX_RECOMMENDATIONS = 3;

export function RecommendedForYou({
  saunas,
  myPosts,
}: RecommendedForYouProps) {
  const recommendedSaunas =
    createRecommendedSaunas(
      saunas,
      myPosts
    );

  if (recommendedSaunas.length === 0) {
    return (
      <RecommendedForYouEmptyState />
    );
  }

  return (
    <section
      aria-labelledby="recommended-for-you-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        shadow-sm
        backdrop-blur-md
      "
    >
      <div
        className="
          flex
          flex-col
          gap-5
          border-b
          border-border/50
          px-5
          py-6
          sm:flex-row
          sm:items-end
          sm:justify-between
          sm:px-8
          sm:py-7
        "
      >
        <div>
          <div
            className="
              flex
              items-center
              gap-3
            "
          >
            <span
              className="
                flex
                size-10
                items-center
                justify-center
                rounded-full
                bg-secondary/20
                text-foreground
              "
            >
              <Sparkles
                className="size-4.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>

            <p
              className="
                text-xs
                font-semibold
                uppercase
                tracking-[0.24em]
                text-muted-foreground
              "
            >
              Discover For You
            </p>
          </div>

          <h2
            id="recommended-for-you-heading"
            className="
              mt-5
              text-2xl
              font-semibold
              tracking-[-0.04em]
              text-foreground
              sm:text-3xl
            "
          >
            今日はこんなサウナはいかがですか？
          </h2>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-7
              text-muted-foreground
            "
          >
            まだ訪れていない施設から、
            TOTONOで評価や注目度の高いサウナを選びました。
          </p>
        </div>

        <Link
          href="/search"
          className="
            inline-flex
            min-h-11
            w-full
            items-center
            justify-center
            gap-2
            rounded-full
            border
            border-border/65
            bg-background/70
            px-5
            text-sm
            font-semibold
            text-foreground
            transition
            duration-200
            hover:-translate-y-0.5
            hover:bg-background
            hover:shadow-sm
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-card
            active:translate-y-0
            sm:w-auto
          "
        >
          施設をもっと探す

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>

      <div
        className="
          grid
          gap-4
          p-5
          sm:p-8
          lg:grid-cols-3
        "
      >
        {recommendedSaunas.map(
          (sauna) => (
            <RecommendedSaunaCard
              key={sauna.id}
              sauna={sauna}
            />
          )
        )}
      </div>

      <div
        className="
          border-t
          border-border/50
          px-5
          py-4
          sm:px-8
        "
      >
        <p
          className="
            text-xs
            leading-6
            text-muted-foreground
          "
        >
          おすすめは、TOTONO内の評価・投稿・
          お気に入り状況と、あなたのサ活記録をもとに表示しています。
        </p>
      </div>
    </section>
  );
}

type RecommendedSaunaCardProps = {
  sauna: RecommendedSauna;
};

function RecommendedSaunaCard({
  sauna,
}: RecommendedSaunaCardProps) {
  const locationText =
    createLocationText(sauna);

  const ratingText =
    sauna.average_rating === null
      ? "評価なし"
      : sauna.average_rating.toFixed(1);

  const ratingAriaLabel =
    sauna.average_rating === null
      ? "まだ評価がありません"
      : `平均評価${sauna.average_rating.toFixed(
          1
        )}、評価${sauna.rating_count}件`;

  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[1.6rem]
        border
        border-border/55
        bg-background/70
        shadow-sm
        transition
        duration-300
        hover:-translate-y-1
        hover:bg-background
        hover:shadow-md
      "
    >
      <Link
        href={`/saunas/${sauna.id}`}
        aria-label={`${sauna.name}の施設詳細を見る。${ratingAriaLabel}`}
        className="
          block
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-ring
          focus-visible:ring-inset
        "
      >
        <div
          className="
            relative
            aspect-[16/10]
            overflow-hidden
            bg-muted
          "
        >
          {sauna.image_url ? (
            <Image
              src={sauna.image_url}
              alt={`${sauna.name}の施設画像`}
              fill
              sizes="
                (max-width: 1024px) 100vw,
                33vw
              "
              className="
                object-cover
                transition
                duration-500
                group-hover:scale-[1.04]
              "
            />
          ) : (
            <div
              className="
                flex
                size-full
                items-center
                justify-center
                bg-muted
                text-muted-foreground
              "
            >
              <ImageIcon
                className="size-8"
                strokeWidth={1.5}
                aria-hidden="true"
              />
            </div>
          )}

          <div
            aria-hidden="true"
            className="
              absolute
              inset-0
              bg-gradient-to-t
              from-black/45
              via-black/5
              to-transparent
            "
          />

          <div
            className="
              absolute
              left-4
              top-4
              flex
              flex-wrap
              gap-2
            "
          >
            {sauna.recommendationReasons.map(
              (reason) => (
                <span
                  key={reason}
                  className="
                    rounded-full
                    border
                    border-white/45
                    bg-white/88
                    px-3
                    py-1.5
                    text-[0.68rem]
                    font-semibold
                    text-[#3e3a3a]
                    shadow-sm
                    backdrop-blur-md
                  "
                >
                  {reason}
                </span>
              )
            )}
          </div>

          <div
            className="
              absolute
              bottom-4
              left-4
              right-4
              flex
              items-end
              justify-between
              gap-3
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
                rounded-full
                bg-black/55
                px-3
                py-1.5
                text-xs
                font-semibold
                text-white
                backdrop-blur-md
              "
            >
              <Star
                className="
                  size-3.5
                  fill-current
                "
                strokeWidth={1.7}
                aria-hidden="true"
              />

              {ratingText}
            </span>

            <span
              className="
                flex
                size-9
                items-center
                justify-center
                rounded-full
                bg-white/90
                text-[#3e3a3a]
                shadow-sm
                transition
                duration-200
                group-hover:translate-x-0.5
              "
            >
              <ArrowRight
                className="size-4"
                strokeWidth={1.8}
                aria-hidden="true"
              />
            </span>
          </div>
        </div>

        <div
          className="
            px-5
            py-5
          "
        >
          <h3
            className="
              line-clamp-2
              text-lg
              font-semibold
              tracking-[-0.025em]
              text-foreground
            "
          >
            {sauna.name}
          </h3>

          <div
            className="
              mt-2
              flex
              items-start
              gap-1.5
              text-sm
              text-muted-foreground
            "
          >
            <MapPin
              className="
                mt-0.5
                size-4
                shrink-0
              "
              strokeWidth={1.7}
              aria-hidden="true"
            />

            <span className="line-clamp-1">
              {locationText}
            </span>
          </div>

          <div
            className="
              mt-5
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              border-t
              border-border/50
              pt-4
              text-xs
              font-medium
              text-muted-foreground
            "
          >
            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <MessageCircle
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              サ活 {sauna.post_count}件
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
              "
            >
              <Heart
                className="size-3.5"
                strokeWidth={1.8}
                aria-hidden="true"
              />

              保存 {sauna.favorite_count}件
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

function RecommendedForYouEmptyState() {
  return (
    <section
      aria-labelledby="recommended-for-you-empty-heading"
      className="
        overflow-hidden
        rounded-[2rem]
        border
        border-border/55
        bg-card/90
        px-5
        py-8
        shadow-sm
        backdrop-blur-md
        sm:px-8
        sm:py-10
      "
    >
      <div
        className="
          flex
          max-w-2xl
          flex-col
          items-start
        "
      >
        <span
          className="
            flex
            size-11
            items-center
            justify-center
            rounded-full
            bg-secondary/20
            text-foreground
          "
        >
          <Compass
            className="size-5"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </span>

        <p
          className="
            mt-5
            text-xs
            font-semibold
            uppercase
            tracking-[0.24em]
            text-muted-foreground
          "
        >
          Discover For You
        </p>

        <h2
          id="recommended-for-you-empty-heading"
          className="
            mt-3
            text-2xl
            font-semibold
            tracking-[-0.04em]
            text-foreground
            sm:text-3xl
          "
        >
          次のサウナを見つけましょう
        </h2>

        <p
          className="
            mt-3
            text-sm
            leading-7
            text-muted-foreground
          "
        >
          現在おすすめできる未訪問施設がありません。
          検索画面から、まだ知らないサウナを探してみましょう。
        </p>

        <Link
          href="/search"
          className="
            mt-6
            inline-flex
            min-h-11
            items-center
            justify-center
            gap-2
            rounded-full
            bg-primary
            px-5
            text-sm
            font-semibold
            text-primary-foreground
            shadow-sm
            transition
            duration-200
            hover:-translate-y-0.5
            hover:shadow-md
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-card
            active:translate-y-0
          "
        >
          サウナを探す

          <ArrowRight
            className="size-4"
            strokeWidth={1.8}
            aria-hidden="true"
          />
        </Link>
      </div>
    </section>
  );
}

function createRecommendedSaunas(
  saunas: PopularSauna[],
  myPosts: RecommendedForYouPost[]
): RecommendedSauna[] {
  if (saunas.length === 0) {
    return [];
  }

  const visitedSaunaIds =
    createVisitedSaunaIds(myPosts);

  const visitedSaunaNames =
    createVisitedSaunaNames(myPosts);

  const unvisitedSaunas =
    saunas.filter((sauna) => {
      if (
        visitedSaunaIds.has(sauna.id)
      ) {
        return false;
      }

      const normalizedSaunaName =
        normalizeSaunaName(sauna.name);

      return !visitedSaunaNames.has(
        normalizedSaunaName
      );
    });

  const recommendationCandidates =
    unvisitedSaunas.length > 0
      ? unvisitedSaunas
      : saunas;

  return recommendationCandidates
    .map((sauna) => ({
      ...sauna,
      recommendationReasons:
        createRecommendationReasons(
          sauna,
          unvisitedSaunas.length > 0
        ),
    }))
    .sort(compareRecommendedSaunas)
    .slice(0, MAX_RECOMMENDATIONS);
}

function createVisitedSaunaIds(
  posts: RecommendedForYouPost[]
): Set<string> {
  return new Set(
    posts
      .map((post) =>
        post.sauna_id?.trim()
      )
      .filter(
        (
          saunaId
        ): saunaId is string =>
          Boolean(saunaId)
      )
  );
}

function createVisitedSaunaNames(
  posts: RecommendedForYouPost[]
): Set<string> {
  return new Set(
    posts
      .map((post) =>
        normalizeSaunaName(
          post.sauna_name ?? ""
        )
      )
      .filter(Boolean)
  );
}

function compareRecommendedSaunas(
  saunaA: RecommendedSauna,
  saunaB: RecommendedSauna
): number {
  const ratingDifference =
    normalizeRating(
      saunaB.average_rating
    ) -
    normalizeRating(
      saunaA.average_rating
    );

  if (ratingDifference !== 0) {
    return ratingDifference;
  }

  const ratingCountDifference =
    saunaB.rating_count -
    saunaA.rating_count;

  if (
    ratingCountDifference !== 0
  ) {
    return ratingCountDifference;
  }

  const postCountDifference =
    saunaB.post_count -
    saunaA.post_count;

  if (postCountDifference !== 0) {
    return postCountDifference;
  }

  const favoriteCountDifference =
    saunaB.favorite_count -
    saunaA.favorite_count;

  if (
    favoriteCountDifference !== 0
  ) {
    return favoriteCountDifference;
  }

  return createStableScore(
    saunaA.id
  ) -
    createStableScore(saunaB.id);
}

function createRecommendationReasons(
  sauna: PopularSauna,
  isUnvisited: boolean
): string[] {
  const reasons: string[] = [];

  if (isUnvisited) {
    reasons.push("まだ行っていない");
  }

  if (
    sauna.average_rating !== null &&
    sauna.average_rating >= 4
  ) {
    reasons.push("高評価");
  }

  if (sauna.post_count >= 3) {
    reasons.push("最近人気");
  }

  if (
    sauna.favorite_count >= 3
  ) {
    reasons.push("保存多数");
  }

  if (reasons.length === 0) {
    reasons.push("おすすめ");
  }

  return reasons.slice(0, 2);
}

function createLocationText(
  sauna: PopularSauna
): string {
  const locationText = [
    sauna.prefecture,
    sauna.city,
  ]
    .filter(Boolean)
    .join(" ");

  return locationText ||
    "所在地情報を確認する";
}

function normalizeRating(
  rating: number | null
): number {
  if (
    rating === null ||
    !Number.isFinite(rating)
  ) {
    return 0;
  }

  return rating;
}

function normalizeSaunaName(
  saunaName: string
): string {
  return saunaName
    .normalize("NFKC")
    .trim()
    .toLocaleLowerCase("ja-JP")
    .replace(/\s+/g, "");
}

function createStableScore(
  value: string
): number {
  let score = 0;

  for (
    let index = 0;
    index < value.length;
    index += 1
  ) {
    score =
      (
        score * 31 +
        value.charCodeAt(index)
      ) %
      2147483647;
  }

  return score;
}
