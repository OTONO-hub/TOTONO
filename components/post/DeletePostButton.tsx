"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { deletePost } from "@/services/posts";

type Props = {
  postId: string;
};

export function DeletePostButton({ postId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    const ok = confirm("この投稿を削除しますか？");
    if (!ok) return;

    setLoading(true);

    try {
      await deletePost(supabase, postId);
      alert("投稿を削除しました。");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "削除に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="rounded-lg border border-red-300 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? "削除中..." : "削除"}
    </button>
  );
}