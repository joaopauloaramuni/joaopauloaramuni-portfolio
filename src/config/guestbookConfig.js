// Limites do Livro de Visitas (comando `guestbook`).
//
// Os MESMOS números estão no banco, em supabase/livro_visitas.sql (constraints
// e trigger guestbook_antispam). Aqui eles só servem para o visitante não
// digitar além do permitido e ver o contador: quem barra o abuso de verdade é
// o Supabase, porque a publishable key é pública e dá para chamar a API sem
// passar pelo site. Mudou um número aqui, mude no SQL (e rode o script de novo).

const GUESTBOOK_CONFIG = {
  MAX_NOME: 50,
  MAX_MENSAGEM: 500,
};

export default GUESTBOOK_CONFIG;
