"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { LoaderCircle, Trash2 } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { createClient } from "@/lib/supabase/client";
import { deleteComment } from "@/services/comments";

type Props = {
  commentId: string;
  userId: string;
};

export function DeleteCommentButton({
  commentId,
  userId,
}: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    if (loading) {
      return;
    }

    setLoading(true);

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        toast.error("ログインしてください。");
        router.push("/login");
        return;
      }

      if (user.id !== userId) {
        toast.error("このコメントは削除できません。");
        return;
      }

      await deleteComment(
        supabase,
        commentId,
        user.id
      );

      toast.success("コメントを削除しました。");
      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "コメントの削除に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            disabled={loading}
            aria-label="コメントを削除"
            className="text-muted-foreground hover:text-destructive"
          />
        }
      >
        {loading ? (
          <LoaderCircle className="animate-spin" />
        ) : (
          <Trash2 />
        )}
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            コメントを削除しますか？
          </AlertDialogTitle>

          <AlertDialogDescription>
            削除したコメントは元に戻せません。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            キャンセル
          </AlertDialogCancel>

          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            variant="destructive"
          >
            {loading ? (
              <>
                <LoaderCircle className="animate-spin" />
                削除中...
              </>
            ) : (
              <>
                <Trash2 />
                削除する
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}