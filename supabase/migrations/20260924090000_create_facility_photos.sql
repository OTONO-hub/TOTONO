-- Facility Photo Coverage Sprint
-- 権利確認済みの施設写真だけを公開し、許諾証跡と削除履歴を保持する。

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

alter table public.admin_users enable row level security;

create or replace function public.is_totono_admin(check_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select
    check_user_id is not null
    and (
      coalesce(auth.jwt() -> 'app_metadata' ->> 'role', '') = 'admin'
      or exists (
        select 1
        from public.admin_users
        where user_id = check_user_id
      )
    );
$$;

revoke all on function public.is_totono_admin(uuid) from public;
grant execute on function public.is_totono_admin(uuid) to authenticated;

create policy "Admins can read admin membership"
on public.admin_users
for select
to authenticated
using (public.is_totono_admin(auth.uid()));

create table if not exists public.facility_photos (
  id uuid primary key default gen_random_uuid(),
  sauna_id uuid not null references public.saunas(id) on delete cascade,
  storage_path text not null unique,
  public_url text not null,
  source_type text not null,
  photographer_name text not null,
  rights_holder_name text not null,
  permission_scope text not null,
  permission_evidence_note text not null,
  permission_evidence_path text,
  source_url text,
  license_name text,
  license_url text,
  attribution_text text,
  captured_at date,
  review_status text not null default 'pending',
  review_note text,
  reviewed_by uuid references auth.users(id) on delete set null,
  reviewed_at timestamptz,
  is_hero boolean not null default false,
  sort_order integer not null default 0,
  created_by uuid not null references auth.users(id) on delete restrict,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  removed_at timestamptz,
  removed_by uuid references auth.users(id) on delete set null,
  removal_reason text,
  constraint facility_photos_source_type_check check (
    source_type in ('self_shot', 'facility_provided', 'open_license')
  ),
  constraint facility_photos_review_status_check check (
    review_status in ('pending', 'approved', 'rejected', 'removed')
  ),
  constraint facility_photos_open_license_check check (
    source_type <> 'open_license'
    or (
      nullif(btrim(coalesce(license_name, '')), '') is not null
      and nullif(btrim(coalesce(license_url, '')), '') is not null
      and nullif(btrim(coalesce(source_url, '')), '') is not null
    )
  ),
  constraint facility_photos_approved_review_check check (
    review_status <> 'approved'
    or (reviewed_by is not null and reviewed_at is not null)
  ),
  constraint facility_photos_removal_audit_check check (
    review_status <> 'removed'
    or (
      removed_at is not null
      and removed_by is not null
      and nullif(btrim(coalesce(removal_reason, '')), '') is not null
    )
  )
);

create unique index if not exists facility_photos_one_active_hero_per_sauna
on public.facility_photos(sauna_id)
where is_hero and review_status = 'approved' and removed_at is null;

create index if not exists facility_photos_sauna_status_idx
on public.facility_photos(sauna_id, review_status, sort_order, created_at);

alter table public.facility_photos enable row level security;

create policy "Admins can read all facility photos"
on public.facility_photos
for select
to authenticated
using (public.is_totono_admin(auth.uid()));

create policy "Admins can insert facility photos"
on public.facility_photos
for insert
to authenticated
with check (
  public.is_totono_admin(auth.uid())
  and created_by = auth.uid()
);

create policy "Admins can update facility photos"
on public.facility_photos
for update
to authenticated
using (public.is_totono_admin(auth.uid()))
with check (public.is_totono_admin(auth.uid()));

create or replace function public.set_facility_photo_hero(target_photo_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  target_sauna_id uuid;
  target_public_url text;
begin
  if auth.role() <> 'service_role' and not public.is_totono_admin(auth.uid()) then
    raise exception 'Administrator access required';
  end if;

  select sauna_id, public_url
  into target_sauna_id, target_public_url
  from public.facility_photos
  where id = target_photo_id
    and review_status = 'approved'
    and removed_at is null
  for update;

  if target_sauna_id is null then
    raise exception 'Approved facility photo not found';
  end if;

  update public.facility_photos
  set is_hero = false, updated_at = now()
  where sauna_id = target_sauna_id and is_hero = true;

  update public.facility_photos
  set is_hero = true, updated_at = now()
  where id = target_photo_id;

  update public.saunas
  set image_url = target_public_url, updated_at = now()
  where id = target_sauna_id;
end;
$$;

create or replace function public.refresh_facility_photo_hero(target_sauna_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  replacement_id uuid;
  replacement_url text;
begin
  if auth.role() <> 'service_role' and not public.is_totono_admin(auth.uid()) then
    raise exception 'Administrator access required';
  end if;

  select id, public_url
  into replacement_id, replacement_url
  from public.facility_photos
  where sauna_id = target_sauna_id
    and review_status = 'approved'
    and removed_at is null
  order by sort_order, created_at desc
  limit 1
  for update;

  update public.facility_photos
  set is_hero = false, updated_at = now()
  where sauna_id = target_sauna_id and is_hero = true;

  if replacement_id is not null then
    update public.facility_photos
    set is_hero = true, updated_at = now()
    where id = replacement_id;
  end if;

  update public.saunas
  set image_url = replacement_url, updated_at = now()
  where id = target_sauna_id;
end;
$$;

revoke all on function public.set_facility_photo_hero(uuid) from public;
revoke all on function public.refresh_facility_photo_hero(uuid) from public;
grant execute on function public.set_facility_photo_hero(uuid) to authenticated, service_role;
grant execute on function public.refresh_facility_photo_hero(uuid) to authenticated, service_role;

create table if not exists public.facility_photo_pilot_facilities (
  sauna_id uuid primary key references public.saunas(id) on delete cascade,
  selected_at timestamptz not null default now(),
  selected_by uuid references auth.users(id) on delete set null,
  note text
);

alter table public.facility_photo_pilot_facilities enable row level security;

create policy "Admins can manage facility photo pilot"
on public.facility_photo_pilot_facilities
for all
to authenticated
using (public.is_totono_admin(auth.uid()))
with check (public.is_totono_admin(auth.uid()));

-- 初回検証は、住所があり確認済みで画像未登録の15施設を対象にする。
insert into public.facility_photo_pilot_facilities (sauna_id, note)
select id, '初回10〜20施設検証枠'
from public.saunas
where is_verified = true
  and image_url is null
  and address is not null
order by prefecture nulls last, name
limit 15
on conflict (sauna_id) do nothing;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'facility-photos',
  'facility-photos',
  true,
  10485760,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'facility-photo-evidence',
  'facility-photo-evidence',
  false,
  10485760,
  array['image/jpeg', 'image/png', 'application/pdf']
)
on conflict (id) do update set
  public = excluded.public,
  file_size_limit = excluded.file_size_limit,
  allowed_mime_types = excluded.allowed_mime_types;

create policy "Admins can upload facility photos"
on storage.objects
for insert
to authenticated
with check (
  bucket_id in ('facility-photos', 'facility-photo-evidence')
  and public.is_totono_admin(auth.uid())
);

create policy "Admins can update facility photos storage"
on storage.objects
for update
to authenticated
using (
  bucket_id in ('facility-photos', 'facility-photo-evidence')
  and public.is_totono_admin(auth.uid())
)
with check (
  bucket_id in ('facility-photos', 'facility-photo-evidence')
  and public.is_totono_admin(auth.uid())
);

create policy "Admins can delete facility photos storage"
on storage.objects
for delete
to authenticated
using (
  bucket_id in ('facility-photos', 'facility-photo-evidence')
  and public.is_totono_admin(auth.uid())
);

create or replace view public.facility_photo_coverage_by_prefecture
with (security_invoker = true)
as
select
  coalesce(s.prefecture, '未設定') as prefecture,
  count(*)::integer as total_facilities,
  count(*) filter (
    where exists (
      select 1
      from public.facility_photos fp
      where fp.sauna_id = s.id
        and fp.review_status = 'approved'
        and fp.is_hero = true
        and fp.removed_at is null
    )
  )::integer as covered_facilities,
  round(
    100.0 * count(*) filter (
      where exists (
        select 1
        from public.facility_photos fp
        where fp.sauna_id = s.id
          and fp.review_status = 'approved'
          and fp.is_hero = true
          and fp.removed_at is null
      )
    ) / nullif(count(*), 0),
    1
  ) as coverage_percent
from public.saunas s
group by coalesce(s.prefecture, '未設定');

grant select on public.facility_photo_coverage_by_prefecture to authenticated;

comment on table public.facility_photos is
  '権利確認済み施設写真の台帳。削除時も行を残し、Storageのみ削除する。';
comment on column public.facility_photos.permission_evidence_path is
  '非公開facility-photo-evidenceバケット内の許諾証拠ファイル。';
