# Facility Photo Coverage 運用手順

## 現行監査

- 施設詳細、検索、Today、行きたい、訪問済みは `saunas.image_url` を参照する。
- Web / iOS施設詳細には写真なしプレースホルダーがある。
- 投稿画像のStorage実装は存在するが、施設写真の権利情報・審査・削除監査を保持する専用台帳はなかった。
- 直近のProduct HQ確認値は全国1,006施設。マイグレーション適用後は管理画面の実数を正とする。
- 既存の `saunas.image_url` だけでは、権利確認済み写真か判定できないため掲載済み件数には含めない。

## 登録できる写真

登録可能なのは次の3種類だけ。

1. TOTONOによる自社撮影
2. 施設から掲載許諾を得て提供された写真
3. 商用利用・改変・再配布条件を確認したオープンライセンス写真

Google検索・Google Maps・公式サイトからの無断転載、既存投稿写真の無断転用、別施設写真の流用は禁止する。

## 初回セットアップ

1. `20260924090000_create_facility_photos.sql` をSupabaseへ適用する。
2. 管理者ユーザーを登録する（メールアドレスは実際の管理者へ置換）。

```sql
insert into public.admin_users (user_id)
select id
from auth.users
where email = 'ADMIN_EMAIL@example.com'
on conflict (user_id) do nothing;
```

3. `/admin/facility-photos` を開く。
4. 「検証」と表示される15施設へ、権利確認済みの外観写真を登録する。

## 登録時チェック

- 写真と施設名・住所が一致する。
- 外観が判別でき、人物・車両番号など不要な個人情報が写っていない。
- 撮影者、権利者、許諾範囲、許諾証拠メモが入力されている。
- 施設提供は、提供者・同意日・許可された媒体と加工範囲が証拠に残っている。
- オープンライセンスは、出典URL、ライセンス名、ライセンスURL、必要なクレジットを登録している。
- Googleや公式サイトの画像を保存したものではない。

## 10〜20施設の検証ゲート

全国展開前に次をすべて確認する。

| 確認対象 | 合格条件 |
|---|---|
| Web施設詳細 | Heroが正しい施設写真に変わり、写真なし施設はプレースホルダーのまま |
| Web検索・Today | 同じHeroが表示され、縦横比の崩れがない |
| iOS実機 | sync後、施設詳細・検索・Todayで表示できる |
| 権限なしユーザー | 管理画面は404、アップロードAPIは403 |
| 未ログイン | 管理画面はログインへ遷移、APIは401 |
| 許諾証拠 | 公開URLでは取得できない |
| 削除 | 公開写真と非公開証拠がStorageから消える |
| 削除後Hero | 次の承認済み写真へ切替、なければプレースホルダーになる |
| 監査 | 削除行に `removed_at`、`removed_by`、`removal_reason` が残る |
| 進捗 | 全国件数、未登録件数、都道府県別掲載率が一致する |

## 確認SQL

```sql
select
  count(*) as total_facilities,
  count(*) filter (
    where exists (
      select 1
      from public.facility_photos fp
      where fp.sauna_id = saunas.id
        and fp.review_status = 'approved'
        and fp.is_hero
        and fp.removed_at is null
    )
  ) as covered_facilities
from public.saunas;

select *
from public.facility_photo_coverage_by_prefecture
order by total_facilities desc;

select s.id, s.name, s.prefecture
from public.saunas s
where not exists (
  select 1
  from public.facility_photos fp
  where fp.sauna_id = s.id
    and fp.review_status = 'approved'
    and fp.is_hero
    and fp.removed_at is null
)
order by s.prefecture, s.name;
```

## 削除対応

管理画面の「原本を削除して監査記録を残す」を使用する。公開写真、非公開の許諾証拠をStorageから削除し、写真台帳は `removed` 状態で保持する。DB行を直接削除しない。
