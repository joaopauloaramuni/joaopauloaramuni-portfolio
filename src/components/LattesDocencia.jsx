import React from "react";
import { useTranslation } from "react-i18next";
import { FiExternalLink } from "react-icons/fi";
import { GITHUB } from "../data/docenciaData";
import {
  ANOS,
  CURSOS,
  EIXO_INICIO,
  EIXO_MESES,
  HA_CARGOS,
  INSTITUICOES,
  ITENS,
  MESES_NA_EDUCACAO,
  PRIMEIRO_ANO,
  TODOS_OS_MESES,
  corStyle,
  ordenarPorCurso,
  trechos,
  useDocencia,
} from "../lib/docencia";

// Seção "lattes --docencia": o tempo que lecionei em cada instituição,
// curso e disciplina. Os cálculos (meses de cada disciplina, união por
// instituição e por curso, cargos da Trybe) e a formatação no idioma atual
// ficam no lib/docencia.js, que o card de docência do resumo também usa.

/* ---------- Pedaços em comum ---------- */

// Linha de barra horizontal: nome | barra | valor. Com `partes`, a barra é
// empilhada: [{ fracao }, { fracao, cargo: true }] = lecionando + cargos
function Barra({ nome, sub, valor, fracao, partes, cor, rotulo, dica }) {
  const fills = partes ?? [{ fracao }];
  return (
    <li className="docencia-barra" aria-label={rotulo} style={cor ? corStyle(cor) : undefined}>
      <span className="docencia-barra-nome" title={typeof nome === "string" ? nome : undefined}>
        <span className="docencia-barra-texto">{nome}</span>
        {sub && <span className="docencia-barra-sub">{sub}</span>}
      </span>
      <span className="docencia-barra-trilho">
        {fills.map((parte, i) => (
          <span
            key={i}
            className={["docencia-barra-fill", !cor && "neutra", parte.cargo && "cargo"]
              .filter(Boolean)
              .join(" ")}
            style={{ width: `${parte.fracao * 100}%` }}
            data-tip={i === fills.length - 1 ? dica : undefined}
          />
        ))}
      </span>
      <span className="docencia-barra-valor">{valor}</span>
    </li>
  );
}

// Legenda das duas formas de barra: cheia (lecionando) e vazada (cargos)
function LegendaAtividade() {
  const { t } = useTranslation();
  if (!HA_CARGOS) return null;
  return (
    <ul className="lattes-legenda">
      <li>
        <span className="docencia-amostra neutra" aria-hidden="true" />
        {t("lattes.docencia.legenda.aula")}
      </li>
      <li>
        <span className="docencia-amostra neutra cargo" aria-hidden="true" />
        {t("lattes.docencia.legenda.cargo")}
      </li>
    </ul>
  );
}

/* ---------- Total e cards por instituição ---------- */

function Total() {
  const { t } = useTranslation();
  const f = useDocencia();
  const cursos = new Set(ITENS.flatMap((item) => item.cursos));
  return (
    <p className="lattes-total">
      <strong>{f.tempo(TODOS_OS_MESES.size)}</strong>{" "}
      {t("lattes.docencia.total", {
        inicio: PRIMEIRO_ANO,
        disciplinas: t("lattes.kpi.disciplinas", { count: ITENS.length }),
        cursos: t("lattes.kpi.cursos", { count: cursos.size }),
        instituicoes: t("lattes.docencia.qtd_instituicoes", { count: INSTITUICOES.length }),
      })}
      {/* Com os cargos de coordenação e liderança, o tempo total na educação */}
      {MESES_NA_EDUCACAO.size > TODOS_OS_MESES.size && (
        <>
          {" "}
          {t("lattes.docencia.educacao_antes")} <strong>{f.tempo(MESES_NA_EDUCACAO.size)}</strong>{" "}
          {t("lattes.docencia.educacao_depois")}
        </>
      )}
    </p>
  );
}

function Cards() {
  const { t } = useTranslation();
  const f = useDocencia();
  return (
    <ul className="docencia-cards">
      {INSTITUICOES.map((instituicao) => (
        <li key={instituicao.id} className="docencia-card" style={corStyle(instituicao.id)}>
          {/* Tempo total na instituição (na Trybe, com os cargos) */}
          <span className="docencia-card-valor">{f.tempo(instituicao.totalGeral)}</span>
          <span className="docencia-card-nome">{instituicao.sigla}</span>
          <span className="docencia-card-detalhe">
            {[
              t("lattes.kpi.disciplinas", { count: instituicao.itens.length }),
              instituicao.temCargos && f.lecionando(instituicao.total),
              f.periodo(instituicao.mesesTotais, instituicao.porMes),
            ]
              .filter(Boolean)
              .join(" · ")}
          </span>
        </li>
      ))}
    </ul>
  );
}

/* ---------- Linha do tempo: uma faixa por instituição ---------- */

function LinhaDoTempo() {
  const { t } = useTranslation();
  const f = useDocencia();
  return (
    <div className="docencia-tempo" style={{ "--anos": ANOS.length }}>
      <LegendaAtividade />
      <ol className="docencia-faixas">
        {INSTITUICOES.map((instituicao) => {
          // Trechos lecionando (cheios) e, na Trybe, um trecho por cargo (vazado)
          const faixas = [
            ...trechos(instituicao.meses).map((par) => ({
              par,
              texto: [
                instituicao.temCargos && t("lattes.docencia.legenda.aula"),
                f.trecho(par, instituicao.porMes),
                f.tempo(par[1] - par[0] + 1),
              ],
            })),
            ...instituicao.faixasDeCargo.map(({ cargo, par }) => ({
              par,
              cargo: true,
              texto: [f.cargo(cargo), f.periodo(cargo.mesesSet, true)],
            })),
          ].map((faixa) => ({ ...faixa, texto: faixa.texto.filter(Boolean).join(" · ") }));
          return (
            <li
              key={instituicao.id}
              className="docencia-faixa"
              style={corStyle(instituicao.id)}
              aria-label={`${instituicao.sigla}: ${faixas.map((faixa) => faixa.texto).join("; ")}`}
            >
              <span className="docencia-faixa-nome">{instituicao.sigla}</span>
              <span className="docencia-faixa-trilho">
                {faixas.map(({ par: [inicio, fim], cargo, texto }) => (
                  <span
                    key={inicio}
                    className={cargo ? "docencia-faixa-seg cargo" : "docencia-faixa-seg"}
                    // 2px a menos na largura: trechos vizinhos (troca de cargo) ficam separados
                    style={{
                      left: `${((inicio - EIXO_INICIO) / EIXO_MESES) * 100}%`,
                      width: `calc(${((fim - inicio + 1) / EIXO_MESES) * 100}% - 2px)`,
                    }}
                    data-tip={`${instituicao.sigla} · ${texto}`}
                  />
                ))}
              </span>
            </li>
          );
        })}
      </ol>
      <div className="docencia-eixo" aria-hidden="true">
        <span />
        <span className="docencia-eixo-anos">
          {ANOS.map((ano) => (
            <span key={ano}>
              <span className="docencia-ano-longo">{ano}</span>
              <span className="docencia-ano-curto">’{String(ano).slice(2)}</span>
            </span>
          ))}
        </span>
      </div>
      <p className="lattes-tabela-nota">{t("lattes.docencia.nota_linha_do_tempo")}</p>
    </div>
  );
}

/* ---------- Barras: por instituição, por curso e por disciplina ---------- */

// Tempo total em cada instituição. Na Trybe a barra é empilhada: a parte
// cheia é o tempo lecionando e a vazada, o dos cargos de coordenação
function PorInstituicao() {
  const f = useDocencia();
  const rows = [...INSTITUICOES].sort((a, b) => b.totalGeral - a.totalGeral);
  const max = rows[0].totalGeral;
  return (
    <>
      <LegendaAtividade />
      <ol className="docencia-barras docencia-barras-sub">
        {rows.map((instituicao) => {
          const valor = f.tempo(instituicao.totalGeral);
          const lecionando = instituicao.temCargos ? f.lecionando(instituicao.total) : null;
          return (
            <Barra
              key={instituicao.id}
              nome={instituicao.sigla}
              sub={lecionando}
              valor={valor}
              partes={[
                { fracao: instituicao.total / max },
                ...(instituicao.temCargos
                  ? [{ fracao: (instituicao.totalGeral - instituicao.total) / max, cargo: true }]
                  : []),
              ]}
              cor={instituicao.id}
              rotulo={[`${instituicao.sigla}: ${valor}`, lecionando].filter(Boolean).join(", ")}
              dica={`${instituicao.sigla} · ${f.periodo(instituicao.mesesTotais, instituicao.porMes)}`}
            />
          );
        })}
      </ol>
    </>
  );
}

// Um curso pode aparecer em várias instituições (Ciência da Computação está
// em três): a barra é a união dos meses e as instituições vão embaixo.
// Uma série só, então a barra fica em cor neutra.
function PorCurso() {
  const { t } = useTranslation();
  const f = useDocencia();
  const rows = CURSOS;
  const max = rows[0].total;

  return (
    <>
      <ol className="docencia-barras docencia-barras-sub">
        {rows.map((row) => {
          const nome = f.curso(row.id, row.modalidade);
          const valor = f.tempo(row.total);
          return (
            <Barra
              key={row.id}
              nome={nome}
              sub={row.siglas.join(" · ")}
              valor={valor}
              fracao={row.total / max}
              rotulo={`${nome} (${row.siglas.join(", ")}): ${valor}`}
            />
          );
        })}
      </ol>
      <p className="lattes-tabela-nota">{t("lattes.docencia.nota_uniao")}</p>
    </>
  );
}

// Um bloco por instituição, separados por uma linha, na mesma ordem das
// tabelas (curso e tempo). A escala é a mesma em todos os blocos, então as
// barras continuam comparáveis entre instituições.
function PorDisciplina() {
  const { t } = useTranslation();
  const f = useDocencia();
  const max = Math.max(...ITENS.map((item) => item.total));

  return (
    <div className="docencia-blocos">
      {INSTITUICOES.map((instituicao) => (
        <section key={instituicao.id} className="docencia-bloco" style={corStyle(instituicao.id)}>
          <h5 className="docencia-bloco-titulo">
            <span className="lattes-legenda-cor" aria-hidden="true" />
            {instituicao.sigla}
            <span className="lattes-grupo-qtd">
              {instituicao.temCargos ? f.lecionando(instituicao.total) : f.tempo(instituicao.total)} ·{" "}
              {t("lattes.kpi.disciplinas", { count: instituicao.itens.length })}
            </span>
          </h5>
          <ol className="docencia-barras docencia-barras-disciplinas">
            {ordenarPorCurso(instituicao.itens, f.cursos, f.locale).map((item) => {
              const nome = f.disciplina(item);
              const valor = f.tempo(item.total);
              // O curso (e o módulo) e o período ficam escritos embaixo do nome;
              // o período não quebra no meio ("2023/2 – 2024/1")
              const curso = [f.cursos(item), f.modulo(item)].filter(Boolean).join(" · ");
              const periodo = f.periodo(item.mesesSet, instituicao.porMes);
              return (
                <Barra
                  key={item.key}
                  nome={nome}
                  sub={
                    <>
                      {curso} · <span className="docencia-trecho">{periodo}</span>
                    </>
                  }
                  valor={valor}
                  fracao={item.total / max}
                  cor={instituicao.id}
                  rotulo={`${nome} (${instituicao.sigla}, ${curso}, ${periodo}): ${valor}`}
                />
              );
            })}
          </ol>
        </section>
      ))}
    </div>
  );
}

/* ---------- Tabelas: uma por instituição ---------- */

function Tabelas() {
  const { t } = useTranslation();
  const f = useDocencia();

  return INSTITUICOES.map((instituicao) => {
    const rows = ordenarPorCurso(instituicao.itens, f.cursos, f.locale);
    const nota = t(`lattes.docencia.notas.${instituicao.id}`, { defaultValue: "" });
    const observacao = t(`lattes.docencia.observacoes.${instituicao.id}`, { defaultValue: "" });
    const detalhe = [
      observacao,
      instituicao.temCargos
        ? t("lattes.docencia.no_total", {
            total: f.tempo(instituicao.totalGeral),
            lecionando: f.lecionando(instituicao.total),
          })
        : f.tempo(instituicao.total),
      t("lattes.kpi.disciplinas", { count: rows.length }),
    ].filter(Boolean);

    return (
      <div key={instituicao.id} className="lattes-grupo docencia-grupo" style={corStyle(instituicao.id)}>
        <h5 className="lattes-grupo-titulo">
          <span className="docencia-grupo-nome">
            <span className="lattes-legenda-cor" aria-hidden="true" />
            {instituicao.nome}
          </span>
          <span className="lattes-grupo-qtd">{detalhe.join(" · ")}</span>
        </h5>
        <div className="lattes-tabela-wrap">
          <table className="lattes-tabela docencia-tabela">
            <thead>
              <tr>
                <th scope="col">{t("lattes.docencia.tabela.disciplina")}</th>
                <th scope="col">{t("lattes.docencia.tabela.curso")}</th>
                <th scope="col" className="docencia-num">
                  {/* Curso livre (Trybe) conta turmas, não semestres */}
                  {t(`lattes.docencia.tabela.${instituicao.porTurma ? "turmas" : "semestres"}`)}
                </th>
                <th scope="col">{t("lattes.docencia.tabela.tempo")}</th>
                <th scope="col">{t("lattes.docencia.tabela.periodo")}</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((item) => {
                const nome = f.disciplina(item);
                return (
                  <tr key={item.key}>
                    <th scope="row">
                      {nome}
                      {item.repo && "\u00a0"}
                      {item.repo && (
                        <a
                          className="lattes-link"
                          href={`${GITHUB}/${item.repo}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={t("lattes.docencia.ver_repositorio", { nome })}
                          title={t("lattes.docencia.ver_repositorio", { nome })}
                        >
                          <FiExternalLink aria-hidden="true" />
                        </a>
                      )}
                    </th>
                    <td>
                      {f.cursos(item)}
                      {item.modulo && <span className="lattes-tabela-sub">{f.modulo(item)}</span>}
                    </td>
                    <td className="docencia-num">{item.turmas ?? item.semestres?.length ?? "—"}</td>
                    <td>{f.tempo(item.total)}</td>
                    <td className="docencia-periodo">
                      {f.periodoPartes(item.mesesSet, instituicao.porMes).map((parte, i) =>
                        parte.type === "element" ? (
                          <span key={i} className="docencia-trecho">
                            {parte.value}
                          </span>
                        ) : (
                          parte.value
                        )
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {nota && <p className="lattes-tabela-nota">{nota}</p>}
        {instituicao.cargos.length > 0 && <Cargos instituicao={instituicao} />}
      </div>
    );
  });
}

// Cargos na instituição (Trybe), em ordem cronológica, com a mesma marca da
// linha do tempo: cheia lecionando, vazada em coordenação e liderança
function Cargos({ instituicao }) {
  const { t } = useTranslation();
  const f = useDocencia();
  return (
    <>
      <h6 className="docencia-cargos-titulo">
        {t("lattes.docencia.cargos_titulo", { instituicao: instituicao.sigla })}
      </h6>
      <div className="lattes-tabela-wrap">
        <table className="lattes-tabela docencia-tabela docencia-tabela-cargos">
          <thead>
            <tr>
              <th scope="col">{t("lattes.docencia.tabela.cargo")}</th>
              <th scope="col">{t("lattes.docencia.tabela.atividade")}</th>
              <th scope="col">{t("lattes.docencia.tabela.tempo")}</th>
              <th scope="col">{t("lattes.docencia.tabela.periodo")}</th>
            </tr>
          </thead>
          <tbody>
            {instituicao.cargos.map((cargo) => (
              <tr key={cargo.id}>
                <th scope="row">{f.cargo(cargo)}</th>
                <td>
                  <span
                    className={cargo.lecionando ? "docencia-amostra" : "docencia-amostra cargo"}
                    aria-hidden="true"
                  />
                  {t(`lattes.docencia.legenda.${cargo.lecionando ? "aula" : "cargo"}`)}
                </td>
                <td>{f.tempo(cargo.total)}</td>
                <td className="docencia-periodo">
                  <span className="docencia-trecho">{f.periodo(cargo.mesesSet, true)}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="lattes-tabela-nota">{t("lattes.docencia.nota_cargos")}</p>
    </>
  );
}

/* ---------- lattes --docencia ---------- */

export default function LattesDocencia() {
  const { t } = useTranslation();
  return (
    <>
      <Total />
      <Cards />
      <h4 className="lattes-secao-titulo">{t("lattes.docencia.linha_do_tempo")}</h4>
      <LinhaDoTempo />
      <h4 className="lattes-secao-titulo">{t("lattes.docencia.por_instituicao")}</h4>
      <PorInstituicao />
      <h4 className="lattes-secao-titulo">{t("lattes.docencia.por_curso")}</h4>
      <PorCurso />
      <h4 className="lattes-secao-titulo">{t("lattes.docencia.por_disciplina")}</h4>
      <PorDisciplina />
      <h4 className="lattes-secao-titulo">{t("lattes.docencia.disciplinas_por_instituicao")}</h4>
      <Tabelas />
    </>
  );
}
