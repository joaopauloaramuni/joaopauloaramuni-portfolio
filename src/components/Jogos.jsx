import React, { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import GALO_CONFIG from "../config/galoConfig";
import { FUSO_HORARIO } from "../data/horarioData";
import { fetchJogosDoGalo } from "../lib/galo";
import { useTheme } from "../theme/themeContext";
import useOnScreen from "../terminal/useOnScreen";
import { isLastTerminalOutput, scrollLastCommandToTop } from "../terminal/terminalDom";
import "./Jogos.css";

// =====================================================================
// Comando "jogos" (ou "galo", "atletico"): os próximos jogos do Atlético
// Mineiro, ao vivo da ESPN (ver lib/galo.js e config/galoConfig.js).
//   jogos          os próximos GALO_CONFIG.PROXIMOS jogos
//   jogos --todos  todos os jogos já marcados
// Cada jogo mostra o campeonato (com o logo), a fase, os escudos, o
// dia e a hora (de Brasília), o estádio e quanto falta. O primeiro tem uma
// contagem regressiva que anda sozinha. No jogo de volta de um mata-mata
// aparece o placar agregado (a ida, somada) e o que o Galo precisa fazer.
// =====================================================================

const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

// Hora de agora, renovada a cada segundo enquanto a saída está na tela (as
// saídas antigas continuam montadas: sem isso, cada "jogos" já rodado
// seguiria redesenhando a contagem)
function useAgora(ativo) {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    if (!ativo) return;
    setAgora(Date.now());
    const id = setInterval(() => setAgora(Date.now()), 1000);
    return () => clearInterval(id);
  }, [ativo]);
  return agora;
}

function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "pt-BR";
  return useMemo(() => {
    const opcoes = (extra) => new Intl.DateTimeFormat(locale, { timeZone: FUSO_HORARIO, ...extra });
    const semana = opcoes({ weekday: "short" });
    const diaMes = opcoes({ day: "2-digit", month: "2-digit" });
    const hora = opcoes({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    // "2026-10-08": o dia no fuso de Brasília, para contar "hoje" e "amanhã"
    const iso = new Intl.DateTimeFormat("en-CA", { timeZone: FUSO_HORARIO });
    return {
      locale,
      semana: (ms) => semana.format(ms).replace(".", ""),
      diaMes: (ms) => diaMes.format(ms),
      hora: (ms) => hora.format(ms),
      diaIso: (ms) => iso.format(ms),
    };
  }, [locale]);
}

// Quantos dias do calendário (em Brasília) separam hoje do jogo
function diasAte(f, data, agora) {
  const utc = (ms) => {
    const [ano, mes, dia] = f.diaIso(ms).split("-").map(Number);
    return Date.UTC(ano, mes - 1, dia);
  };
  return Math.round((utc(data) - utc(agora)) / DIA);
}

// "qui · 08/10", "hoje", "amanhã"
function rotuloDoDia(t, f, data, agora) {
  const dias = diasAte(f, data, agora);
  if (dias === 0) return t("jogos.dia.hoje");
  if (dias === 1) return t("jogos.dia.amanha");
  return `${f.semana(data)} · ${f.diaMes(data)}`;
}

const partesDoTempo = (ms) => ({
  dias: Math.floor(ms / DIA),
  horas: Math.floor((ms % DIA) / HORA),
  minutos: Math.floor((ms % HORA) / MINUTO),
  segundos: Math.floor((ms % MINUTO) / 1000),
});

// "em 5 dias", "em 1 dia e 4 h", "em 3 h e 12 min", "em 12 min"
function quantoFalta(t, f, jogo, agora) {
  if (jogo.estado === "in") return t("jogos.tempo.ao_vivo");
  const ms = jogo.data - agora;
  if (ms <= 0) return t("jogos.tempo.comecando");
  // Sem horário confirmado, só os dias fazem sentido
  if (!jogo.horaDefinida) {
    const dias = diasAte(f, jogo.data, agora);
    if (dias === 0) return t("jogos.tempo.hoje");
    return t("jogos.tempo.dias", { count: dias });
  }
  const { dias, horas, minutos } = partesDoTempo(ms);
  if (dias >= 7 || (dias >= 1 && horas === 0)) return t("jogos.tempo.dias", { count: dias });
  if (dias >= 1) {
    return t("jogos.tempo.dias_horas", { dias: t("jogos.tempo.n_dias", { count: dias }), horas });
  }
  if (horas >= 1) return t("jogos.tempo.horas_minutos", { horas, minutos });
  return t("jogos.tempo.minutos", { count: Math.max(1, minutos) });
}

// "Semifinals" → "semi" (o nome traduzido fica em jogos.fases.<chave>).
// A ordem importa: "Semifinals" e "Quarterfinals" também têm "final".
const FASES = [
  [/group/i, "grupos"],
  [/(round|rd) of 32/i, "dezesseis_avos"],
  [/(round|rd) of 16/i, "oitavas"],
  [/quarter/i, "quartas"],
  [/semi/i, "semi"],
  [/third place/i, "terceiro"],
  [/final/i, "final"],
  [/first (stage|round)/i, "fase1"],
  [/second (stage|round)/i, "fase2"],
  [/third (stage|round)/i, "fase3"],
  [/fourth (stage|round)/i, "fase4"],
  [/fifth (stage|round)/i, "fase5"],
  [/playoff|knockout/i, "playoffs"],
];

function nomeDaFase(t, fase) {
  if (!fase) return null;
  const chave = FASES.find(([regex]) => regex.test(fase))?.[1];
  return chave ? t(`jogos.fases.${chave}`) : fase;
}

function nomeDaCompeticao(t, competicao) {
  const chave = GALO_CONFIG.COMPETICOES[competicao.slug];
  return chave ? t(`jogos.competicoes.${chave}`) : competicao.nome;
}

/* ---------------------------------------------------------------------
   Pedaços
   --------------------------------------------------------------------- */

// Escudo de um time, na versão para fundo escuro nos temas escuro e galo
function Escudo({ time, escuro, className = "jogos-escudo" }) {
  const [falhou, setFalhou] = useState(false);
  const src = escuro ? time?.escudoEscuro : time?.escudo;
  if (!src || falhou) {
    return (
      <span className={`${className} jogos-escudo-vazio`} aria-hidden="true">
        {time?.sigla?.slice(0, 3) || "?"}
      </span>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt=""
      loading="lazy"
      width="60"
      height="60"
      onError={() => setFalhou(true)}
    />
  );
}

// Logo do campeonato (ESPN); sem ele, um troféu no lugar
function LogoDaCompeticao({ logo, nome }) {
  const [falhou, setFalhou] = useState(false);
  if (!logo || falhou) return <span className="jogos-taca jogos-taca-vazia" aria-hidden="true">🏆</span>;
  return (
    <img
      className="jogos-taca"
      src={logo}
      alt={nome}
      title={nome}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  );
}

function Time({ time, escuro, lado }) {
  if (!time) return <span className="jogos-time" />;
  const galo = time.id === GALO_CONFIG.ESPN_TEAM_ID;
  return (
    <span className={`jogos-time jogos-time-${lado}${galo ? " jogos-time-galo" : ""}`}>
      <Escudo time={time} escuro={escuro} />
      <span className="jogos-time-nome" title={time.nome}>
        <span className="jogos-nome-longo">{time.nome}</span>
        <span className="jogos-nome-curto">{time.curto}</span>
      </span>
    </span>
  );
}

// Relógio do próximo jogo: dias, horas, minutos e segundos
function Relogio({ ms }) {
  const { t } = useTranslation();
  const { dias, horas, minutos, segundos } = partesDoTempo(Math.max(0, ms));
  const casas = [
    [dias, "d"],
    [horas, "h"],
    [minutos, "min"],
    [segundos, "s"],
  ];
  return (
    <div className="jogos-relogio" role="timer" aria-label={t("jogos.relogio_alt")}>
      {casas.map(([valor, unidade]) => (
        <span key={unidade} className="jogos-relogio-casa">
          <b>{String(valor).padStart(2, "0")}</b>
          <small>{t(`jogos.unidades.${unidade}`)}</small>
        </span>
      ))}
    </div>
  );
}

// Placar agregado do mata-mata (visto pelo lado do Galo) e o que ele precisa
function Agregado({ jogo }) {
  const { t } = useTranslation();
  const { serie, galo, adversario } = jogo;
  const f = useFormatters();
  if (!serie || serie.perna !== 2) return null;
  if (!serie.agregado) {
    // Ida ainda por jogar (as duas pela frente) ou placar da ida indisponível
    return (
      <p className="jogos-volta">
        {serie.idaEm ? t("jogos.serie.ida_em", { data: f.diaMes(serie.idaEm) }) : t("jogos.serie.sem_ida")}
      </p>
    );
  }
  const { galo: golsGalo, adversario: golsAdv } = serie.agregado;
  const saldo = golsGalo - golsAdv;
  const situacao =
    saldo > 0
      ? t("jogos.serie.vantagem", { count: saldo })
      : saldo < 0
        ? t("jogos.serie.desvantagem", { count: -saldo, mais: -saldo + 1 })
        : t("jogos.serie.empate");
  const ida = serie.ida;
  return (
    <div className={`jogos-agregado ${saldo > 0 ? "jogos-bom" : saldo < 0 ? "jogos-ruim" : ""}`}>
      <p>
        <span className="jogos-agregado-rotulo">{t("jogos.serie.agregado")}</span>{" "}
        <strong>
          {galo?.curto} {golsGalo} × {golsAdv} {adversario?.curto}
        </strong>
        {ida && jogo.estado !== "in" && (
          <span className="jogos-agregado-ida">
            {" "}
            ({t("jogos.serie.ida")}: {ida.mandante?.curto} {ida.mandante?.gols} × {ida.visitante?.gols}{" "}
            {ida.visitante?.curto})
          </span>
        )}
      </p>
      <p className="jogos-agregado-situacao">{situacao}</p>
    </div>
  );
}

function CardJogo({ jogo, destaque, agora, escuro }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const nomeCompeticao = nomeDaCompeticao(t, jogo.competicao);
  const fase = nomeDaFase(t, jogo.fase);
  const perna = jogo.perna === 1 ? t("jogos.serie.jogo_ida") : jogo.perna === 2 ? t("jogos.serie.jogo_volta") : null;
  const aoVivo = jogo.estado === "in";
  const logo = escuro ? jogo.competicao.logoEscuro : jogo.competicao.logo;

  return (
    <li className={`jogos-card${destaque ? " jogos-card-destaque" : ""}${aoVivo ? " jogos-card-vivo" : ""}`}>
      <LogoDaCompeticao logo={logo} nome={nomeCompeticao} />

      <div className="jogos-corpo">
        <p className="jogos-competicao">
          <strong>{nomeCompeticao}</strong>
          {[fase, perna].filter(Boolean).map((parte) => (
            <span key={parte} className="jogos-competicao-fase">
              {" · "}
              {parte}
            </span>
          ))}
        </p>

        <div className="jogos-confronto">
          <Time time={jogo.mandante} escuro={escuro} lado="casa" />
          <span className="jogos-x" aria-label={aoVivo ? t("jogos.placar_alt") : t("jogos.contra")}>
            {aoVivo ? `${jogo.mandante?.gols ?? 0} × ${jogo.visitante?.gols ?? 0}` : "×"}
          </span>
          <Time time={jogo.visitante} escuro={escuro} lado="fora" />
        </div>

        <p className="jogos-quando">
          <span className={`jogos-mando ${jogo.galoEmCasa ? "jogos-mando-casa" : ""}`}>
            {jogo.galoEmCasa ? t("jogos.casa") : t("jogos.fora")}
          </span>
          <span>
            {rotuloDoDia(t, f, jogo.data, agora)}
            {" · "}
            {jogo.horaDefinida ? f.hora(jogo.data) : t("jogos.hora_a_definir")}
          </span>
          {jogo.local && <span className="jogos-local">{jogo.local}</span>}
        </p>

        {aoVivo ? (
          <p className="jogos-falta jogos-falta-vivo">
            <span className="jogos-pulso" aria-hidden="true" />
            {t("jogos.tempo.ao_vivo")}
            {jogo.relogio && ` · ${jogo.relogio}`}
          </p>
        ) : destaque && jogo.horaDefinida && jogo.data > agora ? (
          <>
            <p className="jogos-falta">{t("jogos.proximo_em", { tempo: quantoFalta(t, f, jogo, agora) })}</p>
            <Relogio ms={jogo.data - agora} />
          </>
        ) : (
          <p className="jogos-falta">{quantoFalta(t, f, jogo, agora)}</p>
        )}

        <Agregado jogo={jogo} />
        {jogo.serie?.perna === 1 && jogo.serie.volta && (
          <p className="jogos-volta">{t("jogos.serie.volta_em", { data: f.diaMes(jogo.serie.volta) })}</p>
        )}
      </div>
    </li>
  );
}

function UltimoJogo({ jogo }) {
  const { t } = useTranslation();
  const f = useFormatters();
  if (!jogo?.mandante || !jogo?.visitante) return null;
  const nome = nomeDaCompeticao(t, jogo.competicao);
  const { mandante: m, visitante: v } = jogo;
  const penaltis = m.penaltis !== null && v.penaltis !== null ? ` (${m.penaltis} × ${v.penaltis} ${t("jogos.penaltis")})` : "";
  const saldo = (jogo.galo?.gols ?? 0) - (jogo.adversario?.gols ?? 0);
  const resultado = saldo > 0 ? "v" : saldo < 0 ? "d" : "e";
  return (
    <p className="jogos-ultimo">
      <span className="jogos-ultimo-rotulo">{t("jogos.ultimo")}</span>{" "}
      <span className={`jogos-resultado jogos-resultado-${resultado}`}>{t(`jogos.resultado.${resultado}`)}</span>{" "}
      {m.curto} <strong>{m.gols} × {v.gols}</strong> {v.curto}
      {penaltis}
      <span className="jogos-ultimo-meta">
        {" · "}
        {nome} · {f.diaMes(jogo.data)}
      </span>
    </p>
  );
}

/* ---------------------------------------------------------------------
   Comando
   --------------------------------------------------------------------- */

const Jogos = ({ todos = false }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const escuro = theme !== "light";
  const ref = useRef(null);
  const agora = useAgora(useOnScreen(ref));

  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    fetchJogosDoGalo()
      .then((resultado) => {
        if (!ativo) return;
        setDados(resultado);
        // Os dados chegam depois do comando: se ele ainda é a última saída,
        // leva o comando para o topo (a saída é mais alta que a tela)
        if (isLastTerminalOutput(ref.current)) scrollLastCommandToTop();
      })
      .catch((error) => {
        console.error("jogos: falha ao buscar na ESPN", error);
        if (ativo) setErro(true);
      });
    return () => {
      ativo = false;
    };
  }, []);

  const jogos = useMemo(() => {
    if (!dados) return [];
    return todos ? dados.proximos : dados.proximos.slice(0, GALO_CONFIG.PROXIMOS);
  }, [dados, todos]);

  const restantes = dados ? dados.proximos.length - jogos.length : 0;

  return (
    <section className="jogos" ref={ref} aria-labelledby="jogos-titulo">
      <header className="jogos-topo">
        {dados?.time ? (
          <Escudo time={dados.time} escuro={escuro} className="jogos-escudo-galo" />
        ) : (
          <img className="jogos-escudo-galo" src="/galo/escudo-cam.webp" alt="" width="56" height="56" />
        )}
        <div>
          <h3 className="jogos-titulo" id="jogos-titulo">
            {t("jogos.titulo")}
          </h3>
          <p className="jogos-subtitulo">
            {dados?.time?.posicao
              ? t("jogos.subtitulo_posicao", { posicao: dados.time.posicao })
              : t("jogos.subtitulo")}
          </p>
        </div>
      </header>

      {!dados && !erro && <p className="jogos-aviso">{t("jogos.carregando")}</p>}
      {erro && <p className="jogos-aviso jogos-erro">{t("jogos.erro")}</p>}
      {dados && jogos.length === 0 && <p className="jogos-aviso">{t("jogos.nenhum")}</p>}

      {jogos.length > 0 && (
        <ol className="jogos-lista">
          {jogos.map((jogo, i) => (
            <CardJogo
              key={jogo.id}
              jogo={jogo}
              destaque={i === 0}
              agora={agora}
              escuro={escuro}
            />
          ))}
        </ol>
      )}

      {restantes > 0 && (
        <p className="jogos-mais">
          <Trans i18nKey="jogos.mais" count={restantes} components={{ cmd: <code /> }} />
        </p>
      )}

      {dados?.ultimo && <UltimoJogo jogo={dados.ultimo} />}

      <p className="jogos-fonte">
        <Trans
          i18nKey="jogos.fonte"
          components={{
            espn: <a href={GALO_CONFIG.ESPN_PAGE} target="_blank" rel="noopener noreferrer" />,
          }}
        />
      </p>
    </section>
  );
};

export default Jogos;
