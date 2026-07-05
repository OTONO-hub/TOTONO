export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <h1 className="text-5xl font-bold text-blue-600">TOTONO</h1>

      <p className="mt-6 text-lg text-gray-700">
        サウナの記録を残して、
        <br />
        お気に入りのサウナを見つけよう。
      </p>

      <button className="mt-10 rounded-xl bg-blue-600 px-8 py-3 font-semibold text-white transition hover:bg-blue-700">
        ログイン
      </button>
    </section>
  );
}