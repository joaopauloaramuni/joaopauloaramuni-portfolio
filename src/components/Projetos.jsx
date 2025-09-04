import React from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import { projectsData } from "../data/projectsData";

const Projetos = () => {
  const { t } = useTranslation();

  // Mapear dados com traduções
  const translatedProjects = projectsData.map((project) => ({
    ...project,
    title: t(`projetos.${project.titleId}`),
    description: t(`projetos.${project.descriptionId}`),
  }));

  return (
    <div style={{ padding: "0 1.5rem" }}>
      <h3
        style={{ color: "#00ff9d", marginBottom: "2rem", fontSize: "1.8rem" }}
      >
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
