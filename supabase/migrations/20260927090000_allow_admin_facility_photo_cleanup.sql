-- アップロード途中で失敗した、Hero未設定の写真台帳だけを
-- 登録した管理者本人がロールバックできるようにする。
create policy "Admins can clean up failed facility photo uploads"
on public.facility_photos
for delete
to authenticated
using (
  public.is_totono_admin(auth.uid())
  and created_by = auth.uid()
  and is_hero = false
);
