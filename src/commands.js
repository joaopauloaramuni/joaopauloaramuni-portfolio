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
  curriculo: {
    name: 'curriculo',
    aliases: ['resume'],
  },
  habilidades: {
    name: 'habilidades',
    aliases: ['skills'],
    // Estilos: skills --cards | --lista | --terminal (ver data/skillSkins.js)
    subcommands: ['--cards', '--lista', '--list', '--terminal'],
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
  wakatime: {
    name: 'wakatime',
    aliases: ['time'],
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
