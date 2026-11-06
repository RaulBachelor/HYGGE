-- HYGGE · Solo pueden entrar y tocar datos los correos de esta lista.
-- 1) CAMBIA los dos correos de abajo por los vuestros ANTES de ejecutar.
-- 2) Pégalo entero en Supabase > SQL Editor > Run.

create table if not exists public.allowed_emails (email text primary key);
alter table public.allowed_emails enable row level security;  -- sin políticas: nadie la lee desde la web

insert into public.allowed_emails values
  ('tu@correo.com'),
  ('pareja@correo.com')
on conflict do nothing;

create or replace function public.is_allowed() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from public.allowed_emails
    where lower(email) = lower(auth.jwt() ->> 'email')
  );
$$;

-- Tablas de la web
alter table public.items  enable row level security;
alter table public.meals  enable row level security;
alter table public.photos enable row level security;

drop policy if exists "solo nosotros" on public.items;
drop policy if exists "solo nosotros" on public.meals;
drop policy if exists "solo nosotros" on public.photos;

create policy "solo nosotros" on public.items  for all to authenticated
  using (public.is_allowed()) with check (public.is_allowed());
create policy "solo nosotros" on public.meals  for all to authenticated
  using (public.is_allowed()) with check (public.is_allowed());
create policy "solo nosotros" on public.photos for all to authenticated
  using (public.is_allowed()) with check (public.is_allowed());

-- Bucket de fotos
drop policy if exists "solo nosotros fotos" on storage.objects;
create policy "solo nosotros fotos" on storage.objects for all to authenticated
  using (bucket_id = 'photos' and public.is_allowed())
  with check (bucket_id = 'photos' and public.is_allowed());

-- 3) IMPORTANTE: las políticas se SUMAN. Lista las que haya y borra cualquier
--    antigua del tipo "cualquier usuario autenticado puede todo":
--    select schemaname, tablename, policyname, qual from pg_policies
--    where schemaname in ('public','storage');
--    y para borrar una:  drop policy "nombre" on public.items;
