import React, { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import SkinsFooter from "./SkinsFooter";
import { AULAS, CAMPI, DISCIPLINAS } from "../data/horarioData";
import { SKINS } from "../data/calSkins";
import { diaEspecialEm } from "../data/feriados";
import {
  agoraEmBH,
  aulasNaData,
  faixasDeHorario,
  formatarDuracao,
  formatarHoras,
  isoDoDia,
  minutosDe,
  proximaAula,
  resumoDaSemana,
  segundaDaSemana,
  semestreAtual,
  somarDias,
  statusDaAula,
} from "../lib/horario";
import useOnScreen from "../terminal/useOnScreen";
import "./Calendario.css";

// =====================================================================
// Comando "cal": meus horários de aula, com três visões
//   cal / cal --mes   o mês, como o cal do Linux, e um resumo ao lado
//   cal --semana      a grade da semana, colorida por campus
//   cal --hoje        a agenda do dia, com a aula em andamento
// As aulas ficam em data/horarioData.js; feriados, recessos e semestres
// letivos vêm do calendário da PUC (data/calendarioPuc.js e data/feriados.js).
// =====================================================================

// Atualiza o "agora" a cada 30 s: a aula em andamento troca sozinha. Fora
// da tela (as saídas antigas continuam montadas no terminal), para; ao
// voltar, atualiza na hora.
function useAgora(ativo) {
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

const localeDe = (lng) => (lng?.startsWith("en") ? "en-US" : "pt-BR");

const formatarData = (diaMs, lng, opcoes) =>
  new Intl.DateTimeFormat(localeDe(lng), { timeZone: "UTC", ...opcoes }).format(diaMs);

const maiuscula = (texto) => texto.charAt(0).toUpperCase() + texto.slice(1);

// Cor do campus via token do tema (--cal-coreu, --cal-lourdes...)
const estiloCampus = (campus) => ({ "--campus": `var(${CAMPI[campus].cor})` });

// "DIAW G1", "TI:II"
const siglaDaAula = (aula) =>
  [DISCIPLINAS[aula.disciplina].sigla, aula.turma].filter(Boolean).join(" ");

// Classe de cor do dia sem aula: feriado (amarelo) ou recesso/férias (azul)
const classeEspecial = (especial) =>
  especial.tipo === "feriado" ? "cal-dia--feriado" : "cal-dia--recesso";

// "Nossa Senhora Aparecida" ou "Dia do Professor e do Funcionário (recesso)"
function nomeEspecial(t, especial) {
  const nome = t(`cal.feriados.${especial.chave}`);
  return especial.tipo === "feriado" ? nome : `${nome} (${t(`cal.tipos_curtos.${especial.tipo}`)})`;
}

// Junta dias seguidos com o mesmo motivo: 24 a 31 vira uma linha só
function agruparEspeciais(dias) {
  const grupos = [];
  dias.forEach((d) => {
    const ultimo = grupos[grupos.length - 1];
    if (ultimo && ultimo.especial.chave === d.especial.chave && ultimo.ate === d.numero - 1) {
      ultimo.ate = d.numero;
    } else {
      grupos.push({ de: d.numero, ate: d.numero, especial: d.especial });
    }
  });
  return grupos;
}

const doisDigitos = (n) => String(n).padStart(2, "0");

// Local da aula em dois tamanhos (tudo visível, sem depender de hover,
// para ler no celular também):
//   compacto  "P34 · 114"   (linha extra em cada aula da grade da semana)
//   completo  "Prédio 34, 1º andar, Laboratório de Informática 08, sala 114"
//             (coluna "local" do cal --hoje e da lista de turmas)
function textoLocal(t, local, formato) {
  if (!local) return null;
  if (local.online) {
    return formato === "compacto" ? local.online : t("cal.local.online", { plataforma: local.online });
  }
  const predio = t("cal.local.predio", { numero: local.predio });
  const sala = t("cal.local.sala", { numero: local.sala });
  if (formato === "compacto") return `${t("cal.local.predio_curto", { numero: local.predio })} · ${local.sala}`;
  return [
    local.edificio ? `${predio} (${local.edificio})` : predio,
    t("cal.local.andar", { numero: local.andar }),
    local.espaco,
    sala,
  ]
    .filter(Boolean)
    .join(", ");
}

// Local com cada parte numa cor (lista "Turmas e salas" do cal --semana)
function LocalColorido({ local }) {
  const { t } = useTranslation();
  if (!local) return "—";
  if (local.online) {
    return (
      <span className="cal-local-online">{t("cal.local.online", { plataforma: local.online })}</span>
    );
  }
  const predio = t("cal.local.predio", { numero: local.predio });
  return (
    <>
      <span className="cal-local-predio">
        {local.edificio ? `${predio} (${local.edificio})` : predio}
      </span>
      <span className="cal-sep">, </span>
      <span className="cal-local-andar">{t("cal.local.andar", { numero: local.andar })}</span>
      <span className="cal-sep">, </span>
      {local.espaco && (
        <>
          <span className="cal-local-espaco">{local.espaco}</span>
          <span className="cal-sep">, </span>
        </>
      )}
      <span className="cal-local-sala">{t("cal.local.sala", { numero: local.sala })}</span>
    </>
  );
}

function NomeDaAula({ aula }) {
  const { t } = useTranslation();
  const nome = t(`cal.disciplinas.${aula.disciplina}`);
  const texto = aula.turma ? `${nome} ${aula.turma}` : nome;
  return aula.link ? (
    <a href={aula.link} target="_blank" rel="noopener noreferrer">
      {texto}
    </a>
  ) : (
    texto
  );
}

function Legenda() {
  const { t } = useTranslation();
  return (
    <p className="cal-legenda">
      {Object.entries(CAMPI).map(([chave, campus]) => (
        <span key={chave} style={estiloCampus(chave)}>
          <b className="cal-campus">{campus.sigla}</b> {t(`cal.campi.${chave}`)}
        </span>
      ))}
    </p>
  );
}

// ---------------------------------------------------------------------
// cal --mes
// ---------------------------------------------------------------------
function CalMes({ agora }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const primeiroDia = Date.UTC(agora.ano, agora.mes - 1, 1);
  const diasNoMes = new Date(Date.UTC(agora.ano, agora.mes, 0)).getUTCDate();
  const vaziosAntes = new Date(primeiroDia).getUTCDay();
  const diasCurtos = t("cal.dias_curtos", { returnObjects: true });

  const titulo = maiuscula(formatarData(primeiroDia, lng, { month: "long", year: "numeric" }));

  const dias = Array.from({ length: diasNoMes }, (_, i) => {
    const diaMs = somarDias(primeiroDia, i);
    const especial = diaEspecialEm(isoDoDia(diaMs));
    const temAula = aulasNaData(diaMs).length > 0;
    const classes = ["cal-dia"];
    if (temAula) classes.push("cal-dia--aula");
    if (especial) classes.push(classeEspecial(especial));
    if (diaMs === agora.diaMs) classes.push("cal-dia--hoje");
    return { numero: i + 1, diaMs, especial, classes: classes.join(" ") };
  });

  const especiaisDoMes = agruparEspeciais(dias.filter((d) => d.especial));
  const semestre = semestreAtual(agora);
  const dataCurta = (iso) =>
    formatarData(Date.parse(`${iso}T00:00:00Z`), lng, { day: "numeric", month: "short" });
  const proxima = proximaAula(agora);
  const aulasHoje = aulasNaData(agora.diaMs);
  const resumo = resumoDaSemana();

  return (
    <div className="cal-mes">
      <div className="cal-mes-grade" aria-label={titulo}>
        <p className="cal-mes-titulo">{titulo}</p>
        <div className="cal-mes-dias" role="grid">
          {diasCurtos.map((nome, i) => (
            <span key={`cab-${i}`} className="cal-dia cal-dia--cabecalho" role="columnheader">
              {nome}
            </span>
          ))}
          {Array.from({ length: vaziosAntes }, (_, i) => (
            <span key={`vazio-${i}`} className="cal-dia" aria-hidden="true" />
          ))}
          {dias.map((d) => (
            <span
              key={d.numero}
              className={d.classes}
              role="gridcell"
            >
              {d.numero}
            </span>
          ))}
        </div>
        <p className="cal-mes-chaves">
          <span className="cal-chave cal-dia--aula">■</span> {t("cal.legenda.aula")}
          <span className="cal-chave cal-dia--feriado">■</span> {t("cal.legenda.feriado")}
          <span className="cal-chave cal-dia--recesso">■</span> {t("cal.legenda.recesso")}
          <span className="cal-chave cal-chave--hoje">■</span> {t("cal.legenda.hoje")}
        </p>
      </div>

      <dl className="cal-info">
        <dt>{t("cal.info.hoje")}</dt>
        <dd>
          {formatarData(agora.diaMs, lng, { weekday: "long", day: "numeric", month: "long" })}
          <span className="cal-sep"> · </span>
          {aulasHoje.length
            ? t("cal.n_aulas", { count: aulasHoje.length })
            : t("cal.sem_aulas")}
        </dd>

        <dt>{t("cal.info.proxima")}</dt>
        <dd>
          {proxima ? (
            <>
              <span style={estiloCampus(proxima.aula.campus)} className="cal-tinta">
                {siglaDaAula(proxima.aula)}
              </span>{" "}
              {formatarData(proxima.diaMs, lng, { weekday: "short" })} {proxima.aula.inicio}
              <span className="cal-sep"> · </span>
              {t("cal.em", { tempo: formatarDuracao(proxima.faltam) })}
            </>
          ) : (
            t("cal.nenhuma_proxima")
          )}
        </dd>

        <dt>{t("cal.info.semestre")}</dt>
        <dd>
          {semestre.numero
            ? t("cal.semestre_atual", {
                numero: semestre.numero,
                semana: semestre.semana,
                fim: dataCurta(semestre.fim),
              })
            : semestre.proximo
              ? t("cal.semestre_ferias", { inicio: dataCurta(semestre.proximo.inicio) })
              : t("cal.semestre_sem_calendario")}
        </dd>

        <dt>{t("cal.info.semana")}</dt>
        <dd>
          {t("cal.resumo_semana", {
            aulas: resumo.aulas,
            horas: formatarHoras(resumo.minutos),
          })}
        </dd>

        <dt>{t("cal.info.feriados")}</dt>
        <dd>
          {especiaisDoMes.length
            ? especiaisDoMes.map((g) => (
                <span key={g.de} className="cal-feriado-linha">
                  <span className={classeEspecial(g.especial)}>
                    {doisDigitos(g.de)}
                    {g.ate > g.de && `–${doisDigitos(g.ate)}`}
                  </span>{" "}
                  {nomeEspecial(t, g.especial)}
                </span>
              ))
            : t("cal.sem_feriados")}
        </dd>

        <dt>{t("cal.info.fuso")}</dt>
        <dd>{t("cal.fuso")}</dd>
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------
// cal --semana
// ---------------------------------------------------------------------
function CalSemana({ agora }) {
  const { t, i18n } = useTranslation();
  const lng = i18n.language;
  const segunda = segundaDaSemana(agora);
  const nomesDias = t("cal.dias_semana", { returnObjects: true });
  const faixas = faixasDeHorario();

  const colunas = [1, 2, 3, 4, 5].map((diaSemana, i) => {
    const diaMs = somarDias(segunda, i);
    return {
      diaSemana,
      diaMs,
      especial: diaEspecialEm(isoDoDia(diaMs)),
      letivo: aulasNaData(diaMs).length > 0 || !AULAS.some((a) => a.dia === diaSemana),
      hoje: diaMs === agora.diaMs,
    };
  });

  const intervalo = `${formatarData(segunda, lng, { day: "numeric", month: "short" })} – ${formatarData(
    somarDias(segunda, 4),
    lng,
    { day: "numeric", month: "short" }
  )}`;

  const especiais = colunas.filter((c) => c.especial);

  // Lista de turmas embaixo da grade: dia, horário, código e local
  const turmas = [...AULAS].sort(
    (a, b) => a.dia - b.dia || minutosDe(a.inicio) - minutosDe(b.inicio)
  );

  // Disciplinas que aparecem na grade, para o glossário das siglas
  const disciplinas = Object.keys(DISCIPLINAS).filter((d) =>
    AULAS.some((a) => a.disciplina === d)
  );

  return (
    <div className="cal-semana">
      <p className="cal-semana-titulo">
        {t("cal.semana_de", { intervalo })}
      </p>
      {especiais.map((c) => (
        <p key={c.diaSemana} className={`cal-semana-aviso ${classeEspecial(c.especial)}`}>
          ✕ {nomesDias[c.diaSemana]} {new Date(c.diaMs).getUTCDate()}: {nomeEspecial(t, c.especial)}
        </p>
      ))}

      <div className="cal-semana-rolagem">
        <table className="cal-tabela">
          <thead>
            <tr>
              <th scope="col" className="cal-hora">{t("cal.horario")}</th>
              {colunas.map((c) => (
                <th
                  key={c.diaSemana}
                  scope="col"
                  className={[
                    c.hoje && "cal-th--hoje",
                    c.especial && (c.especial.tipo === "feriado" ? "cal-th--feriado" : "cal-th--recesso"),
                  ]
                    .filter(Boolean)
                    .join(" ") || undefined}
                >
                  {nomesDias[c.diaSemana]}{" "}
                  <span className="cal-th-data">
                    {new Date(c.diaMs).getUTCDate()}
                    {(c.especial || !c.letivo) && " ✕"}
                  </span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {faixas.map((faixa) => (
              <tr key={`${faixa.inicio}-${faixa.fim}`}>
                <th scope="row" className="cal-hora">
                  {faixa.inicio}
                  <span className="cal-hora-fim">{faixa.fim}</span>
                </th>
                {colunas.map((c) => {
                  const aula = AULAS.find(
                    (a) => a.dia === c.diaSemana && a.inicio === faixa.inicio && a.fim === faixa.fim
                  );
                  if (!aula) {
                    return (
                      <td key={c.diaSemana} className="cal-vazio">
                        ·
                      </td>
                    );
                  }
                  const status = c.letivo ? statusDaAula(aula, c.diaMs, agora) : "sem_aula";
                  return (
                    <td
                      key={c.diaSemana}
                      className={`cal-aula cal-aula--${status}`}
                      style={estiloCampus(aula.campus)}
                    >
                      <b className="cal-campus">{CAMPI[aula.campus].sigla}</b>
                      <span className="cal-sigla">{siglaDaAula(aula)}</span>
                      {aula.curso && <span className="cal-curso">{aula.curso}</span>}
                      {status === "atual" && <span className="cal-agora">▶</span>}
                      {aula.local && (
                        <span className="cal-aula-local">{textoLocal(t, aula.local, "compacto")}</span>
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Legenda />

      <p className="cal-turmas-titulo">{t("cal.turmas")}</p>
      <ul className="cal-turmas">
        <li className="cal-turma cal-turma--cabecalho" aria-hidden="true">
          <span>{t("cal.colunas.quando")}</span>
          <span />
          <span>{t("cal.colunas.turma")}</span>
          <span>{t("cal.colunas.codigo")}</span>
          <span>{t("cal.colunas.local")}</span>
        </li>
        {turmas.map((aula) => (
          <li
            key={`${aula.dia}-${aula.inicio}`}
            className="cal-turma"
            style={estiloCampus(aula.campus)}
          >
            <span className="cal-turma-quando">
              <span className="cal-turma-dia">{nomesDias[aula.dia]}</span>{" "}
              <span className="cal-turma-hora">{aula.inicio}</span>
            </span>
            <b className="cal-campus">{CAMPI[aula.campus].sigla}</b>
            <span className="cal-sigla">{siglaDaAula(aula)}</span>
            <span className="cal-codigo">{aula.codigo ?? "—"}</span>
            <span className="cal-turma-local">
              <LocalColorido local={aula.local} />
            </span>
          </li>
        ))}
      </ul>

      <dl className="cal-glossario">
        {disciplinas.map((d) => (
          <React.Fragment key={d}>
            <dt>{DISCIPLINAS[d].sigla}</dt>
            <dd>{t(`cal.disciplinas.${d}`)}</dd>
          </React.Fragment>
        ))}
      </dl>
    </div>
  );
}

// ---------------------------------------------------------------------
// cal --hoje
// ---------------------------------------------------------------------
function LinhaDaAula({ aula, status, agora, diaMs }) {
  const { t, i18n } = useTranslation();
  const marcador = { passada: "✓", atual: "▶", futura: " " }[status];
  let detalhe = null;
  if (status === "atual") {
    detalhe = t("cal.termina_em", {
      tempo: formatarDuracao(minutosDe(aula.fim) - agora.minutos),
    });
  } else if (status === "futura" && diaMs === agora.diaMs) {
    detalhe = t("cal.em", { tempo: formatarDuracao(minutosDe(aula.inicio) - agora.minutos) });
  } else if (diaMs !== agora.diaMs) {
    detalhe = formatarData(diaMs, i18n.language, { weekday: "long" });
  }

  return (
    <li className={`cal-linha cal-linha--${status}`} style={estiloCampus(aula.campus)}>
      <span className="cal-linha-marca" aria-hidden="true">{marcador}</span>
      <span className="cal-linha-hora">
        {aula.inicio}–{aula.fim}
      </span>
      <b className="cal-campus">{CAMPI[aula.campus].sigla}</b>
      <span className="cal-linha-nome">
        <NomeDaAula aula={aula} />
        {aula.curso && <span className="cal-curso">{aula.curso}</span>}
        <span className="cal-linha-campus"> @ {t(`cal.campi.${aula.campus}`)}</span>
        {aula.codigo && <span className="cal-codigo">{aula.codigo}</span>}
      </span>
      <span className="cal-linha-sala">{textoLocal(t, aula.local, "completo") ?? "—"}</span>
      <span className="cal-linha-detalhe">{detalhe}</span>
    </li>
  );
}

// Cabeçalho das colunas da agenda (alinhado com .cal-linha)
function CabecalhoDaLista() {
  const { t } = useTranslation();
  return (
    <li className="cal-linha cal-linha--cabecalho" aria-hidden="true">
      <span />
      <span>{t("cal.colunas.horario")}</span>
      <span />
      <span>{t("cal.colunas.disciplina")}</span>
      <span className="cal-linha-sala">{t("cal.colunas.local")}</span>
      <span />
    </li>
  );
}

function CalHoje({ agora }) {
  const { t, i18n } = useTranslation();
  const iso = isoDoDia(agora.diaMs);
  const especial = diaEspecialEm(iso);
  const aulas = aulasNaData(agora.diaMs);
  const proxima = proximaAula(agora);
  const titulo = maiuscula(
    formatarData(agora.diaMs, i18n.language, { weekday: "long", day: "numeric", month: "long" })
  );
  const hora = `${String(Math.floor(agora.minutos / 60)).padStart(2, "0")}:${String(
    agora.minutos % 60
  ).padStart(2, "0")}`;

  let subtitulo;
  if (especial) {
    subtitulo = t("cal.especial_hoje", {
      tipo: maiuscula(t(`cal.tipos.${especial.tipo}`)),
      nome: t(`cal.feriados.${especial.chave}`),
    });
  } else if (!aulas.length && !semestreAtual(agora).numero) {
    subtitulo = t("cal.fora_do_semestre");
  } else if (!aulas.length) subtitulo = t("cal.sem_aulas_hoje");
  else subtitulo = t("cal.n_aulas", { count: aulas.length });

  const terminouODia = aulas.length > 0 && !aulas.some((a) => statusDaAula(a, agora.diaMs, agora) !== "passada");

  return (
    <div className="cal-hoje">
      <p className="cal-hoje-titulo">
        {titulo} <span className="cal-hoje-hora">{hora}</span>
      </p>
      <p className="cal-hoje-sub">{subtitulo}</p>

      {aulas.length > 0 && (
        <ul className="cal-lista">
          <CabecalhoDaLista />
          {aulas.map((aula) => (
            <LinhaDaAula
              key={aula.inicio}
              aula={aula}
              diaMs={agora.diaMs}
              agora={agora}
              status={statusDaAula(aula, agora.diaMs, agora)}
            />
          ))}
        </ul>
      )}

      {(aulas.length === 0 || terminouODia) && proxima && (
        <>
          <p className="cal-hoje-sub">
            {t("cal.proxima_em", { tempo: formatarDuracao(proxima.faltam) })}
          </p>
          <ul className="cal-lista">
            <CabecalhoDaLista />
            <LinhaDaAula aula={proxima.aula} diaMs={proxima.diaMs} agora={agora} status="futura" />
          </ul>
        </>
      )}
    </div>
  );
}

export default function Calendario({ skin = "mes" }) {
  const ref = useRef(null);
  const agora = useAgora(useOnScreen(ref));
  return (
    <div className="cal" ref={ref}>
      {skin === "mes" && <CalMes agora={agora} />}
      {skin === "semana" && <CalSemana agora={agora} />}
      {skin === "hoje" && <CalHoje agora={agora} />}
      <SkinsFooter skins={SKINS} active={skin} namespace="cal" />
    </div>
  );
}
