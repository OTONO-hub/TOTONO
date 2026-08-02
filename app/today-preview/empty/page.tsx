import { redirect } from "next/navigation";

import { TodayPage } from "@/components/today/today-page";
import { createClient } from "@/lib/supabase/server";

import type {
  TodayPageData,
  TodayUser,
} from "@/types/today";

export default async function TodayEmptyPreviewPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const todayUser: TodayUser = {
    id: user.id,
    username: null,
  };

  const todayData: TodayPageData = {
    recommendation: null,
    savedSaunas: [],
    recentActivities: [],
  };

  return (
    <TodayPage
      user={todayUser}
      data={todayData}
    />
  );
}