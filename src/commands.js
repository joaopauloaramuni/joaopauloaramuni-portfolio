// Comandos do terminal. "subcommands" alimenta o autocomplete (Tab) da
// segunda palavra, ex.: "tema c" + Tab → "tema claro".
export const commandList = {
  sobre: {
    name: 'sobre',
    aliases: ['about'],
  },
  ajuda: {
    name: 'ajuda',
    aliases: ['help'],
  },
  experiencias: {
    name: 'experiencias',
    aliases: ['experience', 'xp'],
  },
  contato: {
    name: 'contato',
    aliases: ['contact'],
  },
  calendly: {
    name: 'calendly',
    aliases: ['meeting', 'meet'],
  },
  cal: {
    name: 'cal',
    aliases: ['horario', 'horarios', 'schedule'],
    // Visões: cal --mes | --semana | --hoje (ver data/calSkins.js)
    subcommands: ['--mes', '--semana', '--hoje', '--month', '--week', '--today'],
  },
  curriculo: {
    name: 'curriculo',
    aliases: ['resume'],
  },
  lattes: {
    name: 'lattes',
    aliases: ['cnpq', 'academic'],
    // Seções: lattes --resumo | --tccs | --tis | --aes | --bancas | --tudo | --pdf
    // (ver data/lattesSections.js)
    subcommands: [
      '--resumo',
      '--tccs',
      '--tis',
      '--aes',
      '--bancas',
      '--tudo',
      '--pdf',
      '--summary',
      '--theses',
      '--interdisciplinary',
      '--committees',
      '--all',
    ],
  },
  habilidades: {
    name: 'habilidades',
    aliases: ['skills'],
    // Estilos: skills --terminal | --cards | --lista (ver data/skillSkins.js)
    subcommands: ['--terminal', '--cards', '--lista', '--list'],
  },
  limpar: {
    name: 'limpar',
    aliases: ['clear'],
  },
  tema: {
    name: 'tema',
    aliases: ['theme'],
    subcommands: ['claro', 'escuro', 'light', 'dark'],
  },
  recomendacoes: {
    name: 'recomendacoes',
    aliases: ['recommendations', 'recs'],
  },
  premios: {
    name: 'premios',
    aliases: ['awards'],
  },
  projetos: {
    name: 'projetos',
    aliases: ['projects'],
  },
  github: {
    name: 'github',
    aliases: ['git', 'api'],
  },
  spotify: {
    name: 'spotify',
    aliases: ['music'],
  },
  stats: {
    name: 'stats',
    aliases: ['githubstats', 'ghstats'],
    // Gráficos: stats --resumo | --linguagens | --atividade | --horarios | --repos | --tudo
    // (ver data/gitHubStatsSections.js)
    subcommands: [
      '--resumo',
      '--linguagens',
      '--atividade',
      '--horarios',
      '--repos',
      '--tudo',
      '--summary',
      '--languages',
      '--activity',
      '--hours',
      '--all',
    ],
  },
  wakatime: {
    name: 'wakatime',
    aliases: ['time'],
    // Estilos: wakatime --terminal | --grade | --lista | --cards (ver data/wakaTimeSkins.js)
    subcommands: ['--terminal', '--grade', '--grid', '--lista', '--list', '--cards'],
  },
  neofetch: {
    name: 'neofetch',
    aliases: ['fetch', 'galo'],
  },
  game: {
    name: 'game',
    aliases: ['araplane', 'aragame'],
  },
  guestbook: {
    name: 'guestbook',
    aliases: ['guest', 'book'],
    subcommands: ['add', 'list', 'help'],
  },
  design: {
    name: 'design',
    aliases: ['ds', 'designsystem'],
  },
};
