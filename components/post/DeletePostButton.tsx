"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
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
import { deletePost } from "@/services/posts";
import {
  deletePostImage,
  getPostImagePath,
} from "@/services/storage";

type Props = {
  postId: string;
  imageUrl: string | null;
};

export function DeletePostButton({
  postId,
  imageUrl,
}: Props) {
  const router = useRouter();
  const supabase = createClient();

  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
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

      await deletePost(supabase, postId);

      if (imageUrl) {
        const imagePath = getPostImagePath(imageUrl);

        if (imagePath) {
          try {
            await deletePostImage(supabase, imagePath);
          } catch (cleanupError) {
            console.error(
              "投稿画像の削除に失敗しました。",
              cleanupError
            );
          }
        }
      }

      toast.success("投稿を削除しました。");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "投稿の削除に失敗しました。"
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
            variant="outline"
            size="sm"
            disabled={loading}
            className="text-destructive hover:text-destructive"
          />
        }
      >
        <Trash2 />
        削除
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            この投稿を削除しますか？
          </AlertDialogTitle>

          <AlertDialogDescription>
            削除した投稿は元に戻すことができません。
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
            <Trash2 />

            {loading ? "削除中..." : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}