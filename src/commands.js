import { GRUPOS } from './data/turmasRepos';
import { turmasSubcommands } from './data/turmasSections';
import { canvasSubcommands } from './data/canvasSections';

// Comandos do terminal. "subcommands" alimenta o autocomplete (Tab) da
// segunda palavra, ex.: "tema --c" + Tab → "tema --claro".
export const commandList = {
  sobre: {
    name: 'sobre',
    aliases: ['about'],
  },
  pergunta: {
    name: 'pergunta',
    aliases: ['ask', 'chat'],
    // pergunta <texto> (ou ask <texto>): a IA responde em primeira pessoa
    // (ver components/Ask.jsx); --nova | --new esquecem a conversa
    subcommands: ['--nova', '--new'],
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
    // Seções: lattes --resumo | --docencia | --tccs | --tis | --aes | --bancas | --tudo | --pdf
    // (ver data/lattesSections.js)
    subcommands: [
      '--resumo',
      '--docencia',
      '--tccs',
      '--tis',
      '--aes',
      '--bancas',
      '--tudo',
      '--pdf',
      '--summary',
      '--teaching',
      '--theses',
      '--interdisciplinary',
      '--committees',
      '--all',
    ],
  },
  turmas: {
    name: 'turmas',
    aliases: ['acompanhamento', 'ti', 'classes'],
    // Acompanhamento de turmas de TI (Trabalhos Interdisciplinares).
    // Gráficos: turmas --resumo | --codigo | --linguagens | --ritmo | --equilibrio
    // | --prs | --projetos | --tudo; filtros: ti2, ti5, lourdes, coreu, g1... e o
    // nome de cada grupo (ver data/turmasSections.js)
    subcommands: turmasSubcommands(GRUPOS),
  },
  canvas: {
    name: 'canvas',
    aliases: ['tarefas', 'prazos', 'entregas', 'tasks'],
    // Tarefas, prazos e entregas das minhas disciplinas no Canvas.
    // Seções: canvas --resumo | --tarefas | --agenda | --tudo; filtros: diw,
    // ti5, coreu, lourdes, g1... (ver data/canvasSections.js)
    subcommands: canvasSubcommands,
  },
  habilidades: {
    name: 'habilidades',
    aliases: ['skills'],
    // Estilos: skills --terminal | --cards | --lista | --globo (ver data/skillSkins.js)
    subcommands: ['--terminal', '--cards', '--lista', '--list', '--globo', '--globe'],
  },
  limpar: {
    name: 'limpar',
    aliases: ['clear'],
  },
  tema: {
    name: 'tema',
    aliases: ['theme'],
    // Sem opção, troca na ordem escuro → claro → galo
    subcommands: ['--escuro', '--claro', '--galo', '--dark', '--light'],
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
    aliases: ['fetch'],
  },
  campeonato: {
    name: 'campeonato',
    aliases: ['galo', 'atletico', 'championship'],
    // Próximos jogos do Atlético Mineiro (ver components/Jogos.jsx);
    // --todos | --all mostram todos os jogos já marcados;
    // --tabela | --table mostram a classificação do Brasileirão
    subcommands: ['--todos', '--all', '--tabela', '--table'],
  },
  jogo: {
    name: 'jogo',
    aliases: ['quake', 'flappyplane', 'game'],
    // "jogo", "game" e "quake" abrem o Quake shareware original (ver
    // components/QuakeGame.jsx e public/quake); "flappyplane" abre o
    // Flappy Plane. --quake | --flappyplane escolhem o jogo
    subcommands: ['--quake', '--flappyplane'],
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
