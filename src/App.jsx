import React, { useState } from "react";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";
import "./App.css";
import { commandList } from "./commands";
import Projetos from "./components/Projetos";
import ProjetosGitHub from "./components/ProjetosGitHub";
import Experiencias from "./components/Experiencias";
import SobreMim from "./components/SobreMim";
import Ajuda from "./components/Ajuda";
import Habilidades from "./components/Habilidades";
import Spotify from "./components/Spotify";
import WakaTime from "./components/WakaTime";
import Contato from "./components/Contato";
import Curriculo from "./components/Curriculo";
import BoasVindas from "./components/BoasVindas";
import Calendly from "./components/Calendly";
import Recomendacoes from "./components/Recomendacoes";
import Premios from "./components/Premios";
import FlappyPlaneGame from "./components/FlappyPlaneGame";
import LivroVisitas from "./components/LivroVisitas";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();
  const getWelcomeMessage = () => <BoasVindas key="welcome" />;

  const [terminalLineData, setTerminalLineData] = useState([
    getWelcomeMessage(),
  ]);

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

  function handleInput(input) {
    let newLines = [...terminalLineData];
    newLines.push(
      <TerminalInput key={`input-${newLines.length}`}>
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
        case "habilidades":
          response = <Habilidades />;
          break;
        case "limpar":
          setTerminalLineData([]);
          return;
        case "recomendacoes":
          response = <Recomendacoes />;
          break;
        case "spotify":
          response = <Spotify />;
          break;
        case "wakatime":
          response = <WakaTime />;
          break;
        case "contato":
          response = <Contato onExit={exitComponent} />;
          break;
        case "game":
          response = <FlappyPlaneGame onExit={exitComponent} />;
          break;
        case "guestbook": {
          const validSubCommands = ["add", "list", "help"];
          if (!subCommand) {
            // Sem subcomando → mostra home
            response = <LivroVisitas mode="home" onExit={exitComponent} />;
          } else if (validSubCommands.includes(subCommand)) {
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

    if (Array.isArray(response)) {
      newLines.push(...response);
    } else {
      newLines.push(response);
    }

    setTerminalLineData(newLines);
  }

  const myPrompt = "visitante@portfolio:~$";
  const terminalTitle = "Portfolio terminal";

  return (
    <div className="terminal-container">
      <LanguageSwitcher onLanguageChange={focusTerminalInput} />
      <Terminal
        name={terminalTitle}
        colorMode={ColorMode.Dark}
        onInput={
          isGameOpen || isContatoOpen || isGuestBookAddOpen
            ? undefined
            : handleInput
        }
        prompt={myPrompt}
        height="85vh"
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
}

export default App;
