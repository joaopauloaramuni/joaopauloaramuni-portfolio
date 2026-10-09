import React, { useRef } from "react";
import { useTranslation } from "react-i18next";
import { useCodando } from "../lib/codando";
import { formatDuration } from "../lib/wakatime";
import useOnScreen from "../terminal/useOnScreen";
import { setTerminalInputValue } from "../terminal/terminalDom";

// Linha "Codando agora" da boas-vindas, logo abaixo do status de aula:
//   > ● Codando agora: joaopauloaramuni-portfolio · JavaScript · VS Code · sessão de 47 min
// Sai dos heartbeats do WakaTime (api/_codando.js). Só aparece enquanto estou
// mesmo programando; parado, sem chave ou no Docker, a linha não existe.
// Atualiza a cada minuto enquanto está na tela. Um clique escreve o
// wakatime --agora no terminal.

function preencherTerminal(comando) {
  const input = document.querySelector(".terminal-hidden-input");
  if (!input) return;
  input.focus();
  setTerminalInputValue(input, comando);
}

const CodandoAgora = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  const estado = useCodando(useOnScreen(ref));
  const ultimo = estado.dados?.ultimo;
  const ativo = estado.status === "ok" && estado.dados.ativo && ultimo;

  // O <p> é sempre o mesmo elemento (vazio quando parado): o useOnScreen
  // observa o nó da montagem e não pode perdê-lo quando a linha aparece
  if (!ativo) return <p className="welcome-codando-vazio" ref={ref} aria-hidden="true" />;

  const sessaoS = (ultimo.em - ultimo.sessaoDesde) / 1000;
  const detalhes = [
    ultimo.publico ? ultimo.projeto : t("wakatime.agora.privado"),
    ultimo.linguagem,
    ultimo.editor,
    sessaoS >= 60 && t("wakatime.agora.sessao_de", { duracao: formatDuration(sessaoS) }),
  ].filter(Boolean);
  const comando = t("boasvindas.codando.comando");

  return (
    <p className="welcome-status welcome-codando" ref={ref}>
      {"> "}
      <button
        type="button"
        className="welcome-status-btn"
        title={t("boasvindas.codando.dica", { comando })}
        onClick={() => preencherTerminal(comando)}
      >
        <span className="welcome-status-dot welcome-status-codando" aria-hidden="true" />
        <span>
          <span className="welcome-status-rotulo">{t("boasvindas.codando.rotulo")}</span>
          {detalhes.map((parte) => (
            <React.Fragment key={parte}>
              <span className="welcome-status-sep" aria-hidden="true">·</span>
              <span className="sr-only">, </span>
              {parte}
            </React.Fragment>
          ))}
        </span>
      </button>
    </p>
  );
};

export default CodandoAgora;
