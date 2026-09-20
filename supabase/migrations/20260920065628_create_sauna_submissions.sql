create table public.sauna_submissions (
  id uuid primary key default gen_random_uuid(),

  submitted_by uuid not null
    references auth.users(id)
    on delete cascade,

  request_type text not null default 'create'
    check (
      request_type in (
        'create',
        'correction'
      )
    ),

  target_sauna_id uuid
    references public.saunas(id)
    on delete cascade,

  name text not null
    check (
      char_length(
        btrim(name)
      ) between 1 and 100
    ),

  prefecture text not null
    check (
      char_length(
        btrim(prefecture)
      ) between 1 and 20
    ),

  city text
    check (
      city is null
      or char_length(
        btrim(city)
      ) <= 100
    ),

  address text
    check (
      address is null
      or char_length(
        btrim(address)
      ) <= 300
    ),

  source_url text
    check (
      source_url is null
      or char_length(
        btrim(source_url)
      ) <= 2048
    ),

  note text
    check (
      note is null
      or char_length(
        btrim(note)
      ) <= 1000
    ),

  status text not null default 'pending'
    check (
      status in (
        'pending',
        'approved',
        'rejected',
        'merged'
      )
    ),

  reviewed_by uuid
    references auth.users(id)
    on delete set null,

  reviewed_at timestamptz,

  created_at timestamptz not null
    default now(),

  updated_at timestamptz not null
    default now(),

  constraint sauna_submissions_request_target_check
    check (
      (
        request_type = 'create'
        and target_sauna_id is null
      )
      or
      (
        request_type = 'correction'
        and target_sauna_id is not null
      )
    )
);

comment on table public.sauna_submissions is
  'ユーザーから送信されたサウナ施設の追加・修正リクエスト';

comment on column public.sauna_submissions.status is
  'pending、approved、rejected、mergedのいずれか';

create index sauna_submissions_submitted_by_created_at_idx
  on public.sauna_submissions (
    submitted_by,
    created_at desc
  );

create index sauna_submissions_status_created_at_idx
  on public.sauna_submissions (
    status,
    created_at asc
  );

create unique index sauna_submissions_pending_create_unique_idx
  on public.sauna_submissions (
    submitted_by,
    lower(
      btrim(name)
    ),
    lower(
      btrim(prefecture)
    )
  )
  where
    request_type = 'create'
    and status = 'pending';

create or replace function public.set_sauna_submissions_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();

  return new;
end;
$$;

create trigger set_sauna_submissions_updated_at
before update
on public.sauna_submissions
for each row
execute function public.set_sauna_submissions_updated_at();

alter table public.sauna_submissions
  enable row level security;

revoke all
  on table public.sauna_submissions
  from anon;

revoke all
  on table public.sauna_submissions
  from authenticated;

grant select, insert
  on table public.sauna_submissions
  to authenticated;

create policy sauna_submissions_select_own
on public.sauna_submissions
for select
to authenticated
using (
  submitted_by = auth.uid()
);

create policy sauna_submissions_insert_own_pending
on public.sauna_submissions
for insert
to authenticated
with check (
  submitted_by = auth.uid()
  and request_type = 'create'
  and target_sauna_id is null
  and status = 'pending'
  and reviewed_by is null
  and reviewed_at is null
);