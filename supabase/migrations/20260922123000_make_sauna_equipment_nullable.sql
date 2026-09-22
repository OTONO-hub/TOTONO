begin;

alter table public.saunas
  alter column has_cold_bath drop not null,
  alter column has_cold_bath drop default,
  alter column has_outdoor_air_bath drop not null,
  alter column has_outdoor_air_bath drop default,
  alter column has_rest_area drop not null,
  alter column has_rest_area drop default,
  alter column has_restaurant drop not null,
  alter column has_restaurant drop default,
  alter column has_parking drop not null,
  alter column has_parking drop default;

-- Unverified imported values used false for both "not available" and
-- "not researched". Keep confirmed true values and restore unknowns to null.
update public.saunas
set
  has_cold_bath = case when has_cold_bath then true else null end,
  has_outdoor_air_bath = case when has_outdoor_air_bath then true else null end,
  has_rest_area = case when has_rest_area then true else null end,
  has_restaurant = case when has_restaurant then true else null end,
  has_parking = case when has_parking then true else null end
where
  is_verified = false
  and source in ('openstreetmap', 'user_submission');

comment on column public.saunas.has_cold_bath is
  'true: available, false: confirmed unavailable, null: unknown';
comment on column public.saunas.has_outdoor_air_bath is
  'true: available, false: confirmed unavailable, null: unknown';
comment on column public.saunas.has_rest_area is
  'true: available, false: confirmed unavailable, null: unknown';
comment on column public.saunas.has_restaurant is
  'true: available, false: confirmed unavailable, null: unknown';
comment on column public.saunas.has_parking is
  'true: available, false: confirmed unavailable, null: unknown';

commit;
