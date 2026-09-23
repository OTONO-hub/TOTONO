create table if not exists public.product_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  event_name text not null,
  platform text not null default 'ios',
  sauna_id uuid references public.saunas(id) on delete set null,
  recommendation_reason text,
  session_position integer,
  source text not null default 'today_next_sauna',
  created_at timestamptz not null default now(),
  constraint product_events_event_name_check check (
    event_name in (
      'recommendation_view',
      'recommendation_change',
      'recommendation_detail_view',
      'recommendation_favorite_add',
      'recommendation_empty',
      'recommendation_error'
    )
  ),
  constraint product_events_platform_check check (platform in ('ios', 'web')),
  constraint product_events_reason_max_length check (
    recommendation_reason is null or char_length(recommendation_reason) <= 120
  ),
  constraint product_events_session_position_check check (
    session_position is null or session_position between 1 and 100
  ),
  constraint product_events_source_check check (source = 'today_next_sauna')
);

create index if not exists product_events_user_id_created_at_idx
  on public.product_events (user_id, created_at desc);

create index if not exists product_events_name_created_at_idx
  on public.product_events (event_name, created_at desc);

alter table public.product_events enable row level security;

drop policy if exists "Users can insert own product events"
  on public.product_events;

create policy "Users can insert own product events"
  on public.product_events
  for insert
  to authenticated
  with check (auth.uid() = user_id);
