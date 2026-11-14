-- 公開画面では、承認済みHero写真のクレジット情報だけを返す。
-- 許諾証拠・審査メモ・削除履歴などの管理情報は公開しない。
create or replace function public.get_public_facility_photo_attribution(
  target_sauna_id uuid
)
returns table (
  public_url text,
  source_type text,
  photographer_name text,
  source_url text,
  license_name text,
  license_url text,
  attribution_text text
)
language sql
stable
security definer
set search_path = public
as $$
  select
    fp.public_url,
    fp.source_type,
    fp.photographer_name,
    fp.source_url,
    fp.license_name,
    fp.license_url,
    fp.attribution_text
  from public.facility_photos fp
  where fp.sauna_id = target_sauna_id
    and fp.review_status = 'approved'
    and fp.is_hero = true
    and fp.removed_at is null
  limit 1;
$$;

revoke all on function public.get_public_facility_photo_attribution(uuid)
from public;

grant execute
on function public.get_public_facility_photo_attribution(uuid)
to anon, authenticated;

comment on function public.get_public_facility_photo_attribution(uuid) is
  '承認済みHero施設写真の公開可能なクレジット情報だけを返す。';
