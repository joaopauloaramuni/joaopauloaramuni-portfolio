// Cálculos da docência, usados pelo "lattes --docencia" (LattesDocencia.jsx)
// e pelo card de docência e pelas tabelas do "lattes --resumo" (Lattes.jsx).
// Os dados vêm do docenciaData.js (mantido à mão).
//
// Todo período vira um conjunto de meses (índice = ano × 12 + mês − 1):
// o semestre 1 ocupa jan–jun e o 2, jul–dez, então um semestre = 6 meses.
// Assim o tempo de uma instituição ou de um curso é a UNIÃO dos meses das
// disciplinas: dois semestres com disciplinas simultâneas contam uma vez só.
//
// A cor de cada instituição vem do theme.css (--docencia-<id>), passada
// via style inline como --serie, igual às cores dos tipos de produção.
//
// Na Trybe, depois dos meses lecionando vieram cargos de coordenação e
// liderança (os "cargos" do docenciaData.js). Eles contam no tempo TOTAL da
// instituição e aparecem vazados (só o contorno) na linha do tempo e nas
// barras; o tempo LECIONANDO continua sendo só o das disciplinas.

import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { cargos, disciplinas, instituicoes } from "../data/docenciaData";

export const corStyle = (id) => ({ "--serie": `var(--docencia-${id})` });

const semestreIndex = (s) => {
  const [ano, sem] = s.split(".").map(Number);
  return ano * 2 + (sem - 1);
};
const mesIndex = (iso) => {
  const [ano, mes] = iso.split("-").map(Number);
  return ano * 12 + (mes - 1);
};

function mesesDe(disciplina) {
  const meses = new Set();
  if (disciplina.meses) {
    const [inicio, fim] = disciplina.meses.map(mesIndex);
    for (let m = inicio; m <= fim; m++) meses.add(m);
  } else {
    for (const s of disciplina.semestres) {
      const inicio = semestreIndex(s) * 6;
      for (let m = inicio; m < inicio + 6; m++) meses.add(m);
    }
  }
  return meses;
}

export const uniao = (conjuntos) => {
  const todos = new Set();
  for (const conjunto of conjuntos) for (const m of conjunto) todos.add(m);
  return todos;
};

// Índices consecutivos viram trechos: [3, 4, 5, 9] → [[3, 5], [9, 9]]
export function trechos(indices) {
  const ordenados = [...indices].sort((a, b) => a - b);
  const lista = [];
  for (const i of ordenados) {
    const ultimo = lista[lista.length - 1];
    if (ultimo && i === ultimo[1] + 1) ultimo[1] = i;
    else lista.push([i, i]);
  }
  return lista;
}

// Cada disciplina com seus meses, o total e o último mês (desempate)
export const ITENS = disciplinas.map((disciplina, ordem) => {
  const meses = mesesDe(disciplina);
  return {
    ...disciplina,
    key: `${disciplina.instituicao}-${disciplina.id}`,
    ordem,
    mesesSet: meses,
    total: meses.size,
    inicio: Math.min(...meses),
    fim: Math.max(...meses),
  };
});

// Cargos (Trybe), com os meses de cada um como no LinkedIn
const CARGOS = cargos.map((cargo, ordem) => {
  const meses = mesesDe(cargo);
  return { ...cargo, ordem, mesesSet: meses, total: meses.size };
});

export const INSTITUICOES = instituicoes.map((instituicao) => {
  const itens = ITENS.filter((item) => item.instituicao === instituicao.id);
  const meses = uniao(itens.map((item) => item.mesesSet));
  const cargosDaInstituicao = CARGOS.filter((cargo) => cargo.instituicao === instituicao.id);
  const mesesTotais = uniao([meses, ...cargosDaInstituicao.map((cargo) => cargo.mesesSet)]);

  // Faixas fora de sala de aula: cada cargo sem os meses já desenhados antes
  // (aulas e cargos anteriores), para os trechos ficarem lado a lado
  const desenhados = new Set(meses);
  const faixasDeCargo = [];
  for (const cargo of cargosDaInstituicao.filter((c) => !c.lecionando)) {
    const proprios = [...cargo.mesesSet].filter((m) => !desenhados.has(m));
    proprios.forEach((m) => desenhados.add(m));
    trechos(proprios).forEach((par) => faixasDeCargo.push({ cargo, par }));
  }

  return {
    ...instituicao,
    itens,
    meses,
    total: meses.size, // lecionando
    cargos: cargosDaInstituicao,
    faixasDeCargo,
    mesesTotais,
    totalGeral: mesesTotais.size, // lecionando + cargos
    temCargos: faixasDeCargo.length > 0,
    // Curso livre (Trybe): período em meses e quantidade de turmas, sem semestres
    porMes: itens.every((item) => item.meses),
    porTurma: itens.every((item) => item.turmas),
  };
});

// Um curso pode aparecer em várias instituições (Ciência da Computação está
// em três): o tempo é a união dos meses e as siglas vão embaixo do nome.
// "(Bootcamp)", "(curso livre)": só quando todas as disciplinas do curso têm
// a mesma modalidade (Sistemas de Informação junta presencial e EaD).
export const CURSOS = [...new Set(ITENS.flatMap((item) => item.cursos))]
  .map((id) => {
    const itens = ITENS.filter((item) => item.cursos.includes(id));
    const siglas = INSTITUICOES.filter((inst) =>
      itens.some((item) => item.instituicao === inst.id)
    ).map((inst) => inst.sigla);
    const modalidades = new Set(itens.map((item) => item.modalidade));
    const modalidade = modalidades.size === 1 ? [...modalidades][0] : undefined;
    return { id, modalidade, siglas, itens, total: uniao(itens.map((item) => item.mesesSet)).size };
  })
  .sort((a, b) => b.total - a.total);

export const TODOS_OS_MESES = uniao(ITENS.map((item) => item.mesesSet));
// Lecionando + cargos: o tempo total na educação e o alcance do eixo
export const MESES_NA_EDUCACAO = uniao([TODOS_OS_MESES, ...CARGOS.map((cargo) => cargo.mesesSet)]);
export const HA_CARGOS = INSTITUICOES.some((inst) => inst.temCargos);
export const PRIMEIRO_ANO = Math.floor(Math.min(...MESES_NA_EDUCACAO) / 12);
const ULTIMO_ANO = Math.floor(Math.max(...MESES_NA_EDUCACAO) / 12);
export const ANOS = Array.from({ length: ULTIMO_ANO - PRIMEIRO_ANO + 1 }, (_, i) => PRIMEIRO_ANO + i);
export const EIXO_INICIO = PRIMEIRO_ANO * 12;
export const EIXO_MESES = ANOS.length * 12;

const maiorTempoPrimeiro = (a, b) => b.total - a.total || b.fim - a.fim || a.ordem - b.ordem;

// Disciplinas de uma instituição agrupadas por curso: primeiro o curso em que
// lecionei por mais tempo (na PUC, Engenharia de Software antes de Ciência
// da Computação) e, dentro dele, da disciplina mais longa para a mais curta
export function ordenarPorCurso(itens, nomeDoCurso, locale) {
  const tempoDoCurso = new Map();
  for (const item of itens) {
    const curso = nomeDoCurso(item);
    tempoDoCurso.set(curso, uniao([tempoDoCurso.get(curso) ?? [], item.mesesSet]));
  }
  return [...itens].sort((a, b) => {
    const ca = nomeDoCurso(a);
    const cb = nomeDoCurso(b);
    return (
      tempoDoCurso.get(cb).size - tempoDoCurso.get(ca).size ||
      ca.localeCompare(cb, locale) ||
      maiorTempoPrimeiro(a, b)
    );
  });
}

/* ---------- Formatação (tempo, período e nomes) no idioma atual ---------- */

export function useDocencia() {
  const { t, i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";

  return useMemo(() => {
    const listFormat = new Intl.ListFormat(locale, { type: "conjunction" });
    const mesFormat = new Intl.DateTimeFormat(locale, { month: "short" });
    const nomeDoMes = (indice) =>
      mesFormat.format(new Date(Math.floor(indice / 12), indice % 12, 1)).replace(".", "");
    const semestre = (indiceDoMes) =>
      `${Math.floor(indiceDoMes / 12)}/${indiceDoMes % 12 < 6 ? 1 : 2}`;

    // 6 → "6 meses", 18 → "1 ano e meio", 70 → "5 anos e 10 meses"
    const tempo = (meses) => {
      const anos = Math.floor(meses / 12);
      const resto = meses % 12;
      if (anos === 0) return t("lattes.docencia.tempo.meses", { count: resto });
      if (resto === 0) return t("lattes.docencia.tempo.anos", { count: anos });
      if (resto === 6) return t("lattes.docencia.tempo.meio", { count: anos, valor: anos + 0.5 });
      return t("lattes.docencia.tempo.composto", {
        anos: t("lattes.docencia.tempo.anos", { count: anos }),
        meses: t("lattes.docencia.tempo.meses", { count: resto }),
      });
    };

    // Um trecho de meses: "2016/1 – 2020/1" ou, na Trybe, "mar – out 2020"
    const trecho = ([inicio, fim], porMes) => {
      if (porMes) {
        const anoInicio = Math.floor(inicio / 12);
        const anoFim = Math.floor(fim / 12);
        return anoInicio === anoFim
          ? `${nomeDoMes(inicio)} – ${nomeDoMes(fim)} ${anoFim}`
          : `${nomeDoMes(inicio)} ${anoInicio} – ${nomeDoMes(fim)} ${anoFim}`;
      }
      const a = semestre(inicio);
      const b = semestre(fim);
      return a === b ? a : `${a} – ${b}`;
    };

    // Período de uma disciplina ou instituição: "2018/1 e 2019/1"
    const periodo = (meses, porMes) =>
      listFormat.format(trechos(meses).map((par) => trecho(par, porMes)));
    // O mesmo, em pedaços: cada trecho vira um <span> que não quebra linha
    const periodoPartes = (meses, porMes) =>
      listFormat.formatToParts(trechos(meses).map((par) => trecho(par, porMes)));

    // "Sistemas de Informação EaD", "Arquitetura de Software (Bootcamp)"...
    const curso = (id, modalidade) => {
      const nome = t(`lattes.cursos.${id}`);
      return modalidade ? t(`lattes.docencia.modalidades.${modalidade}`, { curso: nome }) : nome;
    };
    const cursos = (item) => listFormat.format(item.cursos.map((id) => curso(id, item.modalidade)));
    // "Módulo Ciência da Computação com Python" (Trybe)
    const modulo = (item) =>
      item.modulo
        ? t("lattes.docencia.modulo", { nome: t(`lattes.docencia.modulos.${item.modulo}`) })
        : null;

    // Nome em português no docenciaData.js; a tradução, quando existe, fica em
    // lattes.docencia.disciplinas.<id>. Busca só no idioma atual: o fallback
    // do i18n (inglês) não pode trocar o nome em português.
    const traducao = (chave, padrao) =>
      i18n.getResource(i18n.resolvedLanguage ?? i18n.language, "translation", chave) ?? padrao;
    const disciplina = (item) => traducao(`lattes.docencia.disciplinas.${item.id}`, item.nome);
    const cargo = (item) => traducao(`lattes.docencia.cargos.${item.id}`, item.nome);
    const lecionando = (meses) => t("lattes.docencia.lecionando", { tempo: tempo(meses) });

    return {
      locale,
      tempo,
      trecho,
      periodo,
      periodoPartes,
      curso,
      cursos,
      modulo,
      disciplina,
      cargo,
      lecionando,
      lista: (itens) => listFormat.format(itens),
    };
  }, [t, i18n, locale]);
}
