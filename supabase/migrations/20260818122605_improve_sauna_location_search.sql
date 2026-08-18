create or replace function public.search_saunas_ranked(
  search_keyword text,
  search_prefecture text default null::text,
  result_limit integer default 10
)
returns table(
  id uuid,
  name text,
  normalized_name text,
  address text,
  prefecture text,
  city text,
  postal_code text,
  latitude double precision,
  longitude double precision,
  phone_number text,
  website_url text,
  opening_hours text,
  image_url text,
  google_place_id text,
  source text,
  has_sauna_room boolean,
  has_cold_bath boolean,
  has_outdoor_air_bath boolean,
  has_rest_area boolean,
  has_restaurant boolean,
  has_parking boolean,
  is_verified boolean,
  created_at timestamp with time zone,
  updated_at timestamp with time zone,
  search_score double precision
)
language sql
stable
set search_path to 'public', 'extensions'
as $function$
  with search_input as (
    select
      public.normalize_sauna_search_text(
        coalesce(search_keyword, '')
      ) as normalized_keyword,

      nullif(
        btrim(search_prefecture),
        ''
      ) as prefecture_filter,

      least(
        greatest(
          coalesce(result_limit, 10),
          1
        ),
        100
      ) as safe_limit
  ),

  searchable_saunas as (
    select
      s.id,
      s.name,
      s.normalized_name,
      s.address,
      s.prefecture,
      s.city,
      s.postal_code,
      s.latitude,
      s.longitude,
      s.phone_number,
      s.website_url,
      s.opening_hours,
      s.image_url,
      s.google_place_id,
      s.source,
      s.has_sauna_room,
      s.has_cold_bath,
      s.has_outdoor_air_bath,
      s.has_rest_area,
      s.has_restaurant,
      s.has_parking,
      s.is_verified,
      s.created_at,
      s.updated_at,

      public.normalize_sauna_search_text(
        coalesce(s.name, '')
      ) as normalized_search_name,

      coalesce(
        nullif(s.normalized_name, ''),
        public.normalize_sauna_search_text(
          coalesce(s.name, '')
        )
      ) as normalized_stored_name,

      public.normalize_sauna_search_text(
        coalesce(s.prefecture, '')
      ) as normalized_prefecture,

      public.normalize_sauna_search_text(
        coalesce(s.city, '')
      ) as normalized_city,

      public.normalize_sauna_search_text(
        coalesce(s.address, '')
      ) as normalized_address

    from public.saunas as s
  ),

  ranked_saunas as (
    select
      s.id,
      s.name,
      s.normalized_name,
      s.address,
      s.prefecture,
      s.city,
      s.postal_code,
      s.latitude,
      s.longitude,
      s.phone_number,
      s.website_url,
      s.opening_hours,
      s.image_url,
      s.google_place_id,
      s.source,
      s.has_sauna_room,
      s.has_cold_bath,
      s.has_outdoor_air_bath,
      s.has_rest_area,
      s.has_restaurant,
      s.has_parking,
      s.is_verified,
      s.created_at,
      s.updated_at,

      (
        case
          when
            s.normalized_search_name =
            i.normalized_keyword
          then 1000

          when
            s.normalized_stored_name =
            i.normalized_keyword
          then 950

          when
            s.normalized_search_name like
              i.normalized_keyword || '%'
          then 800

          when
            s.normalized_stored_name like
              i.normalized_keyword || '%'
          then 750

          when
            s.normalized_search_name like
              '%' || i.normalized_keyword || '%'
          then 600

          when
            s.normalized_stored_name like
              '%' || i.normalized_keyword || '%'
          then 550

          when
            s.normalized_city =
            i.normalized_keyword
          then 500

          when
            s.normalized_prefecture =
            i.normalized_keyword
          then 480

          when
            s.normalized_city like
              '%' || i.normalized_keyword || '%'
          then 450

          when
            s.normalized_prefecture like
              '%' || i.normalized_keyword || '%'
          then 430

          when
            s.normalized_address like
              '%' || i.normalized_keyword || '%'
          then 400

          else 300
        end

        +

        greatest(
          similarity(
            s.normalized_search_name,
            i.normalized_keyword
          ),

          similarity(
            s.normalized_stored_name,
            i.normalized_keyword
          )
        ) * 100

        +

        case
          when s.is_verified
          then 20
          else 0
        end
      )::double precision as search_score

    from searchable_saunas as s

    cross join search_input as i

    where
      i.normalized_keyword <> ''

      and (
        i.prefecture_filter is null
        or s.prefecture =
          i.prefecture_filter
      )

      and (
        s.normalized_search_name like
          '%' || i.normalized_keyword || '%'

        or

        s.normalized_stored_name like
          '%' || i.normalized_keyword || '%'

        or

        s.normalized_prefecture like
          '%' || i.normalized_keyword || '%'

        or

        s.normalized_city like
          '%' || i.normalized_keyword || '%'

        or

        s.normalized_address like
          '%' || i.normalized_keyword || '%'

        or

        similarity(
          s.normalized_search_name,
          i.normalized_keyword
        ) >= 0.2

        or

        similarity(
          s.normalized_stored_name,
          i.normalized_keyword
        ) >= 0.2
      )
  )

  select
    r.id,
    r.name,
    r.normalized_name,
    r.address,
    r.prefecture,
    r.city,
    r.postal_code,
    r.latitude,
    r.longitude,
    r.phone_number,
    r.website_url,
    r.opening_hours,
    r.image_url,
    r.google_place_id,
    r.source,
    r.has_sauna_room,
    r.has_cold_bath,
    r.has_outdoor_air_bath,
    r.has_rest_area,
    r.has_restaurant,
    r.has_parking,
    r.is_verified,
    r.created_at,
    r.updated_at,
    r.search_score

  from ranked_saunas as r

  cross join search_input as i

  order by
    r.search_score desc,
    r.is_verified desc,
    r.name asc

  limit (
    select safe_limit
    from search_input
  );
$function$;