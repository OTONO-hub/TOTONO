"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { createComment } from "@/services/comments";
import { useRouter } from "next/navigation";

type Props = {
  postId: string;
  userId: string;
};

export function CommentForm({ postId, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!content.trim()) return;

    setLoading(true);

    try {
      await createComment(supabase, {
        post_id: postId,
        user_id: userId,
        content,
      });

      setContent("");
      router.refresh();
    } catch (error) {
      alert(error instanceof Error ? error.message : "コメントに失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="コメントを書く..."
        className="flex-1 rounded-lg border p-2 text-sm"
      />

      <button
        type="submit"
        disabled={loading}
        className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white disabled:bg-gray-400"
      >
        {loading ? "送信中" : "送信"}
      </button>
    </form>
  );
}