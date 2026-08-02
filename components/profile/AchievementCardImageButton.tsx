"use client";

import { useState } from "react";
import {
  Check,
  Download,
  LoaderCircle,
  Share2,
} from "lucide-react";
import {
  toBlob,
  toPng,
} from "html-to-image";
import { toast } from "sonner";

type AchievementCardImageButtonProps = {
  year: number;
};

type ActionType =
  | "download"
  | "share"
  | null;

function createFileName(
  year: number
): string {
  return `totono-achievement-${year}.png`;
}

function createShareText(
  year: number
): string {
  return [
    `${year}年のサウナ実績をTOTONOで振り返りました。`,
    "",
    "サウナへ行く前から、整い始める。",
    "#TOTONO",
    "#サ活",
    "#サウナ",
  ].join("\n");
}

async function copyTextToClipboard(
  text: string
): Promise<void> {
  if (
    navigator.clipboard &&
    typeof navigator.clipboard.writeText ===
      "function"
  ) {
    await navigator.clipboard.writeText(
      text
    );

    return;
  }

  const textArea =
    document.createElement("textarea");

  textArea.value = text;

  textArea.setAttribute(
    "readonly",
    ""
  );

  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.opacity = "0";

  document.body.appendChild(textArea);

  textArea.select();

  textArea.setSelectionRange(
    0,
    text.length
  );

  const copied =
    document.execCommand("copy");

  textArea.remove();

  if (!copied) {
    throw new Error(
      "共有文をコピーできませんでした"
    );
  }
}

function shouldIncludeNode(
  node: HTMLElement
): boolean {
  if (!(node instanceof Element)) {
    return true;
  }

  return (
    node.getAttribute(
      "data-html-to-image-ignore"
    ) !== "true"
  );
}

function getCardElement(): HTMLElement | null {
  return document.getElementById(
    "totono-achievement-card"
  );
}

async function waitForFonts(): Promise<void> {
  if ("fonts" in document) {
    await document.fonts.ready;
  }
}

async function createAchievementImageBlob(
  cardElement: HTMLElement
): Promise<Blob> {
  const imageBlob = await toBlob(
    cardElement,
    {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#302d2d",
      filter: shouldIncludeNode,
    }
  );

  if (!imageBlob) {
    throw new Error(
      "画像データを作成できませんでした"
    );
  }

  return imageBlob;
}

async function downloadAchievementImage(
  cardElement: HTMLElement,
  year: number
): Promise<void> {
  const imageDataUrl = await toPng(
    cardElement,
    {
      cacheBust: true,
      pixelRatio: 2,
      backgroundColor: "#302d2d",
      filter: shouldIncludeNode,
    }
  );

  const downloadLink =
    document.createElement("a");

  downloadLink.download =
    createFileName(year);

  downloadLink.href =
    imageDataUrl;

  document.body.appendChild(
    downloadLink
  );

  downloadLink.click();
  downloadLink.remove();
}

function isShareCancellation(
  error: unknown
): boolean {
  return (
    error instanceof DOMException &&
    error.name === "AbortError"
  );
}

export function AchievementCardImageButton({
  year,
}: AchievementCardImageButtonProps) {
  const [activeAction, setActiveAction] =
    useState<ActionType>(null);

  const [
    completedAction,
    setCompletedAction,
  ] = useState<ActionType>(null);

  const isProcessing =
    activeAction !== null;

  const clearCompletedAction = () => {
    window.setTimeout(() => {
      setCompletedAction(null);
    }, 2000);
  };

  const handleDownload = async () => {
    if (isProcessing) {
      return;
    }

    const cardElement =
      getCardElement();

    if (!cardElement) {
      toast.error(
        "実績カードが見つかりませんでした"
      );

      return;
    }

    setActiveAction("download");
    setCompletedAction(null);

    try {
      await waitForFonts();

      await downloadAchievementImage(
        cardElement,
        year
      );

      setCompletedAction("download");

      toast.success(
        "実績カードを画像として保存しました"
      );

      clearCompletedAction();
    } catch (error) {
      console.error(
        "実績カードの画像保存に失敗しました:",
        error
      );

      toast.error(
        "画像を保存できませんでした。もう一度お試しください。"
      );
    } finally {
      setActiveAction(null);
    }
  };

  const handleShare = async () => {
    if (isProcessing) {
      return;
    }

    const cardElement =
      getCardElement();

    if (!cardElement) {
      toast.error(
        "実績カードが見つかりませんでした"
      );

      return;
    }

    setActiveAction("share");
    setCompletedAction(null);

    try {
      await waitForFonts();

      const imageBlob =
        await createAchievementImageBlob(
          cardElement
        );

      const imageFile = new File(
        [imageBlob],
        createFileName(year),
        {
          type: "image/png",
        }
      );

      const shareText =
        createShareText(year);

      const canShareImage =
        typeof navigator.share ===
          "function" &&
        typeof navigator.canShare ===
          "function" &&
        navigator.canShare({
          files: [imageFile],
        });

      if (!canShareImage) {
        await downloadAchievementImage(
          cardElement,
          year
        );

        try {
          await copyTextToClipboard(
            shareText
          );

          toast.success(
            "画像を保存し、投稿文をコピーしました"
          );
        } catch (copyError) {
          console.error(
            "共有文のコピーに失敗しました:",
            copyError
          );

          toast.info(
            "画像を保存しました"
          );
        }

        setCompletedAction("download");

        clearCompletedAction();

        return;
      }

      await navigator.share({
        title: `${year}年 TOTONO サウナ実績`,
        text: shareText,
        files: [imageFile],
      });

      setCompletedAction("share");

      toast.success(
        "共有メニューを開きました"
      );

      clearCompletedAction();
    } catch (error) {
      if (isShareCancellation(error)) {
        return;
      }

      console.error(
        "実績カードの共有に失敗しました:",
        error
      );

      toast.error(
        "画像を共有できませんでした。もう一度お試しください。"
      );
    } finally {
      setActiveAction(null);
    }
  };

  return (
    <div
      data-html-to-image-ignore="true"
      className="
        flex
        flex-wrap
        justify-end
        gap-2
      "
    >
      <button
        type="button"
        onClick={handleShare}
        disabled={isProcessing}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          bg-[#3e3a3a]
          px-4
          py-2.5
          text-sm
          font-semibold
          text-white
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:bg-[#302d2d]
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:translate-y-0
          disabled:hover:shadow-sm
        "
      >
        {activeAction === "share" ? (
          <>
            <LoaderCircle
              className="
                size-4
                animate-spin
              "
              strokeWidth={1.8}
            />

            画像を作成中
          </>
        ) : completedAction ===
          "share" ? (
          <>
            <Check
              className="size-4"
              strokeWidth={1.8}
            />

            共有しました
          </>
        ) : (
          <>
            <Share2
              className="size-4"
              strokeWidth={1.8}
            />

            画像を共有
          </>
        )}
      </button>

      <button
        type="button"
        onClick={handleDownload}
        disabled={isProcessing}
        className="
          inline-flex
          items-center
          justify-center
          gap-2
          rounded-full
          border border-black/8
          bg-white
          px-4
          py-2.5
          text-sm
          font-semibold
          text-[#3e3a3a]
          shadow-sm
          transition
          hover:-translate-y-0.5
          hover:border-black/12
          hover:shadow-md
          disabled:cursor-not-allowed
          disabled:opacity-60
          disabled:hover:translate-y-0
          disabled:hover:shadow-sm
        "
      >
        {activeAction ===
        "download" ? (
          <>
            <LoaderCircle
              className="
                size-4
                animate-spin
              "
              strokeWidth={1.8}
            />

            画像を作成中
          </>
        ) : completedAction ===
          "download" ? (
          <>
            <Check
              className="size-4"
              strokeWidth={1.8}
            />

            保存しました
          </>
        ) : (
          <>
            <Download
              className="size-4"
              strokeWidth={1.8}
            />

            画像で保存
          </>
        )}
      </button>
    </div>
  );
}
