// src/commands.js

export const commandList = {
    sobre: {
      name: 'sobre',
      aliases: ['about'],
      description: 'Mostra uma breve descrição sobre mim.',
    },
    ajuda: {
      name: 'ajuda',
      aliases: ['help'],
      description: 'Mostra esta lista de comandos disponíveis.',
    },
    experiencias: {
      name: 'experiencias',
      aliases: ['experience', 'xp'],
      description: 'Mostra minha trajetória profissional e experiências.',
    },
    contato: {
      name: 'contato',
      aliases: ['contact'],
      description: 'Exibe minhas informações de contato.',
    },
    limpar: {
      name: 'limpar',
      aliases: ['clear'],
      description: 'Limpa o histórico do terminal.',
    },
    /*certificacoes: {
      name: 'certificacoes',
      aliases: ['certifications', 'certs'],
      description: 'Exibe minhas certificações profissionais.',
    },*/
    recomendacoes: {
      name: 'recomendacoes',
      aliases: ['recommendations', 'recs'],
      description: 'Exibe minhas recomendações do LinkedIn.',
    },
    premios: {
      name: 'premios',
      aliases: ['awards'],
      description: 'Exibe prêmios e reconhecimentos.',
    },
    projetos: {
      name: 'projetos',
      aliases: ['projects'],
      description: 'Exibe meus projetos desenvolvidos.',
    },
    game: {
      name: 'game',
      aliases: ['chaplane', 'chagame'],
      description: 'Jogue o Flappy Plane diretamente no terminal web.'
    }
  };