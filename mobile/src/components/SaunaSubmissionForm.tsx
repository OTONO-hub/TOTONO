import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import {
  supabase,
} from "../lib/supabase";
import {
  createSaunaSubmission,
} from "../services/sauna-submissions";

type SaunaSubmissionFormProps = {
  currentUserId: string;
  initialName: string;
};

export function SaunaSubmissionForm({
  currentUserId,
  initialName,
}: SaunaSubmissionFormProps) {
  const [
    open,
    setOpen,
  ] = useState(false);

  const [
    name,
    setName,
  ] = useState(
    initialName
  );

  const [
    prefecture,
    setPrefecture,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    sourceUrl,
    setSourceUrl,
  ] = useState("");

  const [
    note,
    setNote,
  ] = useState("");

  const [
    submitting,
    setSubmitting,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState<
    string | null
  >(null);

  const [
    submitted,
    setSubmitted,
  ] = useState(false);

  useEffect(() => {
    setName(
      initialName
    );

    setOpen(false);
    setError(null);
    setSubmitted(false);
  }, [initialName]);

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!supabase) {
      setError(
        "Supabaseの設定が見つかりません。"
      );

      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await createSaunaSubmission(
        supabase,
        currentUserId,
        {
          name,
          prefecture,
          city,
          address,
          sourceUrl,
          note,
        }
      );

      setSubmitted(true);
    } catch (
      submissionError
    ) {
      setError(
        submissionError instanceof
          Error
          ? submissionError.message
          : "施設の追加リクエストを送信できませんでした。"
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="sauna-submission-success">
        <strong>
          リクエストを送信しました
        </strong>

        <p>
          内容を確認後、施設情報への追加を進めます。
        </p>
      </div>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        className="sauna-submission-open-button"
        onClick={() => {
          setOpen(true);
        }}
      >
        見つからない施設を追加リクエスト
      </button>
    );
  }

  return (
    <form
      className="sauna-submission-form"
      onSubmit={
        handleSubmit
      }
    >
      <div className="sauna-submission-heading">
        <strong>
          施設の追加をリクエスト
        </strong>

        <p>
          内容を確認してから、TOTONOの施設情報へ追加します。
        </p>
      </div>

      <label>
        <span>
          施設名
          <small>
            必須
          </small>
        </span>

        <input
          type="text"
          value={name}
          onChange={(
            event
          ) => {
            setName(
              event.target.value
            );
          }}
          maxLength={100}
          required
        />
      </label>

      <label>
        <span>
          都道府県
          <small>
            必須
          </small>
        </span>

        <input
          type="text"
          value={prefecture}
          onChange={(
            event
          ) => {
            setPrefecture(
              event.target.value
            );
          }}
          placeholder="例：東京都"
          maxLength={20}
          required
        />
      </label>

      <label>
        <span>
          市区町村
        </span>

        <input
          type="text"
          value={city}
          onChange={(
            event
          ) => {
            setCity(
              event.target.value
            );
          }}
          placeholder="例：新宿区"
          maxLength={100}
        />
      </label>

      <label>
        <span>
          住所
        </span>

        <input
          type="text"
          value={address}
          onChange={(
            event
          ) => {
            setAddress(
              event.target.value
            );
          }}
          maxLength={300}
        />
      </label>

      <label>
        <span>
          公式サイト・Googleマップ
        </span>

        <input
          type="url"
          value={sourceUrl}
          onChange={(
            event
          ) => {
            setSourceUrl(
              event.target.value
            );
          }}
          placeholder="https://"
          maxLength={2048}
        />
      </label>

      <label>
        <span>
          補足
        </span>

        <textarea
          value={note}
          onChange={(
            event
          ) => {
            setNote(
              event.target.value
            );
          }}
          placeholder="営業時間や施設情報など"
          maxLength={1000}
          rows={4}
        />
      </label>

      {error ? (
        <p className="sauna-submission-error">
          {error}
        </p>
      ) : null}

      <div className="sauna-submission-actions">
        <button
          type="button"
          className="sauna-submission-cancel-button"
          disabled={
            submitting
          }
          onClick={() => {
            setOpen(false);
            setError(null);
          }}
        >
          キャンセル
        </button>

        <button
          type="submit"
          className="sauna-submission-submit-button"
          disabled={
            submitting
          }
        >
          {submitting
            ? "送信しています..."
            : "追加をリクエスト"}
        </button>
      </div>
    </form>
  );
}