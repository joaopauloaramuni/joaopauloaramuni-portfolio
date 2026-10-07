import { TbBrandCSharp } from "react-icons/tb";
import { VscVscode } from "react-icons/vsc";
import {
  SiGnubash,
  SiCplusplus,
  SiDotnet,
  SiHtml5,
  SiCss3,
  SiNextdotjs,
  SiJest,
  SiMysql,
  SiPostgresql,
  SiMongodb,
  SiRedis,
  SiFastapi,
  SiDocker,
  SiAmazonwebservices,
  SiJenkins,
  SiPrometheus,
  SiGrafana,
  SiNewrelic,
  SiGit,
  SiGitlab,
  SiPostman,
  SiIntellijidea,
  SiClaude,
} from "react-icons/si";
import { skillsData } from "./skillsData";

// Lista do "skills --globo". Começa pelas skills de skillsData.js (mesmos
// ícones, cores e links para os repositórios) e acrescenta as linguagens e
// ferramentas do README do GitHub que só aparecem no globo, sem nível.
//
// color → cor do logo legível no fundo escuro (no tema light o CSS escurece)
// link  → site oficial da tecnologia (o mesmo do README)
//
// Para incluir outra: importe o ícone de react-icons (https://react-icons.github.io)
// e adicione { name, icon, color, link }. O globo se redistribui sozinho.

const extras = [
  // Linguagens
  { name: "C++", icon: SiCplusplus, color: "#659AD2", link: "https://isocpp.org/" },
  { name: "C#", icon: TbBrandCSharp, color: "#A179DC", link: "https://learn.microsoft.com/pt-br/dotnet/csharp/" },
  { name: "Bash", icon: SiGnubash, color: "#4EAA25", link: "https://www.gnu.org/software/bash/" },
  { name: "HTML5", icon: SiHtml5, color: "#E34F26", link: "https://developer.mozilla.org/pt-BR/docs/Web/HTML" },
  { name: "CSS3", icon: SiCss3, color: "#3C99DC", link: "https://developer.mozilla.org/pt-BR/docs/Web/CSS" },

  // Frameworks
  { name: ".NET", icon: SiDotnet, color: "#8C6CF0", link: "https://dotnet.microsoft.com/" },
  { name: "Next.js", icon: SiNextdotjs, color: "#FFFFFF", link: "https://nextjs.org/" },
  { name: "FastAPI", icon: SiFastapi, color: "#05B3A3", link: "https://fastapi.tiangolo.com/" },
  { name: "Jest", icon: SiJest, color: "#E05A5A", link: "https://jestjs.io/pt-BR/" },

  // Bancos de dados
  { name: "PostgreSQL", icon: SiPostgresql, color: "#6B8FE8", link: "https://www.postgresql.org/" },
  { name: "MySQL", icon: SiMysql, color: "#5D9CCB", link: "https://www.mysql.com/" },
  { name: "MongoDB", icon: SiMongodb, color: "#47A248", link: "https://www.mongodb.com/" },
  { name: "Redis", icon: SiRedis, color: "#FF4438", link: "https://redis.io/" },

  // Infra, CI/CD e observabilidade
  { name: "Docker", icon: SiDocker, color: "#2496ED", link: "https://www.docker.com/" },
  { name: "AWS", icon: SiAmazonwebservices, color: "#FF9900", link: "https://aws.amazon.com/pt/" },
  { name: "Jenkins", icon: SiJenkins, color: "#D24939", link: "https://www.jenkins.io/" },
  { name: "Prometheus", icon: SiPrometheus, color: "#E6522C", link: "https://prometheus.io/" },
  { name: "Grafana", icon: SiGrafana, color: "#F46800", link: "https://grafana.com/" },
  { name: "New Relic", icon: SiNewrelic, color: "#1CE783", link: "https://newrelic.com/pt" },

  // Ferramentas
  { name: "Git", icon: SiGit, color: "#F05032", link: "https://git-scm.com/" },
  { name: "GitLab", icon: SiGitlab, color: "#FC6D26", link: "https://about.gitlab.com/" },
  { name: "Postman", icon: SiPostman, color: "#FF6C37", link: "https://www.postman.com/" },
  { name: "VS Code", icon: VscVscode, color: "#23A9F2", link: "https://code.visualstudio.com/" },
  { name: "IntelliJ", icon: SiIntellijidea, color: "#FE315D", link: "https://www.jetbrains.com/idea/" },
  { name: "Claude", icon: SiClaude, color: "#D97757", link: "https://claude.ai/" },
];

export const globeSkills = [
  ...skillsData.map(({ name, icon, color, link }) => ({ name, icon, color, link })),
  ...extras,
];
