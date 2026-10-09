-- =============================================================================
-- Contador de visitas (tela de boas-vindas)
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Não selecione um trecho: com texto selecionado, o Run executa só a seleção.
-- Pode rodar de novo sem medo: o `on conflict do nothing` não zera o total.
--
-- Usado por: src/lib/visitas.js
--
-- O que é uma visita: uma sessão que termina depois de 30 minutos sem
-- atividade (a mesma regra do Google Analytics). Quem entra de manhã, de
-- tarde e de noite conta 3; quem dá F5 cinco vezes seguidas conta 1. A
-- regra fica no navegador (src/lib/visitas.js); aqui só se soma.
-- =============================================================================

-- 1. Tabela com uma linha só (id = 1) guardando o total
create table if not exists public.contador_visitas (
  id int primary key check (id = 1),
  total bigint not null default 0
);

-- 2. Valor inicial: o contador não começa do zero, continua das visualizações
--    que o portfólio já tinha (RepoViews do views-counter, o mesmo número do
--    badge no README e do `stats --repos`). Troque o 0 abaixo por esse número
--    antes de rodar.
insert into public.contador_visitas (id, total)
values (1, 0)
on conflict (id) do nothing;

--    Se já rodou e quer ajustar depois:
--    update public.contador_visitas set total = 12345 where id = 1;

-- 3. Row Level Security: o visitante só lê; não tem update na tabela
alter table public.contador_visitas enable row level security;

drop policy if exists "Allow public read" on public.contador_visitas;
create policy "Allow public read"
on public.contador_visitas
for select
to anon
using (true);

-- 4. Soma 1 e devolve o novo total, numa operação só (atômica): dois
--    visitantes ao mesmo tempo não se perdem. O `security definer` roda com
--    o dono da função, então o visitante soma +1 sem ter permissão de update
--    (não consegue gravar um número qualquer).
--    Em plpgsql (e não sql) porque o Postgres só confere o corpo na hora
--    de rodar: a função é criada mesmo que a tabela ainda não exista.
create or replace function public.registrar_visita()
returns bigint
language plpgsql
security definer
set search_path = public
as $$
declare
  novo_total bigint;
begin
  update public.contador_visitas
     set total = total + 1
   where id = 1
  returning total into novo_total;
  return novo_total;
end;
$$;

revoke all on function public.registrar_visita() from public;
grant execute on function public.registrar_visita() to anon, authenticated;
