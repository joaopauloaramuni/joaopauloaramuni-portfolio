import React, { useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import {
  FaChalkboardTeacher,
  FaDownload,
  FaFilePdf,
  FaLaptopCode,
  FaRocket,
  FaUserGraduate,
} from "react-icons/fa";
import { FiArrowUpRight, FiExternalLink } from "react-icons/fi";
import {
  lattesInfo,
  tccs,
  interdisciplinares,
  agencia,
  bancas,
} from "../data/lattesData";
import {
  ALL_SECTIONS,
  DEFAULT_SECTION,
  PDF_SECTION,
  SECTIONS,
  SECTION_OPTIONS,
} from "../data/lattesSections";
import {
  isLastTerminalOutput,
  scrollLastCommandToTop,
} from "../terminal/terminalDom";
import SkinsFooter from "./SkinsFooter";
import LattesDocencia from "./LattesDocencia";
import "./Lattes.css";

// Os quatro tipos de produção. A cor de cada um vem do theme.css
// (--lattes-tccs, --lattes-interdisciplinares, --lattes-aes, --lattes-bancas)
// e é a mesma no gráfico, nos cards do resumo e na marca lateral das listas.
const SERIES = [
  { key: "tccs", items: tccs, Icon: FaUserGraduate },
  { key: "interdisciplinares", items: interdisciplinares, Icon: FaLaptopCode },
  { key: "aes", items: agencia, Icon: FaRocket },
  { key: "bancas", items: bancas, Icon: FaChalkboardTeacher },
];

// Os projetos da AES reúnem alunos de vários cursos: ficam fora da tabela por curso
const SERIES_COM_CURSO = SERIES.filter(({ key }) => key !== "aes");

// Projetos com equipe e tecnologias (cards e ranking de tecnologias)
const PROJETOS = [...interdisciplinares, ...agencia];
const TOP_TECNOLOGIAS = 10;

const serieStyle = (key) => ({ "--serie": `var(--lattes-${key})` });
const sum = (values) => values.reduce((total, n) => total + n, 0);

// Nome do arquivo baixado: "Curriculo-Lattes-Joao-Paulo-Carneiro-Aramuni.pdf"
const pdfFileName = () =>
  `Curriculo-Lattes-${lattesInfo.nome
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z0-9]+/g, "-")}.pdf`;

// "http://lattes.cnpq.br/123" → "lattes.cnpq.br/123"
const shortUrl = (url) => url.replace(/^https?:\/\//, "");

// Agrupa uma lista já ordenada, mantendo a ordem dos grupos
function groupBy(items, keyOf) {
  const groups = new Map();
  for (const item of items) {
    const key = keyOf(item);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(item);
  }
  return [...groups];
}

const yearsOf = (items) => items.map((item) => item.ano).filter(Boolean);
const periodOf = (items) => {
  const years = yearsOf(items);
  return years.length
    ? { inicio: Math.min(...years), fim: Math.max(...years) }
    : { inicio: "", fim: "" };
};

// Formatação de data e tamanho no idioma atual
function useFormatters() {
  const { i18n } = useTranslation();
  const locale = i18n.language.startsWith("en") ? "en-US" : "pt-BR";
  return useMemo(() => {
    const dateFormat = new Intl.DateTimeFormat(locale, {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const sizeFormat = new Intl.NumberFormat(locale, { maximumFractionDigits: 1 });
    const listFormat = new Intl.ListFormat(locale, { type: "conjunction" });
    return {
      // ["Ana", "Bruno"] → "Ana e Bruno" / "Ana and Bruno"
      list: (items) => listFormat.format(items),
      date: (iso) => {
        if (!iso) return "";
        const [y, m, d] = iso.split("-").map(Number);
        return dateFormat.format(new Date(y, m - 1, d));
      },
      size: (bytes) => `${sizeFormat.format(bytes / 1024 / 1024)} MB`,
    };
  }, [locale]);
}

/* ---------- Pedaços em comum ---------- */

// Curso traduzido quando a chave existe; senão, o nome como está no Lattes
function useCourse() {
  const { t } = useTranslation();
  return (item) =>
    item.cursoId ? t(`lattes.cursos.${item.cursoId}`, { defaultValue: item.curso }) : null;
}

function Meta({ parts }) {
  const visible = parts.filter(Boolean);
  return (
    <p className="lattes-item-meta">
      {visible.map((part, i) => (
        <React.Fragment key={i}>
          {i > 0 && <span className="lattes-sep" aria-hidden="true"> · </span>}
          <span>{part}</span>
        </React.Fragment>
      ))}
    </p>
  );
}

function ExternalLink({ href, label }) {
  if (!href) return null;
  return (
    <a
      className="lattes-link"
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      title={label}
    >
      <FiExternalLink aria-hidden="true" />
    </a>
  );
}

function GroupTitle({ title, detail }) {
  return (
    <h5 className="lattes-grupo-titulo">
      <span>{title}</span>
      <span className="lattes-grupo-qtd">{detail}</span>
    </h5>
  );
}

/* ---------- lattes / lattes --resumo ---------- */

// "206 trabalhos orientados ou avaliados desde 2017"
function Total() {
  const { t } = useTranslation();
  const total = sum(SERIES.map(({ items }) => items.length));
  const { inicio } = periodOf(SERIES.flatMap(({ items }) => items));
  return (
    <p className="lattes-total">
      <strong>{total}</strong> {t("lattes.total", { count: total, inicio })}
    </p>
  );
}

function Kpis() {
  const { t } = useTranslation();
  const disciplinas = new Set(interdisciplinares.map((ti) => ti.disciplina.numero));
  const cursosTis = new Set(interdisciplinares.map((ti) => ti.cursoId).filter(Boolean));
  const niveis = groupBy(bancas, (banca) => banca.nivel);
  const alunos = sum(tccs.map((tcc) => tcc.alunos.length));
  const parcerias = agencia.filter((projeto) => projeto.parceiro).length;

  const details = {
    tccs: [
      t("lattes.kpi.periodo", periodOf(tccs)),
      t("lattes.kpi.alunos", { count: alunos }),
    ],
    interdisciplinares: [
      t("lattes.kpi.disciplinas", { count: disciplinas.size }),
      cursosTis.size > 0 && t("lattes.kpi.cursos", { count: cursosTis.size }),
    ],
    aes: [
      t("lattes.kpi.periodo", periodOf(agencia)),
      parcerias > 0 && t("lattes.kpi.parcerias", { count: parcerias }),
    ],
    bancas: niveis.map(([nivel, items]) =>
      t(`lattes.niveis_contagem.${nivel}`, { count: items.length })
    ),
  };

  return (
    <ul className="lattes-kpis">
      {SERIES.map((serie) => {
        const { key, items } = serie;
        const Icon = serie.Icon;
        return (
          <li key={key} className="lattes-kpi" style={serieStyle(key)}>
            <Icon className="lattes-kpi-icone" aria-hidden="true" />
            <span className="lattes-kpi-valor">{items.length}</span>
            <span className="lattes-kpi-rotulo">{t(`lattes.tipos.${key}`)}</span>
            <span className="lattes-kpi-detalhe">{details[key].filter(Boolean).join(" · ")}</span>
            {/* Quebra só entre "lattes" e a opção, nunca no meio dela */}
            <code className="lattes-kpi-cmd">
              <span>lattes</span> <span>--{t(`lattes.skins.${key}`)}</span>
            </code>
          </li>
        );
      })}
    </ul>
  );
}

// Barras empilhadas por ano, do mais recente para o mais antigo. Os anos
// sem nada (2021–2023) ficam no gráfico para o intervalo não sumir.
function PorAno() {
  const { t } = useTranslation();
  const rows = useMemo(() => {
    const years = SERIES.flatMap(({ items }) => yearsOf(items));
    if (!years.length) return [];
    const rows = [];
    for (let ano = Math.max(...years); ano >= Math.min(...years); ano--) {
      const counts = Object.fromEntries(
        SERIES.map(({ key, items }) => [key, items.filter((item) => item.ano === ano).length])
      );
      const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
      rows.push({ ano, counts, total });
    }
    return rows;
  }, []);
  const max = Math.max(1, ...rows.map((row) => row.total));

  return (
    <>
      <ul className="lattes-legenda" aria-hidden="true">
        {SERIES.map(({ key }) => (
          <li key={key} style={serieStyle(key)}>
            <span className="lattes-legenda-cor" />
            {t(`lattes.legenda.${key}`)}
          </li>
        ))}
      </ul>
      <ol className="lattes-anos">
        {rows.map(({ ano, counts, total }) => {
          const parts = SERIES.filter(({ key }) => counts[key] > 0).map(({ key }) =>
            t("lattes.grafico.parte", { valor: counts[key], tipo: t(`lattes.legenda.${key}`) })
          );
          return (
            <li
              key={ano}
              className="lattes-ano"
              aria-label={`${ano}: ${parts.join(", ") || t("lattes.grafico.nada")}`}
            >
              <span className="lattes-ano-label">{ano}</span>
              <span className="lattes-ano-barra">
                {SERIES.filter(({ key }) => counts[key] > 0).map(({ key }) => (
                  <span
                    key={key}
                    className="lattes-ano-seg"
                    style={{ ...serieStyle(key), flexBasis: `${(counts[key] / max) * 100}%` }}
                    data-tip={`${ano} · ${t(`lattes.legenda.${key}`)}: ${counts[key]}`}
                  />
                ))}
              </span>
              <span className="lattes-ano-total">{total || "—"}</span>
            </li>
          );
        })}
      </ol>
    </>
  );
}

// Conta os itens de cada tipo agrupados por uma chave (instituição, curso).
// Itens sem a informação caem na linha "", mostrada por último.
function countBy(series, keyOf) {
  const rows = new Map();
  for (const { key, items } of series) {
    for (const item of items) {
      const id = keyOf(item) ?? "";
      if (!rows.has(id)) {
        rows.set(id, {
          id,
          item,
          counts: Object.fromEntries(series.map((serie) => [serie.key, 0])),
          instituicoes: new Set(),
        });
      }
      const row = rows.get(id);
      row.counts[key]++;
      if (item.instituicao) row.instituicoes.add(item.instituicao);
    }
  }
  return [...rows.values()]
    .map((row) => ({ ...row, total: sum(Object.values(row.counts)) }))
    .sort((a, b) => (a.id ? 0 : 1) - (b.id ? 0 : 1) || b.total - a.total);
}

// Tabela linha × tipo (também é a versão em texto do gráfico)
function Tabela({ cabecalho, series, rows, nome, detalhe }) {
  const { t } = useTranslation();
  return (
    <div className="lattes-tabela-wrap">
      <table className="lattes-tabela">
        <thead>
          <tr>
            <th scope="col">{cabecalho}</th>
            {series.map(({ key }) => (
              <th key={key} scope="col">
                <span className="lattes-th-longo">{t(`lattes.legenda.${key}`)}</span>
                <abbr className="lattes-th-curto" title={t(`lattes.legenda.${key}`)}>
                  {t(`lattes.legenda_curta.${key}`)}
                </abbr>
              </th>
            ))}
            <th scope="col">{t("lattes.tabela.total")}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              <th scope="row">
                {nome(row)}
                {detalhe?.(row) && <span className="lattes-tabela-sub">{detalhe(row)}</span>}
              </th>
              {series.map(({ key }) => (
                <td key={key}>{row.counts[key] || "—"}</td>
              ))}
              <td className="lattes-tabela-total">{row.total}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PorInstituicao() {
  const { t } = useTranslation();
  const rows = useMemo(() => countBy(SERIES, (item) => item.instituicao), []);
  return (
    <Tabela
      cabecalho={t("lattes.tabela.instituicao")}
      series={SERIES}
      rows={rows}
      nome={(row) => row.id || t("lattes.sem_instituicao")}
    />
  );
}

// Ciência da Computação existe na FUMEC e na PUC: a linha junta as duas e
// mostra as instituições embaixo do nome
function PorCurso() {
  const { t } = useTranslation();
  const course = useCourse();
  const rows = useMemo(() => countBy(SERIES_COM_CURSO, (item) => item.cursoId), []);
  return (
    <>
      <Tabela
        cabecalho={t("lattes.tabela.curso")}
        series={SERIES_COM_CURSO}
        rows={rows}
        nome={(row) => (row.id ? course(row.item) : t("lattes.sem_curso"))}
        detalhe={(row) => [...row.instituicoes].sort().join(" · ")}
      />
      {agencia.length > 0 && <p className="lattes-tabela-nota">{t("lattes.nota_aes_curso")}</p>}
    </>
  );
}

// Ranking das tecnologias nos projetos (TIs e AES): uma série só, então as
// barras ficam em cor neutra, sem legenda
function Tecnologias() {
  const { t } = useTranslation();
  const rows = useMemo(() => {
    const counts = new Map();
    for (const projeto of PROJETOS) {
      for (const tech of new Set(projeto.tecnologias)) {
        counts.set(tech, (counts.get(tech) ?? 0) + 1);
      }
    }
    return [...counts]
      .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
      .slice(0, TOP_TECNOLOGIAS);
  }, []);
  if (!rows.length) return null;
  const max = rows[0][1];

  return (
    <>
      <p className="lattes-intro">{t("lattes.tecnologias.intro", { count: PROJETOS.length })}</p>
      <ol className="lattes-techs">
        {rows.map(([tech, count]) => (
          <li
            key={tech}
            className="lattes-tech"
            aria-label={t("lattes.tecnologias.item", { tech, count })}
          >
            <span className="lattes-tech-nome">{tech}</span>
            <span className="lattes-tech-barra">
              <span className="lattes-tech-fill" style={{ width: `${(count / max) * 100}%` }} />
            </span>
            <span className="lattes-tech-qtd">{count}</span>
          </li>
        ))}
      </ol>
    </>
  );
}

function Resumo() {
  const { t } = useTranslation();
  return (
    <>
      <Total />
      <Kpis />
      <h4 className="lattes-secao-titulo">{t("lattes.por_ano")}</h4>
      <PorAno />
      <h4 className="lattes-secao-titulo">{t("lattes.por_instituicao")}</h4>
      <PorInstituicao />
      <h4 className="lattes-secao-titulo">{t("lattes.por_curso")}</h4>
      <PorCurso />
      <h4 className="lattes-secao-titulo">{t("lattes.tecnologias.titulo")}</h4>
      <Tecnologias />
    </>
  );
}

/* ---------- lattes --tccs ---------- */

function Tccs() {
  const { t } = useTranslation();
  const f = useFormatters();
  const course = useCourse();
  const { inicio, fim } = periodOf(tccs);

  return (
    <>
      <p className="lattes-intro">
        {t("lattes.tccs.intro", { count: tccs.length, inicio, fim })}
      </p>
      {groupBy(tccs, (tcc) => tcc.ano).map(([ano, items]) => (
        <div key={ano} className="lattes-grupo">
          <GroupTitle title={ano} detail={t("lattes.tccs.qtd", { count: items.length })} />
          <ol className="lattes-itens" style={serieStyle("tccs")}>
            {items.map((tcc) => (
              <li key={tcc.titulo} className="lattes-item">
                <p className="lattes-item-titulo">
                  {tcc.titulo}
                  <ExternalLink href={tcc.link} label={t("lattes.ver_projeto")} />
                </p>
                <Meta parts={[f.list(tcc.alunos), tcc.instituicao, course(tcc)]} />
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}

/* ---------- lattes --tis (trabalhos interdisciplinares) ---------- */

// Card de projeto, usado pelos TIs e pelos projetos da AES
function ProjetoCard({ projeto, mostrarAno, extra }) {
  const { t } = useTranslation();
  return (
    <li className="lattes-card">
      <div className="lattes-card-topo">
        <span className="lattes-card-nome">{projeto.nome}</span>
        {mostrarAno && <span className="lattes-card-ano">{projeto.ano}</span>}
        <ExternalLink href={projeto.link} label={t("lattes.ver_projeto")} />
      </div>
      {extra}
      {projeto.descricao && <p className="lattes-card-desc">{projeto.descricao}</p>}
      {projeto.tecnologias.length > 0 && (
        <ul className="lattes-tags">
          {projeto.tecnologias.map((tech) => (
            <li key={tech}>{tech}</li>
          ))}
        </ul>
      )}
      {/* Aberto, mostra a descrição inteira (sem o corte de 3 linhas) e a equipe */}
      {(projeto.autores.length > 0 || projeto.descricao) && (
        <details className="lattes-equipe">
          <summary>
            {t("lattes.interdisciplinares.detalhes", { count: projeto.autores.length })}
          </summary>
          {projeto.autores.length > 0 && <p>{projeto.autores.join(", ")}</p>}
        </details>
      )}
    </li>
  );
}

function Interdisciplinares() {
  const { t } = useTranslation();
  const course = useCourse();
  // Uma disciplina por grupo, da mais avançada (V) para a primeira (I)
  const groups = useMemo(
    () =>
      groupBy(interdisciplinares, (ti) => ti.disciplina.numero).sort(
        ([a], [b]) => romanToNumber(b) - romanToNumber(a)
      ),
    []
  );

  return (
    <>
      <p className="lattes-intro">
        {t("lattes.interdisciplinares.intro", { count: interdisciplinares.length })}
      </p>
      {groups.map(([numero, items]) => {
        const { disciplina, instituicao } = items[0];
        const { inicio, fim } = periodOf(items);
        const period = inicio === fim ? inicio : `${inicio}–${fim}`;
        return (
          <div key={numero} className="lattes-grupo">
            <GroupTitle
              title={t("lattes.interdisciplinares.disciplina", {
                numero,
                nome: t(`lattes.disciplinas.${disciplina.id}`, { defaultValue: disciplina.nome }),
              })}
              detail={[
                instituicao,
                course(items[0]),
                period,
                t("lattes.interdisciplinares.qtd", { count: items.length }),
              ]
                .filter(Boolean)
                .join(" · ")}
            />
            <ul className="lattes-cards" style={serieStyle("interdisciplinares")}>
              {items.map((ti) => (
                // O ano só aparece quando a disciplina tem mais de um
                <ProjetoCard key={`${ti.ano}-${ti.nome}`} projeto={ti} mostrarAno={inicio !== fim} />
              ))}
            </ul>
          </div>
        );
      })}
    </>
  );
}

/* ---------- lattes --aes (Agência Experimental de Software) ---------- */

function Agencia() {
  const { t } = useTranslation();
  return (
    <>
      <p className="lattes-intro">{t("lattes.aes.intro", { count: agencia.length })}</p>
      {groupBy(agencia, (projeto) => projeto.ano).map(([ano, items]) => (
        <div key={ano} className="lattes-grupo">
          <GroupTitle title={ano} detail={t("lattes.aes.qtd", { count: items.length })} />
          <ul className="lattes-cards" style={serieStyle("aes")}>
            {items.map((projeto) => (
              <ProjetoCard
                key={projeto.nome}
                projeto={projeto}
                extra={
                  projeto.parceiro && (
                    <p className="lattes-card-parceiro">
                      {t("lattes.aes.parceiro", { nome: projeto.parceiro })}
                    </p>
                  )
                }
              />
            ))}
          </ul>
        </div>
      ))}
    </>
  );
}

const ROMAN = { I: 1, V: 5, X: 10 };
function romanToNumber(roman) {
  let total = 0;
  for (let i = 0; i < roman.length; i++) {
    const value = ROMAN[roman[i]] ?? 0;
    const next = ROMAN[roman[i + 1]] ?? 0;
    total += value < next ? -value : value;
  }
  return total;
}

/* ---------- lattes --bancas ---------- */

function Bancas() {
  const { t } = useTranslation();
  const course = useCourse();

  return (
    <>
      <p className="lattes-intro">{t("lattes.bancas.intro", { count: bancas.length })}</p>
      {groupBy(bancas, (banca) => banca.ano).map(([ano, items]) => (
        <div key={ano} className="lattes-grupo">
          <GroupTitle title={ano} detail={t("lattes.bancas.qtd", { count: items.length })} />
          <ol className="lattes-itens" style={serieStyle("bancas")}>
            {items.map((banca) => (
              <li key={`${banca.titulo}-${banca.candidato}`} className="lattes-item">
                <p className="lattes-item-titulo">
                  {banca.nivel !== "graduacao" && (
                    <span className="lattes-nivel">{t(`lattes.niveis.${banca.nivel}`)}</span>
                  )}
                  {banca.titulo}
                  <ExternalLink href={banca.link} label={t("lattes.ver_projeto")} />
                </p>
                <Meta parts={[banca.candidato, banca.instituicao, course(banca)]} />
                {banca.banca.length > 0 && (
                  <p className="lattes-item-banca">
                    {t("lattes.bancas.membros", { nomes: banca.banca.join(", ") })}
                  </p>
                )}
              </li>
            ))}
          </ol>
        </div>
      ))}
    </>
  );
}

/* ---------- lattes --pdf ---------- */

function Pdf() {
  const { t } = useTranslation();
  const f = useFormatters();
  const { pdf } = lattesInfo;

  if (!pdf) return <p className="lattes-vazio">{t("lattes.pdf.indisponivel")}</p>;

  const fileName = pdfFileName();
  const meta = [
    pdf.paginas && t("lattes.pdf.paginas", { count: pdf.paginas }),
    f.size(pdf.bytes),
    t("lattes.atualizado", { data: f.date(lattesInfo.atualizadoEm) }),
  ].filter(Boolean);

  return (
    <div className="lattes-pdf">
      <FaFilePdf className="lattes-pdf-icone" aria-hidden="true" />
      <div className="lattes-pdf-info">
        <p className="lattes-pdf-nome">{fileName}</p>
        <p className="lattes-pdf-meta">{meta.join(" · ")}</p>
        <p className="lattes-pdf-desc">{t("lattes.pdf.descricao")}</p>
        <div className="lattes-pdf-acoes">
          <a className="lattes-botao principal" href={pdf.arquivo} download={fileName}>
            <FaDownload aria-hidden="true" />
            {t("lattes.pdf.baixar")}
          </a>
          <a className="lattes-botao" href={pdf.arquivo} target="_blank" rel="noopener noreferrer">
            <FiExternalLink aria-hidden="true" />
            {t("lattes.pdf.abrir")}
          </a>
          <a className="lattes-botao" href={lattesInfo.url} target="_blank" rel="noopener noreferrer">
            <FiArrowUpRight aria-hidden="true" />
            {t("lattes.pdf.lattes")}
          </a>
        </div>
      </div>
    </div>
  );
}

/* ---------- Moldura ---------- */

const SECTION_VIEWS = {
  resumo: Resumo,
  docencia: LattesDocencia,
  tccs: Tccs,
  interdisciplinares: Interdisciplinares,
  aes: Agencia,
  bancas: Bancas,
};

export default function Lattes({ section = DEFAULT_SECTION }) {
  const { t } = useTranslation();
  const f = useFormatters();
  const isPdf = section === PDF_SECTION;
  const sections = section === ALL_SECTIONS ? SECTIONS : [section];
  // A docência tem os nomes traduzidos: a nota só vale para o que vem do Lattes
  const languageNote = section === "docencia" ? "" : t("lattes.nota_idioma");
  const panelRef = useRef(null);

  // Na primeira vez o código chega depois do comando (App.jsx usa lazy):
  // se a saída ainda é a última do terminal, leva o comando para o topo
  useEffect(() => {
    if (section !== PDF_SECTION && isLastTerminalOutput(panelRef.current)) {
      scrollLastCommandToTop();
    }
  }, [section]);

  return (
    <div className="lattes-painel" ref={panelRef}>
      <h3 className="lattes-titulo">{t("lattes.titulo")}</h3>
      <p className="lattes-subtitulo">
        <a href={lattesInfo.url} target="_blank" rel="noopener noreferrer">
          {shortUrl(lattesInfo.url)}
        </a>
        {lattesInfo.orcid && (
          <>
            {" · "}
            <a href={lattesInfo.orcid} target="_blank" rel="noopener noreferrer">
              ORCID
            </a>
          </>
        )}
        {lattesInfo.atualizadoEm && (
          <> · {t("lattes.atualizado", { data: f.date(lattesInfo.atualizadoEm) })}</>
        )}
      </p>

      {isPdf ? (
        <Pdf />
      ) : (
        sections.map((key) => {
          const View = SECTION_VIEWS[key];
          return (
            <section key={key} className="lattes-secao">
              {/* No --tudo o resumo abre sem título; as listas ganham o delas */}
              {sections.length > 1 && key !== DEFAULT_SECTION && (
                <h4 className="lattes-secao-titulo">{t(`lattes.secoes.${key}`)}</h4>
              )}
              <View />
            </section>
          );
        })
      )}

      {!isPdf && languageNote && <p className="lattes-nota">{languageNote}</p>}

      <SkinsFooter skins={SECTION_OPTIONS} active={section} namespace="lattes" />
    </div>
  );
}
