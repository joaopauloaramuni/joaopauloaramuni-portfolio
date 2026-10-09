import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { DISCIPLINAS } from "../data/horarioData";
import { agoraEmBH } from "../lib/horario";
import {
  statusAgora,
  corDoStatus,
  visaoDoCal,
  quandoRelativo,
  formatarHora,
} from "../lib/status";
import useOnScreen from "../terminal/useOnScreen";
import { setTerminalInputValue } from "../terminal/terminalDom";

// Status da tela de boas-vindas, no estilo do Slack:
//   > ● Em aula agora: DIAW G1 · Prédio 34, sala 210 · até 8h40
// Sai do horário de aula (data/horarioData.js) e do calendário da PUC, sem
// rede nenhuma: aparece junto com a tela, sem esperar. Atualiza sozinho a
// cada 30 s enquanto está na tela. Um clique escreve o cal no terminal.

// Recalcula a cada 30 s; fora da tela (a boas-vindas continua montada lá em
// cima depois de vários comandos), para, e ao voltar atualiza na hora
function useAgoraNaTela(ativo) {
  const [agora, setAgora] = useState(() => agoraEmBH());
  const parado = useRef(false);
  useEffect(() => {
    if (!ativo) {
      parado.current = true;
      return;
    }
    if (parado.current) {
      parado.current = false;
      setAgora(agoraEmBH());
    }
    const id = setInterval(() => setAgora(agoraEmBH()), 30_000);
    return () => clearInterval(id);
  }, [ativo]);
  return agora;
}

// Escreve o comando no input do terminal: o visitante só aperta Enter
function preencherTerminal(comando) {
  const input = document.querySelector(".terminal-hidden-input");
  if (!input) return;
  input.focus();
  setTerminalInputValue(input, comando);
}

const siglaDa = (aula) =>
  [DISCIPLINAS[aula.disciplina]?.sigla ?? aula.disciplina, aula.turma].filter(Boolean).join(" ");

// "Prédio 34, sala 210", "online (Teams)" ou, sem sala cadastrada, o campus
function localDa(t, aula) {
  const { local } = aula;
  if (local?.online) return t("status.local.online", { plataforma: local.online });
  if (local) return t("status.local.sala", { predio: local.predio, sala: local.sala });
  return t("status.local.campus", { campus: t(`cal.campi.${aula.campus}`) });
}

// "hoje às 19h", "amanhã às 7h", "segunda-feira às 7h", "em 3/8 às 7h"
function quandoDa(t, proxima, hojeMs, lang) {
  const locale = lang === "en" ? "en-US" : "pt-BR";
  const hora = formatarHora(proxima.aula.inicio, lang);
  const dia = new Intl.DateTimeFormat(locale, { weekday: "long", timeZone: "UTC" }).format(
    proxima.diaMs
  );
  const data = new Intl.DateTimeFormat(
    locale,
    lang === "en"
      ? { month: "short", day: "numeric", timeZone: "UTC" }
      : { day: "numeric", month: "numeric", timeZone: "UTC" }
  ).format(proxima.diaMs);
  return t(`status.quando.${quandoRelativo(proxima.diaMs, hojeMs)}`, { hora, dia, data });
}

// Rótulo em destaque e os detalhes separados por "·"
function textosDo(status, t, agora, lang) {
  const { tipo, aula, proxima } = status;
  const quando = proxima ? quandoDa(t, proxima, agora.diaMs, lang) : null;
  const proximaAula = quando && t("status.proxima_aula", { quando });
  const voltam = quando && t("status.voltam", { quando });

  switch (tipo) {
    case "aula":
      return {
        rotulo: t("status.aula"),
        detalhes: [
          siglaDa(aula),
          localDa(t, aula),
          t("status.ate", { hora: formatarHora(aula.fim, lang) }),
        ],
      };
    case "a_caminho":
      return {
        rotulo: t("status.a_caminho"),
        detalhes: [
          t("status.as", { disciplina: siglaDa(aula), hora: formatarHora(aula.inicio, lang) }),
          localDa(t, aula),
        ],
      };
    case "disponivel":
    case "encerradas":
      return { rotulo: t(`status.${tipo}`), detalhes: [proximaAula] };
    case "sem_aulas":
      return { rotulo: t("status.disponivel"), detalhes: [t("status.sem_aulas_hoje"), proximaAula] };
    case "sabado":
    case "domingo":
      return { rotulo: t(`status.${tipo}`), detalhes: [t(`status.descanso_${tipo}`), proximaAula] };
    case "feriado":
    case "recesso":
      return {
        rotulo: t(`status.${tipo}`, { nome: t(`cal.feriados.${status.chave}`) }),
        detalhes: [t("status.sem_aulas_hoje"), voltam],
      };
    default:
      return { rotulo: t("status.ferias"), detalhes: [voltam] };
  }
}

const StatusAgora = () => {
  const { t, i18n } = useTranslation();
  const lang = i18n.language.startsWith("en") ? "en" : "pt";
  const ref = useRef(null);
  const agora = useAgoraNaTela(useOnScreen(ref));

  const status = statusAgora(agora);
  const { rotulo, detalhes } = textosDo(status, t, agora, lang);
  const comando = t(`status.comando.${visaoDoCal(status.tipo)}`);

  // Nome completo da disciplina na dica, já que a linha mostra só a sigla
  const disciplina = status.aula && t(`cal.disciplinas.${status.aula.disciplina}`);
  const dica = [disciplina, t("status.dica", { comando })].filter(Boolean).join(" · ");

  return (
    <p className="welcome-status" ref={ref}>
      {"> "}
      <button
        type="button"
        className="welcome-status-btn"
        title={dica}
        onClick={() => preencherTerminal(comando)}
      >
        <span
          className={`welcome-status-dot welcome-status-${corDoStatus(status.tipo)}`}
          aria-hidden="true"
        />
        <span>
          <span className="welcome-status-rotulo">{rotulo}</span>
          {detalhes.filter(Boolean).map((parte) => (
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

export default StatusAgora;
