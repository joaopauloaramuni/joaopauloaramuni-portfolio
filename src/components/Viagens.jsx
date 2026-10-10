import React, { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { setTerminalInputValue } from "../terminal/terminalDom";
import SkinsFooter from "./SkinsFooter";
import { continentes } from "../data/sobreData";
import { BASE, CIDADES } from "../data/viagensData";
import { ALFABETO, MAPAS, VISITADOS } from "../data/viagensMapa";
import { SKINS } from "../data/viagensSkins";
import "./Viagens.css";

// Comando "viagens": os lugares por onde já passei, num mapa de pontos.
//
// A grade de pontos vem pronta do `npm run viagens` (data/viagensMapa.js):
// aqui só desenhamos. Cada cor de ponto vira um único <path> com traços de
// tamanho zero e ponta redonda (stroke-linecap: round), em vez de milhares
// de <circle>. Os países, as bandeiras e as cores dos continentes vêm do
// `continentes` do sobreData.js, o mesmo do "Carimbos no passaporte".

// Tamanhos em px de tela: o mapa mede a própria largura (ResizeObserver) e
// converte para unidades do viewBox, então pinos e nomes têm o mesmo tamanho
// em qualquer recorte e em qualquer tela (no celular cabem menos nomes, e o
// posicionarRotulos esconde os que não cabem)
const LARGURA_INICIAL = 920;
const PINO_PX = 4.2;
const RAIO_IMA_PX = 18; // distância do cursor até o pino que ele "pega"
const CASA_PX = 5;
const FONTE_PX = 11.5;
const LARGURA_LETRA = 0.62; // largura média de um caractere monoespaçado / tamanho da fonte

const RAIO_TERRA_KM = 6371;
const rad = (graus) => (graus * Math.PI) / 180;
const distanciaKm = (a, b) => {
  const dLat = rad(b.lat - a.lat);
  const dLon = rad(b.lon - a.lon);
  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(dLon / 2) ** 2;
  return 2 * RAIO_TERRA_KM * Math.asin(Math.sqrt(h));
};

// sigla → { continente, cor, Bandeira }
const PAISES = Object.fromEntries(
  continentes.flatMap((c) =>
    c.lugares.map((lugar) => [
      lugar.sigla,
      { continente: c.id, cor: c.cor, Bandeira: lugar.Bandeira },
    ]),
  ),
);

const CIDADES_COM_DISTANCIA = CIDADES.map((c) => ({
  ...c,
  km: Math.round(distanciaKm(BASE, c)),
}));
const MAIS_LONGE = CIDADES_COM_DISTANCIA.reduce((a, b) =>
  b.km > a.km ? b : a,
);

// Escreve o comando no input do terminal: o visitante só aperta Enter
function preencherTerminal(comando) {
  const input = document.querySelector(".terminal-hidden-input");
  if (!input) return;
  input.focus();
  setTerminalInputValue(input, comando);
}

// Rótulos sem sobreposição: na ordem de prioridade, tenta à direita do pino,
// à esquerda, acima e abaixo; se não couber, o nome fica só no pino (aparece
// ao passar o mouse). Os nomes também desviam dos outros pinos, menos os
// mais importantes (a casa e as primeiras cidades da lista), que só desviam
// de outros nomes: assim Rio, São Paulo e BH aparecem mesmo no meio dos pinos.
const ESSENCIAIS = 7;
const LADOS = ["direita", "esquerda", "acima", "abaixo"];

function posicionarRotulos(
  itens,
  { fonte, folga, largura, altura, pinos = [], raio = 0 },
) {
  const ocupados = [];
  const cobrePino = (a, item) =>
    pinos.some(
      ([x, y]) =>
        Math.hypot(x - item.x, y - item.y) > raio &&
        x + raio > a.x0 &&
        x - raio < a.x1 &&
        y + raio > a.y0 &&
        y - raio < a.y1,
    );
  const cruzaNome = (a) =>
    ocupados.some(
      (b) => a.x0 < b.x1 && a.x1 > b.x0 && a.y0 < b.y1 && a.y1 > b.y0,
    );

  const caixaDe = (item, lado, w, h) => {
    const x0 =
      { direita: item.x + folga, esquerda: item.x - folga - w }[lado] ??
      item.x - w / 2;
    const cy =
      { acima: item.y - folga - h / 2, abaixo: item.y + folga + h / 2 }[lado] ??
      item.y;
    return { x0, x1: x0 + w, y0: cy - h / 2, y1: cy + h / 2, cy };
  };

  return itens.flatMap((item, indice) => {
    const w = item.texto.length * fonte * LARGURA_LETRA;
    const h = fonte * 1.2;
    const essencial = item.casa || indice < ESSENCIAIS;
    for (const lado of LADOS) {
      const caixa = caixaDe(item, lado, w, h);
      if (
        caixa.x0 < 0 ||
        caixa.x1 > largura ||
        caixa.y0 < 0 ||
        caixa.y1 > altura
      )
        continue;
      if (cruzaNome(caixa) || (!essencial && cobrePino(caixa, item))) continue;
      ocupados.push(caixa);
      const ancora = { direita: "start", esquerda: "end" }[lado] ?? "middle";
      const x = { direita: caixa.x0, esquerda: caixa.x1 }[lado] ?? item.x;
      return [{ ...item, ancora, x, y: caixa.cy }];
    }
    return [];
  });
}

function Mapa({ visao }) {
  const { t, i18n } = useTranslation();
  const [ativo, setAtivo] = useState(null);
  const [largura, setLargura] = useState(LARGURA_INICIAL);
  const svgRef = useRef(null);
  const mapa = MAPAS[visao];
  const mundo = visao === "mundo";
  const { colunas, linhas } = mapa;
  const u = colunas / largura; // 1 px de tela em unidades do viewBox
  // Em mapas estreitos (celular) os pinos encolhem um pouco, até 60%
  const up = u * Math.min(1, Math.max(0.6, largura / LARGURA_INICIAL));

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || typeof ResizeObserver === "undefined") return undefined;
    const observer = new ResizeObserver(([entrada]) => {
      const w = Math.round(entrada.contentRect.width);
      if (w > 0) setLargura(w);
    });
    observer.observe(svg);
    return () => observer.disconnect();
  }, []);

  const projetar = (lat, lon) => [
    (lon - mapa.oeste) / mapa.passoLon,
    (mapa.norte - lat) / mapa.passoLat,
  ];
  const dentro = ([x, y]) => x >= 0 && x <= colunas && y >= 0 && y <= linhas;

  // Pontos da grade agrupados por cor: terra e um grupo por continente
  const pontos = useMemo(() => {
    const grupos = {};
    mapa.grade.forEach((linha, l) => {
      for (let c = 0; c < linha.length; c++) {
        const marca = linha[c];
        if (marca === " ") continue;
        const cor =
          marca === "."
            ? "terra"
            : PAISES[VISITADOS[ALFABETO.indexOf(marca)]]?.cor;
        if (!cor) continue;
        grupos[cor] = (grupos[cor] ?? "") + `M${c + 0.5} ${l + 0.5}h0`;
      }
    });
    return grupos;
  }, [mapa]);

  const casa = projetar(BASE.lat, BASE.lon);
  const pinos = CIDADES_COM_DISTANCIA.map((c) => ({
    ...c,
    pos: projetar(c.lat, c.lon),
  })).filter((c) => dentro(c.pos));

  // No mundo, um rótulo por país ("Japão 5"); nos recortes, um por cidade
  const nomePais = (sigla) => t(`viagens.paises.${sigla}`);
  const candidatos = mundo
    ? [...new Set(pinos.map((p) => p.pais))]
        .map((sigla) => {
          const doPais = pinos.filter((p) => p.pais === sigla);
          const x = doPais.reduce((s, p) => s + p.pos[0], 0) / doPais.length;
          const y = doPais.reduce((s, p) => s + p.pos[1], 0) / doPais.length;
          return {
            id: sigla,
            pais: sigla,
            x,
            y,
            pos: [x, y],
            texto: `${nomePais(sigla)} ${doPais.length}`,
            n: doPais.length,
            cidades: doPais.map((p) => p.id),
            grupo: true,
          };
        })
        .sort((a, b) => b.n - a.n)
    : [
        ...(dentro(casa)
          ? [
              {
                id: BASE.id,
                x: casa[0],
                y: casa[1],
                texto: t(`viagens.cidades.${BASE.id}`),
                casa: true,
              },
            ]
          : []),
        ...pinos.map((p) => ({
          id: p.id,
          x: p.pos[0],
          y: p.pos[1],
          texto: t(`viagens.cidades.${p.id}`),
        })),
      ];
  const rotulos = posicionarRotulos(candidatos, {
    fonte: FONTE_PX * u,
    folga: 9 * u,
    largura: colunas,
    altura: linhas,
    // No mundo o rótulo é do país (fica no meio dos pinos dele): lá só os nomes contam
    pinos: mundo
      ? []
      : [...pinos.map((p) => p.pos), ...(dentro(casa) ? [casa] : [])],
    raio: PINO_PX * up,
  });

  // Rotas tracejadas de BH até cada país (só no mundo)
  const rotas = mundo
    ? candidatos
        .filter((r) => r.id !== BASE.pais)
        .map((r) => {
          const [x1, y1] = casa;
          const meioX = (x1 + r.x) / 2;
          const meioY = Math.min(y1, r.y) - Math.abs(r.x - x1) * 0.22;
          return {
            id: r.id,
            d: `M${x1} ${y1}Q${meioX} ${meioY} ${r.x} ${r.y}`,
          };
        })
    : [];

  const km = (n) => n.toLocaleString(i18n.language);
  const abrir = (pino) => setAtivo(pino);
  const fechar = () => setAtivo(null);

  // Ímã: os pinos ficam muito juntos (Minas, Japão), então o mouse não
  // precisa acertar a bolinha: vale o pino mais perto do cursor, dentro de
  // RAIO_IMA_PX. O toque no celular usa a mesma regra.
  // No mundo, as 49 cidades do Brasil caberiam em poucos pixels: lá cada
  // país vira um pino só (maior quanto mais cidades), e o clique aproxima
  const casaAlvo = dentro(casa) ? [{ ...BASE, pos: casa, casa: true }] : [];
  const alvos = mundo ? candidatos : [...pinos, ...casaAlvo];
  const pinoPerto = (evento) => {
    const caixa = evento.currentTarget.getBoundingClientRect();
    const x = ((evento.clientX - caixa.left) / caixa.width) * colunas;
    const y = ((evento.clientY - caixa.top) / caixa.height) * linhas;
    let melhor = null;
    let menor = RAIO_IMA_PX * u;
    for (const alvo of alvos) {
      const d = Math.hypot(alvo.pos[0] - x, alvo.pos[1] - y);
      if (d < menor) {
        menor = d;
        melhor = alvo;
      }
    }
    return melhor;
  };
  const comandoZoom = (sigla) =>
    `${t("viagens.comando")} --${t(`viagens.skins.${PAISES[sigla]?.continente ?? "mundo"}`)}`;
  // Clique (ou toque) num país no mapa-múndi escreve o zoom no terminal
  const aoSoltar = (evento) => {
    const perto = pinoPerto(evento);
    if (perto?.grupo) preencherTerminal(comandoZoom(perto.pais));
  };
  const aoMover = (evento) => {
    const perto = pinoPerto(evento);
    if (perto?.id !== ativo?.id) setAtivo(perto);
  };
  const InfoPais = ativo ? PAISES[ativo.pais] : null;

  return (
    // A moldura ocupa toda a largura do terminal; o desenho fica numa área
    // interna, que nos recortes mais "quadrados" (Minas, Europa) é limitada
    // pela altura da janela e centralizada
    <div className={mundo ? "viagens-mapa" : "viagens-mapa recorte"}>
      <div
        className="viagens-mapa-area"
        style={{ "--proporcao": colunas / linhas }}
      >
        <svg
          ref={svgRef}
          viewBox={`0 0 ${colunas} ${linhas}`}
          role="img"
          aria-label={t("viagens.mapa_alt", {
            visao: t(`viagens.visoes.${visao}`),
            count: pinos.length,
          })}
          className={ativo ? "com-ativo" : undefined}
          onPointerMove={aoMover}
          onPointerDown={aoMover}
          onMouseLeave={fechar}
          onPointerUp={aoSoltar}
        >
          {Object.entries(pontos).map(([cor, d]) => (
            <path
              key={cor}
              d={d}
              className={cor === "terra" ? "viagens-terra" : "viagens-visitado"}
              style={cor === "terra" ? undefined : { stroke: `var(${cor})` }}
            />
          ))}

          {rotas.map((r) => (
            <path
              key={r.id}
              d={r.d}
              className="viagens-rota"
              style={{ strokeWidth: u }}
            />
          ))}

          {(mundo ? candidatos : pinos).map((p) => (
            <circle
              key={p.id}
              cx={p.pos[0]}
              cy={p.pos[1]}
              r={
                PINO_PX *
                up *
                (p.grupo ? Math.min(1.9, 1 + Math.sqrt(p.n - 1) * 0.15) : 1)
              }
              className={
                ativo?.id === p.id ? "viagens-pino ativo" : "viagens-pino"
              }
              style={{
                stroke: `var(${PAISES[p.pais]?.cor ?? "--accent"})`,
                strokeWidth: 2 * up,
              }}
              tabIndex={0}
              role="button"
              aria-label={
                p.grupo
                  ? `${nomePais(p.pais)}, ${t("viagens.cidades_count", { count: p.n })}`
                  : `${t(`viagens.cidades.${p.id}`)}, ${nomePais(p.pais)}`
              }
              onFocus={() => abrir(p)}
              onBlur={fechar}
            />
          ))}

          {dentro(casa) && (
            <g
              className="viagens-casa"
              tabIndex={0}
              role="button"
              aria-label={t("viagens.casa_alt")}
              onFocus={() => abrir({ ...BASE, pos: casa, casa: true })}
              onBlur={fechar}
            >
              <circle
                cx={casa[0]}
                cy={casa[1]}
                r={CASA_PX * 2.4 * up}
                className="viagens-casa-onda"
              />
              <circle
                cx={casa[0]}
                cy={casa[1]}
                r={CASA_PX * up}
                className="viagens-casa-ponto"
                style={{ strokeWidth: 2 * up }}
              />
            </g>
          )}

          {/* Pino escolhido pelo ímã: um anel por cima, para ver qual é */}
          {ativo && (
            <circle
              cx={ativo.pos[0]}
              cy={ativo.pos[1]}
              r={PINO_PX * up * (ativo.grupo ? 2.8 : 2)}
              className="viagens-pino-anel"
              style={{ strokeWidth: 1.5 * up }}
            />
          )}

          {rotulos.map((r) => (
            <text
              key={r.id}
              x={r.x}
              y={r.y}
              dy="0.35em"
              textAnchor={r.ancora}
              className={r.casa ? "viagens-rotulo casa" : "viagens-rotulo"}
              style={{ fontSize: FONTE_PX * u, strokeWidth: 4 * u }}
            >
              {r.texto}
            </text>
          ))}
        </svg>

        {ativo && (
          <div
            className={[
              "viagens-dica",
              ativo.pos[0] / colunas > 0.75 && "esquerda",
              ativo.pos[0] / colunas < 0.25 && "direita",
              ativo.pos[1] / linhas < 0.2 && "abaixo",
            ]
              .filter(Boolean)
              .join(" ")}
            role="status"
            style={{
              left: `${(ativo.pos[0] / colunas) * 100}%`,
              top: `${(ativo.pos[1] / linhas) * 100}%`,
            }}
          >
            {InfoPais?.Bandeira && (
              <InfoPais.Bandeira
                className="viagens-bandeira"
                aria-hidden="true"
              />
            )}
            {ativo.grupo ? (
              <span>
                <strong>
                  {nomePais(ativo.pais)} ·{" "}
                  {t("viagens.cidades_count", { count: ativo.n })}
                </strong>
                <span className="viagens-dica-detalhe">
                  {ativo.cidades
                    .slice(0, 3)
                    .map((id) => t(`viagens.cidades.${id}`))
                    .join(", ")}
                  {ativo.n > 3 && ` +${ativo.n - 3}`}
                </span>
                <span className="viagens-dica-acao">
                  {t("viagens.aproximar", { comando: comandoZoom(ativo.pais) })}
                </span>
              </span>
            ) : (
              <span>
                <strong>{t(`viagens.cidades.${ativo.id}`)}</strong>
                <span className="viagens-dica-detalhe">
                  {nomePais(ativo.pais)} ·{" "}
                  {ativo.casa
                    ? t("viagens.casa")
                    : t("viagens.distancia", { km: km(ativo.km) })}
                </span>
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function Lista() {
  const { t } = useTranslation();
  return (
    <div className="viagens-lista">
      {continentes.map((c) => {
        const siglas = [...new Set(c.lugares.map((l) => l.sigla))].filter((s) =>
          CIDADES.some((cidade) => cidade.pais === s),
        );
        return (
          <section
            key={c.id}
            className="viagens-lista-continente"
            style={{ "--serie": `var(${c.cor})` }}
          >
            <p className="viagens-lista-titulo">
              {t(`sobre.pessoal.continentes.${c.id}`)}
            </p>
            {siglas.map((sigla) => {
              const Bandeira = PAISES[sigla].Bandeira;
              const cidades = CIDADES.filter((cidade) => cidade.pais === sigla);
              return (
                <p key={sigla} className="viagens-lista-pais">
                  <Bandeira className="viagens-bandeira" aria-hidden="true" />
                  <strong>{t(`viagens.paises.${sigla}`)}</strong>
                  {/* Cidade-estado (Singapura, Vaticano...): o nome já está no país */}
                  {!(
                    cidades.length === 1 &&
                    t(`viagens.cidades.${cidades[0].id}`) ===
                      t(`viagens.paises.${sigla}`)
                  ) && (
                    <span className="viagens-lista-cidades">
                      {cidades
                        .map((cidade) => t(`viagens.cidades.${cidade.id}`))
                        .join(" · ")}
                    </span>
                  )}
                </p>
              );
            })}
          </section>
        );
      })}
    </div>
  );
}

function Resumo() {
  const { t, i18n } = useTranslation();
  const opcao = (id) => `${t("viagens.comando")} --${t(`viagens.skins.${id}`)}`;

  return (
    <>
      <div className="viagens-numeros">
        <p>
          <strong className="viagens-numero accent">{CIDADES.length}</strong>
          <span>{t("viagens.numeros.cidades")}</span>
        </p>
        <p>
          <strong className="viagens-numero">{VISITADOS.length}</strong>
          <span>{t("viagens.numeros.paises")}</span>
        </p>
        <p>
          <strong className="viagens-numero">{continentes.length}</strong>
          <span>{t("viagens.numeros.continentes")}</span>
        </p>
        <p>
          <strong className="viagens-numero highlight">
            {t("viagens.km", {
              km: MAIS_LONGE.km.toLocaleString(i18n.language),
            })}
          </strong>
          <span>
            {t("viagens.numeros.mais_longe", {
              cidade: t(`viagens.cidades.${MAIS_LONGE.id}`),
            })}
          </span>
        </p>
      </div>

      <ul className="viagens-legenda">
        {continentes.map((c) => {
          const siglas = new Set(c.lugares.map((l) => l.sigla));
          const cidades = CIDADES.filter((cidade) =>
            siglas.has(cidade.pais),
          ).length;
          const paises = VISITADOS.filter((s) => siglas.has(s)).length;
          return (
            <li key={c.id} style={{ "--serie": `var(${c.cor})` }}>
              <button
                type="button"
                title={t("viagens.preencher")}
                onClick={() => preencherTerminal(opcao(c.id))}
              >
                <span className="viagens-legenda-ponto" aria-hidden="true" />
                <span className="viagens-legenda-nome">
                  {t(`sobre.pessoal.continentes.${c.id}`)}
                </span>
                <span className="viagens-legenda-total">
                  {t("viagens.paises_count", { count: paises })} ·{" "}
                  {t("viagens.cidades_count", { count: cidades })}
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </>
  );
}

export default function Viagens({ skin }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);

  return (
    <div className="viagens" ref={ref}>
      <p className="viagens-titulo">
        <span aria-hidden="true">✈</span> {t("viagens.titulo")}
        {skin !== "mundo" && skin !== "lista" && (
          <span className="viagens-titulo-visao">
            {" "}
            · {t(`viagens.visoes.${skin}`)}
          </span>
        )}
      </p>
      <p className="viagens-sub">
        {t(
          skin === "lista"
            ? "viagens.sub_lista"
            : skin === "mundo"
              ? "viagens.sub_mundo"
              : "viagens.sub",
        )}
      </p>
      {skin === "lista" ? <Lista /> : <Mapa key={skin} visao={skin} />}
      <Resumo />
      <SkinsFooter skins={SKINS} active={skin} namespace="viagens" />
    </div>
  );
}
