"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { getPostById, updatePost } from "@/services/posts";
import { uploadPostImage } from "@/services/storage";

export default function EditPostPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const supabase = createClient();

  const [saunaName, setSaunaName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [setCount, setSetCount] = useState(3);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [currentImageUrl, setCurrentImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPost = async () => {
      const post = await getPostById(supabase, params.id);

      if (!post) {
        alert("投稿が見つかりません。");
        router.push("/");
        return;
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user || user.id !== post.user_id) {
        alert("この投稿は編集できません。");
        router.push("/");
        return;
      }

      setSaunaName(post.sauna_name);
      setVisitDate(post.visit_date);
      setSetCount(post.set_count);
      setRating(post.rating);
      setComment(post.comment ?? "");
      setCurrentImageUrl(post.image_url);
    };

    fetchPost();
  }, [params.id, router, supabase]);

  const handleUpdatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      let imageUrl = currentImageUrl ?? undefined;

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("ログインしてください。");
        router.push("/login");
        return;
      }

      if (image) {
        imageUrl = await uploadPostImage(supabase, user.id, image);
      }

      await updatePost(supabase, params.id, {
        user_id: user.id,
        sauna_name: saunaName,
        visit_date: visitDate,
        set_count: setCount,
        rating,
        comment,
        image_url: imageUrl,
      });

      alert("投稿を更新しました。");
      router.push("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "更新に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">投稿編集</h1>

        <form onSubmit={handleUpdatePost} className="space-y-5">
          <input
            type="text"
            value={saunaName}
            onChange={(e) => setSaunaName(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="date"
            value={visitDate}
            onChange={(e) => setVisitDate(e.target.value)}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="number"
            min="1"
            max="10"
            value={setCount}
            onChange={(e) => setSetCount(Number(e.target.value))}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="number"
            min="1"
            max="5"
            value={rating}
            onChange={(e) => setRating(Number(e.target.value))}
            className="w-full rounded-lg border p-3"
            required
          />

          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files?.[0] ?? null)}
            className="w-full rounded-lg border p-3"
          />

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-32 w-full rounded-lg border p-3"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "更新中..." : "更新する"}
          </button>
        </form>
      </div>
    </main>
  );
}