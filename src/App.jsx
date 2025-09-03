// src/App.jsx

import React, { useState } from "react";
import Terminal, {
  ColorMode,
  TerminalInput,
  TerminalOutput,
} from "react-terminal-ui";
import "./App.css";
import { commandList } from "./commands";
import Projetos from "./components/Projetos";
import Experiencias from "./components/Experiencias";
import SobreMim from "./components/SobreMim";
import Ajuda from "./components/Ajuda";
import Spotify from "./components/Spotify";
import WakaTime from "./components/WakaTime";
import Contato from "./components/Contato";
import BoasVindas from "./components/BoasVindas";
import Recomendacoes from "./components/Recomendacoes";
import Premios from "./components/Premios";
import FlappyPlaneGame from "./components/FlappyPlaneGame";
import LanguageSwitcher from "./components/LanguageSwitcher";
import { useTranslation } from "react-i18next";

function App() {
  const { t } = useTranslation();

  // Função para gerar a mensagem de boas-vindas
  const getWelcomeMessage = () => <BoasVindas key="welcome" />;

  // Estado inicial com mensagem de boas-vindas
  const [terminalLineData, setTerminalLineData] = useState([
    getWelcomeMessage(),
  ]);

  // Estado para saber se o jogo está aberto (última linha é FlappyPlaneGame)
  const isGameOpen =
    terminalLineData.length > 0 &&
    terminalLineData[terminalLineData.length - 1]?.type === FlappyPlaneGame;

  function handleInput(input) {
    let newLines = [...terminalLineData];
    newLines.push(
      <TerminalInput key={`input-${newLines.length}`}>
        {myPrompt} {input}
      </TerminalInput>
    );

    const args = input.toLowerCase().trim().split(" ");
    const userInput = args[0];

    const command = Object.values(commandList).find(
      (cmd) => cmd.name === userInput || cmd.aliases.includes(userInput)
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
        case "experiencias":
          response = <Experiencias />;
          break;
        case "contato":
          response = <Contato />;
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
        case "game":
          response = (
            <FlappyPlaneGame
              onExit={() => {
                // Remove o último comando (o jogo) do terminal
                setTerminalLineData((lines) => lines.slice(0, -1));
              }}
            />
          );
          break;
        default:
          break;
      }
    } else {
      response = (
        <TerminalOutput>
          {t("comando.nao_reconhecido")} "{userInput}"<br />
          {t("comando.ver_ajuda")}
        </TerminalOutput>
      );
    }
    if (Array.isArray(response)) {
      newLines.push(...response);
    } else {
      newLines.push(response);
    }
    setTerminalLineData(newLines);
  }

  const myPrompt = "visitante@portfolio:~$";
  const terminalTitle = "Portfólio terminal";

  return (
    <div className="container">
      <LanguageSwitcher />
      <Terminal
        name={terminalTitle}
        colorMode={ColorMode.Dark}
        onInput={isGameOpen ? undefined : handleInput}
        prompt={myPrompt}
        height="85vh"
      >
        {terminalLineData}
      </Terminal>
    </div>
  );
}

export default App;
