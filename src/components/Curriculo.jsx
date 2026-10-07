import React, { useEffect, useRef, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { useTranslation } from "react-i18next";
import { FiDownload, FiExternalLink, FiMaximize2, FiZoomIn, FiZoomOut } from "react-icons/fi";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import "./Curriculo.css";

// Visualizador do currículo com o react-pdf (PDF.js 5, mantido e sem a falha
// CVE-2024-4367 do PDF.js 3 que o @react-pdf-viewer usava). Este arquivo, o
// react-pdf e o PDF.js só são baixados quando o comando "curriculo" roda
// (App.jsx usa lazy), e o worker do PDF.js sai do próprio build: antes ele
// vinha do unpkg. O worker precisa ser configurado neste mesmo arquivo, onde
// os componentes do react-pdf são usados (ver o README do react-pdf).
import workerUrl from "pdfjs-dist/build/pdf.worker.min.mjs?url";

pdfjs.GlobalWorkerOptions.workerSrc = workerUrl;

const ZOOM_MIN = 0.5;
const ZOOM_MAX = 2;
const ZOOM_PASSO = 0.25;

const Curriculo = () => {
  const { t, i18n } = useTranslation();
  const areaRef = useRef(null);
  const [largura, setLargura] = useState(null);
  const [paginas, setPaginas] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [erro, setErro] = useState(false);

  const lang = i18n.language.startsWith("en") ? "en" : "pt";
  const fileUrl = `/cv-${lang}.pdf`;

  // Trocou o idioma: outro PDF, que ainda não carregou nem deu erro
  const [arquivoAtual, setArquivoAtual] = useState(fileUrl);
  if (arquivoAtual !== fileUrl) {
    setArquivoAtual(fileUrl);
    setPaginas(0);
    setErro(false);
  }

  // Com zoom 100%, a página ocupa a largura da área (acompanha a janela)
  useEffect(() => {
    const area = areaRef.current;
    if (!area) return;
    // Largura útil da área, sem o padding (a margem em volta das páginas)
    const medir = (largura) => setLargura(Math.max(200, Math.floor(largura)));
    if (!("ResizeObserver" in window)) {
      const estilo = getComputedStyle(area);
      medir(area.clientWidth - parseFloat(estilo.paddingLeft) - parseFloat(estilo.paddingRight));
      return;
    }
    const observer = new ResizeObserver(([entry]) => medir(entry.contentRect.width));
    observer.observe(area);
    return () => observer.disconnect();
  }, []);

  const mudarZoom = (delta) =>
    setZoom((atual) => Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, atual + delta)));

  const larguraDaPagina = largura ? Math.round(largura * zoom) : undefined;
  const carregando = !erro && paginas === 0;

  return (
    <div className="curriculo-container">
      <div className="cv-barra">
        <span className="cv-titulo">
          {t("curriculo.titulo")}
          {paginas > 0 && (
            <span className="cv-paginas">{t("curriculo.paginas", { count: paginas })}</span>
          )}
        </span>

        <div className="cv-zoom" role="group" aria-label={t("curriculo.zoom")}>
          <button
            type="button"
            onClick={() => mudarZoom(-ZOOM_PASSO)}
            disabled={zoom <= ZOOM_MIN}
            aria-label={t("curriculo.zoom_menos")}
            title={t("curriculo.zoom_menos")}
          >
            <FiZoomOut aria-hidden="true" />
          </button>
          <span className="cv-zoom-valor" aria-live="polite">
            {Math.round(zoom * 100)}%
          </span>
          <button
            type="button"
            onClick={() => mudarZoom(ZOOM_PASSO)}
            disabled={zoom >= ZOOM_MAX}
            aria-label={t("curriculo.zoom_mais")}
            title={t("curriculo.zoom_mais")}
          >
            <FiZoomIn aria-hidden="true" />
          </button>
          <button
            type="button"
            onClick={() => setZoom(1)}
            disabled={zoom === 1}
            aria-label={t("curriculo.zoom_ajustar")}
            title={t("curriculo.zoom_ajustar")}
          >
            <FiMaximize2 aria-hidden="true" />
          </button>
        </div>

        <div className="cv-acoes">
          <a className="cv-botao principal" href={fileUrl} download={t("curriculo.arquivo")}>
            <FiDownload aria-hidden="true" />
            {t("curriculo.baixar")}
          </a>
          <a className="cv-botao" href={fileUrl} target="_blank" rel="noopener noreferrer">
            <FiExternalLink aria-hidden="true" />
            {t("curriculo.abrir")}
          </a>
        </div>
      </div>

      <div className="cv-area" ref={areaRef}>
        {carregando && (
          <p className="cv-aviso" role="status">
            <span className="cv-spinner" aria-hidden="true" />
            {t("curriculo.carregando")}
          </p>
        )}
        {erro ? (
          // Navegador antigo ou falha de rede: os botões acima continuam valendo
          <p className="cv-aviso">{t("curriculo.erro")}</p>
        ) : (
          <Document
            key={fileUrl}
            file={fileUrl}
            onLoadSuccess={({ numPages }) => setPaginas(numPages)}
            onLoadError={(error) => {
              console.error("Currículo: falha ao abrir o PDF", error);
              setErro(true);
            }}
            loading={null}
            error={null}
            externalLinkTarget="_blank"
            externalLinkRel="noopener noreferrer"
          >
            {larguraDaPagina &&
              Array.from({ length: paginas }, (_, i) => (
                <div key={i} className="cv-pagina">
                  <Page pageNumber={i + 1} width={larguraDaPagina} loading={null} />
                </div>
              ))}
          </Document>
        )}
      </div>
    </div>
  );
};

export default Curriculo;
