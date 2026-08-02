"use client";

import { useState } from "react";
import {
  Check,
  Share2,
} from "lucide-react";
import { toast } from "sonner";

import type { AnnualSaunaReport } from "@/services/profile-insights";

type AnnualReportShareButtonProps = {
  report: AnnualSaunaReport;
};

function createShareText(
  report: AnnualSaunaReport
): string {
  const lines = [
    `♨️ ${report.year}年のサ活レポート`,
    "",
    `サ活：${report.visitCount}回`,
    `訪問施設：${report.visitedSaunas}施設`,
    `合計セット：${report.totalSets}セット`,
    `平均評価：${report.averageRating}`,
  ];

  if (report.topSauna) {
    lines.push(
      "",
      `ホームサウナ：${report.topSauna.saunaName}`
    );
  }

  if (report.busiestMonth) {
    lines.push(
      `最も活動した月：${report.busiestMonth.label}（${report.busiestMonth.visitCount}回）`
    );
  }

  lines.push("", "#TOTONO #サ活");

  return lines.join("\n");
}

async function copyShareText(
  text: string
): Promise<void> {
  if (
    typeof navigator !== "undefined" &&
    navigator.clipboard
  ) {
    await navigator.clipboard.writeText(
      text
    );

    return;
  }

  const textArea =
    document.createElement("textarea");

  textArea.value = text;
  textArea.style.position = "fixed";
  textArea.style.left = "-9999px";
  textArea.style.top = "0";

  document.body.appendChild(textArea);

  textArea.focus();
  textArea.select();

  const copied =
    document.execCommand("copy");

  document.body.removeChild(textArea);

  if (!copied) {
    throw new Error(
      "クリップボードへのコピーに失敗しました"
    );
  }
}

export function AnnualReportShareButton({
  report,
}: AnnualReportShareButtonProps) {
  const [copied, setCopied] =
    useState(false);

  const handleShare = async () => {
    const shareText =
      createShareText(report);

    const shareUrl =
      window.location.href;

    try {
      if (
        typeof navigator.share ===
        "function"
      ) {
        await navigator.share({
          title: `${report.year}年のサ活レポート`,
          text: shareText,
          url: shareUrl,
        });

        return;
      }

      await copyShareText(
        `${shareText}\n${shareUrl}`
      );

      setCopied(true);

      toast.success(
        "サ活レポートをコピーしました"
      );

      window.setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      if (
        error instanceof DOMException &&
        error.name === "AbortError"
      ) {
        return;
      }

      console.error(
        "年間レポートの共有に失敗しました:",
        error
      );

      toast.error(
        "共有できませんでした。もう一度お試しください。"
      );
    }
  };

  return (
    <button
      type="button"
      onClick={handleShare}
      disabled={report.visitCount === 0}
      className="
        inline-flex
        items-center
        justify-center
        gap-2
        rounded-full
        border border-white/15
        bg-white/10
        px-4
        py-2.5
        text-sm
        font-semibold
        text-white
        backdrop-blur-sm
        transition
        hover:-translate-y-0.5
        hover:bg-white/15
        disabled:cursor-not-allowed
        disabled:opacity-40
        disabled:hover:translate-y-0
      "
    >
      {copied ? (
        <>
          <Check
            className="size-4"
            strokeWidth={1.8}
          />

          コピー済み
        </>
      ) : (
        <>
          <Share2
            className="size-4"
            strokeWidth={1.8}
          />

          レポートを共有
        </>
      )}
    </button>
  );
}
