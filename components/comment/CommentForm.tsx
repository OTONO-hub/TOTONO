"use client";

import {
  type FormEvent,
  useId,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  LoaderCircle,
  Send,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/client";
import { createComment } from "@/services/comments";
import { createNotification } from "@/services/notifications";

type Props = {
  postId: string;
  userId: string;
  postOwnerId: string;
};

const MAX_COMMENT_LENGTH = 300;

export function CommentForm({
  postId,
  userId,
  postOwnerId,
}: Props) {
  const router = useRouter();

  const supabase = useMemo(
    () => createClient(),
    []
  );

  const inputRef =
    useRef<HTMLInputElement>(null);

  const characterCountId = useId();
  const statusId = useId();

  const [
    content,
    setContent,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const trimmedContent =
    content.trim();

  const canSubmit =
    trimmedContent.length > 0 &&
    trimmedContent.length <=
      MAX_COMMENT_LENGTH &&
    !loading;

  const isNearCharacterLimit =
    content.length >=
    MAX_COMMENT_LENGTH * 0.8;

  const handleSubmit = async (
    event: FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (loading) {
      return;
    }

    if (!trimmedContent) {
      toast.error(
        "コメントを入力してください。"
      );

      inputRef.current?.focus();
      return;
    }

    if (
      trimmedContent.length >
      MAX_COMMENT_LENGTH
    ) {
      toast.error(
        `コメントは${MAX_COMMENT_LENGTH}文字以内で入力してください。`
      );

      inputRef.current?.focus();
      return;
    }

    setLoading(true);

    try {
      await createComment(
        supabase,
        {
          post_id: postId,
          user_id: userId,
          content: trimmedContent,
        }
      );

      try {
        await createNotification(
          supabase,
          {
            recipientId:
              postOwnerId,
            actorId: userId,
            type: "comment",
            postId,
          }
        );
      } catch (
        notificationError
      ) {
        console.error(
          "コメント通知の作成に失敗しました。",
          notificationError
        );
      }

      setContent("");

      toast.success(
        "コメントを投稿しました。"
      );

      router.refresh();

      window.requestAnimationFrame(
        () => {
          inputRef.current?.focus();
        }
      );
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
      aria-label="コメントを投稿"
      aria-busy={loading}
      className="mt-4 space-y-2"
    >
      <div
        className="
          flex
          items-center
          gap-2
        "
      >
        <Input
          ref={inputRef}
          type="text"
          name="comment"
          value={content}
          onChange={(event) =>
            setContent(
              event.target.value
            )
          }
          placeholder="コメントを書く..."
          maxLength={
            MAX_COMMENT_LENGTH
          }
          disabled={loading}
          autoComplete="off"
          aria-label="コメント内容"
          aria-describedby={`${characterCountId} ${statusId}`}
          className="
            min-h-11
            flex-1
            rounded-xl
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
          "
        />

        <Button
          type="submit"
          size="sm"
          disabled={!canSubmit}
          aria-label={
            loading
              ? "コメントを送信しています"
              : "コメントを送信"
          }
          aria-busy={loading}
          className="
            min-h-11
            shrink-0
            rounded-xl
            px-4
            focus-visible:outline-none
            focus-visible:ring-2
            focus-visible:ring-ring
            focus-visible:ring-offset-2
            focus-visible:ring-offset-background
            motion-reduce:transition-none
          "
        >
          {loading ? (
            <LoaderCircle
              aria-hidden="true"
              className="
                size-4
                animate-spin
                motion-reduce:animate-none
              "
            />
          ) : (
            <Send
              aria-hidden="true"
              className="size-4"
            />
          )}

          <span>
            {loading
              ? "送信中"
              : "送信"}
          </span>
        </Button>
      </div>

      <div
        className="
          flex
          justify-end
          px-1
        "
      >
        <span
          id={characterCountId}
          aria-live="polite"
          aria-atomic="true"
          className={`
            text-xs
            tabular-nums
            transition-colors
            motion-reduce:transition-none
            ${
              isNearCharacterLimit
                ? "font-semibold text-error"
                : "text-muted-foreground"
            }
          `}
        >
          <span aria-hidden="true">
            {content.length} /{" "}
            {MAX_COMMENT_LENGTH}
          </span>

          <span className="sr-only">
            {MAX_COMMENT_LENGTH}
            文字中
            {content.length}
            文字入力済み
          </span>
        </span>
      </div>

      <p
        id={statusId}
        aria-live="polite"
        aria-atomic="true"
        className="sr-only"
      >
        {loading
          ? "コメントを送信しています。"
          : ""}
      </p>
    </form>
  );
}
