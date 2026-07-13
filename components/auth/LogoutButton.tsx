"use client";

import { useMemo, useState } from "react";
import { LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { createClient } from "@/lib/supabase/client";

export function LogoutButton() {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw new Error(error.message);
      }

      toast.success("ログアウトしました。");

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

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      aria-label="ログアウト"
      className="inline-flex size-10 items-center justify-center rounded-md text-muted-foreground transition hover:bg-muted hover:text-foreground disabled:opacity-50 sm:w-auto sm:gap-2 sm:px-3"
    >
      <LogOut className="size-4" />

      <span className="hidden sm:inline">
        {loading ? "ログアウト中..." : "ログアウト"}
      </span>
    </button>
  );
}