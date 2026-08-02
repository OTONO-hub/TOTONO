import { Compass } from "lucide-react";

import { TodayEmptyState } from "@/components/today/today-empty-state";

import type { TodayRecommendation } from "@/types/today";

import { TodayRecommendationCard } from "./today-recommendation-card";

type TodayRecommendationSectionProps = {
  recommendation: TodayRecommendation | null;
};

export function TodayRecommendationSection({
  recommendation,
}: TodayRecommendationSectionProps) {
  return (
    <section aria-labelledby="today-recommendation-title">
      <div className="mb-6 sm:mb-8">
        <p
          className="
            text-xs
            font-medium
            uppercase
            tracking-[0.16em]
            text-[#3e3a3a]/50
          "
        >
          Today&apos;s pick
        </p>

        <h2
          id="today-recommendation-title"
          className="
            mt-3
            text-2xl
            font-medium
            tracking-[-0.03em]
            text-[#3e3a3a]
            sm:text-3xl
          "
        >
          今日のおすすめ
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
          今の気分に合う、今日の行き先を。
        </p>
      </div>

      {recommendation ? (
        <TodayRecommendationCard
          recommendation={recommendation}
        />
      ) : (
        <TodayEmptyState
          icon={Compass}
          title="今日の行き先を探してみましょう"
          description="気になる施設を見つけて保存すると、あなたのサウナライフに合わせた候補をここに表示できます。"
          actionLabel="サウナを探す"
          actionHref="/search"
        />
      )}
    </section>
  );
}
