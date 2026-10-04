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
  scrollLastCommandToTop,
  scrollTerminalToBottom,
} from "./terminal/terminalDom";
import Projetos from "./components/Projetos";
import ProjetosGitHub from "./components/ProjetosGitHub";
import Experiencias from "./components/Experiencias";
import SobreMim from "./components/SobreMim";
import Ajuda from "./components/Ajuda";
import Habilidades from "./components/Habilidades";
import Spotify from "./components/Spotify";
import WakaTime from "./components/WakaTime";
import GitHubStats from "./components/GitHubStats";
import Contato from "./components/Contato";
import Curriculo from "./components/Curriculo";
import BoasVindas from "./components/BoasVindas";
import Calendly from "./components/Calendly";
import Recomendacoes from "./components/Recomendacoes";
import Premios from "./components/Premios";
import FlappyPlaneGame from "./components/FlappyPlaneGame";
import LivroVisitas from "./components/LivroVisitas";
import Neofetch from "./components/Neofetch";
import DesignSystem from "./components/DesignSystem";
import LanguageSwitcher from "./components/LanguageSwitcher";
import BootSequence from "./components/BootSequence";
import { useTranslation } from "react-i18next";
import { useTheme } from "./theme/themeContext";
import { parseSkillSkin } from "./data/skillSkins";
import { parseWakaTimeSkin } from "./data/wakaTimeSkins";
import { parseGitHubStatsSection } from "./data/gitHubStatsSections";

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

  // Com o terminal liberado, executa o comando do link direto (?cmd=...).
  // Fica aqui, e não no handleBootFinish, porque quando o boot já rodou nesta
  // aba (F5, outro link) o BootSequence chama onFinish no efeito de montagem
  // dele, que roda antes dos efeitos do App: o runCommandRef ainda estaria vazio.
  useEffect(() => {
    if (!booted || !deepLinkCommand || deepLinkDone.current) return;
    deepLinkDone.current = true;
    runCommandRef.current?.(deepLinkCommand);
    scrollLastCommandToTop();
  }, [booted, deepLinkCommand]);

  // Detecta se o jogo está aberto
  const isGameOpen =
    terminalLineData.length > 0 &&
    terminalLineData[terminalLineData.length - 1]?.type === FlappyPlaneGame;

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
    addToHistory(input);
    const inputLine = (
      <TerminalInput key={nextKey("input")}>
        {myPrompt} {input}
      </TerminalInput>
    );

    const args = input.toLowerCase().trim().split(" ");
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
          // "tema" alterna; "tema claro|light" e "tema escuro|dark" escolhem
          const themeArgs = {
            claro: "light",
            light: "light",
            escuro: "dark",
            dark: "dark",
          };
          if (subCommand && !themeArgs[subCommand]) {
            response = <TerminalOutput>{t("tema.uso")}</TerminalOutput>;
            break;
          }
          const nextTheme =
            themeArgs[subCommand] ?? (theme === "dark" ? "light" : "dark");
          setTheme(nextTheme);
          response = (
            <TerminalOutput>
              {t(nextTheme === "light" ? "tema.claro_ativado" : "tema.escuro_ativado")}
            </TerminalOutput>
          );
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
          // Saída longa: leva o comando para o topo em vez de cair no fim
          if (skin !== "cards") keepLastCommandAtTop();
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
          // Saída longa: leva o comando para o topo em vez de cair no fim
          keepLastCommandAtTop();
          break;
        }
        case "neofetch":
          response = <Neofetch />;
          break;
        case "design":
          response = <DesignSystem />;
          // Saída longa: leva o comando para o topo em vez de cair no fim
          keepLastCommandAtTop();
          break;
        case "contato":
          response = <Contato onExit={exitComponent} />;
          break;
        case "game":
          response = <FlappyPlaneGame onExit={exitComponent} />;
          break;
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
        <LanguageSwitcher onLanguageChange={focusTerminalInput} />
        <Terminal
          name={terminalTitle}
          colorMode={theme === "light" ? ColorMode.Light : ColorMode.Dark}
          onInput={isTerminalPaused ? undefined : handleInput}
          prompt={myPrompt}
          height="calc(100dvh - 110px)"
        >
          {terminalLineData}
        </Terminal>
      </div>
    </>
  );
}

export default App;
