alter table public.product_events
  drop constraint if exists product_events_event_name_check;

alter table public.product_events
  add constraint product_events_event_name_check check (
    event_name in (
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
      'app_lifecycle',
      'screen_view',
      'sauna_search',
      'favorite_action',
      'post_flow',
      'today_next_sauna'
    )
  );
