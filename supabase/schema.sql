-- memos table & policies
create table if not exists public.memos (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  user_id uuid not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null
);
-- updated_at trigger
create or replace function public.tg_set_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end; $$ language plpgsql;
drop trigger if exists memos_set_updated_at on public.memos;
create trigger memos_set_updated_at before update on public.memos
for each row execute procedure public.tg_set_updated_at();
-- RLS
alter table public.memos enable row level security;
drop policy if exists "read own memos" on public.memos;
drop policy if exists "write own memos" on public.memos;
create policy "read own memos" on public.memos
  for select using (auth.uid() = user_id);
create policy "write own memos" on public.memos
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
