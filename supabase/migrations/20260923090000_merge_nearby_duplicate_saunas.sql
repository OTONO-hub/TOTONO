begin;

create temporary table nearby_sauna_merge_map (
  duplicate_id uuid primary key,
  canonical_id uuid not null
) on commit drop;

insert into nearby_sauna_merge_map (
  duplicate_id,
  canonical_id
)
values
  ('5b13335d-8394-405e-bf69-6cf65e8744df', '340c6cbd-cb98-4118-8ad0-6c5f0ce95cde'),
  ('4121512d-def9-4a78-87a9-6c57c668bb00', '9e3ff529-5867-472b-8c69-4443c85c8bff'),
  ('c93c8d41-363b-43ef-a715-a16b1a2cac69', '9333af82-d3df-429f-bba5-855870774d17'),
  ('b599d7f3-c105-4a43-b05e-396bbddeb51a', 'ca84ddac-f65b-434b-8493-fcd87e10b154'),
  ('09428e03-c3e6-4f04-a102-6c67a3862513', 'f558a2d5-dfd3-4107-aa40-96b26331cac5'),
  ('19e8cd5a-48f3-4211-a119-017b9f66db62', '0be45a4b-f430-4151-98bd-d476ce07d1ba'),
  ('43793504-48b3-42ab-aebc-63b14bbd469a', '99b6e7a6-fd2f-4100-a1ad-d3c86b2b0294'),
  ('c7904c16-4c3a-471a-b8b6-c61dcec5f3ae', '99b6e7a6-fd2f-4100-a1ad-d3c86b2b0294'),
  ('82bb225d-2f64-4072-803a-284e65e663fc', '962843a0-428f-4737-a92c-4d06d85f001a');

do $$
begin
  if (
    select count(*)
    from public.saunas
    where id in (
      select duplicate_id
      from nearby_sauna_merge_map
    )
  ) <> 9 then
    raise exception
      'Expected all 9 duplicate sauna records to exist';
  end if;

  if (
    select count(*)
    from public.saunas
    where id in (
      select canonical_id
      from nearby_sauna_merge_map
    )
  ) <> 8 then
    raise exception
      'Expected all 8 canonical sauna records to exist';
  end if;
end;
$$;

update public.saunas
set
  name = '生姜サウナ 金の亀',
  updated_at = now()
where id = '0be45a4b-f430-4151-98bd-d476ce07d1ba';

update public.posts as posts
set sauna_id = merge_map.canonical_id
from nearby_sauna_merge_map as merge_map
where posts.sauna_id = merge_map.duplicate_id;

delete from public.favorite_saunas as favorites
using nearby_sauna_merge_map as merge_map
where favorites.sauna_id = merge_map.duplicate_id
  and exists (
    select 1
    from public.favorite_saunas as canonical_favorite
    where
      canonical_favorite.user_id = favorites.user_id
      and canonical_favorite.sauna_id = merge_map.canonical_id
  );

update public.favorite_saunas as favorites
set sauna_id = merge_map.canonical_id
from nearby_sauna_merge_map as merge_map
where favorites.sauna_id = merge_map.duplicate_id;

update public.sauna_submissions as submissions
set target_sauna_id = merge_map.canonical_id
from nearby_sauna_merge_map as merge_map
where submissions.target_sauna_id = merge_map.duplicate_id;

delete from public.saunas as saunas
using nearby_sauna_merge_map as merge_map
where saunas.id = merge_map.duplicate_id;

commit;
