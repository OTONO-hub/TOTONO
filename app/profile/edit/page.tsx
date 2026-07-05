"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function ProfileEditPage() {
  const router = useRouter();
  const supabase = createClient();

  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSaveProfile = async (e: React.FormEvent<HTMLFormElement>) => {
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

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username,
      bio,
      updated_at: new Date().toISOString(),
    });

    setLoading(false);

    if (error) {
      alert(error.message);
      return;
    }

    alert("プロフィールを保存しました。");
    router.push("/profile");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <h1 className="mb-8 text-center text-3xl font-bold">
          プロフィール編集
        </h1>

        <form onSubmit={handleSaveProfile} className="space-y-5">
          <div>
            <label className="mb-2 block font-medium">ユーザー名</label>
            <input
              type="text"
              placeholder="例：kazuya"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full rounded-lg border p-3"
              required
            />
          </div>

          <div>
            <label className="mb-2 block font-medium">自己紹介</label>
            <textarea
              placeholder="サウナが好きです。"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className="min-h-32 w-full rounded-lg border p-3"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 p-3 font-bold text-white hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading ? "保存中..." : "保存する"}
          </button>
        </form>
      </div>
    </main>
  );
}