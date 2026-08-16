import {
  useState,
} from "react";
import {
  Camera,
  ImagePlus,
  RotateCcw,
  UserRound,
} from "lucide-react";
import {
  CameraResultType,
  CameraSource,
  Camera as CapacitorCamera,
} from "@capacitor/camera";

type AvatarPickerProps = {
  currentAvatarUrl:
    | string
    | null;
  selectedImageUri:
    | string
    | null;
  disabled?: boolean;
  onSelect: (
    imageUri: string
  ) => void;
  onReset: () => void;
};

function isCancellationError(
  error: unknown
): boolean {
  if (
    !(error instanceof Error)
  ) {
    return false;
  }

  const normalizedMessage =
    error.message
      .toLocaleLowerCase();

  return (
    normalizedMessage.includes(
      "cancel"
    ) ||
    normalizedMessage.includes(
      "canceled"
    ) ||
    normalizedMessage.includes(
      "cancelled"
    ) ||
    normalizedMessage.includes(
      "user cancelled"
    )
  );
}

export function AvatarPicker({
  currentAvatarUrl,
  selectedImageUri,
  disabled = false,
  onSelect,
  onReset,
}: AvatarPickerProps) {
  const [
    selecting,
    setSelecting,
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

  const previewUrl =
    selectedImageUri ??
    currentAvatarUrl;

  async function handleSelectImage() {
    if (
      selecting ||
      disabled
    ) {
      return;
    }

    setSelecting(
      true
    );

    setError(
      null
    );

    try {
      const photo =
        await CapacitorCamera.getPhoto({
          quality:
            85,

          allowEditing:
            true,

          resultType:
            CameraResultType.Uri,

          source:
            CameraSource.Prompt,

          width:
            1024,

          height:
            1024,

          correctOrientation:
            true,

          promptLabelHeader:
            "プロフィール画像",

          promptLabelPhoto:
            "写真から選ぶ",

          promptLabelPicture:
            "カメラで撮影",

          promptLabelCancel:
            "キャンセル",
        });

      const imageUri =
        photo.webPath ??
        photo.path;

      if (!imageUri) {
        throw new Error(
          "選択した画像を読み込めませんでした。"
        );
      }

      onSelect(
        imageUri
      );
    } catch (
      selectionError
    ) {
      if (
        isCancellationError(
          selectionError
        )
      ) {
        return;
      }

      setError(
        selectionError instanceof
          Error
          ? selectionError.message
          : "画像を選択できませんでした。"
      );
    } finally {
      setSelecting(
        false
      );
    }
  }

  function handleReset() {
    if (
      selecting ||
      disabled
    ) {
      return;
    }

    setError(
      null
    );

    onReset();
  }

  return (
    <section
      className="avatar-picker"
      aria-labelledby="avatar-picker-heading"
    >
      <div className="avatar-picker-heading">
        <div>
          <p className="eyebrow">
            Profile Image
          </p>

          <h2 id="avatar-picker-heading">
            プロフィール画像
          </h2>
        </div>
      </div>

      <div className="avatar-picker-content">
        <div className="avatar-picker-preview">
          {previewUrl ? (
            <img
              src={
                previewUrl
              }
              alt="プロフィール画像のプレビュー"
            />
          ) : (
            <UserRound
              aria-hidden="true"
            />
          )}

          {selectedImageUri ? (
            <span className="avatar-picker-new-label">
              NEW
            </span>
          ) : null}
        </div>

        <div className="avatar-picker-actions">
          <button
            type="button"
            className="avatar-picker-select"
            onClick={() => {
              void handleSelectImage();
            }}
            disabled={
              selecting ||
              disabled
            }
          >
            {selecting ? (
              <Camera
                className="spinning"
                aria-hidden="true"
              />
            ) : (
              <ImagePlus
                aria-hidden="true"
              />
            )}

            {selecting
              ? "画像を準備しています..."
              : previewUrl
                ? "画像を変更する"
                : "画像を選択する"}
          </button>

          {selectedImageUri ? (
            <button
              type="button"
              className="avatar-picker-reset"
              onClick={
                handleReset
              }
              disabled={
                selecting ||
                disabled
              }
            >
              <RotateCcw
                aria-hidden="true"
              />

              選択を戻す
            </button>
          ) : null}
        </div>
      </div>

      <p className="avatar-picker-help">
        正方形に近い写真がおすすめです。
        最大5MBまでアップロードできます。
      </p>

      {error ? (
        <p
          className="avatar-picker-error"
          role="alert"
        >
          {error}
        </p>
      ) : null}
    </section>
  );
}
