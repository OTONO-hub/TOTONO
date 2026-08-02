import Link from "next/link";
import {
  ArrowRight,
  PenLine,
} from "lucide-react";

import { TodayEmptyState } from "@/components/today/today-empty-state";

import type { TodayActivity } from "@/types/today";

import { TodayActivityCard } from "./today-activity-card";

type RecentActivitiesSectionProps = {
  activities: TodayActivity[];
};

export function RecentActivitiesSection({
  activities,
}: RecentActivitiesSectionProps) {
  const displayedActivities = activities.slice(0, 2);
  const hasActivities = displayedActivities.length > 0;

  return (
    <section aria-labelledby="recent-activities-title">
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
            Recent activity
          </p>

          <h2
            id="recent-activities-title"
            className="
              mt-3
              text-2xl
              font-medium
              tracking-[-0.03em]
              text-[#3e3a3a]
              sm:text-3xl
            "
          >
            最近のサ活
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
            みんなの新しい体験から、次の行き先を見つける。
          </p>
        </div>

        {hasActivities && (
          <Link
            href="/"
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
            もっと見る

            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4"
            />
          </Link>
        )}
      </div>

      {hasActivities ? (
        <>
          <div
            className="
              grid
              gap-5
              md:grid-cols-2
              lg:gap-6
            "
          >
            {displayedActivities.map((activity) => (
              <TodayActivityCard
                key={activity.postId}
                activity={activity}
              />
            ))}
          </div>

          <div className="mt-6 sm:hidden">
            <Link
              href="/"
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
              もっと見る

              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4"
              />
            </Link>
          </div>
        </>
      ) : (
        <TodayEmptyState
          icon={PenLine}
          title="最初のサ活を記録しましょう"
          description="訪れた施設やセット数、その日の感想を残すと、自分だけのサウナ記録が育っていきます。"
          actionLabel="サ活を記録する"
          actionHref="/posts/new"
        />
      )}
    </section>
  );
}
