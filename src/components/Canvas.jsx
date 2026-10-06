import React, { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  FiAlertTriangle,
  FiArrowDown,
  FiArrowUp,
  FiBookOpen,
  FiCalendar,
  FiCheckCircle,
  FiClipboard,
  FiClock,
  FiEdit3,
  FiExternalLink,
  FiFlag,
  FiMapPin,
  FiUsers,
} from "react-icons/fi";
import {
  canvasInfo,
  cursos as TODOS_OS_CURSOS,
  eventos as TODOS_OS_EVENTOS,
  tarefas as TODAS_AS_TAREFAS,
} from "../data/canvasData";
import {
  ALL_SECTIONS,
  DEFAULT_SECTION,
  SECTIONS,
  SECTION_OPTIONS,
  aplicarFiltros,
  semFiltro,
} from "../data/canvasSections";
import { CAMPI, DISCIPLINAS, FUSO_HORARIO } from "../data/horarioData";
import { diaEspecialEm } from "../data/feriados";
import {
  LIMITES,
  agendaDe,
  compararCursos,
  diaDe,
  diasAte,
  entreguesDe,
  esperadosDe,
  meioDia,
  partesDoTempo,
  prazoAtual,
  resumoDoCurso,
  separarTarefas,
  situacaoDe,
  somaDias,
  taxaDe,
  totaisDe,
  urgenciaDe,
} from "../lib/canvas";
import { isLastTerminalOutput, scrollLastCommandToTop } from "../terminal/terminalDom";
import SkinsFooter from "./SkinsFooter";
import "./Canvas.css";

// =====================================================================
// Comando "canvas": tarefas, prazos e entregas das minhas disciplinas no
// Canvas. Uma seção por opção:
//   canvas / --resumo   próxima entrega, indicadores, próximos 7 dias e
//                       uma tabela por curso (padrão)
//   canvas --tarefas    todas as tarefas: pela frente, já vencidas e sem prazo
//   canvas --agenda     tarefas, eventos do calendário e feriados, dia a dia
//   canvas --tudo       as três, uma embaixo da outra
// Filtros: disciplina (diw, ti5...), campus (coreu, lourdes), turma (g1...)
// ou um pedaço do nome do curso. Os dados vêm do "npm run canvas"
// (scripts/canvas.mjs), que roda na minha máquina com a chave do Canvas:
// aqui só chegam tarefas, prazos e contagens de entregas, sem nomes de alunos.
// As contagens regressivas usam a hora de agora; as entregas são as da
// última vez que o script rodou.
// =====================================================================

// Hora de agora, renovada de tempos em tempos (contagem regressiva)
function useAgora(intervalo) {
  const [agora, setAgora] = useState(() => Date.now());
  useEffect(() => {
    const id = setInterval(() => setAgora(Date.now()), intervalo);
    return () => clearInterval(id);
  }, [intervalo]);
  return agora;
}

function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "pt-BR";
  return useMemo(() => {
    const opcoes = (extra) => new Intl.DateTimeFormat(locale, { timeZone: FUSO_HORARIO, ...extra });
    const numero = new Intl.NumberFormat(locale);
    const percentual = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
    const semana = opcoes({ weekday: "short" });
    const diaMes = opcoes({ day: "2-digit", month: "2-digit" });
    const hora = opcoes({ hour: "2-digit", minute: "2-digit", hourCycle: "h23" });
    const dataLonga = opcoes({ weekday: "long", day: "numeric", month: "long" });
    const data = opcoes({ day: "2-digit", month: "2-digit", year: "numeric" });
    return {
      n: (valor) => numero.format(valor ?? 0),
      pct: (valor) => percentual.format(valor ?? 0),
      semana: (ms) => semana.format(ms).replace(".", ""),
      diaMes: (ms) => diaMes.format(ms),
      hora: (ms) => hora.format(ms),
      dataLonga: (ms) => dataLonga.format(ms),
      data: (ms) => data.format(ms),
    };
  }, [locale]);
}

// "3 dias", "2 dias e 5 h", "5 h 12 min", "12 min"
function textoDoTempo(t, ms) {
  const { dias, horas, minutos } = partesDoTempo(ms);
  const textoDias = t("canvas.tempo.dias", { count: dias });
  if (dias >= LIMITES.semanaDias || (dias >= 1 && horas === 0)) return textoDias;
  if (dias >= 1) return t("canvas.tempo.diasHoras", { dias: textoDias, horas });
  if (horas >= 1) return t("canvas.tempo.horasMinutos", { horas, minutos });
  return t("canvas.tempo.minutos", { count: Math.max(1, minutos) });
}

// "hoje", "amanhã", "ontem" ou o dia da semana
function rotuloDoDia(t, f, dia, agora) {
  const diferenca = diasAte(dia, agora);
  if (diferenca === 0) return t("canvas.dia.hoje");
  if (diferenca === 1) return t("canvas.dia.amanha");
  if (diferenca === -1) return t("canvas.dia.ontem");
  return f.semana(meioDia(dia));
}

const estiloCampus = (campus) => ({ "--campus": `var(${CAMPI[campus]?.cor ?? "--text-muted"})` });

const siglaDaDisciplina = (disciplina) => DISCIPLINAS[disciplina]?.sigla ?? disciplina;

/* ---------------------------------------------------------------------
   Pedaços em comum
   --------------------------------------------------------------------- */

// [C] DIAW G1 8218.1.01: letra e cor do campus (como no "cal" e no
// "turmas"), sigla, turma e o código do SGA, que diz qual é a turma
function CursoTag({ curso }) {
  const { t } = useTranslation();
  if (!curso) return null;
  const campus = CAMPI[curso.campus] ? t(`cal.campi.${curso.campus}`) : null;
  const sigla = curso.rotulo ?? (curso.disciplina && siglaDaDisciplina(curso.disciplina)) ?? curso.nome;
  return (
    <span
      className="cnv-curso"
      style={estiloCampus(curso.campus)}
      title={[curso.nome, campus].filter(Boolean).join(" · ")}
    >
      {campus && (
        <>
          <b className="cnv-campus" aria-hidden="true">
            {CAMPI[curso.campus].sigla}
          </b>
          <span className="cnv-sr">{campus}</span>
        </>
      )}
      <span className="cnv-curso-nome">{sigla}</span>
      {curso.turma && !curso.rotulo && <span className="cnv-curso-turma">{curso.turma}</span>}
      {curso.sga && !curso.rotulo && <span className="cnv-curso-sga">{curso.sga}</span>}
    </span>
  );
}

function Resumo({ i18nKey, values }) {
  return (
    <p className="cnv-resumo">
      <Trans i18nKey={i18nKey} values={values} components={{ b: <strong /> }} />
    </p>
  );
}

function Kpis({ itens }) {
  return (
    <ul className="cnv-kpis">
      {itens.map((item, index) => {
        const { chave, Icone, valor, rotulo, titulo, alerta } = item;
        return (
          <li key={chave} className={alerta ? "cnv-kpi alerta" : "cnv-kpi"} style={{ "--i": index }} title={titulo}>
            <span className="cnv-kpi-rotulo">
              <Icone aria-hidden="true" />
              {rotulo}
            </span>
            <span className="cnv-kpi-valor">{valor}</span>
          </li>
        );
      })}
    </ul>
  );
}

// SEX · 09/10 · 23:59, empilhado como uma folhinha
function Folhinha({ ms, agora, f }) {
  const { t } = useTranslation();
  if (ms === null) {
    return (
      <span className="cnv-folhinha sem-prazo" aria-hidden="true">
        —
      </span>
    );
  }
  return (
    <time className="cnv-folhinha" dateTime={new Date(ms).toISOString()}>
      <span className="cnv-folhinha-semana">{rotuloDoDia(t, f, diaDe(ms), agora)}</span>
      <span className="cnv-folhinha-dia">{f.diaMes(ms)}</span>
      <span className="cnv-folhinha-hora">{f.hora(ms)}</span>
    </time>
  );
}

// "em 2 dias e 5 h" / "venceu há 3 dias", com ícone e cor pela urgência
function Prazo({ tarefa, agora }) {
  const { t } = useTranslation();
  const prazo = prazoAtual(tarefa, agora);
  if (prazo === null) return <span className="cnv-prazo sem-prazo">{t("canvas.tarefas.semPrazo")}</span>;
  const urgencia = urgenciaDe(tarefa, agora);
  const tempo = textoDoTempo(t, prazo - agora);
  const Icone = urgencia === "urgente" || urgencia === "perto" ? FiAlertTriangle : FiClock;
  return (
    <span className={`cnv-prazo ${urgencia ?? "vencida"}`}>
      <Icone aria-hidden="true" />
      {urgencia ? t("canvas.tempo.em", { tempo }) : t("canvas.tempo.venceu", { tempo })}
    </span>
  );
}

const PARTES_DA_BARRA = ["noPrazo", "atrasadas", "faltando", "dispensados"];

// Barra de entregas: no prazo, atrasadas, faltando (ou "ainda não
// entregaram", antes do prazo) e dispensados
function BarraDeEntregas({ e, vencida, f }) {
  const { t } = useTranslation();
  const legenda = (parte) => t(`canvas.entregas.legenda.${parte === "faltando" && !vencida ? "pendentes" : parte}`);
  return (
    <span className="cnv-barra" aria-hidden="true">
      {PARTES_DA_BARRA.filter((parte) => e[parte] > 0).map((parte) => (
        <span
          key={parte}
          className={`cnv-seg ${parte}${parte === "faltando" && !vencida ? " pendente" : ""}`}
          style={{ flexGrow: e[parte] }}
          data-tip={`${legenda(parte)} · ${f.n(e[parte])}`}
        />
      ))}
    </span>
  );
}

function Entregas({ tarefa, vencida, f, compacta = false }) {
  const { t } = useTranslation();
  const e = tarefa.entregas;
  if (!e) {
    const chave = tarefa.tipo === "papel" || tarefa.tipo === "sem_entrega" ? tarefa.tipo : "semDados";
    return <p className="cnv-entregas-texto sem">{t(`canvas.entregas.${chave}`)}</p>;
  }
  const esperados = esperadosDe(e);
  if (esperados === 0) return <p className="cnv-entregas-texto sem">{t("canvas.entregas.semAlunos")}</p>;
  const entregues = entreguesDe(e);
  const detalhes = [
    e.atrasadas > 0 && t("canvas.entregas.atrasadas", { count: e.atrasadas }),
    vencida && e.faltando > 0 && t("canvas.entregas.faltando", { count: e.faltando }),
    e.dispensados > 0 && !compacta && t("canvas.entregas.dispensados", { count: e.dispensados }),
  ].filter(Boolean);
  return (
    <div className="cnv-entregas">
      <BarraDeEntregas e={e} vencida={vencida} f={f} />
      <p className="cnv-entregas-texto">
        <Trans
          i18nKey={vencida ? "canvas.entregas.vencida" : "canvas.entregas.aberta"}
          values={{ entregues: f.n(entregues), esperados: f.n(esperados), pct: f.pct(taxaDe(e)) }}
          components={{ b: <strong /> }}
        />
        {detalhes.map((texto) => (
          <span key={texto}> · {texto}</span>
        ))}
        {e.aCorrigir > 0 && (
          <span className="cnv-corrigir">
            {" · "}
            <FiEdit3 aria-hidden="true" />
            {t("canvas.entregas.aCorrigir", { count: e.aCorrigir })}
          </span>
        )}
      </p>
    </div>
  );
}

function Selos({ tarefa }) {
  const { t } = useTranslation();
  const selos = [
    tarefa.grupo && "grupo",
    ["quiz", "discussao", "externa", "papel", "sem_entrega"].includes(tarefa.tipo) && tarefa.tipo,
  ].filter(Boolean);
  return selos.map((selo) => (
    <span key={selo} className="cnv-selo">
      {t(`canvas.tipos.${selo}`)}
    </span>
  ));
}

// Prazos por turma, abertura e fechamento
function Datas({ tarefa, agora, f }) {
  const { t } = useTranslation();
  const itens = [];
  if (tarefa.prazos) {
    const datas = tarefa.prazos.map((iso) => f.diaMes(Date.parse(iso))).join(", ");
    itens.push(t("canvas.datas.prazosPorTurma", { datas }));
  }
  if (tarefa.abre && Date.parse(tarefa.abre) > agora) {
    const ms = Date.parse(tarefa.abre);
    itens.push(t("canvas.datas.abre", { data: f.diaMes(ms), hora: f.hora(ms) }));
  }
  const prazo = prazoAtual(tarefa, agora);
  if (tarefa.fecha && prazo !== null && Date.parse(tarefa.fecha) > prazo) {
    const ms = Date.parse(tarefa.fecha);
    itens.push(t("canvas.datas.fecha", { data: f.diaMes(ms), hora: f.hora(ms) }));
  }
  if (itens.length === 0) return null;
  return <p className="cnv-tarefa-datas">{itens.join(" · ")}</p>;
}

function LinhaDaTarefa({ tarefa, curso, agora, f, compacta = false }) {
  const prazo = prazoAtual(tarefa, agora);
  const situacao = situacaoDe(tarefa, agora);
  const urgencia = urgenciaDe(tarefa, agora);
  return (
    <li className={`cnv-tarefa ${situacao} ${urgencia ?? ""}`}>
      <Folhinha ms={prazo} agora={agora} f={f} />
      <div className="cnv-tarefa-corpo">
        <p className="cnv-tarefa-topo">
          <CursoTag curso={curso} />
          <Selos tarefa={tarefa} />
        </p>
        <a className="cnv-tarefa-nome" href={tarefa.url} target="_blank" rel="noopener noreferrer">
          {tarefa.nome}
          <FiExternalLink aria-hidden="true" />
        </a>
        {!compacta && <Datas tarefa={tarefa} agora={agora} f={f} />}
        <Entregas tarefa={tarefa} vencida={situacao === "vencida"} f={f} compacta={compacta} />
      </div>
      <Prazo tarefa={tarefa} agora={agora} />
    </li>
  );
}

function ListaDeTarefas({ tarefas, cursoPorId, agora, f, compacta }) {
  return (
    <ul className="cnv-tarefas">
      {tarefas.map((tarefa) => (
        <LinhaDaTarefa
          key={tarefa.id}
          tarefa={tarefa}
          curso={cursoPorId.get(tarefa.curso)}
          agora={agora}
          f={f}
          compacta={compacta}
        />
      ))}
    </ul>
  );
}

function LegendaDasEntregas() {
  const { t } = useTranslation();
  return (
    <ul className="cnv-legenda">
      {["noPrazo", "atrasadas", "faltando", "pendentes", "dispensados"].map((parte) => (
        <li key={parte} className={parte}>
          <span className="cnv-amostra" aria-hidden="true" />
          {t(`canvas.entregas.legenda.${parte}`)}
        </li>
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------
   Próxima entrega (o destaque do resumo)
   --------------------------------------------------------------------- */

function Relogio({ prazo }) {
  const { t } = useTranslation();
  // Este pedaço anda de segundo em segundo; o resto do painel, de 30 em 30
  const agora = useAgora(1000);
  const { dias, horas, minutos } = partesDoTempo(Math.max(0, prazo - agora));
  const segundos = Math.max(0, Math.floor(((prazo - agora) % 60_000) / 1000));
  const casas = [
    dias > 0 && { valor: dias, unidade: t("canvas.tempo.unidades.dias", { count: dias }) },
    { valor: String(horas).padStart(2, "0"), unidade: t("canvas.tempo.unidades.horas") },
    { valor: String(minutos).padStart(2, "0"), unidade: t("canvas.tempo.unidades.minutos") },
    dias === 0 && { valor: String(segundos).padStart(2, "0"), unidade: t("canvas.tempo.unidades.segundos") },
  ].filter(Boolean);
  return (
    <p className="cnv-relogio" aria-label={t("canvas.tempo.em", { tempo: textoDoTempo(t, prazo - agora) })}>
      {casas.map(({ valor, unidade }) => (
        <span key={unidade} className="cnv-relogio-casa" aria-hidden="true">
          <b>{valor}</b>
          <small>{unidade}</small>
        </span>
      ))}
    </p>
  );
}

function ProximaEntrega({ abertas, cursoPorId, agora, f }) {
  const { t } = useTranslation();
  const [tarefa] = abertas;
  if (!tarefa) {
    return (
      <section className="cnv-proxima vazia">
        <p className="cnv-proxima-rotulo">
          <FiFlag aria-hidden="true" />
          {t("canvas.proxima.titulo")}
        </p>
        <p className="cnv-resumo">{t("canvas.proxima.nenhuma")}</p>
      </section>
    );
  }
  const prazo = prazoAtual(tarefa, agora);
  const urgencia = urgenciaDe(tarefa, agora);
  const mesmoDia = abertas.slice(1).filter((outra) => diaDe(prazoAtual(outra, agora)) === diaDe(prazo)).length;
  return (
    <section className={`cnv-proxima ${urgencia}`} aria-labelledby="cnv-proxima-nome">
      <p className="cnv-proxima-rotulo">
        <FiFlag aria-hidden="true" />
        {t("canvas.proxima.titulo")}
        <CursoTag curso={cursoPorId.get(tarefa.curso)} />
        <Selos tarefa={tarefa} />
      </p>
      <a
        id="cnv-proxima-nome"
        className="cnv-proxima-nome"
        href={tarefa.url}
        target="_blank"
        rel="noopener noreferrer"
      >
        {tarefa.nome}
        <FiExternalLink aria-hidden="true" />
      </a>
      <p className="cnv-proxima-quando">
        {t("canvas.proxima.quando", { data: f.dataLonga(prazo), hora: f.hora(prazo) })}
        {urgencia === "urgente" && (
          <span className="cnv-proxima-alerta">
            <FiAlertTriangle aria-hidden="true" />
            {t("canvas.urgencia.urgente")}
          </span>
        )}
      </p>
      <Relogio prazo={prazo} />
      <Entregas tarefa={tarefa} vencida={false} f={f} />
      {mesmoDia > 0 && <p className="cnv-proxima-mais">{t("canvas.proxima.mesmoDia", { count: mesmoDia })}</p>}
    </section>
  );
}

/* ---------------------------------------------------------------------
   canvas / canvas --resumo
   --------------------------------------------------------------------- */

// Colunas da tabela de cursos. "valor" ordena; "desc" é o sentido do
// primeiro clique (os números, do maior para o menor; a próxima entrega, da
// mais próxima para a mais distante). "Curso" volta para a ordem padrão.
const COLUNAS = [
  { chave: "curso" },
  { chave: "alunos", num: true, desc: true, valor: (l) => l.curso.alunos },
  { chave: "tarefas", num: true, desc: true, valor: (l) => l.tarefas },
  { chave: "proxima", desc: false, valor: (l, agora) => (l.proxima ? prazoAtual(l.proxima, agora) : null) },
  { chave: "taxa", num: true, desc: true, valor: (l) => l.taxa },
  { chave: "aCorrigir", num: true, desc: true, valor: (l) => l.aCorrigir },
];

// Começa na ordem padrão (campus, disciplina e próxima entrega), sem coluna
// marcada. Vazios ficam sempre no fim, nos dois sentidos.
function useOrdenacao(linhas, agora) {
  const [ordem, setOrdem] = useState({ chave: null, desc: false });
  const padrao = [...linhas].sort(compararCursos({ campi: Object.keys(CAMPI), siglaDe: siglaDaDisciplina, agora }));
  let ordenadas = padrao;
  if (ordem.chave === "curso") {
    ordenadas = ordem.desc ? [...padrao].reverse() : padrao;
  } else if (ordem.chave) {
    const { valor } = COLUNAS.find((c) => c.chave === ordem.chave);
    ordenadas = [...padrao].sort((a, b) => {
      const va = valor(a, agora) ?? null;
      const vb = valor(b, agora) ?? null;
      if (va === null || vb === null) return (va === null) - (vb === null);
      return ordem.desc ? vb - va : va - vb;
    });
  }
  const ordenar = (chave) =>
    setOrdem((atual) =>
      atual.chave === chave
        ? { chave, desc: !atual.desc }
        : { chave, desc: COLUNAS.find((c) => c.chave === chave).desc ?? false }
    );
  return { ordem, ordenadas, ordenar };
}

function TabelaDeCursos({ cursos, tarefas, agora, f }) {
  const { t } = useTranslation();
  const linhas = cursos.map((curso) => resumoDoCurso(curso, tarefas, agora));
  const { ordem, ordenadas, ordenar } = useOrdenacao(linhas, agora);
  return (
    <div className="cnv-tabela-rolagem">
      <table className="cnv-tabela">
        <caption className="cnv-sr">{t("canvas.tabela.legenda")}</caption>
        <thead>
          <tr>
            {COLUNAS.map(({ chave, num }) => {
              const ativa = ordem.chave === chave;
              return (
                <th
                  key={chave}
                  scope="col"
                  className={num ? "num" : undefined}
                  aria-sort={ativa ? (ordem.desc ? "descending" : "ascending") : "none"}
                >
                  <button type="button" onClick={() => ordenar(chave)}>
                    {t(`canvas.tabela.${chave}`)}
                    {ativa && (ordem.desc ? <FiArrowDown aria-hidden="true" /> : <FiArrowUp aria-hidden="true" />)}
                  </button>
                </th>
              );
            })}
          </tr>
        </thead>
        <tbody>
          {ordenadas.map(({ curso, tarefas: total, vencidas, proxima, aCorrigir, taxa }) => (
            <tr key={curso.id}>
              <th scope="row">
                <a href={curso.url} target="_blank" rel="noopener noreferrer" className="cnv-tabela-curso">
                  <CursoTag curso={curso} />
                </a>
              </th>
              <td className="num">{curso.alunos === null ? "—" : f.n(curso.alunos)}</td>
              <td className="num">{t("canvas.tabela.vencidas", { vencidas: f.n(vencidas), total: f.n(total) })}</td>
              <td className="cnv-tabela-proxima">
                {proxima ? (
                  <>
                    <a href={proxima.url} target="_blank" rel="noopener noreferrer">
                      {proxima.nome}
                    </a>
                    <Prazo tarefa={proxima} agora={agora} />
                  </>
                ) : (
                  <span className="cnv-nada">—</span>
                )}
              </td>
              <td className="num">{taxa === null ? "—" : f.pct(taxa)}</td>
              <td className={aCorrigir > 0 ? "num alerta" : "num"}>{f.n(aCorrigir)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecaoResumo({ cursos, tarefas, cursoPorId, agora, f, filtrado }) {
  const { t } = useTranslation();
  const total = totaisDe(cursos, tarefas, agora);
  // Sem filtro, o script já contou os alunos diferentes (quem está em dois
  // cursos conta uma vez); com filtro, vale a soma dos cursos
  const alunos = !filtrado && canvasInfo.alunos != null ? canvasInfo.alunos : total.alunos;
  const { abertas } = separarTarefas(tarefas, agora);
  const limite = agora + LIMITES.semanaDias * 86_400_000;
  const daSemana = abertas.filter((tarefa) => prazoAtual(tarefa, agora) <= limite);

  const kpis = [
    { chave: "cursos", Icone: FiBookOpen, valor: f.n(total.cursos) },
    { chave: "alunos", Icone: FiUsers, valor: f.n(alunos) },
    { chave: "abertas", Icone: FiClipboard, valor: f.n(total.abertas) },
    { chave: "semana", Icone: FiCalendar, valor: f.n(total.semana), alerta: total.semana > 0 },
    { chave: "aCorrigir", Icone: FiEdit3, valor: f.n(total.aCorrigir), alerta: total.aCorrigir > 0 },
    { chave: "taxa", Icone: FiCheckCircle, valor: total.taxa === null ? "—" : f.pct(total.taxa) },
  ].map((kpi) => ({
    ...kpi,
    rotulo: t(`canvas.kpis.${kpi.chave}`, { dias: LIMITES.semanaDias }),
    titulo: t(`canvas.kpiDicas.${kpi.chave}`, { defaultValue: "" }) || undefined,
  }));

  return (
    <>
      <ProximaEntrega abertas={abertas} cursoPorId={cursoPorId} agora={agora} f={f} />
      <Kpis itens={kpis} />

      <h5 className="cnv-secao-titulo">{t("canvas.semana.titulo", { dias: LIMITES.semanaDias })}</h5>
      {daSemana.length > 0 ? (
        <ListaDeTarefas tarefas={daSemana} cursoPorId={cursoPorId} agora={agora} f={f} compacta />
      ) : (
        <p className="cnv-resumo">{t("canvas.semana.nenhuma", { dias: LIMITES.semanaDias })}</p>
      )}

      <h5 className="cnv-secao-titulo">{t("canvas.tabela.titulo")}</h5>
      <TabelaDeCursos cursos={cursos} tarefas={tarefas} agora={agora} f={f} />
      <p className="cnv-nota">{t("canvas.tabela.dica")}</p>
    </>
  );
}

/* ---------------------------------------------------------------------
   canvas --tarefas
   --------------------------------------------------------------------- */

function SecaoTarefas({ tarefas, cursoPorId, agora, f }) {
  const { t } = useTranslation();
  const [todasVencidas, setTodasVencidas] = useState(false);
  const { abertas, vencidas, semPrazo } = separarTarefas(tarefas, agora);
  const vencidasVisiveis = todasVencidas ? vencidas : vencidas.slice(0, LIMITES.vencidasVisiveis);
  const escondidas = vencidas.length - vencidasVisiveis.length;
  const atualizado = Date.parse(canvasInfo.geradoEm);
  const lista = (itens) => <ListaDeTarefas tarefas={itens} cursoPorId={cursoPorId} agora={agora} f={f} />;

  return (
    <>
      <Resumo
        i18nKey="canvas.tarefas.resumo"
        values={{ abertas: f.n(abertas.length), vencidas: f.n(vencidas.length), semPrazo: f.n(semPrazo.length) }}
      />
      <LegendaDasEntregas />

      <h5 className="cnv-secao-titulo">{t("canvas.tarefas.abertas")}</h5>
      {abertas.length > 0 ? lista(abertas) : <p className="cnv-resumo">{t("canvas.proxima.nenhuma")}</p>}

      {vencidas.length > 0 && (
        <>
          <h5 className="cnv-secao-titulo">{t("canvas.tarefas.vencidas")}</h5>
          {lista(vencidasVisiveis)}
          {(escondidas > 0 || todasVencidas) && vencidas.length > LIMITES.vencidasVisiveis && (
            <button type="button" className="cnv-mais" onClick={() => setTodasVencidas((atual) => !atual)}>
              {todasVencidas
                ? t("canvas.tarefas.mostrarMenos")
                : t("canvas.tarefas.mostrarTodas", { count: escondidas })}
            </button>
          )}
        </>
      )}

      {semPrazo.length > 0 && (
        <>
          <h5 className="cnv-secao-titulo">{t("canvas.tarefas.semPrazo")}</h5>
          {lista(semPrazo)}
        </>
      )}

      <p className="cnv-nota">
        {t("canvas.tarefas.nota", { data: f.data(atualizado), hora: f.hora(atualizado) })}
      </p>
    </>
  );
}

/* ---------------------------------------------------------------------
   canvas --agenda
   --------------------------------------------------------------------- */

function ItemDaAgenda({ item, cursoPorId, agora, f }) {
  const { t } = useTranslation();
  if (item.tipo === "tarefa") {
    const { tarefa } = item;
    const vencida = item.ms < agora;
    return (
      <li className={`cnv-item tarefa${vencida ? " passou" : ""}`}>
        <span className="cnv-item-hora">{item.hora}</span>
        <span className="cnv-item-icone" title={t("canvas.agenda.tarefa")}>
          <FiClipboard aria-hidden="true" />
          <span className="cnv-sr">{t("canvas.agenda.tarefa")}</span>
        </span>
        <div className="cnv-item-corpo">
          <p className="cnv-tarefa-topo">
            <CursoTag curso={cursoPorId.get(tarefa.curso)} />
            <Selos tarefa={tarefa} />
            {tarefa.prazos && <span className="cnv-selo">{t("canvas.tipos.porTurma")}</span>}
          </p>
          <a href={tarefa.url} target="_blank" rel="noopener noreferrer" className="cnv-item-titulo">
            {tarefa.nome}
          </a>
          <Entregas tarefa={tarefa} vencida={vencida} f={f} compacta />
        </div>
      </li>
    );
  }
  const { evento } = item;
  const fim = evento.fim && !evento.diaInteiro ? Date.parse(evento.fim) : null;
  const passou = (fim ?? item.ms) < agora && !evento.diaInteiro;
  const Titulo = evento.url ? "a" : "span";
  return (
    <li className={`cnv-item evento${passou ? " passou" : ""}`}>
      <span className="cnv-item-hora">
        {item.hora ?? t("canvas.agenda.diaTodo")}
        {item.hora && fim && <small>{f.hora(fim)}</small>}
      </span>
      <span className="cnv-item-icone" title={t("canvas.agenda.evento")}>
        <FiCalendar aria-hidden="true" />
        <span className="cnv-sr">{t("canvas.agenda.evento")}</span>
      </span>
      <div className="cnv-item-corpo">
        <p className="cnv-tarefa-topo">
          <CursoTag curso={cursoPorId.get(evento.curso)} />
        </p>
        <Titulo
          className="cnv-item-titulo"
          {...(evento.url && { href: evento.url, target: "_blank", rel: "noopener noreferrer" })}
        >
          {evento.titulo}
        </Titulo>
        {evento.local && (
          <p className="cnv-item-local">
            <FiMapPin aria-hidden="true" />
            {evento.local}
          </p>
        )}
      </div>
    </li>
  );
}

function SecaoAgenda({ tarefas, eventos, cursoPorId, agora, f }) {
  const { t } = useTranslation();
  const [semestreTodo, setSemestreTodo] = useState(false);
  const hoje = diaDe(agora);
  const fimDoSemestre = canvasInfo.fim;
  const curto = somaDias(hoje, LIMITES.agendaDias - 1);
  const ate = semestreTodo || curto > fimDoSemestre ? fimDoSemestre : curto;
  const dias = agendaDe({ tarefas, eventos, agora, ate, especialEm: diaEspecialEm });
  const contar = (tipo) => dias.reduce((total, d) => total + d.itens.filter((i) => i.tipo === tipo).length, 0);
  const ateTexto = f.diaMes(meioDia(ate));

  return (
    <>
      {ate >= hoje && (
        <Resumo
          i18nKey="canvas.agenda.resumo"
          values={{ tarefas: f.n(contar("tarefa")), eventos: f.n(contar("evento")), ate: ateTexto }}
        />
      )}
      {dias.length === 0 && <p className="cnv-resumo">{t("canvas.agenda.vazio", { ate: ateTexto })}</p>}
      <ol className="cnv-agenda">
        {dias.map(({ dia, itens, especial }) => {
          const diferenca = diasAte(dia, agora);
          return (
            <li key={dia} className={diferenca === 0 ? "cnv-dia hoje" : "cnv-dia"}>
              <h6 className="cnv-dia-cabecalho">
                <span className="cnv-dia-semana">{f.semana(meioDia(dia))}</span>
                <span className="cnv-dia-data">{f.diaMes(meioDia(dia))}</span>
                <span className="cnv-dia-relativo">
                  {diferenca <= 1 ? rotuloDoDia(t, f, dia, agora) : t("canvas.dia.emDias", { count: diferenca })}
                </span>
                {especial && (
                  <span className={`cnv-dia-especial ${especial.tipo}`}>
                    <FiFlag aria-hidden="true" />
                    {t(`cal.feriados.${especial.chave}`)}
                  </span>
                )}
              </h6>
              {itens.length > 0 && (
                <ul className="cnv-itens">
                  {itens.map((item) => (
                    <ItemDaAgenda
                      key={`${item.tipo}-${item.tarefa?.id ?? item.evento.id}-${item.ms}`}
                      item={item}
                      cursoPorId={cursoPorId}
                      agora={agora}
                      f={f}
                    />
                  ))}
                </ul>
              )}
            </li>
          );
        })}
      </ol>
      {curto < fimDoSemestre && (
        <button type="button" className="cnv-mais" onClick={() => setSemestreTodo((atual) => !atual)}>
          {semestreTodo
            ? t("canvas.agenda.proximos", { dias: LIMITES.agendaDias })
            : t("canvas.agenda.ateFim", { data: f.diaMes(meioDia(fimDoSemestre)) })}
        </button>
      )}
      <p className="cnv-nota">{t("canvas.agenda.nota")}</p>
    </>
  );
}

/* ---------------------------------------------------------------------
   Moldura: título, seções e rodapé "Seções:"
   --------------------------------------------------------------------- */

const SECTION_VIEWS = {
  resumo: SecaoResumo,
  tarefas: SecaoTarefas,
  agenda: SecaoAgenda,
};

// "DIW · Coreu · G1 · noite" para o filtro digitado
function textoDoFiltro(filtros, t) {
  return [
    ...filtros.disciplinas.map((d) => DISCIPLINAS[d]?.sigla ?? d),
    ...filtros.campi.map((c) => t(`cal.campi.${c}`)),
    ...filtros.turmas,
    ...filtros.termos,
  ].join(" · ");
}

export default function Canvas({ section = DEFAULT_SECTION, filtros }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const agora = useAgora(30_000);
  const panelRef = useRef(null);

  // Na primeira vez o código chega depois do comando (App.jsx usa lazy):
  // se a saída ainda é a última do terminal, leva o comando para o topo
  useEffect(() => {
    if (isLastTerminalOutput(panelRef.current)) scrollLastCommandToTop();
  }, []);

  const cursos = aplicarFiltros(TODOS_OS_CURSOS, filtros);
  const ids = new Set(cursos.map((c) => c.id));
  const tarefas = TODAS_AS_TAREFAS.filter((tarefa) => ids.has(tarefa.curso));
  const eventos = TODOS_OS_EVENTOS.filter((evento) => ids.has(evento.curso));
  const cursoPorId = new Map(cursos.map((c) => [c.id, c]));
  const sections = section === ALL_SECTIONS ? SECTIONS : [section];
  const filtro = semFiltro(filtros) ? "" : textoDoFiltro(filtros, t);

  let conteudo;
  if (!canvasInfo) {
    conteudo = (
      <>
        <p className="cnv-resumo cnv-centro">{t("canvas.semDados")}</p>
        {/* Só no npm run dev: lembra que os dados vêm do npm run canvas */}
        {import.meta.env.DEV && (
          <p className="cnv-aviso-dev" role="note">
            <FiAlertTriangle aria-hidden="true" />
            <span>{t("canvas.semDadosDev")}</span>
          </p>
        )}
      </>
    );
  } else if (cursos.length === 0) {
    conteudo = <p className="cnv-resumo cnv-centro">{t("canvas.nenhum")}</p>;
  } else {
    conteudo = sections.map((key) => {
      const View = SECTION_VIEWS[key];
      return (
        <div key={key} className="cnv-secao">
          {sections.length > 1 && <h4 className="cnv-secao-grande">{t(`canvas.secoes.${key}`)}</h4>}
          <View
            cursos={cursos}
            tarefas={tarefas}
            eventos={eventos}
            cursoPorId={cursoPorId}
            agora={agora}
            f={f}
            filtrado={Boolean(filtro)}
          />
        </div>
      );
    });
  }

  const [ano, numero] = canvasInfo?.semestre.split("-") ?? [];
  const atualizado = canvasInfo ? Date.parse(canvasInfo.geradoEm) : null;

  return (
    <div className="cnv-painel" ref={panelRef}>
      <h3 className="cnv-titulo">{t("canvas.titulo")}</h3>
      {canvasInfo && (
        <p className="cnv-subtitulo">
          {t("canvas.subtitulo", { semestre: numero, ano, data: f.data(atualizado), hora: f.hora(atualizado) })}
        </p>
      )}
      {filtro && <p className="cnv-filtro">{t("canvas.filtro", { texto: filtro })}</p>}
      {conteudo}
      <SkinsFooter skins={SECTION_OPTIONS} active={section} namespace="canvas" />
    </div>
  );
}
