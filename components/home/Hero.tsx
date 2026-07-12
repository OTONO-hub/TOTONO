import { Button } from "../ui/button";

export function Hero() {
  return (
    <section className="flex min-h-screen flex-col items-center justify-center bg-gray-100 px-6 text-center">
      <h1 className="text-5xl font-bold text-blue-600">
        TOTONO
      </h1>

      <p className="mt-6 text-lg text-gray-700">
        サウナの記録を残して、
        <br />
        お気に入りのサウナを見つけよう。
      </p>

      <div className="mt-10">
        <Button>ログイン</Button>
      </div>
    </section>
  );
}