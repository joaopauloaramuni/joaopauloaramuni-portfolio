import React from "react";
import { useTranslation } from "react-i18next";
import { IoMoonOutline, IoSunnyOutline } from "react-icons/io5";
import { GiPill, GiRooster } from "react-icons/gi";
import { useTheme } from "../theme/themeContext";

// Um botão por tema: sol (claro), lua (escuro), galo e a pílula vermelha (matrix). O tema ativo fica
// destacado; clicar nele de novo não muda nada.
const OPTIONS = [
  { id: "light", Icon: IoSunnyOutline, label: "tema.ativar_claro" },
  { id: "dark", Icon: IoMoonOutline, label: "tema.ativar_escuro" },
  { id: "galo", Icon: GiRooster, label: "tema.ativar_galo" },
  { id: "matrix", Icon: GiPill, label: "tema.ativar_matrix" },
];

const ThemeToggle = ({ onToggle }) => {
  const { t } = useTranslation();
  const { theme, setTheme } = useTheme();

  const choose = (id) => {
    setTheme(id);
    if (onToggle) onToggle();
  };

  return (
    <div className="themeToggleGroup" role="group" aria-label={t("tema.grupo")}>
      {OPTIONS.map(({ id, Icon: icon, label }) => (
        <button
          key={id}
          type="button"
          className={`themeToggle themeToggle-${id}${theme === id ? " themeToggle-active" : ""}`}
          // Clique com mouse/toque não rouba o foco: senão o próximo Espaço/Enter
          // (ex.: para pular o boot) apertaria o botão de novo
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => choose(id)}
          aria-pressed={theme === id}
          aria-label={t(label)}
          title={t(label)}
        >
          {React.createElement(icon)}
        </button>
      ))}
    </div>
  );
};

export default ThemeToggle;
