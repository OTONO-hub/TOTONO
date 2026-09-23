alter table public.product_events
  add column if not exists source_screen text;

alter table public.product_events
  drop constraint if exists product_events_event_name_check;

alter table public.product_events
  add constraint product_events_event_name_check check (
    event_name in (
      'app_open',
      'today_view',
      'search_view',
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
    source in ('app_lifecycle', 'screen_view', 'today_next_sauna')
  );

alter table public.product_events
  add constraint product_events_source_screen_max_length check (
    source_screen is null or char_length(source_screen) <= 50
  );
