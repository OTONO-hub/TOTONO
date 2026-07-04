export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-5xl font-bold text-blue-600">
        TOTONO
      </h1>

      <p className="mt-6 text-xl text-gray-700">
        サウナの記録を残し、
        お気に入りのサウナを見つけよう。
      </p>

      <button className="mt-10 px-8 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition">
        ログイン
      </button>
    </main>
  );
}