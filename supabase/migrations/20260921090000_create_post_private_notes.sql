create table if not exists public.post_private_notes (
  id uuid primary key default gen_random_uuid(),
  post_id uuid not null unique references public.posts(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  note text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint post_private_notes_note_not_blank
    check (btrim(note) <> ''),
  constraint post_private_notes_note_max_length
    check (char_length(note) <= 2000)
);

create index if not exists post_private_notes_user_id_idx
  on public.post_private_notes (user_id);

alter table public.post_private_notes enable row level security;

drop policy if exists "Users can read own private notes"
  on public.post_private_notes;

create policy "Users can read own private notes"
  on public.post_private_notes
  for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Users can insert own private notes"
  on public.post_private_notes;

create policy "Users can insert own private notes"
  on public.post_private_notes
  for insert
  to authenticated
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.posts
      where posts.id = post_private_notes.post_id
        and posts.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update own private notes"
  on public.post_private_notes;

create policy "Users can update own private notes"
  on public.post_private_notes
  for update
  to authenticated
  using (auth.uid() = user_id)
  with check (
    auth.uid() = user_id
    and exists (
      select 1
      from public.posts
      where posts.id = post_private_notes.post_id
        and posts.user_id = auth.uid()
    )
  );

drop policy if exists "Users can delete own private notes"
  on public.post_private_notes;

create policy "Users can delete own private notes"
  on public.post_private_notes
  for delete
  to authenticated
  using (auth.uid() = user_id);
