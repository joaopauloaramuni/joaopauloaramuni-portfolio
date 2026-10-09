import React, { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import NBA_CONFIG from "../config/nbaConfig";
import { FUSO_HORARIO } from "../data/horarioData";
import { fetchJogosDaNba, fetchJogosDoTime } from "../lib/nba";
import { useTheme } from "../theme/themeContext";
import useOnScreen from "../terminal/useOnScreen";
import useCommandAtTop from "../terminal/useCommandAtTop";
// Mesmo desenho do "campeonato": os cards, o relógio e a moldura vêm do
// Jogos.css; o Basquete.css só acrescenta o que é do basquete
import "./Jogos.css";
import "./Basquete.css";

// =====================================================================
// Comando "basquete" (ou "basketball", "nba"): os próximos jogos da NBA,
// ao vivo da ESPN (ver lib/nba.js e config/nbaConfig.js).
//   basquete            os próximos NBA_CONFIG.PROXIMOS jogos da liga
//   basquete --todos    todos os jogos dos próximos dias
//   basquete lal        os próximos jogos de um time (sigla ou apelido:
//                       "nba lakers", "nba gsw", "nba celtics --todos")
// Cada jogo mostra a fase (pré-temporada, temporada regular, playoffs), os
// logos dos times com a campanha, o dia e a hora (de Brasília), o ginásio,
// a TV e quanto falta. O primeiro que ainda não começou tem uma contagem
// regressiva que anda sozinha (os jogos ao vivo vêm antes, com o placar e o
// quarto). Nos playoffs aparece a rodada, o jogo da série e quem lidera.
// =====================================================================

const MINUTO = 60 * 1000;
const HORA = 60 * MINUTO;
const DIA = 24 * HORA;

// Hora de agora, renovada a cada segundo só enquanto a saída está na tela
// (mesma ideia do Jogos.jsx)
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
  if (dias === 0) return t("basquete.dia.hoje");
  if (dias === 1) return t("basquete.dia.amanha");
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
  if (jogo.estado === "in") return t("basquete.tempo.ao_vivo");
  const ms = jogo.data - agora;
  if (ms <= 0) return t("basquete.tempo.comecando");
  if (!jogo.horaDefinida) {
    const dias = diasAte(f, jogo.data, agora);
    if (dias === 0) return t("basquete.tempo.hoje");
    return t("basquete.tempo.dias", { count: dias });
  }
  const { dias, horas, minutos } = partesDoTempo(ms);
  if (dias >= 7 || (dias >= 1 && horas === 0)) return t("basquete.tempo.dias", { count: dias });
  if (dias >= 1) {
    return t("basquete.tempo.dias_horas", { dias: t("basquete.tempo.n_dias", { count: dias }), horas });
  }
  if (horas >= 1) return t("basquete.tempo.horas_minutos", { horas, minutos });
  return t("basquete.tempo.minutos", { count: Math.max(1, minutos) });
}

/* ---------------------------------------------------------------------
   Textos que a ESPN manda em inglês
   --------------------------------------------------------------------- */

// "East 1st Round - Game 3" → "1ª rodada do Leste · jogo 3";
// "NBA Finals - Game 2" → "Finais da NBA · jogo 2". O que não reconhecer
// (NBA Cup, jogos no exterior...) aparece como veio.
const RODADAS = [
  [/1st round|first round/i, "primeira"],
  [/semifinal/i, "semi"],
  [/final/i, "final"],
  [/play-?in/i, "playin"],
];

function nomeDaNota(t, nota) {
  if (!nota) return null;
  const [titulo, resto] = nota.split(/\s+-\s+/);
  const jogo = /game\s+(\d+)/i.exec(resto ?? "")?.[1];
  const sufixo = jogo ? ` · ${t("basquete.serie.jogo", { n: jogo })}` : "";

  if (/^nba finals/i.test(titulo)) return t("basquete.rodadas.finais") + sufixo;
  const conferencia = /^(east|west)/i.exec(titulo)?.[1]?.toLowerCase();
  const rodada = RODADAS.find(([regex]) => regex.test(titulo))?.[1];
  if (conferencia && rodada) {
    return (
      t("basquete.rodadas.conferencia", {
        rodada: t(`basquete.rodadas.${rodada}`),
        conf: t(`basquete.conferencias.${conferencia}`),
      }) + sufixo
    );
  }
  return nota;
}

// "ORL leads series 2-1", "Series tied 2-2", "BOS wins series 4-1"
function situacaoDaSerie(t, serie) {
  if (!serie) return null;
  let m = /^(.+?) leads? series (\d+)-(\d+)/i.exec(serie);
  if (m) return t("basquete.serie.lidera", { time: m[1], a: m[2], b: m[3] });
  m = /^series tied (\d+)-(\d+)/i.exec(serie);
  if (m) return t("basquete.serie.empatada", { a: m[1], b: m[2] });
  m = /^(.+?) wins? series (\d+)-(\d+)/i.exec(serie);
  if (m) return t("basquete.serie.venceu", { time: m[1], a: m[2], b: m[3] });
  return serie;
}

// "Pacific Division" → "Divisão do Pacífico"
function nomeDoGrupo(t, grupo) {
  if (!grupo) return null;
  const chave = /^(\w+)/.exec(grupo)?.[1]?.toLowerCase();
  return t(`basquete.grupos.${chave}`, { defaultValue: grupo });
}

// Quarto em andamento: "3º quarto · 7:57", "intervalo", "prorrogação · 2:10"
function momentoDoJogo(t, jogo) {
  if (/HALFTIME/.test(jogo.statusNome)) return t("basquete.momento.intervalo");
  const { periodo, relogio } = jogo;
  if (!periodo) return null;
  if (/END_PERIOD/.test(jogo.statusNome)) {
    return periodo > 4 ? t("basquete.momento.fim_prorrogacao") : t("basquete.momento.fim_quarto", { n: periodo });
  }
  const nome =
    periodo > 4
      ? t("basquete.momento.prorrogacao", { count: periodo - 4 })
      : t("basquete.momento.quarto", { n: periodo });
  return relogio ? `${nome} · ${relogio}` : nome;
}

/* ---------------------------------------------------------------------
   Pedaços
   --------------------------------------------------------------------- */

// Logo de um time, na versão para fundo escuro nos temas escuro e galo
function Escudo({ time, escuro, className = "jogos-escudo" }) {
  const [falhou, setFalhou] = useState(false);
  const src = escuro ? time?.escudoEscuro : time?.escudo;
  if (!src || falhou) {
    return (
      <span className={`${className} jogos-escudo-vazio`} aria-hidden="true">
        {time?.sigla?.slice(0, 4) || "?"}
      </span>
    );
  }
  return (
    <img
      className={className}
      src={src}
      alt=""
      loading="lazy"
      width="76"
      height="76"
      onError={() => setFalhou(true)}
    />
  );
}

// Logo da NBA no lugar do logo do campeonato; sem ele, uma bola
function LogoDaNba({ escuro, className = "jogos-taca" }) {
  const { t } = useTranslation();
  const [falhou, setFalhou] = useState(false);
  if (falhou) {
    return (
      <span className={`${className} jogos-taca-vazia`} aria-hidden="true">
        🏀
      </span>
    );
  }
  return (
    <img
      className={`${className} basquete-logo-nba`}
      src={escuro ? NBA_CONFIG.LOGO_ESCURO : NBA_CONFIG.LOGO}
      alt={t("basquete.nba")}
      title={t("basquete.nba")}
      loading="lazy"
      onError={() => setFalhou(true)}
    />
  );
}

// "lado" é a posição no card: o da esquerda fica com o logo colado no
// centro (a classe jogos-time-casa do Jogos.css faz isso)
function Time({ time, escuro, lado, destaque }) {
  const { t } = useTranslation();
  if (!time) return <span className="jogos-time" />;
  const posicao = lado === "esquerda" ? "jogos-time-casa" : "jogos-time-fora";
  return (
    <span className={`jogos-time ${posicao}${destaque ? " jogos-time-galo" : ""}`}>
      <Escudo time={time} escuro={escuro} />
      <span className="basquete-time-texto">
        <span className="jogos-time-nome" title={time.nome}>
          <span className="jogos-nome-longo">{time.nome}</span>
          <span className="jogos-nome-curto">{time.curto}</span>
        </span>
        {time.campanha && (
          <small className="basquete-campanha" title={t("basquete.campanha_alt")}>
            {time.campanha}
          </small>
        )}
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
    <div className="jogos-relogio" role="timer" aria-label={t("basquete.relogio_alt")}>
      {casas.map(([valor, unidade]) => (
        <span key={unidade} className="jogos-relogio-casa">
          <b>{String(valor).padStart(2, "0")}</b>
          <small>{t(`basquete.unidades.${unidade}`)}</small>
        </span>
      ))}
    </div>
  );
}

function CardJogo({ jogo, destaque, agora, escuro, meuTimeId }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const aoVivo = jogo.estado === "in";
  const fase = jogo.fase ? t(`basquete.fases.${jogo.fase}`) : null;
  const nota = nomeDaNota(t, jogo.nota);
  const serie = situacaoDaSerie(t, jogo.serie);
  // Na visão de um time: em casa ou fora; na da liga: a TV
  const meu = meuTimeId ? [jogo.mandante, jogo.visitante].find((lado) => lado?.id === meuTimeId) : null;
  const momento = aoVivo ? momentoDoJogo(t, jogo) : null;

  return (
    <li className={`jogos-card${destaque ? " jogos-card-destaque" : ""}${aoVivo ? " jogos-card-vivo" : ""}`}>
      <LogoDaNba escuro={escuro} />

      <div className="jogos-corpo">
        <p className="jogos-competicao">
          <strong>{t("basquete.nba")}</strong>
          {[fase, nota].filter(Boolean).map((parte) => (
            <span key={parte} className="jogos-competicao-fase">
              {" · "}
              {parte}
            </span>
          ))}
        </p>

        {/* Como na NBA: visitante à esquerda, "@" e o mandante à direita */}
        <div className="jogos-confronto">
          <Time
            time={jogo.visitante}
            escuro={escuro}
            lado="esquerda"
            destaque={meuTimeId && jogo.visitante?.id === meuTimeId}
          />
          <span className="jogos-x" aria-label={aoVivo ? t("basquete.placar_alt") : t("basquete.contra")}>
            {aoVivo ? `${jogo.visitante?.pontos ?? 0} × ${jogo.mandante?.pontos ?? 0}` : "@"}
          </span>
          <Time
            time={jogo.mandante}
            escuro={escuro}
            lado="direita"
            destaque={meuTimeId && jogo.mandante?.id === meuTimeId}
          />
        </div>

        <p className="jogos-quando">
          {meu ? (
            <span className={`jogos-mando ${meu.casa ? "jogos-mando-casa" : ""}`}>
              {meu.casa ? t("basquete.casa") : t("basquete.fora")}
            </span>
          ) : (
            jogo.tv && (
              <span className="jogos-mando basquete-tv" title={t("basquete.tv_alt")}>
                📺 {jogo.tv}
              </span>
            )
          )}
          <span>
            {rotuloDoDia(t, f, jogo.data, agora)}
            {" · "}
            {jogo.horaDefinida ? f.hora(jogo.data) : t("basquete.hora_a_definir")}
          </span>
          {jogo.local && <span className="jogos-local">{jogo.local}</span>}
          {meu && jogo.tv && <span className="basquete-tv-texto">📺 {jogo.tv}</span>}
        </p>

        {aoVivo ? (
          <p className="jogos-falta jogos-falta-vivo">
            <span className="jogos-pulso" aria-hidden="true" />
            {t("basquete.tempo.ao_vivo")}
            {momento && ` · ${momento}`}
          </p>
        ) : destaque && jogo.horaDefinida && jogo.data > agora ? (
          <>
            <p className="jogos-falta">{t("basquete.proximo_em", { tempo: quantoFalta(t, f, jogo, agora) })}</p>
            <Relogio ms={jogo.data - agora} />
          </>
        ) : (
          <p className="jogos-falta">{quantoFalta(t, f, jogo, agora)}</p>
        )}

        {serie && (
          <div className="jogos-agregado">
            <p>
              <span className="jogos-agregado-rotulo">{t("basquete.serie.rotulo")}</span> <strong>{serie}</strong>
            </p>
          </div>
        )}
      </div>
    </li>
  );
}

// "Último jogo: V  LAL 127 × 103 SAC · pré-temporada · 05/10"
function UltimoJogo({ jogo }) {
  const { t } = useTranslation();
  const f = useFormatters();
  if (!jogo?.mandante || !jogo?.visitante || jogo.meu?.pontos === null || jogo.adversario?.pontos === null) {
    return null;
  }
  const { visitante: v, mandante: m } = jogo;
  const resultado = jogo.meu.pontos > jogo.adversario.pontos ? "v" : "d";
  return (
    <p className="jogos-ultimo">
      <span className="jogos-ultimo-rotulo">{t("basquete.ultimo")}</span>{" "}
      <span className={`jogos-resultado jogos-resultado-${resultado}`}>{t(`basquete.resultado.${resultado}`)}</span>{" "}
      {v.curto} <strong>{v.pontos} × {m.pontos}</strong> {m.curto}
      <span className="jogos-ultimo-meta">
        {" · "}
        {[jogo.fase && t(`basquete.fases.${jogo.fase}`), f.diaMes(jogo.data)].filter(Boolean).join(" · ")}
      </span>
    </p>
  );
}

/* ---------------------------------------------------------------------
   Comando
   --------------------------------------------------------------------- */

const Basquete = ({ time = null, todos = false }) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const escuro = theme !== "light";
  const ref = useRef(null);
  const agora = useAgora(useOnScreen(ref));
  // Comando no topo; os dados chegam depois e o hook repete o ajuste
  useCommandAtTop(ref);

  const [dados, setDados] = useState(null);
  const [erro, setErro] = useState(false);

  useEffect(() => {
    let ativo = true;
    const request = time ? fetchJogosDoTime(time) : fetchJogosDaNba({ todos });
    request
      .then((resultado) => {
        if (ativo) setDados(resultado);
      })
      .catch((error) => {
        console.error("basquete: falha ao buscar na ESPN", error);
        if (ativo) setErro(true);
      });
    return () => {
      ativo = false;
    };
  }, [time, todos]);

  const jogos = useMemo(() => {
    if (!dados) return [];
    return todos ? dados.proximos : dados.proximos.slice(0, NBA_CONFIG.PROXIMOS);
  }, [dados, todos]);
  const restantes = dados ? dados.proximos.length - jogos.length : 0;
  // Destaque e contagem regressiva: o primeiro jogo que ainda não começou
  // (na liga, os jogos ao vivo vêm antes e já têm o placar)
  const proximoId = jogos.find((jogo) => jogo.estado === "pre")?.id;

  const meuTime = time ? dados?.time : null;
  const titulo = time
    ? meuTime
      ? t("basquete.titulo_time", { time: meuTime.nome })
      : t("basquete.titulo_time_carregando")
    : t("basquete.titulo");
  const subtitulo = [
    dados?.temporada && t("basquete.temporada", { temporada: dados.temporada }),
    !time && dados?.fase && t(`basquete.fases.${dados.fase}`),
    meuTime?.posicao && meuTime.grupo && t("basquete.posicao", { posicao: meuTime.posicao, grupo: nomeDoGrupo(t, meuTime.grupo) }),
    meuTime?.campanha && meuTime.campanha !== "0-0" && t("basquete.campanha", { campanha: meuTime.campanha }),
    t("basquete.horario"),
  ]
    .filter(Boolean)
    .join(" · ");
  const comandoTodos = time ? `nba ${time} --todos` : "nba --todos";
  const paginaEspn = time ? `${NBA_CONFIG.ESPN_TEAM_PAGE}${time}` : NBA_CONFIG.ESPN_PAGE;

  return (
    <section className="jogos basquete" ref={ref} aria-labelledby="basquete-titulo">
      <header className="jogos-topo">
        {meuTime ? (
          <Escudo time={meuTime} escuro={escuro} className="jogos-escudo-galo" />
        ) : (
          <LogoDaNba escuro={escuro} className="jogos-escudo-galo" />
        )}
        <div>
          <h3 className="jogos-titulo" id="basquete-titulo">
            {titulo}
          </h3>
          <p className="jogos-subtitulo">{subtitulo}</p>
        </div>
      </header>

      {!dados && !erro && <p className="jogos-aviso">{t("basquete.carregando")}</p>}
      {erro && <p className="jogos-aviso jogos-erro">{t("basquete.erro")}</p>}
      {dados && jogos.length === 0 && (
        <p className="jogos-aviso">{time ? t("basquete.nenhum_time") : t("basquete.nenhum")}</p>
      )}

      {jogos.length > 0 && (
        <ol className="jogos-lista">
          {jogos.map((jogo) => (
            <CardJogo
              key={jogo.id}
              jogo={jogo}
              destaque={jogo.id === proximoId}
              agora={agora}
              escuro={escuro}
              meuTimeId={meuTime?.id ?? null}
            />
          ))}
        </ol>
      )}

      {restantes > 0 && (
        <p className="jogos-mais">
          <Trans
            i18nKey="basquete.mais"
            count={restantes}
            values={{ comando: comandoTodos }}
            components={{ cmd: <code /> }}
          />
        </p>
      )}

      {dados?.ultimo && <UltimoJogo jogo={dados.ultimo} />}

      <p className="jogos-fonte">
        <Trans
          i18nKey={time ? "basquete.fonte_time" : "basquete.fonte"}
          components={{
            espn: <a href={paginaEspn} target="_blank" rel="noopener noreferrer" />,
            cmd: <code />,
          }}
        />
      </p>
    </section>
  );
};

export default Basquete;
