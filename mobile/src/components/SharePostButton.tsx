import {
  useState,
} from "react";
import {
  Check,
  Share2,
} from "lucide-react";
import {
  Share,
} from "@capacitor/share";

type SharePostButtonProps = {
  postId: string;
  saunaName: string;
};

const DEFAULT_WEB_URL =
  "https://www.totono-sauna.com";

function getPublicWebUrl(): string {
  const configuredUrl =
    import.meta.env
      .VITE_PUBLIC_WEB_URL
      ?.trim();

  return (
    configuredUrl ||
    DEFAULT_WEB_URL
  ).replace(
    /\/+$/,
    ""
  );
}

function isShareCancellation(
  error: unknown
): boolean {
  if (
    !(error instanceof Error)
  ) {
    return false;
  }

  const message =
    error.message
      .toLocaleLowerCase();

  return (
    message.includes(
      "cancel"
    ) ||
    message.includes(
      "dismiss"
    ) ||
    message.includes(
      "closed"
    )
  );
}

export function SharePostButton({
  postId,
  saunaName,
}: SharePostButtonProps) {
  const [
    sharing,
    setSharing,
  ] =
    useState(
      false
    );

  const [
    shared,
    setShared,
  ] =
    useState(
      false
    );

  const [
    error,
    setError,
  ] =
    useState<
      string | null
    >(
      null
    );

  async function handleShare() {
    if (sharing) {
      return;
    }

    setSharing(
      true
    );

    setShared(
      false
    );

    setError(
      null
    );

    const postUrl =
      `${getPublicWebUrl()}/posts/${postId}`;

    try {
      await Share.share({
        title:
          `${saunaName}でのサ活 | TOTONO`,

        text:
          `${saunaName}でのサ活をTOTONOでチェック`,

        url:
          postUrl,

        dialogTitle:
          "サ活を共有",
      });

      setShared(
        true
      );

      window.setTimeout(
        () => {
          setShared(
            false
          );
        },
        2200
      );
    } catch (
      shareError
    ) {
      if (
        isShareCancellation(
          shareError
        )
      ) {
        return;
      }

      setError(
        shareError instanceof
          Error
          ? shareError.message
          : "投稿を共有できませんでした。"
      );
    } finally {
      setSharing(
        false
      );
    }
  }

  return (
    <div className="share-post-control">
      <button
        type="button"
        className={
          shared
            ? "share-post-button shared"
            : "share-post-button"
        }
        onClick={() => {
          void handleShare();
        }}
        disabled={
          sharing
        }
      >
        {shared ? (
          <Check
            aria-hidden="true"
          />
        ) : (
          <Share2
            aria-hidden="true"
          />
        )}

        <span>
          {sharing
            ? "共有を準備中..."
            : shared
              ? "共有しました"
              : "共有する"}
        </span>
      </button>

      {error ? (
        <p
          className="share-post-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </div>
  );
}
