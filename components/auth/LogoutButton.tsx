"use client";

import {
  useMemo,
  useState,
} from "react";
import {
  LoaderCircle,
  LogOut,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const [
    loading,
    setLoading,
  ] = useState(false);

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const {
        error,
      } =
        await supabase.auth.signOut();

      if (error) {
        throw new Error(
          error.message
        );
      }

      toast.success(
        "ログアウトしました。"
      );

      router.push("/login");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "ログアウトに失敗しました。"
      );

      setLoading(false);
    }
  };

  const accessibleLabel =
    loading
      ? "ログアウトしています"
      : "ログアウト";

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label={accessibleLabel}
      aria-busy={loading}
      className="
        inline-flex
        size-11
        shrink-0
        items-center
        justify-center
        rounded-full
        text-muted-foreground
        transition-colors
        duration-200
        hover:bg-muted
        hover:text-foreground
        focus-visible:outline-none
        focus-visible:ring-2
        focus-visible:ring-ring
        focus-visible:ring-offset-2
        focus-visible:ring-offset-background
        disabled:cursor-not-allowed
        disabled:opacity-50
        motion-reduce:transition-none
      "
    >
      {loading ? (
        <LoaderCircle
          aria-hidden="true"
          className="
            size-[1.125rem]
            animate-spin
            motion-reduce:animate-none
          "
          strokeWidth={1.75}
        />
      ) : (
        <LogOut
          aria-hidden="true"
          className="size-[1.125rem]"
          strokeWidth={1.75}
        />
      )}
    </button>
  );
}
