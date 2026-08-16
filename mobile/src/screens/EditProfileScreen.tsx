import {
  useEffect,
  useState,
} from "react";
import {
  ArrowLeft,
  RefreshCw,
  Save,
} from "lucide-react";

import {
  AvatarPicker,
} from "../components/AvatarPicker";
import {
  supabase,
} from "../lib/supabase";
import {
  getProfileData,
  type ProfileData,
} from "../services/profile";
import {
  deleteUploadedAvatar,
  updateProfile,
  uploadAvatarFromUri,
} from "../services/profile-settings";

type EditProfileScreenProps = {
  userId: string;
  onBack: () => void;
  onSaved: () => void;
};

const MAX_USERNAME_LENGTH =
  40;

const MAX_BIO_LENGTH =
  160;

function EditProfileLoading() {
  return (
    <div
      className="edit-profile-loading"
      role="status"
      aria-live="polite"
    >
      <div className="edit-profile-loading-avatar" />

      <div className="edit-profile-loading-line edit-profile-loading-line-wide" />

      <div className="edit-profile-loading-line" />

      <p>
        プロフィールを
        読み込んでいます...
      </p>
    </div>
  );
}

function EditProfileError({
  message,
  onRetry,
  onBack,
}: {
  message: string;
  onRetry: () => void;
  onBack: () => void;
}) {
  return (
    <div
      className="edit-profile-load-error"
      role="alert"
    >
      <strong>
        プロフィールを
        読み込めませんでした
      </strong>

      <p>
        {message}
      </p>

      <button
        type="button"
        onClick={
          onRetry
        }
      >
        <RefreshCw
          aria-hidden="true"
        />

        もう一度試す
      </button>

      <button
        type="button"
        className="secondary"
        onClick={
          onBack
        }
      >
        <ArrowLeft
          aria-hidden="true"
        />

        戻る
      </button>
    </div>
  );
}

export function EditProfileScreen({
  userId,
  onBack,
  onSaved,
}: EditProfileScreenProps) {
  const [
    profile,
    setProfile,
  ] =
    useState<
      ProfileData | null
    >(
      null
    );

  const [
    username,
    setUsername,
  ] =
    useState("");

  const [
    bio,
    setBio,
  ] =
    useState("");

  const [
    selectedImageUri,
    setSelectedImageUri,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    loading,
    setLoading,
  ] =
    useState(
      true
    );

  const [
    saving,
    setSaving,
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

  const [
    loadError,
    setLoadError,
  ] =
    useState<
      string | null
    >(
      null
    );

  const [
    reloadKey,
    setReloadKey,
  ] =
    useState(
      0
    );

  useEffect(() => {
    let cancelled =
      false;

    async function loadProfile() {
      try {
        const nextProfile =
          await getProfileData(
            userId
          );

        if (cancelled) {
          return;
        }

        setProfile(
          nextProfile
        );

        setUsername(
          nextProfile.username ??
            ""
        );

        setBio(
          nextProfile.bio ??
            ""
        );

        setSelectedImageUri(
          null
        );

        setLoadError(
          null
        );
      } catch (
        profileError
      ) {
        if (cancelled) {
          return;
        }

        setLoadError(
          profileError instanceof
            Error
            ? profileError.message
            : "プロフィールの取得中に問題が発生しました。"
        );
      } finally {
        if (
          !cancelled
        ) {
          setLoading(
            false
          );
        }
      }
    }

    void loadProfile();

    return () => {
      cancelled =
        true;
    };
  }, [
    userId,
    reloadKey,
  ]);

  const normalizedUsername =
    username.trim();

  const normalizedBio =
    bio.trim();

  const usernameChanged =
    normalizedUsername !==
    (
      profile?.username ??
      ""
    ).trim();

  const bioChanged =
    normalizedBio !==
    (
      profile?.bio ??
      ""
    ).trim();

  const hasChanges =
    usernameChanged ||
    bioChanged ||
    Boolean(
      selectedImageUri
    );

  const canSave =
    Boolean(
      normalizedUsername
    ) &&
    normalizedUsername.length <=
      MAX_USERNAME_LENGTH &&
    normalizedBio.length <=
      MAX_BIO_LENGTH &&
    hasChanges &&
    !saving;

  async function handleSave() {
    if (
      !supabase ||
      !profile ||
      !canSave
    ) {
      return;
    }

    if (
      !normalizedUsername
    ) {
      setError(
        "ユーザー名を入力してください。"
      );

      return;
    }

    if (
      normalizedUsername.length >
      MAX_USERNAME_LENGTH
    ) {
      setError(
        `ユーザー名は${MAX_USERNAME_LENGTH}文字以内で入力してください。`
      );

      return;
    }

    if (
      normalizedBio.length >
      MAX_BIO_LENGTH
    ) {
      setError(
        `自己紹介は${MAX_BIO_LENGTH}文字以内で入力してください。`
      );

      return;
    }

    const client =
      supabase;

    let uploadedFilePath:
      | string
      | null =
      null;

    setSaving(
      true
    );

    setError(
      null
    );

    try {
      let nextAvatarUrl =
        profile.avatarUrl;

      if (
        selectedImageUri
      ) {
        const uploadedAvatar =
          await uploadAvatarFromUri(
            client,
            userId,
            selectedImageUri
          );

        nextAvatarUrl =
          uploadedAvatar.publicUrl;

        uploadedFilePath =
          uploadedAvatar.filePath;
      }

      await updateProfile(
        client,
        userId,
        {
          username:
            normalizedUsername,

          bio:
            normalizedBio,

          avatarUrl:
            nextAvatarUrl,
        }
      );

      onSaved();
    } catch (
      saveError
    ) {
      if (
        uploadedFilePath
      ) {
        await deleteUploadedAvatar(
          client,
          uploadedFilePath
        );
      }

      setError(
        saveError instanceof
          Error
          ? saveError.message
          : "プロフィールを保存できませんでした。"
      );
    } finally {
      setSaving(
        false
      );
    }
  }

  if (loading) {
    return (
      <section className="edit-profile-screen">
        <EditProfileLoading />
      </section>
    );
  }

  if (
    loadError ||
    !profile
  ) {
    return (
      <section className="edit-profile-screen">
        <EditProfileError
          message={
            loadError ??
            "プロフィールが見つかりませんでした。"
          }
          onRetry={() => {
            setLoading(
              true
            );

            setReloadKey(
              (
                currentKey
              ) =>
                currentKey +
                1
            );
          }}
          onBack={
            onBack
          }
        />
      </section>
    );
  }

  return (
    <section className="edit-profile-screen">
      <header className="edit-profile-header">
        <button
          type="button"
          className="detail-back-button"
          onClick={
            onBack
          }
          disabled={
            saving
          }
        >
          <ArrowLeft
            aria-hidden="true"
          />

          戻る
        </button>

        <div>
          <p className="eyebrow">
            Profile Settings
          </p>

          <h1>
            プロフィール編集
          </h1>

          <p className="lead">
            あなたらしいサウナライフを、
            プロフィールに。
          </p>
        </div>
      </header>

      <AvatarPicker
        currentAvatarUrl={
          profile.avatarUrl
        }
        selectedImageUri={
          selectedImageUri
        }
        disabled={
          saving
        }
        onSelect={(
          imageUri
        ) => {
          setSelectedImageUri(
            imageUri
          );

          setError(
            null
          );
        }}
        onReset={() => {
          setSelectedImageUri(
            null
          );

          setError(
            null
          );
        }}
      />

      <form
        className="edit-profile-form"
        onSubmit={(
          event
        ) => {
          event.preventDefault();

          void handleSave();
        }}
      >
        <div className="edit-profile-field">
          <label htmlFor="profile-username">
            ユーザー名
          </label>

          <input
            id="profile-username"
            type="text"
            value={
              username
            }
            onChange={(
              event
            ) => {
              setUsername(
                event.target
                  .value
                  .slice(
                    0,
                    MAX_USERNAME_LENGTH
                  )
              );

              setError(
                null
              );
            }}
            placeholder="TOTONOユーザー"
            autoComplete="nickname"
            maxLength={
              MAX_USERNAME_LENGTH
            }
            disabled={
              saving
            }
          />

          <div className="edit-profile-field-meta">
            <span>
              アプリ内で表示される名前です
            </span>

            <span>
              {username.length}
              /
              {MAX_USERNAME_LENGTH}
            </span>
          </div>
        </div>

        <div className="edit-profile-field">
          <label htmlFor="profile-bio">
            自己紹介
          </label>

          <textarea
            id="profile-bio"
            value={
              bio
            }
            onChange={(
              event
            ) => {
              setBio(
                event.target
                  .value
                  .slice(
                    0,
                    MAX_BIO_LENGTH
                  )
              );

              setError(
                null
              );
            }}
            placeholder="好きなサウナや、理想の整い方を書いてみましょう。"
            rows={5}
            maxLength={
              MAX_BIO_LENGTH
            }
            disabled={
              saving
            }
          />

          <div className="edit-profile-field-meta">
            <span>
              サウナ仲間にあなたを紹介しましょう
            </span>

            <span>
              {bio.length}
              /
              {MAX_BIO_LENGTH}
            </span>
          </div>
        </div>

        {error ? (
          <p
            className="edit-profile-error"
            role="alert"
          >
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          className="edit-profile-submit"
          disabled={
            !canSave
          }
        >
          <Save
            aria-hidden="true"
          />

          {saving
            ? selectedImageUri
              ? "画像とプロフィールを保存中..."
              : "プロフィールを保存中..."
            : "変更を保存"}
        </button>

        {!hasChanges ? (
          <p className="edit-profile-no-changes">
            変更すると保存ボタンが
            有効になります。
          </p>
        ) : null}
      </form>
    </section>
  );
}
