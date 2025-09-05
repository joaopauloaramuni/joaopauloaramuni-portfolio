import React from "react";
import { FaLinkedin } from "react-icons/fa";
import { recommendationsData } from "../data/recommendationsData";
import { useTranslation } from "react-i18next";
import "./Recomendacoes.css";

export default function Recomendacoes() {
  const { t } = useTranslation();

  if (!recommendationsData.length) {
    return (
      <div className="recomendacoes-vazio">
        <h2 className="recomendacoes-titulo">{t("recomendacoes.titulo")}</h2>
        <p className="recomendacoes-mensagem">{t("recomendacoes.nenhum")}</p>
      </div>
    );
  }

  return (
    <div className="recomendacoes-container">
      <h3 className="recomendacoes-titulo">{t("recomendacoes.titulo")}</h3>

      {recommendationsData.map((rec) => (
        <div className="recomendacao-sobre-container" key={rec.id}>
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
            <div className="recomendacao-name">
              {t(`recomendacoes.nome_${rec.id}`, rec.name)}
            </div>
            <div className="recomendacao-relationship">
              {t(`recomendacoes.${rec.relationshipId}`, rec.relationship)}
            </div>
            <div className="recomendacao-text">
              {t(`recomendacoes.${rec.recommendationId}`, rec.recommendation)}
            </div>
            {rec.link && (
              <a
                href={rec.link}
                target="_blank"
                rel="noopener noreferrer"
                className="recomendacao-link"
              >
                <FaLinkedin className="recomendacoes-icone" />
                {t("recomendacoes.link", "LinkedIn")}
              </a>
            )}
            <div className="recomendacao-separador" />
          </div>
        </div>
      ))}
    </div>
  );
}
