-- =============================================================================
-- Livro de Visitas (comando `guestbook`)
--
-- Rode no Supabase: SQL Editor → New query → cole tudo → Run.
-- Não selecione um trecho: com texto selecionado, o Run executa só a seleção.
-- Pode rodar de novo sem medo: não apaga mensagens nem duplica nada.
--
-- Usado por: src/components/LivroVisitas.jsx (lê e grava)
--            src/config/guestbookConfig.js (os mesmos limites, no navegador)
--            .github/workflows/keep-supabase-awake.yml (ping a cada 12 h)
--
-- Por que a proteção fica aqui, e não só no site: a publishable key vai no
-- JavaScript do portfólio, então qualquer pessoa pode chamar a API REST do
-- Supabase direto (curl, Postman...) sem passar pelo site. O `maxLength` do
-- input é só conforto para o visitante; quem barra o abuso é o banco.
-- =============================================================================

-- 1. Tabela das mensagens
create table if not exists public.guestbook_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  message text not null,
  created_at timestamptz default now()
);

-- Índice para a contagem por hora (passo 7) e para o `order by created_at`
create index if not exists guestbook_messages_created_at_idx
  on public.guestbook_messages (created_at desc);

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

-- 4. Limite de tamanho e de caracteres (vale para qualquer cliente)
--    name: 1 a 50 caracteres · message: 1 a 500 caracteres (sem contar os
--    espaços das pontas) e nenhum caractere de controle (quebra de linha,
--    tab, \0...), que serviriam para "esticar" a lista com linhas em branco.
--    Mesmos números de src/config/guestbookConfig.js: mudou aqui, mude lá.
--    O `not valid` aplica a regra só às mensagens novas: as antigas ficam
--    como estão, mesmo que passem do limite.
alter table public.guestbook_messages
  drop constraint if exists guestbook_name_tamanho;
alter table public.guestbook_messages
  add constraint guestbook_name_tamanho
  check (char_length(btrim(name)) between 1 and 50 and name !~ '[[:cntrl:]]')
  not valid;

alter table public.guestbook_messages
  drop constraint if exists guestbook_message_tamanho;
alter table public.guestbook_messages
  add constraint guestbook_message_tamanho
  check (char_length(btrim(message)) between 1 and 500 and message !~ '[[:cntrl:]]')
  not valid;

-- 5. O visitante só escolhe o nome e a mensagem: sem isso, dava para mandar
--    um `created_at` no futuro (e fixar a mensagem no topo da lista) ou um
--    `id` qualquer. Update e delete já são barrados pelo RLS; o revoke é
--    uma segunda tranca.
revoke insert, update, delete on public.guestbook_messages from anon, authenticated;
grant insert (name, message) on public.guestbook_messages to anon;

-- 6. Registro dos envios para o limite por visitante. Guarda só o hash do
--    IP (nunca o IP) e fica fora do alcance do site: RLS ligado, nenhuma
--    política e nenhuma permissão para anon. As linhas com mais de 1 dia
--    são apagadas pelo próprio trigger.
create table if not exists public.guestbook_rate_limit (
  ip_hash text not null,
  created_at timestamptz not null default now()
);

create index if not exists guestbook_rate_limit_ip_idx
  on public.guestbook_rate_limit (ip_hash, created_at desc);

alter table public.guestbook_rate_limit enable row level security;
revoke all on public.guestbook_rate_limit from anon, authenticated;

-- 7. Anti-spam: roda antes de cada insert vindo da API.
--    - por visitante (hash do IP): no máximo 3 mensagens a cada 10 minutos;
--    - no site todo: no máximo 30 mensagens por hora (vale mesmo que alguém
--      troque de IP a cada envio);
--    - teto da tabela: 5.000 mensagens. Com 500 caracteres cada, o pior caso
--      fica perto de 2,5 MB, longe dos 500 MB do plano gratuito.
--    Inserts feitos no SQL Editor ou no Table Editor (sem cabeçalhos de
--    requisição) e com a service_role não passam pelos limites.
--    O erro sai com o nome da regra na mensagem (guestbook_rate_limit,
--    guestbook_limite_global, guestbook_cheio), que o site traduz.
create or replace function public.guestbook_antispam()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  cabecalhos json;
  papel text;
  ip text;
  hash_ip text;
  envios_ip int;
  envios_hora int;
  total int;
begin
  -- Tira os espaços das pontas (o limite de tamanho conta sem eles)
  new.name := btrim(new.name);
  new.message := btrim(new.message);

  begin
    cabecalhos := nullif(current_setting('request.headers', true), '')::json;
    papel := nullif(current_setting('request.jwt.claims', true), '')::json->>'role';
  exception when others then
    cabecalhos := null;
    papel := null;
  end;

  -- Fora da API (SQL Editor, Table Editor) ou com a service_role: sem limites
  if cabecalhos is null or papel = 'service_role' then
    return new;
  end if;

  -- Data sempre a do servidor
  new.created_at := now();

  -- IP do visitante, como o proxy do Supabase repassa
  ip := coalesce(
    cabecalhos->>'cf-connecting-ip',
    cabecalhos->>'x-real-ip',
    split_part(cabecalhos->>'x-forwarded-for', ',', 1)
  );
  hash_ip := md5(coalesce(nullif(btrim(ip), ''), 'desconhecido'));

  -- Uma verificação por vez: duas requisições simultâneas não passam
  -- juntas pela mesma contagem
  perform pg_advisory_xact_lock(hashtext('guestbook_antispam'));

  select count(*) into envios_ip
    from public.guestbook_rate_limit
   where guestbook_rate_limit.ip_hash = hash_ip
     and guestbook_rate_limit.created_at > now() - interval '10 minutes';
  if envios_ip >= 3 then
    raise exception 'guestbook_rate_limit'
      using hint = 'Máximo de 3 mensagens a cada 10 minutos.';
  end if;

  select count(*) into envios_hora
    from public.guestbook_messages
   where guestbook_messages.created_at > now() - interval '1 hour';
  if envios_hora >= 30 then
    raise exception 'guestbook_limite_global'
      using hint = 'Máximo de 30 mensagens por hora no site todo.';
  end if;

  select count(*) into total from public.guestbook_messages;
  if total >= 5000 then
    raise exception 'guestbook_cheio'
      using hint = 'O livro de visitas atingiu o limite de mensagens.';
  end if;

  insert into public.guestbook_rate_limit (ip_hash) values (hash_ip);
  delete from public.guestbook_rate_limit
   where guestbook_rate_limit.created_at < now() - interval '1 day';

  return new;
end;
$$;

revoke all on function public.guestbook_antispam() from public, anon, authenticated;

drop trigger if exists guestbook_antispam on public.guestbook_messages;
create trigger guestbook_antispam
before insert on public.guestbook_messages
for each row execute function public.guestbook_antispam();
