import React, { useEffect, useMemo, useRef, useState } from "react";
import { Trans, useTranslation } from "react-i18next";
import {
  FiAlertTriangle,
  FiArrowDown,
  FiArrowUp,
  FiClock,
  FiCode,
  FiExternalLink,
  FiGitCommit,
  FiGitPullRequest,
  FiPauseCircle,
  FiUsers,
} from "react-icons/fi";
import { GoIssueClosed } from "react-icons/go";
import { grupos as TODOS_OS_GRUPOS, turmasInfo } from "../data/turmasData";
import { DISCIPLINAS_TI, slugDoGrupo } from "../data/turmasRepos";
import { CAMPI, DISCIPLINAS } from "../data/horarioData";
import {
  ALL_SECTIONS,
  DEFAULT_SECTION,
  GROUP_SECTION,
  SECTIONS,
  SECTION_OPTIONS,
  aplicarFiltros,
} from "../data/turmasSections";
import {
  LIMITES,
  alertasDo,
  commitsPorSemana,
  datasDaSemana,
  diasSemCommit,
  dobrarResto,
  linguagensDe,
  ordenarPorCampusELinhas,
  paletaDaDisciplina,
  semanasDe,
  temDados,
  totaisDe,
} from "../lib/turmas";
import { isLastTerminalOutput, scrollLastCommandToTop } from "../terminal/terminalDom";
import SkinsFooter from "./SkinsFooter";
import "./Turmas.css";

// =====================================================================
// Comando "turmas": acompanhamento de turmas de TI (Trabalhos
// Interdisciplinares). Compara os grupos que eu oriento pelos repositórios
// no GitHub, sem os professores (PROFESSORES, em data/turmasRepos.js).
// Um gráfico por opção:
//   turmas / --resumo   indicadores e tabela ordenável (padrão)
//   turmas --codigo     linhas de código por grupo, por linguagem
//   turmas --linguagens linguagens da turma e de cada grupo
//   turmas --ritmo      commits por semana e dias sem commit
//   turmas --equilibrio fatia de commits e de linhas de cada integrante
//   turmas --prs        pull requests e issues
//   turmas --projetos   título, descrição, stack e links (do README)
//   turmas uaiport      ficha de um grupo só
// Os dados vêm do "npm run turmas" (scripts/turmas.mjs), que roda na minha
// máquina: os repositórios são privados e aqui só chegam números e o resumo
// de cada projeto, sem nomes de alunos.
// =====================================================================

const sum = (valores) => valores.reduce((total, n) => total + (n ?? 0), 0);

function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language?.startsWith("en") ? "en-US" : "pt-BR";
  return useMemo(() => {
    const numero = new Intl.NumberFormat(locale);
    const compacto = new Intl.NumberFormat(locale, { notation: "compact", maximumFractionDigits: 1 });
    const percentual = new Intl.NumberFormat(locale, { style: "percent", maximumFractionDigits: 0 });
    const data = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" });
    const diaMes = new Intl.DateTimeFormat(locale, { day: "2-digit", month: "2-digit", timeZone: "UTC" });
    // "2026-10-05T22:10-03:00" → o dia em Brasília, sem o fuso do navegador mexer
    const dia = (iso) => Date.parse(`${iso.slice(0, 10)}T12:00:00Z`);
    return {
      n: (valor) => numero.format(valor ?? 0),
      compacto: (valor) => compacto.format(valor ?? 0),
      pct: (valor) => percentual.format(valor ?? 0),
      data: (iso) => data.format(dia(iso)),
      diaMes: (iso) => diaMes.format(dia(iso)),
    };
  }, [locale]);
}

// "hoje", "ontem", "há 9 dias"
function quando(t, dias) {
  if (dias === null) return t("turmas.quando.nunca");
  if (dias === 0) return t("turmas.quando.hoje");
  if (dias === 1) return t("turmas.quando.ontem");
  return t("turmas.quando.dias", { count: dias });
}

const estiloCampus = (campus) => ({ "--campus": `var(${CAMPI[campus]?.cor ?? "--text-muted"})` });

/* ---------------------------------------------------------------------
   Pedaços em comum
   --------------------------------------------------------------------- */

// [C] G1 FindPro: letra e cor do campus, como na grade do "cal"
function NomeDoGrupo({ g }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const campus = t(`cal.campi.${g.campus}`);
  return (
    <span className="tur-nome" style={estiloCampus(g.campus)} title={`${campus} · ${g.nome}`}>
      <b className="tur-campus" aria-hidden="true">
        {CAMPI[g.campus]?.sigla}
      </b>
      <span className="tur-sr">{campus}</span>
      {g.grupo && <span className="tur-g">{g.grupo}</span>}
      <span className="tur-nome-texto">{g.nome}</span>
      {g.aviso && (
        <FiClock
          className="tur-antigo"
          title={t("turmas.aviso", { data: f.data(g.atualizadoEm) })}
          aria-label={t("turmas.aviso", { data: f.data(g.atualizadoEm) })}
        />
      )}
    </span>
  );
}

function SemDados({ g }) {
  const { t } = useTranslation();
  return (
    <span className="tur-semdados" title={t("turmas.semDadosDica")}>
      {t(`turmas.semDados.${g.erro ?? "pendente"}`)}
    </span>
  );
}

function textoDoAlerta(t, f, alerta, curto = false) {
  const chave = `turmas.${curto ? "alertasCurtos" : "alertas"}.${alerta.tipo}`;
  return t(chave, { dias: alerta.dias, count: alerta.count, fatia: f.pct(alerta.fatia) });
}

function Alertas({ g, f, curto = false }) {
  const { t } = useTranslation();
  const alertas = alertasDo(g, turmasInfo);
  if (alertas.length === 0) {
    return curto ? <span className="tur-ok">—</span> : null;
  }
  return (
    <ul className={curto ? "tur-alertas curto" : "tur-alertas"}>
      {alertas.map((alerta) => (
        <li key={alerta.tipo} title={curto ? textoDoAlerta(t, f, alerta) : undefined}>
          <FiAlertTriangle aria-hidden="true" />
          <span>{textoDoAlerta(t, f, alerta, curto)}</span>
        </li>
      ))}
    </ul>
  );
}

function Resumo({ i18nKey, values }) {
  return (
    <p className="tur-resumo">
      <Trans i18nKey={i18nKey} values={values} components={{ b: <strong /> }} />
    </p>
  );
}

function Legenda({ itens }) {
  return (
    <ul className="tur-legenda">
      {itens.map((item) => (
        <li key={item.chave ?? item.rotulo} className={item.classe} style={item.estilo}>
          <span className="tur-amostra" aria-hidden="true" />
          {item.rotulo}
          {item.detalhe && <span className="tur-legenda-detalhe">{item.detalhe}</span>}
        </li>
      ))}
    </ul>
  );
}

// Barra empilhada: cada parte com a cor da série e um balão ao passar o mouse.
// A largura total é proporcional ao maior da turma (escala comum).
function Pilha({ partes, largura = 1 }) {
  const visiveis = partes.filter((p) => p.valor > 0);
  return (
    <span className="tur-trilho" aria-hidden="true">
      <span className="tur-pilha" style={{ width: `${Math.max(0, Math.min(1, largura)) * 100}%` }}>
        {visiveis.map((parte) => (
          <span
            key={parte.chave}
            className={`tur-seg ${parte.classe ?? ""}`}
            style={{ flexGrow: parte.valor, "--cor": parte.cor }}
            data-tip={parte.dica}
          />
        ))}
      </span>
    </span>
  );
}

function Kpis({ itens, colunas }) {
  return (
    <ul className="tur-kpis" style={colunas ? { "--colunas": colunas } : undefined}>
      {itens.map((item, index) => {
        const { chave, Icone, valor, rotulo, titulo, alerta } = item;
        return (
          <li key={chave} className={alerta ? "tur-kpi alerta" : "tur-kpi"} style={{ "--i": index }}>
            <span className="tur-kpi-rotulo">
              <Icone aria-hidden="true" />
              {rotulo}
            </span>
            <span className="tur-kpi-valor" title={titulo}>
              {valor}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/* ---------------------------------------------------------------------
   turmas / turmas --resumo
   --------------------------------------------------------------------- */

const COLUNAS = [
  { chave: "grupo" },
  { chave: "commits", valor: (g) => g.commits },
  { chave: "linhas", valor: (g) => g.codigo.linhas },
  { chave: "prs", valor: (g) => g.prs?.mergeados },
  { chave: "issues", valor: (g) => g.issues?.fechadas },
  // Mais recente primeiro quando ordena "do maior para o menor"
  {
    chave: "ultimo",
    valor: (g) => {
      const dias = diasSemCommit(g, turmasInfo);
      return dias === null ? null : -dias;
    },
  },
];

// Começa na mesma ordem dos gráficos (campus e linhas de código), sem coluna
// marcada. Clicar numa coluna ordena por ela; "Grupo" volta para a ordem da
// lista em turmasRepos.js (campus e número do grupo).
const posicaoNaLista = (g) => TODOS_OS_GRUPOS.findIndex((outro) => outro.id === g.id);

function useOrdenacao(grupos) {
  const [ordem, setOrdem] = useState({ chave: null, desc: false });
  const ordenados = useMemo(() => {
    if (ordem.chave === null) return grupos;
    if (ordem.chave === "grupo") {
      const naLista = [...grupos].sort((a, b) => posicaoNaLista(a) - posicaoNaLista(b));
      return ordem.desc ? naLista.reverse() : naLista;
    }
    const coluna = COLUNAS.find((c) => c.chave === ordem.chave);
    const valor = (g) => (temDados(g) ? coluna.valor(g) : null) ?? null;
    return [...grupos].sort((a, b) => {
      const va = valor(a);
      const vb = valor(b);
      if (va === null || vb === null) return (va === null) - (vb === null);
      return ordem.desc ? vb - va : va - vb;
    });
  }, [grupos, ordem]);
  const ordenar = (chave) =>
    setOrdem((atual) =>
      atual.chave === chave ? { chave, desc: !atual.desc } : { chave, desc: chave !== "grupo" }
    );
  return { ordem, ordenados, ordenar };
}

function LinhaDaTabela({ g, f }) {
  const { t } = useTranslation();
  if (!temDados(g)) {
    return (
      <tr className="sem-dados">
        <th scope="row">
          <NomeDoGrupo g={g} />
        </th>
        <td colSpan={COLUNAS.length}>
          <SemDados g={g} />
        </td>
      </tr>
    );
  }
  const dias = diasSemCommit(g, turmasInfo);
  const parado = g.commits === 0 || (dias !== null && dias > LIMITES.diasParado);
  return (
    <tr>
      <th scope="row">
        <NomeDoGrupo g={g} />
      </th>
      <td className="num">{f.n(g.commits)}</td>
      <td className="num" title={f.n(g.codigo.linhas)}>
        {f.compacto(g.codigo.linhas)}
      </td>
      <td className="num">
        {g.prs ? f.n(g.prs.mergeados) : "—"}
        {g.prs?.abertos > 0 && (
          <small>{t("turmas.tabela.abertos", { count: g.prs.abertos })}</small>
        )}
      </td>
      <td className="num">
        {g.issues ? f.n(g.issues.fechadas) : "—"}
        {g.issues?.abertas > 0 && (
          <small>{t("turmas.tabela.abertas", { count: g.issues.abertas })}</small>
        )}
      </td>
      <td className={parado ? "num alerta" : "num"}>{quando(t, dias)}</td>
      <td>
        <Alertas g={g} f={f} curto />
      </td>
    </tr>
  );
}

function Tabela({ grupos, f }) {
  const { t } = useTranslation();
  const { ordem, ordenados, ordenar } = useOrdenacao(grupos);
  return (
    <div className="tur-tabela-rolagem">
      <table className="tur-tabela">
        <caption className="tur-sr">{t("turmas.tabela.legenda")}</caption>
        <thead>
          <tr>
            {COLUNAS.map(({ chave }) => {
              const ativa = ordem.chave === chave;
              return (
                <th
                  key={chave}
                  scope="col"
                  className={chave === "grupo" ? "" : "num"}
                  aria-sort={ativa ? (ordem.desc ? "descending" : "ascending") : "none"}
                >
                  <button type="button" onClick={() => ordenar(chave)}>
                    {t(`turmas.tabela.${chave}`)}
                    {ativa && chave !== "grupo" && (ordem.desc ? <FiArrowDown aria-hidden="true" /> : <FiArrowUp aria-hidden="true" />)}
                  </button>
                </th>
              );
            })}
            <th scope="col">{t("turmas.tabela.alertas")}</th>
          </tr>
        </thead>
        <tbody>
          {ordenados.map((g) => (
            <LinhaDaTabela key={g.id} g={g} f={f} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SecaoResumo({ grupos, f }) {
  const { t } = useTranslation();
  const total = totaisDe(grupos, turmasInfo);
  const kpis = [
    { chave: "grupos", Icone: FiUsers, valor: `${total.comDados}/${total.grupos}` },
    { chave: "commits", Icone: FiGitCommit, valor: f.n(total.commits) },
    { chave: "linhas", Icone: FiCode, valor: f.compacto(total.linhas), titulo: f.n(total.linhas) },
    total.temApi && { chave: "prs", Icone: FiGitPullRequest, valor: f.n(total.prs.mergeados) },
    total.temApi && { chave: "issues", Icone: GoIssueClosed, valor: f.n(total.issues.fechadas) },
    { chave: "parados", Icone: FiPauseCircle, valor: f.n(total.parados), alerta: total.parados > 0 },
  ]
    .filter(Boolean)
    .map((kpi) => ({ ...kpi, rotulo: t(`turmas.kpis.${kpi.chave}`, { dias: LIMITES.diasParado }) }));

  return (
    <>
      <Kpis itens={kpis} />
      <Tabela grupos={grupos} f={f} />
      <p className="tur-nota">{t("turmas.tabela.dica")}</p>
    </>
  );
}

/* ---------------------------------------------------------------------
   turmas --codigo e --linguagens
   --------------------------------------------------------------------- */

// Cores fixas da disciplina (as 6 linguagens com mais linhas nela, sem
// filtro) e quais delas aparecem nestes grupos
function paletaDos(grupos) {
  const paleta = paletaDaDisciplina(TODOS_OS_GRUPOS, grupos[0]?.disciplina);
  const linguagens = linguagensDe(grupos);
  const presentes = new Set(linguagens.map(([nome]) => nome));
  const principais = paleta.nomes.filter((nome) => presentes.has(nome));
  return {
    ...paleta,
    principais,
    linguagens,
    temOutras: linguagens.some(([nome]) => !principais.includes(nome)),
  };
}

// Partes de um grupo nas linguagens da paleta (sempre na mesma ordem e cor)
// + "outras"
function partesDeLinguagem(g, paleta, f, t) {
  const { top, resto } = dobrarResto(g.codigo.linguagens, paleta.principais);
  const porNome = new Map(top);
  const total = g.codigo.linhas || 1;
  const dica = (nome, linhas) => `${nome} · ${f.n(linhas)} (${f.pct(linhas / total)})`;
  return [
    ...paleta.principais
      .filter((nome) => porNome.has(nome))
      .map((nome) => ({
        chave: nome,
        valor: porNome.get(nome),
        cor: paleta.cor(nome),
        dica: dica(nome, porNome.get(nome)),
      })),
    resto > 0 && { chave: "outras", valor: resto, cor: paleta.cor(null), dica: dica(t("turmas.outras"), resto) },
  ].filter(Boolean);
}

function legendaDeLinguagens(paleta, t, detalhe) {
  return [
    ...paleta.principais.map((nome) => ({
      chave: nome,
      rotulo: nome,
      estilo: { "--cor": paleta.cor(nome) },
      detalhe: detalhe?.(nome),
    })),
    paleta.temOutras && {
      chave: "outras",
      rotulo: t("turmas.outras"),
      estilo: { "--cor": paleta.cor(null) },
      detalhe: detalhe?.(null),
    },
  ].filter(Boolean);
}

function SecaoCodigo({ grupos, f }) {
  const { t } = useTranslation();
  const paleta = paletaDos(grupos);
  // Mesma ordem dos outros gráficos (campus e linhas); a escala é a do maior
  const comDados = grupos.filter(temDados);
  const maior = Math.max(1, ...comDados.map((g) => g.codigo.linhas));
  const total = sum(comDados.map((g) => g.codigo.linhas));

  return (
    <>
      <Resumo i18nKey="turmas.codigo.resumo" values={{ linhas: f.n(total), count: comDados.length }} />
      <Legenda itens={legendaDeLinguagens(paleta, t)} />
      <ul className="tur-barras">
        {comDados.map((g) => (
          <li key={g.id} className="tur-barra" aria-label={`${g.nome}: ${t("turmas.linhas", { count: g.codigo.linhas, valor: f.n(g.codigo.linhas) })}`}>
            <NomeDoGrupo g={g} />
            <Pilha partes={partesDeLinguagem(g, paleta, f, t)} largura={g.codigo.linhas / maior} />
            <span className="tur-valor" title={f.n(g.codigo.linhas)}>
              {f.compacto(g.codigo.linhas)}
            </span>
          </li>
        ))}
        {grupos.filter((g) => !temDados(g)).map((g) => (
          <li key={g.id} className="tur-barra sem-dados">
            <NomeDoGrupo g={g} />
            <SemDados g={g} />
          </li>
        ))}
      </ul>
      <p className="tur-nota">{t("turmas.codigo.nota")}</p>
    </>
  );
}

function SecaoLinguagens({ grupos, f }) {
  const { t } = useTranslation();
  const paleta = paletaDos(grupos);
  const { linguagens } = paleta;
  const total = sum(linguagens.map(([, n]) => n)) || 1;
  const porNome = new Map(linguagens);
  const resto = total - sum(paleta.principais.map((nome) => porNome.get(nome)));
  const detalhe = (nome) => f.pct((nome ? porNome.get(nome) : resto) / total);
  const turma = { codigo: { linhas: total, linguagens } };

  return (
    <>
      <Resumo
        i18nKey="turmas.linguagens.resumo"
        values={{ count: linguagens.length, grupos: grupos.filter(temDados).length }}
      />
      <div className="tur-turma-pilha">
        <Pilha partes={partesDeLinguagem(turma, paleta, f, t)} />
      </div>
      <Legenda itens={legendaDeLinguagens(paleta, t, detalhe)} />
      <ul className="tur-barras">
        {grupos.map((g) => {
          if (!temDados(g)) {
            return (
              <li key={g.id} className="tur-barra sem-dados">
                <NomeDoGrupo g={g} />
                <SemDados g={g} />
              </li>
            );
          }
          const [principal, linhas] = g.codigo.linguagens[0] ?? [];
          const texto = principal
            ? t("turmas.linguagens.principal", { nome: principal, percent: f.pct(linhas / g.codigo.linhas) })
            : t("turmas.linguagens.nenhuma");
          return (
            <li key={g.id} className="tur-barra" aria-label={`${g.nome}: ${texto}`}>
              <NomeDoGrupo g={g} />
              <Pilha partes={partesDeLinguagem(g, paleta, f, t)} />
              <span className="tur-valor tur-valor-largo">{texto}</span>
            </li>
          );
        })}
      </ul>
    </>
  );
}

/* ---------------------------------------------------------------------
   turmas --ritmo
   --------------------------------------------------------------------- */

// Colunas de commits por semana, com uma linha de leitura (mouse, toque ou
// ← → com o gráfico focado). Começa mostrando a semana atual.
function Semanas({ valores, f }) {
  const { t } = useTranslation();
  const [ativa, setAtiva] = useState(null);
  const maximo = Math.max(1, ...valores);
  const ultima = valores.length - 1;
  const mostrada = ativa ?? ultima;
  const leitura = (i) => {
    const { de, ate } = datasDaSemana(turmasInfo, i + 1);
    const texto = t("turmas.ritmo.leitura", {
      n: i + 1,
      de: f.diaMes(de),
      ate: f.diaMes(ate),
      count: valores[i],
      valor: f.n(valores[i]),
    });
    return i === ultima ? `${texto} (${t("turmas.ritmo.emAndamento")})` : texto;
  };
  const onKeyDown = (event) => {
    const passo = { ArrowRight: 1, ArrowLeft: -1 }[event.key];
    if (!passo) return;
    event.preventDefault();
    setAtiva((atual) => Math.min(ultima, Math.max(0, (atual ?? ultima) + passo)));
  };

  return (
    <figure className="tur-semanas">
      <figcaption className="tur-leitura" aria-hidden="true">
        {leitura(mostrada)}
      </figcaption>
      <div
        className="tur-semanas-plot"
        role="img"
        aria-label={t("turmas.ritmo.legenda")}
        tabIndex={0}
        onKeyDown={onKeyDown}
        onBlur={() => setAtiva(null)}
        onPointerLeave={() => setAtiva(null)}
        style={{ "--n": valores.length }}
      >
        {valores.map((valor, i) => (
          <span
            key={i}
            className={[
              "tur-semana",
              i === mostrada && "ativa",
              i === ultima && "atual",
              valor === 0 && "zero",
            ]
              .filter(Boolean)
              .join(" ")}
            style={{ "--h": `${(valor / maximo) * 100}%`, "--i": i }}
            onPointerEnter={() => setAtiva(i)}
            onPointerDown={() => setAtiva(i)}
          >
            <span className="tur-semana-barra" />
          </span>
        ))}
      </div>
      <div className="tur-semanas-eixo" aria-hidden="true" style={{ "--n": valores.length }}>
        {valores.map((_, i) => (
          <span key={i}>{t("turmas.ritmo.semana", { n: i + 1 })}</span>
        ))}
      </div>
      <table className="tur-sr">
        <caption>{t("turmas.ritmo.legenda")}</caption>
        <tbody>
          {valores.map((_, i) => (
            <tr key={i}>
              <td>{leitura(i)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </figure>
  );
}

// Mesmas semanas em miniatura, na escala do grupo mais ativo da turma
function MiniSemanas({ valores, semanas, maximo, f }) {
  const { t } = useTranslation();
  return (
    <span className="tur-mini" aria-hidden="true" style={{ "--n": semanas }}>
      {Array.from({ length: semanas }, (_, i) => {
        const valor = valores[i];
        return (
          <span
            key={i}
            className={valor ? "tur-mini-col" : "tur-mini-col zero"}
            style={{ "--h": `${((valor ?? 0) / maximo) * 100}%` }}
            data-tip={
              valor === undefined
                ? undefined
                : `${t("turmas.ritmo.semana", { n: i + 1 })} · ${t("turmas.commits", { count: valor, valor: f.n(valor) })}`
            }
          />
        );
      })}
    </span>
  );
}

function SecaoRitmo({ grupos, f }) {
  const { t } = useTranslation();
  const semanas = semanasDe(turmasInfo);
  const porSemana = commitsPorSemana(grupos, semanas);
  const total = sum(porSemana);
  const maximo = Math.max(1, ...grupos.filter(temDados).flatMap((g) => g.semanas));

  return (
    <>
      <Resumo
        i18nKey="turmas.ritmo.resumo"
        values={{
          commits: f.n(total),
          inicio: f.diaMes(turmasInfo.inicio),
          media: f.n(Math.round(total / semanas)),
        }}
      />
      <Semanas valores={porSemana} f={f} />
      <ul className="tur-ritmo">
        {grupos.map((g) => {
          if (!temDados(g)) {
            return (
              <li key={g.id} className="tur-ritmo-linha sem-dados">
                <NomeDoGrupo g={g} />
                <SemDados g={g} />
              </li>
            );
          }
          const dias = diasSemCommit(g, turmasInfo);
          const parado = g.commits === 0 || (dias !== null && dias > LIMITES.diasParado);
          const commits = t("turmas.commits", { count: g.commits, valor: f.n(g.commits) });
          return (
            <li key={g.id} className="tur-ritmo-linha" aria-label={`${g.nome}: ${commits}, ${quando(t, dias)}`}>
              <NomeDoGrupo g={g} />
              <MiniSemanas valores={g.semanas} semanas={semanas} maximo={maximo} f={f} />
              <span className="tur-valor">{commits}</span>
              <span className={parado ? "tur-quando alerta" : "tur-quando"}>
                {parado && <FiAlertTriangle aria-hidden="true" />}
                {quando(t, dias)}
              </span>
            </li>
          );
        })}
      </ul>
      <p className="tur-nota">{t("turmas.ritmo.nota", { dias: LIMITES.diasParado })}</p>
    </>
  );
}

/* ---------------------------------------------------------------------
   turmas --equilibrio
   --------------------------------------------------------------------- */

// Uma parte por integrante, na ordem de quem fez mais commits (a mesma nas
// duas barras). Quem fez mais commits fica na cor de destaque e os demais em
// cinza; a marca tracejada é a fatia que cada um teria numa divisão igual:
// se a primeira parte passa muito dela, o trabalho está concentrado.
function Fatias({ rotulo, fatias, tamanho, f }) {
  const { t } = useTranslation();
  return (
    <span className="tur-fatias">
      <span className="tur-fatias-rotulo">{rotulo}</span>
      <span className="tur-fatias-trilho" aria-hidden="true">
        {tamanho > 1 && <span className="tur-igual" style={{ left: `${100 / tamanho}%` }} />}
        {fatias.map((fatia, i) => (
          <span
            key={i}
            className={i === 0 ? "tur-fatia maior" : "tur-fatia"}
            style={{ flexGrow: fatia }}
            data-tip={`${t("turmas.equilibrio.integrante", { n: i + 1 })} · ${f.pct(fatia)}`}
          />
        ))}
      </span>
    </span>
  );
}

function Fantasmas({ quantos }) {
  if (quantos <= 0) return <span className="tur-fantasmas" />;
  return (
    <span className="tur-fantasmas" aria-hidden="true">
      {Array.from({ length: quantos }, (_, i) => (
        <span key={i} className="tur-fantasma" />
      ))}
    </span>
  );
}

function LinhaDeEquilibrio({ g, f }) {
  const { t } = useTranslation();
  const ativos = g.autores.length;
  const tamanho = Math.max(g.integrantes ?? 0, ativos);
  const alertas = alertasDo(g, turmasInfo);
  const concentrado = alertas.some((a) => a.tipo === "concentrado");
  const inativos = alertas.some((a) => a.tipo === "inativos");
  const quem = g.integrantes
    ? t("turmas.equilibrio.ativos", { ativos, total: g.integrantes })
    : t("turmas.equilibrio.ativosSemTotal", { count: ativos });
  const maior = t("turmas.equilibrio.maior", { fatia: f.pct(g.autores[0]?.c ?? 0) });
  const fatias = g.autores.map((a) => f.pct(a.c)).join(", ");

  return (
    <li className="tur-eq-linha" aria-label={`${g.nome}: ${quem}; ${maior} (${fatias})`}>
      <NomeDoGrupo g={g} />
      <span className="tur-eq-barras">
        <Fatias rotulo={t("turmas.equilibrio.commits")} fatias={g.autores.map((a) => a.c)} tamanho={tamanho} f={f} />
        <Fatias rotulo={t("turmas.equilibrio.linhas")} fatias={g.autores.map((a) => a.l)} tamanho={tamanho} f={f} />
      </span>
      <Fantasmas quantos={tamanho - ativos} />
      <span className="tur-eq-texto">
        <span className={inativos ? "alerta" : ""}>
          {inativos && <FiAlertTriangle aria-hidden="true" />}
          {quem}
        </span>
        <span className={concentrado ? "alerta" : ""}>
          {concentrado && <FiAlertTriangle aria-hidden="true" />}
          {maior}
        </span>
      </span>
    </li>
  );
}

function SecaoEquilibrio({ grupos, f }) {
  const { t } = useTranslation();
  return (
    <>
      <p className="tur-resumo">{t("turmas.equilibrio.legenda")}</p>
      <Legenda
        itens={[
          { chave: "maior", rotulo: t("turmas.equilibrio.legendaMaior"), classe: "maior" },
          { chave: "demais", rotulo: t("turmas.equilibrio.legendaDemais"), classe: "demais" },
          { chave: "igual", rotulo: t("turmas.equilibrio.igual"), classe: "igual" },
          { chave: "fantasma", rotulo: t("turmas.equilibrio.fantasma"), classe: "fantasma" },
        ]}
      />
      <ul className="tur-equilibrio">
        {grupos.map((g) =>
          temDados(g) && g.commits > 0 ? (
            <LinhaDeEquilibrio key={g.id} g={g} f={f} />
          ) : (
            <li key={g.id} className="tur-eq-linha sem-dados">
              <NomeDoGrupo g={g} />
              {temDados(g) ? <span className="tur-semdados">{t("turmas.alertas.semCommits")}</span> : <SemDados g={g} />}
            </li>
          )
        )}
      </ul>
      <p className="tur-nota">
        {t("turmas.equilibrio.nota", { fatia: f.pct(LIMITES.fatiaConcentrada) })}
      </p>
    </>
  );
}

/* ---------------------------------------------------------------------
   turmas --prs
   --------------------------------------------------------------------- */

function Contagem({ partes, maximo, f }) {
  const total = sum(partes.map((p) => p.valor));
  return (
    <span className="tur-contagem">
      <Pilha partes={partes} largura={total / maximo} />
      <span className="tur-contagem-num">
        {partes.map((p) => (
          <span key={p.chave} className={p.classe} title={p.rotulo}>
            <span className="tur-amostra" aria-hidden="true" />
            {f.n(p.valor)}
            <span className="tur-sr"> {p.rotulo}</span>
          </span>
        ))}
      </span>
    </span>
  );
}

function partesDePrs(g, t) {
  const p = (chave, classe, valor) => {
    const rotulo = t(`turmas.prs.${chave}`);
    return { chave, classe, valor, rotulo, dica: `${rotulo}: ${valor}` };
  };
  return {
    prs: [
      p("mergeados", "concluido", g.prs.mergeados),
      p("abertos", "aberto", g.prs.abertos),
      p("fechados", "descartado", g.prs.fechados),
    ],
    issues: [p("fechadas", "concluido", g.issues?.fechadas ?? 0), p("abertas", "aberto", g.issues?.abertas ?? 0)],
  };
}

function SecaoPrs({ grupos, f }) {
  const { t } = useTranslation();
  const total = totaisDe(grupos, turmasInfo);
  const comApi = grupos.filter((g) => temDados(g) && g.prs);
  if (comApi.length === 0) return <p className="tur-resumo">{t("turmas.prs.semApiTodos")}</p>;
  const maxPrs = Math.max(1, ...comApi.map((g) => g.prs.mergeados + g.prs.abertos + g.prs.fechados));
  const maxIssues = Math.max(1, ...comApi.map((g) => (g.issues?.fechadas ?? 0) + (g.issues?.abertas ?? 0)));

  return (
    <>
      <Resumo
        i18nKey="turmas.prs.resumo"
        values={{
          mergeados: f.n(total.prs.mergeados),
          abertos: f.n(total.prs.abertos),
          fechadas: f.n(total.issues.fechadas),
          abertas: f.n(total.issues.abertas),
        }}
      />
      <Legenda
        itens={[
          { chave: "concluido", rotulo: t("turmas.prs.legendaConcluido"), classe: "concluido" },
          { chave: "aberto", rotulo: t("turmas.prs.legendaAberto"), classe: "aberto" },
          { chave: "descartado", rotulo: t("turmas.prs.fechados"), classe: "descartado" },
        ]}
      />
      <div className="tur-prs-cabecalho" aria-hidden="true">
        <span />
        <span>{t("turmas.prs.prs")}</span>
        <span>{t("turmas.prs.issues")}</span>
      </div>
      <ul className="tur-prs">
        {grupos.map((g) => {
          if (!temDados(g) || !g.prs) {
            return (
              <li key={g.id} className="tur-prs-linha sem-dados">
                <NomeDoGrupo g={g} />
                {temDados(g) ? <span className="tur-semdados">{t("turmas.prs.semApi")}</span> : <SemDados g={g} />}
              </li>
            );
          }
          const partes = partesDePrs(g, t);
          return (
            <li key={g.id} className="tur-prs-linha">
              <NomeDoGrupo g={g} />
              <Contagem partes={partes.prs} maximo={maxPrs} f={f} />
              <Contagem partes={partes.issues} maximo={maxIssues} f={f} />
            </li>
          );
        })}
      </ul>
      <p className="tur-nota">{t("turmas.prs.nota")}</p>
    </>
  );
}

/* ---------------------------------------------------------------------
   turmas --projetos
   --------------------------------------------------------------------- */

function Links({ g }) {
  const { t } = useTranslation();
  return (
    <p className="tur-links">
      <a href={g.url} target="_blank" rel="noopener noreferrer">
        {t("turmas.projetos.repositorio")}
        <FiExternalLink aria-hidden="true" />
      </a>
      {g.deploy && (
        <a href={g.deploy} target="_blank" rel="noopener noreferrer">
          {t("turmas.projetos.deploy")}
          <FiExternalLink aria-hidden="true" />
        </a>
      )}
    </p>
  );
}

function Stack({ g }) {
  if (!g.stack?.length) return null;
  return (
    <ul className="tur-tags">
      {g.stack.map((item) => (
        <li key={item}>{item}</li>
      ))}
    </ul>
  );
}

function metaDoProjeto(g, t, f) {
  return [
    g.integrantes && t("turmas.projetos.integrantes", { count: g.integrantes }),
    t("turmas.commits", { count: g.commits, valor: f.n(g.commits) }),
    t("turmas.linhas", { count: g.codigo.linhas, valor: f.compacto(g.codigo.linhas) }),
    g.docs > 0 && t("turmas.projetos.docs", { valor: f.compacto(g.docs) }),
    g.branches && t("turmas.projetos.branches", { count: g.branches }),
  ].filter(Boolean);
}

// O título do README só aparece quando diz algo além do nome do grupo
const tituloExtra = (g) =>
  g.titulo && slugDoGrupo(g.titulo) !== slugDoGrupo(g.nome) ? g.titulo : null;

function CardDoProjeto({ g, f }) {
  const { t } = useTranslation();
  return (
    <li className="tur-projeto" style={estiloCampus(g.campus)}>
      <header className="tur-projeto-cabecalho">
        <NomeDoGrupo g={g} />
        {tituloExtra(g) && <span className="tur-projeto-titulo">{tituloExtra(g)}</span>}
      </header>
      {temDados(g) ? (
        <>
          <p className={g.descricao ? "tur-projeto-descricao" : "tur-projeto-descricao vazia"}>
            {g.descricao ?? t("turmas.projetos.semDescricao")}
          </p>
          <Stack g={g} />
          <p className="tur-projeto-meta">{metaDoProjeto(g, t, f).join(" · ")}</p>
        </>
      ) : (
        <SemDados g={g} />
      )}
      <Links g={g} />
    </li>
  );
}

function SecaoProjetos({ grupos, f }) {
  return (
    <ul className="tur-projetos">
      {grupos.map((g) => (
        <CardDoProjeto key={g.id} g={g} f={f} />
      ))}
    </ul>
  );
}

/* ---------------------------------------------------------------------
   turmas <grupo>: ficha de um grupo só
   --------------------------------------------------------------------- */

function Ficha({ g, f }) {
  const { t } = useTranslation();
  const titulo = (
    <header className="tur-ficha-cabecalho" style={estiloCampus(g.campus)}>
      <NomeDoGrupo g={g} />
      <span className="tur-ficha-sub">
        {[t(`cal.disciplinas.${g.disciplina}`), t(`cal.campi.${g.campus}`), tituloExtra(g)]
          .filter(Boolean)
          .join(" · ")}
      </span>
    </header>
  );
  if (!temDados(g)) {
    return (
      <div className="tur-ficha">
        {titulo}
        <p className="tur-resumo">
          <SemDados g={g} /> — {t("turmas.semDadosDica")}
        </p>
        <Links g={g} />
      </div>
    );
  }

  const dias = diasSemCommit(g, turmasInfo);
  const paleta = paletaDos([g]);
  const porNome = new Map(g.codigo.linguagens);
  const resto = g.codigo.linhas - sum(paleta.principais.map((nome) => porNome.get(nome)));
  const tamanho = Math.max(g.integrantes ?? 0, g.autores.length);
  const kpis = [
    { chave: "commits", Icone: FiGitCommit, valor: f.n(g.commits) },
    { chave: "linhas", Icone: FiCode, valor: f.compacto(g.codigo.linhas), titulo: f.n(g.codigo.linhas) },
    g.prs && { chave: "prs", Icone: FiGitPullRequest, valor: f.n(g.prs.mergeados) },
    g.issues && { chave: "issues", Icone: GoIssueClosed, valor: f.n(g.issues.fechadas) },
    {
      chave: "integrantes",
      Icone: FiUsers,
      valor: g.integrantes ? `${g.autores.length}/${g.integrantes}` : f.n(g.autores.length),
    },
    { chave: "ultimo", Icone: FiClock, valor: quando(t, dias), alerta: dias !== null && dias > LIMITES.diasParado },
  ]
    .filter(Boolean)
    .map((kpi) => ({ ...kpi, rotulo: t(`turmas.kpis.${kpi.chave}`, { dias: LIMITES.diasParado }) }));

  return (
    <div className="tur-ficha">
      {titulo}
      {g.descricao && <p className="tur-projeto-descricao">{g.descricao}</p>}
      <Stack g={g} />
      <Kpis itens={kpis} colunas={kpis.length <= 4 ? kpis.length : 3} />
      <Alertas g={g} f={f} />

      <h5 className="tur-secao-titulo">{t("turmas.secoes.linguagens")}</h5>
      <div className="tur-turma-pilha">
        <Pilha partes={partesDeLinguagem(g, paleta, f, t)} />
      </div>
      <Legenda
        itens={legendaDeLinguagens(paleta, t, (nome) => f.n(nome ? porNome.get(nome) : resto))}
      />

      <h5 className="tur-secao-titulo">{t("turmas.secoes.ritmo")}</h5>
      <Semanas valores={g.semanas} f={f} />

      {g.commits > 0 && (
        <>
          <h5 className="tur-secao-titulo">{t("turmas.secoes.equilibrio")}</h5>
          <div className="tur-ficha-fatias">
            <Fatias rotulo={t("turmas.equilibrio.commits")} fatias={g.autores.map((a) => a.c)} tamanho={tamanho} f={f} />
            <Fatias rotulo={t("turmas.equilibrio.linhas")} fatias={g.autores.map((a) => a.l)} tamanho={tamanho} f={f} />
            <Fantasmas quantos={tamanho - g.autores.length} />
          </div>
          <p className="tur-nota tur-nota-esquerda">
            {g.autores
              .map((a, i) => `${t("turmas.equilibrio.integrante", { n: i + 1 })}: ${f.pct(a.c)} / ${f.pct(a.l)}`)
              .join(" · ")}
          </p>
        </>
      )}

      {g.prs && (
        <>
          <h5 className="tur-secao-titulo">{t("turmas.secoes.prs")}</h5>
          <div className="tur-ficha-prs">
            <span>{t("turmas.tabela.prs")}</span>
            <Contagem partes={partesDePrs(g, t).prs} maximo={1} f={f} />
            <span>{t("turmas.prs.issues")}</span>
            <Contagem partes={partesDePrs(g, t).issues} maximo={1} f={f} />
          </div>
        </>
      )}

      <p className="tur-projeto-meta">{metaDoProjeto(g, t, f).join(" · ")}</p>
      <Links g={g} />
    </div>
  );
}

/* ---------------------------------------------------------------------
   Moldura: título, um bloco por disciplina e rodapé "Gráficos:"
   --------------------------------------------------------------------- */

const SECTION_VIEWS = {
  resumo: SecaoResumo,
  codigo: SecaoCodigo,
  linguagens: SecaoLinguagens,
  ritmo: SecaoRitmo,
  equilibrio: SecaoEquilibrio,
  prs: SecaoPrs,
  projetos: SecaoProjetos,
};

function Disciplina({ disciplina, grupos, sections, f }) {
  const { t } = useTranslation();
  // Na mesma ordem dos grupos: a da lista em turmasRepos.js
  const campi = [...new Set(TODOS_OS_GRUPOS.map((g) => g.campus))].filter((campus) =>
    grupos.some((g) => g.campus === campus)
  );
  const material = DISCIPLINAS_TI[disciplina]?.material;
  return (
    <section className="tur-disciplina">
      <header className="tur-disciplina-cabecalho">
        <h4>{t(`cal.disciplinas.${disciplina}`)}</h4>
        <p>
          {t("turmas.grupos", { count: grupos.length })}
          {campi.map((campus) => (
            <span key={campus} className="tur-disciplina-campus" style={estiloCampus(campus)}>
              <b className="tur-campus">{CAMPI[campus]?.sigla}</b> {t(`cal.campi.${campus}`)}
            </span>
          ))}
          {material && (
            <a href={material} target="_blank" rel="noopener noreferrer">
              {t("turmas.material")}
              <FiExternalLink aria-hidden="true" />
            </a>
          )}
        </p>
      </header>
      {sections.map((key) => {
        const View = SECTION_VIEWS[key];
        return (
          <div key={key} className="tur-secao">
            {sections.length > 1 && <h5 className="tur-secao-titulo">{t(`turmas.secoes.${key}`)}</h5>}
            <View grupos={grupos} f={f} />
          </div>
        );
      })}
    </section>
  );
}

// "TI:V · Coreu · G1" para o filtro digitado
function textoDoFiltro(filtros, t) {
  const nomes = TODOS_OS_GRUPOS.filter((g) => filtros.ids.includes(g.id)).map((g) => g.nome);
  return [
    ...filtros.disciplinas.map((d) => DISCIPLINAS[d]?.sigla ?? d),
    ...filtros.campi.map((c) => t(`cal.campi.${c}`)),
    ...filtros.numeros,
    ...nomes,
  ].join(" · ");
}

export default function Turmas({ section = DEFAULT_SECTION, explicit = false, filtros }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const panelRef = useRef(null);
  const vazio = { disciplinas: [], campi: [], numeros: [], ids: [] };
  const grupos = ordenarPorCampusELinhas(
    aplicarFiltros(TODOS_OS_GRUPOS, filtros ?? vazio),
    TODOS_OS_GRUPOS
  );
  const view = grupos.length === 1 && !explicit ? GROUP_SECTION : section;
  const sections = section === ALL_SECTIONS ? SECTIONS : [section];
  const disciplinas = (turmasInfo.disciplinas ?? Object.keys(DISCIPLINAS_TI)).filter((d) =>
    grupos.some((g) => g.disciplina === d)
  );
  const filtro = filtros ? textoDoFiltro(filtros, t) : "";
  const semDados = grupos.filter((g) => !temDados(g)).length;

  // Na primeira vez o código chega depois do comando (App.jsx usa lazy):
  // se a saída ainda é a última do terminal, leva o comando para o topo
  useEffect(() => {
    if (isLastTerminalOutput(panelRef.current)) scrollLastCommandToTop();
  }, []);

  return (
    <div className="tur-painel" ref={panelRef}>
      <h3 className="tur-titulo">{t("turmas.titulo")}</h3>
      <p className="tur-subtitulo">
        {t("turmas.subtitulo", {
          semestre: turmasInfo.semestre.split("-")[1],
          ano: turmasInfo.semestre.split("-")[0],
          semana: semanasDe(turmasInfo),
          data: f.data(turmasInfo.geradoEm),
        })}
      </p>
      {filtro && <p className="tur-filtro">{t("turmas.filtro", { texto: filtro })}</p>}

      {/* Só no npm run dev: lembra que os dados vêm do npm run turmas */}
      {import.meta.env.DEV && semDados > 0 && (
        <p className="tur-aviso-dev" role="note">
          <FiAlertTriangle aria-hidden="true" />
          <span>{t("turmas.pendentes", { count: semDados })}</span>
        </p>
      )}

      {grupos.length === 0 && <p className="tur-resumo">{t("turmas.nenhum")}</p>}
      {view === GROUP_SECTION ? (
        <Ficha g={grupos[0]} f={f} />
      ) : (
        disciplinas.map((disciplina) => (
          <Disciplina
            key={disciplina}
            disciplina={disciplina}
            grupos={grupos.filter((g) => g.disciplina === disciplina)}
            sections={sections}
            f={f}
          />
        ))
      )}

      <SkinsFooter skins={SECTION_OPTIONS} active={view === GROUP_SECTION ? null : section} namespace="turmas" />
    </div>
  );
}
