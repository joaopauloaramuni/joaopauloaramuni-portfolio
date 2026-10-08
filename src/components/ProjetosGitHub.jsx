import React, { useEffect, useRef, useState } from "react";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { useTranslation } from "react-i18next";
import ProjectCard from "./ProjectCard";
import "./Projetos.css";
import GITHUB_API_CONFIG from "../config/gitHubApiConfig";
import { fetchGitHub } from "../lib/githubApi";
import { githubPaths } from "../lib/githubPaths";

const ProjetosGitHub = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const { USERNAME } = GITHUB_API_CONFIG;

  const [repos, setRepos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRepos() {
      try {
        // Direto na API, no limite do visitante; se ele acabar, vai pelo
        // proxy /api/github, que tem o token do site (ver lib/githubApi.js).
        // Os topics já vêm na resposta padrão da API.
        // O caminho vem de lib/githubPaths.js: o proxy só aceita os de lá
        const data = await fetchGitHub(githubPaths.recentRepos());
        const filteredRepos = data.filter((repo) => !repo.fork);

        // Imagem de prévia que o GitHub gera para cada repositório. O
        // primeiro trecho do caminho é só uma chave de cache: as alternativas
        // pedem a mesma imagem de novo se a primeira falhar (ver ProjectCard)
        const preview = (repo, chave) =>
          `https://opengraph.githubassets.com/${chave}/${USERNAME}/${repo.name}`;

        const mappedRepos = filteredRepos.map((repo) => ({
          id: repo.id,
          title: repo.name,
          description: repo.description || "",
          gif: preview(repo, 1),
          gifFallbacks: [preview(repo, 2), preview(repo, 3)],
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
  }, [USERNAME]);

  return (
    <div className="projeto-container" ref={ref}>
      <h3 className="projeto-title">{t("projetos.titulo")}</h3>

      {loading && <div className="spinner">{t("projetos.carregando")}</div>}

      {!loading && repos.length === 0 && (
        <p style={{ color: "var(--accent)" }}>{t("projetos.nenhum")}</p>
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
