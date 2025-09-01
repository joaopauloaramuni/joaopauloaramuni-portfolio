// src/i18n.js

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Objeto que conterá todas as nossas traduções
const resources = {
  // Objeto para o idioma Inglês
  en: {
    translation: {
      "sobre": {
        "nome": "João Paulo Aramuni",
        "cargo": "Software Engineering Professor at PUC Minas",
        "biografia": "Doctor and Master in Information Systems and Knowledge Management from Universidade FUMEC, with a degree in Computer Science. He has 13 years of experience in systems development and 9 years in technology education. He is a professor in the Software Engineering course at PUC Minas, also serving as CTO of the Experimental Software Agency at ICEI. He has been a Tech Lead at Trybe and Tech Manager at IN8, as well as a consultant in artificial intelligence and system architecture. He has experience in team leadership, agile methodologies, design patterns, back-end development (Java and Python), and has participated in projects for companies such as Banco do Brasil, Oi, ANP, Prosegur, HotMilhas, and 123milhas.",
        "titulo_skills": "Main Skills: Teaching, Leadership and people management, Software development, Agile documentation, Global system deployment, Legacy system maintenance, Design patterns, and Agile methodologies: Scrum and Lean."
      },
      "boasvindas": {
        "nome": "João Paulo Aramuni",
        "titulo": "Professor at PUC Minas",
        "bemvindo": "$ Welcome to my Portfolio",
        "cargo": "Software Engineering Professor at PUC Minas",
        "local": "Belo Horizonte, Minas Gerais, Brazil",
        "faculdade": "Software Engineering - PUC Minas",
        "ajuda": "Type `help` to explore all available commands."
      }
    }
  },
  // Objeto para o idioma Português
  pt: {
    translation: {
      "sobre": {
        "nome": "João Paulo Aramuni",
        "cargo": "Professor de Engenharia de Software na PUC Minas",
        "biografia": "Doutor e mestre em Sistemas de Informação e Gestão do Conhecimento pela Universidade FUMEC, com graduação em Ciência da Computação. Possui 13 anos de experiência em desenvolvimento de sistemas e 9 anos no ensino de tecnologia. É professor do curso de Engenharia de Software da PUC Minas, atuando também como CTO da Agência Experimental de Software do ICEI. Já foi Tech Lead na Trybe e Tech Manager na IN8, além de atuar como consultor em inteligência artificial e arquitetura de sistemas. Tem experiência em liderança de equipes, metodologias ágeis, design patterns, desenvolvimento back-end (Java e Python) e participou de projetos para empresas como Banco do Brasil, Oi, ANP, Prosegur, HotMilhas e 123milhas.",
        "titulo_skills": "Principais Habilidades: Docência, Liderança e gestão de pessoas, Desenvolvimento de software, Documentação ágil, Implantação de sistemas em âmbito global, Manutenção de sistemas legados, Design patterns e Metodologias ágeis: Scrum e Lean."
      },
      "boasvindas": {
        "nome": "João Paulo Aramuni",
        "titulo": "Professor na PUC Minas",
        "bemvindo": "$ Bem-vindo ao meu Portfólio",
        "cargo": "Professor de Engenharia de Software na PUC Minas",
        "local": "Belo Horizonte, Minas Gerais, Brasil",
        "faculdade": "Engenharia de Software - PUC Minas",
        "ajuda": "Digite `ajuda` para conhecer mais sobre os comandos."
      }
    }
  }
};

i18n
  .use(initReactI18next) // Passa a instância do i18n para o react-i18next
  .init({
    resources,
    lng: 'pt', // Define o idioma inicial
    fallbackLng: 'en', // Idioma para usar caso a tradução não seja encontrada
    interpolation: {
      escapeValue: false // React já protege contra XSS
    }
  });

export default i18n;
