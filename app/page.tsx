import { FeaturedArticles } from "@/components/home/FeaturedArticles";
import { Hero } from "@/components/home/Hero";
import { HomeHighlights } from "@/components/home/HomeHighlights";
import { HomePresenter } from "@/components/home/HomePresenter";
import { AppMobileNavigation } from "@/components/layout/AppMobileNavigation";
import { Header } from "@/components/layout/Header";
import { createClient } from "@/lib/supabase/server";
import { getHomeDashboardData } from "@/services/dashboard";

function getTodayLabel(): string {
  return new Intl.DateTimeFormat("ja-JP", {
    timeZone: "Asia/Tokyo",
    month: "long",
    day: "numeric",
    weekday: "long",
  }).format(new Date());
}

export default async function Home() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  /*
   * 未ログイン時は、
   * サービス紹介用のトップページを表示します。
   */
  if (!user) {
    return (
      <>
        <Header />

        <main>
          <Hero />
          <HomeHighlights />
          <FeaturedArticles />
        </main>
      </>
    );
  }

  /*
   * ログイン後のホームで使用するデータは、
   * dashboardサービスでまとめて準備します。
   */
  const dashboard = await getHomeDashboardData(
    supabase,
    user.id
  );

  const todayLabel = getTodayLabel();

  return (
    <>
      <Header />

      <HomePresenter
        userId={user.id}
        todayLabel={todayLabel}
        dashboard={dashboard}
        mobileNavigation={
          <AppMobileNavigation />
        }
      />
    </>
  );
}
