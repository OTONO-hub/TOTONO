import { redirect } from "next/navigation";

import { TodayPage } from "@/components/today/today-page";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/services/profile";
import {
  getRecentActivities,
  getTodaySavedSaunas,
} from "@/services/today";

import type {
  TodayPageData,
  TodayUser,
} from "@/types/today";

export default async function TodayPreviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const [
    profile,
    recentActivities,
    savedSaunas,
  ] = await Promise.all([
    getProfile(
      supabase,
      user.id
    ),
    getRecentActivities(
      supabase,
      2
    ),
    getTodaySavedSaunas(
      supabase,
      user.id,
      3
    ),
  ]);

  const todayUser: TodayUser = {
    id: user.id,
    username:
      profile?.username ?? null,
  };

  const recommendation =
    savedSaunas.length > 0
      ? {
          saunaId:
            savedSaunas[0].saunaId,
          saunaName:
            savedSaunas[0].saunaName,
          area:
            savedSaunas[0].area,
          imageUrl:
            savedSaunas[0].imageUrl,
          reason:
            "保存したサ活の中から、今日もう一度訪れたい施設を選びました。",
          tags: [
            "保存した施設",
            "今日の候補",
          ],
          isBookmarked: true,
        }
      : null;

  const todayData: TodayPageData = {
    recommendation,
    savedSaunas,
    recentActivities,
  };

  return (
    <TodayPage
      user={todayUser}
      data={todayData}
    />
  );
}
