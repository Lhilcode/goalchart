-- Goal Chart setup
-- Create one admin user in Supabase Auth, replace the UUID below, then run this SQL.
-- Keep public sign-ups disabled. Use the same Auth UID in index.html.

create table if not exists public.goal_chart_players (
  id uuid primary key default gen_random_uuid(),
  name text not null check (char_length(trim(name)) between 1 and 70),
  goals integer not null default 0 check (goals >= 0),
  assists integer not null default 0 check (assists >= 0),
  month_key text not null check (month_key ~ '^\d{4}-(0[1-9]|1[0-2])$'),
  created_at timestamptz not null default now()
);

create unique index if not exists goal_chart_players_month_name_unique
  on public.goal_chart_players (month_key, lower(name));

alter table public.goal_chart_players enable row level security;

create or replace function public.is_goal_chart_admin()
returns boolean
language sql
stable
as $$
  select auth.uid() = 'c317082d-817f-4480-924e-23fb6482c150'::uuid;
$$;

drop policy if exists "Anyone can view monthly goal chart" on public.goal_chart_players;
create policy "Anyone can view monthly goal chart"
  on public.goal_chart_players for select using (true);

drop policy if exists "Only chart admin can add players" on public.goal_chart_players;
create policy "Only chart admin can add players"
  on public.goal_chart_players for insert to authenticated
  with check (public.is_goal_chart_admin());

drop policy if exists "Only chart admin can update players" on public.goal_chart_players;
create policy "Only chart admin can update players"
  on public.goal_chart_players for update to authenticated
  using (public.is_goal_chart_admin()) with check (public.is_goal_chart_admin());

drop policy if exists "Only chart admin can delete players" on public.goal_chart_players;
create policy "Only chart admin can delete players"
  on public.goal_chart_players for delete to authenticated
  using (public.is_goal_chart_admin());

grant select on public.goal_chart_players to anon, authenticated;
grant insert, update, delete on public.goal_chart_players to authenticated;

-- Starter records matching the existing chart are added for setup month only.
insert into public.goal_chart_players (name, goals, assists, month_key) values
  ('Halland', 2, 0, to_char(current_date, 'YYYY-MM')), ('Stooner', 6, 0, to_char(current_date, 'YYYY-MM')),
  ('Chidera', 9, 0, to_char(current_date, 'YYYY-MM')), ('Destiny', 7, 0, to_char(current_date, 'YYYY-MM')),
  ('Lekan', 10, 0, to_char(current_date, 'YYYY-MM')), ('Tobi', 2, 0, to_char(current_date, 'YYYY-MM')),
  ('Daniel', 2, 0, to_char(current_date, 'YYYY-MM')), ('Tanner', 8, 0, to_char(current_date, 'YYYY-MM')),
  ('Sunday', 5, 0, to_char(current_date, 'YYYY-MM')), ('Muhammed', 0, 0, to_char(current_date, 'YYYY-MM')),
  ('Toyosi', 6, 0, to_char(current_date, 'YYYY-MM')), ('Pele', 1, 0, to_char(current_date, 'YYYY-MM')),
  ('Al Ameen', 4, 0, to_char(current_date, 'YYYY-MM')), ('Balo', 2, 0, to_char(current_date, 'YYYY-MM')),
  ('Phemmie', 1, 0, to_char(current_date, 'YYYY-MM')), ('Tunji', 2, 0, to_char(current_date, 'YYYY-MM')),
  ('Rokeeb', 0, 0, to_char(current_date, 'YYYY-MM')), ('Alfa', 0, 0, to_char(current_date, 'YYYY-MM')),
  ('Khalifa', 0, 0, to_char(current_date, 'YYYY-MM')), ('Hunteler', 0, 0, to_char(current_date, 'YYYY-MM')),
  ('Gym instructor', 4, 0, to_char(current_date, 'YYYY-MM')), ('Nelson', 3, 0, to_char(current_date, 'YYYY-MM')),
  ('Skilla', 0, 0, to_char(current_date, 'YYYY-MM')), ('Dayo', 0, 0, to_char(current_date, 'YYYY-MM')),
  ('T.j', 1, 0, to_char(current_date, 'YYYY-MM')), ('Oke', 2, 0, to_char(current_date, 'YYYY-MM')),
  ('Benny', 0, 0, to_char(current_date, 'YYYY-MM')), ('Fear God', 1, 0, to_char(current_date, 'YYYY-MM')),
  ('Joshua', 1, 0, to_char(current_date, 'YYYY-MM')), ('Emma', 3, 0, to_char(current_date, 'YYYY-MM')),
  ('Spectrum', 1, 0, to_char(current_date, 'YYYY-MM')), ('General', 1, 0, to_char(current_date, 'YYYY-MM')),
  ('Believe', 3, 0, to_char(current_date, 'YYYY-MM')), ('T.cash', 4, 0, to_char(current_date, 'YYYY-MM')),
  ('Gustavo', 1, 0, to_char(current_date, 'YYYY-MM')), ('Major', 2, 0, to_char(current_date, 'YYYY-MM')),
  ('Manny Manny', 1, 0, to_char(current_date, 'YYYY-MM')), ('Basit', 2, 0, to_char(current_date, 'YYYY-MM')),
  ('Musician Yellow', 1, 0, to_char(current_date, 'YYYY-MM'))
on conflict do nothing;
