import React from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import { projectsData } from "../data/projectsData";
import "./Projetos.css";

const Projetos = () => {
  const { t } = useTranslation();

  // Mapear dados com traduções
  const translatedProjects = projectsData.map((project) => ({
    ...project,
    title: t(`projetos.${project.titleId}`),
    description: t(`projetos.${project.descriptionId}`),
  }));

  return (
    <div className="projeto-container">
      <h3 className="projeto-title">
        {t("projetos.titulo")}
      </h3>

      <div>
        {translatedProjects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default Projetos;
