alter table public.product_events
  add column if not exists auth_method text;

alter table public.product_events
  drop constraint if exists product_events_event_name_check;

alter table public.product_events
  add constraint product_events_event_name_check check (
    event_name in (
      'sign_up',
      'login',
      'app_open',
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

alter table public.product_events
  drop constraint if exists product_events_source_check;

alter table public.product_events
  add constraint product_events_source_check check (
    source in (
      'auth',
      'app_lifecycle',
      'screen_view',
      'sauna_search',
      'favorite_action',
      'post_flow',
      'today_next_sauna'
    )
  );

alter table public.product_events
  add constraint product_events_auth_method_check check (
    auth_method is null or auth_method = 'email'
  );
