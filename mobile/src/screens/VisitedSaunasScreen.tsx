import { useEffect, useState } from "react";
import { ArrowLeft, CalendarDays, ChevronRight, MapPin, RefreshCw, Waves } from "lucide-react";

import { getSaunaById, type Sauna } from "../services/saunas";
import { getVisitedSaunas, type VisitedSauna } from "../services/visited-saunas";
import { supabase } from "../lib/supabase";

type Props = { userId: string; onBack: () => void; onSelectSauna: (sauna: Sauna) => void };

function formatDate(value: string): string {
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? value : new Intl.DateTimeFormat("ja-JP", { year: "numeric", month: "short", day: "numeric" }).format(date);
}

export function VisitedSaunasScreen({ userId, onBack, onSelectSauna }: Props) {
  const [items, setItems] = useState<VisitedSauna[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openingId, setOpeningId] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const result = await getVisitedSaunas(userId);
        if (!cancelled) { setItems(result); setError(null); }
      } catch (loadError) {
        if (!cancelled) setError(loadError instanceof Error ? loadError.message : "行ったサウナを読み込めませんでした。");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void load();
    return () => { cancelled = true; };
  }, [userId, reloadKey]);

  async function openDetail(item: VisitedSauna) {
    if (!supabase || !item.saunaId || openingId) return;
    setOpeningId(item.saunaId);
    setError(null);
    try {
      const sauna = await getSaunaById(supabase, item.saunaId);
      if (!sauna) throw new Error("施設情報が見つかりませんでした。");
      onSelectSauna(sauna);
    } catch (openError) {
      setError(openError instanceof Error ? openError.message : "施設詳細を開けませんでした。");
      setOpeningId(null);
    }
  }

  return <section className="saved-posts-screen">
    <header className="saved-posts-header">
      <button type="button" className="detail-back-button" onClick={onBack}><ArrowLeft aria-hidden="true" />プロフィールへ戻る</button>
      <p className="eyebrow">Visited</p><h1>行ったサウナ</h1>
      <p className="lead">投稿から自動で残った、あなたの訪問施設です。</p>
    </header>
    {error ? <p className="saved-posts-action-error" role="alert">{error}</p> : null}
    {loading ? <div className="saved-posts-loading" role="status">{[1,2,3].map((n) => <div key={n} className="saved-posts-loading-card"><div /><span /><span /></div>)}<p>行ったサウナを読み込んでいます...</p></div>
    : error && items.length === 0 ? <div className="saved-posts-error"><strong>行ったサウナを読み込めませんでした</strong><p>{error}</p><button type="button" onClick={() => { setLoading(true); setReloadKey((v) => v + 1); }}><RefreshCw />もう一度試す</button></div>
    : items.length === 0 ? <div className="saved-posts-empty"><div className="saved-posts-empty-icon"><MapPin /></div><strong>行ったサウナはまだありません</strong><p>サ活を投稿すると、訪れた施設が自動で追加されます。</p></div>
    : <div className="saved-posts-list">{items.map((item) => <article key={item.saunaId ?? item.saunaName} className="saved-post-card">
      <button type="button" className="saved-post-main" disabled={!item.saunaId || openingId === item.saunaId} onClick={() => { void openDetail(item); }}>
        {item.imageUrl ? <div className="saved-post-image"><img src={item.imageUrl} alt={`${item.saunaName}の施設画像`} loading="lazy" /></div> : <div className="saved-post-image saved-post-image-placeholder"><Waves /></div>}
        <div className="saved-post-content"><div className="saved-post-title"><MapPin /><h2>{item.saunaName}</h2></div>
          <div className="saved-post-meta"><span><CalendarDays />最終訪問 {formatDate(item.latestVisitDate)}</span><span>{item.visitCount}回訪問</span></div>
          {item.saunaId ? <span className="saved-post-detail-link">{openingId === item.saunaId ? "読み込み中..." : "施設詳細を見る"}<ChevronRight /></span> : <p>手動入力の施設</p>}
        </div>
      </button>
    </article>)}</div>}
  </section>;
}
