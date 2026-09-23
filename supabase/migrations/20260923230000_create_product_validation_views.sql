drop view if exists public.product_activation_daily;
drop view if exists public.product_user_activation_funnel;

create view public.product_user_activation_funnel
with (security_invoker = true)
as
with sign_ups as (
  select
    user_id,
    min(created_at) as sign_up_at,
    (min(created_at) at time zone 'Asia/Tokyo')::date as cohort_date_jst
  from public.product_events
  where event_name = 'sign_up'
    and platform = 'ios'
  group by user_id
),
user_events as (
  select
    sign_ups.user_id,
    sign_ups.sign_up_at,
    sign_ups.cohort_date_jst,
    min(events.created_at) filter (
      where events.event_name = 'sauna_detail_view'
        and events.created_at >= sign_ups.sign_up_at
    ) as first_sauna_detail_at,
    min(events.created_at) filter (
      where events.event_name = 'favorite_add'
        and events.created_at >= sign_ups.sign_up_at
    ) as first_favorite_at,
    min(events.created_at) filter (
      where events.event_name = 'post_start'
        and events.created_at >= sign_ups.sign_up_at
    ) as first_post_start_at,
    min(events.created_at) filter (
      where events.event_name = 'post_complete'
        and events.created_at >= sign_ups.sign_up_at
    ) as first_post_complete_at,
    min(events.created_at) filter (
      where events.event_name = 'app_return'
        and events.created_at >= sign_ups.sign_up_at
    ) as first_return_at,
    coalesce(
      bool_or(
        events.event_name = 'app_return'
        and (events.created_at at time zone 'Asia/Tokyo')::date
          = sign_ups.cohort_date_jst + 1
      ),
      false
    ) as returned_d1,
    coalesce(
      bool_or(
        events.event_name = 'app_return'
        and (events.created_at at time zone 'Asia/Tokyo')::date
          between sign_ups.cohort_date_jst + 1
              and sign_ups.cohort_date_jst + 7
      ),
      false
    ) as returned_within_7d,
    coalesce(
      bool_or(
        events.event_name = 'app_return'
        and (events.created_at at time zone 'Asia/Tokyo')::date
          = sign_ups.cohort_date_jst + 7
      ),
      false
    ) as returned_d7
  from sign_ups
  left join public.product_events as events
    on events.user_id = sign_ups.user_id
   and events.platform = 'ios'
  group by
    sign_ups.user_id,
    sign_ups.sign_up_at,
    sign_ups.cohort_date_jst
)
select
  user_id,
  cohort_date_jst,
  sign_up_at,
  first_sauna_detail_at,
  first_favorite_at,
  first_post_start_at,
  first_post_complete_at,
  first_return_at,
  first_sauna_detail_at is not null as viewed_sauna,
  first_favorite_at is not null as added_favorite,
  first_post_start_at is not null as started_post,
  first_post_complete_at is not null as completed_post,
  first_return_at is not null as returned,
  (
    first_sauna_detail_at is not null
    and first_post_complete_at is not null
  ) as activated,
  (
    first_sauna_detail_at < sign_up_at + interval '7 days'
    and first_post_complete_at < sign_up_at + interval '7 days'
  ) as activated_within_7d,
  returned_d1,
  returned_within_7d,
  returned_d7
from user_events;

comment on view public.product_user_activation_funnel is
  'Admin-only iOS activation and retention funnel by signed-up user. Contains no email, username, or post content.';

create view public.product_activation_daily
with (security_invoker = true)
as
select
  cohort_date_jst,
  count(*) as sign_up_users,
  count(*) filter (where viewed_sauna) as sauna_detail_users,
  count(*) filter (where added_favorite) as favorite_users,
  count(*) filter (where started_post) as post_start_users,
  count(*) filter (where completed_post) as post_complete_users,
  count(*) filter (where activated) as activated_users,
  count(*) filter (where activated_within_7d) as activated_within_7d_users,
  count(*) filter (where returned_d1) as d1_return_users,
  count(*) filter (where returned_within_7d) as return_within_7d_users,
  count(*) filter (where returned_d7) as d7_return_users,
  round(
    100.0 * count(*) filter (where activated)
      / nullif(count(*), 0),
    1
  ) as activation_rate_percent,
  round(
    100.0 * count(*) filter (where returned_d1)
      / nullif(count(*), 0),
    1
  ) as d1_return_rate_percent,
  round(
    100.0 * count(*) filter (where returned_within_7d)
      / nullif(count(*), 0),
    1
  ) as return_within_7d_rate_percent,
  round(
    100.0 * count(*) filter (where returned_d7)
      / nullif(count(*), 0),
    1
  ) as d7_return_rate_percent
from public.product_user_activation_funnel
group by cohort_date_jst;

comment on view public.product_activation_daily is
  'Admin-only daily iOS sign-up cohorts with activation and retention counts and rates.';

revoke all on public.product_user_activation_funnel from anon, authenticated;
revoke all on public.product_activation_daily from anon, authenticated;
