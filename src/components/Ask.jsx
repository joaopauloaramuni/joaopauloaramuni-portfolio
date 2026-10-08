import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import ASK_CONFIG from "../config/askConfig";
import { commandList } from "../commands";
import { ErroAsk, esquecerConversa, perguntar } from "../lib/ask";
import { setTerminalInputValue } from "../terminal/terminalDom";
import useCommandAtTop from "../terminal/useCommandAtTop";
import "./Ask.css";

// Comando "pergunta" (alias "ask"): o visitante pergunta e a IA responde em primeira pessoa,
// ao lado da minha foto, com base no meu currículo e no portfólio.
//
//   pergunta                   apresentação e sugestões de perguntas
//   pergunta <texto>           resposta da IA, digitada aos poucos
//   pergunta --nova | --new    esquece a conversa (as perguntas anteriores)
// "ask" é o alias em inglês; as sugestões usam o nome no idioma da página.
//
// A chamada à IA fica no servidor (api/_ask.js); aqui só o fetch, a memória
// da conversa (lib/ask.js) e o desenho da resposta.

const { AVATAR, MAX_PERGUNTA } = ASK_CONFIG;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

// Nomes e aliases dos comandos: um `comando` na resposta vira botão
const COMANDOS = new Set(Object.values(commandList).flatMap((cmd) => [cmd.name, ...cmd.aliases]));
const ehComando = (codigo) => COMANDOS.has(codigo.trim().split(/\s+/)[0]?.toLowerCase());

// Escreve o comando no input do terminal: o visitante só aperta Enter
function preencherTerminal(comando) {
  const input = document.querySelector(".terminal-hidden-input");
  if (!input) return;
  input.focus();
  setTerminalInputValue(input, comando);
}

function BotaoComando({ children }) {
  const { t } = useTranslation();
  return (
    <button
      type="button"
      className="ask-cmd"
      title={t("ask.preencher")}
      onClick={() => preencherTerminal(children)}
    >
      {children}
    </button>
  );
}

/* ---------- Markdown leve ---------- */

// A IA escreve **negrito**, `comando`, [texto](url), links soltos e listas
// com "- ". Vira React (nada de innerHTML). Enquanto a resposta chega, um
// "**" ainda sem par aparece como texto até o par chegar.
const INLINE =
  /(\*\*([^*\n]+)\*\*)|(`([^`\n]+)`)|(\[([^\]\n]+)\]\((https?:\/\/[^\s)]+)\))|(https?:\/\/[^\s<>()]*[^\s<>().,;:!?'"*])/g;

function inline(texto, prefixo) {
  const partes = [];
  let ultimo = 0;
  for (const m of texto.matchAll(INLINE)) {
    if (m.index > ultimo) partes.push(texto.slice(ultimo, m.index));
    const chave = `${prefixo}-${m.index}`;
    if (m[1]) {
      partes.push(<strong key={chave}>{m[2]}</strong>);
    } else if (m[3]) {
      partes.push(
        ehComando(m[4]) ? <BotaoComando key={chave}>{m[4]}</BotaoComando> : <code key={chave}>{m[4]}</code>
      );
    } else {
      const href = m[7] ?? m[8];
      partes.push(
        <a key={chave} href={href} target="_blank" rel="noopener noreferrer">
          {m[6] ?? m[8]}
        </a>
      );
    }
    ultimo = m.index + m[0].length;
  }
  if (ultimo < texto.length) partes.push(texto.slice(ultimo));
  return partes;
}

const ITEM = /^\s*(?:[-*•]|\d+[.)])\s+/;

// cursor: elemento que vai no fim do último parágrafo (ou item), na mesma linha
function Markdown({ texto, cursor = null }) {
  const blocos = texto.split(/\n{2,}/).filter((bloco) => bloco.trim());
  return blocos.map((bloco, b) => {
    const ultimoBloco = b === blocos.length - 1;
    // Linhas seguidas de lista viram um <ul>; as outras, um parágrafo
    const grupos = [];
    for (const linha of bloco.split("\n")) {
      const tipo = ITEM.test(linha) ? "lista" : "texto";
      const atual = grupos[grupos.length - 1];
      if (atual?.tipo === tipo) atual.linhas.push(linha);
      else grupos.push({ tipo, linhas: [linha] });
    }
    return grupos.map((grupo, g) => {
      const chave = `${b}-${g}`;
      const fim = ultimoBloco && g === grupos.length - 1 ? cursor : null;
      if (grupo.tipo === "lista") {
        return (
          <ul key={chave} className="ask-lista">
            {grupo.linhas.map((linha, i) => (
              <li key={i}>
                {inline(linha.replace(ITEM, ""), `${chave}-${i}`)}
                {i === grupo.linhas.length - 1 && fim}
              </li>
            ))}
          </ul>
        );
      }
      return (
        <p key={chave}>
          {grupo.linhas.map((linha, i) => (
            <React.Fragment key={i}>
              {i > 0 && <br />}
              {inline(linha, `${chave}-${i}`)}
            </React.Fragment>
          ))}
          {fim}
        </p>
      );
    });
  });
}

/* ---------- Balão com a foto ---------- */

function Balao({ children, estado = "pronto" }) {
  const { t } = useTranslation();
  return (
    <div className={`ask-balao ask-estado-${estado}`}>
      <img src={AVATAR} alt="" aria-hidden="true" className="ask-avatar" width="40" height="40" />
      <div className="ask-corpo">
        <p className="ask-autor">
          <span className="ask-nome">{t("ask.nome")}</span>
          <span className="ask-selo" title={t("ask.selo_title")}>
            {t("ask.selo")}
          </span>
        </p>
        <div className="ask-texto">{children}</div>
      </div>
    </div>
  );
}

function Digitando() {
  const { t } = useTranslation();
  return (
    <p className="ask-digitando" role="status">
      <span className="ask-sr">{t("ask.digitando")}</span>
      <span aria-hidden="true">
        <i />
        <i />
        <i />
      </span>
    </p>
  );
}

/* ---------- Sem pergunta: apresentação ---------- */

function Apresentacao() {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const sugestoes = t("ask.sugestoes", { returnObjects: true });
  return (
    <div className="ask-container" ref={ref}>
      <Balao>
        <p>{t("ask.ola")}</p>
      </Balao>
      <div className="ask-sugestoes">
        <p className="ask-sugestoes-titulo">{t("ask.experimente")}</p>
        <ul>
          {(Array.isArray(sugestoes) ? sugestoes : []).map((sugestao) => (
            <li key={sugestao}>
              <BotaoComando>{`${t("ask.comando")} ${sugestao}`}</BotaoComando>
            </li>
          ))}
        </ul>
      </div>
      <p className="ask-aviso">{t("ask.aviso")}</p>
    </div>
  );
}

/* ---------- Com pergunta: resposta da IA ---------- */

// Mensagem de erro no idioma da página (ver api/_ask.js)
function mensagemDeErro(t, erro) {
  const codigo = erro instanceof ErroAsk ? erro.codigo : "falha_ia";
  const espera = erro?.esperaSegundos;
  const chave = `ask.erros.${codigo}`;
  const texto = t(chave, { max: MAX_PERGUNTA });
  const base = texto === chave ? t("ask.erros.falha_ia") : texto;
  if (codigo !== "limite" || !espera) return base;
  // Limite por minuto: diz quantos segundos; limite do dia: "mais tarde"
  return espera <= 90
    ? `${base} ${t("ask.erros.espera", { count: espera })}`
    : `${base} ${t("ask.erros.espera_depois")}`;
}

function Resposta({ pergunta }) {
  const { t, i18n } = useTranslation();
  const ref = useRef(null);
  const [estado, setEstado] = useState("esperando"); // esperando → escrevendo → pronto | erro
  const [visivel, setVisivel] = useState("");
  const [erro, setErro] = useState(null);

  // Texto recebido até agora e se o stream acabou: o efeito de digitação
  // corre atrás deles, alguns caracteres por quadro
  const recebido = useRef("");
  const terminou = useRef(false);

  useEffect(() => {
    const controle = new AbortController();
    const instantaneo = prefersReducedMotion();
    let quadro = null;
    let mostrados = 0;

    const digitar = () => {
      quadro = null;
      const alvo = recebido.current;
      if (mostrados < alvo.length) {
        // Quanto mais atrasado, mais rápido: chunks grandes não demoram
        const passo = instantaneo ? alvo.length : Math.max(2, Math.ceil((alvo.length - mostrados) / 12));
        mostrados = Math.min(alvo.length, mostrados + passo);
        setVisivel(alvo.slice(0, mostrados));
      }
      if (mostrados < alvo.length) quadro = requestAnimationFrame(digitar);
      else if (terminou.current) setEstado("pronto");
    };
    const agendar = () => {
      quadro ??= requestAnimationFrame(digitar);
    };

    // Começa no próximo tick: no StrictMode (npm run dev) o React monta,
    // desmonta e monta de novo, e a primeira montagem não chega a gastar uma
    // chamada da cota da IA
    const inicio = setTimeout(() => {
      perguntar(pergunta, {
        idioma: i18n.language?.startsWith("en") ? "en" : "pt",
        sinal: controle.signal,
        aoReceber: (texto) => {
          recebido.current = texto;
          setEstado((atual) => (atual === "esperando" ? "escrevendo" : atual));
          agendar();
        },
      })
        .then(() => {
          terminou.current = true;
          agendar();
        })
        .catch((error) => {
          if (error?.name === "AbortError") return;
          setErro(error);
          setEstado("erro");
        });
    }, 0);

    return () => {
      clearTimeout(inicio);
      controle.abort();
      if (quadro) cancelAnimationFrame(quadro);
    };
    // Cada saída do terminal é uma pergunta: roda uma vez, no idioma de então
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pergunta]);

  // A pergunta fica no topo e a resposta vai sendo escrita logo abaixo: o
  // hook acompanha o texto crescendo até a pergunta chegar no topo e, dali
  // em diante, o visitante lê no próprio ritmo (ver terminal/useCommandAtTop.js)
  useCommandAtTop(ref);

  return (
    <div className="ask-container" ref={ref} aria-live="polite" aria-busy={estado !== "pronto" && estado !== "erro"}>
      <Balao estado={estado}>
        {estado === "esperando" && <Digitando />}
        {visivel && (
          <Markdown
            texto={visivel}
            cursor={estado === "escrevendo" ? <span className="ask-cursor" aria-hidden="true" /> : null}
          />
        )}
        {estado === "erro" && <p className="ask-erro">{mensagemDeErro(t, erro)}</p>}
      </Balao>
    </div>
  );
}

/* ---------- Comando ---------- */

const Ask = ({ pergunta = "", nova = false }) => {
  const { t } = useTranslation();
  const [reiniciou] = useState(() => {
    if (nova) esquecerConversa();
    return nova;
  });

  if (reiniciou) {
    return <p className="ask-nota">{t("ask.nova")}</p>;
  }
  if (!pergunta) return <Apresentacao />;
  if (pergunta.length > MAX_PERGUNTA) {
    return <p className="ask-nota ask-erro">{t("ask.erros.pergunta_longa", { max: MAX_PERGUNTA })}</p>;
  }
  return <Resposta pergunta={pergunta} />;
};

export default Ask;
