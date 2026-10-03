import { FaJava } from "react-icons/fa";
import {
  SiPython,
  SiC,
  SiSpringboot,
  SiJavascript,
  SiNodedotjs,
  SiReact,
  SiFlutter,
} from "react-icons/si";

// color    → cor do logo (versão da marca legível no fundo escuro;
//            no tema light o CSS escurece automaticamente)
// gradient → [início, fim] do anel de progresso, tirado das cores da marca
export const skillsData = [
  {
    name: "Java",
    level: 90,
    icon: FaJava,
    color: "#F89820",
    gradient: ["#5382A1", "#F89820"],
    link: "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web",
  },
  {
    name: "Python",
    level: 80,
    icon: SiPython,
    color: "#4B8BBE",
    gradient: ["#3776AB", "#FFD43B"],
    link: "https://github.com/joaopauloaramuni/python",
  },
  {
    name: "C",
    level: 80,
    icon: SiC,
    color: "#A8B9CC",
    gradient: ["#00599C", "#A8B9CC"],
    link: "https://github.com/joaopauloaramuni/algoritmos-e-estruturas-de-dados-i",
  },
  {
    name: "Spring Boot",
    level: 80,
    icon: SiSpringboot,
    color: "#6DB33F",
    gradient: ["#3D7A2A", "#6DB33F"],
    link: "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/SpringBoot",
  },
  {
    name: "JavaScript",
    level: 70,
    icon: SiJavascript,
    color: "#F7DF1E",
    gradient: ["#E8A317", "#F7DF1E"],
    link: "https://github.com/joaopauloaramuni/",
  },
  {
    name: "Node.js",
    level: 70,
    icon: SiNodedotjs,
    color: "#5FA04E",
    gradient: ["#3C873A", "#8CC84B"],
    link: "https://github.com/joaopauloaramuni/",
  },
  {
    name: "React",
    level: 60,
    icon: SiReact,
    color: "#61DAFB",
    gradient: ["#087EA4", "#61DAFB"],
    link: "https://github.com/joaopauloaramuni/desenvolvimento-e-integracao-de-aplicacoes-web/tree/main/PROJETOS/React",
  },
  {
    name: "Flutter",
    level: 20,
    icon: SiFlutter,
    color: "#47C5FB",
    gradient: ["#02569B", "#47C5FB"],
    link: "https://github.com/joaopauloaramuni/flutter",
  },
];
