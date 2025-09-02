// src/i18n.js

import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      "comando": {
        "nao_reconhecido": "Command not recognized:",
        "ver_ajuda": "Type 'help' to see the options."
      },
      sobre: {
        nome: "João Paulo Aramuni",
        cargo: "Software Engineering Professor at PUC Minas",
        biografia:
          "Doctor and Master in Information Systems and Knowledge Management from Universidade FUMEC, with a degree in Computer Science. He has 13 years of experience in systems development and 9 years in technology education. He is a professor in the Software Engineering course at PUC Minas, also serving as CTO of the Experimental Software Agency at ICEI. He has been a Tech Lead at Trybe and Tech Manager at IN8, as well as a consultant in artificial intelligence and system architecture. He has experience in team leadership, agile methodologies, design patterns, back-end development (Java and Python), and has participated in projects for companies such as Banco do Brasil, Oi, ANP, Prosegur, HotMilhas, and 123milhas.",
        titulo_skills:
          "Main Skills: Teaching, Leadership and people management, Software development, Agile documentation, Global system deployment, Legacy system maintenance, Design patterns, and Agile methodologies: Scrum and Lean.",
      },
      boasvindas: {
        nome: "Professor",
        titulo: "Aramuni",
        bemvindo: "$ Welcome to my Portfolio",
        cargo: "Software Engineering Professor at PUC Minas",
        local: "Belo Horizonte, Minas Gerais, Brazil",
        faculdade: "Doctor and Master in Information Systems and Knowledge Management",
        ajuda: "Type `help` to explore all available commands.",
      },
      contato: {
        titulo: "Get in Touch",
        subtitulo: "Feel free to connect or send me a message.",
      },
      premios: {
        titulo: "Awards",
        nenhum: "No awards registered yet.",
        link: "See Link",
        professor_newton: {
          titulo: "Outstanding Professor of the Information Systems Course",
          org: "Newton Paiva University Center",
          desc: "Recognition for outstanding performance as a professor of the Information Systems course in the second semester of 2023.",
        },
        patrono_fumec: {
          titulo: "Patron of the Computer Science Class 1SEM/2020",
          org: "FUMEC University",
          desc: "The title of class patron is an honor granted by graduating students. During graduation ceremonies, as part of tradition, students elect a distinguished figure in the scientific field as the 'patron of the class'. This recognition honors the professional, highlighting their work and study admired by the new generation of professionals.",
        },
        premio_prosegur: {
          titulo: "Best Teamwork Award",
          org: "Prosegur",
          desc: "Award granted to Team SOL for the development of the SOL system using Agile Scrum methodology. The team was organized into 3 squads: 2 Scrum teams and 1 support/correction team. The purpose of dedicating a small team to support and corrections was to allow the Scrum teams to remain focused on delivering user stories without interruption. Each sprint lasted 2 weeks, including planning, presentation, and retrospective meetings. This structure allowed continuous development and delivery.",
        },
        segundo_lugar_fumec: {
          titulo: "2nd Place Overall in the Computer Science Course",
          org: "FUMEC University",
          desc: "Recognition granted by FUMEC University for achieving 2nd place overall in the Computer Science Bachelor's degree in 2013. This award reflects consistent academic performance, dedication to studies, and a commitment to technical and scientific excellence.",
        },
      },
      ajuda: {
        titulo: "Available commands:",
        sobre: { desc: "Shows a brief description about me." },
        ajuda: { desc: "Displays this list of available commands." },
        experiencias: {
          desc: "Shows my professional trajectory and experiences.",
        },
        contato: { desc: "Displays my contact information." },
        limpar: { desc: "Clears the terminal history." },
        recomendacoes: { desc: "Shows my LinkedIn recommendations." },
        premios: { desc: "Shows awards and recognitions." },
        projetos: { desc: "Displays my developed projects." },
        game: { desc: "Play Flappy Plane directly in the web terminal." },
      },
      projetos: {
        titulo: "My Main Projects",

        python_proj_title: "Python Projects",
        python_proj_desc: "A diverse collection of projects developed in Python, covering areas such as automation, data analysis, web development, and machine learning. These projects showcase practical applications of algorithms, API integration, data manipulation, and interactive interface creation, offering solutions ranging from utility tools and file compressors to art generators, simulators, code metrics analyzers, and intelligent bots. This collection reflects a wide range of Python skills and knowledge, serving as a comprehensive portfolio to explore programming concepts, logic, and applied software development.",

        springboot_proj_title: "Spring Boot Projects",
        springboot_proj_desc: "A diverse collection of projects developed in Java using Spring Boot, covering REST APIs, integration with relational and NoSQL databases, authentication and authorization with JWT, data processing, report generation, automation, and interactive web functionalities. These projects include full examples of architecture, services with user interfaces, integration with external APIs such as TMDB, Huggingface, Twilio, and YouTube, as well as secure login systems, file compression, and messaging. The collection demonstrates practical applications of backend development, software architecture, and object-oriented programming concepts, serving as a comprehensive portfolio of Java solutions.",

        c_proj_title: "C Language Projects",
        c_proj_desc: "A comprehensive collection of projects and exercises developed in C and C++, including algorithms, data structures, array manipulation, recursion, pointers, structs, file handling, and control flow. All projects are compiled with MinGW/GCC and focus on programming fundamentals, logic, efficiency, and best practices. The collection ranges from simple programs like calculators and classic games to more advanced implementations such as recursive matrix multiplication, file manipulation, simulations, and sorting and searching algorithms. This portfolio demonstrates practical applications of structured and object-oriented programming concepts, serving as a solid reference for learning and development in C/C++.",
        
        portfolio_proj_title: "Personal Portfolio",
        portfolio_proj_desc:  "An interactive personal portfolio built with React and Vite, simulating a terminal interface to navigate through different sections, including projects, professional experiences, certificates, and awards. The project features components such as ProjectCard, Awards, Recommendations, and AboutMe, enabling dynamic and visually organized presentation of information. All pages support multiple languages through i18n.js, ensuring global accessibility. Additionally, it includes an interactive mini-game directly within the terminal, providing a fun and unique experience for visitors. The portfolio combines modern design, intuitive navigation, and interactive features, showcasing advanced skills in React, data management, and user experience.",
        
        github_proj_title: "GitHub Readme Profile",
        github_proj_desc:   "A project focused on building and optimizing GitHub profiles, including custom READMEs with statistics, badges, activity graphs, commit and contribution tracking, and integration with external services such as WakaTime and Spotify. The project also includes practical workshops, interactive profile examples, and recommendations for tools to increase engagement and visibility, as well as guides on best practices, dynamic visual elements, emojis, and automated README content generation. The goal is to provide developers with a comprehensive and visually appealing portfolio, highlighting skills, projects, and contributions on GitHub.",
        
        aes_proj1_title: "Landing Page Project - Experimental Software Agency",
        aes_proj1_desc: "The Landing Page of the Experimental Software Agency serves as the official channel to present the agency, capture client requests, and highlight the projects and talents developed by its teams. The AES Landing Page facilitates communication between clients and developers, offering a direct channel for submitting requests, which are analyzed and directed to the responsible teams. Additionally, the page promotes the agency's institutional visibility, showcasing its projects, achievements, and talents, functioning as a showcase for the market to recognize AES's potential.",
        
        aes_proj2_title: "Smart Curriculum Project - Experimental Software Agency",
        aes_proj2_desc: "The Smart Curriculum is a system designed to help students organize their curriculum, offering graphical visualizations of courses across the periods of the program. With this tool, students can rearrange subjects according to their preferences, track their academic progress, and explore course offerings from other programs, providing a more personalized and flexible learning experience.",
 
      },
      recomendacoes: {
        titulo: "Recommendations",
        nenhum: "No recommendations yet", 
      },
      experiencias: {
        titulo: "Professional Experiences",

        // Companies
        puc_minas: "PUC Minas",
        centro_newton_paiva: "Newton Paiva University Center",
        in8: "IN8",
        trybe: "Trybe",
        xp_educacao: "XP Educação",
        universidade_fumec: "FUMEC University",
        prosegur: "Prosegur",
        capgemini: "Capgemini",
        banco_brasil: "Banco do Brasil",
        alamo_ti: "Álamo - IT Solutions",
        cpd_face_fumec: "CPD FACE/FUMEC",
        pibic_cnpq: "PIBIC/CNPq",

        // Roles
        professor_puc: "Professor",
        professor_newton: "Professor",
        tech_manager_in8: "Tech Manager",
        dev_backend_in8: "Senior Back-End Developer",
        curriculum_tech_lead_trybe: "Curriculum Tech Lead",
        curriculum_lead_tech_trybe: "Curriculum Lead & Tech",
        cs_lead_instructor_trybe: "Computer Science Lead Instructor",
        backend_cs_lead_instructor_trybe: "Back-End & CS Lead Instructor",
        cs_specialist_instructor_trybe:
          "Computer Science Specialist Instructor",
        professor_xp: "Professor",
        professor_fumec: "Professor",
        analista_sistemas_pl_prosegur: "Systems Analyst Pl",
        analista_sistemas_pl_capgemini: "Systems Analyst Pl",
        tecnico_programador_bb: "Technician/Programmer",
        desenvolvedor_csharp_alamo: "C# Developer",
        estagiario_fumec: "Intern",
        bolsista_pibic: "Undergraduate Research Fellow",

        // Descriptions & Skills
        professor_puc_desc:
          "In the Software Engineering course, teaches Project and Algorithm Analysis, Software Project, Software Development Lab, Software Experimentation Lab, and Interdisciplinary Work: Applications for Real Scenarios. Guided TCCII projects and leads the ICEI Experimental Software Agency with 6 teams (~30 people). Conducts workshops and lectures on Python, Spring Boot, Docker, PostgreSQL, MongoDB, Cloud, AI, and more, creating technical content and support material.",
        professor_puc_skills:
          "Teaching, Leadership, Software development, Agile documentation, Global system deployment, Legacy system maintenance, Design patterns, Agile methodologies.",

        professor_newton_desc:
          "Teaches Programming Languages (Java), Web Application Architecture, and Databases for Computer Science, Information Systems, and Systems Analysis courses. Highlight professor for the Information Systems course (2nd semester 2023). Teaches logic programming with games (Scratch) for high school students.",
        professor_newton_skills:
          "Teaching, Java, Web application architecture, Databases, Logic programming with games.",

        tech_manager_in8_desc:
          "Leads squads responsible for multiple system development projects for the airline miles market. Ensures continuous execution, demand alignment, and obstacle resolution. Responsible for availability, scalability, performance, security, technical integration with product, data, and business, client communication, hiring, and team mentoring. Tech Stack: Node.js, Next.js, Python, FastAPI, AWS, Docker, Redis, Amazon SQS, GitLab, Grafana, New Relic.",
        tech_manager_in8_skills:
          "Technology project management, Effective communication, Problem solving, Technical leadership, Node.js, Next.js, Python, FastAPI, AWS, Docker, CI/CD, System monitoring.",

        dev_backend_in8_desc:
          "Web scraping and crawler development in Python 3 for airline mileage programs. Creation and maintenance of RESTful APIs for data extraction and browser automation. AWS cloud architecture with HA/DR, CI/CD, Docker container management, and monitoring with Grafana and New Relic.",
        dev_backend_in8_skills:
          "Python, Web Scraping, RESTful APIs, AWS, Docker, CI/CD, Observability and monitoring.",

        curriculum_tech_lead_trybe_desc:
          "Responsible for the Python curriculum structure and technical team development. Data-driven decision making to maximize student employability. Team training, technical guidance, content production, and evaluation tool development.",
        curriculum_tech_lead_trybe_skills:
          "Technical leadership, Computer Science, Python, Team management, Content production, Educational evaluation.",

        curriculum_lead_tech_trybe_desc:
          "Manages the Python curriculum structure and leads a team of 3 people. Defines OKRs and KPIs, produces technical content in Python and Java, and directly mentors the team.",
        curriculum_lead_tech_trybe_skills:
          "Content management, Python, Java, Team leadership, OKR and KPI definition.",

        cs_lead_instructor_trybe_desc:
          "Manages learning operations of classes and a team of 10 people. Defines OKRs and KPIs, conducts selection processes, and directly leads CS instructors and specialists.",
        cs_lead_instructor_trybe_skills:
          "Team leadership, Computer Science, Technical leadership, OKR and KPI definition.",

        backend_cs_lead_instructor_trybe_desc:
          "Manages learning operations of classes and a team of 17 people. Defines OKRs and KPIs, conducts selection processes, and directly leads Back-End and CS instructors.",
        backend_cs_lead_instructor_trybe_skills:
          "Team leadership, Back-End, Computer Science, Technical leadership, OKR and KPI definition.",

        cs_specialist_instructor_trybe_desc:
          "Taught Python, OOP, Web Scraping, algorithms, and data structures. Contributed to the first version of Trybe's Computer Science curriculum. Instructor for Trybe's first cohort (Cohort 1).",
        cs_specialist_instructor_trybe_skills:
          "Teaching, Computer Science, Python, JavaScript, OOP, Web Scraping, Algorithms and Data Structures.",

        professor_xp_desc:
          "Professor of Software Architecture and Requirements Engineering. Introduced fundamental concepts, practices, and tools used in software architectural projects, developing hard and soft skills for high-level software architects.",
        professor_xp_skills:
          "Teaching, Software Architecture, Requirements Engineering, Java, C++, VBScript, Shell Script.",

        professor_fumec_desc:
          "Teaches Computer Science Fundamentals, Compilers, and OOP. Also teaches Script Development I & II in Computer Networks, Software Engineering II, and Introduction to Web Programming. Advises monographs, coordinates extension projects, and guides students for internships and job market.",
        professor_fumec_skills:
          "Teaching, Computer Science Fundamentals, Compilers, OOP, Software Engineering, Web Programming, Script Development.",

        analista_sistemas_pl_prosegur_desc:
          "Developed distributed systems in Java 8, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink. Global deployment. Global software maintenance, refactoring, and performance improvements. WebServices and automated testing. Oracle DB handling. PL/SQL programming. Use case documentation. Agile Scrum methodology.",
        analista_sistemas_pl_prosegur_skills:
          "Java, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink, PL/SQL, Oracle, Scrum, Automated testing.",

        analista_sistemas_pl_capgemini_desc:
          "Analysis and development in Java / Java Web; Maintenance of VB6 / VB.NET systems. Web development in Classic ASP / ASP.NET. SQLServer / Oracle DB handling. PL/SQL programming. Documentation and UML. Lean Manufacturing methodology.",
        analista_sistemas_pl_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        tecnico_programador_bb_desc:
          "Supervised internship in development and support of Java / Java Web applications; Maintenance of SISBB-integrated systems. Development and support of legacy VBA / VB6 applications; PL/SQL programming; Requirements gathering.",
        tecnico_programador_bb_skills:
          "Java, Java Web, VBA, VB6, PL/SQL, Banking automation.",

        desenvolvedor_csharp_alamo_desc:
          "C# /.NET v3.5 development for project management system and electronic time control. Web development with ASP.NET. Version control with TortoiseCVS. SQL Server DB handling. Creation of procedures and triggers.",
        desenvolvedor_csharp_alamo_skills:
          "C#, ASP.NET, SQL Server, Procedures, Triggers.",

        estagiario_fumec_desc:
          "Internship at CPD FACE/FUMEC: Developed internal applications with PHP and jQuery. Network support. Linux server maintenance. Shell scripting. Help Desk.",
        estagiario_fumec_skills:
          "PHP, jQuery, Shell Script, Networks, Linux, Help Desk.",

        bolsista_pibic_desc:
          "PIBIC/CNPq Undergraduate Research Fellow in a project using atomic force microscopy to study interactions of polyphenolic compounds with cells and HTLV-1 virus. Conducted at UFMG and CETEC under Prof Dr Orlando Abreu Gomes.",
        bolsista_pibic_skills:
          "Scientific research, Atomic Force Microscopy, Cell Biology, Virology, Scientific documentation, Academic research support",
      },
    },
  },
  pt: {
    translation: {
      "comando": {
        "nao_reconhecido": "Comando não reconhecido:",
        "ver_ajuda": "Digite 'ajuda' para ver as opções."
      },
      sobre: {
        nome: "João Paulo Aramuni",
        cargo: "Professor de Engenharia de Software na PUC Minas",
        biografia:
          "Doutor e mestre em Sistemas de Informação e Gestão do Conhecimento pela Universidade FUMEC, com graduação em Ciência da Computação. Possui 13 anos de experiência em desenvolvimento de sistemas e 9 anos no ensino de tecnologia. É professor do curso de Engenharia de Software da PUC Minas, atuando também como CTO da Agência Experimental de Software do ICEI. Já foi Tech Lead na Trybe e Tech Manager na IN8, além de atuar como consultor em inteligência artificial e arquitetura de sistemas. Tem experiência em liderança de equipes, metodologias ágeis, design patterns, desenvolvimento back-end (Java e Python) e participou de projetos para empresas como Banco do Brasil, Oi, ANP, Prosegur, HotMilhas e 123milhas.",
        titulo_skills:
          "Principais Habilidades: Docência, Liderança e gestão de pessoas, Desenvolvimento de software, Documentação ágil, Implantação de sistemas em âmbito global, Manutenção de sistemas legados, Design patterns e Metodologias ágeis: Scrum e Lean.",
      },
      boasvindas: {
        nome: "Professor",
        titulo: "Aramuni",
        bemvindo: "$ Bem-vindo ao meu Portfólio",
        cargo: "Professor de Engenharia de Software na PUC Minas",
        local: "Belo Horizonte, Minas Gerais, Brasil",
        faculdade: "Doutor e Mestre em Sistemas de Informação e Gestão do Conhecimento",
        ajuda: "Digite `ajuda` para conhecer mais sobre os comandos.",
      },
      contato: {
        titulo: "Entre em Contato",
        subtitulo:
          "Sinta-se à vontade para se conectar ou me enviar uma mensagem.",
      },
      premios: {
        titulo: "Prêmios",
        nenhum: "Nenhum prêmio cadastrado ainda.",
        link: "Ver no Link",
        professor_newton: {
          titulo: "Professor destaque do curso de Sistemas de Informação",
          org: "Centro Universitário Newton Paiva",
          desc: "Reconhecimento pelo excelente desempenho como docente do curso de Sistemas de Informação, no segundo semestre de 2023.",
        },
        patrono_fumec: {
          titulo: "Patrono da turma de Ciência da Computação 1SEM/2020",
          org: "Universidade FUMEC",
          desc: "A atribuição do termo patrono está relacionada com o ato de outorga do grau acadêmico. Nas cerimônias de colação de grau, como parte de uma tradição, os alunos formandos devem eleger uma personalidade de destaque no campo científico a que pertencem como 'padrinho da turma'. O título de patrono é uma honra para o profissional que o recebe, pois significa que seu trabalho e estudo são reconhecidos e admirados pela nova geração de profissionais.",
        },
        premio_prosegur: {
          titulo: "Mejor Trabajo en Equipo",
          org: "Prosegur",
          desc: "Prêmio concedido ao Equipo SOL pelo desenvolvimento dos evolutivos do sistema SOL utilizando a metodologia ágil Scrum. A equipe foi organizada em 3 squads: 2 times Scrum e 1 time de suporte/correções. O objetivo de dedicar uma equipe menor ao suporte e correções era permitir que os times Scrum permanecessem focados nas entregas das user stories. Cada sprint tinha duração de 2 semanas, incluindo planejamento, apresentação e retrospectiva. Esta estrutura permitiu desenvolvimento e entrega contínua.",
        },
        segundo_lugar_fumec: {
          titulo: "2º Lugar geral do curso de Ciência da Computação",
          org: "Universidade FUMEC",
          desc: "Reconhecimento concedido pela Universidade FUMEC pelo 2º lugar geral no curso de Bacharelado em Ciência da Computação no ano de 2013. Este resultado reflete desempenho acadêmico consistente, dedicação aos estudos e compromisso com a excelência técnica e científica.",
        },
      },
      ajuda: {
        titulo: "Comandos disponíveis:",
        sobre: { desc: "Mostra uma breve descrição sobre mim." },
        ajuda: { desc: "Mostra esta lista de comandos disponíveis." },
        experiencias: {
          desc: "Mostra minha trajetória profissional e experiências.",
        },
        contato: { desc: "Exibe minhas informações de contato." },
        limpar: { desc: "Limpa o histórico do terminal." },
        recomendacoes: { desc: "Exibe minhas recomendações do LinkedIn." },
        premios: { desc: "Exibe prêmios e reconhecimentos." },
        projetos: { desc: "Exibe meus projetos desenvolvidos." },
        game: { desc: "Jogue o Flappy Plane diretamente no terminal web." },
      },
      projetos: {
        titulo: "Meus Principais Projetos",

        python_proj_title: "Projetos Python",
        python_proj_desc: "Uma coleção diversificada de projetos desenvolvidos em Python, abrangendo áreas como automação, análise de dados, desenvolvimento web e aprendizado de máquina. Esses projetos demonstram a aplicação prática de algoritmos, integração com APIs, manipulação de dados e criação de interfaces interativas, oferecendo soluções que vão desde ferramentas utilitárias e compressores de arquivos até geradores de arte, simuladores, analisadores de métricas de código e bots inteligentes. A coleção reflete a variedade de habilidades e conhecimentos em Python, servindo como um portfólio completo para explorar conceitos de programação, lógica e desenvolvimento de software aplicado.",

        springboot_proj_title: "Projetos Spring Boot",
        springboot_proj_desc: "Uma coleção diversificada de projetos desenvolvidos em Java utilizando Spring Boot, abrangendo APIs REST, integração com bancos de dados relacionais e NoSQL, autenticação e autorização com JWT, processamento de dados, geração de relatórios, automação e funcionalidades web interativas. Esses projetos incluem exemplos completos de arquitetura, serviços com interface de usuário, integração com APIs externas como TMDB, Huggingface, Twilio e YouTube, além de sistemas de login seguro, compressão de arquivos e mensageria. A coleção demonstra a aplicação prática de conceitos de desenvolvimento backend, arquitetura de software e programação orientada a objetos, servindo como um portfólio abrangente de soluções em Java.",

        c_proj_title: "Projetos Linguagem C",
        c_proj_desc: "Uma coleção extensa de projetos e exercícios desenvolvidos em C e C++, incluindo algoritmos, estruturas de dados, manipulação de arrays, recursão, ponteiros, structs, arquivos e controle de fluxo. Todos os projetos são compilados com MinGW/GCC e focam em fundamentos da programação, lógica, eficiência e boas práticas. A coleção abrange desde programas simples, como calculadoras e jogos clássicos, até implementações mais avançadas, como multiplicação de matrizes recursiva, manipulação de arquivos, simulações e algoritmos de ordenação e busca. Este portfólio demonstra a aplicação prática de conceitos de programação estruturada e orientada a objetos, servindo como referência sólida para aprendizado e desenvolvimento em C/C++.",

        portfolio_proj_title: "Portfólio Pessoal",
        portfolio_proj_desc: "Portfólio pessoal interativo, desenvolvido com React e Vite, que simula um terminal para navegação entre diferentes seções, incluindo projetos, experiências profissionais, certificados e premiações. O projeto apresenta componentes como ProjectCard, Awards, Recommendations e SobreMim, permitindo exibir informações de forma dinâmica e visualmente organizada. Todas as páginas possuem suporte a múltiplos idiomas através do i18n.js, garantindo acessibilidade global. Além disso, integra um mini-jogo interativo diretamente no terminal, oferecendo uma experiência divertida e única para o visitante. O portfólio combina design moderno, navegação intuitiva e funcionalidades interativas, demonstrando habilidades avançadas em React, gerenciamento de dados e experiência do usuário.",

        github_proj_title: "GitHub Readme Profile",
        github_proj_desc: "Projeto voltado à construção e otimização de perfis no GitHub, incluindo a criação de README personalizados com estatísticas, badges, gráficos de atividade, visualização de commits e contribuições, e integração com serviços externos como WakaTime e Spotify. O projeto também inclui workshops práticos, exemplos de perfis interativos e recomendações de ferramentas para aumentar engajamento e visibilidade, além de guias de boas práticas, elementos visuais dinâmicos, emojis e geração automática de conteúdos para README. O objetivo é fornecer aos desenvolvedores um portfólio completo e visualmente atraente, facilitando o destaque de habilidades, projetos e contribuições no GitHub.",

        aes_proj1_title: "Projeto Landing Page - Agência Experimental de Software",
        aes_proj1_desc: "A Landing Page da Agência Experimental de Software funciona como o canal oficial para apresentar a agência, captar demandas e destacar os projetos e talentos desenvolvidos por suas equipes. A Landing Page da AES facilita a comunicação entre clientes e desenvolvedores, oferecendo um canal direto para o envio de demandas, que são analisadas e direcionadas às equipes responsáveis. Além disso, a página promove a divulgação institucional da agência, destacando seus projetos, conquistas e talentos, funcionando como uma vitrine para o mercado conhecer o potencial da AES.",

        aes_proj2_title: "Projeto Grade Inteligente - Agência Experimental de Software",
        aes_proj2_desc: "A Grade Inteligente é um sistema projetado para ajudar os alunos a organizarem sua matriz curricular, oferencendo uma visualização gráficas das disciplinas ao longo dos períodos do curso. Com a ferramenta, é possível reorganizar as matérias de acordo com as preferências do aluno, acompanhar o seu progresso acadêmico e explorar ofertas de disciplinas de outros cursos, proporcionando uma experiência de aprendizado mais personalizada e flexível.",

      
        }, recomendacoes: {
        titulo: "Recomendações",
        nenhum: "Nenhuma recomendação cadastrada ainda.", 
      },
      experiencias: {
        titulo: "Experiência Profissionais",
   
        // Companies
        puc_minas: "PUC Minas",
        centro_newton_paiva: "Centro Universitário Newton Paiva",
        in8: "IN8",
        trybe: "Trybe",
        xp_educacao: "XP Educação",
        universidade_fumec: "Universidade FUMEC",
        prosegur: "Prosegur",
        capgemini: "Capgemini",
        banco_brasil: "Banco do Brasil",
        alamo_ti: "Álamo - Soluções em TI",
        cpd_face_fumec: "CPD FACE/FUMEC",
        pibic_cnpq: "PIBIC/CNPq",

        // Roles
        professor_puc: "Professor",
        professor_newton: "Professor",
        tech_manager_in8: "Tech Manager",
        dev_backend_in8: "Desenvolvedor Back-End Sênior",
        curriculum_tech_lead_trybe: "Curriculum Tech Lead",
        curriculum_lead_tech_trybe: "Curriculum Lead & Tech",
        cs_lead_instructor_trybe: "Computer Science Lead Instructor",
        backend_cs_lead_instructor_trybe: "Back-End & CS Lead Instructor",
        cs_specialist_instructor_trybe:
          "Computer Science Specialist Instructor",
        professor_xp: "Professor",
        professor_fumec: "Professor",
        analista_sistemas_pl_prosegur: "Analista de Sistemas Pl",
        analista_sistemas_pl_capgemini: "Analista de Sistemas Pl",
        tecnico_programador_bb: "Técnico/Programador",
        desenvolvedor_csharp_alamo: "Desenvolvedor C#",
        estagiario_fumec: "Estagiário",
        bolsista_pibic: "Bolsista de Iniciação Científica",

        // Descriptions & Skills
        professor_puc_desc:
          "No curso de Engenharia de Software, é professor das disciplinas de Fundamentos de Projeto e Análise de Algoritmos, Projeto de Software, Laboratório de Desenvolvimento de Software, Laboratório de Experimentação de Software e Trabalho Interdisciplinar: Aplicações para Cenários Reais. Também foi professor das disciplinas de Trabalho Interdisciplinar: Aplicações Web e Algoritmos e Estruturas de Dados I (Linguagem C) do curso de Engenharia de Software e da disciplina de Laboratório de Iniciação à Programação do curso de Ciência da Computação. Orientador na disciplina de TCCII e CTO da Agência Experimental de Software do ICEI, responsável por 6 times (~30 pessoas). Condução de oficinas e aulões sobre tópicos de desenvolvimento de software, abordando Python, Spring Boot, Docker, PostgreSQL, MongoDB, Nuvem, Inteligência Artificial e mais, além da criação de conteúdo técnico e material de apoio.",
        professor_puc_skills:
          "Docência, Liderança, Desenvolvimento de software, Documentação ágil, Deploy de sistemas globais, Manutenção de sistemas legados, Padrões de projeto, Metodologias ágeis.",

        professor_newton_desc:
          "Professor das disciplinas de Linguagens de Programação (Java), Arquitetura de Aplicações Web e Banco de Dados dos cursos de Ciência da Computação, Sistemas de Informação e Análise e Desenvolvimento de Sistemas. Professor destaque do curso de Sistemas de Informação (2º semestre de 2023). Lógica de Programação com jogos (Scratch) para o ensino médio do Colégio Santa Dorotéia e Colégio ICJ.",
        professor_newton_skills:
          "Docência, Java, Arquitetura de aplicações Web, Banco de Dados, Lógica de programação lúdica.",

        tech_manager_in8_desc:
          "Liderança de squads responsáveis por múltiplos projetos de desenvolvimento de sistemas para o mercado de milhas aéreas. Facilitador para assegurar execução contínua, alinhamento de demandas e solução de impedimentos. Responsável pela disponibilidade, escalabilidade, performance e segurança das aplicações, integração técnica com produto, dados e negócios, contato direto com clientes, condução de contratações e mentoria de equipes. Tech Stack: Node.js, Next.js, Python, FastAPI, AWS, Docker, Redis, Amazon SQS, GitLab, Grafana, New Relic.",
        tech_manager_in8_skills:
          "Gestão de projetos de tecnologia, Comunicação eficaz, Resolução de problemas, Liderança técnica, Node.js, Next.js, Python, FastAPI, AWS, Docker, CI/CD, Monitoramento de sistemas.",

        dev_backend_in8_desc:
          "Web scraping e desenvolvimento de crawlers em Python 3 para programas de milhas aéreas. Criação e manutenção de APIs RESTful para extração de dados e automação de navegadores. Arquitetura cloud AWS com HA/DR, CI/CD, administração de containers Docker e monitoramento com Grafana e New Relic.",
        dev_backend_in8_skills:
          "Python, Web Scraping, APIs RESTful, AWS, Docker, CI/CD, Observabilidade e monitoramento.",

        curriculum_tech_lead_trybe_desc:
          "Responsável pela estrutura curricular em Python e pelo desenvolvimento técnico do time. Tomada de decisão baseada em dados para maximizar empregabilidade dos estudantes. Formação, orientação técnica e mentoria da equipe, produção de conteúdos complexos e desenvolvimento de instrumentos de avaliação.",
        curriculum_tech_lead_trybe_skills:
          "Liderança técnica, Ciência da computação, Python, Gestão de equipe, Produção de conteúdo, Avaliação educacional.",

        curriculum_lead_tech_trybe_desc:
          "Gestão da estrutura curricular em Python e liderança de time de 3 pessoas. Definição de OKRs e KPIs da área, produção de conteúdo técnico em Python e Java e orientação direta da equipe.",
        curriculum_lead_tech_trybe_skills:
          "Gestão de conteúdo, Python, Java, Liderança de equipe, Definição de OKRs e KPIs.",

        cs_lead_instructor_trybe_desc:
          "Gestão da operação de aprendizagem de turmas e de um time de 10 pessoas. Definição de OKRs e KPIs da área, processos seletivos e liderança direta de instrutores e especialistas de Ciência da Computação.",
        cs_lead_instructor_trybe_skills:
          "Liderança de equipe, Ciência da computação, Liderança técnica, Definição de OKRs e KPIs.",

        backend_cs_lead_instructor_trybe_desc:
          "Gestão da operação de aprendizagem de turmas e de um time de 17 pessoas. Definição de OKRs e KPIs da área, processos seletivos e liderança direta de instrutores de Back-End e Ciência da Computação.",
        backend_cs_lead_instructor_trybe_skills:
          "Liderança de equipe, Back-End, Ciência da computação, Liderança técnica, Definição de OKRs e KPIs.",

        cs_specialist_instructor_trybe_desc:
          "Ministrou aulas de Python, POO, Web Scraping, algoritmos e estruturas de dados. Participou da construção da primeira versão do currículo de Ciência da Computação da Trybe. Instrutor da primeira turma da Trybe (Turma 1).",
        cs_specialist_instructor_trybe_skills:
          "Docência, Ciência da computação, Python, JavaScript, POO, Web Scraping, Algoritmos e Estruturas de Dados.",

        professor_xp_desc:
          "Professor de Arquitetura de Software e Engenharia de Requisitos. Apresentação de conceitos fundamentais, práticas e ferramentas utilizadas em projetos arquiteturais, com desenvolvimento de hard e soft skills para arquitetos de software.",
        professor_xp_skills:
          "Docência, Arquitetura de Software, Engenharia de Requisitos, Java, C++, VBScript, Shell Script.",

        professor_fumec_desc:
          "Professor das disciplinas de Fundamentos Teóricos da Computação, Compiladores e POO. Professor das disciplinas de Desenvolvimento de Scripts I e II em Redes de Computadores. Professor das disciplinas de Engenharia de Software II e Introdução à Programação Web em Sistemas de Informação EaD. Orientação de monografias, coordenação de projetos de extensão e direcionamento de alunos para estágio e mercado.",
        professor_fumec_skills:
          "Docência, Fundamentos Teóricos da Computação, Compiladores, POO, Engenharia de Software, Programação Web, Desenvolvimento de Scripts.",

        analista_sistemas_pl_prosegur_desc:
          "Desenvolvimento de sistema distribuído em Java 8, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink. Implantação em âmbito global. Software Maintenance, refatoração e melhorias de performance. Testes de WebServices e automatizados. Manipulação de Banco de Dados Oracle. Programação PL/SQL. Documentação de Casos de Uso. Metodologia Ágil Scrum.",
        analista_sistemas_pl_prosegur_skills:
          "Java, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink, PL/SQL, Oracle, Scrum, Testes automatizados.",

        analista_sistemas_pl_capgemini_desc:
          "Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing.",
        analista_sistemas_pl_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        tecnico_programador_bb_desc:
          "Estágio supervisionado em desenvolvimento e suporte a aplicativos em Java / Java Web; Manutenção de sistemas integrados ao SISBB. Desenvolvimento e suporte a aplicações legadas VBA / VB6; Programação PL/SQL; Levantamento de requisitos.",
        tecnico_programador_bb_skills:
          "Java, Java Web, VBA, VB6, PL/SQL, Automação Bancária.",

        desenvolvedor_csharp_alamo_desc:
          "Desenvolvimento em C# /.NET v3.5 para sistema de gestão de projetos e controle de ponto eletrônico. Desenvolvimento Web com ASP.NET. Controle de versão com TortoiseCVS. Manipulação de Banco de Dados SQL Server. Criação de procedures e triggers.",
        desenvolvedor_csharp_alamo_skills:
          "C#, ASP.NET, SQL Server, Procedures, Triggers.",

        estagiario_fumec_desc:
          "Estágio em CPD FACE/FUMEC: Desenvolvimento de aplicativos internos com PHP e Jquery. Suporte técnico em redes. Manutenção de servidores Linux. Programação com Shell Script. Help Desk.",
        estagiario_fumec_skills:
          "PHP, Jquery, Shell Script, Redes, Linux, Help Desk.",

        bolsista_pibic_desc:
          "Bolsista PIBIC/CNPq em projeto sobre microscopia de força atômica para investigar interação de compostos polifenólicos com células e vírus HTLV-1. Desenvolvido na UFMG e CETEC, orientado pelo Prof Dr Orlando Abreu Gomes.",
        bolsista_pibic_skills:
          "Pesquisa científica, Microscopia de Força Atômica, Biologia celular, Virologia, Documentação científica, Apoio à pesquisa acadêmica",
      },
    },
  },
};

i18n.use(initReactI18next).init({
  resources,
  lng: "pt",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

export default i18n;
