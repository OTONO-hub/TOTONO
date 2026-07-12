"use client";

import { FormEvent, useMemo, useState } from "react";
import { LoaderCircle, Send } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { createComment } from "@/services/comments";

type Props = {
  postId: string;
  userId: string;
};

const MAX_COMMENT_LENGTH = 300;

export function CommentForm({ postId, userId }: Props) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);

  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const trimmedContent = content.trim();
  const canSubmit =
    trimmedContent.length > 0 &&
    trimmedContent.length <= MAX_COMMENT_LENGTH &&
    !loading;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (!trimmedContent) {
      toast.error("コメントを入力してください。");
      return;
    }

    if (trimmedContent.length > MAX_COMMENT_LENGTH) {
      toast.error(
        `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`
      );
      return;
    }

    if (loading) {
      return;
    }

    setLoading(true);

    try {
      await createComment(supabase, {
        post_id: postId,
        user_id: userId,
        content: trimmedContent,
      });

      setContent("");
      toast.success("コメントを投稿しました。");

      router.refresh();
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "コメントの投稿に失敗しました。"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="mt-4 space-y-2"
    >
      <div className="flex gap-2">
        <Input
          type="text"
          value={content}
          onChange={(event) =>
            setContent(event.target.value)
          }
          placeholder="コメントを書く..."
          maxLength={MAX_COMMENT_LENGTH}
          disabled={loading}
          aria-label="コメント"
          className="flex-1"
        />

        <Button
          type="submit"
          size="sm"
          disabled={!canSubmit}
          className="shrink-0"
        >
          {loading ? (
            <>
              <LoaderCircle className="animate-spin" />
              送信中
            </>
          ) : (
            <>
              <Send />
              送信
            </>
          )}
        </Button>
      </div>

      <div className="flex justify-end">
        <span className="text-xs text-muted-foreground">
          {content.length} / {MAX_COMMENT_LENGTH}
        </span>
      </div>
    </form>
  );
}