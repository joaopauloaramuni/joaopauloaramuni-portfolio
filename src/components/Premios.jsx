import React from "react";
import { FaExternalLinkAlt } from "react-icons/fa";
import { awardsData } from "../data/awardsData";
import { useTranslation } from "react-i18next";
import "./Premios.css";

export default function Premios() {
  const { t } = useTranslation();

  if (!awardsData.length) {
    return (
      <div>
        <h2>{t("premios.titulo")}</h2>
        <p>{t("premios.nenhum")}</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="premios-titulo">
        {t("premios.titulo")}
      </h3>
      {awardsData.map((award, idx) => (
        <div className="premio-sobre-container" key={idx}>
          {award.image && (
            <div className="premio-avatar-container">
              <a
                href={award.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={award.image}
                  alt={t(`premios.${award.id}.titulo`)}
                  className="premio-avatar-image"
                />
              </a>
            </div>
          )}
          <div className="premio-info-container">
            <div className="premio-title">
              {t(`premios.${award.id}.titulo`)}
            </div>
            <div className="premio-org">{t(`premios.${award.id}.org`)}</div>
            {award.year && <div className="premio-year">{award.year}</div>}
            <div className="premio-desc">{t(`premios.${award.id}.desc`)}</div>
            {award.link && (
              <a
                href={award.link}
                className="premio-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <FaExternalLinkAlt className="premio-icone" />
                {t("premios.link")}
              </a>
            )}
            <div className="premio-separador" />
          </div>
        </div>
      ))}
    </div>
  );
}
