"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";

type SaunaOption = {
  id: string;
  name: string;
  prefecture: string | null;
  isPilot: boolean;
};

type PhotoRow = {
  id: string;
  publicUrl: string;
  saunaName: string;
  sourceType: string;
  photographerName: string;
  createdAt: string;
};

export function FacilityPhotoManager({
  saunas,
  photos,
}: {
  saunas: SaunaOption[];
  photos: PhotoRow[];
}) {
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setMessage("");

    try {
      const response = await fetch("/api/admin/facility-photos", {
        method: "POST",
        body: new FormData(event.currentTarget),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "登録に失敗しました。");
      event.currentTarget.reset();
      setMessage("外観写真を承認済みHeroとして登録しました。");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "登録に失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  async function removePhoto(photoId: string) {
    const reason = window.prompt("削除理由を入力してください。監査履歴に保存されます。");
    if (!reason?.trim()) return;

    setBusy(true);
    setMessage("");
    try {
      const response = await fetch(`/api/admin/facility-photos/${photoId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason }),
      });
      const result = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(result.error ?? "削除に失敗しました。");
      setMessage("Storage原本を削除し、削除監査履歴を保存しました。");
      router.refresh();
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "削除に失敗しました。");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-10">
      <form onSubmit={handleSubmit} className="rounded-3xl border border-black/10 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-bold text-[#282322]">権利確認済み外観写真を登録</h2>
        <p className="mt-2 text-sm leading-6 text-black/60">
          Google・公式サイトの無断転載、投稿写真の転用、別施設写真の流用は禁止です。
        </p>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2 text-sm font-semibold">
            施設
            <select name="saunaId" required className="rounded-xl border border-black/15 bg-white px-3 py-3">
              <option value="">選択してください</option>
              {saunas.map((sauna) => (
                <option key={sauna.id} value={sauna.id}>
                  {sauna.isPilot ? "【検証】" : ""}{sauna.prefecture ?? "地域未設定"}｜{sauna.name}
                </option>
              ))}
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            登録元
            <select name="sourceType" required className="rounded-xl border border-black/15 bg-white px-3 py-3">
              <option value="self_shot">自社撮影</option>
              <option value="facility_provided">施設提供</option>
              <option value="open_license">条件適合オープンライセンス</option>
            </select>
          </label>

          <label className="grid gap-2 text-sm font-semibold">
            撮影者
            <input name="photographerName" required className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            権利者
            <input name="rightsHolderName" required className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            許諾範囲
            <input name="permissionScope" required placeholder="例：TOTONO Web・iOS・告知素材での掲載とトリミング" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold md:col-span-2">
            許諾内容・証拠メモ
            <textarea name="permissionEvidenceNote" required rows={3} placeholder="同意日、メール件名、自社撮影台帳番号など" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            外観写真（JPEG / PNG / WebP、10MB以下）
            <input name="photo" type="file" accept="image/jpeg,image/png,image/webp" required className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            許諾証拠（非公開、JPEG / PNG / PDF）
            <input name="evidence" type="file" accept="image/jpeg,image/png,application/pdf" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            撮影日
            <input name="capturedAt" type="date" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            出典URL
            <input name="sourceUrl" type="url" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            ライセンス名
            <input name="licenseName" placeholder="例：CC BY 4.0" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            ライセンスURL
            <input name="licenseUrl" type="url" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            クレジット表記
            <input name="attributionText" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-semibold">
            審査メモ
            <input name="reviewNote" placeholder="権利・施設一致・画質を確認" className="rounded-xl border border-black/15 px-3 py-3" />
          </label>
        </div>

        {message ? <p role="status" className="mt-5 rounded-xl bg-[#eef7fb] px-4 py-3 text-sm">{message}</p> : null}
        <button disabled={busy} className="mt-6 rounded-full bg-[#282322] px-6 py-3 text-sm font-bold text-white disabled:opacity-50">
          {busy ? "処理中…" : "審査済みHeroとして登録"}
        </button>
      </form>

      <section>
        <h2 className="text-xl font-bold text-[#282322]">登録済み写真</h2>
        <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {photos.map((photo) => (
            <article key={photo.id} className="overflow-hidden rounded-2xl border border-black/10 bg-white">
              <div className="relative aspect-[16/9] bg-black/5">
                <Image src={photo.publicUrl} alt={`${photo.saunaName}の外観`} fill sizes="(max-width: 768px) 100vw, 33vw" className="object-cover" />
              </div>
              <div className="space-y-1 p-4 text-sm">
                <h3 className="font-bold">{photo.saunaName}</h3>
                <p className="text-black/60">{photo.sourceType}｜撮影者 {photo.photographerName}</p>
                <p className="text-black/50">{new Date(photo.createdAt).toLocaleDateString("ja-JP")}</p>
                <button type="button" disabled={busy} onClick={() => void removePhoto(photo.id)} className="mt-3 text-sm font-bold text-red-700 disabled:opacity-50">
                  原本を削除して監査記録を残す
                </button>
              </div>
            </article>
          ))}
          {photos.length === 0 ? <p className="text-sm text-black/60">承認済み写真はまだありません。</p> : null}
        </div>
      </section>
    </div>
  );
}
