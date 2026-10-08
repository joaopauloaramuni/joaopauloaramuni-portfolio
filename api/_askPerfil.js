// Gerado por scripts/ask.mjs (npm run ask). Não edite à mão: para mudar o
// que a IA do comando "pergunta" sabe, edite o currículo (public/cv-pt.pdf), os
// dados dos comandos ou o src/data/askData.js e rode de novo.
//
// Base de conhecimento que a função /api/ask manda para a IA junto com cada
// pergunta. Tudo aqui é público: está no site ou no currículo em PDF.

// Para o servidor calcular idade e anos de experiência no dia da pergunta
export const PERFIL_FATOS = {
  "geradoEm": "2026-10-08",
  "nascimento": {
    "ano": 1990,
    "mes": 12,
    "dia": 21
  },
  "devDesde": 2012,
  "ensinoDesde": 2016
};

export const PERFIL = `# Base de conhecimento sobre João Paulo Aramuni

Gerada por npm run ask em 2026-10-08. A parte "Portfólio" é a mais atualizada; o "Currículo em PDF" traz mais detalhes de cada experiência. Se os dois discordarem, vale o portfólio.

# Portfólio (aramuni.dev)

## Identidade

- Nome: João Paulo Aramuni (nome completo: João Paulo Carneiro Aramuni)
- Cargo: Professor de Engenharia de Software e Ciência da Computação na PUC Minas
- Lema: programador por profissão, professor por vocação
- Moro em: Belo Horizonte, MG
- Nascimento: 21/12/1990 (signo: Sagitário)
- Desenvolvo sistemas desde 2012 e ensino tecnologia desde 2016


## Quem sou

Sou professor de Engenharia de Software e Ciência da Computação na PUC Minas, CTO da Agência Experimental de Software do ICEI e consultor de tecnologia na Jedis. Sou doutor e mestre em Sistemas de Informação e Gestão do Conhecimento pela Universidade FUMEC, onde também me formei em Ciência da Computação.

São {{anos_dev}} anos desenvolvendo sistemas e {{anos_ensino}} anos ensinando tecnologia. No mercado, fui de Java para logística e transporte de valores a crawlers em Python para programas de milhagem, e liderei times como Tech Lead na Trybe e Tech Manager na IN8. Hoje aplico inteligência artificial na avaliação de perfis técnicos, defino arquitetura de sistemas e cuido de observabilidade e de sistemas na AWS. Na sala de aula, levo essa prática para os projetos dos alunos, e o material das disciplinas fica aberto no GitHub.

(Contando desde 2012, no Banco do Brasil.)


## Números

- 40 TCCs orientados
- 75 bancas examinadoras
- CTO da Agência Experimental de Software (AES): 7 times, ~35 pessoas sob minha gestão


## O que faço hoje

- Professor na PUC Minas: Engenharia de Software e Ciência da Computação · orientador de TCC II (https://www.pucminas.br/)
- CTO na Agência Experimental de Software: 7 times de desenvolvimento, em média 35 pessoas, no ICEI da PUC Minas (https://icei.pucminas.br/aes/)
- Consultor de tecnologia na Jedis: IA na identificação e avaliação de perfis técnicos, arquitetura de sistemas, observabilidade, AWS e mentoria de times (https://www.jedis.com.br/)


## Trajetória

### programador por profissão (mercado)

- 2025 – hoje · Consultor de tecnologia na Jedis: IA em recrutamento técnico, arquitetura e AWS
- 2023 · Tech Manager na IN8: squads de vários projetos para o mercado de milhas aéreas
- 2020 – 2023 · Tech Lead na Trybe: times de back-end e ciência da computação, OKRs e conteúdo
- 2019 – 2020 · Dev back-end sênior na IN8: web scraping e crawlers em Python para programas de milhagem
- 2013 – 2017 · Programador e analista na Capgemini: Java para a ANP e a Prosegur; de júnior a sênior sem passar por pleno
- 2012 – 2013 · Técnico programador na Banco do Brasil: Java e sistemas integrados ao SISBB
- 2011 · Desenvolvedor C# na Álamo TI: C# e ASP.NET para gestão de projetos e ponto eletrônico

### professor por vocação (docência)

- 2024 – hoje · Professor e CTO da AES na PUC Minas: Engenharia de Software e Ciência da Computação
- 2023 – 2024 · Professor na Newton Paiva: Ciência da Computação, Sistemas de Informação e ADS
- 2020 – 2021 · Professor na XP Educação: Arquitetura de Software e Engenharia de Requisitos
- 2020 · Especialista em Instrução de Tecnologia na Trybe: Ciência da Computação com Python para as turmas 1 a 4
- 2016 – 2020 · Professor na FUMEC: Ciência da Computação, Sistemas de Informação e Redes


## Formação

- 2017 – 2020 · Doutorado em Sistemas de Informação e Gestão do Conhecimento, Universidade FUMEC. Tese: "Gestão ágil do conhecimento: uma análise da influência que a filosofia ágil exerce na gestão do conhecimento em organizações do segmento de tecnologia da informação" (orientador: Prof. Dr. Luiz Cláudio Gomes Maia; https://repositorio.fumec.br/handle/123456789/878)
- 2014 – 2015 · Mestrado em Sistemas de Informação e Gestão do Conhecimento, Universidade FUMEC. Dissertação: "Análise da adoção do Lean Manufacturing na gestão de projetos de tecnologia da informação: estudo de caso em uma multinacional desse segmento" (orientador: Prof. Dr. Luiz Cláudio Gomes Maia; https://repositorio.fumec.br/handle/123456789/270)
- 2010 – 2013 · Bacharelado em Ciência da Computação, Universidade FUMEC. Monografia (TCC): "Desenvolvimento ágil de aplicações web" (orientador: Prof. Dr. Flávio Velloso Laper; https://github.com/joaopauloaramuni/trabalhos-finais/blob/main/BACHARELADO/Monografia.pdf)
- 2022 · Educação executiva em PDL - Programa de Desenvolvimento da Liderança, Fundação Dom Cabral. Módulos: Líderes de Líderes, Líderes de Equipes

Trabalhos finais e slides das defesas: https://github.com/joaopauloaramuni/trabalhos-finais


## Disciplinas que leciono e já lecionei

Semestre "AAAA.1" = jan–jun, "AAAA.2" = jul–dez. Disciplinas com o semestre atual são as que leciono agora.

### Pontifícia Universidade Católica de Minas Gerais - PUC Minas

- Desenvolvimento de Interfaces Web (Ciência da Computação) · semestres 2026.2 · material: https://github.com/joaopauloaramuni/desenvolvimento-de-interfaces-web
- Trabalho Interdisciplinar II: Front-End (Ciência da Computação) · semestres 2026.2 · material: https://github.com/joaopauloaramuni/trabalho-interdisciplinar-front-end
- Laboratório de Iniciação à Programação (Ciência da Computação) · semestres 2024.1 · material: https://github.com/joaopauloaramuni/laboratorio-de-introducao-a-programacao
- Trabalho de Conclusão de Curso (Engenharia de Software) · semestres 2025.1 a 2026.2 · material: https://github.com/joaopauloaramuni/trabalho-de-conclusao-de-curso-ii
- Projeto de Software (Engenharia de Software) · semestres 2024.2 a 2026.1 · material: https://github.com/joaopauloaramuni/projeto-de-software
- Laboratório de Desenvolvimento de Software (Engenharia de Software) · semestres 2024.2 a 2026.1 · material: https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software
- Laboratório de Experimentação de Software (Engenharia de Software) · semestres 2024.2 a 2025.2 · material: https://github.com/joaopauloaramuni/laboratorio-de-experimentacao-de-software
- Trabalho Interdisciplinar III: Aplicações para Cenários Reais (Engenharia de Software) · semestres 2024.2 a 2025.2 · material: https://github.com/joaopauloaramuni/trabalho-interdisciplinar-aplicacoes-para-cenarios-reais
- Trabalho Interdisciplinar V: Aplicações Distribuídas (Engenharia de Software) · semestres 2026.1 a 2026.2 · material: https://github.com/joaopauloaramuni/trabalho-interdisciplinar-aplicacoes-distribuidas
- Fundamentos de Projeto e Análise de Algoritmos (Engenharia de Software) · semestres 2025.1 a 2025.2 · material: https://github.com/joaopauloaramuni/fundamentos-de-projeto-e-analise-de-algoritmos
- Trabalho Interdisciplinar I: Aplicações Web (Engenharia de Software) · semestres 2024.1 a 2024.2 · material: https://github.com/joaopauloaramuni/trabalho-interdisciplinar-aplicacoes-web
- Desenvolvimento e Integração de Aplicações Web (Engenharia de Software) · semestres 2026.2 · material: https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web
- Algoritmos e Estruturas de Dados I (Engenharia de Software) · semestres 2024.1 · material: https://github.com/joaopauloaramuni/algoritmos-e-estruturas-de-dados-i

### Centro Universitário Newton Paiva

- Linguagens de Programação (Ciência da Computação, Sistemas de Informação, Análise e Desenvolvimento de Sistemas) · semestres 2023.2 a 2024.1 · material: https://github.com/joaopauloaramuni/linguagens-de-programacao
- Arquitetura de Aplicações Web (Ciência da Computação, Sistemas de Informação, Análise e Desenvolvimento de Sistemas) · semestres 2024.1 · material: https://github.com/joaopauloaramuni/arquitetura-de-aplicacoes-web
- Banco de Dados (Ciência da Computação, Sistemas de Informação, Análise e Desenvolvimento de Sistemas) · semestres 2023.2 · material: https://github.com/joaopauloaramuni/banco-de-dados

### Instituto de Gestão e Tecnologia da Informação (IGTI)

- Engenharia de Requisitos (Arquitetura de Software) · semestres 2020.2 · material: https://github.com/joaopauloaramuni/engenharia-de-requisitos

### Trybe

- Estruturas de Dados com Python (Desenvolvimento Web) · 2020-03 a 2020-10
- Algoritmos com Python (Desenvolvimento Web) · 2020-03 a 2020-10
- Raspagem de Dados com Python (Desenvolvimento Web) · 2020-03 a 2020-10
- Especialista em Instrução de Ciência da Computação · 2020-03 a 2020-10
- Liderança de Instrução de Back-end e Ciência da Computação · 2020-10 a 2021-04
- Liderança de Instrução de Ciência da Computação · 2021-04 a 2022-08
- Líder de Currículo e Líder Técnico de Ciência da Computação · 2022-08 a 2023-03
- Líder Técnico de Currículo de Ciência da Computação · 2023-03 a 2023-06

### Universidade FUMEC

- Trabalho de Conclusão de Curso (Ciência da Computação) · semestres 2016.2 a 2020.1 · material: https://github.com/joaopauloaramuni/trabalho-de-conclusao-de-curso-ii
- Fundamentos Teóricos da Computação (Ciência da Computação) · semestres 2016.2 a 2019.2 · material: https://github.com/joaopauloaramuni/fundamentos-teoricos-da-computacao
- Compiladores com C++ (Ciência da Computação) · semestres 2017.2 a 2020.1 · material: https://github.com/joaopauloaramuni/compiladores
- Programação Orientada a Objetos com Java (Ciência da Computação) · semestres 2017.2 a 2020.1 · material: https://github.com/joaopauloaramuni/poo
- Desenvolvimento de Scripts II com ShellScript (Redes de Computadores) · semestres 2016.1 a 2018.1 · material: https://github.com/joaopauloaramuni/desenvolvimento-de-scripts-ii
- Desenvolvimento de Scripts I com VBScript (Redes de Computadores) · semestres 2016.1 a 2017.1 · material: https://github.com/joaopauloaramuni/desenvolvimento-de-scripts-i
- Engenharia de Software II (Sistemas de Informação) · semestres 2018.1, 2019.1
- Introdução à Programação Web (Sistemas de Informação) · semestres 2018.2


## Experiências profissionais (comando experiencias)

- Consultor de Tecnologia · Jedis - Tecnologia e Recrutamento · 2025 – atual: Liderança técnica (papel de CTO) de 4 devs, 1 PO e QA terceirizado em sistemas para JdsDev, Mereo, Afya, Autoglass e Allos. Estimativa de esforço, prazo e custo dos projetos (horas, semanas e valores), com pré-refinamento técnico, marcos, margens de QA e contingência, cenários e riscos, embasando propostas de até ~3.000 h. Apoio à precificação do SaaS ATS RHápido. Arquiteturas cloud-native e de microsserviços, APIs de integração e decisões técnicas. Liderança, com a Eficify, da migração do RHápido da AWS (EC2/S3) para Kubernetes na Eficify Private Cloud: rede segmentada com Bastion Host, GitOps com ArgoCD, Zero Trust (RBAC, MFA e auditoria), Grafana e Loki, IaC e backups com PITR. Mentoria, contratação de devs, PDIs e implantação do Claude Code no time. Competências: Estimativa e precificação de software, Arquitetura cloud-native, Kubernetes, DevOps e GitOps, Zero Trust, Microsserviços, Infraestrutura como código, Observabilidade, IA generativa no desenvolvimento, Mentoria técnica, Comunicação com stakeholders.
- Professor · PUC Minas · 2024 – atual: No curso de Engenharia de Software, é professor das disciplinas de Fundamentos de Projeto e Análise de Algoritmos, Projeto de Software, Laboratório de Desenvolvimento de Software, Laboratório de Experimentação de Software e Trabalho Interdisciplinar: Aplicações para Cenários Reais. Também foi professor das disciplinas de Trabalho Interdisciplinar: Aplicações Web e Algoritmos e Estruturas de Dados I (Linguagem C) do curso de Engenharia de Software e da disciplina de Laboratório de Iniciação à Programação do curso de Ciência da Computação. Orientador na disciplina de TCCII e CTO da Agência Experimental de Software do ICEI, responsável por 6 times (~30 pessoas). Condução de oficinas e aulões sobre tópicos de desenvolvimento de software, abordando Python, Spring Boot, Docker, PostgreSQL, MongoDB, Nuvem, Inteligência Artificial e mais, além da criação de conteúdo técnico e material de apoio. Competências: Docência, Liderança, Desenvolvimento de software, Documentação ágil, Deploy de sistemas globais, Manutenção de sistemas legados, Padrões de projeto, Metodologias ágeis.
- Professor · Centro Universitário Newton Paiva · 2023 – 2024: Professor das disciplinas de Linguagens de Programação (Java), Arquitetura de Aplicações Web e Banco de Dados dos cursos de Ciência da Computação, Sistemas de Informação e Análise e Desenvolvimento de Sistemas. Professor destaque do curso de Sistemas de Informação (2º semestre de 2023). Lógica de Programação com jogos (Scratch) para o ensino médio do Colégio Santa Dorotéia e Colégio ICJ. Competências: Docência, Java, Arquitetura de aplicações Web, Banco de Dados, Lógica de programação lúdica.
- Tech Manager · IN8 · 2023: Liderança de squads responsáveis por múltiplos projetos de desenvolvimento de sistemas para o mercado de milhas aéreas. Facilitador para assegurar execução contínua, alinhamento de demandas e solução de impedimentos. Responsável pela disponibilidade, escalabilidade, performance e segurança das aplicações, integração técnica com produto, dados e negócios, contato direto com clientes, condução de contratações e mentoria de equipes. Tech Stack: Node.js, Next.js, Python, FastAPI, AWS, Docker, Redis, Amazon SQS, GitLab, Grafana, New Relic. Competências: Gestão de projetos de tecnologia, Comunicação eficaz, Resolução de problemas, Liderança técnica, Node.js, Next.js, Python, FastAPI, AWS, Docker, CI/CD, Monitoramento de sistemas.
- Curriculum Tech Lead · Trybe · 2023: Responsável pela estrutura curricular em Python e pelo desenvolvimento técnico do time. Tomada de decisão baseada em dados para maximizar empregabilidade dos estudantes. Formação, orientação técnica e mentoria da equipe, produção de conteúdos complexos e desenvolvimento de instrumentos de avaliação. Competências: Liderança técnica, Ciência da computação, Python, Gestão de equipe, Produção de conteúdo, Avaliação educacional.
- Curriculum Lead & Tech · Trybe · 2022 – 2023: Gestão da estrutura curricular em Python e liderança de time de 3 pessoas. Definição de OKRs e KPIs da área, produção de conteúdo técnico em Python e Java e orientação direta da equipe. Competências: Gestão de conteúdo, Python, Java, Liderança de equipe, Definição de OKRs e KPIs.
- Computer Science Lead Instructor · Trybe · 2021 – 2022: Gestão da operação de aprendizagem de turmas e de um time de 10 pessoas. Definição de OKRs e KPIs da área, processos seletivos e liderança direta de instrutores e especialistas de Ciência da Computação. Competências: Liderança de equipe, Ciência da computação, Liderança técnica, Definição de OKRs e KPIs.
- Back-End & CS Lead Instructor · Trybe · 2020 – 2021: Gestão da operação de aprendizagem de turmas e de um time de 17 pessoas. Definição de OKRs e KPIs da área, processos seletivos e liderança direta de instrutores de Back-End e Ciência da Computação. Competências: Liderança de equipe, Back-End, Ciência da computação, Liderança técnica, Definição de OKRs e KPIs.
- Computer Science Specialist Instructor · Trybe · 2020: Ministrou aulas de Python, POO, Web Scraping, algoritmos e estruturas de dados. Participou da construção da primeira versão do currículo de Ciência da Computação da Trybe. Instrutor da primeira turma da Trybe (Turma 1). Competências: Docência, Ciência da computação, Python, JavaScript, POO, Web Scraping, Algoritmos e Estruturas de Dados.
- Professor · XP Educação · 2020 – 2021: Professor de Arquitetura de Software e Engenharia de Requisitos. Apresentação de conceitos fundamentais, práticas e ferramentas utilizadas em projetos arquiteturais, com desenvolvimento de hard e soft skills para arquitetos de software. Competências: Docência, Arquitetura de Software, Engenharia de Requisitos, Java, C++, VBScript, Shell Script.
- Professor · Universidade FUMEC · 2016 – 2020: Professor das disciplinas de Fundamentos Teóricos da Computação, Compiladores e POO. Professor das disciplinas de Desenvolvimento de Scripts I e II em Redes de Computadores. Professor das disciplinas de Engenharia de Software II e Introdução à Programação Web em Sistemas de Informação EaD. Orientação de monografias, coordenação de projetos de extensão e direcionamento de alunos para estágio e mercado. Competências: Docência, Fundamentos Teóricos da Computação, Compiladores, POO, Engenharia de Software, Programação Web, Desenvolvimento de Scripts.
- Desenvolvedor Back-End Sênior · IN8 · 2019 – 2020: Web scraping e desenvolvimento de crawlers em Python 3 para programas de milhas aéreas. Criação e manutenção de APIs RESTful para extração de dados e automação de navegadores. Arquitetura cloud AWS com HA/DR, CI/CD, administração de containers Docker e monitoramento com Grafana e New Relic. Competências: Python, Web Scraping, APIs RESTful, AWS, Docker, CI/CD, Observabilidade e monitoramento.
- Analista de Sistemas Pleno · Prosegur · 2014 – 2017: Desenvolvimento de sistema distribuído em Java 8, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink. Implantação em âmbito global. Software Maintenance, refatoração e melhorias de performance. Testes de WebServices e automatizados. Manipulação de Banco de Dados Oracle. Programação PL/SQL. Documentação de Casos de Uso. Metodologia Ágil Scrum. Competências: Java, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink, PL/SQL, Oracle, Scrum, Testes automatizados.
- Analista de Sistemas Pleno · Capgemini · 2013 – 2017: Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing. Competências: Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.
- Analista de Sistemas Júnior · Capgemini · 2014 – 2015: Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing. Competências: Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.
- Programador Sênior · Capgemini · 2014: Segunda vez na história da Capgemini no Brasil em que houve uma progressão de Junior para Sênior pulando-se a posição de Pleno. Competências: Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.
- Programador Júnior · Capgemini · 2013 – 2014: Desenvolvimento e manutenção dos sistemas SIGEP e SIMP da ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis), com foco em aplicações web, processamento de documentos e suporte à conformidade regulatória. Competências: Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.
- Técnico/Programador · Banco do Brasil · 2012 – 2013: Estágio supervisionado obrigatório em desenvolvimento e suporte a aplicativos em Java / Java Web; Manutenção de sistemas integrados ao SISBB. Desenvolvimento e suporte a aplicações legadas VBA / VB6; Programação PL/SQL; Levantamento de requisitos. Competências: Java, Java Web, VBA, VB6, PL/SQL, Automação Bancária.
- Desenvolvedor C# · Álamo - Soluções em TI · 2011: Desenvolvimento em C# /.NET v3.5 para sistema de gestão de projetos e controle de ponto eletrônico. Desenvolvimento Web com ASP.NET. Controle de versão com TortoiseCVS. Manipulação de Banco de Dados SQL Server. Criação de procedures e triggers. Competências: C#, ASP.NET, SQL Server, Procedures, Triggers.
- Estagiário · CPD FACE/FUMEC · 2010: Estágio em CPD FACE/FUMEC: Desenvolvimento de aplicativos internos com PHP e Jquery. Suporte técnico em redes. Manutenção de servidores Linux. Programação com Shell Script. Help Desk. Competências: PHP, Jquery, Shell Script, Redes, Linux, Help Desk.
- Bolsista de Iniciação Científica · PIBIC/CNPq · 2010: Bolsista PIBIC/CNPq em projeto sobre microscopia de força atômica para investigar interação de compostos polifenólicos com células e vírus HTLV-1. Desenvolvido na UFMG e CETEC, orientado pelo Prof Dr Orlando Abreu Gomes. Competências: Pesquisa científica, Microscopia de Força Atômica, Biologia celular, Virologia, Documentação científica, Apoio à pesquisa acadêmica


## Projetos em destaque (comando projetos)

- Projetos Python (Python, Tkinter, Pandas, Seaborn): Coleção de projetos em Python, incluindo automação, análise de dados, desenvolvimento web e aprendizado de máquina. Mostram aplicação prática de algoritmos, integração com APIs, manipulação de dados e criação de interfaces interativas, oferecendo soluções de ferramentas utilitárias, compressores, geradores de arte, simuladores e analisadores de métricas de código. https://github.com/joaopauloaramuni/python
- Projetos Spring Boot (Java, SpringBoot, REST): Coleção de projetos em Java com Spring Boot, incluindo APIs REST, integração com bancos SQL e NoSQL, autenticação JWT, processamento de dados e funcionalidades web. Mostram arquitetura, serviços com interface de usuário, integração com APIs como Huggingface e MercadoPago, compressão de arquivos, mensageria e login seguro, oferecendo portfólio conciso de soluções backend. https://github.com/joaopauloaramuni/laboratorio-de-desenvolvimento-de-software
- Projetos Linguagem C (C, C++, MinGW, GCC): Coleção de projetos em C e C++, incluindo algoritmos, estruturas de dados, recursão, ponteiros, structs, arquivos e controle de fluxo. Compilados com MinGW/GCC, vão de calculadoras e jogos simples até multiplicação de matrizes, manipulação de arquivos, simulações e algoritmos de ordenação, oferecendo portfólio de fundamentos da programação, lógica, eficiência e boas práticas. https://github.com/joaopauloaramuni/algoritmos-e-estruturas-de-dados-i
- Portfólio Pessoal (React, Vite, Node): Portfólio em React e Vite que simula um terminal para navegar entre projetos, experiências e premiações. Inclui componentes como ProjectCard e ExperienceCard, exibindo informações de forma dinâmica. Suporta múltiplos idiomas e integra mini-jogo, oferecendo experiência divertida. Combina design moderno, navegação intuitiva e funcionalidades interativas. https://github.com/joaopauloaramuni/joaopauloaramuni-portfolio
- GitHub Readme Profile (Markdown, HTML): Projeto para construção de perfis no GitHub, com READMEs personalizados, estatísticas, badges, gráficos de atividade e contribuições. Inclui integração com WakaTime e Spotify, exemplos de perfis interativos, guias de boas práticas, elementos visuais dinâmicos e geração automática de conteúdo. Objetivo é fornecer portfólio completo e atraente, destacando habilidades e projetos. https://github.com/joaopauloaramuni
- STOR - Plataforma de Gestão Integrada de Projetos e Ativos (C#, ASP, .Net): O STOR é uma solução modular que apoia a aplicação do BIM (Business Information Modelling), integrando todas as etapas de projetos de engenharia, manutenção e operação. A plataforma permite controlar documentos, materiais, compras e processos em uma planta virtual, reduzindo custos, eliminando desperdícios e aumentando a qualidade do produto final. https://www.linkedin.com/company/storglobal/
- SIMP, I-SIMP, SIGEP, I-SIGEP (Java, VB6, ASP Clássico): Projetos desenvolvidos para a ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis), voltados à gestão de informações de exploração, produção e movimentação de petróleo, gás e derivados. Incluíram modernização do SIGEP/i-SIGEP para envio seguro de documentos com protocolos e assinaturas digitais, além do SIMP/i-SIMP para monitoramento integrado da cadeia downstream. https://isimp.anp.gov.br/
- SOL - Sistema de Operações Logísticas (Java, JavaFX, Primefaces): O Projeto SOL da Prosegur unifica os sistemas de logística de valores em vários países, permitindo controlar operações, recursos, veículos, pessoas, rotas e serviços. É uma plataforma robusta, parametrizável e de fácil manutenção, incorporando as melhores funcionalidades existentes e facilitando o trabalho da equipe de análise. https://www.prosegur.com.br/
- HotMilhas Crawlers (Python, Node, Crawlers, NewRelic, Grafana): Desenvolvimento de crawlers em Python 3 para programas de milhas aéreas, com automação de navegadores e extração estruturada de dados. Inclui criação de APIs RESTful para integração com sistemas internos, uso de arquitetura cloud (AWS) escalável, containers Docker e pipelines de CI/CD no GitLab. Projeto com mensageria (SQS, Redis) e observabilidade via Grafana e New Relic. https://github.com/joaopauloaramuni/python/tree/main/DESAFIOS/desafio_bots
- Landing Page - Agência Experimental de Software (JavaScript, HTML, CSS, Docker): A Landing Page da AES apresenta a agência, capta demandas e destaca projetos e talentos das equipes. Facilita a comunicação entre clientes e desenvolvedores, oferecendo envio direto de demandas às equipes responsáveis. Também divulga a agência, mostrando projetos, conquistas, talentos e serviços, funcionando como uma vitrine para o mercado conhecer o potencial da AES. https://icei.pucminas.br/aes
- Grade Inteligente - Agência Experimental de Software (Java, JavaScript, HTML, CSS, Docker): A Grade Inteligente ajuda alunos a organizar sua matriz curricular, oferecendo visualização gráfica das disciplinas ao longo dos períodos. Permite reorganizar matérias conforme preferências, acompanhar progresso acadêmico, explorar disciplinas de outros cursos e planejar escolhas futuras, proporcionando uma experiência de aprendizado mais completa, personalizada e flexível. https://icei.pucminas.br/gradeinteligente/
- Cuido Bem - Agência Experimental de Software (Dart, Java, Flutter): O CuidoBem é um projeto da PUC Minas, em parceria com o Instituto Mário Penna e o Centro Clínico de Fisioterapia, que visa apoiar a desospitalização de pacientes com câncer. O aplicativo orienta os pacientes sobre práticas fisioterapêuticas em casa, substituindo a cartilha de papel por uma solução digital mais prática. https://icei.pucminas.br/aes/
- PMMG - Cartão Programa - Agência Experimental de Software (Java, Spring Boot, Angular): O Cartão Programa é um projeto em parceria com a Polícia Militar de Minas Gerais, que visa facilitar o planejamento de itinerários dos policiais no estado. A solução digital substitui o processo manual atual e será acessada dentro do SIGOp, sistema utilizado para gestão e análise de informações operacionais. https://estatisticas.policiamilitar.mg.gov.br/
- PMMG - RH Concurso - Agência Experimental de Software (Java, Spring Boot, React): O projeto RH Concurso é fruto da parceria entre a AES e a Polícia Militar de Minas Gerais, com o objetivo de modernizar e digitalizar os processos de seleção de candidatos. A solução proposta substitui a tramitação manual de documentos, garantindo maior rastreabilidade, confiabilidade e agilidade na análise de dados. O sistema será integrado ao ambiente da PMMG e trará impacto direto na eficiência da gestão de concursos públicos. https://www.linkedin.com/in/cts-centro-de-tecnologia-em-sistemas-697471298/
- Mapa de Sustentabilidade - Agência Experimental de Software (React, Vite, Java, SpringBoot): O projeto Mapa de Sustentabilidade, desenvolvido pela Agência Experimental de Software da PUC Minas em parceria com o Centro de Inteligência em Sustentabilidade (CIS) do BH-TEC, é uma iniciativa voltada ao mapeamento de ações sustentáveis em todo o estado de Minas Gerais. O mapeamento contribui para dar visibilidade a essas iniciativas, além de fornecer métricas que subsidiam discussões governamentais sobre sustentabilidade. https://bh-tec.vercel.app/
- Ajuda-aí App - Agência Experimental de Software (Dart, Java, Flutter): O Ajuda-aí é um aplicativo que otimiza o programa de apadrinhamento do curso de Engenharia de Software da PUC Minas. Centraliza informações dos participantes e melhora a comunicação entre padrinhos e apadrinhados. Com algoritmo de match avançado, garante que cada apadrinhado seja combinado com o padrinho mais adequado, oferecendo uma experiência personalizada. https://icei.pucminas.br/
- Concreto Sustentável - Agência Experimental de Software (Javascript, React, Python): O projeto Concreto Sustentável, desenvolvido pela Agência Experimental de Software (AES) da PUC Minas em parceria com a MRV Engenharia, tem como objetivo reduzir significativamente o descarte e desperdício de concreto nos processos construtivos da empresa — um dos principais desafios ambientais enfrentados pelo setor da construção civil. https://www.mrv.com.br/
- APAC Feminina BH - Agência Experimental de Software (Javascript, React, Spring Boot): O sistema da APAC Feminina BH (Associação de Proteção e Assistência aos Condenados), desenvolvido pela Agência Experimental de Software (AES) da PUC Minas em parceria com o Departamento de Enfermagem do ICBS da PUC Minas, é uma plataforma de gestão da farmácia que centraliza o controle de medicamentos das detentas, registrando entrada, distribuição e consumo, acompanhando cada tratamento individualmente e mantendo o estoque atualizado. https://www.youtube.com/watch?v=2sxA9d-2pb4
- RHapido 2.0 - Jedis Tecnologia e Recrutamento (JavaScript, React, Next, SpringBoot): O Rhapido 2.0 é um sistema de gestão de processos seletivos que utiliza inteligência artificial para agilizar e tornar mais eficiente o recrutamento de novos talentos. Desenvolvido com tecnologia de ponta, o sistema oferece uma triagem inteligente de currículos, reduzindo o tempo e o custo do processo seletivo. https://jdsdev.rhapido.app/


## Prêmios e reconhecimentos (comando premios)

- 2024 · Professor destaque do curso de Sistemas de Informação (Centro Universitário Newton Paiva): Reconhecimento pelo excelente desempenho como docente do curso de Sistemas de Informação, no segundo semestre de 2023.
- 2020 · Patrono da turma de Ciência da Computação 1SEM/2020 (Universidade FUMEC): A atribuição do termo patrono está relacionada com o ato de outorga do grau acadêmico. Nas cerimônias de colação de grau, como parte de uma tradição, os alunos formandos devem eleger uma personalidade de destaque no campo científico a que pertencem como 'padrinho da turma'. O título de patrono é uma honra para o profissional que o recebe, pois significa que seu trabalho e estudo são reconhecidos e admirados pela nova geração de profissionais.
- 2015 · Mejor Trabajo en Equipo (Prosegur): Prêmio concedido ao Equipo SOL pelo desenvolvimento dos evolutivos do sistema SOL utilizando a metodologia ágil Scrum. A equipe foi organizada em 3 squads: 2 times Scrum e 1 time de suporte/correções. O objetivo de dedicar uma equipe menor ao suporte e correções era permitir que os times Scrum permanecessem focados nas entregas das user stories. Cada sprint tinha duração de 2 semanas, incluindo planejamento, apresentação e retrospectiva. Esta estrutura permitiu desenvolvimento e entrega contínua.
- 2014 · 2º Lugar geral do curso de Ciência da Computação (Universidade FUMEC): Reconhecimento concedido pela Universidade FUMEC pelo 2º lugar geral no curso de Bacharelado em Ciência da Computação no ano de 2013. Este resultado reflete desempenho acadêmico consistente, dedicação aos estudos e compromisso com a excelência técnica e científica.


## Habilidades em programação (comando skills)

- Java: 90%
- Python: 80%
- C: 80%
- Spring Boot: 80%
- JavaScript: 70%
- Node.js: 70%
- React: 60%
- Flutter: 20%


## Vivência e clientes

Vivência: Docência, Liderança e gestão de pessoas, Desenvolvimento de software, Documentação ágil, Implantação de sistemas em âmbito global, Manutenção de sistemas legados, Design patterns, Scrum, Lean.

Já desenvolvi software para: Oi (Oi Telecomunicações); ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis); Banco do Brasil (Banco do Brasil S/A); VSB (Vallourec Sumitomo Tubos do Brasil); Prosegur (Logística e transporte de valores); HotMilhas (Milhas aéreas); 123milhas (Viagens e milhas aéreas); Jedis (Tecnologia e recrutamento); Mereo (Gestão de performance e pessoas); Afya (Líder em graduação médica no Brasil); AutoGlass (A maior loja virtual de vidros automotivos da América Latina); Allos (Plataforma de entretenimento); CIS · BH-TEC (Centro de Inteligência em Sustentabilidade do Parque Tecnológico de Belo Horizonte); MRV (MRV Engenharia); PMMG (Polícia Militar de Minas Gerais); APAC Feminina BH (Associação de Proteção e Assistência aos Condenados); Instituto Mário Penna; Fisioterapia PUC Minas (Centro Clínico de Fisioterapia da PUC Minas - Coração Eucarístico); Enfermagem PUC Minas (Departamento de Enfermagem da PUC Minas - Coração Eucarístico e Betim); ICEI PUC Minas (Instituto de Ciências Exatas e Informática da PUC Minas).


## Fora do terminal

- Time: Atleticano, torço para o galão 🐓 (Clube Atlético Mineiro, o Galo; o site tem até um tema do Galo: tema --galo)
- Hobbies: Mu Online, Tibia, basquete, violão
- Série favorita: The IT Crowd
- Assistindo: Foundation, Dune: Prophecy, Silo, From, The Penguin, Dope Thief
- Lugares que já visitei: América do Sul: Brasil, Argentina, Uruguai; Europa: Alemanha, França, Itália, Vaticano, Suíça; Ásia: Japão, Coreia do Sul, China, Hong Kong, Macau, Tailândia, Indonésia, Singapura, Malásia, Dubai, Abu Dhabi


## Recomendações do LinkedIn (comando recomendacoes)

73 recomendações no LinkedIn, de alunos, colegas de trabalho e clientes. As mais recentes:

- João Gabriel Maia (2026; João Gabriel foi cliente de João Paulo): "Tive a oportunidade de aprender muito com Aramuni, tanto na parte teórica quanto na prática. Seu suporte e seus direcionamentos foram importantes para minha evolução e, principalmente, para que eu passasse a enxergar a Engenharia de Software com uma visão mais ampla e profissional. Sou grato por todos os aprendizados…"
- Fernando Pagani (2026; Fernando foi cliente de João Paulo): "Um dos melhores professores que tive. Realmente alguém que não só entende como gosta das ferramentas que usa e ensina. Sua didática e compreensão dos tópicos são sempre surpreendentes e sempre ajudam a situar e ensinar os alunos."
- Eric Jardim (2026; Eric respondia diretamente a João Paulo): "Tive o prazer de trabalhar com João Paulo como meu orientador durante o Trabalho de Conclusão de Curso (TCC). Ao longo de todo o projeto, ele forneceu orientações valiosas não apenas sobre os aspectos técnicos do desenvolvimento, mas também sobre a documentação e a estruturação dos diagramas UML e de arquitetura. Seus…"
- Pedro Carbonaro (2026; Pedro foi cliente de João Paulo): "O professor João Paulo, mais conhecido como Aramuni tem bastante destaque pela excelência na condução das disciplinas de Tecnologia da Informação no curso de Engenharia de Software. Sua atuação é marcada por alto nível de competência técnica, profissionalismo e domínio aprofundado dos conteúdos ministrados. Possui uma…"
- Felipe Giannetti (2026; Felipe foi cliente de João Paulo): "Tive o João Paulo como professor na PUC Minas e posso dizer que é um excelente profissional. Sempre muito disponível, me ajudou diversas vezes com dúvidas relacionadas a projetos pessoais, demonstrando um real interesse no aprendizado dos alunos. Ele teve um papel importante no meu aprofundamento em arquitetura de…"
- Artur Bomtempo (2026; Artur foi cliente de João Paulo): "Tenho a oportunidade de ser aluno do professor João Paulo Aramuni e posso afirmar que sua didática se destaca pela forma dinâmica e envolvente com que conduz as aulas. Um dos seus grandes diferenciais é o foco em atividades práticas, sempre incentivando o desenvolvimento de projetos com tecnologias relevantes para o…"
- Tito Chen (2025; Tito era cliente de João Paulo): "É com grande satisfação que recomendo o Professor João Paulo Aramuni. Como meu orientador de TCC, sua disponibilidade e conhecimento técnico foram cruciais para o desenvolvimento do software 'Keep', uma solução inovadora para o gerenciamento de parque de máquinas. Sua capacidade de guiar e estimular o pensamento…"
- Guilherme Vieira (2025; Guilherme era cliente de João Paulo): "Tive a sorte de ter o João Paulo Aramuni como professor na disciplina de Projeto de Software. Ele é aquele tipo de professor que não só domina o assunto, mas tem um jeito de explicar que faz tudo parecer mais simples. O que mais valorizo nele é a parceria: sempre acessível, pronto para trocar uma ideia sobre o mercado…"
- Lucas Cerqueira (2025; Lucas era cliente de João Paulo): "Tive o privilégio nesse semestre de ser aluno do professor João Paulo Aramuni em FPAA na Engenharia de Software. Além de dominar o conteúdo e explicar a matéria de forma clara, sempre esteve presente para tirar dúvidas, orientar sobre carreira e indicar estudos, e atividades extracurriculares que realmente agregam e…"
- Leonardo Viana (2025; Leonardo respondia a João Paulo): "Aprender com o João Paulo Aramuni foi uma das melhores experiências que tive. Ele explica tudo de um jeito claro, direto e sem enrolação, mesmo quando o assunto é complicado. Dá pra ver que ele realmente entende do que fala e, mais importante, sabe ensinar de verdade. O que mais gosto nele é que ele não fica só no…"
- Bruna Lopes (2025; Bruna era cliente de João Paulo): "O João Paulo demonstra clareza na comunicação, domínio técnico e uma preocupação genuína em gerar impacto positivo por meio de seus projetos e iniciativas. Sua trajetória revela comprometimento, capacidade de liderança e uma busca contínua por aprendizado — características que fazem dele um destaque em sua área. É…"
- Otávio Mendes (2025; Otávio era cliente de João Paulo): "Recomendo fortemente o João Paulo Aramuni como profissional e como professor. Tive a oportunidade de ser seu aluno em projetos de tecnologia e posso dizer que ele consegue unir, de forma rara, profundidade técnica com uma didática muito clara. João Paulo tem uma visão estratégica muito sólida, traz exemplos reais do…"
- Fernanda Soares (2025; Fernanda respondia a João Paulo): "Tive a oportunidade de ser aluna do professor João Paulo Aramuni, e posso dizer que ele é um dos professores mais acessíveis e dedicados que já tive. Está sempre disposto a ajudar e realmente se preocupa com o aprendizado dos alunos, estando presente para o que for preciso: tirando dúvidas, orientando projetos ou…"
- Paulo Henrique Assis (2025; Paulo respondia a João Paulo): "João Paulo Aramuni foi meu professor em duas matérias muito importante na minha faculdade, Algoritmos e Estrutura de Dados 1 e Projeto de Software, sendo um professor que possui uma ótima didática e materiais espetaculares, principalmente no seu GitHub, tendo diversos slides, projetos, figmas e outros materiais que…"
- Gabriel Chagas Lage (2025; Gabriel era cliente de João Paulo): "Tenho o privilégio de ser aluno do professor Aramuni, e posso dizer com toda certeza que suas aulas vão muito além do conteúdo teórico. Ele tem uma abordagem extremamente conectada com o mercado, sempre trazendo exemplos reais, cases relevantes e convidando profissionais experientes da área para compartilhar vivências…"

Também me recomendaram: Davi Mendes (2025), Nataniel Peixoto (2025), Jonathan Sena (2025), Raphael Sena (2025), Michelle Hanne Soares de Andrade (2025), Pedro Rodrigues (2025), Bernardo Rohlfs (2025), Luca Azalim (2025), Flavio Junior (2024), Pedro Mendes (2024), Angélica Guimarães (2024), Max Santiago (2024), Rubens Gabriel Romão Jerônimo (2024), Pedro Duarte (2024), Tulio Olivieri (2024), Luíza Paiva (2024), Thiago Henrique (2024), Carlos Melo, Ph.D. (2023), João Vitor S. Oliveira (2023), Tiago Bovolin (2023), Eli Candido (2023), Cristiano Benites (Ph.D) (2023), Will Marcondes (2023), André Vicente (2022), Douglas Eduardo da Silveira Lopes (2021), Bruno Azevedo (2020), Klelvin Carvalho (2020), Rafael Silvério Amaral (2020), Eduardo Marun (2018), Bruno Lima (2018), Leonardo Vargas (2018), Rafaela S. P. Marcolino (2018), Pedro Henrique Seabra Goulart (2018), Henrique Camilo Mapa (2018), Rubens Lemos (2018), Vicente Mourão (2018), Igor Horta Ferreira (2018), Felipe Ferreira Mendes (2018), Gabriel Cavalcante (2017), Thiago Brito Freitas (2017), Gabriel Faleri (2017), Amanda Lott (2017), Nilson Junio Paulino Sena (2017), Lucas Santos (2017), Luiz Guilherme Costa (2017), David Hazan (2017), Samuel Pavlovic (2017), João Lucas Veloso Gouveia (2017), Fábio Jourdan (2017), Márcio Brandão (2017), Felipe Martins (2016), Bruno Santos (2016), Rafael A Lott (2015), Gabriela Mendonça de Carvalho (2015), Glaydson Von Rondon de Freitas (2014), Lucas Romualdo Fernandes de Sá (2014), Andre Campos (2014), Amadeu Cappanelli (2014).


## Lattes (comando lattes)

- Currículo Lattes: http://lattes.cnpq.br/1208427665892059 (ORCID: https://orcid.org/0000-0001-7538-5927; atualizado em 2026-09-29)
- 40 TCCs orientados e 75 participações em bancas (74 de graduacao, 1 de mestrado)
- 82 trabalhos interdisciplinares (TIs) orientados
- 9 projetos da Agência Experimental de Software (AES)

### Projetos da Agência Experimental de Software

- 2026 · APAC Feminina: O sistema da APAC Feminina é uma plataforma de gestão da farmácia que permite controlar a entrada e distribuição de medicamentos, acompanhar os medicamentos utilizados por cada detenta e organizar o estoque de forma centralizada. Tecnologias: React.
- 2025 · Projeto Concreto Sustentável (parceria: MRV Engenharia): O projeto Concreto Sustentável, desenvolvido pela Agência Experimental de Software da PUC Minas em parceria com a MRV Engenharia, tem como objetivo reduzir significativamente o descarte e desperdício de concreto nos processos construtivos da empresa. Tecnologias: JavaScript, React, Python.
- 2025 · Projeto Concurso - RH-PMMG: O projeto Concurso RH-PMMG é uma iniciativa voltada para a modernização de processos ainda fortemente manuais no escopo de Recursos Humanos da Polícia Militar de Minas Gerais. Tecnologias: Angular, Java.
- 2025 · Projeto Mapa de Sustentabilidade (parceria: BH-TEC): O projeto Mapa de Sustentabilidade, em parceria com o Centro de Inteligência em Sustentabilidade (CIS) do BH-TEC, mapeia e acompanha ações sustentáveis em Minas Gerais, gerando visibilidade e métricas que apoiam políticas públicas de sustentabilidade. Tecnologias: HTML, CSS, JavaScript.
- 2024 · Ajuda-aí: O Ajuda-Aí é um aplicativo projetado para otimizar o programa de apadrinhamento do curso de Engenharia de Software da PUC Minas. Ele centraliza todas as informações dos participantes, resolvendo problemas de comunicação entre padrinhos e apadrinhados. Tecnologias: Dart, Java.
- 2024 · Cuido Bem (parceria: Instituto Mário Penna e Centro Clínico de Fisioterapia da PUC Minas): Desenvolvido em parceria com o Centro Clínico de Fisioterapia da PUC Minas e o Instituto Mário Penna, o projeto é um aplicativo que substitui cartilhas físicas ao orientar pacientes com câncer sobre exercícios fisioterapêuticos pós-alta. Tecnologias: Dart, Java.
- 2024 · Grade Inteligente: A Grade Inteligente é um sistema que organiza a matriz curricular dos alunos com uma visualização gráfica das disciplinas ao longo dos períodos. Tecnologias: HTML, CSS, JavaScript, Java.
- 2024 · Landing Page: A Landing Page da Agência Experimental de Software funciona como o canal oficial para apresentar a agência, captar demandas e destacar os projetos e talentos desenvolvidos por suas equipes. Tecnologias: HTML, CSS, JavaScript.
- 2024 · Projeto Cartão Programa - PMMG: O projeto Cartão Programa tem como objetivo facilitar o planejamento de itinerários dos policiais em Minas Gerais, sendo acessado diretamente pelo SIGOp (Sistema Integrado de Gestão Operacional) da PMMG. Tecnologias: Angular, Java.

### TCCs orientados

- 2025 · "Apex Sentinel - Extensão para Detecção de Code Smells em Apex" · Pedro Lucas Aires dos Santos · Engenharia de Software, PUC Minas
- 2025 · "Apptite - Sistema de Gestão de Atendimento de Restaurantes" · Guilherme Roberto Ferreira Santos · Engenharia de Software, PUC Minas
- 2025 · "BusCars - Sistema de Agregação Inteligente de Anúncios Automotivos" · Lucas Araújo Borges de Lima, Luis Gustavo Vaz · Engenharia de Software, PUC Minas
- 2025 · "Buzzard - Plataforma Web que possibilita a criação de notificações por Email, Slack ou Microsoft Teams de mudanças em trechos de código ou arquivos de repositórios públicos ou privados do GitHub" · Pedro Henrique Rodrigues · Engenharia de Software, PUC Minas
- 2025 · "Distribuidora LC - Sistema Integrado de Gestão de Estoque e Pedidos" · Breno Rosa Almeida, Matheus Brandão Freire · Engenharia de Software, PUC Minas
- 2025 · "Keep - Sistema de Gestão do Parque de Máquinas da dti digital" · Tito Li An Chen · Engenharia de Software, PUC Minas
- 2025 · "Sistema de Gestão da Clínica Genilton de Souza" · Carlos R. A. de Almeida Júnior, Matheus A. A. de Souza · Engenharia de Software, PUC Minas
- 2025 · "Smart Barber - Sistema de Gestão para Barbearias" · Igor Pinheiro dos Santos, Vinícius Gonzaga Guilherme · Engenharia de Software, PUC Minas
- 2025 · "Tuscan - Compras em Eventos" · Bernardo Cruz Rohlfs, Eric Guimarães Caldas Jardim · Engenharia de Software, PUC Minas
- 2020 · "Análise Comparativa de Performance entre Aplicações Java e Kotlin" · Gabriel da Silva Cavalcante · Ciência da Computação, FUMEC
- 2020 · "Análise da Adoção do Scrum em Equipes Remotas: Impacto do Uso do Ágil em Equipes Distribuídas" · Laura Andrade Brandão · Ciência da Computação, FUMEC
- 2020 · "Aplicação de Técnicas da Visão Computacional para Análise de Imagens em Jogos de Futebol: Prototipação de Algoritmo com Aprendizagem de Máquina através da Biblioteca TensorFlow" · Paulo Henrique Ribeiro Alves · Ciência da Computação, FUMEC
- 2020 · "Impactos da Lei Geral de Proteção de Dados Pessoais em Organizações do Segmento de Tecnologia da Informação" · Ana Carolina Cardoso · Ciência da Computação, FUMEC
- 2020 · "Impactos da Lei Geral de Proteção de Dados Pessoais em uma Rede de Parceiros dos Setores de Tecnologia da Informação e do Sistema Bancário Brasileiro: Um Estudo de Caso" · Matheus Oliveira · Ciência da Computação, FUMEC
- 2020 · "Prototipação de um APP para Gestão Eletrônica de Filas de Espera em Estabelecimentos Comerciais" · Arthur de Castro Laranjo Pires, Bruno Lucas de Azevedo · Ciência da Computação, FUMEC
- 2020 · "Uma Revisão Sistemática de Literatura sobre Realidade Virtual e Aumentada" · Anemísio Batista dos Santos · Ciência da Computação, FUMEC
- 2020 · "Uso da Aprendizagem de Máquina para Aplicação de Técnicas Preditivas para Otimizar o Processo de Manutenção de Caminhões em uma Frota" · Ana Caroline Xavier Miranda · Ciência da Computação, FUMEC
- 2019 · "Análise da Implantação do SalesForce em uma Construtora do Segmento Imobiliário: Um Estudo de Caso" · Vinícius S. O. Moraes, Vitor S. O. Moraes · Ciência da Computação, FUMEC
- 2019 · "Biotecnologia Associada ao Monitoramento e Tratamento da Diabetes" · Thiago Jackson, Pedro Henrique Pinto · Ciência da Computação, FUMEC
- 2019 · "Desafios da Migração de Sistemas Monolíticos para Arquitetura de Microserviços" · Lucas Manoel Assis Santos · Ciência da Computação, FUMEC
- 2019 · "Impactos da Aplicação da Arquitetura DevOps para a Entrega e Integração Contínua" · Rubens Gabriel Romão Jeronimo · Ciência da Computação, FUMEC
- 2019 · "Opções Tecnológicas Disponíveis para Monitoramento de Barragens: Uma Revisão Sistemática de Literatura" · Ana Clara M. L. de Oliveira · Ciência da Computação, FUMEC
- 2019 · "Proposta de Protótipo de Aplicativo Mobile: Um Guia Comportamental Direcionado aos Responsáveis por Pessoas com Autismo" · Yago Apolinário Silvestre, Cindy S. Silva · Ciência da Computação, FUMEC
- 2019 · "Segurança da Informação em um Cenário de Big Data: Perspectivas Sociais, Políticas e Empresariais" · Arthur Neiva, Júlia L. M. Resende · Ciência da Computação, FUMEC
- 2019 · "Uma Análise Comparativa entre os Casos de Câncer e seus Principais Fatores: Uma implementação de Algoritmo para Estudo do Câncer" · Gabriel da Cruz Moreira Falieri · Ciência da Computação, FUMEC
- 2019 · "Uma Análise Comparativa entre os Frameworks JavaScript Angular e React" · João Gabriel Colares de Camargos, José Flavio Coelho · Ciência da Computação, FUMEC
- 2019 · "Uma Análise Comparativa Entre os Paradigmas de Programação Funcional, Orientado a Objetos e Estruturado" · João Paulo Theodoro de Moraes · Ciência da Computação, FUMEC
- 2018 · "Análise Comparativa entre a Filosofia Japonesa e a Adoção do Lean Digital Transformation na Gestão de Projetos de Tecnologia da Informação: Estudo de Caso em uma Multinacional desse Segmento" · Matheus Montanari Gonçalves Cristoni, Nilson Junio P. Sena · Ciência da Computação, FUMEC
- 2018 · "Análise comparativa entre DEVOPS e o corpo de conhecimento ITIL na gestão de projetos de T.I" · Mateus Costa Macedo · Ciência da Computação, FUMEC
- 2018 · "Análise comparativa entre modelos ágeis de gestão de projetos e seus impactos nas organizações do setor privado" · Lucas Akio Camacho · Ciência da Computação, FUMEC
- 2018 · "Blockchain vs Blockchain-less: Uma Análise Comparativa entre as Duas Tecnologias Aplicadas a Criptomoedas no Âmbito da Estrutura DAG (Directed Acyclic Graph)" · Bernardo Virgílio Drummond Diniz, Mateus Esdras · Ciência da Computação, FUMEC
- 2018 · "Desafios da Implantação da Tecnologia Blockchain for Business no Cenário Empresarial Brasileiro" · Raquel Zanini Soares Ferreira, Rodrigo Luiz das Dores · Ciência da Computação, FUMEC
- 2018 · "Implantação da Metodologia de Desenvolvimento Ágil de Software Extreme Programming: Um Estudo de Caso em uma Pequena Empresa do Segmento de Tecnologia da Informação" · Dayvid Lucas de Oliveira Coelho · Ciência da Computação, FUMEC
- 2018 · "O Papel do Ensino de Programação e das Novas Tecnologias na Educação 4.0" · Frederico Silva Perpetuo · Ciência da Computação, FUMEC
- 2018 · "Performance de Aplicativos para Android em Diferentes Configurações de Hardware" · João Lucas Veloso Gouveia · Ciência da Computação, FUMEC
- 2018 · "Proposta de projeto de compiladores: Criação de protótipo front-end em Java para uso acadêmico" · Arthur Mares Gomes, Henrique De Souza Morais · Ciência da Computação, FUMEC
- 2018 · "Um Estudo Comparativo entre as Metodologias Ágeis Scrum e Lean Adotadas em Projetos do Segmento de Tecnologia da Informação" · Carlos Henrique Vieira Figueiredo, Carolina F. Rodrigues · Ciência da Computação, FUMEC
- 2018 · "Um Estudo Comparativo sobre os Fatores que Norteiam Iniciantes em Desenvolvimento de Sistemas Web na Decisão de qual Linguagem de Programação se Especializar" · Luis Henrique Carvalho de Oliveira, Thiago Brito de Freitas · Ciência da Computação, FUMEC
- 2017 · "Análise de feedback de consumidores mineiros de telefonia móvel por meio de georreferenciamento: Proposta de relatório estatístico utilizando a ferramenta Fusion Tables" · Cássio Augusto B. Simões, Henrique Camilo Mapa · Ciência da Computação, FUMEC
- 2017 · "Proposta de Modelo de Gamificação para Coleta de Garrafas PET e Latas de Alumínio em Redes de Supermercado de Belo Horizonte" · Gabriel Barbosa Rocha, Matheus Velloso Oliveira Sá · Ciência da Computação, FUMEC

### Trabalhos interdisciplinares orientados

- 2026 · Agrolink (TI V: Aplicações Distribuídas)
- 2026 · Ajuda-aí (TI V: Aplicações Distribuídas)
- 2026 · Biblioo (TI V: Aplicações Distribuídas)
- 2026 · Code Rats (TI II: Front-end)
- 2026 · Contabilidade GE Alves (TI II: Front-end)
- 2026 · Coreu Urban Hotel (TI II: Front-end)
- 2026 · FindPro (TI II: Front-end)
- 2026 · FlyCenter (TI V: Aplicações Distribuídas)
- 2026 · HealthyStep (TI II: Front-end)
- 2026 · HomeFix (TI V: Aplicações Distribuídas)
- 2026 · Lanshow (TI V: Aplicações Distribuídas)
- 2026 · Lê Ai (TI V: Aplicações Distribuídas)
- 2026 · Limity (TI V: Aplicações Distribuídas)
- 2026 · Litera.Cy (TI II: Front-end)
- 2026 · MatchSport (TI V: Aplicações Distribuídas)
- 2026 · Mediflow (TI II: Front-end)
- 2026 · Mentora (TI II: Front-end)
- 2026 · Nautilus - Rede Geosocial Gamificada (TI V: Aplicações Distribuídas)
- 2026 · Nós - Rede de Proteção e Acolhimento (TI V: Aplicações Distribuídas)
- 2026 · Partiu! (TI V: Aplicações Distribuídas)
- 2026 · Play Sports (TI V: Aplicações Distribuídas)
- 2026 · PsiHub (TI V: Aplicações Distribuídas)
- 2026 · Pulso (TI V: Aplicações Distribuídas)
- 2026 · Queima (TI V: Aplicações Distribuídas)
- 2026 · ReCiclo (TI V: Aplicações Distribuídas)
- 2026 · RoadMap (TI V: Aplicações Distribuídas)
- 2026 · Routina (TI V: Aplicações Distribuídas)
- 2026 · RPG Campaign (TI II: Front-end)
- 2026 · SiFinance (TI II: Front-end)
- 2026 · SplitHub (TI V: Aplicações Distribuídas)
- 2026 · SplitLar (TI V: Aplicações Distribuídas)
- 2026 · SportTime (TI II: Front-end)
- 2026 · SystemOps (TI V: Aplicações Distribuídas)
- 2026 · Task++ (TI II: Front-end)
- 2026 · Ticket Mind (TI V: Aplicações Distribuídas)
- 2026 · Tocaê (TI V: Aplicações Distribuídas)
- 2026 · Topdeck (TI II: Front-end)
- 2026 · Trilhô (TI II: Front-end)
- 2026 · UaiPort (TI V: Aplicações Distribuídas)
- 2026 · UniCarona (TI V: Aplicações Distribuídas)
- 2026 · UpFit - Seu próximo nível fitness (TI V: Aplicações Distribuídas)
- 2026 · Vireo (TI II: Front-end)
- 2026 · VoltShare (TI V: Aplicações Distribuídas)
- 2025 · AutoClick (TI III: Aplicações para Cenários Reais)
- 2025 · Barber Flow (TI III: Aplicações para Cenários Reais)
- 2025 · BeautyLab (TI III: Aplicações para Cenários Reais)
- 2025 · Casa dos Discípulos (TI III: Aplicações para Cenários Reais)
- 2025 · ClassHub (TI III: Aplicações para Cenários Reais)
- 2025 · Fabiana Móveis - Gerenciador de Rotas de Entregas (TI III: Aplicações para Cenários Reais)
- 2025 · Fazenda Inteligente (TI III: Aplicações para Cenários Reais)
- 2025 · GearUp (TI III: Aplicações para Cenários Reais)
- 2025 · GetRoute (TI III: Aplicações para Cenários Reais)
- 2025 · Glayde Ribeiro - Cake Designer (TI III: Aplicações para Cenários Reais)
- 2025 · Olimpo Estética Automotiva (TI III: Aplicações para Cenários Reais)
- 2025 · Optima - Sistema de Gerenciamento Empresarial (TI III: Aplicações para Cenários Reais)
- 2025 · Organiza Gestão Inteligente (TI III: Aplicações para Cenários Reais)
- 2025 · Ponto Certo Mercearia (TI III: Aplicações para Cenários Reais)
- 2025 · QuelCaramel - Gestão Inteligente para Doces Artesanais (TI III: Aplicações para Cenários Reais)
- 2025 · REALConsult (TI III: Aplicações para Cenários Reais)
- 2025 · Santo Restauro (TI III: Aplicações para Cenários Reais)
- 2025 · SeChat Solutions (TI III: Aplicações para Cenários Reais)
- 2025 · Thivor Automóveis (TI III: Aplicações para Cenários Reais)
- 2025 · VazTech (TI III: Aplicações para Cenários Reais)
- 2025 · Villa Pisani (TI III: Aplicações para Cenários Reais)
- 2024 · Amitran Logística (TI III: Aplicações para Cenários Reais)
- 2024 · Beautyzz (TI III: Aplicações para Cenários Reais)
- 2024 · BookTrade (TI I: Aplicações Web)
- 2024 · BudgetBuddy (TI I: Aplicações Web)
- 2024 · Casa & Condomínio BH (TI III: Aplicações para Cenários Reais)
- 2024 · Culturar (TI I: Aplicações Web)
- 2024 · DropFleet (TI I: Aplicações Web)
- 2024 · EasyTraining (TI I: Aplicações Web)
- 2024 · GasFinder (TI I: Aplicações Web)
- 2024 · Heat Watch (TI I: Aplicações Web)
- 2024 · Hemo+: Conectando Doadores e Receptores de Sangue (TI I: Aplicações Web)
- 2024 · NutriSmart (TI I: Aplicações Web)
- 2024 · Política Ativa (TI I: Aplicações Web)
- 2024 · Potencial Senior (TI I: Aplicações Web)
- 2024 · Projeto Treinos - PulsePump (TI I: Aplicações Web)
- 2024 · SCOL - Sistema de Controle Operacional para Locadoras (TI III: Aplicações para Cenários Reais)
- 2024 · SportsMatchs (TI I: Aplicações Web)
- 2024 · Study Buddy (TI I: Aplicações Web)


## Outras informações

- Para palestras, aulas, mentorias, bancas ou consultoria, o melhor caminho é
  o comando \`contato\` (formulário que chega no meu e-mail) ou o \`calendly\`
  (para marcar uma conversa direto na minha agenda).
- O material de todas as disciplinas que eu leciono fica aberto no meu
  GitHub (github.com/joaopauloaramuni), com slides, projetos e exemplos.
- Este portfólio é um terminal feito em React + Vite, com código aberto em
  github.com/joaopauloaramuni/joaopauloaramuni-portfolio.


## Links

- Portfólio: https://aramuni.dev
- GitHub: https://github.com/joaopauloaramuni
- LinkedIn: https://www.linkedin.com/in/joaopauloaramuni/
- Lattes: http://lattes.cnpq.br/1208427665892059
- E-mail: joaopauloaramuni@gmail.com


## Comandos deste portfólio (para indicar ao visitante)

- \`sobre\` (ou \`about\`): Mostra quem sou: trajetória, disciplinas, números e um pouco de mim fora do terminal.
- \`ajuda\` (ou \`help\`): Mostra esta lista de comandos disponíveis.
- \`experiencias\` (ou \`experience\`, \`xp\`): Mostra minha trajetória profissional e experiências.
- \`contato\` (ou \`contact\`): Exibe minhas informações de contato e envia email.
- \`calendly\` (ou \`meeting\`, \`meet\`): Agende uma reunião comigo via Calendly.
- \`cal\` (ou \`horario\`, \`horarios\`, \`schedule\`): Mostra meus horários de aula no estilo cal (cal --semana | --hoje).
- \`curriculo\` (ou \`resume\`): Exibe meu currículo com visualização em PDF.
- \`lattes\` (ou \`cnpq\`, \`academic\`): Mostra meu Lattes: docência, TCCs, TIs, projetos da AES e bancas (lattes --pdf baixa o PDF).
- \`habilidades\` (ou \`skills\`): Exibe minhas habilidades em programação (skills --cards | --lista | --globo muda o estilo).
- \`tema\` (ou \`theme\`): Troca o tema na ordem escuro → claro → galo (tema --escuro | tema --claro | tema --galo).
- \`recomendacoes\` (ou \`recommendations\`, \`recs\`): Exibe minhas recomendações do LinkedIn.
- \`premios\` (ou \`awards\`): Exibe prêmios e reconhecimentos.
- \`projetos\` (ou \`projects\`): Exibe meus projetos desenvolvidos.
- \`github\` (ou \`git\`, \`api\`): Exibe meus repositórios usando a GitHub API.
- \`spotify\` (ou \`music\`): Mostra o que estou ouvindo e últimas reproduções.
- \`stats\` (ou \`githubstats\`, \`ghstats\`): Mostra minhas estatísticas do GitHub (stats --repos | --tudo muda o gráfico).
- \`wakatime\` (ou \`time\`): Mostra meu tempo de código (wakatime --grade | --lista | --cards muda o estilo).
- \`neofetch\` (ou \`fetch\`): Mostra as informações do sistema com o escudo do Galo, no estilo neofetch.
- \`campeonato\` (ou \`galo\`, \`atletico\`): Próximos jogos do Galo: contagem regressiva, campeonato, escudos e placar agregado (campeonato --todos).
- \`jogo\` (ou \`quake\`, \`flappyplane\`): Jogos no terminal: o Quake original ou o Flappy Plane (jogo --quake | --flappyplane).
- \`guestbook\` (ou \`guest\`, \`book\`): Deixe uma mensagem no meu livro de visitas público.
- \`design\` (ou \`ds\`, \`designsystem\`): Mostra o design system do portfólio: fontes, cores, espaçamentos e marca.


# Currículo em PDF (public/cv-pt.pdf, comando curriculo)

Objetivo
Professor e CTO com experiência em desenvolvimento de software, gestão de equipes e ensino de tecnologia, buscando
continuar contribuindo com inovação acadêmica e projetos de desenvolvimento de sistemas complexos.
Resumo
Doutor (2017-2020) e mestre (2014-2015) em Sistemas de Informação e Gestão do Conhecimento pela Universidade
FUMEC, onde também obteve graduação em Ciência da Computação (2010-2013). Profissional com 13 anos de experiência no mercado de desenvolvimento de sistemas e há 9 anos na área de educação com ensino de tecnologia. Atualmente,
é professor das disciplinas de Fundamentos de Projeto e Análise de Algoritmos, Projeto de Software, Laboratório de Desenvolvimento de Software, Laboratório de Experimentação de Software e Trabalho Interdisciplinar: Aplicações para
Cenários Reais do curso de Engenharia de Software da PUC Minas. Além disso, é orientador na disciplina de Trabalho
de Conclusão de Curso II e é CTO da Agência Experimental de Software do ICEI - Instituto de Ciências Exatas e
Informática da PUC Minas, encarregado da gestão de 6 times de desenvolvimento, totalizando em média 30 pessoas na
equipe. Também foi professor das disciplinas de Trabalho Interdisciplinar: Aplicações Web e Algoritmos e Estruturas de
Dados I (Linguagem C) do curso de Engenharia de Software e da disciplina de Laboratório de Iniciação à Programação
do curso de Ciência da Computação da PUC Minas. No mercado, presta consultoria especializada tanto a empresas de
recrutamento e seleção, aplicando inteligência artificial na identificação e avaliação de perfis técnicos, quanto ao setor
bancário, com foco na definição da arquitetura de sistemas, implantação de ferramentas para monitoramento e observabilidade de aplicações e resolução de impedimentos técnicos. Anteriormente, foi professor das disciplinas de Linguagens
de Programação (Java), Arquitetura de Aplicações Web e Banco de Dados dos cursos de Ciência da Computação, Sistemas de Informação e Análise e Desenvolvimento de Sistemas do Centro Universitário Newton Paiva. Atuou como Tech
Manager na holding IN8, responsável pela liderança de squads de desenvolvimento de múltiplos projetos para o mercado
de milhas aéreas. Foi Tech Lead nos times de back-end e ciência da computação na Trybe (2020-2023), responsável pela
gestão de diversas equipes, além da pesquisa e tomada de decisão em hard skills, definição dos OKRs e KPIs da área,
formação e desenvolvimento técnico do time, processos seletivos, produção de conteúdo (Python e Java) e revisão técnica.
Foi professor de Arquitetura de Software e Engenharia de Requisitos na Faculdade XP Educação - XPE e professor das
disciplinas de Programação Orientada a Objetos com Java, Fundamentos Teóricos da Computação e Compiladores com
C++ do curso de Ciência da Computação, das disciplinas de Engenharia de Software II e Introdução à Programação
Web do curso de Sistemas de Informação EaD e das disciplinas de Desenvolvimento de Scripts I (VBScript) e II (Shell
Script) do Curso Superior de Tecnologia em Redes de Computadores da Universidade FUMEC (2016-2020). Orientou
40 trabalhos de conclusão de curso na área de Ciência da Computação e Engenharia de Software, além de ter participado
de mais de 50 bancas examinadoras. Foi membro do grupo de pesquisa LAIS (Laboratório de Sistemas de Informação
Avançados), onde publicou artigos em periódicos de excelência nacional e internacional, e foi coordenador de projetos
de extensão. Atuou como analista de sistemas do grupo Capgemini, com prestação de serviços de tecnologia da informação, trabalhou alocado na Prosegur Brasil, com desenvolvimento em Java para logística e transporte de valores, e foi
desenvolvedor back-end sênior na IN8, com web scraping e criação de crawlers em Python para programas de milhagem.
Possui vivência nos campos de: Liderança e gestão de pessoas, Desenvolvimento de software, Documentação ágil, Implantação de sistemas em âmbito global, Manutenção de sistemas legados, Design patterns e Metodologias ágeis: Scrum
e Lean. Experiência com fabricação de software para projetos da Oi Telecomunicações, ANP - Agência Nacional do
Petróleo, Gás Natural e Biocombustíveis, Banco do Brasil S/A, VSB - Vallourec Sumitomo Tubos do Brasil, Prosegur
Brasil, HotMilhas, 123milhas, Jedis - Tecnologia e Recrutamento, CDC Bank - Soluções em Tecnologia para Pagamentos,
Centro de Inteligência em Sustentabilidade (CIS) do BH-TEC (Parque Tecnológico de Belo Horizonte), PMMG: Polícia
Militar de Minas Gerais, Instituto Mário Penna, Centro Clínico de Fisioterapia da PUC Minas e PUC Minas.
Experiência
• PUC Minas fev 2024 - Presente
Professor de Engenharia de Software e CTO da Agência Experimental de Software Belo Horizonte, MG, Brasil
– Ensino das disciplinas: Fundamentos de Projeto e Análise de Algoritmos, Projeto de Software, Laboratório de
Desenvolvimento de Software, Laboratório de Experimentação de Software e Trabalho Interdisciplinar.
– Orientação de TCC II.
– Gestão de 6 times de desenvolvimento (aprox. 30 pessoas).
– Oficinas e aulões sobre Python, Spring Boot, Docker, PostgreSQL, MongoDB, Nuvem e IA.
• Centro Universitário Newton Paiva ago 2023 - ago 2024
Professor de Ciência da Computação e Sistemas de Informação Belo Horizonte, MG, Brasil
– Ensino das disciplinas: Linguagens de Programação (Java), Arquitetura de Aplicações Web, Banco de Dados.
– Professor destaque do curso de Sistemas de Informação (2º semestre 2023).
– Lógica de Programação com Scratch para turmas do ensino médio.
• IN8 jun 2023 - ago 2023
Tech Manager Belo Horizonte, MG, Brasil
– Liderança de squads em múltiplos projetos de sistemas para mercado de milhas aéreas.
– Garantia de disponibilidade, escalabilidade, performance e segurança das aplicações.
– Mentoria, PDIs e integração entre áreas técnicas e de negócios.
– Tech Stack: Node.js, Next.js, Python, FastAPI, AWS, Docker, CI/CD, REST APIs, Redis, Grafana, New Relic.
• Trybe mar 2023 - jun 2023
Computer Science Curriculum Tech Lead Remoto
– Cargo: Líder Técnico de Currículo de Ciência da Computação. Responsável pela estrutura curricular em Python e
pelo desenvolvimento técnico do time.
– Pesquisa e tomada de decisão:
∗ Garantir assertividade e atualização da ementa de hard skills, maximizando a empregabilidade de estudantes.
∗ Tomar decisões técnicas baseadas em dados e fatos, considerando a individualidade das pessoas estudantes, mas
beneficiando a experiência e proficiência do máximo de estudantes.
∗ Tomar decisões rápidas e de qualidade com relação aos feedbacks das pessoas estudantes no fluxo de melhoria
contínua.
∗ Guiar e definir a visão e direcionamento técnico do módulo.
– Formação e orientação de pessoas:
∗ Atuar no desenvolvimento técnico da equipe, investindo tempo de qualidade em treinamento, feedbacks constantes e mentoria.
∗ Orientar e resolver entraves na elaboração dos conteúdos, prezando pela alta qualidade e pelos prazos.
∗ Guiar discussões técnicas dentro e fora da área, inspirando e implementando soluções pelo time.
– Produção de conteúdo e revisão técnica:
∗ Produzir conteúdos complexos em texto, vídeo, exercícios e projetos, com avaliação automatizada.
∗ Garantir qualidade técnica em todos os recursos educacionais, seguindo os padrões Trybe.
∗ Maximizar o reaproveitamento dos conteúdos, visando empregabilidade em escala.
∗ Desenvolver e amadurecer instrumentos de avaliação informativos e tecnicamente sólidos.
• Trybe ago 2022 - mar 2023
Computer Science Lead & Tech Lead Remoto
– Responsável pela estrutura curricular em Python e pela gestão de um time de 3 pessoas.
– Gestão do conteúdo de Ciência da Computação, pesquisa e tomada de decisão em hard skills.
– Definição de OKRs e KPIs da área.
– Formação e orientação técnica do time, produção de conteúdo e liderança direta de analistas de currículo.
– Auxiliou na gestão e construção dos conteúdos e ementas de Python e Java.
• Trybe abr 2021 - ago 2022
Computer Science Lead Instructor Belo Horizonte, MG, Brasil
– Liderança de instrução de Ciência da Computação, responsável pela operação de aprendizagem das turmas.
– Gestão de um time de 10 pessoas, definição de OKRs e KPIs, processos seletivos e liderança direta de especialistas
e instrutores.
– Auxiliou na montagem e liderou o primeiro time de Ciência da Computação da Trybe.
• Trybe out 2020 - abr 2021
Back-End & Computer Science Lead Instructor Belo Horizonte, MG, Brasil
– Liderança de instrução de Back-end e Ciência da Computação, responsável pela operação de aprendizagem das
turmas.
– Gestão de um time de 17 pessoas, definição de OKRs e KPIs, processos seletivos e liderança direta de especialistas
e instrutores.
– Auxiliou na montagem e liderou o primeiro time de Back-end e Ciência da Computação da Trybe.
• Trybe mar 2020 - out 2020
Computer Science Specialist Instructor Belo Horizonte, MG, Brasil
– Especialista em instrução de Ciência da Computação, ministrando aulas de programação Python, POO, raspagem
de dados, algoritmos e estruturas de dados.
– Promover o desenvolvimento da proficiência técnica das pessoas estudantes, oferecendo experiências de alta qualidade.
– Auxiliou na construção da primeira versão do conteúdo e da ementa do currículo de Ciência da Computação da
Trybe.
– Ministrou aulas para a Turma 1, a primeira turma da Trybe.
• XP Educação set 2020 - mai 2021
Professor Belo Horizonte, MG, Brasil · Remoto
– Professor de Arquitetura de Software e Engenharia de Requisitos.
– Apresentou conceitos fundamentais, práticas e ferramentas de projetos arquiteturais de software, além de hard e soft
skills para formação de arquitetos de software.
• Universidade FUMEC fev 2016 - ago 2020
Professor Belo Horizonte, MG, Brasil
– Ministrou Fundamentos Teóricos da Computação (FTC), Compiladores e Programação Orientada a Objetos (POO)
do curso de Ciência da Computação:
∗ FTC: Bases teóricas e limites da Ciência da Computação, definição de linguagens formais, gramáticas e reconhecedores.
∗ Compiladores: Conceitos teóricos e práticos sobre compiladores, módulos e implementação conforme padrões
léxicos e gramaticais.
∗ POO: Técnicas e conceitos básicos de programação orientada a objetos, implementação em Java.
– Ministrou Desenvolvimento de Scripts I (VBScript) e II (Shell Script) no curso de Redes de Computadores.
– Ministrou Engenharia de Software II e Introdução à Programação Web no curso de Sistemas de Informação EaD.
– Atividades extraclasse: Orientação acadêmica, coordenação de projetos de extensão, direcionamento de alunos para
vagas e estágios.
• IN8 dez 2019 - mar 2020
Desenvolvedor Back-End Sênior Belo Horizonte, MG, Brasil
– Web scraping e desenvolvimento de crawlers em Python 3 para programas de milhas aéreas.
– Criação e manutenção de APIs RESTful para extração de dados e automação de navegadores.
– Modelagem de arquitetura cloud (AWS) autoescalável com suporte a HA/DR.
– CI/CD (Git, GitLab), administração de containers (Docker), monitoramento de aplicações (Grafana, New Relic).
• Prosegur (via Capgemini) out 2014 - set 2017
Analista de Sistemas Belo Horizonte, MG, Brasil
– Desenvolvimento de sistema distribuído em Java 8 com JavaFX / JSF / PrimeFaces / EJB / JPA / EclipseLink /
JProfiler / WebLogic / SoapUI / Jenkins.
– Implantação global de software (AR/AUS/BR/CHN/DE/ESP/FRA/RSA/URU).
– Melhoria contínua, refatoração de componentes, otimização de performance (JProfiler, Eclipse MAT).
– Construção e testes de WebServices (JAX-WS), testes automatizados com JUnit e Selenium.
– Manipulação de Banco de Dados Oracle, programação PL/SQL de Procedures e Triggers.
– Documentação e especificação de Casos de Uso em espanhol.
– Metodologia Ágil adotada: Scrum.
• Capgemini out 2015 - ago 2017
Analista de Sistemas Pl Belo Horizonte, MG, Brasil
– Análise e desenvolvimento em Java / Java Web; manutenção de sistemas em VB6 Clássico / VB.NET.
– Desenvolvimento Web com ASP Clássico / ASP.NET / VBS; Software Maintenance.
– Manipulação de Banco de Dados SQL Server / Oracle; Programação com PL/SQL de Procedures e Triggers.
– Atuação em sistemas legados e depuração de código legado.
– Documentação/Especificação: Casos de Uso e UML. Boa relação interpessoal com clientes.
– Contratos: Oi Telecomunicações; ANP; Prosegur Brasil.
– Metodologia Ágil adotada: Lean Manufacturing.
– Cargos ocupados: Analista de Sistemas Pl / Analista de Sistemas Jr / Programador Sr / Programador Jr.
• Capgemini out 2014 - out 2015
Analista de Sistemas Jr Belo Horizonte, MG, Brasil
– Desenvolvimento de sistemas em Java, manutenção de sistemas legados e suporte a aplicações.
• Capgemini mar 2014 - out 2014
Programador Sr Belo Horizonte, MG, Brasil
– Segunda vez na história da Capgemini no Brasil em que houve progressão de Junior para Sênior pulando a posição
de Pleno.
• Capgemini ago 2013 - mar 2014
Programador Jr Belo Horizonte, MG, Brasil
– Desenvolvimento de sistemas em Java, manutenção e suporte a aplicações legadas.
• Banco do Brasil jul 2012 - abr 2013
Estagiário - Estágio Supervisionado Obrigatório Belo Horizonte, MG, Brasil
– Desenvolvimento e suporte a aplicativos em Java / Java Web para automação bancária.
– Manutenção de sistemas integrados ao SISBB para controle e devolução de valores retidos em Terminais de Auto
Atendimento.
– Desenvolvimento e suporte a aplicações legadas em VBA / VB6.
– Programação com PL/SQL de Procedures e Triggers; levantamento de requisitos.
• Álamo - Soluções em TI jul 2011 - out 2011
Programador C Sharp - Estágio Belo Horizonte, MG, Brasil
– Desenvolvimento em C Sharp /.NET (v3.5) para sistema de gestão do ciclo de vida de projetos de engenharia
(Projeto STOR).
– Desenvolvimento Web com ASP.NET para controle de ponto eletrônico (WorkTeam).
– Software Maintenance, controle de versão e merge entre versões com TortoiseCVS.
– Manipulação de Banco de Dados SQL Server; criação de procedures e triggers.
– Contratos: VSB – Vallourec e Sumitomo Tubos do Brasil e Ferrous Resources do Brasil.
• Universidade FUMEC jul 2010 - dez 2010
Estagiário Belo Horizonte, MG, Brasil
– CPD FACE/FUMEC - Desenvolvimento de aplicativos internos com PHP e JQuery.
– Suporte técnico em redes; manutenção de servidores Linux; programação com Shell Script; Help Desk.
• Laboratório de Nanoscopia do CETEC jul 2010 - ago 2010
Bolsista de Iniciação Científica - PIBIC/CNPq Belo Horizonte, MG, Brasil
– Projeto: "Uso da microscopia de força atômica na caracterização da interação de compostos polifenólicos e fototerápicos candidatos a droga antivirais, com células MT2 e vírus HTLV-1".
– Objetivo: Utilizar a técnica de Microscopia de Força Atômica para investigar vírus e antivirais.
– Projeto desenvolvido no Laboratório de Virologia Básica e Aplicada da UFMG e no Laboratório de Nanoscopia do
CETEC.
– Financiador: Fundação de Amparo à Pesquisa do Estado de Minas Gerais (Auxílio financeiro).
Formação
• Fundação Dom Cabral 2022
Programa de Desenvolvimento da Liderança (PDL) - Líderes de Líderes / Líderes de Equipes Brasil
– Alinhamentos sobre papéis e responsabilidades das pessoas gestoras da Trybe a partir do Ciclo de Gestão de Pessoas.
– Duração: 40 horas.
• Universidade FUMEC 2017 - 2020
Doutorado em Sistemas de Informação e Gestão do Conhecimento Belo Horizonte, MG, Brasil
• Universidade FUMEC 2014 - 2015
Mestrado em Sistemas de Informação e Gestão do Conhecimento Belo Horizonte, MG, Brasil
• Universidade FUMEC 2010 - 2013
Bacharelado em Ciência da Computação Belo Horizonte, MG, Brasil
Habilidades
• Liderança e gestão de equipes
• Desenvolvimento de software e design patterns
• Documentação ágil e metodologias Scrum e Lean
• Implantação de sistemas globais e manutenção de sistemas legados
• Linguagens: Python, Java, C, C++, VBScript, Shell Script
• Frameworks e Bibliotecas: Spring Boot, React, Next.js, Vite, Node.js, Tkinter
• Banco de dados: PostgreSQL, MongoDB
• Cloud e DevOps: AWS, Docker, CI/CD
• Observabilidade: Grafana, New Relic
Projetos
• Concurso - RH-PMMG (Agência Experimental de Software - PUC Minas, fev 2025 – presente)
Parceria com a Polícia Militar de Minas Gerais para modernização de processos de RH. Desenvolvimento de sistema
para rastreabilidade de candidatos, reduzindo semanas de trabalho manual e impactando mais de 50 mil pessoas por
concurso. AES | PMMG
• Mapa de Instituições - BH-Tec (Agência Experimental de Software - PUC Minas, fev 2025 – presente)
Aplicativo web para mapear e dar visibilidade a instituições tecnológicas com foco em sustentabilidade em Minas
Gerais. Fornece métricas que subsidiam decisões governamentais. AES | BH-Tec
• Ajuda-aí (Agência Experimental de Software - PUC Minas, ago 2024 – presente)
Aplicativo de apadrinhamento do curso de Engenharia de Software, com algoritmo de match avançado para otimizar
a comunicação entre padrinhos e apadrinhados. AES
• Cartão Programa - PMMG (Agência Experimental de Software - PUC Minas, ago 2024 – presente)
Sistema para digitalização e planejamento de itinerários policiais em Minas Gerais, aumentando eficiência operacional.
AES | PMMG
• CuidoBem (Instituto Mário Penna e Centro Clínico de Fisioterapia da PUC Minas, ago 2024 – presente)
Aplicativo para orientar pacientes oncológicos em exercícios fisioterapêuticos pós-alta hospitalar, promovendo desospitalização e melhor adesão ao tratamento. AES | Instituto Mário Penna | PUC Minas
• Grade Inteligente (Agência Experimental de Software - PUC Minas, ago 2024 – presente)
Software para organização da matriz curricular dos alunos, com visualização gráfica, reorganização de disciplinas e
acompanhamento do progresso acadêmico. Grade Inteligente | AES
• Landing Page (Agência Experimental de Software - PUC Minas, fev 2024 – presente)
Página institucional para apresentar a agência, captar demandas, divulgar projetos e talentos das equipes. AES
• Rhapido 2.0 (Jedis Tecnologia - Recrutamento e Seleção, mai 2025 – jul 2025)
Sistema de gestão de processos seletivos com inteligência artificial, triagem inteligente de currículos, linha do tempo
de candidatos, algoritmos de compatibilidade, setores personalizados, banco de dados interno de currículos e aplicação
de testes comportamentais JDScan. Jedis Tecnologia
• Desenvolvimento em WordPress (Universidade FUMEC, ago 2018 – set 2018)
Projeto de extensão para demonstrar a construção e publicação de sites completos utilizando WordPress para alunos
de Ciência da Computação, Redes de Computadores e Sistemas de Informação.
• Tech Talks (Universidade FUMEC, abr 2018 – jun 2018)
Projeto de extensão para promover o aperfeiçoamento das habilidades em inglês, com textos e discussões sobre tecnologia, destinado a alunos de Ciência da Computação, Redes de Computadores e Sistemas de Informação.
• SOL - Sistema de Operações de Logística (Prosegur, out 2014 – set 2017)
Sistema de software para logística de valores, integrando operações de múltiplos países, gerenciando recursos, veículos,
rotas e serviços, com fácil configuração, implantação e manutenção.
• Pesquisa sobre Lean Manufacturing na Gestão de Projetos de TI (Universidade FUMEC, nov 2014 – out
2015)
Dissertação de mestrado analisando a adoção do Lean Manufacturing na gestão ágil de projetos de TI em uma multinacional francesa, incluindo métodos, sistemas, divergências de modelos e análise estatística de dados de questionários
e entrevistas.
• Projetos SIGEP e I-SIGEP (ANP - Agência Nacional do Petróleo, Gás Natural e Biocombustíveis, ago 2013 – out
2014)
Sistemas de informações gerenciais de exploração e produção de óleo e gás natural, incluindo envio de documentos
digitais, controle de acesso, protocolos de auditoria e migração para nova versão com suporte a XML/XLS e assinatura
digital.
• Projetos SIMP e I-SIMP (ANP, ago 2013 – out 2014)
Sistemas de informações para monitoramento integrado da produção e movimentação de produtos regulados na cadeia
downstream. Objetivo: aprimorar a ação regulatória da ANP, produzir estatísticas de qualidade, planejar fiscalização
inteligente e fornecer insights de mercado via business intelligence.
• Sistemas Internos Integrados ao SISBB (Banco do Brasil, jul 2012 – abr 2013)
Desenvolvimento de sistemas integrados ao SISBB, com foco no processamento de operações bancárias e estornos em
ATMs. Migração de aplicações legadas em COBOL/VBA para Java e plataformas web, aumentando a automação
bancária e o controle de operações.
• Programando em C - ANSI Style (Universidade FUMEC, jul 2011 – dez 2011)
Repositório de exercícios e códigos em C (ANSI) para alunos, apresentando múltiplas soluções para o mesmo problema,
incluindo versões iterativas, recursivas e recursivas em uma linha, com foco em qualidade de código, performance e
manutenibilidade.
• STOR (Vallourec e Sumitomo Tubos do Brasil - VSB, jul 2011 – out 2011)
Ferramenta de suporte ao BIM (Business Information Modelling), integrando todas as demandas do projeto, gerenciando custos, materiais e qualidade do produto final, reduzindo erros, retrabalhos e o "time to market".
• Sistema para Controle de Projetos e Pessoal - WorkTeam (Álamo TI, jun 2011 – set 2011)
Sistema web em ASP.NET para gestão interna de projetos e controle de ponto eletrônico, acessível a clientes e funcionários, permitindo acompanhamento em tempo real e suporte à tomada de decisão da empresa.
• CEMEI - Centro de Educação para Melhor Idade (Universidade FUMEC / Prefeitura BH, ago 2010 – dez
2010)
Projeto de extensão voltado ao ensino gratuito de informática básica e ações interdisciplinares para idosos, promovendo
inclusão social e cidadania, com participação de alunos bolsistas e voluntários da graduação.
• Sistema para Reserva de Laboratório (Universidade FUMEC/FACE, jul 2010 – dez 2010)
Sistema em PHP para gestão de reservas de laboratórios, exibindo disponibilidade em tempo real via TV, agilizando
o uso dos espaços por alunos e professores, beneficiando mais de 6000 usuários diariamente.
• Pesquisa sobre Microscopia de Força Atômica e Compostos Antivirais (Universidade FUMEC, ago 2010 –
out 2010)
Projeto de pesquisa voltado à caracterização de vírus e da interação de compostos polifenólicos e fitoterápicos candidatos a antivirais usando Microscopia de Força Atômica, fornecendo imagens sub-nanométricas sob condições fisiológicas.
Publicações
Gestão Ágil da Memória Organizacional: Mudança na Cultura da Organização para Melhor Aproveitamento do Capital Intelectual
Revista Tecnologia & Cultura (CEFET/RJ), 2020
Proposta de um Framework para a Construção de uma Arquitetura de Dados Empresarial: Um
Estudo de Caso em uma Empresa Farmacêutica
Revista GESTÃO & APRENDIZAGEM, 2020
Vulnerabilidades em Redes Wi-Fi de Instituições de Ensino Superior: Um Estudo de Múltiplos Casos
Research, Society and Development, 2019
Filosofia Ágil Aplicada à Gestão do Conhecimento: Um Mapeamento Sistemático da Literatura
Revista Ciência da Informação, 2019
A Relevância da Inclusão Digital para Idosos nas Publicações Científicas: Uma revisão a partir do
indexador SCOPUS
Revista Conexão - Comunicação e Cultura, 2018
A Influência da Engenharia Semiótica na Experiência do Usuário de Aplicativos Mobile: Uma Reflexão
sobre a Relação entre Semiose e o Desenvolvimento de APPs
Revista ACTA Semiótica et Lingvística, 2018
O Impacto da Engenharia Social na Segurança da Informação: Uma Abordagem Orientada à Gestão
Corporativa
Revista AtoZ - Novas práticas em informação e conhecimento, 2018
Análise da Adoção do Lean Manufacturing na Gestão de Projetos de Tecnologia da Informação:
Estudo de Caso em uma Multinacional desse Segmento
Revista Gestão & Tecnologia de Projetos, 2018
O Impacto da Tecnologia da Informação no Ensino Superior: Desafios da Ubiquidade na Aprendizagem
Estudantil
Revista Educação & Tecnologia, 2017
Impactos da Implantação do Lean Manufacturing na Gestão de Projetos de Tecnologia da Informação:
Estudo de Caso em uma Multinacional do Segmento de T.I
Revista Sistemas de Informação e Gestão do Conhecimento, 2014
Prêmios e Reconhecimentos
• Professor destaque do curso de Sistemas de Informação
Concedido pelo Centro Universitário Newton Paiva · fev de 2024
Reconhecimento pelo excelente desempenho como docente do curso de Sistemas de Informação, no segundo semestre
de 2023.
• Patrono da turma de Ciência da Computação 1SEM/2020
Concedido pela Universidade FUMEC · jul de 2020
A atribuição do termo patrono é uma honra que reconhece o trabalho e estudo admirado pela nova geração de
profissionais que se formam.
• Mejor Trabajo en Equipo
Concedido pela Prosegur · jun de 2015
Premiação concedida ao Equipo SOL pelo desenvolvimento de evolutivos do sistema SOL seguindo metodologia ágil
Scrum, destacando-se o foco em planejamento, desenvolvimento e entregas de alta qualidade.
• 2º Lugar geral do curso de Ciência da Computação da Universidade FUMEC
Concedido pela Universidade FUMEC · fev de 2014
Reconhecimento do desempenho acadêmico consistente e dedicação aos estudos durante a graduação, alcançando o 2º
lugar no curso de Ciência da Computação no ano de 2013.
`;
