import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import "./Projetos.css";
import GITHUB_API_CONFIG from "../config/GitHubAPIConfig";

const ProjetosGitHub = () => {
  const { t } = useTranslation();
  const { USERNAME, TOKEN, BASE_URL, PER_PAGE } = GITHUB_API_CONFIG;

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        const response = await fetch(
          `${BASE_URL}/users/${USERNAME}/repos?sort=updated&per_page=${PER_PAGE}`,
          {
            headers: {
              Authorization: `token ${TOKEN}`,
              Accept: "application/vnd.github.mercy-preview+json",
            },
          }
        );

        const data = await response.json();
        const filteredRepos = data.filter((repo) => !repo.fork);

        const mappedRepos = filteredRepos.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || "",
          gif: `https://opengraph.githubassets.com/1/${USERNAME}/${repo.name}`,
          repoLink: repo.html_url,
          technologies: repo.topics || [],
        }));

        setRepos(mappedRepos);
      } catch (error) {
        console.error("Erro ao buscar repositórios:", error);
        setRepos([]);
      } finally {
        setLoading(false);
      }
    }

    fetchRepos();
  }, [USERNAME, TOKEN, BASE_URL, PER_PAGE]);

  return (
    <div className="projeto-container">
      <h3 className="projeto-title">{t("projetos.titulo")}</h3>

      {loading && <div className="spinner">Carregando projetos...</div>}

      {!loading && repos.length === 0 && (
        <p style={{ color: "#00ff9d" }}>Nenhum projeto encontrado.</p>
      )}

      <div>
        {repos.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </div>
  );
};

export default ProjetosGitHub;
