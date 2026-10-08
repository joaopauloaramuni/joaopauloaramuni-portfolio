import React, { useRef, useState } from "react";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { useTranslation } from "react-i18next";
import "./Calendly.css";

const CALENDLY_URL = "https://calendly.com/aramuni";

// A página de agendamento entra num <iframe>, do mesmo jeito que o script
// oficial do Calendly (widget.js) faria. Antes, cada "calendly" acrescentava
// mais um <script> do widget na página e ele redesenhava todas as agendas
// já abertas; agora não há script nenhum para carregar.
// embed_domain e embed_type são os parâmetros que o widget.js põe na URL:
// avisam o Calendly que a página está embutida.
const embedUrl = () => {
  const url = new URL(CALENDLY_URL);
  url.searchParams.set("embed_domain", window.location.hostname);
  url.searchParams.set("embed_type", "Inline");
  return url.toString();
};

export default function Calendly() {
  const { t } = useTranslation();
  const [carregado, setCarregado] = useState(false);
  const ref = useRef(null);
  useCommandAtTop(ref);

  return (
    <div ref={ref}>
      <h3 className="calendly-title">{t("calendly.titulo")}</h3>
      <div className="calendly-inline-widget">
        {!carregado && (
          <p className="calendly-carregando" role="status">
            {t("calendly.carregando")}
          </p>
        )}
        <iframe
          src={embedUrl()}
          title={t("calendly.titulo")}
          className="calendly-iframe"
          onLoad={() => setCarregado(true)}
        />
      </div>
    </div>
  );
}
