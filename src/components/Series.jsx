import React, { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { setTerminalInputValue } from "../terminal/terminalDom";
import SkinsFooter from "./SkinsFooter";
import { SERIES, LISTAS, ordenar, chaveOrdem } from "../data/seriesData";
import { POSTERS } from "../data/seriesPosters";
import { SKINS } from "../data/seriesSkins";
import "./Series.css";

// Comando "series": as séries que estou assistindo, as que já vi e os
// desenhos, em cartazes, em ordem alfabética.
//
// Os cartazes vêm prontos do `npm run series` (data/seriesPosters.js e
// public/series/): aqui não há API nenhuma. Série sem cartaz (ou cuja imagem
// não carrega) vira um cartaz desenhado só com o nome.

const POR_LISTA = Object.fromEntries(
  LISTAS.map((lista) => [lista, ordenar(SERIES.filter((s) => s.lista === lista))]),
);
const TEM_TVMAZE = Object.values(POSTERS).some((p) => p.tvmaze);

// Escreve o comando no input do terminal: o visitante só aperta Enter
function preencherTerminal(comando) {
  const input = document.querySelector(".terminal-hidden-input");
  if (!input) return;
  input.focus();
  setTerminalInputValue(input, comando);
}

function Cartaz({ serie }) {
  const { t, i18n } = useTranslation();
  const [falhou, setFalhou] = useState(false);
  const dados = POSTERS[serie.id];
  const poster = serie.poster ?? dados?.poster;
  const url = dados?.url;
  const tituloBr = i18n.language.startsWith("pt") ? serie.br : null;

  const detalhe = [serie.ano, tituloBr].filter(Boolean);

  const conteudo = (
    <>
      {poster && !falhou ? (
        <img
          src={poster}
          alt=""
          width="210"
          height="295"
          loading="lazy"
          decoding="async"
          className="series-poster"
          onError={() => setFalhou(true)}
        />
      ) : (
        <span className="series-poster series-poster-vazio" aria-hidden="true">
          {chaveOrdem(serie.nome)[0]}
        </span>
      )}
      <span className="series-nome">{serie.nome}</span>
      {detalhe.length > 0 && (
        <span className="series-detalhe">{detalhe.join(" · ")}</span>
      )}
    </>
  );

  return (
    <li className="series-item">
      {url ? (
        <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="series-cartaz"
          aria-label={t("series.abrir", { nome: serie.nome })}
        >
          {conteudo}
        </a>
      ) : (
        <span className="series-cartaz">{conteudo}</span>
      )}
    </li>
  );
}

function Secao({ lista, comCabecalho }) {
  const { t } = useTranslation();
  const series = POR_LISTA[lista];
  const comando = `${t("series.comando")} --${t(`series.skins.${lista}`)}`;

  return (
    <section className={`series-secao series-${lista}`}>
      {comCabecalho && (
        <h4 className="series-secao-titulo">
          <span>{t(`series.listas.${lista}`)}</span>
          <span className="series-secao-total">{series.length}</span>
          <button
            type="button"
            className="series-secao-cmd"
            title={t("series.preencher")}
            onClick={() => preencherTerminal(comando)}
          >
            {comando}
          </button>
        </h4>
      )}
      <ul className="series-grade">
        {series.map((serie) => (
          <Cartaz key={serie.id} serie={serie} />
        ))}
      </ul>
    </section>
  );
}

export default function Series({ skin }) {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const listas = skin === "tudo" ? LISTAS : [skin];

  return (
    <div className="series" ref={ref}>
      <p className="series-titulo">
        <span aria-hidden="true">📺</span> {t("series.titulo")}
        {skin !== "tudo" && (
          <span className="series-titulo-visao"> · {t(`series.listas.${skin}`)}</span>
        )}
      </p>
      <p className="series-sub">
        {skin === "tudo"
          ? t("series.sub_tudo", {
              total: t("series.series_count", { count: SERIES.length }),
              assistindo: POR_LISTA.assistindo.length,
            })
          : t(`series.sub.${skin}`, { count: POR_LISTA[skin].length })}
      </p>

      {listas.map((lista) => (
        <Secao key={lista} lista={lista} comCabecalho={skin === "tudo"} />
      ))}

      <SkinsFooter skins={SKINS} active={skin} namespace="series" />
      {TEM_TVMAZE && (
        <p className="series-fonte">
          {t("series.fonte")}{" "}
          <a href="https://www.tvmaze.com/" target="_blank" rel="noopener noreferrer">
            TVmaze
          </a>
        </p>
      )}
    </div>
  );
}
