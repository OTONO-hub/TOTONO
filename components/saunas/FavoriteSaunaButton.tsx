"use client";

import { useState } from "react";
import { Heart, LoaderCircle } from "lucide-react";
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

  const [isFavorite, setIsFavorite] =
    useState(initialFavorite);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<
    string | null
  >(null);

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

    const supabase = createClient();

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
        "お気に入りサウナの更新に失敗しました:",
        error
      );

      setErrorMessage(
        "お気に入りを更新できませんでした。時間をおいて再度お試しください。"
      );
    } finally {
      setIsLoading(false);
    }
  };

  const buttonLabel = userId
    ? isFavorite
      ? "お気に入り済み"
      : "お気に入りに追加"
    : "ログインしてお気に入りに追加";

  return (
    <div className="w-full">
      <button
        type="button"
        onClick={handleFavorite}
        disabled={isLoading}
        aria-pressed={isFavorite}
        aria-label={buttonLabel}
        className={`
          inline-flex w-full items-center
          justify-center gap-2
          rounded-full border px-6 py-3
          text-sm font-medium
          transition duration-200
          focus-visible:outline-none
          focus-visible:ring-2
          focus-visible:ring-[#fdd000]
          focus-visible:ring-offset-2
          disabled:cursor-not-allowed
          disabled:opacity-60
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
            className="size-4 animate-spin"
            aria-hidden="true"
          />
        ) : (
          <Heart
            className={`size-4 ${
              isFavorite
                ? "fill-current"
                : ""
            }`}
            aria-hidden="true"
          />
        )}

        <span>{buttonLabel}</span>
      </button>

      {errorMessage && (
        <p
          role="alert"
          className="
            mt-2 px-2 text-center
            text-xs leading-5
            text-[#e95884]
          "
        >
          {errorMessage}
        </p>
      )}
    </div>
  );
}