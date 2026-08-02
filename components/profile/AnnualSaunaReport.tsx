import Link from "next/link";
import {
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Flame,
  MapPin,
  Sparkles,
  Star,
  Trophy,
} from "lucide-react";

import { AnnualReportShareButton } from "@/components/profile/AnnualReportShareButton";
import type { AnnualSaunaReport as AnnualSaunaReportData } from "@/services/profile-insights";

type AnnualSaunaReportProps = {
  report: AnnualSaunaReportData;
};

type ReportStatProps = {
  icon: React.ReactNode;
  label: string;
  value: string;
  description: string;
};

function ReportStat({
  icon,
  label,
  value,
  description,
}: ReportStatProps) {
  return (
    <div
      className="
        rounded-2xl
        border border-white/10
        bg-white/7
        p-4
        backdrop-blur-sm
        sm:p-5
      "
    >
      <div
        className="
          flex
          items-center
          gap-2
          text-white/65
        "
      >
        {icon}

        <span
          className="
            text-xs
            font-medium
            tracking-wide
          "
        >
          {label}
        </span>
      </div>

      <p
        className="
          mt-5
          text-2xl
          font-semibold
          tracking-[-0.04em]
          text-white
          sm:text-3xl
        "
      >
        {value}
      </p>

      <p
        className="
          mt-2
          text-xs
          leading-5
          text-white/55
        "
      >
        {description}
      </p>
    </div>
  );
}

export function AnnualSaunaReport({
  report,
}: AnnualSaunaReportProps) {
  const hasAnnualActivity =
    report.visitCount > 0;

  const topSauna = report.topSauna;

  const busiestMonth =
    report.busiestMonth;

  return (
    <section
      className="
        relative
        mt-10
        overflow-hidden
        rounded-[2rem]
        bg-[#3e3a3a]
        text-white
        shadow-xl
        sm:mt-12
      "
    >
      <div
        aria-hidden="true"
        className="
          absolute
          -right-20
          -top-24
          size-72
          rounded-full
          bg-[#fdd000]/15
          blur-3xl
        "
      />

      <div
        aria-hidden="true"
        className="
          absolute
          -bottom-32
          -left-24
          size-80
          rounded-full
          bg-[#9fd9f6]/15
          blur-3xl
        "
      />

      <div
        className="
          relative
          border-b
          border-white/10
          px-6
          py-7
          sm:px-8
          sm:py-8
        "
      >
        <div
          className="
            flex
            flex-col
            gap-5
            sm:flex-row
            sm:items-end
            sm:justify-between
          "
        >
          <div>
            <div
              className="
                inline-flex
                items-center
                gap-2
                rounded-full
                border border-white/10
                bg-white/10
                px-3
                py-1.5
                text-xs
                font-semibold
                uppercase
                tracking-[0.18em]
                text-white/85
                backdrop-blur-sm
              "
            >
              <Sparkles
                className="size-3.5"
                strokeWidth={1.8}
              />

              Year in Sauna
            </div>

            <p
              className="
                mt-5
                text-xs
                font-semibold
                uppercase
                tracking-[0.28em]
                text-white/45
              "
            >
              {report.year}
            </p>

            <h2
              className="
                mt-2
                text-2xl
                font-semibold
                tracking-[-0.04em]
                text-white
                sm:text-3xl
              "
            >
              SAUNA REPORT
            </h2>

            <p
              className="
                mt-3
                max-w-xl
                text-sm
                leading-6
                text-white/60
              "
            >
              {report.year}
              年のサ活を、訪問回数や施設、セット数から振り返ります。
            </p>
          </div>

          <div
            className="
              flex
              flex-col
              items-start
              gap-3
              sm:items-end
            "
          >
            <div
              className="
                flex
                size-14
                items-center
                justify-center
                rounded-2xl
                border border-white/10
                bg-white/10
                text-[#fdd000]
                backdrop-blur-sm
              "
            >
              <Trophy
                className="size-6"
                strokeWidth={1.6}
              />
            </div>

            <AnnualReportShareButton
              report={report}
            />
          </div>
        </div>
      </div>

      <div
        className="
          relative
          px-5
          py-5
          sm:px-8
          sm:py-8
        "
      >
        {!hasAnnualActivity ? (
          <div
            className="
              rounded-2xl
              border
              border-dashed
              border-white/15
              bg-white/5
              px-5
              py-12
              text-center
            "
          >
            <div
              className="
                mx-auto
                flex
                size-12
                items-center
                justify-center
                rounded-full
                bg-white/10
                text-[#9fd9f6]
              "
            >
              <CalendarDays
                className="size-5"
                strokeWidth={1.7}
              />
            </div>

            <h3
              className="
                mt-5
                text-base
                font-semibold
                text-white
              "
            >
              今年のサ活はまだありません
            </h3>

            <p
              className="
                mx-auto
                mt-2
                max-w-md
                text-sm
                leading-6
                text-white/55
              "
            >
              サ活を記録すると、今年の訪問回数やホームサウナがここに表示されます。
            </p>

            <Link
              href="/posts/new"
              className="
                mt-6
                inline-flex
                items-center
                justify-center
                gap-2
                rounded-full
                bg-[#fdd000]
                px-5
                py-2.5
                text-sm
                font-semibold
                text-[#3e3a3a]
                transition
                hover:-translate-y-0.5
                hover:shadow-lg
              "
            >
              サ活を記録する

              <ArrowUpRight
                className="size-4"
                strokeWidth={1.8}
              />
            </Link>
          </div>
        ) : (
          <>
            <div
              className="
                grid
                gap-3
                sm:grid-cols-2
                lg:grid-cols-4
              "
            >
              <ReportStat
                icon={
                  <Flame
                    className="size-4"
                    strokeWidth={1.8}
                  />
                }
                label="今年のサ活"
                value={`${report.visitCount}回`}
                description={`${report.year}年に記録したサ活`}
              />

              <ReportStat
                icon={
                  <MapPin
                    className="size-4"
                    strokeWidth={1.8}
                  />
                }
                label="訪れた施設"
                value={`${report.visitedSaunas}施設`}
                description="今年訪問したサウナ施設"
              />

              <ReportStat
                icon={
                  <BarChart3
                    className="size-4"
                    strokeWidth={1.8}
                  />
                }
                label="合計セット"
                value={`${report.totalSets}セット`}
                description="今年積み重ねたセット数"
              />

              <ReportStat
                icon={
                  <Star
                    className="size-4"
                    strokeWidth={1.8}
                  />
                }
                label="平均評価"
                value={report.averageRating}
                description="今年の投稿評価の平均"
              />
            </div>

            <div
              className="
                mt-3
                grid
                gap-3
                lg:grid-cols-2
              "
            >
              <div
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/7
                  p-5
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-4
                  "
                >
                  <div className="min-w-0">
                    <div
                      className="
                        flex
                        items-center
                        gap-2
                        text-white/60
                      "
                    >
                      <Trophy
                        className="size-4"
                        strokeWidth={1.8}
                      />

                      <span
                        className="
                          text-xs
                          font-medium
                          tracking-wide
                        "
                      >
                        ホームサウナ
                      </span>
                    </div>

                    {topSauna ? (
                      <>
                        <p
                          className="
                            mt-5
                            truncate
                            text-lg
                            font-semibold
                            tracking-[-0.03em]
                            text-white
                            sm:text-xl
                          "
                        >
                          {topSauna.saunaName}
                        </p>

                        <p
                          className="
                            mt-2
                            text-sm
                            text-white/55
                          "
                        >
                          今年
                          {topSauna.visitCount}
                          回訪問
                        </p>
                      </>
                    ) : (
                      <p
                        className="
                          mt-5
                          text-sm
                          text-white/50
                        "
                      >
                        まだ集計できる施設がありません
                      </p>
                    )}
                  </div>

                  {topSauna?.saunaId && (
                    <Link
                      href={`/saunas/${topSauna.saunaId}`}
                      aria-label={`${topSauna.saunaName}の施設詳細を見る`}
                      className="
                        flex
                        size-10
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        border border-white/10
                        bg-white/10
                        text-white/70
                        transition
                        hover:-translate-y-0.5
                        hover:bg-white/15
                        hover:text-white
                      "
                    >
                      <ArrowUpRight
                        className="size-4"
                        strokeWidth={1.8}
                      />
                    </Link>
                  )}
                </div>
              </div>

              <div
                className="
                  rounded-2xl
                  border border-white/10
                  bg-white/7
                  p-5
                  backdrop-blur-sm
                "
              >
                <div
                  className="
                    flex
                    items-center
                    gap-2
                    text-white/60
                  "
                >
                  <CalendarDays
                    className="size-4"
                    strokeWidth={1.8}
                  />

                  <span
                    className="
                      text-xs
                      font-medium
                      tracking-wide
                    "
                  >
                    最も活動した月
                  </span>
                </div>

                {busiestMonth ? (
                  <>
                    <p
                      className="
                        mt-5
                        text-lg
                        font-semibold
                        tracking-[-0.03em]
                        text-white
                        sm:text-xl
                      "
                    >
                      {busiestMonth.label}
                    </p>

                    <p
                      className="
                        mt-2
                        text-sm
                        text-white/55
                      "
                    >
                      {busiestMonth.visitCount}
                      回のサ活を記録
                    </p>
                  </>
                ) : (
                  <p
                    className="
                      mt-5
                      text-sm
                      text-white/50
                    "
                  >
                    まだ集計できる月がありません
                  </p>
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
