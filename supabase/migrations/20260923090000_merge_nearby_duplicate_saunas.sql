begin;

do $$
declare
  merge_record record;
begin
  for merge_record in
    select *
    from (
      values
        ('5b13335d-8394-405e-bf69-6cf65e8744df'::uuid, '340c6cbd-cb98-4118-8ad0-6c5f0ce95cde'::uuid),
        ('4121512d-def9-4a78-87a9-6c57c668bb00'::uuid, '9e3ff529-5867-472b-8c69-4443c85c8bff'::uuid),
        ('c93c8d41-363b-43ef-a715-a16b1a2cac69'::uuid, '9333af82-d3df-429f-bba5-855870774d17'::uuid),
        ('b599d7f3-c105-4a43-b05e-396bbddeb51a'::uuid, 'ca84ddac-f65b-434b-8493-fcd87e10b154'::uuid),
        ('09428e03-c3e6-4f04-a102-6c67a3862513'::uuid, 'f558a2d5-dfd3-4107-aa40-96b26331cac5'::uuid),
        ('19e8cd5a-48f3-4211-a119-017b9f66db62'::uuid, '0be45a4b-f430-4151-98bd-d476ce07d1ba'::uuid),
        ('43793504-48b3-42ab-aebc-63b14bbd469a'::uuid, '99b6e7a6-fd2f-4100-a1ad-d3c86b2b0294'::uuid),
        ('c7904c16-4c3a-471a-b8b6-c61dcec5f3ae'::uuid, '99b6e7a6-fd2f-4100-a1ad-d3c86b2b0294'::uuid),
        ('82bb225d-2f64-4072-803a-284e65e663fc'::uuid, '962843a0-428f-4737-a92c-4d06d85f001a'::uuid)
    ) as merge_map(duplicate_id, canonical_id)
  loop
    if not exists (
      select 1
      from public.saunas
      where id = merge_record.duplicate_id
    ) then
      continue;
    end if;

    if not exists (
      select 1
      from public.saunas
      where id = merge_record.canonical_id
    ) then
      raise exception
        'Canonical sauna record % does not exist',
        merge_record.canonical_id;
    end if;

    update public.posts
    set sauna_id = merge_record.canonical_id
    where sauna_id = merge_record.duplicate_id;

    delete from public.favorite_saunas as duplicate_favorite
    where duplicate_favorite.sauna_id = merge_record.duplicate_id
      and exists (
        select 1
        from public.favorite_saunas as canonical_favorite
        where
          canonical_favorite.user_id = duplicate_favorite.user_id
          and canonical_favorite.sauna_id = merge_record.canonical_id
      );

    update public.favorite_saunas
    set sauna_id = merge_record.canonical_id
    where sauna_id = merge_record.duplicate_id;

    update public.sauna_submissions
    set target_sauna_id = merge_record.canonical_id
    where target_sauna_id = merge_record.duplicate_id;

    delete from public.saunas
    where id = merge_record.duplicate_id;
  end loop;

  update public.saunas
  set
    name = '生姜サウナ 金の亀',
    updated_at = now()
  where id = '0be45a4b-f430-4151-98bd-d476ce07d1ba';
end;
$$;

commit;
