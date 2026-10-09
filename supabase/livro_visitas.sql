-- =============================================================================
-- Livro de Visitas (comando `guestbook`)
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Pode rodar de novo sem medo: não apaga mensagens nem duplica nada.
--
-- Usado por: src/components/LivroVisitas.jsx (lê e grava)
--            .github/workflows/keep-supabase-awake.yml (ping a cada 12 h)
-- =============================================================================

-- 1. Tabela das mensagens
create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- 2. Row Level Security: sem política, ninguém lê nem grava
alter table public.guestbook_messages enable row level security;

-- 3. Políticas públicas (o site usa a publishable key, papel `anon`)
drop policy if exists "Allow public read" on public.guestbook_messages;
create policy "Allow public read"
on public.guestbook_messages
for select
to anon
using (true);

drop policy if exists "Allow public insert" on public.guestbook_messages;
create policy "Allow public insert"
on public.guestbook_messages
for insert
to anon
with check (true);

-- Sem políticas de update e delete: o visitante não edita nem apaga
-- mensagens. Para moderar, use o Table Editor do Supabase.
