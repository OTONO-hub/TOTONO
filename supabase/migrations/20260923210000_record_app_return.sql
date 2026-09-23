alter table public.product_events
  drop constraint if exists product_events_event_name_check;

alter table public.product_events
  add constraint product_events_event_name_check check (
    event_name in (
      'sign_up',
      'login',
      'app_open',
      'app_return',
      'today_view',
      'search_view',
      'sauna_search',
      'sauna_detail_view',
      'favorite_add',
      'post_start',
      'post_complete',
      'recommendation_view',
      'recommendation_change',
      'recommendation_detail_view',
      'recommendation_favorite_add',
      'recommendation_empty',
      'recommendation_error'
    )
  );

create unique index if not exists product_events_app_return_user_jst_date_idx
  on public.product_events (
    user_id,
    ((created_at at time zone 'Asia/Tokyo')::date)
  )
  where event_name = 'app_return';

create or replace function public.record_app_return()
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  current_jst_date date := (now() at time zone 'Asia/Tokyo')::date;
  account_created_at timestamptz;
  inserted_rows integer;
begin
  if current_user_id is null then
    raise exception 'Authentication required'
      using errcode = '42501';
  end if;

  select users.created_at
    into account_created_at
    from auth.users as users
   where users.id = current_user_id;

  if account_created_at is null
    or (account_created_at at time zone 'Asia/Tokyo')::date >= current_jst_date
  then
    return false;
  end if;

  insert into public.product_events (
    user_id,
    event_name,
    platform,
    source
  )
  values (
    current_user_id,
    'app_return',
    'ios',
    'app_lifecycle'
  )
  on conflict do nothing;

  get diagnostics inserted_rows = row_count;

  return inserted_rows = 1;
end;
$$;

revoke all on function public.record_app_return() from public;
grant execute on function public.record_app_return() to authenticated;
