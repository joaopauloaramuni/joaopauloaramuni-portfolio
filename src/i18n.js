import i18n from "i18next";
import { initReactI18next } from "react-i18next";
const resources = {
  en: {
    translation: {
      comando: {
        nao_reconhecido: "Command not recognized:",
        ver_ajuda: "Type 'help' to see the options.",
        carregando: "Loading...",
        falha_carregar: "Couldn't open this command. Reload the page and try again.",
      },
      tema: {
        claro_ativado: "Light theme enabled. Type 'theme --dark' to go back.",
        escuro_ativado: "Dark theme enabled. Type 'theme --light' or 'theme --galo' to switch.",
        galo_ativado: "Galo theme enabled: black, white and the star's yellow. Type 'theme --dark' to go back.",
        uso: "Usage: theme [--dark | --light | --galo] (no option cycles dark → light → galo)",
        grupo: "Theme",
        ativar_claro: "Switch to light theme",
        ativar_escuro: "Switch to dark theme",
        ativar_galo: "Switch to Galo theme (Atlético Mineiro)",
      },
      neofetch: {
        comandos: "commands",
        claro: "Light",
        escuro: "Dark",
        galo: "Galo",
        cpu: "Software Engineer (16 coffee cores)",
        time_label: "Team",
        logo_alt: "Atlético Mineiro crest in braille characters",
      },
      jogos: {
        titulo: "Galo's upcoming matches",
        subtitulo: "Clube Atlético Mineiro · times in Brasília time",
        subtitulo_posicao: "Clube Atlético Mineiro · #{{posicao}} in the Brasileirão · times in Brasília time",
        carregando: "Fetching Galo's fixtures...",
        erro: "Couldn't fetch the matches right now. Try again in a moment.",
        nenhum: "No matches scheduled yet.",
        uso: "Usage: jogos [--all | --table] (galo | atletico also work)",
        proximo_em: "Next match {{tempo}}",
        relogio_alt: "Countdown to the next match",
        placar_alt: "Live score",
        contra: "versus",
        casa: "home",
        fora: "away",
        hora_a_definir: "time TBD",
        penaltis: "pens",
        ultimo: "Last match:",
        resultado: { v: "W", e: "D", d: "L" },
        mais_one: "+ {{count}} more match scheduled: type <cmd>jogos --all</cmd>",
        mais_other: "+ {{count}} more matches scheduled: type <cmd>jogos --all</cmd>",
        fonte: "Source: <espn>ESPN</espn> (fixtures, crests and competition logos) · times in Brasília time · standings: <cmd>jogos --table</cmd>",
        tabela: {
          titulo: "Galo in the Brasileirão",
          rodadas_one: "{{count}} round played",
          rodadas_other: "{{count}} rounds played",
          carregando: "Fetching the Brasileirão table...",
          erro: "Couldn't fetch the table right now. Try again in a moment.",
          vazia: "The table isn't available yet.",
          legenda: "Brasileirão Série A standings",
          posicao: "#{{posicao}}",
          lugar: "place",
          pontos: "points",
          forma: "Last 5:",
          numeros: {
            pontos: "Points",
            jogos: "Played",
            vitorias: "Wins",
            empates: "Draws",
            derrotas: "Losses",
            gols_pro: "Goals for",
            gols_contra: "Goals against",
            saldo: "Goal difference",
            aproveitamento: "Points won",
          },
          colunas: {
            time: "Club",
            pontos: "Pts",
            jogos: "P",
            vitorias: "W",
            empates: "D",
            derrotas: "L",
            gols_pro: "GF",
            gols_contra: "GA",
            saldo: "GD",
            aproveitamento: "%",
          },
          situacao: {
            lider_one: "Leader, {{count}} point clear of {{time}}",
            lider_other: "Leader, {{count}} points clear of {{time}}",
            do_lider_one: "{{count}} point behind the leader ({{time}})",
            do_lider_other: "{{count}} points behind the leader ({{time}})",
            do_g_one: "{{count}} point off the top {{g}} (Libertadores)",
            do_g_other: "{{count}} points off the top {{g}} (Libertadores)",
            no_g: "Inside the top {{g}} (Libertadores spot)",
            acima_z4_one: "{{count}} point above the relegation zone",
            acima_z4_other: "{{count}} points above the relegation zone",
            no_z4_one: "In the relegation zone, {{count}} point from safety",
            no_z4_other: "In the relegation zone, {{count}} points from safety",
          },
          zonas: {
            libertadores: "Libertadores",
            pre_libertadores: "Libertadores qualifiers",
            sulamericana: "Sul-Americana",
            rebaixamento: "Relegation",
          },
          dica: "Upcoming matches: type <cmd>jogos</cmd>",
          fonte: "Source: <espn>ESPN</espn> (standings and crests)",
        },
        dia: { hoje: "today", amanha: "tomorrow" },
        unidades: { d: "days", h: "hours", min: "min", s: "sec" },
        tempo: {
          ao_vivo: "live now",
          comecando: "kicking off",
          hoje: "today",
          dias_one: "in {{count}} day",
          dias_other: "in {{count}} days",
          n_dias_one: "{{count}} day",
          n_dias_other: "{{count}} days",
          dias_horas: "in {{dias}} and {{horas}} h",
          horas_minutos: "in {{horas}} h {{minutos}} min",
          minutos_one: "in {{count}} min",
          minutos_other: "in {{count}} min",
        },
        serie: {
          jogo_ida: "1st leg",
          jogo_volta: "2nd leg",
          ida: "1st leg",
          agregado: "Aggregate",
          volta_em: "Second leg on {{data}}",
          ida_em: "First leg on {{data}}: the aggregate shows up here after it.",
          sem_ida: "Second leg: the first leg score isn't available yet.",
          vantagem_one: "Galo leads by {{count}} goal: a draw is enough.",
          vantagem_other: "Galo leads by {{count}} goals: a draw is enough.",
          desvantagem_one: "Galo trails by {{count}} goal: winning by {{mais}} goes through, by {{count}} means penalties.",
          desvantagem_other: "Galo trails by {{count}} goals: winning by {{mais}} goes through, by {{count}} means penalties.",
          empate: "Level on aggregate: whoever wins goes through; another draw means penalties.",
        },
        competicoes: {
          brasileirao: "Brasileirão Série A",
          copa_do_brasil: "Copa do Brasil",
          libertadores: "Copa Libertadores",
          sulamericana: "Copa Sudamericana",
          recopa: "Recopa Sudamericana",
          mundial: "FIFA Club World Cup",
          mineiro: "Campeonato Mineiro",
          supercopa: "Supercopa do Brasil",
          amistoso: "Friendly",
        },
        fases: {
          grupos: "Group stage",
          dezesseis_avos: "Round of 32",
          oitavas: "Round of 16",
          quartas: "Quarterfinals",
          semi: "Semifinals",
          terceiro: "Third place",
          final: "Final",
          fase1: "First round",
          fase2: "Second round",
          fase3: "Third round",
          fase4: "Fourth round",
          fase5: "Fifth round",
          playoffs: "Playoffs",
        },
      },
      boot: {
        cpu: "Detecting CPU: Software Engineer (16 coffee cores)",
        graduacao: "Started Undergraduate in Computer Science",
        teaching: "Started PUC Minas teaching daemon (software-engineering.service)",
        cafe: "coffee.service: coffee level below 20%, refilling...",
        projetos: "Reached target Projects and Experiences",
        carregando: "loading portfolio",
        pular: "press any key to skip",
      },
      sobre: {
        nome: "João Paulo Aramuni",
        cargo: "Software Engineering and Computer Science Professor at PUC Minas",
        avatar_alt: "Photo of João Paulo Aramuni",
        lema_1: "programmer by profession,",
        lema_2: "professor by calling",
        local: "Belo Horizonte, Brazil",
        signo: "Sagittarius",
        idade_one: "{{count}} year old",
        idade_other: "{{count}} years old",
        bio_1:
          "I'm a Software Engineering and Computer Science professor at <b>PUC Minas</b>, CTO of the Experimental Software Agency at ICEI and a technology consultant at <b>Jedis</b>. I hold a PhD and a Master's in Information Systems and Knowledge Management from Universidade FUMEC, where I also earned my degree in Computer Science.",
        bio_2:
          "That's <b>{{dev}} years</b> building software and <b>{{ensino}} years</b> teaching technology. In the industry I went from Java for cash logistics to Python crawlers for airline mileage programs, and led teams as Tech Lead at Trybe and Tech Manager at IN8. Today I apply artificial intelligence to assess technical profiles, design system architecture and take care of observability and systems on AWS. In the classroom I bring that practice into my students' projects, and all course material is open on GitHub.",
        kpi: {
          anos_one: "{{count}} year",
          anos_other: "{{count}} years",
          dev_rotulo: "building software",
          dev_detalhe_one: "across {{count}} company",
          dev_detalhe_other: "across {{count}} companies",
          ensino_rotulo: "teaching technology",
          ensino_detalhe_one: "since {{ano}} · {{count}} institution",
          ensino_detalhe_other: "since {{ano}} · {{count}} institutions",
          tccs_rotulo: "theses supervised",
          tccs_detalhe_one: "and {{count}} examining committee",
          tccs_detalhe_other: "and {{count}} examining committees",
          aes_rotulo: "teams at the AES",
          aes_detalhe_one: "~{{count}} person under my management",
          aes_detalhe_other: "~{{count}} people under my management",
        },
        secoes: {
          hoje: "today",
          trajetoria: "profession and calling",
          formacao: "education",
          disciplinas: "courses",
          vivencia: "experience",
          clientes: "built software for",
          pessoal: "outside the terminal",
          artigos: "published papers",
        },
        hoje: {
          em: "at",
          puc: {
            cargo: "Professor",
            org: "PUC Minas",
            detalhe: "Software Engineering and Computer Science · capstone project advisor",
          },
          aes: {
            cargo: "CTO",
            org: "Experimental Software Agency",
            detalhe: "7 development teams, around 35 people, at PUC Minas' ICEI",
          },
          jedis: {
            cargo: "Technology consultant",
            org: "Jedis",
            detalhe:
              "AI for finding and assessing technical profiles, system architecture, observability and team mentoring",
          },
          disciplinas_agora_one: "{{count}} course in {{semestre}}",
          disciplinas_agora_other: "{{count}} courses in {{semestre}}",
        },
        trajetoria: {
          profissao: "programmer by profession",
          vocacao: "professor by calling",
          hoje: "now",
          jedis: {
            cargo: "Technology consultant",
            org: "Jedis",
            detalhe: "AI in tech recruiting, architecture and AWS",
          },
          in8_manager: {
            cargo: "Tech Manager",
            org: "IN8",
            detalhe: "squads across several airline mileage projects",
          },
          trybe: {
            cargo: "Tech Lead",
            org: "Trybe",
            detalhe: "back-end and computer science teams, OKRs and content",
          },
          in8_dev: {
            cargo: "Senior back-end dev",
            org: "IN8",
            detalhe: "web scraping and Python crawlers for mileage programs",
          },
          capgemini: {
            cargo: "Programmer and analyst",
            org: "Capgemini",
            detalhe: "Java for ANP and Prosegur; promoted from junior straight to senior",
          },
          bb: {
            cargo: "Programmer technician",
            org: "Banco do Brasil",
            detalhe: "Java and systems integrated with SISBB",
          },
          alamo: {
            cargo: "C# developer",
            org: "Álamo TI",
            detalhe: "C# and ASP.NET for project management and time tracking",
          },
          puc: {
            cargo: "Professor and AES CTO",
            org: "PUC Minas",
            detalhe: "Software Engineering and Computer Science",
          },
          newton: {
            cargo: "Professor",
            org: "Newton Paiva",
            detalhe: "Computer Science, Information Systems and Systems Development",
          },
          xpe: {
            cargo: "Professor",
            org: "XP Educação",
            detalhe: "Software Architecture and Requirements Engineering",
          },
          trybe_instrucao: {
            cargo: "Technology Instruction Specialist",
            org: "Trybe",
            detalhe: "Computer Science with Python for cohorts 1 to 4",
          },
          fumec: {
            cargo: "Professor",
            org: "FUMEC",
            detalhe: "Computer Science, Information Systems and Networks",
          },
        },
        artigos: {
          intro_one:
            "<b>{{count}} paper</b> in peer-reviewed journals, from {{de}} to {{ate}}. Titles and journal names translated from Portuguese, the language of publication.",
          intro_other:
            "<b>{{count}} papers</b> in peer-reviewed journals, from {{de}} to {{ate}}. Titles and journal names translated from Portuguese, the language of publication.",
        },
        formacao: {
          intro:
            "Final works and defense slides are in the <repo>trabalhos-finais</repo> repository (in Portuguese).",
          tipos: {
            tese: "PhD dissertation",
            dissertacao: "Master's thesis",
            monografia: "Undergraduate thesis",
          },
          orientador: "Advisor:",
          doutorado: {
            nivel: "PhD",
            curso: "Information Systems and Knowledge Management",
            org: "Universidade FUMEC",
          },
          mestrado: {
            nivel: "Master's",
            curso: "Information Systems and Knowledge Management",
            org: "Universidade FUMEC",
          },
          graduacao: {
            nivel: "Bachelor's",
            curso: "Computer Science",
            org: "Universidade FUMEC",
          },
          pdl: {
            nivel: "Executive education",
            curso: "PDL - Leadership Development Program",
            org: "Fundação Dom Cabral",
            modulos: {
              lideres_de_lideres: "Leaders of Leaders",
              lideres_de_equipes: "Team Leaders",
            },
          },
        },
        disciplinas: {
          intro_one:
            "<b>{{count}} course</b> at {{instituicoes}} institutions, with the material open on GitHub: click to open the repository.",
          intro_other:
            "<b>{{count}} courses</b> at {{instituicoes}} institutions, with the material open on GitHub: click to open the repository.",
          agora: "this semester ({{semestre}})",
          contagem_one: "{{count}} course",
          contagem_other: "{{count}} courses",
          siglas: {
            igti: "XP Educação (IGTI)",
          },
        },
        vivencia: {
          docencia: "Teaching",
          lideranca: "Leadership and people management",
          desenvolvimento: "Software development",
          documentacao: "Agile documentation",
          implantacao: "Global system rollout",
          legado: "Legacy system maintenance",
          design_patterns: "Design patterns",
          scrum: "Scrum",
          lean: "Lean",
        },
        clientes: {
          oi: { nome: "Oi", desc: "Oi Telecom" },
          anp: { nome: "ANP", desc: "Brazilian National Agency of Petroleum, Natural Gas and Biofuels" },
          bb: { nome: "Banco do Brasil", desc: "Banco do Brasil S/A" },
          vsb: { nome: "VSB", desc: "Vallourec Sumitomo Tubos do Brasil" },
          prosegur: { nome: "Prosegur", desc: "Cash logistics and transport" },
          hotmilhas: { nome: "HotMilhas", desc: "Airline miles" },
          "123milhas": { nome: "123milhas", desc: "Travel and airline miles" },
          jedis: { nome: "Jedis", desc: "Technology and recruiting" },
          mereo: { nome: "Mereo", desc: "Performance and people management" },
          afya: { nome: "Afya", desc: "Leader in medical education in Brazil" },
          autoglass: {
            nome: "AutoGlass",
            desc: "Latin America's largest online auto glass store",
          },
          allos: { nome: "Allos", desc: "Entertainment platform" },
          bhtec: {
            nome: "CIS · BH-TEC",
            desc: "Sustainability Intelligence Center at the Belo Horizonte Technology Park",
          },
          mrv: { nome: "MRV", desc: "MRV Engenharia" },
          pmmg: { nome: "PMMG", desc: "Minas Gerais Military Police" },
          apac: {
            nome: "APAC Feminina BH",
            desc: "Association for the Protection and Assistance of Convicts",
          },
          mario_penna: { nome: "Instituto Mário Penna" },
          fisioterapia: {
            nome: "PUC Minas Physiotherapy",
            desc: "PUC Minas Physiotherapy Clinical Center - Coração Eucarístico",
          },
          enfermagem: {
            nome: "PUC Minas Nursing",
            desc: "PUC Minas Nursing Department - Coração Eucarístico and Betim",
          },
          icei: { nome: "ICEI PUC Minas", desc: "PUC Minas Institute of Exact Sciences and Informatics" },
        },
        pessoal: {
          rotulos: {
            time: "Team",
            hobbies: "Hobbies",
            serie: "Favorite show",
            assistindo: "Watching",
          },
          time: "Atlético Mineiro fan, cheering for <galo>Galo</galo> 🐓",
          hobbies: {
            mu: "Mu Online",
            tibia: "Tibia",
            basquete: "basketball",
            violao: "guitar",
          },
          passaporte: "Passport stamps",
          passaporte_total: "{{lugares}} destinations · {{continentes}} continents",
          continentes: {
            america_do_sul: "South America",
            europa: "Europe",
            asia: "Asia",
          },
          lugares: {
            brasil: "Brazil",
            argentina: "Argentina",
            uruguai: "Uruguay",
            alemanha: "Germany",
            franca: "France",
            italia: "Italy",
            vaticano: "Vatican City",
            suica: "Switzerland",
            japao: "Japan",
            coreia_do_sul: "South Korea",
            china: "China",
            hong_kong: "Hong Kong",
            macau: "Macau",
            tailandia: "Thailand",
            indonesia: "Indonesia",
            singapura: "Singapore",
            malasia: "Malaysia",
            dubai: "Dubai",
            abu_dhabi: "Abu Dhabi",
          },
        },
        veja_tambem: "see also",
      },
      boasvindas: {
        nome: "Professor",
        titulo: "Aramuni",
        subtitulo: "Prof. Dr. João Paulo Carneiro Aramuni",
        escudo_alt: "Clube Atlético Mineiro crest",
        bemvindo: "$ Welcome to my Portfolio",
        cargo1: "Software Engineering and Computer Science Professor at PUC Minas",
        consultoria: "Technology Consultant at",
        cargo2: "CTO at the Experimental Software Agency",
        orientacao: "Undergraduate Student Advisor",
        formacao1:
          "Doctor and Master in Information Systems and Knowledge Management",
        formacao2: "Bachelor of Computer Science",
        local: "Belo Horizonte, Minas Gerais, Brazil",
        esporte: "Atlético Mineiro Supporter",
        ajuda: "Type `help` to explore all available commands, or `ask` to ask me anything.",
      },
      contato: {
        titulo: "Get in Touch",
        subtitulo: "Feel free to connect or send me a message.",
        nome: "Your name",
        email: "Your email",
        mensagem: "Your message...",
        enviar: "Send",
        voltar_terminal: "Back to terminal",
        sucesso: "✅ Message sent successfully!",
        erro: "❌ Failed to send, please try again.",
        enviando: "⏳ Sending your message...",
        enviando_botao: "Sending...",
        captcha_pendente: "🤖 Please confirm you're not a robot.",
        captcha_comando: "$ verify --human",
        captcha_dica: "# confirm you're human to send",
        captcha_ok: "✔ human verified",
        captcha_indisponivel:
          "⚠️ The anti-spam check couldn't load. Please email me directly.",
      },
      guestbook: {
        titulo: "📖 Guestbook",
        subtitulo: "Share your message or read what other visitors have written.",
        hint: "Available commands:",
        listar: "list messages",
        adicionar: "add a message",
        ajuda: "show help",
        carregando: "Loading messages...",
        vazio: "No messages yet.",
        form_placeholder: "Add message form will appear here.",
        descricao: "open the guestbook",
        exemplo_list: "Command list example:",
        exemplo_add: "Command add example:",
        example_name: "John",
        example_message: "Hello from the terminal!",
        uso: "Usage:",
        nome_label: "Your name",
        mensagem_label: "Your message",
        enviando: "Sending your message...",
        sucesso: "Message sent successfully!",
        erro: "Error sending message.",
        voltar_terminal: "Back to terminal",
      },
      jogo: {
        voltar_terminal: "Back to terminal",
        pontuacao: "Score: ",
        gameover: "GAME OVER! Press R to restart",
        achievements: {
          phd: "🎓 PhD in Information Systems and Knowledge Management - FUMEC University (2017-2020)",
          masters:
            "🎓 Master's in Information Systems and Knowledge Management - FUMEC University (2014-2015)",
          bachelor:
            "🎓 Bachelor's in Computer Science - FUMEC University (2010-2013)",
          professorSoftware:
            "👨‍🏫 Software Engineering Professor - PUC Minas (Project Fundamentals, Algorithm Analysis, Labs, and Thesis II)",
          cto: "💻 CTO of the Experimental Software Agency - ICEI, PUC Minas (managing 6 teams, ~30 people)",
          techLead: "👨‍💻 Tech Lead & Back-end Lead - Trybe (2020-2023)",
          professorSoftwareXP:
            "👨‍🏫 Software Architecture Professor - XP Educação",
          professorNewtonPaiva:
            "👨‍🏫 Professor of Programming Languages, Web Architecture, and Databases - Newton Paiva University Center",
          professorPOOFUMEC:
            "👨‍🏫 Professor of OOP, Compilers, and FTC - FUMEC University (2016-2020)",
          professorDestaqueNewtonPaiva:
            "🏆 Outstanding Professor of Information Systems - Newton Paiva (2023)",
          patron: "🏆 Patron of the Computer Science Class 1SEM/2020 - FUMEC",
          teamAwardProsegur: "🏅 Best Teamwork Award - Prosegur (2015)",
          techSkills:
            "💻 Experience in AWS, Python, Java, C, C++, Spring Boot, DevOps, Cloud Architecture, and Observability",
          consultancy:
            "💼 Consulting in system architecture, monitoring, and AI for technical recruitment",
          devExperience:
            "🔧 Software development and maintenance for Capgemini, Prosegur, Banco do Brasil, HotMilhas, 123milhas, PMMG, and other institutions",
        },
      },
      habilidades: {
        titulo: "Skills",
        nenhuma: "No skills registered yet.",
        nivel: {
          avancado: "Advanced",
          intermediario: "Intermediate",
          basico: "Beginner",
        },
        verRepositorio: "View {{name}} repositories on GitHub",
        estilos: "Styles:",
        skins: { terminal: "terminal", cards: "cards", lista: "list", globo: "globe" },
        uso: "Usage: skills [--terminal | --cards | --list | --globe] (no option opens terminal)",
        carregandoGlobo: "Loading the globe...",
        globoDica: "Drag to spin · click a skill to learn more",
      },
      cal: {
        estilos: "Views:",
        skins: { mes: "month", semana: "week", hoje: "today" },
        uso: "Usage: cal [--month | --week | --today] (no option opens the month)",
        dias_curtos: ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"],
        dias_semana: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
        horario: "Time",
        semana_de: "Week of {{intervalo}}",
        legenda: { aula: "class day", feriado: "holiday", recesso: "break", hoje: "today" },
        info: {
          hoje: "today",
          proxima: "next",
          semestre: "semester",
          semana: "week",
          feriados: "days off",
          fuso: "timezone",
        },
        tipos: {
          feriado: "holiday",
          recesso: "school break",
          recesso_docente: "faculty break",
          ferias: "faculty vacation",
        },
        tipos_curtos: { recesso: "break", recesso_docente: "faculty break", ferias: "vacation" },
        colunas: {
          horario: "time",
          disciplina: "course",
          local: "location",
          quando: "when",
          turma: "class",
          codigo: "code",
        },
        turmas: "Classes and rooms",
        local: {
          predio: "Building {{numero}}",
          predio_curto: "B{{numero}}",
          andar: "floor {{numero}}",
          sala: "room {{numero}}",
          online: "Online ({{plataforma}})",
        },
        semestre_atual: "semester {{numero}} · week {{semana}} · ends {{fim}}",
        semestre_ferias: "on break · classes resume {{inicio}}",
        semestre_sem_calendario: "no PUC calendar for this year yet",
        n_aulas_one: "{{count}} class",
        n_aulas_other: "{{count}} classes",
        sem_aulas: "no classes",
        sem_aulas_hoje: "No classes today.",
        especial_hoje: "{{tipo}}: {{nome}}. No classes today.",
        fora_do_semestre: "Outside the academic semester. No classes today.",
        sem_feriados: "none this month",
        resumo_semana: "{{aulas}} classes, {{horas}} in the classroom",
        em: "in {{tempo}}",
        termina_em: "ends in {{tempo}}",
        proxima_em: "Next class in {{tempo}}:",
        nenhuma_proxima: "No classes in the coming weeks.",
        fuso: "Brasília time (UTC−3)",
        campi: { coreu: "Coreu", lourdes: "Lourdes", oficinas: "Workshops", teams: "Teams" },
        disciplinas: {
          diaw: "Web Application Development and Integration",
          diw: "Web Interface Development",
          ti5: "TI:V - Distributed Applications",
          ti2: "TI:II - Front-end",
          tcc2: "Capstone Project II advising",
          aes: "AES / CTOs meeting",
          spring: "Spring Boot workshop",
          devlabs: "DevLabs workshop",
          aeds1: "AEDS I review sessions",
          oficina_diw: "DIW workshop",
        },
        feriados: {
          confraternizacao: "World Day of Peace",
          carnaval: "Carnival",
          sexta_santa: "Good Friday",
          tiradentes: "Tiradentes Day",
          trabalho: "Labour Day",
          corpus_christi: "Corpus Christi",
          assuncao: "Assumption of Mary (BH)",
          independencia: "Independence Day",
          aparecida: "Our Lady of Aparecida",
          finados: "All Souls' Day",
          republica: "Republic Day",
          consciencia_negra: "Black Consciousness Day",
          imaculada: "Immaculate Conception (BH)",
          natal: "Christmas",
          cinzas: "Ash Wednesday",
          semana_santa: "Holy Week",
          dia_professor: "Teachers' and PUC Staff Day",
          ferias_docentes: "Faculty collective vacation",
          recesso_docente: "Faculty break",
        },
      },
      wakatime: {
        titulo: "Coding time",
        desde: "Since {{data}}",
        estilos: "Styles:",
        skins: { terminal: "terminal", grade: "grid", lista: "list", cards: "cards" },
        uso: "Usage: wakatime [--terminal | --grid | --list | --cards] (no option opens terminal)",
        status: {
          loading: "Fetching my stats from WakaTime",
          pending: "WakaTime is still crunching the numbers. Try again in a few moments.",
          error: "Couldn't reach WakaTime right now. The cards still work: wakatime --cards",
        },
        indicadores: {
          total: "Total",
          mediaDiaria: "Daily average",
          diasAtivos: "Active days",
          editorPrincipal: "Editor",
        },
        notas: {
          total_one: "in {{count}} language",
          total_other: "in {{count}} languages",
          mediaDiaria: "on days with code",
          diasAtivos: "out of {{total}} days",
          editorPrincipal: "{{percent}} of the time",
        },
        resumo: "<b>{{total}}</b> in total · <b>{{media}}</b> per day on average",
        secoes: {
          linguagens: "languages",
          editores: "editors",
          categorias: "categories",
          sistemas: "operating systems",
        },
        maisLinguagens_one: "+ {{count}} language",
        maisLinguagens_other: "+ {{count}} languages",
        maisOutros_one: "+ {{count}} more",
        maisOutros_other: "+ {{count}} more",
        nomes: {
          texto: "Text",
          outro: "Other",
          coding: "Coding",
          building: "Building",
          debugging: "Debugging",
          aiCoding: "AI coding",
          writingDocs: "Writing docs",
          writingTests: "Writing tests",
          runningTests: "Running tests",
          manualTesting: "Manual testing",
          codeReviewing: "Code reviewing",
          browsing: "Browsing",
          researching: "Researching",
          learning: "Learning",
          designing: "Designing",
          meeting: "Meetings",
          planning: "Planning",
          communicating: "Communicating",
        },
      },
      stats: {
        titulo: "GitHub Stats",
        estilos: "Charts:",
        skins: {
          resumo: "summary",
          linguagens: "languages",
          atividade: "activity",
          horarios: "hours",
          repos: "repos",
          tudo: "all",
        },
        uso: "Usage: stats [--summary | --languages | --activity | --hours | --repos | --all] (no option opens the summary)",
        secoes: {
          resumo: "summary",
          linguagens: "languages",
          atividade: "activity",
          horarios: "commit hours",
          repos: "repository views",
        },
        status: {
          loading: "Fetching from GitHub",
          limit: "GitHub's API rate limit was reached. Try again in a few minutes.",
          error: "Couldn't fetch this data right now.",
          curto: { limit: "API limit reached", error: "unavailable" },
        },
        progresso: "{{done}} of {{total}} repositories",
        dias_one: "{{valor}} day",
        dias_other: "{{valor}} days",
        diasUnidade_one: "day",
        diasUnidade_other: "days",
        perfil: { desde: "On GitHub since {{ano}}" },
        indicadores: {
          contribuicoes: "Contributions",
          commits: "Commits",
          pullRequests: "Pull requests",
          issues: "Issues",
          estrelas: "Stars",
          forks: "Forks",
          seguidores: "Followers",
          repositorios: "Repositories",
          sequenciaAtual: "Current streak",
          maiorSequencia: "Longest streak",
          melhorDia: "Best day",
          visitas: "Profile views",
        },
        notas: {
          desde: "since {{ano}}",
          ultimos12: "in the last 12 months",
          total: "all time",
          emRepos_one: "across {{count}} repository",
          emRepos_other: "across {{count}} repositories",
          seguindo: "following {{valor}}",
          publicos: "public",
          desdeData: "since {{data}}",
          semSequencia: "none in progress",
          visitas: "on the GitHub profile",
        },
        linguagens: {
          porRepos: "Main language of <b>{{total}}</b> of {{repos}} repositories",
          porBytes: "<b>{{total}}</b> of code across {{repos}} repositories",
          repos_one: "{{count}} repo",
          repos_other: "{{count}} repos",
          outras_one: "+ {{count}} more",
          outras_other: "+ {{count}} more",
        },
        atividade: {
          total: "Total contributions",
          hoje: "today",
          ateHoje: "so far",
          calendario: "<b>{{valor}}</b> contributions in the last 12 months",
          menos: "Less",
          mais: "More",
          celula_one: "{{valor}} contribution on {{data}}",
          celula_other: "{{valor}} contributions on {{data}}",
          celulaZero: "No contributions on {{data}}",
          melhorDoPeriodo: "Best day: {{texto}}",
          porAno: "Contributions per year",
          semAnos: "No contributions recorded yet.",
          porDia: "By day of the week",
          contribuicoes_one: "{{valor}} contribution",
          contribuicoes_other: "{{valor}} contributions",
        },
        horarios: {
          resumo: "Peak at <b>{{hora}}</b> · <b>{{percent}}</b> of commits happen {{quando}}",
          quando: {
            madrugada: "late at night",
            manha: "in the morning",
            tarde: "in the afternoon",
            noite: "in the evening",
          },
          periodos: {
            madrugada: "Late night",
            manha: "Morning",
            tarde: "Afternoon",
            noite: "Evening",
          },
          leitura: "{{faixa}} · {{percent}} · ≈ {{valor}} commits",
          legenda: "Share of commits in each hour of the day",
          nota: "Estimate from a sample of {{amostra}} out of {{total}} commits in the last 12 months · Brasília time",
          vazio: "No commits in the last 12 months.",
        },
        repos: {
          resumo: "<b>{{valor}}</b> views across {{count}} repositories",
          semLinguagem: "No language (course material)",
          nota: "RepoViews counters (views-counter), the same badge shown in each README.",
        },
      },
      turmas: {
        titulo: "Interdisciplinary Projects (TI) tracking",
        carregando: "Loading the TI groups...",
        pendentes_one: "{{count}} group has no data yet. The repositories are private and the site fetches nothing by itself: run npm run turmas in the project terminal (with GITHUB_TOKEN in .env.local or the GitHub CLI logged in) and reload the page. This notice only shows in npm run dev.",
        pendentes_other: "{{count}} groups have no data yet. The repositories are private and the site fetches nothing by itself: run npm run turmas in the project terminal (with GITHUB_TOKEN in .env.local or the GitHub CLI logged in) and reload the page. This notice only shows in npm run dev.",
        subtitulo: "The course project groups I advise, on GitHub · semester {{semestre}} of {{ano}} · week {{semana}} · data from {{data}}",
        filtro: "Filter: {{texto}}",
        estilos: "Charts:",
        skins: {
          resumo: "summary",
          codigo: "code",
          linguagens: "languages",
          ritmo: "pace",
          equilibrio: "balance",
          prs: "prs",
          projetos: "projects",
          tudo: "all",
        },
        uso: "Usage: turmas [ti2 | ti5] [lourdes | coreu] [g1 … | group name] [--summary | --code | --languages | --pace | --balance | --prs | --projects | --all]",
        secoes: {
          resumo: "summary",
          codigo: "lines of code",
          linguagens: "languages",
          ritmo: "commit pace",
          equilibrio: "team balance",
          prs: "pull requests and issues",
          projetos: "projects",
        },
        nenhum: "No group matches this filter.",
        grupos_one: "{{count}} group",
        grupos_other: "{{count}} groups",
        material: "course repository",
        outras: "Others",
        commits_one: "{{valor}} commit",
        commits_other: "{{valor}} commits",
        linhas_one: "{{valor}} line",
        linhas_other: "{{valor}} lines",
        semDados: {
          sem_acesso: "no access to the repository",
          vazio: "empty repository",
          pendente: "no data yet",
        },
        semDadosDica: "run npm run turmas with a token that can read the repository",
        aviso: "Data from {{data}}: the last update failed",
        quando: {
          hoje: "today",
          ontem: "yesterday",
          dias_one: "{{count}} day ago",
          dias_other: "{{count}} days ago",
          nunca: "no commits",
        },
        kpis: {
          grupos: "Groups with data",
          commits: "Commits",
          linhas: "Lines of code",
          prs: "Merged PRs",
          issues: "Closed issues",
          parados: "Idle {{dias}}+ days",
          integrantes: "Members committing",
          ultimo: "Last commit",
        },
        alertas: {
          parado: "no commits for {{dias}} days",
          semCommits: "no commits this semester",
          inativos_one: "{{count}} member without commits",
          inativos_other: "{{count}} members without commits",
          concentrado: "one member made {{fatia}} of the commits",
        },
        alertasCurtos: {
          parado: "idle {{dias}} days",
          semCommits: "no commits",
          inativos_one: "{{count}} without commits",
          inativos_other: "{{count}} without commits",
          concentrado: "1 member: {{fatia}}",
        },
        tabela: {
          legenda: "Groups and their GitHub metrics. The headers sort the table.",
          grupo: "Group",
          commits: "Commits",
          linhas: "Lines",
          prs: "PRs",
          issues: "Issues",
          ultimo: "Last commit",
          alertas: "Alerts",
          abertos_one: "+{{count}} open",
          abertos_other: "+{{count}} open",
          abertas_one: "+{{count}} open",
          abertas_other: "+{{count}} open",
          dica: "Click a column header to sort. PRs = merged; issues = closed.",
        },
        codigo: {
          resumo: "<b>{{linhas}}</b> lines of code in {{count}} groups",
          nota: "Non-blank lines on all branches: each file counts once, in its largest version. Dependencies, build output, generated code, Markdown and the docs/ folder are left out.",
        },
        linguagens: {
          resumo: "{{count}} languages across {{grupos}} groups, by lines of code",
          principal: "{{nome}} {{percent}}",
          nenhuma: "no code yet",
        },
        ritmo: {
          resumo: "<b>{{commits}}</b> commits since {{inicio}} · {{media}} per week on average",
          semana: "W{{n}}",
          leitura_one: "Week {{n}} ({{de}} to {{ate}}): {{valor}} commit",
          leitura_other: "Week {{n}} ({{de}} to {{ate}}): {{valor}} commits",
          emAndamento: "in progress",
          legenda: "Commits per week since the start of the semester",
          nota: "Commits from every branch, without merges, bots or professors. Idle = more than {{dias}} days without commits.",
        },
        equilibrio: {
          legenda: "Each part is one member, unnamed, from the one with the most commits to the one with the fewest (same order on both bars). The further the first part goes past the equal-share mark, the more the work is concentrated.",
          legendaMaior: "member with the most commits",
          legendaDemais: "other members",
          igual: "equal share",
          fantasma: "member without commits (README list)",
          integrante: "Member {{n}}",
          commits: "commits",
          linhas: "lines",
          ativos: "{{ativos}} of {{total}} committing",
          ativosSemTotal_one: "{{count}} committing",
          ativosSemTotal_other: "{{count}} committing",
          maior: "largest share: {{fatia}}",
          nota: "Students only: professors, advisors and bots are left out. Authors merged by login, e-mail and name. Lines = lines of code added. Alert from {{fatia}} of the commits on.",
        },
        prs: {
          resumo: "<b>{{mergeados}}</b> merged PRs, {{abertos}} open · <b>{{fechadas}}</b> closed issues, {{abertas}} open",
          prs: "Pull requests",
          issues: "Issues",
          mergeados: "merged",
          abertos: "open",
          fechados: "closed without merge",
          fechadas: "closed",
          abertas: "open",
          legendaConcluido: "merged / closed",
          legendaAberto: "open",
          semApi: "no GitHub API data",
          semApiTodos: "No pull request data yet: run npm run turmas again when the GitHub API limit resets.",
          nota: "Same scale for every group in the course. PRs and issues opened by bots (Dependabot) or by professors are left out.",
        },
        projetos: {
          semDescricao: "README without a description.",
          integrantes_one: "{{count}} member",
          integrantes_other: "{{count}} members",
          docs: "{{valor}} lines of docs",
          branches_one: "{{count}} branch",
          branches_other: "{{count}} branches",
          repositorio: "repository",
          deploy: "deploy",
        },
      },
      canvas: {
        titulo: "Canvas assignments",
        carregando: "Loading the Canvas assignments...",
        uso: "Usage: canvas [diw | ti5 …] [es | cc] [coreu | lourdes] [g1 …] [--summary | --tasks | --agenda | --all]",
        subtitulo: "My courses on Canvas · semester {{semestre}} of {{ano}} · submissions as of {{data}}, {{hora}}",
        semDados: "No Canvas data yet.",
        semDadosDev: "The site never talks to Canvas: run npm run canvas in the project terminal (with CANVAS_TOKEN in .env.local) and reload the page. This notice only shows in npm run dev.",
        filtro: "Filter: {{texto}}",
        nenhum: "No course matches this filter.",
        estilos: "Sections:",
        skins: {
          resumo: "summary",
          tarefas: "tasks",
          agenda: "agenda",
          tudo: "all",
        },
        secoes: {
          resumo: "Summary",
          tarefas: "Assignments",
          agenda: "Agenda",
        },
        kpis: {
          disciplinas: "Courses",
          alunos: "Students",
          abertas: "Upcoming",
          semana: "Due in {{dias}} days",
          aCorrigir: "To grade",
          taxa: "Avg. submitted",
        },
        kpiDicas: {
          alunos: "Active students (without a filter, someone in two courses counts once)",
          abertas: "Assignments with a due date still ahead",
          aCorrigir: "Submissions waiting to be graded",
          taxa: "Students who submitted the assignments already past due (excused students don't count)",
        },
        proxima: {
          titulo: "Next due",
          nenhuma: "No assignment with an upcoming due date.",
          quando: "{{data}}, at {{hora}}",
          mesmoDia_one: "+ {{count}} more assignment due the same day",
          mesmoDia_other: "+ {{count}} more assignments due the same day",
        },
        urgencia: {
          urgente: "due in less than 24 h",
        },
        tempo: {
          dias_one: "{{count}} day",
          dias_other: "{{count}} days",
          diasHoras: "{{dias}} {{horas}} h",
          horasMinutos: "{{horas}} h {{minutos}} min",
          minutos_one: "{{count}} min",
          minutos_other: "{{count}} min",
          em: "in {{tempo}}",
          venceu: "due {{tempo}} ago",
          unidades: {
            dias_one: "day",
            dias_other: "days",
            horas: "hours",
            minutos: "min",
            segundos: "sec",
          },
        },
        dia: {
          hoje: "today",
          amanha: "tomorrow",
          ontem: "yesterday",
          emDias_one: "in {{count}} day",
          emDias_other: "in {{count}} days",
        },
        entregas: {
          aberta: "<b>{{entregues}}</b> of {{esperados}} already submitted",
          vencida: "<b>{{entregues}}</b> of {{esperados}} submitted ({{pct}})",
          atrasadas_one: "{{count}} late",
          atrasadas_other: "{{count}} late",
          faltando_one: "{{count}} missing",
          faltando_other: "{{count}} missing",
          dispensados_one: "{{count}} excused",
          dispensados_other: "{{count}} excused",
          aCorrigir_one: "{{count}} to grade",
          aCorrigir_other: "{{count}} to grade",
          semAlunos: "no active students",
          semDados: "no submission data",
          papel: "handed in person (outside Canvas)",
          sem_entrega: "no submission",
          legenda: {
            noPrazo: "on time",
            atrasadas: "late",
            faltando: "missing",
            pendentes: "not submitted yet",
            dispensados: "excused",
          },
        },
        tipos: {
          grupo: "group",
          quiz: "quiz",
          discussao: "discussion",
          externa: "external tool",
          papel: "in person",
          sem_entrega: "no submission",
          porTurma: "one section's due date",
        },
        datas: {
          prazosPorTurma: "due dates per section: {{datas}}",
          abre: "opens {{data}} at {{hora}}",
          fecha: "accepts late work until {{data}} at {{hora}}",
        },
        semana: {
          titulo: "next {{dias}} days",
          nenhuma: "Nothing due in the next {{dias}} days.",
        },
        tabela: {
          titulo: "courses",
          legenda: "Canvas courses with their degree program, students, assignments, next due date, submissions and work to grade.",
          disciplina: "Course",
          curso: "Program",
          alunos: "Students",
          tarefas: "Tasks",
          proxima: "Next due",
          taxa: "Submitted",
          aCorrigir: "To grade",
          vencidas: "{{vencidas}}/{{total}}",
          dica: "Click a column header to sort. Tasks = past due / total. Submitted = students who submitted the assignments already past due.",
        },
        tarefas: {
          resumo: "<b>{{abertas}}</b> upcoming · {{vencidas}} past due · {{semPrazo}} without a due date",
          abertas: "upcoming",
          vencidas: "past due",
          semPrazo: "no due date",
          mostrarTodas_one: "show {{count}} older",
          mostrarTodas_other: "show {{count}} older",
          mostrarMenos: "show less",
          nota: "Submissions from each course's active students, updated on {{data}} at {{hora}}. Excused students don't count in the total.",
        },
        agenda: {
          resumo: "<b>{{tarefas}}</b> due dates and <b>{{eventos}}</b> events until {{ate}}",
          vazio: "Nothing on the agenda until {{ate}}.",
          diaTodo: "all day",
          tarefa: "due date",
          evento: "event",
          ateFim: "show until the end of the semester ({{data}})",
          proximos: "show only the next {{dias}} days",
          nota: "Assignments and events from the courses' Canvas calendars, plus the holidays and breaks from the PUC calendar.",
        },
        cursos: {
          ES: "Software Engineering",
          CC: "Computer Science",
        },
      },
      calendly: {
        titulo: "Book a meeting via Calendly",
        carregando: "Loading the calendar...",
      },
      curriculo: {
        titulo: "Resume",
        paginas_one: "{{count}} page",
        paginas_other: "{{count}} pages",
        zoom: "Zoom",
        zoom_menos: "Zoom out",
        zoom_mais: "Zoom in",
        zoom_ajustar: "Fit to width",
        baixar: "Download PDF",
        abrir: "Open in new tab",
        arquivo: "Resume-Joao-Paulo-Aramuni.pdf",
        carregando: "Loading the PDF...",
        erro: "Couldn't display the PDF here. Download it or open it in a new tab using the buttons above.",
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
      ask: {
        comando: "ask",
        nome: "João Paulo",
        selo: "AI",
        selo_title: "Answer generated by AI, in my voice, based on my resume and this portfolio",
        ola: "Hi! I'm João Paulo. Ask me anything about my career, my classes, my projects or about me outside the terminal, and I'll answer right here.",
        experimente: "Try one (click to type it in the terminal):",
        sugestoes: [
          "who are you?",
          "what courses do you teach?",
          "what is the Experimental Software Agency?",
          "what did you do at Trybe?",
          "how many theses have you advised?",
          "what do you do outside of work?",
        ],
        aviso:
          "Answers are generated by AI (Google Gemini) from my resume and this portfolio, and may contain mistakes. I remember the last questions of this conversation: ask --new starts another one.",
        preencher: "Click to type it in the terminal",
        digitando: "João Paulo is typing...",
        nova: "New conversation: I forgot the previous questions. Go ahead!",
        erros: {
          pergunta_vazia: "Type your question after ask, e.g. ask who are you?",
          pergunta_longa: "Question too long: up to {{max}} characters.",
          limite: "Easy there, too many questions in a row!",
          espera_one: "Try again in {{count}} second.",
          espera_other: "Try again in {{count}} seconds.",
          espera_depois: "You've reached today's question limit: come back later.",
          limite_ia:
            "Lots of people asking right now and the AI's free quota ran out for the moment. Try again soon, or reach me through contact.",
          sem_chave: "ask isn't configured on this server yet (GEMINI_API_KEY is missing).",
          indisponivel: "ask isn't available in this version of the site.",
          rede: "I couldn't reach the server. Check your connection and try again.",
          tempo: "The AI took too long to answer. Try again.",
          vazia: "I'm at a loss for words... Try asking another way.",
          falha_ia: "I couldn't answer right now. Try again in a moment.",
        },
      },
      ajuda: {
        titulo: "Available commands:",
        sobre: { desc: "Shows who I am: career, courses, numbers and a bit of me outside the terminal." },
        ajuda: { desc: "Displays this list of available commands." },
        experiencias: {
          desc: "Shows my professional trajectory and experiences.",
        },
        contato: {
          desc: "Displays my contact information and sends an email.",
        },
        limpar: { desc: "Clears the terminal history." },
        tema: { desc: "Switches the theme in the order dark → light → galo (theme --dark | theme --light | theme --galo)." },
        recomendacoes: { desc: "Shows my LinkedIn recommendations." },
        github: { desc: "Displays my repositories using the GitHub API." },
        premios: { desc: "Shows awards and recognitions." },
        projetos: { desc: "Displays my developed projects." },
        calendly: { desc: "Schedule a meeting with me via Calendly." },
        cal: { desc: "Shows my class schedule, cal style (cal --week | --today)." },
        habilidades: { desc: "Show my programming skills (skills --cards | --list | --globe changes the style)." },
        spotify: { desc: "Shows what I'm listening to and recent plays." },
        wakatime: {
          desc: "Shows my coding time (wakatime --grid | --list | --cards).",
        },
        stats: {
          desc: "Shows my GitHub stats (stats --repos | --all changes the chart).",
        },
        neofetch: { desc: "Shows system info with the Galo crest, neofetch style." },
        jogos: { desc: "Galo's upcoming matches: countdown and competition (jogos --all | --table)." },
        curriculo: {
          desc: "Displays my resume with PDF preview.",
        },
        lattes: {
          desc: "Shows my Lattes CV: teaching, theses, projects and committees (lattes --pdf downloads it).",
        },
        turmas: {
          desc: "TI class tracking on GitHub (turmas ti5 --pace | --all).",
        },
        canvas: {
          desc: "Canvas assignments: what's due next (canvas --tasks | --agenda).",
        },
        aragame: { desc: "Play Flappy Plane directly in the web terminal." },
        guestbook: { desc: "Leave a message in my public guestbook." },
        design: { desc: "Shows the portfolio design system: fonts, colors, spacing and brand." },
        pergunta: { desc: "An AI answers anything about me (e.g. ask who are you?)." },
        dicas: {
          titulo: "Tips:",
          historico: "↑ / ↓ browse the commands you already typed",
          autocomplete: "Tab completes commands; Tab twice lists the options.",
        },
      },
      lattes: {
        titulo: "Lattes CV",
        carregando: "Loading Lattes CV...",
        atualizado: "updated on {{data}}",
        estilos: "Sections:",
        skins: {
          resumo: "summary",
          docencia: "teaching",
          tccs: "theses",
          interdisciplinares: "interdisciplinary",
          aes: "aes",
          bancas: "committees",
          tudo: "all",
          pdf: "pdf",
        },
        uso: "Usage: lattes [--summary | --teaching | --theses | --interdisciplinary | --aes | --committees | --all | --pdf] (no option opens the summary)",
        secoes: {
          resumo: "summary",
          docencia: "teaching",
          tccs: "supervised theses",
          interdisciplinares: "supervised interdisciplinary projects",
          aes: "Experimental Software Agency projects",
          bancas: "examination committees",
        },
        tipos: {
          tccs: "Supervised theses",
          interdisciplinares: "Interdisciplinary projects",
          aes: "AES projects",
          bancas: "Examination committees",
        },
        legenda: {
          tccs: "Theses",
          interdisciplinares: "Interdisciplinary",
          aes: "AES",
          bancas: "Committees",
        },
        legenda_curta: { tccs: "Theses", interdisciplinares: "Interd.", aes: "AES", bancas: "Comm." },
        kpi: {
          periodo: "from {{inicio}} to {{fim}}",
          disciplinas_one: "{{count}} course",
          disciplinas_other: "{{count}} courses",
          cursos_one: "{{count}} program",
          cursos_other: "{{count}} programs",
          alunos_one: "{{count}} student",
          alunos_other: "{{count}} students",
          parcerias_one: "{{count}} with a partner",
          parcerias_other: "{{count}} with partners",
        },
        total_one: "work supervised or examined since {{inicio}}",
        total_other: "works supervised or examined since {{inicio}}",
        niveis: {
          graduacao: "Undergraduate",
          especializacao: "Specialization",
          mestrado: "Master's",
          qualificacao: "Qualifying exam",
          doutorado: "PhD",
        },
        niveis_contagem: {
          graduacao_one: "{{count}} undergraduate",
          graduacao_other: "{{count}} undergraduate",
          especializacao_one: "{{count}} specialization",
          especializacao_other: "{{count}} specialization",
          mestrado_one: "{{count}} master's",
          mestrado_other: "{{count}} master's",
          qualificacao_one: "{{count}} qualifying exam",
          qualificacao_other: "{{count}} qualifying exams",
          doutorado_one: "{{count}} PhD",
          doutorado_other: "{{count}} PhD",
        },
        por_ano: "per year",
        por_instituicao: "per institution",
        por_curso: "per program",
        grafico: {
          parte: "{{valor}} {{tipo}}",
          nada: "none",
        },
        tabela: {
          instituicao: "Institution",
          curso: "Program",
          disciplinas: "Courses taught",
          disciplinas_curta: "Crs.",
          total: "Total",
        },
        sem_instituicao: "Not specified",
        sem_curso: "Not specified",
        nota_aes_curso: "AES projects bring together students from several programs, so they aren't counted in this table.",
        nota_disciplinas_total: "Courses taught come from {{cmd}} and stay out of the total, which only adds up the supervised or examined works.",
        nota_disciplinas_curso: "A course offered to more than one program (like the ones at Newton Paiva) counts in each of them.",
        tecnologias: {
          titulo: "technologies in the projects",
          intro_one: "Most used languages and frameworks in {{count}} project (interdisciplinary and AES).",
          intro_other: "Most used languages and frameworks across {{count}} projects (interdisciplinary and AES).",
          item_one: "{{tech}}: {{count}} project",
          item_other: "{{tech}}: {{count}} projects",
        },
        ver_projeto: "Open project",
        cursos: {
          ciencia_da_computacao: "Computer Science",
          engenharia_de_software: "Software Engineering",
          sistemas_de_informacao: "Information Systems",
          sistemas_de_informacao_e_gestao_do_conhecimento:
            "Master's in Information Systems and Knowledge Management",
          fisioterapia: "Physical Therapy",
          analise_e_desenvolvimento_de_sistemas: "Systems Analysis and Development",
          redes_de_computadores: "Computer Networks",
          arquitetura_de_software: "Software Architecture",
          desenvolvimento_web: "Web Development",
        },
        disciplinas: {
          aplicacoes_web: "Web Applications",
          front_end: "Front-end",
          aplicacoes_para_cenarios_reais: "Real-World Applications",
          aplicacoes_distribuidas: "Distributed Applications",
        },
        tccs: {
          intro_one: "{{count}} undergraduate thesis supervised, from {{inicio}} to {{fim}}.",
          intro_other: "{{count}} undergraduate theses supervised, from {{inicio}} to {{fim}}.",
          qtd_one: "{{count}} thesis",
          qtd_other: "{{count}} theses",
        },
        interdisciplinares: {
          intro_one: "{{count}} project supervised in the Interdisciplinary Project courses.",
          intro_other: "{{count}} projects supervised in the Interdisciplinary Project courses.",
          disciplina: "Interdisciplinary Project {{numero}}: {{nome}}",
          qtd_one: "{{count}} project",
          qtd_other: "{{count}} projects",
          detalhes_zero: "Details",
          detalhes_one: "Details and team ({{count}})",
          detalhes_other: "Details and team ({{count}})",
        },
        aes: {
          intro_one: "{{count}} project from PUC Minas' Experimental Software Agency (AES), where I'm the CTO.",
          intro_other: "{{count}} projects from PUC Minas' Experimental Software Agency (AES), where I'm the CTO.",
          qtd_one: "{{count}} project",
          qtd_other: "{{count}} projects",
          parceiro: "Partner: {{nome}}",
        },
        bancas: {
          intro_one: "{{count}} final project examination committee.",
          intro_other: "{{count}} final project examination committees.",
          qtd_one: "{{count}} committee",
          qtd_other: "{{count}} committees",
          membros: "Committee: {{nomes}}",
        },
        docencia: {
          total: "teaching since {{inicio}}: {{disciplinas}}, {{cursos}} and {{instituicoes}}.",
          // Teaching card in lattes --summary
          resumo: {
            titulo: "Teaching",
            lecionando: "teaching since {{inicio}}",
            disciplinas_one: "course taught",
            disciplinas_other: "courses taught",
            cursos_one: "program",
            cursos_other: "programs",
            instituicoes_one: "educational institution",
            instituicoes_other: "educational institutions",
            barra: "Courses taught per institution",
          },
          qtd_instituicoes_one: "{{count}} institution",
          qtd_instituicoes_other: "{{count}} institutions",
          linha_do_tempo: "timeline",
          por_instituicao: "time per institution",
          por_curso: "time per program",
          por_disciplina: "time per course",
          disciplinas_por_instituicao: "courses per institution",
          nota_linha_do_tempo: "Filled bars are teaching periods; hollow ones, coordination and leadership roles. Hover to see the dates.",
          lecionando: "{{tempo}} teaching",
          no_total: "{{total}} in total ({{lecionando}})",
          educacao_antes: "Adding the coordination and leadership roles at Trybe, that's",
          educacao_depois: "in education.",
          legenda: { aula: "teaching", cargo: "coordination and leadership" },
          cargos_titulo: "Roles at {{instituicao}}",
          nota_cargos: "After the 8 months teaching, I moved to coordination and leadership roles, no longer teaching the module.",
          cargos: {
            cs_specialist_instructor: "Computer Science Specialist Instructor",
            backend_cs_lead_instructor: "Back-End & Computer Science Lead Instructor",
            cs_lead_instructor: "Computer Science Lead Instructor",
            cs_curriculum_lead_tech_lead: "Computer Science Curriculum Lead & Tech Lead",
            cs_curriculum_tech_lead: "Computer Science Curriculum Tech Lead",
          },
          nota_uniao: "Time per program counts each semester once, even with several courses at the same time.",
          notas: {
            trybe: "At Trybe, Computer Science with Python was a 2-month module of the Web Development course, taught to cohorts 1, 2, 3 and 4 (8 months in total). I also took part in the school's pilot cohort, helping to build the course.",
          },
          ver_repositorio: "Open the {{nome}} repository",
          modalidades: {
            ead: "{{curso}} (online)",
            bootcamp: "{{curso}} (Bootcamp)",
            curso_livre: "{{curso}} (non-degree course)",
          },
          modulo: "{{nome}} module",
          modulos: { ciencia_da_computacao_com_python: "Computer Science with Python" },
          tabela: {
            disciplina: "Course",
            curso: "Program",
            semestres: "No. of Semesters",
            turmas: "No. of Cohorts",
            cargo: "Role",
            atividade: "Activity",
            tempo: "Time",
            periodo: "Period",
          },
          tempo: {
            meses_one: "{{count}} month",
            meses_other: "{{count}} months",
            anos_one: "{{count}} year",
            anos_other: "{{count}} years",
            meio_one: "{{valor}} years",
            meio_other: "{{valor}} years",
            composto: "{{anos}} and {{meses}}",
          },
          observacoes: {
            newton: "Now Newton Paiva Wyden",
            igti: "Now Faculdade XP Educação",
            trybe: "Coding school - non-degree course",
          },
          disciplinas: {
            desenvolvimento_de_interfaces_web: "Web Interface Development",
            ti_front_end: "Interdisciplinary Project II: Front-End",
            laboratorio_de_iniciacao_a_programacao: "Introductory Programming Lab",
            trabalho_de_conclusao_de_curso: "Undergraduate Thesis",
            projeto_de_software: "Software Design",
            laboratorio_de_desenvolvimento_de_software: "Software Development Lab",
            laboratorio_de_experimentacao_de_software: "Software Experimentation Lab",
            ti_aplicacoes_para_cenarios_reais: "Interdisciplinary Project III: Real-World Applications",
            ti_aplicacoes_distribuidas: "Interdisciplinary Project V: Distributed Applications",
            fundamentos_de_projeto_e_analise_de_algoritmos: "Algorithm Design and Analysis",
            ti_aplicacoes_web: "Interdisciplinary Project I: Web Applications",
            desenvolvimento_e_integracao_de_aplicacoes_web: "Web Application Development and Integration",
            algoritmos_e_estruturas_de_dados_i: "Algorithms and Data Structures I",
            linguagens_de_programacao: "Programming Languages",
            arquitetura_de_aplicacoes_web: "Web Application Architecture",
            banco_de_dados: "Databases",
            engenharia_de_requisitos: "Requirements Engineering",
            estruturas_de_dados_com_python: "Data Structures with Python",
            algoritmos_com_python: "Algorithms with Python",
            raspagem_de_dados_com_python: "Web Scraping with Python",
            fundamentos_teoricos_da_computacao: "Theory of Computation",
            compiladores_com_cpp: "Compilers with C++",
            poo_com_java: "Object-Oriented Programming with Java",
            desenvolvimento_de_scripts_ii: "Scripting II with Shell Script",
            desenvolvimento_de_scripts_i: "Scripting I with VBScript",
            engenharia_de_software_ii: "Software Engineering II",
            introducao_a_programacao_web: "Introduction to Web Programming",
          },
        },
        pdf: {
          paginas_one: "{{count}} page",
          paginas_other: "{{count}} pages",
          descricao: "Full version of my CV, exported from the Lattes Platform (CNPq).",
          baixar: "Download PDF",
          abrir: "Open in new tab",
          lattes: "View on Lattes",
          indisponivel: "The Lattes PDF hasn't been published yet.",
        },
        nota_idioma: "Titles and descriptions are shown as registered on Lattes, in Portuguese.",
      },
      design: {
        titulo: "Design System",
        intro: "The portfolio fonts, colors, spacing and brand in one place. Colors are read from theme.css while the page runs: if a token changes there, it changes here too.",
        nav: "Design system sections",
        atual: "current",
        principal: "main",
        rodape: "Color source: src/theme/theme.css · Type `theme` to switch the terminal theme.",
        temas: { dark: "dark", light: "light", galo: "galo" },
        secoes: {
          marca: {
            titulo: "Brand",
            intro: "Logo, welcome screen banner and the terminal window, which is the site's visual identity.",
          },
          cores: {
            titulo: "Colors",
            intro: "Dark is the default theme and light overrides the same tokens. Components only use var(--token), never the raw color. The exception is brand colors (languages in skills, WakaTime and stats): they come from the data files and get darker on their own in the light theme.",
          },
          tipografia: {
            titulo: "Typography",
            intro: "Everything in a monospaced font, like a real terminal.",
          },
          espacamento: {
            titulo: "Spacing",
            intro: "The padding, margin and gap values most used by the components, in rem (1rem = 16px). They are not tokens in theme.css yet.",
          },
          raios: {
            titulo: "Radii",
            intro: "Corner radii used by the components and where each one appears.",
          },
          breakpoints: {
            titulo: "Breakpoints",
            intro: "Widths where the layout adapts (max-width). 768px and 480px apply to almost every component.",
          },
        },
        marca: {
          logo: "Logo",
          logo_alt: "Aramuni logo: a laptop with a graduation cap and the name Aramuni",
          logo_fundo: "black background, no transparency",
          logo_uso: "Used as the favicon (index.html).",
          banner: "ASCII banner",
          banner_uso: "Opens the welcome screen. Made of block characters and shrinks with the screen.",
          janela: "Terminal window",
          janela_nota: "The window buttons ({{cores}}) come from react-terminal-ui. The title and the prompt use --terminal-chrome; the cursor uses --cursor.",
        },
        cores: {
          escala: "Color scale",
          escala_intro: "Every solid color from both themes, grouped by family and sorted from darkest to lightest. Hover a color to see the tokens that use it.",
          tokens: "Tokens",
          tokens_intro: "Each token in both themes, side by side. For text, icons and chart marks, the badge shows the contrast against the terminal background: text needs 4.5:1 (AA); icons and chart marks (bars and lanes) need 3:1.",
          contraste_titulo: "Contrast against {{fundo}} in the same theme",
        },
        contraste: {
          aaa: "AAA",
          aa: "AA",
          grande: "large text only",
          baixo: "low",
          ok: "ok for icons",
          grafico: "ok for charts",
        },
        familias: {
          neutros: "Neutrals",
          verdes: "Greens",
          amarelos: "Yellows and oranges",
          vermelhos: "Reds and pinks",
          azuis: "Blues",
          outros: "Purples and others",
        },
        colunas: { token: "Token", uso: "Usage" },
        grupos: {
          fundos: "Backgrounds and surfaces",
          bordas: "Borders",
          texto: "Text",
          destaque: "Accent (brand green)",
          tags: "Tags",
          semanticas: "Semantic colors",
          icones: "Welcome screen icons",
          calendario: "Calendar (cal)",
          lattes: "Lattes: work types",
          docencia: "Lattes: institutions (teaching)",
          turmas: "TI classes (turmas)",
          canvas: "Canvas assignments (canvas)",
          scrollbar: "Scrollbar",
          efeitos: "Effects",
        },
        tokens: {
          "bg-page": "Page background and scrollbar track.",
          "bg-terminal": "Terminal background (same as react-terminal-ui).",
          surface: "Experience, project, skill, WakaTime, stats and lattes cards, chart tooltips and these examples.",
          "surface-input": "Inputs and textarea (contact, guestbook).",
          track: "Background of the skill, WakaTime and stats bars and rings.",
          border: "Default border for cards and dividers.",
          "border-input": "Border for inputs and code blocks.",
          text: "Main text.",
          "text-soft": "Supporting text with high contrast.",
          "text-muted": "Descriptions, captions and metadata.",
          "text-dim": "Boot timestamps and low-priority text.",
          "terminal-chrome": "Window title and prompt.",
          cursor: "Blinking terminal cursor.",
          accent: "Brand color: titles, links and highlighted borders.",
          "accent-hover": "Hover for green buttons and links.",
          "accent-focus": "Input focus border (contact).",
          "link-hover": "Link hover.",
          "on-accent": "Text on green buttons (contrast against --accent).",
          "tag-bg": "Technology tag background.",
          "tag-text": "Tag text (contrast against --tag-bg).",
          highlight: "Yellow highlight, as in “$ Welcome to my Portfolio”, and times in the cal grid.",
          warn: "[ WARN ] in the boot sequence, WakaTime and stats errors, and holidays in cal.",
          info: "[ INFO ] in the boot sequence, and breaks and grid headers in cal.",
          success: "Success messages (guestbook).",
          "icon-school": "Education icon (PUC Minas).",
          "icon-work": "Work icon (Experimental Software Agency) and the contribution streak ring and flame (stats).",
          "icon-book": "Advising icon (thesis).",
          "icon-location": "Location icon.",
          "icon-mail-gmail": "Personal email (Gmail).",
          "icon-mail-puc": "PUC Minas email.",
          "icon-github": "GitHub icon.",
          "scrollbar-thumb": "Scrollbar thumb.",
          "scrollbar-thumb-hover": "Scrollbar thumb on hover.",
          "shadow-project-hover": "Project card shadow on hover.",
          "shadow-xp-hover": "Experience card shadow on hover.",
          scanline: "CRT monitor lines in the boot sequence.",
          "game-sky": "Flappy Plane sky.",
          "cal-coreu": "Classes at the Coração Eucarístico campus (cal).",
          "cal-lourdes": "Classes at the Lourdes campus (cal).",
          "cal-oficinas": "Workshops (cal).",
          "cal-teams": "Online meetings on Teams (cal).",
          "cal-tinta": "Background intensity of the classes in the cal --week grid: the campus color at this percentage (lower in light mode to keep the text contrast).",
          "lattes-tccs": "Supervised theses: chart per year, summary card and side mark of the lists (lattes).",
          "lattes-interdisciplinares": "Interdisciplinary projects (lattes).",
          "lattes-aes": "Experimental Software Agency projects (lattes).",
          "lattes-bancas": "Examination committees (lattes).",
          "docencia-puc": "PUC Minas in the timeline, bars and tables of lattes --teaching and in the teaching card of the summary.",
          "docencia-newton": "Newton Paiva (lattes --teaching).",
          "docencia-igti": "IGTI (lattes --teaching).",
          "docencia-trybe": "Trybe (lattes --teaching).",
          "docencia-fumec": "Universidade FUMEC (lattes --teaching).",
          "turmas-concluido": "Merged PRs and closed issues (turmas --prs).",
          "turmas-aberto": "Open PRs and issues (turmas --prs).",
          "turmas-ling-1": "Language with the most lines of code in the course (turmas --code and --languages). The 6 colors follow each course's ranking, without filters, so a filter never repaints a language.",
          "turmas-ling-2": "2nd language of the course (turmas).",
          "turmas-ling-3": "3rd language of the course (turmas).",
          "turmas-ling-4": "4th language of the course (turmas).",
          "turmas-ling-5": "5th language of the course (turmas).",
          "turmas-ling-6": "6th language of the course (turmas). The rest is grouped as \"Others\", in --text-dim.",
          "canvas-entregue": "On-time submissions in each assignment's bar (canvas).",
          "canvas-atrasada": "Late submissions (canvas).",
          "canvas-faltando": "Students who missed an assignment already past due (canvas). Before the due date, those who haven't submitted are hollow, in a neutral color.",
          "canvas-urgente": "Due in less than 24 hours (canvas): the countdown pill, the date chip and the next-due card, always with an icon.",
        },
        tipografia: {
          fira: {
            papel: "Main font",
            desc: "Used across the whole terminal. It has ligatures: => and != become a single symbol.",
          },
          jetbrains: {
            papel: "Fallback",
            desc: "Kicks in if Fira Code does not load. Same style, no network needed: both live in src/assets/fonts.",
          },
          pilha: "Terminal font stack",
          braille: "Neofetch stack (braille)",
          braille_desc: "Fira Code and JetBrains Mono have no braille characters, so the neofetch crest uses system fonts that do.",
          regras: {
            monoespacada: "Everything is monospaced: the portfolio is a terminal.",
            peso: "Only weight 400 is loaded. Bold (font-weight: bold) is synthesized by the browser.",
            base: "The terminal base size is 1rem, dropping to 0.9rem up to 768px and 0.85rem up to 480px.",
            input: "The terminal input is 16px, the minimum that stops iOS from zooming while typing.",
          },
          escala: "Type scale",
          tamanhos: {
            titulo_secao: {
              exemplo: "Skills",
              uso: "Section titles: skills, WakaTime, awards, contact, guestbook and the name in about.",
            },
            titulo_card: {
              exemplo: "Portfolio Terminal",
              uso: "Card titles: projects and experiences.",
            },
            destaque: {
              exemplo: "$ Welcome to my Portfolio",
              uso: "Highlights and icons: welcome screen, help aliases.",
            },
            corpo: {
              exemplo: "Software Engineering Professor at PUC Minas",
              uso: "Body text (terminal base size).",
            },
            dica: {
              exemplo: "Type `guestbook add` to leave your message.",
              uso: "Hints and short descriptions.",
            },
            tag: {
              exemplo: "React · Vite · Supabase",
              uso: "Technology tags.",
            },
          },
        },
        raios: {
          r0: "Guestbook input.",
          r2: "Contribution chart cells (stats), terminal-style bar segments (skills and WakaTime), today in cal, legend squares (lattes and about), turmas bars and slices, and the passport flags (about).",
          r3: "Course code in the cal grid.",
          r4: "Focus outline of the theme button and the rounded end of chart bars (stats, lattes and turmas).",
          r6: "Terminal-style rows (skills and WakaTime), company logos, about tags and passport stamps, color samples and chart tooltips (lattes and turmas).",
          r8: "Buttons, inputs, the experience card and the logos on the about cards.",
          r10: "Section containers: skills, WakaTime, stats, lattes, about, contact, resume, calendly, turmas and this one; stats, lattes and about cards and the turmas project cards.",
          r12: "Project card, WakaTime and turmas stat tiles and the logo tiles in the skill and WakaTime lists.",
          r14: "Cards with a progress ring (skills and WakaTime).",
          r20: "Scrollbar thumb.",
          pill: "Technology tags (lattes too), badges, the about header chips and progress bars (pill). In the CSS it shows up as 999px or 9999px.",
          circle: "Avatars, timeline markers and spinners.",
        },
        breakpoints: {
          bp1280: "Skills, WakaTime, stats, lattes and about: the frame grows from 50% to 70% of the width (turmas: from 60% to 75%).",
          bp900: "Project, award, recommendation and about cards stack the image above the text. Skills and WakaTime take the full width and, in the terminal style, the bar drops to the line below. The stats, lattes, about and turmas frames also take the full width, and turmas --balance moves each group name above its bars.",
          bp768: "Tablet and phone: base size drops to 0.9rem and components rearrange.",
          bp600: "Phone layout in the newer commands: cal splits each agenda row in two lines, stats hides the repository details and lattes compacts charts and tables (in --teaching, the course name moves above its bar) about puts the numbers and the two timelines in a single column and turmas moves each group name above its chart.",
          bp500: "Flappy Plane: smaller score and texts.",
          bp480: "Small phone: base size 0.85rem and tighter spacing. Skill, WakaTime and stats cards in 2 columns.",
        },
      },
      projetos: {
        titulo: "My Main Projects",
        carregando: "Loading projects...",
        nenhum: "No projects found.",
        
        python_proj_title: "Python Projects",
        python_proj_desc:
          "Collection of Python projects, including automation, data analysis, web development, and machine learning. They demonstrate practical application of algorithms, API integration, data manipulation, and interactive interface creation, offering solutions from utility tools and file compressors to art generators, simulators, and code metrics analyzers.",

        springboot_proj_title: "Spring Boot Projects",
        springboot_proj_desc:
          "Collection of Java projects with Spring Boot, including REST APIs, integration with SQL and NoSQL databases, JWT authentication, data processing, and web functionalities. They showcase architecture, services with user interfaces, integration with APIs like Huggingface and MercadoPago, file compression, messaging, and secure login, offering a concise backend solutions portfolio.",

        c_proj_title: "C Language Projects",
        c_proj_desc:
          "Collection of projects in C and C++, including algorithms, data structures, recursion, pointers, structs, files, and control flow. Compiled with MinGW/GCC, they range from simple calculators and games to matrix multiplication, file handling, simulations, and sorting algorithms, providing a portfolio of programming fundamentals, logic, efficiency, and best practices.",

        portfolio_proj_title: "Personal Portfolio",
        portfolio_proj_desc:
          "Portfolio in React and Vite that simulates a terminal to navigate projects, experiences, and achievements. Includes components like ProjectCard and ExperienceCard, displaying information dynamically. Supports multiple languages and integrates a mini-game, offering a fun experience. Combines modern design, intuitive navigation, and interactive features.",

        github_proj_title: "GitHub Readme Profile",
        github_proj_desc:
          "Project for building GitHub profiles with personalized READMEs, statistics, badges, activity and contribution charts. Includes integration with WakaTime and Spotify, examples of interactive profiles, best practice guides, dynamic visual elements, and automatic content generation. The goal is to provide a complete and attractive portfolio, highlighting skills and projects.",

        stor_proj_title: "STOR - Extracting Value from Industrial Asset Data",
        stor_proj_desc:
          "STOR is a modular solution that supports the implementation of BIM (Business Information Modelling), integrating all stages of engineering, maintenance, and operations projects. The platform allows for the management of documents, materials, purchases, and processes within a virtual plant, reducing costs, eliminating waste, and improving the quality of the final product.",

        anp_proj_title: "SIMP, I-SIMP, SIGEP, I-SIGEP",
        anp_proj_desc:
          "Projects developed for ANP (National Agency of Petroleum, Natural Gas and Biofuels), focused on managing exploration, production, and product movement data in the oil and gas sector. Included the modernization of SIGEP/i-SIGEP for secure document submission with protocols and digital signatures, as well as SIMP/i-SIMP for integrated monitoring of the downstream chain.",

        prosegur_proj_title: "SOL - Logistics Operations System",
        prosegur_proj_desc:
          "The Prosegur SOL Project unifies cash logistics systems across several countries, allowing the control of operations, resources, vehicles, personnel, routes, and services. It is a robust, configurable, and easy-to-maintain platform, incorporating the best existing features and facilitating the work of the analysis team.",

        hotmilhas_proj_title: "HotMilhas Crawlers",
        hotmilhas_proj_desc:
          "Development of Python 3 crawlers for airline mileage programs, with browser automation and structured data extraction. Includes creation of RESTful APIs for integration with internal systems, use of scalable cloud architecture (AWS), Docker containers, and CI/CD pipelines with GitLab. Project with messaging services (SQS, Redis) and observability using Grafana and New Relic.",

        aes_proj1_title: "Landing Page - Experimental Software Agency",
        aes_proj1_desc:
          "The AES Landing Page introduces the agency, collects requests, and highlights projects and team talents. It facilitates communication between clients and developers by allowing direct submission of requests to responsible teams. It also promotes the agency, showcasing projects, achievements, talents, and services, serving as a showcase for the market to see AES’s potential.",

        aes_proj2_title: "Smart Curriculum - Experimental Software Agency",
        aes_proj2_desc:
          "The Smart Curriculum helps students organize their course matrix, providing a graphical view of subjects across periods. It allows rearranging subjects according to preferences, tracking academic progress, exploring courses from other programs, and planning future choices, offering a more complete, personalized, and flexible learning experience.",

        aes_proj3_title: "I Care Well - Experimental Software Agency",
        aes_proj3_desc:
          "I Care Well is a project by PUC Minas, in partnership with the Mário Penna Institute and the PUC Minas Physiotherapy Clinical Center, aimed at supporting the discharge of cancer patients. The app guides patients on physiotherapy practices at home, replacing the paper booklet with a more practical digital solution.",

        aes_proj4_title: "PMMG - Program Card - Experimental Software Agency",
        aes_proj4_desc:
          "The Program Card is a project in partnership with the Military Police of Minas Gerais, aimed at facilitating the planning of police officers' itineraries in the state. The digital solution replaces the current manual process and will be accessed through SIGOp, a system used for the management and analysis of operational information.",

        aes_proj5_title: "PMMG - HR Contest - Experimental Software Agency",
        aes_proj5_desc:
          "The HR Contest project is the result of a partnership between the ESA and the Military Police of Minas Gerais, aiming to modernize and digitize the candidate selection processes. The proposed solution replaces the manual handling of documents, ensuring greater traceability, reliability, and agility in data analysis. The system will be integrated into the PMMG environment and will have a direct impact on the efficiency of managing public contests.",

        aes_proj6_title: "Sustainability Map - Experimental Software Agency",
        aes_proj6_desc:
          "The Sustainability Map project, developed by the Experimental Software Agency of PUC Minas in partnership with Sustainability Intelligence Center (CIS) of BH-TEC, is an initiative aimed at mapping sustainable actions throughout the state of Minas Gerais. The mapping contributes to giving visibility to these initiatives, in addition to providing metrics that support governmental discussions on sustainability.",

        aes_proj7_title: "Help Out App - Experimental Software Agency",
        aes_proj7_desc:
          "Help Out is an app that optimizes the mentorship program of the Software Engineering course at PUC Minas. It centralizes participant information and improves communication between mentors and mentees. Using an advanced matching algorithm, it ensures each mentee is paired with the most suitable mentor, providing a personalized experience.",

        aes_proj8_title: "Sustainable Concrete - Experimental Software Agency",
        aes_proj8_desc:
          "The Sustainable Concrete project, developed by the Experimental Software Agency (AES) at PUC Minas in partnership with MRV Engenharia, aims to significantly reduce concrete waste and disposal in the company's construction processes — one of the main environmental challenges faced by the construction industry.",

        aes_proj9_title: "APAC Women's Unit BH - Experimental Software Agency",
        aes_proj9_desc:
          "The APAC Women's Unit BH system, developed by the Experimental Software Agency (AES) at PUC Minas in partnership with the Nursing Department of ICBS at PUC Minas, is a pharmacy management platform for the women's unit of APAC (Association for the Protection and Assistance of Convicts) in Belo Horizonte. It centralizes the control of medications for inmates, recording their intake, distribution, and use, tracking each treatment individually, and keeping inventory up to date.",
              
        jedis_proj_title: "RHapido 2.0 - Jedis Technology and Recruitment",
        jedis_proj_desc:
          "RHapido 2.0 is a recruitment management system that uses artificial intelligence to streamline and make talent acquisition more efficient. Developed with cutting-edge technology, it offers intelligent resume screening, reducing time and costs in the hiring process.",
      },
      recomendacoes: {
        titulo: "Recommendations",
        nenhum: "No recommendations yet",

        rec72_relationship:
          "On September 29, 2026, João Gabriel was a client of João Paulo",

        rec72_recommendation:
          "I had the opportunity to learn a lot from Aramuni, in both theory and practice. His support and guidance were key to my growth and, above all, helped me see Software Engineering in a broader and more professional way. I am grateful for everything I learned and for the reflections he sparked along the way. They have made a real difference in how I see the field and my own career path.",
        
        rec71_relationship:
          "On September 25, 2026, Fernando was a client of João Paulo.",

        rec71_recommendation:
          "One of the best professors I have ever had. He is truly someone who not only understands the tools he uses and teaches, but also genuinely enjoys them. His teaching style and understanding of the topics are always impressive and consistently help students put things into context and learn.",

        rec70_relationship:
          "On June 26, 2026, Eric reported directly to João Paulo",

        rec70_recommendation:
          "I had the pleasure of working with João Paulo as my advisor for my undergraduate thesis (TCC). Throughout the project, he provided valuable guidance not only on the technical aspects of the development but also on the documentation and structuring of UML and architectural diagrams. His feedback consistently improved the quality and clarity of our work. What I appreciated most was his advising style: he gave us the autonomy to make decisions and explore solutions on our own while always being available to answer questions, discuss ideas, and provide insightful feedback whenever needed. This balance between independence and support made the learning experience both challenging and rewarding. I highly recommend him to anyone looking for a knowledgeable, approachable, and supportive advisor.",

        rec69_relationship:
          "On May 4, 2026, Pedro was a client of João Paulo",

        rec69_recommendation:
          "Professor João Paulo, better known as Aramuni, stands out for his excellence in conducting Information Technology courses in the Software Engineering program. His performance is marked by a high level of technical competence, professionalism, and deep mastery of the subjects taught. He has a clear and well-structured teaching style, making complex topics understandable while consistently connecting theory and practice in an effective way. Additionally, he presents an important differentiator by incorporating content aligned with current market demands, addressing modern technologies and encouraging the use of cutting-edge tools and approaches. His methodology promotes continuous learning, student autonomy, and the development of critical thinking, thereby providing solid preparation for real-world challenges in the field. Another relevant point is his ability to motivate students to keep up with the rapid evolution of technology, fostering a dynamic and innovation-oriented environment. He is a professional committed to the quality of education and to the strong development of future software engineers, and is highly recommended.",
        
        rec68_relationship:
          "On April 27, 2026, Felipe was a client of João Paulo",

        rec68_recommendation:
          "I had João Paulo as a professor at PUC Minas, and I can say he is an excellent professional. Always very available, he helped me several times with questions related to personal projects, demonstrating a genuine interest in students' learning. He played an important role in my deepening understanding of software architecture, bringing a practical and well-structured perspective to a topic I consider essential in the field. In addition, he also shares great career advice, which adds even more value to his role as a professor.",

        rec67_relationship:
          "On April 25, 2026, Artur was a client of João Paulo",

        rec67_recommendation:
          "I have the opportunity to be a student of Professor João Paulo Aramuni and I can affirm that his teaching stands out for the dynamic and engaging way in which he conducts his classes. One of his great differentiators is the focus on practical activities, always encouraging the development of projects using technologies relevant to the market. This makes the learning process much more applied and closer to professional reality. Additionally, his high level of knowledge is evident, both in the academic context, as a professor of Software Design, structuring and modeling solutions, and through his industry experience, always bringing a practical and up-to-date perspective to the classes. Professor Aramuni is also always available to support students, clarifying doubts and contributing proactively to the development of assignments and projects, which makes a significant difference in the progress of those who are learning. Without a doubt, he is a professor who positively impacts students' education and prepares them solidly for the challenges of the technology field.",
        
        rec66_relationship:
          "On December 18, 2025, Tito was a client of João Paulo",

        rec66_recommendation:
          "It is with great pleasure that I recommend Professor João Paulo Aramuni. As my undergraduate thesis advisor, his availability and technical expertise were crucial to the development of the software 'Keep', an innovative solution for managing a fleet of machines. His ability to guide and stimulate critical thinking was fundamental to the success of the project and to my professional development, in addition to all the supplementary materials he introduced to me, which were crucial to my improved learning.",

        rec65_relationship:
          "On December 16, 2025, Guilherme was a client of João Paulo",

        rec65_recommendation:
          "I was fortunate to have João Paulo Aramuni as my professor in the Software Design course. He is the kind of professor who not only masters the subject but also has a way of explaining things that makes everything seem simpler. What I value most about him is the partnership: always approachable, ready to chat about the job market and offer those career tips you don’t find in books. He is a professional who genuinely roots for his students’ success. I highly recommend him!",

        rec64_relationship:
          "On December 12, 2025, Lucas was a client of João Paulo",

        rec64_recommendation:
          "I had the privilege this semester of being a student of professor João Paulo Aramuni in FPAA in Software Engineering. In addition to mastering the content and explaining the subject clearly, he was always available to answer questions, provide career guidance, and recommend studies and extracurricular activities that truly add value and contribute to the academic and professional development of his students. A competent, accessible, and committed professor to the development of the students.",           
        
        rec63_relationship:
          "On November 25, 2025, Leonardo reported to João Paulo",

        rec63_recommendation:
          "Learning from João Paulo Aramuni was one of the best experiences I’ve ever had. He explains everything in a clear, direct way without beating around the bush, even when the subject is complicated. You can tell he really understands what he’s talking about and, more importantly, truly knows how to teach. What I like most about him is that he doesn’t stick only to the class content: he brings real-world examples, gives career tips, shows different paths, and genuinely cares about our development. He has already helped me with technical questions, project decisions, and even how to think better as a professional. He is a teacher who motivates, who adds value, and who makes a difference. Anyone who has the chance to learn from him should take it — it’s really worth it.",
        
        rec62_relationship:
          "On November 19, 2025, Bruna was a client of João Paulo",

        rec62_recommendation:
          "João Paulo demonstrates clarity in communication, technical mastery, and a genuine concern for generating positive impact through his projects and initiatives. His trajectory shows commitment, leadership ability, and a continuous pursuit of learning — characteristics that make him a standout in his field. It is evident that he is a professional who adds value wherever he works, not only because of the knowledge he possesses, but also because of the way he shares insights and inspires other professionals around him. I recommend his connection and his work to everyone who is looking for someone with vision, competence, and exemplary conduct.",
        
        rec61_relationship:
          "On November 18, 2025, Otávio was a client of João Paulo",

        rec61_recommendation:
          "I strongly recommend João Paulo Aramuni as a professional and as a professor. I had the opportunity to be his student in technology projects, and I can say that he manages to combine, in a rare way, technical depth with very clear teaching. João Paulo has a very solid strategic vision, brings real market examples, and always seeks to connect theory with practice, which generates a direct impact on the quality of the work. In addition to his technical competence as a CTO and Tech Lead, what stands out the most to me is his willingness to help and his genuine concern for the development of those around him. On several occasions, he went beyond the “basic” expectations of a consultant/professor to provide career guidance, review technical decisions, and suggest more sustainable paths for the project. He is an ethical, up-to-date professional who truly adds value to any team or initiative he is involved in.",
        
        rec60_relationship:
          "On October 28, 2025, Fernanda reported to João Paulo",

        rec60_recommendation:
          "I had the opportunity to be a student of Professor João Paulo Aramuni, and I can say that he is one of the most accessible and dedicated professors I have ever had. He is always willing to help and genuinely cares about his students' learning, being present for whatever is needed: answering questions, guiding projects, or giving career advice. He is a complete professional and an incredible person, who makes all the difference in the academic journey of those who are lucky enough to learn from him.",
        
        rec59_relationship:
          "On October 20, 2025, Paulo reported to João Paulo",

        rec59_recommendation:
          "João Paulo Aramuni was my professor in two very important courses during my college years, Algorithms and Data Structures 1 and Software Project. He is a teacher with excellent teaching skills and outstanding materials, especially on his GitHub, which contains various slides, projects, Figma designs, and other resources that are essential for a student’s development. I highly recommend him as both a professor and a developer.",

        rec58_relationship:
          "On September 27, 2025, Gabriel was a client of João Paulo",

        rec58_recommendation:
          "I have the privilege of being Professor Aramuni’s student, and I can say with absolute certainty that his classes go far beyond theoretical content. He has an approach that is strongly connected to the market, always bringing real-world examples, relevant case studies, and inviting experienced professionals from the field to share their insights and everyday challenges. This practical connection with the industry makes his classes much richer, more up-to-date, and truly inspiring. Professor Aramuni has a clear, objective, and at the same time thought-provoking teaching style, always encouraging critical thinking and the professional development of his students.",

        rec57_relationship:
          "On September 16, 2025, Davi reported to João Paulo",

        rec57_recommendation:
          "I had the opportunity to spend time with João Paulo during the course, and I can say he is a really great guy, a true partner. Always open to chatting, joking around, having conversations, and at the same time showing that he really knows what he’s talking about. What stands out the most to me is his willingness to help at any time, always with patience and a genuine desire to see others grow. That makes a huge difference in the learning environment and shows how collaborative he is. On top of that, his technical knowledge is remarkable, both in development and in best practices, which gives confidence when he’s explaining or guiding an activity. I highly recommend João Paulo, both for the professional he is and for the incredible person he shows himself to be every day.",

        rec56_relationship:
          "On September 15, 2025, Nataniel was a client of João Paulo",

        rec56_recommendation:
          "Excellent professor. Has complete mastery of the content taught and conveys knowledge in a light, didactic manner, demystifying more dense and complex subjects. Always available, willing to help, and contributing to the personal and professional growth of students.",

        rec55_relationship:
          "On September 13, 2025, Jonathan was a client of João Paulo",

        rec55_recommendation:
          "I had the opportunity to be a student of Professor João Paulo Aramuni and I can say that his way of teaching goes far beyond technical content. He is a mentor who inspires, always willing to help and make learning lighter, more human, and motivating. The exercises and projects proposed in class not only enrich the portfolio but also contribute significantly to our development as students and to our preparation for the professional market. Without a doubt, he is a professor who leaves a positive mark on the academic journey and makes a real difference in students’ education.",

        rec0_relationship:
          "On September 9, 2025, Raphael reported to João Paulo",

        rec0_recommendation:
          "João Aramuni is, by far, the best professor I could have at the University. His lectures are clear, and the content presented is aligned with the realities of the market. Beyond being an excellent tutor, he gave me a golden opportunity by trusting my work to lead one of the largest projects of the Experimental Software Agency, impacting the entire State and proving that students have real chances and are more than just numbers in academia. I wholeheartedly recommend this professional and will carry with me for life all the lessons I’ve learned.",

        rec1_relationship:
          "On August 31, 2025, Michelle Hanne worked with João Paulo on the same team",

        rec1_recommendation:
          "Aramuni is an excellent educator, committed to the technical and human development of students. He takes care to develop teaching materials as well as workshops that support students. Courses such as Fundamentals of Design, Algorithm Analysis, Software Project, Software Development Labs, among others, are of utmost importance for academic training and for training in Software Engineering. In short, an excellent technical leader and competent teaching professional.",

        rec2_relationship: "On August 5, 2025, Pedro reported to João Paulo",

        rec2_recommendation:
          "I had the honor of working with Aramuni as my undergraduate thesis advisor, and I can confidently say that his mentorship extended far beyond academic guidance. From day one, he fostered an environment of trust, curiosity, and autonomy, encouraging independent thinking while always being available when needed. What impressed me most was his commitment. No matter how busy his schedule was, he consistently made time to meet, provide thoughtful feedback, and check in on my progress. Beyond his role as a thesis advisor, Aramuni is a truly passionate educator. He brings not only deep technical expertise to the table, but also a genuine sense of purpose in teaching and mentoring others.",

        rec3_relationship: "On July 30, 2025, Bernardo reported to João Paulo",

        rec3_recommendation:
          "During the first semester of 2025, I had the privilege of working with Professor Aramuni as my thesis advisor. His guidance was instrumental throughout the process. He gave us the freedom to explore different technologies and encouraged independent thinking, while also providing clear and constructive feedback at every stage. What stood out most was his consistent availability — he always made time for me and my partner, setting up regular meetings and ensuring we felt supported. His calm demeanor and genuine care created a welcoming environment that made it easy for us to grow and develop. Professor Aramuni is an excellent mentor and a remarkable educator.",

        rec4_relationship: "On July 25, 2025, Luca reported to João Paulo",

        rec4_recommendation:
          "Professor Aramuni is one of the most dedicated and inspiring educators I’ve ever had the privilege to learn from. Creative and constantly innovating, he brings not only a deep theoretical foundation to his classes but also a strong focus on real-world application through hands-on exercises, interactive quizzes, and practical projects — many of which are available for free on his GitHub. What truly sets him apart, however, is his availability and genuine care for each student. He consistently makes time for one-on-one meetings, offering mentorship on both academic and career paths. His extensive professional background enriches every class with real-world examples and valuable insights. In my case, the conversations I had with him over the past few months played a key role in shaping important career decisions. Being his student was not just a great academic experience — it was a transformative one.",

        rec5_relationship:
          "On September 19, 2024, Flavio reported to João Paulo",

        rec5_recommendation:
          "For approximately a year, I had the privilege of being a student of Professor João Paulo Aramuni. He stands out not only for his vast technical knowledge but also for the evident passion he has for technology, which shows in each of his classes. His distinctive approach combines engaging and dynamic teaching, making learning more accessible and interesting. Furthermore, his ability to offer individualized attention to each student demonstrates his commitment to the personal and academic development of all, creating an environment where everyone feels valued and encouraged to grow.",

        rec6_relationship: "On August 22, 2024, Pedro reported to João Paulo",

        rec6_recommendation:
          "I had the privilege of being João's student, from whom I learned a lot about databases and Java. He is an excellent teacher, very competent and always willing to help! He demonstrates full mastery of the subjects, transforming complex content into something easy to understand and learn. I strongly recommend him to anyone wishing to deepen their knowledge in these areas. Anyone who has the opportunity to learn from him will be in good hands!",

        rec7_relationship:
          "On August 22, 2024, Angélica and João Paulo studied at the same institution",

        rec7_recommendation:
          "I often say that João was 'bitten by the mosquito' that made us fall in love with teaching. We both loved our careers, which had established us, but even so, teaching called us, and today we are fully fulfilled in this field. Moreover, João is a true partner, always attentive to supporting people he considers talented. I have the privilege of being one of those people. Thanks to João, I realized my dream of teaching at the undergraduate level, and he was so generous that he even gave me his classes. What can I say about such an extraordinary person? João, the world is yours, my friend! Count on me for us to leave our mark on the new 'generation' of IT talent.",

        rec8_relationship:
          "On August 20, 2024, Max and João Paulo studied at the same institution",

        rec8_recommendation:
          "Talking about João Aramuni is easy, I had the privilege of counting on his help on several occasions, and I can confidently say he is an extraordinarily intelligent and collaborative person. His team spirit is simply remarkable, always willing to contribute to collective success. In addition to his professional skills, he has excellent interpersonal relations, being extremely pleasant and respectful. His ability to work well with others and his willingness to share knowledge make him a remarkable person for any team.",

        rec9_relationship:
          "On August 19, 2024, Rubens Gabriel was a client of João Paulo",

        rec9_recommendation:
          "I was fortunate to have Professor João Aramuni as my teacher and thesis advisor. He stands out for making complex concepts more accessible and for his commitment to the development of his students. He was always available to provide guidance and support, which was fundamental for my academic growth. I recommend him to anyone who has the opportunity to work or learn with him.",

        rec10_relationship:
          "On June 19, 2024, João Paulo was senior to Pedro, but did not directly supervise him",

        rec10_recommendation:
          "João Paulo Aramuni is a very good professor. During my time in his class, I was impressed with his deep technical knowledge and his ability to convey complex concepts in a clear and accessible way. His didactic approach encourages active student participation, promoting a collaborative and enriching learning environment. Moreover, his passion for the subject is evident in every class, inspiring his students to strive for academic excellence.",

        rec11_relationship: "On March 1, 2024, Tulio reported to João Paulo",

        rec11_recommendation:
          "I had the pleasure of being led by Aramuni during most of my time at Trybe, and I can affirm that it was an exemplary leadership and an inspiration as a professional. He always cared about the development of his team members, pointing out opportunities within the company for growth and encouraging taking courses and reading books. Whenever I brought observations for improvement in operations, João encouraged me to gather data and document facts to support discussions with higher-level leadership to improve team-wide processes, which led to changes in some tasks carried out by all other instructors and specialists. I strongly recommend him both as a leader and as a technical computing reference.",

        rec12_relationship: "On February 8, 2024, Luíza reported to João Paulo",

        rec12_recommendation:
          "Professor Aramuni is an exceptional educator in the field of Databases. During the time I was his student, I experienced a truly didactic teaching approach, which made all the difference in my academic journey. He not only has deep mastery of the content but also possesses the unique ability to convey complex concepts in a clear and accessible way. His light and fun approach makes the classes engaging, providing a conducive learning environment. Furthermore, his patience and willingness to help students were essential for my academic development. I am certain he will continue to positively impact the lives of his students, just as he did with me.",

        rec13_relationship:
          "On January 30, 2024, Thiago reported to João Paulo",

        rec13_recommendation:
          "Professor João Paulo Aramuni is an excellent teacher! When I started college, I had a lot of difficulty with Java and was developing a dislike/trauma towards the subject, but after his classes, I learned to enjoy it and, with his help, I began to improve and get better constantly. His teaching style is amazing and engaging, demystifying what seems complex and making it simple! He addresses the details and teaches us not only how to do things but also to understand what we are doing. He always gave me tremendous support, even outside of college, and I could always count on him! I am very grateful.",

        rec14_relationship:
          "On December 18, 2023, Carlos reported to João Paulo",

        rec14_recommendation:
          "Working under Aramuni's leadership for 18 months was an incredible experience, both for my professional and personal development. Aramuni proved to be an exceptional leader, providing continuous support and the creative freedom the entire team needed, whether to teach or create high-quality content. With his knowledge of Python, algorithms, and web scraping, Aramuni was a cornerstone in the construction and operation of the computer science module. I learned a lot from him, not only technically but also in becoming a more complete and adaptable professional. I am grateful for all his guidance and consider him a mentor, leader, and friend.",

        rec15_relationship:
          "On November 6, 2023, João Vitor reported to João Paulo",

        rec15_recommendation:
          "As my leader, Aramuni helped me evolve greatly. He brought excellent PDIs, technical discussions, and also outstanding study recommendations. Furthermore, he created opportunities for both less experienced and more experienced team members, fostering confidence in all his direct reports. He has excellent people management skills, and the whole team admired him. I also emphasize that, besides the benefits for the growth and delivery of his team, he maintained a focus on generating value for the business, which led to excellent outcomes. I recommend Aramuni as a leader who can add value both to the company and to his team.",

        rec16_relationship: "On October 25, 2023, Tiago reported to João Paulo",

        rec16_recommendation:
          "Aramuni demonstrates very human leadership, paying great attention to areas of improvement and what is needed to achieve goals. I am very grateful to have been led by him and can say that I grew a lot as a professional and person because he is an excellent listener and highly empathetic. His recommendation is well-deserved because he is an extremely committed and responsible professional, who is not afraid to step up when needed.",

        rec17_relationship: "On June 8, 2023, Eli reported to João Paulo",

        rec17_recommendation:
          "It is a pleasure to recommend Aramuni; he was my leader at Trybe and I also followed his work as Technical Leader of the Computer Science Curriculum. During this period, I witnessed his exceptional skills and his commitment to the success of the team. His unique combination of academic knowledge, practical experience, and leadership skills makes him a remarkable professional. Moreover, he is an incredible person, always willing to help and contribute to others. His guidance and support were essential for my professional growth, both technically and personally. I am extremely grateful for everything I learned from him and proudly recommend him.",

        rec18_relationship: "On May 9, 2023, Cristiano reported to João Paulo",

        rec18_recommendation:
          "Aramuni is a person who demonstrates extreme responsibility in his professional duties and has a gift for relating to people, making the workplace light and pleasant. Personally, he learns processes quickly, is extremely focused on his activities, demonstrates very high technical potential, and is always concerned with his constant evolution, all while maintaining care and attention towards people. I greatly enjoy working with him because I learn a lot and become a better professional through his examples and advice. I am grateful for this daily opportunity for collaboration and sincerely hope to maintain this productive relationship for a long time.",
        
        rec19_relationship:
          "On March 12, 2023, Will and João Paulo studied at the same institution",

        rec19_recommendation:
          "An excellent opportunity I had to work with Aramuni; I learned a lot from him. After all, it was my first experience teaching Programming, and he taught me so much. Great Professor and Leader, always providing the team with assertive feedback! Thank you, Aramuni!",

        rec20_relationship:
          "On February 7, 2022, João Paulo was senior to André but did not directly supervise him",

        rec20_recommendation:
          "Aramuni is able to organize agendas and bring focus to meetings, keeping the team organized and guided. Additionally, he is super calm and easygoing, and always plays soft music for relaxed moments. A really great person to work with =D",

        rec21_relationship:
          "On August 10, 2021, Douglas reported to João Paulo",

        rec21_recommendation:
          "Having Aramuni as an instructor was one of the best experiences of my life. His advice and guidance made me realize exactly my technological strengths and weaknesses. Today I know where I am headed because I know which path to follow. Patience, calmness, clarity, and teaching strategy gave me the confidence to overcome any challenge that came my way. He is brilliant as an instructor, lead, influencer, and a lifelong friend.",

        rec22_relationship:
          "On October 2, 2020, João Paulo was senior to Bruno but did not directly supervise him",

        rec22_recommendation:
          "I had the pleasure of being João's student and TCC advisee. He is a person who has always made a difference in academia and helped me greatly to become the professional I am today. As I say, brilliant teachers teach for a profession. Fascinating teachers like João teach for life.",

        rec23_relationship:
          "On September 11, 2020, Klelvin worked with João Paulo on the same team",

        rec23_recommendation:
          "I have known João for about 10 years and have shared many life moments with him throughout our careers. He was a college colleague, a work colleague, and became a lifelong friend. Dedicated academic, exemplary educator, and professional with unmatched abilities. I wish every place I worked had a João Paulo.",

        rec24_relationship:
          "On April 25, 2020, Rafael worked with João Paulo on the same team",

        rec24_recommendation:
          "João is an exemplary professional and, given his academic background, is always open to learning new technologies and methods. At the same time, he consistently shares knowledge with everyone.",
        
        rec25_relationship:
          "On November 17, 2018, Eduardo and João Paulo studied at the same institution",

        rec25_recommendation:
          "I had the pleasure of being João Paulo's student at FUMEC, and he is surely one of the most competent teachers/professionals I have ever met. He always seeks to offer the best to his students, preparing differentiated classes and projects. He is a professional with extensive experience and knowledge.",

        rec26_relationship:
          "On March 27, 2018, Bruno was a client of João Paulo",

        rec26_recommendation:
          "The talents displayed by Professor João are ineffable. Even from the little I know him as a student, his professional and interpersonal qualities are evident. Always available, he shows complete interest in doing excellent work, in this case, transmitting knowledge. If there is anyone I would like as a teammate, it would be João Paulo.",

        rec27_relationship:
          "On March 23, 2018, Leonardo was a client of João Paulo",

        rec27_recommendation:
          "João Paulo is an exceptional teacher, showing that programming goes far beyond syntax. He guides students in their entire quest for knowledge, being not only a teacher but also a companion. Extremely open to answer any questions and help us evolve.",

        rec28_relationship:
          "On March 20, 2018, Rafaela was a client of João Paulo",

        rec28_recommendation:
          "I know João Paulo as 'Professor Aramuni', which was the first time I had contact with him. I can say he is one of the best teachers I have ever had: super dedicated, explains the subject well, and demonstrates complete knowledge of what he teaches. I asked for his help a lot during the course and always received a quick response, which was great! He does everything possible to encourage us to study, talks about job and internship opportunities for those in need, and encourages people to deepen their studies in courses, books, scientific initiation, and even pursue master's and Ph.D. degrees. It was a pleasure to attend his classes, and I hope to work with him in the future!",

        rec29_relationship:
          "On March 19, 2018, Pedro Henrique was a client of João Paulo",

        rec29_recommendation:
          "Excellent teacher! A distinguished master who stays updated with new teaching methodologies! Intrigues and challenges his students to think differently. Always available and attentive!",

        rec30_relationship:
          "On March 19, 2018, Henrique was a client of João Paulo",

        rec30_recommendation: "Excellent teacher, with energy and patience!",
        
        rec31_relationship:
          "On March 19, 2018, Rubens was a client of João Paulo",

        rec31_recommendation:
          "João Paulo is the type of teacher who ensures that students truly understand the subject, both through his teaching methods and his demeanor in the classroom. He demonstrates great knowledge in his field and is willing to understand and assist each student individually, breaking away from the stereotype of a university professor who merely 'points you to the path of learning'.",

        rec32_relationship:
          "On March 19, 2018, Vicente was a client of João Paulo",

        rec32_recommendation:
          "As a teacher, João Paulo became fundamental in my education, since I learned programming in depth. He stands out by not teaching just the basics, but what is actually required in practice and in the job market! His concern and care for each student's learning is a strong point, and he spares no effort to ensure students are well-prepared and able to stand out professionally. His experience in the job market gives us confidence in what he teaches and makes learning easier when he shares real problems he has faced throughout his career. I am grateful to have a teacher of this caliber in my academic formation.",

        rec33_relationship:
          "On March 19, 2018, Igor was a client of João Paulo",

        rec33_recommendation:
          "João Paulo is a great teacher. Dedicated, he always attends to us in the best possible way. He has a modern teaching methodology that is compatible with the requirements of the job market.",

        rec34_relationship:
          "On February 15, 2018, Felipe Ferreira reported to João Paulo",

        rec34_recommendation:
          "João Paulo is a highly motivated and enthusiastic teacher. He shows exceptional care in preparing teaching materials, always clear and up-to-date. His classes are participatory, charismatic, and dynamic. Outside of class, he is attentive and motivating, sharing market experience and valuable advice. One of the best teachers I have ever had and a great friend.",

        rec35_relationship:
          "On December 28, 2017, Gabriel reported to João Paulo",

        rec35_recommendation:
          "João is an excellent teacher, making every class interesting. He is also able to convey information simply and consistently challenges his students to learn more.",

        rec36_relationship:
          "On December 19, 2017, Thiago Brito and João Paulo studied at the same institution",

        rec36_recommendation:
          "Excellent teacher, always concerned with students' learning, while providing good materials and study tips. Also an outstanding person, remembering names and staying close to students. I am grateful for the opportunity to have him as my teacher.",
        
        rec37_relationship:
          "On December 17, 2017, Gabriel and João Paulo studied at the same institution",

        rec37_recommendation:
          "He is among the best teachers I have ever had. While he challenges you a lot, he also makes you genuinely interested in the subject, clears any doubts, and is someone you want to carry as a friend for life. Simply sensational. I greatly appreciate all the knowledge he has already shared and continues to share.",

        rec38_relationship:
          "On December 15, 2017, Amanda was a client of João Paulo",

        rec38_recommendation:
          "Excellent teacher, attentive, highly knowledgeable, and has good teaching skills.",

        rec39_relationship:
          "On December 14, 2017, Nilson Junio Paulino was a client of João Paulo",

        rec39_recommendation:
          "Excellent teacher, dedicated to every subject he teaches, always seeks knowledge beyond the books, and has excellent teaching skills. I hope to be his student in another subject, as I know it will be well taught.",

        rec40_relationship:
          "On December 13, 2017, Lucas was a client of João Paulo",

        rec40_recommendation:
          "Despite the difficulties during the semester and the numerous bugs we had to fix, it was possible to deliver a project that applied all the theory and concepts taught in an excellent way. I can confidently say that Professor João Paulo will be a key part of my education, playing a fundamental role in my knowledge journey.",

        rec41_relationship:
          "On December 13, 2017, Luiz Guilherme was a client of João Paulo",

        rec41_recommendation:
          "I was fortunate to participate in two courses taught by Professor João Paulo Aramuni, Theoretical Foundations of Computing and Compilers. In both, he showed complete dedication to answering questions, helping students with difficulties, and always had patience and understanding. His classes have dynamics that facilitate understanding and learning, with full mastery of the subjects and practical examples.",

        rec42_relationship:
          "On December 13, 2017, David was a client of João Paulo",

        rec42_recommendation:
          "Excellent teacher, great teaching skills, and a strong desire to teach. The classes were very well conducted!",
        
        rec43_relationship:
          "On December 11, 2017, João Paulo was senior to Samuel, but did not directly supervise him",

        rec43_recommendation:
          "Professor Aramuni is one of the best teachers I have ever had. His teaching style can explain even the most complex abstractions clearly, enabling everyone to absorb knowledge and solve complex problems. There is no better person for guidance than João Paulo.",

        rec44_relationship:
          "On June 19, 2017, João Lucas Veloso was a client of João Paulo",

        rec44_recommendation:
          "João is a teacher who seeks and develops methods to help his students learn. He has always shown commitment to assisting, providing well-prepared materials and patience to respect each student's pace.",

        rec45_relationship:
          "On February 9, 2017, Fábio and João Paulo studied at the same institution",

        rec45_recommendation:
          "Great teacher, attentive, and highly knowledgeable in what he teaches. His classes were extremely valuable, and his teaching went beyond expectations. I am glad to have shared learning experiences with him.",

        rec46_relationship:
          "On January 9, 2017, Márcio worked with João Paulo on the same team",

        rec46_recommendation:
          "I have worked with João Paulo for about a year and can say he is a very dedicated, responsible, and studious professional. He always seeks knowledge and shares solutions with the team, promoting everyone's growth.",

        rec47_relationship:
          "On October 17, 2016, Felipe and João Paulo studied at the same institution",

        rec47_recommendation:
          "I had the great pleasure of being a student of João Paulo at FUMEC University. Top-notch professor, competent, attentive, relaxed, able to explain complex subjects clearly and simply. All of this thanks to his love for what he does. Wishing you great success, João!",

        rec48_relationship:
          "On October 10, 2016, Bruno was a client of João Paulo",

        rec48_recommendation:
          "I had the pleasure of being a student of João Aramuni at FUMEC University. A serious and dedicated professional, he can convey programming knowledge in a structured and clear way. Excellent teacher, and I hope he stands out greatly in his academic career.",
        rec49_relationship:
          "On August 23, 2015, Rafael and João Paulo studied at the same institution",

        rec49_recommendation:
          "I had the opportunity to study with João Paulo at FUMEC. A distinguished professional: organized, persistent, self-taught, and passionate about agile methodologies. He stood out for his communication skills and knowledge sharing.",

        rec50_relationship:
          "On March 4, 2015, Gabriela and João Paulo studied at the same institution",

        rec50_recommendation:
          "I recommend João for his competence, passion for his field, determination, strong will, and easy-going personality. An excellent professional.",

        rec51_relationship:
          "On November 10, 2014, João Paulo was senior to Glaydson, but did not directly supervise him",

        rec51_recommendation:
          "I have worked with João Paulo for almost a year, and during this period he proved to be a competent and dedicated professional, performing exceptionally on projects for clients such as OI and ANP.",

        rec52_relationship:
          "On November 9, 2014, Lucas and João Paulo studied at the same institution",

        rec52_recommendation:
          "João is a dedicated and proactive student. He stood out in class with excellent assignments and presentations. As a speaker, he addresses agile methodologies in a way that increasingly captivates students.",

        rec53_relationship:
          "On October 29, 2014, Andre worked with João Paulo but on different teams",

        rec53_recommendation:
          "I had the opportunity to work with João Paulo at Capgemini for one year. A professional focused on sharing information and always willing to help.",

        rec54_relationship:
          "On October 14, 2014, Amadeu and João Paulo studied at the same institution",

        rec54_recommendation:
          "João Paulo is deeply involved in classroom and research activities. We worked together on articles and presentations, always bringing innovative ideas. He has experience with agile methodologies, applied even in his master's dissertation.",
      },
      experiencias: {
        titulo: "Professional Experiences",
        present: "Present",

        // Companies
        jedis: "Jedis - Technology and Recruitment",
        puc_minas: "PUC Minas",
        centro_newton_paiva: "Newton Paiva University Center",
        in8: "IN8",
        trybe: "Trybe",
        xp_educacao: "XP Education",
        universidade_fumec: "FUMEC University",
        prosegur: "Prosegur",
        capgemini: "Capgemini",
        banco_brasil: "Banco do Brasil",
        alamo_ti: "Álamo - IT Solutions",
        cpd_face_fumec: "CPD FACE/FUMEC",
        pibic_cnpq: "PIBIC/CNPq",

        // Roles
        consultor:"Technology Consultant",
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
        analista_sistemas_pl_prosegur: "Mid-level Systems Analyst",
        analista_sistemas_pl_capgemini: "Mid-level Systems Analyst",
        analista_sistemas_jr_capgemini: "Junior Systems Analyst",
        programador_sr_capgemini: "Senior Programmer",
        programador_jr_capgemini: "Junior Programmer",
        tecnico_programador_bb: "Technician/Programmer",
        desenvolvedor_csharp_alamo: "C# Developer",
        estagiario_fumec: "Intern",
        bolsista_pibic: "Undergraduate Research Fellow",

        // Descriptions & Skills
        consultor_desc:
          "Technical leadership (CTO role) of 4 devs, 1 PO and outsourced QA on systems for JdsDev, Mereo, Afya, Autoglass and Allos. Effort, timeline and cost estimation, with technical pre-refinement, milestones, QA and contingency margins, scenarios and risks, supporting proposals of up to ~3,000 h. Pricing support for the RHápido ATS SaaS. Cloud-native and microservices architectures, integration APIs and technical decisions. Led, with Eficify, the migration of RHápido from AWS (EC2/S3) to Kubernetes on Eficify Private Cloud: segmented network with Bastion Host, GitOps with ArgoCD, Zero Trust (RBAC, MFA, auditing), IaC and PITR backups. Mentoring, developer hiring, IDPs and Claude Code rollout to the team.",
        consultor_skills:
          "Software estimation & pricing, Cloud-native architecture, Kubernetes, DevOps & GitOps, Zero Trust, Microservices, Infrastructure as Code, Observability, Generative AI in development, Technical mentoring, Stakeholder communication.",
        
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
          "Analysis and development in Java / Java Web; Maintenance of VB6 / VB.NET systems. Web development with Classic ASP / ASP.NET. Database management with SQLServer / Oracle. Programming with PL/SQL. Documentation and UML. Agile methodology using Lean Manufacturing.",
        analista_sistemas_pl_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        analista_sistemas_jr_capgemini_desc:
          "Analysis and development in Java / Java Web; Maintenance of VB6 / VB.NET systems. Web development with Classic ASP / ASP.NET. Database management with SQLServer / Oracle. Programming with PL/SQL. Documentation and UML. Agile methodology using Lean Manufacturing.",
        analista_sistemas_jr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_sr_capgemini_desc:
          "Second time in Capgemini Brazil's history that a progression from Junior to Senior occurred, skipping the Mid-level position.",
        programador_sr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_jr_capgemini_desc:
          "Development and maintenance of SIGEP and SIMP systems for ANP (National Agency of Petroleum, Natural Gas, and Biofuels), focusing on web applications, document processing, and regulatory compliance support.",
        programador_jr_capgemini_skills:
          "ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        tecnico_programador_bb_desc:
          "Mandatory supervised internship in development and support of Java / Java Web applications; Maintenance of systems integrated with SISBB. Development and support of legacy VBA / VB6 applications; PL/SQL programming; Requirements gathering.",
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
      comando: {
        nao_reconhecido: "Comando não reconhecido:",
        ver_ajuda: "Digite 'ajuda' para ver as opções.",
        carregando: "Carregando...",
        falha_carregar: "Não foi possível abrir este comando. Recarregue a página e tente de novo.",
      },
      tema: {
        claro_ativado: "Tema claro ativado. Digite 'tema --escuro' para voltar.",
        escuro_ativado: "Tema escuro ativado. Digite 'tema --claro' ou 'tema --galo' para trocar.",
        galo_ativado: "Tema Galo ativado: preto, branco e o amarelo da estrela. Digite 'tema --escuro' para voltar.",
        uso: "Uso: tema [--escuro | --claro | --galo] (sem opção, troca na ordem escuro → claro → galo)",
        grupo: "Tema",
        ativar_claro: "Ativar tema claro",
        ativar_escuro: "Ativar tema escuro",
        ativar_galo: "Ativar tema Galo (Atlético Mineiro)",
      },
      neofetch: {
        comandos: "comandos",
        claro: "Claro",
        escuro: "Escuro",
        galo: "Galo",
        cpu: "Engenheiro de Software (16 núcleos de café)",
        time_label: "Time",
        logo_alt: "Escudo do Atlético Mineiro em caracteres braille",
      },
      jogos: {
        titulo: "Próximos jogos do Galo",
        subtitulo: "Clube Atlético Mineiro · horários de Brasília",
        subtitulo_posicao: "Clube Atlético Mineiro · {{posicao}}º no Brasileirão · horários de Brasília",
        carregando: "Buscando os jogos do Galo...",
        erro: "Não consegui buscar os jogos agora. Tente de novo daqui a pouco.",
        nenhum: "Nenhum jogo marcado por enquanto.",
        uso: "Uso: jogos [--todos | --tabela] (galo | atletico também funcionam)",
        proximo_em: "Próximo jogo {{tempo}}",
        relogio_alt: "Contagem regressiva para o próximo jogo",
        placar_alt: "Placar ao vivo",
        contra: "contra",
        casa: "em casa",
        fora: "fora",
        hora_a_definir: "horário a definir",
        penaltis: "pên.",
        ultimo: "Último jogo:",
        resultado: { v: "V", e: "E", d: "D" },
        mais_one: "+ {{count}} jogo marcado: digite <cmd>jogos --todos</cmd>",
        mais_other: "+ {{count}} jogos marcados: digite <cmd>jogos --todos</cmd>",
        fonte: "Fonte: <espn>ESPN</espn> (jogos, escudos e logos dos campeonatos) · horários de Brasília · tabela: <cmd>jogos --tabela</cmd>",
        tabela: {
          titulo: "Galo no Brasileirão",
          rodadas_one: "{{count}} rodada jogada",
          rodadas_other: "{{count}} rodadas jogadas",
          carregando: "Buscando a tabela do Brasileirão...",
          erro: "Não consegui buscar a tabela agora. Tente de novo daqui a pouco.",
          vazia: "A tabela ainda não está disponível.",
          legenda: "Classificação do Brasileirão Série A",
          posicao: "{{posicao}}º",
          lugar: "lugar",
          pontos: "pontos",
          forma: "Últimos 5:",
          numeros: {
            pontos: "Pontos",
            jogos: "Jogos",
            vitorias: "Vitórias",
            empates: "Empates",
            derrotas: "Derrotas",
            gols_pro: "Gols pró",
            gols_contra: "Gols contra",
            saldo: "Saldo de gols",
            aproveitamento: "Aproveitamento",
          },
          colunas: {
            time: "Clube",
            pontos: "P",
            jogos: "J",
            vitorias: "V",
            empates: "E",
            derrotas: "D",
            gols_pro: "GP",
            gols_contra: "GC",
            saldo: "SG",
            aproveitamento: "%",
          },
          situacao: {
            lider_one: "Líder, {{count}} ponto à frente do {{time}}",
            lider_other: "Líder, {{count}} pontos à frente do {{time}}",
            do_lider_one: "A {{count}} ponto do líder ({{time}})",
            do_lider_other: "A {{count}} pontos do líder ({{time}})",
            do_g_one: "A {{count}} ponto do G-{{g}} (Libertadores)",
            do_g_other: "A {{count}} pontos do G-{{g}} (Libertadores)",
            no_g: "Dentro do G-{{g}} (vaga na Libertadores)",
            acima_z4_one: "{{count}} ponto acima do Z-4",
            acima_z4_other: "{{count}} pontos acima do Z-4",
            no_z4_one: "No Z-4, a {{count}} ponto de sair",
            no_z4_other: "No Z-4, a {{count}} pontos de sair",
          },
          zonas: {
            libertadores: "Libertadores",
            pre_libertadores: "Pré-Libertadores",
            sulamericana: "Sul-Americana",
            rebaixamento: "Rebaixamento",
          },
          dica: "Próximos jogos: digite <cmd>jogos</cmd>",
          fonte: "Fonte: <espn>ESPN</espn> (classificação e escudos)",
        },
        dia: { hoje: "hoje", amanha: "amanhã" },
        unidades: { d: "dias", h: "horas", min: "min", s: "seg" },
        tempo: {
          ao_vivo: "ao vivo",
          comecando: "começando",
          hoje: "hoje",
          dias_one: "em {{count}} dia",
          dias_other: "em {{count}} dias",
          n_dias_one: "{{count}} dia",
          n_dias_other: "{{count}} dias",
          dias_horas: "em {{dias}} e {{horas}} h",
          horas_minutos: "em {{horas}} h e {{minutos}} min",
          minutos_one: "em {{count}} min",
          minutos_other: "em {{count}} min",
        },
        serie: {
          jogo_ida: "jogo de ida",
          jogo_volta: "jogo de volta",
          ida: "ida",
          agregado: "Agregado",
          volta_em: "A volta é em {{data}}",
          ida_em: "A ida é em {{data}}: depois dela, o placar agregado aparece aqui.",
          sem_ida: "Jogo de volta: o placar da ida ainda não está disponível.",
          vantagem_one: "O Galo tem {{count}} gol de vantagem: joga pelo empate.",
          vantagem_other: "O Galo tem {{count}} gols de vantagem: joga pelo empate.",
          desvantagem_one: "O Galo precisa tirar {{count}} gol: vencer por {{mais}} classifica; por {{count}}, leva aos pênaltis.",
          desvantagem_other: "O Galo precisa tirar {{count}} gols: vencer por {{mais}} classifica; por {{count}}, leva aos pênaltis.",
          empate: "Agregado empatado: quem vencer a volta avança; novo empate leva aos pênaltis.",
        },
        competicoes: {
          brasileirao: "Brasileirão Série A",
          copa_do_brasil: "Copa do Brasil",
          libertadores: "Copa Libertadores",
          sulamericana: "Copa Sul-Americana",
          recopa: "Recopa Sul-Americana",
          mundial: "Mundial de Clubes",
          mineiro: "Campeonato Mineiro",
          supercopa: "Supercopa do Brasil",
          amistoso: "Amistoso",
        },
        fases: {
          grupos: "Fase de grupos",
          dezesseis_avos: "16 avos de final",
          oitavas: "Oitavas de final",
          quartas: "Quartas de final",
          semi: "Semifinal",
          terceiro: "Disputa do 3º lugar",
          final: "Final",
          fase1: "1ª fase",
          fase2: "2ª fase",
          fase3: "3ª fase",
          fase4: "4ª fase",
          fase5: "5ª fase",
          playoffs: "Playoffs",
        },
      },
      boot: {
        cpu: "Detectando CPU: Engenheiro de Software (16 núcleos de café)",
        graduacao: "Started Graduação em Ciência da Computação",
        teaching: "Started PUC Minas teaching daemon (engenharia-de-software.service)",
        cafe: "cafe.service: nível de café abaixo de 20%, reabastecendo...",
        projetos: "Reached target Projetos e Experiências",
        carregando: "carregando portfolio",
        pular: "pressione qualquer tecla para pular",
      },
      sobre: {
        nome: "João Paulo Aramuni",
        cargo: "Professor de Engenharia de Software e Ciência da Computação na PUC Minas",
        avatar_alt: "Foto de João Paulo Aramuni",
        lema_1: "programador por profissão,",
        lema_2: "professor por vocação",
        local: "Belo Horizonte, MG",
        signo: "Sagitário",
        idade_one: "{{count}} ano",
        idade_other: "{{count}} anos",
        bio_1:
          "Sou professor de Engenharia de Software e Ciência da Computação na <b>PUC Minas</b>, CTO da Agência Experimental de Software do ICEI e consultor de tecnologia na <b>Jedis</b>. Sou doutor e mestre em Sistemas de Informação e Gestão do Conhecimento pela Universidade FUMEC, onde também me formei em Ciência da Computação.",
        bio_2:
          "São <b>{{dev}} anos</b> desenvolvendo sistemas e <b>{{ensino}} anos</b> ensinando tecnologia. No mercado, fui de Java para logística e transporte de valores a crawlers em Python para programas de milhagem, e liderei times como Tech Lead na Trybe e Tech Manager na IN8. Hoje aplico inteligência artificial na avaliação de perfis técnicos, defino arquitetura de sistemas e cuido de observabilidade e de sistemas na AWS. Na sala de aula, levo essa prática para os projetos dos alunos, e o material das disciplinas fica aberto no GitHub.",
        kpi: {
          anos_one: "{{count}} ano",
          anos_other: "{{count}} anos",
          dev_rotulo: "desenvolvendo sistemas",
          dev_detalhe_one: "em {{count}} empresa",
          dev_detalhe_other: "em {{count}} empresas",
          ensino_rotulo: "ensinando tecnologia",
          ensino_detalhe_one: "desde {{ano}} · {{count}} instituição",
          ensino_detalhe_other: "desde {{ano}} · {{count}} instituições",
          tccs_rotulo: "TCCs orientados",
          tccs_detalhe_one: "e {{count}} banca examinadora",
          tccs_detalhe_other: "e {{count}} bancas examinadoras",
          aes_rotulo: "times na AES",
          aes_detalhe_one: "~{{count}} pessoa sob minha gestão",
          aes_detalhe_other: "~{{count}} pessoas sob minha gestão",
        },
        secoes: {
          hoje: "hoje",
          trajetoria: "profissão e vocação",
          formacao: "formação",
          disciplinas: "disciplinas",
          vivencia: "vivência",
          clientes: "já desenvolvi software para",
          pessoal: "fora do terminal",
          artigos: "artigos publicados",
        },
        hoje: {
          em: "na",
          puc: {
            cargo: "Professor",
            org: "PUC Minas",
            detalhe: "Engenharia de Software e Ciência da Computação · orientador de TCC II",
          },
          aes: {
            cargo: "CTO",
            org: "Agência Experimental de Software",
            detalhe: "7 times de desenvolvimento, em média 35 pessoas, no ICEI da PUC Minas",
          },
          jedis: {
            cargo: "Consultor de tecnologia",
            org: "Jedis",
            detalhe:
              "IA na identificação e avaliação de perfis técnicos, arquitetura de sistemas, observabilidade e mentoria de times",
          },
          disciplinas_agora_one: "{{count}} disciplina em {{semestre}}",
          disciplinas_agora_other: "{{count}} disciplinas em {{semestre}}",
        },
        trajetoria: {
          profissao: "programador por profissão",
          vocacao: "professor por vocação",
          hoje: "hoje",
          jedis: {
            cargo: "Consultor de tecnologia",
            org: "Jedis",
            detalhe: "IA em recrutamento técnico, arquitetura e AWS",
          },
          in8_manager: {
            cargo: "Tech Manager",
            org: "IN8",
            detalhe: "squads de vários projetos para o mercado de milhas aéreas",
          },
          trybe: {
            cargo: "Tech Lead",
            org: "Trybe",
            detalhe: "times de back-end e ciência da computação, OKRs e conteúdo",
          },
          in8_dev: {
            cargo: "Dev back-end sênior",
            org: "IN8",
            detalhe: "web scraping e crawlers em Python para programas de milhagem",
          },
          capgemini: {
            cargo: "Programador e analista",
            org: "Capgemini",
            detalhe: "Java para a ANP e a Prosegur; de júnior a sênior sem passar por pleno",
          },
          bb: {
            cargo: "Técnico programador",
            org: "Banco do Brasil",
            detalhe: "Java e sistemas integrados ao SISBB",
          },
          alamo: {
            cargo: "Desenvolvedor C#",
            org: "Álamo TI",
            detalhe: "C# e ASP.NET para gestão de projetos e ponto eletrônico",
          },
          puc: {
            cargo: "Professor e CTO da AES",
            org: "PUC Minas",
            detalhe: "Engenharia de Software e Ciência da Computação",
          },
          newton: {
            cargo: "Professor",
            org: "Newton Paiva",
            detalhe: "Ciência da Computação, Sistemas de Informação e ADS",
          },
          xpe: {
            cargo: "Professor",
            org: "XP Educação",
            detalhe: "Arquitetura de Software e Engenharia de Requisitos",
          },
          trybe_instrucao: {
            cargo: "Especialista em Instrução de Tecnologia",
            org: "Trybe",
            detalhe: "Ciência da Computação com Python para as turmas 1 a 4",
          },
          fumec: {
            cargo: "Professor",
            org: "FUMEC",
            detalhe: "Ciência da Computação, Sistemas de Informação e Redes",
          },
        },
        artigos: {
          intro_one:
            "<b>{{count}} artigo</b> em periódicos científicos, de {{de}} a {{ate}}.",
          intro_other:
            "<b>{{count}} artigos</b> em periódicos científicos, de {{de}} a {{ate}}.",
        },
        formacao: {
          intro:
            "Os trabalhos finais e os slides das defesas estão no repositório <repo>trabalhos-finais</repo>.",
          tipos: {
            tese: "Tese",
            dissertacao: "Dissertação",
            monografia: "Monografia (TCC)",
          },
          orientador: "Orientador:",
          doutorado: {
            nivel: "Doutorado",
            curso: "Sistemas de Informação e Gestão do Conhecimento",
            org: "Universidade FUMEC",
          },
          mestrado: {
            nivel: "Mestrado",
            curso: "Sistemas de Informação e Gestão do Conhecimento",
            org: "Universidade FUMEC",
          },
          graduacao: {
            nivel: "Bacharelado",
            curso: "Ciência da Computação",
            org: "Universidade FUMEC",
          },
          pdl: {
            nivel: "Educação executiva",
            curso: "PDL - Programa de Desenvolvimento da Liderança",
            org: "Fundação Dom Cabral",
            modulos: {
              lideres_de_lideres: "Líderes de Líderes",
              lideres_de_equipes: "Líderes de Equipes",
            },
          },
        },
        disciplinas: {
          intro_one:
            "<b>{{count}} disciplina</b> em {{instituicoes}} instituições, com o material aberto no GitHub: clique para abrir o repositório.",
          intro_other:
            "<b>{{count}} disciplinas</b> em {{instituicoes}} instituições, com o material aberto no GitHub: clique para abrir o repositório.",
          agora: "neste semestre ({{semestre}})",
          contagem_one: "{{count}} disciplina",
          contagem_other: "{{count}} disciplinas",
          siglas: {
            igti: "XP Educação (IGTI)",
          },
        },
        vivencia: {
          docencia: "Docência",
          lideranca: "Liderança e gestão de pessoas",
          desenvolvimento: "Desenvolvimento de software",
          documentacao: "Documentação ágil",
          implantacao: "Implantação de sistemas em âmbito global",
          legado: "Manutenção de sistemas legados",
          design_patterns: "Design patterns",
          scrum: "Scrum",
          lean: "Lean",
        },
        clientes: {
          oi: { nome: "Oi", desc: "Oi Telecomunicações" },
          anp: { nome: "ANP", desc: "Agência Nacional do Petróleo, Gás Natural e Biocombustíveis" },
          bb: { nome: "Banco do Brasil", desc: "Banco do Brasil S/A" },
          vsb: { nome: "VSB", desc: "Vallourec Sumitomo Tubos do Brasil" },
          prosegur: { nome: "Prosegur", desc: "Logística e transporte de valores" },
          hotmilhas: { nome: "HotMilhas", desc: "Milhas aéreas" },
          "123milhas": { nome: "123milhas", desc: "Viagens e milhas aéreas" },
          jedis: { nome: "Jedis", desc: "Tecnologia e recrutamento" },
          mereo: { nome: "Mereo", desc: "Gestão de performance e pessoas" },
          afya: { nome: "Afya", desc: "Líder em graduação médica no Brasil" },
          autoglass: {
            nome: "AutoGlass",
            desc: "A maior loja virtual de vidros automotivos da América Latina",
          },
          allos: { nome: "Allos", desc: "Plataforma de entretenimento" },
          bhtec: {
            nome: "CIS · BH-TEC",
            desc: "Centro de Inteligência em Sustentabilidade do Parque Tecnológico de Belo Horizonte",
          },
          mrv: { nome: "MRV", desc: "MRV Engenharia" },
          pmmg: { nome: "PMMG", desc: "Polícia Militar de Minas Gerais" },
          apac: {
            nome: "APAC Feminina BH",
            desc: "Associação de Proteção e Assistência aos Condenados",
          },
          mario_penna: { nome: "Instituto Mário Penna" },
          fisioterapia: {
            nome: "Fisioterapia PUC Minas",
            desc: "Centro Clínico de Fisioterapia da PUC Minas - Coração Eucarístico",
          },
          enfermagem: {
            nome: "Enfermagem PUC Minas",
            desc: "Departamento de Enfermagem da PUC Minas - Coração Eucarístico e Betim",
          },
          icei: { nome: "ICEI PUC Minas", desc: "Instituto de Ciências Exatas e Informática da PUC Minas" },
        },
        pessoal: {
          rotulos: {
            time: "Time",
            hobbies: "Hobbies",
            serie: "Série favorita",
            assistindo: "Assistindo",
          },
          time: "Atleticano, torço para o <galo>galão</galo> 🐓",
          hobbies: {
            mu: "Mu Online",
            tibia: "Tibia",
            basquete: "basquete",
            violao: "violão",
          },
          passaporte: "Carimbos no passaporte",
          passaporte_total: "{{lugares}} destinos · {{continentes}} continentes",
          continentes: {
            america_do_sul: "América do Sul",
            europa: "Europa",
            asia: "Ásia",
          },
          lugares: {
            brasil: "Brasil",
            argentina: "Argentina",
            uruguai: "Uruguai",
            alemanha: "Alemanha",
            franca: "França",
            italia: "Itália",
            vaticano: "Vaticano",
            suica: "Suíça",
            japao: "Japão",
            coreia_do_sul: "Coreia do Sul",
            china: "China",
            hong_kong: "Hong Kong",
            macau: "Macau",
            tailandia: "Tailândia",
            indonesia: "Indonésia",
            singapura: "Singapura",
            malasia: "Malásia",
            dubai: "Dubai",
            abu_dhabi: "Abu Dhabi",
          },
        },
        veja_tambem: "veja também",
      },
      boasvindas: {
        nome: "Professor",
        titulo: "Aramuni",
        subtitulo: "Prof. Dr. João Paulo Carneiro Aramuni",
        escudo_alt: "Escudo do Clube Atlético Mineiro",
        bemvindo: "$ Boas-vindas ao meu Portfólio",
        cargo1: "Professor de Engenharia de Software e Ciência da Computação na PUC Minas",
        consultoria: "Consultor de Tecnologia na",
        cargo2: "CTO na Agência Experimental de Software",
        orientacao: "Orientador de TCCI e TCCII",
        formacao1:
          "Doutor e Mestre em Sistemas de Informação e Gestão do Conhecimento",
        formacao2: "Bacharel em Ciência da Computação",
        local: "Belo Horizonte, Minas Gerais, Brasil",
        esporte: "Torcedor do Clube Atlético Mineiro",
        ajuda: "Digite `ajuda` para conhecer os comandos ou `pergunta` para saber mais sobre mim.",
      },
      contato: {
        titulo: "Entre em Contato",
        subtitulo:
          "Sinta-se à vontade para se conectar ou me enviar uma mensagem.",
        nome: "Seu nome",
        email: "Seu email",
        mensagem: "Sua mensagem...",
        enviar: "Enviar",
        voltar_terminal: "Voltar ao terminal",
        sucesso: "✅ Mensagem enviada com sucesso!",
        erro: "❌ Erro ao enviar, tente novamente.",
        enviando: "⏳ Enviando sua mensagem...",
        enviando_botao: "Enviando...",
        captcha_pendente: "🤖 Confirme que você não é um robô.",
        captcha_comando: "$ verificar --humano",
        captcha_dica: "# confirme que você é humano para enviar",
        captcha_ok: "✔ humano verificado",
        captcha_indisponivel:
          "⚠️ A verificação anti-spam não carregou. Me mande um email direto.",
      },
      guestbook: {
        titulo: "📖 Livro de Visitas",
        subtitulo: "Compartilhe sua mensagem ou leia o que outros visitantes escreveram.",
        hint: "Comandos disponíveis:",
        listar: "listar mensagens",
        adicionar: "adicionar mensagem",
        ajuda: "mostrar ajuda",
        carregando: "Carregando mensagens...",
        vazio: "Nenhuma mensagem ainda.",
        form_placeholder: "Formulário de adicionar mensagem aparecerá aqui.",
        descricao: "abrir o livro de visitas",
        exemplo_list: "Exemplo do comando list:",
        exemplo_add: "Exemplo do comando add:",
        example_name: "João",
        example_message: "Olá do terminal!",
        uso: "Uso:",
        nome_label: "Seu nome",
        mensagem_label: "Sua mensagem",
        enviando: "Enviando sua mensagem...",
        sucesso: "Mensagem enviada com sucesso!",
        erro: "Erro ao enviar mensagem.",
        voltar_terminal: "Voltar ao terminal",
      },
      jogo: {
        voltar_terminal: "Voltar ao terminal",
        pontuacao: "Pontuação: ",
        gameover: "GAME OVER! Pressione R para reiniciar",
        achievements: {
          phd: "🎓 Doutor em Sistemas de Informação e Gestão do Conhecimento - Universidade FUMEC (2017-2020)",
          masters:
            "🎓 Mestre em Sistemas de Informação e Gestão do Conhecimento - Universidade FUMEC (2014-2015)",
          bachelor:
            "🎓 Graduação em Ciência da Computação - Universidade FUMEC (2010-2013)",
          professorSoftware:
            "👨‍🏫 Professor de Engenharia de Software - PUC Minas (Fundamentos de Projeto, Análise de Algoritmos, Laboratórios e TCC II)",
          cto: "💻 CTO da Agência Experimental de Software - ICEI, PUC Minas (gestão de 6 times, ~30 pessoas)",
          techLead: "👨‍💻 Tech Lead & Back-end Lead - Trybe (2020-2023)",
          professorSoftwareXP:
            "👨‍🏫 Professor de Arquitetura de Software - XP Educação",
          professorNewtonPaiva:
            "👨‍🏫 Professor de Linguagens de Programação, Arquitetura Web e Banco de Dados - Centro Universitário Newton Paiva",
          professorPOOFUMEC:
            "👨‍🏫 Professor de POO, Compiladores e FTC - Universidade FUMEC (2016-2020)",
          professorDestaqueNewtonPaiva:
            "🏆 Professor destaque do curso de Sistemas de Informação - Newton Paiva (2023)",
          patron:
            "🏆 Patrono da turma de Ciência da Computação 1SEM/2020 - FUMEC",
          teamAwardProsegur: "🏅 Mejor Trabajo en Equipo - Prosegur (2015)",
          techSkills:
            "💻 Experiência em AWS, Python, Java, C, C++, Spring Boot, DevOps, Cloud Architecture e Observabilidade",
          consultancy:
            "💼 Consultoria em arquitetura de sistemas, monitoramento e AI para recrutamento técnico",
          devExperience:
            "🔧 Desenvolvimento e manutenção de software para Capgemini, Prosegur, Banco do Brasil, HotMilhas, 123milhas, PMMG e outras instituições",
        },
      },
      habilidades: {
        titulo: "Habilidades",
        nenhuma: "Nenhuma habilidade cadastrada ainda.",
        nivel: {
          avancado: "Avançado",
          intermediario: "Intermediário",
          basico: "Básico",
        },
        verRepositorio: "Ver repositórios de {{name}} no GitHub",
        estilos: "Estilos:",
        skins: { terminal: "terminal", cards: "cards", lista: "lista", globo: "globo" },
        uso: "Uso: skills [--terminal | --cards | --lista | --globo] (sem opção, abre o terminal)",
        carregandoGlobo: "Carregando o globo...",
        globoDica: "Arraste para girar · clique numa skill para saber mais",
      },
      cal: {
        estilos: "Visões:",
        skins: { mes: "mes", semana: "semana", hoje: "hoje" },
        uso: "Uso: cal [--mes | --semana | --hoje] (sem opção, abre o mês)",
        dias_curtos: ["Do", "Se", "Te", "Qu", "Qu", "Se", "Sá"],
        dias_semana: ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"],
        horario: "Horário",
        semana_de: "Semana de {{intervalo}}",
        legenda: { aula: "dia com aula", feriado: "feriado", recesso: "recesso", hoje: "hoje" },
        info: {
          hoje: "hoje",
          proxima: "próxima",
          semestre: "semestre",
          semana: "semana",
          feriados: "sem aula",
          fuso: "fuso",
        },
        tipos: {
          feriado: "feriado",
          recesso: "recesso escolar",
          recesso_docente: "recesso docente",
          ferias: "férias docentes",
        },
        tipos_curtos: { recesso: "recesso", recesso_docente: "recesso docente", ferias: "férias" },
        colunas: {
          horario: "horário",
          disciplina: "disciplina",
          local: "local",
          quando: "quando",
          turma: "turma",
          codigo: "código",
        },
        turmas: "Turmas e salas",
        local: {
          predio: "Prédio {{numero}}",
          predio_curto: "P{{numero}}",
          andar: "{{numero}}º andar",
          sala: "sala {{numero}}",
          online: "Online ({{plataforma}})",
        },
        semestre_atual: "{{numero}}º · semana {{semana}} · termina em {{fim}}",
        semestre_ferias: "férias · aulas voltam em {{inicio}}",
        semestre_sem_calendario: "calendário da PUC deste ano ainda não cadastrado",
        n_aulas_one: "{{count}} aula",
        n_aulas_other: "{{count}} aulas",
        sem_aulas: "sem aulas",
        sem_aulas_hoje: "Sem aulas hoje.",
        especial_hoje: "{{tipo}}: {{nome}}. Sem aulas hoje.",
        fora_do_semestre: "Fora do semestre letivo. Sem aulas hoje.",
        sem_feriados: "nenhum neste mês",
        resumo_semana: "{{aulas}} aulas, {{horas}} em sala",
        em: "em {{tempo}}",
        termina_em: "termina em {{tempo}}",
        proxima_em: "Próxima aula em {{tempo}}:",
        nenhuma_proxima: "Nenhuma aula nas próximas semanas.",
        fuso: "Horário de Brasília (UTC−3)",
        campi: { coreu: "Coreu", lourdes: "Lourdes", oficinas: "Oficinas", teams: "Teams" },
        disciplinas: {
          diaw: "Desenvolvimento e Integração de Aplicações Web",
          diw: "Desenvolvimento de Interfaces Web",
          ti5: "TI:V - Aplicações Distribuídas",
          ti2: "TI:II - Front-end",
          tcc2: "Orientação TCC II",
          aes: "Reunião AES / CTOs",
          spring: "Oficina Spring Boot",
          devlabs: "Oficina DevLabs",
          aeds1: "Aulões de AEDS I",
          oficina_diw: "Oficina de DIW",
        },
        feriados: {
          confraternizacao: "Dia Mundial da Paz",
          carnaval: "Carnaval",
          sexta_santa: "Sexta-feira Santa",
          tiradentes: "Tiradentes",
          trabalho: "Dia do Trabalho",
          corpus_christi: "Corpus Christi",
          assuncao: "Assunção de Nossa Senhora (BH)",
          independencia: "Independência do Brasil",
          aparecida: "Nossa Senhora Aparecida",
          finados: "Finados",
          republica: "Proclamação da República",
          consciencia_negra: "Dia da Consciência Negra",
          imaculada: "Imaculada Conceição (BH)",
          natal: "Natal",
          cinzas: "Quarta-feira de Cinzas",
          semana_santa: "Semana Santa",
          dia_professor: "Dia do Professor e do Funcionário",
          ferias_docentes: "Férias coletivas do corpo docente",
          recesso_docente: "Recesso do corpo docente",
        },
      },
      wakatime: {
        titulo: "Tempo programando",
        desde: "Desde {{data}}",
        estilos: "Estilos:",
        skins: { terminal: "terminal", grade: "grade", lista: "lista", cards: "cards" },
        uso: "Uso: wakatime [--terminal | --grade | --lista | --cards] (sem opção, abre o terminal)",
        status: {
          loading: "Buscando minhas estatísticas no WakaTime",
          pending: "O WakaTime ainda está calculando as estatísticas. Tente de novo em instantes.",
          error: "Não consegui falar com o WakaTime agora. Os cards continuam funcionando: wakatime --cards",
        },
        indicadores: {
          total: "Total",
          mediaDiaria: "Média diária",
          diasAtivos: "Dias ativos",
          editorPrincipal: "Editor",
        },
        notas: {
          total_one: "em {{count}} linguagem",
          total_other: "em {{count}} linguagens",
          mediaDiaria: "nos dias com código",
          diasAtivos: "de {{total}} dias",
          editorPrincipal: "{{percent}} do tempo",
        },
        resumo: "<b>{{total}}</b> no total · média de <b>{{media}}</b> por dia",
        secoes: {
          linguagens: "linguagens",
          editores: "editores",
          categorias: "categorias",
          sistemas: "sistemas operacionais",
        },
        maisLinguagens_one: "+ {{count}} linguagem",
        maisLinguagens_other: "+ {{count}} linguagens",
        maisOutros_one: "+ {{count}} outro",
        maisOutros_other: "+ {{count}} outros",
        nomes: {
          texto: "Texto",
          outro: "Outros",
          coding: "Programando",
          building: "Compilando",
          debugging: "Depurando",
          aiCoding: "Programando com IA",
          writingDocs: "Escrevendo docs",
          writingTests: "Escrevendo testes",
          runningTests: "Rodando testes",
          manualTesting: "Testes manuais",
          codeReviewing: "Revisando código",
          browsing: "Navegando",
          researching: "Pesquisando",
          learning: "Estudando",
          designing: "Desenhando",
          meeting: "Reuniões",
          planning: "Planejando",
          communicating: "Comunicando",
        },
      },
      stats: {
        titulo: "GitHub Stats",
        estilos: "Gráficos:",
        skins: {
          resumo: "resumo",
          linguagens: "linguagens",
          atividade: "atividade",
          horarios: "horarios",
          repos: "repos",
          tudo: "tudo",
        },
        uso: "Uso: stats [--resumo | --linguagens | --atividade | --horarios | --repos | --tudo] (sem opção, abre o resumo)",
        secoes: {
          resumo: "resumo",
          linguagens: "linguagens",
          atividade: "atividade",
          horarios: "horários dos commits",
          repos: "visitas dos repositórios",
        },
        status: {
          loading: "Buscando no GitHub",
          limit: "O limite de consultas da API do GitHub foi atingido. Tente de novo em alguns minutos.",
          error: "Não consegui buscar esses dados agora.",
          curto: { limit: "limite da API", error: "indisponível" },
        },
        progresso: "{{done}} de {{total}} repositórios",
        dias_zero: "{{valor}} dias",
        dias_one: "{{valor}} dia",
        dias_other: "{{valor}} dias",
        diasUnidade_zero: "dias",
        diasUnidade_one: "dia",
        diasUnidade_other: "dias",
        perfil: { desde: "No GitHub desde {{ano}}" },
        indicadores: {
          contribuicoes: "Contribuições",
          commits: "Commits",
          pullRequests: "Pull requests",
          issues: "Issues",
          estrelas: "Estrelas",
          forks: "Forks",
          seguidores: "Seguidores",
          repositorios: "Repositórios",
          sequenciaAtual: "Sequência atual",
          maiorSequencia: "Maior sequência",
          melhorDia: "Melhor dia",
          visitas: "Visitas ao perfil",
        },
        notas: {
          desde: "desde {{ano}}",
          ultimos12: "nos últimos 12 meses",
          total: "no total",
          emRepos_one: "em {{count}} repositório",
          emRepos_other: "em {{count}} repositórios",
          seguindo: "seguindo {{valor}}",
          publicos: "públicos",
          desdeData: "desde {{data}}",
          semSequencia: "nenhuma em andamento",
          visitas: "no perfil do GitHub",
        },
        linguagens: {
          porRepos: "Linguagem principal de <b>{{total}}</b> dos {{repos}} repositórios",
          porBytes: "<b>{{total}}</b> de código em {{repos}} repositórios",
          repos_one: "{{count}} repo",
          repos_other: "{{count}} repos",
          outras_one: "+ {{count}} outra",
          outras_other: "+ {{count}} outras",
        },
        atividade: {
          total: "Total de contribuições",
          hoje: "hoje",
          ateHoje: "até hoje",
          calendario: "<b>{{valor}}</b> contribuições nos últimos 12 meses",
          menos: "Menos",
          mais: "Mais",
          celula_one: "{{valor}} contribuição em {{data}}",
          celula_other: "{{valor}} contribuições em {{data}}",
          celulaZero: "Nenhuma contribuição em {{data}}",
          melhorDoPeriodo: "Melhor dia: {{texto}}",
          porAno: "Contribuições por ano",
          semAnos: "Nenhuma contribuição registrada ainda.",
          porDia: "Por dia da semana",
          contribuicoes_one: "{{valor}} contribuição",
          contribuicoes_other: "{{valor}} contribuições",
        },
        horarios: {
          resumo: "Pico às <b>{{hora}}</b> · <b>{{percent}}</b> dos commits são {{quando}}",
          quando: {
            madrugada: "de madrugada",
            manha: "de manhã",
            tarde: "à tarde",
            noite: "à noite",
          },
          periodos: {
            madrugada: "Madrugada",
            manha: "Manhã",
            tarde: "Tarde",
            noite: "Noite",
          },
          leitura: "{{faixa}} · {{percent}} · ≈ {{valor}} commits",
          legenda: "Fatia dos commits em cada hora do dia",
          nota: "Estimativa com uma amostra de {{amostra}} dos {{total}} commits dos últimos 12 meses · horário de Brasília",
          vazio: "Nenhum commit nos últimos 12 meses.",
        },
        repos: {
          resumo: "<b>{{valor}}</b> visualizações em {{count}} repositórios",
          semLinguagem: "Sem linguagem (material de aula)",
          nota: "Contadores RepoViews (views-counter), o mesmo badge do README de cada repositório.",
        },
      },
      turmas: {
        titulo: "Acompanhamento de turmas de TI",
        carregando: "Carregando as turmas de TI...",
        pendentes_one: "{{count}} grupo ainda sem dados. Os repositórios são privados e o site não busca nada sozinho: rode npm run turmas no terminal do projeto (com GITHUB_TOKEN no .env.local ou o GitHub CLI logado) e recarregue a página. Este aviso só aparece no npm run dev.",
        pendentes_other: "{{count}} grupos ainda sem dados. Os repositórios são privados e o site não busca nada sozinho: rode npm run turmas no terminal do projeto (com GITHUB_TOKEN no .env.local ou o GitHub CLI logado) e recarregue a página. Este aviso só aparece no npm run dev.",
        subtitulo: "Trabalhos Interdisciplinares no GitHub · {{semestre}}º semestre de {{ano}} · semana {{semana}} · dados de {{data}}",
        filtro: "Filtro: {{texto}}",
        estilos: "Gráficos:",
        skins: {
          resumo: "resumo",
          codigo: "codigo",
          linguagens: "linguagens",
          ritmo: "ritmo",
          equilibrio: "equilibrio",
          prs: "prs",
          projetos: "projetos",
          tudo: "tudo",
        },
        uso: "Uso: turmas [ti2 | ti5] [lourdes | coreu] [g1 … | nome do grupo] [--resumo | --codigo | --linguagens | --ritmo | --equilibrio | --prs | --projetos | --tudo]",
        secoes: {
          resumo: "resumo",
          codigo: "linhas de código",
          linguagens: "linguagens",
          ritmo: "ritmo de commits",
          equilibrio: "equilíbrio do grupo",
          prs: "pull requests e issues",
          projetos: "projetos",
        },
        nenhum: "Nenhum grupo com esse filtro.",
        grupos_one: "{{count}} grupo",
        grupos_other: "{{count}} grupos",
        material: "material da disciplina",
        outras: "Outras",
        commits_one: "{{valor}} commit",
        commits_other: "{{valor}} commits",
        linhas_one: "{{valor}} linha",
        linhas_other: "{{valor}} linhas",
        semDados: {
          sem_acesso: "sem acesso ao repositório",
          vazio: "repositório vazio",
          pendente: "ainda sem dados",
        },
        semDadosDica: "rode npm run turmas com um token que leia o repositório",
        aviso: "Dados de {{data}}: a última atualização falhou",
        quando: {
          hoje: "hoje",
          ontem: "ontem",
          dias_one: "há {{count}} dia",
          dias_other: "há {{count}} dias",
          nunca: "sem commits",
        },
        kpis: {
          grupos: "Grupos com dados",
          commits: "Commits",
          linhas: "Linhas de código",
          prs: "PRs mergeados",
          issues: "Issues fechadas",
          parados: "Parados há +{{dias}} dias",
          integrantes: "Integrantes com commits",
          ultimo: "Último commit",
        },
        alertas: {
          parado: "sem commits há {{dias}} dias",
          semCommits: "nenhum commit no semestre",
          inativos_one: "{{count}} integrante sem commits",
          inativos_other: "{{count}} integrantes sem commits",
          concentrado: "um integrante fez {{fatia}} dos commits",
        },
        alertasCurtos: {
          parado: "parado há {{dias}} dias",
          semCommits: "sem commits",
          inativos_one: "{{count}} sem commits",
          inativos_other: "{{count}} sem commits",
          concentrado: "1 integrante: {{fatia}}",
        },
        tabela: {
          legenda: "Grupos e as métricas do GitHub. Os cabeçalhos ordenam a tabela.",
          grupo: "Grupo",
          commits: "Commits",
          linhas: "Linhas",
          prs: "PRs",
          issues: "Issues",
          ultimo: "Último commit",
          alertas: "Alertas",
          abertos_one: "+{{count}} aberto",
          abertos_other: "+{{count}} abertos",
          abertas_one: "+{{count}} aberta",
          abertas_other: "+{{count}} abertas",
          dica: "Clique no cabeçalho de uma coluna para ordenar. PRs = mergeados; issues = fechadas.",
        },
        codigo: {
          resumo: "<b>{{linhas}}</b> linhas de código em {{count}} grupos",
          nota: "Linhas não vazias de todas as branches: cada arquivo conta uma vez, na versão com mais linhas. Ficam de fora dependências, build, código gerado, Markdown e a pasta docs/.",
        },
        linguagens: {
          resumo: "{{count}} linguagens nos {{grupos}} grupos, por linhas de código",
          principal: "{{nome}} {{percent}}",
          nenhuma: "ainda sem código",
        },
        ritmo: {
          resumo: "<b>{{commits}}</b> commits desde {{inicio}} · média de {{media}} por semana",
          semana: "S{{n}}",
          leitura_one: "Semana {{n}} ({{de}} a {{ate}}): {{valor}} commit",
          leitura_other: "Semana {{n}} ({{de}} a {{ate}}): {{valor}} commits",
          emAndamento: "em andamento",
          legenda: "Commits por semana desde o início do semestre",
          nota: "Commits de todas as branches, sem merges, bots e professores. Parado = mais de {{dias}} dias sem commit.",
        },
        equilibrio: {
          legenda: "Cada parte é um integrante, sem identificação, de quem fez mais commits para quem fez menos (a mesma ordem nas duas barras). Quanto mais a primeira parte passa da marca de fatia igual, mais concentrado está o trabalho.",
          legendaMaior: "integrante com mais commits",
          legendaDemais: "demais integrantes",
          igual: "fatia igual",
          fantasma: "integrante sem commits (lista do README)",
          integrante: "Integrante {{n}}",
          commits: "commits",
          linhas: "linhas",
          ativos: "{{ativos}} de {{total}} com commits",
          ativosSemTotal_one: "{{count}} com commits",
          ativosSemTotal_other: "{{count}} com commits",
          maior: "maior fatia: {{fatia}}",
          nota: "Só alunos: professores, orientadores e bots ficam de fora. Autores juntados por login, e-mail e nome. Linhas = linhas de código adicionadas. Alerta a partir de {{fatia}} dos commits.",
        },
        prs: {
          resumo: "<b>{{mergeados}}</b> PRs mergeados, {{abertos}} abertos · <b>{{fechadas}}</b> issues fechadas, {{abertas}} abertas",
          prs: "Pull requests",
          issues: "Issues",
          mergeados: "mergeados",
          abertos: "abertos",
          fechados: "fechados sem merge",
          fechadas: "fechadas",
          abertas: "abertas",
          legendaConcluido: "mergeados / fechadas",
          legendaAberto: "abertos",
          semApi: "sem dados da GitHub API",
          semApiTodos: "Ainda sem dados de pull requests: rode o npm run turmas de novo quando o limite da GitHub API voltar.",
          nota: "Mesma escala para todos os grupos da disciplina. PRs e issues abertos por bots (Dependabot) ou por professores ficam de fora.",
        },
        projetos: {
          semDescricao: "README sem descrição.",
          integrantes_one: "{{count}} integrante",
          integrantes_other: "{{count}} integrantes",
          docs: "{{valor}} linhas de documentação",
          branches_one: "{{count}} branch",
          branches_other: "{{count}} branches",
          repositorio: "repositório",
          deploy: "deploy",
        },
      },
      canvas: {
        titulo: "Tarefas no Canvas",
        carregando: "Carregando as tarefas do Canvas...",
        uso: "Uso: canvas [diw | ti5 …] [es | cc] [coreu | lourdes] [g1 …] [--resumo | --tarefas | --agenda | --tudo]",
        subtitulo: "Minhas disciplinas no Canvas · {{semestre}}º semestre de {{ano}} · entregas de {{data}}, às {{hora}}",
        semDados: "Ainda sem dados do Canvas.",
        semDadosDev: "O site nunca fala com o Canvas: rode npm run canvas no terminal do projeto (com CANVAS_TOKEN no .env.local) e recarregue a página. Este aviso só aparece no npm run dev.",
        filtro: "Filtro: {{texto}}",
        nenhum: "Nenhuma disciplina com esse filtro.",
        estilos: "Seções:",
        skins: {
          resumo: "resumo",
          tarefas: "tarefas",
          agenda: "agenda",
          tudo: "tudo",
        },
        secoes: {
          resumo: "Resumo",
          tarefas: "Tarefas",
          agenda: "Agenda",
        },
        kpis: {
          disciplinas: "Disciplinas",
          alunos: "Alunos",
          abertas: "Pela frente",
          semana: "Vencem em {{dias}} dias",
          aCorrigir: "A corrigir",
          taxa: "Entrega média",
        },
        kpiDicas: {
          alunos: "Alunos ativos (sem filtro, quem está em duas disciplinas conta uma vez)",
          abertas: "Tarefas com prazo pela frente",
          aCorrigir: "Entregas esperando correção",
          taxa: "Alunos que entregaram as tarefas que já venceram (dispensados não contam)",
        },
        proxima: {
          titulo: "Próxima entrega",
          nenhuma: "Nenhuma tarefa com prazo pela frente.",
          quando: "{{data}}, às {{hora}}",
          mesmoDia_one: "+ {{count}} outra tarefa vence no mesmo dia",
          mesmoDia_other: "+ {{count}} outras tarefas vencem no mesmo dia",
        },
        urgencia: {
          urgente: "vence em menos de 24 h",
        },
        tempo: {
          dias_one: "{{count}} dia",
          dias_other: "{{count}} dias",
          diasHoras: "{{dias}} e {{horas}} h",
          horasMinutos: "{{horas}} h {{minutos}} min",
          minutos_one: "{{count}} min",
          minutos_other: "{{count}} min",
          em: "em {{tempo}}",
          venceu: "venceu há {{tempo}}",
          unidades: {
            dias_one: "dia",
            dias_other: "dias",
            horas: "horas",
            minutos: "min",
            segundos: "seg",
          },
        },
        dia: {
          hoje: "hoje",
          amanha: "amanhã",
          ontem: "ontem",
          emDias_one: "em {{count}} dia",
          emDias_other: "em {{count}} dias",
        },
        entregas: {
          aberta: "<b>{{entregues}}</b> de {{esperados}} já entregaram",
          vencida: "<b>{{entregues}}</b> de {{esperados}} entregaram ({{pct}})",
          atrasadas_one: "{{count}} atrasada",
          atrasadas_other: "{{count}} atrasadas",
          faltando_one: "{{count}} faltando",
          faltando_other: "{{count}} faltando",
          dispensados_one: "{{count}} dispensado",
          dispensados_other: "{{count}} dispensados",
          aCorrigir_one: "{{count}} a corrigir",
          aCorrigir_other: "{{count}} a corrigir",
          semAlunos: "sem alunos ativos",
          semDados: "sem dados de entrega",
          papel: "entrega presencial (fora do Canvas)",
          sem_entrega: "sem entrega",
          legenda: {
            noPrazo: "no prazo",
            atrasadas: "atrasadas",
            faltando: "faltando",
            pendentes: "ainda não entregaram",
            dispensados: "dispensados",
          },
        },
        tipos: {
          grupo: "em grupo",
          quiz: "quiz",
          discussao: "fórum",
          externa: "ferramenta externa",
          papel: "presencial",
          sem_entrega: "sem entrega",
          porTurma: "prazo de uma das turmas",
        },
        datas: {
          prazosPorTurma: "prazos por turma: {{datas}}",
          abre: "abre {{data}} às {{hora}}",
          fecha: "aceita atrasadas até {{data}} às {{hora}}",
        },
        semana: {
          titulo: "próximos {{dias}} dias",
          nenhuma: "Nada vence nos próximos {{dias}} dias.",
        },
        tabela: {
          titulo: "disciplinas",
          legenda: "Disciplinas no Canvas com o curso, alunos, tarefas, próxima entrega, entregas e o que falta corrigir.",
          disciplina: "Disciplina",
          curso: "Curso",
          alunos: "Alunos",
          tarefas: "Tarefas",
          proxima: "Próxima entrega",
          taxa: "Entrega",
          aCorrigir: "A corrigir",
          vencidas: "{{vencidas}}/{{total}}",
          dica: "Clique no cabeçalho de uma coluna para ordenar. Tarefas = vencidas / total. Entrega = alunos que entregaram as tarefas que já venceram.",
        },
        tarefas: {
          resumo: "<b>{{abertas}}</b> pela frente · {{vencidas}} já venceram · {{semPrazo}} sem prazo",
          abertas: "pela frente",
          vencidas: "já venceram",
          semPrazo: "sem prazo",
          mostrarTodas_one: "mostrar {{count}} anterior",
          mostrarTodas_other: "mostrar as {{count}} anteriores",
          mostrarMenos: "mostrar menos",
          nota: "Entregas dos alunos ativos de cada disciplina, atualizadas em {{data}} às {{hora}}. Dispensados não contam no total.",
        },
        agenda: {
          resumo: "<b>{{tarefas}}</b> prazos e <b>{{eventos}}</b> eventos até {{ate}}",
          vazio: "Nada na agenda até {{ate}}.",
          diaTodo: "dia todo",
          tarefa: "prazo",
          evento: "evento",
          ateFim: "mostrar até o fim do semestre ({{data}})",
          proximos: "mostrar só os próximos {{dias}} dias",
          nota: "Tarefas e eventos do calendário das disciplinas no Canvas, com os feriados e recessos do calendário da PUC.",
        },
        cursos: {
          ES: "Engenharia de Software",
          CC: "Ciência da Computação",
        },
      },
      calendly: {
        titulo: "Agende uma reunião pelo Calendly",
        carregando: "Carregando a agenda...",
      },
      curriculo: {
        titulo: "Currículo",
        paginas_one: "{{count}} página",
        paginas_other: "{{count}} páginas",
        zoom: "Zoom",
        zoom_menos: "Diminuir o zoom",
        zoom_mais: "Aumentar o zoom",
        zoom_ajustar: "Ajustar à largura",
        baixar: "Baixar PDF",
        abrir: "Abrir em nova aba",
        arquivo: "Curriculo-Joao-Paulo-Aramuni.pdf",
        carregando: "Carregando o PDF...",
        erro: "Não foi possível mostrar o PDF aqui. Baixe ou abra em uma nova aba pelos botões acima.",
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
      ask: {
        comando: "pergunta",
        nome: "João Paulo",
        selo: "IA",
        selo_title: "Resposta gerada por IA, na minha voz, com base no meu currículo e neste portfólio",
        ola: "Oi! Sou o João Paulo. Pode me perguntar o que quiser sobre a minha trajetória, as minhas aulas, os meus projetos ou sobre mim fora do terminal, que eu respondo por aqui.",
        experimente: "Experimente (clique para escrever no terminal):",
        sugestoes: [
          "quem é você?",
          "quais disciplinas você leciona?",
          "o que é a Agência Experimental de Software?",
          "como foi sua passagem pela Trybe?",
          "quantos TCCs você já orientou?",
          "o que você faz fora do trabalho?",
        ],
        aviso:
          "As respostas são geradas por IA (Google Gemini) a partir do meu currículo e deste portfólio, e podem conter erros. Eu lembro das últimas perguntas desta conversa: pergunta --nova começa outra.",
        preencher: "Clique para escrever no terminal",
        digitando: "João Paulo está digitando...",
        nova: "Conversa nova: esqueci as perguntas anteriores. Pode perguntar!",
        erros: {
          pergunta_vazia: "Escreva a pergunta depois do comando, ex.: pergunta quem é você?",
          pergunta_longa: "Pergunta muito longa: até {{max}} caracteres.",
          limite: "Calma, muitas perguntas seguidas!",
          espera_one: "Tente de novo em {{count}} segundo.",
          espera_other: "Tente de novo em {{count}} segundos.",
          espera_depois: "Você chegou ao limite de perguntas por hoje: volte mais tarde.",
          limite_ia:
            "Muita gente perguntando agora e a cota gratuita da IA acabou por enquanto. Tente daqui a pouco, ou fale comigo pelo contato.",
          sem_chave: "O comando pergunta ainda não está configurado neste servidor (falta a GEMINI_API_KEY).",
          indisponivel: "O comando pergunta não está disponível nesta versão do site.",
          rede: "Não consegui falar com o servidor. Confira sua conexão e tente de novo.",
          tempo: "A IA demorou demais para responder. Tente de novo.",
          vazia: "Fiquei sem palavras... Tente perguntar de outro jeito.",
          falha_ia: "Não consegui responder agora. Tente de novo daqui a pouco.",
        },
      },
      ajuda: {
        titulo: "Comandos disponíveis:",
        sobre: { desc: "Mostra quem sou: trajetória, disciplinas, números e um pouco de mim fora do terminal." },
        ajuda: { desc: "Mostra esta lista de comandos disponíveis." },
        experiencias: {
          desc: "Mostra minha trajetória profissional e experiências.",
        },
        contato: { desc: "Exibe minhas informações de contato e envia email." },
        limpar: { desc: "Limpa o histórico do terminal." },
        tema: { desc: "Troca o tema na ordem escuro → claro → galo (tema --escuro | tema --claro | tema --galo)." },
        recomendacoes: { desc: "Exibe minhas recomendações do LinkedIn." },
        github: { desc: "Exibe meus repositórios usando a GitHub API." },
        premios: { desc: "Exibe prêmios e reconhecimentos." },
        projetos: { desc: "Exibe meus projetos desenvolvidos." },
        calendly: { desc: "Agende uma reunião comigo via Calendly." },
        cal: { desc: "Mostra meus horários de aula no estilo cal (cal --semana | --hoje)." },
        habilidades: { desc: "Exibe minhas habilidades em programação (skills --cards | --lista | --globo muda o estilo)." },
        spotify: { desc: "Mostra o que estou ouvindo e últimas reproduções." },
        wakatime: {
          desc: "Mostra meu tempo de código (wakatime --grade | --lista | --cards muda o estilo).",
        },
        stats: {
          desc: "Mostra minhas estatísticas do GitHub (stats --repos | --tudo muda o gráfico).",
        },
        neofetch: {
          desc: "Mostra as informações do sistema com o escudo do Galo, no estilo neofetch.",
        },
        jogos: {
          desc: "Próximos jogos do Galo: contagem regressiva e campeonato (jogos --todos | --tabela).",
        },
        curriculo: {
          desc: "Exibe meu currículo com visualização em PDF.",
        },
        lattes: {
          desc: "Mostra meu Lattes: docência, TCCs, TIs, projetos da AES e bancas (lattes --pdf baixa o PDF).",
        },
        turmas: {
          desc: "Acompanhamento de turmas de TI no GitHub (turmas ti5 --ritmo | --tudo).",
        },
        canvas: {
          desc: "Tarefas do Canvas: próxima entrega e prazos (canvas --tarefas | --agenda).",
        },
        aragame: { desc: "Jogue o Flappy Plane diretamente no terminal web." },
        guestbook: { desc: "Deixe uma mensagem no meu livro de visitas público." },
        design: { desc: "Mostra o design system do portfólio: fontes, cores, espaçamentos e marca." },
        pergunta: { desc: "Uma IA responde o que quiser sobre mim (ex.: pergunta quem é você?)." },
        dicas: {
          titulo: "Dicas:",
          historico: "↑ / ↓ navegam pelos comandos já digitados",
          autocomplete: "Tab completa os comandos; Tab duas vezes lista as opções.",
        },
      },
      lattes: {
        titulo: "Currículo Lattes",
        carregando: "Carregando o currículo Lattes...",
        atualizado: "atualizado em {{data}}",
        estilos: "Seções:",
        skins: {
          resumo: "resumo",
          docencia: "docencia",
          tccs: "tccs",
          interdisciplinares: "tis",
          aes: "aes",
          bancas: "bancas",
          tudo: "tudo",
          pdf: "pdf",
        },
        uso: "Uso: lattes [--resumo | --docencia | --tccs | --tis | --aes | --bancas | --tudo | --pdf] (sem opção, abre o resumo)",
        secoes: {
          resumo: "resumo",
          docencia: "docência",
          tccs: "TCCs orientados",
          interdisciplinares: "trabalhos interdisciplinares orientados",
          aes: "projetos da Agência Experimental de Software",
          bancas: "bancas",
        },
        tipos: {
          tccs: "TCCs orientados",
          interdisciplinares: "Trabalhos interdisciplinares",
          aes: "Projetos da AES",
          bancas: "Bancas",
        },
        legenda: {
          tccs: "TCCs",
          interdisciplinares: "Interdisciplinares",
          aes: "AES",
          bancas: "Bancas",
        },
        legenda_curta: { tccs: "TCCs", interdisciplinares: "TIs", aes: "AES", bancas: "Bancas" },
        kpi: {
          periodo: "de {{inicio}} a {{fim}}",
          disciplinas_one: "{{count}} disciplina",
          disciplinas_other: "{{count}} disciplinas",
          cursos_one: "{{count}} curso",
          cursos_other: "{{count}} cursos",
          alunos_one: "{{count}} aluno",
          alunos_other: "{{count}} alunos",
          parcerias_one: "{{count}} em parceria",
          parcerias_other: "{{count}} em parceria",
        },
        total_one: "trabalho orientado ou avaliado desde {{inicio}}",
        total_other: "trabalhos orientados ou avaliados desde {{inicio}}",
        niveis: {
          graduacao: "Graduação",
          especializacao: "Especialização",
          mestrado: "Mestrado",
          qualificacao: "Qualificação",
          doutorado: "Doutorado",
        },
        niveis_contagem: {
          graduacao_one: "{{count}} de graduação",
          graduacao_other: "{{count}} de graduação",
          especializacao_one: "{{count}} de especialização",
          especializacao_other: "{{count}} de especialização",
          mestrado_one: "{{count}} de mestrado",
          mestrado_other: "{{count}} de mestrado",
          qualificacao_one: "{{count}} de qualificação",
          qualificacao_other: "{{count}} de qualificação",
          doutorado_one: "{{count}} de doutorado",
          doutorado_other: "{{count}} de doutorado",
        },
        por_ano: "por ano",
        por_instituicao: "por instituição",
        por_curso: "por curso",
        grafico: {
          parte: "{{valor}} {{tipo}}",
          nada: "nenhum",
        },
        tabela: {
          instituicao: "Instituição",
          curso: "Curso",
          disciplinas: "Disciplinas",
          disciplinas_curta: "Disc.",
          total: "Total",
        },
        sem_instituicao: "Não informada",
        sem_curso: "Não informado",
        nota_aes_curso: "Os projetos da AES reúnem alunos de vários cursos, por isso não entram nesta tabela.",
        nota_disciplinas_total: "As disciplinas lecionadas vêm do {{cmd}} e ficam fora do total, que soma só os trabalhos orientados ou avaliados.",
        nota_disciplinas_curso: "Uma disciplina oferecida para mais de um curso (como as da Newton Paiva) conta em cada um deles.",
        tecnologias: {
          titulo: "tecnologias nos projetos",
          intro_one: "Linguagens e frameworks mais usados em {{count}} projeto (TIs e AES).",
          intro_other: "Linguagens e frameworks mais usados nos {{count}} projetos (TIs e AES).",
          item_one: "{{tech}}: {{count}} projeto",
          item_other: "{{tech}}: {{count}} projetos",
        },
        ver_projeto: "Abrir projeto",
        cursos: {
          ciencia_da_computacao: "Ciência da Computação",
          engenharia_de_software: "Engenharia de Software",
          sistemas_de_informacao: "Sistemas de Informação",
          sistemas_de_informacao_e_gestao_do_conhecimento:
            "Mestrado em Sistemas de Informação e Gestão do Conhecimento",
          fisioterapia: "Fisioterapia",
          analise_e_desenvolvimento_de_sistemas: "Análise e Desenvolvimento de Sistemas",
          redes_de_computadores: "Redes de Computadores",
          arquitetura_de_software: "Arquitetura de Software",
          desenvolvimento_web: "Desenvolvimento Web",
        },
        disciplinas: {
          aplicacoes_web: "Aplicações Web",
          front_end: "Front-end",
          aplicacoes_para_cenarios_reais: "Aplicações para Cenários Reais",
          aplicacoes_distribuidas: "Aplicações Distribuídas",
        },
        tccs: {
          intro_one: "{{count}} trabalho de conclusão de curso orientado, de {{inicio}} a {{fim}}.",
          intro_other: "{{count}} trabalhos de conclusão de curso orientados, de {{inicio}} a {{fim}}.",
          qtd_one: "{{count}} trabalho",
          qtd_other: "{{count}} trabalhos",
        },
        interdisciplinares: {
          intro_one: "{{count}} projeto orientado nas disciplinas de Trabalho Interdisciplinar.",
          intro_other: "{{count}} projetos orientados nas disciplinas de Trabalho Interdisciplinar.",
          disciplina: "Trabalho Interdisciplinar {{numero}}: {{nome}}",
          qtd_one: "{{count}} projeto",
          qtd_other: "{{count}} projetos",
          detalhes_zero: "Detalhes",
          detalhes_one: "Detalhes e equipe ({{count}})",
          detalhes_other: "Detalhes e equipe ({{count}})",
        },
        aes: {
          intro_one: "{{count}} projeto da Agência Experimental de Software (AES) da PUC Minas, onde atuo como CTO.",
          intro_other: "{{count}} projetos da Agência Experimental de Software (AES) da PUC Minas, onde atuo como CTO.",
          qtd_one: "{{count}} projeto",
          qtd_other: "{{count}} projetos",
          parceiro: "Parceria: {{nome}}",
        },
        bancas: {
          intro_one: "{{count}} banca de trabalho de conclusão.",
          intro_other: "{{count}} bancas de trabalhos de conclusão.",
          qtd_one: "{{count}} banca",
          qtd_other: "{{count}} bancas",
          membros: "Banca: {{nomes}}",
        },
        docencia: {
          total: "lecionando desde {{inicio}}: {{disciplinas}}, {{cursos}} e {{instituicoes}}.",
          // Card de docência no lattes --resumo
          resumo: {
            titulo: "Docência",
            lecionando: "lecionando desde {{inicio}}",
            disciplinas_one: "disciplina lecionada",
            disciplinas_other: "disciplinas lecionadas",
            cursos_one: "curso",
            cursos_other: "cursos",
            instituicoes_one: "instituição de ensino",
            instituicoes_other: "instituições de ensino",
            barra: "Disciplinas lecionadas por instituição",
          },
          qtd_instituicoes_one: "{{count}} instituição",
          qtd_instituicoes_other: "{{count}} instituições",
          linha_do_tempo: "linha do tempo",
          por_instituicao: "tempo por instituição",
          por_curso: "tempo por curso",
          por_disciplina: "tempo por disciplina",
          disciplinas_por_instituicao: "disciplinas por instituição",
          nota_linha_do_tempo: "Barras cheias são períodos lecionando; vazadas, cargos de coordenação e liderança. Passe o mouse para ver as datas.",
          lecionando: "{{tempo}} lecionando",
          no_total: "{{total}} no total ({{lecionando}})",
          educacao_antes: "Somando os cargos de coordenação e liderança na Trybe, são",
          educacao_depois: "na educação.",
          legenda: { aula: "lecionando", cargo: "coordenação e liderança" },
          cargos_titulo: "Cargos na {{instituicao}}",
          nota_cargos: "Depois dos 8 meses lecionando, passei a cargos de coordenação e liderança, sem dar aulas no módulo.",
          nota_uniao: "O tempo por curso conta cada semestre uma vez, mesmo com várias disciplinas ao mesmo tempo.",
          notas: {
            trybe: "Na Trybe, Ciência da Computação com Python era um módulo de 2 meses do curso de Desenvolvimento Web, dado para as turmas 1, 2, 3 e 4 (8 meses no total). Também participei da turma piloto da escola, ajudando a montar o curso.",
          },
          ver_repositorio: "Abrir o repositório de {{nome}}",
          modalidades: {
            ead: "{{curso}} EaD",
            bootcamp: "{{curso}} (Bootcamp)",
            curso_livre: "{{curso}} (curso livre)",
          },
          modulo: "Módulo {{nome}}",
          modulos: { ciencia_da_computacao_com_python: "Ciência da Computação com Python" },
          tabela: {
            disciplina: "Disciplina",
            curso: "Curso",
            semestres: "Qtd. de Semestres",
            turmas: "Qtd. de Turmas",
            cargo: "Cargo",
            atividade: "Atividade",
            tempo: "Tempo",
            periodo: "Período",
          },
          tempo: {
            meses_one: "{{count}} mês",
            meses_other: "{{count}} meses",
            anos_one: "{{count}} ano",
            anos_other: "{{count}} anos",
            meio_one: "{{count}} ano e meio",
            meio_other: "{{count}} anos e meio",
            composto: "{{anos}} e {{meses}}",
          },
          observacoes: {
            newton: "Atualmente Newton Paiva Wyden",
            igti: "Atualmente Faculdade XP Educação",
            trybe: "Escola de Programação - Curso livre",
          },
        },
        pdf: {
          paginas_one: "{{count}} página",
          paginas_other: "{{count}} páginas",
          descricao: "Versão completa do meu currículo, exportada da Plataforma Lattes (CNPq).",
          baixar: "Baixar PDF",
          abrir: "Abrir em nova aba",
          lattes: "Ver no Lattes",
          indisponivel: "O PDF do Lattes ainda não foi publicado.",
        },
        nota_idioma: "",
      },
      design: {
        titulo: "Design System",
        intro: "As fontes, cores, espaçamentos e a marca do portfólio em um só lugar. As cores são lidas do theme.css enquanto a página roda: se um token mudar lá, muda aqui também.",
        nav: "Seções do design system",
        atual: "atual",
        principal: "principal",
        rodape: "Fonte das cores: src/theme/theme.css · Digite `tema` para trocar o tema do terminal.",
        temas: { dark: "escuro", light: "claro", galo: "galo" },
        secoes: {
          marca: {
            titulo: "Marca",
            intro: "Logo, banner da tela de boas-vindas e a janela do terminal, que é a identidade visual do site.",
          },
          cores: {
            titulo: "Cores",
            intro: "O tema escuro é o padrão e o claro sobrescreve os mesmos tokens. Os componentes usam só var(--token), nunca a cor direto. A exceção são as cores de marca (linguagens nas habilidades, no WakaTime e no stats): elas vêm dos arquivos de dados e escurecem sozinhas no tema claro.",
          },
          tipografia: {
            titulo: "Tipografia",
            intro: "Tudo em fonte monoespaçada, como em um terminal de verdade.",
          },
          espacamento: {
            titulo: "Espaçamento",
            intro: "Os valores de padding, margin e gap mais usados nos componentes, em rem (1rem = 16px). Ainda não viraram tokens no theme.css.",
          },
          raios: {
            titulo: "Raios",
            intro: "Os arredondamentos usados nos componentes e onde aparece cada um.",
          },
          breakpoints: {
            titulo: "Breakpoints",
            intro: "Larguras em que o layout se adapta (max-width). O 768px e o 480px valem para quase todos os componentes.",
          },
        },
        marca: {
          logo: "Logo",
          logo_alt: "Logo Aramuni: notebook com capelo de formatura e o nome Aramuni",
          logo_fundo: "fundo preto, sem transparência",
          logo_uso: "Usada como favicon (index.html).",
          banner: "Banner ASCII",
          banner_uso: "Abre a tela de boas-vindas. É feito com caracteres de bloco e diminui junto com a tela.",
          janela: "Janela do terminal",
          janela_nota: "Os botões da janela ({{cores}}) vêm da react-terminal-ui. O título e o prompt usam --terminal-chrome; o cursor usa --cursor.",
        },
        cores: {
          escala: "Escala cromática",
          escala_intro: "Todas as cores sólidas dos dois temas, agrupadas por família e ordenadas da mais escura para a mais clara. Passe o mouse em uma cor para ver os tokens que a usam.",
          tokens: "Tokens",
          tokens_intro: "Cada token nos dois temas, lado a lado. Em textos, ícones e marcas de gráfico, o selo mostra o contraste com o fundo do terminal: texto pede 4.5:1 (AA); ícones e marcas de gráfico (barras e faixas) pedem 3:1.",
          contraste_titulo: "Contraste com {{fundo}} no mesmo tema",
        },
        contraste: {
          aaa: "AAA",
          aa: "AA",
          grande: "só texto grande",
          baixo: "baixo",
          ok: "ok p/ ícone",
          grafico: "ok p/ gráfico",
        },
        familias: {
          neutros: "Neutros",
          verdes: "Verdes",
          amarelos: "Amarelos e laranjas",
          vermelhos: "Vermelhos e rosas",
          azuis: "Azuis",
          outros: "Roxos e outras",
        },
        colunas: { token: "Token", uso: "Uso" },
        grupos: {
          fundos: "Fundos e superfícies",
          bordas: "Bordas",
          texto: "Texto",
          destaque: "Destaque (verde da marca)",
          tags: "Tags",
          semanticas: "Cores semânticas",
          icones: "Ícones da tela de boas-vindas",
          calendario: "Calendário (cal)",
          lattes: "Lattes: tipos de produção",
          docencia: "Lattes: instituições (docência)",
          turmas: "Turmas de TI (turmas)",
          canvas: "Tarefas do Canvas (canvas)",
          scrollbar: "Scrollbar",
          efeitos: "Efeitos",
        },
        tokens: {
          "bg-page": "Fundo da página e trilho da scrollbar.",
          "bg-terminal": "Fundo do terminal (o mesmo da react-terminal-ui).",
          surface: "Cards de experiências, projetos, habilidades, WakaTime, stats e lattes, balões de dica dos gráficos e estes exemplos.",
          "surface-input": "Inputs e textarea (contato, guestbook).",
          track: "Fundo das barras e anéis das habilidades, do WakaTime e do stats.",
          border: "Borda padrão de cards e divisórias.",
          "border-input": "Borda de inputs e blocos de código.",
          text: "Texto principal.",
          "text-soft": "Texto de apoio com bastante contraste.",
          "text-muted": "Descrições, legendas e metadados.",
          "text-dim": "Horários do boot e textos de menor importância.",
          "terminal-chrome": "Título da janela e prompt.",
          cursor: "Cursor piscante do terminal.",
          accent: "Cor da marca: títulos, links e bordas de destaque.",
          "accent-hover": "Hover de botões e links verdes.",
          "accent-focus": "Borda de foco dos inputs (contato).",
          "link-hover": "Hover de links.",
          "on-accent": "Texto em cima de botões verdes (contraste com --accent).",
          "tag-bg": "Fundo das tags de tecnologia.",
          "tag-text": "Texto das tags (contraste com --tag-bg).",
          highlight: "Destaque amarelo, como em “$ Boas-vindas ao meu Portfólio”, e horários na grade do cal.",
          warn: "[ WARN ] na sequência de boot, erros do WakaTime e do stats e feriados no cal.",
          info: "[ INFO ] na sequência de boot, recessos e cabeçalhos da grade no cal.",
          success: "Mensagens de sucesso (guestbook).",
          "icon-school": "Ícone de formação (PUC Minas).",
          "icon-work": "Ícone de trabalho (Agência Experimental de Software) e anel e chama da sequência de contribuições (stats).",
          "icon-book": "Ícone de orientação (TCC).",
          "icon-location": "Ícone de localização.",
          "icon-mail-gmail": "E-mail pessoal (Gmail).",
          "icon-mail-puc": "E-mail da PUC Minas.",
          "icon-github": "Ícone do GitHub.",
          "scrollbar-thumb": "Barra de rolagem.",
          "scrollbar-thumb-hover": "Barra de rolagem com o mouse em cima.",
          "shadow-project-hover": "Sombra do card de projeto no hover.",
          "shadow-xp-hover": "Sombra do card de experiência no hover.",
          scanline: "Linhas do efeito de monitor CRT na sequência de boot.",
          "game-sky": "Céu do Flappy Plane.",
          "cal-coreu": "Aulas no campus Coração Eucarístico (cal).",
          "cal-lourdes": "Aulas no campus Lourdes (cal).",
          "cal-oficinas": "Oficinas (cal).",
          "cal-teams": "Reuniões online pelo Teams (cal).",
          "cal-tinta": "Intensidade do fundo das aulas na grade do cal --semana: a cor do campus nessa porcentagem (no claro é menor para manter o contraste do texto).",
          "lattes-tccs": "TCCs orientados: gráfico por ano, card do resumo e marca lateral das listas (lattes).",
          "lattes-interdisciplinares": "Trabalhos interdisciplinares (lattes).",
          "lattes-aes": "Projetos da Agência Experimental de Software (lattes).",
          "lattes-bancas": "Bancas (lattes).",
          "docencia-puc": "PUC Minas na linha do tempo, nas barras e nas tabelas do lattes --docencia e no card de docência do resumo.",
          "docencia-newton": "Newton Paiva (lattes --docencia).",
          "docencia-igti": "IGTI (lattes --docencia).",
          "docencia-trybe": "Trybe (lattes --docencia).",
          "docencia-fumec": "Universidade FUMEC (lattes --docencia).",
          "turmas-concluido": "PRs mergeados e issues fechadas (turmas --prs).",
          "turmas-aberto": "PRs e issues abertos (turmas --prs).",
          "turmas-ling-1": "Linguagem com mais linhas de código na disciplina (turmas --codigo e --linguagens). As 6 cores seguem a ordem de cada disciplina, sem filtro, então um filtro nunca troca a cor de uma linguagem.",
          "turmas-ling-2": "2ª linguagem da disciplina (turmas).",
          "turmas-ling-3": "3ª linguagem da disciplina (turmas).",
          "turmas-ling-4": "4ª linguagem da disciplina (turmas).",
          "turmas-ling-5": "5ª linguagem da disciplina (turmas).",
          "turmas-ling-6": "6ª linguagem da disciplina (turmas). O resto vira \"Outras\", em --text-dim.",
          "canvas-entregue": "Entregas no prazo na barra de cada tarefa (canvas).",
          "canvas-atrasada": "Entregas atrasadas (canvas).",
          "canvas-faltando": "Alunos que não entregaram uma tarefa que já venceu (canvas). Antes do prazo, quem ainda não entregou fica vazado, em cor neutra.",
          "canvas-urgente": "Prazo que vence em menos de 24 horas (canvas): a pílula de quanto falta, a folhinha e o card da próxima entrega, sempre com ícone.",
        },
        tipografia: {
          fira: {
            papel: "Fonte principal",
            desc: "Usada em todo o terminal. Tem ligaduras: => e != viram um símbolo só.",
          },
          jetbrains: {
            papel: "Alternativa",
            desc: "Entra se a Fira Code não carregar. Mesmo estilo e sem depender de rede: as duas ficam em src/assets/fonts.",
          },
          pilha: "Pilha de fontes do terminal",
          braille: "Pilha do neofetch (braille)",
          braille_desc: "A Fira Code e a JetBrains Mono não têm caracteres braille, então o escudo do neofetch usa fontes do sistema que têm.",
          regras: {
            monoespacada: "Tudo é monoespaçado: o portfólio é um terminal.",
            peso: "Só o peso 400 é carregado. O negrito (font-weight: bold) é gerado pelo navegador.",
            base: "A fonte base do terminal é 1rem e cai para 0.9rem até 768px e para 0.85rem até 480px.",
            input: "O input do terminal tem 16px, o mínimo para o iOS não dar zoom ao digitar.",
          },
          escala: "Escala de tamanhos",
          tamanhos: {
            titulo_secao: {
              exemplo: "Habilidades",
              uso: "Títulos de seção: habilidades, WakaTime, prêmios, contato, guestbook e o nome no sobre.",
            },
            titulo_card: {
              exemplo: "Portfólio Terminal",
              uso: "Títulos de card: projetos e experiências.",
            },
            destaque: {
              exemplo: "$ Boas-vindas ao meu Portfólio",
              uso: "Destaques e ícones: boas-vindas, aliases da ajuda.",
            },
            corpo: {
              exemplo: "Professor de Engenharia de Software na PUC Minas",
              uso: "Corpo do texto (base do terminal).",
            },
            dica: {
              exemplo: "Digite `guestbook add` para deixar sua mensagem.",
              uso: "Dicas e descrições curtas.",
            },
            tag: {
              exemplo: "React · Vite · Supabase",
              uso: "Tags de tecnologia.",
            },
          },
        },
        raios: {
          r0: "Input do guestbook.",
          r2: "Células do gráfico de contribuições (stats), segmentos das barras no estilo terminal (habilidades e WakaTime), o dia de hoje no cal, os quadradinhos de legenda (lattes e sobre), barras e fatias do turmas e as bandeiras do passaporte (sobre).",
          r3: "Sigla do curso na grade do cal.",
          r4: "Contorno de foco do botão de tema e ponta arredondada das barras dos gráficos (stats, lattes e turmas).",
          r6: "Linhas do estilo terminal (habilidades e WakaTime), logos de empresa, tags e carimbos do passaporte do sobre, amostras de cor e balões de dica dos gráficos (lattes e turmas).",
          r8: "Botões, inputs, card de experiência e logos dos cards do sobre.",
          r10: "Contêineres de seção: habilidades, WakaTime, stats, lattes, sobre, contato, currículo, calendly, turmas e este; cards do stats, do lattes, do sobre e dos projetos do turmas.",
          r12: "Card de projeto, indicadores do WakaTime e do turmas e logos das listas de habilidades e WakaTime.",
          r14: "Cards com anel de progresso (habilidades e WakaTime).",
          r20: "Barra de rolagem.",
          pill: "Tags de tecnologia (também no lattes), selos, chips do cabeçalho do sobre e barras de progresso (pílula). Nos CSS aparece como 999px ou 9999px.",
          circle: "Avatares, marcadores da linha do tempo e spinners.",
        },
        breakpoints: {
          bp1280: "Habilidades, WakaTime, stats, lattes e sobre: a moldura passa de 50% para 70% da largura (turmas: de 60% para 75%).",
          bp900: "Cards de projetos, prêmios, recomendações e sobre põem a imagem acima do texto. Habilidades e WakaTime ocupam a largura toda e, no estilo terminal, a barra desce para a linha de baixo. A moldura do stats, do lattes, do sobre e do turmas também ocupa a largura toda, e o turmas --equilibrio põe o nome de cada grupo em cima das barras.",
          bp768: "Tablet e celular: a fonte base cai para 0.9rem e os componentes se reorganizam.",
          bp600: "Celular nos comandos mais novos: o cal quebra cada linha da agenda em duas, o stats esconde os detalhes dos repositórios e o lattes compacta gráficos e tabelas (no --docencia, o nome da disciplina vai para cima da barra) o sobre põe os números e as duas linhas do tempo em uma coluna só e o turmas põe o nome de cada grupo em cima do gráfico.",
          bp500: "Flappy Plane: placar e textos menores.",
          bp480: "Celular pequeno: fonte base de 0.85rem e menos espaçamento. Cards de habilidades, WakaTime e stats em 2 colunas.",
        },
      },
      projetos: {
        titulo: "Meus Principais Projetos",
        carregando: "Carregando projetos...",
        nenhum: "Nenhum projeto encontrado.",

        python_proj_title: "Projetos Python",
        python_proj_desc:
          "Coleção de projetos em Python, incluindo automação, análise de dados, desenvolvimento web e aprendizado de máquina. Mostram aplicação prática de algoritmos, integração com APIs, manipulação de dados e criação de interfaces interativas, oferecendo soluções de ferramentas utilitárias, compressores, geradores de arte, simuladores e analisadores de métricas de código.",

        springboot_proj_title: "Projetos Spring Boot",
        springboot_proj_desc:
          "Coleção de projetos em Java com Spring Boot, incluindo APIs REST, integração com bancos SQL e NoSQL, autenticação JWT, processamento de dados e funcionalidades web. Mostram arquitetura, serviços com interface de usuário, integração com APIs como Huggingface e MercadoPago, compressão de arquivos, mensageria e login seguro, oferecendo portfólio conciso de soluções backend.",

        c_proj_title: "Projetos Linguagem C",
        c_proj_desc:
          "Coleção de projetos em C e C++, incluindo algoritmos, estruturas de dados, recursão, ponteiros, structs, arquivos e controle de fluxo. Compilados com MinGW/GCC, vão de calculadoras e jogos simples até multiplicação de matrizes, manipulação de arquivos, simulações e algoritmos de ordenação, oferecendo portfólio de fundamentos da programação, lógica, eficiência e boas práticas.",

        portfolio_proj_title: "Portfólio Pessoal",
        portfolio_proj_desc:
          "Portfólio em React e Vite que simula um terminal para navegar entre projetos, experiências e premiações. Inclui componentes como ProjectCard e ExperienceCard, exibindo informações de forma dinâmica. Suporta múltiplos idiomas e integra mini-jogo, oferecendo experiência divertida. Combina design moderno, navegação intuitiva e funcionalidades interativas.",

        github_proj_title: "GitHub Readme Profile",
        github_proj_desc:
          "Projeto para construção de perfis no GitHub, com READMEs personalizados, estatísticas, badges, gráficos de atividade e contribuições. Inclui integração com WakaTime e Spotify, exemplos de perfis interativos, guias de boas práticas, elementos visuais dinâmicos e geração automática de conteúdo. Objetivo é fornecer portfólio completo e atraente, destacando habilidades e projetos.",

        stor_proj_title:
          "STOR - Plataforma de Gestão Integrada de Projetos e Ativos",
        stor_proj_desc:
          "O STOR é uma solução modular que apoia a aplicação do BIM (Business Information Modelling), integrando todas as etapas de projetos de engenharia, manutenção e operação. A plataforma permite controlar documentos, materiais, compras e processos em uma planta virtual, reduzindo custos, eliminando desperdícios e aumentando a qualidade do produto final.",

        anp_proj_title: "SIMP, I-SIMP, SIGEP, I-SIGEP",
        anp_proj_desc:
          "Projetos desenvolvidos para a ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis), voltados à gestão de informações de exploração, produção e movimentação de petróleo, gás e derivados. Incluíram modernização do SIGEP/i-SIGEP para envio seguro de documentos com protocolos e assinaturas digitais, além do SIMP/i-SIMP para monitoramento integrado da cadeia downstream.",

        prosegur_proj_title: "SOL - Sistema de Operações Logísticas",
        prosegur_proj_desc:
          "O Projeto SOL da Prosegur unifica os sistemas de logística de valores em vários países, permitindo controlar operações, recursos, veículos, pessoas, rotas e serviços. É uma plataforma robusta, parametrizável e de fácil manutenção, incorporando as melhores funcionalidades existentes e facilitando o trabalho da equipe de análise.",

        hotmilhas_proj_title: "HotMilhas Crawlers",
        hotmilhas_proj_desc:
          "Desenvolvimento de crawlers em Python 3 para programas de milhas aéreas, com automação de navegadores e extração estruturada de dados. Inclui criação de APIs RESTful para integração com sistemas internos, uso de arquitetura cloud (AWS) escalável, containers Docker e pipelines de CI/CD no GitLab. Projeto com mensageria (SQS, Redis) e observabilidade via Grafana e New Relic.",

        aes_proj1_title: "Landing Page - Agência Experimental de Software",
        aes_proj1_desc:
          "A Landing Page da AES apresenta a agência, capta demandas e destaca projetos e talentos das equipes. Facilita a comunicação entre clientes e desenvolvedores, oferecendo envio direto de demandas às equipes responsáveis. Também divulga a agência, mostrando projetos, conquistas, talentos e serviços, funcionando como uma vitrine para o mercado conhecer o potencial da AES.",

        aes_proj2_title: "Grade Inteligente - Agência Experimental de Software",
        aes_proj2_desc:
          "A Grade Inteligente ajuda alunos a organizar sua matriz curricular, oferecendo visualização gráfica das disciplinas ao longo dos períodos. Permite reorganizar matérias conforme preferências, acompanhar progresso acadêmico, explorar disciplinas de outros cursos e planejar escolhas futuras, proporcionando uma experiência de aprendizado mais completa, personalizada e flexível.",

        aes_proj3_title: "Cuido Bem - Agência Experimental de Software",
        aes_proj3_desc:
          "O CuidoBem é um projeto da PUC Minas, em parceria com o Instituto Mário Penna e o Centro Clínico de Fisioterapia, que visa apoiar a desospitalização de pacientes com câncer. O aplicativo orienta os pacientes sobre práticas fisioterapêuticas em casa, substituindo a cartilha de papel por uma solução digital mais prática.",

        aes_proj4_title:
          "PMMG - Cartão Programa - Agência Experimental de Software",
        aes_proj4_desc:
          "O Cartão Programa é um projeto em parceria com a Polícia Militar de Minas Gerais, que visa facilitar o planejamento de itinerários dos policiais no estado. A solução digital substitui o processo manual atual e será acessada dentro do SIGOp, sistema utilizado para gestão e análise de informações operacionais.",

        aes_proj5_title:
          "PMMG - RH Concurso - Agência Experimental de Software",
        aes_proj5_desc:
          "O projeto RH Concurso é fruto da parceria entre a AES e a Polícia Militar de Minas Gerais, com o objetivo de modernizar e digitalizar os processos de seleção de candidatos. A solução proposta substitui a tramitação manual de documentos, garantindo maior rastreabilidade, confiabilidade e agilidade na análise de dados. O sistema será integrado ao ambiente da PMMG e trará impacto direto na eficiência da gestão de concursos públicos.",

        aes_proj6_title:
          "Mapa de Sustentabilidade - Agência Experimental de Software",
        aes_proj6_desc:
          "O projeto Mapa de Sustentabilidade, desenvolvido pela Agência Experimental de Software da PUC Minas em parceria com o Centro de Inteligência em Sustentabilidade (CIS) do BH-TEC, é uma iniciativa voltada ao mapeamento de ações sustentáveis em todo o estado de Minas Gerais. O mapeamento contribui para dar visibilidade a essas iniciativas, além de fornecer métricas que subsidiam discussões governamentais sobre sustentabilidade.",

        aes_proj7_title: "Ajuda-aí App - Agência Experimental de Software",
        aes_proj7_desc:
          "O Ajuda-aí é um aplicativo que otimiza o programa de apadrinhamento do curso de Engenharia de Software da PUC Minas. Centraliza informações dos participantes e melhora a comunicação entre padrinhos e apadrinhados. Com algoritmo de match avançado, garante que cada apadrinhado seja combinado com o padrinho mais adequado, oferecendo uma experiência personalizada.",

        aes_proj8_title:
          "Concreto Sustentável - Agência Experimental de Software",
        aes_proj8_desc:
          "O projeto Concreto Sustentável, desenvolvido pela Agência Experimental de Software (AES) da PUC Minas em parceria com a MRV Engenharia, tem como objetivo reduzir significativamente o descarte e desperdício de concreto nos processos construtivos da empresa — um dos principais desafios ambientais enfrentados pelo setor da construção civil.",
        
        aes_proj9_title:
          "APAC Feminina BH - Agência Experimental de Software",
        aes_proj9_desc:
          "O sistema da APAC Feminina BH (Associação de Proteção e Assistência aos Condenados), desenvolvido pela Agência Experimental de Software (AES) da PUC Minas em parceria com o Departamento de Enfermagem do ICBS da PUC Minas, é uma plataforma de gestão da farmácia que centraliza o controle de medicamentos das detentas, registrando entrada, distribuição e consumo, acompanhando cada tratamento individualmente e mantendo o estoque atualizado.",
          
        jedis_proj_title: "RHapido 2.0 - Jedis Tecnologia e Recrutamento",
        jedis_proj_desc:
          "O Rhapido 2.0 é um sistema de gestão de processos seletivos que utiliza inteligência artificial para agilizar e tornar mais eficiente o recrutamento de novos talentos. Desenvolvido com tecnologia de ponta, o sistema oferece uma triagem inteligente de currículos, reduzindo o tempo e o custo do processo seletivo.",
      },
      recomendacoes: {
        titulo: "Recomendações",
        nenhum: "Nenhuma recomendação cadastrada ainda.",
      
        rec72_relationship:
          "Em 29 de setembro de 2026, João Gabriel foi cliente de João Paulo",

        rec72_recommendation:
          "Tive a oportunidade de aprender muito com Aramuni, tanto na parte teórica quanto na prática. Seu suporte e seus direcionamentos foram importantes para minha evolução e, principalmente, para que eu passasse a enxergar a Engenharia de Software com uma visão mais ampla e profissional. Sou grato por todos os aprendizados e pelas reflexões que ele proporcionou ao longo desse processo, que certamente fizeram diferença na forma como vejo a área e minha própria trajetória profissional.",

        rec71_relationship:
          "Em 25 de setembro de 2026, Fernando foi cliente de João Paulo",

        rec71_recommendation:
          "Um dos melhores professores que tive. Realmente alguém que não só entende como gosta das ferramentas que usa e ensina. Sua didática e compreensão dos tópicos são sempre surpreendentes e sempre ajudam a situar e ensinar os alunos.",

        rec70_relationship:
          "Em 26 de junho de 2026, Eric respondia diretamente a João Paulo",

        rec70_recommendation:
          "Tive o prazer de trabalhar com João Paulo como meu orientador durante o Trabalho de Conclusão de Curso (TCC). Ao longo de todo o projeto, ele forneceu orientações valiosas não apenas sobre os aspectos técnicos do desenvolvimento, mas também sobre a documentação e a estruturação dos diagramas UML e de arquitetura. Seus feedbacks contribuíram de forma consistente para melhorar a qualidade e a clareza do nosso trabalho. O que mais admirei foi seu estilo de orientação: ele nos deu autonomia para tomar decisões e explorar soluções por conta própria, ao mesmo tempo em que sempre esteve disponível para esclarecer dúvidas, discutir ideias e oferecer feedbacks valiosos sempre que necessário. Esse equilíbrio entre independência e apoio tornou a experiência de aprendizado desafiadora e, ao mesmo tempo, extremamente enriquecedora. Recomendo fortemente o João Paulo a qualquer pessoa que esteja em busca de um orientador experiente, acessível e verdadeiramente comprometido com o desenvolvimento de seus alunos.",

        rec69_relationship:
          "Em 04 de maio de 2026, Pedro foi cliente de João Paulo",

        rec69_recommendation:
          "O professor João Paulo, mais conhecido como Aramuni tem bastante destaque pela excelência na condução das disciplinas de Tecnologia da Informação no curso de Engenharia de Software. Sua atuação é marcada por alto nível de competência técnica, profissionalismo e domínio aprofundado dos conteúdos ministrados. Possui uma didática clara e estruturada, consegue tornar compreensíveis temas complexos, sempre conectando teoria e prática de forma eficiente. Além disso, apresenta um diferencial importante ao incorporar conteúdos alinhados às demandas atuais do mercado, abordando tecnologias modernas e incentivando o uso de ferramentas e abordagens de ponta. Sua metodologia estimula o aprendizado contínuo, a autonomia dos alunos e o desenvolvimento de pensamento crítico, gerando assim uma preparação de forma consistente para os desafios reais da área. Outro ponto relevante é sua capacidade de motivar os estudantes a acompanharem a rápida evolução tecnológica, promovendo um ambiente dinâmico e orientado à inovação. Trata-se de um profissional comprometido com a qualidade do ensino e com a formação sólida de futuros engenheiros de software, sendo altamente recomendável.",

        rec68_relationship:
          "Em 27 de abril de 2026, Felipe foi cliente de João Paulo",

        rec68_recommendation:
          "Tive o João Paulo como professor na PUC Minas e posso dizer que é um excelente profissional. Sempre muito disponível, me ajudou diversas vezes com dúvidas relacionadas a projetos pessoais, demonstrando um real interesse no aprendizado dos alunos. Ele teve um papel importante no meu aprofundamento em arquitetura de software, trazendo uma visão prática e bem estruturada de um tema que considero essencial na área. Além disso, também compartilha ótimas dicas sobre carreira, o que agrega ainda mais valor à sua atuação como professor.",

        rec67_relationship:
          "Em 25 de abril de 2026, Artur foi cliente de João Paulo",

        rec67_recommendation:
          "Tenho a oportunidade de ser aluno do professor João Paulo Aramuni e posso afirmar que sua didática se destaca pela forma dinâmica e envolvente com que conduz as aulas. Um dos seus grandes diferenciais é o foco em atividades práticas, sempre incentivando o desenvolvimento de projetos com tecnologias relevantes para o mercado. Isso torna o aprendizado muito mais aplicado e próximo da realidade profissional. Além disso, é nítido o alto nível de conhecimento que ele possui, tanto no contexto acadêmico, como professor de Projeto de Software, estruturando e modelando soluções, quanto pela sua vivência de mercado, trazendo sempre uma visão prática e atualizada para as aulas. O professor Aramuni também está sempre disponível para apoiar os alunos, esclarecendo dúvidas e contribuindo de forma proativa no desenvolvimento de trabalhos e projetos, o que faz toda a diferença na evolução de quem está aprendendo. Sem dúvida, é um professor que impacta positivamente a formação dos alunos e os prepara de forma sólida para os desafios da área de tecnologia.",

        rec66_relationship:
          "Em 18 de dezembro de 2025, Tito era cliente de João Paulo",

        rec66_recommendation:
          "É com grande satisfação que recomendo o Professor João Paulo Aramuni. Como meu orientador de TCC, sua disponibilidade e conhecimento técnico foram cruciais para o desenvolvimento do software 'Keep', uma solução inovadora para o gerenciamento de parque de máquinas. Sua capacidade de guiar e estimular o pensamento crítico foi fundamental para o êxito do projeto e para meu desenvolvimento profissional, além de todo material complementar que ele me apresentou foram cruciais para meu melhor aprendizado.",

        rec65_relationship:
          "Em 16 de dezembro de 2025, Guilherme era cliente de João Paulo",

        rec65_recommendation:
          "Tive a sorte de ter o João Paulo Aramuni como professor na disciplina de Projeto de Software. Ele é aquele tipo de professor que não só domina o assunto, mas tem um jeito de explicar que faz tudo parecer mais simples. O que mais valorizo nele é a parceria: sempre acessível, pronto para trocar uma ideia sobre o mercado e dar aquelas dicas de carreira que a gente não encontra nos livros. É um profissional que torce de verdade pelo sucesso dos alunos. Recomendo demais!",

        rec64_relationship:
          "Em 12 de dezembro de 2025, Lucas era cliente de João Paulo",

        rec64_recommendation:
          "Tive o privilégio nesse semestre de ser aluno do professor João Paulo Aramuni em FPAA na Engenharia de Software. Além de dominar o conteúdo e explicar a matéria de forma clara, sempre esteve presente para tirar dúvidas, orientar sobre carreira e indicar estudos, e atividades extracurriculares que realmente agregam e contribuem para a formação acadêmica e profissional dos seus alunos. Um professor competente, acessível e comprometido com o desenvolvimento dos alunos.",

        rec63_relationship:
          "Em 25 de novembro de 2025, Leonardo respondia a João Paulo",

        rec63_recommendation:
          "Aprender com o João Paulo Aramuni foi uma das melhores experiências que tive. Ele explica tudo de um jeito claro, direto e sem enrolação, mesmo quando o assunto é complicado. Dá pra ver que ele realmente entende do que fala e, mais importante, sabe ensinar de verdade. O que mais gosto nele é que ele não fica só no conteúdo da aula: ele puxa exemplos do mercado, dá dicas de carreira, mostra caminhos e realmente se preocupa com o nosso desenvolvimento. Já me ajudou em dúvidas técnicas, decisões de projeto e até em como pensar melhor como profissional. É um professor que motiva, que soma e que faz a diferença. Quem tiver a chance de aprender com ele, aproveite, vale muito a pena.",

        rec62_relationship:
          "Em 19 de novembro de 2025, Bruna era cliente de João Paulo",

        rec62_recommendation:
          "O João Paulo demonstra clareza na comunicação, domínio técnico e uma preocupação genuína em gerar impacto positivo por meio de seus projetos e iniciativas. Sua trajetória revela comprometimento, capacidade de liderança e uma busca contínua por aprendizado — características que fazem dele um destaque em sua área. É evidente que ele é um profissional que agrega valor onde atua, não apenas pelo conhecimento que possui, mas também pela forma como compartilha insights e inspira outros profissionais ao seu redor. Recomendo sua conexão e seu trabalho a todos que procuram alguém com visão, competência e postura exemplar.",

        rec61_relationship:
          "Em 18 de novembro de 2025, Otávio era cliente de João Paulo",

        rec61_recommendation:
          "Recomendo fortemente o João Paulo Aramuni como profissional e como professor. Tive a oportunidade de ser seu aluno em projetos de tecnologia e posso dizer que ele consegue unir, de forma rara, profundidade técnica com uma didática muito clara. João Paulo tem uma visão estratégica muito sólida, traz exemplos reais do mercado e sempre busca conectar teoria com prática, o que gera um impacto direto no resultado do trabalho. Além da competência técnica como CTO e Tech Lead, o que mais me chama atenção é a disponibilidade em ajudar e a preocupação genuína com o desenvolvimento das pessoas ao redor. Em diversos momentos ele saiu do “básico” esperado de um consultor/professor para orientar carreira, revisar decisões técnicas e sugerir caminhos mais sustentáveis para o projeto. É um profissional ético, atualizado e que realmente soma a qualquer equipe ou iniciativa em que esteja envolvido.",

        rec60_relationship:
          "Em 28 de outubro de 2025, Fernanda respondia a João Paulo",

        rec60_recommendation:
          "Tive a oportunidade de ser aluna do professor João Paulo Aramuni, e posso dizer que ele é um dos professores mais acessíveis e dedicados que já tive. Está sempre disposto a ajudar e realmente se preocupa com o aprendizado dos alunos, estando presente para o que for preciso: tirando dúvidas, orientando projetos ou dando conselhos sobre a carreira. É um profissional completo e uma pessoa incrível, que faz toda a diferença na trajetória acadêmica de quem tem a sorte de aprender com ele.",

        rec59_relationship:
          "Em 20 de outubro de 2025, Paulo respondia a João Paulo",

        rec59_recommendation:
          "João Paulo Aramuni foi meu professor em duas matérias muito importante na minha faculdade, Algoritmos e Estrutura de Dados 1 e Projeto de Software, sendo um professor que possui uma ótima didática e materiais espetaculares, principalmente no seu GitHub, tendo diversos slides, projetos, figmas e outros materiais que são essenciais para um bom desenvolvimento como aluno. Super indico como professor e desenvolvedor.",

        rec58_relationship:
          "Em 27 de setembro de 2025, Gabriel era cliente de João Paulo",

        rec58_recommendation:
          "Tenho o privilégio de ser aluno do professor Aramuni, e posso dizer com toda certeza que suas aulas vão muito além do conteúdo teórico. Ele tem uma abordagem extremamente conectada com o mercado, sempre trazendo exemplos reais, cases relevantes e convidando profissionais experientes da área para compartilhar vivências e desafios do dia a dia. Essa conexão prática com o mercado torna suas aulas muito mais ricas, atualizadas e inspiradoras. O professor Aramuni tem uma didática clara, objetiva e, ao mesmo tempo, instigante, sempre incentivando a reflexão crítica e o desenvolvimento profissional dos alunos.",

        rec57_relationship:
          "Em 16 de setembro de 2025, Davi respondia a João Paulo",

        rec57_recommendation:
          "Tive a oportunidade de conviver com o João Paulo durante o curso e posso dizer que ele é um cara muito gente boa, parceiro de verdade. Sempre aberto para trocar ideia, brincar, conversar e ao mesmo tempo mostrar que sabe muito do que fala. O que mais me chama atenção é a disposição em ajudar independente da hora, sempre com paciência e vontade de ver o outro crescer. Isso faz toda diferença no ambiente de aprendizado e mostra o quanto ele é colaborativo. Além disso, é notável o conhecimento técnico que ele tem, tanto em desenvolvimento quanto em boas práticas, o que dá segurança quando está explicando ou guiando alguma atividade. Recomendo muito o João Paulo, tanto pelo profissional que é quanto pela pessoa incrível que se mostra no dia a dia.",

        rec56_relationship:
          "Em 15 de setembro de 2025, Nataniel era cliente de João Paulo",

        rec56_recommendation:
          "Excelente Professor. Tem completo domínio do conteúdo lecionado, e transmite o conhecimento de maneira leve, didática, desmistificando conteúdos mais densos e complexos. Está sempre disponível, disposto a ajudar e contribuir para o crescimento pessoal e profissional dos alunos.",

        rec55_relationship:
          "Em 13 de setembro de 2025, Jonathan era cliente de João Paulo",

        rec55_recommendation:
          "Tive a oportunidade de ser aluno do professor João Paulo Aramuni e posso afirmar que sua forma de ensinar vai muito além do conteúdo técnico. Ele é um orientador que inspira, sempre disposto a auxiliar e tornar o aprendizado mais leve, humano e motivador. Os exercícios e projetos propostos em aula não apenas enriquecem o portfólio, mas também contribuem de forma significativa para o nosso desenvolvimento como estudantes e para a preparação para o mercado profissional. Sem dúvida, é um professor que deixa uma marca positiva na trajetória acadêmica e faz a diferença na formação dos alunos.",

        rec0_relationship:
          "Em 9 de setembro de 2025, Raphael respondia a João Paulo",

        rec0_recommendation:
          "O João Aramuni é, de longe, o melhor Professor que eu poderia ter na Universidade. As aulas são claras e o conteúdo apresentado é condizente com a realidade do mercado. Além de ótimo tutor, ele me deu uma oportunidade de ouro ao confiar em meu trabalho para liderar um dos maiores projetos da Agência Experimental de Software, impactando todo o Estado e mostrando que os alunos têm chances e que são mais que números na academia. Recomendo de olhos vendados este profissional e levo para a vida todos os aprendizados.",

        rec1_relationship:
          "Em 31 de agosto de 2025, Michelle Hanne trabalhava com João Paulo na mesma equipe",

        rec1_recommendation:
          "Aramuni é um excelente docente, comprometido com o desenvolvimento técnico e humano dos alunos. Se preocupa em desenvolver material didático, bem como oficinas que dão suporte aos alunos. Disciplinas como Fundamentos de Projeto, Análise de Algoritmos, Projeto de Software, Laboratórios de Desenvolvimento de Software entre outras, são de suma importância para a formação acadêmica e para formação em Engenharia de Software. Enfim, excelente líder técnico e competente profissional docente.",

        rec2_relationship:
          "Em 5 de agosto de 2025, Pedro respondia a João Paulo",

        rec2_recommendation:
          "I had the honor of working with Aramuni as my undergraduate thesis advisor, and I can confidently say that his mentorship extended far beyond academic guidance. From day one, he fostered an environment of trust, curiosity, and autonomy, encouraging independent thinking while always being available when needed. What impressed me most was his commitment. No matter how busy his schedule was, he consistently made time to meet, provide thoughtful feedback, and check in on my progress. Beyond his role as a thesis advisor, Aramuni is a truly passionate educator. He brings not only deep technical expertise to the table, but also a genuine sense of purpose in teaching and mentoring others.",

        rec3_relationship:
          "Em 30 de julho de 2025, Bernardo respondia a João Paulo",

        rec3_recommendation:
          "During the first semester of 2025, I had the privilege of working with Professor Aramuni as my thesis advisor. His guidance was instrumental throughout the process. He gave us the freedom to explore different technologies and encouraged independent thinking, while also providing clear and constructive feedback at every stage. What stood out most was his consistent availability — he always made time for me and my partner, setting up regular meetings and ensuring we felt supported. His calm demeanor and genuine care created a welcoming environment that made it easy for us to grow and develop. Professor Aramuni is an excellent mentor and a remarkable educator.",

        rec4_relationship:
          "Em 25 de julho de 2025, Luca respondia a João Paulo",

        rec4_recommendation:
          "Professor Aramuni is one of the most dedicated and inspiring educators I’ve ever had the privilege to learn from. Creative and constantly innovating, he brings not only a deep theoretical foundation to his classes but also a strong focus on real-world application through hands-on exercises, interactive quizzes, and practical projects — many of which are available for free on his GitHub. What truly sets him apart, however, is his availability and genuine care for each student. He consistently makes time for one-on-one meetings, offering mentorship on both academic and career paths. His extensive professional background enriches every class with real-world examples and valuable insights. In my case, the conversations I had with him over the past few months played a key role in shaping important career decisions. Being his student was not just a great academic experience — it was a transformative one.",

        rec5_relationship:
          "Em 19 de setembro de 2024, Flavio respondia a João Paulo",

        rec5_recommendation:
          "Durante aproximadamente um ano, tive o privilégio de ser aluno do professor João Paulo Aramuni. Ele se destaca não apenas pelo vasto conhecimento técnico, mas pela evidente paixão que nutre pela tecnologia, a qual transparece em cada uma de suas aulas. Sua abordagem diferenciada combina uma didática envolvente e dinâmica, que torna o aprendizado mais acessível e interessante. Além disso, sua capacidade de oferecer uma atenção individualizada a cada aluno demonstra seu compromisso com o desenvolvimento pessoal e acadêmico de todos, criando um ambiente onde cada um se sente valorizado e estimulado a crescer.",

        rec6_relationship:
          "Em 22 de agosto de 2024, Pedro respondia a João Paulo",

        rec6_recommendation:
          "Tive o privilégio de ser aluno do João, com quem aprendi muito sobre banco de dados e Java. Ele é um excelente mestre, muito competente e sempre disposto a ajudar! Ele demonstra total domínio das matérias, transformando conteúdos complexos em algo fácil de entender e aprender. Recomendo-o fortemente a qualquer um que deseje se aprofundar nessas áreas. Qualquer um que tenha a oportunidade de aprender com ele estará em boas mãos!",

        rec7_relationship:
          "Em 22 de agosto de 2024, Angélica e João Paulo estudavam na mesma instituição",

        rec7_recommendation:
          "Costumo dizer que o João foi 'picado pelo mosquito' que nos fez apaixonar pela docência. Ambos amávamos nossas carreiras, que nos consolidaram, mas, mesmo assim, a docência nos chamou, e hoje somos plenamente realizados nessa área. Além disso, o João é um verdadeiro parceiro, sempre atento a apoiar as pessoas que ele considera talentosas. Tenho o privilégio de ser uma dessas pessoas. Graças ao João, realizei o sonho de lecionar na graduação, e ele foi tão generoso que até me cedeu suas turmas. O que posso dizer de uma pessoa tão extraordinária? João, o mundo é seu, meu amigo! Conte comigo para deixarmos nossa marca na nova 'safra' de talentos em TI.",

        rec8_relationship:
          "Em 20 de agosto de 2024, Max e João Paulo estudavam na mesma instituição",

        rec8_recommendation:
          "Falar do João Aramuni é tarefa fácil, tive o privilégio de contar com sua ajuda em diversas ocasiões, e posso afirmar com segurança que ele é uma pessoa extraordinariamente inteligente e colaborativa. Seu espírito de equipe é simplesmente notável, sempre disposto a contribuir para o sucesso coletivo. Além de suas habilidades profissionais, ele possui um excelente convívio, sendo uma pessoa extremamente agradável e respeitosa. Sua capacidade de trabalhar bem com os outros e sua disposição em compartilhar conhecimentos fazem dele uma pessoa notável para qualquer equipe.",

        rec9_relationship:
          "Em 19 de agosto de 2024, Rubens Gabriel era cliente de João Paulo",

        rec9_recommendation:
          "Tive a sorte de ter o Professor João Aramuni como meu professor e orientador de TCC. Ele se destaca por tornar conceitos complexos mais acessíveis e por seu compromisso com o desenvolvimento dos seus alunos. Ele sempre esteve disponível para oferecer orientação e apoio, o que foi fundamental para o meu crescimento acadêmico. Recomendo para qualquer pessoa que tenha a oportunidade de trabalhar ou aprender com ele.",

        rec10_relationship:
          "Em 19 de junho de 2024, João Paulo era sênior em relação a Pedro, mas não supervisionava Pedro diretamente",

        rec10_recommendation:
          "João Paulo Aramuni é um professor muito bom, durante meu tempo em sua classe, fiquei impressionado com seu profundo conhecimento técnico e sua habilidade em transmitir conceitos complexos de forma clara e acessível. Sua abordagem didática incentiva a participação ativa dos alunos, promovendo um ambiente de aprendizagem colaborativo e enriquecedor. Além disso, sua paixão pela disciplina é evidente em cada aula, inspirando seus alunos a se esforçarem para alcançar excelência acadêmica.",

        rec11_relationship:
          "Em 1 de março de 2024, Tulio respondia a João Paulo",

        rec11_recommendation:
          "Tive o prazer de ser liderado pelo Aramuni durante a maior parte do tempo em que trabalhei na Trybe, e posso afirmar que foi uma liderança exemplar e inspiração como profissional. Sempre se preocupou com o desenvolvimento de seus liderados, apontando oportunidades dentro da empresa para evolução e incentivando a realização de cursos e leitura de livros. Sempre que levava observações de pontos de melhora na operação era incentivado pelo João a reunir dados e documentar fatos para que pudesse embasar discussões com lideranças de níveis superiores a fim de melhorar processos do time com um todo, o que rendeu mudanças em algumas tarefas que eram realizadas por todos os demais instrutores e especialistas da empresa. Recomendo fortemente tanto como liderança como referência técnica de computação.",

        rec12_relationship:
          "Em 8 de fevereiro de 2024, Luíza respondia a João Paulo",

        rec12_recommendation:
          "O professor Aramuni é um educador excepcional na área de Banco de Dados. Durante o período em que fui sua aluna, pude experimentar uma abordagem de ensino verdadeiramente didática, que fez toda a diferença em minha jornada acadêmica, não apenas domina profundamente o conteúdo, mas também possui a habilidade única de transmitir conceitos complexos de uma maneira clara e acessível. Sua abordagem leve e divertida torna as aulas envolventes, proporcionando um ambiente propício para o aprendizado. Além disso, sua paciência e disposição em ajudar os alunos foram essenciais para o meu desenvolvimento acadêmico. Tenho certeza de que ele continuará impactando positivamente a vida de seus alunos, assim como fez comigo.",

        rec13_relationship:
          "Em 30 de janeiro de 2024, Thiago respondia a João Paulo",

        rec13_recommendation:
          "O Professor João Paulo Aramuni, é um excelente professor! Quando iniciei na faculdade tive muita dificuldade com Java e estava tomando raiva/trauma da matéria, porém após as aulas, eu aprendi a gostar e com a ajuda dele comecei a me aperfeiçoar e melhorar cada vez mais. Sua forma de ensino é incrível e cativante, desmistificando aquilo que parece ser complexo, tornando para algo simples! Ele consegue abordar os detalhes e nos ensina não somente a fazer, mas entender o que estamos fazendo, sempre me deu muito apoio, mesmo fora da faculdade, sempre pude e posso contar com ele! Sou muito grato!",

        rec14_relationship:
          "Em 18 de dezembro de 2023, Carlos respondia a João Paulo",

        rec14_recommendation:
          "Trabalhar sob a liderança de Aramuni por 18 meses foi uma baita de uma experiência tanto para o meu desenvolvimento profissional quanto para o pessoal. Aramuni demonstrou ser um líder excepcional, fornecendo suporte contínuo, e a liberdade criativa que todo o time precisava seja para lecionar ou para criar um conteúdo de alta qualidade. Com seus conhecimentos sobre Python, algoritmos e raspagem de dados, Aramuni foi pedra angular na construção e operação do módulo de ciência da computação. Aprendi muito com ele, não só em termos técnicos, mas também em como ser um profissional mais completo e adaptável. Sou grato por toda a sua orientação e o considero um mentor, líder e amigo.",

        rec15_relationship:
          "Em 6 de novembro de 2023, João Vitor respondia a João Paulo",

        rec15_recommendation:
          "Atuando como minha liderança, o Aramuni me fez evoluir muito. Trouxe ótimos PDIs, discussões técnicas e, também, recomendações excelentes de estudo. Além disso, foi uma liderança que gerava oportunidades tanto para os menos experientes quanto para os mais experientes, favorecendo a confiança de todos os seus diretos. Possui uma ótima gestão de pessoas, todo o time o admirava. Ressalto, também, que além dos benefícios para crescimento e entrega dos liderados, ele mantinha o foco em gerar valor para o negócio, e com isso, fez entregas excelentes. Recomendo o Aramuni como uma liderança que pode agregar tanto para a empresa tanto para seus diretos.",

        rec16_relationship:
          "Em 25 de outubro de 2023, Tiago respondia a João Paulo",

        rec16_recommendation:
          "O Aramuni realiza uma liderança muito humana, com bastante atenção aos pontos de melhoria e o que é necessário fazer para atingir as metas. Sou muito grato por ter sido liderado por ele, e dizer que cresci muito como profissional e pessoa porque ele é um excelente ouvinte e super empático. A sua recomendação é muito merecida porque é um profissional extremamente comprometido e responsável, que não tem medo de dar a cara quando é preciso.",

        rec17_relationship: "Em 8 de junho de 2023, Eli respondia a João Paulo",

        rec17_recommendation:
          "É um prazer recomendar o Aramuni, ele foi minha liderança na Trybe e também acompanhei seu trabalho como Líder Técnico de Currículo de Ciência da Computação. Durante esse período, pude testemunhar suas habilidades excepcionais e seu comprometimento com o sucesso da equipe. Sua combinação única de conhecimento acadêmico, experiência prática e habilidades de liderança o tornam um profissional notável. Além disso, ele é uma pessoa incrível, sempre disposta a ajudar e contribuir com os outros. Sua orientação e apoio foram essenciais para minha evolução profissional, tanto em termos técnicos quanto em desenvolvimento pessoal. Sou extremamente grato por tudo o que aprendi com ele e recomendo-o com muito orgulho.",

        rec18_relationship:
          "Em 9 de maio de 2023, Cristiano respondia a João Paulo",

        rec18_recommendation:
          "Aramuni é uma pessoa que demonstra extrema responsabilidade com suas atribuições profissionais e é uma pessoa que tem o dom de saber se relacionar com as pessoas tornando o ambiente de trabalho local leve e agradável. Pessoalmente aprende rápido os processos, é extremamente focado em suas atividades, demonstra potencial técnico altíssimo, está sempre preocupado com sua constante evolução, isso tudo sem abandonar o carinho e cuidado com as pessoas. Gosto muito de trabalhar com ele pois aprendo muito e me torno um profissional melhor com seus exemplos e conselhos. Sou grato por essa oportunidade diária de parceria em atividades e desejo de coração manter essa relação produtiva por muito tempo.",

        rec19_relationship:
          "Em 12 de março de 2023, Will e João Paulo estudavam na mesma instituição",

        rec19_recommendation:
          "Excelente oportunidade que tive em trabalhar com o Aramuni, aprendi muito com ele. Afinal foi minha primeira experiência lecionando Programação, e ele me ensinou e muito. Ótimo Professor e Líder, sempre pontuando o time com feedbacks assertivos! Obrigado Aramuni!",

        rec20_relationship:
          "Em 7 de fevereiro de 2022, João Paulo era sênior em relação a André, mas não supervisionava André diretamente",

        rec20_recommendation:
          "O Aramuni consegue organizar pautas e trazer objetividade às reuniões, mantendo o time organizado e orientado. Além disso, é super calmo e gente boa, e sempre traz umas músicas suaves pros momentos descontraídos. Um cara muito legal para se trabalhar com =D",

        rec21_relationship:
          "Em 10 de agosto de 2021, Douglas respondia a João Paulo",

        rec21_recommendation:
          "Ter o Aramuni como instrutor foi uma das melhores experiências que eu tive na minha vida. Seus conselhos e direcionamento me fez perceber exatamente minhas qualidades e fraquezas tecnológicas. Hoje eu sei para onde eu vou, pois sei qual caminho percorrer. Paciência, calma, lucidez e estratégia para ensinar, me dava confiança que eu ia vencer qualquer etapa que por ventura surgia. Ele é brilhante como instrutor, lead, influênciador e um amigo para a vida toda.",

        rec22_relationship:
          "Em 2 de outubro de 2020, João Paulo era sênior em relação a Bruno, mas não supervisionava Bruno diretamente",

        rec22_recommendation:
          "Tive o prazer de ser Aluno e Orientado do TCC pelo João. Uma pessoa que sempre fez a diferença, no meio acadêmico, e que me ajudou e muito a me tornar o profissional que eu sou hoje. E como eu digo, professores brilhantes ensinam para uma profissão. Professores fascinantes como o João ensinam para a vida.",

        rec23_relationship:
          "Em 11 de setembro de 2020, Klelvin trabalhava com João Paulo na mesma equipe",

        rec23_recommendation:
          "Conheço o João tem bem uns 10 anos e compartilhei com ele vários momentos da vida durante a carreira. Foi colega de faculdade, colega de trabalho e se tornou um amigo de vida. Acadêmico dedicado, educador exemplar e profissional de atribuições ímpares. Quem dera todo lugar que eu trabalhasse tivesse um João Paulo.",

        rec24_relationship:
          "Em 25 de abril de 2020, Rafael trabalhava com João Paulo na mesma equipe",

        rec24_recommendation:
          "João é um profissional exemplar e por ter background acadêmico, está sempre aberto a aprender novas tecnologias e métodos. Ao mesmo tempo sempre está compartilhando conhecimento com todo mundo.",

        rec25_relationship:
          "Em 17 de novembro de 2018, Eduardo e João Paulo estudavam na mesma instituição",

        rec25_recommendation:
          "Tive o prazer de ser aluno do João Paulo na FUMEC e seguramente é um dos professores/profissionais mais competentes com o qual convivi. Sempre busca oferecer o melhor aos seus alunos, preparando aulas e projetos diferenciados. Trata-se de um profissional com bastante experiência e conhecimento.",

        rec26_relationship:
          "Em 27 de março de 2018, Bruno era cliente de João Paulo",

        rec26_recommendation:
          "É inefável os talentos exibidos pelo prof. João, o pouco que o conheço, como seu aluno, fica evidente suas qualidades profissionais e interpessoais. Sempre disponível mostra total interesse em fazer um excelente trabalho, no caso transmitir conhecimento. Se existe alguém o qual gostaria de ter como colega de equipe seria o João Paulo.",

        rec27_relationship:
          "Em 23 de março de 2018, Leonardo era cliente de João Paulo",

        rec27_recommendation:
          "João Paulo é um professor excepcional, mostra que a programação vai muito além da sintaxe. Guia o aluno em toda a busca pelo conhecimento, sendo não apenas professor, mas também companheiro. Extremamente aberto para responder quaisquer dúvidas e nos ajudar a evoluir.",

        rec28_relationship:
          "Em 20 de março de 2018, Rafaela era cliente de João Paulo",

        rec28_recommendation:
          "Eu conheço o João Paulo como 'Professor Aramuni', onde foi a primeira vez que tive contato com ele. Posso dizer que ele é um dois melhores professores que eu tive: super dedicado, explica bem a matéria e mostra ter conhecimento total do que ele está ensinando. Eu pedi bastante a sua ajuda no decorrer do curso e sempre recebi uma resposta rápida, foi ótimo! Ele faz o possível para nos incentivar a estudar, fala de vagas de emprego e estágio para os que estão precisando, e incentiva as pessoas a aprofundar seus estudos em cursos, livros, iniciação científica e até seguir para o mestrado e doutorado. Foi um prazer ter aula com ele, e espero trabalhar com ele no futuro!",

        rec29_relationship:
          "Em 19 de março de 2018, Pedro Henrique era cliente de João Paulo",

        rec29_recommendation:
          "Excelente professor! Mestre diferenciado em que está atualizado a novas metodologias de ensino! Intriga e desafia seus alunos a pensar diferente. Sempre disponível e atencioso!",

        rec30_relationship:
          "Em 19 de março de 2018, Henrique era cliente de João Paulo",

        rec30_recommendation: "Excelente professor, com dinâmica e paciência!",

        rec31_relationship:
          "Em 19 de março de 2018, Rubens era cliente de João Paulo",

        rec31_recommendation:
          "João Paulo é o tipo de professor que se propõe a garantir que o aluno assimile a matéria, tanto em sua didática quanto em sua postura perante a classe. Demonstra um grande conhecimento na área que leciona e se dispõe a entender e atender individualmente aos alunos. Fugindo do estereótipo de professor universitário que apenas 'te indica o caminho da aprendizagem'.",

        rec32_relationship:
          "Em 19 de março de 2018, Vicente era cliente de João Paulo",

        rec32_recommendation:
          "Como professor, Joāo Paulo tornou-se fundamental na minha formaçāo, tendo em vista que tive/tenho aprendido muito a fundo a programaçāo, se destaca em nāo ensinar o básico e sim o que é cobrado na pratica e no mercado de trabalho! A preocupaçāo e cuidado com o aprendizado de cada um, é ponto forte tambḿ, de modo que nāo mede esforços para que o aluno se capacite e consiga se destacar no mercado de trabalho. Sua experiencia no mercado de trabalho, faz com que tenhamos confiança no que está sendo passado e facilita o aprendizado quando explicita problemas reais que enfrentou em toda sua trajetória. Sou grato de ter um professor deste nivel em minha formaçāo academica.",

        rec33_relationship:
          "Em 19 de março de 2018, Igor era cliente de João Paulo",

        rec33_recommendation:
          "João Paulo é ótimo professor. Dedicado, sempre nos atende da melhor maneira. Tem uma metodologia de ensino atual que é compatível com as exigências do mercado de trabalho.",

        rec34_relationship:
          "Em 15 de fevereiro de 2018, Felipe Ferreira respondia a João Paulo",

        rec34_recommendation:
          "João Paulo é um professor totalmente motivado e interessado em ensinar. Possui um cuidado ímpar na preparação do material de ensino, sempre claro e atualizado. Sua aula é participativa, carismática e dinâmica. Fora das aulas é interessado e motivador, compartilhando vivência de mercado e bons conselhos. Um dos melhores professores que já tive e grande amigo.",

        rec35_relationship:
          "Em 28 de dezembro de 2017, Gabriel respondia a João Paulo",

        rec35_recommendation:
          "O João é um excelente professor, conseguiu deixar todas as aulas interessantes. Também consegue passar a informação de forma simples, está sempre desafiando seus alunos para aprender mais.",

        rec36_relationship:
          "Em 19 de dezembro de 2017, Thiago Brito e João Paulo estudavam na mesma instituição",

        rec36_recommendation:
          "Excelente professor, sempre preocupado com o aprendizado, além de proporcionar bons materiais e dicas de estudo. Também excelente como pessoa, procurando guardar nomes e ficar próximo dos alunos. Agradeço a oportunidade de tê-lo como meu professor.",

        rec37_relationship:
          "Em 17 de dezembro de 2017, Gabriel e João Paulo estudavam na mesma instituição",

        rec37_recommendation:
          "Está na lista dos melhores professores que já tive na vida. Ao mesmo tempo que te cobra bastante, faz você ter interesse no que está cobrando, tira qualquer dúvida, e é alguém que você quer levar como amigo pro resto da vida. Simplesmente sensacional. Valeu demais pelos conhecimentos que já passou e está me passando.",

        rec38_relationship:
          "Em 15 de dezembro de 2017, Amanda era cliente de João Paulo",

        rec38_recommendation:
          "Ótimo professor, atencioso, possui muito conhecimento e didática boa.",

        rec39_relationship:
          "Em 14 de dezembro de 2017, Nilson Junio Paulino era cliente de João Paulo",

        rec39_recommendation:
          "Ótimo professor, se empenha em cada matéria que leciona, sempre busca conhecimento além dos livros e tem uma didática excelente. Espero ser aluno dele em outra matéria, pois sei que será bem lecionada.",

        rec40_relationship:
          "Em 13 de dezembro de 2017, Lucas era cliente de João Paulo",

        rec40_recommendation:
          "Apesar das dificuldades durante o semestre e dos inúmeros bugs corrigidos, foi possível entregar um projeto que aplicava toda a teoria e conceito que foi ensinado de forma primorosa. Posso dizer com propriedade que o professor João Paulo fará parte da minha formação, sendo peça fundamental na minha trajetória do conhecimento.",

        rec41_relationship:
          "Em 13 de dezembro de 2017, Luiz Guilherme era cliente de João Paulo",

        rec41_recommendation:
          "Tive a sorte de participar de duas matérias lecionadas pelo professor João Paulo Aramuni, Fundamentos Teóricos da Computação e Compiladores. Em ambas mostrou completo interesse para tirar dúvidas, ajudar alunos com dificuldades, e sempre teve paciência e compreensão. Suas aulas possuem dinâmicas que facilitam o entendimento e aprendizagem, com total domínio das matérias e exemplos práticos.",

        rec42_relationship:
          "Em 13 de dezembro de 2017, David era cliente de João Paulo",

        rec42_recommendation:
          "Excelente professor, ótima didática e uma grande vontade de ensinar. As aulas foram muito bem ministradas!",

        rec43_relationship:
          "Em 11 de dezembro de 2017, João Paulo era sênior em relação a Samuel, mas não supervisionava Samuel diretamente",

        rec43_recommendation:
          "O Professor Aramuni é um dos melhores professores que já tive. Seu estilo de lecionar consegue explicar até a maior e mais complexa abstração de forma clara, possibilitando que todos absorvam o conhecimento e solucionem problemas complexos. Não há melhor pessoa para orientação do que o João Paulo.",

        rec44_relationship:
          "Em 19 de junho de 2017, João Lucas Veloso era cliente de João Paulo",

        rec44_recommendation:
          "João é um professor que busca e desenvolve métodos para que seus alunos aprendam. Sempre se mostrou comprometido a ajudar, oferecendo material bem preparado e paciência para respeitar o ritmo de cada aluno.",

        rec45_relationship:
          "Em 9 de fevereiro de 2017, Fábio e João Paulo estudavam na mesma instituição",

        rec45_recommendation:
          "Grande professor, atencioso, conhece muito bem o que ensina. Suas aulas foram de grande valia e sua didática foi além das expectativas. Feliz de ter compartilhado aprendizados com ele.",

        rec46_relationship:
          "Em 9 de janeiro de 2017, Márcio trabalhava com João Paulo na mesma equipe",

        rec46_recommendation:
          "Trabalho com o João Paulo a cerca de um ano e afirmo ser um profissional muito dedicado, responsável e estudioso. Sempre busca conhecimento e compartilha soluções com a equipe, favorecendo o crescimento de todos.",

        rec47_relationship:
          "Em 17 de outubro de 2016, Felipe e João Paulo estudavam na mesma instituição",

        rec47_recommendation:
          "Tive o grande prazer de ter sido aluno do João Paulo na Universidade FUMEC. Professor TOP, competente, atencioso, descontraído, que consegue explicar matérias complexas de forma clara e simples. Tudo isso graças ao seu amor pelo que faz. Sucesso João!",

        rec48_relationship:
          "Em 10 de outubro de 2016, Bruno era cliente de João Paulo",

        rec48_recommendation:
          "Tive o prazer de ser aluno do João Aramuni na universidade FUMEC. Profissional sério e dedicado, consegue passar o conhecimento da linguagem de programação de forma estruturada e clara. Excelente professor e desejo que se destaque bastante em sua carreira acadêmica.",

        rec49_relationship:
          "Em 23 de agosto de 2015, Rafael e João Paulo estudavam na mesma instituição",

        rec49_recommendation:
          "Tive a oportunidade de estudar com o João Paulo na FUMEC. Profissional diferenciado, organizado, persistente, autodidata e apaixonado por metodologias ágeis. Se destacava pela comunicação e pelo compartilhamento de conhecimento.",

        rec50_relationship:
          "Em 4 de março de 2015, Gabriela e João Paulo estudavam na mesma instituição",

        rec50_recommendation:
          "Recomendo João pela sua competência, por gostar da área em que atua e ser determinado, com força de vontade e fácil convivência. Ótimo profissional.",

        rec51_relationship:
          "Em 10 de novembro de 2014, João Paulo era sênior em relação a Glaydson, mas não supervisionava Glaydson diretamente",

        rec51_recommendation:
          "Trabalho com o João Paulo há quase 1 ano e neste período ele se mostrou um profissional competente e dedicado, atuando de forma excepcional em projetos de clientes como a OI e a ANP.",

        rec52_relationship:
          "Em 9 de novembro de 2014, Lucas e João Paulo estudavam na mesma instituição",

        rec52_recommendation:
          "João é um aluno dedicado e proativo. Destacou-se em sala de aula com excelentes trabalhos e apresentações. Como palestrante aborda metodologias ágeis que cativam cada vez mais alunos.",

        rec53_relationship:
          "Em 29 de outubro de 2014, Andre trabalhava com João Paulo mas em equipes diferentes",

        rec53_recommendation:
          "Tive a oportunidade de trabalhar com João Paulo na Capgemini durante 1 ano. Profissional que visa o compartilhamento de informação e está sempre à disposição para ajudar.",

        rec54_relationship:
          "Em 14 de outubro de 2014, Amadeu e João Paulo estudavam na mesma instituição",

        rec54_recommendation:
          "João Paulo é uma pessoa envolvida nas atividades de sala de aula e pesquisa. Trabalhamos juntos em artigos e apresentações, sempre trazendo ideias inovadoras. Tem experiência com metodologias ágeis, aplicadas inclusive na dissertação de mestrado.",
      },
      experiencias: {
        titulo: "Experiências Profissionais",
        present: "Atual",

        // Companies
        jedis: "Jedis - Tecnologia e Recrutamento",
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
        consultor:"Consultor de Tecnologia",
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
        analista_sistemas_pl_prosegur: "Analista de Sistemas Pleno",
        analista_sistemas_pl_capgemini: "Analista de Sistemas Pleno",
        analista_sistemas_jr_capgemini: "Analista de Sistemas Júnior",
        programador_sr_capgemini: "Programador Sênior",
        programador_jr_capgemini: "Programador Júnior",
        tecnico_programador_bb: "Técnico/Programador",
        desenvolvedor_csharp_alamo: "Desenvolvedor C#",
        estagiario_fumec: "Estagiário",
        bolsista_pibic: "Bolsista de Iniciação Científica",

        // Descriptions & Skills
        consultor_desc:
          "Liderança técnica (papel de CTO) de 4 devs, 1 PO e QA terceirizado em sistemas para JdsDev, Mereo, Afya, Autoglass e Allos. Estimativa de esforço, prazo e custo dos projetos (horas, semanas e valores), com pré-refinamento técnico, marcos, margens de QA e contingência, cenários e riscos, embasando propostas de até ~3.000 h. Apoio à precificação do SaaS ATS RHápido. Arquiteturas cloud-native e de microsserviços, APIs de integração e decisões técnicas. Liderança, com a Eficify, da migração do RHápido da AWS (EC2/S3) para Kubernetes na Eficify Private Cloud: rede segmentada com Bastion Host, GitOps com ArgoCD, Zero Trust (RBAC, MFA e auditoria), Grafana e Loki, IaC e backups com PITR. Mentoria, contratação de devs, PDIs e implantação do Claude Code no time.",
        consultor_skills:
          "Estimativa e precificação de software, Arquitetura cloud-native, Kubernetes, DevOps e GitOps, Zero Trust, Microsserviços, Infraestrutura como código, Observabilidade, IA generativa no desenvolvimento, Mentoria técnica, Comunicação com stakeholders.",
        
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

        dev_backend_in8_desc:
          "Web scraping e desenvolvimento de crawlers em Python 3 para programas de milhas aéreas. Criação e manutenção de APIs RESTful para extração de dados e automação de navegadores. Arquitetura cloud AWS com HA/DR, CI/CD, administração de containers Docker e monitoramento com Grafana e New Relic.",
        dev_backend_in8_skills:
          "Python, Web Scraping, APIs RESTful, AWS, Docker, CI/CD, Observabilidade e monitoramento.",

        analista_sistemas_pl_prosegur_desc:
          "Desenvolvimento de sistema distribuído em Java 8, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink. Implantação em âmbito global. Software Maintenance, refatoração e melhorias de performance. Testes de WebServices e automatizados. Manipulação de Banco de Dados Oracle. Programação PL/SQL. Documentação de Casos de Uso. Metodologia Ágil Scrum.",

        analista_sistemas_pl_prosegur_skills:
          "Java, JavaFX, JSF, PrimeFaces, EJB, JPA, EclipseLink, PL/SQL, Oracle, Scrum, Testes automatizados.",

        analista_sistemas_pl_capgemini_desc:
          "Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing.",
        analista_sistemas_pl_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        analista_sistemas_jr_capgemini_desc:
          "Análise e desenvolvimento em Java / Java Web; Manutenção de sistemas em VB6 / VB.NET. Desenvolvimento Web ASP Clássico / ASP.NET. Manipulação de Banco de Dados SQLServer / Oracle. Programação com PL/SQL. Documentação e UML. Metodologia Ágil Lean Manufacturing.",
        analista_sistemas_jr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_sr_capgemini_desc:
          "Segunda vez na história da Capgemini no Brasil em que houve uma progressão de Junior para Sênior pulando-se a posição de Pleno.",
        programador_sr_capgemini_skills:
          "Java, ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        programador_jr_capgemini_desc:
          "Desenvolvimento e manutenção dos sistemas SIGEP e SIMP da ANP (Agência Nacional do Petróleo, Gás Natural e Biocombustíveis), com foco em aplicações web, processamento de documentos e suporte à conformidade regulatória.",
        programador_jr_capgemini_skills:
          "ASP.NET, VB6, SQLServer, Oracle, PL/SQL, UML, Lean Manufacturing.",

        tecnico_programador_bb_desc:
          "Estágio supervisionado obrigatório em desenvolvimento e suporte a aplicativos em Java / Java Web; Manutenção de sistemas integrados ao SISBB. Desenvolvimento e suporte a aplicações legadas VBA / VB6; Programação PL/SQL; Levantamento de requisitos.",
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

// Idioma pelo link (?lang=en): junto com o ?cmd=, permite mandar o portfólio
// já em inglês, ex.: aramuni.dev/?cmd=resume&lang=en
const languageFromUrl = () => {
  try {
    const lang = new URLSearchParams(window.location.search).get("lang");
    if (lang?.toLowerCase().startsWith("en")) return "en";
    if (lang?.toLowerCase().startsWith("pt")) return "pt";
  } catch {
    /* sem URL válida: segue o padrão */
  }
  return null;
};

i18n.use(initReactI18next).init({
  resources,
  lng: languageFromUrl() ?? "pt",
  fallbackLng: "en",
  interpolation: { escapeValue: false },
});

const setHtmlLang = (lng) => {
  document.documentElement.lang = lng.startsWith("en") ? "en" : "pt-BR";
};

setHtmlLang(i18n.language);
i18n.on("languageChanged", setHtmlLang);

export default i18n;
