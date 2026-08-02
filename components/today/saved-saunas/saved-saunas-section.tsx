import Link from "next/link";
import {
  ArrowRight,
  BookmarkPlus,
} from "lucide-react";

import { TodayEmptyState } from "@/components/today/today-empty-state";

import type { TodaySavedSauna } from "@/types/today";

import { SavedSaunaCard } from "./saved-sauna-card";

type SavedSaunasSectionProps = {
  saunas: TodaySavedSauna[];
};

export function SavedSaunasSection({
  saunas,
}: SavedSaunasSectionProps) {
  const displayedSaunas = saunas.slice(0, 3);
  const hasSavedSaunas = displayedSaunas.length > 0;

  return (
    <section aria-labelledby="saved-saunas-title">
      <div
        className="
          mb-6
          flex
          items-end
          justify-between
          gap-4
          sm:mb-8
        "
      >
        <div>
          <p
            className="
              text-xs
              font-medium
              uppercase
              tracking-[0.16em]
              text-[#3e3a3a]/50
            "
          >
            Saved
          </p>

          <h2
            id="saved-saunas-title"
            className="
              mt-3
              text-2xl
              font-medium
              tracking-[-0.03em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            保存した施設
          </h2>

          <p
            className="
              mt-3
              text-sm
              leading-7
              text-[#3e3a3a]/60
              sm:text-base
            "
          >
            気になっていた場所から、今日の候補を。
          </p>
        </div>

        {hasSavedSaunas && (
          <Link
            href="/bookmarks"
            className="
              hidden
              shrink-0
              items-center
              gap-2
              text-sm
              font-medium
              text-[#3e3a3a]
              focus-visible:outline-none
              focus-visible:ring-2
              focus-visible:ring-[#fdd000]
              focus-visible:ring-offset-2
              sm:inline-flex
            "
          >
            すべて見る

            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </Link>
        )}
      </div>

      {hasSavedSaunas ? (
        <>
          <div
            className="
              -mx-5
              flex
              snap-x
              snap-proximity
              gap-4
              overflow-x-auto
              px-5
              pb-3
              sm:mx-0
              sm:grid
              sm:grid-cols-2
              sm:overflow-visible
              sm:px-0
              sm:pb-0
              lg:grid-cols-3
              lg:gap-6
            "
          >
            {displayedSaunas.map((sauna) => (
              <div
                key={sauna.saunaId}
                className="
                  w-[80%]
                  shrink-0
                  snap-start
                  sm:w-auto
                "
              >
                <SavedSaunaCard sauna={sauna} />
              </div>
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/bookmarks"
              className="
                inline-flex
                min-h-11
                items-center
                gap-2
                rounded-full
                border
                border-black/10
                bg-white
                px-5
                text-sm
                font-medium
                text-[#3e3a3a]
                focus-visible:outline-none
                focus-visible:ring-2
                focus-visible:ring-[#fdd000]
                focus-visible:ring-offset-2
              "
            >
              すべて見る

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </Link>
          </div>
        </>
      ) : (
        <TodayEmptyState
          icon={BookmarkPlus}
          title="気になるサウナを保存してみましょう"
          description="施設を保存すると、次に行きたい場所をToday画面からすぐに確認できます。"
          actionLabel="施設を探す"
          actionHref="/search"
        />
      )}
    </section>
  );
}
