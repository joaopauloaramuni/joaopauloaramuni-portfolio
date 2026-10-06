import React, { useEffect, useRef, useState } from "react";
import { FiGithub } from "react-icons/fi";
import "./ProjectCard.css";

// Espera antes de cada nova tentativa da imagem (ms). As imagens do comando
// "github" vêm do opengraph.githubassets.com, que gera cada uma na hora e
// recusa quando o mesmo visitante pede muitas de uma vez.
const ESPERAS = [2000, 6000];

const ProjectCard = ({ project }) => {
  const { title, description, gif, gifFallbacks = [], repoLink, technologies } = project;

  // A imagem e as alternativas, em ordem. Se todas falharem, o card mostra um
  // quadro com o nome do projeto no lugar do ícone de imagem quebrada.
  const fontes = [gif, ...gifFallbacks].filter(Boolean);
  const [tentativa, setTentativa] = useState(0);
  const [esperando, setEsperando] = useState(false);
  const [falhou, setFalhou] = useState(fontes.length === 0);
  const timer = useRef(null);
  useEffect(() => () => clearTimeout(timer.current), []);

  const onError = () => {
    if (tentativa + 1 >= fontes.length) {
      setFalhou(true);
      return;
    }
    setEsperando(true);
    timer.current = setTimeout(() => {
      setEsperando(false);
      setTentativa((n) => n + 1);
    }, ESPERAS[tentativa] ?? ESPERAS[ESPERAS.length - 1]);
  };

  return (
    <div className="card-container">
      <div className="gif-container">
        {falhou ? (
          <div className="project-gif-placeholder" role="img" aria-label={`Project ${title}`}>
            <FiGithub aria-hidden="true" />
            <span>{title}</span>
          </div>
        ) : (
          <img
            key={fontes[tentativa]}
            src={fontes[tentativa]}
            alt={`Project ${title}`}
            className={esperando ? "project-gif esperando" : "project-gif"}
            loading="lazy"
            decoding="async"
            onError={onError}
          />
        )}
      </div>

      <div className="content-container">
        <h3 className="card-title">{title}</h3>
        <p className="card-description">{description}</p>

        <div className="technologies-container">
          {technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>

        <a
          href={repoLink}
          className="repo-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Link →
        </a>
      </div>
    </div>
  );
};

export default ProjectCard;
