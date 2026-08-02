"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircle2,
  LoaderCircle,
} from "lucide-react";

import { useTodaySauna } from "@/components/search/use-today-sauna";
import { AppButton } from "@/components/ui/app-button";
import { clearTodayJourneyStorage } from "@/lib/today-journey-storage";

type TodayJourneyCompleteButtonProps = {
  saunaId: string | null;
};

export function TodayJourneyCompleteButton({
  saunaId,
}: TodayJourneyCompleteButtonProps) {
  const router = useRouter();

  const [
    todaySauna,
    setTodaySauna,
  ] = useTodaySauna();

  const [
    isCompleting,
    setIsCompleting,
  ] = useState(false);

  const handleCompleteJourney = () => {
    if (isCompleting) {
      return;
    }

    setIsCompleting(true);

    const targetSaunaId =
      saunaId ??
      todaySauna?.id ??
      null;

    try {
      if (targetSaunaId) {
        clearTodayJourneyStorage(
          targetSaunaId
        );
      }
    } catch {
      // localStorageを利用できない環境でも、
      // Todayの予定解除と画面遷移は続行します。
    }

    setTodaySauna(null);
    router.push("/");
    router.refresh();
  };

  return (
    <AppButton
      type="button"
      variant="secondary"
      size="lg"
      fullWidth
      disabled={isCompleting}
      onClick={handleCompleteJourney}
      leadingIcon={
        isCompleting ? (
          <LoaderCircle
            className="
              size-4
              animate-spin
              motion-reduce:animate-none
            "
            strokeWidth={1.8}
          />
        ) : (
          <CheckCircle2
            className="size-4"
            strokeWidth={1.8}
          />
        )
      }
      className="
        min-h-14
        justify-between
        rounded-[1.25rem]
      "
    >
      {isCompleting
        ? "完了しています..."
        : "今日の予定を完了する"}
    </AppButton>
  );
}

