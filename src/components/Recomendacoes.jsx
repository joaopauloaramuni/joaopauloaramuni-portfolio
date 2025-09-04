import React from "react";
import { recommendationsData } from "../data/recommendationsData";
import { useTranslation } from "react-i18next";
import "./Recomendacoes.css";

export default function Recomendacoes() {
  const { t } = useTranslation();

  if (!recommendationsData.length) {
    return (
      <div>
        <h2>{t("recomendacoes.titulo")}</h2>
        <p>{t("recomendacoes.nenhum")}</p>
      </div>
    );
  }

  return (
    <div className="recomendacoes-container">
      <h3 className="recomendacoes-titulo">{t("recomendacoes.titulo")}</h3>

      {recommendationsData.map((rec, idx) => (
        <div className="recomendacao-sobre-container" key={idx}>
          {rec.image && (
            <div className="recomendacao-avatar-container">
              <a
                href={rec.link || "#"}
                target="_blank"
                rel="noopener noreferrer"
              >
                <img
                  src={rec.image}
                  alt={rec.name}
                  className="recomendacao-avatar-image"
                />
              </a>
            </div>
          )}
          <div className="recomendacao-info-container">
            <div className="recomendacao-name">{rec.name}</div>
            <div className="recomendacao-relationship">{rec.relationship}</div>
            <div className="recomendacao-text">{rec.recommendation}</div>
            {rec.link && (
              <a
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="recomendacao-link"
              >
                <span role="img" aria-label="link">
                  🔗
                </span>{" "}
                {t("recomendacoes.link", "LinkedIn")}
              </a>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
