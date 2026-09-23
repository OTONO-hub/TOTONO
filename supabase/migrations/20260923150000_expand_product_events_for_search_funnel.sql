alter table public.product_events
  add column if not exists search_method text;

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
    source in ('app_lifecycle', 'screen_view', 'sauna_search', 'today_next_sauna')
  );

alter table public.product_events
  add constraint product_events_search_method_check check (
    search_method is null
    or search_method in ('keyword', 'prefecture', 'current_location')
  );
