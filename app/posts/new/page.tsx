"use client";
import { createPost } from "@/services/posts";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function NewPostPage() {
  const router = useRouter();
  const supabase = createClient();

  const [saunaName, setSaunaName] = useState("");
  const [visitDate, setVisitDate] = useState("");
  const [setCount, setSetCount] = useState(3);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePost = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const {
  data: { user },
  error: userError,
} = await supabase.auth.getUser();

if (userError || !user) {
  setLoading(false);
  alert("ログインしてください。");
  router.push("/login");
  return;
}

    if (!user) {
      setLoading(false);
      alert("ログインしてください。");
      router.push("/login");
      return;
    }

        try {
      await createPost(supabase, {
        user_id: user.id,
        sauna_name: saunaName,
        visit_date: visitDate,
        set_count: setCount,
        rating,
        comment,
      });

      alert("投稿しました。");
      router.push("/");
    } catch (error) {
      alert(error instanceof Error ? error.message : "投稿に失敗しました。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">サ活投稿</h1>

        <form onSubmit={handleCreatePost} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">サウナ施設名</label>
            <input
              type="text"
              value={saunaName}
              onChange={(e) => setSaunaName(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">訪問日</label>
            <input
              type="date"
              value={visitDate}
              onChange={(e) => setVisitDate(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">セット数</label>
            <input
              type="number"
              min="1"
              max="10"
              value={setCount}
              onChange={(e) => setSetCount(Number(e.target.value))}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">ととのい度</label>
            <input
              type="number"
              min="1"
              max="5"
              value={rating}
              onChange={(e) => setRating(Number(e.target.value))}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">コメント</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-32 w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "投稿中..." : "投稿する"}
          </button>
        </form>
      </div>
    </main>
  );
}