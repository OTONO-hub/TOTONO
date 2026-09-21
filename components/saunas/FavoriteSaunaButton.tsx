"use client";

import {
  useId,
  useMemo,
  useState,
} from "react";
import {
  Heart,
  LoaderCircle,
} from "lucide-react";
import { useRouter } from "next/navigation";

import { createClient } from "@/lib/supabase/client";
import {
  addFavoriteSauna,
  removeFavoriteSauna,
} from "@/services/favorite-saunas";

type FavoriteSaunaButtonProps = {
  saunaId: string;
  userId: string | null;
  initialFavorite: boolean;
};

export function FavoriteSaunaButton({
  saunaId,
  userId,
  initialFavorite,
}: FavoriteSaunaButtonProps) {
  const router = useRouter();
  const errorMessageId = useId();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    isFavorite,
    setIsFavorite,
  ] = useState(initialFavorite);

  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const [
    errorMessage,
    setErrorMessage,
  ] = useState<string | null>(null);

  const handleFavorite = async () => {
    if (isLoading) {
      return;
    }

    if (!userId) {
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setErrorMessage(null);

    try {
      if (isFavorite) {
        await removeFavoriteSauna(
          supabase,
          userId,
          saunaId
        );

        setIsFavorite(false);
      } else {
        await addFavoriteSauna(
          supabase,
          userId,
          saunaId
        );

        setIsFavorite(true);
      }

      router.refresh();
    } catch (error) {
      console.error(
        "行きたいサウナの更新に失敗しました。",
        error
      );

      setErrorMessage(
        "行きたい状態を更新できませんでした。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const visibleLabel = !userId
    ? "ログインして行きたいに追加"
    : isLoading
      ? isFavorite
        ? "解除中..."
        : "追加中..."
      : isFavorite
        ? "行きたいに追加済み"
        : "行きたい";

  const accessibleLabel = !userId
    ? "ログインしてこの施設を行きたいに追加"
    : isLoading
      ? isFavorite
        ? "行きたいから解除しています"
        : "行きたいに追加しています"
      : isFavorite
        ? "この施設を行きたいから解除"
        : "この施設を行きたいに追加";

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isLoading}
        aria-label={accessibleLabel}
        aria-pressed={isFavorite}
        aria-busy={isLoading}
        aria-describedby={
          errorMessage
            ? errorMessageId
            : undefined
        }
        className={`
          inline-flex
          min-h-11
          w-full
          items-center
          justify-center
          gap-2
          rounded-full
          border
          px-6
          py-3
          text-sm
          font-medium
          transition
          duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#fdd000]
          focus-visible:ring-offset-2
          focus-visible:ring-offset-background
          disabled:cursor-not-allowed
          disabled:opacity-60
          motion-reduce:transition-none
          ${
            isFavorite
              ? `
                border-[#fdd000]
                bg-[#fdd000]
                text-[#3e3a3a]
                hover:bg-[#fdd000]/85
              `
              : `
                border-[#3e3a3a]/15
                bg-white
                text-[#3e3a3a]
                hover:border-[#3e3a3a]/30
                hover:bg-[#e6e5ef]/50
              `
          }
        `}
      >
        {isLoading ? (
          <LoaderCircle
            aria-hidden="true"
            className="
              size-4
              animate-spin
              motion-reduce:animate-none
            "
          />
        ) : (
          <Heart
            aria-hidden="true"
            className={`
              size-4
              ${
                isFavorite
                  ? "fill-current"
                  : ""
              }
            `}
          />
        )}

        <span>{visibleLabel}</span>
      </button>

      {errorMessage ? (
        <p
          id={errorMessageId}
          role="alert"
          className="
            mt-2
            px-2
            text-center
            text-xs
            leading-5
            text-[#e95884]
          "
        >
          {errorMessage}
        </p>
      ) : null}
    </div>
  );
}
