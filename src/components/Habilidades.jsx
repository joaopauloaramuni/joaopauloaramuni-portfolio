import React from "react";
import { skillsData } from "../data/skillsData";
import { useTranslation } from "react-i18next";
import { FaGithub } from "react-icons/fa";
import "./Habilidades.css";

export default function Habilidades() {
  const { t } = useTranslation();

  if (!skillsData.length) {
    return (
      <div className="habilidades-container">
        <h2 className="habilidades-titulo">{t("habilidades.titulo")}</h2>
        <p>{t("habilidades.nenhuma")}</p>
      </div>
    );
  }

  return (
    <div className="habilidades-container">
      <h3 className="habilidades-titulo">{t("habilidades.titulo")}</h3>

      {skillsData.map((skill, idx) => (
        <div className="habilidade-sobre-container" key={idx}>
          <div className="habilidade-info-container">
            <div className="habilidade-nome">
              {skill.link ? (
                <a
                  href={skill.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="habilidade-link"
                >
                  <FaGithub className="habilidade-icone" />
                  {skill.name}
                </a>
              ) : (
                skill.name
              )}
            </div>
            <div className="habilidade-level">{skill.level}%</div>
          </div>
          <div className="habilidade-barra-fundo">
            <div
              className="habilidade-barra-progresso"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
}
