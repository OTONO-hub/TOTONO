"use client";

import { useMemo, useState } from "react";
import { LoaderCircle, UserCheck, UserPlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import {
  followUser,
  unfollowUser,
} from "@/services/follows";

type Props = {
  currentUserId: string;
  targetUserId: string;
  initialFollowing: boolean;
};

export function FollowButton({
  currentUserId,
  targetUserId,
  initialFollowing,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [following, setFollowing] = useState(
    initialFollowing
  );
  const [loading, setLoading] = useState(false);

  const handleFollow = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      if (following) {
        await unfollowUser(
          supabase,
          currentUserId,
          targetUserId
        );

        setFollowing(false);
        toast.success("フォローを解除しました。");
      } else {
        await followUser(
          supabase,
          currentUserId,
          targetUserId
        );

        setFollowing(true);
        toast.success("フォローしました。");
      }

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "フォロー操作に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant={following ? "outline" : "default"}
      onClick={handleFollow}
      disabled={loading}
    >
      {loading ? (
        <>
          <LoaderCircle className="animate-spin" />
          処理中
        </>
      ) : following ? (
        <>
          <UserCheck />
          フォロー中
        </>
      ) : (
        <>
          <UserPlus />
          フォローする
        </>
      )}
    </Button>
  );
}