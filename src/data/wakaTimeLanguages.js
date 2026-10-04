import {
  FaJava,
  FaProjectDiagram,
  FaFileCsv,
  FaDatabase,
  FaWindows,
  FaTerminal,
  FaMicrochip,
} from "react-icons/fa";
import {
  FiFileText,
  FiMoreHorizontal,
  FiSettings,
  FiCode,
  FiTool,
} from "react-icons/fi";
import { TbBrandCSharp, TbBrandPowershell } from "react-icons/tb";
import {
  SiPython,
  SiJavascript,
  SiTypescript,
  SiC,
  SiCplusplus,
  SiHtml5,
  SiCss3,
  SiSass,
  SiMarkdown,
  SiJson,
  SiXml,
  SiYaml,
  SiDocker,
  SiGnubash,
  SiRuby,
  SiPhp,
  SiGit,
  SiMermaid,
  SiApachegroovy,
  SiSvg,
  SiJupyter,
  SiLatex,
  SiDelphi,
  SiAdobe,
  SiKotlin,
  SiDart,
  SiGo,
  SiSwift,
  SiVuedotjs,
  SiR,
  SiScala,
  SiDotnet,
  SiCmake,
} from "react-icons/si";

// Ícone e cores de cada linguagem, pelo nome que o WakaTime devolve.
// O comando "stats" usa o mesmo mapa com os nomes do GitHub (linguist), que
// em geral são iguais (Java, Python, HTML...); os que mudam têm entrada própria
// (ex.: "Dockerfile" no GitHub, "Docker" no WakaTime).
// Mesmo formato do skillsData.js:
//   color    → cor do logo (versão da marca legível no fundo escuro;
//              no tema light o CSS escurece automaticamente)
//   gradient → [início, fim] do anel e da barra
// Linguagens sem cor de marca usam os tokens de texto, que seguem o tema.

const brand = (icon, color, gradient) => ({ icon, color, gradient });
const neutral = (icon, tone = "--text-muted") => ({
  icon,
  color: `var(${tone})`,
  gradient: ["var(--text-dim)", `var(${tone})`],
});

const LANGUAGES = {
  Python: brand(SiPython, "#4B8BBE", ["#3776AB", "#FFD43B"]),
  JavaScript: brand(SiJavascript, "#F7DF1E", ["#E8A317", "#F7DF1E"]),
  TypeScript: brand(SiTypescript, "#4F8FDB", ["#235A97", "#4F8FDB"]),
  Java: brand(FaJava, "#F89820", ["#5382A1", "#F89820"]),
  C: brand(SiC, "#A8B9CC", ["#00599C", "#A8B9CC"]),
  HTML: brand(SiHtml5, "#F06529", ["#E34F26", "#F06529"]),
  CSS: brand(SiCss3, "#33A9DC", ["#1572B6", "#33A9DC"]),
  YAML: brand(SiYaml, "#E5534B", ["#CB171E", "#E5534B"]),
  Docker: brand(SiDocker, "#2496ED", ["#1D63ED", "#2496ED"]),
  Bash: brand(SiGnubash, "#4EAA25", ["#2E7D18", "#4EAA25"]),
  Ruby: brand(SiRuby, "#E0524A", ["#A91401", "#E0524A"]),
  PHP: brand(SiPhp, "#8F93D0", ["#4F5B93", "#8F93D0"]),
  "Git Config": brand(SiGit, "#F05032", ["#C93A1D", "#F05032"]),
  "GitIgnore file": brand(SiGit, "#F05032", ["#C93A1D", "#F05032"]),
  Mermaid: brand(SiMermaid, "#FF3670", ["#C21E52", "#FF3670"]),
  Groovy: brand(SiApachegroovy, "#4298B8", ["#2B6E87", "#4298B8"]),
  CSV: brand(FaFileCsv, "#3FAE6A", ["#217346", "#3FAE6A"]),
  "Image (svg)": brand(SiSvg, "#FFB13B", ["#E08A00", "#FFB13B"]),
  "C++": brand(SiCplusplus, "#659AD2", ["#00599C", "#659AD2"]),
  "C#": brand(TbBrandCSharp, "#B07CC6", ["#68217A", "#B07CC6"]),
  "Visual Basic .NET": brand(SiDotnet, "#8C6CF0", ["#512BD4", "#8C6CF0"]),
  VBScript: brand(FaWindows, "#3FA9F5", ["#0078D4", "#3FA9F5"]),
  PowerShell: brand(TbBrandPowershell, "#5391FE", ["#2B5BBF", "#5391FE"]),
  Shell: brand(SiGnubash, "#4EAA25", ["#2E7D18", "#4EAA25"]),
  Dockerfile: brand(SiDocker, "#2496ED", ["#1D63ED", "#2496ED"]),
  "Jupyter Notebook": brand(SiJupyter, "#F37626", ["#C25A10", "#F37626"]),
  TeX: brand(SiLatex, "#47B5B5", ["#008080", "#47B5B5"]),
  "BibTeX Style": brand(SiLatex, "#47B5B5", ["#008080", "#47B5B5"]),
  Pascal: brand(SiDelphi, "#EE5A63", ["#B71C25", "#EE5A63"]),
  ActionScript: brand(SiAdobe, "#F0524F", ["#B3141B", "#F0524F"]),
  SCSS: brand(SiSass, "#D77EAD", ["#A53B70", "#D77EAD"]),
  Sass: brand(SiSass, "#D77EAD", ["#A53B70", "#D77EAD"]),
  Kotlin: brand(SiKotlin, "#A97BFF", ["#7F52FF", "#A97BFF"]),
  Dart: brand(SiDart, "#40C4FF", ["#0175C2", "#40C4FF"]),
  Go: brand(SiGo, "#00ADD8", ["#00758F", "#00ADD8"]),
  Swift: brand(SiSwift, "#F05138", ["#C23A22", "#F05138"]),
  Vue: brand(SiVuedotjs, "#4FC08D", ["#35495E", "#4FC08D"]),
  "Vue.js": brand(SiVuedotjs, "#4FC08D", ["#35495E", "#4FC08D"]),
  R: brand(SiR, "#5A95DC", ["#276DC3", "#5A95DC"]),
  Scala: brand(SiScala, "#E8605D", ["#A8201D", "#E8605D"]),

  Markdown: neutral(SiMarkdown, "--text-soft"),
  JSON: neutral(SiJson),
  XML: neutral(SiXml),
  SQL: neutral(FaDatabase),
  PlantUML: neutral(FaProjectDiagram),
  Properties: neutral(FiSettings),
  "Java Properties": neutral(FiSettings),
  Makefile: neutral(FiTool),
  CMake: neutral(SiCmake),
  Batchfile: neutral(FaTerminal),
  Assembly: neutral(FaMicrochip),
  Text: neutral(FiFileText),
  Other: neutral(FiMoreHorizontal, "--text-dim"),
};

const FALLBACK = neutral(FiCode);

export const languageStyle = (name) => LANGUAGES[name] ?? FALLBACK;

// Linha "+ N linguagens" que soma o que ficou fora do limite
export const OTHERS_STYLE = neutral(FiMoreHorizontal, "--text-dim");

// Nomes genéricos do WakaTime que ganham tradução (chaves em wakatime.nomes)
export const TRANSLATED_NAMES = {
  Text: "texto",
  Other: "outro",
  Coding: "coding",
  Building: "building",
  Debugging: "debugging",
  "AI Coding": "aiCoding",
  "Writing Docs": "writingDocs",
  "Writing Tests": "writingTests",
  "Running Tests": "runningTests",
  "Manual Testing": "manualTesting",
  "Code Reviewing": "codeReviewing",
  Browsing: "browsing",
  Researching: "researching",
  Learning: "learning",
  Designing: "designing",
  Meeting: "meeting",
  Planning: "planning",
  Communicating: "communicating",
};
