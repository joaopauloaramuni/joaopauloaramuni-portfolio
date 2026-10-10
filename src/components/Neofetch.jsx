import React, { useRef, useState } from "react";
import useCommandAtTop from "../terminal/useCommandAtTop";
import { useTranslation } from "react-i18next";
import { commandList } from "../commands";
import { useTheme } from "../theme/themeContext";
import { dependencies, devDependencies } from "../../package.json";
import "./Neofetch.css";

// Escudo do Galo em braille (cada linha tem 28 caracteres)
const GALO_LOGO = [
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠛⠛⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⡿⠿⠋⣀⠴⠦⣀⠙⠿⢿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
  "⡏⠉⠛⠛⠛⠛⠛⠉⢁⣠⠖⠋⠄⠄⠄⠄⠙⠲⣄⡈⠉⠛⠛⠛⠛⠛⠉⢹",
  "⠇⢸⠉⠉⠉⠉⣉⣀⠄⠄⠄⠄⠄⣀⠄⠄⠄⠄⢀⣀⠄⠉⣉⠉⠉⠉⡇⢸",
  "⡄⢸⠄⠄⢠⣾⠉⠉⠁⠄⠄⠄⣰⡏⣆⠄⠄⠄⢸⡟⣇⣸⣿⠄⠄⠄⡇⢸",
  "⡇⢸⠄⠄⠄⠛⠤⠖⠂⠄⠄⠠⠟⠛⠻⠆⠄⠄⠸⠇⠻⠟⠿⠄⠄⠄⡇⢸",
  "⣧⠈⡶⠶⠶⠶⢶⡶⠶⠶⠶⣶⠶⠶⠶⠶⣶⠶⠶⠶⢶⡶⠶⠶⠶⢶⠄⣼",
  "⣿⡄⣇⠄⠄⠄⢸⡇⠄⠄⠄⣿⠄⠄⠄⠄⣿⠄⠄⠄⢸⡇⠄⠄⠄⣸⢠⣿",
  "⣿⣿⠘⡆⠄⠄⢸⡇⠄⠄⠄⣿⠄⠄⠄⠄⣿⠄⠄⠄⢸⡇⠄⠄⢰⠃⣿⣿",
  "⣿⣿⣆⠙⣆⠄⢸⡇⠄⠄⠄⣿⠄⠄⠄⠄⣿⠄⠄⠄⢸⡇⠄⣰⠋⣰⣿⣿",
  "⣿⣿⣿⣦⠘⢦⢸⡇⠄⠄⠄⣿⠄⠄⠄⠄⣿⠄⠄⠄⢸⡇⡴⠃⣴⣿⣿⣿",
  "⣿⣿⣿⣿⣷⣀⢾⡇⠄⠄⠄⣿⠄⠄⠄⠄⣿⠄⠄⠄⢸⡷⣀⣾⣿⣿⣿⣿",
  "⣿⣿⣿⣿⣿⣿⣄⠙⢆⠄⠄⣿⠄⠄⠄⠄⣿⠄⠄⡰⠋⣠⣿⣿⣿⣿⣿⣿",
  "⣿⣿⣿⣿⣿⣿⣿⣷⣄⠙⣄⣿⠄⠄⠄⠄⣿⣠⠋⣠⣾⣿⣿⣿⣿⣿⣿⣿",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣌⠙⠢⣄⣠⠔⠋⣡⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿",
  "⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣷⣦⣌⣡⣴⣾⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿⣿",
].join("\n");

const USER = "visitante";
const HOST = "portfolio";
const KERNEL = "6.18.0-puc"; // mesmo kernel da BootSequence

// "^1.4.0" → "1.4.0"
const version = (range = "") => range.replace(/^[^\d]*/, "");

// Tempo desde que a página abriu, no formato "1h 2m 3s"
const formatUptime = (ms) => {
  const total = Math.floor(ms / 1000);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return [h && `${h}h`, (h || m) && `${m}m`, `${s}s`].filter(Boolean).join(" ");
};

// Blocos de cor do rodapé (as cores seguem o tema claro/escuro/galo/matrix)
const COLOR_BLOCKS = [
  "--border",
  "--icon-location",
  "--success",
  "--highlight",
  "--info",
  "--icon-book",
  "--accent",
  "--text",
];

const Neofetch = () => {
  const { t } = useTranslation();
  const ref = useRef(null);
  useCommandAtTop(ref);
  const { theme } = useTheme();

  // Como no neofetch de verdade, a saída é uma "foto" do momento do comando
  const [snapshot] = useState(() => ({
    uptime: formatUptime(performance.now()),
    resolution: `${window.screen.width}x${window.screen.height}`,
    theme,
  }));

  const title = `${USER}@${HOST}`;
  const info = [
    ["OS", "AramuniOS x86_64"],
    ["Host", "PUC Minas · ICEI"],
    ["Kernel", KERNEL],
    ["Uptime", snapshot.uptime],
    [
      "Packages",
      `${Object.keys(commandList).length} (${t("neofetch.comandos")}), ${
        Object.keys(dependencies).length
      } (npm)`,
    ],
    ["Shell", `react-terminal-ui ${version(dependencies["react-terminal-ui"])}`],
    ["DE", `React ${React.version}`],
    ["WM", `Vite ${version(devDependencies.vite)}`],
    ["Resolution", snapshot.resolution],
    ["Theme", t(`neofetch.${{ light: "claro", dark: "escuro", galo: "galo", matrix: "matrix" }[snapshot.theme]}`)],
    ["CPU", t("neofetch.cpu")],
    [t("neofetch.time_label"), "Clube Atlético Mineiro"],
  ];

  return (
    <div className="neofetch" ref={ref}>
      <pre className="neofetch-logo" aria-label={t("neofetch.logo_alt")} role="img">
        {GALO_LOGO}
      </pre>

      <div className="neofetch-info">
        <p className="neofetch-title">
          <span className="neofetch-accent">{USER}</span>@
          <span className="neofetch-accent">{HOST}</span>
        </p>
        <p className="neofetch-separator" aria-hidden="true">
          {"-".repeat(title.length)}
        </p>

        {info.map(([label, value]) => (
          <p key={label} className="neofetch-row">
            <span className="neofetch-accent">{label}</span>: {value}
          </p>
        ))}

        <div className="neofetch-colors" aria-hidden="true">
          {[false, true].map((bright) => (
            <div key={String(bright)} className="neofetch-colors-row">
              {COLOR_BLOCKS.map((token) => (
                <span
                  key={token}
                  className={`neofetch-block${bright ? "" : " neofetch-block--dark"}`}
                  style={{ "--block": `var(${token})` }}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Neofetch;
