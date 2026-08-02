"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

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
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { getPostImagesByPostId } from "@/services/post-images";
import { deletePost } from "@/services/posts";
import {
  deletePostImages,
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

  const [supabase] = useState(() =>
    createClient()
  );

  const [loading, setLoading] =
    useState(false);

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

      if (
        userError ||
        !user
      ) {
        toast.error(
          "ログインしてください。"
        );

        router.push("/login");
        return;
      }

      /*
       * 投稿を削除するとpost_imagesのDB行は
       * ON DELETE CASCADEで消えるため、
       * 削除前にStorageパスを取得しておきます。
       */
      const postImages =
        await getPostImagesByPostId(
          supabase,
          postId
        );

      const imageUrls = [
        ...postImages.map(
          (image) => image.image_url
        ),
        imageUrl,
      ].filter(
        (url): url is string =>
          typeof url === "string" &&
          url.trim().length > 0
      );

      const imagePaths = Array.from(
        new Set(
          imageUrls
            .map((url) =>
              getPostImagePath(url)
            )
            .filter(
              (
                path
              ): path is string =>
                typeof path === "string" &&
                path.length > 0
            )
        )
      );

      await deletePost(
        supabase,
        postId
      );

      if (imagePaths.length > 0) {
        try {
          await deletePostImages(
            supabase,
            imagePaths
          );
        } catch (cleanupError) {
          /*
           * 投稿自体の削除は完了しているため、
           * Storageの削除失敗だけでユーザー操作を
           * 失敗扱いにはしません。
           */
          console.error(
            "投稿画像の一括削除に失敗しました。",
            cleanupError
          );

          toast.warning(
            "投稿は削除されましたが、一部の画像整理に失敗しました。"
          );
        }
      }

      toast.success(
        "投稿を削除しました。"
      );

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
            aria-busy={loading}
            className="
              text-destructive
              hover:text-destructive
            "
          />
        }
      >
        <Trash2
          aria-hidden="true"
        />

        削除
      </AlertDialogTrigger>

      <AlertDialogContent
        aria-busy={loading}
      >
        <AlertDialogHeader>
          <AlertDialogTitle>
            この投稿を削除しますか？
          </AlertDialogTitle>

          <AlertDialogDescription>
            削除した投稿は元に戻すことができません。投稿に含まれる画像も削除されます。
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel
            disabled={loading}
          >
            キャンセル
          </AlertDialogCancel>

          <AlertDialogAction
            type="button"
            disabled={loading}
            aria-label={
              loading
                ? "投稿を削除しています"
                : "投稿を削除する"
            }
            aria-busy={loading}
            variant="destructive"
            onClick={(event) => {
              event.preventDefault();
              void handleDelete();
            }}
          >
            <Trash2
              aria-hidden="true"
            />

            {loading
              ? "削除中..."
              : "削除する"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
