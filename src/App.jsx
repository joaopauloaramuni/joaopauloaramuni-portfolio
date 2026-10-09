import React, { useState, useCallback, useEffect, useRef } from "react";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";
import { useSearchParams } from "react-router-dom";
import "./App.css";
import { commandList } from "./commands";
import useTerminalKeys from "./terminal/useTerminalKeys";
import {
  keepLastCommandAtTop,
  scrollTerminalToBottom,
} from "./terminal/terminalDom";
import lazyCommand from "./terminal/lazyCommand";
import Ajuda from "./components/Ajuda";
import BoasVindas from "./components/BoasVindas";
import { marcarAtividade } from "./lib/visitas";
import LanguageSwitcher from "./components/LanguageSwitcher";
import BootSequence from "./components/BootSequence";
import GaloFundo from "./components/GaloFundo";
import { useTranslation } from "react-i18next";
import { useTheme, nextTheme } from "./theme/themeContext";
import { parseSkillSkin } from "./data/skillSkins";
import { parseWakaTimeSkin } from "./data/wakaTimeSkins";
import { parseGitHubStatsSection } from "./data/gitHubStatsSections";
import { parseCalSkin } from "./data/calSkins";
import { parseLattesSection } from "./data/lattesSections";
import { parseTurmas } from "./data/turmasSections";
import { parseCanvas } from "./data/canvasSections";
import { parseBasquete } from "./config/nbaConfig";
import { GRUPOS } from "./data/turmasRepos";

// Os comandos são carregados sob demanda (ver terminal/lazyCommand.jsx): o
// bundle inicial leva só o terminal, a tela de boas-vindas e a ajuda. Antes
// ele tinha 1,66 MB, um terço só do visualizador de PDF do currículo.
const SobreMim = lazyCommand(() => import("./components/SobreMim"));
const Experiencias = lazyCommand(() => import("./components/Experiencias"));
const Projetos = lazyCommand(() => import("./components/Projetos"));
const ProjetosGitHub = lazyCommand(() => import("./components/ProjetosGitHub"));
const Habilidades = lazyCommand(() => import("./components/Habilidades"));
const Spotify = lazyCommand(() => import("./components/Spotify"));
const WakaTime = lazyCommand(() => import("./components/WakaTime"));
const GitHubStats = lazyCommand(() => import("./components/GitHubStats"));
const Contato = lazyCommand(() => import("./components/Contato"));
const Calendly = lazyCommand(() => import("./components/Calendly"));
const Calendario = lazyCommand(() => import("./components/Calendario"));
const Recomendacoes = lazyCommand(() => import("./components/Recomendacoes"));
const Premios = lazyCommand(() => import("./components/Premios"));
const FlappyPlaneGame = lazyCommand(() => import("./components/FlappyPlaneGame"));
// "jogo" / "quake": o componente é leve (um iframe); o motor e os dados só
// descem quando o comando roda (ver public/quake)
const QuakeGame = lazyCommand(() => import("./components/QuakeGame"));
const LivroVisitas = lazyCommand(() => import("./components/LivroVisitas"));
const Neofetch = lazyCommand(() => import("./components/Neofetch"));
const Jogos = lazyCommand(() => import("./components/Jogos"));
const Basquete = lazyCommand(() => import("./components/Basquete"));
const DesignSystem = lazyCommand(() => import("./components/DesignSystem"));
// O "pergunta" (ask) chama a IA no servidor (api/ask.js): aqui é só o desenho
const Ask = lazyCommand(() => import("./components/Ask"));
// O currículo traz o react-pdf e o PDF.js (~400 kB)
const Curriculo = lazyCommand(() => import("./components/Curriculo"));
// O "lattes" traz ~90 kB de dados (TCCs, trabalhos e bancas)
const Lattes = lazyCommand(() => import("./components/Lattes"), {
  fallbackKey: "lattes.carregando",
});
// O "turmas" traz os dados dos grupos (npm run turmas)
const Turmas = lazyCommand(() => import("./components/Turmas"), {
  fallbackKey: "turmas.carregando",
});
// O "canvas" traz as tarefas do semestre (npm run canvas)
const Canvas = lazyCommand(() => import("./components/Canvas"), {
  fallbackKey: "canvas.carregando",
});

// Depois do boot, com o navegador ocioso, já baixa os comandos leves: o
// primeiro uso de cada um abre na hora, sem "Carregando...". Ficam de fora os
// pesados e menos usados (currículo, lattes, turmas, canvas) e a economia de
// dados do celular (Save-Data).
const PRELOAD = [
  SobreMim,
  Experiencias,
  Projetos,
  ProjetosGitHub,
  Habilidades,
  Spotify,
  WakaTime,
  GitHubStats,
  Contato,
  Calendly,
  Calendario,
  Recomendacoes,
  Premios,
  FlappyPlaneGame,
  QuakeGame,
  LivroVisitas,
  Neofetch,
  Jogos,
  Basquete,
  DesignSystem,
  Ask,
];

const whenIdle = (fn) =>
  "requestIdleCallback" in window
    ? window.requestIdleCallback(fn, { timeout: 5000 })
    : setTimeout(fn, 2000);

const myPrompt = "visitante@portfolio:~$";
const terminalTitle = "Portfolio terminal";

// Link direto: aramuni.dev/?cmd=curriculo abre o portfólio já rodando o comando
const DEEP_LINK_MAX_LENGTH = 60;
const readDeepLinkCommand = (searchParams) => {
  const command = (searchParams.get("cmd") ?? "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, DEEP_LINK_MAX_LENGTH);
  return command || null;
};

function App() {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();
  const getWelcomeMessage = () => <BoasVindas key="welcome" />;

  const [terminalLineData, setTerminalLineData] = useState([
    getWelcomeMessage(),
  ]);

  // Controla a tela de boot (some quando termina ou o visitante pula)
  const [booted, setBooted] = useState(false);

  // Comando vindo do link (?cmd=...), lido uma vez ao abrir a página
  const [searchParams] = useSearchParams();
  const [deepLinkCommand] = useState(() => readDeepLinkCommand(searchParams));
  const deepLinkDone = useRef(false);

  // Chave única para cada linha adicionada ao terminal
  const lineId = useRef(0);
  const nextKey = (prefix) => `${prefix}-${lineId.current++}`;

  const appendLines = (...lines) => {
    setTerminalLineData((current) => [...current, ...lines]);
  };

  const exitComponent = () => {
    setTerminalLineData((lines) => {
      const newLines = lines.slice(0, -1);
      requestAnimationFrame(() => {
        const input = document.querySelector(".terminal-hidden-input");
        if (input) input.focus();
      });
      return newLines;
    });
  };

  const focusTerminalInput = () => {
    requestAnimationFrame(() => {
      const input = document.querySelector(".terminal-hidden-input");
      if (input) input.focus();
    });
  };

  // Sempre aponta para o handleInput mais recente (usado pelo link direto)
  const runCommandRef = useRef(null);
  useEffect(() => {
    runCommandRef.current = handleInput;
  });

  // Chamado pelo BootSequence ao terminar: libera o terminal e foca o input
  const handleBootFinish = useCallback(() => {
    setBooted(true);
    focusTerminalInput();
  }, []);

  // Terminal liberado: baixa os comandos leves em segundo plano (ver PRELOAD)
  useEffect(() => {
    if (!booted || navigator.connection?.saveData) return;
    whenIdle(() => PRELOAD.forEach((command) => command.preload()));
  }, [booted]);

  // Com o terminal liberado, executa o comando do link direto (?cmd=...).
  // Fica aqui, e não no handleBootFinish, porque quando o boot já rodou nesta
  // aba (F5, outro link) o BootSequence chama onFinish no efeito de montagem
  // dele, que roda antes dos efeitos do App: o runCommandRef ainda estaria vazio.
  useEffect(() => {
    if (!booted || !deepLinkCommand || deepLinkDone.current) return;
    deepLinkDone.current = true;
    // O handleInput já leva o comando para o topo, como em todo comando
    runCommandRef.current?.(deepLinkCommand);
  }, [booted, deepLinkCommand]);

  // Detecta se um jogo (Flappy Plane ou Quake) está aberto
  const lastLineType = terminalLineData[terminalLineData.length - 1]?.type;
  const isGameOpen =
    lastLineType === FlappyPlaneGame || lastLineType === QuakeGame;

  // Detecta se o contato está aberto
  const isContatoOpen =
    terminalLineData.length > 0 &&
    terminalLineData[terminalLineData.length - 1]?.type === Contato;

  // Detecta se o GuestBook está no modo ADD
  const lastLine = terminalLineData[terminalLineData.length - 1];
  const isGuestBookAddOpen =
    lastLine?.type === LivroVisitas && lastLine?.props?.mode === "add";

  // Jogo, contato e guestbook (add) usam o teclado: o terminal fica em pausa
  const isTerminalPaused = isGameOpen || isContatoOpen || isGuestBookAddOpen;

  // Tab duplo sem completar: mostra as opções, como no bash
  const showCompletions = (typed, options) => {
    appendLines(
      <TerminalInput key={nextKey("input")}>
        {myPrompt} {typed}
      </TerminalInput>,
      <TerminalOutput key={nextKey("options")}>
        <span className="autocomplete-options">
          {options.map((option) => (
            <span key={option}>{option}</span>
          ))}
        </span>
      </TerminalOutput>
    );
    scrollTerminalToBottom();
  };

  // Histórico com ↑/↓ e autocomplete com Tab
  const { addToHistory } = useTerminalKeys({
    enabled: booted && !isTerminalPaused,
    commands: commandList,
    onShowOptions: showCompletions,
  });

  function handleInput(input) {
    // Comando digitado é atividade: renova a janela de 30 min do contador de
    // visitas, então quem navega por mais tempo não conta como visita nova
    marcarAtividade();
    addToHistory(input);
    const inputLine = (
      <TerminalInput key={nextKey("input")}>
        {myPrompt} {input}
      </TerminalInput>
    );

    const args = input.toLowerCase().trim().split(/\s+/);
    const userInput = args[0];
    const subCommand = args[1];
    const command = Object.values(commandList).find(
      (cmd) => cmd.name === userInput || cmd.aliases.includes(userInput)
    );
    const getInvalidCommandOutput = (cmd) => (
      <TerminalOutput>
        {t("comando.nao_reconhecido")} "{cmd}" - {t("comando.ver_ajuda")}
      </TerminalOutput>
    );
    let response;

    if (command) {
      switch (command.name) {
        case "sobre":
          response = <SobreMim />;
          break;
        case "ajuda":
          response = <Ajuda />;
          break;
        case "pergunta": {
          // "pergunta <texto>" ou "ask <texto>": a IA responde em primeira
          // pessoa (ver components/Ask.jsx). O texto vai como foi digitado,
          // sem o nome do comando (os args acima estão em minúsculas);
          // "--nova" e "--new" esquecem a conversa
          const pergunta = input.trim().replace(/^\S+\s*/, "");
          const nova = ["--nova", "--new"].includes(pergunta.toLowerCase());
          response = <Ask pergunta={nova ? "" : pergunta} nova={nova} />;
          break;
        }
        case "premios":
          response = <Premios />;
          break;
        case "projetos":
          response = <Projetos />;
          break;
        case "github":
          response = <ProjetosGitHub />;
          break;
        case "experiencias":
          response = <Experiencias />;
          break;
        case "calendly":
          response = <Calendly />;
          break;
        case "curriculo":
          response = <Curriculo />;
          break;
        case "lattes": {
          // "lattes" abre o resumo; "--docencia", "--tccs", "--tis" (interdisciplinares),
          // "--aes", "--bancas" e "--tudo" trocam a seção e "--pdf" mostra o card de
          // download (ver data/lattesSections.js e scripts/lattes.mjs)
          const section = parseLattesSection(args.slice(1));
          if (!section) {
            response = <TerminalOutput>{t("lattes.uso")}</TerminalOutput>;
            break;
          }
          response = <Lattes section={section} />;
          break;
        }
        case "turmas": {
          // "turmas" abre o resumo; "--codigo", "--linguagens", "--ritmo",
          // "--equilibrio", "--prs", "--projetos" e "--tudo" trocam o gráfico e
          // "ti2", "ti5", "lourdes", "coreu", "g1"... ou o nome de um grupo
          // filtram (ver data/turmasSections.js e scripts/turmas.mjs)
          const parsed = parseTurmas(args.slice(1), GRUPOS);
          if (!parsed) {
            response = <TerminalOutput>{t("turmas.uso")}</TerminalOutput>;
            break;
          }
          response = <Turmas {...parsed} />;
          break;
        }
        case "canvas": {
          // "canvas" abre o resumo (próxima entrega); "--tarefas", "--agenda"
          // e "--tudo" trocam a seção e "diw", "ti5", "coreu", "g1"... ou um
          // pedaço do nome do curso filtram (ver data/canvasSections.js e
          // scripts/canvas.mjs)
          const parsed = parseCanvas(args.slice(1));
          if (!parsed) {
            response = <TerminalOutput>{t("canvas.uso")}</TerminalOutput>;
            break;
          }
          response = <Canvas {...parsed} />;
          break;
        }
        case "cal": {
          // "cal" abre o mês; "--semana" mostra a grade e "--hoje" a agenda
          // do dia (ver data/calSkins.js e data/horarioData.js)
          const skin = parseCalSkin(args.slice(1));
          if (!skin) {
            response = <TerminalOutput>{t("cal.uso")}</TerminalOutput>;
            break;
          }
          response = <Calendario skin={skin} />;
          break;
        }
        case "habilidades": {
          // "skills --lista", "skills --terminal" ou "skills --skin=cards"
          const skin = parseSkillSkin(args.slice(1));
          response = skin ? (
            <Habilidades skin={skin} />
          ) : (
            <TerminalOutput>{t("habilidades.uso")}</TerminalOutput>
          );
          break;
        }
        case "limpar":
          setTerminalLineData([]);
          return;
        case "tema": {
          // "tema" sem opção troca na ordem escuro → claro → galo → escuro...;
          // "tema --claro|--light", "--escuro|--dark" e "--galo" escolhem.
          // Sem os traços ("tema claro") também vale, como era antes.
          const themeArgs = {
            claro: "light",
            light: "light",
            escuro: "dark",
            dark: "dark",
            galo: "galo",
          };
          const option = subCommand?.replace(/^--?/, "");
          if (subCommand && !themeArgs[option]) {
            response = <TerminalOutput>{t("tema.uso")}</TerminalOutput>;
            break;
          }
          const chosen = themeArgs[option] ?? nextTheme(theme);
          setTheme(chosen);
          const messages = {
            light: "tema.claro_ativado",
            dark: "tema.escuro_ativado",
            galo: "tema.galo_ativado",
          };
          response = <TerminalOutput>{t(messages[chosen])}</TerminalOutput>;
          break;
        }
        case "recomendacoes":
          response = <Recomendacoes />;
          break;
        case "spotify":
          response = <Spotify />;
          break;
        case "wakatime": {
          // "wakatime" abre o estilo terminal; "--grade" e "--lista" também
          // desenham os dados da API do WakaTime e "--cards" mostra as imagens
          // (ver data/wakaTimeSkins.js)
          const skin = parseWakaTimeSkin(args.slice(1));
          if (!skin) {
            response = <TerminalOutput>{t("wakatime.uso")}</TerminalOutput>;
            break;
          }
          response = <WakaTime skin={skin} />;
          break;
        }
        case "stats": {
          // "stats" abre o resumo; "--linguagens", "--atividade", "--horarios",
          // "--repos" e "--tudo" trocam o grupo de gráficos
          // (ver data/gitHubStatsSections.js)
          const section = parseGitHubStatsSection(args.slice(1));
          if (!section) {
            response = <TerminalOutput>{t("stats.uso")}</TerminalOutput>;
            break;
          }
          response = <GitHubStats section={section} />;
          break;
        }
        case "neofetch":
          response = <Neofetch />;
          break;
        case "campeonato": {
          // "campeonato" (ou "galo", "atletico") mostra os próximos jogos do Galo,
          // ao vivo da ESPN; "--todos" | "--all" mostram todos os marcados e
          // "--tabela" | "--table", a classificação do Brasileirão
          if (subCommand && !command.subcommands.includes(subCommand)) {
            response = <TerminalOutput>{t("jogos.uso")}</TerminalOutput>;
            break;
          }
          const tabela = subCommand === "--tabela" || subCommand === "--table";
          response = <Jogos todos={Boolean(subCommand) && !tabela} tabela={tabela} />;
          break;
        }
        case "basquete": {
          // "basquete" (ou "basketball", "nba") mostra os próximos jogos da
          // NBA, ao vivo da ESPN; a sigla ou o apelido de um time filtram
          // ("nba lal", "nba lakers") e "--todos" | "--all" mostram todos os
          // jogos dos próximos dias (ver config/nbaConfig.js)
          const parsed = parseBasquete(args.slice(1));
          if (!parsed) {
            response = <TerminalOutput>{t("basquete.uso")}</TerminalOutput>;
            break;
          }
          response = <Basquete {...parsed} />;
          break;
        }
        case "design":
          response = <DesignSystem />;
          break;
        case "contato":
          response = <Contato onExit={exitComponent} />;
          break;
        case "jogo": {
          // "jogo", "game" e "quake" abrem o Quake shareware e "flappyplane", o
          // Flappy Plane; "--quake" | "--flappyplane" escolhem o jogo
          if (subCommand && !command.subcommands.includes(subCommand)) {
            response = <TerminalOutput>{t("jogo.uso")}</TerminalOutput>;
            break;
          }
          const flappy = subCommand
            ? subCommand === "--flappyplane"
            : userInput === "flappyplane";
          response =
            !flappy ? (
              <QuakeGame onExit={exitComponent} />
            ) : (
              <FlappyPlaneGame onExit={exitComponent} />
            );
          break;
        }
        case "guestbook": {
          if (!subCommand) {
            // Sem subcomando → mostra home
            response = <LivroVisitas mode="home" onExit={exitComponent} />;
          } else if (command.subcommands.includes(subCommand)) {
            // Subcomando válido
            response = <LivroVisitas mode={subCommand} onExit={exitComponent} />;
          } else {
            // Subcomando inválido → padrão TerminalOutput
            response = getInvalidCommandOutput(subCommand);
          }
          break;
        }
        default:
          break;
      }
      // Padrão de todos os comandos: o comando vai para o topo do terminal,
      // com a saída logo abaixo, em vez de o visitante cair no fim dela. Se a
      // saída crescer depois (código lazy, dados, imagens), o próprio
      // componente repete o ajuste (ver terminal/useCommandAtTop.js)
      keepLastCommandAtTop();
    } else {
      response = getInvalidCommandOutput(userInput);
    }

    const outputLines = [response]
      .flat()
      .filter(Boolean)
      .map((line) => React.cloneElement(line, { key: nextKey("output") }));

    appendLines(inputLine, ...outputLines);
  }

  return (
    <>
      {!booted && <BootSequence onFinish={handleBootFinish} />}
      <div className="terminal-container">
        <GaloFundo />
        <LanguageSwitcher onLanguageChange={focusTerminalInput} />
        <Terminal
          name={terminalTitle}
          colorMode={theme === "light" ? ColorMode.Light : ColorMode.Dark}
          onInput={isTerminalPaused ? undefined : handleInput}
          prompt={myPrompt}
          height="calc(100dvh - 80px)" /* 60px + 20px de padding do .react-terminal-wrapper (App.css) */
        >
          {terminalLineData}
        </Terminal>
      </div>
    </>
  );
}

export default App;
