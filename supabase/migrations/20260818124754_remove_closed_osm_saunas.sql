/*
 * OpenStreetMapから誤って登録された
 * 閉業・跡地施設を削除します。
 *
 * sourceとsource_idを両方指定し、
 * 対象外の施設を削除しないようにしています。
 *
 * 事前確認時点で、
 * 対象施設に紐づく投稿は0件です。
 */
delete from public.saunas
where source = 'openstreetmap'
  and source_id in (
    'node/6347425789',
    'node/6435175285',
    'node/6435668986',
    'node/6461929585',
    'node/9858170618'
  );