import Image from "next/image";
import Link from "next/link";
import {
  CalendarDays,
  Flame,
  MessageCircle,
  Star,
  Waves,
} from "lucide-react";

import type { TodayActivity } from "@/types/today";

type TodayActivityCardProps = {
  activity: TodayActivity;
};

function formatVisitDate(visitDate: string): string {
  const date = new Date(`${visitDate}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return visitDate;
  }

  return new Intl.DateTimeFormat("ja-JP", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export function TodayActivityCard({
  activity,
}: TodayActivityCardProps) {
  return (
    <article
      className="
        group
        overflow-hidden
        rounded-[1.5rem]
        border
        border-black/5
        bg-white
        transition
        duration-300
        hover:-translate-y-0.5
        hover:border-black/10
        hover:shadow-[0_18px_50px_rgba(62,58,58,0.07)]
        motion-reduce:transform-none
        motion-reduce:transition-none
      "
    >
      <Link
        href={`/posts/${activity.postId}`}
        className="
          block
          h-full
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-inset
          focus-visible:ring-[#fdd000]
        "
      >
        <div
          className="
            relative
            aspect-[16/10]
            overflow-hidden
            bg-[#e6e5ef]
          "
        >
          {activity.imageUrl ? (
            <Image
              src={activity.imageUrl}
              alt={`${activity.saunaName}のサ活写真`}
              fill
              sizes="
                (max-width: 768px) 100vw,
                50vw
              "
              className="
                object-cover
                transition-transform
                duration-500
                group-hover:scale-[1.02]
                motion-reduce:transform-none
                motion-reduce:transition-none
              "
            />
          ) : (
            <div
              className="
                flex
                h-full
                items-center
                justify-center
                px-8
                text-center
              "
            >
              <div>
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-full
                    bg-white/70
                  "
                >
                  <Waves
                    aria-hidden="true"
                    className="h-6 w-6 text-[#3e3a3a]/55"
                  />
                </div>

                <p
                  className="
                    mt-4
                    text-sm
                    font-medium
                    text-[#3e3a3a]/55
                  "
                >
                  {activity.saunaName}
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="px-5 py-6 sm:px-6">
          <div
            className="
              flex
              flex-wrap
              items-center
              gap-x-4
              gap-y-2
              text-xs
              text-[#3e3a3a]/55
            "
          >
            <span className="inline-flex items-center gap-1.5">
              <CalendarDays
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              {formatVisitDate(activity.visitDate)}
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Flame
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              {activity.setCount}セット
            </span>

            <span className="inline-flex items-center gap-1.5">
              <Star
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              {activity.rating.toFixed(1)}
            </span>
          </div>

          <h3
            className="
              mt-4
              text-xl
              font-medium
              leading-snug
              tracking-[-0.025em]
              text-[#3e3a3a]
            "
          >
            {activity.saunaName}
          </h3>

          {activity.comment && (
            <p
              className="
                mt-3
                line-clamp-3
                text-sm
                leading-7
                text-[#3e3a3a]/65
              "
            >
              {activity.comment}
            </p>
          )}

          <div
            className="
              mt-5
              flex
              items-center
              justify-between
              gap-4
              border-t
              border-black/5
              pt-4
            "
          >
            <span
              className="
                text-sm
                font-medium
                text-[#3e3a3a]
              "
            >
              {activity.username}
            </span>

            <span
              className="
                inline-flex
                items-center
                gap-1.5
                text-xs
                text-[#3e3a3a]/50
              "
            >
              <MessageCircle
                aria-hidden="true"
                className="h-3.5 w-3.5"
              />

              {activity.commentCount}
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}
